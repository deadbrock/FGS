import { pool } from '../server.js';
import { v4 as uuidv4 } from 'uuid';

// =============================================
// CRUD de EPIs
// =============================================

export const getEPIs = async (req, res) => {
  try {
    const {
      search,
      categoria,
      ativo,
      estoque_baixo,
      limit = 50,
      offset = 0,
    } = req.query;

    let query = `
      SELECT 
        e.*,
        COUNT(ee.id) FILTER (WHERE ee.status = 'ENTREGUE') as total_entregas,
        SUM(ee.quantidade) FILTER (WHERE ee.status = 'ENTREGUE') as quantidade_em_uso
      FROM epis e
      LEFT JOIN entregas_epi ee ON e.id = ee.epi_id
      WHERE 1=1
    `;
    const params = [];
    let paramIndex = 1;

    if (search) {
      query += ` AND (e.nome ILIKE $${paramIndex} OR e.codigo ILIKE $${paramIndex} OR e.ca ILIKE $${paramIndex})`;
      params.push(`%${search}%`);
      paramIndex++;
    }

    if (categoria) {
      query += ` AND e.categoria = $${paramIndex}`;
      params.push(categoria);
      paramIndex++;
    }

    if (ativo !== undefined) {
      query += ` AND e.ativo = $${paramIndex}`;
      params.push(ativo === 'true');
      paramIndex++;
    }

    query += ` GROUP BY e.id`;

    if (estoque_baixo === 'true') {
      query += ` HAVING e.quantidade_estoque <= e.estoque_minimo`;
    }

    query += ` ORDER BY e.nome ASC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    params.push(limit, offset);

    const result = await pool.query(query, params);

    // Contar total
    let countQuery = `SELECT COUNT(DISTINCT e.id) as total FROM epis e WHERE 1=1`;
    const countParams = [];
    let countParamIndex = 1;

    if (search) {
      countQuery += ` AND (e.nome ILIKE $${countParamIndex} OR e.codigo ILIKE $${countParamIndex} OR e.ca ILIKE $${countParamIndex})`;
      countParams.push(`%${search}%`);
      countParamIndex++;
    }

    if (categoria) {
      countQuery += ` AND e.categoria = $${countParamIndex}`;
      countParams.push(categoria);
      countParamIndex++;
    }

    if (ativo !== undefined) {
      countQuery += ` AND e.ativo = $${countParamIndex}`;
      countParams.push(ativo === 'true');
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
    console.error('Erro ao buscar EPIs:', error);
    res.status(500).json({ error: 'Erro ao buscar EPIs' });
  }
};

export const getEPIById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `SELECT 
        e.*,
        COUNT(ee.id) FILTER (WHERE ee.status = 'ENTREGUE') as total_entregas,
        SUM(ee.quantidade) FILTER (WHERE ee.status = 'ENTREGUE') as quantidade_em_uso
      FROM epis e
      LEFT JOIN entregas_epi ee ON e.id = ee.epi_id
      WHERE e.id = $1
      GROUP BY e.id`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'EPI não encontrado' });
    }

    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Erro ao buscar EPI:', error);
    res.status(500).json({ error: 'Erro ao buscar EPI' });
  }
};

export const createEPI = async (req, res) => {
  try {
    const {
      codigo,
      nome,
      descricao,
      categoria,
      ca,
      fabricante,
      validade_ca,
      durabilidade_meses,
      quantidade_estoque,
      estoque_minimo,
      preco_unitario,
      fornecedor,
      observacoes,
    } = req.body;

    // Validações
    if (!codigo || !nome || !categoria || !ca || !fabricante || !validade_ca || !durabilidade_meses) {
      return res.status(400).json({ error: 'Campos obrigatórios não preenchidos' });
    }

    // Verificar se código já existe
    const codigoExiste = await pool.query('SELECT id FROM epis WHERE codigo = $1', [codigo]);
    if (codigoExiste.rows.length > 0) {
      return res.status(400).json({ error: 'Código já cadastrado' });
    }

    const id = uuidv4();
    const result = await pool.query(
      `INSERT INTO epis (
        id, codigo, nome, descricao, categoria, ca, fabricante, validade_ca,
        durabilidade_meses, quantidade_estoque, estoque_minimo, preco_unitario,
        fornecedor, observacoes
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      RETURNING *`,
      [
        id, codigo, nome, descricao, categoria, ca, fabricante, validade_ca,
        durabilidade_meses, quantidade_estoque || 0, estoque_minimo || 10,
        preco_unitario || 0, fornecedor, observacoes,
      ]
    );

    // Registrar movimentação de estoque inicial
    if (quantidade_estoque > 0) {
      await pool.query(
        `INSERT INTO movimentacoes_estoque_epi (
          id, epi_id, tipo_movimentacao, quantidade, quantidade_anterior,
          quantidade_nova, motivo, responsavel_id
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [
          uuidv4(),
          id,
          'ENTRADA',
          quantidade_estoque,
          0,
          quantidade_estoque,
          'Estoque inicial',
          req.user.id,
        ]
      );
    }

    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Erro ao criar EPI:', error);
    res.status(500).json({ error: 'Erro ao criar EPI' });
  }
};

export const updateEPI = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      codigo,
      nome,
      descricao,
      categoria,
      ca,
      fabricante,
      validade_ca,
      durabilidade_meses,
      quantidade_estoque,
      estoque_minimo,
      preco_unitario,
      fornecedor,
      observacoes,
      ativo,
    } = req.body;

    // Verificar se EPI existe
    const epiExiste = await pool.query('SELECT * FROM epis WHERE id = $1', [id]);
    if (epiExiste.rows.length === 0) {
      return res.status(404).json({ error: 'EPI não encontrado' });
    }

    const epiAtual = epiExiste.rows[0];

    // Se quantidade mudou, registrar movimentação
    if (quantidade_estoque !== undefined && quantidade_estoque !== epiAtual.quantidade_estoque) {
      const diferenca = quantidade_estoque - epiAtual.quantidade_estoque;
      const tipo = diferenca > 0 ? 'ENTRADA' : 'SAIDA';
      
      await pool.query(
        `INSERT INTO movimentacoes_estoque_epi (
          id, epi_id, tipo_movimentacao, quantidade, quantidade_anterior,
          quantidade_nova, motivo, responsavel_id
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [
          uuidv4(),
          id,
          tipo,
          Math.abs(diferenca),
          epiAtual.quantidade_estoque,
          quantidade_estoque,
          'Ajuste manual de estoque',
          req.user.id,
        ]
      );
    }

    const result = await pool.query(
      `UPDATE epis SET
        codigo = COALESCE($1, codigo),
        nome = COALESCE($2, nome),
        descricao = COALESCE($3, descricao),
        categoria = COALESCE($4, categoria),
        ca = COALESCE($5, ca),
        fabricante = COALESCE($6, fabricante),
        validade_ca = COALESCE($7, validade_ca),
        durabilidade_meses = COALESCE($8, durabilidade_meses),
        quantidade_estoque = COALESCE($9, quantidade_estoque),
        estoque_minimo = COALESCE($10, estoque_minimo),
        preco_unitario = COALESCE($11, preco_unitario),
        fornecedor = COALESCE($12, fornecedor),
        observacoes = COALESCE($13, observacoes),
        ativo = COALESCE($14, ativo),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $15
      RETURNING *`,
      [
        codigo, nome, descricao, categoria, ca, fabricante, validade_ca,
        durabilidade_meses, quantidade_estoque, estoque_minimo, preco_unitario,
        fornecedor, observacoes, ativo, id,
      ]
    );

    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Erro ao atualizar EPI:', error);
    res.status(500).json({ error: 'Erro ao atualizar EPI' });
  }
};

export const deleteEPI = async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar se há entregas ativas
    const entregasAtivas = await pool.query(
      'SELECT COUNT(*) as total FROM entregas_epi WHERE epi_id = $1 AND status = $2',
      [id, 'ENTREGUE']
    );

    if (parseInt(entregasAtivas.rows[0].total) > 0) {
      return res.status(400).json({
        error: 'Não é possível excluir EPI com entregas ativas. Desative-o em vez disso.',
      });
    }

    await pool.query('DELETE FROM epis WHERE id = $1', [id]);

    res.json({ success: true, message: 'EPI excluído com sucesso' });
  } catch (error) {
    console.error('Erro ao excluir EPI:', error);
    res.status(500).json({ error: 'Erro ao excluir EPI' });
  }
};

// =============================================
// Estatísticas
// =============================================

export const getEstatisticas = async (req, res) => {
  try {
    const stats = await pool.query(`
      SELECT
        COUNT(DISTINCT e.id) as total_epis,
        SUM(e.quantidade_estoque) as total_estoque,
        COUNT(DISTINCT e.id) FILTER (WHERE e.quantidade_estoque <= e.estoque_minimo) as epis_estoque_baixo,
        COUNT(DISTINCT e.id) FILTER (WHERE e.quantidade_estoque = 0) as epis_sem_estoque,
        COUNT(DISTINCT ee.id) FILTER (WHERE ee.status = 'ENTREGUE') as total_entregas_ativas,
        SUM(ee.quantidade) FILTER (WHERE ee.status = 'ENTREGUE') as quantidade_em_uso,
        SUM(e.preco_unitario * e.quantidade_estoque) as valor_total_estoque
      FROM epis e
      LEFT JOIN entregas_epi ee ON e.id = ee.epi_id
      WHERE e.ativo = true
    `);

    res.json({ success: true, data: stats.rows[0] });
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    res.status(500).json({ error: 'Erro ao buscar estatísticas' });
  }
};

