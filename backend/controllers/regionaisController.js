import { pool } from '../server.js';

// =============================================
// ESTATÍSTICAS GERAIS
// =============================================

export const getEstatisticasGerais = async (req, res) => {
  try {
    // Total de colaboradores ativos
    const totalAtivos = await pool.query(`
      SELECT COUNT(*) as total
      FROM colaboradores
      WHERE status = 'ATIVO'
    `);

    // Por estado
    const porEstado = await pool.query(`
      SELECT 
        local_trabalho as estado,
        COUNT(*) as total,
        COUNT(CASE WHEN sexo = 'M' THEN 1 END) as masculino,
        COUNT(CASE WHEN sexo = 'F' THEN 1 END) as feminino
      FROM colaboradores
      WHERE status = 'ATIVO' AND local_trabalho IS NOT NULL
      GROUP BY local_trabalho
      ORDER BY total DESC
    `);

    // Por região (agrupamento de estados)
    const regioes = {
      'Norte': ['AC', 'AP', 'AM', 'PA', 'RO', 'RR', 'TO'],
      'Nordeste': ['AL', 'BA', 'CE', 'MA', 'PB', 'PE', 'PI', 'RN', 'SE'],
      'Centro-Oeste': ['DF', 'GO', 'MT', 'MS'],
      'Sudeste': ['ES', 'MG', 'RJ', 'SP'],
      'Sul': ['PR', 'RS', 'SC']
    };

    const porRegiao = [];
    for (const [regiao, estados] of Object.entries(regioes)) {
      const result = await pool.query(`
        SELECT COUNT(*) as total
        FROM colaboradores
        WHERE status = 'ATIVO' 
          AND local_trabalho = ANY($1)
      `, [estados]);
      
      porRegiao.push({
        regiao,
        total: parseInt(result.rows[0].total)
      });
    }

    // Distribuição por gênero
    const porGenero = await pool.query(`
      SELECT 
        sexo,
        COUNT(*) as total
      FROM colaboradores
      WHERE status = 'ATIVO'
      GROUP BY sexo
    `);

    // Top 10 cargos
    const topCargos = await pool.query(`
      SELECT 
        cargo,
        COUNT(*) as total
      FROM colaboradores
      WHERE status = 'ATIVO'
      GROUP BY cargo
      ORDER BY total DESC
      LIMIT 10
    `);

    res.json({
      success: true,
      data: {
        totalAtivos: parseInt(totalAtivos.rows[0].total),
        porEstado: porEstado.rows,
        porRegiao: porRegiao,
        porGenero: porGenero.rows,
        topCargos: topCargos.rows
      }
    });

  } catch (error) {
    console.error('Erro ao buscar estatísticas gerais:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao buscar estatísticas',
      message: error.message
    });
  }
};

// =============================================
// ESTATÍSTICAS POR ESTADO
// =============================================

export const getEstatisticasPorEstado = async (req, res) => {
  try {
    const { estado } = req.params;

    if (!estado) {
      return res.status(400).json({
        success: false,
        error: 'Estado é obrigatório'
      });
    }

    // Total de colaboradores no estado
    const total = await pool.query(`
      SELECT COUNT(*) as total
      FROM colaboradores
      WHERE status = 'ATIVO' AND local_trabalho = $1
    `, [estado]);

    // Por gênero
    const porGenero = await pool.query(`
      SELECT 
        sexo,
        COUNT(*) as total
      FROM colaboradores
      WHERE status = 'ATIVO' AND local_trabalho = $1
      GROUP BY sexo
    `, [estado]);

    // Por cargo
    const porCargo = await pool.query(`
      SELECT 
        cargo,
        COUNT(*) as total
      FROM colaboradores
      WHERE status = 'ATIVO' AND local_trabalho = $1
      GROUP BY cargo
      ORDER BY total DESC
      LIMIT 10
    `, [estado]);

    // Salário médio
    const salarioMedio = await pool.query(`
      SELECT AVG(salario) as media
      FROM colaboradores
      WHERE status = 'ATIVO' 
        AND local_trabalho = $1
        AND salario IS NOT NULL
    `, [estado]);

    res.json({
      success: true,
      data: {
        estado,
        total: parseInt(total.rows[0].total),
        porGenero: porGenero.rows,
        porCargo: porCargo.rows,
        salarioMedio: parseFloat(salarioMedio.rows[0].media || 0)
      }
    });

  } catch (error) {
    console.error('Erro ao buscar estatísticas por estado:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao buscar estatísticas',
      message: error.message
    });
  }
};

// =============================================
// LISTAR COLABORADORES POR ESTADO
// =============================================

export const getColaboradoresPorEstado = async (req, res) => {
  try {
    const { estado } = req.params;
    const { genero, cargo, limit = 50, offset = 0 } = req.query;

    let query = `
      SELECT 
        id, nome_completo, cpf, email, celular,
        cargo, departamento, data_admissao,
        salario, sexo, local_trabalho
      FROM colaboradores
      WHERE status = 'ATIVO' AND local_trabalho = $1
    `;

    const params = [estado];
    let paramIndex = 2;

    if (genero) {
      query += ` AND sexo = $${paramIndex}`;
      params.push(genero);
      paramIndex++;
    }

    if (cargo) {
      query += ` AND cargo ILIKE $${paramIndex}`;
      params.push(`%${cargo}%`);
      paramIndex++;
    }

    query += ` ORDER BY nome_completo ASC`;
    query += ` LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    params.push(limit, offset);

    const result = await pool.query(query, params);

    // Contar total
    let countQuery = `
      SELECT COUNT(*) 
      FROM colaboradores 
      WHERE status = 'ATIVO' AND local_trabalho = $1
    `;
    const countParams = [estado];
    let countIndex = 2;

    if (genero) {
      countQuery += ` AND sexo = $${countIndex}`;
      countParams.push(genero);
      countIndex++;
    }

    if (cargo) {
      countQuery += ` AND cargo ILIKE $${countIndex}`;
      countParams.push(`%${cargo}%`);
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
    console.error('Erro ao buscar colaboradores por estado:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao buscar colaboradores',
      message: error.message
    });
  }
};

// =============================================
// COLABORADORES ADMINISTRATIVOS (GLOBAL)
// =============================================

export const getColaboradoresAdministrativos = async (req, res) => {
  try {
    const { estado, genero, cargo_tipo, limit = 50, offset = 0 } = req.query;

    // Lista de cargos administrativos
    const cargosAdministrativos = [
      'SUPERVISOR', 'ENCARREGADO', 'COORDENADOR', 'GERENTE',
      'DIRETOR', 'AUXILIAR ADMINISTRATIVO', 'ASSISTENTE ADMINISTRATIVO',
      'ANALISTA ADMINISTRATIVO', 'AUXILIAR DEPARTAMENTO PESSOAL',
      'ASSISTENTE DEPARTAMENTO PESSOAL', 'ANALISTA DEPARTAMENTO PESSOAL',
      'AUXILIAR DE RH', 'AUXILIAR RH', 'ASSISTENTE DE RH', 'ASSISTENTE RH',
      'ANALISTA DE RH', 'ANALISTA RH', 'AUXILIAR FINANCEIRO',
      'ASSISTENTE FINANCEIRO', 'ANALISTA FINANCEIRO',
      'AUXILIAR DE FATURAMENTO', 'AUXILIAR FATURAMENTO',
      'ASSISTENTE DE FATURAMENTO', 'ASSISTENTE FATURAMENTO',
      'SEGURANÇA DO TRABALHO', 'TECNICO DE SEGURANÇA',
      'TÉCNICO DE SEGURANÇA', 'GERENTE OPERACIONAL', 'GERENTE ADMINISTRATIVO'
    ];

    let query = `
      SELECT 
        id, nome_completo, cpf, email, celular,
        cargo, departamento, data_admissao,
        salario, sexo, local_trabalho
      FROM colaboradores
      WHERE status = 'ATIVO'
        AND (
    `;

    // Adicionar condição para cada cargo administrativo
    const cargoConditions = cargosAdministrativos.map(cargo => 
      `cargo ILIKE '%${cargo}%'`
    ).join(' OR ');

    query += cargoConditions + ')';

    const params = [];
    let paramIndex = 1;

    if (estado) {
      query += ` AND local_trabalho = $${paramIndex}`;
      params.push(estado);
      paramIndex++;
    }

    if (genero) {
      query += ` AND sexo = $${paramIndex}`;
      params.push(genero);
      paramIndex++;
    }

    if (cargo_tipo) {
      query += ` AND cargo ILIKE $${paramIndex}`;
      params.push(`%${cargo_tipo}%`);
      paramIndex++;
    }

    query += ` ORDER BY nome_completo ASC`;
    query += ` LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    params.push(limit, offset);

    const result = await pool.query(query, params);

    // Contar total (reutilizar a mesma lógica)
    let countQuery = `
      SELECT COUNT(*) 
      FROM colaboradores
      WHERE status = 'ATIVO'
        AND (${cargoConditions})
    `;
    const countParams = [];
    let countIndex = 1;

    if (estado) {
      countQuery += ` AND local_trabalho = $${countIndex}`;
      countParams.push(estado);
      countIndex++;
    }

    if (genero) {
      countQuery += ` AND sexo = $${countIndex}`;
      countParams.push(genero);
      countIndex++;
    }

    if (cargo_tipo) {
      countQuery += ` AND cargo ILIKE $${countIndex}`;
      countParams.push(`%${cargo_tipo}%`);
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
    console.error('Erro ao buscar colaboradores administrativos:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao buscar colaboradores administrativos',
      message: error.message
    });
  }
};

// =============================================
// TODOS OS COLABORADORES (COM FILTROS)
// =============================================

export const getTodosColaboradores = async (req, res) => {
  try {
    const { 
      estado, 
      genero, 
      cargo, 
      departamento,
      search,
      limit = 50, 
      offset = 0 
    } = req.query;

    let query = `
      SELECT 
        id, nome_completo, cpf, email, celular,
        cargo, departamento, data_admissao,
        salario, sexo, local_trabalho, avatar
      FROM colaboradores
      WHERE status = 'ATIVO'
    `;

    const params = [];
    let paramIndex = 1;

    if (estado) {
      query += ` AND local_trabalho = $${paramIndex}`;
      params.push(estado);
      paramIndex++;
    }

    if (genero) {
      query += ` AND sexo = $${paramIndex}`;
      params.push(genero);
      paramIndex++;
    }

    if (cargo) {
      query += ` AND cargo ILIKE $${paramIndex}`;
      params.push(`%${cargo}%`);
      paramIndex++;
    }

    if (departamento) {
      query += ` AND departamento ILIKE $${paramIndex}`;
      params.push(`%${departamento}%`);
      paramIndex++;
    }

    if (search) {
      query += ` AND (
        nome_completo ILIKE $${paramIndex} OR
        cpf ILIKE $${paramIndex} OR
        email ILIKE $${paramIndex}
      )`;
      params.push(`%${search}%`);
      paramIndex++;
    }

    query += ` ORDER BY nome_completo ASC`;
    query += ` LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    params.push(limit, offset);

    const result = await pool.query(query, params);

    // Contar total
    let countQuery = 'SELECT COUNT(*) FROM colaboradores WHERE status = $1';
    const countParams = ['ATIVO'];
    let countIndex = 2;

    if (estado) {
      countQuery += ` AND local_trabalho = $${countIndex}`;
      countParams.push(estado);
      countIndex++;
    }

    if (genero) {
      countQuery += ` AND sexo = $${countIndex}`;
      countParams.push(genero);
      countIndex++;
    }

    if (cargo) {
      countQuery += ` AND cargo ILIKE $${countIndex}`;
      countParams.push(`%${cargo}%`);
      countIndex++;
    }

    if (departamento) {
      countQuery += ` AND departamento ILIKE $${countIndex}`;
      countParams.push(`%${departamento}%`);
      countIndex++;
    }

    if (search) {
      countQuery += ` AND (
        nome_completo ILIKE $${countIndex} OR
        cpf ILIKE $${countIndex} OR
        email ILIKE $${countIndex}
      )`;
      countParams.push(`%${search}%`);
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
    console.error('Erro ao buscar todos os colaboradores:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao buscar colaboradores',
      message: error.message
    });
  }
};

