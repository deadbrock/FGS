/**
 * Utilitário para enviar erros do backend para o FGS Error Logger
 */

const ERROR_LOGGER_URL = process.env.ERROR_LOGGER_URL || 'http://localhost:4000/api/errors/log';

/**
 * Envia erro para o sistema de logs
 */
async function logError(errorData) {
  try {
    const response = await fetch(ERROR_LOGGER_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(errorData),
    });

    if (!response.ok) {
      console.error('Falha ao enviar erro para logger:', response.statusText);
    }
  } catch (error) {
    // Não queremos que o logger quebre a aplicação
    console.error('Erro ao enviar log:', error.message);
  }
}

/**
 * Captura erros do backend
 */
export function logBackendError(error, req = {}, statusCode = 500) {
  logError({
    tipo: 'BACKEND',
    nivel: statusCode >= 500 ? 'ERROR' : 'WARNING',
    mensagem: error.message || String(error),
    stack: error.stack,
    usuario_id: req.user?.id,
    usuario_email: req.user?.email,
    url: req.originalUrl || req.url,
    metodo: req.method,
    status_code: statusCode,
    user_agent: req.get?.('user-agent'),
    ip: req.ip,
    dados_adicionais: {
      body: req.body,
      params: req.params,
      query: req.query,
    },
  });
}

/**
 * Captura warnings
 */
export function logWarning(mensagem, context = {}) {
  logError({
    tipo: 'BACKEND',
    nivel: 'WARNING',
    mensagem,
    dados_adicionais: context,
  });
}

/**
 * Captura informações (apenas em desenvolvimento)
 */
export function logInfo(mensagem, context = {}) {
  if (process.env.NODE_ENV === 'development') {
    logError({
      tipo: 'BACKEND',
      nivel: 'INFO',
      mensagem,
      dados_adicionais: context,
    });
  }
}

/**
 * Middleware Express para capturar erros automaticamente
 */
export function errorLoggerMiddleware(err, req, res, next) {
  // Log do erro
  logBackendError(err, req, res.statusCode || 500);
  
  // Passa para o próximo middleware de erro
  next(err);
}

export default {
  logError,
  logBackendError,
  logWarning,
  logInfo,
  errorLoggerMiddleware,
};

