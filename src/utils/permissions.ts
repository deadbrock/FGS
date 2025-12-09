import { UserRole } from '../types';

// Define as permissões de cada rota
export const routePermissions: Record<string, UserRole[]> = {
  '/dashboard': [UserRole.ADMINISTRADOR, UserRole.GESTOR, UserRole.COLABORADOR, UserRole.USUARIO],
  '/usuarios': [UserRole.ADMINISTRADOR],
  '/prontuario': [UserRole.ADMINISTRADOR, UserRole.GESTOR],
  '/treinamentos': [UserRole.ADMINISTRADOR, UserRole.GESTOR],
  '/ponto': [UserRole.ADMINISTRADOR, UserRole.GESTOR],
  '/beneficios': [UserRole.ADMINISTRADOR, UserRole.GESTOR],
  '/comunicacao': [UserRole.ADMINISTRADOR, UserRole.GESTOR],
  '/relatorios': [UserRole.ADMINISTRADOR, UserRole.GESTOR],
  '/regionais': [UserRole.ADMINISTRADOR, UserRole.GESTOR],
  '/seguranca': [UserRole.ADMINISTRADOR],
  '/integracoes': [UserRole.ADMINISTRADOR],
  '/configuracoes': [UserRole.ADMINISTRADOR],
  '/colaboradores': [UserRole.ADMINISTRADOR, UserRole.GESTOR],
};

// Verifica se o usuário tem permissão para acessar uma rota
export const hasPermission = (userRole: UserRole, path: string): boolean => {
  // Remove query strings e fragmentos
  const cleanPath = path.split('?')[0].split('#')[0];
  
  // Busca permissão exata ou genérica
  const allowedRoles = routePermissions[cleanPath];
  
  // Se não há permissões definidas, permite acesso
  if (!allowedRoles) {
    return true;
  }
  
  // Verifica se o role do usuário está na lista de permitidos
  return allowedRoles.includes(userRole);
};

// Retorna o nome amigável do perfil
export const getRoleName = (role: UserRole): string => {
  // Proteção contra undefined/null
  if (!role) {
    return 'N/A';
  }
  
  const roleNames: Record<UserRole, string> = {
    [UserRole.ADMINISTRADOR]: 'Administrador',
    [UserRole.GESTOR]: 'Gestor',
    [UserRole.COLABORADOR]: 'Colaborador',
    [UserRole.USUARIO]: 'Usuário',
  };
  
  return roleNames[role] || role;
};

// Retorna a cor do perfil para badges
export const getRoleColor = (role: UserRole): string => {
  // Proteção contra undefined/null
  if (!role) {
    return '#9e9e9e';
  }
  
  const roleColors: Record<UserRole, string> = {
    [UserRole.ADMINISTRADOR]: '#a2122a',
    [UserRole.GESTOR]: '#f57c00',
    [UserRole.COLABORADOR]: '#388e3c',
    [UserRole.USUARIO]: '#1976d2',
  };
  
  return roleColors[role] || '#666666';
};

