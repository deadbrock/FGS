import React from 'react';
import { Box, CircularProgress, Typography, alpha } from '@mui/material';
import { motion } from 'framer-motion';
import { Logo } from './Logo';

interface LoaderFGSProps {
  message?: string;
  fullScreen?: boolean;
}

export const LoaderFGS: React.FC<LoaderFGSProps> = ({
  message = 'Carregando...',
  fullScreen = true,
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: fullScreen ? '100vh' : '300px',
        width: '100%',
        background: fullScreen
          ? (theme) =>
              theme.palette.mode === 'light'
                ? 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
                : 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)'
          : 'transparent',
      }}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          duration: 0.5,
          ease: 'easeOut',
        }}
      >
        <Box
          sx={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 3,
          }}
        >
          {/* CircularProgress com gradiente */}
          <CircularProgress
            size={120}
            thickness={3}
            sx={{
              position: 'absolute',
              color: (theme) =>
                theme.palette.mode === 'light' ? '#a2122a' : '#d4455d',
              '& .MuiCircularProgress-circle': {
                strokeLinecap: 'round',
              },
            }}
          />
          
          {/* Logo pulsando */}
          <motion.div
            animate={{
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <Logo size="large" showText={false} />
          </motion.div>
        </Box>
      </motion.div>

      {/* Mensagem com fade */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.4 }}
      >
        <Typography
          variant="h6"
          sx={{
            color: (theme) =>
              theme.palette.mode === 'light'
                ? alpha('#000', 0.7)
                : alpha('#fff', 0.9),
            fontWeight: 500,
            letterSpacing: 0.5,
          }}
        >
          {message}
        </Typography>
      </motion.div>

      {/* Dots animados */}
      <Box display="flex" gap={1} mt={2}>
        {[0, 1, 2].map((index) => (
          <motion.div
            key={index}
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              delay: index * 0.2,
            }}
          >
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                bgcolor: (theme) =>
                  theme.palette.mode === 'light' ? '#a2122a' : '#d4455d',
              }}
            />
          </motion.div>
        ))}
      </Box>
    </Box>
  );
};

