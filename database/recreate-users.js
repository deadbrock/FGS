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

async function recreateUsers() {
  try {
    console.log('⚠️  ATENÇÃO: Isso vai DELETAR todos os usuários!\n');
    console.log('🔧 Recriando tabela users...\n');

    // Ler arquivo SQL
    const sqlPath = join(__dirname, 'recreate-users.sql');
    const sql = readFileSync(sqlPath, 'utf8');

    console.log('📝 Executando SQL...\n');
    
    // Executar SQL
    await pool.query(sql);
    
    console.log('✅ Tabela users recriada com sucesso!\n');
    console.log('ℹ️  Reinicie o backend para criar o usuário admin automaticamente.\n');
    console.log('📧 Login: admin@fgs.com');
    console.log('🔑 Senha: admin123\n');
    
    await pool.end();
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro ao recriar tabela:', error);
    await pool.end();
    process.exit(1);
  }
}

recreateUsers();

