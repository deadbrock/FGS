import express from 'express';
import {
  // Configurações
  getConfiguracoes,
  createConfiguracao,
  
  // Registros
  getRegistros,
  getRegistroById,
  registrarPonto,
  aprovarPonto,
  deleteRegistro,
  
  // Relatórios
  getEspelhoPonto,
  getEstatisticasPonto
} from '../controllers/pontoController.js';

const router = express.Router();

// =============================================
// CONFIGURAÇÕES DE JORNADA
// =============================================

// GET /api/ponto/configuracoes - Listar configurações
router.get('/configuracoes', getConfiguracoes);

// POST /api/ponto/configuracoes - Criar configuração
router.post('/configuracoes', createConfiguracao);

// =============================================
// REGISTROS DE PONTO
// =============================================

// GET /api/ponto/estatisticas - Estatísticas
router.get('/estatisticas', getEstatisticasPonto);

// GET /api/ponto/espelho - Espelho de ponto (relatório mensal)
router.get('/espelho', getEspelhoPonto);

// GET /api/ponto - Listar registros
router.get('/', getRegistros);

// GET /api/ponto/:id - Buscar por ID
router.get('/:id', getRegistroById);

// POST /api/ponto - Registrar/Atualizar ponto
router.post('/', registrarPonto);

// PUT /api/ponto/:id/aprovar - Aprovar/Rejeitar ponto
router.put('/:id/aprovar', aprovarPonto);

// DELETE /api/ponto/:id - Deletar registro
router.delete('/:id', deleteRegistro);

export default router;

