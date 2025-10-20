// Tipos para o módulo de Comunicação Interna

export enum TipoComunicado {
  GERAL = 'GERAL',
  SETOR = 'SETOR',
  UNIDADE = 'UNIDADE',
  FUNCAO = 'FUNCAO',
  INDIVIDUAL = 'INDIVIDUAL',
}

export enum PrioridadeComunicado {
  BAIXA = 'BAIXA',
  NORMAL = 'NORMAL',
  ALTA = 'ALTA',
  URGENTE = 'URGENTE',
}

export enum StatusComunicado {
  RASCUNHO = 'RASCUNHO',
  AGENDADO = 'AGENDADO',
  ENVIADO = 'ENVIADO',
  CANCELADO = 'CANCELADO',
}

export enum CanalNotificacao {
  APP = 'APP',
  EMAIL = 'EMAIL',
  WHATSAPP = 'WHATSAPP',
  SMS = 'SMS',
}

export enum CategoriaComunicado {
  INFORMATIVO = 'INFORMATIVO',
  URGENTE = 'URGENTE',
  EVENTO = 'EVENTO',
  AVISO = 'AVISO',
  BENEFICIOS = 'BENEFICIOS',
  TREINAMENTO = 'TREINAMENTO',
  RH = 'RH',
  SEGURANCA = 'SEGURANCA',
  OUTROS = 'OUTROS',
}

// Comunicado principal
export interface Comunicado {
  id: string;
  titulo: string;
  conteudo: string;
  categoria: CategoriaComunicado;
  prioridade: PrioridadeComunicado;
  
  // Destinatários
  tipo: TipoComunicado;
  destinatarios: Destinatario;
  
  // Canais de envio
  canais: CanalNotificacao[];
  
  // Agendamento
  dataEnvio: string;
  horaEnvio?: string;
  envioImediato: boolean;
  
  // Anexos
  anexos: Anexo[];
  
  // Confirmação de leitura
  exigeLeitura: boolean;
  prazoDias?: number; // Prazo para confirmar leitura
  
  // Status
  status: StatusComunicado;
  
  // Estatísticas
  totalDestinatarios: number;
  totalEnviados: number;
  totalLidos: number;
  totalConfirmados: number;
  
  // Metadados
  criadoPor: string;
  criadoEm: string;
  enviadoEm?: string;
  canceladoEm?: string;
  motivoCancelamento?: string;
}

// Destinatários
export interface Destinatario {
  // Para tipo GERAL
  todos?: boolean;
  
  // Para tipo SETOR
  setores?: string[];
  
  // Para tipo UNIDADE
  unidades?: string[];
  
  // Para tipo FUNCAO
  funcoes?: string[];
  
  // Para tipo INDIVIDUAL
  colaboradores?: string[];
}

// Anexo
export interface Anexo {
  id: string;
  nome: string;
  tipo: string; // image/pdf/doc/etc
  tamanho: number; // em bytes
  url: string;
  uploadEm: string;
}

// Leitura do comunicado (por colaborador)
export interface LeituraComunicado {
  id: string;
  comunicadoId: string;
  colaboradorId: string;
  colaboradorNome: string;
  
  // Canais pelos quais recebeu
  canaisRecebidos: CanalNotificacao[];
  
  // Leitura
  lido: boolean;
  dataLeitura?: string;
  
  // Confirmação (se exigida)
  confirmado: boolean;
  dataConfirmacao?: string;
  
  // Dispositivo/Local
  dispositivo?: string;
  navegador?: string;
  ip?: string;
}

// Histórico de envios
export interface HistoricoEnvio {
  id: string;
  comunicadoId: string;
  comunicadoTitulo: string;
  
  // Detalhes do envio
  canal: CanalNotificacao;
  destinatario: string; // Email, telefone, etc
  colaboradorNome: string;
  
  // Status
  enviado: boolean;
  dataEnvio?: string;
  erro?: string;
  
  // Rastreamento
  entregue?: boolean;
  dataEntrega?: string;
  aberto?: boolean;
  dataAbertura?: string;
}

// Template de comunicado
export interface TemplateComunicado {
  id: string;
  nome: string;
  descricao: string;
  categoria: CategoriaComunicado;
  
  // Conteúdo pré-definido
  tituloModelo: string;
  conteudoModelo: string;
  
  // Configurações padrão
  prioridadePadrao: PrioridadeComunicado;
  canaisPadrao: CanalNotificacao[];
  exigeLeituraPadrao: boolean;
  
  // Metadados
  criadoPor: string;
  criadoEm: string;
  ultimoUso?: string;
  totalUsos: number;
}

// Estatísticas do Dashboard
export interface EstatisticasComunicacao {
  // Totais
  totalComunicados: number;
  totalEnviadosHoje: number;
  totalAgendados: number;
  totalDestinatariosAtivos: number;
  
  // Taxa de leitura
  taxaLeituraGeral: number;
  taxaConfirmacaoGeral: number;
  
  // Por canal
  porCanal: EstatisticaCanal[];
  
  // Por categoria
  porCategoria: EstatisticaCategoria[];
  
  // Últimos comunicados
  ultimosComunicados: Comunicado[];
  
  // Alertas
  comunicadosNaoLidos: number;
  comunicadosPendenteConfirmacao: number;
}

export interface EstatisticaCanal {
  canal: CanalNotificacao;
  totalEnviados: number;
  totalEntregues: number;
  totalAbertos: number;
  taxaEntrega: number;
  taxaAbertura: number;
}

export interface EstatisticaCategoria {
  categoria: CategoriaComunicado;
  quantidade: number;
  percentual: number;
}

// Relatório de efetividade
export interface RelatorioEfetividade {
  periodo: {
    inicio: string;
    fim: string;
  };
  
  // Métricas gerais
  totalComunicados: number;
  totalDestinatarios: number;
  taxaLeituraMedia: number;
  taxaConfirmacaoMedia: number;
  
  // Por tipo
  porTipo: EfetividadeTipo[];
  
  // Por categoria
  porCategoria: EfetividadeCategoria[];
  
  // Por setor
  porSetor: EfetividadeSetor[];
  
  // Comunicados mais efetivos
  maisEfetivos: ComunicadoEfetividade[];
  
  // Comunicados menos efetivos
  menosEfetivos: ComunicadoEfetividade[];
}

export interface EfetividadeTipo {
  tipo: TipoComunicado;
  quantidade: number;
  taxaLeitura: number;
  taxaConfirmacao: number;
}

export interface EfetividadeCategoria {
  categoria: CategoriaComunicado;
  quantidade: number;
  taxaLeitura: number;
  taxaConfirmacao: number;
}

export interface EfetividadeSetor {
  setor: string;
  totalRecebidos: number;
  totalLidos: number;
  totalConfirmados: number;
  taxaLeitura: number;
  taxaConfirmacao: number;
}

export interface ComunicadoEfetividade {
  id: string;
  titulo: string;
  categoria: CategoriaComunicado;
  dataEnvio: string;
  totalDestinatarios: number;
  totalLidos: number;
  totalConfirmados: number;
  taxaLeitura: number;
  taxaConfirmacao: number;
}

// Filtros
export interface FiltrosComunicacao {
  tipo?: TipoComunicado[];
  categoria?: CategoriaComunicado[];
  status?: StatusComunicado[];
  prioridade?: PrioridadeComunicado[];
  dataInicio?: string;
  dataFim?: string;
  criadoPor?: string;
}

// Configurações de notificação
export interface ConfiguracaoNotificacao {
  id: string;
  
  // WhatsApp
  whatsappAtivo: boolean;
  whatsappApiUrl?: string;
  whatsappToken?: string;
  whatsappNumeroOrigem?: string;
  
  // E-mail
  emailAtivo: boolean;
  emailSmtpHost?: string;
  emailSmtpPort?: number;
  emailRemetente?: string;
  emailSenha?: string;
  
  // SMS
  smsAtivo: boolean;
  smsApiUrl?: string;
  smsToken?: string;
  
  // App (Push Notifications)
  appAtivo: boolean;
  appFirebaseKey?: string;
  
  atualizadoEm: string;
}

