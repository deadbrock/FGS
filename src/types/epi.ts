// =============================================
// TIPOS DO SISTEMA DE GESTÃO DE EPIs
// =============================================

export type StatusEPI = 'DISPONIVEL' | 'EM_USO' | 'VENCIDO' | 'DANIFICADO' | 'EXTRAVIADO';

export type TipoFicha = 'EPI' | 'LPT' | 'JARDINEIRO' | 'CERTIFICADO';

export type StatusEntrega = 'ENTREGUE' | 'DEVOLVIDO' | 'EXTRAVIADO' | 'DANIFICADO';

// =============================================
// EPI (Equipamento de Proteção Individual)
// =============================================
export interface EPI {
  id: string;
  codigo: string; // Código interno do EPI
  nome: string;
  descricao?: string;
  categoria: string; // Ex: Proteção da cabeça, mãos, pés, etc.
  ca: string; // Certificado de Aprovação (obrigatório)
  fabricante: string;
  validade_ca: string; // Data de validade do CA
  durabilidade_meses: number; // Tempo de vida útil em meses
  quantidade_estoque: number;
  estoque_minimo: number;
  preco_unitario?: number;
  fornecedor?: string;
  observacoes?: string;
  ativo: boolean;
  created_at: string;
  updated_at: string;
}

// =============================================
// Entrega de EPI ao Colaborador
// =============================================
export interface EntregaEPI {
  id: string;
  epi_id: string;
  epi_nome?: string;
  epi_codigo?: string;
  epi_ca?: string;
  colaborador_id: string;
  colaborador_nome?: string;
  colaborador_cpf?: string;
  quantidade: number;
  data_entrega: string;
  data_validade: string; // Calculado: data_entrega + durabilidade_meses
  data_devolucao?: string;
  status: StatusEntrega;
  motivo_devolucao?: string;
  observacoes?: string;
  entregue_por: string; // ID do usuário que fez a entrega
  entregue_por_nome?: string;
  recebido_por?: string; // ID do usuário que recebeu a devolução
  recebido_por_nome?: string;
  assinatura_colaborador?: string; // URL da assinatura digital
  foto_entrega?: string; // URL da foto do EPI entregue
  created_at: string;
  updated_at: string;
}

// =============================================
// Ficha de Controle
// =============================================
export interface Ficha {
  id: string;
  tipo: TipoFicha;
  colaborador_id: string;
  colaborador_nome?: string;
  colaborador_cpf?: string;
  numero_ficha: string;
  data_emissao: string;
  data_validade?: string;
  arquivo_url?: string; // PDF da ficha
  observacoes?: string;
  ativo: boolean;
  created_at: string;
  updated_at: string;
}

// =============================================
// Movimentação de Estoque
// =============================================
export interface MovimentacaoEstoque {
  id: string;
  epi_id: string;
  epi_nome?: string;
  tipo_movimentacao: 'ENTRADA' | 'SAIDA' | 'AJUSTE' | 'DEVOLUCAO';
  quantidade: number;
  quantidade_anterior: number;
  quantidade_nova: number;
  motivo: string;
  numero_nota?: string; // Nota fiscal para entradas
  responsavel_id: string;
  responsavel_nome?: string;
  data_movimentacao: string;
  observacoes?: string;
  created_at: string;
}

// =============================================
// DTOs (Data Transfer Objects)
// =============================================

export interface CreateEPIDTO {
  codigo: string;
  nome: string;
  descricao?: string;
  categoria: string;
  ca: string;
  fabricante: string;
  validade_ca: string;
  durabilidade_meses: number;
  quantidade_estoque: number;
  estoque_minimo: number;
  preco_unitario?: number;
  fornecedor?: string;
  observacoes?: string;
}

export interface UpdateEPIDTO {
  codigo?: string;
  nome?: string;
  descricao?: string;
  categoria?: string;
  ca?: string;
  fabricante?: string;
  validade_ca?: string;
  durabilidade_meses?: number;
  quantidade_estoque?: number;
  estoque_minimo?: number;
  preco_unitario?: number;
  fornecedor?: string;
  observacoes?: string;
  ativo?: boolean;
}

export interface CreateEntregaEPIDTO {
  epi_id: string;
  colaborador_id: string;
  quantidade: number;
  data_entrega: string;
  observacoes?: string;
  assinatura_colaborador?: string;
  foto_entrega?: string;
}

export interface DevolverEPIDTO {
  data_devolucao: string;
  status: 'DEVOLVIDO' | 'EXTRAVIADO' | 'DANIFICADO';
  motivo_devolucao?: string;
  observacoes?: string;
}

export interface CreateFichaDTO {
  tipo: TipoFicha;
  colaborador_id: string;
  numero_ficha: string;
  data_emissao: string;
  data_validade?: string;
  arquivo_url?: string;
  observacoes?: string;
}

export interface UpdateFichaDTO {
  numero_ficha?: string;
  data_emissao?: string;
  data_validade?: string;
  arquivo_url?: string;
  observacoes?: string;
  ativo?: boolean;
}

export interface CreateMovimentacaoDTO {
  epi_id: string;
  tipo_movimentacao: 'ENTRADA' | 'SAIDA' | 'AJUSTE' | 'DEVOLUCAO';
  quantidade: number;
  motivo: string;
  numero_nota?: string;
  observacoes?: string;
}

// =============================================
// Filtros
// =============================================

export interface FiltrosEPI {
  codigo?: string;
  nome?: string;
  categoria?: string;
  ca?: string;
  status?: StatusEPI;
  estoque_baixo?: boolean; // Filtra EPIs com estoque abaixo do mínimo
  vencidos?: boolean; // Filtra EPIs com CA vencido
  limit?: number;
  offset?: number;
}

export interface FiltrosEntregaEPI {
  epi_id?: string;
  colaborador_id?: string;
  colaborador_cpf?: string;
  status?: StatusEntrega;
  data_inicio?: string;
  data_fim?: string;
  vencidos?: boolean; // Filtra entregas com validade vencida
  a_vencer?: number; // Filtra entregas que vencem em X dias
  limit?: number;
  offset?: number;
}

export interface FiltrosFicha {
  tipo?: TipoFicha;
  colaborador_id?: string;
  colaborador_cpf?: string;
  ativo?: boolean;
  vencidas?: boolean;
  limit?: number;
  offset?: number;
}

// =============================================
// Estatísticas
// =============================================

export interface EstatisticasEPI {
  total_epis: number;
  total_estoque: number;
  epis_em_uso: number;
  epis_disponiveis: number;
  epis_vencidos: number;
  epis_estoque_baixo: number;
  entregas_mes: number;
  devolucoes_mes: number;
  valor_total_estoque: number;
  por_categoria: Array<{
    categoria: string;
    quantidade: number;
    em_uso: number;
  }>;
  alertas: Array<{
    tipo: 'ESTOQUE_BAIXO' | 'CA_VENCIDO' | 'EPI_VENCIDO' | 'DEVOLUCAO_PENDENTE';
    epi_id?: string;
    epi_nome?: string;
    colaborador_nome?: string;
    mensagem: string;
    data: string;
  }>;
}

export interface HistoricoColaborador {
  colaborador_id: string;
  colaborador_nome: string;
  colaborador_cpf: string;
  total_entregas: number;
  epis_em_uso: number;
  epis_devolvidos: number;
  epis_extraviados: number;
  entregas: EntregaEPI[];
}

