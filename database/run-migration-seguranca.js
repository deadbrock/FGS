import { readFileSync } from 'fs';
import pkg from 'pg';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const { Pool } = pkg;

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
    console.log('\n🔄 Iniciando migration: Adicionar SEGURANCA_TRABALHO...\n');

    // Ler arquivo SQL
    const sqlPath = join(__dirname, 'migration-add-seguranca-trabalho-role.sql');
    const sql = readFileSync(sqlPath, 'utf-8');

    // Executar migration
    await client.query(sql);

    console.log('✅ Migration executada com sucesso!\n');
    console.log('📝 Role SEGURANCA_TRABALHO adicionada ao CHECK constraint.\n');
    console.log('🎯 Agora você pode criar usuários com perfil "Segurança do Trabalho"!\n');

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

