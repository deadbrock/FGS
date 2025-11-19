import { Pool } from 'pg';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Conexão com banco
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL?.includes('railway') ? {
    rejectUnauthorized: false
  } : undefined
});

async function runMigration() {
  const client = await pool.connect();

  try {
    console.log('\n🔄 Iniciando migration: Adicionar campos do Prontuário...\n');
    console.log('📋 Campos a adicionar:');
    console.log('   • whatsapp (colaboradores)');
    console.log('   • escolaridade (colaboradores)');
    console.log('   • Tabela historico_reajustes_salario');
    console.log('   • Tabela documentos_versoes\n');

    // Ler arquivo SQL
    const sqlPath = join(__dirname, 'migrations', 'add-campos-prontuario.sql');
    const sql = readFileSync(sqlPath, 'utf-8');

    // Executar migration
    console.log('🔨 Executando migration...\n');
    await client.query(sql);

    console.log('✅ Migration executada com sucesso!\n');

    // Verificar resultados
    console.log('📊 Verificando resultados...\n');

    // Verificar colunas adicionadas
    const columnsCheck = await client.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'colaboradores' 
      AND column_name IN ('whatsapp', 'escolaridade')
    `);

    if (columnsCheck.rows.length > 0) {
      console.log('✅ Colunas adicionadas em colaboradores:');
      columnsCheck.rows.forEach(col => {
        console.log(`   • ${col.column_name} (${col.data_type})`);
      });
    } else {
      console.log('⚠️  Colunas não encontradas (podem já existir)');
    }

    // Verificar tabelas criadas
    const tablesCheck = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_name IN ('historico_reajustes_salario', 'documentos_versoes')
    `);

    if (tablesCheck.rows.length > 0) {
      console.log('\n✅ Tabelas criadas:');
      tablesCheck.rows.forEach(tbl => {
        console.log(`   • ${tbl.table_name}`);
      });
    } else {
      console.log('\n⚠️  Tabelas não encontradas (podem já existir)');
    }

    console.log('\n🎯 Migration concluída! Campos e tabelas prontos para uso.\n');

  } catch (error) {
    console.error('\n❌ Erro ao executar migration:', error.message);
    if (error.detail) console.error('Detalhes:', error.detail);
    if (error.hint) console.error('Dica:', error.hint);
    if (error.code === '42701') {
      console.error('\n💡 A coluna/tabela já existe. Isso é normal se a migration já foi executada antes.');
    }
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

runMigration();

