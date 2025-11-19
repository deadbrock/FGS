import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Card,
  CardContent,
  Grid,
  TextField,
  Button,
  MenuItem,
  Chip,
  Alert,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  IconButton,
  Tooltip,
  LinearProgress,
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  CheckCircle as CheckCircleIcon,
  Pending as PendingIcon,
  Cancel as CancelIcon,
  Upload as UploadIcon,
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Send as SendIcon,
  Timeline as TimelineIcon,
  Description as DescriptionIcon,
  Assessment as AssessmentIcon,
} from '@mui/icons-material';
import { useNavigationLog } from '../hooks/useNavigationLog';
import { PageHeader, GradientButton, AnimatedCard, StatCard } from '../components';
import admissaoService from '../services/admissaoService';
import {
  Admissao,
  CreateAdmissaoDTO,
  StatusAdmissao,
  EtapaWorkflow,
  StatusDocumento,
  EstatisticasAdmissao,
} from '../types/admissao';
import { formatarData } from '../utils/statusUtils';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index } = props;
  return <div hidden={value !== index}>{value === index && <Box sx={{ p: 3 }}>{children}</Box>}</div>;
}

export const Admissao: React.FC = () => {
  useNavigationLog();

  const [tabAtual, setTabAtual] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Estados da lista
  const [admissoes, setAdmissoes] = useState<Admissao[]>([]);
  const [totalAdmissoes, setTotalAdmissoes] = useState(0);
  const [pagina, setPagina] = useState(0);
  const [itensPorPagina, setItensPorPagina] = useState(10);
  const [filtros, setFiltros] = useState({
    status: '' as StatusAdmissao | '',
    etapa_atual: '' as EtapaWorkflow | '',
    search: '',
  });

  // Estados do formulário
  const [dialogAberto, setDialogAberto] = useState(false);
  const [admissaoSelecionada, setAdmissaoSelecionada] = useState<Admissao | null>(null);
  const [formData, setFormData] = useState<CreateAdmissaoDTO>({
    nome_candidato: '',
    cpf_candidato: '',
    email_candidato: '',
    telefone_candidato: '',
    cargo: '',
    departamento: '',
    tipo_contrato: 'CLT',
    salario_proposto: undefined,
    data_inicio_prevista: '',
    observacoes: '',
  });

  // Estados de estatísticas
  const [estatisticas, setEstatisticas] = useState<EstatisticasAdmissao | null>(null);

  // Carregar admissões
  const carregarAdmissoes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await admissaoService.getAll({
        ...filtros,
        limit: itensPorPagina,
        offset: pagina * itensPorPagina,
      });
      setAdmissoes(response.data);
      setTotalAdmissoes(response.pagination?.total || 0);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar admissões');
      console.error('Erro ao carregar admissões:', err);
    } finally {
      setLoading(false);
    }
  }, [filtros, pagina, itensPorPagina]);

  // Carregar estatísticas
  const carregarEstatisticas = useCallback(async () => {
    try {
      const stats = await admissaoService.getEstatisticas();
      setEstatisticas(stats);
    } catch (err: any) {
      console.error('Erro ao carregar estatísticas:', err);
    }
  }, []);

  useEffect(() => {
    if (tabAtual === 0) {
      carregarAdmissoes();
    } else if (tabAtual === 3) {
      carregarEstatisticas();
    }
  }, [tabAtual, carregarAdmissoes, carregarEstatisticas]);

  // Abrir formulário
  const handleAbrirFormulario = (admissao?: Admissao) => {
    if (admissao) {
      setAdmissaoSelecionada(admissao);
      setFormData({
        nome_candidato: admissao.nome_candidato,
        cpf_candidato: admissao.cpf_candidato,
        email_candidato: admissao.email_candidato,
        telefone_candidato: admissao.telefone_candidato || '',
        cargo: admissao.cargo,
        departamento: admissao.departamento,
        tipo_contrato: admissao.tipo_contrato,
        salario_proposto: admissao.salario_proposto,
        data_inicio_prevista: admissao.data_inicio_prevista || '',
        observacoes: admissao.observacoes || '',
      });
    } else {
      setAdmissaoSelecionada(null);
      setFormData({
        nome_candidato: '',
        cpf_candidato: '',
        email_candidato: '',
        telefone_candidato: '',
        cargo: '',
        departamento: '',
        tipo_contrato: 'CLT',
        salario_proposto: undefined,
        data_inicio_prevista: '',
        observacoes: '',
      });
    }
    setDialogAberto(true);
  };

  // Salvar admissão
  const handleSalvar = async () => {
    try {
      setLoading(true);
      setError(null);

      if (admissaoSelecionada) {
        await admissaoService.update(admissaoSelecionada.id, formData);
      } else {
        await admissaoService.create(formData);
      }

      setDialogAberto(false);
      carregarAdmissoes();
    } catch (err: any) {
      setError(err.message || 'Erro ao salvar admissão');
    } finally {
      setLoading(false);
    }
  };

  // Função para obter cor do status
  const getStatusColor = (status: StatusAdmissao) => {
    switch (status) {
      case 'CONCLUIDA':
        return 'success';
      case 'EM_ANDAMENTO':
        return 'info';
      case 'CANCELADA':
      case 'REPROVADA':
        return 'error';
      default:
        return 'default';
    }
  };

  // Função para obter label da etapa
  const getEtapaLabel = (etapa: EtapaWorkflow) => {
    const labels: Record<EtapaWorkflow, string> = {
      SOLICITACAO_VAGA: 'Solicitação de Vaga',
      APROVACAO: 'Aprovação',
      COLETA_DOCUMENTOS: 'Coleta de Documentos',
      VALIDACAO_DOCUMENTOS: 'Validação de Documentos',
      EXAME_ADMISSIONAL: 'Exame Admissional',
      GERACAO_CONTRATO: 'Geração de Contrato',
      ASSINATURA_DIGITAL: 'Assinatura Digital',
      ENVIO_ESOCIAL: 'Envio eSocial',
      INTEGRACAO_THOMSON: 'Integração Thompson Reuters',
    };
    return labels[etapa] || etapa;
  };

  return (
    <Box>
      <PageHeader
        title="Admissão de Colaboradores"
        subtitle="Gerencie o processo completo de admissão de novos colaboradores"
        breadcrumbs={[
          { label: 'Home', path: '/dashboard' },
          { label: 'Admissão' },
        ]}
        action={
          <GradientButton startIcon={<AddIcon />} onClick={() => handleAbrirFormulario()}>
            Nova Admissão
          </GradientButton>
        }
      />

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <AnimatedCard>
        <Tabs value={tabAtual} onChange={(_, v) => setTabAtual(v)}>
          <Tab label="Admissões" icon={<DescriptionIcon />} iconPosition="start" />
          <Tab label="Workflow" icon={<TimelineIcon />} iconPosition="start" />
          <Tab label="Checklist" icon={<CheckCircleIcon />} iconPosition="start" />
          <Tab label="Relatórios" icon={<AssessmentIcon />} iconPosition="start" />
        </Tabs>

        {/* Aba 0: Lista de Admissões */}
        <TabPanel value={tabAtual} index={0}>
          <Box mb={3}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  placeholder="Buscar por nome, CPF, email..."
                  value={filtros.search}
                  onChange={(e) => setFiltros({ ...filtros, search: e.target.value })}
                  InputProps={{
                    startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                  }}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  select
                  label="Status"
                  value={filtros.status}
                  onChange={(e) => setFiltros({ ...filtros, status: e.target.value as StatusAdmissao | '' })}
                >
                  <MenuItem value="">Todos</MenuItem>
                  <MenuItem value="EM_ANDAMENTO">Em Andamento</MenuItem>
                  <MenuItem value="CONCLUIDA">Concluída</MenuItem>
                  <MenuItem value="CANCELADA">Cancelada</MenuItem>
                  <MenuItem value="REPROVADA">Reprovada</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  select
                  label="Etapa"
                  value={filtros.etapa_atual}
                  onChange={(e) => setFiltros({ ...filtros, etapa_atual: e.target.value as EtapaWorkflow | '' })}
                >
                  <MenuItem value="">Todas</MenuItem>
                  <MenuItem value="SOLICITACAO_VAGA">Solicitação de Vaga</MenuItem>
                  <MenuItem value="APROVACAO">Aprovação</MenuItem>
                  <MenuItem value="COLETA_DOCUMENTOS">Coleta de Documentos</MenuItem>
                  <MenuItem value="VALIDACAO_DOCUMENTOS">Validação de Documentos</MenuItem>
                  <MenuItem value="EXAME_ADMISSIONAL">Exame Admissional</MenuItem>
                  <MenuItem value="GERACAO_CONTRATO">Geração de Contrato</MenuItem>
                  <MenuItem value="ASSINATURA_DIGITAL">Assinatura Digital</MenuItem>
                  <MenuItem value="ENVIO_ESOCIAL">Envio eSocial</MenuItem>
                  <MenuItem value="INTEGRACAO_THOMSON">Integração Thompson</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} md={2}>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={() => {
                    setFiltros({ status: '', etapa_atual: '', search: '' });
                    setPagina(0);
                  }}
                >
                  Limpar
                </Button>
              </Grid>
            </Grid>
          </Box>

          {loading ? (
            <Box display="flex" justifyContent="center" py={4}>
              <CircularProgress />
            </Box>
          ) : (
            <TableContainer component={Paper} elevation={0}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Candidato</TableCell>
                    <TableCell>Cargo</TableCell>
                    <TableCell>Departamento</TableCell>
                    <TableCell>Etapa Atual</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Data Solicitação</TableCell>
                    <TableCell align="right">Ações</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {admissoes.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                        <Typography color="text.secondary">
                          Nenhuma admissão encontrada
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    admissoes.map((admissao) => (
                      <TableRow key={admissao.id} hover>
                        <TableCell>
                          <Box>
                            <Typography variant="body2" fontWeight={600}>
                              {admissao.nome_candidato}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {admissao.email_candidato}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>{admissao.cargo}</TableCell>
                        <TableCell>{admissao.departamento}</TableCell>
                        <TableCell>
                          <Chip
                            label={getEtapaLabel(admissao.etapa_atual)}
                            size="small"
                            color="primary"
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={admissao.status}
                            size="small"
                            color={getStatusColor(admissao.status)}
                          />
                        </TableCell>
                        <TableCell>{formatarData(admissao.data_solicitacao)}</TableCell>
                        <TableCell align="right">
                          <Tooltip title="Ver Detalhes">
                            <IconButton
                              size="small"
                              onClick={() => {
                                setAdmissaoSelecionada(admissao);
                                setTabAtual(1); // Ir para aba de workflow
                              }}
                            >
                              <VisibilityIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Editar">
                            <IconButton size="small" onClick={() => handleAbrirFormulario(admissao)}>
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          {/* Paginação */}
          {totalAdmissoes > 0 && (
            <Box display="flex" justifyContent="space-between" alignItems="center" mt={3}>
              <Typography variant="body2" color="text.secondary">
                Total: {totalAdmissoes} admissões
              </Typography>
              <Box display="flex" gap={1}>
                <Button
                  disabled={pagina === 0}
                  onClick={() => setPagina(pagina - 1)}
                >
                  Anterior
                </Button>
                <Typography variant="body2" sx={{ alignSelf: 'center', px: 2 }}>
                  Página {pagina + 1} de {Math.ceil(totalAdmissoes / itensPorPagina)}
                </Typography>
                <Button
                  disabled={(pagina + 1) * itensPorPagina >= totalAdmissoes}
                  onClick={() => setPagina(pagina + 1)}
                >
                  Próxima
                </Button>
              </Box>
            </Box>
          )}
        </TabPanel>

        {/* Aba 1: Workflow - Será implementada com detalhes da admissão selecionada */}
        <TabPanel value={tabAtual} index={1}>
          {admissaoSelecionada ? (
            <Box>
              <Typography variant="h6" gutterBottom>
                Workflow: {admissaoSelecionada.nome_candidato}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {admissaoSelecionada.cargo} - {admissaoSelecionada.departamento}
              </Typography>
              <Alert severity="info" sx={{ mt: 2, mb: 3 }}>
                Detalhes do workflow serão implementados na próxima etapa
              </Alert>
            </Box>
          ) : (
            <Alert severity="info">
              Selecione uma admissão da lista para ver o workflow
            </Alert>
          )}
        </TabPanel>

        {/* Aba 2: Checklist - Será implementada */}
        <TabPanel value={tabAtual} index={2}>
          {admissaoSelecionada ? (
            <Box>
              <Typography variant="h6" gutterBottom>
                Checklist de Documentos: {admissaoSelecionada.nome_candidato}
              </Typography>
              <Alert severity="info" sx={{ mt: 2 }}>
                Checklist de documentos será implementado na próxima etapa
              </Alert>
            </Box>
          ) : (
            <Alert severity="info">
              Selecione uma admissão da lista para ver o checklist
            </Alert>
          )}
        </TabPanel>

        {/* Aba 3: Relatórios */}
        <TabPanel value={tabAtual} index={3}>
          {estatisticas ? (
            <Grid container spacing={3}>
              <Grid item xs={12} md={3}>
                <StatCard
                  title="Total de Admissões"
                  value={estatisticas.total.toString()}
                  icon={<DescriptionIcon />}
                  color="primary"
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <StatCard
                  title="Tempo Médio"
                  value={`${estatisticas.tempoMedioDias} dias`}
                  icon={<TimelineIcon />}
                  color="info"
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <StatCard
                  title="Documentos Pendentes"
                  value={estatisticas.documentosPendentes.toString()}
                  icon={<PendingIcon />}
                  color="warning"
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <StatCard
                  title="Em Andamento"
                  value={
                    estatisticas.porStatus.find((s) => s.status === 'EM_ANDAMENTO')?.total || '0'
                  }
                  icon={<CheckCircleIcon />}
                  color="success"
                />
              </Grid>
            </Grid>
          ) : (
            <Box display="flex" justifyContent="center" py={4}>
              <CircularProgress />
            </Box>
          )}
        </TabPanel>
      </AnimatedCard>

      {/* Dialog de Formulário */}
      <Dialog open={dialogAberto} onClose={() => setDialogAberto(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {admissaoSelecionada ? 'Editar Admissão' : 'Nova Admissão'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Nome do Candidato"
                value={formData.nome_candidato}
                onChange={(e) => setFormData({ ...formData, nome_candidato: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="CPF"
                value={formData.cpf_candidato}
                onChange={(e) => setFormData({ ...formData, cpf_candidato: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="E-mail"
                type="email"
                value={formData.email_candidato}
                onChange={(e) => setFormData({ ...formData, email_candidato: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Telefone"
                value={formData.telefone_candidato}
                onChange={(e) => setFormData({ ...formData, telefone_candidato: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Cargo"
                value={formData.cargo}
                onChange={(e) => setFormData({ ...formData, cargo: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Departamento"
                value={formData.departamento}
                onChange={(e) => setFormData({ ...formData, departamento: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                select
                label="Tipo de Contrato"
                value={formData.tipo_contrato}
                onChange={(e) => setFormData({ ...formData, tipo_contrato: e.target.value as any })}
              >
                <MenuItem value="CLT">CLT</MenuItem>
                <MenuItem value="PJ">PJ</MenuItem>
                <MenuItem value="Estágio">Estágio</MenuItem>
                <MenuItem value="Temporário">Temporário</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Salário Proposto"
                type="number"
                value={formData.salario_proposto || ''}
                onChange={(e) =>
                  setFormData({ ...formData, salario_proposto: parseFloat(e.target.value) || undefined })
                }
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Data Início Prevista"
                type="date"
                value={formData.data_inicio_prevista}
                onChange={(e) => setFormData({ ...formData, data_inicio_prevista: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Observações"
                multiline
                rows={3}
                value={formData.observacoes}
                onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogAberto(false)}>Cancelar</Button>
          <GradientButton onClick={handleSalvar} disabled={loading}>
            {loading ? <CircularProgress size={20} /> : 'Salvar'}
          </GradientButton>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

