import React, { useState } from 'react';
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

// Mock data
const estatisticasMock: EstatisticasIntegracoes = {
  totalIntegracoes: 4,
  integracoesAtivas: 2,
  integracoesInativas: 1,
  integracoesComErro: 1,
  sincronizacoesHoje: 24,
  sincronizacoesSemana: 168,
  sincronizacoesMes: 720,
  registrosProcessadosHoje: 1250,
  registrosProcessadosSemana: 8750,
  errosHoje: 3,
  errosSemana: 12,
  tempoMedioResposta: 1.8,
  sucessoRate: 98.5,
  integracoesPorTipo: [
    { tipo: TipoIntegracao.PONTO_ELETRONICO, quantidade: 1, ativas: 1 },
    { tipo: TipoIntegracao.EMAIL, quantidade: 1, ativas: 1 },
    { tipo: TipoIntegracao.WHATSAPP, quantidade: 1, ativas: 0 },
    { tipo: TipoIntegracao.API_EXTERNA, quantidade: 1, ativas: 0 },
  ],
  sincronizacoesPorDia: [
    { data: '2024-10-13', total: 22, sucesso: 22, falha: 0 },
    { data: '2024-10-14', total: 24, sucesso: 23, falha: 1 },
    { data: '2024-10-15', total: 24, sucesso: 24, falha: 0 },
  ],
};

const integracoesMock: Integracao[] = [
  {
    id: '1',
    nome: 'Ponto Eletrônico IDClass',
    tipo: TipoIntegracao.PONTO_ELETRONICO,
    status: StatusIntegracao.ATIVA,
    descricao: 'Integração com relógio de ponto facial IDClass',
    icone: 'access_time',
    cor: '#1976d2',
    configuracoes: {
      tipoAutenticacao: 'API_KEY',
    },
    ultimaSincronizacao: '2024-10-19T14:30:00',
    proximaSincronizacao: '2024-10-19T14:45:00',
    totalRegistros: 1250,
    registrosHoje: 48,
    errosHoje: 0,
    ativa: true,
    testeRealizado: true,
    dataUltimoTeste: '2024-10-15T10:00:00',
    criadoEm: '2024-01-01T00:00:00',
    criadoPor: 'Admin Sistema',
  },
  {
    id: '2',
    nome: 'E-mail Corporativo',
    tipo: TipoIntegracao.EMAIL,
    status: StatusIntegracao.ATIVA,
    descricao: 'Servidor SMTP para envio de e-mails',
    icone: 'email',
    cor: '#d32f2f',
    configuracoes: {
      tipoAutenticacao: 'BASIC',
    },
    totalRegistros: 3500,
    registrosHoje: 85,
    errosHoje: 2,
    ativa: true,
    testeRealizado: true,
    dataUltimoTeste: '2024-10-18T15:20:00',
    criadoEm: '2024-01-01T00:00:00',
    criadoPor: 'Admin Sistema',
  },
  {
    id: '3',
    nome: 'WhatsApp Business API',
    tipo: TipoIntegracao.WHATSAPP,
    status: StatusIntegracao.CONFIGURANDO,
    descricao: 'Envio de notificações via WhatsApp',
    icone: 'whatsapp',
    cor: '#25D366',
    configuracoes: {
      tipoAutenticacao: 'TOKEN',
    },
    totalRegistros: 0,
    registrosHoje: 0,
    errosHoje: 0,
    ativa: false,
    testeRealizado: false,
    criadoEm: '2024-10-15T00:00:00',
    criadoPor: 'Admin Sistema',
  },
  {
    id: '4',
    nome: 'API Externa - ERP',
    tipo: TipoIntegracao.API_EXTERNA,
    status: StatusIntegracao.ERRO,
    descricao: 'Integração com sistema ERP corporativo',
    icone: 'api',
    cor: '#f57c00',
    configuracoes: {
      tipoAutenticacao: 'OAUTH2',
    },
    totalRegistros: 520,
    registrosHoje: 0,
    errosHoje: 1,
    ativa: false,
    testeRealizado: true,
    dataUltimoTeste: '2024-10-19T08:00:00',
    resultadoTeste: {
      sucesso: false,
      mensagem: 'Falha na autenticação',
      detalhes: 'Token expirado',
      tempoResposta: 2.5,
      dataHoraTeste: '2024-10-19T08:00:00',
    },
    criadoEm: '2024-09-01T00:00:00',
    criadoPor: 'João Silva',
  },
];

export const Integracoes: React.FC = () => {
  useNavigationLog();

  const [tabAtual, setTabAtual] = useState(0);
  const [estatisticas] = useState<EstatisticasIntegracoes>(estatisticasMock);
  const [integracoes] = useState<Integracao[]>(integracoesMock);

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

  const handleSalvarConfigPonto = (config: any) => {
    console.log('Salvando config ponto:', config);
    alert('Configurações salvas com sucesso!');
  };

  const handleSalvarConfigEmail = (config: any) => {
    console.log('Salvando config email:', config);
    alert('Configurações salvas com sucesso!');
  };

  const handleSalvarConfigWhatsApp = (config: any) => {
    console.log('Salvando config whatsapp:', config);
    alert('Configurações salvas com sucesso!');
  };

  const handleTestar = () => {
    alert('Testando conexão...');
  };

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
                          <IconButton size="small">
                            <SyncIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Configurar">
                          <IconButton size="small">
                            <SettingsIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title={integracao.ativa ? 'Desativar' : 'Ativar'}>
                          <IconButton size="small">
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
            <ConfiguracaoPonto onSalvar={handleSalvarConfigPonto} onTestar={handleTestar} />
          </Box>
        </TabPanel>

        {/* Aba 3: E-mail */}
        <TabPanel value={tabAtual} index={3}>
          <Box p={3}>
            <ConfiguracaoEmailComponent
              onSalvar={handleSalvarConfigEmail}
              onTestar={handleTestar}
            />
          </Box>
        </TabPanel>

        {/* Aba 4: WhatsApp */}
        <TabPanel value={tabAtual} index={4}>
          <Box p={3}>
            <ConfiguracaoWhatsAppComponent
              onSalvar={handleSalvarConfigWhatsApp}
              onTestar={handleTestar}
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

