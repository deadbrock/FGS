import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { UserRole } from '../types';
import { hasPermission, hasRouteAccess } from '../utils/permissions';
import { Box, Typography, Button } from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';

interface PrivateRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
  redirectTo?: string;
}

// Componente para rotas protegidas
export const PrivateRoute: React.FC<PrivateRouteProps> = ({
  children,
  allowedRoles,
  redirectTo = '/login',
}) => {
  const { signed, user, loading } = useAuth();

  // Aguarda carregamento dos dados de autenticação
  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <Typography>Carregando...</Typography>
      </Box>
    );
  }

  // Redireciona para login se não estiver autenticado
  if (!signed) {
    return <Navigate to={redirectTo} replace />;
  }

  // Verifica permissões baseadas em perfil e departamento
  const location = useLocation();
  if (user) {
    const currentPath = location.pathname;
    const hasAccess = hasRouteAccess(user, currentPath);

    if (!hasAccess) {
      return (
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          minHeight="100vh"
          gap={2}
        >
          <LockIcon sx={{ fontSize: 64, color: 'error.main' }} />
          <Typography variant="h4" color="error">
            Acesso Negado
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Você não tem permissão para acessar esta página.
          </Typography>
          <Button variant="contained" href="/dashboard">
            Voltar ao Dashboard
          </Button>
        </Box>
      );
    }
  }

  return <>{children}</>;
};

