/**
 * Handler global para capturar todos os erros não tratados
 */

import { logFrontendError, logWarning } from './errorLogger';

/**
 * Inicializa handlers globais de erro
 */
export function initGlobalErrorHandlers() {
  // Capturar erros não tratados (runtime errors)
  window.addEventListener('error', (event) => {
    console.error('🚨 Erro global capturado:', event.error);
    
    logFrontendError(
      event.error || new Error(event.message),
      {
        tipo: 'unhandledError',
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
      },
      getUserFromStorage()
    );
  });

  // Capturar promises rejeitadas não tratadas
  window.addEventListener('unhandledrejection', (event) => {
    console.error('🚨 Promise rejeitada não tratada:', event.reason);
    
    const error = event.reason instanceof Error 
      ? event.reason 
      : new Error(String(event.reason));
    
    logFrontendError(
      error,
      {
        tipo: 'unhandledRejection',
        promise: event.promise,
      },
      getUserFromStorage()
    );
  });

  // Capturar erros de rede/recursos
  window.addEventListener('error', (event) => {
    const target = event.target as any;
    
    // Verificar se é erro de carregamento de recurso (img, script, link)
    if (target && target.tagName) {
      const tagName = target.tagName.toLowerCase();
      
      if (['img', 'script', 'link', 'iframe'].includes(tagName)) {
        console.error(`🚨 Erro ao carregar recurso: ${tagName}`, target.src || target.href);
        
        logWarning(
          `Falha ao carregar recurso: ${tagName}`,
          {
            tipo: 'resourceError',
            tagName,
            src: target.src || target.href,
            currentSrc: target.currentSrc,
          }
        );
      }
    }
  }, true); // useCapture = true para capturar erros de recursos

  // Capturar avisos do console (opcional)
  const originalWarn = console.warn;
  console.warn = function(...args) {
    // Enviar apenas em desenvolvimento ou se configurado
    if (import.meta.env.DEV) {
      logWarning(
        args.map(arg => String(arg)).join(' '),
        {
          tipo: 'consoleWarning',
          stack: new Error().stack,
        }
      );
    }
    originalWarn.apply(console, args);
  };

  console.log('✅ Global error handlers inicializados');
}

/**
 * Obter usuário do localStorage
 */
function getUserFromStorage() {
  try {
    const userStr = localStorage.getItem('@FGS:user');
    return userStr ? JSON.parse(userStr) : null;
  } catch {
    return null;
  }
}

