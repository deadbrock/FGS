import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Grid,
  Chip,
  Divider,
} from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';
import ErrorIcon from '@mui/icons-material/Error';
import { ResumoDia } from '../../types/ponto';
import { formatarHorario, formatarMinutosParaHoras, getStatusColor, getStatusNome } from '../../utils/pontoUtils';
import { StatusChip } from '../StatusChip';

interface VisualizacaoHorariosProps {
  resumoDia: ResumoDia;
}

export const VisualizacaoHorarios: React.FC<VisualizacaoHorariosProps> = ({ resumoDia }) => {
  const {
    horarioPrevisto,
    horarioRealizado,
    horasTrabalhadas,
    horasExtras,
    atrasoMinutos,
    status,
  } = resumoDia;

  const getIconeComparacao = (previsto: string, realizado?: string) => {
    if (!realizado) return <ErrorIcon color="error" />;
    
    const [hP, mP] = previsto.split(':').map(Number);
    const [hR, mR] = realizado.split(':').map(Number);
    const minutosP = hP * 60 + mP;
    const minutosR = hR * 60 + mR;
    
    if (Math.abs(minutosR - minutosP) < 15) {
      return <CheckCircleIcon color="success" />;
    }
    
    return <WarningIcon color="warning" />;
  };

  return (
    <Card>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6">
            {resumoDia.data} - {resumoDia.diaSemana}
          </Typography>
          <StatusChip status={status} />
        </Box>

        <Divider sx={{ mb: 2 }} />

        <Grid container spacing={3}>
          {/* Entrada */}
          <Grid item xs={12} md={6}>
            <Box display="flex" alignItems="center" gap={1} mb={1}>
              <AccessTimeIcon color="primary" />
              <Typography variant="subtitle2">Entrada</Typography>
            </Box>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Previsto
                </Typography>
                <Typography variant="h6">{horarioPrevisto.entrada}</Typography>
              </Box>
              {getIconeComparacao(horarioPrevisto.entrada, horarioRealizado.entrada)}
              <Box textAlign="right">
                <Typography variant="caption" color="text.secondary">
                  Realizado
                </Typography>
                <Typography variant="h6" color={horarioRealizado.entrada ? 'text.primary' : 'error'}>
                  {formatarHorario(horarioRealizado.entrada)}
                </Typography>
              </Box>
            </Box>
          </Grid>

          {/* Saída */}
          <Grid item xs={12} md={6}>
            <Box display="flex" alignItems="center" gap={1} mb={1}>
              <AccessTimeIcon color="primary" />
              <Typography variant="subtitle2">Saída</Typography>
            </Box>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Previsto
                </Typography>
                <Typography variant="h6">{horarioPrevisto.saida}</Typography>
              </Box>
              {getIconeComparacao(horarioPrevisto.saida, horarioRealizado.saida)}
              <Box textAlign="right">
                <Typography variant="caption" color="text.secondary">
                  Realizado
                </Typography>
                <Typography variant="h6" color={horarioRealizado.saida ? 'text.primary' : 'error'}>
                  {formatarHorario(horarioRealizado.saida)}
                </Typography>
              </Box>
            </Box>
          </Grid>

          {/* Intervalo */}
          {horarioPrevisto.intervaloInicio && horarioPrevisto.intervaloFim && (
            <Grid item xs={12} md={6}>
              <Box display="flex" alignItems="center" gap={1} mb={1}>
                <AccessTimeIcon color="action" />
                <Typography variant="subtitle2">Intervalo</Typography>
              </Box>
              <Box display="flex" gap={2}>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Início
                  </Typography>
                  <Typography variant="body2">
                    {formatarHorario(horarioRealizado.intervaloInicio)}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Fim
                  </Typography>
                  <Typography variant="body2">
                    {formatarHorario(horarioRealizado.intervaloFim)}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          )}

          {/* Resumo */}
          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
            <Grid container spacing={2}>
              <Grid item xs={6} md={3}>
                <Typography variant="caption" color="text.secondary">
                  Horas Trabalhadas
                </Typography>
                <Typography variant="h6">
                  {formatarMinutosParaHoras(horasTrabalhadas)}
                </Typography>
              </Grid>
              <Grid item xs={6} md={3}>
                <Typography variant="caption" color="text.secondary">
                  Horas Extras
                </Typography>
                <Typography variant="h6" color={horasExtras > 0 ? 'success.main' : 'text.primary'}>
                  {formatarMinutosParaHoras(horasExtras)}
                </Typography>
              </Grid>
              <Grid item xs={6} md={3}>
                <Typography variant="caption" color="text.secondary">
                  Atraso
                </Typography>
                <Typography variant="h6" color={atrasoMinutos > 0 ? 'error.main' : 'text.primary'}>
                  {atrasoMinutos > 0 ? `${atrasoMinutos} min` : '--'}
                </Typography>
              </Grid>
              <Grid item xs={6} md={3}>
                <Typography variant="caption" color="text.secondary">
                  Status
                </Typography>
                <Typography variant="h6" color={getStatusColor(status)}>
                  {getStatusNome(status)}
                </Typography>
              </Grid>
            </Grid>
          </Grid>

          {/* Atraso aviso */}
          {atrasoMinutos > 0 && atrasoMinutos < 15 && (
            <Grid item xs={12}>
              <Chip
                label="Atraso < 15 min - Não contabilizado"
                size="small"
                color="info"
                variant="outlined"
              />
            </Grid>
          )}
        </Grid>
      </CardContent>
    </Card>
  );
};

