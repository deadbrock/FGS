// Configuração centralizada da API
// Este arquivo garante que a URL sempre terá /api

const getAPIBaseURL = (): string => {
  const envURL = import.meta.env.VITE_API_URL;
  
  // Se estiver em desenvolvimento local
  if (import.meta.env.DEV) {
    return 'http://localhost:3333';
  }
  
  // Se tiver VITE_API_URL definido
  if (envURL) {
    return envURL;
  }
  
  // Fallback para produção (Railway)
  return 'https://fgs-production.up.railway.app';
};

export const API_BASE_URL = getAPIBaseURL();

// URLs completas para cada módulo
export const API_ENDPOINTS = {
  auth: `${API_BASE_URL}/api/auth`,
  usuarios: `${API_BASE_URL}/api/usuarios`,
  colaboradores: `${API_BASE_URL}/api/colaboradores`,
  beneficios: `${API_BASE_URL}/api/beneficios`,
  treinamentos: `${API_BASE_URL}/api/treinamentos`,
  solicitacoes: `${API_BASE_URL}/api/solicitacoes`,
  clinicas: `${API_BASE_URL}/api/solicitacoes/clinicas`,
  epis: `${API_BASE_URL}/api/epis`,
  admissoes: `${API_BASE_URL}/api/admissoes`,
  documentos: `${API_BASE_URL}/api/documentos`,
  seguranca: `${API_BASE_URL}/api/seguranca`,
  integracoes: `${API_BASE_URL}/api/integracoes`,
  relatorios: `${API_BASE_URL}/api/relatorios`,
  ponto: `${API_BASE_URL}/api/ponto`,
  regionais: `${API_BASE_URL}/api/regionais`,
};

console.log('🔧 API Base URL configurada:', API_BASE_URL);

