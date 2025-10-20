import {
  TipoComunicado,
  PrioridadeComunicado,
  StatusComunicado,
  CanalNotificacao,
  CategoriaComunicado,
} from '../types/comunicacao';

// Retorna nome do tipo
export const getTipoNome = (tipo: TipoComunicado): string => {
  const nomes: Record<TipoComunicado, string> = {
    [TipoComunicado.GERAL]: 'Geral (Todos)',
    [TipoComunicado.SETOR]: 'Por Setor',
    [TipoComunicado.UNIDADE]: 'Por Unidade',
    [TipoComunicado.FUNCAO]: 'Por Função',
    [TipoComunicado.INDIVIDUAL]: 'Individual',
  };
  return nomes[tipo] || tipo;
};

// Retorna nome da prioridade
export const getPrioridadeNome = (prioridade: PrioridadeComunicado): string => {
  const nomes: Record<PrioridadeComunicado, string> = {
    [PrioridadeComunicado.BAIXA]: 'Baixa',
    [PrioridadeComunicado.NORMAL]: 'Normal',
    [PrioridadeComunicado.ALTA]: 'Alta',
    [PrioridadeComunicado.URGENTE]: 'Urgente',
  };
  return nomes[prioridade] || prioridade;
};

// Retorna cor da prioridade
export const getPrioridadeCor = (prioridade: PrioridadeComunicado): string => {
  const cores: Record<PrioridadeComunicado, string> = {
    [PrioridadeComunicado.BAIXA]: '#757575',
    [PrioridadeComunicado.NORMAL]: '#1976d2',
    [PrioridadeComunicado.ALTA]: '#f57c00',
    [PrioridadeComunicado.URGENTE]: '#d32f2f',
  };
  return cores[prioridade] || '#757575';
};

// Retorna nome do status
export const getStatusNome = (status: StatusComunicado): string => {
  const nomes: Record<StatusComunicado, string> = {
    [StatusComunicado.RASCUNHO]: 'Rascunho',
    [StatusComunicado.AGENDADO]: 'Agendado',
    [StatusComunicado.ENVIADO]: 'Enviado',
    [StatusComunicado.CANCELADO]: 'Cancelado',
  };
  return nomes[status] || status;
};

// Retorna cor do status
export const getStatusCor = (status: StatusComunicado): string => {
  const cores: Record<StatusComunicado, string> = {
    [StatusComunicado.RASCUNHO]: '#757575',
    [StatusComunicado.AGENDADO]: '#1976d2',
    [StatusComunicado.ENVIADO]: '#388e3c',
    [StatusComunicado.CANCELADO]: '#d32f2f',
  };
  return cores[status] || '#757575';
};

// Retorna nome do canal
export const getCanalNome = (canal: CanalNotificacao): string => {
  const nomes: Record<CanalNotificacao, string> = {
    [CanalNotificacao.APP]: 'App',
    [CanalNotificacao.EMAIL]: 'E-mail',
    [CanalNotificacao.WHATSAPP]: 'WhatsApp',
    [CanalNotificacao.SMS]: 'SMS',
  };
  return nomes[canal] || canal;
};

// Retorna ícone do canal
export const getCanalIcone = (canal: CanalNotificacao): string => {
  const icones: Record<CanalNotificacao, string> = {
    [CanalNotificacao.APP]: '📱',
    [CanalNotificacao.EMAIL]: '📧',
    [CanalNotificacao.WHATSAPP]: '💬',
    [CanalNotificacao.SMS]: '📨',
  };
  return icones[canal] || '📋';
};

// Retorna nome da categoria
export const getCategoriaNome = (categoria: CategoriaComunicado): string => {
  const nomes: Record<CategoriaComunicado, string> = {
    [CategoriaComunicado.INFORMATIVO]: 'Informativo',
    [CategoriaComunicado.URGENTE]: 'Urgente',
    [CategoriaComunicado.EVENTO]: 'Evento',
    [CategoriaComunicado.AVISO]: 'Aviso',
    [CategoriaComunicado.BENEFICIOS]: 'Benefícios',
    [CategoriaComunicado.TREINAMENTO]: 'Treinamento',
    [CategoriaComunicado.RH]: 'RH',
    [CategoriaComunicado.SEGURANCA]: 'Segurança',
    [CategoriaComunicado.OUTROS]: 'Outros',
  };
  return nomes[categoria] || categoria;
};

// Retorna ícone da categoria
export const getCategoriaIcone = (categoria: CategoriaComunicado): string => {
  const icones: Record<CategoriaComunicado, string> = {
    [CategoriaComunicado.INFORMATIVO]: 'ℹ️',
    [CategoriaComunicado.URGENTE]: '🚨',
    [CategoriaComunicado.EVENTO]: '📅',
    [CategoriaComunicado.AVISO]: '⚠️',
    [CategoriaComunicado.BENEFICIOS]: '🎁',
    [CategoriaComunicado.TREINAMENTO]: '📚',
    [CategoriaComunicado.RH]: '👥',
    [CategoriaComunicado.SEGURANCA]: '🛡️',
    [CategoriaComunicado.OUTROS]: '📋',
  };
  return icones[categoria] || '📋';
};

// Calcula taxa de leitura
export const calcularTaxaLeitura = (totalLidos: number, totalDestinatarios: number): number => {
  if (totalDestinatarios === 0) return 0;
  return Math.round((totalLidos / totalDestinatarios) * 100);
};

// Calcula taxa de confirmação
export const calcularTaxaConfirmacao = (totalConfirmados: number, totalDestinatarios: number): number => {
  if (totalDestinatarios === 0) return 0;
  return Math.round((totalConfirmados / totalDestinatarios) * 100);
};

// Formata tamanho de arquivo
export const formatarTamanhoArquivo = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

// Valida se comunicado pode ser enviado
export const validarEnvio = (
  titulo: string,
  conteudo: string,
  canais: CanalNotificacao[]
): { valido: boolean; erros: string[] } => {
  const erros: string[] = [];
  
  if (!titulo || titulo.trim().length < 3) {
    erros.push('Título deve ter no mínimo 3 caracteres');
  }
  
  if (!conteudo || conteudo.trim().length < 10) {
    erros.push('Conteúdo deve ter no mínimo 10 caracteres');
  }
  
  if (canais.length === 0) {
    erros.push('Selecione pelo menos um canal de envio');
  }
  
  return {
    valido: erros.length === 0,
    erros,
  };
};

// Gera preview do conteúdo
export const gerarPreview = (conteudo: string, maxLength: number = 100): string => {
  if (conteudo.length <= maxLength) return conteudo;
  return `${conteudo.substring(0, maxLength)}...`;
};

// Conta palavras
export const contarPalavras = (texto: string): number => {
  return texto.trim().split(/\s+/).length;
};

// Estima tempo de leitura (200 palavras por minuto)
export const estimarTempoLeitura = (texto: string): string => {
  const palavras = contarPalavras(texto);
  const minutos = Math.ceil(palavras / 200);
  
  if (minutos === 1) return '1 min';
  return `${minutos} min`;
};

// Exporta para CSV
export const exportarHistoricoCSV = (dados: unknown[], nomeArquivo: string): void => {
  if (dados.length === 0) return;
  
  const cabecalho = Object.keys(dados[0] as object).join(',');
  const linhas = dados.map(item =>
    Object.values(item as object).map(val => `"${val}"`).join(',')
  );
  
  const csv = [cabecalho, ...linhas].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `${nomeArquivo}_${new Date().toISOString().split('T')[0]}.csv`;
  link.click();
};

// Gera cores para gráficos
export const gerarCoresGrafico = (quantidade: number): string[] => {
  const coresPadrao = [
    '#a2122a', '#354a80', '#388e3c', '#f57c00', '#1976d2',
    '#7b1fa2', '#c2185b', '#00796b', '#f57f17', '#5d4037',
  ];
  
  const cores: string[] = [];
  for (let i = 0; i < quantidade; i++) {
    cores.push(coresPadrao[i % coresPadrao.length]);
  }
  
  return cores;
};

// Formata lista de destinatários para exibição
export const formatarDestinatarios = (tipo: TipoComunicado, total: number): string => {
  switch (tipo) {
    case TipoComunicado.GERAL:
      return `Todos (${total} colaboradores)`;
    case TipoComunicado.SETOR:
      return `${total} colaboradores por setor`;
    case TipoComunicado.UNIDADE:
      return `${total} colaboradores por unidade`;
    case TipoComunicado.FUNCAO:
      return `${total} colaboradores por função`;
    case TipoComunicado.INDIVIDUAL:
      return `${total} colaboradores específicos`;
    default:
      return `${total} colaboradores`;
  }
};

