import { pool } from '../server.js';
import { v4 as uuidv4 } from 'uuid';

// =============================================
// RECEBER CANDIDATO DO SISTEMA "TRABALHE CONOSCO"
// =============================================
export const receberCandidato = async (req, res) => {
  try {
    // Log de debug para identificar problemas
    console.log('📥 [ADMISSAO CANDIDATOS] Recebendo requisição POST /api/admissoes/candidatos');
    console.log('📥 [ADMISSAO CANDIDATOS] Headers:', {
      'x-api-key': req.headers['x-api-key'] ? '***' : 'ausente',
      'authorization': req.headers['authorization'] ? '***' : 'ausente',
      'content-type': req.headers['content-type']
    });
    console.log('📥 [ADMISSAO CANDIDATOS] Body recebido:', JSON.stringify(req.body, null, 2));

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
      console.error('❌ [ADMISSAO CANDIDATOS] Validação falhou. Campos obrigatórios faltando:', {
        nome: !!nome,
        cpf: !!cpf,
        email: !!email,
        vaga: !!vaga
      });
      return res.status(400).json({
        success: false,
        error: 'Campos obrigatórios: nome, cpf, email, vaga'
      });
    }

    const cpfLimpo = cpf.replace(/\D/g, '');
    console.log('🔍 [ADMISSAO CANDIDATOS] Verificando se já existe admissão para CPF:', cpfLimpo);

    // Verificar se já existe admissão para este CPF
    const admissaoExistente = await pool.query(
      `SELECT id, status, etapa_atual FROM admissoes WHERE cpf_candidato = $1`,
      [cpfLimpo]
    );

    console.log('🔍 [ADMISSAO CANDIDATOS] Resultado da verificação:', {
      encontradas: admissaoExistente.rows.length,
      admissao: admissaoExistente.rows[0] || null
    });

    if (admissaoExistente.rows.length > 0) {
      const admissao = admissaoExistente.rows[0];
      
      // Se já existe e está em andamento, retornar a existente
      if (admissao.status === 'EM_ANDAMENTO') {
        console.log('ℹ️ [ADMISSAO CANDIDATOS] Admissão já existe e está em andamento');
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

    console.log('📝 [ADMISSAO CANDIDATOS] Dados extraídos:', {
      cargo,
      departamento,
      tipo_contrato,
      salario_proposto
    });

    // Criar admissão automaticamente
    const admissaoId = uuidv4();
    const dataSolicitacao = data_cadastro ? new Date(data_cadastro) : new Date();
    const prazoFinal = new Date();
    prazoFinal.setDate(prazoFinal.getDate() + 30); // 30 dias para conclusão

    console.log('📝 [ADMISSAO CANDIDATOS] Criando admissão com ID:', admissaoId);

    // Inserir admissão
    console.log('💾 [ADMISSAO CANDIDATOS] Inserindo admissão no banco...');
    
    const admissaoResult = await pool.query(
      `INSERT INTO admissoes (
        id, nome_candidato, cpf_candidato, email_candidato, telefone_candidato,
        cargo, departamento, tipo_contrato, salario_proposto,
        etapa_atual, status, data_solicitacao, prazo_final,
        observacoes, vaga_id, esocial_enviado, thomson_reuters_enviado,
        contrato_assinado_fisicamente
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)
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
        vaga.id ? vaga.id.toString() : null,
        false, // esocial_enviado
        false, // thomson_reuters_enviado
        false  // contrato_assinado_fisicamente
      ]
    );

    const admissao = admissaoResult.rows[0];
    console.log('✅ [ADMISSAO CANDIDATOS] Admissão inserida com sucesso:', {
      id: admissao.id,
      nome: admissao.nome_candidato,
      status: admissao.status,
      etapa_atual: admissao.etapa_atual
    });

    // Criar documentos obrigatórios baseados no template
    console.log('📄 [ADMISSAO CANDIDATOS] Buscando templates de documentos...');
    const templatesResult = await pool.query(
      `SELECT * FROM admissao_documentos_template WHERE ativo = true ORDER BY ordem`
    );

    console.log(`📄 [ADMISSAO CANDIDATOS] Encontrados ${templatesResult.rows.length} templates de documentos`);
    
    // Mapear documentos recebidos do Trabalhe Conosco para os tipos do sistema
    const documentosRecebidos = documentos || {};
    const mapeamentoDocumentos = {
      'curriculo_url': 'CURRICULO',
      'foto_url': 'FOTO_3X4',
      'rg_frente_url': 'RG_FRENTE',
      'rg_verso_url': 'RG_VERSO',
      'cpf_url': 'CPF',
      'ctps_url': 'CTPS_DIGITAL',
      'comprovante_residencia_url': 'COMPROVANTE_RESIDENCIA',
      'titulo_eleitor_url': 'TITULO_ELEITOR',
      'certidao_nascimento_url': 'CERTIDAO_NASCIMENTO_CASAMENTO',
      'certidao_casamento_url': 'CERTIDAO_NASCIMENTO_CASAMENTO',
      'reservista_url': 'RESERVISTA',
      'antecedentes_criminais_url': 'ANTECEDENTES_CRIMINAIS',
      'certidao_dependente_url': 'CERTIDAO_DEPENDENTE',
      'cpf_dependente_url': 'CPF_DEPENDENTE'
    };

    const documentosCriados = [];
    for (const template of templatesResult.rows) {
      const docId = uuidv4();
      const prazoEntrega = new Date();
      prazoEntrega.setDate(prazoEntrega.getDate() + (template.prazo_dias || 7));

      // Verificar se o documento foi enviado do Trabalhe Conosco
      let status = 'PENDENTE';
      let arquivo_url = null;
      let data_recebimento = null;

      // Procurar se existe URL para este tipo de documento
      for (const [chave, tipoDoc] of Object.entries(mapeamentoDocumentos)) {
        if (tipoDoc === template.tipo_documento && documentosRecebidos[chave]) {
          status = 'RECEBIDO';
          arquivo_url = documentosRecebidos[chave];
          data_recebimento = new Date();
          console.log(`✅ [ADMISSAO CANDIDATOS] Documento ${template.nome_documento} recebido do Trabalhe Conosco`);
          break;
        }
      }

      console.log(`📄 [ADMISSAO CANDIDATOS] Criando documento: ${template.nome_documento} [${status}]`);
      await pool.query(
        `INSERT INTO admissao_documentos (
          id, admissao_id, tipo_documento, nome_documento, obrigatorio,
          status, prazo_entrega, responsavel_id, arquivo_url, data_recebimento
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
        [
          docId,
          admissaoId,
          template.tipo_documento,
          template.nome_documento,
          template.obrigatorio,
          status,
          prazoEntrega,
          template.responsavel_padrao_id || null,
          arquivo_url,
          data_recebimento
        ]
      );

      documentosCriados.push({
        id: docId,
        tipo_documento: template.tipo_documento,
        nome_documento: template.nome_documento,
        status: status,
        recebido: status === 'RECEBIDO'
      });
    }

    // Se houver currículo no documento, criar documento adicional (se não estiver na lista)
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
      
      documentosCriados.push({
        id: curriculoId,
        tipo_documento: 'CURRICULO',
        nome_documento: 'Currículo',
        status: 'RECEBIDO',
        recebido: true
      });
    }

    const documentosRecebidosCount = documentosCriados.filter(d => d.recebido).length;
    console.log(`✅ [ADMISSAO CANDIDATOS] ${documentosCriados.length} documentos criados (${documentosRecebidosCount} recebidos do Trabalhe Conosco)`);
    
    if (documentosRecebidosCount > 0) {
      console.log('📄 [ADMISSAO CANDIDATOS] Documentos recebidos:', 
        documentosCriados.filter(d => d.recebido).map(d => d.nome_documento).join(', ')
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

    // Log de sucesso
    console.log('✅ [ADMISSAO CANDIDATOS] Admissão criada com sucesso:', {
      admissao_id: admissaoId,
      nome_candidato: nome,
      cpf: cpf.replace(/\D/g, ''),
      etapa_atual: 'APROVACAO',
      status: 'EM_ANDAMENTO'
    });

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
    console.error('❌ [ADMISSAO CANDIDATOS] Erro ao receber candidato:', error);
    console.error('❌ [ADMISSAO CANDIDATOS] Stack trace:', error.stack);
    res.status(500).json({
      success: false,
      error: 'Erro ao processar candidato',
      message: error.message,
      ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
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

