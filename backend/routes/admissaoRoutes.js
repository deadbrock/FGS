import express from 'express';
import {
  getAdmissoes,
  getAdmissaoById,
  createAdmissao,
  updateAdmissao,
  avancarEtapa,
  getEstatisticas
} from '../controllers/admissaoController.js';
import {
  uploadDocumento,
  validarDocumento,
  getDocumentosTemplate
} from '../controllers/admissaoDocumentosController.js';
import {
  enviarParaDominio,
  marcarContratoAssinado,
  marcarESocialEnviadoDominio
} from '../controllers/admissaoIntegracoesController.js';
import {
  getExamesByAdmissao,
  criarAgendamento,
  updateExame,
  getClinicas,
  getCalendarioAgendamentos
} from '../controllers/examesAdmissionaisController.js';
import {
  receberCandidato,
  verificarStatusPorCPF
} from '../controllers/admissaoCandidatosController.js';
import { apiKeyAuth } from '../middleware/apiKeyAuth.js';
import upload from '../config/multer.js';

const router = express.Router();

// =============================================
// ROTAS PÚBLICAS (sem autenticação por enquanto)
// TODO: Adicionar middleware de autenticação
// =============================================

// Rotas principais
router.get('/', getAdmissoes);
router.get('/estatisticas', getEstatisticas);
router.get('/:id', getAdmissaoById);
router.post('/', createAdmissao);
router.put('/:id', updateAdmissao);
router.post('/:id/avancar-etapa', avancarEtapa);

// Rotas de documentos
router.get('/documentos/template', getDocumentosTemplate);
router.post('/documentos/upload', upload.single('arquivo'), uploadDocumento);
router.put('/documentos/:documento_id/validar', validarDocumento);

// Rotas de integrações
router.post('/:admissao_id/enviar-dominio', enviarParaDominio);
router.put('/:admissao_id/contrato-assinado', marcarContratoAssinado);
router.put('/:admissao_id/esocial-enviado-dominio', marcarESocialEnviadoDominio);

// Rotas de exames admissionais
router.get('/:admissao_id/exames', getExamesByAdmissao);
router.post('/:admissao_id/exames', criarAgendamento);
router.put('/exames/:exame_id', updateExame);
router.get('/clinicas/listar', getClinicas);
router.get('/exames/calendario', getCalendarioAgendamentos);

// Rotas de integração externa (Trabalhe Conosco)
// Estas rotas usam autenticação via API Key
router.post('/candidatos', apiKeyAuth, receberCandidato);
router.get('/candidatos/cpf/:cpf', apiKeyAuth, verificarStatusPorCPF);

export default router;

