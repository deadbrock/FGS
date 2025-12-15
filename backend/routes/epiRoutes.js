import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import {
  getEPIs,
  getEPIById,
  createEPI,
  updateEPI,
  deleteEPI,
  getEstatisticas,
} from '../controllers/epiController.js';
import {
  getEntregas,
  getEntregaById,
  entregarEPI,
  devolverEPI,
  getHistoricoColaborador,
  getEPIsVencidos,
  getEPIsAVencer,
} from '../controllers/entregaEPIController.js';

const router = express.Router();

// Todas as rotas requerem autenticação
router.use(authenticateToken);

// =============================================
// Rotas de EPIs
// =============================================

// Estatísticas (deve vir antes de /:id)
router.get('/estatisticas', getEstatisticas);

// CRUD de EPIs
router.get('/', getEPIs);
router.get('/:id', getEPIById);
router.post('/', createEPI);
router.put('/:id', updateEPI);
router.delete('/:id', deleteEPI);

// =============================================
// Rotas de Entregas
// =============================================

// Relatórios de validade (devem vir antes de rotas com :id)
router.get('/entregas/vencidos', getEPIsVencidos);
router.get('/entregas/a-vencer', getEPIsAVencer);

// Histórico por colaborador
router.get('/entregas/colaborador/:colaborador_id/historico', getHistoricoColaborador);

// CRUD de Entregas
router.get('/entregas', getEntregas);
router.get('/entregas/:id', getEntregaById);
router.post('/entregas', entregarEPI);
router.put('/entregas/:id/devolver', devolverEPI);

export default router;

