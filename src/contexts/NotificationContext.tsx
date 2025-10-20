import React, { createContext, useContext } from 'react';
import { SnackbarProvider, useSnackbar, VariantType } from 'notistack';
import { IconButton, alpha } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import WarningIcon from '@mui/icons-material/Warning';
import InfoIcon from '@mui/icons-material/Info';

interface NotificationContextData {
  showSuccess: (message: string) => void;
  showError: (message: string) => void;
  showWarning: (message: string) => void;
  showInfo: (message: string) => void;
}

const NotificationContext = createContext<NotificationContextData>(
  {} as NotificationContextData
);

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within NotificationProvider');
  }
  return context;
};

const NotificationProviderContent: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const showNotification = (message: string, variant: VariantType) => {
    enqueueSnackbar(message, {
      variant,
      autoHideDuration: 4000,
      anchorOrigin: {
        vertical: 'top',
        horizontal: 'right',
      },
      action: (key) => (
        <IconButton
          size="small"
          aria-label="close"
          color="inherit"
          onClick={() => closeSnackbar(key)}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      ),
    });
  };

  const value: NotificationContextData = {
    showSuccess: (message: string) => showNotification(message, 'success'),
    showError: (message: string) => showNotification(message, 'error'),
    showWarning: (message: string) => showNotification(message, 'warning'),
    showInfo: (message: string) => showNotification(message, 'info'),
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <SnackbarProvider
      maxSnack={3}
      iconVariant={{
        success: <CheckCircleIcon sx={{ mr: 1 }} />,
        error: <ErrorIcon sx={{ mr: 1 }} />,
        warning: <WarningIcon sx={{ mr: 1 }} />,
        info: <InfoIcon sx={{ mr: 1 }} />,
      }}
      sx={{
        '&.SnackbarItem-variantSuccess': {
          background: 'linear-gradient(135deg, #388e3c 0%, #66bb6a 100%)',
          borderRadius: 2,
          boxShadow: '0 4px 12px rgba(56, 142, 60, 0.3)',
        },
        '&.SnackbarItem-variantError': {
          background: 'linear-gradient(135deg, #d32f2f 0%, #f44336 100%)',
          borderRadius: 2,
          boxShadow: '0 4px 12px rgba(211, 47, 47, 0.3)',
        },
        '&.SnackbarItem-variantWarning': {
          background: 'linear-gradient(135deg, #f57c00 0%, #ff9800 100%)',
          borderRadius: 2,
          boxShadow: '0 4px 12px rgba(245, 124, 0, 0.3)',
        },
        '&.SnackbarItem-variantInfo': {
          background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
          borderRadius: 2,
          boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)',
        },
      }}
    >
      <NotificationProviderContent>{children}</NotificationProviderContent>
    </SnackbarProvider>
  );
};

