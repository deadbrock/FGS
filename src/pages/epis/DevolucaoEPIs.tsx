import React from 'react';
import { Box, Typography } from '@mui/material';
import { AnimatedCard } from '../../components';

export const DevolucaoEPIs: React.FC = () => {
  return (
    <AnimatedCard>
      <Box sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Devolução de EPIs
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Página em desenvolvimento - Registro de devoluções de EPIs
        </Typography>
      </Box>
    </AnimatedCard>
  );
};

