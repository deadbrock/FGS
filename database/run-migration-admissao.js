import { readFileSync } from 'fs';
import pkg from 'pg';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const { Pool } = pkg;

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL?.includes('railway') ? {
    rejectUnauthorized: false
  } : undefined
});

async function runMigration() {
  const client = await pool.connect();

  try {
    console.log('\n🔄 Iniciando migration: Sistema de Admissão de Colaboradores...\n');

    console.log('📋 Tabelas a criar:');
    console.log('   • admissoes');
    console.log('   • admissao_documentos');
    console.log('   • admissao_workflow');
    console.log('   • admissao_notificacoes');
    console.log('   • admissao_documentos_template\n');

    const sqlPath = join(__dirname, 'migrations', 'create-admissao-tables.sql');
    const sql = readFileSync(sqlPath, 'utf-8');

    console.log('🔨 Executando migration...\n');
    await client.query(sql);

    console.log('✅ Migration executada com sucesso!\n');

    console.log('📊 Verificando resultados...\n');

    // Verificar tabelas criadas
    const checkTables = await client.query(`
      SELECT tablename FROM pg_tables 
      WHERE schemaname = 'public' 
      AND tablename IN ('admissoes', 'admissao_documentos', 'admissao_workflow', 'admissao_notificacoes', 'admissao_documentos_template')
      ORDER BY tablename
    `);
    console.log('✅ Tabelas criadas:');
    checkTables.rows.forEach(row => console.log(`   • ${row.tablename}`));

    // Verificar documentos template
    const checkTemplates = await client.query('SELECT COUNT(*) as total FROM admissao_documentos_template');
    console.log(`\n✅ Documentos template criados: ${checkTemplates.rows[0].total}`);

    console.log('\n🎯 Migration concluída! Sistema de Admissão pronto para uso.\n');

  } catch (error) {
    console.error('\n❌ Erro ao executar migration:', error.message);
    if (error.detail) console.error('Detalhes:', error.detail);
    if (error.hint) console.error('Dica:', error.hint);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

runMigration();

