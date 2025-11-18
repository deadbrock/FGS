import { pool } from '../server.js';

// ==========================================
// ESTATÍSTICAS DE SEGURANÇA
// ==========================================

export const getEstatisticas = async (req, res) => {
  try {
    // Total de usuários
    const totalUsuarios = await pool.query(`
      SELECT COUNT(*) as total FROM users
    `);
    const total = parseInt(totalUsuarios.rows[0]?.total || '0');

    // Usuários ativos (assumindo que não há campo status, consideramos todos como ativos)
    const usuariosAtivos = await pool.query(`
      SELECT COUNT(*) as total FROM users
    `);
    const ativos = parseInt(usuariosAtivos.rows[0]?.total || '0');

    // Usuários bloqueados (assumindo que não há campo bloqueado, retornamos 0)
    // Se houver campo bloqueado ou ativo = false, ajustar aqui
    const bloqueados = 0;

    // Acessos hoje
    const hoje = new Date().toISOString().split('T')[0];
    const acessosHoje = await pool.query(`
      SELECT COUNT(*) as total 
      FROM logs_acesso 
      WHERE DATE(data_hora) = $1 AND sucesso = true
    `, [hoje]);
    const acessos = parseInt(acessosHoje.rows[0]?.total || '0');

    // Tentativas falhas hoje
    const tentativasFalhas = await pool.query(`
      SELECT COUNT(*) as total 
      FROM logs_acesso 
      WHERE DATE(data_hora) = $1 AND sucesso = false
    `, [hoje]);
    const falhas = parseInt(tentativasFalhas.rows[0]?.total || '0');

    // Acessos últimos 7 dias
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
    const acessosUltimos7Dias = acessos7Dias.rows.map(row => ({
      data: row.data,
      sucessos: parseInt(row.sucessos || '0'),
      falhas: parseInt(row.falhas || '0'),
    }));

    // Total de logs de acesso
    const totalLogsAcesso = await pool.query(`
      SELECT COUNT(*) as total FROM logs_acesso
    `);
    const totalAcesso = parseInt(totalLogsAcesso.rows[0]?.total || '0');

    // Total de logs de alterações
    const totalLogsAlteracao = await pool.query(`
      SELECT COUNT(*) as total FROM logs_alteracoes
    `);
    const totalAlteracao = parseInt(totalLogsAlteracao.rows[0]?.total || '0');

    // Usuários por perfil
    const usuariosPorPerfil = await pool.query(`
      SELECT 
        role as perfil,
        COUNT(*) as quantidade
      FROM users
      GROUP BY role
      ORDER BY quantidade DESC
    `);
    const usuariosPorPerfilMapeados = usuariosPorPerfil.rows.map(row => ({
      perfil: row.perfil,
      quantidade: parseInt(row.quantidade || '0'),
      percentual: total > 0 ? (parseInt(row.quantidade || '0') / total) * 100 : 0,
    }));

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
    const { dataInicio, dataFim, usuarioId, sucesso } = req.query;

    let query = `
      SELECT 
        id,
        usuario_id,
        usuario_nome,
        email,
        role,
        acao,
        ip,
        navegador,
        sucesso,
        motivo_falha,
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

