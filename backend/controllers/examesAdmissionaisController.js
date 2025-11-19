import { pool } from '../server.js';
import { v4 as uuidv4 } from 'uuid';

// =============================================
// LISTAR EXAMES DE UMA ADMISSÃO
// =============================================
export const getExamesByAdmissao = async (req, res) => {
  try {
    const { admissao_id } = req.params;

    const result = await pool.query(
      `SELECT 
        e.*,
        u_resp.nome as responsavel_nome
      FROM exames_admissionais e
      LEFT JOIN users u_resp ON e.responsavel_id = u_resp.id
      WHERE e.admissao_id = $1
      ORDER BY e.data_agendamento, e.created_at`,
      [admissao_id]
    );

    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Erro ao buscar exames:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao buscar exames',
      message: error.message
    });
  }
};

// =============================================
// CRIAR AGENDAMENTO DE EXAME
// =============================================
export const criarAgendamento = async (req, res) => {
  try {
    const { admissao_id } = req.params;
    const {
      tipo_exame,
      nome_exame,
      clinica_id,
      nome_clinica,
      data_agendamento,
      hora_agendamento,
      endereco_clinica,
      telefone_clinica,
      observacoes
    } = req.body;

    if (!tipo_exame || !nome_exame || !data_agendamento) {
      return res.status(400).json({
        success: false,
        error: 'Campos obrigatórios: tipo_exame, nome_exame, data_agendamento'
      });
    }

    const id = uuidv4();
    const responsavelId = req.user?.id;

    const result = await pool.query(
      `INSERT INTO exames_admissionais (
        id, admissao_id, tipo_exame, nome_exame, clinica_id, nome_clinica,
        data_agendamento, hora_agendamento, endereco_clinica, telefone_clinica,
        status, responsavel_id, observacoes
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      RETURNING *`,
      [
        id,
        admissao_id,
        tipo_exame,
        nome_exame,
        clinica_id || null,
        nome_clinica || null,
        data_agendamento,
        hora_agendamento || null,
        endereco_clinica || null,
        telefone_clinica || null,
        'AGENDADO',
        responsavelId,
        observacoes || null
      ]
    );

    res.status(201).json({
      success: true,
      message: 'Agendamento criado com sucesso',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Erro ao criar agendamento:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao criar agendamento',
      message: error.message
    });
  }
};

// =============================================
// ATUALIZAR EXAME
// =============================================
export const updateExame = async (req, res) => {
  try {
    const { exame_id } = req.params;
    const updates = req.body;

    const allowedFields = [
      'tipo_exame', 'nome_exame', 'clinica_id', 'nome_clinica',
      'data_agendamento', 'hora_agendamento', 'endereco_clinica', 'telefone_clinica',
      'data_realizacao', 'hora_realizacao', 'medico_responsavel', 'crm_medico',
      'resultado', 'observacoes', 'status', 'arquivo_url', 'arquivo_nome',
      'arquivo_tamanho', 'arquivo_tipo'
    ];

    const updateFields = [];
    const values = [];
    let paramIndex = 1;

    for (const field of allowedFields) {
      if (updates[field] !== undefined) {
        updateFields.push(`${field} = $${paramIndex++}`);
        values.push(updates[field]);
      }
    }

    if (updateFields.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Nenhum campo para atualizar'
      });
    }

    values.push(exame_id);

    const result = await pool.query(
      `UPDATE exames_admissionais
      SET ${updateFields.join(', ')}, updated_at = CURRENT_TIMESTAMP
      WHERE id = $${paramIndex}
      RETURNING *`,
      values
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Exame não encontrado'
      });
    }

    res.json({
      success: true,
      message: 'Exame atualizado com sucesso',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Erro ao atualizar exame:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao atualizar exame',
      message: error.message
    });
  }
};

// =============================================
// LISTAR CLÍNICAS
// =============================================
export const getClinicas = async (req, res) => {
  try {
    const { ativo, cidade, estado } = req.query;

    let query = 'SELECT * FROM clinicas WHERE 1=1';
    const params = [];
    let paramIndex = 1;

    if (ativo !== undefined) {
      query += ` AND ativo = $${paramIndex++}`;
      params.push(ativo === 'true');
    }

    if (cidade) {
      query += ` AND cidade ILIKE $${paramIndex++}`;
      params.push(`%${cidade}%`);
    }

    if (estado) {
      query += ` AND estado = $${paramIndex++}`;
      params.push(estado);
    }

    query += ' ORDER BY nome';

    const result = await pool.query(query, params);

    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Erro ao buscar clínicas:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao buscar clínicas',
      message: error.message
    });
  }
};

// =============================================
// CALENDÁRIO DE AGENDAMENTOS (SST)
// =============================================
export const getCalendarioAgendamentos = async (req, res) => {
  try {
    const { data_inicio, data_fim, status } = req.query;

    let query = `
      SELECT 
        e.*,
        a.nome_candidato,
        a.cargo,
        a.departamento
      FROM exames_admissionais e
      JOIN admissoes a ON e.admissao_id = a.id
      WHERE 1=1
    `;

    const params = [];
    let paramIndex = 1;

    if (data_inicio && data_fim) {
      query += ` AND e.data_agendamento BETWEEN $${paramIndex++} AND $${paramIndex + 1}`;
      params.push(data_inicio, data_fim);
      paramIndex += 2;
    } else if (data_inicio) {
      query += ` AND e.data_agendamento >= $${paramIndex++}`;
      params.push(data_inicio);
    }

    if (status) {
      query += ` AND e.status = $${paramIndex++}`;
      params.push(status);
    }

    query += ' ORDER BY e.data_agendamento, e.hora_agendamento';

    const result = await pool.query(query, params);

    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Erro ao buscar calendário:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao buscar calendário',
      message: error.message
    });
  }
};

