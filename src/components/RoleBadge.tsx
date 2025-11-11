import React from 'react';
import { Chip } from '@mui/material';
import { UserRole } from '../types';
import { getRoleName, getRoleColor } from '../utils/permissions';

interface RoleBadgeProps {
  role: UserRole;
  size?: 'small' | 'medium';
}

// Componente para exibir badge de perfil
export const RoleBadge: React.FC<RoleBadgeProps> = ({ role, size = 'small' }) => {
  // Validação para evitar erro quando role é undefined
  if (!role) {
    return (
      <Chip
        label="N/A"
        size={size}
        sx={{
          backgroundColor: '#9e9e9e',
          color: 'white',
          fontWeight: 500,
        }}
      />
    );
  }

  return (
    <Chip
      label={getRoleName(role)}
      size={size}
      sx={{
        backgroundColor: getRoleColor(role),
        color: 'white',
        fontWeight: 500,
      }}
    />
  );
};

