import { 
  Colaborador, 
  EventoHistorico, 
  TipoEventoHistorico, 
  StatusColaborador,
  TipoAdvertencia 
} from '../types';

// Dados mock de colaboradores
const mockColaboradores: Colaborador[] = [
  {
    id: '1',
    nome: 'João Silva Santos',
    cpf: '123.456.789-00',
    rg: '12.345.678-9',
    email: 'joao.silva@fgs.com',
    telefone: '(11) 98765-4321',
    cargo: 'Analista de Sistemas',
    departamento: 'TI',
    dataAdmissao: new Date('2020-01-15'),
    status: StatusColaborador.ATIVO,
    salario: 6500,
    cargaHoraria: 44,
    supervisor: 'Carlos Mendes',
  },
  {
    id: '2',
    nome: 'Maria Oliveira Costa',
    cpf: '987.654.321-00',
    rg: '98.765.432-1',
    email: 'maria.oliveira@fgs.com',
    telefone: '(11) 98765-1234',
    cargo: 'Gerente de Vendas',
    departamento: 'Comercial',
    dataAdmissao: new Date('2018-03-20'),
    status: StatusColaborador.FERIAS,
    salario: 8500,
    cargaHoraria: 44,
    supervisor: 'Roberto Ferreira',
  },
  {
    id: '3',
    nome: 'Pedro Souza Lima',
    cpf: '456.789.123-00',
    rg: '45.678.912-3',
    email: 'pedro.souza@fgs.com',
    telefone: '(11) 98765-5678',
    cargo: 'Assistente Administrativo',
    departamento: 'Administrativo',
    dataAdmissao: new Date('2019-07-10'),
    dataDemissao: new Date('2024-10-30'),
    status: StatusColaborador.DEMITIDO,
    salario: 3200,
    cargaHoraria: 44,
    supervisor: 'Ana Paula',
  },
  {
    id: '4',
    nome: 'Ana Paula Ferreira',
    cpf: '321.654.987-00',
    rg: '32.165.498-7',
    email: 'ana.ferreira@fgs.com',
    telefone: '(11) 98765-9012',
    cargo: 'Coordenadora RH',
    departamento: 'Recursos Humanos',
    dataAdmissao: new Date('2017-05-05'),
    status: StatusColaborador.ATIVO,
    salario: 7800,
    cargaHoraria: 44,
    supervisor: 'Diretor Geral',
  },
  {
    id: '5',
    nome: 'Carlos Eduardo Mendes',
    cpf: '789.123.456-00',
    rg: '78.912.345-6',
    email: 'carlos.mendes@fgs.com',
    telefone: '(11) 98765-3456',
    cargo: 'Operador de Produção',
    departamento: 'Produção',
    dataAdmissao: new Date('2021-02-14'),
    status: StatusColaborador.AFASTADO,
    salario: 2800,
    cargaHoraria: 44,
    supervisor: 'Marcos Silva',
  },
];

// Dados mock de eventos de histórico
const mockEventosHistorico: EventoHistorico[] = [
  // Eventos do João Silva Santos (id: 1)
  {
    id: 'evt-1',
    colaboradorId: '1',
    tipo: TipoEventoHistorico.ADMISSAO,
    data: new Date('2020-01-15'),
    descricao: 'Admissão como Assistente de TI',
    registradoPor: 'rh-1',
    registradoPorNome: 'Ana Paula Ferreira',
  },
  {
    id: 'evt-2',
    colaboradorId: '1',
    tipo: TipoEventoHistorico.TREINAMENTO,
    data: new Date('2020-03-10'),
    descricao: 'Treinamento em Segurança da Informação',
    observacoes: 'Carga horária: 40 horas',
    registradoPor: 'rh-1',
    registradoPorNome: 'Ana Paula Ferreira',
  },
  {
    id: 'evt-3',
    colaboradorId: '1',
    tipo: TipoEventoHistorico.PROMOCAO,
    data: new Date('2021-06-01'),
    descricao: 'Promoção para Analista de Sistemas',
    registradoPor: 'rh-1',
    registradoPorNome: 'Ana Paula Ferreira',
    promocao: {
      cargoAnterior: 'Assistente de TI',
      cargoNovo: 'Analista de Sistemas',
      salarioAnterior: 4500,
      salarioNovo: 6500,
    },
  },
  {
    id: 'evt-4',
    colaboradorId: '1',
    tipo: TipoEventoHistorico.FERIAS,
    data: new Date('2022-01-10'),
    descricao: 'Férias programadas',
    registradoPor: 'rh-1',
    registradoPorNome: 'Ana Paula Ferreira',
    ferias: {
      dataInicio: new Date('2022-01-10'),
      dataFim: new Date('2022-01-30'),
      diasCorridos: 20,
      periodoAquisitivo: '2020-2021',
    },
  },
  {
    id: 'evt-5',
    colaboradorId: '1',
    tipo: TipoEventoHistorico.ELOGIO,
    data: new Date('2023-05-15'),
    descricao: 'Elogio por projeto bem-sucedido',
    observacoes: 'Implementação do novo sistema de gestão com excelência',
    registradoPor: 'gestor-1',
    registradoPorNome: 'Carlos Mendes',
  },
  
  // Eventos da Maria Oliveira Costa (id: 2)
  {
    id: 'evt-6',
    colaboradorId: '2',
    tipo: TipoEventoHistorico.ADMISSAO,
    data: new Date('2018-03-20'),
    descricao: 'Admissão como Vendedora',
    registradoPor: 'rh-1',
    registradoPorNome: 'Ana Paula Ferreira',
  },
  {
    id: 'evt-7',
    colaboradorId: '2',
    tipo: TipoEventoHistorico.PROMOCAO,
    data: new Date('2019-08-15'),
    descricao: 'Promoção para Gerente de Vendas',
    registradoPor: 'rh-1',
    registradoPorNome: 'Ana Paula Ferreira',
    promocao: {
      cargoAnterior: 'Vendedora',
      cargoNovo: 'Gerente de Vendas',
      salarioAnterior: 5500,
      salarioNovo: 8500,
    },
  },
  {
    id: 'evt-8',
    colaboradorId: '2',
    tipo: TipoEventoHistorico.ATESTADO,
    data: new Date('2023-08-20'),
    descricao: 'Atestado médico - Gripe',
    registradoPor: 'rh-1',
    registradoPorNome: 'Ana Paula Ferreira',
    atestado: {
      cid: 'J11',
      diasAfastamento: 3,
      dataInicio: new Date('2023-08-20'),
      dataFim: new Date('2023-08-22'),
      medicoNome: 'Dr. Ricardo Santos',
      medicoCrm: '123456-SP',
    },
  },
  {
    id: 'evt-9',
    colaboradorId: '2',
    tipo: TipoEventoHistorico.FERIAS,
    data: new Date('2024-11-01'),
    descricao: 'Férias programadas',
    registradoPor: 'rh-1',
    registradoPorNome: 'Ana Paula Ferreira',
    ferias: {
      dataInicio: new Date('2024-11-01'),
      dataFim: new Date('2024-11-30'),
      diasCorridos: 30,
      periodoAquisitivo: '2023-2024',
    },
  },
  
  // Eventos do Pedro Souza Lima (id: 3) - DEMITIDO
  {
    id: 'evt-10',
    colaboradorId: '3',
    tipo: TipoEventoHistorico.ADMISSAO,
    data: new Date('2019-07-10'),
    descricao: 'Admissão como Assistente Administrativo',
    registradoPor: 'rh-1',
    registradoPorNome: 'Ana Paula Ferreira',
  },
  {
    id: 'evt-11',
    colaboradorId: '3',
    tipo: TipoEventoHistorico.ADVERTENCIA,
    data: new Date('2023-05-15'),
    descricao: 'Advertência por atrasos frequentes',
    registradoPor: 'rh-1',
    registradoPorNome: 'Ana Paula Ferreira',
    advertencia: {
      tipo: TipoAdvertencia.VERBAL,
      motivo: 'Atrasos recorrentes no período de 30 dias',
      gravidade: 'LEVE',
    },
  },
  {
    id: 'evt-12',
    colaboradorId: '3',
    tipo: TipoEventoHistorico.ADVERTENCIA,
    data: new Date('2024-03-20'),
    descricao: 'Advertência escrita por descumprimento de normas',
    registradoPor: 'rh-1',
    registradoPorNome: 'Ana Paula Ferreira',
    advertencia: {
      tipo: TipoAdvertencia.ESCRITA,
      motivo: 'Não seguir procedimentos de segurança',
      gravidade: 'MEDIA',
      testemunhas: ['Carlos Silva', 'Maria Santos'],
    },
  },
  {
    id: 'evt-13',
    colaboradorId: '3',
    tipo: TipoEventoHistorico.DEMISSAO,
    data: new Date('2024-10-30'),
    descricao: 'Desligamento da empresa',
    observacoes: 'Rescisão contratual por acordo entre as partes',
    registradoPor: 'rh-1',
    registradoPorNome: 'Ana Paula Ferreira',
    demissao: {
      motivoDemissao: 'Acordo entre as partes para nova oportunidade profissional',
      tipoDemissao: 'ACORDO',
      dataAviso: new Date('2024-10-15'),
    },
  },
  
  // Eventos da Ana Paula Ferreira (id: 4)
  {
    id: 'evt-14',
    colaboradorId: '4',
    tipo: TipoEventoHistorico.ADMISSAO,
    data: new Date('2017-05-05'),
    descricao: 'Admissão como Analista de RH',
    registradoPor: 'admin-1',
    registradoPorNome: 'Diretor Geral',
  },
  {
    id: 'evt-15',
    colaboradorId: '4',
    tipo: TipoEventoHistorico.PROMOCAO,
    data: new Date('2019-11-01'),
    descricao: 'Promoção para Coordenadora de RH',
    registradoPor: 'admin-1',
    registradoPorNome: 'Diretor Geral',
    promocao: {
      cargoAnterior: 'Analista de RH',
      cargoNovo: 'Coordenadora RH',
      salarioAnterior: 5500,
      salarioNovo: 7800,
    },
  },
  
  // Eventos do Carlos Eduardo Mendes (id: 5) - AFASTADO
  {
    id: 'evt-16',
    colaboradorId: '5',
    tipo: TipoEventoHistorico.ADMISSAO,
    data: new Date('2021-02-14'),
    descricao: 'Admissão como Operador de Produção',
    registradoPor: 'rh-1',
    registradoPorNome: 'Ana Paula Ferreira',
  },
  {
    id: 'evt-17',
    colaboradorId: '5',
    tipo: TipoEventoHistorico.ATESTADO,
    data: new Date('2024-10-15'),
    descricao: 'Atestado médico - Acidente de trabalho',
    registradoPor: 'rh-1',
    registradoPorNome: 'Ana Paula Ferreira',
    atestado: {
      cid: 'S61',
      diasAfastamento: 45,
      dataInicio: new Date('2024-10-15'),
      dataFim: new Date('2024-11-30'),
      medicoNome: 'Dra. Juliana Almeida',
      medicoCrm: '654321-SP',
    },
  },
  {
    id: 'evt-18',
    colaboradorId: '5',
    tipo: TipoEventoHistorico.AFASTAMENTO,
    data: new Date('2024-10-15'),
    descricao: 'Afastamento por acidente de trabalho',
    observacoes: 'CAT emitida. Acompanhamento pelo INSS.',
    registradoPor: 'rh-1',
    registradoPorNome: 'Ana Paula Ferreira',
  },
];

class ProntuarioServiceMock {
  // Buscar todos os colaboradores
  async getColaboradores(): Promise<Colaborador[]> {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return mockColaboradores;
  }

  // Buscar colaborador por ID
  async getColaboradorById(id: string): Promise<Colaborador | null> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return mockColaboradores.find((c) => c.id === id) || null;
  }

  // Buscar histórico de um colaborador
  async getHistoricoColaborador(colaboradorId: string): Promise<EventoHistorico[]> {
    await new Promise((resolve) => setTimeout(resolve, 400));
    return mockEventosHistorico
      .filter((e) => e.colaboradorId === colaboradorId)
      .sort((a, b) => b.data.getTime() - a.data.getTime());
  }

  // Adicionar evento ao histórico
  async adicionarEvento(evento: Omit<EventoHistorico, 'id'>): Promise<EventoHistorico> {
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    const novoEvento: EventoHistorico = {
      ...evento,
      id: `evt-${Date.now()}`,
    };
    
    mockEventosHistorico.push(novoEvento);
    return novoEvento;
  }

  // Atualizar status do colaborador
  async atualizarStatusColaborador(
    colaboradorId: string,
    status: StatusColaborador
  ): Promise<Colaborador | null> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    
    const colaborador = mockColaboradores.find((c) => c.id === colaboradorId);
    if (colaborador) {
      colaborador.status = status;
      return colaborador;
    }
    return null;
  }

  // Estatísticas gerais
  async getEstatisticas(): Promise<{
    totalColaboradores: number;
    ativos: number;
    afastados: number;
    ferias: number;
    demitidos: number;
  }> {
    await new Promise((resolve) => setTimeout(resolve, 200));
    
    return {
      totalColaboradores: mockColaboradores.length,
      ativos: mockColaboradores.filter((c) => c.status === StatusColaborador.ATIVO).length,
      afastados: mockColaboradores.filter((c) => c.status === StatusColaborador.AFASTADO).length,
      ferias: mockColaboradores.filter((c) => c.status === StatusColaborador.FERIAS).length,
      demitidos: mockColaboradores.filter((c) => c.status === StatusColaborador.DEMITIDO).length,
    };
  }
}

export default new ProntuarioServiceMock();
