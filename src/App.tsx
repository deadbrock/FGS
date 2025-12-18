import React from 'react';
import { AppRoutes } from './routes';
import { ErrorBoundary } from './components/ErrorBoundary';
import { useAuth } from './hooks/useAuth';

// Componente principal da aplicação
const App: React.FC = () => {
  const { user } = useAuth();
  
  return (
    <ErrorBoundary user={user}>
      <AppRoutes />
    </ErrorBoundary>
  );
};

export default App;

