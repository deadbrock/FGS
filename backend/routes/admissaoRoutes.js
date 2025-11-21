import express from 'express';
import {
  getAdmissoes,
  getAdmissaoById,
  createAdmissao,
  updateAdmissao,
  avancarEtapa,
  getEstatisticas,
  cancelarAdmissao
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

// IMPORTANTE: Rotas específicas devem vir ANTES de rotas com parâmetros dinâmicos
// Rotas de integração externa (Trabalhe Conosco) - PRIMEIRO para evitar conflitos
// Estas rotas usam autenticação via API Key
router.post('/candidatos', apiKeyAuth, receberCandidato);
router.get('/candidatos/cpf/:cpf', apiKeyAuth, verificarStatusPorCPF);

// Rotas de documentos (específicas antes de dinâmicas)
router.get('/documentos/template', getDocumentosTemplate);
router.post('/documentos/upload', upload.single('arquivo'), uploadDocumento);
router.put('/documentos/:documento_id/validar', validarDocumento);

// Rotas de exames admissionais (específicas antes de dinâmicas)
router.get('/clinicas/listar', getClinicas);
router.get('/exames/calendario', getCalendarioAgendamentos);
router.put('/exames/:exame_id', updateExame);

// Rotas principais
router.get('/', getAdmissoes);
router.get('/estatisticas', getEstatisticas);
router.post('/', createAdmissao);

// Rotas com parâmetros dinâmicos (devem vir por último)
router.get('/:id', getAdmissaoById);
router.put('/:id', updateAdmissao);
router.put('/:id/cancelar', cancelarAdmissao);
router.post('/:id/avancar-etapa', avancarEtapa);

// Rotas de integrações (com parâmetros dinâmicos)
router.post('/:admissao_id/enviar-dominio', enviarParaDominio);
router.put('/:admissao_id/contrato-assinado', marcarContratoAssinado);
router.put('/:admissao_id/esocial-enviado-dominio', marcarESocialEnviadoDominio);

// Rotas de exames admissionais (com parâmetros dinâmicos)
router.get('/:admissao_id/exames', getExamesByAdmissao);
router.post('/:admissao_id/exames', criarAgendamento);

export default router;

