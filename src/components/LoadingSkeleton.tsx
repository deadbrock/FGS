import React from 'react';
import { Box, Skeleton, Card, CardContent, Grid, alpha } from '@mui/material';
import { useTheme } from '../hooks/useTheme';

interface LoadingSkeletonProps {
  variant?: 'card' | 'table' | 'form' | 'stats' | 'list';
  count?: number;
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  variant = 'card',
  count = 3,
}) => {
  const { mode } = useTheme();

  // Skeleton para Cards Estatísticos
  if (variant === 'stats') {
    return (
      <Grid container spacing={3}>
        {Array.from({ length: count }).map((_, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card
              sx={{
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: '-100%',
                  width: '100%',
                  height: '100%',
                  background: `linear-gradient(90deg, transparent, ${alpha(
                    mode === 'dark' ? '#fff' : '#000',
                    0.05
                  )}, transparent)`,
                  animation: 'shimmer 2s infinite',
                  '@keyframes shimmer': {
                    '0%': { left: '-100%' },
                    '100%': { left: '100%' },
                  },
                },
              }}
            >
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                  <Box flex={1}>
                    <Skeleton variant="text" width="60%" height={20} />
                    <Skeleton variant="text" width="40%" height={48} sx={{ mt: 1 }} />
                    <Skeleton variant="text" width="30%" height={20} sx={{ mt: 1 }} />
                  </Box>
                  <Skeleton variant="circular" width={60} height={60} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    );
  }

  // Skeleton para Tabelas
  if (variant === 'table') {
    return (
      <Card
        sx={{
          borderRadius: 3,
          overflow: 'hidden',
        }}
      >
        <Box sx={{ p: 2 }}>
          {/* Header */}
          <Box
            sx={{
              display: 'flex',
              gap: 2,
              pb: 2,
              borderBottom: 1,
              borderColor: 'divider',
            }}
          >
            <Skeleton variant="text" width="15%" height={32} />
            <Skeleton variant="text" width="25%" height={32} />
            <Skeleton variant="text" width="20%" height={32} />
            <Skeleton variant="text" width="15%" height={32} />
            <Skeleton variant="text" width="10%" height={32} />
          </Box>

          {/* Rows */}
          {Array.from({ length: count }).map((_, index) => (
            <Box
              key={index}
              sx={{
                display: 'flex',
                gap: 2,
                py: 2,
                borderBottom: index < count - 1 ? 1 : 0,
                borderColor: 'divider',
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: '-100%',
                  width: '100%',
                  height: '100%',
                  background: `linear-gradient(90deg, transparent, ${alpha(
                    mode === 'dark' ? '#fff' : '#000',
                    0.03
                  )}, transparent)`,
                  animation: 'shimmer 2s infinite',
                  animationDelay: `${index * 0.1}s`,
                  '@keyframes shimmer': {
                    '0%': { left: '-100%' },
                    '100%': { left: '100%' },
                  },
                },
              }}
            >
              <Skeleton variant="text" width="15%" height={24} />
              <Skeleton variant="text" width="25%" height={24} />
              <Skeleton variant="text" width="20%" height={24} />
              <Skeleton variant="text" width="15%" height={24} />
              <Skeleton variant="text" width="10%" height={24} />
            </Box>
          ))}
        </Box>
      </Card>
    );
  }

  // Skeleton para Formulários
  if (variant === 'form') {
    return (
      <Card sx={{ borderRadius: 3 }}>
        <CardContent>
          <Grid container spacing={3}>
            {Array.from({ length: count }).map((_, index) => (
              <Grid item xs={12} sm={6} key={index}>
                <Box>
                  <Skeleton variant="text" width="40%" height={20} sx={{ mb: 1 }} />
                  <Skeleton
                    variant="rectangular"
                    height={56}
                    sx={{
                      borderRadius: 2,
                      animation: 'pulse 1.5s ease-in-out infinite',
                      animationDelay: `${index * 0.1}s`,
                      '@keyframes pulse': {
                        '0%': { opacity: 1 },
                        '50%': { opacity: 0.4 },
                        '100%': { opacity: 1 },
                      },
                    }}
                  />
                </Box>
              </Grid>
            ))}
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Skeleton variant="rectangular" width={100} height={40} sx={{ borderRadius: 2 }} />
                <Skeleton variant="rectangular" width={100} height={40} sx={{ borderRadius: 2 }} />
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    );
  }

  // Skeleton para Lista
  if (variant === 'list') {
    return (
      <Box>
        {Array.from({ length: count }).map((_, index) => (
          <Card
            key={index}
            sx={{
              mb: 2,
              borderRadius: 3,
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: '-100%',
                width: '100%',
                height: '100%',
                background: `linear-gradient(90deg, transparent, ${alpha(
                  mode === 'dark' ? '#fff' : '#000',
                  0.05
                )}, transparent)`,
                animation: 'shimmer 2s infinite',
                animationDelay: `${index * 0.15}s`,
                '@keyframes shimmer': {
                  '0%': { left: '-100%' },
                  '100%': { left: '100%' },
                },
              },
            }}
          >
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <Skeleton variant="circular" width={48} height={48} />
                <Box flex={1}>
                  <Skeleton variant="text" width="60%" height={24} />
                  <Skeleton variant="text" width="40%" height={20} />
                </Box>
                <Skeleton variant="rectangular" width={80} height={32} sx={{ borderRadius: 2 }} />
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>
    );
  }

  // Skeleton para Cards padrão
  return (
    <Grid container spacing={3}>
      {Array.from({ length: count }).map((_, index) => (
        <Grid item xs={12} sm={6} md={4} key={index}>
          <Card
            sx={{
              borderRadius: 3,
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: '-100%',
                width: '100%',
                height: '100%',
                background: `linear-gradient(90deg, transparent, ${alpha(
                  mode === 'dark' ? '#fff' : '#000',
                  0.05
                )}, transparent)`,
                animation: 'shimmer 2s infinite',
                animationDelay: `${index * 0.2}s`,
                '@keyframes shimmer': {
                  '0%': { left: '-100%' },
                  '100%': { left: '100%' },
                },
              },
            }}
          >
            <Skeleton variant="rectangular" height={200} />
            <CardContent>
              <Skeleton variant="text" width="80%" height={32} />
              <Skeleton variant="text" width="60%" height={24} sx={{ mt: 1 }} />
              <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                <Skeleton variant="rectangular" width={80} height={32} sx={{ borderRadius: 2 }} />
                <Skeleton variant="rectangular" width={80} height={32} sx={{ borderRadius: 2 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

// Skeleton específico para página completa
export const PageLoadingSkeleton: React.FC = () => {
  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Skeleton variant="text" width="30%" height={48} />
        <Skeleton variant="text" width="50%" height={24} sx={{ mt: 1 }} />
      </Box>

      {/* Stats */}
      <LoadingSkeleton variant="stats" count={4} />

      {/* Table */}
      <Box sx={{ mt: 4 }}>
        <LoadingSkeleton variant="table" count={5} />
      </Box>
    </Box>
  );
};

