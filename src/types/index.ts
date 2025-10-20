// Tipos de perfis de usuário
export enum UserRole {
  ADMINISTRADOR = 'ADMINISTRADOR',
  RH = 'RH',
  GESTOR = 'GESTOR',
  COLABORADOR = 'COLABORADOR',
}

// Interface de usuário
export interface User {
  id: string;
  nome: string;
  email: string;
  role: UserRole;
  avatar?: string;
  departamento?: string;
  cargo?: string;
}

// Interface de dados de login
export interface LoginCredentials {
  email: string;
  senha: string;
}

// Interface de resposta de login
export interface LoginResponse {
  token: string;
  user: User;
}

// Interface de contexto de autenticação
export interface AuthContextData {
  user: User | null;
  signed: boolean;
  loading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
}

// Interface de log de navegação
export interface NavigationLog {
  id: string;
  userId: string;
  userName: string;
  route: string;
  timestamp: Date;
  action: string;
}

// Interface de permissões
export interface Permission {
  path: string;
  allowedRoles: UserRole[];
}

// Tipos de rotas
export interface RouteConfig {
  path: string;
  element: React.ReactNode;
  allowedRoles?: UserRole[];
  title?: string;
}

// Estatísticas do Dashboard
export interface DashboardStats {
  totalColaboradores: number;
  colaboradoresAtivos: number;
  novosColaboradores: number;
  taxaPresenca: number;
}

