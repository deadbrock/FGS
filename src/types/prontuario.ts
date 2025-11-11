// Tipos para o módulo de Prontuário do Colaborador

// Status possíveis
export enum StatusProntuario {
  APROVADO = 'APROVADO',
  PENDENTE = 'PENDENTE',
  VENCIDO = 'VENCIDO',
  EM_ANALISE = 'EM_ANALISE',
  CANCELADO = 'CANCELADO',
}

// Dados Pessoais
export interface DadosPessoais {
  id: string;
  nome: string;
  cpf: string;
  rg: string;
  dataNascimento: string;
  sexo: 'M' | 'F' | 'Outro';
  estadoCivil: string;
  nacionalidade: string;
  naturalidade: string;
  nomeMae: string;
  nomePai?: string;
  telefone: string;
  celular: string;
  email: string;
  endereco: Endereco;
}

export interface Endereco {
  cep: string;
  logradouro: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  estado: string;
}

// Dados Contratuais
export interface DadosContratuais {
  id: string;
  colaboradorId: string;
  dataAdmissao: string;
  dataDesligamento?: string;
  cargo: string;
  departamento: string;
  localTrabalho?: string; // Estado (UF) onde o colaborador trabalha
  salario: number;
  tipoContrato: 'CLT' | 'PJ' | 'Estágio' | 'Temporário';
  jornadaTrabalho: string;
  horarioEntrada: string;
  horarioSaida: string;
  status: StatusProntuario;
  contratoAnexo?: Anexo;
}

// Exames Médicos
export interface ExameMedico {
  id: string;
  colaboradorId: string;
  tipo: 'Admissional' | 'Periódico' | 'Demissional' | 'Retorno ao Trabalho' | 'Mudança de Função';
  dataRealizacao: string;
  dataValidade: string;
  resultado: 'Apto' | 'Inapto' | 'Apto com Restrições';
  observacoes?: string;
  status: StatusProntuario;
  anexo?: Anexo;
  medico: string;
  crm: string;
}

// Atestados Médicos
export interface AtestadoMedico {
  id: string;
  colaboradorId: string;
  dataEmissao: string;
  dataInicio: string;
  dataFim: string;
  diasAfastamento: number;
  cid?: string;
  medico: string;
  crm: string;
  observacoes?: string;
  status: StatusProntuario;
  anexo?: Anexo;
}

// Férias
export interface Ferias {
  id: string;
  colaboradorId: string;
  periodoAquisitivo: {
    inicio: string;
    fim: string;
  };
  diasDireito: number;
  diasGozados: number;
  diasRestantes: number;
  dataInicio?: string;
  dataFim?: string;
  tipo: 'Integral' | 'Fracionada' | 'Abono Pecuniário';
  status: StatusProntuario;
  observacoes?: string;
}

// Frequência/Ponto
export interface RegistroFrequencia {
  id: string;
  colaboradorId: string;
  data: string;
  horaEntrada: string;
  horaSaida: string;
  horasExtras?: number;
  atrasos?: number;
  faltas?: number;
  justificativa?: string;
  status: 'Presente' | 'Falta' | 'Atestado' | 'Férias' | 'Folga';
}

// Advertências
export interface Advertencia {
  id: string;
  colaboradorId: string;
  tipo: 'Verbal' | 'Escrita' | 'Suspensão';
  data: string;
  motivo: string;
  descricao: string;
  aplicadoPor: string;
  cargoResponsavel?: string;
  medidasCorretivas?: string;
  observacoes?: string;
  status: StatusProntuario;
  anexo?: Anexo;
}

// Treinamentos
export interface Treinamento {
  id: string;
  colaboradorId: string;
  titulo: string;
  descricao: string;
  dataInicio: string;
  dataFim: string;
  cargaHoraria: number;
  instrutor: string;
  instituicao: string;
  status: StatusProntuario;
  certificado?: Anexo;
  nota?: number;
}

// Anexos
export interface Anexo {
  id: string;
  nome: string;
  tipo: string;
  tamanho: number;
  url: string;
  dataUpload: string;
}

// Categorias de Documentos
export enum CategoriaDocumento {
  RG = 'RG',
  CPF = 'CPF',
  CNH = 'CNH',
  TITULO_ELEITOR = 'Título de Eleitor',
  CARTEIRA_TRABALHO = 'Carteira de Trabalho',
  COMPROVANTE_RESIDENCIA = 'Comprovante de Residência',
  CERTIDAO_NASCIMENTO = 'Certidão de Nascimento',
  CERTIDAO_CASAMENTO = 'Certidão de Casamento',
  CONTRATO_TRABALHO = 'Contrato de Trabalho',
  ATESTADO_MEDICO = 'Atestado Médico',
  EXAME_ADMISSIONAL = 'Exame Admissional',
  EXAME_PERIODICO = 'Exame Periódico',
  CERTIFICADO_TREINAMENTO = 'Certificado de Treinamento',
  DIPLOMA = 'Diploma',
  HISTORICO_ESCOLAR = 'Histórico Escolar',
  FOTO_3X4 = 'Foto 3x4',
  OUTROS = 'Outros',
}

// Documento Anexado
export interface DocumentoAnexado {
  id: string;
  colaboradorId: string;
  categoria: CategoriaDocumento;
  nome: string;
  descricao?: string;
  arquivo: Anexo;
  dataUpload: string;
  uploadPor: string;
  observacoes?: string;
}

// Prontuário Completo
export interface ProntuarioColaborador {
  id: string;
  colaboradorId: string;
  dadosPessoais: DadosPessoais;
  dadosContratuais: DadosContratuais;
  examesMedicos: ExameMedico[];
  atestados: AtestadoMedico[];
  ferias: Ferias[];
  frequencia: RegistroFrequencia[];
  advertencias: Advertencia[];
  treinamentos: Treinamento[];
  documentos?: DocumentoAnexado[];
  ultimaAtualizacao: string;
}

// Filtros para tabelas
export interface FiltrosProntuario {
  status?: StatusProntuario[];
  dataInicio?: string;
  dataFim?: string;
  tipo?: string;
  busca?: string;
}

// Paginação
export interface PaginacaoParams {
  pagina: number;
  itensPorPagina: number;
  ordenarPor?: string;
  ordem?: 'asc' | 'desc';
}

export interface PaginacaoResultado<T> {
  dados: T[];
  total: number;
  pagina: number;
  totalPaginas: number;
}

