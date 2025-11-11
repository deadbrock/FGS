import { createTheme, alpha } from '@mui/material/styles';

// Paleta de cores moderna e vibrante
const colors = {
  // Cores primárias com gradientes
  primary: {
    50: '#fef2f4',
    100: '#fee5e9',
    200: '#fccfd8',
    300: '#fa9fb1',
    400: '#f76584',
    500: '#ed3659',
    600: '#d91d47',
    700: '#b6143a',
    800: '#971435',
    900: '#801433',
    main: '#a2122a',
    light: '#d91d47',
    dark: '#6d0c1c',
  },
  secondary: {
    50: '#f0f4f9',
    100: '#e1e9f3',
    200: '#c9d7e9',
    300: '#a4bdd9',
    400: '#7a9ec6',
    500: '#5a82b5',
    600: '#4769a3',
    700: '#3c5a8f',
    800: '#354a80',
    900: '#2e3e6b',
    main: '#354a80',
    light: '#5a82b5',
    dark: '#2a3660',
  },
  accent: {
    purple: '#8b5cf6',
    blue: '#3b82f6',
    green: '#10b981',
    yellow: '#f59e0b',
    orange: '#f97316',
    pink: '#ec4899',
    teal: '#14b8a6',
  },
  neutral: {
    50: '#fafafa',
    100: '#f5f5f5',
    200: '#e5e5e5',
    300: '#d4d4d4',
    400: '#a3a3a3',
    500: '#737373',
    600: '#525252',
    700: '#404040',
    800: '#262626',
    900: '#171717',
  },
};

// Sombras modernas e suaves
const shadows = {
  xs: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  sm: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
  glow: '0 0 20px rgba(162, 18, 42, 0.3)',
  glowSecondary: '0 0 20px rgba(53, 74, 128, 0.3)',
};

export const createModernTheme = (mode: 'light' | 'dark') => {
  const isDark = mode === 'dark';

  return createTheme({
    palette: {
      mode,
      primary: {
        main: colors.primary.main,
        light: colors.primary.light,
        dark: colors.primary.dark,
        contrastText: '#ffffff',
      },
      secondary: {
        main: colors.secondary.main,
        light: colors.secondary.light,
        dark: colors.secondary.dark,
        contrastText: '#ffffff',
      },
      background: {
        default: isDark ? '#0f0f0f' : '#f8f9fa',
        paper: isDark ? '#1a1a1a' : '#ffffff',
      },
      text: {
        primary: isDark ? '#f5f5f5' : '#1a1a1a',
        secondary: isDark ? '#a3a3a3' : '#737373',
      },
      divider: isDark ? alpha('#ffffff', 0.08) : alpha('#000000', 0.08),
      success: {
        main: colors.accent.green,
        light: '#34d399',
        dark: '#059669',
      },
      warning: {
        main: colors.accent.orange,
        light: '#fb923c',
        dark: '#ea580c',
      },
      error: {
        main: '#ef4444',
        light: '#f87171',
        dark: '#dc2626',
      },
      info: {
        main: colors.accent.blue,
        light: '#60a5fa',
        dark: '#2563eb',
      },
    },
    typography: {
      fontFamily: [
        'Inter',
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        'Roboto',
        '"Helvetica Neue"',
        'Arial',
        'sans-serif',
      ].join(','),
      h1: {
        fontSize: '3.5rem',
        fontWeight: 800,
        lineHeight: 1.2,
        letterSpacing: '-0.02em',
      },
      h2: {
        fontSize: '2.5rem',
        fontWeight: 700,
        lineHeight: 1.3,
        letterSpacing: '-0.01em',
      },
      h3: {
        fontSize: '2rem',
        fontWeight: 700,
        lineHeight: 1.4,
      },
      h4: {
        fontSize: '1.5rem',
        fontWeight: 600,
        lineHeight: 1.4,
      },
      h5: {
        fontSize: '1.25rem',
        fontWeight: 600,
        lineHeight: 1.5,
      },
      h6: {
        fontSize: '1.125rem',
        fontWeight: 600,
        lineHeight: 1.5,
      },
      body1: {
        fontSize: '1rem',
        lineHeight: 1.6,
        letterSpacing: '0.00938em',
      },
      body2: {
        fontSize: '0.875rem',
        lineHeight: 1.6,
      },
      button: {
        textTransform: 'none',
        fontWeight: 600,
        letterSpacing: '0.02em',
      },
    },
    shape: {
      borderRadius: 12,
    },
    shadows: [
      'none',
      shadows.xs,
      shadows.sm,
      shadows.md,
      shadows.md,
      shadows.lg,
      shadows.lg,
      shadows.xl,
      shadows.xl,
      shadows['2xl'],
      shadows['2xl'],
      shadows['2xl'],
      shadows['2xl'],
      shadows['2xl'],
      shadows['2xl'],
      shadows['2xl'],
      shadows['2xl'],
      shadows['2xl'],
      shadows['2xl'],
      shadows['2xl'],
      shadows['2xl'],
      shadows['2xl'],
      shadows['2xl'],
      shadows['2xl'],
      shadows['2xl'],
    ],
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            scrollbarWidth: 'thin',
            scrollbarColor: isDark ? '#404040 #1a1a1a' : '#d4d4d4 #f5f5f5',
            '&::-webkit-scrollbar': {
              width: '8px',
              height: '8px',
            },
            '&::-webkit-scrollbar-track': {
              background: isDark ? '#1a1a1a' : '#f5f5f5',
            },
            '&::-webkit-scrollbar-thumb': {
              background: isDark ? '#404040' : '#d4d4d4',
              borderRadius: '4px',
              '&:hover': {
                background: isDark ? '#525252' : '#a3a3a3',
              },
            },
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 10,
            padding: '10px 24px',
            fontWeight: 600,
            boxShadow: 'none',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              boxShadow: shadows.md,
              transform: 'translateY(-2px)',
            },
            '&:active': {
              transform: 'translateY(0)',
            },
          },
          contained: {
            background: `linear-gradient(135deg, ${colors.primary.main} 0%, ${colors.secondary.main} 100%)`,
            '&:hover': {
              background: `linear-gradient(135deg, ${colors.primary.dark} 0%, ${colors.secondary.dark} 100%)`,
            },
          },
          outlined: {
            borderWidth: 2,
            '&:hover': {
              borderWidth: 2,
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 16,
            boxShadow: shadows.md,
            border: `1px solid ${isDark ? alpha('#ffffff', 0.05) : alpha('#000000', 0.05)}`,
            background: isDark
              ? 'linear-gradient(135deg, rgba(26, 26, 26, 0.9) 0%, rgba(30, 30, 30, 0.9) 100%)'
              : '#ffffff',
            backdropFilter: 'blur(10px)',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              boxShadow: shadows.xl,
              transform: 'translateY(-4px)',
            },
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            backgroundImage: 'none',
          },
          elevation1: {
            boxShadow: shadows.sm,
          },
          elevation2: {
            boxShadow: shadows.md,
          },
          elevation3: {
            boxShadow: shadows.lg,
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              borderRadius: 10,
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                boxShadow: shadows.sm,
              },
              '&.Mui-focused': {
                boxShadow: shadows.md,
              },
            },
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            fontWeight: 600,
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              transform: 'scale(1.05)',
            },
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            boxShadow: 'none',
            borderBottom: `1px solid ${isDark ? alpha('#ffffff', 0.08) : alpha('#000000', 0.08)}`,
            backdropFilter: 'blur(20px)',
            background: isDark
              ? alpha('#1a1a1a', 0.8)
              : alpha('#ffffff', 0.8),
          },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            borderRight: `1px solid ${isDark ? alpha('#ffffff', 0.08) : alpha('#000000', 0.08)}`,
            backdropFilter: 'blur(20px)',
            background: isDark
              ? alpha('#1a1a1a', 0.95)
              : alpha('#ffffff', 0.95),
          },
        },
      },
      MuiTableCell: {
        styleOverrides: {
          root: {
            borderBottom: `1px solid ${isDark ? alpha('#ffffff', 0.05) : alpha('#000000', 0.05)}`,
          },
          head: {
            fontWeight: 700,
            backgroundColor: isDark ? alpha('#ffffff', 0.02) : alpha('#000000', 0.02),
          },
        },
      },
      MuiTab: {
        styleOverrides: {
          root: {
            fontWeight: 600,
            textTransform: 'none',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              backgroundColor: isDark ? alpha('#ffffff', 0.05) : alpha('#000000', 0.05),
            },
            '&.Mui-selected': {
              color: colors.primary.main,
            },
          },
        },
      },
      MuiAvatar: {
        styleOverrides: {
          root: {
            boxShadow: shadows.md,
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              transform: 'scale(1.1)',
              boxShadow: shadows.lg,
            },
          },
        },
      },
    },
  });
};

export { colors, shadows };

