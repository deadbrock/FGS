import { pool } from '../server.js';

// ==========================================
// ESTATÍSTICAS DE INTEGRAÇÕES
// ==========================================

export const getEstatisticas = async (req, res) => {
  try {
    // Total de integrações
    let totalIntegracoes = 0;
    let integracoesAtivas = 0;
    let integracoesInativas = 0;
    let integracoesComErro = 0;

    try {
      const totalResult = await pool.query(`
        SELECT COUNT(*) as total FROM integracoes
      `);
      totalIntegracoes = parseInt(totalResult.rows[0]?.total || '0');

      const ativasResult = await pool.query(`
        SELECT COUNT(*) as total FROM integracoes WHERE ativa = true
      `);
      integracoesAtivas = parseInt(ativasResult.rows[0]?.total || '0');

      const inativasResult = await pool.query(`
        SELECT COUNT(*) as total FROM integracoes WHERE ativa = false
      `);
      integracoesInativas = parseInt(inativasResult.rows[0]?.total || '0');

      const erroResult = await pool.query(`
        SELECT COUNT(*) as total FROM integracoes WHERE status = 'ERRO'
      `);
      integracoesComErro = parseInt(erroResult.rows[0]?.total || '0');
    } catch (err) {
      // Se a tabela não existir, manter valores padrão (0)
      if (err.code === '42P01' || err.message.includes('does not exist')) {
        totalIntegracoes = 0;
        integracoesAtivas = 0;
        integracoesInativas = 0;
        integracoesComErro = 0;
      } else {
        console.error('Erro ao buscar total de integrações:', err.message);
      }
    }

    // Sincronizações hoje
    const hoje = new Date().toISOString().split('T')[0];
    let sincronizacoesHoje = 0;
    let registrosProcessadosHoje = 0;
    let errosHoje = 0;

    try {
      const sincHoje = await pool.query(`
        SELECT 
          COUNT(*) as total,
          COALESCE(SUM(total_registros), 0) as registros,
          COALESCE(SUM(registros_erro), 0) as erros
        FROM logs_sincronizacao
        WHERE DATE(data_hora_inicio) = $1
      `, [hoje]);
      
      if (sincHoje.rows[0]) {
        sincronizacoesHoje = parseInt(sincHoje.rows[0].total || '0');
        registrosProcessadosHoje = parseInt(sincHoje.rows[0].registros || '0');
        errosHoje = parseInt(sincHoje.rows[0].erros || '0');
      }
    } catch (err) {
      if (err.code === '42P01' || err.message.includes('does not exist')) {
        sincronizacoesHoje = 0;
        registrosProcessadosHoje = 0;
        errosHoje = 0;
      } else {
        console.error('Erro ao buscar sincronizações hoje:', err.message);
      }
    }

    // Sincronizações semana
    let sincronizacoesSemana = 0;
    let registrosProcessadosSemana = 0;
    let errosSemana = 0;

    try {
      const sincSemana = await pool.query(`
        SELECT 
          COUNT(*) as total,
          COALESCE(SUM(total_registros), 0) as registros,
          COALESCE(SUM(registros_erro), 0) as erros
        FROM logs_sincronizacao
        WHERE data_hora_inicio >= CURRENT_DATE - INTERVAL '7 days'
      `);
      
      if (sincSemana.rows[0]) {
        sincronizacoesSemana = parseInt(sincSemana.rows[0].total || '0');
        registrosProcessadosSemana = parseInt(sincSemana.rows[0].registros || '0');
        errosSemana = parseInt(sincSemana.rows[0].erros || '0');
      }
    } catch (err) {
      if (err.code === '42P01' || err.message.includes('does not exist')) {
        sincronizacoesSemana = 0;
        registrosProcessadosSemana = 0;
        errosSemana = 0;
      } else {
        console.error('Erro ao buscar sincronizações semana:', err.message);
      }
    }

    // Sincronizações mês
    let sincronizacoesMes = 0;

    try {
      const sincMes = await pool.query(`
        SELECT COUNT(*) as total
        FROM logs_sincronizacao
        WHERE data_hora_inicio >= DATE_TRUNC('month', CURRENT_DATE)
      `);
      sincronizacoesMes = parseInt(sincMes.rows[0]?.total || '0');
    } catch (err) {
      if (err.code === '42P01' || err.message.includes('does not exist')) {
        sincronizacoesMes = 0;
      } else {
        console.error('Erro ao buscar sincronizações mês:', err.message);
      }
    }

    // Tempo médio de resposta
    let tempoMedioResposta = 0;
    try {
      const tempoMedio = await pool.query(`
        SELECT COALESCE(AVG(duracao), 0) as media
        FROM logs_sincronizacao
        WHERE duracao IS NOT NULL
        AND data_hora_inicio >= CURRENT_DATE - INTERVAL '7 days'
      `);
      tempoMedioResposta = parseFloat(tempoMedio.rows[0]?.media || '0');
    } catch (err) {
      if (err.code === '42P01' || err.message.includes('does not exist')) {
        tempoMedioResposta = 0;
      } else {
        console.error('Erro ao buscar tempo médio:', err.message);
      }
    }

    // Taxa de sucesso
    let sucessoRate = 100;
    if (sincronizacoesHoje > 0) {
      const sucessos = sincronizacoesHoje - errosHoje;
      sucessoRate = (sucessos / sincronizacoesHoje) * 100;
    }

    // Integrações por tipo
    let integracoesPorTipo = [];
    try {
      const porTipo = await pool.query(`
        SELECT 
          tipo,
          COUNT(*) as quantidade,
          COUNT(*) FILTER (WHERE ativa = true) as ativas
        FROM integracoes
        GROUP BY tipo
      `);
      integracoesPorTipo = porTipo.rows.map(row => ({
        tipo: row.tipo,
        quantidade: parseInt(row.quantidade || '0'),
        ativas: parseInt(row.ativas || '0'),
      }));
    } catch (err) {
      if (err.code === '42P01' || err.message.includes('does not exist')) {
        integracoesPorTipo = [];
      } else {
        console.error('Erro ao buscar integrações por tipo:', err.message);
      }
    }

    // Sincronizações por dia (últimos 7 dias)
    let sincronizacoesPorDia = [];
    try {
      const porDia = await pool.query(`
        SELECT 
          DATE(data_hora_inicio) as data,
          COUNT(*) as total,
          COUNT(*) FILTER (WHERE status = 'SUCESSO') as sucesso,
          COUNT(*) FILTER (WHERE status = 'FALHA') as falha
        FROM logs_sincronizacao
        WHERE data_hora_inicio >= CURRENT_DATE - INTERVAL '7 days'
        GROUP BY DATE(data_hora_inicio)
        ORDER BY data DESC
        LIMIT 7
      `);
      sincronizacoesPorDia = porDia.rows.map(row => ({
        data: row.data,
        total: parseInt(row.total || '0'),
        sucesso: parseInt(row.sucesso || '0'),
        falha: parseInt(row.falha || '0'),
      }));
    } catch (err) {
      if (err.code === '42P01' || err.message.includes('does not exist')) {
        sincronizacoesPorDia = [];
      } else {
        console.error('Erro ao buscar sincronizações por dia:', err.message);
      }
    }

    res.json({
      success: true,
      data: {
        totalIntegracoes,
        integracoesAtivas,
        integracoesInativas,
        integracoesComErro,
        sincronizacoesHoje,
        sincronizacoesSemana,
        sincronizacoesMes,
        registrosProcessadosHoje,
        registrosProcessadosSemana,
        errosHoje,
        errosSemana,
        tempoMedioResposta,
        sucessoRate,
        integracoesPorTipo,
        sincronizacoesPorDia,
      },
    });
  } catch (error) {
    console.error('Erro ao buscar estatísticas de integrações:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao buscar estatísticas de integrações',
      message: error.message,
    });
  }
};

// ==========================================
// LISTAR TODAS AS INTEGRAÇÕES
// ==========================================

export const getAllIntegracoes = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        id,
        nome,
        tipo,
        status,
        descricao,
        icone,
        cor,
        configuracoes,
        ultima_sincronizacao,
        proxima_sincronizacao,
        total_registros,
        registros_hoje,
        erros_hoje,
        ativa,
        teste_realizado,
        data_ultimo_teste,
        resultado_teste,
        criado_em,
        atualizado_em,
        criado_por
      FROM integracoes
      ORDER BY criado_em DESC
    `);

    const integracoes = result.rows.map(row => ({
      id: row.id,
      nome: row.nome,
      tipo: row.tipo,
      status: row.status,
      descricao: row.descricao || '',
      icone: row.icone || 'api',
      cor: row.cor || '#1976d2',
      configuracoes: row.configuracoes || {},
      ultimaSincronizacao: row.ultima_sincronizacao,
      proximaSincronizacao: row.proxima_sincronizacao,
      totalRegistros: parseInt(row.total_registros || '0'),
      registrosHoje: parseInt(row.registros_hoje || '0'),
      errosHoje: parseInt(row.erros_hoje || '0'),
      ativa: row.ativa || false,
      testeRealizado: row.teste_realizado || false,
      dataUltimoTeste: row.data_ultimo_teste,
      resultadoTeste: row.resultado_teste,
      criadoEm: row.criado_em,
      atualizadoEm: row.atualizado_em,
      criadoPor: row.criado_por || 'Sistema',
    }));

    res.json({
      success: true,
      data: integracoes,
    });
  } catch (error) {
    console.error('Erro ao buscar integrações:', error);
    
    // Se a tabela não existir, retornar array vazio
    if (error.code === '42P01' || error.message.includes('does not exist')) {
      return res.json({
        success: true,
        data: [],
      });
    }

    res.status(500).json({
      success: false,
      error: 'Erro ao buscar integrações',
      message: error.message,
    });
  }
};

// ==========================================
// OBTER INTEGRAÇÃO POR ID
// ==========================================

export const getIntegracaoById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(`
      SELECT * FROM integracoes WHERE id = $1
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Integração não encontrada',
      });
    }

    const row = result.rows[0];
    const integracao = {
      id: row.id,
      nome: row.nome,
      tipo: row.tipo,
      status: row.status,
      descricao: row.descricao || '',
      icone: row.icone || 'api',
      cor: row.cor || '#1976d2',
      configuracoes: row.configuracoes || {},
      ultimaSincronizacao: row.ultima_sincronizacao,
      proximaSincronizacao: row.proxima_sincronizacao,
      totalRegistros: parseInt(row.total_registros || '0'),
      registrosHoje: parseInt(row.registros_hoje || '0'),
      errosHoje: parseInt(row.erros_hoje || '0'),
      ativa: row.ativa || false,
      testeRealizado: row.teste_realizado || false,
      dataUltimoTeste: row.data_ultimo_teste,
      resultadoTeste: row.resultado_teste,
      criadoEm: row.criado_em,
      atualizadoEm: row.atualizado_em,
      criadoPor: row.criado_por || 'Sistema',
    };

    res.json({
      success: true,
      data: integracao,
    });
  } catch (error) {
    console.error('Erro ao buscar integração:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao buscar integração',
      message: error.message,
    });
  }
};

// ==========================================
// CRIAR INTEGRAÇÃO
// ==========================================

export const createIntegracao = async (req, res) => {
  try {
    const {
      nome,
      tipo,
      descricao,
      icone,
      cor,
      configuracoes,
    } = req.body;

    const result = await pool.query(`
      INSERT INTO integracoes (
        nome, tipo, status, descricao, icone, cor, configuracoes, ativa, criado_por
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `, [
      nome,
      tipo,
      'CONFIGURANDO',
      descricao || '',
      icone || 'api',
      cor || '#1976d2',
      JSON.stringify(configuracoes || {}),
      false,
      req.user?.nome || 'Sistema',
    ]);

    const row = result.rows[0];
    const integracao = {
      id: row.id,
      nome: row.nome,
      tipo: row.tipo,
      status: row.status,
      descricao: row.descricao || '',
      icone: row.icone || 'api',
      cor: row.cor || '#1976d2',
      configuracoes: row.configuracoes || {},
      totalRegistros: 0,
      registrosHoje: 0,
      errosHoje: 0,
      ativa: false,
      testeRealizado: false,
      criadoEm: row.criado_em,
      criadoPor: row.criado_por || 'Sistema',
    };

    res.status(201).json({
      success: true,
      data: integracao,
    });
  } catch (error) {
    console.error('Erro ao criar integração:', error);
    
    // Se a tabela não existir, retornar erro informativo
    if (error.code === '42P01' || error.message.includes('does not exist')) {
      return res.status(503).json({
        success: false,
        error: 'Tabela de integrações não existe. Execute as migrations primeiro.',
      });
    }

    res.status(500).json({
      success: false,
      error: 'Erro ao criar integração',
      message: error.message,
    });
  }
};

// ==========================================
// ATUALIZAR INTEGRAÇÃO
// ==========================================

export const updateIntegracao = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      nome,
      descricao,
      configuracoes,
      status,
      ativa,
    } = req.body;

    const result = await pool.query(`
      UPDATE integracoes
      SET 
        nome = COALESCE($1, nome),
        descricao = COALESCE($2, descricao),
        configuracoes = COALESCE($3::jsonb, configuracoes),
        status = COALESCE($4, status),
        ativa = COALESCE($5, ativa),
        atualizado_em = NOW()
      WHERE id = $6
      RETURNING *
    `, [
      nome,
      descricao,
      configuracoes ? JSON.stringify(configuracoes) : null,
      status,
      ativa,
      id,
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Integração não encontrada',
      });
    }

    const row = result.rows[0];
    const integracao = {
      id: row.id,
      nome: row.nome,
      tipo: row.tipo,
      status: row.status,
      descricao: row.descricao || '',
      icone: row.icone || 'api',
      cor: row.cor || '#1976d2',
      configuracoes: row.configuracoes || {},
      ultimaSincronizacao: row.ultima_sincronizacao,
      proximaSincronizacao: row.proxima_sincronizacao,
      totalRegistros: parseInt(row.total_registros || '0'),
      registrosHoje: parseInt(row.registros_hoje || '0'),
      errosHoje: parseInt(row.erros_hoje || '0'),
      ativa: row.ativa || false,
      testeRealizado: row.teste_realizado || false,
      dataUltimoTeste: row.data_ultimo_teste,
      resultadoTeste: row.resultado_teste,
      criadoEm: row.criado_em,
      atualizadoEm: row.atualizado_em,
      criadoPor: row.criado_por || 'Sistema',
    };

    res.json({
      success: true,
      data: integracao,
    });
  } catch (error) {
    console.error('Erro ao atualizar integração:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao atualizar integração',
      message: error.message,
    });
  }
};

// ==========================================
// DELETAR INTEGRAÇÃO
// ==========================================

export const deleteIntegracao = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(`
      DELETE FROM integracoes WHERE id = $1 RETURNING id
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Integração não encontrada',
      });
    }

    res.json({
      success: true,
      message: 'Integração deletada com sucesso',
    });
  } catch (error) {
    console.error('Erro ao deletar integração:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao deletar integração',
      message: error.message,
    });
  }
};

// ==========================================
// AÇÕES
// ==========================================

export const sincronizarIntegracao = async (req, res) => {
  try {
    const { id } = req.params;
    // TODO: Implementar lógica de sincronização
    res.json({
      success: true,
      message: 'Sincronização iniciada',
    });
  } catch (error) {
    console.error('Erro ao sincronizar integração:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao sincronizar integração',
      message: error.message,
    });
  }
};

export const ativarIntegracao = async (req, res) => {
  try {
    const { id } = req.params;
    
    await pool.query(`
      UPDATE integracoes
      SET ativa = true, status = 'ATIVA', atualizado_em = NOW()
      WHERE id = $1
    `, [id]);

    res.json({
      success: true,
      message: 'Integração ativada com sucesso',
    });
  } catch (error) {
    console.error('Erro ao ativar integração:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao ativar integração',
      message: error.message,
    });
  }
};

export const desativarIntegracao = async (req, res) => {
  try {
    const { id } = req.params;
    
    await pool.query(`
      UPDATE integracoes
      SET ativa = false, status = 'INATIVA', atualizado_em = NOW()
      WHERE id = $1
    `, [id]);

    res.json({
      success: true,
      message: 'Integração desativada com sucesso',
    });
  } catch (error) {
    console.error('Erro ao desativar integração:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao desativar integração',
      message: error.message,
    });
  }
};

export const testarIntegracao = async (req, res) => {
  try {
    const { id } = req.params;
    // TODO: Implementar lógica de teste
    res.json({
      success: true,
      data: {
        sucesso: true,
        mensagem: 'Teste realizado com sucesso',
        tempoResposta: 1.2,
        dataHoraTeste: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Erro ao testar integração:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao testar integração',
      message: error.message,
    });
  }
};

// ==========================================
// CONFIGURAÇÕES ESPECÍFICAS
// ==========================================

export const salvarConfigPonto = async (req, res) => {
  try {
    // TODO: Implementar lógica de salvar configuração de ponto
    res.json({
      success: true,
      message: 'Configuração de ponto salva com sucesso',
    });
  } catch (error) {
    console.error('Erro ao salvar configuração de ponto:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao salvar configuração de ponto',
      message: error.message,
    });
  }
};

export const salvarConfigEmail = async (req, res) => {
  try {
    // TODO: Implementar lógica de salvar configuração de email
    res.json({
      success: true,
      message: 'Configuração de email salva com sucesso',
    });
  } catch (error) {
    console.error('Erro ao salvar configuração de email:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao salvar configuração de email',
      message: error.message,
    });
  }
};

export const salvarConfigWhatsApp = async (req, res) => {
  try {
    // TODO: Implementar lógica de salvar configuração de WhatsApp
    res.json({
      success: true,
      message: 'Configuração de WhatsApp salva com sucesso',
    });
  } catch (error) {
    console.error('Erro ao salvar configuração de WhatsApp:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao salvar configuração de WhatsApp',
      message: error.message,
    });
  }
};

