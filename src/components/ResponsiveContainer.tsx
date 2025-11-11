import React from 'react';
import { Box, Container, ContainerProps } from '@mui/material';
import { useResponsive } from '../hooks/useResponsive';

interface ResponsiveContainerProps extends Omit<ContainerProps, 'maxWidth'> {
  children: React.ReactNode;
  /** Padding responsivo automático */
  noPadding?: boolean;
  /** Largura máxima customizada por tamanho de tela */
  customMaxWidth?: {
    mobile?: string | number;
    tablet?: string | number;
    desktop?: string | number;
    large?: string | number;
    xlarge?: string | number;
  };
}

/**
 * Container responsivo que adapta automaticamente padding e max-width
 * baseado no tamanho da tela
 */
export const ResponsiveContainer: React.FC<ResponsiveContainerProps> = ({
  children,
  noPadding = false,
  customMaxWidth,
  ...props
}) => {
  const { isMobile, isTablet, isDesktop, isLarge, isXLarge } = useResponsive();

  // Determinar padding baseado no tamanho da tela
  const getPadding = () => {
    if (noPadding) return 0;
    if (isMobile) return 2; // 16px
    if (isTablet) return 3; // 24px
    if (isDesktop) return 4; // 32px
    if (isLarge) return 5; // 40px
    if (isXLarge) return 6; // 48px
    return 3; // default
  };

  // Determinar maxWidth
  const getMaxWidth = (): 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false => {
    if (customMaxWidth) {
      // Usar maxWidth customizado se fornecido
      return false; // Desabilitar maxWidth padrão do MUI
    }
    
    if (isMobile) return 'sm';
    if (isTablet) return 'md';
    if (isDesktop) return 'lg';
    if (isLarge || isXLarge) return 'xl';
    return 'lg'; // default
  };

  // Aplicar maxWidth customizado se fornecido
  const getCustomMaxWidth = () => {
    if (!customMaxWidth) return undefined;
    
    if (isMobile && customMaxWidth.mobile) return customMaxWidth.mobile;
    if (isTablet && customMaxWidth.tablet) return customMaxWidth.tablet;
    if (isDesktop && customMaxWidth.desktop) return customMaxWidth.desktop;
    if (isLarge && customMaxWidth.large) return customMaxWidth.large;
    if (isXLarge && customMaxWidth.xlarge) return customMaxWidth.xlarge;
    
    return undefined;
  };

  return (
    <Container
      maxWidth={getMaxWidth()}
      sx={{
        p: getPadding(),
        maxWidth: getCustomMaxWidth(),
        ...props.sx,
      }}
      {...props}
    >
      {children}
    </Container>
  );
};

/**
 * Box responsivo para seções internas
 */
interface ResponsiveBoxProps {
  children: React.ReactNode;
  spacing?: 'sm' | 'md' | 'lg' | 'xl';
  [key: string]: any;
}

export const ResponsiveBox: React.FC<ResponsiveBoxProps> = ({
  children,
  spacing = 'md',
  ...props
}) => {
  const { isMobile, isTablet } = useResponsive();

  const getSpacing = () => {
    const multiplier = isMobile ? 0.75 : isTablet ? 0.85 : 1;
    
    const spacingMap = {
      sm: 2 * multiplier,
      md: 3 * multiplier,
      lg: 4 * multiplier,
      xl: 5 * multiplier,
    };
    
    return spacingMap[spacing];
  };

  return (
    <Box
      sx={{
        mb: getSpacing(),
        ...props.sx,
      }}
      {...props}
    >
      {children}
    </Box>
  );
};

