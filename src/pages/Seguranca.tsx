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
  Avatar,
  TextField,
  MenuItem,
  InputAdornment,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Collapse,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import DownloadIcon from '@mui/icons-material/Download';
import RefreshIcon from '@mui/icons-material/Refresh';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import InfoIcon from '@mui/icons-material/Info';
import { useNavigationLog } from '../hooks/useNavigationLog';
import { StatCard } from '../components/StatCard';
import {
  EstatisticasSeguranca,
  LogAcesso,
  LogAlteracao,
  Usuario,
  StatusUsuario,
  TipoAcao,
} from '../types/seguranca';
import { UserRole } from '../types';
import { formatarData } from '../utils/statusUtils';
import PeopleIcon from '@mui/icons-material/People';
import SecurityIcon from '@mui/icons-material/Security';
import WarningIcon from '@mui/icons-material/Warning';
import HistoryIcon from '@mui/icons-material/History';

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
const estatisticasMock: EstatisticasSeguranca = {
  totalUsuarios: 15,
  usuariosAtivos: 12,
  usuariosInativos: 2,
  usuariosBloqueados: 1,
  acessosHoje: 48,
  tentativasFalhasHoje: 3,
  acessosUltimos7Dias: [
    { data: '2024-10-13', sucessos: 45, falhas: 2 },
    { data: '2024-10-14', sucessos: 52, falhas: 1 },
    { data: '2024-10-15', sucessos: 48, falhas: 3 },
  ],
  totalLogsAcesso: 1250,
  totalLogsAlteracao: 3840,
  usuariosPorPerfil: [
    { perfil: UserRole.ADMINISTRADOR, quantidade: 2, percentual: 13.3 },
    { perfil: UserRole.RH, quantidade: 3, percentual: 20 },
    { perfil: UserRole.GESTOR, quantidade: 5, percentual: 33.3 },
    { perfil: UserRole.COLABORADOR, quantidade: 5, percentual: 33.3 },
  ],
  alertas: [
    {
      id: '1',
      tipo: 'AVISO',
      titulo: 'Tentativas de Login Falhadas',
      mensagem: '3 tentativas falhadas detectadas hoje',
      dataHora: new Date().toISOString(),
    },
  ],
};

const usuariosMock: Usuario[] = [
  {
    id: '1',
    nome: 'Admin Sistema',
    email: 'admin@fgs.com',
    role: UserRole.ADMINISTRADOR,
    status: StatusUsuario.ATIVO,
    departamento: 'TI',
    cargo: 'Administrador',
    ultimoAcesso: '2024-10-19T10:30:00',
    tentativasLogin: 0,
    senhaExpirada: false,
    permissoesCustomizadas: [],
    criadoPor: 'Sistema',
    criadoEm: '2024-01-01T00:00:00',
  },
];

const logsAcessoMock: LogAcesso[] = [
  {
    id: '1',
    usuarioId: '1',
    usuarioNome: 'Admin Sistema',
    email: 'admin@fgs.com',
    role: UserRole.ADMINISTRADOR,
    dataHora: '2024-10-19T10:30:00',
    ip: '192.168.1.100',
    navegador: 'Chrome 118',
    dispositivo: 'Desktop',
    sucesso: true,
    acao: 'LOGIN',
  },
  {
    id: '2',
    usuarioId: '2',
    usuarioNome: 'João Silva',
    email: 'joao@fgs.com',
    role: UserRole.RH,
    dataHora: '2024-10-19T09:15:00',
    ip: '192.168.1.105',
    navegador: 'Firefox 119',
    dispositivo: 'Desktop',
    sucesso: false,
    motivoFalha: 'Senha incorreta',
    acao: 'TENTATIVA_FALHA',
  },
];

const logsAlteracaoMock: LogAlteracao[] = [
  {
    id: '1',
    usuarioId: '1',
    usuarioNome: 'Admin Sistema',
    role: UserRole.ADMINISTRADOR,
    dataHora: '2024-11-11T14:30:00',
    modulo: 'Prontuário',
    acao: TipoAcao.EDITAR,
    entidade: 'Colaborador',
    entidadeId: 'COL-001',
    camposAlterados: [
      { campo: 'Salário', valorAnterior: 'R$ 3.500,00', valorNovo: 'R$ 4.200,00' },
      { campo: 'Cargo', valorAnterior: 'Assistente', valorNovo: 'Analista Jr' },
    ],
    ip: '192.168.1.100',
    navegador: 'Chrome 118',
  },
  {
    id: '2',
    usuarioId: '2',
    usuarioNome: 'Maria RH',
    role: UserRole.RH,
    dataHora: '2024-11-11T13:15:00',
    modulo: 'Benefícios',
    acao: TipoAcao.CRIAR,
    entidade: 'Benefício',
    entidadeId: 'BEN-045',
    camposAlterados: [
      { campo: 'Nome', valorAnterior: '', valorNovo: 'Vale Alimentação Premium' },
      { campo: 'Valor', valorAnterior: '', valorNovo: 'R$ 800,00' },
      { campo: 'Tipo', valorAnterior: '', valorNovo: 'Mensal' },
    ],
    ip: '192.168.1.105',
    navegador: 'Firefox 119',
  },
  {
    id: '3',
    usuarioId: '1',
    usuarioNome: 'Admin Sistema',
    role: UserRole.ADMINISTRADOR,
    dataHora: '2024-11-11T11:45:00',
    modulo: 'Segurança',
    acao: TipoAcao.EDITAR,
    entidade: 'Usuário',
    entidadeId: 'USR-015',
    camposAlterados: [
      { campo: 'Perfil', valorAnterior: 'COLABORADOR', valorNovo: 'GESTOR' },
      { campo: 'Status', valorAnterior: 'PENDENTE', valorNovo: 'ATIVO' },
    ],
    ip: '192.168.1.100',
    navegador: 'Chrome 118',
  },
  {
    id: '4',
    usuarioId: '3',
    usuarioNome: 'João Gestor',
    role: UserRole.GESTOR,
    dataHora: '2024-11-11T10:20:00',
    modulo: 'Treinamentos',
    acao: TipoAcao.CRIAR,
    entidade: 'Treinamento',
    entidadeId: 'TRE-123',
    camposAlterados: [
      { campo: 'Título', valorAnterior: '', valorNovo: 'Segurança no Trabalho 2024' },
      { campo: 'Data', valorAnterior: '', valorNovo: '15/11/2024' },
      { campo: 'Participantes', valorAnterior: '', valorNovo: '25' },
    ],
    ip: '192.168.1.110',
    navegador: 'Edge 119',
  },
  {
    id: '5',
    usuarioId: '2',
    usuarioNome: 'Maria RH',
    role: UserRole.RH,
    dataHora: '2024-11-11T09:30:00',
    modulo: 'Ponto',
    acao: TipoAcao.EDITAR,
    entidade: 'Registro de Ponto',
    entidadeId: 'PNT-789',
    camposAlterados: [
      { campo: 'Hora Entrada', valorAnterior: '09:15', valorNovo: '08:00' },
      { campo: 'Justificativa', valorAnterior: '', valorNovo: 'Ajuste aprovado pelo gestor' },
    ],
    ip: '192.168.1.105',
    navegador: 'Firefox 119',
  },
  {
    id: '6',
    usuarioId: '1',
    usuarioNome: 'Admin Sistema',
    role: UserRole.ADMINISTRADOR,
    dataHora: '2024-11-10T16:45:00',
    modulo: 'Usuários',
    acao: TipoAcao.EXCLUIR,
    entidade: 'Usuário',
    entidadeId: 'USR-099',
    camposAlterados: [
      { campo: 'Nome', valorAnterior: 'Carlos Teste', valorNovo: '[EXCLUÍDO]' },
      { campo: 'Email', valorAnterior: 'carlos@teste.com', valorNovo: '[EXCLUÍDO]' },
      { campo: 'Motivo', valorAnterior: '', valorNovo: 'Desligamento da empresa' },
    ],
    ip: '192.168.1.100',
    navegador: 'Chrome 118',
  },
  {
    id: '7',
    usuarioId: '2',
    usuarioNome: 'Maria RH',
    role: UserRole.RH,
    dataHora: '2024-11-10T15:20:00',
    modulo: 'Prontuário',
    acao: TipoAcao.CRIAR,
    entidade: 'Evento Histórico',
    entidadeId: 'EVT-234',
    camposAlterados: [
      { campo: 'Tipo', valorAnterior: '', valorNovo: 'ADVERTÊNCIA' },
      { campo: 'Colaborador', valorAnterior: '', valorNovo: 'João Silva' },
      { campo: 'Motivo', valorAnterior: '', valorNovo: 'Atraso recorrente' },
    ],
    ip: '192.168.1.105',
    navegador: 'Firefox 119',
  },
  {
    id: '8',
    usuarioId: '3',
    usuarioNome: 'João Gestor',
    role: UserRole.GESTOR,
    dataHora: '2024-11-10T14:10:00',
    modulo: 'Comunicação',
    acao: TipoAcao.CRIAR,
    entidade: 'Comunicado',
    entidadeId: 'COM-056',
    camposAlterados: [
      { campo: 'Título', valorAnterior: '', valorNovo: 'Reunião Geral - Novembro' },
      { campo: 'Destinatários', valorAnterior: '', valorNovo: 'Todos os colaboradores' },
      { campo: 'Prioridade', valorAnterior: '', valorNovo: 'Alta' },
    ],
    ip: '192.168.1.110',
    navegador: 'Edge 119',
  },
  {
    id: '9',
    usuarioId: '1',
    usuarioNome: 'Admin Sistema',
    role: UserRole.ADMINISTRADOR,
    dataHora: '2024-11-10T11:30:00',
    modulo: 'Configurações',
    acao: TipoAcao.EDITAR,
    entidade: 'Configuração Sistema',
    entidadeId: 'CFG-001',
    camposAlterados: [
      { campo: 'Backup Automático', valorAnterior: false, valorNovo: true },
      { campo: 'Intervalo Backup', valorAnterior: '24h', valorNovo: '12h' },
    ],
    ip: '192.168.1.100',
    navegador: 'Chrome 118',
  },
  {
    id: '10',
    usuarioId: '2',
    usuarioNome: 'Maria RH',
    role: UserRole.RH,
    dataHora: '2024-11-10T10:00:00',
    modulo: 'Relatórios',
    acao: TipoAcao.EXPORTAR,
    entidade: 'Relatório',
    entidadeId: 'REL-089',
    camposAlterados: [
      { campo: 'Tipo', valorAnterior: '', valorNovo: 'Folha de Pagamento' },
      { campo: 'Período', valorAnterior: '', valorNovo: 'Outubro 2024' },
      { campo: 'Formato', valorAnterior: '', valorNovo: 'PDF' },
    ],
    ip: '192.168.1.105',
    navegador: 'Firefox 119',
  },
];

export const Seguranca: React.FC = () => {
  useNavigationLog();
  
  const [tabAtual, setTabAtual] = useState(0);
  const [estatisticas] = useState<EstatisticasSeguranca>(estatisticasMock);
  const [usuarios] = useState<Usuario[]>(usuariosMock);
  const [logsAcesso] = useState<LogAcesso[]>(logsAcessoMock);
  const [logsAlteracao, setLogsAlteracao] = useState<LogAlteracao[]>(logsAlteracaoMock);
  
  // Estados para filtros e busca de Logs de Alterações
  const [buscaLog, setBuscaLog] = useState('');
  const [filtroModulo, setFiltroModulo] = useState('TODOS');
  const [filtroAcao, setFiltroAcao] = useState('TODOS');
  const [logExpandido, setLogExpandido] = useState<string | null>(null);
  const [detalhesDialog, setDetalhesDialog] = useState<LogAlteracao | null>(null);

  const getStatusColor = (status: StatusUsuario): string => {
    const cores: Record<StatusUsuario, string> = {
      [StatusUsuario.ATIVO]: '#388e3c',
      [StatusUsuario.INATIVO]: '#757575',
      [StatusUsuario.BLOQUEADO]: '#d32f2f',
      [StatusUsuario.PENDENTE]: '#f57c00',
    };
    return cores[status];
  };

  const getRoleColor = (role: UserRole): 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' => {
    const cores: Record<UserRole, any> = {
      [UserRole.ADMINISTRADOR]: 'error',
      [UserRole.RH]: 'primary',
      [UserRole.GESTOR]: 'info',
      [UserRole.COLABORADOR]: 'default',
      [UserRole.SEGURANCA_TRABALHO]: 'warning',
    };
    return cores[role] || 'default';
  };

  const getAcaoColor = (acao: TipoAcao): 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' => {
    const cores: Record<TipoAcao, any> = {
      [TipoAcao.CRIAR]: 'success',
      [TipoAcao.EDITAR]: 'info',
      [TipoAcao.VISUALIZAR]: 'default',
      [TipoAcao.EXCLUIR]: 'error',
      [TipoAcao.EXPORTAR]: 'warning',
    };
    return cores[acao] || 'default';
  };

  // Filtrar logs de alteração
  const logsFiltrados = logsAlteracao.filter((log) => {
    const matchBusca = 
      log.usuarioNome.toLowerCase().includes(buscaLog.toLowerCase()) ||
      log.modulo.toLowerCase().includes(buscaLog.toLowerCase()) ||
      log.entidade.toLowerCase().includes(buscaLog.toLowerCase()) ||
      log.entidadeId.toLowerCase().includes(buscaLog.toLowerCase());
    
    const matchModulo = filtroModulo === 'TODOS' || log.modulo === filtroModulo;
    const matchAcao = filtroAcao === 'TODOS' || log.acao === filtroAcao;
    
    return matchBusca && matchModulo && matchAcao;
  });

  // Obter módulos únicos
  const modulosUnicos = ['TODOS', ...Array.from(new Set(logsAlteracaoMock.map(l => l.modulo)))];

  // Exportar logs
  const handleExportarLogs = () => {
    const csvContent = [
      ['Data/Hora', 'Usuário', 'Perfil', 'Módulo', 'Ação', 'Entidade', 'ID', 'Alterações'].join(';'),
      ...logsFiltrados.map(log => [
        formatarData(log.dataHora),
        log.usuarioNome,
        log.role,
        log.modulo,
        log.acao,
        log.entidade,
        log.entidadeId,
        log.camposAlterados.map(c => `${c.campo}: ${c.valorAnterior} → ${c.valorNovo}`).join(' | ')
      ].join(';'))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `logs_alteracoes_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  // Atualizar logs (simular)
  const handleAtualizarLogs = () => {
    setLogsAlteracao([...logsAlteracaoMock]);
    alert('Logs atualizados com sucesso!');
  };

  return (
    <Box>
      <Box mb={4} display="flex" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography variant="h4" gutterBottom fontWeight={600}>
            Segurança e Controle de Acesso
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Gestão de usuários, perfis e logs de acesso
          </Typography>
        </Box>
      </Box>

      <Card>
        <Tabs value={tabAtual} onChange={(_, v) => setTabAtual(v)}>
          <Tab label="Dashboard" />
          <Tab label="Usuários" />
          <Tab label="Logs de Acesso" />
          <Tab label="Logs de Alterações" />
        </Tabs>

        {/* Aba 0: Dashboard */}
        <TabPanel value={tabAtual} index={0}>
          <Box p={3}>
            <Grid container spacing={3} mb={4}>
              <Grid item xs={12} sm={6} md={3}>
                <StatCard
                  title="Total Usuários"
                  value={estatisticas.totalUsuarios}
                  subtitle={`${estatisticas.usuariosAtivos} ativos`}
                  icon={<PeopleIcon />}
                  color="#1976d2"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <StatCard
                  title="Acessos Hoje"
                  value={estatisticas.acessosHoje}
                  subtitle={`${estatisticas.tentativasFalhasHoje} falhas`}
                  icon={<SecurityIcon />}
                  color="#388e3c"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <StatCard
                  title="Usuários Bloqueados"
                  value={estatisticas.usuariosBloqueados}
                  icon={<WarningIcon />}
                  color="#d32f2f"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <StatCard
                  title="Total Logs"
                  value={estatisticas.totalLogsAcesso + estatisticas.totalLogsAlteracao}
                  subtitle={`${estatisticas.totalLogsAcesso} acessos`}
                  icon={<HistoryIcon />}
                  color="#f57c00"
                />
              </Grid>
            </Grid>

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card variant="outlined">
                  <Box p={2}>
                    <Typography variant="h6" gutterBottom>
                      Usuários por Perfil
                    </Typography>
                    {estatisticas.usuariosPorPerfil.map((item) => (
                      <Box key={item.perfil} mb={2}>
                        <Box display="flex" justifyContent="space-between" mb={0.5}>
                          <Typography variant="body2">{item.perfil}</Typography>
                          <Typography variant="body2" fontWeight={600}>
                            {item.quantidade} ({item.percentual.toFixed(1)}%)
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            height: 8,
                            bgcolor: '#e0e0e0',
                            borderRadius: 1,
                            overflow: 'hidden',
                          }}
                        >
                          <Box
                            sx={{
                              height: '100%',
                              width: `${item.percentual}%`,
                              bgcolor: '#1976d2',
                            }}
                          />
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
                      Acessos (Últimos 7 Dias)
                    </Typography>
                    {estatisticas.acessosUltimos7Dias.map((item) => (
                      <Box key={item.data} display="flex" justifyContent="space-between" mb={1}>
                        <Typography variant="body2">{formatarData(item.data)}</Typography>
                        <Box display="flex" gap={2}>
                          <Typography variant="body2" color="success.main">
                            ✓ {item.sucessos}
                          </Typography>
                          <Typography variant="body2" color="error.main">
                            ✗ {item.falhas}
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

        {/* Aba 1: Usuários */}
        <TabPanel value={tabAtual} index={1}>
          <Box p={3}>
            <Box display="flex" justifyContent="space-between" mb={3}>
              <Typography variant="h6">Gestão de Usuários</Typography>
              <Button variant="contained" startIcon={<AddIcon />}>
                Novo Usuário
              </Button>
            </Box>

            <TableContainer component={Paper} variant="outlined">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Usuário</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Perfil</TableCell>
                    <TableCell>Departamento</TableCell>
                    <TableCell>Último Acesso</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {usuarios.map((usuario) => (
                    <TableRow key={usuario.id}>
                      <TableCell>
                        <Box display="flex" alignItems="center" gap={1}>
                          <Avatar sx={{ width: 32, height: 32 }}>
                            {usuario.nome[0]}
                          </Avatar>
                          {usuario.nome}
                        </Box>
                      </TableCell>
                      <TableCell>{usuario.email}</TableCell>
                      <TableCell>
                        <Chip label={usuario.role} size="small" color={getRoleColor(usuario.role)} />
                      </TableCell>
                      <TableCell>{usuario.departamento || '-'}</TableCell>
                      <TableCell>
                        {usuario.ultimoAcesso ? formatarData(usuario.ultimoAcesso) : 'Nunca'}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={usuario.status}
                          size="small"
                          sx={{ bgcolor: getStatusColor(usuario.status), color: 'white' }}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </TabPanel>

        {/* Aba 2: Logs de Acesso */}
        <TabPanel value={tabAtual} index={2}>
          <Box p={3}>
            <Typography variant="h6" gutterBottom>
              Logs de Acesso
            </Typography>

            <TableContainer component={Paper} variant="outlined">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Data/Hora</TableCell>
                    <TableCell>Usuário</TableCell>
                    <TableCell>Perfil</TableCell>
                    <TableCell>IP</TableCell>
                    <TableCell>Navegador</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {logsAcesso.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell>{formatarData(log.dataHora)}</TableCell>
                      <TableCell>{log.usuarioNome}</TableCell>
                      <TableCell>
                        <Chip label={log.role} size="small" color={getRoleColor(log.role)} />
                      </TableCell>
                      <TableCell>{log.ip}</TableCell>
                      <TableCell>{log.navegador}</TableCell>
                      <TableCell>
                        {log.sucesso ? (
                          <Chip label="Sucesso" size="small" color="success" />
                        ) : (
                          <Chip label={log.motivoFalha || 'Falha'} size="small" color="error" />
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </TabPanel>

        {/* Aba 3: Logs de Alterações */}
        <TabPanel value={tabAtual} index={3}>
          <Box p={3}>
            {/* Cabeçalho e Filtros */}
            <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={3} flexWrap="wrap" gap={2}>
              <Box flex={1} minWidth="250px">
                <Typography variant="h6" gutterBottom>
                  Logs de Alterações do Sistema
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Histórico completo de todas as alterações realizadas ({logsFiltrados.length} registros)
                </Typography>
              </Box>
              
              <Box display="flex" gap={1}>
                <Tooltip title="Atualizar logs">
                  <IconButton onClick={handleAtualizarLogs} size="small">
                    <RefreshIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Exportar para CSV">
                  <IconButton onClick={handleExportarLogs} size="small">
                    <DownloadIcon />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>

            {/* Barra de Busca e Filtros */}
            <Grid container spacing={2} mb={3}>
              <Grid item xs={12} md={5}>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Buscar por usuário, módulo, entidade ou ID..."
                  value={buscaLog}
                  onChange={(e) => setBuscaLog(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  select
                  fullWidth
                  size="small"
                  label="Módulo"
                  value={filtroModulo}
                  onChange={(e) => setFiltroModulo(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <FilterListIcon fontSize="small" />
                      </InputAdornment>
                    ),
                  }}
                >
                  {modulosUnicos.map((modulo) => (
                    <MenuItem key={modulo} value={modulo}>
                      {modulo}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  select
                  fullWidth
                  size="small"
                  label="Tipo de Ação"
                  value={filtroAcao}
                  onChange={(e) => setFiltroAcao(e.target.value)}
                >
                  <MenuItem value="TODOS">Todas as Ações</MenuItem>
                  <MenuItem value={TipoAcao.CRIAR}>Criar</MenuItem>
                  <MenuItem value={TipoAcao.EDITAR}>Editar</MenuItem>
                  <MenuItem value={TipoAcao.EXCLUIR}>Excluir</MenuItem>
                  <MenuItem value={TipoAcao.EXPORTAR}>Exportar</MenuItem>
                  <MenuItem value={TipoAcao.VISUALIZAR}>Visualizar</MenuItem>
                </TextField>
              </Grid>
            </Grid>

            {/* Tabela de Logs */}
            <TableContainer component={Paper} variant="outlined">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell width="40px"></TableCell>
                    <TableCell>Data/Hora</TableCell>
                    <TableCell>Usuário</TableCell>
                    <TableCell>Módulo</TableCell>
                    <TableCell>Ação</TableCell>
                    <TableCell>Entidade</TableCell>
                    <TableCell>ID</TableCell>
                    <TableCell align="center">Alterações</TableCell>
                    <TableCell align="center">Detalhes</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {logsFiltrados.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} align="center">
                        <Box py={4}>
                          <Typography variant="body2" color="text.secondary">
                            Nenhum log encontrado com os filtros aplicados
                          </Typography>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ) : (
                    logsFiltrados.map((log) => (
                      <React.Fragment key={log.id}>
                        <TableRow 
                          hover 
                          sx={{ 
                            '& > *': { borderBottom: logExpandido === log.id ? 'none !important' : undefined },
                            cursor: 'pointer'
                          }}
                        >
                          <TableCell>
                            <IconButton
                              size="small"
                              onClick={() => setLogExpandido(logExpandido === log.id ? null : log.id)}
                            >
                              {logExpandido === log.id ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                            </IconButton>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {formatarData(log.dataHora)}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Box display="flex" alignItems="center" gap={1}>
                              <Avatar sx={{ width: 28, height: 28, fontSize: '0.875rem' }}>
                                {log.usuarioNome[0]}
                              </Avatar>
                              <Box>
                                <Typography variant="body2" fontWeight={600}>
                                  {log.usuarioNome}
                                </Typography>
                                <Chip 
                                  label={log.role} 
                                  size="small" 
                                  color={getRoleColor(log.role)}
                                  sx={{ height: '18px', fontSize: '0.65rem' }}
                                />
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Chip label={log.modulo} size="small" variant="outlined" />
                          </TableCell>
                          <TableCell>
                            <Chip 
                              label={log.acao} 
                              size="small" 
                              color={getAcaoColor(log.acao)}
                            />
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">{log.entidade}</Typography>
                          </TableCell>
                          <TableCell>
                            <Chip 
                              label={log.entidadeId} 
                              size="small" 
                              variant="outlined"
                              sx={{ fontFamily: 'monospace', fontSize: '0.7rem' }}
                            />
                          </TableCell>
                          <TableCell align="center">
                            <Chip 
                              label={log.camposAlterados.length} 
                              size="small" 
                              color="primary"
                              variant="outlined"
                            />
                          </TableCell>
                          <TableCell align="center">
                            <Tooltip title="Ver detalhes completos">
                              <IconButton 
                                size="small" 
                                onClick={() => setDetalhesDialog(log)}
                              >
                                <InfoIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                        
                        {/* Linha Expansível com Detalhes das Alterações */}
                        <TableRow>
                          <TableCell colSpan={9} sx={{ py: 0, px: 0 }}>
                            <Collapse in={logExpandido === log.id} timeout="auto" unmountOnExit>
                              <Box sx={{ p: 3, bgcolor: 'background.default' }}>
                                <Typography variant="subtitle2" gutterBottom fontWeight={600}>
                                  Campos Alterados:
                                </Typography>
                                <Grid container spacing={2}>
                                  {log.camposAlterados.map((campo, idx) => (
                                    <Grid item xs={12} md={6} key={idx}>
                                      <Card variant="outlined" sx={{ p: 2 }}>
                                        <Typography variant="caption" color="text.secondary" fontWeight={600}>
                                          {campo.campo}
                                        </Typography>
                                        <Box display="flex" alignItems="center" gap={1} mt={1}>
                                          <Chip 
                                            label={campo.valorAnterior || '(vazio)'} 
                                            size="small" 
                                            color="error"
                                            variant="outlined"
                                          />
                                          <Typography variant="body2" color="text.secondary">→</Typography>
                                          <Chip 
                                            label={campo.valorNovo || '(vazio)'} 
                                            size="small" 
                                            color="success"
                                            variant="outlined"
                                          />
                                        </Box>
                                      </Card>
                                    </Grid>
                                  ))}
                                </Grid>
                                <Box mt={2} display="flex" gap={2}>
                                  <Typography variant="caption" color="text.secondary">
                                    <strong>IP:</strong> {log.ip}
                                  </Typography>
                                  <Typography variant="caption" color="text.secondary">
                                    <strong>Navegador:</strong> {log.navegador}
                                  </Typography>
                                </Box>
                              </Box>
                            </Collapse>
                          </TableCell>
                        </TableRow>
                      </React.Fragment>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </TabPanel>
      </Card>

      {/* Dialog de Detalhes Completos */}
      <Dialog 
        open={detalhesDialog !== null} 
        onClose={() => setDetalhesDialog(null)}
        maxWidth="md"
        fullWidth
      >
        {detalhesDialog && (
          <>
            <DialogTitle>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h6">Detalhes da Alteração</Typography>
                <Chip 
                  label={detalhesDialog.acao} 
                  color={getAcaoColor(detalhesDialog.acao)}
                />
              </Box>
            </DialogTitle>
            <DialogContent dividers>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" color="text.secondary">Data/Hora</Typography>
                  <Typography variant="body2" fontWeight={600}>
                    {formatarData(detalhesDialog.dataHora)}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" color="text.secondary">Usuário</Typography>
                  <Typography variant="body2" fontWeight={600}>
                    {detalhesDialog.usuarioNome}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" color="text.secondary">Módulo</Typography>
                  <Typography variant="body2" fontWeight={600}>
                    {detalhesDialog.modulo}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" color="text.secondary">Entidade</Typography>
                  <Typography variant="body2" fontWeight={600}>
                    {detalhesDialog.entidade} ({detalhesDialog.entidadeId})
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" color="text.secondary">IP de Origem</Typography>
                  <Typography variant="body2" fontWeight={600}>
                    {detalhesDialog.ip}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" color="text.secondary">Navegador</Typography>
                  <Typography variant="body2" fontWeight={600}>
                    {detalhesDialog.navegador}
                  </Typography>
                </Grid>
              </Grid>

              <Typography variant="subtitle2" fontWeight={600} mt={3} mb={2}>
                Alterações Realizadas:
              </Typography>
              
              {detalhesDialog.camposAlterados.map((campo, idx) => (
                <Box key={idx} mb={2} p={2} sx={{ bgcolor: 'background.default', borderRadius: 1 }}>
                  <Typography variant="body2" fontWeight={600} gutterBottom>
                    {campo.campo}
                  </Typography>
                  <Box display="flex" alignItems="center" gap={2}>
                    <Box flex={1}>
                      <Typography variant="caption" color="text.secondary">Valor Anterior:</Typography>
                      <Typography variant="body2" sx={{ fontFamily: 'monospace', p: 1, bgcolor: 'background.paper', borderRadius: 1, mt: 0.5 }}>
                        {String(campo.valorAnterior) || '(vazio)'}
                      </Typography>
                    </Box>
                    <Typography variant="h6" color="text.secondary">→</Typography>
                    <Box flex={1}>
                      <Typography variant="caption" color="text.secondary">Valor Novo:</Typography>
                      <Typography variant="body2" sx={{ fontFamily: 'monospace', p: 1, bgcolor: 'background.paper', borderRadius: 1, mt: 0.5 }}>
                        {String(campo.valorNovo) || '(vazio)'}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              ))}
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDetalhesDialog(null)}>Fechar</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

