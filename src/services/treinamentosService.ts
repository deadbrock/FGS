import api from './api';
import {
  TipoTreinamento,
  TreinamentoColaborador,
  AgendamentoTreinamento,
  RelatorioTreinamentos,
  AlertaTreinamento,
  FiltrosTreinamentos,
  LinhaCSV,
} from '../types/treinamentos';
import { PaginacaoParams, PaginacaoResultado } from '../types/prontuario';

class TreinamentosService {
  // ========== TIPOS DE TREINAMENTO ==========
  
  async listarTipos(): Promise<TipoTreinamento[]> {
    const response = await api.get<TipoTreinamento[]>('/treinamentos/tipos');
    return response.data;
  }

  async buscarTipo(id: string): Promise<TipoTreinamento> {
    const response = await api.get<TipoTreinamento>(`/treinamentos/tipos/${id}`);
    return response.data;
  }

  async criarTipo(dados: Partial<TipoTreinamento>): Promise<TipoTreinamento> {
    const response = await api.post<TipoTreinamento>('/treinamentos/tipos', dados);
    return response.data;
  }

  async atualizarTipo(id: string, dados: Partial<TipoTreinamento>): Promise<void> {
    await api.put(`/treinamentos/tipos/${id}`, dados);
  }

  async excluirTipo(id: string): Promise<void> {
    await api.delete(`/treinamentos/tipos/${id}`);
  }

  // ========== TREINAMENTOS DE COLABORADORES ==========

  async listarTreinamentos(
    params: PaginacaoParams,
    filtros?: FiltrosTreinamentos
  ): Promise<PaginacaoResultado<TreinamentoColaborador>> {
    const response = await api.get<PaginacaoResultado<TreinamentoColaborador>>(
      '/treinamentos',
      { params: { ...params, ...filtros } }
    );
    return response.data;
  }

  async criarTreinamento(dados: Partial<TreinamentoColaborador>): Promise<TreinamentoColaborador> {
    const response = await api.post<TreinamentoColaborador>('/treinamentos', dados);
    return response.data;
  }

  async atualizarTreinamento(id: string, dados: Partial<TreinamentoColaborador>): Promise<void> {
    await api.put(`/treinamentos/${id}`, dados);
  }

  async excluirTreinamento(id: string): Promise<void> {
    await api.delete(`/treinamentos/${id}`);
  }

  // ========== IMPORTAÇÃO CSV ==========

  async importarCSV(dados: LinhaCSV[]): Promise<{ sucesso: number; erros: number }> {
    const response = await api.post<{ sucesso: number; erros: number }>(
      '/treinamentos/importar-csv',
      { dados }
    );
    return response.data;
  }

  // ========== AGENDAMENTOS ==========

  async listarAgendamentos(): Promise<AgendamentoTreinamento[]> {
    const response = await api.get<AgendamentoTreinamento[]>('/treinamentos/agendamentos');
    return response.data;
  }

  async criarAgendamento(dados: Partial<AgendamentoTreinamento>): Promise<AgendamentoTreinamento> {
    const response = await api.post<AgendamentoTreinamento>(
      '/treinamentos/agendamentos',
      dados
    );
    return response.data;
  }

  async confirmarPresenca(agendamentoId: string, colaboradorId: string, presente: boolean): Promise<void> {
    await api.put(`/treinamentos/agendamentos/${agendamentoId}/presenca`, {
      colaboradorId,
      presente,
    });
  }

  // ========== ALERTAS ==========

  async listarAlertas(): Promise<AlertaTreinamento[]> {
    const response = await api.get<AlertaTreinamento[]>('/treinamentos/alertas');
    return response.data;
  }

  async marcarAlertaLido(alertaId: string): Promise<void> {
    await api.put(`/treinamentos/alertas/${alertaId}/lido`);
  }

  // ========== RELATÓRIOS ==========

  async gerarRelatorio(dataInicio: string, dataFim: string): Promise<RelatorioTreinamentos> {
    const response = await api.get<RelatorioTreinamentos>('/treinamentos/relatorios', {
      params: { dataInicio, dataFim },
    });
    return response.data;
  }

  async listarVencidos(): Promise<TreinamentoColaborador[]> {
    const response = await api.get<TreinamentoColaborador[]>('/treinamentos/vencidos');
    return response.data;
  }

  async listarAVencer(dias: number = 30): Promise<TreinamentoColaborador[]> {
    const response = await api.get<TreinamentoColaborador[]>('/treinamentos/a-vencer', {
      params: { dias },
    });
    return response.data;
  }
}

export default new TreinamentosService();

