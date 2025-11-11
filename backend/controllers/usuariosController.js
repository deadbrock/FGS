import { pool } from '../server.js';
import bcrypt from 'bcrypt';

// Obter todos os usuários
export const getUsuarios = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        id, 
        nome, 
        email, 
        role, 
        cargo, 
        departamento, 
        avatar,
        created_at,
        updated_at
      FROM users 
      ORDER BY created_at DESC
    `);

    res.json({
      success: true,
      data: result.rows,
      total: result.rows.length
    });
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao buscar usuários',
      message: error.message
    });
  }
};

// Obter um usuário por ID
export const getUsuarioById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(`
      SELECT 
        id, 
        nome, 
        email, 
        role, 
        cargo, 
        departamento, 
        avatar,
        created_at,
        updated_at
      FROM users 
      WHERE id = $1
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Usuário não encontrado'
      });
    }

    res.json({
      success: true,
      data: result.rows[0]
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

// Criar novo usuário
export const createUsuario = async (req, res) => {
  try {
    const { nome, email, senha, role, cargo, departamento, avatar } = req.body;

    // Validações
    if (!nome || !email || !senha || !role) {
      return res.status(400).json({
        success: false,
        error: 'Campos obrigatórios: nome, email, senha, role'
      });
    }

    // Verificar se o email já existe
    const emailCheck = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );

    if (emailCheck.rows.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'Email já cadastrado'
      });
    }

    // Hash da senha
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(senha, saltRounds);

    // Inserir usuário
    const result = await pool.query(`
      INSERT INTO users (nome, email, senha, role, cargo, departamento, avatar)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id, nome, email, role, cargo, departamento, avatar, created_at
    `, [nome, email, hashedPassword, role, cargo || null, departamento || null, avatar || null]);

    res.status(201).json({
      success: true,
      message: 'Usuário criado com sucesso',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao criar usuário',
      message: error.message
    });
  }
};

// Atualizar usuário
export const updateUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, email, senha, role, cargo, departamento, avatar } = req.body;

    // Verificar se o usuário existe
    const userCheck = await pool.query('SELECT id FROM users WHERE id = $1', [id]);
    
    if (userCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Usuário não encontrado'
      });
    }

    // Verificar se o email já está sendo usado por outro usuário
    if (email) {
      const emailCheck = await pool.query(
        'SELECT id FROM users WHERE email = $1 AND id != $2',
        [email, id]
      );

      if (emailCheck.rows.length > 0) {
        return res.status(400).json({
          success: false,
          error: 'Email já está sendo usado por outro usuário'
        });
      }
    }

    // Construir query de atualização dinamicamente
    const updates = [];
    const values = [];
    let paramIndex = 1;

    if (nome) {
      updates.push(`nome = $${paramIndex++}`);
      values.push(nome);
    }
    if (email) {
      updates.push(`email = $${paramIndex++}`);
      values.push(email);
    }
    if (senha) {
      const hashedPassword = await bcrypt.hash(senha, 10);
      updates.push(`senha = $${paramIndex++}`);
      values.push(hashedPassword);
    }
    if (role) {
      updates.push(`role = $${paramIndex++}`);
      values.push(role);
    }
    if (cargo !== undefined) {
      updates.push(`cargo = $${paramIndex++}`);
      values.push(cargo);
    }
    if (departamento !== undefined) {
      updates.push(`departamento = $${paramIndex++}`);
      values.push(departamento);
    }
    if (avatar !== undefined) {
      updates.push(`avatar = $${paramIndex++}`);
      values.push(avatar);
    }

    updates.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(id);

    if (updates.length === 1) { // Apenas updated_at
      return res.status(400).json({
        success: false,
        error: 'Nenhum campo para atualizar'
      });
    }

    const query = `
      UPDATE users 
      SET ${updates.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING id, nome, email, role, cargo, departamento, avatar, updated_at
    `;

    const result = await pool.query(query, values);

    res.json({
      success: true,
      message: 'Usuário atualizado com sucesso',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao atualizar usuário',
      message: error.message
    });
  }
};

// Deletar usuário
export const deleteUsuario = async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar se o usuário existe
    const userCheck = await pool.query('SELECT id, email FROM users WHERE id = $1', [id]);
    
    if (userCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Usuário não encontrado'
      });
    }

    // Não permitir deletar o admin principal
    const email = userCheck.rows[0].email;
    if (email === 'admin@fgs.com') {
      return res.status(403).json({
        success: false,
        error: 'Não é possível deletar o usuário administrador principal'
      });
    }

    // Deletar usuário
    await pool.query('DELETE FROM users WHERE id = $1', [id]);

    res.json({
      success: true,
      message: 'Usuário deletado com sucesso'
    });
  } catch (error) {
    console.error('Erro ao deletar usuário:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao deletar usuário',
      message: error.message
    });
  }
};

// Verificar email disponível
export const checkEmailDisponivel = async (req, res) => {
  try {
    const { email, userId } = req.query;

    let query = 'SELECT id FROM users WHERE email = $1';
    const params = [email];

    // Se estiver editando, excluir o próprio usuário da verificação
    if (userId) {
      query += ' AND id != $2';
      params.push(userId);
    }

    const result = await pool.query(query, params);

    res.json({
      success: true,
      disponivel: result.rows.length === 0
    });
  } catch (error) {
    console.error('Erro ao verificar email:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao verificar email',
      message: error.message
    });
  }
};

