import pkg from 'pg';
const { Pool } = pkg;
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

async function initAdmin() {
  try {
    console.log('🔧 Inicializando usuário admin...');

    // Verificar se já existe um admin
    const checkAdmin = await pool.query(
      "SELECT id FROM users WHERE email = 'admin@fgs.com'"
    );

    if (checkAdmin.rows.length > 0) {
      console.log('✅ Usuário admin já existe!');
      await pool.end();
      return;
    }

    // Criar usuário admin
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    await pool.query(`
      INSERT INTO users (nome, email, senha, role, cargo, departamento)
      VALUES ($1, $2, $3, $4, $5, $6)
    `, [
      'Administrador',
      'admin@fgs.com',
      hashedPassword,
      'ADMINISTRADOR',
      'Administrador do Sistema',
      'TI'
    ]);

    console.log('✅ Usuário admin criado com sucesso!');
    console.log('📧 Email: admin@fgs.com');
    console.log('🔑 Senha: admin123');
    
    await pool.end();
  } catch (error) {
    console.error('❌ Erro ao criar admin:', error);
    await pool.end();
    process.exit(1);
  }
}

initAdmin();

