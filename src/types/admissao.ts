// =============================================
// TIPOS DO SISTEMA DE ADMISSÃO
// =============================================

export type StatusAdmissao = 'EM_ANDAMENTO' | 'CONCLUIDA' | 'CANCELADA' | 'REPROVADA';
export type EtapaWorkflow = 
  | 'SOLICITACAO_VAGA'
  | 'APROVACAO'
  | 'COLETA_DOCUMENTOS'
  | 'EXAME_ADMISSIONAL'
  | 'VALIDACAO_DOCUMENTOS'
  | 'ENVIO_DOMINIO_WEB'
  | 'GERACAO_CONTRATO'
  | 'ASSINATURA_DIGITAL'
  | 'ENVIO_ESOCIAL';

export type StatusDocumento = 'PENDENTE' | 'RECEBIDO' | 'APROVADO' | 'REPROVADO';
export type StatusEtapa = 'PENDENTE' | 'EM_ANDAMENTO' | 'CONCLUIDA' | 'CANCELADA';
export type TipoContrato = 'CLT' | 'PJ' | 'Estágio' | 'Temporário';

// Admissão principal
export interface Admissao {
  id: string;
  candidato_id?: string;
  nome_candidato: string;
  cpf_candidato: string;
  email_candidato: string;
  telefone_candidato?: string;
  vaga_id?: string;
  cargo: string;
  departamento: string;
  tipo_contrato: TipoContrato;
  salario_proposto?: number;
  data_inicio_prevista?: string;
  etapa_atual: EtapaWorkflow;
  status: StatusAdmissao;
  solicitado_por?: string;
  solicitado_por_nome?: string;
  aprovado_por?: string;
  aprovado_por_nome?: string;
  responsavel_atual?: string;
  responsavel_atual_nome?: string;
  data_solicitacao: string;
  data_aprovacao?: string;
  data_conclusao?: string;
  prazo_final?: string;
  esocial_enviado: boolean;
  esocial_enviado_por_dominio?: boolean;
  esocial_evento_id?: string;
  esocial_data_envio?: string;
  thomson_reuters_enviado: boolean;
  thomson_reuters_id?: string;
  thomson_reuters_data_envio?: string;
  contrato_enviado_dominio?: boolean;
  contrato_assinado_fisicamente?: boolean;
  data_assinatura_fisica?: string;
  observacoes?: string;
  created_at: string;
  updated_at: string;
  // Relacionados
  documentos?: AdmissaoDocumento[];
  workflow?: WorkflowEtapa[];
  notificacoes?: AdmissaoNotificacao[];
  total_documentos?: number;
  documentos_pendentes?: number;
  documentos_aprovados?: number;
}

// Documento da admissão
export interface AdmissaoDocumento {
  id: string;
  admissao_id: string;
  tipo_documento: string;
  nome_documento: string;
  obrigatorio: boolean;
  status: StatusDocumento;
  arquivo_url?: string;
  arquivo_nome?: string;
  arquivo_tamanho?: number;
  arquivo_tipo?: string;
  responsavel_id?: string;
  responsavel_nome?: string;
  prazo_entrega?: string;
  data_recebimento?: string;
  data_aprovacao?: string;
  validado_por?: string;
  validado_por_nome?: string;
  observacoes_validacao?: string;
  created_at: string;
  updated_at: string;
}

// Template de documento
export interface DocumentoTemplate {
  id: string;
  tipo_documento: string;
  nome_documento: string;
  descricao?: string;
  obrigatorio: boolean;
  responsavel_padrao_id?: string;
  responsavel_padrao_role?: string;
  prazo_dias: number;
  ordem: number;
  ativo: boolean;
  created_at: string;
  updated_at: string;
}

// Etapa do workflow
export interface WorkflowEtapa {
  id: string;
  admissao_id: string;
  etapa: EtapaWorkflow;
  status_etapa: StatusEtapa;
  responsavel_id?: string;
  responsavel_nome?: string;
  data_inicio?: string;
  data_conclusao?: string;
  prazo_etapa?: string;
  observacoes?: string;
  created_at: string;
}

// Notificação
export interface AdmissaoNotificacao {
  id: string;
  admissao_id: string;
  destinatario_tipo: 'CANDIDATO' | 'GESTOR' | 'RH' | 'DP' | 'SST';
  destinatario_email: string;
  destinatario_nome?: string;
  tipo_notificacao: string;
  assunto: string;
  corpo_email: string;
  status_envio: 'PENDENTE' | 'ENVIADO' | 'FALHA' | 'CANCELADO';
  data_envio?: string;
  tentativas_envio: number;
  erro_envio?: string;
  link_upload?: string;
  anexos?: any[];
  created_at: string;
  updated_at: string;
}

// DTOs para criação/atualização
export interface CreateAdmissaoDTO {
  nome_candidato: string;
  cpf_candidato: string;
  email_candidato: string;
  telefone_candidato?: string;
  cargo: string;
  departamento: string;
  tipo_contrato?: TipoContrato;
  salario_proposto?: number;
  data_inicio_prevista?: string;
  solicitado_por?: string;
  observacoes?: string;
}

export interface UpdateAdmissaoDTO {
  nome_candidato?: string;
  cpf_candidato?: string;
  email_candidato?: string;
  telefone_candidato?: string;
  cargo?: string;
  departamento?: string;
  tipo_contrato?: TipoContrato;
  salario_proposto?: number;
  data_inicio_prevista?: string;
  etapa_atual?: EtapaWorkflow;
  status?: StatusAdmissao;
  responsavel_atual?: string;
  aprovado_por?: string;
  data_aprovacao?: string;
  data_conclusao?: string;
  prazo_final?: string;
  observacoes?: string;
}

export interface AvancarEtapaDTO {
  proxima_etapa?: EtapaWorkflow;
  responsavel_id?: string;
  observacoes?: string;
}

export interface ValidarDocumentoDTO {
  status: 'APROVADO' | 'REPROVADO';
  observacoes_validacao?: string;
}

// Estatísticas
export interface EstatisticasAdmissao {
  total: number;
  porStatus: Array<{ status: StatusAdmissao; total: string }>;
  porEtapa: Array<{ etapa_atual: EtapaWorkflow; total: string }>;
  tempoMedioDias: string;
  documentosPendentes: number;
  porDepartamento: Array<{ departamento: string; total: string }>;
}

// Filtros
export interface FiltrosAdmissao {
  status?: StatusAdmissao;
  etapa_atual?: EtapaWorkflow;
  responsavel_id?: string;
  departamento?: string;
  search?: string;
  limit?: number;
  offset?: number;
}

