// Tipos para Histórico de Reajustes de Salário

export interface HistoricoReajuste {
  id: string;
  colaborador_id: string;
  salario_anterior: number;
  salario_novo: number;
  percentual_reajuste: number;
  data_reajuste: string;
  data_efetivacao: string;
  motivo?: string;
  observacoes?: string;
  aprovado_por?: string;
  aprovado_por_nome?: string;
  data_aprovacao?: string;
  created_at: string;
  updated_at: string;
  created_by?: string;
}

export interface CreateReajusteDTO {
  salario_anterior: number;
  salario_novo: number;
  data_reajuste: string;
  data_efetivacao: string;
  motivo?: string;
  observacoes?: string;
}

export interface UpdateReajusteDTO {
  salario_anterior?: number;
  salario_novo?: number;
  data_reajuste?: string;
  data_efetivacao?: string;
  motivo?: string;
  observacoes?: string;
}

