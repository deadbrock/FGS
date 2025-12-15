import React from 'react';
import { Box, Typography } from '@mui/material';
import { AnimatedCard } from '../../components';

export const HistoricoEPIs: React.FC = () => {
  return (
    <AnimatedCard>
      <Typography variant="h6" gutterBottom>
        Histórico de EPIs
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Página em desenvolvimento - Histórico completo de entregas e devoluções
      </Typography>
    </AnimatedCard>
  );
};

