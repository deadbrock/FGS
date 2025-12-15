import { UserRole, Departamento, User } from '../types';

// Verifica se o usuário tem acesso a uma rota específica
export const hasRouteAccess = (user: User | null, route: string): boolean => {
  if (!user) return false;

  const { role, departamento } = user;

  // ADMINISTRADOR tem acesso total
  if (role === UserRole.ADMINISTRADOR) return true;

  // Construir chave de acesso
  const accessKey = `${role}_${departamento || ''}_${route}`;

  // Mapeamento de acessos por perfil e departamento
  const accessMap: Record<string, boolean> = {
    // GESTOR do Departamento Pessoal
    [`GESTOR_${Departamento.DEPARTAMENTO_PESSOAL}_/dashboard`]: true,
    [`GESTOR_${Departamento.DEPARTAMENTO_PESSOAL}_/prontuario`]: true,
    [`GESTOR_${Departamento.DEPARTAMENTO_PESSOAL}_/admissao`]: true,
    [`GESTOR_${Departamento.DEPARTAMENTO_PESSOAL}_/ponto`]: true,
    [`GESTOR_${Departamento.DEPARTAMENTO_PESSOAL}_/beneficios`]: true,
    [`GESTOR_${Departamento.DEPARTAMENTO_PESSOAL}_/relatorios`]: true,
    [`GESTOR_${Departamento.DEPARTAMENTO_PESSOAL}_/usuarios`]: true,
    [`GESTOR_${Departamento.DEPARTAMENTO_PESSOAL}_/regionais`]: true,

    // USUARIO do Departamento Pessoal
    [`USUARIO_${Departamento.DEPARTAMENTO_PESSOAL}_/dashboard`]: true,
    [`USUARIO_${Departamento.DEPARTAMENTO_PESSOAL}_/admissao`]: true,
    [`USUARIO_${Departamento.DEPARTAMENTO_PESSOAL}_/ponto`]: true,
    [`USUARIO_${Departamento.DEPARTAMENTO_PESSOAL}_/beneficios`]: true,

    // GESTOR de outros departamentos (acesso padrão)
    [`GESTOR_${Departamento.RECURSOS_HUMANOS}_/dashboard`]: true,
    [`GESTOR_${Departamento.RECURSOS_HUMANOS}_/prontuario`]: true,
    [`GESTOR_${Departamento.RECURSOS_HUMANOS}_/admissao`]: true,
    [`GESTOR_${Departamento.RECURSOS_HUMANOS}_/treinamentos`]: true,
    [`GESTOR_${Departamento.RECURSOS_HUMANOS}_/ponto`]: true,
    [`GESTOR_${Departamento.RECURSOS_HUMANOS}_/beneficios`]: true,
    [`GESTOR_${Departamento.RECURSOS_HUMANOS}_/comunicacao`]: true,
    [`GESTOR_${Departamento.RECURSOS_HUMANOS}_/relatorios`]: true,
    [`GESTOR_${Departamento.RECURSOS_HUMANOS}_/regionais`]: true,
    [`GESTOR_${Departamento.RECURSOS_HUMANOS}_/colaboradores`]: true,

    [`GESTOR_${Departamento.SEGURANCA_TRABALHO}_/dashboard`]: true,
    [`GESTOR_${Departamento.SEGURANCA_TRABALHO}_/treinamentos`]: true,
    [`GESTOR_${Departamento.SEGURANCA_TRABALHO}_/admissao`]: true,
    [`GESTOR_${Departamento.SEGURANCA_TRABALHO}_/solicitacoes`]: true,

    // USUARIO do Segurança do Trabalho
    [`USUARIO_${Departamento.SEGURANCA_TRABALHO}_/dashboard`]: true,
    [`USUARIO_${Departamento.SEGURANCA_TRABALHO}_/solicitacoes`]: true,
    [`USUARIO_${Departamento.SEGURANCA_TRABALHO}_/admissao`]: true,
    
    // Permitir navegação nas subpáginas de Solicitações para SST
    [`GESTOR_${Departamento.SEGURANCA_TRABALHO}_/solicitacoes/aso-admissional`]: true,
    [`GESTOR_${Departamento.SEGURANCA_TRABALHO}_/solicitacoes/periodicos`]: true,
    [`GESTOR_${Departamento.SEGURANCA_TRABALHO}_/solicitacoes/retorno-trabalho`]: true,
    [`GESTOR_${Departamento.SEGURANCA_TRABALHO}_/solicitacoes/mudanca-risco`]: true,
    [`GESTOR_${Departamento.SEGURANCA_TRABALHO}_/solicitacoes/demissional`]: true,
    [`GESTOR_${Departamento.SEGURANCA_TRABALHO}_/solicitacoes/clinicas`]: true,
    
    [`USUARIO_${Departamento.SEGURANCA_TRABALHO}_/solicitacoes/aso-admissional`]: true,
    [`USUARIO_${Departamento.SEGURANCA_TRABALHO}_/solicitacoes/periodicos`]: true,
    [`USUARIO_${Departamento.SEGURANCA_TRABALHO}_/solicitacoes/retorno-trabalho`]: true,
    [`USUARIO_${Departamento.SEGURANCA_TRABALHO}_/solicitacoes/mudanca-risco`]: true,
    [`USUARIO_${Departamento.SEGURANCA_TRABALHO}_/solicitacoes/demissional`]: true,
    [`USUARIO_${Departamento.SEGURANCA_TRABALHO}_/solicitacoes/clinicas`]: true,

    // COLABORADOR (acesso básico)
    [`COLABORADOR_/dashboard`]: true,
  };
  
  return accessMap[accessKey] || false;
};

// Define as permissões de cada rota (mantido para compatibilidade)
export const routePermissions: Record<string, UserRole[]> = {
  '/dashboard': [UserRole.ADMINISTRADOR, UserRole.GESTOR, UserRole.COLABORADOR, UserRole.USUARIO],
  '/usuarios': [UserRole.ADMINISTRADOR, UserRole.GESTOR],
  '/prontuario': [UserRole.ADMINISTRADOR, UserRole.GESTOR],
  '/treinamentos': [UserRole.ADMINISTRADOR, UserRole.GESTOR],
  '/ponto': [UserRole.ADMINISTRADOR, UserRole.GESTOR, UserRole.USUARIO],
  '/beneficios': [UserRole.ADMINISTRADOR, UserRole.GESTOR, UserRole.USUARIO],
  '/comunicacao': [UserRole.ADMINISTRADOR, UserRole.GESTOR],
  '/relatorios': [UserRole.ADMINISTRADOR, UserRole.GESTOR],
  '/regionais': [UserRole.ADMINISTRADOR, UserRole.GESTOR],
  '/seguranca': [UserRole.ADMINISTRADOR],
  '/integracoes': [UserRole.ADMINISTRADOR],
  '/configuracoes': [UserRole.ADMINISTRADOR],
  '/colaboradores': [UserRole.ADMINISTRADOR, UserRole.GESTOR],
  '/admissao': [UserRole.ADMINISTRADOR, UserRole.GESTOR, UserRole.USUARIO],
  '/solicitacoes': [UserRole.ADMINISTRADOR, UserRole.GESTOR, UserRole.USUARIO],
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

