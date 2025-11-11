import React from 'react';
import { Box, Typography } from '@mui/material';

interface LogoProps {
  size?: 'small' | 'medium' | 'large';
  showText?: boolean;
  variant?: 'default' | 'image';
}

// Componente do logo FGS
export const Logo: React.FC<LogoProps> = ({ 
  size = 'medium', 
  showText = true,
  variant = 'image' 
}) => {
  const sizes = {
    small: { fontSize: 20, height: 40, imageWidth: 120 },
    medium: { fontSize: 28, height: 56, imageWidth: 160 },
    large: { fontSize: 40, height: 80, imageWidth: 200 },
  };

  // Versão com imagem
  if (variant === 'image') {
    return (
      <Box
        display="flex"
        alignItems="center"
        gap={1.5}
        sx={{ height: sizes[size].height }}
      >
        <Box
          component="img"
          src="/logo-fgs.png"
          alt="FGS - Formando Gente de Sucesso"
          sx={{
            height: sizes[size].height,
            width: 'auto',
            maxWidth: sizes[size].imageWidth,
            objectFit: 'contain',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              transform: 'scale(1.05)',
              filter: 'brightness(1.1)',
            },
          }}
          onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
            // Fallback: esconde a imagem se não carregar
            e.currentTarget.style.display = 'none';
            // Mostra o texto FGS como fallback
            const parent = e.currentTarget.parentElement;
            if (parent) {
              const fallback = document.createElement('div');
              fallback.innerHTML = 'FGS';
              fallback.style.cssText = `
                width: ${sizes[size].height}px;
                height: ${sizes[size].height}px;
                background: linear-gradient(135deg, #a2122a 0%, #354a80 100%);
                border-radius: 8px;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-weight: 700;
                font-size: ${sizes[size].fontSize}px;
              `;
              parent.insertBefore(fallback, e.currentTarget);
            }
          }}
        />
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
  }

  // Versão padrão (texto)
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
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'scale(1.05) rotate(-5deg)',
            boxShadow: '0 8px 24px rgba(162, 18, 42, 0.4)',
          },
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

