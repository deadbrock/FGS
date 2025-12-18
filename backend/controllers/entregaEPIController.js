import { pool } from '../server.js';
import { v4 as uuidv4 } from 'uuid';

// =============================================
// Entregas de EPI
// =============================================

export const getEntregas = async (req, res) => {
  try {
    const {
      colaborador_id,
      epi_id,
      status,
      data_inicio,
      data_fim,
      limit = 50,
      offset = 0,
    } = req.query;

    let query = `
      SELECT 
        ee.*,
        e.codigo as epi_codigo,
        e.nome as epi_nome,
        e.ca as epi_ca,
        u.name as entregue_por_nome
      FROM entregas_epi ee
      INNER JOIN epis e ON ee.epi_id = e.id
      LEFT JOIN users u ON ee.entregue_por = u.id
      WHERE 1=1
    `;
    const params = [];
    let paramIndex = 1;

    if (colaborador_id) {
      query += ` AND ee.colaborador_id = $${paramIndex}`;
      params.push(colaborador_id);
      paramIndex++;
    }

    if (epi_id) {
      query += ` AND ee.epi_id = $${paramIndex}`;
      params.push(epi_id);
      paramIndex++;
    }

    if (status) {
      query += ` AND ee.status = $${paramIndex}`;
      params.push(status);
      paramIndex++;
    }

    if (data_inicio) {
      query += ` AND ee.data_entrega >= $${paramIndex}`;
      params.push(data_inicio);
      paramIndex++;
    }

    if (data_fim) {
      query += ` AND ee.data_entrega <= $${paramIndex}`;
      params.push(data_fim);
      paramIndex++;
    }

    query += ` ORDER BY ee.data_entrega DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    params.push(limit, offset);

    const result = await pool.query(query, params);

    // Contar total
    let countQuery = `SELECT COUNT(*) as total FROM entregas_epi ee WHERE 1=1`;
    const countParams = [];
    let countParamIndex = 1;

    if (colaborador_id) {
      countQuery += ` AND ee.colaborador_id = $${countParamIndex}`;
      countParams.push(colaborador_id);
      countParamIndex++;
    }

    if (epi_id) {
      countQuery += ` AND ee.epi_id = $${countParamIndex}`;
      countParams.push(epi_id);
      countParamIndex++;
    }

    if (status) {
      countQuery += ` AND ee.status = $${countParamIndex}`;
      countParams.push(status);
      countParamIndex++;
    }

    const countResult = await pool.query(countQuery, countParams);

    res.json({
      success: true,
      data: result.rows,
      pagination: {
        total: parseInt(countResult.rows[0].total),
        limit: parseInt(limit),
        offset: parseInt(offset),
      },
    });
  } catch (error) {
    console.error('Erro ao buscar entregas:', error);
    res.status(500).json({ error: 'Erro ao buscar entregas' });
  }
};

export const getEntregaById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `SELECT 
        ee.*,
        e.codigo as epi_codigo,
        e.nome as epi_nome,
        e.ca as epi_ca,
        e.categoria as epi_categoria,
        u.name as entregue_por_nome
      FROM entregas_epi ee
      INNER JOIN epis e ON ee.epi_id = e.id
      LEFT JOIN users u ON ee.entregue_por = u.id
      WHERE ee.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Entrega não encontrada' });
    }

    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Erro ao buscar entrega:', error);
    res.status(500).json({ error: 'Erro ao buscar entrega' });
  }
};

export const entregarEPI = async (req, res) => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');

    const {
      epi_id,
      colaborador_id,
      quantidade,
      data_entrega,
      data_validade,
      observacoes,
      assinatura_colaborador,
      foto_entrega,
    } = req.body;

    // Validações
    if (!epi_id || !colaborador_id || !quantidade || !data_entrega || !data_validade) {
      return res.status(400).json({ error: 'Campos obrigatórios não preenchidos' });
    }

    // Verificar se EPI existe e tem estoque
    const epiResult = await client.query('SELECT * FROM epis WHERE id = $1 AND ativo = true', [epi_id]);
    if (epiResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'EPI não encontrado ou inativo' });
    }

    const epi = epiResult.rows[0];
    if (epi.quantidade_estoque < quantidade) {
      await client.query('ROLLBACK');
      return res.status(400).json({
        error: `Estoque insuficiente. Disponível: ${epi.quantidade_estoque}`,
      });
    }

    // Criar entrega
    const entregaId = uuidv4();
    const entregaResult = await client.query(
      `INSERT INTO entregas_epi (
        id, epi_id, colaborador_id, quantidade, data_entrega, data_validade,
        status, observacoes, entregue_por, assinatura_colaborador, foto_entrega
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *`,
      [
        entregaId,
        epi_id,
        colaborador_id,
        quantidade,
        data_entrega,
        data_validade,
        'ENTREGUE',
        observacoes,
        req.user.id,
        assinatura_colaborador,
        foto_entrega,
      ]
    );

    // Atualizar estoque
    const novaQuantidade = epi.quantidade_estoque - quantidade;
    await client.query(
      'UPDATE epis SET quantidade_estoque = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
      [novaQuantidade, epi_id]
    );

    // Registrar movimentação de estoque
    await client.query(
      `INSERT INTO movimentacoes_estoque_epi (
        id, epi_id, tipo_movimentacao, quantidade, quantidade_anterior,
        quantidade_nova, motivo, responsavel_id
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [
        uuidv4(),
        epi_id,
        'SAIDA',
        quantidade,
        epi.quantidade_estoque,
        novaQuantidade,
        `Entrega para colaborador (ID: ${colaborador_id})`,
        req.user.id,
      ]
    );

    await client.query('COMMIT');

    res.status(201).json({
      success: true,
      data: entregaResult.rows[0],
      message: 'EPI entregue com sucesso',
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Erro ao entregar EPI:', error);
    res.status(500).json({ error: 'Erro ao entregar EPI' });
  } finally {
    client.release();
  }
};

export const devolverEPI = async (req, res) => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');

    const { id } = req.params;
    const { motivo_devolucao, observacoes } = req.body;

    // Buscar entrega
    const entregaResult = await client.query(
      'SELECT * FROM entregas_epi WHERE id = $1 AND status = $2',
      [id, 'ENTREGUE']
    );

    if (entregaResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Entrega não encontrada ou já devolvida' });
    }

    const entrega = entregaResult.rows[0];

    // Atualizar entrega
    await client.query(
      `UPDATE entregas_epi SET
        status = $1,
        data_devolucao = CURRENT_TIMESTAMP,
        motivo_devolucao = $2,
        observacoes = COALESCE($3, observacoes),
        recebido_por = $4,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $5`,
      ['DEVOLVIDO', motivo_devolucao, observacoes, req.user.id, id]
    );

    // Se devolução normal, devolver ao estoque
    if (motivo_devolucao === 'NORMAL' || motivo_devolucao === 'TROCA') {
      const epiResult = await client.query('SELECT * FROM epis WHERE id = $1', [entrega.epi_id]);
      const epi = epiResult.rows[0];
      const novaQuantidade = epi.quantidade_estoque + entrega.quantidade;

      await client.query(
        'UPDATE epis SET quantidade_estoque = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
        [novaQuantidade, entrega.epi_id]
      );

      // Registrar movimentação
      await client.query(
        `INSERT INTO movimentacoes_estoque_epi (
          id, epi_id, tipo_movimentacao, quantidade, quantidade_anterior,
          quantidade_nova, motivo, responsavel_id
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [
          uuidv4(),
          entrega.epi_id,
          'ENTRADA',
          entrega.quantidade,
          epi.quantidade_estoque,
          novaQuantidade,
          `Devolução - ${motivo_devolucao}`,
          req.user.id,
        ]
      );
    }

    await client.query('COMMIT');

    res.json({
      success: true,
      message: 'Devolução registrada com sucesso',
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Erro ao devolver EPI:', error);
    res.status(500).json({ error: 'Erro ao devolver EPI' });
  } finally {
    client.release();
  }
};

// =============================================
// Histórico e Relatórios
// =============================================

export const getHistoricoColaborador = async (req, res) => {
  try {
    const { colaborador_id } = req.params;

    const entregas = await pool.query(
      `SELECT 
        ee.*,
        e.codigo as epi_codigo,
        e.nome as epi_nome,
        e.ca as epi_ca,
        u.name as entregue_por_nome
      FROM entregas_epi ee
      INNER JOIN epis e ON ee.epi_id = e.id
      LEFT JOIN users u ON ee.entregue_por = u.id
      WHERE ee.colaborador_id = $1
      ORDER BY ee.data_entrega DESC`,
      [colaborador_id]
    );

    const ativas = entregas.rows.filter(e => e.status === 'ENTREGUE');
    const devolvidas = entregas.rows.filter(e => e.status === 'DEVOLVIDO');

    res.json({
      success: true,
      data: {
        colaborador_id,
        total_entregas: entregas.rows.length,
        entregas_ativas: ativas.length,
        entregas_devolvidas: devolvidas.length,
        entregas: entregas.rows,
      },
    });
  } catch (error) {
    console.error('Erro ao buscar histórico:', error);
    res.status(500).json({ error: 'Erro ao buscar histórico' });
  }
};

export const getEPIsVencidos = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT 
        ee.*,
        e.codigo as epi_codigo,
        e.nome as epi_nome,
        e.ca as epi_ca
      FROM entregas_epi ee
      INNER JOIN epis e ON ee.epi_id = e.id
      WHERE ee.status = $1 AND ee.data_validade < CURRENT_DATE
      ORDER BY ee.data_validade ASC`,
      ['ENTREGUE']
    );

    res.json({ success: true, data: result.rows });
  } catch (error) {
    console.error('Erro ao buscar EPIs vencidos:', error);
    res.status(500).json({ error: 'Erro ao buscar EPIs vencidos' });
  }
};

export const getEPIsAVencer = async (req, res) => {
  try {
    const { dias = 30 } = req.query;

    const result = await pool.query(
      `SELECT 
        ee.*,
        e.codigo as epi_codigo,
        e.nome as epi_nome,
        e.ca as epi_ca
      FROM entregas_epi ee
      INNER JOIN epis e ON ee.epi_id = e.id
      WHERE ee.status = $1 
        AND ee.data_validade >= CURRENT_DATE
        AND ee.data_validade <= CURRENT_DATE + INTERVAL '${dias} days'
      ORDER BY ee.data_validade ASC`,
      ['ENTREGUE']
    );

    res.json({ success: true, data: result.rows });
  } catch (error) {
    console.error('Erro ao buscar EPIs a vencer:', error);
    res.status(500).json({ error: 'Erro ao buscar EPIs a vencer' });
  }
};

