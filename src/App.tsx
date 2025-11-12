import React from 'react';
import { AppRoutes } from './routes';
import { ErrorBoundary } from './components/ErrorBoundary';

// Componente principal da aplicação
const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <AppRoutes />
    </ErrorBoundary>
  );
};

export default App;

