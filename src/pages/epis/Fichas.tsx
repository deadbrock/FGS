import React from 'react';
import { Box, Typography } from '@mui/material';
import { AnimatedCard } from '../../components';

export const Fichas: React.FC = () => {
  return (
    <AnimatedCard>
      <Box sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Gestão de Fichas
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Página em desenvolvimento - Fichas de EPI, LPT, Jardineiro e Certificados
        </Typography>
      </Box>
    </AnimatedCard>
  );
};

