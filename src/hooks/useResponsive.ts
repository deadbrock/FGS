import { useState, useEffect } from 'react';

export type ScreenSize = 'mobile' | 'tablet' | 'desktop' | 'large' | 'xlarge';

interface UseResponsiveReturn {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isLarge: boolean;
  isXLarge: boolean;
  screenSize: ScreenSize;
  width: number;
  height: number;
}

/**
 * Hook para detectar o tamanho da tela e tornar o sistema responsivo
 * 
 * Breakpoints:
 * - Mobile: < 768px
 * - Tablet: 768px - 1023px
 * - Desktop: 1024px - 1439px
 * - Large: 1440px - 1919px
 * - XLarge: >= 1920px
 */
export const useResponsive = (): UseResponsiveReturn => {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    // Throttle resize events para melhor performance
    let timeoutId: NodeJS.Timeout;
    const throttledResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(handleResize, 150);
    };

    window.addEventListener('resize', throttledResize);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', throttledResize);
      clearTimeout(timeoutId);
    };
  }, []);

  const { width, height } = windowSize;

  // Definir breakpoints
  const isMobile = width < 768;
  const isTablet = width >= 768 && width < 1024;
  const isDesktop = width >= 1024 && width < 1440;
  const isLarge = width >= 1440 && width < 1920;
  const isXLarge = width >= 1920;

  // Determinar o tamanho da tela atual
  let screenSize: ScreenSize = 'desktop';
  if (isMobile) screenSize = 'mobile';
  else if (isTablet) screenSize = 'tablet';
  else if (isDesktop) screenSize = 'desktop';
  else if (isLarge) screenSize = 'large';
  else if (isXLarge) screenSize = 'xlarge';

  return {
    isMobile,
    isTablet,
    isDesktop,
    isLarge,
    isXLarge,
    screenSize,
    width,
    height,
  };
};

/**
 * Hook simplificado para verificar se está em mobile
 */
export const useIsMobile = (): boolean => {
  const { isMobile } = useResponsive();
  return isMobile;
};

/**
 * Hook simplificado para verificar se está em desktop
 */
export const useIsDesktop = (): boolean => {
  const { isDesktop, isLarge, isXLarge } = useResponsive();
  return isDesktop || isLarge || isXLarge;
};

