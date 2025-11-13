import express from 'express';
import {
  getDashboard,
  getRelatorioColaboradores,
  getRelatorioBeneficios,
  getRelatorioTreinamentos,
  getRelatorioAniversariantes,
  getRelatorioFerias
} from '../controllers/relatoriosController.js';

const router = express.Router();

// GET /api/relatorios/dashboard - Dashboard geral
router.get('/dashboard', getDashboard);

// GET /api/relatorios/colaboradores - Relatório de colaboradores
router.get('/colaboradores', getRelatorioColaboradores);

// GET /api/relatorios/beneficios - Relatório de benefícios
router.get('/beneficios', getRelatorioBeneficios);

// GET /api/relatorios/treinamentos - Relatório de treinamentos
router.get('/treinamentos', getRelatorioTreinamentos);

// GET /api/relatorios/aniversariantes - Relatório de aniversariantes
router.get('/aniversariantes', getRelatorioAniversariantes);

// GET /api/relatorios/ferias - Relatório de férias
router.get('/ferias', getRelatorioFerias);

export default router;

