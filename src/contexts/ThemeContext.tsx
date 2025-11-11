import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import { ThemeProvider as MuiThemeProvider, Theme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { createModernTheme } from '../styles/modernTheme';

type ThemeMode = 'light' | 'dark';

interface ThemeContextType {
  mode: ThemeMode;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  // Recupera tema salvo ou usa o padrão
  const [mode, setMode] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('theme-mode');
    return (saved as ThemeMode) || 'light';
  });

  // Salva no localStorage quando mudar
  useEffect(() => {
    localStorage.setItem('theme-mode', mode);
  }, [mode]);

  const toggleTheme = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  const theme = useMemo<Theme>(
    () =>
      createModernTheme(mode),
    [mode]
  );

  /* TEMA ANTIGO - REMOVIDO E SUBSTITUÍDO PELO TEMA MODERNO
  const oldTheme = useMemo<Theme>(
    () =>
      createTheme({
        palette: {
          mode,
          primary: {
            main: '#a2122a',
            light: '#d4455d',
            dark: '#6e0c1d',
            contrastText: '#ffffff',
          },
          secondary: {
            main: '#354a80',
            light: '#5f75b3',
            dark: '#243357',
            contrastText: '#ffffff',
          },
          background: {
            default: mode === 'light' ? '#f8f9fa' : '#0a0e1a',
            paper: mode === 'light' ? '#ffffff' : '#141824',
          },
          text: {
            primary: mode === 'light' ? '#1a1a1a' : '#e8eaed',
            secondary: mode === 'light' ? '#666666' : '#9aa0a6',
          },
          error: {
            main: '#d32f2f',
          },
          warning: {
            main: '#f57c00',
          },
          info: {
            main: '#1976d2',
          },
          success: {
            main: '#388e3c',
          },
        },
        typography: {
          fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
          h1: {
            fontWeight: 700,
            fontSize: '2.5rem',
            letterSpacing: '-0.02em',
          },
          h2: {
            fontWeight: 700,
            fontSize: '2rem',
            letterSpacing: '-0.01em',
          },
          h3: {
            fontWeight: 600,
            fontSize: '1.75rem',
            letterSpacing: '-0.01em',
          },
          h4: {
            fontWeight: 600,
            fontSize: '1.5rem',
            letterSpacing: '-0.005em',
          },
          h5: {
            fontWeight: 600,
            fontSize: '1.25rem',
          },
          h6: {
            fontWeight: 600,
            fontSize: '1rem',
          },
          button: {
            textTransform: 'none',
            fontWeight: 600,
          },
        },
        shape: {
          borderRadius: 12,
        },
        shadows: [
          'none',
          mode === 'light' ? '0 2px 4px rgba(0,0,0,0.05)' : '0 2px 4px rgba(0,0,0,0.3)',
          mode === 'light' ? '0 4px 8px rgba(0,0,0,0.08)' : '0 4px 8px rgba(0,0,0,0.4)',
          mode === 'light' ? '0 8px 16px rgba(0,0,0,0.1)' : '0 8px 16px rgba(0,0,0,0.5)',
          mode === 'light' ? '0 12px 24px rgba(0,0,0,0.12)' : '0 12px 24px rgba(0,0,0,0.6)',
          mode === 'light' ? '0 16px 32px rgba(0,0,0,0.14)' : '0 16px 32px rgba(0,0,0,0.7)',
          mode === 'light' ? '0 20px 40px rgba(0,0,0,0.16)' : '0 20px 40px rgba(0,0,0,0.8)',
          mode === 'light' ? '0 20px 40px rgba(0,0,0,0.16)' : '0 20px 40px rgba(0,0,0,0.8)',
          mode === 'light' ? '0 20px 40px rgba(0,0,0,0.16)' : '0 20px 40px rgba(0,0,0,0.8)',
          mode === 'light' ? '0 20px 40px rgba(0,0,0,0.16)' : '0 20px 40px rgba(0,0,0,0.8)',
          mode === 'light' ? '0 20px 40px rgba(0,0,0,0.16)' : '0 20px 40px rgba(0,0,0,0.8)',
          mode === 'light' ? '0 20px 40px rgba(0,0,0,0.16)' : '0 20px 40px rgba(0,0,0,0.8)',
          mode === 'light' ? '0 20px 40px rgba(0,0,0,0.16)' : '0 20px 40px rgba(0,0,0,0.8)',
          mode === 'light' ? '0 20px 40px rgba(0,0,0,0.16)' : '0 20px 40px rgba(0,0,0,0.8)',
          mode === 'light' ? '0 20px 40px rgba(0,0,0,0.16)' : '0 20px 40px rgba(0,0,0,0.8)',
          mode === 'light' ? '0 20px 40px rgba(0,0,0,0.16)' : '0 20px 40px rgba(0,0,0,0.8)',
          mode === 'light' ? '0 20px 40px rgba(0,0,0,0.16)' : '0 20px 40px rgba(0,0,0,0.8)',
          mode === 'light' ? '0 20px 40px rgba(0,0,0,0.16)' : '0 20px 40px rgba(0,0,0,0.8)',
          mode === 'light' ? '0 20px 40px rgba(0,0,0,0.16)' : '0 20px 40px rgba(0,0,0,0.8)',
          mode === 'light' ? '0 20px 40px rgba(0,0,0,0.16)' : '0 20px 40px rgba(0,0,0,0.8)',
          mode === 'light' ? '0 20px 40px rgba(0,0,0,0.16)' : '0 20px 40px rgba(0,0,0,0.8)',
          mode === 'light' ? '0 20px 40px rgba(0,0,0,0.16)' : '0 20px 40px rgba(0,0,0,0.8)',
          mode === 'light' ? '0 20px 40px rgba(0,0,0,0.16)' : '0 20px 40px rgba(0,0,0,0.8)',
          mode === 'light' ? '0 20px 40px rgba(0,0,0,0.16)' : '0 20px 40px rgba(0,0,0,0.8)',
          mode === 'light' ? '0 20px 40px rgba(0,0,0,0.16)' : '0 20px 40px rgba(0,0,0,0.8)',
        ] as const,
        components: {
          MuiButton: {
            styleOverrides: {
              root: {
                borderRadius: 10,
                padding: '10px 24px',
                fontWeight: 600,
                boxShadow: 'none',
                transition: 'all 0.3s ease',
                '&:hover': {
                  boxShadow:
                    mode === 'light'
                      ? '0 4px 12px rgba(162, 18, 42, 0.3)'
                      : '0 4px 12px rgba(162, 18, 42, 0.5)',
                  transform: 'translateY(-2px)',
                },
              },
              contained: {
                background: 'linear-gradient(135deg, #a2122a 0%, #d4455d 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #6e0c1d 0%, #a2122a 100%)',
                },
              },
            },
          },
          MuiCard: {
            styleOverrides: {
              root: {
                borderRadius: 16,
                boxShadow:
                  mode === 'light'
                    ? '0 4px 20px rgba(0,0,0,0.08)'
                    : '0 4px 20px rgba(0,0,0,0.4)',
                transition: 'all 0.3s ease',
                border: mode === 'light' ? '1px solid rgba(0,0,0,0.06)' : '1px solid rgba(255,255,255,0.1)',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow:
                    mode === 'light'
                      ? '0 8px 30px rgba(0,0,0,0.12)'
                      : '0 8px 30px rgba(0,0,0,0.6)',
                },
              },
            },
          },
          MuiDrawer: {
            styleOverrides: {
              paper: {
                borderRight: mode === 'light' ? '1px solid rgba(0,0,0,0.08)' : '1px solid rgba(255,255,255,0.08)',
                background: mode === 'light' ? '#ffffff' : '#141824',
              },
            },
          },
          MuiAppBar: {
            styleOverrides: {
              root: {
                boxShadow: mode === 'light' ? '0 2px 8px rgba(0,0,0,0.05)' : '0 2px 8px rgba(0,0,0,0.3)',
                backdropFilter: 'blur(20px)',
                background:
                  mode === 'light'
                    ? 'rgba(255,255,255,0.95)'
                    : 'rgba(20,24,36,0.95)',
                borderBottom: mode === 'light' ? '1px solid rgba(0,0,0,0.08)' : '1px solid rgba(255,255,255,0.08)',
              },
            },
          },
          MuiChip: {
            styleOverrides: {
              root: {
                fontWeight: 600,
                borderRadius: 8,
              },
            },
          },
          MuiTextField: {
            styleOverrides: {
              root: {
                '& .MuiOutlinedInput-root': {
                  borderRadius: 10,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: mode === 'light' ? '#a2122a' : '#d4455d',
                    },
                  },
                },
              },
            },
          },
          MuiListItemButton: {
            styleOverrides: {
              root: {
                borderRadius: 10,
                margin: '4px 8px',
                transition: 'all 0.2s ease',
                '&:hover': {
                  backgroundColor: mode === 'light' ? 'rgba(162, 18, 42, 0.08)' : 'rgba(162, 18, 42, 0.15)',
                  transform: 'translateX(4px)',
                },
                '&.Mui-selected': {
                  backgroundColor: mode === 'light' ? 'rgba(162, 18, 42, 0.12)' : 'rgba(162, 18, 42, 0.2)',
                  borderLeft: '3px solid #a2122a',
                  '&:hover': {
                    backgroundColor: mode === 'light' ? 'rgba(162, 18, 42, 0.16)' : 'rgba(162, 18, 42, 0.25)',
                  },
                },
              },
            },
          },
        },
      }),
    [mode]
  );
  */

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme }}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};

