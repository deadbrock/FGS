/**
 * Utilitário para enviar erros para o FGS Error Logger
 */

// URL do Error Logger (produção ou desenvolvimento)
const ERROR_LOGGER_URL = import.meta.env.VITE_ERROR_LOGGER_URL || 
  (import.meta.env.PROD 
    ? 'https://fgs-error-logger-production.up.railway.app/api/errors/log' 
    : 'http://localhost:4000/api/errors/log');

// Debug
console.log('🔧 Error Logger URL configurada:', ERROR_LOGGER_URL);
console.log('🔧 Ambiente:', import.meta.env.MODE);

interface ErrorData {
  tipo: 'FRONTEND' | 'BACKEND' | 'API';
  nivel: 'ERROR' | 'WARNING' | 'INFO' | 'DEBUG';
  mensagem: string;
  stack?: string;
  usuario_id?: string;
  usuario_email?: string;
  pagina?: string;
  url?: string;
  metodo?: string;
  status_code?: number;
  dados_adicionais?: any;
  user_agent?: string;
  ip?: string;
}

/**
 * Envia erro para o sistema de logs
 */
async function logError(errorData: ErrorData): Promise<void> {
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
    console.error('Erro ao enviar log:', error);
  }
}

/**
 * Captura erros do frontend (React)
 */
export function logFrontendError(
  error: Error,
  errorInfo?: any,
  user?: { id?: string; email?: string } | null
): void {
  logError({
    tipo: 'FRONTEND',
    nivel: 'ERROR',
    mensagem: error.message || String(error),
    stack: error.stack,
    usuario_id: user?.id,
    usuario_email: user?.email,
    pagina: window.location.pathname,
    url: window.location.href,
    user_agent: navigator.userAgent,
    dados_adicionais: {
      componentStack: errorInfo?.componentStack,
      ...errorInfo,
    },
  });
}

/**
 * Captura warnings (avisos)
 */
export function logWarning(mensagem: string, context?: any): void {
  logError({
    tipo: 'FRONTEND',
    nivel: 'WARNING',
    mensagem,
    dados_adicionais: context,
    pagina: window.location.pathname,
    url: window.location.href,
    user_agent: navigator.userAgent,
  });
}

/**
 * Captura informações (debug)
 */
export function logInfo(mensagem: string, context?: any): void {
  // Apenas em desenvolvimento
  if (import.meta.env.DEV) {
    logError({
      tipo: 'FRONTEND',
      nivel: 'INFO',
      mensagem,
      dados_adicionais: context,
      pagina: window.location.pathname,
    });
  }
}

/**
 * Captura erros de requisições API
 */
export function logAPIError(
  error: any,
  url: string,
  metodo: string = 'GET',
  user?: { id?: string; email?: string } | null
): void {
  logError({
    tipo: 'API',
    nivel: 'ERROR',
    mensagem: error.message || 'Erro na requisição API',
    stack: error.stack,
    url,
    metodo,
    status_code: error.response?.status,
    usuario_id: user?.id,
    usuario_email: user?.email,
    pagina: window.location.pathname,
    user_agent: navigator.userAgent,
    dados_adicionais: {
      response: error.response?.data,
      config: error.config,
    },
  });
}

export default {
  logError,
  logFrontendError,
  logWarning,
  logInfo,
  logAPIError,
};

