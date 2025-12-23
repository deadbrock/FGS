import React from 'react';
import { Box, Typography } from '@mui/material';
import { AnimatedCard } from '../../components';

export const ControleValidade: React.FC = () => {
  return (
    <AnimatedCard>
      <Box sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Controle de Validade
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Página em desenvolvimento - Dashboard de EPIs vencidos e a vencer
        </Typography>
      </Box>
    </AnimatedCard>
  );
};

