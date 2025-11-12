import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

async function cleanupMockUsers() {
  try {
    console.log('🧹 Limpando usuários mock...\n');

    // Listar todos os usuários atuais
    console.log('📋 Usuários atuais no banco:');
    const allUsers = await pool.query(`
      SELECT id, nome, email, role, created_at 
      FROM users 
      ORDER BY created_at
    `);

    console.table(allUsers.rows);

    // Identificar usuários mock (criados pelo seed/init)
    const mockEmails = [
      'admin@fgs.com',
      'rh@fgs.com', 
      'gestor@fgs.com'
    ];

    console.log('\n🎯 Identificando usuários mock...');
    const mockUsers = await pool.query(`
      SELECT id, nome, email 
      FROM users 
      WHERE email = ANY($1)
    `, [mockEmails]);

    if (mockUsers.rows.length === 0) {
      console.log('✅ Nenhum usuário mock encontrado!');
      await pool.end();
      return;
    }

    console.log(`\n⚠️  Encontrados ${mockUsers.rows.length} usuários mock:`);
    console.table(mockUsers.rows);

    // Perguntar confirmação (em ambiente interativo)
    console.log('\n❓ Deseja deletar esses usuários mock?');
    console.log('⚠️  ATENÇÃO: Esta ação é IRREVERSÍVEL!');
    console.log('\nPara confirmar, execute o script com o argumento --confirm:');
    console.log('node database/cleanup-mock-users.js --confirm\n');

    // Verificar se foi passado --confirm
    const confirmed = process.argv.includes('--confirm');

    if (!confirmed) {
      console.log('❌ Operação cancelada. Nenhum usuário foi deletado.');
      await pool.end();
      return;
    }

    // Deletar usuários mock
    console.log('\n🗑️  Deletando usuários mock...');
    const deleteResult = await pool.query(`
      DELETE FROM users 
      WHERE email = ANY($1)
      RETURNING id, nome, email
    `, [mockEmails]);

    console.log(`\n✅ ${deleteResult.rows.length} usuários mock deletados:`);
    console.table(deleteResult.rows);

    // Listar usuários restantes
    console.log('\n📋 Usuários restantes no banco:');
    const remainingUsers = await pool.query(`
      SELECT id, nome, email, role, created_at 
      FROM users 
      ORDER BY created_at
    `);

    console.table(remainingUsers.rows);

    console.log('\n✅ Limpeza concluída com sucesso!\n');

  } catch (error) {
    console.error('❌ Erro ao limpar usuários:', error);
  } finally {
    await pool.end();
  }
}

cleanupMockUsers();

