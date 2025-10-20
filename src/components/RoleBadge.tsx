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

