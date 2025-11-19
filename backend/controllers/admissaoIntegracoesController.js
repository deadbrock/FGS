import { pool } from '../server.js';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

// =============================================
// INTEGRAÇÃO COM ESOCIAL (S-2200)
// =============================================
export const enviarESocial = async (req, res) => {
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
    if (admissao.esocial_enviado) {
      return res.status(400).json({
        success: false,
        error: 'Evento eSocial já foi enviado para esta admissão'
      });
    }

    // Verificar se candidato já foi criado como colaborador
    if (!admissao.candidato_id) {
      return res.status(400).json({
        success: false,
        error: 'Candidato ainda não foi criado como colaborador. Complete as etapas anteriores.'
      });
    }

    // Preparar dados do evento S-2200
    const eventoESocial = {
      evento: {
        ideEvento: {
          tpAmb: process.env.ESOCIAL_AMBIENTE || '2', // 1=Produção, 2=Teste
          procEmi: '1', // Aplicativo do empregador
          verProc: '1.0'
        },
        ideEmpregador: {
          tpInsc: '1', // CNPJ
          nrInsc: process.env.ESOCIAL_CNPJ || '' // CNPJ da empresa
        },
        trabalhador: {
          cpfTrab: admissao.cpf_candidato.replace(/\D/g, ''),
          nmTrab: admissao.nome_candidato,
          sexo: admissao.sexo || 'M',
          racaCor: '1', // Branca (ajustar conforme necessário)
          estCiv: '1', // Solteiro (ajustar conforme necessário)
          grauInstr: '01', // Analfabeto (ajustar conforme necessário)
          dtNascto: admissao.data_nascimento?.split('T')[0] || '',
          paisNascto: '105', // Brasil
          paisNac: '105', // Brasil
          endereco: {
            brasil: {
              tpLograd: 'R', // Rua
              dscLograd: admissao.endereco_rua || '',
              nrLograd: admissao.endereco_numero || '',
              complemento: admissao.endereco_complemento || '',
              bairro: admissao.endereco_bairro || '',
              cep: admissao.endereco_cep?.replace(/\D/g, '') || '',
              codMunic: '', // Código do município (ajustar conforme necessário)
              uf: admissao.endereco_estado || ''
            }
          },
          trabEstrangeiro: {
            dtChegada: '',
            classTrabEstrang: ''
          },
          infoDeficiencia: {
            defFisica: 'N',
            defVisual: 'N',
            defAuditiva: 'N',
            defMental: 'N',
            defIntelectual: 'N',
            reabReadap: 'N',
            observacao: ''
          }
        },
        vinculo: {
          matricula: admissao.matricula || '',
          tpRegTrab: '1', // CLT
          tpRegPrev: '1', // Regime Geral da Previdência Social
          dtAdm: admissao.data_admissao?.split('T')[0] || new Date().toISOString().split('T')[0],
          codCateg: '101', // Empregado - Geral
          codCargo: '', // Código do cargo (ajustar conforme necessário)
          codFuncao: '', // Código da função (ajustar conforme necessário)
          codCategIncidencia: '101',
          natAtividade: '1', // Não se aplica
          dtInicio: admissao.data_inicio_prevista?.split('T')[0] || new Date().toISOString().split('T')[0],
          infoRegimeTrab: {
            infoCeletista: {
              dtAdm: admissao.data_admissao?.split('T')[0] || new Date().toISOString().split('T')[0],
              tpAdmissao: '1', // Admissão
              indAdmissao: '1', // Normal
              dtBase: '', // Data base (ajustar conforme necessário)
              cnpjSindCategProf: '', // CNPJ do sindicato (ajustar conforme necessário)
              remuneracao: {
                vrSalFx: parseFloat(admissao.salario_proposto || 0).toFixed(2),
                undSalFixo: '1', // Mensal
                dscSalVar: ''
              }
            }
          },
          infoContrato: {
            codCargo: '',
            codFuncao: '',
            codCateg: '101',
            codCarreira: '',
            dtIngrCarr: ''
          }
        }
      }
    };

    // Enviar para API do eSocial
    const esocialApiUrl = process.env.ESOCIAL_API_URL || 'https://webservices.producaorestrita.esocial.gov.br/servicos/empregador/enviarloteeventos/WsEnviarLoteEventos.svc';
    const esocialToken = process.env.ESOCIAL_TOKEN || '';

    try {
      const response = await axios.post(esocialApiUrl, eventoESocial, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${esocialToken}`
        },
        timeout: 30000
      });

      const eventoId = response.data?.idEvento || response.data?.protocolo || uuidv4();

      // Atualizar admissão
      await pool.query(
        `UPDATE admissoes
        SET esocial_enviado = true,
            esocial_evento_id = $1,
            esocial_data_envio = CURRENT_TIMESTAMP,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $2`,
        [eventoId, admissao_id]
      );

      res.json({
        success: true,
        message: 'Evento eSocial enviado com sucesso',
        data: {
          evento_id: eventoId,
          protocolo: response.data?.protocolo,
          data_envio: new Date().toISOString()
        }
      });
    } catch (apiError) {
      console.error('Erro ao enviar para API eSocial:', apiError.response?.data || apiError.message);
      
      res.status(500).json({
        success: false,
        error: 'Erro ao enviar evento para eSocial',
        message: apiError.response?.data?.message || apiError.message,
        details: apiError.response?.data
      });
    }
  } catch (error) {
    console.error('Erro ao processar envio eSocial:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao processar envio eSocial',
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

