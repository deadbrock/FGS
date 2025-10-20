import React from 'react';
import { Box, Container, Paper, Typography, alpha } from '@mui/material';
import { Logo } from '../components/Logo';

interface LoginLayoutProps {
  children: React.ReactNode;
}

// Layout para páginas de autenticação
export const LoginLayout: React.FC<LoginLayoutProps> = ({ children }) => {
  const currentYear = new Date().getFullYear();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #a2122a 0%, #354a80 50%, #1a2947 100%)',
        padding: 3,
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: '-50%',
          left: '-50%',
          width: '200%',
          height: '200%',
          background: `radial-gradient(circle, ${alpha('#fff', 0.1)} 1px, transparent 1px)`,
          backgroundSize: '50px 50px',
          animation: 'float 20s linear infinite',
        },
        '@keyframes float': {
          '0%': { transform: 'translate(0, 0)' },
          '100%': { transform: 'translate(50px, 50px)' },
        },
      }}
    >
      <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 1 }}>
        {/* Card Principal */}
        <Paper
          elevation={24}
          sx={{
            p: { xs: 3, sm: 5 },
            borderRadius: 4,
            background: (theme) =>
              theme.palette.mode === 'dark'
                ? alpha(theme.palette.background.paper, 0.9)
                : alpha('#fff', 0.95),
            backdropFilter: 'blur(20px)',
            boxShadow: `0 20px 60px ${alpha('#000', 0.3)}`,
            transition: 'all 0.3s ease',
            '&:hover': {
              boxShadow: `0 25px 70px ${alpha('#000', 0.4)}`,
              transform: 'translateY(-5px)',
            },
          }}
        >
          {/* Logo e Título */}
          <Box display="flex" flexDirection="column" alignItems="center" mb={4}>
            <Box
              sx={{
                animation: 'pulse 2s ease-in-out infinite',
                '@keyframes pulse': {
                  '0%, 100%': { opacity: 1, transform: 'scale(1)' },
                  '50%': { opacity: 0.9, transform: 'scale(1.02)' },
                },
              }}
            >
              <Logo size="large" />
            </Box>
            <Typography
              variant="h6"
              sx={{
                mt: 2,
                background: 'linear-gradient(135deg, #a2122a 0%, #354a80 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontWeight: 600,
                letterSpacing: 0.5,
                textAlign: 'center',
              }}
            >
              Formando Gente de Sucesso
            </Typography>
          </Box>

          {/* Conteúdo (Formulário) */}
          {children}
        </Paper>

        {/* Rodapé com Copyright */}
        <Box
          sx={{
            mt: 4,
            textAlign: 'center',
            color: alpha('#fff', 0.8),
          }}
        >
          <Typography variant="body2" sx={{ fontWeight: 300 }}>
            © {currentYear} FGS - Formando Gente de Sucesso
          </Typography>
          <Typography variant="caption" sx={{ opacity: 0.7, display: 'block', mt: 0.5 }}>
            Todos os direitos reservados
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

