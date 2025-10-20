import {
  Comunicado,
  EstatisticasComunicacao,
  TipoComunicado,
  PrioridadeComunicado,
  StatusComunicado,
  CategoriaComunicado,
  CanalNotificacao,
} from '../types/comunicacao';

// Dados mock
const comunicadosMock: Comunicado[] = [
  {
    id: '1',
    titulo: 'Novo Plano de Saúde Disponível',
    conteudo: 'Estamos felizes em anunciar um novo plano de saúde com cobertura ampliada para todos os colaboradores. O novo plano inclui consultas ilimitadas, exames laboratoriais e cobertura internacional.',
    categoria: CategoriaComunicado.BENEFICIOS,
    prioridade: PrioridadeComunicado.ALTA,
    tipo: TipoComunicado.GERAL,
    destinatarios: { todos: true },
    canais: [CanalNotificacao.APP, CanalNotificacao.EMAIL],
    dataEnvio: '2024-10-18',
    envioImediato: false,
    anexos: [],
    exigeLeitura: true,
    prazoDias: 7,
    status: StatusComunicado.ENVIADO,
    totalDestinatarios: 245,
    totalEnviados: 245,
    totalLidos: 198,
    totalConfirmados: 165,
    criadoPor: 'Admin RH',
    criadoEm: '2024-10-17T10:00:00',
    enviadoEm: '2024-10-18T08:00:00',
  },
  {
    id: '2',
    titulo: 'Treinamento de Segurança - Obrigatório',
    conteudo: 'Todos os colaboradores devem participar do treinamento de segurança no trabalho. O treinamento será realizado online na próxima semana.',
    categoria: CategoriaComunicado.TREINAMENTO,
    prioridade: PrioridadeComunicado.URGENTE,
    tipo: TipoComunicado.SETOR,
    destinatarios: { setores: ['TI', 'Operações'] },
    canais: [CanalNotificacao.APP, CanalNotificacao.EMAIL, CanalNotificacao.WHATSAPP],
    dataEnvio: '2024-10-19',
    envioImediato: true,
    anexos: [],
    exigeLeitura: true,
    prazoDias: 3,
    status: StatusComunicado.AGENDADO,
    totalDestinatarios: 85,
    totalEnviados: 0,
    totalLidos: 0,
    totalConfirmados: 0,
    criadoPor: 'Gestor Segurança',
    criadoEm: '2024-10-19T09:00:00',
  },
];

class ComunicacaoServiceMock {
  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  // COMUNICADOS
  async listarComunicados(): Promise<Comunicado[]> {
    await this.delay(300);
    return comunicadosMock;
  }

  async buscarComunicado(id: string): Promise<Comunicado | null> {
    await this.delay(200);
    return comunicadosMock.find(c => c.id === id) || null;
  }

  async criarComunicado(comunicado: Partial<Comunicado>): Promise<Comunicado> {
    await this.delay(400);
    const novo: Comunicado = {
      ...comunicado,
      id: Date.now().toString(),
      criadoEm: new Date().toISOString(),
      totalDestinatarios: 245,
      totalEnviados: 0,
      totalLidos: 0,
      totalConfirmados: 0,
    } as Comunicado;
    
    comunicadosMock.push(novo);
    return novo;
  }

  async atualizarComunicado(id: string, comunicado: Partial<Comunicado>): Promise<Comunicado> {
    await this.delay(400);
    const index = comunicadosMock.findIndex(c => c.id === id);
    if (index >= 0) {
      comunicadosMock[index] = { ...comunicadosMock[index], ...comunicado };
      return comunicadosMock[index];
    }
    throw new Error('Comunicado não encontrado');
  }

  async deletarComunicado(id: string): Promise<void> {
    await this.delay(300);
    const index = comunicadosMock.findIndex(c => c.id === id);
    if (index >= 0) {
      comunicadosMock.splice(index, 1);
    }
  }

  async enviarComunicado(id: string): Promise<Comunicado> {
    await this.delay(1000);
    const comunicado = comunicadosMock.find(c => c.id === id);
    if (comunicado) {
      comunicado.status = StatusComunicado.ENVIADO;
      comunicado.enviadoEm = new Date().toISOString();
      comunicado.totalEnviados = comunicado.totalDestinatarios;
      return comunicado;
    }
    throw new Error('Comunicado não encontrado');
  }

  // ESTATÍSTICAS
  async buscarEstatisticas(): Promise<EstatisticasComunicacao> {
    await this.delay(500);
    
    return {
      totalComunicados: 12,
      totalEnviadosHoje: 3,
      totalAgendados: 2,
      totalDestinatariosAtivos: 245,
      taxaLeituraGeral: 81,
      taxaConfirmacaoGeral: 67,
      porCanal: [
        {
          canal: CanalNotificacao.APP,
          totalEnviados: 350,
          totalEntregues: 345,
          totalAbertos: 298,
          taxaEntrega: 98.6,
          taxaAbertura: 86.4,
        },
        {
          canal: CanalNotificacao.EMAIL,
          totalEnviados: 350,
          totalEntregues: 342,
          totalAbertos: 275,
          taxaEntrega: 97.7,
          taxaAbertura: 80.4,
        },
        {
          canal: CanalNotificacao.WHATSAPP,
          totalEnviados: 150,
          totalEntregues: 148,
          totalAbertos: 142,
          taxaEntrega: 98.7,
          taxaAbertura: 95.9,
        },
      ],
      porCategoria: [
        { categoria: CategoriaComunicado.INFORMATIVO, quantidade: 5, percentual: 42 },
        { categoria: CategoriaComunicado.RH, quantidade: 3, percentual: 25 },
        { categoria: CategoriaComunicado.BENEFICIOS, quantidade: 2, percentual: 17 },
        { categoria: CategoriaComunicado.TREINAMENTO, quantidade: 2, percentual: 17 },
      ],
      ultimosComunicados: comunicadosMock.slice(0, 5),
      comunicadosNaoLidos: 47,
      comunicadosPendenteConfirmacao: 80,
    };
  }
}

export default new ComunicacaoServiceMock();

