import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Card,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Alert,
  TextField,
  MenuItem,
  Chip,
  Button,
  IconButton,
  Tooltip,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import AssignmentIcon from '@mui/icons-material/Assignment';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigationLog } from '../hooks/useNavigationLog';
import { TabelaPaginada, Coluna } from '../components/TabelaPaginada';
import { FiltrosTabela } from '../components/FiltrosTabela';
import { StatusChip } from '../components/StatusChip';
import { TipoTreinamentoForm } from '../components/treinamentos/TipoTreinamentoForm';
import { ImportacaoCSV } from '../components/treinamentos/ImportacaoCSV';
import { AgendamentoMassa } from '../components/treinamentos/AgendamentoMassa';
import { AlertasVencimento } from '../components/treinamentos/AlertasVencimento';
import { TipoTreinamento, TreinamentoColaborador, StatusTreinamento, AlertaTreinamento } from '../types/treinamentos';
import { formatarData } from '../utils/statusUtils';
import { getStatusColor, getStatusNome } from '../utils/treinamentosUtils';
import treinamentosService from '../services/treinamentosService';
import colaboradoresService from '../services/colaboradoresService';
import { PageHeader, GradientButton, AnimatedCard, ActionButton } from '../components';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index } = props;
  return (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

export const Treinamentos: React.FC = () => {
  useNavigationLog();

  const [tabAtual, setTabAtual] = useState(0);
  const [loading, setLoading] = useState(false);

  // Estados - Tipos de Treinamento
  const [tiposTreinamento, setTiposTreinamento] = useState<TipoTreinamento[]>([]);
  const [dialogTipoAberto, setDialogTipoAberto] = useState(false);
  const [tipoAtual, setTipoAtual] = useState<Partial<TipoTreinamento>>({});

  // Estados - Treinamentos
  const [treinamentos, setTreinamentos] = useState<TreinamentoColaborador[]>([]);
  const [paginaTreinamentos, setPaginaTreinamentos] = useState(0);
  const [itensPorPagina, setItensPorPagina] = useState(10);
  const [totalTreinamentos, setTotalTreinamentos] = useState(0);
  const [filtroStatus, setFiltroStatus] = useState<StatusTreinamento[]>([]);
  const [busca, setBusca] = useState('');
  const [dialogTreinamentoAberto, setDialogTreinamentoAberto] = useState(false);
  const [treinamentoAtual, setTreinamentoAtual] = useState<Partial<TreinamentoColaborador>>({});
  
  // Estados - Colaboradores (para o formulário)
  const [colaboradores, setColaboradores] = useState<any[]>([]);

  // Estados - Importação e Agendamento
  const [dialogImportacaoAberto, setDialogImportacaoAberto] = useState(false);
  const [dialogAgendamentoAberto, setDialogAgendamentoAberto] = useState(false);
  
  // Estados - Agendamentos
  const [agendamentos, setAgendamentos] = useState<any[]>([]);
  const [paginaAgendamentos, setPaginaAgendamentos] = useState(0);
  const [itensPorPaginaAgendamentos, setItensPorPaginaAgendamentos] = useState(10);
  const [totalAgendamentos, setTotalAgendamentos] = useState(0);
  const [filtroStatusAgendamento, setFiltroStatusAgendamento] = useState<string[]>([]);
  const [buscaAgendamentos, setBuscaAgendamentos] = useState('');

  // Estados - Alertas
  const [alertas, setAlertas] = useState<AlertaTreinamento[]>([]);
  
  // Estados - Estatísticas (Relatórios)
  const [estatisticas, setEstatisticas] = useState({
    totalTreinamentos: 0,
    totalTurmas: 0,
    totalColaboradoresTreinados: 0,
    treinamentosVencendo: 0,
    treinamentosVencidos: 0,
    treinamentosAtivos: 0, // Tipos de treinamento ativos
  });

  useEffect(() => {
    carregarTipos();
    carregarAlertas();
  }, []);

  useEffect(() => {
    if (tabAtual === 1) carregarTreinamentos();
    if (tabAtual === 2) carregarAgendamentos();
    if (tabAtual === 4) carregarEstatisticas();
  }, [tabAtual, paginaTreinamentos, itensPorPagina, filtroStatus, busca, paginaAgendamentos, itensPorPaginaAgendamentos, filtroStatusAgendamento, buscaAgendamentos]);

  const carregarTipos = async () => {
    try {
      const dados = await treinamentosService.listarTipos();
      setTiposTreinamento(Array.isArray(dados) ? dados : []);
    } catch (error) {
      console.error('Erro ao carregar tipos:', error);
      setTiposTreinamento([]);
    }
  };

  const carregarTreinamentos = async () => {
    try {
      const resultado = await treinamentosService.listarTreinamentos(
        { pagina: paginaTreinamentos, itensPorPagina },
        { status: filtroStatus, busca }
      );
      // Garantir que sempre seja array
      setTreinamentos(Array.isArray(resultado?.dados) ? resultado.dados : []);
      setTotalTreinamentos(resultado?.total || 0);
    } catch (error) {
      console.error('Erro ao carregar treinamentos:', error);
      // Em caso de erro, inicializar com array vazio
      setTreinamentos([]);
      setTotalTreinamentos(0);
    }
  };

  const carregarAlertas = async () => {
    try {
      const dados = await treinamentosService.listarAlertas();
      // listarAlertas retorna objeto {vencendo, vencidos}, não array
      setAlertas([]);
    } catch (error) {
      console.error('Erro ao carregar alertas:', error);
      setAlertas([]);
    }
  };

  const carregarEstatisticas = async () => {
    try {
      // Buscar estatísticas do backend
      const stats = await treinamentosService.getEstatisticas();
      
      // Buscar tipos de treinamento ativos
      const tipos = await treinamentosService.getAll();
      const tiposAtivos = tipos.filter(t => t.ativo !== false);
      
      // Buscar treinamentos realizados para calcular vencidos
      const treinamentosRealizados = await treinamentosService.getColaboradorTreinamentos();
      const hoje = new Date();
      hoje.setHours(0, 0, 0, 0);
      
      const vencidos = treinamentosRealizados.filter((t: any) => {
        if (!t.data_validade) return false;
        const dataValidade = new Date(t.data_validade);
        dataValidade.setHours(0, 0, 0, 0);
        return dataValidade < hoje;
      });
      
      const vencendo = treinamentosRealizados.filter((t: any) => {
        if (!t.data_validade) return false;
        const dataValidade = new Date(t.data_validade);
        dataValidade.setHours(0, 0, 0, 0);
        const diasRestantes = Math.ceil((dataValidade.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24));
        return diasRestantes > 0 && diasRestantes <= 30;
      });

      // Buscar total de turmas
      const turmas = await treinamentosService.getTurmas();

      setEstatisticas({
        totalTreinamentos: stats.totalTreinamentos || tipos.length,
        totalTurmas: stats.totalTurmas || turmas.length,
        totalColaboradoresTreinados: stats.totalColaboradoresTreinados || stats.totalRealizados || 0,
        treinamentosVencendo: stats.treinamentosVencendo || vencendo.length,
        treinamentosVencidos: stats.treinamentosVencidos || vencidos.length,
        treinamentosAtivos: tiposAtivos.length,
      });
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
      // Manter valores padrão em caso de erro
    }
  };

  const carregarAgendamentos = async () => {
    try {
      setLoading(true);
      
      // Buscar turmas (agendamentos) reais do backend
      const turmas = await treinamentosService.getTurmas();
      const turmasArray = Array.isArray(turmas) ? turmas : [];

      // Mapear turmas para formato de agendamento
      const agendamentosReais = turmasArray.map((turma: any) => ({
        id: turma.id,
        tipoTreinamento: turma.treinamento_titulo || turma.treinamento_nome || '-',
        dataAgendamento: turma.data_inicio || turma.data_inicio,
        horario: turma.horario || '-',
        local: turma.local || '-',
        instrutor: turma.instrutor || '-',
        totalVagas: turma.vagas || 0,
        vagasOcupadas: turma.vagas_ocupadas || 0,
        status: turma.status || 'ABERTA',
        colaboradores: turma.colaboradores || 0,
        dataFim: turma.data_fim,
        codigo: turma.codigo,
      }));

      // Aplicar filtros
      let agendamentosFiltrados = agendamentosReais;

      if (buscaAgendamentos) {
        agendamentosFiltrados = agendamentosFiltrados.filter(
          a => (a.tipoTreinamento?.toLowerCase() || '').includes(buscaAgendamentos.toLowerCase()) ||
               (a.instrutor?.toLowerCase() || '').includes(buscaAgendamentos.toLowerCase()) ||
               (a.local?.toLowerCase() || '').includes(buscaAgendamentos.toLowerCase())
        );
      }

      if (filtroStatusAgendamento.length > 0) {
        agendamentosFiltrados = agendamentosFiltrados.filter(
          a => filtroStatusAgendamento.includes(a.status)
        );
      }

      // Paginação
      const inicio = paginaAgendamentos * itensPorPaginaAgendamentos;
      const fim = inicio + itensPorPaginaAgendamentos;
      const agendamentosPaginados = agendamentosFiltrados.slice(inicio, fim);

      setAgendamentos(agendamentosPaginados);
      setTotalAgendamentos(agendamentosFiltrados.length);
    } catch (error) {
      console.error('Erro ao carregar agendamentos:', error);
      // Em caso de erro, inicializar com array vazio
      setAgendamentos([]);
      setTotalAgendamentos(0);
    } finally {
      setLoading(false);
    }
  };

  const handleSalvarTipo = async () => {
    try {
      setLoading(true);
      if (tipoAtual.id) {
        await treinamentosService.atualizarTipo(tipoAtual.id, tipoAtual);
      } else {
        await treinamentosService.criarTipo(tipoAtual);
      }
      setDialogTipoAberto(false);
      setTipoAtual({});
      carregarTipos();
    } catch (error: any) {
      console.error('Erro ao salvar tipo:', error);
      alert(error.message || 'Erro ao salvar tipo de treinamento');
    } finally {
      setLoading(false);
    }
  };

  const handleEditarTipo = async (tipo: TipoTreinamento) => {
    try {
      // Buscar dados completos do treinamento
      const treinamentoCompleto = await treinamentosService.getById(tipo.id);
      
      // Mapear dados do backend para o formato do formulário
      setTipoAtual({
        id: treinamentoCompleto.id,
        nome: treinamentoCompleto.nome || treinamentoCompleto.titulo,
        descricao: treinamentoCompleto.descricao,
        categoria: treinamentoCompleto.categoria,
        cargaHoraria: treinamentoCompleto.cargaHoraria || treinamentoCompleto.carga_horaria,
        validadeDias: treinamentoCompleto.validadeDias || treinamentoCompleto.validade_dias,
        obrigatorio: treinamentoCompleto.obrigatorio,
        nr: treinamentoCompleto.nr,
        modalidade: treinamentoCompleto.modalidade,
        local: treinamentoCompleto.local,
        instrutor: treinamentoCompleto.instrutor,
        instituicao: treinamentoCompleto.instituicao,
        ativo: treinamentoCompleto.ativo,
      });
      
      setDialogTipoAberto(true);
    } catch (error: any) {
      console.error('Erro ao carregar tipo para edição:', error);
      alert(error.message || 'Erro ao carregar tipo de treinamento');
    }
  };

  const handleExcluirTipo = async (tipo: TipoTreinamento) => {
    if (!window.confirm(`Tem certeza que deseja excluir o tipo de treinamento "${tipo.nome || tipo.titulo}"?\n\nEsta ação não pode ser desfeita.`)) {
      return;
    }

    try {
      setLoading(true);
      await treinamentosService.deletarTipo(tipo.id);
      carregarTipos();
      alert('Tipo de treinamento excluído com sucesso!');
    } catch (error: any) {
      console.error('Erro ao excluir tipo:', error);
      alert(error.message || 'Erro ao excluir tipo de treinamento');
    } finally {
      setLoading(false);
    }
  };

  const carregarColaboradores = async () => {
    try {
      const resultado = await colaboradoresService.getAll({ status: 'ATIVO' });
      setColaboradores(Array.isArray(resultado.data) ? resultado.data : []);
    } catch (error) {
      console.error('Erro ao carregar colaboradores:', error);
      setColaboradores([]);
    }
  };

  const handleSalvarTreinamento = async () => {
    try {
      setLoading(true);
      
      // Validação básica
      const dataRealizacao = treinamentoAtual.data_realizacao || treinamentoAtual.data_conclusao;
      if (!treinamentoAtual.colaborador_id || !treinamentoAtual.treinamento_id || !dataRealizacao) {
        alert('Preencha todos os campos obrigatórios: Colaborador, Tipo de Treinamento e Data de Realização');
        return;
      }

      // Preparar dados para vincular
      const dadosVinculo = {
        colaborador_id: treinamentoAtual.colaborador_id,
        treinamento_id: treinamentoAtual.treinamento_id,
        data_realizacao: dataRealizacao,
        data_validade: treinamentoAtual.data_validade || null,
        status: treinamentoAtual.status || 'CONCLUIDO',
        nota: treinamentoAtual.nota || null,
        observacoes: treinamentoAtual.observacoes || null,
      };

      if (treinamentoAtual.id) {
        // Atualizar vínculo existente
        await treinamentosService.updateVinculo(treinamentoAtual.id, dadosVinculo);
      } else {
        // Criar novo vínculo
        await treinamentosService.vincularColaborador(dadosVinculo);
      }
      
      setDialogTreinamentoAberto(false);
      setTreinamentoAtual({});
      carregarTreinamentos();
    } catch (error: any) {
      console.error('Erro ao salvar treinamento:', error);
      alert(error.message || 'Erro ao salvar treinamento');
    } finally {
      setLoading(false);
    }
  };

  const handleImportar = async (dados: any[]) => {
    await treinamentosService.importarCSV(dados);
    setDialogImportacaoAberto(false);
    carregarTreinamentos();
  };

  const handleAgendar = async (agendamento: any) => {
    await treinamentosService.criarAgendamento(agendamento);
    setDialogAgendamentoAberto(false);
  };

  const colunasTipos: Coluna<TipoTreinamento>[] = [
    { id: 'nome', label: 'Nome', minWidth: 200, sortable: true },
    { id: 'categoria', label: 'Categoria', minWidth: 150, format: (v) => v || '-' },
    { id: 'cargaHoraria', label: 'Carga Horária', minWidth: 100, format: (v) => v ? `${v}h` : '-' },
    { id: 'validadeDias', label: 'Validade', minWidth: 100, format: (v) => v === 0 ? 'Permanente' : v ? `${v} dias` : '-' },
    { id: 'obrigatorio', label: 'Obrigatório', minWidth: 100, format: (v) => v ? 'Sim' : 'Não' },
    {
      id: 'actions',
      label: 'Ações',
      minWidth: 120,
      align: 'center',
      format: (_, row) => (
        <Box display="flex" gap={1} justifyContent="center">
          <Tooltip title="Editar">
            <IconButton
              size="small"
              color="primary"
              onClick={() => handleEditarTipo(row)}
              disabled={loading}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Excluir">
            <IconButton
              size="small"
              color="error"
              onClick={() => handleExcluirTipo(row)}
              disabled={loading}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  const colunasTreinamentos: Coluna<TreinamentoColaborador>[] = [
    { id: 'colaboradorNome', label: 'Colaborador', minWidth: 150, sortable: true },
    { id: 'tipoTreinamentoNome', label: 'Treinamento', minWidth: 150 },
    { id: 'dataRealizacao', label: 'Realização', minWidth: 100, format: (v) => formatarData(v) },
    { id: 'dataValidade', label: 'Validade', minWidth: 100, format: (v) => v ? formatarData(v) : 'Permanente' },
    { id: 'status', label: 'Status', minWidth: 100, format: (v) => <StatusChip status={v} /> },
  ];

  const colunasAgendamentos: Coluna<any>[] = [
    { 
      id: 'tipoTreinamento', 
      label: 'Treinamento', 
      minWidth: 150, 
      sortable: true,
      format: (v) => (
        <Box>
          <Typography variant="body2" fontWeight={600}>{v}</Typography>
        </Box>
      )
    },
    { 
      id: 'dataAgendamento', 
      label: 'Data', 
      minWidth: 100, 
      format: (v) => formatarData(v) 
    },
    { 
      id: 'horario', 
      label: 'Horário', 
      minWidth: 80,
    },
    { 
      id: 'local', 
      label: 'Local', 
      minWidth: 120,
    },
    { 
      id: 'instrutor', 
      label: 'Instrutor', 
      minWidth: 130,
    },
    { 
      id: 'vagas', 
      label: 'Vagas', 
      minWidth: 100,
      format: (_, row) => (
        <Box>
          <Typography variant="body2">
            {row.vagasOcupadas}/{row.totalVagas}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {Math.round((row.vagasOcupadas / row.totalVagas) * 100)}% ocupado
          </Typography>
        </Box>
      )
    },
    { 
      id: 'status', 
      label: 'Status', 
      minWidth: 120,
      format: (v) => (
        <Chip 
          label={v}
          size="small"
          color={
            v === 'Confirmado' ? 'success' :
            v === 'Pendente' ? 'warning' :
            v === 'Cancelado' ? 'error' :
            'default'
          }
        />
      )
    },
  ];

  return (
    <Box>
      <PageHeader
        title="Gestão de Treinamentos"
        subtitle="Controle completo de treinamentos, vencimentos e agendamentos"
        breadcrumbs={[
          { label: 'Home', path: '/dashboard' },
          { label: 'Treinamentos' },
        ]}
      />

      <AnimatedCard>
        <Tabs value={tabAtual} onChange={(_, v) => setTabAtual(v)}>
          <Tab label="Tipos de Treinamento" />
          <Tab label="Treinamentos Realizados" />
          <Tab label="Agendamentos" />
          <Tab label="Alertas" />
          <Tab label="Relatórios" />
        </Tabs>

        {/* Aba 0: Tipos de Treinamento */}
        <TabPanel value={tabAtual} index={0}>
          <Box p={3}>
            <Box mb={3} display="flex" justifyContent="space-between">
              <Typography variant="h6">Tipos de Treinamento Cadastrados</Typography>
              <GradientButton
                startIcon={<AddIcon />}
                onClick={() => {
                  setTipoAtual({});
                  setDialogTipoAberto(true);
                }}
              >
                Novo Tipo
              </GradientButton>
            </Box>

            <TabelaPaginada
              colunas={colunasTipos}
              dados={tiposTreinamento}
              total={tiposTreinamento.length}
              pagina={0}
              itensPorPagina={10}
              onMudarPagina={() => {}}
              onMudarItensPorPagina={() => {}}
            />
          </Box>
        </TabPanel>

        {/* Aba 1: Treinamentos Realizados */}
        <TabPanel value={tabAtual} index={1}>
          <Box p={3}>
            <Box mb={3} display="flex" gap={2}>
              <GradientButton 
                startIcon={<AddIcon />}
                onClick={() => {
                  setTreinamentoAtual({});
                  setDialogTreinamentoAberto(true);
                }}
              >
                Novo Treinamento
              </GradientButton>
              <GradientButton
                gradient="secondary"
                startIcon={<FileUploadIcon />}
                onClick={() => setDialogImportacaoAberto(true)}
              >
                Importar CSV
              </GradientButton>
            </Box>

            <FiltrosTabela
              busca={busca}
              onBuscaChange={setBusca}
              status={filtroStatus as any}
              onStatusChange={(s) => setFiltroStatus(s as any)}
              onLimpar={() => {
                setBusca('');
                setFiltroStatus([]);
              }}
            />

            <TabelaPaginada
              colunas={colunasTreinamentos}
              dados={treinamentos}
              total={totalTreinamentos}
              pagina={paginaTreinamentos}
              itensPorPagina={itensPorPagina}
              onMudarPagina={setPaginaTreinamentos}
              onMudarItensPorPagina={setItensPorPagina}
            />
          </Box>
        </TabPanel>

        {/* Aba 2: Agendamentos */}
        <TabPanel value={tabAtual} index={2}>
          <Box p={3}>
            <Box mb={3} display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="h6" fontWeight={600}>
                Agendamentos de Treinamentos
              </Typography>
              <GradientButton
                startIcon={<AssignmentIcon />}
                onClick={() => setDialogAgendamentoAberto(true)}
              >
                Novo Agendamento em Massa
              </GradientButton>
            </Box>

            {/* Filtros */}
            <Box mb={3}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    placeholder="Buscar por treinamento, instrutor ou local..."
                    value={buscaAgendamentos}
                    onChange={(e) => setBuscaAgendamentos(e.target.value)}
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Box display="flex" gap={1} flexWrap="wrap">
                    {['Confirmado', 'Pendente', 'Cancelado', 'Realizado'].map((status) => (
                      <Chip
                        key={status}
                        label={status}
                        onClick={() => {
                          if (filtroStatusAgendamento.includes(status)) {
                            setFiltroStatusAgendamento(filtroStatusAgendamento.filter(s => s !== status));
                          } else {
                            setFiltroStatusAgendamento([...filtroStatusAgendamento, status]);
                          }
                        }}
                        color={filtroStatusAgendamento.includes(status) ? 'primary' : 'default'}
                        variant={filtroStatusAgendamento.includes(status) ? 'filled' : 'outlined'}
                        size="small"
                      />
                    ))}
                    {(buscaAgendamentos || filtroStatusAgendamento.length > 0) && (
                      <Button
                        size="small"
                        onClick={() => {
                          setBuscaAgendamentos('');
                          setFiltroStatusAgendamento([]);
                        }}
                      >
                        Limpar
                      </Button>
                    )}
                  </Box>
                </Grid>
              </Grid>
            </Box>

            {/* Tabela */}
            <TabelaPaginada
              colunas={colunasAgendamentos}
              dados={agendamentos}
              total={totalAgendamentos}
              pagina={paginaAgendamentos}
              itensPorPagina={itensPorPaginaAgendamentos}
              onMudarPagina={setPaginaAgendamentos}
              onMudarItensPorPagina={setItensPorPaginaAgendamentos}
            />
          </Box>
        </TabPanel>

        {/* Aba 3: Alertas */}
        <TabPanel value={tabAtual} index={3}>
          <Box p={3}>
            <AlertasVencimento
              alertas={alertas}
              onMarcarLido={(id) => {
                treinamentosService.marcarAlertaLido(id);
                carregarAlertas();
              }}
            />
          </Box>
        </TabPanel>

        {/* Aba 4: Relatórios */}
        <TabPanel value={tabAtual} index={4}>
          <Box p={3}>
            <Typography variant="h6" mb={3}>
              Relatórios e Estatísticas
            </Typography>
            
            <Grid container spacing={3}>
              {/* Card: Treinamentos Vencidos */}
              <Grid item xs={12} md={4}>
                <Card 
                  variant="outlined" 
                  sx={{ 
                    p: 3, 
                    textAlign: 'center',
                    border: '2px solid',
                    borderColor: 'error.main',
                    '&:hover': {
                      boxShadow: 4,
                      transform: 'translateY(-4px)',
                      transition: 'all 0.3s ease',
                    }
                  }}
                >
                  <Typography variant="h2" color="error" fontWeight={700}>
                    {estatisticas.treinamentosVencidos}
                  </Typography>
                  <Typography variant="body1" color="text.secondary" mt={1}>
                    Treinamentos Vencidos
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Requerem renovação imediata
                  </Typography>
                </Card>
              </Grid>

              {/* Card: A Vencer */}
              <Grid item xs={12} md={4}>
                <Card 
                  variant="outlined" 
                  sx={{ 
                    p: 3, 
                    textAlign: 'center',
                    border: '2px solid',
                    borderColor: 'warning.main',
                    '&:hover': {
                      boxShadow: 4,
                      transform: 'translateY(-4px)',
                      transition: 'all 0.3s ease',
                    }
                  }}
                >
                  <Typography variant="h2" color="warning.main" fontWeight={700}>
                    {estatisticas.treinamentosVencendo}
                  </Typography>
                  <Typography variant="body1" color="text.secondary" mt={1}>
                    A Vencer (30 dias)
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Requerem atenção
                  </Typography>
                </Card>
              </Grid>

              {/* Card: Tipos Ativos */}
              <Grid item xs={12} md={4}>
                <Card 
                  variant="outlined" 
                  sx={{ 
                    p: 3, 
                    textAlign: 'center',
                    border: '2px solid',
                    borderColor: 'success.main',
                    '&:hover': {
                      boxShadow: 4,
                      transform: 'translateY(-4px)',
                      transition: 'all 0.3s ease',
                    }
                  }}
                >
                  <Typography variant="h2" color="success.main" fontWeight={700}>
                    {estatisticas.treinamentosAtivos}
                  </Typography>
                  <Typography variant="body1" color="text.secondary" mt={1}>
                    Tipos de Treinamento Ativos
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Cursos disponíveis
                  </Typography>
                </Card>
              </Grid>

              {/* Card: Total de Treinamentos */}
              <Grid item xs={12} md={4}>
                <Card 
                  variant="outlined" 
                  sx={{ 
                    p: 3, 
                    textAlign: 'center',
                    '&:hover': {
                      boxShadow: 4,
                      transform: 'translateY(-4px)',
                      transition: 'all 0.3s ease',
                    }
                  }}
                >
                  <Typography variant="h2" color="primary" fontWeight={700}>
                    {estatisticas.totalTreinamentos}
                  </Typography>
                  <Typography variant="body1" color="text.secondary" mt={1}>
                    Total de Treinamentos
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Cursos cadastrados
                  </Typography>
                </Card>
              </Grid>

              {/* Card: Colaboradores Treinados */}
              <Grid item xs={12} md={4}>
                <Card 
                  variant="outlined" 
                  sx={{ 
                    p: 3, 
                    textAlign: 'center',
                    '&:hover': {
                      boxShadow: 4,
                      transform: 'translateY(-4px)',
                      transition: 'all 0.3s ease',
                    }
                  }}
                >
                  <Typography variant="h2" color="info.main" fontWeight={700}>
                    {estatisticas.totalColaboradoresTreinados}
                  </Typography>
                  <Typography variant="body1" color="text.secondary" mt={1}>
                    Colaboradores Treinados
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Com treinamentos concluídos
                  </Typography>
                </Card>
              </Grid>

              {/* Card: Total de Turmas */}
              <Grid item xs={12} md={4}>
                <Card 
                  variant="outlined" 
                  sx={{ 
                    p: 3, 
                    textAlign: 'center',
                    '&:hover': {
                      boxShadow: 4,
                      transform: 'translateY(-4px)',
                      transition: 'all 0.3s ease',
                    }
                  }}
                >
                  <Typography variant="h2" color="secondary" fontWeight={700}>
                    {estatisticas.totalTurmas}
                  </Typography>
                  <Typography variant="body1" color="text.secondary" mt={1}>
                    Turmas Agendadas
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Agendamentos ativos
                  </Typography>
                </Card>
              </Grid>
            </Grid>
          </Box>
        </TabPanel>
      </AnimatedCard>

      {/* Dialog Tipo de Treinamento */}
      <Dialog 
        open={dialogTipoAberto} 
        onClose={() => {
          setDialogTipoAberto(false);
          setTipoAtual({});
        }} 
        maxWidth="md" 
        fullWidth
      >
        <DialogTitle>
          {tipoAtual.id ? 'Editar' : 'Novo'} Tipo de Treinamento
        </DialogTitle>
        <DialogContent>
          <Box mt={2}>
            <TipoTreinamentoForm
              dados={tipoAtual}
              onChange={(campo, valor) => setTipoAtual({ ...tipoAtual, [campo]: valor })}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <GradientButton gradient="secondary" onClick={() => setDialogTipoAberto(false)}>
            Cancelar
          </GradientButton>
          <GradientButton onClick={handleSalvarTipo} loading={loading}>
            Salvar
          </GradientButton>
        </DialogActions>
      </Dialog>

      {/* Dialog Novo Treinamento */}
      <Dialog 
        open={dialogTreinamentoAberto} 
        onClose={() => {
          setDialogTreinamentoAberto(false);
          setTreinamentoAtual({});
        }} 
        maxWidth="md" 
        fullWidth
        onEnter={() => {
          // Carregar colaboradores quando abrir o dialog
          if (colaboradores.length === 0) {
            carregarColaboradores();
          }
        }}
      >
        <DialogTitle>
          {treinamentoAtual.id ? 'Editar' : 'Novo'} Treinamento
        </DialogTitle>
        <DialogContent>
          <Box mt={2}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  select
                  label="Colaborador *"
                  value={treinamentoAtual.colaborador_id || ''}
                  onChange={(e) => setTreinamentoAtual({ ...treinamentoAtual, colaborador_id: e.target.value })}
                  required
                >
                  {colaboradores.map((colab) => (
                    <MenuItem key={colab.id} value={colab.id}>
                      {colab.nome_completo || colab.nome} - {colab.matricula || colab.cpf}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  select
                  label="Tipo de Treinamento *"
                  value={treinamentoAtual.treinamento_id || ''}
                  onChange={(e) => setTreinamentoAtual({ ...treinamentoAtual, treinamento_id: e.target.value })}
                  required
                >
                  {tiposTreinamento.map((tipo) => (
                    <MenuItem key={tipo.id} value={tipo.id}>
                      {tipo.nome || tipo.titulo}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  type="date"
                  label="Data de Realização *"
                  value={treinamentoAtual.data_realizacao || treinamentoAtual.data_conclusao || treinamentoAtual.dataRealizacao || ''}
                  onChange={(e) => setTreinamentoAtual({ ...treinamentoAtual, data_realizacao: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  type="date"
                  label="Data de Validade"
                  value={treinamentoAtual.data_validade || treinamentoAtual.dataValidade || ''}
                  onChange={(e) => setTreinamentoAtual({ ...treinamentoAtual, data_validade: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                  helperText="Deixe vazio se for permanente"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Nota"
                  value={treinamentoAtual.nota || ''}
                  onChange={(e) => setTreinamentoAtual({ ...treinamentoAtual, nota: parseFloat(e.target.value) || null })}
                  inputProps={{ min: 0, max: 10, step: 0.1 }}
                  helperText="Nota de 0 a 10"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  select
                  label="Status"
                  value={treinamentoAtual.status || 'CONCLUIDO'}
                  onChange={(e) => setTreinamentoAtual({ ...treinamentoAtual, status: e.target.value })}
                >
                  <MenuItem value="INSCRITO">Inscrito</MenuItem>
                  <MenuItem value="EM_ANDAMENTO">Em Andamento</MenuItem>
                  <MenuItem value="CONCLUIDO">Concluído</MenuItem>
                  <MenuItem value="REPROVADO">Reprovado</MenuItem>
                  <MenuItem value="CANCELADO">Cancelado</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Observações"
                  value={treinamentoAtual.observacoes || ''}
                  onChange={(e) => setTreinamentoAtual({ ...treinamentoAtual, observacoes: e.target.value })}
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <GradientButton gradient="secondary" onClick={() => {
            setDialogTreinamentoAberto(false);
            setTreinamentoAtual({});
          }}>
            Cancelar
          </GradientButton>
          <GradientButton onClick={handleSalvarTreinamento} loading={loading}>
            Salvar
          </GradientButton>
        </DialogActions>
      </Dialog>

      {/* Dialog Importação CSV */}
      <Dialog open={dialogImportacaoAberto} onClose={() => setDialogImportacaoAberto(false)} maxWidth="md" fullWidth>
        <DialogTitle>Importação em Massa (CSV)</DialogTitle>
        <DialogContent>
          <ImportacaoCSV onImportar={handleImportar} />
        </DialogContent>
      </Dialog>

      {/* Dialog Agendamento em Massa */}
      <Dialog open={dialogAgendamentoAberto} onClose={() => setDialogAgendamentoAberto(false)} maxWidth="lg" fullWidth>
        <DialogTitle>Agendamento em Massa</DialogTitle>
        <DialogContent>
          <AgendamentoMassa
            tiposTreinamento={tiposTreinamento}
            colaboradoresDisponiveis={[
              { id: '1', nome: 'João Silva', departamento: 'RH', cargo: 'Analista' },
              { id: '2', nome: 'Maria Santos', departamento: 'TI', cargo: 'Desenvolvedora' },
            ]}
            onAgendar={handleAgendar}
          />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

