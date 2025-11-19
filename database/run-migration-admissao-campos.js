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
    console.log('\n🔄 Iniciando migration: Ajustes no processo de Admissão...\n');

    console.log('📋 Alterações:');
    console.log('   • Adicionar campos em admissoes (contrato_assinado_fisicamente, data_assinatura_fisica)');
    console.log('   • Criar tabela exames_admissionais');
    console.log('   • Criar tabela clinicas\n');

    const sqlPath = join(__dirname, 'migrations', 'add-campos-admissao.sql');
    const sql = readFileSync(sqlPath, 'utf-8');

    console.log('🔨 Executando migration...\n');
    await client.query(sql);

    console.log('✅ Migration executada com sucesso!\n');

    console.log('📊 Verificando resultados...\n');

    // Verificar colunas em admissoes
    const checkColunas = await client.query(`
      SELECT column_name, data_type FROM information_schema.columns
      WHERE table_name = 'admissoes' AND column_name IN ('contrato_assinado_fisicamente', 'data_assinatura_fisica')
    `);
    console.log('✅ Colunas adicionadas em admissoes:');
    checkColunas.rows.forEach(row => console.log(`   • ${row.column_name} (${row.data_type})`));

    // Verificar tabelas criadas
    const checkTables = await client.query(`
      SELECT tablename FROM pg_tables 
      WHERE schemaname = 'public' 
      AND tablename IN ('exames_admissionais', 'clinicas')
      ORDER BY tablename
    `);
    console.log('\n✅ Tabelas criadas:');
    checkTables.rows.forEach(row => console.log(`   • ${row.tablename}`));

    // Verificar clínicas inseridas
    const checkClinicas = await client.query('SELECT COUNT(*) as total FROM clinicas');
    console.log(`\n✅ Clínicas cadastradas: ${checkClinicas.rows[0].total}`);

    console.log('\n🎯 Migration concluída! Ajustes aplicados com sucesso.\n');

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

