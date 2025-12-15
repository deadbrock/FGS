import { pool } from '../server.js';
import { v4 as uuidv4 } from 'uuid';

// =============================================
// SOLICITAÇÕES DE EXAMES
// =============================================

// Listar todas as solicitações com filtros
const getAll = async (req, res) => {
  try {
    const {
      tipo_exame,
      status,
      colaborador_nome,
      departamento,
      data_inicio,
      data_fim,
      clinica_id,
      limit = 50,
      offset = 0,
    } = req.query;

    let query = `
      SELECT 
        s.*,
        u.nome as solicitado_por_nome,
        c.nome as clinica_nome
      FROM sst_solicitacoes_exames s
      LEFT JOIN users u ON s.solicitado_por = u.id
      LEFT JOIN sst_clinicas c ON s.clinica_id = c.id
      WHERE 1=1
    `;

    const params = [];
    let paramCount = 1;

    if (tipo_exame) {
      query += ` AND s.tipo_exame = $${paramCount}`;
      params.push(tipo_exame);
      paramCount++;
    }

    if (status) {
      query += ` AND s.status = $${paramCount}`;
      params.push(status);
      paramCount++;
    }

    if (colaborador_nome) {
      query += ` AND s.colaborador_nome ILIKE $${paramCount}`;
      params.push(`%${colaborador_nome}%`);
      paramCount++;
    }

    if (departamento) {
      query += ` AND s.departamento = $${paramCount}`;
      params.push(departamento);
      paramCount++;
    }

    if (data_inicio) {
      query += ` AND s.data_solicitacao >= $${paramCount}`;
      params.push(data_inicio);
      paramCount++;
    }

    if (data_fim) {
      query += ` AND s.data_solicitacao <= $${paramCount}`;
      params.push(data_fim);
      paramCount++;
    }

    if (clinica_id) {
      query += ` AND s.clinica_id = $${paramCount}`;
      params.push(clinica_id);
      paramCount++;
    }

    query += ` ORDER BY s.created_at DESC LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
    params.push(limit, offset);

    const result = await pool.query(query, params);

    // Contar total
    let countQuery = `SELECT COUNT(*) FROM sst_solicitacoes_exames s WHERE 1=1`;
    const countParams = [];
    let countParamCount = 1;

    if (tipo_exame) {
      countQuery += ` AND s.tipo_exame = $${countParamCount}`;
      countParams.push(tipo_exame);
      countParamCount++;
    }

    if (status) {
      countQuery += ` AND s.status = $${countParamCount}`;
      countParams.push(status);
      countParamCount++;
    }

    if (colaborador_nome) {
      countQuery += ` AND s.colaborador_nome ILIKE $${countParamCount}`;
      countParams.push(`%${colaborador_nome}%`);
      countParamCount++;
    }

    if (departamento) {
      countQuery += ` AND s.departamento = $${countParamCount}`;
      countParams.push(departamento);
      countParamCount++;
    }

    const countResult = await pool.query(countQuery, countParams);

    res.json({
      success: true,
      data: result.rows,
      pagination: {
        total: parseInt(countResult.rows[0].count),
        limit: parseInt(limit),
        offset: parseInt(offset),
      },
    });
  } catch (error) {
    console.error('Erro ao buscar solicitações:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar solicitações',
      error: error.message,
    });
  }
};

// Criar nova solicitação
const create = async (req, res) => {
  try {
    const {
      tipo_exame,
      colaborador_id,
      colaborador_nome,
      colaborador_cpf,
      colaborador_email,
      colaborador_telefone,
      cargo,
      cargo_anterior,
      departamento,
      setor,
      admissao_id,
      motivo_afastamento,
      data_afastamento,
      data_desligamento,
      motivo_desligamento,
      observacoes,
    } = req.body;

    const solicitado_por = req.user.id;

    const id = uuidv4();

    const query = `
      INSERT INTO sst_solicitacoes_exames (
        id, tipo_exame, colaborador_id, colaborador_nome, colaborador_cpf,
        colaborador_email, colaborador_telefone, cargo, cargo_anterior,
        departamento, setor, admissao_id, motivo_afastamento, data_afastamento,
        data_desligamento, motivo_desligamento, status, solicitado_por, observacoes
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, 'PENDENTE', $17, $18
      ) RETURNING *
    `;

    const result = await pool.query(query, [
      id,
      tipo_exame,
      colaborador_id || null,
      colaborador_nome,
      colaborador_cpf,
      colaborador_email || null,
      colaborador_telefone || null,
      cargo,
      cargo_anterior || null,
      departamento,
      setor,
      admissao_id || null,
      motivo_afastamento || null,
      data_afastamento || null,
      data_desligamento || null,
      motivo_desligamento || null,
      solicitado_por,
      observacoes || null,
    ]);

    res.status(201).json({
      success: true,
      message: 'Solicitação criada com sucesso',
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Erro ao criar solicitação:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao criar solicitação',
      error: error.message,
    });
  }
};

// Criar agendamento
const createAgendamento = async (req, res) => {
  try {
    const { solicitacao_id, clinica_id, data_agendamento, hora_agendamento, observacoes } = req.body;

    // Atualizar solicitação
    const updateQuery = `
      UPDATE sst_solicitacoes_exames
      SET 
        clinica_id = $1,
        data_agendamento = $2,
        hora_agendamento = $3,
        status = 'AGENDADO',
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $4
      RETURNING *
    `;

    const result = await pool.query(updateQuery, [
      clinica_id,
      data_agendamento,
      hora_agendamento,
      solicitacao_id,
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Solicitação não encontrada',
      });
    }

    res.json({
      success: true,
      message: 'Agendamento criado com sucesso',
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Erro ao criar agendamento:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao criar agendamento',
      error: error.message,
    });
  }
};

// Atualizar resultado do exame
const atualizarResultado = async (req, res) => {
  try {
    const { id } = req.params;
    const { resultado, restricoes, data_realizacao, medico_responsavel, crm_medico, aso_arquivo_url } = req.body;

    const query = `
      UPDATE sst_solicitacoes_exames
      SET 
        resultado = $1,
        restricoes = $2,
        data_realizacao = $3,
        medico_responsavel = $4,
        crm_medico = $5,
        aso_arquivo_url = $6,
        status = 'REALIZADO',
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $7
      RETURNING *
    `;

    const result = await pool.query(query, [
      resultado,
      restricoes || null,
      data_realizacao,
      medico_responsavel,
      crm_medico,
      aso_arquivo_url || null,
      id,
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Solicitação não encontrada',
      });
    }

    res.json({
      success: true,
      message: 'Resultado registrado com sucesso',
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Erro ao atualizar resultado:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao atualizar resultado',
      error: error.message,
    });
  }
};

// Estatísticas
const getEstatisticas = async (req, res) => {
  try {
    // Total de solicitações
    const totalQuery = 'SELECT COUNT(*) as total FROM sst_solicitacoes_exames';
    const totalResult = await pool.query(totalQuery);

    // Por tipo
    const porTipoQuery = `
      SELECT tipo_exame, COUNT(*) as total
      FROM sst_solicitacoes_exames
      GROUP BY tipo_exame
    `;
    const porTipoResult = await pool.query(porTipoQuery);

    // Por status
    const porStatusQuery = `
      SELECT status, COUNT(*) as total
      FROM sst_solicitacoes_exames
      GROUP BY status
    `;
    const porStatusResult = await pool.query(porStatusQuery);

    // Pendentes agendamento
    const pendentesQuery = `
      SELECT COUNT(*) as total
      FROM sst_solicitacoes_exames
      WHERE status = 'PENDENTE'
    `;
    const pendentesResult = await pool.query(pendentesQuery);

    // Realizados este mês
    const realizadosMesQuery = `
      SELECT COUNT(*) as total
      FROM sst_solicitacoes_exames
      WHERE status = 'REALIZADO'
      AND EXTRACT(MONTH FROM data_realizacao) = EXTRACT(MONTH FROM CURRENT_DATE)
      AND EXTRACT(YEAR FROM data_realizacao) = EXTRACT(YEAR FROM CURRENT_DATE)
    `;
    const realizadosMesResult = await pool.query(realizadosMesQuery);

    // Taxa de aprovação
    const taxaQuery = `
      SELECT 
        COUNT(*) FILTER (WHERE resultado = 'APTO') as aptos,
        COUNT(*) FILTER (WHERE resultado IN ('APTO', 'INAPTO', 'APTO_COM_RESTRICOES')) as total_com_resultado
      FROM sst_solicitacoes_exames
      WHERE status = 'REALIZADO'
    `;
    const taxaResult = await pool.query(taxaQuery);

    const aptos = parseInt(taxaResult.rows[0].aptos) || 0;
    const totalComResultado = parseInt(taxaResult.rows[0].total_com_resultado) || 0;
    const taxaAprovacao = totalComResultado > 0 ? (aptos / totalComResultado) * 100 : 0;

    res.json({
      success: true,
      data: {
        total: parseInt(totalResult.rows[0].total),
        por_tipo: porTipoResult.rows.map((row) => ({
          tipo_exame: row.tipo_exame,
          total: parseInt(row.total),
        })),
        por_status: porStatusResult.rows.map((row) => ({
          status: row.status,
          total: parseInt(row.total),
        })),
        pendentes_agendamento: parseInt(pendentesResult.rows[0].total),
        realizados_mes: parseInt(realizadosMesResult.rows[0].total),
        taxa_aprovacao: parseFloat(taxaAprovacao.toFixed(2)),
      },
    });
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar estatísticas',
      error: error.message,
    });
  }
};

export { getAll, create, createAgendamento, atualizarResultado, getEstatisticas };

