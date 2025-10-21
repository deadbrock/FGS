import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Typography,
  Card,
  CardContent,
  IconButton,
  Avatar,
  Chip,
  alpha,
  Paper,
  useTheme,
} from '@mui/material';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import PeopleIcon from '@mui/icons-material/People';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import SchoolIcon from '@mui/icons-material/School';
import FolderSharedIcon from '@mui/icons-material/FolderShared';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import CampaignIcon from '@mui/icons-material/Campaign';
import AssessmentIcon from '@mui/icons-material/Assessment';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import { useAuth } from '../hooks/useAuth';
import { useNavigationLog } from '../hooks/useNavigationLog';
import { useNavigate } from 'react-router-dom';
import { PageHeader, AnimatedCard } from '../components';

interface QuickAction {
  title: string;
  path: string;
  icon: React.ReactNode;
  color: string;
  count?: number;
}

// Dados para gráficos
const presencaData = [
  { mes: 'Jan', presenca: 92 },
  { mes: 'Fev', presenca: 89 },
  { mes: 'Mar', presenca: 94 },
  { mes: 'Abr', presenca: 91 },
  { mes: 'Mai', presenca: 95 },
  { mes: 'Jun', presenca: 94.5 },
];

const treinamentosData = [
  { nome: 'Segurança', valor: 45 },
  { nome: 'Técnicos', valor: 30 },
  { nome: 'Soft Skills', valor: 25 },
];

const colaboradoresData = [
  { mes: 'Jan', novos: 8, saidas: 3 },
  { mes: 'Fev', novos: 12, saidas: 5 },
  { mes: 'Mar', novos: 10, saidas: 2 },
  { mes: 'Abr', novos: 15, saidas: 4 },
  { mes: 'Mai', novos: 9, saidas: 3 },
  { mes: 'Jun', novos: 12, saidas: 2 },
];

const COLORS = ['#354a80', '#a2122a', '#f57c00', '#388e3c'];

// Componente de contador animado
const AnimatedCounter: React.FC<{ value: number; duration?: number }> = ({
  value,
  duration = 1000,
}) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number;
    let animationFrame: number;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = (currentTime - startTime) / duration;

      if (progress < 1) {
        setCount(Math.floor(value * progress));
        animationFrame = requestAnimationFrame(animate);
      } else {
        setCount(value);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [value, duration]);

  return <>{count}</>;
};

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  useNavigationLog();
  const navigate = useNavigate();
  const theme = useTheme();

  const [stats] = useState({
    totalColaboradores: 245,
    colaboradoresAtivos: 238,
    novosColaboradores: 12,
    taxaPresenca: 94.5,
    treinamentosPendentes: 8,
    atestadosMes: 15,
    beneficiosAtivos: 180,
    aniversariantes: 3,
  });

  const quickActions: QuickAction[] = [
    {
      title: 'Prontuário',
      path: '/prontuario',
      icon: <FolderSharedIcon />,
      color: '#354a80',
    },
    {
      title: 'Treinamentos',
      path: '/treinamentos',
      icon: <SchoolIcon />,
      color: '#1976d2',
      count: stats.treinamentosPendentes,
    },
    {
      title: 'Ponto',
      path: '/ponto',
      icon: <AccessTimeIcon />,
      color: '#388e3c',
    },
    {
      title: 'Benefícios',
      path: '/beneficios',
      icon: <CardGiftcardIcon />,
      color: '#f57c00',
    },
    {
      title: 'Comunicação',
      path: '/comunicacao',
      icon: <CampaignIcon />,
      color: '#a2122a',
    },
    {
      title: 'Relatórios',
      path: '/relatorios',
      icon: <AssessmentIcon />,
      color: '#6e0c1d',
    },
  ];

  return (
    <Box>
      <PageHeader
        title={`Olá, ${user?.nome}! 👋`}
        subtitle="Bem-vindo ao painel de controle do FGS"
      />

      {/* Cards de Estatísticas Premium com Animação */}
      <Grid container spacing={3} mb={4}>
        {/* Card 1 - Total Colaboradores */}
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              background: 'linear-gradient(135deg, #354a80 0%, #5f75b3 100%)',
              color: 'white',
              borderRadius: 4,
              position: 'relative',
              overflow: 'hidden',
              boxShadow: '0 8px 32px rgba(53, 74, 128, 0.3)',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-8px)',
                boxShadow: '0 12px 48px rgba(53, 74, 128, 0.4)',
              },
              '&::before': {
                content: '""',
                position: 'absolute',
                top: -50,
                right: -50,
                width: 200,
                height: 200,
                borderRadius: '50%',
                background: alpha('#fff', 0.1),
              },
            }}
          >
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                <Box sx={{ zIndex: 1 }}>
                  <Typography variant="body2" sx={{ opacity: 0.9, mb: 1 }}>
                    Total de Colaboradores
                  </Typography>
                  <Typography variant="h3" fontWeight={700} sx={{ mb: 1 }}>
                    <AnimatedCounter value={stats.totalColaboradores} />
                  </Typography>
                  <Box display="flex" alignItems="center">
                    <TrendingUpIcon sx={{ fontSize: 18, mr: 0.5 }} />
                    <Typography variant="caption">+5.2% este mês</Typography>
                  </Box>
                </Box>
                <Avatar
                  sx={{
                    bgcolor: alpha('#fff', 0.2),
                    width: 64,
                    height: 64,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  }}
                >
                  <PeopleIcon sx={{ fontSize: 36 }} />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Card 2 - Colaboradores Ativos */}
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              background: 'linear-gradient(135deg, #388e3c 0%, #66bb6a 100%)',
              color: 'white',
              borderRadius: 4,
              position: 'relative',
              overflow: 'hidden',
              boxShadow: '0 8px 32px rgba(56, 142, 60, 0.3)',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-8px)',
                boxShadow: '0 12px 48px rgba(56, 142, 60, 0.4)',
              },
              '&::before': {
                content: '""',
                position: 'absolute',
                top: -50,
                right: -50,
                width: 200,
                height: 200,
                borderRadius: '50%',
                background: alpha('#fff', 0.1),
              },
            }}
          >
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                <Box sx={{ zIndex: 1 }}>
                  <Typography variant="body2" sx={{ opacity: 0.9, mb: 1 }}>
                    Colaboradores Ativos
                  </Typography>
                  <Typography variant="h3" fontWeight={700} sx={{ mb: 1 }}>
                    <AnimatedCounter value={stats.colaboradoresAtivos} />
                  </Typography>
                  <Box display="flex" alignItems="center">
                    <CheckCircleIcon sx={{ fontSize: 18, mr: 0.5 }} />
                    <Typography variant="caption">
                      {((stats.colaboradoresAtivos / stats.totalColaboradores) * 100).toFixed(1)}%
                    </Typography>
                  </Box>
                </Box>
                <Avatar
                  sx={{
                    bgcolor: alpha('#fff', 0.2),
                    width: 64,
                    height: 64,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  }}
                >
                  <CheckCircleIcon sx={{ fontSize: 36 }} />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Card 3 - Treinamentos Pendentes */}
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              background: 'linear-gradient(135deg, #f57c00 0%, #ff9800 100%)',
              color: 'white',
              borderRadius: 4,
              position: 'relative',
              overflow: 'hidden',
              boxShadow: '0 8px 32px rgba(245, 124, 0, 0.3)',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-8px)',
                boxShadow: '0 12px 48px rgba(245, 124, 0, 0.4)',
              },
              '&::before': {
                content: '""',
                position: 'absolute',
                top: -50,
                right: -50,
                width: 200,
                height: 200,
                borderRadius: '50%',
                background: alpha('#fff', 0.1),
              },
            }}
          >
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                <Box sx={{ zIndex: 1 }}>
                  <Typography variant="body2" sx={{ opacity: 0.9, mb: 1 }}>
                    Treinamentos Pendentes
                  </Typography>
                  <Typography variant="h3" fontWeight={700} sx={{ mb: 1 }}>
                    <AnimatedCounter value={stats.treinamentosPendentes} />
                  </Typography>
                  <Box display="flex" alignItems="center">
                    <WarningIcon sx={{ fontSize: 18, mr: 0.5 }} />
                    <Typography variant="caption">Requer atenção</Typography>
                  </Box>
                </Box>
                <Avatar
                  sx={{
                    bgcolor: alpha('#fff', 0.2),
                    width: 64,
                    height: 64,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  }}
                >
                  <SchoolIcon sx={{ fontSize: 36 }} />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Card 4 - Taxa de Presença */}
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              background: 'linear-gradient(135deg, #a2122a 0%, #d4455d 100%)',
              color: 'white',
              borderRadius: 4,
              position: 'relative',
              overflow: 'hidden',
              boxShadow: '0 8px 32px rgba(162, 18, 42, 0.3)',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-8px)',
                boxShadow: '0 12px 48px rgba(162, 18, 42, 0.4)',
              },
              '&::before': {
                content: '""',
                position: 'absolute',
                top: -50,
                right: -50,
                width: 200,
                height: 200,
                borderRadius: '50%',
                background: alpha('#fff', 0.1),
              },
            }}
          >
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                <Box sx={{ zIndex: 1 }}>
                  <Typography variant="body2" sx={{ opacity: 0.9, mb: 1 }}>
                    Taxa de Presença
                  </Typography>
                  <Typography variant="h3" fontWeight={700} sx={{ mb: 1 }}>
                    <AnimatedCounter value={stats.taxaPresenca} />%
                  </Typography>
                  <Box display="flex" alignItems="center">
                    <AccessTimeIcon sx={{ fontSize: 18, mr: 0.5 }} />
                    <Typography variant="caption">Média mensal</Typography>
                  </Box>
                </Box>
                <Avatar
                  sx={{
                    bgcolor: alpha('#fff', 0.2),
                    width: 64,
                    height: 64,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  }}
                >
                  <AccessTimeIcon sx={{ fontSize: 36 }} />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Gráficos */}
      <Grid container spacing={3} mb={4}>
        {/* Gráfico de Presença */}
        <Grid item xs={12} lg={8}>
          <AnimatedCard delay={0.1}>
            <CardContent>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                📊 Evolução da Taxa de Presença
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={3}>
                Últimos 6 meses
              </Typography>
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={presencaData}>
                  <defs>
                    <linearGradient id="colorPresenca" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#354a80" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#354a80" stopOpacity={0.1} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={alpha(theme.palette.divider, 0.3)} />
                  <XAxis dataKey="mes" stroke={theme.palette.text.secondary} />
                  <YAxis stroke={theme.palette.text.secondary} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: theme.palette.background.paper,
                      border: `1px solid ${theme.palette.divider}`,
                      borderRadius: 8,
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="presenca"
                    stroke="#354a80"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorPresenca)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </AnimatedCard>
        </Grid>

        {/* Gráfico de Pizza - Treinamentos */}
        <Grid item xs={12} lg={4}>
          <AnimatedCard delay={0.15}>
            <CardContent>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                🎓 Treinamentos por Categoria
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={3}>
                Distribuição atual
              </Typography>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={treinamentosData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ nome, valor }) => `${nome}: ${valor}`}
                    outerRadius={90}
                    fill="#8884d8"
                    dataKey="valor"
                  >
                    {treinamentosData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </AnimatedCard>
        </Grid>

        {/* Gráfico de Barras - Movimentação */}
        <Grid item xs={12}>
          <AnimatedCard delay={0.2}>
            <CardContent>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                👥 Movimentação de Colaboradores
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={3}>
                Novos colaboradores vs Saídas
              </Typography>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={colaboradoresData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={alpha(theme.palette.divider, 0.3)} />
                  <XAxis dataKey="mes" stroke={theme.palette.text.secondary} />
                  <YAxis stroke={theme.palette.text.secondary} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: theme.palette.background.paper,
                      border: `1px solid ${theme.palette.divider}`,
                      borderRadius: 8,
                    }}
                  />
                  <Legend />
                  <Bar dataKey="novos" fill="#388e3c" name="Novos" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="saidas" fill="#a2122a" name="Saídas" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </AnimatedCard>
        </Grid>
      </Grid>

      {/* Atalhos Rápidos */}
      <AnimatedCard sx={{ mb: 4 }} delay={0.25}>
        <CardContent>
          <Typography variant="h5" fontWeight={600} gutterBottom>
            🚀 Acesso Rápido
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Navegue rapidamente pelos principais módulos do sistema
          </Typography>
          <Grid container spacing={2}>
            {quickActions.map((action) => (
              <Grid item xs={12} sm={6} md={4} key={action.path}>
                <Card
                  sx={{
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 3,
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: `0 12px 28px ${alpha(action.color, 0.25)}`,
                      borderColor: action.color,
                    },
                  }}
                  onClick={() => navigate(action.path)}
                >
                  <CardContent>
                    <Box display="flex" alignItems="center" justifyContent="space-between">
                      <Box display="flex" alignItems="center" gap={2}>
                        <Avatar
                          sx={{
                            bgcolor: alpha(action.color, 0.1),
                            width: 48,
                            height: 48,
                          }}
                        >
                          <Box sx={{ color: action.color }}>{action.icon}</Box>
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle1" fontWeight={600}>
                            {action.title}
                          </Typography>
                          {action.count !== undefined && (
                            <Chip
                              label={`${action.count} pendentes`}
                              size="small"
                              color="warning"
                              sx={{ mt: 0.5, fontWeight: 600 }}
                            />
                          )}
                        </Box>
                      </Box>
                      <IconButton size="small" sx={{ color: action.color }}>
                        <ArrowForwardIcon />
                      </IconButton>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </AnimatedCard>

      {/* Avisos e Lembretes */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6} lg={3}>
          <AnimatedCard delay={0.3}>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2} mb={2}>
                <Avatar sx={{ bgcolor: alpha('#388e3c', 0.1) }}>
                  <CheckCircleIcon sx={{ color: '#388e3c' }} />
                </Avatar>
                <Box>
                  <Typography variant="h4" fontWeight={700}>
                    <AnimatedCounter value={stats.beneficiosAtivos} />
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Benefícios Ativos
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </AnimatedCard>
        </Grid>

        <Grid item xs={12} md={6} lg={3}>
          <AnimatedCard delay={0.35}>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2} mb={2}>
                <Avatar sx={{ bgcolor: alpha('#f57c00', 0.1) }}>
                  <LocalHospitalIcon sx={{ color: '#f57c00' }} />
                </Avatar>
                <Box>
                  <Typography variant="h4" fontWeight={700}>
                    <AnimatedCounter value={stats.atestadosMes} />
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Atestados este Mês
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </AnimatedCard>
        </Grid>

        <Grid item xs={12} md={6} lg={3}>
          <AnimatedCard delay={0.4}>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2} mb={2}>
                <Avatar sx={{ bgcolor: alpha('#a2122a', 0.1) }}>
                  <PersonAddIcon sx={{ color: '#a2122a' }} />
                </Avatar>
                <Box>
                  <Typography variant="h4" fontWeight={700}>
                    <AnimatedCounter value={stats.novosColaboradores} />
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Novos este Mês
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </AnimatedCard>
        </Grid>

        <Grid item xs={12} md={6} lg={3}>
          <AnimatedCard delay={0.45}>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2} mb={2}>
                <Avatar sx={{ bgcolor: alpha('#1976d2', 0.1) }}>
                  <CampaignIcon sx={{ color: '#1976d2' }} />
                </Avatar>
                <Box>
                  <Typography variant="h4" fontWeight={700}>
                    <AnimatedCounter value={stats.aniversariantes} />
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Aniversariantes
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </AnimatedCard>
        </Grid>
      </Grid>
    </Box>
  );
};
