import pkg from 'pg';
const { Pool } = pkg;
import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function cleanupMockUsers() {
  try {
    console.log('🧹 Limpeza de Usuários Mock\n');
    console.log('⚠️  Este script vai deletar usuários com emails mock do banco.\n');
    
    // Pedir DATABASE_URL
    console.log('📝 Cole a DATABASE_URL do Railway:');
    console.log('(Railway → PostgreSQL → Variables → DATABASE_URL)\n');
    
    const databaseUrl = await question('DATABASE_URL: ');
    
    if (!databaseUrl || !databaseUrl.includes('postgresql://')) {
      console.log('\n❌ URL inválida! Deve começar com postgresql://');
      rl.close();
      return;
    }

    console.log('\n🔌 Conectando ao banco...');

    const pool = new Pool({
      connectionString: databaseUrl.trim(),
      ssl: { rejectUnauthorized: false }
    });

    // Testar conexão
    await pool.query('SELECT NOW()');
    console.log('✅ Conectado com sucesso!\n');

    // Listar todos os usuários
    console.log('📋 Usuários atuais no banco:');
    const allUsers = await pool.query(`
      SELECT id, nome, email, role, 
             TO_CHAR(created_at, 'YYYY-MM-DD HH24:MI') as created 
      FROM users 
      ORDER BY created_at
    `);

    if (allUsers.rows.length === 0) {
      console.log('Nenhum usuário encontrado.\n');
      await pool.end();
      rl.close();
      return;
    }

    console.table(allUsers.rows);

    // Identificar usuários mock
    const mockEmails = ['admin@fgs.com', 'rh@fgs.com', 'gestor@fgs.com'];
    
    const mockUsers = await pool.query(`
      SELECT id, nome, email 
      FROM users 
      WHERE email = ANY($1)
    `, [mockEmails]);

    if (mockUsers.rows.length === 0) {
      console.log('\n✅ Nenhum usuário mock encontrado!\n');
      await pool.end();
      rl.close();
      return;
    }

    console.log(`\n⚠️  Encontrados ${mockUsers.rows.length} usuários mock que serão DELETADOS:`);
    console.table(mockUsers.rows);

    // Confirmar
    const confirm = await question('\n❓ Tem certeza que deseja DELETAR esses usuários? (sim/não): ');

    if (confirm.toLowerCase() !== 'sim') {
      console.log('\n❌ Operação cancelada. Nenhum usuário foi deletado.\n');
      await pool.end();
      rl.close();
      return;
    }

    // Deletar
    console.log('\n🗑️  Deletando usuários mock...');
    const deleteResult = await pool.query(`
      DELETE FROM users 
      WHERE email = ANY($1)
      RETURNING id, nome, email
    `, [mockEmails]);

    console.log(`\n✅ ${deleteResult.rows.length} usuários deletados:`);
    console.table(deleteResult.rows);

    // Listar usuários restantes
    console.log('\n📋 Usuários restantes no banco:');
    const remainingUsers = await pool.query(`
      SELECT id, nome, email, role, 
             TO_CHAR(created_at, 'YYYY-MM-DD HH24:MI') as created 
      FROM users 
      ORDER BY created_at
    `);

    console.table(remainingUsers.rows);
    console.log('✅ Limpeza concluída com sucesso!\n');

    await pool.end();
    rl.close();

  } catch (error) {
    console.error('\n❌ Erro:', error.message);
    console.error('Stack:', error.stack);
    rl.close();
  }
}

cleanupMockUsers();

