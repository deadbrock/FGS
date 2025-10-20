import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  IconButton,
  Badge,
  Divider,
} from '@mui/material';
import WarningIcon from '@mui/icons-material/Warning';
import ErrorIcon from '@mui/icons-material/Error';
import InfoIcon from '@mui/icons-material/Info';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { AlertaTreinamento } from '../../types/treinamentos';
import { formatarData } from '../../utils/statusUtils';

interface AlertasVencimentoProps {
  alertas: AlertaTreinamento[];
  onMarcarLido?: (alertaId: string) => void;
}

export const AlertasVencimento: React.FC<AlertasVencimentoProps> = ({
  alertas,
  onMarcarLido,
}) => {
  const alertasNaoLidos = alertas.filter((a) => !a.lido);

  const getIconePrioridade = (prioridade: string) => {
    switch (prioridade) {
      case 'ALTA':
        return <ErrorIcon color="error" />;
      case 'MEDIA':
        return <WarningIcon color="warning" />;
      default:
        return <InfoIcon color="info" />;
    }
  };

  const getCorPrioridade = (prioridade: string) => {
    switch (prioridade) {
      case 'ALTA':
        return 'error';
      case 'MEDIA':
        return 'warning';
      default:
        return 'info';
    }
  };

  const getMensagem = (alerta: AlertaTreinamento) => {
    switch (alerta.tipo) {
      case 'VENCIMENTO':
        return `Treinamento "${alerta.treinamentoNome}" vencido há ${Math.abs(
          alerta.diasParaVencer
        )} dias`;
      case 'A_VENCER':
        return `Treinamento "${alerta.treinamentoNome}" vence em ${alerta.diasParaVencer} dias`;
      case 'OBRIGATORIO_PENDENTE':
        return `Treinamento obrigatório "${alerta.treinamentoNome}" pendente`;
      default:
        return alerta.treinamentoNome;
    }
  };

  if (alertas.length === 0) {
    return (
      <Card>
        <CardContent>
          <Box display="flex" alignItems="center" gap={1} mb={2}>
            <NotificationsIcon color="action" />
            <Typography variant="h6">Alertas de Vencimento</Typography>
          </Box>
          <Typography variant="body2" color="text.secondary">
            Nenhum alerta no momento
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Box display="flex" alignItems="center" gap={1}>
            <Badge badgeContent={alertasNaoLidos.length} color="error">
              <NotificationsIcon />
            </Badge>
            <Typography variant="h6">Alertas de Vencimento</Typography>
          </Box>
          <Chip
            label={`${alertasNaoLidos.length} não lidos`}
            size="small"
            color="error"
          />
        </Box>

        <Divider sx={{ mb: 2 }} />

        <List>
          {alertas.map((alerta, index) => (
            <React.Fragment key={alerta.id}>
              <ListItem
                sx={{
                  bgcolor: alerta.lido ? 'transparent' : 'action.hover',
                  borderRadius: 1,
                  mb: 1,
                }}
                secondaryAction={
                  !alerta.lido && onMarcarLido && (
                    <IconButton
                      edge="end"
                      size="small"
                      onClick={() => onMarcarLido(alerta.id)}
                    >
                      <NotificationsIcon fontSize="small" />
                    </IconButton>
                  )
                }
              >
                <ListItemIcon>{getIconePrioridade(alerta.prioridade)}</ListItemIcon>
                <ListItemText
                  component="div"
                  primary={
                    <Box display="flex" alignItems="center" gap={1}>
                      <Typography variant="body2">{alerta.colaboradorNome}</Typography>
                      <Chip
                        label={alerta.prioridade}
                        size="small"
                        color={getCorPrioridade(alerta.prioridade) as any}
                      />
                    </Box>
                  }
                  secondary={
                    <>
                      <Typography variant="body2" component="span">
                        {getMensagem(alerta)}
                      </Typography>
                      <br />
                      <Typography variant="caption" color="text.secondary">
                        {formatarData(alerta.dataVencimento)} •{' '}
                        {new Date(alerta.criadoEm).toLocaleDateString('pt-BR')}
                      </Typography>
                    </>
                  }
                />
              </ListItem>
              {index < alertas.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </List>
      </CardContent>
    </Card>
  );
};

