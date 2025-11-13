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

async function cleanup() {
  const client = await pool.connect();

  try {
    console.log('\n🧹 Iniciando limpeza de treinamentos mock...\n');

    // Ler arquivo SQL
    const sqlPath = join(__dirname, 'cleanup-mock-treinamentos.sql');
    const sql = readFileSync(sqlPath, 'utf-8');

    // Executar limpeza
    await client.query(sql);

    console.log('✅ Limpeza executada com sucesso!\n');
    console.log('📝 Treinamentos mock removidos do banco.\n');
    console.log('🎯 Sistema pronto para cadastros reais dos usuários!\n');

  } catch (error) {
    console.error('\n❌ Erro ao executar limpeza:', error.message);
    if (error.detail) console.error('Detalhes:', error.detail);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

cleanup();

