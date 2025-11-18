import { pool } from '../server.js';

// ==========================================
// ESTATÍSTICAS DE SEGURANÇA
// ==========================================

// Função auxiliar para verificar se uma tabela existe
const tabelaExiste = async (nomeTabela) => {
  try {
    const result = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = $1
      )
    `, [nomeTabela]);
    return result.rows[0]?.exists || false;
  } catch (err) {
    return false;
  }
};

export const getEstatisticas = async (req, res) => {
  try {
    // Verificar se as tabelas de logs existem
    const logsAcessoExiste = await tabelaExiste('logs_acesso');
    const logsAlteracoesExiste = await tabelaExiste('logs_alteracoes');

    // Total de usuários
    let total = 0;
    try {
      const totalUsuarios = await pool.query(`
        SELECT COUNT(*) as total FROM users
      `);
      total = parseInt(totalUsuarios.rows[0]?.total || '0');
    } catch (err) {
      console.error('Erro ao buscar total de usuários:', err.message);
    }

    // Usuários ativos (assumindo que não há campo status, consideramos todos como ativos)
    let ativos = 0;
    try {
      const usuariosAtivos = await pool.query(`
        SELECT COUNT(*) as total FROM users
      `);
      ativos = parseInt(usuariosAtivos.rows[0]?.total || '0');
    } catch (err) {
      console.error('Erro ao buscar usuários ativos:', err.message);
    }

    // Usuários bloqueados (assumindo que não há campo bloqueado, retornamos 0)
    const bloqueados = 0;

    // Acessos hoje
    const hoje = new Date().toISOString().split('T')[0];
    let acessos = 0;
    let falhas = 0;
    if (logsAcessoExiste) {
      try {
        const acessosHoje = await pool.query(`
          SELECT COUNT(*) as total 
          FROM logs_acesso 
          WHERE DATE(data_hora) = $1 AND sucesso = true
        `, [hoje]);
        acessos = parseInt(acessosHoje.rows[0]?.total || '0');
      } catch (err) {
        console.error('Erro ao buscar acessos hoje:', err.message);
      }

      // Tentativas falhas hoje
      try {
        const tentativasFalhas = await pool.query(`
          SELECT COUNT(*) as total 
          FROM logs_acesso 
          WHERE DATE(data_hora) = $1 AND sucesso = false
        `, [hoje]);
        falhas = parseInt(tentativasFalhas.rows[0]?.total || '0');
      } catch (err) {
        console.error('Erro ao buscar tentativas falhas:', err.message);
      }
    }

    // Acessos últimos 7 dias
    let acessosUltimos7Dias = [];
    if (logsAcessoExiste) {
      try {
        const acessos7Dias = await pool.query(`
          SELECT 
            DATE(data_hora) as data,
            COUNT(*) FILTER (WHERE sucesso = true) as sucessos,
            COUNT(*) FILTER (WHERE sucesso = false) as falhas
          FROM logs_acesso
          WHERE data_hora >= CURRENT_DATE - INTERVAL '7 days'
          GROUP BY DATE(data_hora)
          ORDER BY data DESC
        `);
        acessosUltimos7Dias = acessos7Dias.rows.map(row => ({
          data: row.data,
          sucessos: parseInt(row.sucessos || '0'),
          falhas: parseInt(row.falhas || '0'),
        }));
      } catch (err) {
        console.error('Erro ao buscar acessos últimos 7 dias:', err.message);
      }
    }

    // Total de logs de acesso
    let totalAcesso = 0;
    if (logsAcessoExiste) {
      try {
        const totalLogsAcesso = await pool.query(`
          SELECT COUNT(*) as total FROM logs_acesso
        `);
        totalAcesso = parseInt(totalLogsAcesso.rows[0]?.total || '0');
      } catch (err) {
        console.error('Erro ao buscar total de logs de acesso:', err.message);
      }
    }

    // Total de logs de alterações
    let totalAlteracao = 0;
    if (logsAlteracoesExiste) {
      try {
        const totalLogsAlteracao = await pool.query(`
          SELECT COUNT(*) as total FROM logs_alteracoes
        `);
        totalAlteracao = parseInt(totalLogsAlteracao.rows[0]?.total || '0');
      } catch (err) {
        console.error('Erro ao buscar total de logs de alterações:', err.message);
      }
    }

    // Usuários por perfil
    let usuariosPorPerfilMapeados = [];
    try {
      const usuariosPorPerfil = await pool.query(`
        SELECT 
          role as perfil,
          COUNT(*) as quantidade
        FROM users
        GROUP BY role
        ORDER BY quantidade DESC
      `);
      usuariosPorPerfilMapeados = usuariosPorPerfil.rows.map(row => ({
        perfil: row.perfil,
        quantidade: parseInt(row.quantidade || '0'),
        percentual: total > 0 ? (parseInt(row.quantidade || '0') / total) * 100 : 0,
      }));
    } catch (err) {
      console.error('Erro ao buscar usuários por perfil:', err.message);
    }

    // Alertas (tentativas falhadas recentes)
    const alertas = [];
    if (falhas > 0) {
      alertas.push({
        id: '1',
        tipo: 'AVISO',
        titulo: 'Tentativas de Login Falhadas',
        mensagem: `${falhas} tentativa(s) falhada(s) detectada(s) hoje`,
        dataHora: new Date().toISOString(),
      });
    }

    res.json({
      success: true,
      data: {
        totalUsuarios: total,
        usuariosAtivos: ativos,
        usuariosInativos: 0,
        usuariosBloqueados: bloqueados,
        acessosHoje: acessos,
        tentativasFalhasHoje: falhas,
        acessosUltimos7Dias,
        totalLogsAcesso: totalAcesso,
        totalLogsAlteracao: totalAlteracao,
        usuariosPorPerfil: usuariosPorPerfilMapeados,
        alertas,
      },
    });
  } catch (error) {
    console.error('Erro ao buscar estatísticas de segurança:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao buscar estatísticas de segurança',
      message: error.message,
    });
  }
};

// ==========================================
// USUÁRIOS
// ==========================================

export const getUsuariosSeguranca = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        id,
        nome,
        email,
        role,
        cargo,
        departamento,
        avatar,
        created_at,
        updated_at
      FROM users
      ORDER BY created_at DESC
    `);

    res.json({
      success: true,
      data: result.rows || [],
    });
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao buscar usuários',
      message: error.message,
    });
  }
};

// ==========================================
// LOGS DE ACESSO
// ==========================================

export const getLogsAcesso = async (req, res) => {
  try {
    // Verificar se a tabela existe antes de fazer a query
    const existe = await tabelaExiste('logs_acesso');
    if (!existe) {
      return res.json({
        success: true,
        data: [],
      });
    }

    const { dataInicio, dataFim, usuarioId, sucesso } = req.query;

    let query = `
      SELECT 
        id,
        usuario_id,
        usuario_nome,
        email,
        acao,
        ip,
        navegador,
        sucesso,
        data_hora
      FROM logs_acesso
      WHERE 1=1
    `;
    const params = [];
    let paramIndex = 1;

    if (dataInicio) {
      query += ` AND DATE(data_hora) >= $${paramIndex}`;
      params.push(dataInicio);
      paramIndex++;
    }

    if (dataFim) {
      query += ` AND DATE(data_hora) <= $${paramIndex}`;
      params.push(dataFim);
      paramIndex++;
    }

    if (usuarioId) {
      query += ` AND usuario_id = $${paramIndex}`;
      params.push(usuarioId);
      paramIndex++;
    }

    if (sucesso !== undefined) {
      query += ` AND sucesso = $${paramIndex}`;
      params.push(sucesso === 'true');
      paramIndex++;
    }

    query += ` ORDER BY data_hora DESC LIMIT 1000`;

    const result = await pool.query(query, params);

    res.json({
      success: true,
      data: result.rows || [],
    });
  } catch (error) {
    console.error('Erro ao buscar logs de acesso:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao buscar logs de acesso',
      message: error.message,
    });
  }
};

// ==========================================
// LOGS DE ALTERAÇÕES
// ==========================================

export const getLogsAlteracao = async (req, res) => {
  try {
    // Verificar se a tabela existe antes de fazer a query
    const existe = await tabelaExiste('logs_alteracoes');
    if (!existe) {
      return res.json({
        success: true,
        data: [],
      });
    }

    const { dataInicio, dataFim, usuarioId, modulo, acao } = req.query;

    let query = `
      SELECT 
        id,
        usuario_id,
        usuario_nome,
        role,
        modulo,
        acao,
        entidade,
        entidade_id,
        campos_alterados,
        ip,
        navegador,
        data_hora
      FROM logs_alteracoes
      WHERE 1=1
    `;
    const params = [];
    let paramIndex = 1;

    if (dataInicio) {
      query += ` AND DATE(data_hora) >= $${paramIndex}`;
      params.push(dataInicio);
      paramIndex++;
    }

    if (dataFim) {
      query += ` AND DATE(data_hora) <= $${paramIndex}`;
      params.push(dataFim);
      paramIndex++;
    }

    if (usuarioId) {
      query += ` AND usuario_id = $${paramIndex}`;
      params.push(usuarioId);
      paramIndex++;
    }

    if (modulo) {
      query += ` AND modulo = $${paramIndex}`;
      params.push(modulo);
      paramIndex++;
    }

    if (acao) {
      query += ` AND acao = $${paramIndex}`;
      params.push(acao);
      paramIndex++;
    }

    query += ` ORDER BY data_hora DESC LIMIT 1000`;

    const result = await pool.query(query, params);

    res.json({
      success: true,
      data: result.rows || [],
    });
  } catch (error) {
    console.error('Erro ao buscar logs de alterações:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao buscar logs de alterações',
      message: error.message,
    });
  }
};

