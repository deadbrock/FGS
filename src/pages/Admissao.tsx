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
  DialogContentText,
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
  Block as BlockIcon,
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
  
  // Log do estado de admissoes quando muda
  useEffect(() => {
    console.log('🔄 [STATE] Estado de admissoes atualizado:', {
      length: admissoes.length,
      items: admissoes.map(a => ({ id: a.id, nome: a.nome_candidato }))
    });
  }, [admissoes]);
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
  
  // Estados para cancelamento
  const [cancelarDialogOpen, setCancelarDialogOpen] = useState(false);
  const [admissaoParaCancelar, setAdmissaoParaCancelar] = useState<Admissao | null>(null);
  const [motivoCancelamento, setMotivoCancelamento] = useState('');
  
  // Estados para reprovação de documento
  const [reprovarDialogOpen, setReprovarDialogOpen] = useState(false);
  const [documentoParaReprovar, setDocumentoParaReprovar] = useState<string | null>(null);
  const [motivoReprovacao, setMotivoReprovacao] = useState('');
  
  // Estados para envio Domínio Web
  const [enviarDominioDialogOpen, setEnviarDominioDialogOpen] = useState(false);

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
      console.log('📥 [FRONTEND] Resposta recebida:', {
        hasData: !!response.data,
        dataLength: Array.isArray(response.data) ? response.data.length : 'não é array',
        dataType: typeof response.data,
        pagination: response.pagination,
        firstItem: Array.isArray(response.data) && response.data[0] ? {
          id: response.data[0].id,
          nome_candidato: response.data[0].nome_candidato,
          etapa_atual: response.data[0].etapa_atual,
          status: response.data[0].status
        } : null
      });
      
      // Garantir que seja um array
      const admissoesArray = Array.isArray(response.data) ? response.data : [];
      console.log('📥 [FRONTEND] Antes de setAdmissoes:', {
        admissoesArrayLength: admissoesArray.length,
        primeiroItem: admissoesArray[0] ? {
          id: admissoesArray[0].id,
          nome_candidato: admissoesArray[0].nome_candidato,
          etapa_atual: admissoesArray[0].etapa_atual,
          status: admissoesArray[0].status
        } : null
      });
      
      setAdmissoes(admissoesArray);
      setTotalAdmissoes(response.pagination?.total || 0);
      
      console.log('📥 [FRONTEND] Admissões definidas:', admissoesArray.length);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar admissões');
      console.error('❌ [FRONTEND] Erro ao carregar admissões:', err);
      console.error('❌ [FRONTEND] Detalhes do erro:', err.response?.data || err.message);
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
  // FLUXO ATUALIZADO: Envio para Domínio Web após validação de documentos
  const getEtapaLabel = (etapa: EtapaWorkflow) => {
    const labels: Record<EtapaWorkflow, string> = {
      SOLICITACAO_VAGA: '1. Solicitação de Vaga (Gestor)',
      APROVACAO: '2. Aprovação (RH)',
      COLETA_DOCUMENTOS: '3. Coleta de Documentos (Candidato)',
      EXAME_ADMISSIONAL: '4. Exame Admissional (SST)',
      VALIDACAO_DOCUMENTOS: '5. Validação de Documentos (DP)',
      ENVIO_DOMINIO_WEB: '6. Envio para Domínio Web (DP)',
      GERACAO_CONTRATO: '7. Geração de Contrato (Domínio Web)',
      ASSINATURA_DIGITAL: '8. Assinatura Digital',
      ENVIO_ESOCIAL: '9. Envio eSocial',
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

  // Abrir dialog de reprovação
  const handleAbrirReprovacao = (documentoId: string) => {
    setDocumentoParaReprovar(documentoId);
    setMotivoReprovacao('');
    setReprovarDialogOpen(true);
  };

  // Validar documento (aprovar ou reprovar)
  const handleValidarDocumento = async (documentoId: string, aprovado: boolean, observacoes?: string) => {
    if (!admissaoSelecionada) return;

    try {
      setLoading(true);
      setError(null);
      await admissaoService.validarDocumento(documentoId, {
        status: aprovado ? 'APROVADO' : 'REPROVADO',
        observacoes_validacao: observacoes,
      });
      await carregarDetalhesAdmissao(admissaoSelecionada.id);
      
      // Fechar dialog de reprovação se estiver aberto
      if (reprovarDialogOpen) {
        setReprovarDialogOpen(false);
        setDocumentoParaReprovar(null);
        setMotivoReprovacao('');
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao validar documento');
    } finally {
      setLoading(false);
    }
  };

  // Reprovar documento com motivo
  const handleReprovarDocumento = async () => {
    if (!documentoParaReprovar) return;
    
    if (!motivoReprovacao.trim()) {
      setError('Por favor, informe o motivo da reprovação');
      return;
    }

    await handleValidarDocumento(documentoParaReprovar, false, motivoReprovacao);
  };

  // Enviar para Domínio Web
  const handleEnviarParaDominioWeb = async () => {
    if (!admissaoSelecionada) return;

    try {
      setLoading(true);
      setError(null);
      await admissaoService.enviarParaDominioWeb(admissaoSelecionada.id);
      setEnviarDominioDialogOpen(false);
      await carregarDetalhesAdmissao(admissaoSelecionada.id);
      carregarAdmissoes();
    } catch (err: any) {
      setError(err.message || 'Erro ao enviar para Domínio Web');
    } finally {
      setLoading(false);
    }
  };

  // Abrir dialog de cancelamento
  const handleAbrirCancelamento = (admissao: Admissao) => {
    setAdmissaoParaCancelar(admissao);
    setMotivoCancelamento('');
    setCancelarDialogOpen(true);
  };

  // Cancelar admissão
  const handleCancelarAdmissao = async () => {
    if (!admissaoParaCancelar) return;

    try {
      setLoading(true);
      setError(null);
      await admissaoService.cancelar(admissaoParaCancelar.id, motivoCancelamento);
      setCancelarDialogOpen(false);
      setAdmissaoParaCancelar(null);
      setMotivoCancelamento('');
      carregarAdmissoes();
    } catch (err: any) {
      setError(err.message || 'Erro ao cancelar admissão');
    } finally {
      setLoading(false);
    }
  };

  // Obter índice da etapa atual no stepper
  // FLUXO ATUALIZADO: Envio para Domínio Web após validação de documentos
  const getEtapaIndex = (etapa: EtapaWorkflow): number => {
    const etapas: EtapaWorkflow[] = [
      'SOLICITACAO_VAGA',      // 1. Gestor solicita vaga
      'APROVACAO',             // 2. RH aprova
      'COLETA_DOCUMENTOS',     // 3. Candidato envia documentos
      'EXAME_ADMISSIONAL',     // 4. SST realiza exame
      'VALIDACAO_DOCUMENTOS',  // 5. DP valida documentos
      'ENVIO_DOMINIO_WEB',     // 6. DP envia para Domínio Web (NOVA ETAPA)
      'GERACAO_CONTRATO',      // 7. Domínio Web gera contrato
      'ASSINATURA_DIGITAL',    // 8. Colaborador assina
      'ENVIO_ESOCIAL',         // 9. Sistema envia para eSocial
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
                  <MenuItem value="SOLICITACAO_VAGA">1. Solicitação de Vaga</MenuItem>
                  <MenuItem value="APROVACAO">2. Aprovação</MenuItem>
                  <MenuItem value="COLETA_DOCUMENTOS">3. Coleta de Documentos</MenuItem>
                  <MenuItem value="EXAME_ADMISSIONAL">4. Exame Admissional (SST)</MenuItem>
                  <MenuItem value="VALIDACAO_DOCUMENTOS">5. Validação de Documentos (DP)</MenuItem>
                  <MenuItem value="ENVIO_DOMINIO_WEB">6. Envio para Domínio Web (DP)</MenuItem>
                  <MenuItem value="GERACAO_CONTRATO">7. Geração de Contrato</MenuItem>
                  <MenuItem value="ASSINATURA_DIGITAL">8. Assinatura Digital</MenuItem>
                  <MenuItem value="ENVIO_ESOCIAL">9. Envio eSocial</MenuItem>
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
                  {(() => {
                    console.log('🎨 [RENDER] Renderizando tabela:', {
                      admissoesLength: admissoes.length,
                      loading,
                      primeiroItem: admissoes[0] ? {
                        id: admissoes[0].id,
                        nome_candidato: admissoes[0].nome_candidato
                      } : null
                    });
                    return null;
                  })()}
                  {(() => {
                    console.log('🔍 [RENDER] Verificando condição:', {
                      admissoesLength: admissoes.length,
                      isZero: admissoes.length === 0,
                      admissoesArray: admissoes
                    });
                    return null;
                  })()}
                  {admissoes.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                        <Typography color="text.secondary">
                          Nenhuma admissão encontrada
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    (() => {
                      console.log('✅ [RENDER] Entrando no map, total de admissoes:', admissoes.length);
                      return admissoes.map((admissao) => {
                      try {
                        console.log('🎨 [RENDER] Renderizando linha da tabela:', {
                          id: admissao.id,
                          nome: admissao.nome_candidato,
                          temEmail: !!admissao.email_candidato,
                          temCargo: !!admissao.cargo,
                          temDepartamento: !!admissao.departamento,
                          temEtapa: !!admissao.etapa_atual,
                          temStatus: !!admissao.status,
                          temDataSolicitacao: !!admissao.data_solicitacao
                        });
                        
                        return (
                          <TableRow key={admissao.id} hover>
                            <TableCell>
                              <Box>
                                <Typography variant="body2" fontWeight={600}>
                                  {admissao.nome_candidato || 'N/A'}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {admissao.email_candidato || 'N/A'}
                                </Typography>
                              </Box>
                            </TableCell>
                            <TableCell>{admissao.cargo || 'N/A'}</TableCell>
                            <TableCell>{admissao.departamento || 'N/A'}</TableCell>
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
                                label={admissao.status || 'N/A'}
                                size="small"
                                color={getStatusColor(admissao.status)}
                              />
                            </TableCell>
                            <TableCell>{admissao.data_solicitacao ? formatarData(admissao.data_solicitacao) : 'N/A'}</TableCell>
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
                          {admissao.status !== 'CANCELADA' && admissao.status !== 'CONCLUIDA' && (
                            <Tooltip title="Cancelar Admissão">
                              <IconButton 
                                size="small" 
                                onClick={() => handleAbrirCancelamento(admissao)}
                                color="error"
                              >
                                <BlockIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          )}
                        </TableCell>
                      </TableRow>
                        );
                      } catch (error) {
                        console.error('❌ [RENDER] Erro ao renderizar linha:', error, admissao);
                        return (
                          <TableRow key={admissao.id}>
                            <TableCell colSpan={7} align="center">
                              <Typography color="error">
                                Erro ao renderizar admissão {admissao.id}
                              </Typography>
                            </TableCell>
                          </TableRow>
                        );
                      }
                    });
                    })()
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
                <Box display="flex" gap={2}>
                  {/* Botão para acessar SST quando na etapa de Exame Admissional */}
                  {admissaoCompleta.etapa_atual === 'EXAME_ADMISSIONAL' && (
                    <GradientButton
                      startIcon={<AssessmentIcon />}
                      onClick={() => window.open('/solicitacoes?tipo=ASO_ADMISSIONAL', '_blank')}
                      gradient="success"
                      sx={{ mr: 1 }}
                    >
                      Acessar Módulo SST
                    </GradientButton>
                  )}

                  {/* Botão específico para enviar para Domínio Web */}
                  {admissaoCompleta.status === 'EM_ANDAMENTO' && 
                   admissaoCompleta.etapa_atual === 'ENVIO_DOMINIO_WEB' && 
                   !admissaoCompleta.contrato_enviado_dominio && (
                    <GradientButton
                      startIcon={<SendIcon />}
                      onClick={() => setEnviarDominioDialogOpen(true)}
                      disabled={loading}
                      gradient="primary"
                    >
                      Enviar para Domínio Web
                    </GradientButton>
                  )}
                  
                  {/* Botão genérico para avançar etapa */}
                  {admissaoCompleta.status === 'EM_ANDAMENTO' && 
                   admissaoCompleta.etapa_atual !== 'ENVIO_DOMINIO_WEB' && (
                    <GradientButton
                      startIcon={<SendIcon />}
                      onClick={handleAvancarEtapa}
                      disabled={loading}
                    >
                      Avançar Etapa
                    </GradientButton>
                  )}
                </Box>
              </Box>

              <Stepper activeStep={getEtapaIndex(admissaoCompleta.etapa_atual)} orientation="vertical">
                {[
                  'SOLICITACAO_VAGA',      // 1. Gestor solicita vaga
                  'APROVACAO',             // 2. RH aprova
                  'COLETA_DOCUMENTOS',     // 3. Candidato envia documentos
                  'EXAME_ADMISSIONAL',     // 4. SST realiza exame
                  'VALIDACAO_DOCUMENTOS',  // 5. DP valida documentos
                  'ENVIO_DOMINIO_WEB',     // 6. DP envia para Domínio Web (NOVA ETAPA)
                  'GERACAO_CONTRATO',      // 7. Domínio Web gera contrato
                  'ASSINATURA_DIGITAL',    // 8. Colaborador assina
                  'ENVIO_ESOCIAL',         // 9. Sistema envia para eSocial
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

                          {etapaKey === 'EXAME_ADMISSIONAL' && isActive && (
                            <Alert severity="success" sx={{ mt: 2 }}>
                              <Typography variant="body2" gutterBottom>
                                ✅ Uma solicitação de ASO ADMISSIONAL foi criada automaticamente no módulo SST.
                              </Typography>
                              <Button
                                size="small"
                                variant="outlined"
                                startIcon={<AssessmentIcon />}
                                onClick={() => window.open('/solicitacoes?tipo=ASO_ADMISSIONAL', '_blank')}
                                sx={{ mt: 1 }}
                              >
                                Acessar Módulo SST
                              </Button>
                            </Alert>
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
                                    onClick={() => handleAbrirReprovacao(doc.id)}
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

      {/* Dialog de Cancelamento */}
      <Dialog open={cancelarDialogOpen} onClose={() => setCancelarDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Cancelar Admissão</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Tem certeza que deseja cancelar a admissão de <strong>{admissaoParaCancelar?.nome_candidato}</strong>?
            Esta ação não pode ser desfeita.
          </DialogContentText>
          <TextField
            fullWidth
            label="Motivo do Cancelamento (Opcional)"
            multiline
            rows={4}
            value={motivoCancelamento}
            onChange={(e) => setMotivoCancelamento(e.target.value)}
            placeholder="Descreva o motivo do cancelamento..."
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCancelarDialogOpen(false)}>Não Cancelar</Button>
          <Button 
            onClick={handleCancelarAdmissao} 
            color="error" 
            variant="contained"
            disabled={loading}
          >
            {loading ? <CircularProgress size={20} /> : 'Sim, Cancelar Admissão'}
          </Button>
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

      {/* Dialog de Reprovação de Documento */}
      <Dialog open={reprovarDialogOpen} onClose={() => setReprovarDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Reprovar Documento</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Por favor, informe o motivo da reprovação do documento. Esta informação será enviada para o RH.
          </DialogContentText>
          <TextField
            fullWidth
            label="Motivo da Reprovação *"
            multiline
            rows={4}
            value={motivoReprovacao}
            onChange={(e) => setMotivoReprovacao(e.target.value)}
            placeholder="Ex: Documento ilegível, data vencida, informações incompletas..."
            sx={{ mt: 2 }}
            required
            error={!motivoReprovacao.trim() && error !== null}
            helperText={!motivoReprovacao.trim() && error !== null ? 'Campo obrigatório' : ''}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setReprovarDialogOpen(false)}>Cancelar</Button>
          <Button 
            onClick={handleReprovarDocumento} 
            color="error" 
            variant="contained"
            disabled={loading || !motivoReprovacao.trim()}
          >
            {loading ? <CircularProgress size={20} /> : 'Reprovar Documento'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog de Envio para Domínio Web */}
      <Dialog open={enviarDominioDialogOpen} onClose={() => setEnviarDominioDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Enviar para Domínio Web</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Confirma o envio dos dados de <strong>{admissaoSelecionada?.nome_candidato}</strong> para o sistema Domínio Web?
          </DialogContentText>
          <Alert severity="info" sx={{ mt: 2 }}>
            <Typography variant="body2" gutterBottom>
              <strong>Dados que serão enviados:</strong>
            </Typography>
            <Typography variant="body2" component="div">
              • Dados pessoais (nome, CPF, email, telefone)
              <br />
              • Dados contratuais (cargo, departamento, salário)
              <br />
              • Endereço completo
              <br />
              • Documentos validados
            </Typography>
          </Alert>
          <Alert severity="warning" sx={{ mt: 2 }}>
            <Typography variant="body2">
              Após o envio, o Domínio Web irá gerar automaticamente o contrato de trabalho.
            </Typography>
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEnviarDominioDialogOpen(false)}>Cancelar</Button>
          <GradientButton 
            onClick={handleEnviarParaDominioWeb} 
            disabled={loading}
            startIcon={<SendIcon />}
          >
            {loading ? <CircularProgress size={20} /> : 'Confirmar Envio'}
          </GradientButton>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

