import { pool } from '../server.js';
import { v4 as uuidv4 } from 'uuid';

// =============================================
// LISTAR ADMISSÕES
// =============================================
export const getAdmissoes = async (req, res) => {
  try {
    const {
      status,
      etapa_atual,
      responsavel_id,
      departamento,
      search,
      limit = 50,
      offset = 0
    } = req.query;

    // Usar subquery para contar documentos e depois fazer JOIN para evitar problemas com GROUP BY
    let query = `
      SELECT 
        a.*,
        u_solicitado.nome as solicitado_por_nome,
        u_aprovado.nome as aprovado_por_nome,
        u_responsavel.nome as responsavel_atual_nome,
        COALESCE(doc_stats.total_documentos, 0) as total_documentos,
        COALESCE(doc_stats.documentos_pendentes, 0) as documentos_pendentes,
        COALESCE(doc_stats.documentos_aprovados, 0) as documentos_aprovados
      FROM admissoes a
      LEFT JOIN users u_solicitado ON a.solicitado_por = u_solicitado.id
      LEFT JOIN users u_aprovado ON a.aprovado_por = u_aprovado.id
      LEFT JOIN users u_responsavel ON a.responsavel_atual = u_responsavel.id
      LEFT JOIN (
        SELECT 
          admissao_id,
          COUNT(DISTINCT id) as total_documentos,
          COUNT(DISTINCT CASE WHEN status = 'PENDENTE' THEN id END) as documentos_pendentes,
          COUNT(DISTINCT CASE WHEN status = 'APROVADO' THEN id END) as documentos_aprovados
        FROM admissao_documentos
        GROUP BY admissao_id
      ) doc_stats ON a.id = doc_stats.admissao_id
      WHERE 1=1
    `;

    const params = [];
    let paramIndex = 1;

    if (status) {
      query += ` AND a.status = $${paramIndex}`;
      params.push(status);
      paramIndex++;
    }

    if (etapa_atual) {
      query += ` AND a.etapa_atual = $${paramIndex}`;
      params.push(etapa_atual);
      paramIndex++;
    }

    if (responsavel_id) {
      query += ` AND a.responsavel_atual = $${paramIndex}`;
      params.push(responsavel_id);
      paramIndex++;
    }

    if (departamento) {
      query += ` AND a.departamento ILIKE $${paramIndex}`;
      params.push(`%${departamento}%`);
      paramIndex++;
    }

    if (search) {
      query += ` AND (
        a.nome_candidato ILIKE $${paramIndex} OR
        a.cpf_candidato ILIKE $${paramIndex} OR
        a.email_candidato ILIKE $${paramIndex} OR
        a.cargo ILIKE $${paramIndex}
      )`;
      params.push(`%${search}%`);
      paramIndex++;
    }

    // Remover GROUP BY já que não estamos mais agregando diretamente na query principal
    query += ` ORDER BY a.data_solicitacao DESC`;
    query += ` LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    params.push(limit, offset);

    const result = await pool.query(query, params);

    // Log de debug
    console.log(`📋 [ADMISSOES] Buscando admissões. Filtros:`, {
      status,
      etapa_atual,
      responsavel_id,
      departamento,
      search,
      limit,
      offset
    });
    console.log(`📋 [ADMISSOES] Total de registros encontrados: ${result.rows.length}`);

    // Contar total
    let countQuery = 'SELECT COUNT(DISTINCT a.id) FROM admissoes a WHERE 1=1';
    const countParams = [];
    let countIndex = 1;

    if (status) {
      countQuery += ` AND a.status = $${countIndex}`;
      countParams.push(status);
      countIndex++;
    }

    if (etapa_atual) {
      countQuery += ` AND a.etapa_atual = $${countIndex}`;
      countParams.push(etapa_atual);
      countIndex++;
    }

    if (responsavel_id) {
      countQuery += ` AND a.responsavel_atual = $${countIndex}`;
      countParams.push(responsavel_id);
      countIndex++;
    }

    if (departamento) {
      countQuery += ` AND a.departamento ILIKE $${countIndex}`;
      countParams.push(`%${departamento}%`);
      countIndex++;
    }

    if (search) {
      countQuery += ` AND (
        a.nome_candidato ILIKE $${countIndex} OR
        a.cpf_candidato ILIKE $${countIndex} OR
        a.email_candidato ILIKE $${countIndex} OR
        a.cargo ILIKE $${countIndex}
      )`;
      countParams.push(`%${search}%`);
      countIndex++;
    }

    const countResult = await pool.query(countQuery, countParams);
    const total = parseInt(countResult.rows[0].count);

    // Log dos dados retornados
    console.log(`📋 [ADMISSOES] Dados retornados:`, {
      total_registros: result.rows.length,
      primeiro_registro: result.rows[0] ? {
        id: result.rows[0].id,
        nome_candidato: result.rows[0].nome_candidato,
        cpf_candidato: result.rows[0].cpf_candidato,
        email_candidato: result.rows[0].email_candidato,
        cargo: result.rows[0].cargo,
        departamento: result.rows[0].departamento,
        etapa_atual: result.rows[0].etapa_atual,
        status: result.rows[0].status,
        esocial_enviado: result.rows[0].esocial_enviado,
        thomson_reuters_enviado: result.rows[0].thomson_reuters_enviado,
        created_at: result.rows[0].created_at,
        updated_at: result.rows[0].updated_at
      } : null
    });

    // Garantir que campos obrigatórios não sejam NULL
    const dadosFormatados = result.rows.map(row => ({
      ...row,
      esocial_enviado: row.esocial_enviado ?? false,
      thomson_reuters_enviado: row.thomson_reuters_enviado ?? false,
      contrato_assinado_fisicamente: row.contrato_assinado_fisicamente ?? false,
      total_documentos: row.total_documentos ?? 0,
      documentos_pendentes: row.documentos_pendentes ?? 0,
      documentos_aprovados: row.documentos_aprovados ?? 0
    }));

    res.json({
      success: true,
      data: dadosFormatados,
      pagination: {
        total,
        limit: parseInt(limit),
        offset: parseInt(offset),
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Erro ao buscar admissões:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao buscar admissões',
      message: error.message
    });
  }
};

// =============================================
// BUSCAR ADMISSÃO POR ID
// =============================================
export const getAdmissaoById = async (req, res) => {
  try {
    const { id } = req.params;

    // Buscar admissão
    const admissaoResult = await pool.query(
      `SELECT 
        a.*,
        u_solicitado.nome as solicitado_por_nome,
        u_aprovado.nome as aprovado_por_nome,
        u_responsavel.nome as responsavel_atual_nome
      FROM admissoes a
      LEFT JOIN users u_solicitado ON a.solicitado_por = u_solicitado.id
      LEFT JOIN users u_aprovado ON a.aprovado_por = u_aprovado.id
      LEFT JOIN users u_responsavel ON a.responsavel_atual = u_responsavel.id
      WHERE a.id = $1`,
      [id]
    );

    if (admissaoResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Admissão não encontrada'
      });
    }

    const admissao = admissaoResult.rows[0];

    // Buscar documentos
    const documentosResult = await pool.query(
      `SELECT 
        ad.*,
        u_resp.nome as responsavel_nome,
        u_validado.nome as validado_por_nome
      FROM admissao_documentos ad
      LEFT JOIN users u_resp ON ad.responsavel_id = u_resp.id
      LEFT JOIN users u_validado ON ad.validado_por = u_validado.id
      WHERE ad.admissao_id = $1
      ORDER BY ad.created_at`,
      [id]
    );

    // Buscar histórico do workflow
    const workflowResult = await pool.query(
      `SELECT 
        aw.*,
        u_resp.nome as responsavel_nome
      FROM admissao_workflow aw
      LEFT JOIN users u_resp ON aw.responsavel_id = u_resp.id
      WHERE aw.admissao_id = $1
      ORDER BY aw.created_at`,
      [id]
    );

    // Buscar notificações
    const notificacoesResult = await pool.query(
      `SELECT * FROM admissao_notificacoes
      WHERE admissao_id = $1
      ORDER BY created_at DESC`,
      [id]
    );

    res.json({
      success: true,
      data: {
        ...admissao,
        documentos: documentosResult.rows,
        workflow: workflowResult.rows,
        notificacoes: notificacoesResult.rows
      }
    });
  } catch (error) {
    console.error('Erro ao buscar admissão:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao buscar admissão',
      message: error.message
    });
  }
};

// =============================================
// CRIAR NOVA ADMISSÃO
// =============================================
export const createAdmissao = async (req, res) => {
  try {
    const {
      nome_candidato,
      cpf_candidato,
      email_candidato,
      telefone_candidato,
      cargo,
      departamento,
      tipo_contrato,
      salario_proposto,
      data_inicio_prevista,
      solicitado_por,
      observacoes
    } = req.body;

    if (!nome_candidato || !cpf_candidato || !email_candidato || !cargo || !departamento) {
      return res.status(400).json({
        success: false,
        error: 'Campos obrigatórios: nome_candidato, cpf_candidato, email_candidato, cargo, departamento'
      });
    }

    const id = uuidv4();
    const solicitadoPorId = solicitado_por || req.user?.id;

    // Criar admissão
    const admissaoResult = await pool.query(
      `INSERT INTO admissoes (
        id, nome_candidato, cpf_candidato, email_candidato, telefone_candidato,
        cargo, departamento, tipo_contrato, salario_proposto, data_inicio_prevista,
        solicitado_por, responsavel_atual, prazo_final, observacoes
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      RETURNING *`,
      [
        id,
        nome_candidato,
        cpf_candidato,
        email_candidato,
        telefone_candidato || null,
        cargo,
        departamento,
        tipo_contrato || 'CLT',
        salario_proposto || null,
        data_inicio_prevista || null,
        solicitadoPorId,
        solicitadoPorId, // Responsável inicial é quem solicitou
        data_inicio_prevista ? new Date(data_inicio_prevista) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 dias se não informado
        observacoes || null
      ]
    );

    const admissao = admissaoResult.rows[0];

    // Criar documentos obrigatórios baseados no template
    const templatesResult = await pool.query(
      `SELECT * FROM admissao_documentos_template WHERE ativo = true ORDER BY ordem`
    );

    const documentos = [];
    for (const template of templatesResult.rows) {
      const docId = uuidv4();
      const prazoEntrega = new Date();
      prazoEntrega.setDate(prazoEntrega.getDate() + template.prazo_dias);

      await pool.query(
        `INSERT INTO admissao_documentos (
          id, admissao_id, tipo_documento, nome_documento, obrigatorio,
          responsavel_id, prazo_entrega
        ) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [
          docId,
          id,
          template.tipo_documento,
          template.nome_documento,
          template.obrigatorio,
          template.responsavel_padrao_id || null,
          prazoEntrega
        ]
      );

      documentos.push({
        id: docId,
        tipo_documento: template.tipo_documento,
        nome_documento: template.nome_documento,
        status: 'PENDENTE'
      });
    }

    // Criar primeira etapa do workflow
    await pool.query(
      `INSERT INTO admissao_workflow (
        id, admissao_id, etapa, status_etapa, responsavel_id, data_inicio
      ) VALUES ($1, $2, $3, $4, $5, $6)`,
      [
        uuidv4(),
        id,
        'SOLICITACAO_VAGA',
        'CONCLUIDA',
        solicitadoPorId,
        new Date()
      ]
    );

    // Criar próxima etapa (Aprovação)
    await pool.query(
      `INSERT INTO admissao_workflow (
        id, admissao_id, etapa, status_etapa, responsavel_id
      ) VALUES ($1, $2, $3, $4, $5)`,
      [
        uuidv4(),
        id,
        'APROVACAO',
        'PENDENTE',
        null // Será definido pelo RH
      ]
    );

    res.status(201).json({
      success: true,
      message: 'Admissão criada com sucesso',
      data: {
        ...admissao,
        documentos
      }
    });
  } catch (error) {
    console.error('Erro ao criar admissão:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao criar admissão',
      message: error.message
    });
  }
};

// =============================================
// ATUALIZAR ADMISSÃO
// =============================================
export const updateAdmissao = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const allowedFields = [
      'nome_candidato', 'cpf_candidato', 'email_candidato', 'telefone_candidato',
      'cargo', 'departamento', 'tipo_contrato', 'salario_proposto',
      'data_inicio_prevista', 'etapa_atual', 'status', 'responsavel_atual',
      'aprovado_por', 'data_aprovacao', 'data_conclusao', 'prazo_final',
      'esocial_enviado', 'esocial_enviado_por_dominio', 'esocial_evento_id', 'esocial_data_envio',
      'thomson_reuters_enviado', 'thomson_reuters_id', 'thomson_reuters_data_envio',
      'contrato_enviado_dominio', 'contrato_assinado_fisicamente', 'data_assinatura_fisica',
      'observacoes'
    ];

    const updateFields = [];
    const values = [];
    let paramIndex = 1;

    for (const field of allowedFields) {
      if (updates[field] !== undefined) {
        updateFields.push(`${field} = $${paramIndex}`);
        values.push(updates[field]);
        paramIndex++;
      }
    }

    if (updateFields.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Nenhum campo para atualizar'
      });
    }

    values.push(id);

    const result = await pool.query(
      `UPDATE admissoes
      SET ${updateFields.join(', ')}, updated_at = CURRENT_TIMESTAMP
      WHERE id = $${paramIndex}
      RETURNING *`,
      values
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Admissão não encontrada'
      });
    }

    res.json({
      success: true,
      message: 'Admissão atualizada com sucesso',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Erro ao atualizar admissão:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao atualizar admissão',
      message: error.message
    });
  }
};

// =============================================
// CANCELAR ADMISSÃO
// =============================================
export const cancelarAdmissao = async (req, res) => {
  try {
    const { id } = req.params;
    const { motivo_cancelamento } = req.body;

    // Verificar se a admissão existe
    const admissaoResult = await pool.query(
      `SELECT id, status, nome_candidato FROM admissoes WHERE id = $1`,
      [id]
    );

    if (admissaoResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Admissão não encontrada'
      });
    }

    const admissao = admissaoResult.rows[0];

    // Verificar se já está cancelada
    if (admissao.status === 'CANCELADA') {
      return res.status(400).json({
        success: false,
        error: 'Admissão já está cancelada'
      });
    }

    // Verificar se já está concluída
    if (admissao.status === 'CONCLUIDA') {
      return res.status(400).json({
        success: false,
        error: 'Não é possível cancelar uma admissão já concluída'
      });
    }

    // Preparar observações com motivo do cancelamento
    let observacoesAtualizadas = 'Admissão cancelada';
    if (motivo_cancelamento) {
      observacoesAtualizadas += `: ${motivo_cancelamento}`;
    }
    
    // Buscar observações atuais
    const observacoesAtuais = admissao.observacoes || '';
    if (observacoesAtuais) {
      observacoesAtualizadas = `${observacoesAtuais}\n\n${observacoesAtualizadas}`;
    }

    // Atualizar status para CANCELADA
    const updateResult = await pool.query(
      `UPDATE admissoes 
      SET status = 'CANCELADA', 
          data_conclusao = CURRENT_TIMESTAMP,
          observacoes = $1,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING *`,
      [observacoesAtualizadas, id]
    );

    // Atualizar etapa atual do workflow para CANCELADA
    await pool.query(
      `UPDATE admissao_workflow 
      SET status_etapa = 'CANCELADA', 
          data_conclusao = CURRENT_TIMESTAMP,
          observacoes = COALESCE(observacoes, '') || CASE 
            WHEN observacoes IS NOT NULL AND observacoes != '' THEN '\n\n' 
            ELSE '' 
          END || 'Etapa cancelada devido ao cancelamento da admissão'
      WHERE admissao_id = $1 AND status_etapa = 'EM_ANDAMENTO'`,
      [id]
    );

    // Criar registro no workflow para cancelamento
    await pool.query(
      `INSERT INTO admissao_workflow (
        id, admissao_id, etapa, status_etapa, data_inicio, data_conclusao, observacoes
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [
        uuidv4(),
        id,
        'CANCELAMENTO',
        'CONCLUIDA',
        new Date(),
        new Date(),
        motivo_cancelamento ? `Motivo: ${motivo_cancelamento}` : 'Admissão cancelada'
      ]
    );

    res.json({
      success: true,
      message: 'Admissão cancelada com sucesso',
      data: updateResult.rows[0]
    });
  } catch (error) {
    console.error('Erro ao cancelar admissão:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao cancelar admissão',
      message: error.message
    });
  }
};

// =============================================
// AVANÇAR ETAPA DO WORKFLOW
// =============================================
export const avancarEtapa = async (req, res) => {
  try {
    const { id } = req.params;
    const { proxima_etapa, responsavel_id, observacoes } = req.body;

    // Buscar admissão atual
    const admissaoResult = await pool.query(
      'SELECT * FROM admissoes WHERE id = $1',
      [id]
    );

    if (admissaoResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Admissão não encontrada'
      });
    }

    const admissao = admissaoResult.rows[0];

    // Finalizar etapa atual
    await pool.query(
      `UPDATE admissao_workflow
      SET status_etapa = 'CONCLUIDA', data_conclusao = CURRENT_TIMESTAMP
      WHERE admissao_id = $1 AND etapa = $2 AND status_etapa != 'CONCLUIDA'`,
      [id, admissao.etapa_atual]
    );

    // Criar próxima etapa
    const proximaEtapa = proxima_etapa || getProximaEtapa(admissao.etapa_atual);
    
    await pool.query(
      `INSERT INTO admissao_workflow (
        id, admissao_id, etapa, status_etapa, responsavel_id, data_inicio, observacoes
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [
        uuidv4(),
        id,
        proximaEtapa,
        'EM_ANDAMENTO',
        responsavel_id || null,
        new Date(),
        observacoes || null
      ]
    );

    // Atualizar admissão
    await pool.query(
      `UPDATE admissoes
      SET etapa_atual = $1, responsavel_atual = $2, updated_at = CURRENT_TIMESTAMP
      WHERE id = $3`,
      [proximaEtapa, responsavel_id || admissao.responsavel_atual, id]
    );

    res.json({
      success: true,
      message: 'Etapa avançada com sucesso',
      data: {
        etapa_atual: proximaEtapa
      }
    });
  } catch (error) {
    console.error('Erro ao avançar etapa:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao avançar etapa',
      message: error.message
    });
  }
};

// Função auxiliar para determinar próxima etapa
function getProximaEtapa(etapaAtual) {
  const etapas = [
    'SOLICITACAO_VAGA',
    'APROVACAO',
    'COLETA_DOCUMENTOS',
    'VALIDACAO_DOCUMENTOS',
    'EXAME_ADMISSIONAL',
    'GERACAO_CONTRATO',
    'ASSINATURA_DIGITAL',
    'ENVIO_ESOCIAL'
  ];

  const indexAtual = etapas.indexOf(etapaAtual);
  return indexAtual < etapas.length - 1 ? etapas[indexAtual + 1] : etapaAtual;
}

// =============================================
// ESTATÍSTICAS DE ADMISSÕES
// =============================================
export const getEstatisticas = async (req, res) => {
  try {
    const { periodo_inicio, periodo_fim } = req.query;

    let whereClause = 'WHERE 1=1';
    const params = [];
    let paramIndex = 1;

    if (periodo_inicio && periodo_fim) {
      whereClause += ` AND data_solicitacao BETWEEN $${paramIndex} AND $${paramIndex + 1}`;
      params.push(periodo_inicio, periodo_fim);
      paramIndex += 2;
    }

    // Total de admissões
    const totalResult = await pool.query(
      `SELECT COUNT(*) as total FROM admissoes ${whereClause}`,
      params
    );

    // Por status
    const statusResult = await pool.query(
      `SELECT status, COUNT(*) as total
      FROM admissoes ${whereClause}
      GROUP BY status`,
      params
    );

    // Por etapa
    const etapaResult = await pool.query(
      `SELECT etapa_atual, COUNT(*) as total
      FROM admissoes ${whereClause}
      GROUP BY etapa_atual`,
      params
    );

    // Tempo médio de admissão (em dias)
    const tempoMedioResult = await pool.query(
      `SELECT 
        AVG(EXTRACT(EPOCH FROM (data_conclusao - data_solicitacao)) / 86400) as tempo_medio_dias
      FROM admissoes
      ${whereClause} AND status = 'CONCLUIDA' AND data_conclusao IS NOT NULL`,
      params
    );

    // Documentos pendentes
    const documentosPendentesResult = await pool.query(
      `SELECT COUNT(*) as total
      FROM admissao_documentos
      WHERE status = 'PENDENTE' AND prazo_entrega < CURRENT_DATE`
    );

    // Por departamento
    const departamentoResult = await pool.query(
      `SELECT departamento, COUNT(*) as total
      FROM admissoes ${whereClause}
      GROUP BY departamento
      ORDER BY total DESC
      LIMIT 10`,
      params
    );

    res.json({
      success: true,
      data: {
        total: parseInt(totalResult.rows[0].total),
        porStatus: statusResult.rows,
        porEtapa: etapaResult.rows,
        tempoMedioDias: tempoMedioResult.rows[0].tempo_medio_dias 
          ? parseFloat(tempoMedioResult.rows[0].tempo_medio_dias).toFixed(2) 
          : 0,
        documentosPendentes: parseInt(documentosPendentesResult.rows[0].total),
        porDepartamento: departamentoResult.rows
      }
    });
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao buscar estatísticas',
      message: error.message
    });
  }
};

