import { pool } from '../server.js';

// =============================================
// RELATÓRIOS GERAIS
// =============================================

// Dashboard Geral
export const getDashboard = async (req, res) => {
  try {
    // Total de colaboradores ativos
    const totalAtivos = await pool.query(
      "SELECT COUNT(*) FROM colaboradores WHERE status = 'ATIVO'"
    );

    // Total de colaboradores inativos
    const totalInativos = await pool.query(
      "SELECT COUNT(*) FROM colaboradores WHERE status = 'INATIVO'"
    );

    // Total de benefícios ativos
    const totalBeneficios = await pool.query(
      "SELECT COUNT(*) FROM colaboradores_beneficios WHERE status = 'ATIVO'"
    );

    // Total de treinamentos (colaboradores treinados)
    const totalTreinados = await pool.query(
      "SELECT COUNT(DISTINCT colaborador_id) FROM colaboradores_treinamentos"
    );

    // Admissões nos últimos 30 dias
    const admisoesRecentes = await pool.query(`
      SELECT COUNT(*) 
      FROM colaboradores 
      WHERE data_admissao >= CURRENT_DATE - INTERVAL '30 days'
    `);

    // Demissões nos últimos 30 dias
    const demissoesRecentes = await pool.query(`
      SELECT COUNT(*) 
      FROM colaboradores 
      WHERE data_demissao >= CURRENT_DATE - INTERVAL '30 days'
        AND status = 'INATIVO'
    `);

    // Colaboradores por estado (top 5)
    const porEstado = await pool.query(`
      SELECT local_trabalho, COUNT(*) as total
      FROM colaboradores
      WHERE status = 'ATIVO' AND local_trabalho IS NOT NULL
      GROUP BY local_trabalho
      ORDER BY total DESC
      LIMIT 5
    `);

    // Colaboradores por departamento (top 5)
    const porDepartamento = await pool.query(`
      SELECT departamento, COUNT(*) as total
      FROM colaboradores
      WHERE status = 'ATIVO' AND departamento IS NOT NULL
      GROUP BY departamento
      ORDER BY total DESC
      LIMIT 5
    `);

    // Colaboradores por gênero
    const porGenero = await pool.query(`
      SELECT genero, COUNT(*) as total
      FROM colaboradores
      WHERE status = 'ATIVO'
      GROUP BY genero
    `);

    res.json({
      success: true,
      data: {
        totais: {
          colaboradoresAtivos: parseInt(totalAtivos.rows[0].count),
          colaboradoresInativos: parseInt(totalInativos.rows[0].count),
          beneficiosAtivos: parseInt(totalBeneficios.rows[0].count),
          colaboradoresTreinados: parseInt(totalTreinados.rows[0].count)
        },
        ultimos30Dias: {
          admissoes: parseInt(admisoesRecentes.rows[0].count),
          demissoes: parseInt(demissoesRecentes.rows[0].count)
        },
        distribuicao: {
          porEstado: porEstado.rows,
          porDepartamento: porDepartamento.rows,
          porGenero: porGenero.rows
        }
      }
    });

  } catch (error) {
    console.error('Erro ao buscar dashboard:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao buscar dashboard',
      message: error.message
    });
  }
};

// Relatório de Colaboradores
export const getRelatorioColaboradores = async (req, res) => {
  try {
    const {
      status,
      departamento,
      cargo,
      local_trabalho,
      genero,
      data_admissao_inicio,
      data_admissao_fim,
      formato = 'json' // json, csv
    } = req.query;

    let query = `
      SELECT 
        id,
        nome_completo as nome,
        cpf,
        matricula,
        cargo,
        departamento,
        local_trabalho,
        genero,
        data_admissao,
        data_demissao,
        status,
        salario,
        email_corporativo,
        telefone_corporativo
      FROM colaboradores
      WHERE 1=1
    `;

    const params = [];
    let paramIndex = 1;

    if (status) {
      query += ` AND status = $${paramIndex}`;
      params.push(status);
      paramIndex++;
    }

    if (departamento) {
      query += ` AND departamento ILIKE $${paramIndex}`;
      params.push(`%${departamento}%`);
      paramIndex++;
    }

    if (cargo) {
      query += ` AND cargo ILIKE $${paramIndex}`;
      params.push(`%${cargo}%`);
      paramIndex++;
    }

    if (local_trabalho) {
      query += ` AND local_trabalho = $${paramIndex}`;
      params.push(local_trabalho);
      paramIndex++;
    }

    if (genero) {
      query += ` AND genero = $${paramIndex}`;
      params.push(genero);
      paramIndex++;
    }

    if (data_admissao_inicio) {
      query += ` AND data_admissao >= $${paramIndex}`;
      params.push(data_admissao_inicio);
      paramIndex++;
    }

    if (data_admissao_fim) {
      query += ` AND data_admissao <= $${paramIndex}`;
      params.push(data_admissao_fim);
      paramIndex++;
    }

    query += ' ORDER BY nome_completo ASC';

    const result = await pool.query(query, params);

    if (formato === 'csv') {
      // Converter para CSV
      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false,
          error: 'Nenhum dado encontrado para gerar CSV'
        });
      }

      const headers = Object.keys(result.rows[0]).join(',');
      const rows = result.rows.map(row => 
        Object.values(row).map(val => 
          typeof val === 'string' ? `"${val}"` : val
        ).join(',')
      ).join('\n');

      const csv = `${headers}\n${rows}`;

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=colaboradores.csv');
      return res.send(csv);
    }

    res.json({
      success: true,
      data: result.rows,
      total: result.rows.length
    });

  } catch (error) {
    console.error('Erro ao gerar relatório de colaboradores:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao gerar relatório de colaboradores',
      message: error.message
    });
  }
};

// Relatório de Benefícios
export const getRelatorioBeneficios = async (req, res) => {
  try {
    const {
      tipo_beneficio_id,
      status,
      data_inicio_inicio,
      data_inicio_fim
    } = req.query;

    let query = `
      SELECT 
        cb.id,
        c.nome_completo as colaborador,
        c.cpf,
        c.matricula,
        bt.nome as beneficio,
        cb.valor,
        cb.data_inicio,
        cb.data_fim,
        cb.status
      FROM colaboradores_beneficios cb
      JOIN colaboradores c ON cb.colaborador_id = c.id
      JOIN beneficios_tipos bt ON cb.tipo_beneficio_id = bt.id
      WHERE 1=1
    `;

    const params = [];
    let paramIndex = 1;

    if (tipo_beneficio_id) {
      query += ` AND cb.tipo_beneficio_id = $${paramIndex}`;
      params.push(tipo_beneficio_id);
      paramIndex++;
    }

    if (status) {
      query += ` AND cb.status = $${paramIndex}`;
      params.push(status);
      paramIndex++;
    }

    if (data_inicio_inicio) {
      query += ` AND cb.data_inicio >= $${paramIndex}`;
      params.push(data_inicio_inicio);
      paramIndex++;
    }

    if (data_inicio_fim) {
      query += ` AND cb.data_inicio <= $${paramIndex}`;
      params.push(data_inicio_fim);
      paramIndex++;
    }

    query += ' ORDER BY c.nome_completo, bt.nome';

    const result = await pool.query(query, params);

    // Calcular total de custos
    let custoTotal = 0;
    result.rows.forEach(row => {
      if (row.status === 'ATIVO' && row.valor) {
        custoTotal += parseFloat(row.valor);
      }
    });

    res.json({
      success: true,
      data: result.rows,
      total: result.rows.length,
      custoTotalMensal: custoTotal.toFixed(2)
    });

  } catch (error) {
    console.error('Erro ao gerar relatório de benefícios:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao gerar relatório de benefícios',
      message: error.message
    });
  }
};

// Relatório de Treinamentos
export const getRelatorioTreinamentos = async (req, res) => {
  try {
    const {
      treinamento_id,
      status,
      data_conclusao_inicio,
      data_conclusao_fim,
      vencidos // true/false
    } = req.query;

    let query = `
      SELECT 
        ct.id,
        c.nome_completo as colaborador,
        c.cpf,
        c.matricula,
        t.nome as treinamento,
        t.tipo as tipo_treinamento,
        ct.data_conclusao,
        ct.data_validade,
        ct.status,
        ct.nota,
        CASE 
          WHEN ct.data_validade IS NOT NULL AND ct.data_validade < CURRENT_DATE THEN true
          ELSE false
        END as vencido
      FROM colaboradores_treinamentos ct
      JOIN colaboradores c ON ct.colaborador_id = c.id
      JOIN treinamentos t ON ct.treinamento_id = t.id
      WHERE 1=1
    `;

    const params = [];
    let paramIndex = 1;

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

    if (data_conclusao_inicio) {
      query += ` AND ct.data_conclusao >= $${paramIndex}`;
      params.push(data_conclusao_inicio);
      paramIndex++;
    }

    if (data_conclusao_fim) {
      query += ` AND ct.data_conclusao <= $${paramIndex}`;
      params.push(data_conclusao_fim);
      paramIndex++;
    }

    if (vencidos === 'true') {
      query += ` AND ct.data_validade IS NOT NULL AND ct.data_validade < CURRENT_DATE`;
    } else if (vencidos === 'false') {
      query += ` AND (ct.data_validade IS NULL OR ct.data_validade >= CURRENT_DATE)`;
    }

    query += ' ORDER BY c.nome_completo, t.nome';

    const result = await pool.query(query, params);

    res.json({
      success: true,
      data: result.rows,
      total: result.rows.length
    });

  } catch (error) {
    console.error('Erro ao gerar relatório de treinamentos:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao gerar relatório de treinamentos',
      message: error.message
    });
  }
};

// Relatório de Aniversariantes
export const getRelatorioAniversariantes = async (req, res) => {
  try {
    const { mes } = req.query; // 1-12

    if (!mes) {
      return res.status(400).json({
        success: false,
        error: 'Campo obrigatório: mes (1-12)'
      });
    }

    const result = await pool.query(`
      SELECT 
        id,
        nome_completo as nome,
        cpf,
        matricula,
        cargo,
        departamento,
        data_nascimento,
        email_corporativo,
        telefone_corporativo,
        EXTRACT(DAY FROM data_nascimento) as dia
      FROM colaboradores
      WHERE status = 'ATIVO'
        AND EXTRACT(MONTH FROM data_nascimento) = $1
      ORDER BY EXTRACT(DAY FROM data_nascimento) ASC, nome_completo ASC
    `, [mes]);

    res.json({
      success: true,
      data: result.rows,
      total: result.rows.length
    });

  } catch (error) {
    console.error('Erro ao gerar relatório de aniversariantes:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao gerar relatório de aniversariantes',
      message: error.message
    });
  }
};

// Relatório de Férias
export const getRelatorioFerias = async (req, res) => {
  try {
    const {
      colaborador_id,
      status,
      periodo_inicio,
      periodo_fim
    } = req.query;

    let query = `
      SELECT 
        f.id,
        c.nome_completo as colaborador,
        c.cpf,
        c.matricula,
        c.departamento,
        f.periodo_aquisitivo_inicio,
        f.periodo_aquisitivo_fim,
        f.data_inicio,
        f.data_fim,
        f.dias,
        f.status,
        f.abono_pecuniario
      FROM ferias f
      JOIN colaboradores c ON f.colaborador_id = c.id
      WHERE 1=1
    `;

    const params = [];
    let paramIndex = 1;

    if (colaborador_id) {
      query += ` AND f.colaborador_id = $${paramIndex}`;
      params.push(colaborador_id);
      paramIndex++;
    }

    if (status) {
      query += ` AND f.status = $${paramIndex}`;
      params.push(status);
      paramIndex++;
    }

    if (periodo_inicio) {
      query += ` AND f.data_inicio >= $${paramIndex}`;
      params.push(periodo_inicio);
      paramIndex++;
    }

    if (periodo_fim) {
      query += ` AND f.data_fim <= $${paramIndex}`;
      params.push(periodo_fim);
      paramIndex++;
    }

    query += ' ORDER BY f.data_inicio DESC, c.nome_completo';

    const result = await pool.query(query, params);

    res.json({
      success: true,
      data: result.rows,
      total: result.rows.length
    });

  } catch (error) {
    console.error('Erro ao gerar relatório de férias:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao gerar relatório de férias',
      message: error.message
    });
  }
};

