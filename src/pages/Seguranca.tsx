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
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useNavigationLog } from '../hooks/useNavigationLog';
import { StatCard } from '../components/StatCard';
import {
  EstatisticasSeguranca,
  LogAcesso,
  Usuario,
  StatusUsuario,
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

export const Seguranca: React.FC = () => {
  useNavigationLog();
  
  const [tabAtual, setTabAtual] = useState(0);
  const [estatisticas] = useState<EstatisticasSeguranca>(estatisticasMock);
  const [usuarios] = useState<Usuario[]>(usuariosMock);
  const [logsAcesso] = useState<LogAcesso[]>(logsAcessoMock);

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
    };
    return cores[role] || 'default';
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
            <Typography variant="h6" gutterBottom>
              Logs de Alterações
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Em desenvolvimento - Logs de todas as alterações no sistema
            </Typography>
          </Box>
        </TabPanel>
      </Card>
    </Box>
  );
};

