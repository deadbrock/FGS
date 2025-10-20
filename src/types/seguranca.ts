// Tipos para o módulo de Segurança e Controle de Acesso

import { UserRole } from './index';

export enum TipoAcao {
  CRIAR = 'CRIAR',
  EDITAR = 'EDITAR',
  VISUALIZAR = 'VISUALIZAR',
  EXCLUIR = 'EXCLUIR',
  EXPORTAR = 'EXPORTAR',
}

export enum StatusUsuario {
  ATIVO = 'ATIVO',
  INATIVO = 'INATIVO',
  BLOQUEADO = 'BLOQUEADO',
  PENDENTE = 'PENDENTE',
}

// Usuário do Sistema
export interface Usuario {
  id: string;
  nome: string;
  email: string;
  role: UserRole;
  status: StatusUsuario;
  
  // Dados adicionais
  departamento?: string;
  cargo?: string;
  telefone?: string;
  foto?: string;
  
  // Controle de acesso
  ultimoAcesso?: string;
  tentativasLogin: number;
  senhaExpirada: boolean;
  dataExpiracao?: string;
  
  // Permissões customizadas
  permissoesCustomizadas: PermissaoModulo[];
  
  // Metadados
  criadoPor: string;
  criadoEm: string;
  atualizadoEm?: string;
}

// Perfil/Role
export interface Perfil {
  id: string;
  nome: UserRole;
  descricao: string;
  permissoes: PermissaoModulo[];
  usuariosCount: number;
  cor: string;
  icone: string;
}

// Permissão por Módulo
export interface PermissaoModulo {
  modulo: string;
  acoes: TipoAcao[];
}

// Log de Acesso
export interface LogAcesso {
  id: string;
  usuarioId: string;
  usuarioNome: string;
  email: string;
  role: UserRole;
  
  // Detalhes do acesso
  dataHora: string;
  ip: string;
  navegador: string;
  dispositivo: string;
  localizacao?: string;
  
  // Status
  sucesso: boolean;
  motivoFalha?: string;
  
  // Ação
  acao: 'LOGIN' | 'LOGOUT' | 'TENTATIVA_FALHA';
}

// Log de Alterações
export interface LogAlteracao {
  id: string;
  usuarioId: string;
  usuarioNome: string;
  role: UserRole;
  
  // Detalhes da alteração
  dataHora: string;
  modulo: string;
  acao: TipoAcao;
  entidade: string;
  entidadeId: string;
  
  // Dados alterados
  camposAlterados: CampoAlterado[];
  
  // Contexto
  ip: string;
  navegador: string;
}

export interface CampoAlterado {
  campo: string;
  valorAnterior: string | number | boolean;
  valorNovo: string | number | boolean;
}

// Estatísticas de Segurança
export interface EstatisticasSeguranca {
  // Usuários
  totalUsuarios: number;
  usuariosAtivos: number;
  usuariosInativos: number;
  usuariosBloqueados: number;
  
  // Acessos
  acessosHoje: number;
  tentativasFalhasHoje: number;
  acessosUltimos7Dias: AcessoDia[];
  
  // Logs
  totalLogsAcesso: number;
  totalLogsAlteracao: number;
  
  // Por perfil
  usuariosPorPerfil: UsuariosPorPerfil[];
  
  // Alertas
  alertas: AlertaSeguranca[];
}

export interface AcessoDia {
  data: string;
  sucessos: number;
  falhas: number;
}

export interface UsuariosPorPerfil {
  perfil: UserRole;
  quantidade: number;
  percentual: number;
}

export interface AlertaSeguranca {
  id: string;
  tipo: 'ERRO' | 'AVISO' | 'INFO';
  titulo: string;
  mensagem: string;
  usuarioId?: string;
  dataHora: string;
}

// Configurações de Segurança
export interface ConfiguracoesSeguranca {
  // Senha
  senhaMinLength: number;
  senhaExigeNumero: boolean;
  senhaExigeMaiuscula: boolean;
  senhaExigeCaractereEspecial: boolean;
  senhaExpiracaoDias: number;
  
  // Bloqueio
  maxTentativasLogin: number;
  tempoBloqueioMinutos: number;
  
  // Sessão
  tempoSessaoMinutos: number;
  exigeDoisFatores: boolean;
  
  // Logs
  manterLogsAcessoDias: number;
  manterLogsAlteracaoDias: number;
}

// Filtros
export interface FiltrosSeguranca {
  dataInicio?: string;
  dataFim?: string;
  usuarioId?: string;
  role?: UserRole[];
  status?: StatusUsuario[];
  acao?: TipoAcao[];
  modulo?: string[];
}

