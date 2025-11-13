import { pool } from '../server.js';

// =============================================
// HELPER: Calcular horas trabalhadas
// =============================================
function calcularHorasTrabalhadas(entrada1, saida1, entrada2, saida2) {
  let totalMinutos = 0;

  if (entrada1 && saida1) {
    const diff1 = new Date(saida1) - new Date(entrada1);
    totalMinutos += diff1 / (1000 * 60);
  }

  if (entrada2 && saida2) {
    const diff2 = new Date(saida2) - new Date(entrada2);
    totalMinutos += diff2 / (1000 * 60);
  }

  return (totalMinutos / 60).toFixed(2); // Retorna em horas decimais
}

// =============================================
// CONFIGURAÇÕES DE JORNADA
// =============================================

// GET ALL - Listar configurações
export const getConfiguracoes = async (req, res) => {
  try {
    const { ativo } = req.query;

    let query = 'SELECT * FROM ponto_configuracoes WHERE 1=1';
    const params = [];

    if (ativo !== undefined) {
      query += ' AND ativo = $1';
      params.push(ativo === 'true');
    }

    query += ' ORDER BY nome ASC';

    const result = await pool.query(query, params);

    res.json({
      success: true,
      data: result.rows
    });

  } catch (error) {
    console.error('Erro ao buscar configurações:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao buscar configurações',
      message: error.message
    });
  }
};

// CREATE - Criar configuração
export const createConfiguracao = async (req, res) => {
  try {
    const {
      nome,
      descricao,
      tipo_jornada,
      horas_dia,
      horas_semana,
      entrada_1,
      saida_1,
      entrada_2,
      saida_2,
      intervalo_minutos,
      tolerancia_atraso_minutos,
      permite_banco_horas,
      ativo
    } = req.body;

    if (!nome || !tipo_jornada) {
      return res.status(400).json({
        success: false,
        error: 'Campos obrigatórios: nome, tipo_jornada'
      });
    }

    const result = await pool.query(`
      INSERT INTO ponto_configuracoes (
        nome, descricao, tipo_jornada, horas_dia, horas_semana,
        entrada_1, saida_1, entrada_2, saida_2,
        intervalo_minutos, tolerancia_atraso_minutos,
        permite_banco_horas, ativo
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      RETURNING *
    `, [
      nome, descricao, tipo_jornada, horas_dia, horas_semana,
      entrada_1, saida_1, entrada_2, saida_2,
      intervalo_minutos || 60,
      tolerancia_atraso_minutos || 10,
      permite_banco_horas !== false,
      ativo !== false
    ]);

    console.log('✅ Configuração de jornada criada:', result.rows[0].nome);

    res.status(201).json({
      success: true,
      message: 'Configuração criada com sucesso',
      data: result.rows[0]
    });

  } catch (error) {
    console.error('Erro ao criar configuração:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao criar configuração',
      message: error.message
    });
  }
};

// =============================================
// REGISTROS DE PONTO
// =============================================

// GET ALL - Listar registros de ponto
export const getRegistros = async (req, res) => {
  try {
    const {
      colaborador_id,
      data_inicio,
      data_fim,
      status,
      tipo_dia,
      limit = 100,
      offset = 0
    } = req.query;

    let query = `
      SELECT 
        pr.*,
        c.nome_completo as colaborador_nome,
        c.cpf as colaborador_cpf
      FROM ponto_registros pr
      JOIN colaboradores c ON pr.colaborador_id = c.id
      WHERE 1=1
    `;

    const params = [];
    let paramIndex = 1;

    if (colaborador_id) {
      query += ` AND pr.colaborador_id = $${paramIndex}`;
      params.push(colaborador_id);
      paramIndex++;
    }

    if (data_inicio) {
      query += ` AND pr.data >= $${paramIndex}`;
      params.push(data_inicio);
      paramIndex++;
    }

    if (data_fim) {
      query += ` AND pr.data <= $${paramIndex}`;
      params.push(data_fim);
      paramIndex++;
    }

    if (status) {
      query += ` AND pr.status = $${paramIndex}`;
      params.push(status);
      paramIndex++;
    }

    if (tipo_dia) {
      query += ` AND pr.tipo_dia = $${paramIndex}`;
      params.push(tipo_dia);
      paramIndex++;
    }

    query += ` ORDER BY pr.data DESC, c.nome_completo ASC`;
    query += ` LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    params.push(limit, offset);

    const result = await pool.query(query, params);

    // Contar total
    let countQuery = 'SELECT COUNT(*) FROM ponto_registros pr WHERE 1=1';
    const countParams = [];
    let countIndex = 1;

    if (colaborador_id) {
      countQuery += ` AND pr.colaborador_id = $${countIndex}`;
      countParams.push(colaborador_id);
      countIndex++;
    }

    if (data_inicio) {
      countQuery += ` AND pr.data >= $${countIndex}`;
      countParams.push(data_inicio);
      countIndex++;
    }

    if (data_fim) {
      countQuery += ` AND pr.data <= $${countIndex}`;
      countParams.push(data_fim);
      countIndex++;
    }

    if (status) {
      countQuery += ` AND pr.status = $${countIndex}`;
      countParams.push(status);
      countIndex++;
    }

    if (tipo_dia) {
      countQuery += ` AND pr.tipo_dia = $${countIndex}`;
      countParams.push(tipo_dia);
    }

    const countResult = await pool.query(countQuery, countParams);
    const total = parseInt(countResult.rows[0].count);

    res.json({
      success: true,
      data: result.rows,
      pagination: {
        total,
        limit: parseInt(limit),
        offset: parseInt(offset),
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Erro ao buscar registros de ponto:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao buscar registros',
      message: error.message
    });
  }
};

// GET BY ID
export const getRegistroById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(`
      SELECT 
        pr.*,
        c.nome_completo as colaborador_nome,
        c.cpf as colaborador_cpf
      FROM ponto_registros pr
      JOIN colaboradores c ON pr.colaborador_id = c.id
      WHERE pr.id = $1
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Registro de ponto não encontrado'
      });
    }

    res.json({
      success: true,
      data: result.rows[0]
    });

  } catch (error) {
    console.error('Erro ao buscar registro:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao buscar registro',
      message: error.message
    });
  }
};

// CREATE/UPDATE - Registrar ponto
export const registrarPonto = async (req, res) => {
  try {
    const {
      colaborador_id,
      data,
      entrada_1,
      saida_1,
      entrada_2,
      saida_2,
      tipo_dia,
      falta_justificada,
      justificativa,
      observacoes
    } = req.body;

    if (!colaborador_id || !data) {
      return res.status(400).json({
        success: false,
        error: 'Campos obrigatórios: colaborador_id, data'
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

    // Calcular horas trabalhadas
    const horasTrabalhadas = calcularHorasTrabalhadas(
      entrada_1, saida_1, entrada_2, saida_2
    );

    // Verificar se já existe registro para esta data
    const existingCheck = await pool.query(
      'SELECT id FROM ponto_registros WHERE colaborador_id = $1 AND data = $2',
      [colaborador_id, data]
    );

    let result;

    if (existingCheck.rows.length > 0) {
      // UPDATE
      result = await pool.query(`
        UPDATE ponto_registros
        SET 
          entrada_1 = $1, saida_1 = $2,
          entrada_2 = $3, saida_2 = $4,
          horas_trabalhadas = $5,
          tipo_dia = $6,
          falta_justificada = $7,
          justificativa = $8,
          observacoes = $9,
          status = 'PENDENTE'
        WHERE colaborador_id = $10 AND data = $11
        RETURNING *
      `, [
        entrada_1, saida_1, entrada_2, saida_2,
        horasTrabalhadas, tipo_dia || 'NORMAL',
        falta_justificada || false, justificativa,
        observacoes, colaborador_id, data
      ]);

      console.log('✅ Ponto atualizado');

    } else {
      // INSERT
      result = await pool.query(`
        INSERT INTO ponto_registros (
          colaborador_id, data,
          entrada_1, saida_1, entrada_2, saida_2,
          horas_trabalhadas, tipo_dia,
          falta_justificada, justificativa, observacoes
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        RETURNING *
      `, [
        colaborador_id, data,
        entrada_1, saida_1, entrada_2, saida_2,
        horasTrabalhadas, tipo_dia || 'NORMAL',
        falta_justificada || false, justificativa, observacoes
      ]);

      console.log('✅ Ponto registrado');
    }

    res.status(201).json({
      success: true,
      message: 'Ponto registrado com sucesso',
      data: result.rows[0]
    });

  } catch (error) {
    console.error('Erro ao registrar ponto:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao registrar ponto',
      message: error.message
    });
  }
};

// APROVAR PONTO
export const aprovarPonto = async (req, res) => {
  try {
    const { id } = req.params;
    const { aprovar } = req.body; // true ou false

    const existsCheck = await pool.query(
      'SELECT id FROM ponto_registros WHERE id = $1',
      [id]
    );

    if (existsCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Registro de ponto não encontrado'
      });
    }

    const result = await pool.query(`
      UPDATE ponto_registros
      SET 
        status = $1,
        aprovado_por = $2,
        data_aprovacao = CURRENT_TIMESTAMP
      WHERE id = $3
      RETURNING *
    `, [
      aprovar ? 'APROVADO' : 'REJEITADO',
      req.user?.id || null,
      id
    ]);

    console.log(`✅ Ponto ${aprovar ? 'aprovado' : 'rejeitado'}`);

    res.json({
      success: true,
      message: `Ponto ${aprovar ? 'aprovado' : 'rejeitado'} com sucesso`,
      data: result.rows[0]
    });

  } catch (error) {
    console.error('Erro ao aprovar ponto:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao aprovar ponto',
      message: error.message
    });
  }
};

// DELETE
export const deleteRegistro = async (req, res) => {
  try {
    const { id } = req.params;

    const existsCheck = await pool.query(
      'SELECT id FROM ponto_registros WHERE id = $1',
      [id]
    );

    if (existsCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Registro de ponto não encontrado'
      });
    }

    await pool.query('DELETE FROM ponto_registros WHERE id = $1', [id]);

    console.log('✅ Registro de ponto deletado');

    res.json({
      success: true,
      message: 'Registro deletado com sucesso'
    });

  } catch (error) {
    console.error('Erro ao deletar registro:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao deletar registro',
      message: error.message
    });
  }
};

// RELATÓRIO - Espelho de ponto
export const getEspelhoPonto = async (req, res) => {
  try {
    const { colaborador_id, mes, ano } = req.query;

    if (!colaborador_id || !mes || !ano) {
      return res.status(400).json({
        success: false,
        error: 'Campos obrigatórios: colaborador_id, mes, ano'
      });
    }

    const result = await pool.query(`
      SELECT * FROM ponto_registros
      WHERE colaborador_id = $1
        AND EXTRACT(MONTH FROM data) = $2
        AND EXTRACT(YEAR FROM data) = $3
      ORDER BY data ASC
    `, [colaborador_id, mes, ano]);

    // Calcular totais
    let totalHoras = 0;
    let totalExtras50 = 0;
    let totalExtras100 = 0;
    let totalFaltas = 0;

    result.rows.forEach(registro => {
      totalHoras += parseFloat(registro.horas_trabalhadas || 0);
      totalExtras50 += parseFloat(registro.horas_extras_50 || 0);
      totalExtras100 += parseFloat(registro.horas_extras_100 || 0);
      if (registro.tipo_dia === 'FALTA' && !registro.falta_justificada) {
        totalFaltas++;
      }
    });

    res.json({
      success: true,
      data: {
        registros: result.rows,
        totais: {
          totalHoras: totalHoras.toFixed(2),
          totalExtras50: totalExtras50.toFixed(2),
          totalExtras100: totalExtras100.toFixed(2),
          totalFaltas,
          diasTrabalhados: result.rows.filter(r => r.tipo_dia === 'NORMAL').length
        }
      }
    });

  } catch (error) {
    console.error('Erro ao gerar espelho de ponto:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao gerar espelho de ponto',
      message: error.message
    });
  }
};

// ESTATÍSTICAS
export const getEstatisticasPonto = async (req, res) => {
  try {
    console.log('📊 Buscando estatísticas de ponto...');

    // ============================================
    // ESTATÍSTICAS DE HOJE
    // ============================================
    let hoje = {
      presentes: 0,
      ausentes: 0,
      atrasados: 0,
      totalColaboradores: 0,
      percentualPresenca: 0
    };

    try {
      // Total de colaboradores ativos
      const totalColab = await pool.query(`
        SELECT COUNT(*) FROM colaboradores WHERE status = 'ATIVO'
      `);
      hoje.totalColaboradores = parseInt(totalColab.rows[0]?.count || '0');

      // Registros de hoje
      const registrosHoje = await pool.query(`
        SELECT 
          COUNT(*) FILTER (WHERE tipo_dia = 'NORMAL' AND status = 'NORMAL') as presentes,
          COUNT(*) FILTER (WHERE tipo_dia = 'FALTA') as ausentes,
          COUNT(*) FILTER (WHERE status = 'ATRASO') as atrasados
        FROM ponto_registros
        WHERE data = CURRENT_DATE
      `);

      hoje.presentes = parseInt(registrosHoje.rows[0]?.presentes || '0');
      hoje.ausentes = parseInt(registrosHoje.rows[0]?.ausentes || '0');
      hoje.atrasados = parseInt(registrosHoje.rows[0]?.atrasados || '0');
      
      if (hoje.totalColaboradores > 0) {
        hoje.percentualPresenca = Math.round((hoje.presentes / hoje.totalColaboradores) * 100);
      }

      console.log('✅ Estatísticas de hoje:', hoje);
    } catch (err) {
      console.error('⚠️ Erro ao buscar estatísticas de hoje:', err.message);
    }

    // ============================================
    // ESTATÍSTICAS DO MÊS
    // ============================================
    let mes = {
      totalRegistros: 0,
      mediaHorasTrabalhadas: 0,
      totalHorasExtras: 0,
      totalAtrasos: 0,
      totalFaltas: 0
    };

    try {
      const primeiroDiaMes = new Date();
      primeiroDiaMes.setDate(1);
      primeiroDiaMes.setHours(0, 0, 0, 0);

      // Total de registros do mês
      const totalReg = await pool.query(`
        SELECT COUNT(*) FROM ponto_registros
        WHERE data >= $1
      `, [primeiroDiaMes.toISOString().split('T')[0]]);
      mes.totalRegistros = parseInt(totalReg.rows[0]?.count || '0');

      // Média de horas trabalhadas
      const mediaHoras = await pool.query(`
        SELECT AVG(horas_trabalhadas) as media
        FROM ponto_registros
        WHERE data >= $1 AND horas_trabalhadas IS NOT NULL
      `, [primeiroDiaMes.toISOString().split('T')[0]]);
      mes.mediaHorasTrabalhadas = parseFloat(mediaHoras.rows[0]?.media || '0');

      // Total de horas extras
      const horasExtras = await pool.query(`
        SELECT 
          COALESCE(SUM(horas_extras_50), 0) + COALESCE(SUM(horas_extras_100), 0) as total
        FROM ponto_registros
        WHERE data >= $1
      `, [primeiroDiaMes.toISOString().split('T')[0]]);
      mes.totalHorasExtras = parseFloat(horasExtras.rows[0]?.total || '0');

      // Total de atrasos
      const atrasos = await pool.query(`
        SELECT COUNT(*) FROM ponto_registros
        WHERE data >= $1 AND status = 'ATRASO'
      `, [primeiroDiaMes.toISOString().split('T')[0]]);
      mes.totalAtrasos = parseInt(atrasos.rows[0]?.count || '0');

      // Total de faltas
      const faltas = await pool.query(`
        SELECT COUNT(*) FROM ponto_registros
        WHERE data >= $1 AND tipo_dia = 'FALTA'
      `, [primeiroDiaMes.toISOString().split('T')[0]]);
      mes.totalFaltas = parseInt(faltas.rows[0]?.count || '0');

      console.log('✅ Estatísticas do mês:', mes);
    } catch (err) {
      console.error('⚠️ Erro ao buscar estatísticas do mês:', err.message);
    }

    // ============================================
    // GRÁFICO DE PRESENÇA (últimos 7 dias)
    // ============================================
    let graficoPresenca = [];
    try {
      const grafico = await pool.query(`
        SELECT 
          data,
          COUNT(*) FILTER (WHERE tipo_dia = 'NORMAL' AND status = 'NORMAL') as presentes,
          COUNT(*) FILTER (WHERE tipo_dia = 'FALTA') as ausentes
        FROM ponto_registros
        WHERE data >= CURRENT_DATE - INTERVAL '7 days'
        GROUP BY data
        ORDER BY data ASC
      `);
      graficoPresenca = grafico.rows.map(row => ({
        data: row.data,
        presentes: parseInt(row.presentes || '0'),
        ausentes: parseInt(row.ausentes || '0')
      }));
      console.log('✅ Gráfico de presença:', graficoPresenca.length, 'dias');
    } catch (err) {
      console.error('⚠️ Erro ao buscar gráfico de presença:', err.message);
    }

    // ============================================
    // GRÁFICO DE ATRASOS (últimos 7 dias)
    // ============================================
    let graficoAtrasos = [];
    try {
      const grafico = await pool.query(`
        SELECT 
          data,
          COUNT(*) FILTER (WHERE status = 'ATRASO') as atrasos
        FROM ponto_registros
        WHERE data >= CURRENT_DATE - INTERVAL '7 days'
        GROUP BY data
        ORDER BY data ASC
      `);
      graficoAtrasos = grafico.rows.map(row => ({
        data: row.data,
        atrasos: parseInt(row.atrasos || '0')
      }));
      console.log('✅ Gráfico de atrasos:', graficoAtrasos.length, 'dias');
    } catch (err) {
      console.error('⚠️ Erro ao buscar gráfico de atrasos:', err.message);
    }

    const resultado = {
      hoje,
      mes,
      graficoPresenca,
      graficoAtrasos
    };

    console.log('✅ Estatísticas de ponto carregadas com sucesso');

    res.json({
      success: true,
      data: resultado
    });

  } catch (error) {
    console.error('❌ ERRO AO BUSCAR ESTATÍSTICAS DE PONTO:', error);
    console.error('Stack:', error.stack);
    // Retornar estrutura vazia ao invés de erro 500
    res.json({
      success: true,
      data: {
        hoje: {
          presentes: 0,
          ausentes: 0,
          atrasados: 0,
          totalColaboradores: 0,
          percentualPresenca: 0
        },
        mes: {
          totalRegistros: 0,
          mediaHorasTrabalhadas: 0,
          totalHorasExtras: 0,
          totalAtrasos: 0,
          totalFaltas: 0
        },
        graficoPresenca: [],
        graficoAtrasos: []
      }
    });
  }
};

