import React from 'react';
import { Chip } from '@mui/material';
import { StatusProntuario } from '../types/prontuario';
import { getStatusColor, getStatusNome } from '../utils/statusUtils';

interface StatusChipProps {
  status: StatusProntuario;
  size?: 'small' | 'medium';
}

// Componente para exibir status com cores
export const StatusChip: React.FC<StatusChipProps> = ({ status, size = 'small' }) => {
  return (
    <Chip
      label={getStatusNome(status)}
      size={size}
      sx={{
        backgroundColor: getStatusColor(status),
        color: 'white',
        fontWeight: 500,
      }}
    />
  );
};

