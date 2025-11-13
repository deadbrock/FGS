import express from 'express';
import {
  // Tipos de Benefícios
  getTiposBeneficios,
  getTipoBeneficioById,
  createTipoBeneficio,
  updateTipoBeneficio,
  deleteTipoBeneficio,
  
  // Benefícios por Colaborador
  getColaboradoresBeneficios,
  getColaboradorBeneficioById,
  createColaboradorBeneficio,
  updateColaboradorBeneficio,
  deleteColaboradorBeneficio,
  
  // Estatísticas
  getEstatisticasBeneficios
} from '../controllers/beneficiosController.js';

const router = express.Router();

// =============================================
// TIPOS DE BENEFÍCIOS
// =============================================

// GET /api/beneficios/tipos - Listar tipos
router.get('/tipos', getTiposBeneficios);

// GET /api/beneficios/tipos/:id - Buscar tipo por ID
router.get('/tipos/:id', getTipoBeneficioById);

// POST /api/beneficios/tipos - Criar tipo
router.post('/tipos', createTipoBeneficio);

// PUT /api/beneficios/tipos/:id - Atualizar tipo
router.put('/tipos/:id', updateTipoBeneficio);

// DELETE /api/beneficios/tipos/:id - Deletar tipo
router.delete('/tipos/:id', deleteTipoBeneficio);

// =============================================
// BENEFÍCIOS POR COLABORADOR
// =============================================

// GET /api/beneficios/estatisticas - Estatísticas
router.get('/estatisticas', getEstatisticasBeneficios);

// GET /api/beneficios - Listar benefícios de colaboradores
router.get('/', getColaboradoresBeneficios);

// GET /api/beneficios/:id - Buscar por ID
router.get('/:id', getColaboradorBeneficioById);

// POST /api/beneficios - Vincular benefício a colaborador
router.post('/', createColaboradorBeneficio);

// PUT /api/beneficios/:id - Atualizar
router.put('/:id', updateColaboradorBeneficio);

// DELETE /api/beneficios/:id - Deletar
router.delete('/:id', deleteColaboradorBeneficio);

export default router;

