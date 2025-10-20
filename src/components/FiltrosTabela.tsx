import React from 'react';
import {
  Box,
  TextField,
  MenuItem,
  Button,
  Grid,
  Chip,
  Stack,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import { StatusProntuario } from '../types/prontuario';
import { getStatusNome } from '../utils/statusUtils';

interface FiltrosProps {
  busca: string;
  onBuscaChange: (valor: string) => void;
  status: StatusProntuario[];
  onStatusChange: (status: StatusProntuario[]) => void;
  dataInicio?: string;
  dataFim?: string;
  onDataInicioChange?: (data: string) => void;
  onDataFimChange?: (data: string) => void;
  onLimpar: () => void;
}

// Componente de filtros para tabelas
export const FiltrosTabela: React.FC<FiltrosProps> = ({
  busca,
  onBuscaChange,
  status,
  onStatusChange,
  dataInicio,
  dataFim,
  onDataInicioChange,
  onDataFimChange,
  onLimpar,
}) => {
  const todosStatus = Object.values(StatusProntuario);
  const statusArray = status || []; // Garantir que status seja sempre um array

  const handleStatusToggle = (statusItem: StatusProntuario) => {
    if (statusArray.includes(statusItem)) {
      onStatusChange(statusArray.filter((s) => s !== statusItem));
    } else {
      onStatusChange([...statusArray, statusItem]);
    }
  };

  return (
    <Box sx={{ mb: 3 }}>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            placeholder="Buscar..."
            value={busca}
            onChange={(e) => onBuscaChange(e.target.value)}
            InputProps={{
              startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
            }}
          />
        </Grid>

        {onDataInicioChange && (
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              type="date"
              label="Data Início"
              value={dataInicio || ''}
              onChange={(e) => onDataInicioChange(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
        )}

        {onDataFimChange && (
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              type="date"
              label="Data Fim"
              value={dataFim || ''}
              onChange={(e) => onDataFimChange(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
        )}

        <Grid item xs={12} md={2}>
          <Button
            fullWidth
            variant="outlined"
            startIcon={<ClearIcon />}
            onClick={onLimpar}
          >
            Limpar
          </Button>
        </Grid>

        <Grid item xs={12}>
          <Box>
            <Box mb={1}>
              <strong>Filtrar por status:</strong>
            </Box>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              {todosStatus.map((statusItem) => (
                <Chip
                  key={statusItem}
                  label={getStatusNome(statusItem)}
                  onClick={() => handleStatusToggle(statusItem)}
                  color={statusArray.includes(statusItem) ? 'primary' : 'default'}
                  variant={statusArray.includes(statusItem) ? 'filled' : 'outlined'}
                />
              ))}
            </Stack>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};
