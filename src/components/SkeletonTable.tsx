import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Skeleton,
  Box,
} from '@mui/material';

interface SkeletonTableProps {
  rows?: number;
  columns?: number;
}

export const SkeletonTable: React.FC<SkeletonTableProps> = ({
  rows = 5,
  columns = 4,
}) => {
  return (
    <TableContainer component={Paper} variant="outlined">
      <Table>
        <TableHead>
          <TableRow>
            {Array.from({ length: columns }).map((_, index) => (
              <TableCell key={index}>
                <Skeleton variant="text" width="80%" height={24} />
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <TableRow key={rowIndex}>
              {Array.from({ length: columns }).map((_, colIndex) => (
                <TableCell key={colIndex}>
                  <Skeleton
                    variant="text"
                    width={colIndex === 0 ? '60%' : '80%'}
                    height={20}
                  />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export const SkeletonCard: React.FC = () => {
  return (
    <Paper sx={{ p: 3, borderRadius: 4 }}>
      <Skeleton variant="text" width="40%" height={32} sx={{ mb: 2 }} />
      <Skeleton variant="text" width="60%" height={20} sx={{ mb: 3 }} />
      <Box display="flex" gap={2} mb={2}>
        <Skeleton variant="rectangular" width={120} height={40} sx={{ borderRadius: 2 }} />
        <Skeleton variant="rectangular" width={120} height={40} sx={{ borderRadius: 2 }} />
      </Box>
      <Skeleton variant="rectangular" width="100%" height={200} sx={{ borderRadius: 2 }} />
    </Paper>
  );
};

export const SkeletonStats: React.FC = () => {
  return (
    <Paper sx={{ p: 3, borderRadius: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Skeleton variant="text" width="40%" height={24} />
        <Skeleton variant="circular" width={48} height={48} />
      </Box>
      <Skeleton variant="text" width="30%" height={40} />
      <Skeleton variant="text" width="50%" height={16} sx={{ mt: 1 }} />
    </Paper>
  );
};

