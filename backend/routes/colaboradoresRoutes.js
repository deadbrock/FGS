import express from 'express';
import {
  getColaboradores,
  getColaboradorById,
  createColaborador,
  updateColaborador,
  deleteColaborador,
  getEstatisticas
} from '../controllers/colaboradoresController.js';
import {
  getHistoricoReajustes,
  createReajuste,
  updateReajuste,
  deleteReajuste
} from '../controllers/reajustesController.js';

const router = express.Router();

// =============================================
// ROTAS PÚBLICAS (sem autenticação por enquanto)
// TODO: Adicionar middleware de autenticação
// =============================================

// GET /api/colaboradores - Listar todos
router.get('/', getColaboradores);

// GET /api/colaboradores/estatisticas - Estatísticas gerais
router.get('/estatisticas', getEstatisticas);

// =============================================
// ROTAS DE REAJUSTES DE SALÁRIO
// =============================================

// GET /api/colaboradores/:id/reajustes - Listar histórico de reajustes
router.get('/:id/reajustes', getHistoricoReajustes);

// POST /api/colaboradores/:id/reajustes - Criar novo reajuste
router.post('/:id/reajustes', createReajuste);

// PUT /api/colaboradores/:id/reajustes/:reajusteId - Atualizar reajuste
router.put('/:id/reajustes/:reajusteId', updateReajuste);

// DELETE /api/colaboradores/:id/reajustes/:reajusteId - Deletar reajuste
router.delete('/:id/reajustes/:reajusteId', deleteReajuste);

// GET /api/colaboradores/:id - Buscar por ID
router.get('/:id', getColaboradorById);

// POST /api/colaboradores - Criar novo
router.post('/', createColaborador);

// PUT /api/colaboradores/:id - Atualizar
router.put('/:id', updateColaborador);

// DELETE /api/colaboradores/:id - Deletar
router.delete('/:id', deleteColaborador);

export default router;

