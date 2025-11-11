import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Grid,
  Chip,
  LinearProgress,
  Avatar,
  alpha,
} from '@mui/material';
import {
  People as PeopleIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Business as BusinessIcon,
  LocationCity as LocationCityIcon,
} from '@mui/icons-material';
import { EstatisticasEstado } from '../../types/regionais';
import { useTheme } from '../../hooks/useTheme';

interface CardEstadoDetalhesProps {
  estatisticas: EstatisticasEstado;
}

export const CardEstadoDetalhes: React.FC<CardEstadoDetalhesProps> = ({ estatisticas }) => {
  const { mode } = useTheme();

  const dados = [
    {
      label: 'Total',
      valor: estatisticas.totalColaboradores,
      cor: '#6366f1',
      icone: <PeopleIcon />,
    },
    {
      label: 'Ativos',
      valor: estatisticas.colaboradoresAtivos,
      cor: '#10b981',
      icone: <PeopleIcon />,
    },
    {
      label: 'Férias',
      valor: estatisticas.colaboradoresFerias,
      cor: '#f59e0b',
      icone: <PeopleIcon />,
    },
    {
      label: 'Afastados',
      valor: estatisticas.colaboradoresAfastados,
      cor: '#ef4444',
      icone: <PeopleIcon />,
    },
  ];

  return (
    <Card
      sx={{
        borderRadius: 3,
        background: mode === 'dark'
          ? 'linear-gradient(135deg, rgba(30, 41, 59, 0.9) 0%, rgba(15, 23, 42, 0.9) 100%)'
          : 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
        border: `1px solid ${alpha(mode === 'dark' ? '#fff' : '#000', 0.1)}`,
      }}
    >
      <CardContent>
        {/* Cabeçalho */}
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
            <Avatar
              sx={{
                width: 56,
                height: 56,
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                fontSize: '1.5rem',
                fontWeight: 700,
              }}
            >
              {estatisticas.estado}
            </Avatar>
            <Box>
              <Typography variant="h5" fontWeight={700}>
                {estatisticas.nomeEstado}
              </Typography>
              <Chip
                label={estatisticas.regiao}
                size="small"
                sx={{
                  backgroundColor: alpha('#6366f1', 0.1),
                  color: '#6366f1',
                  fontWeight: 600,
                }}
              />
            </Box>
          </Box>
        </Box>

        {/* Grid de Estatísticas */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          {dados.map((item, index) => (
            <Grid item xs={6} sm={3} key={index}>
              <Box
                sx={{
                  p: 2,
                  borderRadius: 2,
                  background: alpha(item.cor, 0.1),
                  border: `1px solid ${alpha(item.cor, 0.2)}`,
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <Box sx={{ color: item.cor }}>{item.icone}</Box>
                  <Typography variant="caption" color="text.secondary" fontWeight={600}>
                    {item.label}
                  </Typography>
                </Box>
                <Typography variant="h4" fontWeight={700} sx={{ color: item.cor }}>
                  {item.valor}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>

        {/* Métricas Adicionais */}
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <BusinessIcon fontSize="small" color="primary" />
                <Typography variant="body2" color="text.secondary">
                  Unidades
                </Typography>
              </Box>
              <Typography variant="h6" fontWeight={700}>
                {estatisticas.unidades}
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} sm={4}>
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                {estatisticas.crescimentoMensal >= 0 ? (
                  <TrendingUpIcon fontSize="small" sx={{ color: '#10b981' }} />
                ) : (
                  <TrendingDownIcon fontSize="small" sx={{ color: '#ef4444' }} />
                )}
                <Typography variant="body2" color="text.secondary">
                  Crescimento
                </Typography>
              </Box>
              <Typography
                variant="h6"
                fontWeight={700}
                sx={{
                  color: estatisticas.crescimentoMensal >= 0 ? '#10b981' : '#ef4444',
                }}
              >
                {estatisticas.crescimentoMensal >= 0 ? '+' : ''}
                {estatisticas.crescimentoMensal.toFixed(1)}%
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} sm={4}>
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <LocationCityIcon fontSize="small" color="primary" />
                <Typography variant="body2" color="text.secondary">
                  Departamentos
                </Typography>
              </Box>
              <Typography variant="h6" fontWeight={700}>
                {estatisticas.departamentos.length}
              </Typography>
            </Box>
          </Grid>
        </Grid>

        {/* Top Cargos */}
        <Box sx={{ mt: 3 }}>
          <Typography variant="subtitle2" fontWeight={700} gutterBottom>
            Distribuição por Cargo
          </Typography>
          {Object.entries(estatisticas.cargos)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3)
            .map(([cargo, quantidade]) => {
              const porcentagem = (quantidade / estatisticas.totalColaboradores) * 100;
              return (
                <Box key={cargo} sx={{ mb: 1.5 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography variant="body2" fontWeight={600}>
                      {cargo}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {quantidade} ({porcentagem.toFixed(0)}%)
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={porcentagem}
                    sx={{
                      height: 8,
                      borderRadius: 1,
                      backgroundColor: alpha('#6366f1', 0.1),
                      '& .MuiLinearProgress-bar': {
                        background: 'linear-gradient(90deg, #6366f1, #8b5cf6)',
                        borderRadius: 1,
                      },
                    }}
                  />
                </Box>
              );
            })}
        </Box>
      </CardContent>
    </Card>
  );
};

