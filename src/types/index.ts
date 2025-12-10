// Tipos de perfis de usuário
export enum UserRole {
  ADMINISTRADOR = 'ADMINISTRADOR',
  GESTOR = 'GESTOR',
  COLABORADOR = 'COLABORADOR',
  USUARIO = 'USUARIO',
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

// Tipos de departamentos
export enum Departamento {
  RECURSOS_HUMANOS = 'Recursos Humanos',
  DEPARTAMENTO_PESSOAL = 'Departamento Pessoal',
  SEGURANCA_TRABALHO = 'Segurança do Trabalho',
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

// ============================================
// MÓDULO DE PRONTUÁRIO
// ============================================

// Tipos de eventos no histórico do colaborador
export enum TipoEventoHistorico {
  ADMISSAO = 'ADMISSAO',
  ATESTADO = 'ATESTADO',
  ADVERTENCIA = 'ADVERTENCIA',
  SUSPENSAO = 'SUSPENSAO',
  PROMOCAO = 'PROMOCAO',
  TRANSFERENCIA = 'TRANSFERENCIA',
  FERIAS = 'FERIAS',
  LICENCA = 'LICENCA',
  AFASTAMENTO = 'AFASTAMENTO',
  TREINAMENTO = 'TREINAMENTO',
  ELOGIO = 'ELOGIO',
  DEMISSAO = 'DEMISSAO',
}

// Tipo de advertência
export enum TipoAdvertencia {
  VERBAL = 'VERBAL',
  ESCRITA = 'ESCRITA',
  SUSPENSAO = 'SUSPENSAO',
}

// Status do colaborador
export enum StatusColaborador {
  ATIVO = 'ATIVO',
  AFASTADO = 'AFASTADO',
  FERIAS = 'FERIAS',
  DEMITIDO = 'DEMITIDO',
}

// Interface base para colaborador no prontuário
export interface Colaborador {
  id: string;
  nome: string;
  cpf: string;
  rg?: string;
  email: string;
  telefone: string;
  cargo: string;
  departamento: string;
  dataAdmissao: Date;
  dataDemissao?: Date;
  status: StatusColaborador;
  avatar?: string;
  salario?: number;
  cargaHoraria?: number;
  supervisor?: string;
}

// Interface para evento de histórico
export interface EventoHistorico {
  id: string;
  colaboradorId: string;
  tipo: TipoEventoHistorico;
  data: Date;
  descricao: string;
  observacoes?: string;
  documentoAnexo?: string;
  registradoPor: string;
  registradoPorNome: string;
  
  // Campos específicos por tipo de evento
  atestado?: {
    cid?: string;
    diasAfastamento: number;
    dataInicio: Date;
    dataFim: Date;
    medicoNome?: string;
    medicoCrm?: string;
  };
  
  advertencia?: {
    tipo: TipoAdvertencia;
    motivo: string;
    gravidade: 'LEVE' | 'MEDIA' | 'GRAVE';
    testemunhas?: string[];
  };
  
  ferias?: {
    dataInicio: Date;
    dataFim: Date;
    diasCorridos: number;
    periodoAquisitivo: string;
  };
  
  promocao?: {
    cargoAnterior: string;
    cargoNovo: string;
    salarioAnterior?: number;
    salarioNovo?: number;
  };
  
  transferencia?: {
    departamentoOrigem: string;
    departamentoDestino: string;
    motivoTransferencia?: string;
  };
  
  demissao?: {
    motivoDemissao: string;
    tipoDemissao: 'VOLUNTARIA' | 'SEM_JUSTA_CAUSA' | 'JUSTA_CAUSA' | 'ACORDO';
    dataAviso?: Date;
  };
}

// Exportações de tipos de outros módulos
export * from './regionais';

