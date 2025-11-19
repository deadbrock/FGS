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
  enviarESocial,
  enviarThompsonReuters
} from '../controllers/admissaoIntegracoesController.js';
import { authenticateToken } from '../middleware/auth.js';
import { uploadMiddleware } from '../config/multer.js';

const router = express.Router();

// Aplicar autenticação em todas as rotas
router.use(authenticateToken);

// Rotas principais
router.get('/', getAdmissoes);
router.get('/estatisticas', getEstatisticas);
router.get('/:id', getAdmissaoById);
router.post('/', createAdmissao);
router.put('/:id', updateAdmissao);
router.post('/:id/avancar-etapa', avancarEtapa);

// Rotas de documentos
router.get('/documentos/template', getDocumentosTemplate);
router.post('/documentos/upload', uploadMiddleware.single('arquivo'), uploadDocumento);
router.put('/documentos/:documento_id/validar', validarDocumento);

// Rotas de integrações
router.post('/:admissao_id/esocial', enviarESocial);
router.post('/:admissao_id/thomson-reuters', enviarThompsonReuters);

export default router;

