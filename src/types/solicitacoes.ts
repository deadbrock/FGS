// =============================================
// TIPOS DO SISTEMA DE SOLICITAÇÕES SST
// =============================================

export type TipoExame = 
  | 'ASO_ADMISSIONAL'
  | 'PERIODICO'
  | 'RETORNO_TRABALHO'
  | 'MUDANCA_RISCO'
  | 'DEMISSIONAL';

export type StatusSolicitacao = 
  | 'PENDENTE'
  | 'AGENDADO'
  | 'REALIZADO'
  | 'CANCELADO'
  | 'REPROVADO';

export type StatusAgendamento = 
  | 'AGUARDANDO_CONFIRMACAO'
  | 'CONFIRMADO'
  | 'REALIZADO'
  | 'CANCELADO'
  | 'NAO_COMPARECEU';

// Solicitação de Exame
export interface SolicitacaoExame {
  id: string;
  tipo_exame: TipoExame;
  colaborador_id?: string;
  colaborador_nome: string;
  colaborador_cpf: string;
  colaborador_email?: string;
  colaborador_telefone?: string;
  cargo: string;
  cargo_anterior?: string; // Para mudança de risco
  departamento: string;
  setor: string;
  admissao_id?: string; // Se for ASO Admissional
  status: StatusSolicitacao;
  data_solicitacao: string;
  solicitado_por: string;
  solicitado_por_nome?: string;
  observacoes?: string;
  // Campos específicos
  motivo_afastamento?: string; // Para retorno ao trabalho
  data_afastamento?: string; // Para retorno ao trabalho
  data_desligamento?: string; // Para demissional
  motivo_desligamento?: string; // Para demissional
  // Agendamento
  clinica_id?: string;
  clinica_nome?: string;
  data_agendamento?: string;
  hora_agendamento?: string;
  status_agendamento?: StatusAgendamento;
  // Resultado
  resultado?: 'APTO' | 'INAPTO' | 'APTO_COM_RESTRICOES';
  restricoes?: string;
  data_realizacao?: string;
  medico_responsavel?: string;
  crm_medico?: string;
  aso_arquivo_url?: string;
  // Auditoria
  created_at: string;
  updated_at: string;
}

// Clínica
export interface Clinica {
  id: string;
  nome: string;
  cnpj: string;
  razao_social?: string;
  telefone: string;
  email: string;
  endereco: {
    logradouro: string;
    numero: string;
    complemento?: string;
    bairro: string;
    cidade: string;
    estado: string;
    cep: string;
  };
  responsavel_nome?: string;
  responsavel_telefone?: string;
  responsavel_email?: string;
  especialidades?: string[]; // Tipos de exames que realiza
  observacoes?: string;
  ativo: boolean;
  created_at?: string;
  updated_at?: string;
}

// Agendamento
export interface Agendamento {
  id: string;
  solicitacao_id: string;
  clinica_id: string;
  clinica_nome: string;
  data_agendamento: string;
  hora_agendamento: string;
  status: StatusAgendamento;
  observacoes?: string;
  confirmado_por?: string;
  confirmado_em?: string;
  cancelado_por?: string;
  cancelado_em?: string;
  motivo_cancelamento?: string;
  created_at: string;
  updated_at: string;
}

// DTOs
export interface CreateSolicitacaoDTO {
  tipo_exame: TipoExame;
  colaborador_id?: string;
  colaborador_nome: string;
  colaborador_cpf: string;
  colaborador_email?: string;
  colaborador_telefone?: string;
  cargo: string;
  cargo_anterior?: string; // Para mudança de risco
  departamento: string;
  setor: string;
  admissao_id?: string;
  motivo_afastamento?: string; // Para retorno ao trabalho
  data_afastamento?: string; // Para retorno ao trabalho
  data_desligamento?: string; // Para demissional
  motivo_desligamento?: string; // Para demissional
  observacoes?: string;
}

export interface UpdateClinicaDTO {
  nome?: string;
  cnpj?: string;
  razao_social?: string;
  telefone?: string;
  email?: string;
  endereco?: {
    logradouro: string;
    numero: string;
    complemento?: string;
    bairro: string;
    cidade: string;
    estado: string;
    cep: string;
  };
  responsavel_nome?: string;
  responsavel_telefone?: string;
  responsavel_email?: string;
  especialidades?: string[];
  observacoes?: string;
  ativo?: boolean;
}

export interface CreateClinicaDTO {
  nome: string;
  cnpj: string;
  razao_social?: string;
  telefone: string;
  email: string;
  endereco: {
    logradouro: string;
    numero: string;
    complemento?: string;
    bairro: string;
    cidade: string;
    estado: string;
    cep: string;
  };
  responsavel_nome?: string;
  responsavel_telefone?: string;
  responsavel_email?: string;
  especialidades?: string[];
  observacoes?: string;
  ativo?: boolean;
}

export interface CreateAgendamentoDTO {
  solicitacao_id: string;
  clinica_id: string;
  data_agendamento: string;
  hora_agendamento: string;
  observacoes?: string;
}

export interface UpdateResultadoExameDTO {
  resultado: 'APTO' | 'INAPTO' | 'APTO_COM_RESTRICOES';
  restricoes?: string;
  data_realizacao: string;
  medico_responsavel: string;
  crm_medico: string;
  aso_arquivo_url?: string;
}

// Filtros
export interface FiltrosSolicitacoes {
  tipo_exame?: TipoExame;
  status?: StatusSolicitacao;
  colaborador_nome?: string;
  departamento?: string;
  data_inicio?: string;
  data_fim?: string;
  clinica_id?: string;
  limit?: number;
  offset?: number;
}

// Estatísticas
export interface EstatisticasSolicitacoes {
  total: number;
  por_tipo: Array<{ tipo_exame: TipoExame; total: number }>;
  por_status: Array<{ status: StatusSolicitacao; total: number }>;
  pendentes_agendamento: number;
  realizados_mes: number;
  taxa_aprovacao: number;
}

