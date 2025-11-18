import express from 'express';
import {
  getEstatisticas,
  getUsuariosSeguranca,
  getLogsAcesso,
  getLogsAlteracao,
} from '../controllers/segurancaController.js';

const router = express.Router();

// ==========================================
// ESTATÍSTICAS
// ==========================================

// GET /api/seguranca/estatisticas - Estatísticas gerais
router.get('/estatisticas', getEstatisticas);

// ==========================================
// USUÁRIOS
// ==========================================

// GET /api/seguranca/usuarios - Listar usuários
router.get('/usuarios', getUsuariosSeguranca);

// ==========================================
// LOGS DE ACESSO
// ==========================================

// GET /api/seguranca/logs-acesso - Listar logs de acesso
router.get('/logs-acesso', getLogsAcesso);

// ==========================================
// LOGS DE ALTERAÇÕES
// ==========================================

// GET /api/seguranca/logs-alteracoes - Listar logs de alterações
router.get('/logs-alteracoes', getLogsAlteracao);

export default router;

