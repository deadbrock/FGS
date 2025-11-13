import { pool } from '../server.js';

// =============================================
// TIPOS DE BENEFÍCIOS
// =============================================

// GET ALL - Listar tipos de benefícios
export const getTiposBeneficios = async (req, res) => {
  try {
    const { categoria, ativo } = req.query;

    let query = 'SELECT * FROM beneficios_tipos WHERE 1=1';
    const params = [];
    let paramIndex = 1;

    if (categoria) {
      query += ` AND categoria = $${paramIndex}`;
      params.push(categoria);
      paramIndex++;
    }

    if (ativo !== undefined) {
      query += ` AND ativo = $${paramIndex}`;
      params.push(ativo === 'true');
      paramIndex++;
    }

    query += ' ORDER BY nome ASC';

    const result = await pool.query(query, params);

    res.json({
      success: true,
      data: result.rows
    });

  } catch (error) {
    console.error('Erro ao buscar tipos de benefícios:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao buscar tipos de benefícios',
      message: error.message
    });
  }
};

// GET BY ID - Buscar tipo de benefício por ID
export const getTipoBeneficioById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'SELECT * FROM beneficios_tipos WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Tipo de benefício não encontrado'
      });
    }

    res.json({
      success: true,
      data: result.rows[0]
    });

  } catch (error) {
    console.error('Erro ao buscar tipo de benefício:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao buscar tipo de benefício',
      message: error.message
    });
  }
};

// CREATE - Criar tipo de benefício
export const createTipoBeneficio = async (req, res) => {
  try {
    const {
      nome,
      descricao,
      categoria,
      valor_padrao,
      coparticipacao,
      percentual_coparticipacao,
      fornecedor,
      ativo
    } = req.body;

    if (!nome || !categoria) {
      return res.status(400).json({
        success: false,
        error: 'Campos obrigatórios: nome, categoria'
      });
    }

    // Verificar se já existe
    const existsCheck = await pool.query(
      'SELECT id FROM beneficios_tipos WHERE nome = $1',
      [nome]
    );

    if (existsCheck.rows.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'Já existe um benefício com este nome'
      });
    }

    const result = await pool.query(`
      INSERT INTO beneficios_tipos (
        nome, descricao, categoria, valor_padrao,
        coparticipacao, percentual_coparticipacao,
        fornecedor, ativo
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `, [
      nome, descricao, categoria, valor_padrao,
      coparticipacao || false,
      percentual_coparticipacao || 0,
      fornecedor, ativo !== false
    ]);

    console.log('✅ Tipo de benefício criado:', result.rows[0].nome);

    res.status(201).json({
      success: true,
      message: 'Tipo de benefício criado com sucesso',
      data: result.rows[0]
    });

  } catch (error) {
    console.error('Erro ao criar tipo de benefício:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao criar tipo de benefício',
      message: error.message
    });
  }
};

// UPDATE - Atualizar tipo de benefício
export const updateTipoBeneficio = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const existsCheck = await pool.query(
      'SELECT id FROM beneficios_tipos WHERE id = $1',
      [id]
    );

    if (existsCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Tipo de benefício não encontrado'
      });
    }

    const fields = [];
    const values = [];
    let paramIndex = 1;

    const allowedFields = [
      'nome', 'descricao', 'categoria', 'valor_padrao',
      'coparticipacao', 'percentual_coparticipacao',
      'fornecedor', 'ativo'
    ];

    for (const field of allowedFields) {
      if (updates[field] !== undefined) {
        fields.push(`${field} = $${paramIndex}`);
        values.push(updates[field]);
        paramIndex++;
      }
    }

    if (fields.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Nenhum campo para atualizar'
      });
    }

    values.push(id);

    const query = `
      UPDATE beneficios_tipos
      SET ${fields.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING *
    `;

    const result = await pool.query(query, values);

    console.log('✅ Tipo de benefício atualizado:', result.rows[0].nome);

    res.json({
      success: true,
      message: 'Tipo de benefício atualizado com sucesso',
      data: result.rows[0]
    });

  } catch (error) {
    console.error('Erro ao atualizar tipo de benefício:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao atualizar tipo de benefício',
      message: error.message
    });
  }
};

// DELETE - Deletar tipo de benefício
export const deleteTipoBeneficio = async (req, res) => {
  try {
    const { id } = req.params;

    const existsCheck = await pool.query(
      'SELECT nome FROM beneficios_tipos WHERE id = $1',
      [id]
    );

    if (existsCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Tipo de benefício não encontrado'
      });
    }

    await pool.query('DELETE FROM beneficios_tipos WHERE id = $1', [id]);

    console.log('✅ Tipo de benefício deletado:', existsCheck.rows[0].nome);

    res.json({
      success: true,
      message: 'Tipo de benefício deletado com sucesso'
    });

  } catch (error) {
    console.error('Erro ao deletar tipo de benefício:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao deletar tipo de benefício',
      message: error.message
    });
  }
};

// =============================================
// BENEFÍCIOS POR COLABORADOR
// =============================================

// GET ALL - Listar benefícios de colaboradores
export const getColaboradoresBeneficios = async (req, res) => {
  try {
    const { colaborador_id, beneficio_tipo_id, ativo } = req.query;

    let query = `
      SELECT 
        cb.*,
        c.nome_completo as colaborador_nome,
        c.cpf as colaborador_cpf,
        bt.nome as beneficio_nome,
        bt.categoria as beneficio_categoria
      FROM colaboradores_beneficios cb
      JOIN colaboradores c ON cb.colaborador_id = c.id
      JOIN beneficios_tipos bt ON cb.beneficio_tipo_id = bt.id
      WHERE 1=1
    `;

    const params = [];
    let paramIndex = 1;

    if (colaborador_id) {
      query += ` AND cb.colaborador_id = $${paramIndex}`;
      params.push(colaborador_id);
      paramIndex++;
    }

    if (beneficio_tipo_id) {
      query += ` AND cb.beneficio_tipo_id = $${paramIndex}`;
      params.push(beneficio_tipo_id);
      paramIndex++;
    }

    if (ativo !== undefined) {
      query += ` AND cb.ativo = $${paramIndex}`;
      params.push(ativo === 'true');
      paramIndex++;
    }

    query += ' ORDER BY c.nome_completo, bt.nome';

    const result = await pool.query(query, params);

    res.json({
      success: true,
      data: result.rows
    });

  } catch (error) {
    console.error('Erro ao buscar benefícios de colaboradores:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao buscar benefícios de colaboradores',
      message: error.message
    });
  }
};

// GET BY ID
export const getColaboradorBeneficioById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(`
      SELECT 
        cb.*,
        c.nome_completo as colaborador_nome,
        bt.nome as beneficio_nome
      FROM colaboradores_beneficios cb
      JOIN colaboradores c ON cb.colaborador_id = c.id
      JOIN beneficios_tipos bt ON cb.beneficio_tipo_id = bt.id
      WHERE cb.id = $1
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Benefício não encontrado'
      });
    }

    res.json({
      success: true,
      data: result.rows[0]
    });

  } catch (error) {
    console.error('Erro ao buscar benefício:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao buscar benefício',
      message: error.message
    });
  }
};

// CREATE - Vincular benefício ao colaborador
export const createColaboradorBeneficio = async (req, res) => {
  try {
    const {
      colaborador_id,
      beneficio_tipo_id,
      valor,
      valor_coparticipacao,
      data_inicio,
      data_fim,
      observacoes
    } = req.body;

    if (!colaborador_id || !beneficio_tipo_id || !valor || !data_inicio) {
      return res.status(400).json({
        success: false,
        error: 'Campos obrigatórios: colaborador_id, beneficio_tipo_id, valor, data_inicio'
      });
    }

    // Verificar se colaborador existe
    const colaboradorCheck = await pool.query(
      'SELECT id FROM colaboradores WHERE id = $1',
      [colaborador_id]
    );

    if (colaboradorCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Colaborador não encontrado'
      });
    }

    // Verificar se tipo de benefício existe
    const beneficioCheck = await pool.query(
      'SELECT id FROM beneficios_tipos WHERE id = $1',
      [beneficio_tipo_id]
    );

    if (beneficioCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Tipo de benefício não encontrado'
      });
    }

    const result = await pool.query(`
      INSERT INTO colaboradores_beneficios (
        colaborador_id, beneficio_tipo_id, valor,
        valor_coparticipacao, data_inicio, data_fim,
        observacoes, created_by
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `, [
      colaborador_id, beneficio_tipo_id, valor,
      valor_coparticipacao || 0, data_inicio, data_fim,
      observacoes, req.user?.id || null
    ]);

    console.log('✅ Benefício vinculado ao colaborador');

    res.status(201).json({
      success: true,
      message: 'Benefício vinculado com sucesso',
      data: result.rows[0]
    });

  } catch (error) {
    console.error('Erro ao vincular benefício:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao vincular benefício',
      message: error.message
    });
  }
};

// UPDATE
export const updateColaboradorBeneficio = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const existsCheck = await pool.query(
      'SELECT id FROM colaboradores_beneficios WHERE id = $1',
      [id]
    );

    if (existsCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Benefício não encontrado'
      });
    }

    const fields = [];
    const values = [];
    let paramIndex = 1;

    const allowedFields = [
      'valor', 'valor_coparticipacao', 'data_inicio',
      'data_fim', 'ativo', 'observacoes'
    ];

    for (const field of allowedFields) {
      if (updates[field] !== undefined) {
        fields.push(`${field} = $${paramIndex}`);
        values.push(updates[field]);
        paramIndex++;
      }
    }

    if (fields.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Nenhum campo para atualizar'
      });
    }

    values.push(id);

    const query = `
      UPDATE colaboradores_beneficios
      SET ${fields.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING *
    `;

    const result = await pool.query(query, values);

    console.log('✅ Benefício atualizado');

    res.json({
      success: true,
      message: 'Benefício atualizado com sucesso',
      data: result.rows[0]
    });

  } catch (error) {
    console.error('Erro ao atualizar benefício:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao atualizar benefício',
      message: error.message
    });
  }
};

// DELETE
export const deleteColaboradorBeneficio = async (req, res) => {
  try {
    const { id } = req.params;

    const existsCheck = await pool.query(
      'SELECT id FROM colaboradores_beneficios WHERE id = $1',
      [id]
    );

    if (existsCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Benefício não encontrado'
      });
    }

    await pool.query('DELETE FROM colaboradores_beneficios WHERE id = $1', [id]);

    console.log('✅ Benefício deletado');

    res.json({
      success: true,
      message: 'Benefício deletado com sucesso'
    });

  } catch (error) {
    console.error('Erro ao deletar benefício:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao deletar benefício',
      message: error.message
    });
  }
};

// ESTATÍSTICAS
export const getEstatisticasBeneficios = async (req, res) => {
  try {
    // Total de benefícios ativos
    const totalAtivos = await pool.query(`
      SELECT COUNT(*) 
      FROM colaboradores_beneficios 
      WHERE ativo = true
    `);

    // Por categoria
    const porCategoria = await pool.query(`
      SELECT 
        bt.categoria,
        COUNT(*) as total,
        SUM(cb.valor) as valor_total
      FROM colaboradores_beneficios cb
      JOIN beneficios_tipos bt ON cb.beneficio_tipo_id = bt.id
      WHERE cb.ativo = true
      GROUP BY bt.categoria
      ORDER BY total DESC
    `);

    // Por tipo de benefício
    const porTipo = await pool.query(`
      SELECT 
        bt.nome,
        COUNT(*) as total,
        SUM(cb.valor) as valor_total,
        AVG(cb.valor) as valor_medio
      FROM colaboradores_beneficios cb
      JOIN beneficios_tipos bt ON cb.beneficio_tipo_id = bt.id
      WHERE cb.ativo = true
      GROUP BY bt.nome
      ORDER BY total DESC
    `);

    // Custo total mensal
    const custoTotal = await pool.query(`
      SELECT 
        SUM(valor) as total,
        SUM(valor_coparticipacao) as total_coparticipacao
      FROM colaboradores_beneficios
      WHERE ativo = true
    `);

    res.json({
      success: true,
      data: {
        totalAtivos: parseInt(totalAtivos.rows[0].count),
        porCategoria: porCategoria.rows,
        porTipo: porTipo.rows,
        custoTotal: custoTotal.rows[0]
      }
    });

  } catch (error) {
    console.error('Erro ao buscar estatísticas de benefícios:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao buscar estatísticas',
      message: error.message
    });
  }
};

