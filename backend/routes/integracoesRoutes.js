import express from 'express';
import {
  getEstatisticas,
  getAllIntegracoes,
  getIntegracaoById,
  createIntegracao,
  updateIntegracao,
  deleteIntegracao,
  sincronizarIntegracao,
  ativarIntegracao,
  desativarIntegracao,
  testarIntegracao,
  salvarConfigPonto,
  salvarConfigEmail,
  salvarConfigWhatsApp,
} from '../controllers/integracoesController.js';
import {
  uploadMiddleware,
  importarArquivo,
  exportarDados,
  getHistoricoImportacoes,
  getDetalhesImportacao,
  downloadRelatorioImportacao,
  getTemplatesExportacao,
} from '../controllers/importacaoExportacaoController.js';

const router = express.Router();

// ==========================================
// ESTATÍSTICAS
// ==========================================

// GET /api/integracoes/estatisticas - Estatísticas gerais
router.get('/estatisticas', getEstatisticas);

// ==========================================
// CRUD DE INTEGRAÇÕES
// ==========================================

// GET /api/integracoes - Listar todas as integrações
router.get('/', getAllIntegracoes);

// GET /api/integracoes/:id - Obter integração por ID
router.get('/:id', getIntegracaoById);

// POST /api/integracoes - Criar nova integração
router.post('/', createIntegracao);

// PUT /api/integracoes/:id - Atualizar integração
router.put('/:id', updateIntegracao);

// DELETE /api/integracoes/:id - Deletar integração
router.delete('/:id', deleteIntegracao);

// ==========================================
// AÇÕES
// ==========================================

// POST /api/integracoes/:id/sincronizar - Sincronizar integração
router.post('/:id/sincronizar', sincronizarIntegracao);

// POST /api/integracoes/:id/ativar - Ativar integração
router.post('/:id/ativar', ativarIntegracao);

// POST /api/integracoes/:id/desativar - Desativar integração
router.post('/:id/desativar', desativarIntegracao);

// POST /api/integracoes/:id/testar - Testar integração
router.post('/:id/testar', testarIntegracao);

// ==========================================
// CONFIGURAÇÕES ESPECÍFICAS
// ==========================================

// POST /api/integracoes/configuracoes/ponto - Salvar configuração de ponto
router.post('/configuracoes/ponto', salvarConfigPonto);

// POST /api/integracoes/configuracoes/email - Salvar configuração de email
router.post('/configuracoes/email', salvarConfigEmail);

// POST /api/integracoes/configuracoes/whatsapp - Salvar configuração de WhatsApp
router.post('/configuracoes/whatsapp', salvarConfigWhatsApp);

// ==========================================
// IMPORTAÇÃO/EXPORTAÇÃO
// ==========================================

// POST /api/integracoes/importar - Importar arquivo
router.post('/importar', uploadMiddleware, importarArquivo);

// POST /api/integracoes/exportar - Exportar dados
router.post('/exportar', exportarDados);

// GET /api/integracoes/importacoes/historico - Histórico de importações
router.get('/importacoes/historico', getHistoricoImportacoes);

// GET /api/integracoes/importacoes/:id - Detalhes de importação
router.get('/importacoes/:id', getDetalhesImportacao);

// GET /api/integracoes/importacoes/:id/relatorio - Download relatório de erros
router.get('/importacoes/:id/relatorio', downloadRelatorioImportacao);

// GET /api/integracoes/exportar/templates - Templates de exportação
router.get('/exportar/templates', getTemplatesExportacao);

export default router;

