import { pool } from '../backend/server.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runMigration() {
  try {
    console.log('🚀 Iniciando migration: Remover PIS/PASEP...\n');

    // Ler arquivo SQL
    const sqlPath = path.join(__dirname, 'migrations', 'remove-pis-pasep-documento.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');

    // Executar migration
    await pool.query(sql);

    console.log('✅ Migration executada com sucesso!');
    console.log('📋 PIS/PASEP removido dos templates de documentos');
    console.log('📋 Documentos PIS/PASEP existentes foram excluídos\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Erro ao executar migration:', error);
    process.exit(1);
  }
}

runMigration();

