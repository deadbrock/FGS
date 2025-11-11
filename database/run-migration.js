#!/usr/bin/env node

/**
 * Script para executar migração: Adicionar coluna local_trabalho
 */

import pkg from 'pg';
const { Client } = pkg;
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Cores para output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function runMigration() {
  log('\n🔄 Executando Migração: Adicionar local_trabalho...', 'cyan');
  log('=' .repeat(60), 'blue');

  // Verificar se DATABASE_URL está definida
  const DATABASE_URL = process.env.DATABASE_URL;
  
  if (!DATABASE_URL) {
    log('\n❌ Erro: DATABASE_URL não encontrada!', 'red');
    log('\nExecute assim:', 'yellow');
    log('DATABASE_URL="sua-url" node database/run-migration.js', 'yellow');
    log('\nOu use o script batch:', 'yellow');
    log('database\\run-migration.bat', 'yellow');
    process.exit(1);
  }

  // Limpar espaços extras da URL
  const cleanUrl = DATABASE_URL.trim();
  
  log('\n📡 Conectando ao PostgreSQL...', 'blue');
  log(`Host: ${cleanUrl.split('@')[1]?.split('/')[0] || 'Railway'}`, 'cyan');

  const client = new Client({
    connectionString: cleanUrl,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    // Conectar
    await client.connect();
    log('✅ Conectado com sucesso!', 'green');

    // Ler arquivo de migração
    const migrationPath = path.join(__dirname, 'migration-add-local-trabalho.sql');
    
    if (!fs.existsSync(migrationPath)) {
      throw new Error('Arquivo migration-add-local-trabalho.sql não encontrado');
    }

    log('\n📄 Lendo arquivo de migração...', 'blue');
    const sql = fs.readFileSync(migrationPath, 'utf8');
    
    log('🔨 Executando migração...', 'blue');
    log('   - Adicionando coluna local_trabalho', 'cyan');
    log('   - Criando constraint de validação', 'cyan');
    log('   - Criando índice', 'cyan');
    
    // Executar SQL
    await client.query(sql);
    
    log('\n✅ Migração executada com sucesso!', 'green');
    log('=' .repeat(60), 'blue');

    // Verificar resultado
    log('\n📊 Verificando resultado:', 'cyan');
    
    // Verificar se a coluna existe
    const checkColumn = await client.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'colaboradores' 
      AND column_name = 'local_trabalho'
    `);

    if (checkColumn.rows.length > 0) {
      log('   ✅ Coluna local_trabalho criada', 'green');
      log(`   Tipo: ${checkColumn.rows[0].data_type}`, 'cyan');
      log(`   Nullable: ${checkColumn.rows[0].is_nullable}`, 'cyan');
    } else {
      log('   ❌ Coluna não foi criada', 'red');
    }

    // Verificar índice
    const checkIndex = await client.query(`
      SELECT indexname
      FROM pg_indexes
      WHERE tablename = 'colaboradores'
      AND indexname = 'idx_colaboradores_local_trabalho'
    `);

    if (checkIndex.rows.length > 0) {
      log('   ✅ Índice criado', 'green');
    }

    // Estatísticas
    log('\n📈 Estatísticas:', 'cyan');
    const stats = await client.query(`
      SELECT 
        COUNT(*) as total,
        COUNT(local_trabalho) as com_local,
        COUNT(*) - COUNT(local_trabalho) as sem_local
      FROM colaboradores
    `);

    if (stats.rows[0]) {
      log(`   Total de colaboradores: ${stats.rows[0].total}`, 'cyan');
      log(`   Com local definido: ${stats.rows[0].com_local}`, 'green');
      log(`   Sem local definido: ${stats.rows[0].sem_local}`, 'yellow');
    }

    // Distribuição por estado
    const distribution = await client.query(`
      SELECT 
        COALESCE(local_trabalho, 'NÃO DEFINIDO') as estado,
        COUNT(*) as total
      FROM colaboradores
      GROUP BY local_trabalho
      ORDER BY total DESC
      LIMIT 10
    `);

    if (distribution.rows.length > 0) {
      log('\n📍 Top 10 Estados:', 'cyan');
      distribution.rows.forEach((row, idx) => {
        log(`   ${idx + 1}. ${row.estado}: ${row.total} colaborador(es)`, 'cyan');
      });
    }

    log('\n' + '='.repeat(60), 'blue');
    log('🎉 Migração concluída com sucesso!', 'green');
    log('\n📋 Próximos passos:', 'yellow');
    log('1. Atualizar o backend para usar o campo local_trabalho', 'yellow');
    log('2. Cadastrar/editar colaboradores definindo o estado', 'yellow');
    log('3. Ver os colaboradores no módulo Regionais', 'yellow');

  } catch (error) {
    log('\n❌ Erro ao executar migração:', 'red');
    log(error.message, 'red');
    
    if (error.code === 'ECONNREFUSED') {
      log('\n💡 Dica: Verifique se a DATABASE_URL está correta', 'yellow');
    } else if (error.code === '42P07') {
      log('\n💡 Coluna já existe! Migração já foi executada.', 'yellow');
    } else if (error.message.includes('already exists')) {
      log('\n💡 Elementos já existem. Migração já foi executada anteriormente.', 'yellow');
    }
    
    process.exit(1);
  } finally {
    await client.end();
    log('\n🔌 Desconectado do PostgreSQL', 'blue');
  }
}

// Verificar se tem dotenv e carregar .env
async function loadEnv() {
  try {
    const dotenv = await import('dotenv');
    dotenv.config();
  } catch (e) {
    // dotenv não instalado, tudo bem
  }
}

// Executar
loadEnv().then(() => {
  return runMigration();
}).catch(error => {
  console.error('Erro fatal:', error);
  process.exit(1);
});

