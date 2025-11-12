import pkg from 'pg';
const { Pool } = pkg;
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';

// Carregar variáveis de ambiente
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

async function runMigration() {
  try {
    console.log('🔧 Iniciando migração UUID...\n');

    // Ler arquivo SQL
    const sqlPath = join(__dirname, 'fix-users-uuid.sql');
    const sql = readFileSync(sqlPath, 'utf8');

    console.log('📝 Executando SQL...\n');
    
    // Executar SQL
    const result = await pool.query(sql);
    
    console.log('✅ Migração concluída com sucesso!\n');
    console.log('📊 Usuários na tabela:');
    
    // Listar usuários
    const users = await pool.query('SELECT id, nome, email, role FROM users');
    console.table(users.rows);
    
    await pool.end();
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro na migração:', error);
    await pool.end();
    process.exit(1);
  }
}

runMigration();

