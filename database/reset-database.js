import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';

dotenv.config();

async function resetDatabase() {
  console.log('🔄 Resetando Banco de Dados...\n');
  console.log('==================================================\n');
  console.log('⚠️  ATENÇÃO: Este script vai DELETAR TODAS as tabelas!\n');

  if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL não encontrada!');
    process.exit(1);
  }

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    console.log('📡 Conectando ao banco...');
    await pool.query('SELECT NOW()');
    console.log('✅ Conectado!\n');

    // Listar todas as tabelas existentes
    console.log('🔍 Verificando tabelas existentes...');
    const tables = await pool.query(`
      SELECT tablename 
      FROM pg_tables 
      WHERE schemaname = 'public'
      ORDER BY tablename
    `);

    if (tables.rows.length === 0) {
      console.log('✅ Banco está vazio. Nada para deletar.\n');
    } else {
      console.log(`\n📋 Encontradas ${tables.rows.length} tabelas:\n`);
      tables.rows.forEach((row, index) => {
        console.log(`   ${index + 1}. ${row.tablename}`);
      });

      console.log('\n🗑️  Deletando todas as tabelas...\n');

      // Drop todas as tabelas com CASCADE
      for (const row of tables.rows) {
        console.log(`   Deletando: ${row.tablename}`);
        await pool.query(`DROP TABLE IF EXISTS ${row.tablename} CASCADE`);
      }

      console.log('\n✅ Todas as tabelas deletadas!\n');
    }

    // Verificar se ainda existe alguma tabela
    const remaining = await pool.query(`
      SELECT COUNT(*) as count
      FROM pg_tables 
      WHERE schemaname = 'public'
    `);

    console.log('==================================================');
    console.log(`📊 Tabelas restantes: ${remaining.rows[0].count}`);
    
    if (remaining.rows[0].count === '0') {
      console.log('✅ Banco de dados limpo com sucesso!');
      console.log('\n🎯 Próximo passo:');
      console.log('   node database/setup-production-db.js\n');
    } else {
      console.log('⚠️  Ainda existem algumas tabelas. Execute novamente.\n');
    }

  } catch (error) {
    console.error('\n❌ ERRO:', error.message);
    console.error(error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

resetDatabase();

