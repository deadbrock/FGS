import express from 'express';
import * as solicitacoesController from '../controllers/solicitacoesController.js';
import * as clinicasController from '../controllers/clinicasController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Todas as rotas requerem autenticação
router.use(authenticateToken);

// =============================================
// ROTAS DE SOLICITAÇÕES
// =============================================

// Estatísticas (deve vir ANTES das rotas com :id)
router.get('/estatisticas', solicitacoesController.getEstatisticas);

// Listar solicitações
router.get('/', solicitacoesController.getAll);

// Criar solicitação
router.post('/', solicitacoesController.create);

// Criar agendamento
router.post('/agendamento', solicitacoesController.createAgendamento);

// Atualizar resultado
router.put('/:id/resultado', solicitacoesController.atualizarResultado);

// =============================================
// ROTAS DE CLÍNICAS
// =============================================

// Listar clínicas
router.get('/clinicas', clinicasController.getAll);

// Criar clínica
router.post('/clinicas', clinicasController.create);

// Atualizar clínica
router.put('/clinicas/:id', clinicasController.update);

// Excluir clínica
router.delete('/clinicas/:id', clinicasController.deleteClinica);

export default router;

