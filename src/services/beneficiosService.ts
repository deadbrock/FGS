// MODO MOCK - Para usar sem backend
export { default } from './beneficiosService.mock';

/*
// ========================================
// CÓDIGO PARA BACKEND REAL (DESCOMENTE)
// ========================================

import api from './api';
import {
  Beneficio,
  BeneficioColaborador,
  HistoricoBeneficio,
  EstatisticasBeneficios,
  RelatorioCustos,
  ComparativoPeriodos,
} from '../types/beneficios';

class BeneficiosService {
  // BENEFÍCIOS (Templates)
  async listarBeneficios(): Promise<Beneficio[]> {
    const response = await api.get('/beneficios');
    return response.data;
  }

  async buscarBeneficio(id: string): Promise<Beneficio> {
    const response = await api.get(`/beneficios/${id}`);
    return response.data;
  }

  async criarBeneficio(beneficio: Partial<Beneficio>): Promise<Beneficio> {
    const response = await api.post('/beneficios', beneficio);
    return response.data;
  }

  async atualizarBeneficio(id: string, beneficio: Partial<Beneficio>): Promise<Beneficio> {
    const response = await api.put(`/beneficios/${id}`, beneficio);
    return response.data;
  }

  // BENEFÍCIOS DE COLABORADORES
  async listarBeneficiosColaborador(colaboradorId?: string): Promise<BeneficioColaborador[]> {
    const response = await api.get('/beneficios-colaborador', {
      params: { colaboradorId },
    });
    return response.data;
  }

  async associarBeneficio(dados: Partial<BeneficioColaborador>): Promise<BeneficioColaborador> {
    const response = await api.post('/beneficios-colaborador', dados);
    return response.data;
  }

  async atualizarBeneficioColaborador(
    id: string,
    dados: Partial<BeneficioColaborador>
  ): Promise<BeneficioColaborador> {
    const response = await api.put(`/beneficios-colaborador/${id}`, dados);
    return response.data;
  }

  // HISTÓRICO
  async buscarHistorico(
    colaboradorId?: string,
    beneficioId?: string
  ): Promise<HistoricoBeneficio[]> {
    const response = await api.get('/beneficios/historico', {
      params: { colaboradorId, beneficioId },
    });
    return response.data;
  }

  // ESTATÍSTICAS
  async buscarEstatisticas(): Promise<EstatisticasBeneficios> {
    const response = await api.get('/beneficios/estatisticas');
    return response.data;
  }

  // RELATÓRIOS
  async gerarRelatorioCustos(dataInicio: string, dataFim: string): Promise<RelatorioCustos> {
    const response = await api.get('/beneficios/relatorios/custos', {
      params: { dataInicio, dataFim },
    });
    return response.data;
  }

  async gerarComparativo(
    periodo1Inicio: string,
    periodo1Fim: string,
    periodo2Inicio: string,
    periodo2Fim: string
  ): Promise<ComparativoPeriodos> {
    const response = await api.get('/beneficios/relatorios/comparativo', {
      params: { periodo1Inicio, periodo1Fim, periodo2Inicio, periodo2Fim },
    });
    return response.data;
  }
}

export default new BeneficiosService();
*/

