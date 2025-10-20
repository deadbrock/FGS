import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from './useAuth';
import logService from '../services/logService';

// Hook customizado para registrar logs de navegação
export const useNavigationLog = () => {
  const location = useLocation();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      logService.logNavigation(
        user.id,
        user.nome,
        location.pathname,
        'Navegação'
      );
    }
  }, [location.pathname, user]);

  return {
    logAction: (action: string) => {
      if (user) {
        logService.logNavigation(user.id, user.nome, location.pathname, action);
      }
    },
  };
};

