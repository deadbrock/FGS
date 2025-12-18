/**
 * Configuração do Error Logger
 * Como fallback se a variável de ambiente não funcionar
 */

export const ERROR_LOGGER_CONFIG = {
  // URL do servidor de logs
  url: import.meta.env.VITE_ERROR_LOGGER_URL || 'http://localhost:4000/api/errors/log',
  
  // Ativar/desativar logging
  enabled: true,
  
  // Log apenas em produção ou sempre
  logInDevelopment: true,
};

// Exportar URL diretamente
export const ERROR_LOGGER_URL = ERROR_LOGGER_CONFIG.url;

// Debug: mostrar no console
console.log('🔧 Error Logger Config:', {
  url: ERROR_LOGGER_CONFIG.url,
  fromEnv: import.meta.env.VITE_ERROR_LOGGER_URL,
  enabled: ERROR_LOGGER_CONFIG.enabled,
});

