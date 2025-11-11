import {
  Beneficio,
  BeneficioColaborador,
  HistoricoBeneficio,
  EstatisticasBeneficios,
  RelatorioCustos,
  TipoBeneficio,
  StatusBeneficio,
  FrequenciaBeneficio,
  TipoValor,
} from '../types/beneficios';

// Dados mock
const beneficiosMock: Beneficio[] = [
  {
    id: '1',
    tipo: TipoBeneficio.VALE_REFEICAO,
    nome: 'Vale Refeição Padrão',
    descricao: 'Vale refeição para todos os colaboradores',
    fornecedor: 'Alelo',
    tipoValor: TipoValor.VALOR_FIXO,
    valorFixo: 30,
    frequencia: FrequenciaBeneficio.MENSAL,
    diaConcessao: 1,
    exigeComprovacao: false,
    custoEmpresa: 900,
    custoColaborador: 0,
    status: StatusBeneficio.ATIVO,
    dataInicio: '2024-01-01',
    criadoPor: 'Admin',
    criadoEm: '2024-01-01T00:00:00',
  },
  {
    id: '2',
    tipo: TipoBeneficio.PLANO_SAUDE,
    nome: 'Plano de Saúde Unimed',
    descricao: 'Plano de saúde completo',
    fornecedor: 'Unimed',
    tipoValor: TipoValor.VALOR_FIXO,
    valorFixo: 450,
    frequencia: FrequenciaBeneficio.MENSAL,
    exigeComprovacao: true,
    custoEmpresa: 350,
    custoColaborador: 100,
    status: StatusBeneficio.ATIVO,
    dataInicio: '2024-01-01',
    criadoPor: 'Admin',
    criadoEm: '2024-01-01T00:00:00',
  },
];

const beneficiosColaboradorMock: BeneficioColaborador[] = [
  {
    id: '1',
    colaboradorId: '1',
    colaboradorNome: 'João Silva',
    beneficioId: '1',
    beneficio: beneficiosMock[0],
    valorConcedido: 900,
    custoEmpresaReal: 900,
    custoColaboradorReal: 0,
    status: StatusBeneficio.ATIVO,
    dataInicio: '2024-01-01',
    documentosComprovacao: [],
    criadoEm: '2024-01-01T00:00:00',
  },
];

const historicoMock: HistoricoBeneficio[] = [
  {
    id: '1',
    beneficioColaboradorId: '1',
    colaboradorId: '1',
    colaboradorNome: 'João Silva',
    beneficioNome: 'Vale Refeição Padrão',
    tipoAlteracao: 'CONCESSAO',
    valorNovo: 900,
    statusNovo: StatusBeneficio.ATIVO,
    motivo: 'Concessão inicial',
    alteradoPor: 'Admin',
    dataAlteracao: '2024-01-01T00:00:00',
  },
];

class BeneficiosServiceMock {
  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  // BENEFÍCIOS (Templates)
  async listarBeneficios(): Promise<Beneficio[]> {
    await this.delay(300);
    return beneficiosMock;
  }

  async buscarBeneficio(id: string): Promise<Beneficio | null> {
    await this.delay(200);
    return beneficiosMock.find(b => b.id === id) || null;
  }

  async criarBeneficio(beneficio: Partial<Beneficio>): Promise<Beneficio> {
    await this.delay(400);
    const novo: Beneficio = {
      ...beneficio,
      id: Date.now().toString(),
      criadoEm: new Date().toISOString(),
    } as Beneficio;
    beneficiosMock.push(novo);
    return novo;
  }

  async atualizarBeneficio(id: string, beneficio: Partial<Beneficio>): Promise<Beneficio> {
    await this.delay(400);
    const index = beneficiosMock.findIndex(b => b.id === id);
    if (index >= 0) {
      beneficiosMock[index] = { ...beneficiosMock[index], ...beneficio };
      return beneficiosMock[index];
    }
    throw new Error('Benefício não encontrado');
  }

  async excluirBeneficio(id: string): Promise<void> {
    await this.delay(400);
    const index = beneficiosMock.findIndex(b => b.id === id);
    if (index >= 0) {
      beneficiosMock.splice(index, 1);
    } else {
      throw new Error('Benefício não encontrado');
    }
  }

  // BENEFÍCIOS DE COLABORADORES
  async listarBeneficiosColaborador(colaboradorId?: string): Promise<BeneficioColaborador[]> {
    await this.delay(300);
    if (colaboradorId) {
      return beneficiosColaboradorMock.filter(b => b.colaboradorId === colaboradorId);
    }
    return beneficiosColaboradorMock;
  }

  async associarBeneficio(dados: Partial<BeneficioColaborador>): Promise<BeneficioColaborador> {
    await this.delay(400);
    const novo: BeneficioColaborador = {
      ...dados,
      id: Date.now().toString(),
      criadoEm: new Date().toISOString(),
    } as BeneficioColaborador;
    beneficiosColaboradorMock.push(novo);
    return novo;
  }

  async atualizarBeneficioColaborador(
    id: string,
    dados: Partial<BeneficioColaborador>
  ): Promise<BeneficioColaborador> {
    await this.delay(400);
    const index = beneficiosColaboradorMock.findIndex(b => b.id === id);
    if (index >= 0) {
      beneficiosColaboradorMock[index] = { ...beneficiosColaboradorMock[index], ...dados };
      return beneficiosColaboradorMock[index];
    }
    throw new Error('Benefício não encontrado');
  }

  // HISTÓRICO
  async buscarHistorico(
    colaboradorId?: string
  ): Promise<HistoricoBeneficio[]> {
    await this.delay(300);
    let historico = [...historicoMock];
    
    if (colaboradorId) {
      historico = historico.filter(h => h.colaboradorId === colaboradorId);
    }
    
    return historico;
  }

  // ESTATÍSTICAS
  async buscarEstatisticas(): Promise<EstatisticasBeneficios> {
    await this.delay(500);
    
    return {
      totalAtivos: 125,
      totalInativos: 8,
      totalColaboradoresAtendidos: 245,
      custoMensalEmpresa: 187500,
      custoMensalColaborador: 24500,
      custoMensalTotal: 212000,
      distribuicaoPorTipo: [
        { tipo: TipoBeneficio.VALE_REFEICAO, nome: 'Vale Refeição', quantidade: 245, percentual: 35 },
        { tipo: TipoBeneficio.PLANO_SAUDE, nome: 'Plano de Saúde', quantidade: 180, percentual: 25 },
        { tipo: TipoBeneficio.VALE_TRANSPORTE, nome: 'Vale Transporte', quantidade: 150, percentual: 20 },
        { tipo: TipoBeneficio.VALE_ALIMENTACAO, nome: 'Vale Alimentação', quantidade: 100, percentual: 15 },
      ],
      evolucaoCustos: [
        { mes: 'Jan', custoEmpresa: 185000, custoColaborador: 24000, custoTotal: 209000 },
        { mes: 'Fev', custoEmpresa: 186000, custoColaborador: 24200, custoTotal: 210200 },
        { mes: 'Mar', custoEmpresa: 187000, custoColaborador: 24400, custoTotal: 211400 },
        { mes: 'Abr', custoEmpresa: 187500, custoColaborador: 24500, custoTotal: 212000 },
      ],
      beneficiosProximosVencimento: [],
      beneficiosSemComprovacao: [],
    };
  }

  // RELATÓRIOS
  async gerarRelatorioCustos(dataInicio: string, dataFim: string): Promise<RelatorioCustos> {
    await this.delay(600);
    
    return {
      periodo: { inicio: dataInicio, fim: dataFim },
      custoTotalEmpresa: 562500,
      custoTotalColaborador: 73500,
      custoTotal: 636000,
      totalBeneficios: 125,
      totalColaboradores: 245,
      porTipo: [
        {
          tipo: TipoBeneficio.VALE_REFEICAO,
          nome: 'Vale Refeição',
          quantidade: 245,
          custoEmpresa: 220500,
          custoColaborador: 0,
          custoTotal: 220500,
          percentualTotal: 34.7,
        },
        {
          tipo: TipoBeneficio.PLANO_SAUDE,
          nome: 'Plano de Saúde',
          quantidade: 180,
          custoEmpresa: 189000,
          custoColaborador: 54000,
          custoTotal: 243000,
          percentualTotal: 38.2,
        },
        {
          tipo: TipoBeneficio.VALE_TRANSPORTE,
          nome: 'Vale Transporte',
          quantidade: 150,
          custoEmpresa: 90000,
          custoColaborador: 15000,
          custoTotal: 105000,
          percentualTotal: 16.5,
        },
      ],
      porDepartamento: [
        {
          departamento: 'TI',
          quantidade: 45,
          custoEmpresa: 120000,
          custoColaborador: 18000,
          custoTotal: 138000,
          colaboradoresAtendidos: 45,
        },
        {
          departamento: 'RH',
          quantidade: 25,
          custoEmpresa: 60000,
          custoColaborador: 9000,
          custoTotal: 69000,
          colaboradoresAtendidos: 25,
        },
      ],
      topColaboradores: [],
    };
  }
}

export default new BeneficiosServiceMock();

