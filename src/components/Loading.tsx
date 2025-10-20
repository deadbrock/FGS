import React from 'react';
import { Box, CircularProgress, Typography, alpha, keyframes } from '@mui/material';
import { Logo } from './Logo';

const pulse = keyframes`
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.8;
    transform: scale(1.05);
  }
`;

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

interface LoadingProps {
  message?: string;
  fullScreen?: boolean;
}

// Componente de loading personalizado com logo FGS
export const Loading: React.FC<LoadingProps> = ({ 
  message = 'Carregando...', 
  fullScreen = true 
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: fullScreen ? '100vh' : '400px',
        gap: 3,
        background: fullScreen 
          ? 'linear-gradient(135deg, rgba(162, 18, 42, 0.02) 0%, rgba(53, 74, 128, 0.02) 100%)' 
          : 'transparent',
        animation: `${fadeIn} 0.3s ease-in`,
      }}
    >
      {/* Container do Spinner + Logo */}
      <Box
        sx={{
          position: 'relative',
          width: 120,
          height: 120,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {/* Spinner Externo - Gradiente Vermelho */}
        <CircularProgress
          size={120}
          thickness={2}
          sx={{
            position: 'absolute',
            color: '#a2122a',
            animation: `${rotate} 1.5s linear infinite`,
            '& .MuiCircularProgress-circle': {
              strokeLinecap: 'round',
            },
          }}
          variant="indeterminate"
        />

        {/* Spinner Intermediário - Gradiente Azul */}
        <CircularProgress
          size={90}
          thickness={2.5}
          sx={{
            position: 'absolute',
            color: '#354a80',
            animation: `${rotate} 2s linear infinite reverse`,
            '& .MuiCircularProgress-circle': {
              strokeLinecap: 'round',
            },
          }}
          variant="indeterminate"
        />

        {/* Logo no Centro com Pulse */}
        <Box
          sx={{
            position: 'absolute',
            animation: `${pulse} 2s ease-in-out infinite`,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: 60,
            height: 60,
            borderRadius: '50%',
            background: alpha('#fff', 0.9),
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          }}
        >
          <Logo size="small" />
        </Box>

        {/* Círculo de Fundo */}
        <Box
          sx={{
            position: 'absolute',
            width: 140,
            height: 140,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${alpha('#a2122a', 0.05)} 0%, transparent 70%)`,
            animation: `${pulse} 3s ease-in-out infinite`,
          }}
        />
      </Box>

      {/* Mensagem de Carregamento */}
      <Typography
        variant="body1"
        sx={{
          color: 'text.secondary',
          fontWeight: 500,
          animation: `${fadeIn} 0.5s ease-in`,
          textAlign: 'center',
          letterSpacing: '0.5px',
        }}
      >
        {message}
      </Typography>

      {/* Pontos Animados */}
      <Box
        sx={{
          display: 'flex',
          gap: 1,
          animation: `${fadeIn} 0.7s ease-in`,
        }}
      >
        {[0, 1, 2].map((i) => (
          <Box
            key={i}
            sx={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #a2122a 0%, #354a80 100%)',
              animation: `${pulse} 1s ease-in-out infinite`,
              animationDelay: `${i * 0.2}s`,
            }}
          />
        ))}
      </Box>
    </Box>
  );
};

