import { pool } from '../server.js';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

// =============================================
// ENVIAR PARA DOMÍNIO WEB (THOMSON REUTERS) - GERAÇÃO DE CONTRATO
// =============================================
export const enviarParaDominio = async (req, res) => {
  try {
    const { admissao_id } = req.params;

    // Buscar admissão
    const admissaoResult = await pool.query(
      `SELECT a.*, c.* 
      FROM admissoes a
      LEFT JOIN colaboradores c ON a.candidato_id = c.id
      WHERE a.id = $1`,
      [admissao_id]
    );

    if (admissaoResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Admissão não encontrada'
      });
    }

    const admissao = admissaoResult.rows[0];

    // Verificar se já foi enviado para domínio
    if (admissao.contrato_enviado_dominio) {
      return res.status(400).json({
        success: false,
        error: 'Admissão já foi enviada para Domínio Web'
      });
    }

    // Verificar se candidato já foi criado como colaborador
    if (!admissao.candidato_id) {
      return res.status(400).json({
        success: false,
        error: 'Candidato ainda não foi criado como colaborador. Complete as etapas anteriores.'
      });
    }

    // Preparar dados para envio ao Domínio Web (Thompson Reuters)
    const dadosDominio = {
      employee: {
        firstName: admissao.nome_candidato.split(' ')[0] || admissao.nome_candidato,
        lastName: admissao.nome_candidato.split(' ').slice(1).join(' ') || '',
        email: admissao.email_candidato,
        phone: admissao.telefone_candidato || '',
        cpf: admissao.cpf_candidato.replace(/\D/g, ''),
        dateOfBirth: admissao.data_nascimento?.split('T')[0] || '',
        gender: admissao.sexo === 'M' ? 'Male' : 'Female',
        position: admissao.cargo,
        department: admissao.departamento,
        hireDate: admissao.data_admissao?.split('T')[0] || new Date().toISOString().split('T')[0],
        salary: parseFloat(admissao.salario_proposto || 0),
        contractType: admissao.tipo_contrato || 'CLT',
        address: {
          street: admissao.endereco_rua || '',
          number: admissao.endereco_numero || '',
          complement: admissao.endereco_complemento || '',
          neighborhood: admissao.endereco_bairro || '',
          city: admissao.endereco_cidade || '',
          state: admissao.endereco_estado || '',
          zipCode: admissao.endereco_cep?.replace(/\D/g, '') || ''
        }
      }
    };

    // Enviar para API Domínio Web (Thompson Reuters)
    const dominioApiUrl = process.env.DOMINIO_WEB_API_URL || 'https://api.dominioweb.com/v1/contracts';
    const dominioApiKey = process.env.DOMINIO_WEB_API_KEY || '';

    try {
      const response = await axios.post(dominioApiUrl, dadosDominio, {
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': dominioApiKey
        },
        timeout: 30000
      });

      const contratoId = response.data?.id || response.data?.contractId || uuidv4();

      // Atualizar admissão - marcar como enviado para domínio
      await pool.query(
        `UPDATE admissoes
        SET contrato_enviado_dominio = true,
            thomson_reuters_id = $1,
            thomson_reuters_data_envio = CURRENT_TIMESTAMP,
            etapa_atual = 'GERACAO_CONTRATO',
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $2`,
        [contratoId, admissao_id]
      );

      res.json({
        success: true,
        message: 'Admissão enviada para Domínio Web com sucesso. O contrato será gerado automaticamente.',
        data: {
          contrato_id: contratoId,
          data_envio: new Date().toISOString()
        }
      });
    } catch (apiError) {
      console.error('Erro ao enviar para API Domínio Web:', apiError.response?.data || apiError.message);
      
      res.status(500).json({
        success: false,
        error: 'Erro ao enviar admissão para Domínio Web',
        message: apiError.response?.data?.message || apiError.message,
        details: apiError.response?.data
      });
    }
  } catch (error) {
    console.error('Erro ao processar envio para Domínio Web:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao processar envio para Domínio Web',
      message: error.message
    });
  }
};

// =============================================
// MARCAR CONTRATO ASSINADO FISICAMENTE
// =============================================
export const marcarContratoAssinado = async (req, res) => {
  try {
    const { admissao_id } = req.params;
    const { data_assinatura } = req.body;

    const result = await pool.query(
      `UPDATE admissoes
      SET contrato_assinado_fisicamente = true,
          data_assinatura_fisica = $1,
          etapa_atual = 'ASSINATURA_DIGITAL',
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING *`,
      [data_assinatura || new Date().toISOString().split('T')[0], admissao_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Admissão não encontrada'
      });
    }

    res.json({
      success: true,
      message: 'Contrato marcado como assinado fisicamente',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Erro ao marcar contrato assinado:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao marcar contrato assinado',
      message: error.message
    });
  }
};

// =============================================
// MARCAR ESOCIAL ENVIADO PELO DOMÍNIO
// =============================================
export const marcarESocialEnviadoDominio = async (req, res) => {
  try {
    const { admissao_id } = req.params;

    const result = await pool.query(
      `UPDATE admissoes
      SET esocial_enviado_por_dominio = true,
          esocial_enviado = true,
          esocial_data_envio = CURRENT_TIMESTAMP,
          etapa_atual = 'ENVIO_ESOCIAL',
          status = 'CONCLUIDA',
          data_conclusao = CURRENT_TIMESTAMP,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING *`,
      [admissao_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Admissão não encontrada'
      });
    }

    res.json({
      success: true,
      message: 'eSocial marcado como enviado pelo Domínio Web',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Erro ao marcar eSocial enviado:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao marcar eSocial enviado',
      message: error.message
    });
  }
};

// =============================================
// INTEGRAÇÃO COM THOMSON REUTERS
// =============================================
export const enviarThompsonReuters = async (req, res) => {
  try {
    const { admissao_id } = req.params;

    // Buscar admissão
    const admissaoResult = await pool.query(
      `SELECT a.*, c.* 
      FROM admissoes a
      LEFT JOIN colaboradores c ON a.candidato_id = c.id
      WHERE a.id = $1`,
      [admissao_id]
    );

    if (admissaoResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Admissão não encontrada'
      });
    }

    const admissao = admissaoResult.rows[0];

    // Verificar se já foi enviado
    if (admissao.thomson_reuters_enviado) {
      return res.status(400).json({
        success: false,
        error: 'Dados já foram enviados para Thompson Reuters'
      });
    }

    // Verificar se candidato já foi criado como colaborador
    if (!admissao.candidato_id) {
      return res.status(400).json({
        success: false,
        error: 'Candidato ainda não foi criado como colaborador. Complete as etapas anteriores.'
      });
    }

    // Preparar dados para Thompson Reuters
    const dadosThompsonReuters = {
      employee: {
        firstName: admissao.nome_candidato.split(' ')[0] || admissao.nome_candidato,
        lastName: admissao.nome_candidato.split(' ').slice(1).join(' ') || '',
        email: admissao.email_candidato,
        phone: admissao.telefone_candidato || '',
        cpf: admissao.cpf_candidato.replace(/\D/g, ''),
        dateOfBirth: admissao.data_nascimento?.split('T')[0] || '',
        gender: admissao.sexo === 'M' ? 'Male' : 'Female',
        position: admissao.cargo,
        department: admissao.departamento,
        hireDate: admissao.data_admissao?.split('T')[0] || new Date().toISOString().split('T')[0],
        salary: parseFloat(admissao.salario_proposto || 0),
        contractType: admissao.tipo_contrato || 'CLT',
        address: {
          street: admissao.endereco_rua || '',
          number: admissao.endereco_numero || '',
          complement: admissao.endereco_complemento || '',
          neighborhood: admissao.endereco_bairro || '',
          city: admissao.endereco_cidade || '',
          state: admissao.endereco_estado || '',
          zipCode: admissao.endereco_cep?.replace(/\D/g, '') || ''
        }
      }
    };

    // Enviar para API Thompson Reuters
    const thomsonReutersUrl = process.env.THOMSON_REUTERS_API_URL || 'https://api.thomsonreuters.com/v1/employees';
    const thomsonReutersApiKey = process.env.THOMSON_REUTERS_API_KEY || '';

    try {
      const response = await axios.post(thomsonReutersUrl, dadosThompsonReuters, {
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': thomsonReutersApiKey
        },
        timeout: 30000
      });

      const thomsonId = response.data?.id || response.data?.employeeId || uuidv4();

      // Atualizar admissão
      await pool.query(
        `UPDATE admissoes
        SET thomson_reuters_enviado = true,
            thomson_reuters_id = $1,
            thomson_reuters_data_envio = CURRENT_TIMESTAMP,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $2`,
        [thomsonId, admissao_id]
      );

      res.json({
        success: true,
        message: 'Dados enviados para Thompson Reuters com sucesso',
        data: {
          thomson_id: thomsonId,
          data_envio: new Date().toISOString()
        }
      });
    } catch (apiError) {
      console.error('Erro ao enviar para API Thompson Reuters:', apiError.response?.data || apiError.message);
      
      res.status(500).json({
        success: false,
        error: 'Erro ao enviar dados para Thompson Reuters',
        message: apiError.response?.data?.message || apiError.message,
        details: apiError.response?.data
      });
    }
  } catch (error) {
    console.error('Erro ao processar envio Thompson Reuters:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao processar envio Thompson Reuters',
      message: error.message
    });
  }
};

