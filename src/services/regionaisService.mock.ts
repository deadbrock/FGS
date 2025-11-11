import {
  ColaboradorRegional,
  EstatisticasEstado,
  EstadoBrasil,
  RegiaoBrasil,
  UnidadeRegional,
  EstatisticasRegionais,
  FiltrosRegionais,
  ExpansaoRegional,
  RankingEstado,
  TransferenciaInterestadual,
  RelatorioRegional,
} from '../types/regionais';

// Mapa de estados para regiões
const estadoPorRegiao: Record<EstadoBrasil, RegiaoBrasil> = {
  [EstadoBrasil.AC]: RegiaoBrasil.NORTE,
  [EstadoBrasil.AM]: RegiaoBrasil.NORTE,
  [EstadoBrasil.AP]: RegiaoBrasil.NORTE,
  [EstadoBrasil.PA]: RegiaoBrasil.NORTE,
  [EstadoBrasil.RO]: RegiaoBrasil.NORTE,
  [EstadoBrasil.RR]: RegiaoBrasil.NORTE,
  [EstadoBrasil.TO]: RegiaoBrasil.NORTE,
  [EstadoBrasil.AL]: RegiaoBrasil.NORDESTE,
  [EstadoBrasil.BA]: RegiaoBrasil.NORDESTE,
  [EstadoBrasil.CE]: RegiaoBrasil.NORDESTE,
  [EstadoBrasil.MA]: RegiaoBrasil.NORDESTE,
  [EstadoBrasil.PB]: RegiaoBrasil.NORDESTE,
  [EstadoBrasil.PE]: RegiaoBrasil.NORDESTE,
  [EstadoBrasil.PI]: RegiaoBrasil.NORDESTE,
  [EstadoBrasil.RN]: RegiaoBrasil.NORDESTE,
  [EstadoBrasil.SE]: RegiaoBrasil.NORDESTE,
  [EstadoBrasil.DF]: RegiaoBrasil.CENTRO_OESTE,
  [EstadoBrasil.GO]: RegiaoBrasil.CENTRO_OESTE,
  [EstadoBrasil.MT]: RegiaoBrasil.CENTRO_OESTE,
  [EstadoBrasil.MS]: RegiaoBrasil.CENTRO_OESTE,
  [EstadoBrasil.ES]: RegiaoBrasil.SUDESTE,
  [EstadoBrasil.MG]: RegiaoBrasil.SUDESTE,
  [EstadoBrasil.RJ]: RegiaoBrasil.SUDESTE,
  [EstadoBrasil.SP]: RegiaoBrasil.SUDESTE,
  [EstadoBrasil.PR]: RegiaoBrasil.SUL,
  [EstadoBrasil.RS]: RegiaoBrasil.SUL,
  [EstadoBrasil.SC]: RegiaoBrasil.SUL,
};

// Nomes completos dos estados
const nomesEstados: Record<EstadoBrasil, string> = {
  [EstadoBrasil.AC]: 'Acre',
  [EstadoBrasil.AL]: 'Alagoas',
  [EstadoBrasil.AP]: 'Amapá',
  [EstadoBrasil.AM]: 'Amazonas',
  [EstadoBrasil.BA]: 'Bahia',
  [EstadoBrasil.CE]: 'Ceará',
  [EstadoBrasil.DF]: 'Distrito Federal',
  [EstadoBrasil.ES]: 'Espírito Santo',
  [EstadoBrasil.GO]: 'Goiás',
  [EstadoBrasil.MA]: 'Maranhão',
  [EstadoBrasil.MT]: 'Mato Grosso',
  [EstadoBrasil.MS]: 'Mato Grosso do Sul',
  [EstadoBrasil.MG]: 'Minas Gerais',
  [EstadoBrasil.PA]: 'Pará',
  [EstadoBrasil.PB]: 'Paraíba',
  [EstadoBrasil.PR]: 'Paraná',
  [EstadoBrasil.PE]: 'Pernambuco',
  [EstadoBrasil.PI]: 'Piauí',
  [EstadoBrasil.RJ]: 'Rio de Janeiro',
  [EstadoBrasil.RN]: 'Rio Grande do Norte',
  [EstadoBrasil.RS]: 'Rio Grande do Sul',
  [EstadoBrasil.RO]: 'Rondônia',
  [EstadoBrasil.RR]: 'Roraima',
  [EstadoBrasil.SC]: 'Santa Catarina',
  [EstadoBrasil.SP]: 'São Paulo',
  [EstadoBrasil.SE]: 'Sergipe',
  [EstadoBrasil.TO]: 'Tocantins',
};

// Dados mock de colaboradores por estado
const colaboradoresMock: ColaboradorRegional[] = [
  // São Paulo
  ...Array.from({ length: 150 }, (_, i) => ({
    id: `col-sp-${i + 1}`,
    nome: `Colaborador SP ${i + 1}`,
    email: `colaborador.sp${i + 1}@fgs.com`,
    cargo: ['Analista', 'Coordenador', 'Gerente', 'Assistente'][i % 4],
    departamento: ['Operações', 'Vendas', 'TI', 'RH', 'Financeiro'][i % 5],
    estado: EstadoBrasil.SP,
    cidade: ['São Paulo', 'Campinas', 'Santos', 'Ribeirão Preto'][i % 4],
    dataAdmissao: `2023-${String((i % 12) + 1).padStart(2, '0')}-15`,
    status: (['ATIVO', 'ATIVO', 'ATIVO', 'FERIAS'] as const)[i % 4],
    genero: (i % 2 === 0 ? 'MASCULINO' : 'FEMININO') as 'MASCULINO' | 'FEMININO',
    telefone: `(11) 9${String(i).padStart(4, '0')}-${String(i).padStart(4, '0')}`,
    unidade: `Unidade SP ${(i % 5) + 1}`,
    avatar: `https://i.pravatar.cc/150?img=${(i % 70) + 1}`,
  })),
  // Rio de Janeiro
  ...Array.from({ length: 80 }, (_, i) => ({
    id: `col-rj-${i + 1}`,
    nome: `Colaborador RJ ${i + 1}`,
    email: `colaborador.rj${i + 1}@fgs.com`,
    cargo: ['Analista', 'Coordenador', 'Gerente'][i % 3],
    departamento: ['Operações', 'Vendas', 'TI'][i % 3],
    estado: EstadoBrasil.RJ,
    genero: (i % 3 === 0 ? 'FEMININO' : 'MASCULINO') as 'MASCULINO' | 'FEMININO',
    cidade: ['Rio de Janeiro', 'Niterói', 'Duque de Caxias'][i % 3],
    dataAdmissao: `2023-${String((i % 12) + 1).padStart(2, '0')}-10`,
    status: 'ATIVO',
    telefone: `(21) 9${String(i).padStart(4, '0')}-${String(i).padStart(4, '0')}`,
    unidade: `Unidade RJ ${(i % 3) + 1}`,
  })),
  // Minas Gerais
  ...Array.from({ length: 60 }, (_, i) => ({
    id: `col-mg-${i + 1}`,
    nome: `Colaborador MG ${i + 1}`,
    email: `colaborador.mg${i + 1}@fgs.com`,
    cargo: ['Analista', 'Assistente'][i % 2],
    departamento: ['Operações', 'Vendas'][i % 2],
    estado: EstadoBrasil.MG,
    genero: (i % 2 === 0 ? 'FEMININO' : 'MASCULINO') as 'MASCULINO' | 'FEMININO',
    cidade: ['Belo Horizonte', 'Uberlândia', 'Juiz de Fora'][i % 3],
    dataAdmissao: `2023-${String((i % 12) + 1).padStart(2, '0')}-05`,
    status: 'ATIVO',
    telefone: `(31) 9${String(i).padStart(4, '0')}-${String(i).padStart(4, '0')}`,
    unidade: `Unidade MG ${(i % 2) + 1}`,
  })),
  // Paraná
  ...Array.from({ length: 45 }, (_, i) => ({
    id: `col-pr-${i + 1}`,
    nome: `Colaborador PR ${i + 1}`,
    email: `colaborador.pr${i + 1}@fgs.com`,
    cargo: ['Analista', 'Coordenador'][i % 2],
    departamento: ['Operações', 'TI'][i % 2],
    estado: EstadoBrasil.PR,
    genero: (i % 3 === 0 ? 'FEMININO' : 'MASCULINO') as 'MASCULINO' | 'FEMININO',
    cidade: ['Curitiba', 'Londrina', 'Maringá'][i % 3],
    dataAdmissao: `2023-${String((i % 12) + 1).padStart(2, '0')}-20`,
    status: 'ATIVO',
    telefone: `(41) 9${String(i).padStart(4, '0')}-${String(i).padStart(4, '0')}`,
    unidade: 'Unidade PR 1',
  })),
  // Rio Grande do Sul
  ...Array.from({ length: 40 }, (_, i) => ({
    id: `col-rs-${i + 1}`,
    nome: `Colaborador RS ${i + 1}`,
    email: `colaborador.rs${i + 1}@fgs.com`,
    cargo: 'Analista',
    departamento: ['Operações', 'Vendas'][i % 2],
    estado: EstadoBrasil.RS,
    genero: (i % 2 === 0 ? 'MASCULINO' : 'FEMININO') as 'MASCULINO' | 'FEMININO',
    cidade: ['Porto Alegre', 'Caxias do Sul'][i % 2],
    dataAdmissao: `2023-${String((i % 12) + 1).padStart(2, '0')}-25`,
    status: 'ATIVO',
    telefone: `(51) 9${String(i).padStart(4, '0')}-${String(i).padStart(4, '0')}`,
    unidade: 'Unidade RS 1',
  })),
  // Santa Catarina
  ...Array.from({ length: 35 }, (_, i) => ({
    id: `col-sc-${i + 1}`,
    nome: `Colaborador SC ${i + 1}`,
    email: `colaborador.sc${i + 1}@fgs.com`,
    cargo: 'Analista',
    departamento: 'Operações',
    estado: EstadoBrasil.SC,
    genero: (i % 2 === 0 ? 'FEMININO' : 'MASCULINO') as 'MASCULINO' | 'FEMININO',
    cidade: ['Florianópolis', 'Joinville'][i % 2],
    dataAdmissao: `2024-${String((i % 6) + 1).padStart(2, '0')}-10`,
    status: 'ATIVO',
    telefone: `(48) 9${String(i).padStart(4, '0')}-${String(i).padStart(4, '0')}`,
    unidade: 'Unidade SC 1',
  })),
  // Bahia
  ...Array.from({ length: 30 }, (_, i) => ({
    id: `col-ba-${i + 1}`,
    nome: `Colaborador BA ${i + 1}`,
    genero: (i % 3 === 0 ? 'FEMININO' : 'MASCULINO') as 'MASCULINO' | 'FEMININO',
    email: `colaborador.ba${i + 1}@fgs.com`,
    cargo: ['Analista', 'Assistente'][i % 2],
    departamento: ['Operações', 'Vendas'][i % 2],
    estado: EstadoBrasil.BA,
    cidade: ['Salvador', 'Feira de Santana'][i % 2],
    dataAdmissao: `2024-01-${String((i % 28) + 1).padStart(2, '0')}`,
    status: 'ATIVO',
    telefone: `(71) 9${String(i).padStart(4, '0')}-${String(i).padStart(4, '0')}`,
    unidade: 'Unidade BA 1',
  })),
  // Pernambuco
  ...Array.from({ length: 25 }, (_, i) => ({
    id: `col-pe-${i + 1}`,
    nome: `Colaborador PE ${i + 1}`,
    email: `colaborador.pe${i + 1}@fgs.com`,
    cargo: 'Analista',
    departamento: 'Operações',
    estado: EstadoBrasil.PE,
    genero: (i % 2 === 0 ? 'MASCULINO' : 'FEMININO') as 'MASCULINO' | 'FEMININO',
    cidade: ['Recife', 'Jaboatão dos Guararapes'][i % 2],
    dataAdmissao: `2024-02-${String((i % 28) + 1).padStart(2, '0')}`,
    status: 'ATIVO',
    telefone: `(81) 9${String(i).padStart(4, '0')}-${String(i).padStart(4, '0')}`,
    unidade: 'Unidade PE 1',
  })),
  // Ceará
  ...Array.from({ length: 20 }, (_, i) => ({
    id: `col-ce-${i + 1}`,
    nome: `Colaborador CE ${i + 1}`,
    email: `colaborador.ce${i + 1}@fgs.com`,
    cargo: 'Assistente',
    departamento: 'Operações',
    estado: EstadoBrasil.CE,
    genero: (i % 3 === 0 ? 'FEMININO' : 'MASCULINO') as 'MASCULINO' | 'FEMININO',
    cidade: 'Fortaleza',
    dataAdmissao: `2024-03-${String((i % 28) + 1).padStart(2, '0')}`,
    status: 'ATIVO',
    telefone: `(85) 9${String(i).padStart(4, '0')}-${String(i).padStart(4, '0')}`,
    unidade: 'Unidade CE 1',
  })),
  // Goiás
  ...Array.from({ length: 18 }, (_, i) => ({
    id: `col-go-${i + 1}`,
    nome: `Colaborador GO ${i + 1}`,
    email: `colaborador.go${i + 1}@fgs.com`,
    cargo: 'Analista',
    departamento: 'Operações',
    estado: EstadoBrasil.GO,
    genero: (i % 2 === 0 ? 'FEMININO' : 'MASCULINO') as 'MASCULINO' | 'FEMININO',
    cidade: 'Goiânia',
    dataAdmissao: `2024-04-${String((i % 28) + 1).padStart(2, '0')}`,
    status: 'ATIVO',
    telefone: `(62) 9${String(i).padStart(4, '0')}-${String(i).padStart(4, '0')}`,
    unidade: 'Unidade GO 1',
  })),
  // Distrito Federal
  ...Array.from({ length: 15 }, (_, i) => ({
    id: `col-df-${i + 1}`,
    nome: `Colaborador DF ${i + 1}`,
    email: `colaborador.df${i + 1}@fgs.com`,
    cargo: 'Analista',
    departamento: ['Operações', 'RH'][i % 2],
    estado: EstadoBrasil.DF,
    genero: (i % 2 === 0 ? 'MASCULINO' : 'FEMININO') as 'MASCULINO' | 'FEMININO',
    cidade: 'Brasília',
    dataAdmissao: `2024-05-${String((i % 28) + 1).padStart(2, '0')}`,
    status: 'ATIVO',
    telefone: `(61) 9${String(i).padStart(4, '0')}-${String(i).padStart(4, '0')}`,
    unidade: 'Unidade DF 1',
  })),
];

// Service mock
class RegionaisServiceMock {
  // Obter estatísticas gerais
  async getEstatisticasGerais(): Promise<EstatisticasRegionais> {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const distribuicaoPorEstado = colaboradoresMock.reduce((acc, col) => {
      acc[col.estado] = (acc[col.estado] || 0) + 1;
      return acc;
    }, {} as Record<EstadoBrasil, number>);

    const distribuicaoPorRegiao = Object.entries(distribuicaoPorEstado).reduce(
      (acc, [estado, count]) => {
        const regiao = estadoPorRegiao[estado as EstadoBrasil];
        acc[regiao] = (acc[regiao] || 0) + count;
        return acc;
      },
      {} as Record<RegiaoBrasil, number>
    );

    const estadoMaior = Object.entries(distribuicaoPorEstado).sort((a, b) => b[1] - a[1])[0];
    const regiaoMaior = Object.entries(distribuicaoPorRegiao).sort((a, b) => b[1] - a[1])[0];

    // Contar por gênero
    const masculinos = colaboradoresMock.filter(c => c.genero === 'MASCULINO').length;
    const femininos = colaboradoresMock.filter(c => c.genero === 'FEMININO').length;

    return {
      totalColaboradores: colaboradoresMock.length,
      colaboradoresMasculinos: masculinos,
      colaboradoresFemininos: femininos,
      estadosAtivos: Object.keys(distribuicaoPorEstado).length,
      unidadesAtivas: 25,
      regiaoMaiorConcentracao: regiaoMaior[0] as RegiaoBrasil,
      estadoMaiorConcentracao: estadoMaior[0] as EstadoBrasil,
      crescimentoAnual: 15.5,
      distribuicaoPorRegiao,
      distribuicaoPorEstado,
      distribuicaoPorGenero: {
        masculino: masculinos,
        feminino: femininos,
      },
    };
  }

  // Obter estatísticas por estado
  async getEstatisticasEstado(estado: EstadoBrasil): Promise<EstatisticasEstado> {
    await new Promise((resolve) => setTimeout(resolve, 300));

    const colaboradores = colaboradoresMock.filter((c) => c.estado === estado);
    const ativos = colaboradores.filter((c) => c.status === 'ATIVO').length;
    const ferias = colaboradores.filter((c) => c.status === 'FERIAS').length;
    const afastados = colaboradores.filter((c) => c.status === 'AFASTADO').length;
    const inativos = colaboradores.filter((c) => c.status === 'INATIVO').length;

    const departamentos = [...new Set(colaboradores.map((c) => c.departamento))];
    const unidades = new Set(colaboradores.map((c) => c.unidade)).size;

    const cargos = colaboradores.reduce((acc, col) => {
      acc[col.cargo] = (acc[col.cargo] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      estado,
      nomeEstado: nomesEstados[estado],
      regiao: estadoPorRegiao[estado],
      totalColaboradores: colaboradores.length,
      colaboradoresAtivos: ativos,
      colaboradoresInativos: inativos,
      colaboradoresFerias: ferias,
      colaboradoresAfastados: afastados,
      unidades,
      departamentos,
      cargos,
      crescimentoMensal: Math.random() * 10 - 2,
      taxaRotatividade: Math.random() * 5,
    };
  }

  // Obter colaboradores por estado
  async getColaboradoresPorEstado(
    estado: EstadoBrasil,
    filtros?: FiltrosRegionais
  ): Promise<ColaboradorRegional[]> {
    await new Promise((resolve) => setTimeout(resolve, 400));

    let colaboradores = colaboradoresMock.filter((c) => c.estado === estado);

    if (filtros?.cidade) {
      colaboradores = colaboradores.filter((c) =>
        c.cidade.toLowerCase().includes(filtros.cidade!.toLowerCase())
      );
    }

    if (filtros?.departamento) {
      colaboradores = colaboradores.filter((c) => c.departamento === filtros.departamento);
    }

    if (filtros?.cargo) {
      colaboradores = colaboradores.filter((c) => c.cargo === filtros.cargo);
    }

    if (filtros?.status && filtros.status.length > 0) {
      colaboradores = colaboradores.filter((c) => filtros.status!.includes(c.status));
    }

    if (filtros?.busca) {
      const busca = filtros.busca.toLowerCase();
      colaboradores = colaboradores.filter(
        (c) =>
          c.nome.toLowerCase().includes(busca) ||
          c.email.toLowerCase().includes(busca) ||
          c.cargo.toLowerCase().includes(busca)
      );
    }

    return colaboradores;
  }

  // Obter ranking de estados
  async getRankingEstados(): Promise<RankingEstado[]> {
    await new Promise((resolve) => setTimeout(resolve, 300));

    const stats = await this.getEstatisticasGerais();
    
    const ranking = Object.entries(stats.distribuicaoPorEstado)
      .map(([estado, total], index) => ({
        posicao: index + 1,
        estado: estado as EstadoBrasil,
        nomeEstado: nomesEstados[estado as EstadoBrasil],
        totalColaboradores: total,
        crescimento: Math.random() * 20 - 5,
        unidades: Math.ceil(total / 20),
      }))
      .sort((a, b) => b.totalColaboradores - a.totalColaboradores)
      .map((item, index) => ({ ...item, posicao: index + 1 }));

    return ranking;
  }

  // Obter nome do estado
  getNomeEstado(estado: EstadoBrasil): string {
    return nomesEstados[estado];
  }

  // Obter região do estado
  getRegiaoEstado(estado: EstadoBrasil): RegiaoBrasil {
    return estadoPorRegiao[estado];
  }

  // Obter todos os estados
  getTodosEstados(): EstadoBrasil[] {
    return Object.values(EstadoBrasil);
  }

  // Obter todos os colaboradores (para aba Colaboradores)
  async getAllColaboradores(filtros?: FiltrosRegionais & { genero?: 'MASCULINO' | 'FEMININO' }): Promise<ColaboradorRegional[]> {
    await new Promise((resolve) => setTimeout(resolve, 500));

    let colaboradores = [...colaboradoresMock];

    if (filtros?.estado && filtros.estado.length > 0) {
      colaboradores = colaboradores.filter((c) => filtros.estado!.includes(c.estado));
    }

    if (filtros?.genero) {
      colaboradores = colaboradores.filter((c) => c.genero === filtros.genero);
    }

    if (filtros?.departamento) {
      colaboradores = colaboradores.filter((c) => c.departamento === filtros.departamento);
    }

    if (filtros?.cargo) {
      colaboradores = colaboradores.filter((c) => c.cargo === filtros.cargo);
    }

    if (filtros?.status && filtros.status.length > 0) {
      colaboradores = colaboradores.filter((c) => filtros.status!.includes(c.status));
    }

    if (filtros?.busca) {
      const busca = filtros.busca.toLowerCase();
      colaboradores = colaboradores.filter(
        (c) =>
          c.nome.toLowerCase().includes(busca) ||
          c.email.toLowerCase().includes(busca) ||
          c.cargo.toLowerCase().includes(busca) ||
          c.cidade.toLowerCase().includes(busca)
      );
    }

    return colaboradores;
  }
}

export default new RegionaisServiceMock();

