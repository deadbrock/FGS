// Tipos para o módulo de Ponto e Frequência

export enum TipoRegistro {
  ENTRADA = 'ENTRADA',
  SAIDA = 'SAIDA',
  INTERVALO_INICIO = 'INTERVALO_INICIO',
  INTERVALO_FIM = 'INTERVALO_FIM',
}

export enum StatusDia {
  PRESENTE = 'PRESENTE',
  FALTA = 'FALTA',
  ATRASADO = 'ATRASADO',
  FALTA_JUSTIFICADA = 'FALTA_JUSTIFICADA',
  FERIAS = 'FERIAS',
  FOLGA = 'FOLGA',
  FINAL_DE_SEMANA = 'FINAL_DE_SEMANA',
}

export enum MetodoRegistro {
  FACIAL = 'FACIAL',
  DIGITAL = 'DIGITAL',
  CARTAO = 'CARTAO',
  MANUAL = 'MANUAL',
  APP = 'APP',
}

// Registro de Ponto Individual
export interface RegistroPonto {
  id: string;
  colaboradorId: string;
  colaboradorNome: string;
  data: string;
  hora: string;
  tipo: TipoRegistro;
  metodo: MetodoRegistro;
  localizacao?: {
    latitude: number;
    longitude: number;
  };
  fotoUrl?: string; // Para reconhecimento facial
  observacao?: string;
  aprovadoPor?: string;
  criadoEm: string;
}

// Resumo do Dia de Trabalho
export interface ResumoDia {
  id: string;
  colaboradorId: string;
  colaboradorNome: string;
  departamento: string;
  cargo: string;
  data: string;
  diaSemana: string;
  
  // Horários Previstos
  horarioPrevisto: {
    entrada: string;
    saida: string;
    intervaloInicio?: string;
    intervaloFim?: string;
  };
  
  // Horários Realizados
  horarioRealizado: {
    entrada?: string;
    saida?: string;
    intervaloInicio?: string;
    intervaloFim?: string;
  };
  
  // Cálculos
  horasTrabalhadas: number; // Em minutos
  horasExtras: number; // Em minutos
  atrasoMinutos: number; // 0 se < 15 minutos
  saidaAntecipada: number; // Em minutos
  
  // Status
  status: StatusDia;
  temJustificativa: boolean;
  justificativa?: {
    tipo: 'ATESTADO' | 'DECLARACAO' | 'OUTROS';
    descricao: string;
    anexoUrl?: string;
  };
  
  registros: RegistroPonto[];
}

// Configuração de Horário
export interface ConfiguracaoHorario {
  id: string;
  colaboradorId?: string; // Se null, é padrão da empresa
  departamento?: string;
  cargo?: string;
  nome: string;
  descricao: string;
  
  // Horários
  horaEntrada: string;
  horaSaida: string;
  intervaloInicio?: string;
  intervaloFim?: string;
  
  // Configurações
  cargaHorariaDiaria: number; // Em minutos
  toleranciaAtraso: number; // Em minutos (padrão: 15)
  considerarFinalSemana: boolean;
  
  // Dias da Semana
  diasAtivos: {
    segunda: boolean;
    terca: boolean;
    quarta: boolean;
    quinta: boolean;
    sexta: boolean;
    sabado: boolean;
    domingo: boolean;
  };
  
  ativo: boolean;
  criadoEm: string;
}

// Relatório de Atrasos
export interface RelatorioAtrasos {
  periodo: {
    inicio: string;
    fim: string;
  };
  colaboradores: AtrasoColaborador[];
  totalAtrasos: number;
  mediaAtrasoMinutos: number;
}

export interface AtrasoColaborador {
  colaboradorId: string;
  colaboradorNome: string;
  departamento: string;
  cargo: string;
  totalAtrasos: number;
  minutosAcumulados: number;
  diasComAtraso: string[]; // Datas
  percentualPontualidade: number;
}

// Relatório de Faltas
export interface RelatorioFaltas {
  periodo: {
    inicio: string;
    fim: string;
  };
  colaboradores: FaltaColaborador[];
  totalFaltas: number;
  totalJustificadas: number;
  totalInjustificadas: number;
}

export interface FaltaColaborador {
  colaboradorId: string;
  colaboradorNome: string;
  departamento: string;
  cargo: string;
  faltasJustificadas: number;
  faltasInjustificadas: number;
  totalFaltas: number;
  datasComFalta: string[];
  percentualPresenca: number;
}

// Ranking de Pontualidade
export interface RankingPontualidade {
  periodo: {
    inicio: string;
    fim: string;
  };
  ranking: ColaboradorRanking[];
}

export interface ColaboradorRanking {
  posicao: number;
  colaboradorId: string;
  colaboradorNome: string;
  departamento: string;
  cargo: string;
  pontuacao: number; // 0-100
  diasTrabalhados: number;
  diasPontuais: number;
  atrasos: number;
  faltas: number;
  percentualPontualidade: number;
}

// Estatísticas do Dashboard
export interface EstatisticasPonto {
  hoje: {
    presentes: number;
    ausentes: number;
    atrasados: number;
    totalColaboradores: number;
    percentualPresenca: number;
  };
  mes: {
    totalRegistros: number;
    mediaHorasTrabalhadas: number;
    totalHorasExtras: number;
    totalAtrasos: number;
    totalFaltas: number;
  };
  graficoPresenca: DadosGraficoPresenca[];
  graficoAtrasos: DadosGraficoAtrasos[];
}

export interface DadosGraficoPresenca {
  data: string;
  presentes: number;
  ausentes: number;
  atrasados: number;
}

export interface DadosGraficoAtrasos {
  departamento: string;
  quantidade: number;
  minutosAcumulados: number;
}

// Integração com Sistema Facial
export interface ConfiguracaoFacial {
  id: string;
  ativo: boolean;
  urlWebhook: string;
  tokenApi: string;
  toleranciaReconhecimento: number; // 0-100
  exigirMascara: boolean;
  salvarFotos: boolean;
  tempoMinimoBatidas: number; // Minutos entre batidas
}

// Filtros
export interface FiltrosPonto {
  colaboradorId?: string;
  departamento?: string;
  dataInicio?: string;
  dataFim?: string;
  status?: StatusDia[];
  comAtraso?: boolean;
  comFalta?: boolean;
}

// Justificativa de Falta/Atraso
export interface SolicitacaoJustificativa {
  id: string;
  colaboradorId: string;
  colaboradorNome: string;
  data: string;
  tipo: 'FALTA' | 'ATRASO' | 'SAIDA_ANTECIPADA';
  motivo: string;
  descricao: string;
  anexos: string[];
  status: 'PENDENTE' | 'APROVADA' | 'RECUSADA';
  avaliadoPor?: string;
  dataAvaliacao?: string;
  observacaoAvaliacao?: string;
  criadaEm: string;
}

// Espelho de Ponto (Exportação)
export interface EspelhoPonto {
  colaboradorId: string;
  colaboradorNome: string;
  mesReferencia: string;
  departamento: string;
  cargo: string;
  dias: ResumoDia[];
  totais: {
    diasTrabalhados: number;
    horasTrabalhadas: number;
    horasExtras: number;
    atrasos: number;
    faltas: number;
  };
  geradoEm: string;
  assinaturaColaborador?: string;
  assinaturaGestor?: string;
}

