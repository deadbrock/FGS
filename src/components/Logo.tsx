import React from 'react';
import { Box, Typography } from '@mui/material';

interface LogoProps {
  size?: 'small' | 'medium' | 'large';
  showText?: boolean;
}

// Componente do logo FGS
export const Logo: React.FC<LogoProps> = ({ size = 'medium', showText = true }) => {
  const sizes = {
    small: { fontSize: 20, height: 40 },
    medium: { fontSize: 28, height: 56 },
    large: { fontSize: 40, height: 80 },
  };

  return (
    <Box
      display="flex"
      alignItems="center"
      gap={1}
      sx={{ height: sizes[size].height }}
    >
      <Box
        sx={{
          width: sizes[size].height,
          height: sizes[size].height,
          background: 'linear-gradient(135deg, #a2122a 0%, #354a80 100%)',
          borderRadius: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontWeight: 700,
          fontSize: sizes[size].fontSize,
        }}
      >
        FGS
      </Box>
      {showText && (
        <Box>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              lineHeight: 1.2,
              color: 'primary.main',
              fontSize: size === 'small' ? 14 : size === 'medium' ? 16 : 20,
            }}
          >
            Formando Gente
          </Typography>
          <Typography
            variant="caption"
            sx={{
              lineHeight: 1.2,
              color: 'secondary.main',
              fontSize: size === 'small' ? 10 : size === 'medium' ? 12 : 14,
            }}
          >
            de Sucesso
          </Typography>
        </Box>
      )}
    </Box>
  );
};

