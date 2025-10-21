import {
  ProntuarioColaborador,
  ExameMedico,
  AtestadoMedico,
  Ferias,
  Treinamento,
  Advertencia,
  StatusProntuario,
  PaginacaoParams,
  PaginacaoResultado,
  FiltrosProntuario,
} from '../types/prontuario';

// Nomes realistas para os colaboradores
const nomesMasculinos = [
  'João Silva Santos', 'Carlos Eduardo Oliveira', 'Pedro Henrique Costa',
  'Rafael Almeida Souza', 'Lucas Martins Ferreira', 'Bruno Pereira Lima',
  'Guilherme Santos Rocha', 'Fernando Costa Silva', 'Rodrigo Alves Santos',
  'Thiago Souza Oliveira', 'Gabriel Lima Costa', 'André Pereira Santos',
  'Marcelo Silva Ferreira', 'Ricardo Costa Almeida', 'Felipe Santos Lima',
];

const nomesFemininos = [
  'Maria Silva Santos', 'Ana Paula Oliveira', 'Juliana Costa Ferreira',
  'Fernanda Almeida Santos', 'Carla Souza Lima', 'Patricia Santos Costa',
  'Camila Oliveira Silva', 'Renata Ferreira Alves', 'Beatriz Costa Santos',
  'Amanda Lima Oliveira', 'Daniela Santos Ferreira', 'Larissa Costa Silva',
  'Mariana Almeida Santos', 'Priscila Oliveira Costa', 'Vanessa Santos Lima',
];

const cargos = [
  'Analista de RH', 'Assistente Administrativo', 'Coordenador de Produção',
  'Gerente de Operações', 'Diretor Comercial', 'Analista Financeiro',
  'Assistente de TI', 'Coordenador de Vendas', 'Gerente de Projetos',
  'Analista de Marketing', 'Supervisor de Logística', 'Técnico de Manutenção',
];

const departamentos = [
  'Recursos Humanos', 'Administrativo', 'Operacional', 'Comercial',
  'Financeiro', 'TI', 'Marketing', 'Logística', 'Produção',
];

const cidades = [
  'São Paulo - SP', 'Rio de Janeiro - RJ', 'Belo Horizonte - MG',
  'Curitiba - PR', 'Porto Alegre - RS', 'Salvador - BA',
  'Brasília - DF', 'Fortaleza - CE', 'Recife - PE',
];

const tiposExame: Array<'Admissional' | 'Periódico' | 'Demissional' | 'Retorno ao Trabalho' | 'Mudança de Função'> = [
  'Admissional', 'Periódico', 'Retorno ao Trabalho', 'Mudança de Função', 'Demissional',
];

const tiposTreinamento = [
  'Segurança do Trabalho', 'Gestão de Pessoas', 'Excel Avançado',
  'Liderança e Coaching', 'Comunicação Assertiva', 'Qualidade Total',
  'Atendimento ao Cliente', 'Vendas Consultivas', 'Gestão de Projetos',
  'Inovação e Criatividade', 'Trabalho em Equipe', 'Inteligência Emocional',
];

const instituicoes = [
  'FGS Academy', 'Tech Institute', 'Centro de Treinamento Profissional',
  'Escola de Negócios', 'Instituto de Desenvolvimento', 'Academia Corporativa',
];

// Gera um CPF mock baseado no ID
function gerarCPF(id: number): string {
  const base = String(id).padStart(9, '0');
  return `${base.slice(0, 3)}.${base.slice(3, 6)}.${base.slice(6, 9)}-${String(id % 100).padStart(2, '0')}`;
}

// Gera dados de prontuário para um colaborador específico
function gerarProntuarioMock(colaboradorId: string): ProntuarioColaborador {
  const id = parseInt(colaboradorId);
  const sexo = id % 2 === 0 ? 'M' : 'F';
  const nomes = sexo === 'M' ? nomesMasculinos : nomesFemininos;
  const nome = nomes[id % nomes.length];
  const cargo = cargos[id % cargos.length];
  const departamento = departamentos[id % departamentos.length];
  const cidade = cidades[id % cidades.length];

  // Dados Pessoais
  const anoNascimento = 1980 + (id % 30);
  const mesNascimento = (id % 12) + 1;
  const diaNascimento = (id % 28) + 1;
  const dataNascimento = `${anoNascimento}-${String(mesNascimento).padStart(2, '0')}-${String(diaNascimento).padStart(2, '0')}`;

  // Data de Admissão
  const anoAdmissao = 2020 + (id % 5);
  const mesAdmissao = (id % 12) + 1;
  const diaAdmissao = (id % 28) + 1;
  const dataAdmissao = `${anoAdmissao}-${String(mesAdmissao).padStart(2, '0')}-${String(diaAdmissao).padStart(2, '0')}`;

  // Exames Médicos (2-4 exames por colaborador)
  const numExames = 2 + (id % 3);
  const examesMedicos: ExameMedico[] = [];
  
  for (let i = 0; i < numExames; i++) {
    const dataExame = new Date(anoAdmissao + i, mesAdmissao - 1, diaAdmissao);
    const dataValidade = new Date(dataExame);
    dataValidade.setFullYear(dataValidade.getFullYear() + 1);
    
    const hoje = new Date();
    let status: StatusProntuario;
    if (dataValidade < hoje) {
      status = StatusProntuario.VENCIDO;
    } else if (dataValidade < new Date(hoje.setMonth(hoje.getMonth() + 2))) {
      status = StatusProntuario.PENDENTE;
    } else {
      status = StatusProntuario.APROVADO;
    }

    examesMedicos.push({
      id: `${colaboradorId}-exam-${i + 1}`,
      colaboradorId,
      tipo: tiposExame[i % tiposExame.length],
      dataRealizacao: dataExame.toISOString().split('T')[0],
      dataValidade: dataValidade.toISOString().split('T')[0],
      resultado: 'Apto',
      status,
      medico: `Dr. ${sexo === 'M' ? 'Carlos' : 'Ana'} ${['Silva', 'Oliveira', 'Santos'][i % 3]}`,
      crm: `${123456 + i}-SP`,
      observacoes: status === StatusProntuario.VENCIDO ? 'Necessita renovação urgente' : undefined,
    });
  }

  // Treinamentos (2-5 treinamentos por colaborador)
  const numTreinamentos = 2 + (id % 4);
  const treinamentos: Treinamento[] = [];
  
  for (let i = 0; i < numTreinamentos; i++) {
    const dataInicio = new Date(anoAdmissao + i, (id + i) % 12, 1);
    const dataFim = new Date(dataInicio);
    dataFim.setDate(dataFim.getDate() + 10 + (i * 5));
    
    const temValidade = i % 2 === 0;
    let status: StatusProntuario;
    
    if (temValidade) {
      const validade = new Date(dataFim);
      validade.setFullYear(validade.getFullYear() + 1);
      
      const hoje = new Date();
      if (validade < hoje) {
        status = StatusProntuario.VENCIDO;
      } else if (validade < new Date(hoje.setMonth(hoje.getMonth() + 2))) {
        status = StatusProntuario.PENDENTE;
      } else {
        status = StatusProntuario.APROVADO;
      }
    } else {
      status = StatusProntuario.APROVADO;
    }

    treinamentos.push({
      id: `${colaboradorId}-train-${i + 1}`,
      colaboradorId,
      titulo: tiposTreinamento[i % tiposTreinamento.length],
      descricao: `Treinamento completo sobre ${tiposTreinamento[i % tiposTreinamento.length]}`,
      dataInicio: dataInicio.toISOString().split('T')[0],
      dataFim: dataFim.toISOString().split('T')[0],
      cargaHoraria: 20 + (i * 10),
      instrutor: `${['Maria', 'Pedro', 'Ana', 'Carlos'][i % 4]} Instrutor`,
      instituicao: instituicoes[i % instituicoes.length],
      status,
      nota: 7 + (id % 4),
    });
  }

  // Atestados (0-2 atestados)
  const atestados: AtestadoMedico[] = [];
  if (id % 3 === 0) {
    const dataAtestado = new Date(anoAdmissao + 1, 5, 10);
    atestados.push({
      id: `${colaboradorId}-atestado-1`,
      colaboradorId,
      dataEmissao: dataAtestado.toISOString().split('T')[0],
      dataInicio: dataAtestado.toISOString().split('T')[0],
      dataFim: new Date(dataAtestado.setDate(dataAtestado.getDate() + 2)).toISOString().split('T')[0],
      diasAfastamento: 3,
      medico: 'Dra. Ana Paula Silva',
      crm: '789012-SP',
      cid: 'J00',
      observacoes: 'Resfriado comum',
      status: StatusProntuario.APROVADO,
    });
  }

  // Férias
  const ferias: Ferias[] = [
    {
      id: `${colaboradorId}-ferias-1`,
      colaboradorId,
      periodoAquisitivo: {
        inicio: dataAdmissao,
        fim: new Date(new Date(dataAdmissao).setFullYear(new Date(dataAdmissao).getFullYear() + 1)).toISOString().split('T')[0],
      },
      diasDireito: 30,
      diasGozados: 30,
      diasRestantes: 0,
      dataInicio: new Date(anoAdmissao + 1, 0, 10).toISOString().split('T')[0],
      dataFim: new Date(anoAdmissao + 1, 1, 8).toISOString().split('T')[0],
      tipo: 'Integral',
      status: StatusProntuario.APROVADO,
    },
  ];

  // Advertências (0-2 advertências)
  const advertencias: Advertencia[] = [];
  if (id % 5 === 0) {
    advertencias.push({
      id: `${colaboradorId}-adv-1`,
      colaboradorId,
      tipo: 'Verbal',
      data: new Date(anoAdmissao + 1, 3, 15).toISOString().split('T')[0],
      motivo: 'Atraso reiterado',
      descricao: 'Colaborador chegou atrasado 3 vezes no mês sem justificativa',
      aplicadoPor: 'Gerente Direto',
      status: StatusProntuario.APROVADO,
    });
  }

  return {
    id: colaboradorId,
    colaboradorId,
    dadosPessoais: {
      id: `dp-${colaboradorId}`,
      nome,
      cpf: gerarCPF(id),
      rg: `${String(id * 123456).slice(0, 2)}.${String(id * 123456).slice(2, 5)}.${String(id * 123456).slice(5, 8)}-${id % 10}`,
      dataNascimento,
      sexo,
      estadoCivil: ['Solteiro(a)', 'Casado(a)', 'Divorciado(a)'][id % 3],
      nacionalidade: 'Brasileira',
      naturalidade: cidade,
      nomeMae: `Maria ${nome.split(' ')[nome.split(' ').length - 1]}`,
      nomePai: `José ${nome.split(' ')[nome.split(' ').length - 1]}`,
      telefone: `(11) ${3000 + (id % 9000)}-${String(id).padStart(4, '0')}`,
      celular: `(11) 9${8000 + (id % 2000)}-${String(id).padStart(4, '0')}`,
      email: `${nome.toLowerCase().replace(/\s+/g, '.')}.${id}@fgs.com`,
      endereco: {
        cep: `${String(1000 + (id % 9000)).padStart(5, '0')}-${String(id % 1000).padStart(3, '0')}`,
        logradouro: `Rua ${['das Flores', 'dos Pinheiros', 'das Acácias', 'Principal'][id % 4]}`,
        numero: String(100 + (id * 10)),
        complemento: id % 3 === 0 ? `Apto ${id % 100}` : undefined,
        bairro: ['Centro', 'Jardim América', 'Vila Nova', 'Bela Vista'][id % 4],
        cidade: cidade.split(' - ')[0],
        estado: cidade.split(' - ')[1],
      },
    },
    dadosContratuais: {
      id: `dc-${colaboradorId}`,
      colaboradorId,
      dataAdmissao,
      cargo,
      departamento,
      salario: 3000 + (id * 500) + ((id % 5) * 1000),
      tipoContrato: ['CLT', 'PJ'][id % 2] as 'CLT' | 'PJ',
      jornadaTrabalho: id % 2 === 0 ? '44h semanais' : '40h semanais',
      horarioEntrada: id % 2 === 0 ? '08:00' : '09:00',
      horarioSaida: id % 2 === 0 ? '17:00' : '18:00',
      status: StatusProntuario.APROVADO,
    },
    examesMedicos,
    atestados,
    ferias,
    frequencia: [],
    advertencias,
    treinamentos,
    ultimaAtualizacao: new Date().toISOString(),
  };
}

// Cache de prontuários gerados
const prontuariosCache = new Map<string, ProntuarioColaborador>();

class ProntuarioServiceMock {
  async buscarProntuario(colaboradorId: string): Promise<ProntuarioColaborador> {
    await this.delay(500);
    
    if (!prontuariosCache.has(colaboradorId)) {
      prontuariosCache.set(colaboradorId, gerarProntuarioMock(colaboradorId));
    }
    
    return prontuariosCache.get(colaboradorId)!;
  }

  async buscarExames(
    colaboradorId: string,
    pagina: number,
    itensPorPagina: number,
    status?: StatusProntuario[],
    busca?: string
  ): Promise<{ dados: ExameMedico[]; total: number }> {
    await this.delay(300);
    
    const prontuario = await this.buscarProntuario(colaboradorId);
    let dados = [...prontuario.examesMedicos];

    // Aplicar filtros
    if (status && status.length > 0) {
      dados = dados.filter((e) => status.includes(e.status));
    }

    if (busca) {
      dados = dados.filter((e) =>
        e.tipo.toLowerCase().includes(busca.toLowerCase()) ||
        e.medico?.toLowerCase().includes(busca.toLowerCase())
      );
    }

    const total = dados.length;
    const inicio = pagina * itensPorPagina;
    const fim = inicio + itensPorPagina;

    return {
      dados: dados.slice(inicio, fim),
      total,
    };
  }

  async buscarTreinamentos(
    colaboradorId: string,
    pagina: number,
    itensPorPagina: number,
    status?: StatusProntuario[],
    busca?: string
  ): Promise<{ dados: Treinamento[]; total: number }> {
    await this.delay(300);
    
    const prontuario = await this.buscarProntuario(colaboradorId);
    let dados = [...prontuario.treinamentos];

    if (status && status.length > 0) {
      dados = dados.filter((t) => status.includes(t.status));
    }

    if (busca) {
      dados = dados.filter((t) =>
        t.titulo?.toLowerCase().includes(busca.toLowerCase())
      );
    }

    const total = dados.length;
    const inicio = pagina * itensPorPagina;
    const fim = inicio + itensPorPagina;

    return {
      dados: dados.slice(inicio, fim),
      total,
    };
  }

  async listarExames(
    colaboradorId: string,
    params: PaginacaoParams,
    filtros?: FiltrosProntuario
  ): Promise<PaginacaoResultado<ExameMedico>> {
    const resultado = await this.buscarExames(
      colaboradorId,
      params.pagina,
      params.itensPorPagina,
      filtros?.status,
      filtros?.busca
    );

    return {
      dados: resultado.dados,
      total: resultado.total,
      pagina: params.pagina,
      totalPaginas: Math.ceil(resultado.total / params.itensPorPagina),
    };
  }

  async listarTreinamentos(
    colaboradorId: string,
    params: PaginacaoParams,
    filtros?: FiltrosProntuario
  ): Promise<PaginacaoResultado<Treinamento>> {
    const resultado = await this.buscarTreinamentos(
      colaboradorId,
      params.pagina,
      params.itensPorPagina,
      filtros?.status,
      filtros?.busca
    );

    return {
      dados: resultado.dados,
      total: resultado.total,
      pagina: params.pagina,
      totalPaginas: Math.ceil(resultado.total / params.itensPorPagina),
    };
  }

  async listarAtestados(
    colaboradorId: string,
    params: PaginacaoParams,
    filtros?: FiltrosProntuario
  ): Promise<PaginacaoResultado<AtestadoMedico>> {
    await this.delay(300);
    
    const prontuario = await this.buscarProntuario(colaboradorId);
    let dados = [...prontuario.atestados];

    if (filtros?.status && filtros.status.length > 0) {
      dados = dados.filter((a) => filtros.status!.includes(a.status));
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

  async listarFerias(colaboradorId: string): Promise<Ferias[]> {
    await this.delay(300);
    const prontuario = await this.buscarProntuario(colaboradorId);
    return prontuario.ferias;
  }

  async listarAdvertencias(colaboradorId: string): Promise<Advertencia[]> {
    await this.delay(300);
    const prontuario = await this.buscarProntuario(colaboradorId);
    return prontuario.advertencias;
  }

  async atualizarDadosPessoais(colaboradorId: string, dados: any): Promise<void> {
    await this.delay(500);
    console.log('Dados pessoais atualizados:', dados);
    
    // Atualiza o cache
    if (prontuariosCache.has(colaboradorId)) {
      const prontuario = prontuariosCache.get(colaboradorId)!;
      prontuario.dadosPessoais = { ...prontuario.dadosPessoais, ...dados };
      prontuario.ultimaAtualizacao = new Date().toISOString();
    }
  }

  async atualizarDadosContratuais(colaboradorId: string, dados: any): Promise<void> {
    await this.delay(500);
    console.log('Dados contratuais atualizados:', dados);
    
    if (prontuariosCache.has(colaboradorId)) {
      const prontuario = prontuariosCache.get(colaboradorId)!;
      prontuario.dadosContratuais = { ...prontuario.dadosContratuais, ...dados };
      prontuario.ultimaAtualizacao = new Date().toISOString();
    }
  }

  async criarExame(colaboradorId: string, exame: Partial<ExameMedico>): Promise<ExameMedico> {
    await this.delay(500);
    
    const novoExame: ExameMedico = {
      ...exame,
      id: `${colaboradorId}-exam-${Date.now()}`,
      colaboradorId,
      status: StatusProntuario.PENDENTE,
    } as ExameMedico;

    if (prontuariosCache.has(colaboradorId)) {
      const prontuario = prontuariosCache.get(colaboradorId)!;
      prontuario.examesMedicos.push(novoExame);
      prontuario.ultimaAtualizacao = new Date().toISOString();
    }

    return novoExame;
  }

  async atualizarExame(exameId: string, exame: Partial<ExameMedico>): Promise<void> {
    await this.delay(500);
    console.log('Exame atualizado:', exameId, exame);
  }

  async excluirExame(exameId: string): Promise<void> {
    await this.delay(300);
    console.log('Exame excluído:', exameId);
  }

  async criarTreinamento(
    colaboradorId: string,
    treinamento: Partial<Treinamento>
  ): Promise<Treinamento> {
    await this.delay(500);
    
    const novoTreinamento: Treinamento = {
      ...treinamento,
      id: `${colaboradorId}-train-${Date.now()}`,
      colaboradorId,
      status: StatusProntuario.PENDENTE,
    } as Treinamento;

    if (prontuariosCache.has(colaboradorId)) {
      const prontuario = prontuariosCache.get(colaboradorId)!;
      prontuario.treinamentos.push(novoTreinamento);
      prontuario.ultimaAtualizacao = new Date().toISOString();
    }

    return novoTreinamento;
  }

  async atualizarTreinamento(treinamentoId: string, treinamento: Partial<Treinamento>): Promise<void> {
    await this.delay(500);
    console.log('Treinamento atualizado:', treinamentoId, treinamento);
  }

  async excluirTreinamento(treinamentoId: string): Promise<void> {
    await this.delay(300);
    console.log('Treinamento excluído:', treinamentoId);
  }

  async uploadArquivo(colaboradorId: string, tipo: string, file: File): Promise<string> {
    await this.delay(1000);
    return `https://example.com/uploads/${colaboradorId}/${tipo}/${file.name}`;
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

export default new ProntuarioServiceMock();
