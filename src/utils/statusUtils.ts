import { StatusProntuario } from '../types/prontuario';

// Retorna a cor do status
export const getStatusColor = (status: StatusProntuario): string => {
  const cores: Record<StatusProntuario, string> = {
    [StatusProntuario.APROVADO]: '#388e3c',
    [StatusProntuario.PENDENTE]: '#f57c00',
    [StatusProntuario.VENCIDO]: '#d32f2f',
    [StatusProntuario.EM_ANALISE]: '#1976d2',
    [StatusProntuario.CANCELADO]: '#757575',
  };
  
  return cores[status] || '#757575';
};

// Retorna o nome amigável do status
export const getStatusNome = (status: StatusProntuario): string => {
  const nomes: Record<StatusProntuario, string> = {
    [StatusProntuario.APROVADO]: 'Aprovado',
    [StatusProntuario.PENDENTE]: 'Pendente',
    [StatusProntuario.VENCIDO]: 'Vencido',
    [StatusProntuario.EM_ANALISE]: 'Em Análise',
    [StatusProntuario.CANCELADO]: 'Cancelado',
  };
  
  return nomes[status] || status;
};

// Verifica se um item está vencido baseado na data de validade
export const verificarVencimento = (dataValidade: string): StatusProntuario => {
  const hoje = new Date();
  const validade = new Date(dataValidade);
  
  if (validade < hoje) {
    return StatusProntuario.VENCIDO;
  }
  
  // Se vence em menos de 30 dias, marca como pendente
  const diasParaVencer = Math.floor((validade.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24));
  if (diasParaVencer <= 30) {
    return StatusProntuario.PENDENTE;
  }
  
  return StatusProntuario.APROVADO;
};

// Formata tamanho de arquivo
export const formatarTamanhoArquivo = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

// Calcula dias entre duas datas
export const calcularDiasEntreDatas = (dataInicio: string, dataFim: string): number => {
  const inicio = new Date(dataInicio);
  const fim = new Date(dataFim);
  const diffTime = Math.abs(fim.getTime() - inicio.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
};

// Formata data para exibição
export const formatarData = (data: string): string => {
  return new Date(data).toLocaleDateString('pt-BR');
};

// Formata data e hora para exibição
export const formatarDataHora = (data: string): string => {
  return new Date(data).toLocaleString('pt-BR');
};

