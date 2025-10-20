// Tipos para o módulo de Treinamentos

export enum StatusTreinamento {
  ATIVO = 'ATIVO',
  VENCIDO = 'VENCIDO',
  A_VENCER = 'A_VENCER',
  CANCELADO = 'CANCELADO',
  CONCLUIDO = 'CONCLUIDO',
}

export enum StatusAgendamento {
  AGENDADO = 'AGENDADO',
  EM_ANDAMENTO = 'EM_ANDAMENTO',
  CONCLUIDO = 'CONCLUIDO',
  CANCELADO = 'CANCELADO',
}

// Tipo de Treinamento (Template)
export interface TipoTreinamento {
  id: string;
  nome: string;
  descricao: string;
  cargaHoraria: number;
  validadeDias: number; // Validade em dias (0 = sem validade)
  categoria: string;
  obrigatorio: boolean;
  documentoModelo?: string; // URL do modelo de documento
  ativo: boolean;
  criadoEm: string;
  atualizadoEm: string;
}

// Treinamento Individual (Realizado por um colaborador)
export interface TreinamentoColaborador {
  id: string;
  colaboradorId: string;
  colaboradorNome: string;
  tipoTreinamentoId: string;
  tipoTreinamentoNome: string;
  dataRealizacao: string;
  dataValidade?: string; // Calculada automaticamente baseada em validadeDias
  instrutor?: string;
  instituicao?: string;
  nota?: number;
  certificado?: {
    id: string;
    nome: string;
    url: string;
    dataUpload: string;
  };
  observacoes?: string;
  status: StatusTreinamento;
  alertaEnviado: boolean;
  criadoEm: string;
}

// Agendamento de Treinamento
export interface AgendamentoTreinamento {
  id: string;
  tipoTreinamentoId: string;
  tipoTreinamentoNome: string;
  dataInicio: string;
  dataFim: string;
  horario: string;
  local: string;
  instrutor: string;
  instituicao?: string;
  vagasTotal: number;
  vagasOcupadas: number;
  colaboradores: ColaboradorAgendado[];
  status: StatusAgendamento;
  observacoes?: string;
  criadoEm: string;
  criadoPor: string;
}

export interface ColaboradorAgendado {
  id: string;
  colaboradorId: string;
  colaboradorNome: string;
  departamento: string;
  cargo: string;
  confirmado: boolean;
  presente?: boolean;
  nota?: number;
}

// Importação em Massa (CSV)
export interface ImportacaoCSV {
  id: string;
  nomeArquivo: string;
  dataImportacao: string;
  importadoPor: string;
  totalLinhas: number;
  linhasProcessadas: number;
  linhasErro: number;
  status: 'PROCESSANDO' | 'CONCLUIDO' | 'ERRO';
  erros: ErroImportacao[];
}

export interface ErroImportacao {
  linha: number;
  colaborador: string;
  erro: string;
}

// Relatórios
export interface RelatorioTreinamentos {
  periodo: {
    inicio: string;
    fim: string;
  };
  totalTreinamentos: number;
  treinamentosAtivos: number;
  treinamentosVencidos: number;
  treinamentosAVencer: number;
  porSetor: EstatisticaSetor[];
  porTipo: EstatisticaTipo[];
  colaboradoresComTreinamentoVencido: ColaboradorVencimento[];
  colaboradoresPendentes: ColaboradorPendente[];
}

export interface EstatisticaSetor {
  setor: string;
  total: number;
  ativos: number;
  vencidos: number;
  aVencer: number;
  percentualConclusao: number;
}

export interface EstatisticaTipo {
  tipoId: string;
  tipoNome: string;
  total: number;
  concluidos: number;
  vencidos: number;
  aVencer: number;
}

export interface ColaboradorVencimento {
  colaboradorId: string;
  colaboradorNome: string;
  departamento: string;
  cargo: string;
  treinamento: string;
  dataVencimento: string;
  diasVencido: number;
}

export interface ColaboradorPendente {
  colaboradorId: string;
  colaboradorNome: string;
  departamento: string;
  cargo: string;
  treinamentosObrigatoriosPendentes: string[];
}

// Alertas
export interface AlertaTreinamento {
  id: string;
  tipo: 'VENCIMENTO' | 'A_VENCER' | 'OBRIGATORIO_PENDENTE';
  colaboradorId: string;
  colaboradorNome: string;
  treinamentoId: string;
  treinamentoNome: string;
  dataVencimento: string;
  diasParaVencer: number;
  prioridade: 'ALTA' | 'MEDIA' | 'BAIXA';
  lido: boolean;
  criadoEm: string;
}

// Configurações de Alertas
export interface ConfiguracaoAlertas {
  diasAntesVencimento: number;
  enviarEmail: boolean;
  enviarNotificacao: boolean;
  destinatarios: string[];
}

// Filtros
export interface FiltrosTreinamentos {
  status?: StatusTreinamento[];
  tipoTreinamentoId?: string;
  colaboradorId?: string;
  departamento?: string;
  dataInicio?: string;
  dataFim?: string;
  busca?: string;
}

// Dados para importação CSV
export interface LinhaCSV {
  cpf: string;
  colaborador: string;
  tipoTreinamento: string;
  dataRealizacao: string;
  dataValidade?: string;
  instrutor?: string;
  instituicao?: string;
  nota?: string;
  observacoes?: string;
}

