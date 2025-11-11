#!/usr/bin/env node

/**
 * Script para executar schema SQL no PostgreSQL Railway
 * Sem precisar instalar psql!
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

async function setupDatabase() {
  log('\n🚀 Configurando Banco de Dados Railway...', 'cyan');
  log('=' .repeat(50), 'blue');

  // Verificar se DATABASE_URL está definida
  let DATABASE_URL = process.env.DATABASE_URL;
  
  if (!DATABASE_URL) {
    log('\n❌ Erro: DATABASE_URL não encontrada!', 'red');
    log('\nConfigurações necessárias:', 'yellow');
    log('1. Obtenha a DATABASE_URL no Railway:', 'yellow');
    log('   Railway → PostgreSQL → Variables → DATABASE_URL', 'yellow');
    log('\n2. Execute o script assim:', 'yellow');
    log('   DATABASE_URL="sua-url-aqui" node database/setup-database.js', 'yellow');
    log('\nOu crie um arquivo .env com:', 'yellow');
    log('   DATABASE_URL=postgresql://postgres:senha@host:5432/railway', 'yellow');
    process.exit(1);
  }

  // Limpar espaços extras da URL
  DATABASE_URL = DATABASE_URL.trim();
  
  log('\n📡 Conectando ao PostgreSQL...', 'blue');
  log(`Host: ${DATABASE_URL.split('@')[1]?.split('/')[0] || 'Railway'}`, 'cyan');
  log(`Database: ${DATABASE_URL.split('/').pop()}`, 'cyan');

  const client = new Client({
    connectionString: DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    // Conectar
    await client.connect();
    log('✅ Conectado com sucesso!', 'green');

    // Ler arquivo SQL
    const schemaPath = path.join(__dirname, 'schema.sql');
    
    if (!fs.existsSync(schemaPath)) {
      throw new Error('Arquivo schema.sql não encontrado em ' + schemaPath);
    }

    log('\n📄 Lendo arquivo schema.sql...', 'blue');
    const sql = fs.readFileSync(schemaPath, 'utf8');
    
    log('📝 Executando SQL...', 'blue');
    
    // Executar SQL
    await client.query(sql);
    
    log('\n✅ Schema criado com sucesso!', 'green');
    log('=' .repeat(50), 'blue');

    // Verificar tabelas criadas
    log('\n📊 Verificando tabelas criadas:', 'cyan');
    const result = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `);

    result.rows.forEach((row, index) => {
      log(`   ${index + 1}. ${row.table_name}`, 'green');
    });

    // Contar registros
    log('\n📈 Contando registros iniciais:', 'cyan');
    
    const counts = await client.query(`
      SELECT 'users' as tabela, COUNT(*)::int as total FROM users
      UNION ALL
      SELECT 'beneficios', COUNT(*)::int FROM beneficios
      UNION ALL
      SELECT 'colaboradores', COUNT(*)::int FROM colaboradores
    `);

    counts.rows.forEach(row => {
      log(`   ${row.tabela}: ${row.total} registro(s)`, 'green');
    });

    log('\n' + '='.repeat(50), 'blue');
    log('🎉 Configuração concluída com sucesso!', 'green');
    log('\n📋 Próximos passos:', 'yellow');
    log('1. Configure o backend para usar o PostgreSQL', 'yellow');
    log('2. Atualize os controllers para salvar no banco', 'yellow');
    log('3. Teste o sistema!', 'yellow');
    log('\n👤 Usuários de teste criados:', 'cyan');
    log('   - admin@fgs.com (senha: admin123)', 'green');
    log('   - rh@fgs.com (senha: admin123)', 'green');
    log('   - gestor@fgs.com (senha: admin123)', 'green');

  } catch (error) {
    log('\n❌ Erro ao configurar banco de dados:', 'red');
    log(error.message, 'red');
    
    if (error.code === 'ECONNREFUSED') {
      log('\n💡 Dica: Verifique se a DATABASE_URL está correta', 'yellow');
    } else if (error.code === '42P07') {
      log('\n💡 Tabela já existe. Tudo OK!', 'yellow');
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
  return setupDatabase();
}).catch(error => {
  console.error('Erro fatal:', error);
  process.exit(1);
});

