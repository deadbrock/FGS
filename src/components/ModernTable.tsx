import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  IconButton,
  Tooltip,
  alpha,
  Box,
  Typography,
  Chip,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useTheme } from '../hooks/useTheme';

export interface ColumnDef<T> {
  id: string;
  label: string;
  minWidth?: number;
  align?: 'left' | 'center' | 'right';
  format?: (value: any, row: T) => React.ReactNode;
}

interface ModernTableProps<T> {
  columns: ColumnDef<T>[];
  data: T[];
  onRowClick?: (row: T) => void;
  selectable?: boolean;
  selectedRows?: Set<string>;
  onSelectRow?: (id: string) => void;
  onSelectAll?: () => void;
  getRowId?: (row: T) => string;
  emptyMessage?: string;
}

export function ModernTable<T extends Record<string, any>>({
  columns,
  data,
  onRowClick,
  selectable = false,
  selectedRows = new Set(),
  onSelectRow,
  onSelectAll,
  getRowId = (row) => row.id,
  emptyMessage = 'Nenhum dado encontrado',
}: ModernTableProps<T>) {
  const { mode } = useTheme();

  const isAllSelected = data.length > 0 && data.every((row) => selectedRows.has(getRowId(row)));
  const isSomeSelected = data.some((row) => selectedRows.has(getRowId(row))) && !isAllSelected;

  return (
    <TableContainer
      component={Paper}
      elevation={0}
      sx={{
        borderRadius: 3,
        border: (theme) => `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        overflow: 'hidden',
        '&:hover': {
          boxShadow: `0 8px 32px ${alpha(mode === 'dark' ? '#000' : '#000', 0.08)}`,
        },
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      }}
    >
      <Table>
        <TableHead>
          <TableRow
            sx={{
              background: (theme) =>
                mode === 'dark'
                  ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.08) 0%, rgba(139, 92, 246, 0.08) 100%)'
                  : 'linear-gradient(135deg, rgba(99, 102, 241, 0.04) 0%, rgba(139, 92, 246, 0.04) 100%)',
              borderBottom: (theme) => `2px solid ${alpha(theme.palette.primary.main, 0.2)}`,
            }}
          >
            {selectable && (
              <TableCell padding="checkbox">
                <Checkbox
                  indeterminate={isSomeSelected}
                  checked={isAllSelected}
                  onChange={onSelectAll}
                  sx={{
                    color: 'primary.main',
                    '&.Mui-checked': {
                      color: 'primary.main',
                    },
                  }}
                />
              </TableCell>
            )}
            {columns.map((column) => (
              <TableCell
                key={column.id}
                align={column.align}
                style={{ minWidth: column.minWidth }}
                sx={{
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  fontSize: '0.75rem',
                  letterSpacing: '0.5px',
                  color: 'text.primary',
                  py: 2,
                }}
              >
                {column.label}
              </TableCell>
            ))}
            <TableCell align="right" sx={{ fontWeight: 700 }}>
              Ações
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length + (selectable ? 1 : 0) + 1} align="center">
                <Box sx={{ py: 8 }}>
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    {emptyMessage}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Não há dados para exibir no momento
                  </Typography>
                </Box>
              </TableCell>
            </TableRow>
          ) : (
            data.map((row, index) => {
              const rowId = getRowId(row);
              const isSelected = selectedRows.has(rowId);
              const isEven = index % 2 === 0;

              return (
                <TableRow
                  key={rowId}
                  onClick={() => onRowClick?.(row)}
                  sx={{
                    cursor: onRowClick ? 'pointer' : 'default',
                    backgroundColor: (theme) =>
                      isEven
                        ? mode === 'dark'
                          ? alpha(theme.palette.background.paper, 0.02)
                          : alpha(theme.palette.grey[50], 0.5)
                        : 'transparent',
                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                      backgroundColor: (theme) =>
                        mode === 'dark'
                          ? alpha(theme.palette.primary.main, 0.08)
                          : alpha(theme.palette.primary.main, 0.04),
                      transform: 'translateX(4px)',
                      boxShadow: (theme) =>
                        `inset 4px 0 0 ${theme.palette.primary.main}`,
                    },
                    ...(isSelected && {
                      backgroundColor: (theme) =>
                        alpha(theme.palette.primary.main, 0.12),
                      '&:hover': {
                        backgroundColor: (theme) =>
                          alpha(theme.palette.primary.main, 0.16),
                      },
                    }),
                  }}
                >
                  {selectable && (
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={isSelected}
                        onChange={() => onSelectRow?.(rowId)}
                        onClick={(e) => e.stopPropagation()}
                        sx={{
                          color: 'primary.main',
                          '&.Mui-checked': {
                            color: 'primary.main',
                          },
                        }}
                      />
                    </TableCell>
                  )}
                  {columns.map((column) => (
                    <TableCell
                      key={column.id}
                      align={column.align}
                      sx={{
                        py: 2,
                        fontSize: '0.9rem',
                      }}
                    >
                      {column.format ? column.format(row[column.id], row) : row[column.id]}
                    </TableCell>
                  ))}
                  <TableCell align="right">
                    <Tooltip title="Mais opções" arrow>
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                        sx={{
                          transition: 'all 0.2s',
                          '&:hover': {
                            background: (theme) => alpha(theme.palette.primary.main, 0.1),
                            transform: 'scale(1.1)',
                          },
                        }}
                      >
                        <MoreVertIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

// Componentes auxiliares para formatar células
export const TableCellStatus: React.FC<{
  status: 'ativo' | 'inativo' | 'pendente' | string;
}> = ({ status }) => {
  const getColor = () => {
    switch (status.toLowerCase()) {
      case 'ativo':
        return 'success';
      case 'inativo':
        return 'error';
      case 'pendente':
        return 'warning';
      default:
        return 'default';
    }
  };

  return (
    <Chip
      label={status}
      color={getColor() as any}
      size="small"
      sx={{
        fontWeight: 600,
        fontSize: '0.75rem',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
      }}
    />
  );
};

export const TableCellAvatar: React.FC<{
  name: string;
  subtitle?: string;
  avatarUrl?: string;
}> = ({ name, subtitle, avatarUrl }) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
      <Box
        sx={{
          width: 40,
          height: 40,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 700,
          color: 'white',
          fontSize: '1rem',
          ...(avatarUrl && {
            backgroundImage: `url(${avatarUrl})`,
            backgroundSize: 'cover',
          }),
        }}
      >
        {!avatarUrl && name.charAt(0).toUpperCase()}
      </Box>
      <Box>
        <Typography variant="body2" fontWeight={600}>
          {name}
        </Typography>
        {subtitle && (
          <Typography variant="caption" color="text.secondary">
            {subtitle}
          </Typography>
        )}
      </Box>
    </Box>
  );
};

