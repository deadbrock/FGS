// Tipos para o módulo de Integrações

export enum TipoIntegracao {
  PONTO_ELETRONICO = 'PONTO_ELETRONICO',
  EMAIL = 'EMAIL',
  WHATSAPP = 'WHATSAPP',
  API_EXTERNA = 'API_EXTERNA',
  IMPORTACAO_EXPORTACAO = 'IMPORTACAO_EXPORTACAO',
}

export enum StatusIntegracao {
  ATIVA = 'ATIVA',
  INATIVA = 'INATIVA',
  ERRO = 'ERRO',
  CONFIGURANDO = 'CONFIGURANDO',
  TESTANDO = 'TESTANDO',
}

export enum TipoAutenticacao {
  API_KEY = 'API_KEY',
  OAUTH2 = 'OAUTH2',
  BASIC = 'BASIC',
  TOKEN = 'TOKEN',
  CERTIFICADO = 'CERTIFICADO',
}

// Integração Base
export interface Integracao {
  id: string;
  nome: string;
  tipo: TipoIntegracao;
  status: StatusIntegracao;
  descricao: string;
  icone: string;
  cor: string;
  
  // Configurações
  configuracoes: ConfiguracaoIntegracao;
  
  // Estatísticas
  ultimaSincronizacao?: string;
  proximaSincronizacao?: string;
  totalRegistros: number;
  registrosHoje: number;
  errosHoje: number;
  
  // Controle
  ativa: boolean;
  testeRealizado: boolean;
  dataUltimoTeste?: string;
  resultadoTeste?: ResultadoTeste;
  
  // Metadados
  criadoEm: string;
  atualizadoEm?: string;
  criadoPor: string;
}

// Configurações Genéricas
export interface ConfiguracaoIntegracao {
  url?: string;
  porta?: number;
  usuario?: string;
  senha?: string;
  apiKey?: string;
  token?: string;
  tipoAutenticacao: TipoAutenticacao;
  parametrosAdicionais?: Record<string, string>;
  headers?: Record<string, string>;
  timeout?: number;
  tentativas?: number;
}

// Ponto Eletrônico
export interface IntegracaoPontoEletronico extends Integracao {
  tipo: TipoIntegracao.PONTO_ELETRONICO;
  configuracoesPonto: ConfiguracaoPontoEletronico;
}

export interface ConfiguracaoPontoEletronico {
  fornecedor: 'IDCLASS' | 'REP' | 'SECULLUM' | 'OUTRO';
  modelo: string;
  ipDispositivo?: string;
  intervaloSincronizacao: number; // minutos
  sincronizarAutomaticamente: boolean;
  armazenarFotos: boolean;
  validarReconhecimentoFacial: boolean;
}

// E-mail Corporativo
export interface IntegracaoEmail extends Integracao {
  tipo: TipoIntegracao.EMAIL;
  configuracoesEmail: ConfiguracaoEmail;
}

export interface ConfiguracaoEmail {
  provedor: 'SMTP' | 'GMAIL' | 'OUTLOOK' | 'SENDGRID' | 'AWS_SES' | 'OUTRO';
  host: string;
  porta: number;
  seguranca: 'TLS' | 'SSL' | 'STARTTLS' | 'NENHUMA';
  remetentePadrao: string;
  nomeRemetente: string;
  usarAutenticacao: boolean;
  testarConexao: boolean;
  limiteEnvioHora?: number;
  limiteEnvioDia?: number;
}

// WhatsApp Business API
export interface IntegracaoWhatsApp extends Integracao {
  tipo: TipoIntegracao.WHATSAPP;
  configuracoesWhatsApp: ConfiguracaoWhatsApp;
}

export interface ConfiguracaoWhatsApp {
  provedor: 'META' | 'TWILIO' | 'MESSAGEBIRD' | 'OUTRO';
  numeroTelefone: string;
  phoneNumberId?: string;
  wabaId?: string; // WhatsApp Business Account ID
  permitirEnvioEmMassa: boolean;
  templatesMensagens: TemplateMensagem[];
  webhookUrl?: string;
}

export interface TemplateMensagem {
  id: string;
  nome: string;
  conteudo: string;
  variaveis: string[];
  aprovado: boolean;
}

// API Externa
export interface IntegracaoApiExterna extends Integracao {
  tipo: TipoIntegracao.API_EXTERNA;
  configuracoesApi: ConfiguracaoApiExterna;
}

export interface ConfiguracaoApiExterna {
  nomeApi: string;
  versao: string;
  documentacaoUrl?: string;
  endpoints: EndpointApi[];
  webhooks: WebhookConfig[];
  rateLimiting?: RateLimit;
}

export interface EndpointApi {
  id: string;
  nome: string;
  metodo: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  path: string;
  descricao: string;
  autenticacaoRequerida: boolean;
  ativo: boolean;
  totalChamadas: number;
}

export interface WebhookConfig {
  id: string;
  nome: string;
  url: string;
  evento: string;
  ativo: boolean;
  secretKey?: string;
}

export interface RateLimit {
  requisicoesMinuto: number;
  requisicoesHora: number;
  requisicoesDia: number;
}

// Importação/Exportação
export interface ConfiguracaoImportExport {
  formatosSuportados: FormatoArquivo[];
  tamanhoMaximoMB: number;
  colunasMapeamento: MapeamentoColunas[];
  validacaoAutomatica: boolean;
  notificarErros: boolean;
  emailNotificacao?: string;
}

export enum FormatoArquivo {
  CSV = 'CSV',
  XLSX = 'XLSX',
  XLS = 'XLS',
  JSON = 'JSON',
  XML = 'XML',
}

export interface MapeamentoColunas {
  nomeColuna: string;
  campoDestino: string;
  obrigatorio: boolean;
  tipo: 'string' | 'number' | 'date' | 'boolean';
  validacao?: string;
}

// Resultado de Teste
export interface ResultadoTeste {
  sucesso: boolean;
  mensagem: string;
  detalhes?: string;
  tempoResposta?: number;
  dataHoraTeste: string;
}

// Log de Sincronização
export interface LogSincronizacao {
  id: string;
  integracaoId: string;
  integracaoNome: string;
  tipoIntegracao: TipoIntegracao;
  
  dataHoraInicio: string;
  dataHoraFim?: string;
  duracao?: number;
  
  status: 'EM_ANDAMENTO' | 'SUCESSO' | 'FALHA' | 'PARCIAL';
  
  totalRegistros: number;
  registrosProcessados: number;
  registrosErro: number;
  registrosSucesso: number;
  
  mensagemErro?: string;
  detalhesErro?: string;
  
  tipoOperacao: 'IMPORTACAO' | 'EXPORTACAO' | 'SINCRONIZACAO';
}

// Estatísticas de Integrações
export interface EstatisticasIntegracoes {
  totalIntegracoes: number;
  integracoesAtivas: number;
  integracoesInativas: number;
  integracoesComErro: number;
  
  sincronizacoesHoje: number;
  sincronizacoesSemana: number;
  sincronizacoesMes: number;
  
  registrosProcessadosHoje: number;
  registrosProcessadosSemana: number;
  
  errosHoje: number;
  errosSemana: number;
  
  tempoMedioResposta: number;
  sucessoRate: number;
  
  integracoesPorTipo: IntegracaoPorTipo[];
  sincronizacoesPorDia: SincronizacaoDia[];
}

export interface IntegracaoPorTipo {
  tipo: TipoIntegracao;
  quantidade: number;
  ativas: number;
}

export interface SincronizacaoDia {
  data: string;
  total: number;
  sucesso: number;
  falha: number;
}

// Filtros
export interface FiltrosIntegracoes {
  tipo?: TipoIntegracao[];
  status?: StatusIntegracao[];
  dataInicio?: string;
  dataFim?: string;
  busca?: string;
}

// Template de Exportação
export interface TemplateExportacao {
  id: string;
  nome: string;
  descricao: string;
  modulo: string;
  formato: FormatoArquivo;
  campos: string[];
  filtros?: Record<string, any>;
  periodicidade?: 'DIARIA' | 'SEMANAL' | 'MENSAL' | 'MANUAL';
  ativo: boolean;
}

// Histórico de Importação
export interface HistoricoImportacao {
  id: string;
  dataHora: string;
  usuario: string;
  modulo: string;
  arquivo: string;
  formato: FormatoArquivo;
  totalLinhas: number;
  linhasImportadas: number;
  linhasErro: number;
  status: 'SUCESSO' | 'PARCIAL' | 'FALHA';
  mensagemErro?: string;
  tempoProcessamento: number;
}

