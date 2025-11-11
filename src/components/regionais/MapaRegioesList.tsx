import React from 'react';
import { Box, Typography, Grid, Paper, alpha, Chip } from '@mui/material';
import { EstadoBrasil, RegiaoBrasil } from '../../types/regionais';
import { useTheme } from '../../hooks/useTheme';

interface MapaRegioesListProps {
  dadosEstados: Record<EstadoBrasil, number>;
  estadoSelecionado?: EstadoBrasil | null;
  onEstadoClick: (estado: EstadoBrasil) => void;
}

const regioes: Record<
  RegiaoBrasil,
  { estados: EstadoBrasil[]; cor: string }
> = {
  [RegiaoBrasil.NORTE]: {
    estados: [
      EstadoBrasil.AC,
      EstadoBrasil.AM,
      EstadoBrasil.AP,
      EstadoBrasil.PA,
      EstadoBrasil.RO,
      EstadoBrasil.RR,
      EstadoBrasil.TO,
    ],
    cor: '#10b981',
  },
  [RegiaoBrasil.NORDESTE]: {
    estados: [
      EstadoBrasil.AL,
      EstadoBrasil.BA,
      EstadoBrasil.CE,
      EstadoBrasil.MA,
      EstadoBrasil.PB,
      EstadoBrasil.PE,
      EstadoBrasil.PI,
      EstadoBrasil.RN,
      EstadoBrasil.SE,
    ],
    cor: '#f59e0b',
  },
  [RegiaoBrasil.CENTRO_OESTE]: {
    estados: [EstadoBrasil.DF, EstadoBrasil.GO, EstadoBrasil.MT, EstadoBrasil.MS],
    cor: '#ef4444',
  },
  [RegiaoBrasil.SUDESTE]: {
    estados: [EstadoBrasil.ES, EstadoBrasil.MG, EstadoBrasil.RJ, EstadoBrasil.SP],
    cor: '#6366f1',
  },
  [RegiaoBrasil.SUL]: {
    estados: [EstadoBrasil.PR, EstadoBrasil.RS, EstadoBrasil.SC],
    cor: '#8b5cf6',
  },
};

const nomesEstados: Record<EstadoBrasil, string> = {
  [EstadoBrasil.AC]: 'Acre',
  [EstadoBrasil.AL]: 'Alagoas',
  [EstadoBrasil.AP]: 'Amapá',
  [EstadoBrasil.AM]: 'Amazonas',
  [EstadoBrasil.BA]: 'Bahia',
  [EstadoBrasil.CE]: 'Ceará',
  [EstadoBrasil.DF]: 'Distrito Federal',
  [EstadoBrasil.ES]: 'Espírito Santo',
  [EstadoBrasil.GO]: 'Goiás',
  [EstadoBrasil.MA]: 'Maranhão',
  [EstadoBrasil.MT]: 'Mato Grosso',
  [EstadoBrasil.MS]: 'Mato Grosso do Sul',
  [EstadoBrasil.MG]: 'Minas Gerais',
  [EstadoBrasil.PA]: 'Pará',
  [EstadoBrasil.PB]: 'Paraíba',
  [EstadoBrasil.PR]: 'Paraná',
  [EstadoBrasil.PE]: 'Pernambuco',
  [EstadoBrasil.PI]: 'Piauí',
  [EstadoBrasil.RJ]: 'Rio de Janeiro',
  [EstadoBrasil.RN]: 'Rio Grande do Norte',
  [EstadoBrasil.RS]: 'Rio Grande do Sul',
  [EstadoBrasil.RO]: 'Rondônia',
  [EstadoBrasil.RR]: 'Roraima',
  [EstadoBrasil.SC]: 'Santa Catarina',
  [EstadoBrasil.SP]: 'São Paulo',
  [EstadoBrasil.SE]: 'Sergipe',
  [EstadoBrasil.TO]: 'Tocantins',
};

export const MapaRegioesList: React.FC<MapaRegioesListProps> = ({
  dadosEstados,
  estadoSelecionado,
  onEstadoClick,
}) => {
  const { mode } = useTheme();

  const getIntensidade = (total: number) => {
    const maxValue = Math.max(...Object.values(dadosEstados));
    return maxValue > 0 ? total / maxValue : 0;
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Grid container spacing={3}>
        {Object.entries(regioes).map(([regiao, { estados, cor }]) => {
          const totalRegiao = estados.reduce(
            (sum, estado) => sum + (dadosEstados[estado] || 0),
            0
          );

          return (
            <Grid item xs={12} md={6} lg={4} key={regiao}>
              <Paper
                elevation={0}
                sx={{
                  p: 2.5,
                  borderRadius: 3,
                  background:
                    mode === 'dark'
                      ? `linear-gradient(135deg, ${alpha(cor, 0.15)} 0%, ${alpha(
                          cor,
                          0.05
                        )} 100%)`
                      : `linear-gradient(135deg, ${alpha(cor, 0.1)} 0%, ${alpha(
                          cor,
                          0.02
                        )} 100%)`,
                  border: `2px solid ${alpha(cor, 0.2)}`,
                  transition: 'all 0.3s',
                  '&:hover': {
                    boxShadow: `0 8px 32px ${alpha(cor, 0.3)}`,
                    transform: 'translateY(-4px)',
                  },
                }}
              >
                {/* Cabeçalho da Região */}
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 2,
                    pb: 1.5,
                    borderBottom: `2px solid ${alpha(cor, 0.3)}`,
                  }}
                >
                  <Typography
                    variant="h6"
                    fontWeight={700}
                    sx={{
                      background: `linear-gradient(135deg, ${cor}, ${alpha(cor, 0.7)})`,
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                    }}
                  >
                    {regiao}
                  </Typography>
                  <Chip
                    label={`${totalRegiao} colaboradores`}
                    size="small"
                    sx={{
                      backgroundColor: alpha(cor, 0.2),
                      color: cor,
                      fontWeight: 700,
                      fontSize: '0.75rem',
                    }}
                  />
                </Box>

                {/* Grid de Estados */}
                <Grid container spacing={1}>
                  {estados.map((estado) => {
                    const total = dadosEstados[estado] || 0;
                    const intensidade = getIntensidade(total);
                    const isSelected = estadoSelecionado === estado;

                    return (
                      <Grid item xs={6} key={estado}>
                        <Box
                          onClick={() => onEstadoClick(estado)}
                          sx={{
                            p: 1.5,
                            borderRadius: 2,
                            cursor: 'pointer',
                            background: isSelected
                              ? `linear-gradient(135deg, ${cor}, ${alpha(cor, 0.8)})`
                              : alpha(cor, 0.1 + intensidade * 0.4),
                            border: isSelected
                              ? `2px solid ${cor}`
                              : `1px solid ${alpha(cor, 0.2)}`,
                            transition: 'all 0.3s',
                            '&:hover': {
                              background: `linear-gradient(135deg, ${cor}, ${alpha(
                                cor,
                                0.8
                              )})`,
                              transform: 'scale(1.05)',
                              boxShadow: `0 4px 16px ${alpha(cor, 0.4)}`,
                              border: `2px solid ${cor}`,
                            },
                          }}
                        >
                          <Typography
                            variant="body2"
                            fontWeight={700}
                            sx={{
                              color: isSelected
                                ? '#fff'
                                : mode === 'dark'
                                ? '#fff'
                                : cor,
                              mb: 0.5,
                            }}
                          >
                            {estado}
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{
                              color: isSelected
                                ? alpha('#fff', 0.9)
                                : 'text.secondary',
                              display: 'block',
                              fontSize: '0.7rem',
                            }}
                          >
                            {nomesEstados[estado]}
                          </Typography>
                          <Typography
                            variant="h6"
                            fontWeight={800}
                            sx={{
                              color: isSelected ? '#fff' : cor,
                              mt: 0.5,
                            }}
                          >
                            {total}
                          </Typography>
                        </Box>
                      </Grid>
                    );
                  })}
                </Grid>
              </Paper>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

