import React from 'react';
import { Button, ButtonProps, CircularProgress, keyframes } from '@mui/material';
import { alpha } from '@mui/material/styles';

const ripple = keyframes`
  0% {
    transform: scale(0);
    opacity: 0.5;
  }
  100% {
    transform: scale(2);
    opacity: 0;
  }
`;

const shimmer = keyframes`
  0% {
    left: -100%;
  }
  100% {
    left: 100%;
  }
`;

interface GradientButtonProps extends ButtonProps {
  loading?: boolean;
  gradient?: 'primary' | 'secondary' | 'success' | 'error';
}

export const GradientButton: React.FC<GradientButtonProps> = ({
  loading = false,
  gradient = 'primary',
  children,
  disabled,
  onClick,
  ...props
}) => {
  const gradients = {
    primary: {
      normal: 'linear-gradient(135deg, #a2122a 0%, #354a80 100%)',
      hover: 'linear-gradient(135deg, #8a0f22 0%, #2a3a66 100%)',
    },
    secondary: {
      normal: 'linear-gradient(135deg, #354a80 0%, #5f75b3 100%)',
      hover: 'linear-gradient(135deg, #2a3a66 0%, #4a5f8f 100%)',
    },
    success: {
      normal: 'linear-gradient(135deg, #388e3c 0%, #66bb6a 100%)',
      hover: 'linear-gradient(135deg, #2e7d32 0%, #4caf50 100%)',
    },
    error: {
      normal: 'linear-gradient(135deg, #d32f2f 0%, #f44336 100%)',
      hover: 'linear-gradient(135deg, #c62828 0%, #e53935 100%)',
    },
  };

  return (
    <Button
      {...props}
      disabled={disabled || loading}
      onClick={onClick}
      sx={{
        position: 'relative',
        overflow: 'hidden',
        background: gradients[gradient].normal,
        color: 'white',
        fontWeight: 600,
        fontSize: '0.95rem',
        textTransform: 'none',
        letterSpacing: '0.3px',
        borderRadius: 2.5,
        px: 3,
        py: 1.25,
        boxShadow: `0 4px 12px ${alpha('#a2122a', 0.3)}`,
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        
        // Camada de brilho animado
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: '-100%',
          width: '100%',
          height: '100%',
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
          transition: 'left 0.5s ease',
        },
        
        '&:hover': {
          background: gradients[gradient].hover,
          transform: 'translateY(-2px)',
          boxShadow: `0 6px 20px ${alpha('#a2122a', 0.4)}`,
          
          '&::before': {
            animation: `${shimmer} 0.8s ease`,
          },
        },
        
        '&:active': {
          transform: 'translateY(0) scale(0.98)',
          boxShadow: `0 2px 8px ${alpha('#a2122a', 0.3)}`,
        },
        
        // Efeito de onda ao clicar
        '&::after': {
          content: '""',
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: '5px',
          height: '5px',
          background: 'rgba(255, 255, 255, 0.5)',
          opacity: 0,
          borderRadius: '50%',
          transform: 'translate(-50%, -50%)',
        },
        
        '&:active::after': {
          animation: `${ripple} 0.6s ease-out`,
        },
        
        '&.Mui-disabled': {
          background: 'linear-gradient(135deg, #ccc 0%, #999 100%)',
          color: 'rgba(0, 0, 0, 0.38)',
          boxShadow: 'none',
          transform: 'none',
        },
        ...props.sx,
      }}
    >
      {loading ? (
        <CircularProgress size={20} sx={{ color: 'white', mr: 1 }} />
      ) : null}
      {children}
    </Button>
  );
};

