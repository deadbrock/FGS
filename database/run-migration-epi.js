import pg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const { Pool } = pg;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Carregar variáveis de ambiente
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

async function runMigration() {
  const client = await pool.connect();
  
  try {
    console.log('🚀 Iniciando migration do módulo de EPIs...\n');

    // Ler arquivo SQL
    const migrationPath = path.join(__dirname, 'migrations', 'create-epi-tables.sql');
    const sql = fs.readFileSync(migrationPath, 'utf8');

    // Executar migration
    await client.query(sql);

    console.log('✅ Tabelas criadas com sucesso:');
    console.log('   - epis');
    console.log('   - entregas_epi');
    console.log('   - fichas');
    console.log('   - movimentacoes_estoque_epi');
    console.log('\n✅ Índices criados');
    console.log('✅ Triggers criados');
    console.log('✅ Dados de exemplo inseridos');
    console.log('\n🎉 Migration concluída com sucesso!');
  } catch (error) {
    console.error('❌ Erro ao executar migration:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

runMigration();

