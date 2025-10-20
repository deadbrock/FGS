import React from 'react';
import { Card, CardProps } from '@mui/material';

interface AnimatedCardProps extends CardProps {
  delay?: number;
}

export const AnimatedCard: React.FC<AnimatedCardProps> = ({
  delay = 0,
  children,
  sx,
  ...props
}) => {
  return (
    <Card
      {...props}
      sx={{
        borderRadius: 4,
        boxShadow: (theme) =>
          theme.palette.mode === 'light'
            ? '0 4px 20px rgba(0,0,0,0.08)'
            : '0 4px 20px rgba(0,0,0,0.4)',
        border: (theme) =>
          theme.palette.mode === 'light'
            ? '1px solid rgba(0,0,0,0.06)'
            : '1px solid rgba(255,255,255,0.1)',
        transition: 'all 0.3s ease',
        animation: `fadeInSlideUp 0.5s ease-out ${delay}s both`,
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: (theme) =>
            theme.palette.mode === 'light'
              ? '0 8px 30px rgba(0,0,0,0.12)'
              : '0 8px 30px rgba(0,0,0,0.6)',
        },
        '@keyframes fadeInSlideUp': {
          from: {
            opacity: 0,
            transform: 'translateY(20px)',
          },
          to: {
            opacity: 1,
            transform: 'translateY(0)',
          },
        },
        ...sx,
      }}
    >
      {children}
    </Card>
  );
};

