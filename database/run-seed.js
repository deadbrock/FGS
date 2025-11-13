import pkg from 'pg';
const { Pool } = pkg;
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runSeed() {
  console.log('🌱 Executando Seed de Dados Iniciais...\n');
  console.log('==================================================\n');

  if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL não encontrada!');
    console.error('📝 Crie um arquivo .env com a DATABASE_URL do Railway\n');
    process.exit(1);
  }

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    // Testar conexão
    console.log('📡 Conectando ao banco...');
    await pool.query('SELECT NOW()');
    console.log('✅ Conectado!\n');

    // Ler arquivo SQL
    console.log('📄 Lendo seed-initial-data.sql...');
    const seedPath = path.join(__dirname, 'seed-initial-data.sql');
    const seedSql = fs.readFileSync(seedPath, 'utf8');
    console.log('✅ Arquivo lido!\n');

    // Executar seed
    console.log('🌱 Inserindo dados iniciais...\n');
    
    await pool.query(seedSql);

    console.log('\n✅ DADOS INICIAIS INSERIDOS COM SUCESSO!\n');
    console.log('==================================================');
    console.log('📊 Dados inseridos:');
    console.log('   • Tipos de Benefícios');
    console.log('   • Configurações de Jornada');
    console.log('   • Treinamentos NR Obrigatórios');
    console.log('   • EPIs Comuns\n');

    // Verificar dados inseridos
    console.log('🔍 Verificando dados...\n');

    const beneficios = await pool.query('SELECT COUNT(*) FROM beneficios_tipos');
    console.log(`   ✅ ${beneficios.rows[0].count} tipos de benefícios`);

    const jornadas = await pool.query('SELECT COUNT(*) FROM ponto_configuracoes');
    console.log(`   ✅ ${jornadas.rows[0].count} configurações de jornada`);

    const treinamentos = await pool.query('SELECT COUNT(*) FROM treinamentos');
    console.log(`   ✅ ${treinamentos.rows[0].count} treinamentos`);

    const epis = await pool.query('SELECT COUNT(*) FROM epis');
    console.log(`   ✅ ${epis.rows[0].count} EPIs`);

    console.log('\n🎯 Sistema pronto para uso!');
    console.log('📝 Próximo passo: Cadastrar colaboradores via interface\n');

  } catch (error) {
    console.error('\n❌ ERRO ao executar seed:', error.message);
    console.error('\nDetalhes do erro:');
    console.error(error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

runSeed();

