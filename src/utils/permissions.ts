import { UserRole } from '../types';

// Define as permissões de cada rota
export const routePermissions: Record<string, UserRole[]> = {
  '/dashboard': [UserRole.ADMINISTRADOR, UserRole.RH, UserRole.GESTOR, UserRole.COLABORADOR, UserRole.SEGURANCA_TRABALHO],
  '/usuarios': [UserRole.ADMINISTRADOR, UserRole.RH],
  '/prontuario': [UserRole.ADMINISTRADOR, UserRole.RH, UserRole.GESTOR],
  '/treinamentos': [UserRole.ADMINISTRADOR, UserRole.RH, UserRole.GESTOR, UserRole.SEGURANCA_TRABALHO],
  '/ponto': [UserRole.ADMINISTRADOR, UserRole.RH, UserRole.GESTOR],
  '/beneficios': [UserRole.ADMINISTRADOR, UserRole.RH, UserRole.GESTOR],
  '/comunicacao': [UserRole.ADMINISTRADOR, UserRole.RH, UserRole.GESTOR],
  '/relatorios': [UserRole.ADMINISTRADOR, UserRole.RH, UserRole.GESTOR],
  '/regionais': [UserRole.ADMINISTRADOR, UserRole.RH, UserRole.GESTOR],
  '/seguranca': [UserRole.ADMINISTRADOR],
  '/integracoes': [UserRole.ADMINISTRADOR],
  '/configuracoes': [UserRole.ADMINISTRADOR],
  '/colaboradores': [UserRole.ADMINISTRADOR, UserRole.RH, UserRole.GESTOR],
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
  const roleNames: Record<UserRole, string> = {
    [UserRole.ADMINISTRADOR]: 'Administrador',
    [UserRole.RH]: 'Recursos Humanos',
    [UserRole.GESTOR]: 'Gestor',
    [UserRole.COLABORADOR]: 'Colaborador',
    [UserRole.SEGURANCA_TRABALHO]: 'Segurança do Trabalho',
  };
  
  return roleNames[role] || role;
};

// Retorna a cor do perfil para badges
export const getRoleColor = (role: UserRole): string => {
  const roleColors: Record<UserRole, string> = {
    [UserRole.ADMINISTRADOR]: '#a2122a',
    [UserRole.RH]: '#354a80',
    [UserRole.GESTOR]: '#f57c00',
    [UserRole.COLABORADOR]: '#388e3c',
    [UserRole.SEGURANCA_TRABALHO]: '#1976d2',
  };
  
  return roleColors[role] || '#666666';
};

