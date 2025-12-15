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
import { authenticateToken } from '../middleware/auth.js';
import upload from '../config/multer.js';

const router = express.Router();

// =============================================
// ROTAS COM AUTENTICAÇÃO
// =============================================

// IMPORTANTE: Rotas específicas devem vir ANTES de rotas com parâmetros dinâmicos
// Rotas de integração externa (Trabalhe Conosco) - PRIMEIRO para evitar conflitos
// Estas rotas usam autenticação via API Key
router.post('/candidatos', apiKeyAuth, receberCandidato);
router.get('/candidatos/cpf/:cpf', apiKeyAuth, verificarStatusPorCPF);

// Rotas de documentos (específicas antes de dinâmicas) - REQUEREM AUTENTICAÇÃO JWT
router.get('/documentos/template', authenticateToken, getDocumentosTemplate);
router.post('/documentos/upload', authenticateToken, upload.single('arquivo'), uploadDocumento);
router.put('/documentos/:documento_id/validar', authenticateToken, validarDocumento);

// Rotas de exames admissionais (específicas antes de dinâmicas) - REQUEREM AUTENTICAÇÃO JWT
router.get('/clinicas/listar', authenticateToken, getClinicas);
router.get('/exames/calendario', authenticateToken, getCalendarioAgendamentos);
router.put('/exames/:exame_id', authenticateToken, updateExame);

// Rotas principais - REQUEREM AUTENTICAÇÃO JWT
router.get('/', authenticateToken, getAdmissoes);
router.get('/estatisticas', authenticateToken, getEstatisticas);
router.post('/', authenticateToken, createAdmissao);

// Rotas com parâmetros dinâmicos (devem vir por último) - REQUEREM AUTENTICAÇÃO JWT
router.get('/:id', authenticateToken, getAdmissaoById);
router.put('/:id', authenticateToken, updateAdmissao);
router.put('/:id/cancelar', authenticateToken, cancelarAdmissao);
router.post('/:id/avancar-etapa', authenticateToken, avancarEtapa);

// Rotas de integrações (com parâmetros dinâmicos) - REQUEREM AUTENTICAÇÃO JWT
router.post('/:admissao_id/enviar-dominio', authenticateToken, enviarParaDominio);
router.put('/:admissao_id/contrato-assinado', authenticateToken, marcarContratoAssinado);
router.put('/:admissao_id/esocial-enviado-dominio', authenticateToken, marcarESocialEnviadoDominio);

// Rotas de exames admissionais (com parâmetros dinâmicos) - REQUEREM AUTENTICAÇÃO JWT
router.get('/:admissao_id/exames', authenticateToken, getExamesByAdmissao);
router.post('/:admissao_id/exames', authenticateToken, criarAgendamento);

export default router;

