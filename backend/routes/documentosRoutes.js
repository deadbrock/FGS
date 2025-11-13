import express from 'express';
import upload from '../config/multer.js';
import {
  getDocumentos,
  getDocumentoById,
  uploadDocumento,
  downloadDocumento,
  updateDocumento,
  deleteDocumento,
  getEstatisticasDocumentos
} from '../controllers/documentosController.js';

const router = express.Router();

// =============================================
// ROTAS DE DOCUMENTOS
// =============================================

// GET /api/documentos/estatisticas - Estatísticas
router.get('/estatisticas', getEstatisticasDocumentos);

// GET /api/documentos - Listar documentos (com filtros)
router.get('/', getDocumentos);

// GET /api/documentos/:id - Buscar por ID
router.get('/:id', getDocumentoById);

// GET /api/documentos/:id/download - Download de documento
router.get('/:id/download', downloadDocumento);

// POST /api/documentos - Upload de documento
// Usa multer.single('arquivo') para aceitar um único arquivo com o campo 'arquivo'
router.post('/', upload.single('arquivo'), uploadDocumento);

// PUT /api/documentos/:id - Atualizar metadados
router.put('/:id', updateDocumento);

// DELETE /api/documentos/:id - Deletar documento (arquivo + registro)
router.delete('/:id', deleteDocumento);

export default router;

