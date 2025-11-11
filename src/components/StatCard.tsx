import React from 'react';
import { Card, CardContent, Typography, Box, alpha, useTheme, useMediaQuery } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: string;
}

// Componente de card de estatística moderno
export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  trend,
  color = '#354a80',
  subtitle,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  
  return (
    <Card
      sx={{
        position: 'relative',
        overflow: 'hidden',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          transform: isMobile ? 'none' : 'translateY(-8px) scale(1.02)',
          boxShadow: `0 ${isMobile ? '12px 24px' : '20px 40px'} ${alpha(color, 0.25)}`,
        },
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: isMobile ? '3px' : '4px',
          background: `linear-gradient(90deg, ${color}, ${alpha(color, 0.6)})`,
        },
      }}
    >
      <CardContent sx={{ 
        position: 'relative', 
        zIndex: 1,
        p: isMobile ? 2 : 3,
        '&:last-child': { pb: isMobile ? 2 : 3 }
      }}>
        <Box 
          display="flex" 
          justifyContent="space-between" 
          alignItems="flex-start"
          flexDirection={isMobile ? 'column' : 'row'}
          gap={isMobile ? 2 : 0}
        >
          <Box flex={1} width={isMobile ? '100%' : 'auto'}>
            <Typography 
              variant="body2" 
              color="text.secondary" 
              gutterBottom
              sx={{ 
                fontWeight: 600,
                letterSpacing: '0.5px',
                textTransform: 'uppercase',
                fontSize: isMobile ? '0.7rem' : '0.75rem',
              }}
            >
              {title}
            </Typography>
            <Typography 
              variant={isMobile ? 'h4' : isTablet ? 'h3' : 'h3'}
              fontWeight={800} 
              gutterBottom
              sx={{
                background: `linear-gradient(135deg, ${color}, ${alpha(color, 0.7)})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                mb: 0.5,
              }}
            >
              {value}
            </Typography>
            {subtitle && (
              <Typography 
                variant="caption" 
                color="text.secondary"
                sx={{ display: 'block', mb: 1 }}
              >
                {subtitle}
              </Typography>
            )}
            {trend && (
              <Box 
                display="flex" 
                alignItems="center" 
                gap={0.5}
                sx={{
                  backgroundColor: trend.isPositive 
                    ? alpha('#10b981', 0.1) 
                    : alpha('#ef4444', 0.1),
                  borderRadius: 1,
                  px: 1,
                  py: 0.5,
                  width: 'fit-content',
                }}
              >
                {trend.isPositive ? (
                  <TrendingUpIcon
                    fontSize="small"
                    sx={{ color: 'success.main' }}
                  />
                ) : (
                  <TrendingDownIcon
                    fontSize="small"
                    sx={{ color: 'error.main' }}
                  />
                )}
                <Typography
                  variant="body2"
                  fontWeight={700}
                  color={trend.isPositive ? 'success.main' : 'error.main'}
                >
                  {trend.value > 0 ? '+' : ''}{trend.value}%
                </Typography>
              </Box>
            )}
          </Box>
          <Box
            sx={{
              background: `linear-gradient(135deg, ${color}, ${alpha(color, 0.8)})`,
              color: 'white',
              borderRadius: isMobile ? 2 : 3,
              p: isMobile ? 1.5 : 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: `0 ${isMobile ? '6px 16px' : '8px 24px'} ${alpha(color, 0.35)}`,
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              minWidth: isMobile ? 48 : 56,
              minHeight: isMobile ? 48 : 56,
              '&:hover': {
                transform: isMobile ? 'scale(1.05)' : 'rotate(10deg) scale(1.1)',
                boxShadow: `0 ${isMobile ? '8px 20px' : '12px 32px'} ${alpha(color, 0.45)}`,
              },
              '& > svg': {
                fontSize: isMobile ? '1.5rem' : '2rem',
              },
            }}
          >
            {icon}
          </Box>
        </Box>
      </CardContent>
      
      {/* Efeito de brilho animado */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: '-100%',
          width: '100%',
          height: '100%',
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)',
          animation: 'shimmer 3s infinite',
          '@keyframes shimmer': {
            '0%': { left: '-100%' },
            '100%': { left: '100%' },
          },
        }}
      />
    </Card>
  );
};

