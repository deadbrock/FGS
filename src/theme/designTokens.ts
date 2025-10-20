/**
 * Design Tokens - FGS Painel Web
 * Sistema de design padronizado para o painel FGS
 */

// Cores Institucionais
export const colors = {
  primary: {
    main: '#a2122a',
    light: '#d4455d',
    dark: '#6e0c1d',
    contrastText: '#ffffff',
  },
  secondary: {
    main: '#354a80',
    light: '#5f75b3',
    dark: '#1a2947',
    contrastText: '#ffffff',
  },
  success: {
    main: '#388e3c',
    light: '#66bb6a',
    dark: '#2e7d32',
  },
  warning: {
    main: '#f57c00',
    light: '#ff9800',
    dark: '#e65100',
  },
  error: {
    main: '#d32f2f',
    light: '#ef5350',
    dark: '#c62828',
  },
  info: {
    main: '#1976d2',
    light: '#42a5f5',
    dark: '#1565c0',
  },
};

// Gradientes
export const gradients = {
  primary: 'linear-gradient(135deg, #a2122a 0%, #354a80 100%)',
  primaryHover: 'linear-gradient(135deg, #8a0f22 0%, #2a3a66 100%)',
  background: 'linear-gradient(135deg, #a2122a 0%, #354a80 50%, #1a2947 100%)',
  card: 'linear-gradient(135deg, rgba(162, 18, 42, 0.05) 0%, rgba(53, 74, 128, 0.05) 100%)',
  subtle: 'linear-gradient(135deg, rgba(162, 18, 42, 0.02) 0%, rgba(53, 74, 128, 0.02) 100%)',
};

// Espaçamentos (baseado em múltiplos de 8px)
export const spacing = {
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '32px',
  '2xl': '48px',
  '3xl': '64px',
  '4xl': '96px',
};

// Tamanhos de Bordas
export const borderRadius = {
  none: '0',
  sm: '4px',
  md: '8px',
  lg: '12px',
  xl: '16px',
  '2xl': '20px',
  '3xl': '24px',
  full: '9999px',
};

// Sombras (elevation system)
export const shadows = {
  none: 'none',
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
  // Sombras coloridas
  primarySm: '0 4px 12px rgba(162, 18, 42, 0.15)',
  primaryMd: '0 8px 24px rgba(162, 18, 42, 0.2)',
  primaryLg: '0 12px 36px rgba(162, 18, 42, 0.25)',
  secondarySm: '0 4px 12px rgba(53, 74, 128, 0.15)',
  secondaryMd: '0 8px 24px rgba(53, 74, 128, 0.2)',
  secondaryLg: '0 12px 36px rgba(53, 74, 128, 0.25)',
};

// Tipografia
export const typography = {
  fontFamily: {
    primary: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif",
    secondary: "'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif",
    mono: "'Fira Code', 'Courier New', monospace",
  },
  fontSize: {
    xs: '0.75rem',      // 12px
    sm: '0.875rem',     // 14px
    base: '1rem',       // 16px
    lg: '1.125rem',     // 18px
    xl: '1.25rem',      // 20px
    '2xl': '1.5rem',    // 24px
    '3xl': '1.875rem',  // 30px
    '4xl': '2.25rem',   // 36px
    '5xl': '3rem',      // 48px
    '6xl': '3.75rem',   // 60px
  },
  fontWeight: {
    light: 300,
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
  },
  lineHeight: {
    none: 1,
    tight: 1.25,
    snug: 1.375,
    normal: 1.5,
    relaxed: 1.625,
    loose: 2,
  },
  letterSpacing: {
    tighter: '-0.05em',
    tight: '-0.025em',
    normal: '0',
    wide: '0.025em',
    wider: '0.05em',
    widest: '0.1em',
  },
};

// Transições
export const transitions = {
  duration: {
    fastest: '100ms',
    fast: '200ms',
    normal: '300ms',
    slow: '400ms',
    slowest: '500ms',
  },
  easing: {
    linear: 'linear',
    ease: 'ease',
    easeIn: 'ease-in',
    easeOut: 'ease-out',
    easeInOut: 'ease-in-out',
    spring: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
};

// Z-index layers
export const zIndex = {
  base: 0,
  dropdown: 1000,
  sticky: 1020,
  fixed: 1030,
  modalBackdrop: 1040,
  modal: 1050,
  popover: 1060,
  tooltip: 1070,
};

// Breakpoints (para responsividade)
export const breakpoints = {
  xs: '0px',
  sm: '600px',
  md: '960px',
  lg: '1280px',
  xl: '1920px',
};

// Tamanhos de Container
export const containerSizes = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
};

// Opacidades
export const opacity = {
  disabled: 0.38,
  hover: 0.04,
  selected: 0.08,
  focus: 0.12,
  activated: 0.12,
};

export default {
  colors,
  gradients,
  spacing,
  borderRadius,
  shadows,
  typography,
  transitions,
  zIndex,
  breakpoints,
  containerSizes,
  opacity,
};

