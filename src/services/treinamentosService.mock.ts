import {
  TipoTreinamento,
  TreinamentoColaborador,
  AgendamentoTreinamento,
  StatusTreinamento,
  StatusAgendamento,
  RelatorioTreinamentos,
  AlertaTreinamento,
  FiltrosTreinamentos,
  LinhaCSV,
} from '../types/treinamentos';
import { PaginacaoParams, PaginacaoResultado } from '../types/prontuario';
import { calcularDataValidade, calcularStatusTreinamento } from '../utils/treinamentosUtils';

// Dados Mock
const tiposTreinamentoMock: TipoTreinamento[] = [
  {
    id: '1',
    nome: 'NR-10 - Segurança em Instalações Elétricas',
    descricao: 'Treinamento obrigatório para trabalhos com eletricidade',
    cargaHoraria: 40,
    validadeDias: 730, // 2 anos
    categoria: 'Segurança do Trabalho',
    obrigatorio: true,
    ativo: true,
    criadoEm: '2024-01-01',
    atualizadoEm: '2024-01-01',
  },
  {
    id: '2',
    nome: 'Primeiros Socorros',
    descricao: 'Atendimento básico em emergências',
    cargaHoraria: 16,
    validadeDias: 365, // 1 ano
    categoria: 'Segurança do Trabalho',
    obrigatorio: true,
    ativo: true,
    criadoEm: '2024-01-01',
    atualizadoEm: '2024-01-01',
  },
  {
    id: '3',
    nome: 'Excel Avançado',
    descricao: 'Funções avançadas, tabelas dinâmicas e automação',
    cargaHoraria: 20,
    validadeDias: 0, // Sem validade
    categoria: 'Tecnologia',
    obrigatorio: false,
    ativo: true,
    criadoEm: '2024-01-01',
    atualizadoEm: '2024-01-01',
  },
];

const treinamentosMock: TreinamentoColaborador[] = [
  {
    id: '1',
    colaboradorId: '1',
    colaboradorNome: 'João Silva',
    tipoTreinamentoId: '1',
    tipoTreinamentoNome: 'NR-10',
    dataRealizacao: '2023-01-15',
    dataValidade: '2025-01-15',
    instrutor: 'Carlos Instrutor',
    instituicao: 'FGS Academy',
    nota: 9.5,
    status: StatusTreinamento.A_VENCER,
    alertaEnviado: false,
    criadoEm: '2023-01-15',
  },
  {
    id: '2',
    colaboradorId: '1',
    colaboradorNome: 'João Silva',
    tipoTreinamentoId: '2',
    tipoTreinamentoNome: 'Primeiros Socorros',
    dataRealizacao: '2023-06-10',
    dataValidade: '2024-06-10',
    instrutor: 'Ana Paula',
    instituicao: 'Cruz Vermelha',
    nota: 10,
    status: StatusTreinamento.VENCIDO,
    alertaEnviado: true,
    criadoEm: '2023-06-10',
  },
];

const alertasMock: AlertaTreinamento[] = [
  {
    id: '1',
    tipo: 'VENCIMENTO',
    colaboradorId: '1',
    colaboradorNome: 'João Silva',
    treinamentoId: '2',
    treinamentoNome: 'Primeiros Socorros',
    dataVencimento: '2024-06-10',
    diasParaVencer: -120,
    prioridade: 'ALTA',
    lido: false,
    criadoEm: '2024-06-11',
  },
  {
    id: '2',
    tipo: 'A_VENCER',
    colaboradorId: '1',
    colaboradorNome: 'João Silva',
    treinamentoId: '1',
    treinamentoNome: 'NR-10',
    dataVencimento: '2025-01-15',
    diasParaVencer: 60,
    prioridade: 'MEDIA',
    lido: false,
    criadoEm: '2024-10-19',
  },
];

class TreinamentosServiceMock {
  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  // TIPOS DE TREINAMENTO
  async listarTipos(): Promise<TipoTreinamento[]> {
    await this.delay(300);
    return [...tiposTreinamentoMock];
  }

  async buscarTipo(id: string): Promise<TipoTreinamento> {
    await this.delay(200);
    const tipo = tiposTreinamentoMock.find((t) => t.id === id);
    if (!tipo) throw new Error('Tipo não encontrado');
    return tipo;
  }

  async criarTipo(dados: Partial<TipoTreinamento>): Promise<TipoTreinamento> {
    await this.delay(500);
    const novoTipo: TipoTreinamento = {
      id: Date.now().toString(),
      nome: dados.nome || '',
      descricao: dados.descricao || '',
      cargaHoraria: dados.cargaHoraria || 0,
      validadeDias: dados.validadeDias || 0,
      categoria: dados.categoria || '',
      obrigatorio: dados.obrigatorio || false,
      ativo: dados.ativo !== false,
      criadoEm: new Date().toISOString(),
      atualizadoEm: new Date().toISOString(),
    };
    tiposTreinamentoMock.push(novoTipo);
    return novoTipo;
  }

  async atualizarTipo(id: string, dados: Partial<TipoTreinamento>): Promise<void> {
    await this.delay(500);
    const index = tiposTreinamentoMock.findIndex((t) => t.id === id);
    if (index !== -1) {
      tiposTreinamentoMock[index] = {
        ...tiposTreinamentoMock[index],
        ...dados,
        atualizadoEm: new Date().toISOString(),
      };
    }
  }

  async excluirTipo(id: string): Promise<void> {
    await this.delay(300);
    const index = tiposTreinamentoMock.findIndex((t) => t.id === id);
    if (index !== -1) {
      tiposTreinamentoMock.splice(index, 1);
    }
  }

  // TREINAMENTOS
  async listarTreinamentos(
    params: PaginacaoParams,
    filtros?: FiltrosTreinamentos
  ): Promise<PaginacaoResultado<TreinamentoColaborador>> {
    await this.delay(400);
    
    let dados = [...treinamentosMock];

    // Aplicar filtros
    if (filtros?.status && filtros.status.length > 0) {
      dados = dados.filter((t) => filtros.status!.includes(t.status));
    }

    if (filtros?.busca) {
      dados = dados.filter(
        (t) =>
          t.colaboradorNome.toLowerCase().includes(filtros.busca!.toLowerCase()) ||
          t.tipoTreinamentoNome.toLowerCase().includes(filtros.busca!.toLowerCase())
      );
    }

    const total = dados.length;
    const inicio = params.pagina * params.itensPorPagina;
    const fim = inicio + params.itensPorPagina;

    return {
      dados: dados.slice(inicio, fim),
      total,
      pagina: params.pagina,
      totalPaginas: Math.ceil(total / params.itensPorPagina),
    };
  }

  async criarTreinamento(dados: Partial<TreinamentoColaborador>): Promise<TreinamentoColaborador> {
    await this.delay(500);
    
    const tipo = tiposTreinamentoMock.find((t) => t.id === dados.tipoTreinamentoId);
    const dataValidade = calcularDataValidade(
      dados.dataRealizacao!,
      tipo?.validadeDias || 0
    );

    const novoTreinamento: TreinamentoColaborador = {
      id: Date.now().toString(),
      colaboradorId: dados.colaboradorId!,
      colaboradorNome: dados.colaboradorNome!,
      tipoTreinamentoId: dados.tipoTreinamentoId!,
      tipoTreinamentoNome: tipo?.nome || dados.tipoTreinamentoNome || '',
      dataRealizacao: dados.dataRealizacao!,
      dataValidade,
      instrutor: dados.instrutor,
      instituicao: dados.instituicao,
      nota: dados.nota,
      observacoes: dados.observacoes,
      status: calcularStatusTreinamento(dataValidade),
      alertaEnviado: false,
      criadoEm: new Date().toISOString(),
    };

    treinamentosMock.push(novoTreinamento);
    return novoTreinamento;
  }

  // IMPORTAÇÃO CSV
  async importarCSV(dados: LinhaCSV[]): Promise<{ sucesso: number; erros: number }> {
    await this.delay(2000);
    return { sucesso: dados.length, erros: 0 };
  }

  // AGENDAMENTOS
  async listarAgendamentos(): Promise<AgendamentoTreinamento[]> {
    await this.delay(300);
    return [];
  }

  async criarAgendamento(dados: Partial<AgendamentoTreinamento>): Promise<AgendamentoTreinamento> {
    await this.delay(500);
    return {
      id: Date.now().toString(),
      tipoTreinamentoId: dados.tipoTreinamentoId!,
      tipoTreinamentoNome: dados.tipoTreinamentoNome!,
      dataInicio: dados.dataInicio!,
      dataFim: dados.dataFim!,
      horario: dados.horario!,
      local: dados.local!,
      instrutor: dados.instrutor!,
      instituicao: dados.instituicao,
      vagasTotal: dados.vagasTotal!,
      vagasOcupadas: dados.colaboradores?.length || 0,
      colaboradores: dados.colaboradores || [],
      status: StatusAgendamento.AGENDADO,
      observacoes: dados.observacoes,
      criadoEm: new Date().toISOString(),
      criadoPor: 'Admin',
    };
  }

  // ALERTAS
  async listarAlertas(): Promise<AlertaTreinamento[]> {
    await this.delay(300);
    return [...alertasMock];
  }

  async marcarAlertaLido(alertaId: string): Promise<void> {
    await this.delay(200);
    const alerta = alertasMock.find((a) => a.id === alertaId);
    if (alerta) {
      alerta.lido = true;
    }
  }

  // RELATÓRIOS
  async gerarRelatorio(dataInicio: string, dataFim: string): Promise<RelatorioTreinamentos> {
    await this.delay(800);
    
    return {
      periodo: { inicio: dataInicio, fim: dataFim },
      totalTreinamentos: 2,
      treinamentosAtivos: 0,
      treinamentosVencidos: 1,
      treinamentosAVencer: 1,
      porSetor: [
        {
          setor: 'Recursos Humanos',
          total: 2,
          ativos: 0,
          vencidos: 1,
          aVencer: 1,
          percentualConclusao: 50,
        },
      ],
      porTipo: [
        {
          tipoId: '1',
          tipoNome: 'NR-10',
          total: 1,
          concluidos: 0,
          vencidos: 0,
          aVencer: 1,
        },
        {
          tipoId: '2',
          tipoNome: 'Primeiros Socorros',
          total: 1,
          concluidos: 0,
          vencidos: 1,
          aVencer: 0,
        },
      ],
      colaboradoresComTreinamentoVencido: [
        {
          colaboradorId: '1',
          colaboradorNome: 'João Silva',
          departamento: 'RH',
          cargo: 'Analista',
          treinamento: 'Primeiros Socorros',
          dataVencimento: '2024-06-10',
          diasVencido: 120,
        },
      ],
      colaboradoresPendentes: [],
    };
  }

  async listarVencidos(): Promise<TreinamentoColaborador[]> {
    await this.delay(300);
    return treinamentosMock.filter((t) => t.status === StatusTreinamento.VENCIDO);
  }

  async listarAVencer(dias: number = 30): Promise<TreinamentoColaborador[]> {
    await this.delay(300);
    return treinamentosMock.filter((t) => t.status === StatusTreinamento.A_VENCER);
  }
}

export default new TreinamentosServiceMock();

