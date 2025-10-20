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
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import AssignmentIcon from '@mui/icons-material/Assignment';
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
import treinamentosService from '../services/treinamentosService.mock';
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

  useEffect(() => {
    carregarTipos();
    carregarAlertas();
  }, []);

  useEffect(() => {
    if (tabAtual === 1) carregarTreinamentos();
    if (tabAtual === 2) carregarAgendamentos();
  }, [tabAtual, paginaTreinamentos, itensPorPagina, filtroStatus, busca, paginaAgendamentos, itensPorPaginaAgendamentos, filtroStatusAgendamento, buscaAgendamentos]);

  const carregarTipos = async () => {
    try {
      const dados = await treinamentosService.listarTipos();
      setTiposTreinamento(dados);
    } catch (error) {
      console.error('Erro ao carregar tipos:', error);
    }
  };

  const carregarTreinamentos = async () => {
    try {
      const resultado = await treinamentosService.listarTreinamentos(
        { pagina: paginaTreinamentos, itensPorPagina },
        { status: filtroStatus, busca }
      );
      setTreinamentos(resultado.dados);
      setTotalTreinamentos(resultado.total);
    } catch (error) {
      console.error('Erro ao carregar treinamentos:', error);
    }
  };

  const carregarAlertas = async () => {
    try {
      const dados = await treinamentosService.listarAlertas();
      setAlertas(dados);
    } catch (error) {
      console.error('Erro ao carregar alertas:', error);
    }
  };

  const carregarAgendamentos = async () => {
    try {
      setLoading(true);
      // Mock de agendamentos - substitua por chamada real ao service
      const mockAgendamentos = Array.from({ length: 25 }, (_, i) => ({
        id: `ag-${i + 1}`,
        tipoTreinamento: ['NR-10', 'NR-35', 'Primeiros Socorros', 'Excel Avançado'][i % 4],
        dataAgendamento: new Date(2024, 0, 15 + i).toISOString(),
        horario: ['08:00', '14:00', '09:00', '15:00'][i % 4],
        local: ['Sala 101', 'Sala 202', 'Auditório', 'Online'][i % 4],
        instrutor: ['João Silva', 'Maria Santos', 'Pedro Costa', 'Ana Lima'][i % 4],
        totalVagas: [20, 30, 15, 50][i % 4],
        vagasOcupadas: Math.floor(Math.random() * 20) + 5,
        status: ['Confirmado', 'Pendente', 'Cancelado', 'Realizado'][i % 4],
        colaboradores: Math.floor(Math.random() * 15) + 5,
      }));

      // Aplicar filtros
      let agendamentosFiltrados = mockAgendamentos;

      if (buscaAgendamentos) {
        agendamentosFiltrados = agendamentosFiltrados.filter(
          a => a.tipoTreinamento.toLowerCase().includes(buscaAgendamentos.toLowerCase()) ||
               a.instrutor.toLowerCase().includes(buscaAgendamentos.toLowerCase()) ||
               a.local.toLowerCase().includes(buscaAgendamentos.toLowerCase())
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
      carregarTipos();
    } catch (error) {
      console.error('Erro ao salvar tipo:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSalvarTreinamento = async () => {
    try {
      setLoading(true);
      
      // Validação básica
      if (!treinamentoAtual.colaboradorNome || !treinamentoAtual.tipoTreinamento) {
        alert('Preencha todos os campos obrigatórios');
        return;
      }

      if (treinamentoAtual.id) {
        await treinamentosService.atualizarTreinamento(treinamentoAtual.id, treinamentoAtual);
      } else {
        await treinamentosService.criarTreinamento(treinamentoAtual);
      }
      
      setDialogTreinamentoAberto(false);
      setTreinamentoAtual({});
      carregarTreinamentos();
    } catch (error) {
      console.error('Erro ao salvar treinamento:', error);
      alert('Erro ao salvar treinamento');
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
    { id: 'categoria', label: 'Categoria', minWidth: 150 },
    { id: 'cargaHoraria', label: 'Carga Horária', minWidth: 100, format: (v) => `${v}h` },
    { id: 'validadeDias', label: 'Validade', minWidth: 100, format: (v) => v === 0 ? 'Permanente' : `${v} dias` },
    { id: 'obrigatorio', label: 'Obrigatório', minWidth: 100, format: (v) => v ? 'Sim' : 'Não' },
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
              loading={loading}
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
              <Grid item xs={12} md={4}>
                <Card variant="outlined" sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant="h3" color="error">
                    {treinamentos.filter(t => t.status === StatusTreinamento.VENCIDO).length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Treinamentos Vencidos
                  </Typography>
                </Card>
              </Grid>
              <Grid item xs={12} md={4}>
                <Card variant="outlined" sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant="h3" color="warning.main">
                    {treinamentos.filter(t => t.status === StatusTreinamento.A_VENCER).length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    A Vencer (30 dias)
                  </Typography>
                </Card>
              </Grid>
              <Grid item xs={12} md={4}>
                <Card variant="outlined" sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant="h3" color="success.main">
                    {treinamentos.filter(t => t.status === StatusTreinamento.ATIVO).length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Ativos
                  </Typography>
                </Card>
              </Grid>
            </Grid>
          </Box>
        </TabPanel>
      </AnimatedCard>

      {/* Dialog Tipo de Treinamento */}
      <Dialog open={dialogTipoAberto} onClose={() => setDialogTipoAberto(false)} maxWidth="md" fullWidth>
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
      <Dialog open={dialogTreinamentoAberto} onClose={() => setDialogTreinamentoAberto(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {treinamentoAtual.id ? 'Editar' : 'Novo'} Treinamento
        </DialogTitle>
        <DialogContent>
          <Box mt={2}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Nome do Colaborador"
                  value={treinamentoAtual.colaboradorNome || ''}
                  onChange={(e) => setTreinamentoAtual({ ...treinamentoAtual, colaboradorNome: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  select
                  label="Tipo de Treinamento"
                  value={treinamentoAtual.tipoTreinamento || ''}
                  onChange={(e) => setTreinamentoAtual({ ...treinamentoAtual, tipoTreinamento: e.target.value })}
                  required
                >
                  {tiposTreinamento.map((tipo) => (
                    <MenuItem key={tipo.id} value={tipo.nome}>
                      {tipo.nome}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  type="date"
                  label="Data de Realização"
                  value={treinamentoAtual.dataRealizacao || ''}
                  onChange={(e) => setTreinamentoAtual({ ...treinamentoAtual, dataRealizacao: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  type="date"
                  label="Data de Vencimento"
                  value={treinamentoAtual.dataVencimento || ''}
                  onChange={(e) => setTreinamentoAtual({ ...treinamentoAtual, dataVencimento: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Instrutor"
                  value={treinamentoAtual.instrutor || ''}
                  onChange={(e) => setTreinamentoAtual({ ...treinamentoAtual, instrutor: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Carga Horária"
                  value={treinamentoAtual.cargaHoraria || ''}
                  onChange={(e) => setTreinamentoAtual({ ...treinamentoAtual, cargaHoraria: parseInt(e.target.value) })}
                />
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

