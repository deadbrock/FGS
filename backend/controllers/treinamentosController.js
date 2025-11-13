import { pool } from '../server.js';

// =============================================
// TREINAMENTOS (CURSOS)
// =============================================

// GET ALL - Listar treinamentos
export const getTreinamentos = async (req, res) => {
  try {
    const { tipo, nr, ativo } = req.query;

    let query = 'SELECT * FROM treinamentos WHERE 1=1';
    const params = [];
    let paramIndex = 1;

    if (tipo) {
      query += ` AND tipo = $${paramIndex}`;
      params.push(tipo);
      paramIndex++;
    }

    if (nr) {
      query += ` AND nr = $${paramIndex}`;
      params.push(nr);
      paramIndex++;
    }

    if (ativo !== undefined) {
      query += ` AND ativo = $${paramIndex}`;
      params.push(ativo === 'true');
      paramIndex++;
    }

    query += ' ORDER BY titulo ASC';

    const result = await pool.query(query, params);

    res.json({
      success: true,
      data: result.rows
    });

  } catch (error) {
    console.error('Erro ao buscar treinamentos:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao buscar treinamentos',
      message: error.message
    });
  }
};

// GET BY ID
export const getTreinamentoById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'SELECT * FROM treinamentos WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Treinamento não encontrado'
      });
    }

    res.json({
      success: true,
      data: result.rows[0]
    });

  } catch (error) {
    console.error('Erro ao buscar treinamento:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao buscar treinamento',
      message: error.message
    });
  }
};

// CREATE
export const createTreinamento = async (req, res) => {
  try {
    const {
      titulo,
      descricao,
      tipo,
      nr,
      carga_horaria,
      instrutor,
      instituicao,
      modalidade,
      local,
      validade_meses,
      ativo
    } = req.body;

    if (!titulo || !tipo || !carga_horaria) {
      return res.status(400).json({
        success: false,
        error: 'Campos obrigatórios: titulo, tipo, carga_horaria'
      });
    }

    const result = await pool.query(`
      INSERT INTO treinamentos (
        titulo, descricao, tipo, nr, carga_horaria,
        instrutor, instituicao, modalidade, local,
        validade_meses, ativo, created_by
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING *
    `, [
      titulo, descricao, tipo, nr, carga_horaria,
      instrutor, instituicao, modalidade, local,
      validade_meses, ativo !== false, req.user?.id || null
    ]);

    console.log('✅ Treinamento criado:', result.rows[0].titulo);

    res.status(201).json({
      success: true,
      message: 'Treinamento criado com sucesso',
      data: result.rows[0]
    });

  } catch (error) {
    console.error('Erro ao criar treinamento:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao criar treinamento',
      message: error.message
    });
  }
};

// UPDATE
export const updateTreinamento = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const existsCheck = await pool.query(
      'SELECT id FROM treinamentos WHERE id = $1',
      [id]
    );

    if (existsCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Treinamento não encontrado'
      });
    }

    const fields = [];
    const values = [];
    let paramIndex = 1;

    const allowedFields = [
      'titulo', 'descricao', 'tipo', 'nr', 'carga_horaria',
      'instrutor', 'instituicao', 'modalidade', 'local',
      'validade_meses', 'ativo'
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
      UPDATE treinamentos
      SET ${fields.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING *
    `;

    const result = await pool.query(query, values);

    console.log('✅ Treinamento atualizado:', result.rows[0].titulo);

    res.json({
      success: true,
      message: 'Treinamento atualizado com sucesso',
      data: result.rows[0]
    });

  } catch (error) {
    console.error('Erro ao atualizar treinamento:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao atualizar treinamento',
      message: error.message
    });
  }
};

// DELETE
export const deleteTreinamento = async (req, res) => {
  try {
    const { id } = req.params;

    const existsCheck = await pool.query(
      'SELECT titulo FROM treinamentos WHERE id = $1',
      [id]
    );

    if (existsCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Treinamento não encontrado'
      });
    }

    await pool.query('DELETE FROM treinamentos WHERE id = $1', [id]);

    console.log('✅ Treinamento deletado:', existsCheck.rows[0].titulo);

    res.json({
      success: true,
      message: 'Treinamento deletado com sucesso'
    });

  } catch (error) {
    console.error('Erro ao deletar treinamento:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao deletar treinamento',
      message: error.message
    });
  }
};

// =============================================
// TURMAS
// =============================================

// GET ALL - Listar turmas
export const getTurmas = async (req, res) => {
  try {
    const { treinamento_id, status } = req.query;

    let query = `
      SELECT 
        t.*,
        tr.titulo as treinamento_titulo,
        tr.tipo as treinamento_tipo,
        tr.carga_horaria
      FROM treinamentos_turmas t
      JOIN treinamentos tr ON t.treinamento_id = tr.id
      WHERE 1=1
    `;

    const params = [];
    let paramIndex = 1;

    if (treinamento_id) {
      query += ` AND t.treinamento_id = $${paramIndex}`;
      params.push(treinamento_id);
      paramIndex++;
    }

    if (status) {
      query += ` AND t.status = $${paramIndex}`;
      params.push(status);
      paramIndex++;
    }

    query += ' ORDER BY t.data_inicio DESC';

    const result = await pool.query(query, params);

    res.json({
      success: true,
      data: result.rows
    });

  } catch (error) {
    console.error('Erro ao buscar turmas:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao buscar turmas',
      message: error.message
    });
  }
};

// CREATE TURMA
export const createTurma = async (req, res) => {
  try {
    const {
      treinamento_id,
      codigo,
      data_inicio,
      data_fim,
      vagas,
      status
    } = req.body;

    if (!treinamento_id || !codigo || !data_inicio || !data_fim) {
      return res.status(400).json({
        success: false,
        error: 'Campos obrigatórios: treinamento_id, codigo, data_inicio, data_fim'
      });
    }

    const result = await pool.query(`
      INSERT INTO treinamentos_turmas (
        treinamento_id, codigo, data_inicio, data_fim,
        vagas, status
      ) VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `, [
      treinamento_id, codigo, data_inicio, data_fim,
      vagas || 30, status || 'ABERTA'
    ]);

    console.log('✅ Turma criada:', result.rows[0].codigo);

    res.status(201).json({
      success: true,
      message: 'Turma criada com sucesso',
      data: result.rows[0]
    });

  } catch (error) {
    console.error('Erro ao criar turma:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao criar turma',
      message: error.message
    });
  }
};

// =============================================
// TREINAMENTOS POR COLABORADOR
// =============================================

// GET ALL - Listar treinamentos de colaboradores
export const getColaboradoresTreinamentos = async (req, res) => {
  try {
    const { colaborador_id, treinamento_id, status } = req.query;

    let query = `
      SELECT 
        ct.*,
        c.nome_completo as colaborador_nome,
        c.cpf as colaborador_cpf,
        t.titulo as treinamento_titulo,
        t.tipo as treinamento_tipo,
        t.nr as treinamento_nr
      FROM colaboradores_treinamentos ct
      JOIN colaboradores c ON ct.colaborador_id = c.id
      JOIN treinamentos t ON ct.treinamento_id = t.id
      WHERE 1=1
    `;

    const params = [];
    let paramIndex = 1;

    if (colaborador_id) {
      query += ` AND ct.colaborador_id = $${paramIndex}`;
      params.push(colaborador_id);
      paramIndex++;
    }

    if (treinamento_id) {
      query += ` AND ct.treinamento_id = $${paramIndex}`;
      params.push(treinamento_id);
      paramIndex++;
    }

    if (status) {
      query += ` AND ct.status = $${paramIndex}`;
      params.push(status);
      paramIndex++;
    }

    query += ' ORDER BY ct.data_realizacao DESC';

    const result = await pool.query(query, params);

    res.json({
      success: true,
      data: result.rows
    });

  } catch (error) {
    console.error('Erro ao buscar treinamentos de colaboradores:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao buscar treinamentos de colaboradores',
      message: error.message
    });
  }
};

// CREATE - Vincular treinamento a colaborador
export const createColaboradorTreinamento = async (req, res) => {
  try {
    const {
      colaborador_id,
      treinamento_id,
      turma_id,
      data_realizacao,
      data_validade,
      presenca,
      percentual_presenca,
      status,
      nota,
      aprovado,
      certificado_url,
      certificado_numero,
      observacoes
    } = req.body;

    if (!colaborador_id || !treinamento_id || !data_realizacao) {
      return res.status(400).json({
        success: false,
        error: 'Campos obrigatórios: colaborador_id, treinamento_id, data_realizacao'
      });
    }

    const result = await pool.query(`
      INSERT INTO colaboradores_treinamentos (
        colaborador_id, treinamento_id, turma_id,
        data_realizacao, data_validade, presenca,
        percentual_presenca, status, nota, aprovado,
        certificado_url, certificado_numero, observacoes
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      RETURNING *
    `, [
      colaborador_id, treinamento_id, turma_id,
      data_realizacao, data_validade, presenca !== false,
      percentual_presenca || 100, status || 'CONCLUIDO',
      nota, aprovado, certificado_url, certificado_numero,
      observacoes
    ]);

    console.log('✅ Treinamento vinculado ao colaborador');

    res.status(201).json({
      success: true,
      message: 'Treinamento vinculado com sucesso',
      data: result.rows[0]
    });

  } catch (error) {
    console.error('Erro ao vincular treinamento:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao vincular treinamento',
      message: error.message
    });
  }
};

// ESTATÍSTICAS
export const getEstatisticasTreinamentos = async (req, res) => {
  try {
    // Total de treinamentos realizados
    const totalRealizados = await pool.query(`
      SELECT COUNT(*) 
      FROM colaboradores_treinamentos 
      WHERE status = 'CONCLUIDO'
    `);

    // Por tipo
    const porTipo = await pool.query(`
      SELECT 
        t.tipo,
        COUNT(*) as total
      FROM colaboradores_treinamentos ct
      JOIN treinamentos t ON ct.treinamento_id = t.id
      WHERE ct.status = 'CONCLUIDO'
      GROUP BY t.tipo
      ORDER BY total DESC
    `);

    // NRs vencendo (próximos 60 dias)
    const nrsVencendo = await pool.query(`
      SELECT 
        c.nome_completo,
        t.titulo,
        t.nr,
        ct.data_validade
      FROM colaboradores_treinamentos ct
      JOIN colaboradores c ON ct.colaborador_id = c.id
      JOIN treinamentos t ON ct.treinamento_id = t.id
      WHERE ct.data_validade IS NOT NULL
        AND ct.data_validade <= CURRENT_DATE + INTERVAL '60 days'
        AND ct.data_validade >= CURRENT_DATE
      ORDER BY ct.data_validade ASC
      LIMIT 50
    `);

    res.json({
      success: true,
      data: {
        totalRealizados: parseInt(totalRealizados.rows[0].count),
        porTipo: porTipo.rows,
        nrsVencendo: nrsVencendo.rows
      }
    });

  } catch (error) {
    console.error('Erro ao buscar estatísticas de treinamentos:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao buscar estatísticas',
      message: error.message
    });
  }
};

