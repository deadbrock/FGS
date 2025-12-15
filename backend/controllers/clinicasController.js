import { pool } from '../server.js';
import { v4 as uuidv4 } from 'uuid';

// =============================================
// CLÍNICAS
// =============================================

// Listar todas as clínicas
const getAll = async (req, res) => {
  try {
    const query = `
      SELECT * FROM sst_clinicas
      ORDER BY nome ASC
    `;

    const result = await pool.query(query);

    res.json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.error('Erro ao buscar clínicas:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar clínicas',
      error: error.message,
    });
  }
};

// Criar nova clínica
const create = async (req, res) => {
  try {
    const {
      nome,
      cnpj,
      razao_social,
      telefone,
      email,
      endereco,
      responsavel_nome,
      responsavel_telefone,
      responsavel_email,
      especialidades,
      observacoes,
      ativo = true,
    } = req.body;

    const id = uuidv4();

    const query = `
      INSERT INTO sst_clinicas (
        id, nome, cnpj, razao_social, telefone, email, endereco,
        responsavel_nome, responsavel_telefone, responsavel_email,
        especialidades, observacoes, ativo
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13
      ) RETURNING *
    `;

    const result = await pool.query(query, [
      id,
      nome,
      cnpj,
      razao_social || null,
      telefone,
      email,
      JSON.stringify(endereco),
      responsavel_nome || null,
      responsavel_telefone || null,
      responsavel_email || null,
      JSON.stringify(especialidades || []),
      observacoes || null,
      ativo,
    ]);

    res.status(201).json({
      success: true,
      message: 'Clínica cadastrada com sucesso',
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Erro ao criar clínica:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao criar clínica',
      error: error.message,
    });
  }
};

// Atualizar clínica
const update = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      nome,
      cnpj,
      razao_social,
      telefone,
      email,
      endereco,
      responsavel_nome,
      responsavel_telefone,
      responsavel_email,
      especialidades,
      observacoes,
      ativo,
    } = req.body;

    const query = `
      UPDATE sst_clinicas
      SET 
        nome = COALESCE($1, nome),
        cnpj = COALESCE($2, cnpj),
        razao_social = COALESCE($3, razao_social),
        telefone = COALESCE($4, telefone),
        email = COALESCE($5, email),
        endereco = COALESCE($6, endereco),
        responsavel_nome = COALESCE($7, responsavel_nome),
        responsavel_telefone = COALESCE($8, responsavel_telefone),
        responsavel_email = COALESCE($9, responsavel_email),
        especialidades = COALESCE($10, especialidades),
        observacoes = COALESCE($11, observacoes),
        ativo = COALESCE($12, ativo),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $13
      RETURNING *
    `;

    const result = await pool.query(query, [
      nome,
      cnpj,
      razao_social,
      telefone,
      email,
      endereco ? JSON.stringify(endereco) : null,
      responsavel_nome,
      responsavel_telefone,
      responsavel_email,
      especialidades ? JSON.stringify(especialidades) : null,
      observacoes,
      ativo,
      id,
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Clínica não encontrada',
      });
    }

    res.json({
      success: true,
      message: 'Clínica atualizada com sucesso',
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Erro ao atualizar clínica:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao atualizar clínica',
      error: error.message,
    });
  }
};

// Excluir clínica
const deleteClinica = async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar se há solicitações vinculadas
    const checkQuery = `
      SELECT COUNT(*) as total
      FROM sst_solicitacoes_exames
      WHERE clinica_id = $1
    `;

    const checkResult = await pool.query(checkQuery, [id]);

    if (parseInt(checkResult.rows[0].total) > 0) {
      return res.status(400).json({
        success: false,
        message: 'Não é possível excluir clínica com solicitações vinculadas',
      });
    }

    const query = 'DELETE FROM sst_clinicas WHERE id = $1 RETURNING *';
    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Clínica não encontrada',
      });
    }

    res.json({
      success: true,
      message: 'Clínica excluída com sucesso',
    });
  } catch (error) {
    console.error('Erro ao excluir clínica:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao excluir clínica',
      error: error.message,
    });
  }
};

export { getAll, create, update, deleteClinica };

