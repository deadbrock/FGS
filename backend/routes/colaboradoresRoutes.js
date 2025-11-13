import express from 'express';
import {
  getColaboradores,
  getColaboradorById,
  createColaborador,
  updateColaborador,
  deleteColaborador,
  getEstatisticas
} from '../controllers/colaboradoresController.js';

const router = express.Router();

// =============================================
// ROTAS PÚBLICAS (sem autenticação por enquanto)
// TODO: Adicionar middleware de autenticação
// =============================================

// GET /api/colaboradores - Listar todos
router.get('/', getColaboradores);

// GET /api/colaboradores/estatisticas - Estatísticas gerais
router.get('/estatisticas', getEstatisticas);

// GET /api/colaboradores/:id - Buscar por ID
router.get('/:id', getColaboradorById);

// POST /api/colaboradores - Criar novo
router.post('/', createColaborador);

// PUT /api/colaboradores/:id - Atualizar
router.put('/:id', updateColaborador);

// DELETE /api/colaboradores/:id - Deletar
router.delete('/:id', deleteColaborador);

export default router;

