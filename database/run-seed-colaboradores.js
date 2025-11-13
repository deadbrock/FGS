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

async function runSeed() {
  const client = await pool.connect();

  try {
    console.log('\n🌱 Iniciando seed de colaboradores de teste...\n');

    // Ler arquivo SQL
    const sqlPath = join(__dirname, 'seed-colaboradores-teste.sql');
    const sql = readFileSync(sqlPath, 'utf-8');

    // Executar seed
    await client.query(sql);

    console.log('✅ Seed executado com sucesso!\n');
    console.log('📊 10 colaboradores de teste foram inseridos no banco.\n');
    console.log('👥 Colaboradores criados:');
    console.log('   - FGS001: João Silva Santos (SP)');
    console.log('   - FGS002: Maria Oliveira Costa (RJ)');
    console.log('   - FGS003: Carlos Eduardo Souza (MG)');
    console.log('   - FGS004: Ana Paula Ferreira (SP)');
    console.log('   - FGS005: Pedro Henrique Almeida (RS)');
    console.log('   - FGS006: Juliana Santos Lima (BA)');
    console.log('   - FGS007: Roberto Carlos Lima (PR)');
    console.log('   - FGS008: Fernanda Costa Ribeiro (CE)');
    console.log('   - FGS009: Lucas Martins Pereira (SC)');
    console.log('   - FGS010: Camila Rodrigues Souza (PE)\n');

    // Verificar quantos foram inseridos
    const result = await client.query("SELECT COUNT(*) FROM colaboradores WHERE cpf LIKE '999.999.999-%'");
    console.log(`📈 Total de colaboradores de teste no banco: ${result.rows[0].count}\n`);

  } catch (error) {
    console.error('\n❌ Erro ao executar seed:', error.message);
    if (error.detail) console.error('Detalhes:', error.detail);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

runSeed();

