import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Paper,
  Stack,
  Divider,
} from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import EditIcon from '@mui/icons-material/Edit';
import PauseCircleIcon from '@mui/icons-material/PauseCircle';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { HistoricoBeneficio } from '../../types/beneficios';
import { formatarData } from '../../utils/statusUtils';
import { formatarMoeda } from '../../utils/beneficiosUtils';

interface HistoricoAlteracoesProps {
  historico: HistoricoBeneficio[];
}

export const HistoricoAlteracoes: React.FC<HistoricoAlteracoesProps> = ({ historico }) => {
  // Garantir que historico seja sempre um array
  const historicoArray = Array.isArray(historico) ? historico : [];

  const getIcone = (tipo: string) => {
    switch (tipo) {
      case 'CONCESSAO':
        return <AddCircleIcon />;
      case 'ALTERACAO_VALOR':
        return <EditIcon />;
      case 'SUSPENSAO':
        return <PauseCircleIcon />;
      case 'REATIVACAO':
        return <PlayCircleIcon />;
      case 'CANCELAMENTO':
        return <CancelIcon />;
      default:
        return <EditIcon />;
    }
  };

  const getCor = (tipo: string) => {
    switch (tipo) {
      case 'CONCESSAO':
        return 'success';
      case 'ALTERACAO_VALOR':
        return 'info';
      case 'SUSPENSAO':
        return 'warning';
      case 'REATIVACAO':
        return 'success';
      case 'CANCELAMENTO':
        return 'error';
      default:
        return 'default';
    }
  };

  const getTipoNome = (tipo: string) => {
    const nomes: Record<string, string> = {
      CONCESSAO: 'Concessão',
      ALTERACAO_VALOR: 'Alteração de Valor',
      SUSPENSAO: 'Suspensão',
      REATIVACAO: 'Reativação',
      CANCELAMENTO: 'Cancelamento',
    };
    return nomes[tipo] || tipo;
  };

  if (historicoArray.length === 0) {
    return (
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Histórico de Alterações
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Nenhuma alteração registrada
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Histórico de Alterações
        </Typography>

        <Stack spacing={2} mt={2}>
          {historicoArray.map((item, index) => (
            <Paper key={item.id} elevation={1} sx={{ p: 2 }}>
              <Box display="flex" gap={2}>
                {/* Ícone e Data */}
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    minWidth: '80px',
                  }}
                >
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      bgcolor: `${getCor(item.tipoAlteracao)}.lighter`,
                      color: `${getCor(item.tipoAlteracao)}.main`,
                      mb: 1,
                    }}
                  >
                    {getIcone(item.tipoAlteracao)}
                  </Box>
                  <Typography variant="caption" color="text.secondary" textAlign="center">
                    {formatarData(item.dataAlteracao)}
                  </Typography>
                </Box>

                {/* Conteúdo */}
                <Box flex={1}>
                  <Box display="flex" alignItems="center" gap={1} mb={1}>
                    <Chip
                      label={getTipoNome(item.tipoAlteracao)}
                      size="small"
                      color={getCor(item.tipoAlteracao) as any}
                    />
                  </Box>
                  
                  <Typography variant="body2" fontWeight={500} mb={0.5}>
                    {item.beneficioNome} - {item.colaboradorNome}
                  </Typography>
                  
                  {item.valorAnterior !== undefined && item.valorNovo !== undefined && (
                    <Typography variant="body2" color="text.secondary" mb={0.5}>
                      Valor: {formatarMoeda(item.valorAnterior)} → {formatarMoeda(item.valorNovo)}
                    </Typography>
                  )}
                  
                  <Typography variant="body2" color="text.secondary" mb={0.5}>
                    {item.motivo}
                  </Typography>
                  
                  {item.observacoes && (
                    <Typography variant="caption" color="text.secondary" display="block" mb={0.5}>
                      Obs: {item.observacoes}
                    </Typography>
                  )}
                  
                  <Typography variant="caption" color="text.secondary" display="block">
                    Por: {item.alteradoPor}
                  </Typography>
                </Box>
              </Box>
              
              {index < historicoArray.length - 1 && <Divider sx={{ mt: 2 }} />}
            </Paper>
          ))}
        </Stack>
      </CardContent>
    </Card>
  );
};

