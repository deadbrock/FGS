import { StatusDia, ResumoDia } from '../types/ponto';

// REGRA: Atrasos só contam se >= 15 minutos
const TOLERANCIA_ATRASO_MINUTOS = 15;

// Calcula minutos de diferença entre dois horários
export const calcularDiferencaMinutos = (horario1: string, horario2: string): number => {
  const [h1, m1] = horario1.split(':').map(Number);
  const [h2, m2] = horario2.split(':').map(Number);
  
  const minutos1 = h1 * 60 + m1;
  const minutos2 = h2 * 60 + m2;
  
  return minutos2 - minutos1;
};

// Calcula atraso (retorna 0 se < 15 minutos)
export const calcularAtraso = (horarioPrevisto: string, horarioRealizado: string): number => {
  const diferenca = calcularDiferencaMinutos(horarioPrevisto, horarioRealizado);
  
  // Se chegou antes ou no horário, sem atraso
  if (diferenca <= 0) return 0;
  
  // Se atraso < 15 minutos, não conta
  if (diferenca < TOLERANCIA_ATRASO_MINUTOS) return 0;
  
  return diferenca;
};

// Calcula horas trabalhadas em minutos
export const calcularHorasTrabalhadas = (
  entrada: string,
  saida: string,
  intervaloInicio?: string,
  intervaloFim?: string
): number => {
  const totalMinutos = calcularDiferencaMinutos(entrada, saida);
  
  // Se tem intervalo, subtrai
  if (intervaloInicio && intervaloFim) {
    const intervaloMinutos = calcularDiferencaMinutos(intervaloInicio, intervaloFim);
    return totalMinutos - intervaloMinutos;
  }
  
  return totalMinutos;
};

// Calcula horas extras
export const calcularHorasExtras = (
  horasTrabalhadas: number,
  cargaHorariaDiaria: number
): number => {
  const extras = horasTrabalhadas - cargaHorariaDiaria;
  return extras > 0 ? extras : 0;
};

// Determina status do dia
export const determinarStatusDia = (resumoDia: Partial<ResumoDia>): StatusDia => {
  // Verifica se é final de semana
  const diaSemana = resumoDia.diaSemana?.toLowerCase();
  if (diaSemana === 'sábado' || diaSemana === 'domingo') {
    return StatusDia.FINAL_DE_SEMANA;
  }
  
  // Verifica férias
  // (implementar lógica com dados de férias)
  
  // Sem entrada registrada = falta
  if (!resumoDia.horarioRealizado?.entrada) {
    return resumoDia.temJustificativa ? StatusDia.FALTA_JUSTIFICADA : StatusDia.FALTA;
  }
  
  // Com atraso >= 15 minutos
  if (resumoDia.atrasoMinutos && resumoDia.atrasoMinutos >= TOLERANCIA_ATRASO_MINUTOS) {
    return StatusDia.ATRASADO;
  }
  
  return StatusDia.PRESENTE;
};

// Formata minutos para HH:MM
export const formatarMinutosParaHoras = (minutos: number): string => {
  const horas = Math.floor(Math.abs(minutos) / 60);
  const mins = Math.abs(minutos) % 60;
  const sinal = minutos < 0 ? '-' : '';
  
  return `${sinal}${String(horas).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
};

// Formata horário para exibição
export const formatarHorario = (horario: string | undefined): string => {
  return horario || '--:--';
};

// Retorna cor do status
export const getStatusColor = (status: StatusDia): string => {
  const cores: Record<StatusDia, string> = {
    [StatusDia.PRESENTE]: '#388e3c',
    [StatusDia.ATRASADO]: '#f57c00',
    [StatusDia.FALTA]: '#d32f2f',
    [StatusDia.FALTA_JUSTIFICADA]: '#1976d2',
    [StatusDia.FERIAS]: '#9c27b0',
    [StatusDia.FOLGA]: '#757575',
    [StatusDia.FINAL_DE_SEMANA]: '#9e9e9e',
  };
  
  return cores[status] || '#757575';
};

// Retorna nome do status
export const getStatusNome = (status: StatusDia): string => {
  const nomes: Record<StatusDia, string> = {
    [StatusDia.PRESENTE]: 'Presente',
    [StatusDia.ATRASADO]: 'Atrasado',
    [StatusDia.FALTA]: 'Falta',
    [StatusDia.FALTA_JUSTIFICADA]: 'Falta Justificada',
    [StatusDia.FERIAS]: 'Férias',
    [StatusDia.FOLGA]: 'Folga',
    [StatusDia.FINAL_DE_SEMANA]: 'Final de Semana',
  };
  
  return nomes[status] || status;
};

// Calcula percentual de pontualidade
export const calcularPercentualPontualidade = (
  diasTrabalhados: number,
  diasPontuais: number
): number => {
  if (diasTrabalhados === 0) return 100;
  return Math.round((diasPontuais / diasTrabalhados) * 100);
};

// Calcula pontuação para ranking (0-100)
export const calcularPontuacaoRanking = (
  diasTrabalhados: number,
  atrasos: number,
  faltas: number
): number => {
  if (diasTrabalhados === 0) return 0;
  
  // Começa com 100 pontos
  let pontuacao = 100;
  
  // Desconta 5 pontos por atraso
  pontuacao -= atrasos * 5;
  
  // Desconta 10 pontos por falta
  pontuacao -= faltas * 10;
  
  // Não pode ser negativo
  return Math.max(0, pontuacao);
};

// Valida se horário está no formato HH:MM
export const validarFormatoHorario = (horario: string): boolean => {
  return /^([01]\d|2[0-3]):([0-5]\d)$/.test(horario);
};

// Obtém dia da semana em português
export const obterDiaSemana = (data: string): string => {
  const diasSemana = [
    'Domingo',
    'Segunda-feira',
    'Terça-feira',
    'Quarta-feira',
    'Quinta-feira',
    'Sexta-feira',
    'Sábado',
  ];
  
  const dataObj = new Date(data + 'T00:00:00');
  return diasSemana[dataObj.getDay()];
};

// Gera cor para gráfico
export const gerarCorGrafico = (index: number): string => {
  const cores = [
    '#a2122a', '#354a80', '#388e3c', '#f57c00', '#1976d2',
    '#7b1fa2', '#c2185b', '#00796b', '#f57f17', '#5d4037',
  ];
  
  return cores[index % cores.length];
};

// Exporta para CSV
export const exportarParaCSV = (dados: any[], nomeArquivo: string): void => {
  if (dados.length === 0) return;
  
  const cabecalho = Object.keys(dados[0]).join(',');
  const linhas = dados.map(item =>
    Object.values(item).map(val => `"${val}"`).join(',')
  );
  
  const csv = [cabecalho, ...linhas].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `${nomeArquivo}_${new Date().toISOString().split('T')[0]}.csv`;
  link.click();
};

// Gera espelho de ponto em HTML para impressão
export const gerarEspelhoPontoHTML = (espelho: any): string => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Espelho de Ponto - ${espelho.colaboradorNome}</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        h1 { color: #a2122a; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #354a80; color: white; }
        .totais { margin-top: 20px; font-weight: bold; }
      </style>
    </head>
    <body>
      <h1>Espelho de Ponto</h1>
      <p><strong>Colaborador:</strong> ${espelho.colaboradorNome}</p>
      <p><strong>Mês/Ano:</strong> ${espelho.mesReferencia}</p>
      <!-- Adicionar tabela com os dias aqui -->
    </body>
    </html>
  `;
};

