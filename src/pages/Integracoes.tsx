import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Card,
  Grid,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Tooltip,
  CircularProgress,
  Alert,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SyncIcon from '@mui/icons-material/Sync';
import SettingsIcon from '@mui/icons-material/Settings';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';
import { useNavigationLog } from '../hooks/useNavigationLog';
import { StatCard } from '../components/StatCard';
import {
  EstatisticasIntegracoes,
  Integracao,
  StatusIntegracao,
  TipoIntegracao,
  TipoAutenticacao,
} from '../types/integracoes';
import { formatarData } from '../utils/statusUtils';
import ApiIcon from '@mui/icons-material/Api';
import CloudSyncIcon from '@mui/icons-material/CloudSync';
import ErrorIcon from '@mui/icons-material/Error';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import EmailIcon from '@mui/icons-material/Email';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import ImportExportIcon from '@mui/icons-material/ImportExport';
import { ConfiguracaoPonto } from '../components/integracoes/ConfiguracaoPonto';
import { ConfiguracaoEmailComponent } from '../components/integracoes/ConfiguracaoEmail';
import { ConfiguracaoWhatsAppComponent } from '../components/integracoes/ConfiguracaoWhatsApp';
import { ImportacaoExportacao } from '../components/integracoes/ImportacaoExportacao';
import integracoesService from '../services/integracoesService';

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

export const Integracoes: React.FC = () => {
  useNavigationLog();

  const [tabAtual, setTabAtual] = useState(0);
  const [estatisticas, setEstatisticas] = useState<EstatisticasIntegracoes>({
    totalIntegracoes: 0,
    integracoesAtivas: 0,
    integracoesInativas: 0,
    integracoesComErro: 0,
    sincronizacoesHoje: 0,
    sincronizacoesSemana: 0,
    sincronizacoesMes: 0,
    registrosProcessadosHoje: 0,
    registrosProcessadosSemana: 0,
    errosHoje: 0,
    errosSemana: 0,
    tempoMedioResposta: 0,
    sucessoRate: 100,
    integracoesPorTipo: [],
    sincronizacoesPorDia: [],
  });
  const [integracoes, setIntegracoes] = useState<Integracao[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Carregar dados ao montar o componente
  useEffect(() => {
    carregarDados();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Carregar dados quando mudar de aba
  useEffect(() => {
    if (tabAtual === 0 || tabAtual === 1) {
      carregarDados();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tabAtual]);

  const carregarDados = async () => {
    try {
      setLoading(true);
      setError(null);

      // Carregar estatísticas e integrações em paralelo
      const [estatisticasData, integracoesData] = await Promise.all([
        integracoesService.getEstatisticas(),
        integracoesService.getAll(),
      ]);

      setEstatisticas(estatisticasData);
      setIntegracoes(integracoesData);
    } catch (err: any) {
      console.error('Erro ao carregar dados:', err);
      setError(err.message || 'Erro ao carregar dados de integrações');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: StatusIntegracao): string => {
    const cores: Record<StatusIntegracao, string> = {
      [StatusIntegracao.ATIVA]: '#388e3c',
      [StatusIntegracao.INATIVA]: '#757575',
      [StatusIntegracao.ERRO]: '#d32f2f',
      [StatusIntegracao.CONFIGURANDO]: '#f57c00',
      [StatusIntegracao.TESTANDO]: '#1976d2',
    };
    return cores[status];
  };

  const getTipoIcon = (tipo: TipoIntegracao) => {
    const icons: Record<TipoIntegracao, React.ReactNode> = {
      [TipoIntegracao.PONTO_ELETRONICO]: <AccessTimeIcon />,
      [TipoIntegracao.EMAIL]: <EmailIcon />,
      [TipoIntegracao.WHATSAPP]: <WhatsAppIcon />,
      [TipoIntegracao.API_EXTERNA]: <ApiIcon />,
      [TipoIntegracao.IMPORTACAO_EXPORTACAO]: <ImportExportIcon />,
    };
    return icons[tipo];
  };

  const handleSalvarConfigPonto = async (config: any) => {
    try {
      await integracoesService.salvarConfigPonto(config);
      alert('Configurações salvas com sucesso!');
      carregarDados();
    } catch (err: any) {
      alert(`Erro ao salvar configurações: ${err.message}`);
    }
  };

  const handleSalvarConfigEmail = async (config: any) => {
    try {
      await integracoesService.salvarConfigEmail(config);
      alert('Configurações salvas com sucesso!');
      carregarDados();
    } catch (err: any) {
      alert(`Erro ao salvar configurações: ${err.message}`);
    }
  };

  const handleSalvarConfigWhatsApp = async (config: any) => {
    try {
      await integracoesService.salvarConfigWhatsApp(config);
      alert('Configurações salvas com sucesso!');
      carregarDados();
    } catch (err: any) {
      alert(`Erro ao salvar configurações: ${err.message}`);
    }
  };

  const handleTestar = async (id?: string) => {
    if (!id) {
      alert('ID da integração não informado');
      return;
    }
    try {
      await integracoesService.testar(id);
      alert('Teste realizado com sucesso!');
      carregarDados();
    } catch (err: any) {
      alert(`Erro ao testar integração: ${err.message}`);
    }
  };

  const handleSincronizar = async (id: string) => {
    try {
      await integracoesService.sincronizar(id);
      alert('Sincronização iniciada!');
      carregarDados();
    } catch (err: any) {
      alert(`Erro ao sincronizar: ${err.message}`);
    }
  };

  const handleAtivarDesativar = async (integracao: Integracao) => {
    try {
      if (integracao.ativa) {
        await integracoesService.desativar(integracao.id);
        alert('Integração desativada com sucesso!');
      } else {
        await integracoesService.ativar(integracao.id);
        alert('Integração ativada com sucesso!');
      }
      carregarDados();
    } catch (err: any) {
      alert(`Erro ao alterar status: ${err.message}`);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button variant="contained" onClick={carregarDados}>
          Tentar Novamente
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      <Box mb={4} display="flex" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography variant="h4" gutterBottom fontWeight={600}>
            Integrações
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Configure e gerencie integrações com sistemas externos
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />}>
          Nova Integração
        </Button>
      </Box>

      <Card>
        <Tabs value={tabAtual} onChange={(_, v) => setTabAtual(v)}>
          <Tab label="Dashboard" />
          <Tab label="Todas Integrações" />
          <Tab label="Ponto Eletrônico" />
          <Tab label="E-mail" />
          <Tab label="WhatsApp" />
          <Tab label="Import/Export" />
        </Tabs>

        {/* Aba 0: Dashboard */}
        <TabPanel value={tabAtual} index={0}>
          <Box p={3}>
            <Grid container spacing={3} mb={4}>
              <Grid item xs={12} sm={6} md={3}>
                <StatCard
                  title="Total Integrações"
                  value={estatisticas.totalIntegracoes}
                  subtitle={`${estatisticas.integracoesAtivas} ativas`}
                  icon={<ApiIcon />}
                  color="#1976d2"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <StatCard
                  title="Sincronizações Hoje"
                  value={estatisticas.sincronizacoesHoje}
                  subtitle={`${estatisticas.registrosProcessadosHoje} registros`}
                  icon={<CloudSyncIcon />}
                  color="#388e3c"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <StatCard
                  title="Taxa de Sucesso"
                  value={`${estatisticas.sucessoRate}%`}
                  subtitle={`${estatisticas.errosHoje} erros hoje`}
                  icon={<CheckCircleIcon />}
                  color="#f57c00"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <StatCard
                  title="Com Erro"
                  value={estatisticas.integracoesComErro}
                  subtitle="Requer atenção"
                  icon={<ErrorIcon />}
                  color="#d32f2f"
                />
              </Grid>
            </Grid>

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card variant="outlined">
                  <Box p={2}>
                    <Typography variant="h6" gutterBottom>
                      Integrações por Tipo
                    </Typography>
                    {estatisticas.integracoesPorTipo.map((item) => (
                      <Box key={item.tipo} mb={2}>
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                          <Box display="flex" alignItems="center" gap={1}>
                            {getTipoIcon(item.tipo)}
                            <Typography variant="body2">{item.tipo.replace('_', ' ')}</Typography>
                          </Box>
                          <Typography variant="body2" fontWeight={600}>
                            {item.ativas}/{item.quantidade}
                          </Typography>
                        </Box>
                      </Box>
                    ))}
                  </Box>
                </Card>
              </Grid>

              <Grid item xs={12} md={6}>
                <Card variant="outlined">
                  <Box p={2}>
                    <Typography variant="h6" gutterBottom>
                      Sincronizações (Últimos 3 Dias)
                    </Typography>
                    {estatisticas.sincronizacoesPorDia.map((item) => (
                      <Box key={item.data} display="flex" justifyContent="space-between" mb={1}>
                        <Typography variant="body2">{formatarData(item.data)}</Typography>
                        <Box display="flex" gap={2}>
                          <Typography variant="body2" color="success.main">
                            ✓ {item.sucesso}
                          </Typography>
                          <Typography variant="body2" color="error.main">
                            ✗ {item.falha}
                          </Typography>
                        </Box>
                      </Box>
                    ))}
                  </Box>
                </Card>
              </Grid>
            </Grid>
          </Box>
        </TabPanel>

        {/* Aba 1: Todas Integrações */}
        <TabPanel value={tabAtual} index={1}>
          <Box p={3}>
            <TableContainer component={Paper} variant="outlined">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Integração</TableCell>
                    <TableCell>Tipo</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Última Sincronização</TableCell>
                    <TableCell align="center">Registros Hoje</TableCell>
                    <TableCell align="center">Erros</TableCell>
                    <TableCell align="center">Ações</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {integracoes.map((integracao) => (
                    <TableRow key={integracao.id}>
                      <TableCell>
                        <Box display="flex" alignItems="center" gap={1}>
                          {getTipoIcon(integracao.tipo)}
                          <Box>
                            <Typography variant="body2" fontWeight={600}>
                              {integracao.nome}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {integracao.descricao}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>{integracao.tipo.replace('_', ' ')}</TableCell>
                      <TableCell>
                        <Chip
                          label={integracao.status}
                          size="small"
                          sx={{ bgcolor: getStatusColor(integracao.status), color: 'white' }}
                        />
                      </TableCell>
                      <TableCell>
                        {integracao.ultimaSincronizacao
                          ? formatarData(integracao.ultimaSincronizacao)
                          : 'Nunca'}
                      </TableCell>
                      <TableCell align="center">{integracao.registrosHoje}</TableCell>
                      <TableCell align="center">
                        <Chip
                          label={integracao.errosHoje}
                          size="small"
                          color={integracao.errosHoje > 0 ? 'error' : 'default'}
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Tooltip title="Sincronizar Agora">
                          <IconButton size="small" onClick={() => handleSincronizar(integracao.id)}>
                            <SyncIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Configurar">
                          <IconButton size="small">
                            <SettingsIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title={integracao.ativa ? 'Desativar' : 'Ativar'}>
                          <IconButton size="small" onClick={() => handleAtivarDesativar(integracao)}>
                            {integracao.ativa ? (
                              <StopIcon fontSize="small" />
                            ) : (
                              <PlayArrowIcon fontSize="small" />
                            )}
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </TabPanel>

        {/* Aba 2: Ponto Eletrônico */}
        <TabPanel value={tabAtual} index={2}>
          <Box p={3}>
            <ConfiguracaoPonto 
              onSalvar={handleSalvarConfigPonto} 
              onTestar={() => {
                const pontoIntegracao = integracoes.find(i => i.tipo === TipoIntegracao.PONTO_ELETRONICO);
                if (pontoIntegracao) {
                  handleTestar(pontoIntegracao.id);
                } else {
                  alert('Nenhuma integração de ponto eletrônico encontrada');
                }
              }} 
            />
          </Box>
        </TabPanel>

        {/* Aba 3: E-mail */}
        <TabPanel value={tabAtual} index={3}>
          <Box p={3}>
            <ConfiguracaoEmailComponent
              onSalvar={handleSalvarConfigEmail}
              onTestar={() => {
                const emailIntegracao = integracoes.find(i => i.tipo === TipoIntegracao.EMAIL);
                if (emailIntegracao) {
                  handleTestar(emailIntegracao.id);
                } else {
                  alert('Nenhuma integração de e-mail encontrada');
                }
              }}
            />
          </Box>
        </TabPanel>

        {/* Aba 4: WhatsApp */}
        <TabPanel value={tabAtual} index={4}>
          <Box p={3}>
            <ConfiguracaoWhatsAppComponent
              onSalvar={handleSalvarConfigWhatsApp}
              onTestar={() => {
                const whatsappIntegracao = integracoes.find(i => i.tipo === TipoIntegracao.WHATSAPP);
                if (whatsappIntegracao) {
                  handleTestar(whatsappIntegracao.id);
                } else {
                  alert('Nenhuma integração de WhatsApp encontrada');
                }
              }}
            />
          </Box>
        </TabPanel>

        {/* Aba 5: Import/Export */}
        <TabPanel value={tabAtual} index={5}>
          <Box p={3}>
            <ImportacaoExportacao />
          </Box>
        </TabPanel>
      </Card>
    </Box>
  );
};

