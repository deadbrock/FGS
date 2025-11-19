import { pool } from '../server.js';
import { v4 as uuidv4 } from 'uuid';

// =============================================
// RECEBER CANDIDATO DO SISTEMA "TRABALHE CONOSCO"
// =============================================
export const receberCandidato = async (req, res) => {
  try {
    const {
      nome,
      cpf,
      email,
      telefone,
      data_nascimento,
      endereco,
      documentos,
      vaga,
      origem,
      candidato_id_origem,
      data_cadastro
    } = req.body;

    // Validações obrigatórias
    if (!nome || !cpf || !email || !vaga) {
      return res.status(400).json({
        success: false,
        error: 'Campos obrigatórios: nome, cpf, email, vaga'
      });
    }

    // Verificar se já existe admissão para este CPF
    const admissaoExistente = await pool.query(
      `SELECT id, status, etapa_atual FROM admissoes WHERE cpf_candidato = $1`,
      [cpf.replace(/\D/g, '')]
    );

    if (admissaoExistente.rows.length > 0) {
      const admissao = admissaoExistente.rows[0];
      
      // Se já existe e está em andamento, retornar a existente
      if (admissao.status === 'EM_ANDAMENTO') {
        return res.json({
          success: true,
          message: 'Candidato já possui admissão em andamento',
          data: {
            admissao_id: admissao.id,
            status: admissao.status,
            etapa_atual: admissao.etapa_atual,
            ja_existia: true
          }
        });
      }
    }

    // Extrair dados da vaga
    const cargo = vaga.titulo || 'Não informado';
    const departamento = vaga.departamento || 'Não informado';
    const tipo_contrato = vaga.tipo_contrato || 'CLT';
    const salario_proposto = vaga.salario || null;

    // Criar admissão automaticamente
    const admissaoId = uuidv4();
    const dataSolicitacao = data_cadastro ? new Date(data_cadastro) : new Date();
    const prazoFinal = new Date();
    prazoFinal.setDate(prazoFinal.getDate() + 30); // 30 dias para conclusão

    // Inserir admissão
    const admissaoResult = await pool.query(
      `INSERT INTO admissoes (
        id, nome_candidato, cpf_candidato, email_candidato, telefone_candidato,
        cargo, departamento, tipo_contrato, salario_proposto,
        etapa_atual, status, data_solicitacao, prazo_final,
        observacoes, vaga_id
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
      RETURNING *`,
      [
        admissaoId,
        nome,
        cpf.replace(/\D/g, ''), // Remover formatação do CPF
        email,
        telefone || null,
        cargo,
        departamento,
        tipo_contrato,
        salario_proposto,
        'SOLICITACAO_VAGA', // Etapa inicial
        'EM_ANDAMENTO',
        dataSolicitacao,
        prazoFinal,
        `Candidato recebido do sistema "${origem || 'Trabalhe Conosco'}". Candidato ID: ${candidato_id_origem || 'N/A'}`,
        vaga.id ? vaga.id.toString() : null
      ]
    );

    const admissao = admissaoResult.rows[0];

    // Criar documentos obrigatórios baseados no template
    const templatesResult = await pool.query(
      `SELECT * FROM admissao_documentos_template WHERE ativo = true ORDER BY ordem`
    );

    const documentosCriados = [];
    for (const template of templatesResult.rows) {
      const docId = uuidv4();
      const prazoEntrega = new Date();
      prazoEntrega.setDate(prazoEntrega.getDate() + (template.prazo_dias || 7));

      await pool.query(
        `INSERT INTO admissao_documentos (
          id, admissao_id, tipo_documento, nome_documento, obrigatorio,
          status, prazo_entrega, responsavel_id
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [
          docId,
          admissaoId,
          template.tipo_documento,
          template.nome_documento,
          template.obrigatorio,
          'PENDENTE',
          prazoEntrega,
          template.responsavel_padrao_id || null
        ]
      );

      documentosCriados.push({
        id: docId,
        tipo_documento: template.tipo_documento,
        nome_documento: template.nome_documento
      });
    }

    // Se houver currículo no documento, criar documento adicional
    if (documentos?.curriculo_url) {
      const curriculoId = uuidv4();
      await pool.query(
        `INSERT INTO admissao_documentos (
          id, admissao_id, tipo_documento, nome_documento, obrigatorio,
          status, arquivo_url, data_recebimento
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [
          curriculoId,
          admissaoId,
          'CURRICULO',
          'Currículo',
          false,
          'RECEBIDO',
          documentos.curriculo_url,
          new Date()
        ]
      );
    }

    // Criar registro inicial do workflow
    await pool.query(
      `INSERT INTO admissao_workflow (
        id, admissao_id, etapa, status_etapa, data_inicio, observacoes
      ) VALUES ($1, $2, $3, $4, $5, $6)`,
      [
        uuidv4(),
        admissaoId,
        'SOLICITACAO_VAGA',
        'CONCLUIDA',
        dataSolicitacao,
        `Admissão criada automaticamente via integração com ${origem || 'Trabalhe Conosco'}`
      ]
    );

    // Criar próxima etapa (APROVACAO)
    await pool.query(
      `INSERT INTO admissao_workflow (
        id, admissao_id, etapa, status_etapa, data_inicio
      ) VALUES ($1, $2, $3, $4, $5)`,
      [
        uuidv4(),
        admissaoId,
        'APROVACAO',
        'EM_ANDAMENTO',
        new Date()
      ]
    );

    // Atualizar etapa atual para APROVACAO
    await pool.query(
      `UPDATE admissoes SET etapa_atual = 'APROVACAO', updated_at = CURRENT_TIMESTAMP WHERE id = $1`,
      [admissaoId]
    );

    res.status(201).json({
      success: true,
      message: 'Candidato recebido e admissão criada com sucesso',
      data: {
        admissao_id: admissaoId,
        nome_candidato: nome,
        cpf: cpf.replace(/\D/g, ''),
        email,
        cargo,
        departamento,
        etapa_atual: 'APROVACAO',
        status: 'EM_ANDAMENTO',
        documentos_criados: documentosCriados.length,
        ja_existia: false
      }
    });
  } catch (error) {
    console.error('Erro ao receber candidato:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao processar candidato',
      message: error.message
    });
  }
};

// =============================================
// VERIFICAR STATUS DE ADMISSÃO POR CPF
// =============================================
export const verificarStatusPorCPF = async (req, res) => {
  try {
    const { cpf } = req.params;

    if (!cpf) {
      return res.status(400).json({
        success: false,
        error: 'CPF é obrigatório'
      });
    }

    const cpfLimpo = cpf.replace(/\D/g, '');

    const result = await pool.query(
      `SELECT 
        id, nome_candidato, cpf_candidato, email_candidato,
        cargo, departamento, etapa_atual, status,
        data_solicitacao, data_conclusao, observacoes
      FROM admissoes
      WHERE cpf_candidato = $1
      ORDER BY created_at DESC
      LIMIT 1`,
      [cpfLimpo]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Nenhuma admissão encontrada para este CPF'
      });
    }

    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Erro ao verificar status:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao verificar status',
      message: error.message
    });
  }
};

