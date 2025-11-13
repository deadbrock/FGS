import express from 'express';
import {
  getEstatisticasGerais,
  getEstatisticasPorEstado,
  getColaboradoresPorEstado,
  getColaboradoresAdministrativos,
  getTodosColaboradores
} from '../controllers/regionaisController.js';

const router = express.Router();

// =============================================
// ROTAS DE REGIONAIS
// =============================================

// GET /api/regionais/estatisticas - Estatísticas gerais
router.get('/estatisticas', getEstatisticasGerais);

// GET /api/regionais/colaboradores - Todos os colaboradores (com filtros)
router.get('/colaboradores', getTodosColaboradores);

// GET /api/regionais/administrativos - Colaboradores administrativos
router.get('/administrativos', getColaboradoresAdministrativos);

// GET /api/regionais/estado/:estado - Estatísticas por estado
router.get('/estado/:estado', getEstatisticasPorEstado);

// GET /api/regionais/estado/:estado/colaboradores - Colaboradores por estado
router.get('/estado/:estado/colaboradores', getColaboradoresPorEstado);

export default router;

