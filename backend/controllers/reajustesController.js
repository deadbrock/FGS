import { pool } from '../server.js';
import { v4 as uuidv4 } from 'uuid';

// =============================================
// LISTAR HISTÓRICO DE REAJUSTES
// =============================================

export const getHistoricoReajustes = async (req, res) => {
  try {
    const { id: colaboradorId } = req.params;

    // Verificar se colaborador existe
    const colaboradorCheck = await pool.query(
      'SELECT id, nome_completo FROM colaboradores WHERE id = $1',
      [colaboradorId]
    );

    if (colaboradorCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Colaborador não encontrado'
      });
    }

    // Buscar histórico de reajustes
    const result = await pool.query(
      `SELECT 
        r.*,
        u.nome as aprovado_por_nome
      FROM historico_reajustes_salario r
      LEFT JOIN users u ON r.aprovado_por = u.id
      WHERE r.colaborador_id = $1
      ORDER BY r.data_reajuste DESC, r.created_at DESC`,
      [colaboradorId]
    );

    res.json({
      success: true,
      data: result.rows,
      colaborador: {
        id: colaboradorCheck.rows[0].id,
        nome: colaboradorCheck.rows[0].nome_completo
      }
    });
  } catch (error) {
    console.error('Erro ao buscar histórico de reajustes:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao buscar histórico de reajustes',
      message: error.message
    });
  }
};

// =============================================
// CRIAR REAJUSTE
// =============================================

export const createReajuste = async (req, res) => {
  try {
    const { id: colaboradorId } = req.params;
    const {
      salario_anterior,
      salario_novo,
      data_reajuste,
      data_efetivacao,
      motivo,
      observacoes
    } = req.body;

    // Validações
    if (!salario_anterior || !salario_novo || !data_reajuste || !data_efetivacao) {
      return res.status(400).json({
        success: false,
        error: 'Campos obrigatórios: salario_anterior, salario_novo, data_reajuste, data_efetivacao'
      });
    }

    // Verificar se colaborador existe e buscar salário atual
    const colaboradorCheck = await pool.query(
      'SELECT id, nome_completo, salario FROM colaboradores WHERE id = $1',
      [colaboradorId]
    );

    if (colaboradorCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Colaborador não encontrado'
      });
    }

    const salarioAtual = colaboradorCheck.rows[0].salario;

    // Calcular percentual de reajuste
    const percentual_reajuste = ((salario_novo - salario_anterior) / salario_anterior) * 100;

    const reajusteId = uuidv4();
    const userId = req.user?.id || null;

    // Inserir reajuste
    const result = await pool.query(
      `INSERT INTO historico_reajustes_salario (
        id, colaborador_id, salario_anterior, salario_novo,
        percentual_reajuste, data_reajuste, data_efetivacao,
        motivo, observacoes, aprovado_por, data_aprovacao, created_by
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, CURRENT_TIMESTAMP, $11)
      RETURNING *`,
      [
        reajusteId,
        colaboradorId,
        salario_anterior,
        salario_novo,
        percentual_reajuste,
        data_reajuste,
        data_efetivacao,
        motivo || null,
        observacoes || null,
        userId,
        userId
      ]
    );

    // Atualizar salário do colaborador se a data de efetivação for hoje ou anterior
    const hoje = new Date();
    const dataEfetivacao = new Date(data_efetivacao);
    
    if (dataEfetivacao <= hoje) {
      await pool.query(
        'UPDATE colaboradores SET salario = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
        [salario_novo, colaboradorId]
      );
    }

    console.log('✅ Reajuste criado:', reajusteId);

    res.status(201).json({
      success: true,
      message: 'Reajuste registrado com sucesso',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Erro ao criar reajuste:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao criar reajuste',
      message: error.message
    });
  }
};

// =============================================
// ATUALIZAR REAJUSTE
// =============================================

export const updateReajuste = async (req, res) => {
  try {
    const { id: colaboradorId, reajusteId } = req.params;
    const {
      salario_anterior,
      salario_novo,
      data_reajuste,
      data_efetivacao,
      motivo,
      observacoes
    } = req.body;

    // Verificar se reajuste existe e pertence ao colaborador
    const reajusteCheck = await pool.query(
      'SELECT * FROM historico_reajustes_salario WHERE id = $1 AND colaborador_id = $2',
      [reajusteId, colaboradorId]
    );

    if (reajusteCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Reajuste não encontrado'
      });
    }

    // Calcular percentual se salários foram alterados
    let percentual_reajuste = reajusteCheck.rows[0].percentual_reajuste;
    if (salario_anterior && salario_novo) {
      percentual_reajuste = ((salario_novo - salario_anterior) / salario_anterior) * 100;
    }

    // Atualizar reajuste
    const updates = [];
    const values = [];
    let paramIndex = 1;

    if (salario_anterior !== undefined) {
      updates.push(`salario_anterior = $${paramIndex++}`);
      values.push(salario_anterior);
    }
    if (salario_novo !== undefined) {
      updates.push(`salario_novo = $${paramIndex++}`);
      values.push(salario_novo);
    }
    if (percentual_reajuste !== undefined) {
      updates.push(`percentual_reajuste = $${paramIndex++}`);
      values.push(percentual_reajuste);
    }
    if (data_reajuste) {
      updates.push(`data_reajuste = $${paramIndex++}`);
      values.push(data_reajuste);
    }
    if (data_efetivacao) {
      updates.push(`data_efetivacao = $${paramIndex++}`);
      values.push(data_efetivacao);
    }
    if (motivo !== undefined) {
      updates.push(`motivo = $${paramIndex++}`);
      values.push(motivo);
    }
    if (observacoes !== undefined) {
      updates.push(`observacoes = $${paramIndex++}`);
      values.push(observacoes);
    }

    updates.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(reajusteId);

    const query = `
      UPDATE historico_reajustes_salario 
      SET ${updates.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING *
    `;

    const result = await pool.query(query, values);

    // Atualizar salário do colaborador se necessário
    if (salario_novo && data_efetivacao) {
      const hoje = new Date();
      const dataEfetivacao = new Date(data_efetivacao);
      
      if (dataEfetivacao <= hoje) {
        await pool.query(
          'UPDATE colaboradores SET salario = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
          [salario_novo, colaboradorId]
        );
      }
    }

    console.log('✅ Reajuste atualizado:', reajusteId);

    res.json({
      success: true,
      message: 'Reajuste atualizado com sucesso',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Erro ao atualizar reajuste:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao atualizar reajuste',
      message: error.message
    });
  }
};

// =============================================
// DELETAR REAJUSTE
// =============================================

export const deleteReajuste = async (req, res) => {
  try {
    const { id: colaboradorId, reajusteId } = req.params;

    // Verificar se reajuste existe e pertence ao colaborador
    const reajusteCheck = await pool.query(
      'SELECT * FROM historico_reajustes_salario WHERE id = $1 AND colaborador_id = $2',
      [reajusteId, colaboradorId]
    );

    if (reajusteCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Reajuste não encontrado'
      });
    }

    // Deletar reajuste
    await pool.query(
      'DELETE FROM historico_reajustes_salario WHERE id = $1',
      [reajusteId]
    );

    console.log('✅ Reajuste deletado:', reajusteId);

    res.json({
      success: true,
      message: 'Reajuste deletado com sucesso'
    });
  } catch (error) {
    console.error('Erro ao deletar reajuste:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao deletar reajuste',
      message: error.message
    });
  }
};

