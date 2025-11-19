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

  // Estados do workflow e checklist
  const [admissaoCompleta, setAdmissaoCompleta] = useState<Admissao | null>(null);
  const [loadingDetalhes, setLoadingDetalhes] = useState(false);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [documentoSelecionado, setDocumentoSelecionado] = useState<string | null>(null);
  const [arquivoSelecionado, setArquivoSelecionado] = useState<File | null>(null);

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

  // Carregar detalhes completos da admissão
  const carregarDetalhesAdmissao = useCallback(async (admissaoId: string) => {
    setLoadingDetalhes(true);
    try {
      const detalhes = await admissaoService.getById(admissaoId);
      setAdmissaoCompleta(detalhes);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar detalhes da admissão');
      console.error('Erro ao carregar detalhes:', err);
    } finally {
      setLoadingDetalhes(false);
    }
  }, []);

  // Quando selecionar uma admissão, carregar detalhes
  useEffect(() => {
    if (admissaoSelecionada && (tabAtual === 1 || tabAtual === 2)) {
      carregarDetalhesAdmissao(admissaoSelecionada.id);
    }
  }, [admissaoSelecionada, tabAtual, carregarDetalhesAdmissao]);

  // Avançar etapa do workflow
  const handleAvancarEtapa = async () => {
    if (!admissaoSelecionada) return;

    try {
      setLoading(true);
      setError(null);
      await admissaoService.avancarEtapa(admissaoSelecionada.id, {});
      await carregarDetalhesAdmissao(admissaoSelecionada.id);
      carregarAdmissoes();
    } catch (err: any) {
      setError(err.message || 'Erro ao avançar etapa');
    } finally {
      setLoading(false);
    }
  };

  // Abrir dialog de upload
  const handleAbrirUpload = (documentoId: string) => {
    setDocumentoSelecionado(documentoId);
    setArquivoSelecionado(null);
    setUploadDialogOpen(true);
  };

  // Fazer upload de documento
  const handleUploadDocumento = async () => {
    if (!admissaoSelecionada || !documentoSelecionado || !arquivoSelecionado) return;

    try {
      setLoading(true);
      setError(null);
      await admissaoService.uploadDocumento(
        admissaoSelecionada.id,
        documentoSelecionado,
        arquivoSelecionado
      );
      setUploadDialogOpen(false);
      await carregarDetalhesAdmissao(admissaoSelecionada.id);
    } catch (err: any) {
      setError(err.message || 'Erro ao fazer upload do documento');
    } finally {
      setLoading(false);
    }
  };

  // Validar documento
  const handleValidarDocumento = async (documentoId: string, aprovado: boolean) => {
    if (!admissaoSelecionada) return;

    try {
      setLoading(true);
      setError(null);
      await admissaoService.validarDocumento(documentoId, {
        status: aprovado ? 'APROVADO' : 'REPROVADO',
      });
      await carregarDetalhesAdmissao(admissaoSelecionada.id);
    } catch (err: any) {
      setError(err.message || 'Erro ao validar documento');
    } finally {
      setLoading(false);
    }
  };

  // Obter índice da etapa atual no stepper
  const getEtapaIndex = (etapa: EtapaWorkflow): number => {
    const etapas: EtapaWorkflow[] = [
      'SOLICITACAO_VAGA',
      'APROVACAO',
      'COLETA_DOCUMENTOS',
      'VALIDACAO_DOCUMENTOS',
      'EXAME_ADMISSIONAL',
      'GERACAO_CONTRATO',
      'ASSINATURA_DIGITAL',
      'ENVIO_ESOCIAL',
      'INTEGRACAO_THOMSON',
    ];
    return etapas.indexOf(etapa);
  };

  // Obter status da etapa
  const getEtapaStatus = (etapa: EtapaWorkflow): 'completed' | 'active' | 'pending' => {
    if (!admissaoCompleta) return 'pending';
    const etapaAtualIndex = getEtapaIndex(admissaoCompleta.etapa_atual);
    const etapaIndex = getEtapaIndex(etapa);
    
    if (etapaIndex < etapaAtualIndex) return 'completed';
    if (etapaIndex === etapaAtualIndex) return 'active';
    return 'pending';
  };

  // Obter cor do status do documento
  const getDocumentoStatusColor = (status: StatusDocumento) => {
    switch (status) {
      case 'APROVADO':
        return 'success';
      case 'RECEBIDO':
        return 'info';
      case 'REPROVADO':
        return 'error';
      default:
        return 'default';
    }
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

        {/* Aba 1: Workflow */}
        <TabPanel value={tabAtual} index={1}>
          {!admissaoSelecionada ? (
            <Alert severity="info">
              Selecione uma admissão da lista para ver o workflow
            </Alert>
          ) : loadingDetalhes ? (
            <Box display="flex" justifyContent="center" py={4}>
              <CircularProgress />
            </Box>
          ) : admissaoCompleta ? (
            <Box>
              <Box mb={3} display="flex" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Workflow: {admissaoCompleta.nome_candidato}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {admissaoCompleta.cargo} - {admissaoCompleta.departamento}
                  </Typography>
                  <Chip
                    label={admissaoCompleta.status}
                    color={getStatusColor(admissaoCompleta.status)}
                    size="small"
                    sx={{ mt: 1 }}
                  />
                </Box>
                {admissaoCompleta.status === 'EM_ANDAMENTO' && (
                  <GradientButton
                    startIcon={<SendIcon />}
                    onClick={handleAvancarEtapa}
                    disabled={loading}
                  >
                    Avançar Etapa
                  </GradientButton>
                )}
              </Box>

              <Stepper activeStep={getEtapaIndex(admissaoCompleta.etapa_atual)} orientation="vertical">
                {[
                  'SOLICITACAO_VAGA',
                  'APROVACAO',
                  'COLETA_DOCUMENTOS',
                  'VALIDACAO_DOCUMENTOS',
                  'EXAME_ADMISSIONAL',
                  'GERACAO_CONTRATO',
                  'ASSINATURA_DIGITAL',
                  'ENVIO_ESOCIAL',
                  'INTEGRACAO_THOMSON',
                ].map((etapa, index) => {
                  const etapaKey = etapa as EtapaWorkflow;
                  const workflowEtapa = admissaoCompleta.workflow?.find((w) => w.etapa === etapaKey);
                  const status = getEtapaStatus(etapaKey);
                  const isActive = status === 'active';
                  const isCompleted = status === 'completed';

                  return (
                    <Step key={etapa} completed={isCompleted} active={isActive}>
                      <StepLabel
                        optional={
                          workflowEtapa?.data_conclusao ? (
                            <Typography variant="caption" color="text.secondary">
                              Concluída em: {formatarData(workflowEtapa.data_conclusao)}
                            </Typography>
                          ) : workflowEtapa?.prazo_etapa ? (
                            <Typography variant="caption" color="text.secondary">
                              Prazo: {formatarData(workflowEtapa.prazo_etapa)}
                            </Typography>
                          ) : null
                        }
                      >
                        {getEtapaLabel(etapaKey)}
                      </StepLabel>
                      <StepContent>
                        <Box sx={{ mb: 2 }}>
                          {workflowEtapa && (
                            <Box>
                              {workflowEtapa.responsavel_nome && (
                                <Typography variant="body2" color="text.secondary" gutterBottom>
                                  <strong>Responsável:</strong> {workflowEtapa.responsavel_nome}
                                </Typography>
                              )}
                              {workflowEtapa.data_inicio && (
                                <Typography variant="body2" color="text.secondary" gutterBottom>
                                  <strong>Iniciada em:</strong> {formatarData(workflowEtapa.data_inicio)}
                                </Typography>
                              )}
                              {workflowEtapa.observacoes && (
                                <Alert severity="info" sx={{ mt: 2 }}>
                                  {workflowEtapa.observacoes}
                                </Alert>
                              )}
                            </Box>
                          )}

                          {isActive && (
                            <Box mt={2}>
                              <Alert severity="info">
                                Esta etapa está em andamento. Complete as ações necessárias para avançar.
                              </Alert>
                            </Box>
                          )}

                          {etapaKey === 'ENVIO_ESOCIAL' && admissaoCompleta.esocial_enviado && (
                            <Alert severity="success" sx={{ mt: 2 }}>
                              eSocial enviado em: {formatarData(admissaoCompleta.esocial_data_envio || '')}
                              {admissaoCompleta.esocial_evento_id && (
                                <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                                  ID do Evento: {admissaoCompleta.esocial_evento_id}
                                </Typography>
                              )}
                            </Alert>
                          )}

                          {etapaKey === 'INTEGRACAO_THOMSON' && admissaoCompleta.thomson_reuters_enviado && (
                            <Alert severity="success" sx={{ mt: 2 }}>
                              Dados enviados para Thompson Reuters em: {formatarData(admissaoCompleta.thomson_reuters_data_envio || '')}
                              {admissaoCompleta.thomson_reuters_id && (
                                <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                                  ID: {admissaoCompleta.thomson_reuters_id}
                                </Typography>
                              )}
                            </Alert>
                          )}
                        </Box>
                      </StepContent>
                    </Step>
                  );
                })}
              </Stepper>
            </Box>
          ) : (
            <Alert severity="warning">
              Não foi possível carregar os detalhes do workflow
            </Alert>
          )}
        </TabPanel>

        {/* Aba 2: Checklist */}
        <TabPanel value={tabAtual} index={2}>
          {!admissaoSelecionada ? (
            <Alert severity="info">
              Selecione uma admissão da lista para ver o checklist
            </Alert>
          ) : loadingDetalhes ? (
            <Box display="flex" justifyContent="center" py={4}>
              <CircularProgress />
            </Box>
          ) : admissaoCompleta ? (
            <Box>
              <Box mb={3} display="flex" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Checklist de Documentos: {admissaoCompleta.nome_candidato}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {admissaoCompleta.documentos_aprovados || 0} de {admissaoCompleta.total_documentos || 0} documentos aprovados
                  </Typography>
                </Box>
                {admissaoCompleta.documentos_pendentes && admissaoCompleta.documentos_pendentes > 0 && (
                  <Chip
                    label={`${admissaoCompleta.documentos_pendentes} pendente(s)`}
                    color="warning"
                    size="small"
                  />
                )}
              </Box>

              {admissaoCompleta.documentos && admissaoCompleta.documentos.length > 0 ? (
                <TableContainer component={Paper} elevation={0}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Documento</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Responsável</TableCell>
                        <TableCell>Prazo</TableCell>
                        <TableCell>Data Recebimento</TableCell>
                        <TableCell align="right">Ações</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {admissaoCompleta.documentos.map((doc) => (
                        <TableRow key={doc.id} hover>
                          <TableCell>
                            <Box>
                              <Typography variant="body2" fontWeight={600}>
                                {doc.nome_documento}
                              </Typography>
                              {doc.obrigatorio && (
                                <Chip label="Obrigatório" size="small" color="error" sx={{ mt: 0.5 }} />
                              )}
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={doc.status}
                              size="small"
                              color={getDocumentoStatusColor(doc.status)}
                            />
                          </TableCell>
                          <TableCell>
                            {doc.responsavel_nome || '-'}
                          </TableCell>
                          <TableCell>
                            {doc.prazo_entrega ? (
                              <Typography
                                variant="body2"
                                color={
                                  new Date(doc.prazo_entrega) < new Date() && doc.status === 'PENDENTE'
                                    ? 'error'
                                    : 'text.secondary'
                                }
                              >
                                {formatarData(doc.prazo_entrega)}
                              </Typography>
                            ) : (
                              '-'
                            )}
                          </TableCell>
                          <TableCell>
                            {doc.data_recebimento ? formatarData(doc.data_recebimento) : '-'}
                          </TableCell>
                          <TableCell align="right">
                            {doc.status === 'PENDENTE' && (
                              <Tooltip title="Enviar Documento">
                                <IconButton
                                  size="small"
                                  color="primary"
                                  onClick={() => handleAbrirUpload(doc.id)}
                                >
                                  <UploadIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            )}
                            {doc.status === 'RECEBIDO' && (
                              <>
                                <Tooltip title="Aprovar">
                                  <IconButton
                                    size="small"
                                    color="success"
                                    onClick={() => handleValidarDocumento(doc.id, true)}
                                  >
                                    <CheckCircleIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Reprovar">
                                  <IconButton
                                    size="small"
                                    color="error"
                                    onClick={() => handleValidarDocumento(doc.id, false)}
                                  >
                                    <CancelIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                              </>
                            )}
                            {doc.arquivo_url && (
                              <Tooltip title="Visualizar">
                                <IconButton
                                  size="small"
                                  onClick={() => window.open(doc.arquivo_url, '_blank')}
                                >
                                  <VisibilityIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Alert severity="info">
                  Nenhum documento cadastrado para esta admissão
                </Alert>
              )}

              {admissaoCompleta.documentos && admissaoCompleta.documentos.some((d) => d.observacoes_validacao) && (
                <Box mt={3}>
                  <Typography variant="h6" gutterBottom>
                    Observações de Validação
                  </Typography>
                  {admissaoCompleta.documentos
                    .filter((d) => d.observacoes_validacao)
                    .map((doc) => (
                      <Alert
                        key={doc.id}
                        severity={doc.status === 'APROVADO' ? 'success' : 'error'}
                        sx={{ mb: 1 }}
                      >
                        <Typography variant="body2" fontWeight={600}>
                          {doc.nome_documento}:
                        </Typography>
                        <Typography variant="body2">{doc.observacoes_validacao}</Typography>
                      </Alert>
                    ))}
                </Box>
              )}
            </Box>
          ) : (
            <Alert severity="warning">
              Não foi possível carregar o checklist de documentos
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
                  color="#354a80"
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <StatCard
                  title="Tempo Médio"
                  value={`${estatisticas.tempoMedioDias} dias`}
                  icon={<TimelineIcon />}
                  color="#0288d1"
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <StatCard
                  title="Documentos Pendentes"
                  value={estatisticas.documentosPendentes.toString()}
                  icon={<PendingIcon />}
                  color="#ed6c02"
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <StatCard
                  title="Em Andamento"
                  value={
                    estatisticas.porStatus.find((s) => s.status === 'EM_ANDAMENTO')?.total || '0'
                  }
                  icon={<CheckCircleIcon />}
                  color="#2e7d32"
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

      {/* Dialog de Upload de Documento */}
      <Dialog open={uploadDialogOpen} onClose={() => setUploadDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Enviar Documento</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <input
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              style={{ display: 'none' }}
              id="upload-documento"
              type="file"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  setArquivoSelecionado(e.target.files[0]);
                }
              }}
            />
            <label htmlFor="upload-documento">
              <Button
                variant="outlined"
                component="span"
                fullWidth
                startIcon={<UploadIcon />}
                sx={{ mb: 2 }}
              >
                Selecionar Arquivo
              </Button>
            </label>
            {arquivoSelecionado && (
              <Alert severity="success">
                Arquivo selecionado: <strong>{arquivoSelecionado.name}</strong>
                <br />
                <Typography variant="caption">
                  Tamanho: {(arquivoSelecionado.size / 1024 / 1024).toFixed(2)} MB
                </Typography>
              </Alert>
            )}
            <Alert severity="info" sx={{ mt: 2 }}>
              Formatos aceitos: PDF, DOC, DOCX, JPG, PNG
              <br />
              Tamanho máximo: 10 MB
            </Alert>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUploadDialogOpen(false)}>Cancelar</Button>
          <GradientButton
            onClick={handleUploadDocumento}
            disabled={!arquivoSelecionado || loading}
            startIcon={<UploadIcon />}
          >
            {loading ? <CircularProgress size={20} /> : 'Enviar'}
          </GradientButton>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

