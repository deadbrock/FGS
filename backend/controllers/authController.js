import { pool } from '../server.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Login de usuário
export const login = async (req, res) => {
  try {
    const { email, senha } = req.body;

    console.log('🔐 LOGIN REQUEST:', { email });

    // Validações
    if (!email || !senha) {
      return res.status(400).json({
        success: false,
        error: 'Email e senha são obrigatórios'
      });
    }

    // Buscar usuário por email
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      console.log('❌ Usuário não encontrado:', email);
      return res.status(401).json({
        success: false,
        error: 'Email ou senha inválidos'
      });
    }

    const user = result.rows[0];

    // Verificar senha
    const senhaValida = await bcrypt.compare(senha, user.senha);

    if (!senhaValida) {
      console.log('❌ Senha inválida para:', email);
      return res.status(401).json({
        success: false,
        error: 'Email ou senha inválidos'
      });
    }

    // Gerar token JWT
    const token = jwt.sign(
      { 
        id: user.id, 
        email: user.email, 
        role: user.role 
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Remover senha da resposta
    delete user.senha;

    console.log('✅ Login bem-sucedido:', email);

    res.json({
      success: true,
      token,
      user
    });
  } catch (error) {
    console.error('❌ Erro no login:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao fazer login',
      message: error.message
    });
  }
};

// Obter usuário autenticado (me)
export const me = async (req, res) => {
  try {
    // O usuário já vem do middleware de autenticação
    const userId = req.user.id;

    const result = await pool.query(
      'SELECT id, nome, email, role, cargo, departamento, avatar FROM users WHERE id = $1',
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Usuário não encontrado'
      });
    }

    res.json({
      success: true,
      user: result.rows[0]
    });
  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao buscar usuário',
      message: error.message
    });
  }
};

