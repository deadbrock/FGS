import pkg from 'pg';
const { Pool } = pkg;
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function setupProductionDatabase() {
  console.log('🚀 Configurando Banco de Dados de Produção...\n');
  console.log('==================================================\n');

  // Verificar DATABASE_URL
  if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL não encontrada!');
    console.error('📝 Crie um arquivo .env com a DATABASE_URL do Railway\n');
    process.exit(1);
  }

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    // Testar conexão
    console.log('📡 Testando conexão com o banco...');
    await pool.query('SELECT NOW()');
    console.log('✅ Conectado com sucesso!\n');

    // Ler arquivo SQL
    console.log('📄 Lendo schema-complete.sql...');
    const schemaPath = path.join(__dirname, 'schema-complete.sql');
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');
    console.log('✅ Arquivo lido com sucesso!\n');

    // Executar schema
    console.log('⚙️  Executando schema completo...');
    console.log('   (Isso pode levar alguns segundos...)\n');
    
    await pool.query(schemaSql);

    console.log('\n✅ SCHEMA CRIADO COM SUCESSO!\n');
    console.log('==================================================');
    console.log('📊 Resumo:');
    console.log('   • 23 tabelas criadas');
    console.log('   • 80+ índices criados');
    console.log('   • 16 triggers criados');
    console.log('   • Relações (foreign keys) configuradas');
    console.log('   • Constraints e validações ativas\n');

    // Verificar tabelas criadas
    console.log('🔍 Verificando tabelas criadas...\n');
    const result = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
      ORDER BY table_name
    `);

    console.log('📋 Tabelas no banco:');
    result.rows.forEach((row, index) => {
      console.log(`   ${index + 1}. ${row.table_name}`);
    });

    console.log('\n✅ Banco de dados pronto para uso!');
    console.log('🎯 Próximo passo: Executar seed de dados iniciais\n');

  } catch (error) {
    console.error('\n❌ ERRO ao criar schema:', error.message);
    console.error('\nDetalhes do erro:');
    console.error(error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

setupProductionDatabase();

