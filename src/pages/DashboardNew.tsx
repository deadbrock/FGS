import React, { useState } from 'react';
import {
  Box,
  Grid,
  Typography,
  Card,
  CardContent,
  IconButton,
  LinearProgress,
  Avatar,
  Chip,
  alpha,
  Button,
} from '@mui/material';
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
import { useAuth } from '../hooks/useAuth';
import { useNavigationLog } from '../hooks/useNavigationLog';
import { useNavigate } from 'react-router-dom';

interface QuickAction {
  title: string;
  path: string;
  icon: React.ReactNode;
  color: string;
  count?: number;
}

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  useNavigationLog();
  const navigate = useNavigate();

  const [stats] = useState({
    totalColaboradores: 245,
    colaboradoresAtivos: 238,
    novosColaboradores: 12,
    taxaPresenca: 94.5,
    treinamentosPendentes: 8,
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
      {/* Cabeçalho */}
      <Box mb={4}>
        <Typography
          variant="h3"
          gutterBottom
          fontWeight={700}
          sx={{
            background: 'linear-gradient(135deg, #a2122a 0%, #354a80 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Olá, {user?.nome}! 👋
        </Typography>
        <Typography variant="h6" color="text.secondary" fontWeight={400}>
          Bem-vindo ao painel de controle do FGS
        </Typography>
      </Box>

      {/* Cards de Estatísticas Premium */}
      <Grid container spacing={3} mb={4}>
        {/* Card 1 - Total Colaboradores */}
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              background: 'linear-gradient(135deg, #354a80 0%, #5f75b3 100%)',
              color: 'white',
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: -50,
                right: -50,
                width: 200,
                height: 200,
                borderRadius: '50%',
                background: (theme) => alpha(theme.palette.common.white, 0.1),
              },
            }}
          >
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                <Box>
                  <Typography variant="body2" sx={{ opacity: 0.9, mb: 1 }}>
                    Total de Colaboradores
                  </Typography>
                  <Typography variant="h3" fontWeight={700}>
                    {stats.totalColaboradores}
                  </Typography>
                  <Box display="flex" alignItems="center" mt={1}>
                    <TrendingUpIcon sx={{ fontSize: 16, mr: 0.5 }} />
                    <Typography variant="caption">+5.2% este mês</Typography>
                  </Box>
                </Box>
                <Avatar
                  sx={{
                    bgcolor: alpha('#fff', 0.2),
                    width: 56,
                    height: 56,
                  }}
                >
                  <PeopleIcon sx={{ fontSize: 32 }} />
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
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: -50,
                right: -50,
                width: 200,
                height: 200,
                borderRadius: '50%',
                background: (theme) => alpha(theme.palette.common.white, 0.1),
              },
            }}
          >
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                <Box>
                  <Typography variant="body2" sx={{ opacity: 0.9, mb: 1 }}>
                    Colaboradores Ativos
                  </Typography>
                  <Typography variant="h3" fontWeight={700}>
                    {stats.colaboradoresAtivos}
                  </Typography>
                  <Box display="flex" alignItems="center" mt={1}>
                    <CheckCircleIcon sx={{ fontSize: 16, mr: 0.5 }} />
                    <Typography variant="caption">
                      {((stats.colaboradoresAtivos / stats.totalColaboradores) * 100).toFixed(1)}%
                      do total
                    </Typography>
                  </Box>
                </Box>
                <Avatar
                  sx={{
                    bgcolor: alpha('#fff', 0.2),
                    width: 56,
                    height: 56,
                  }}
                >
                  <CheckCircleIcon sx={{ fontSize: 32 }} />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Card 3 - Novos este Mês */}
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              background: 'linear-gradient(135deg, #a2122a 0%, #d4455d 100%)',
              color: 'white',
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: -50,
                right: -50,
                width: 200,
                height: 200,
                borderRadius: '50%',
                background: (theme) => alpha(theme.palette.common.white, 0.1),
              },
            }}
          >
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                <Box>
                  <Typography variant="body2" sx={{ opacity: 0.9, mb: 1 }}>
                    Novos este Mês
                  </Typography>
                  <Typography variant="h3" fontWeight={700}>
                    {stats.novosColaboradores}
                  </Typography>
                  <Box display="flex" alignItems="center" mt={1}>
                    <PersonAddIcon sx={{ fontSize: 16, mr: 0.5 }} />
                    <Typography variant="caption">Crescimento constante</Typography>
                  </Box>
                </Box>
                <Avatar
                  sx={{
                    bgcolor: alpha('#fff', 0.2),
                    width: 56,
                    height: 56,
                  }}
                >
                  <PersonAddIcon sx={{ fontSize: 32 }} />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Card 4 - Taxa de Presença */}
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              background: 'linear-gradient(135deg, #f57c00 0%, #ff9800 100%)',
              color: 'white',
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: -50,
                right: -50,
                width: 200,
                height: 200,
                borderRadius: '50%',
                background: (theme) => alpha(theme.palette.common.white, 0.1),
              },
            }}
          >
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                <Box>
                  <Typography variant="body2" sx={{ opacity: 0.9, mb: 1 }}>
                    Taxa de Presença
                  </Typography>
                  <Typography variant="h3" fontWeight={700}>
                    {stats.taxaPresenca}%
                  </Typography>
                  <Box mt={1}>
                    <LinearProgress
                      variant="determinate"
                      value={stats.taxaPresenca}
                      sx={{
                        height: 6,
                        borderRadius: 3,
                        bgcolor: alpha('#fff', 0.3),
                        '& .MuiLinearProgress-bar': {
                          bgcolor: 'white',
                        },
                      }}
                    />
                  </Box>
                </Box>
                <Avatar
                  sx={{
                    bgcolor: alpha('#fff', 0.2),
                    width: 56,
                    height: 56,
                  }}
                >
                  <AccessTimeIcon sx={{ fontSize: 32 }} />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Atalhos Rápidos */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h5" fontWeight={600} gutterBottom>
            Acesso Rápido
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
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: `0 8px 24px ${alpha(action.color, 0.2)}`,
                      borderColor: action.color,
                    },
                  }}
                  onClick={() => navigate(action.path)}
                >
                  <CardContent>
                    <Box display="flex" alignItems="center" justifyContent="space-between">
                      <Box display="flex" alignItems="center" gap={2}>
                        <Avatar sx={{ bgcolor: alpha(action.color, 0.1) }}>
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
                              sx={{ mt: 0.5 }}
                            />
                          )}
                        </Box>
                      </Box>
                      <IconButton size="small">
                        <ArrowForwardIcon />
                      </IconButton>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>

      {/* Avisos e Lembretes */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                📅 Aniversariantes do Mês
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                {stats.aniversariantes} colaboradores fazem aniversário este mês
              </Typography>
              <Button variant="outlined" fullWidth>
                Ver Lista Completa
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                ⚠️ Treinamentos Pendentes
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                {stats.treinamentosPendentes} treinamentos precisam de atenção
              </Typography>
              <Button variant="outlined" fullWidth>
                Visualizar Treinamentos
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

