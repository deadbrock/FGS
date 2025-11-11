// Tipos para o módulo de Regionais

// Estados brasileiros
export enum EstadoBrasil {
  AC = 'AC', // Acre
  AL = 'AL', // Alagoas
  AP = 'AP', // Amapá
  AM = 'AM', // Amazonas
  BA = 'BA', // Bahia
  CE = 'CE', // Ceará
  DF = 'DF', // Distrito Federal
  ES = 'ES', // Espírito Santo
  GO = 'GO', // Goiás
  MA = 'MA', // Maranhão
  MT = 'MT', // Mato Grosso
  MS = 'MS', // Mato Grosso do Sul
  MG = 'MG', // Minas Gerais
  PA = 'PA', // Pará
  PB = 'PB', // Paraíba
  PR = 'PR', // Paraná
  PE = 'PE', // Pernambuco
  PI = 'PI', // Piauí
  RJ = 'RJ', // Rio de Janeiro
  RN = 'RN', // Rio Grande do Norte
  RS = 'RS', // Rio Grande do Sul
  RO = 'RO', // Rondônia
  RR = 'RR', // Roraima
  SC = 'SC', // Santa Catarina
  SP = 'SP', // São Paulo
  SE = 'SE', // Sergipe
  TO = 'TO', // Tocantins
}

// Regiões do Brasil
export enum RegiaoBrasil {
  NORTE = 'Norte',
  NORDESTE = 'Nordeste',
  CENTRO_OESTE = 'Centro-Oeste',
  SUDESTE = 'Sudeste',
  SUL = 'Sul',
}

// Colaborador regional
export interface ColaboradorRegional {
  id: string;
  nome: string;
  email: string;
  cargo: string;
  departamento: string;
  estado: EstadoBrasil;
  cidade: string;
  dataAdmissao: string;
  status: 'ATIVO' | 'INATIVO' | 'FERIAS' | 'AFASTADO';
  genero: 'MASCULINO' | 'FEMININO';
  avatar?: string;
  telefone?: string;
  gestor?: string;
  unidade?: string;
  cpf?: string;
  dataNascimento?: string;
  salario?: number;
}

// Estatísticas por estado
export interface EstatisticasEstado {
  estado: EstadoBrasil;
  nomeEstado: string;
  regiao: RegiaoBrasil;
  totalColaboradores: number;
  colaboradoresAtivos: number;
  colaboradoresInativos: number;
  colaboradoresFerias: number;
  colaboradoresAfastados: number;
  unidades: number;
  departamentos: string[];
  cargos: Record<string, number>;
  crescimentoMensal: number; // Porcentagem
  taxaRotatividade: number; // Porcentagem
}

// Unidade/Filial regional
export interface UnidadeRegional {
  id: string;
  nome: string;
  estado: EstadoBrasil;
  cidade: string;
  endereco: string;
  cep?: string;
  telefone?: string;
  email?: string;
  responsavel?: string;
  totalColaboradores: number;
  status: 'ATIVA' | 'INATIVA' | 'EM_IMPLANTACAO';
  dataAbertura?: string;
  coordenadas?: {
    lat: number;
    lng: number;
  };
}

// Estatísticas gerais do módulo
export interface EstatisticasRegionais {
  totalColaboradores: number;
  colaboradoresMasculinos: number;
  colaboradoresFemininos: number;
  estadosAtivos: number;
  unidadesAtivas: number;
  regiaoMaiorConcentracao: RegiaoBrasil;
  estadoMaiorConcentracao: EstadoBrasil;
  crescimentoAnual: number;
  distribuicaoPorRegiao: Record<RegiaoBrasil, number>;
  distribuicaoPorEstado: Record<EstadoBrasil, number>;
  distribuicaoPorGenero: {
    masculino: number;
    feminino: number;
  };
}

// Filtros para busca de colaboradores
export interface FiltrosRegionais {
  estado?: EstadoBrasil[];
  regiao?: RegiaoBrasil[];
  cidade?: string;
  departamento?: string;
  cargo?: string;
  status?: string[];
  unidade?: string;
  busca?: string;
}

// Dados de expansão regional
export interface ExpansaoRegional {
  id: string;
  estado: EstadoBrasil;
  cidade: string;
  tipo: 'NOVA_UNIDADE' | 'EXPANSAO_UNIDADE' | 'PLANEJAMENTO';
  status: 'EM_ANALISE' | 'APROVADO' | 'EM_ANDAMENTO' | 'CONCLUIDO' | 'CANCELADO';
  dataPrevisao?: string;
  investimentoPrevisto?: number;
  colaboradoresPrevistos?: number;
  responsavel?: string;
  observacoes?: string;
}

// Ranking de estados
export interface RankingEstado {
  posicao: number;
  estado: EstadoBrasil;
  nomeEstado: string;
  totalColaboradores: number;
  crescimento: number;
  unidades: number;
}

// Mapa de calor - densidade por estado
export interface MapaCalorEstado {
  estado: EstadoBrasil;
  intensidade: number; // 0 a 1
  totalColaboradores: number;
  cor: string;
}

// Transferência entre estados
export interface TransferenciaInterestadual {
  id: string;
  colaboradorId: string;
  colaboradorNome: string;
  estadoOrigem: EstadoBrasil;
  estadoDestino: EstadoBrasil;
  cidadeOrigem: string;
  cidadeDestino: string;
  dataTransferencia: string;
  motivo: string;
  status: 'SOLICITADA' | 'APROVADA' | 'EM_PROCESSO' | 'CONCLUIDA' | 'CANCELADA';
  responsavel?: string;
  observacoes?: string;
}

// Relatório regional
export interface RelatorioRegional {
  periodo: {
    inicio: string;
    fim: string;
  };
  regiao?: RegiaoBrasil;
  estado?: EstadoBrasil;
  totalColaboradores: number;
  admissoes: number;
  desligamentos: number;
  transferencias: number;
  crescimento: number;
  custoTotal?: number;
  produtividade?: number;
}

