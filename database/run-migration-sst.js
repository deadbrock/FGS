import pkg from 'pg';
import dotenv from 'dotenv';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const { Pool } = pkg;

// Carregar variáveis de ambiente
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuração do PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? {
    rejectUnauthorized: false
  } : false
});

async function runMigration() {
  try {
    console.log('🔄 Iniciando migration para tabelas SST...');

    // Ler o arquivo SQL
    const sqlPath = path.join(__dirname, 'migrations', 'create-sst-tables.sql');
    const sql = readFileSync(sqlPath, 'utf8');

    // Executar a migration
    await pool.query(sql);

    console.log('✅ Migration executada com sucesso!');
    console.log('✅ Tabelas criadas:');
    console.log('   - sst_clinicas');
    console.log('   - sst_solicitacoes_exames');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro ao executar migration:', error);
    process.exit(1);
  }
}

runMigration();

