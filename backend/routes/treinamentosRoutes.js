import express from 'express';
import {
  // Treinamentos (Cursos)
  getTreinamentos,
  getTreinamentoById,
  createTreinamento,
  updateTreinamento,
  deleteTreinamento,
  
  // Turmas
  getTurmas,
  createTurma,
  
  // Treinamentos por Colaborador
  getColaboradoresTreinamentos,
  createColaboradorTreinamento,
  
  // Estatísticas
  getEstatisticasTreinamentos
} from '../controllers/treinamentosController.js';

const router = express.Router();

// =============================================
// TREINAMENTOS (CURSOS)
// =============================================

// GET /api/treinamentos - Listar treinamentos
router.get('/', getTreinamentos);

// GET /api/treinamentos/estatisticas - Estatísticas
router.get('/estatisticas', getEstatisticasTreinamentos);

// GET /api/treinamentos/:id - Buscar por ID
router.get('/:id', getTreinamentoById);

// POST /api/treinamentos - Criar treinamento
router.post('/', createTreinamento);

// PUT /api/treinamentos/:id - Atualizar
router.put('/:id', updateTreinamento);

// DELETE /api/treinamentos/:id - Deletar
router.delete('/:id', deleteTreinamento);

// =============================================
// TURMAS
// =============================================

// GET /api/treinamentos/turmas - Listar turmas
router.get('/turmas', getTurmas);

// POST /api/treinamentos/turmas - Criar turma
router.post('/turmas', createTurma);

// =============================================
// TREINAMENTOS POR COLABORADOR
// =============================================

// GET /api/treinamentos/colaboradores - Listar treinamentos de colaboradores
router.get('/colaboradores', getColaboradoresTreinamentos);

// POST /api/treinamentos/colaboradores - Vincular treinamento a colaborador
router.post('/colaboradores', createColaboradorTreinamento);

export default router;

