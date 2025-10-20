import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  TableSortLabel,
  Box,
} from '@mui/material';

export interface Coluna<T> {
  id: keyof T | string;
  label: string;
  minWidth?: number;
  align?: 'left' | 'right' | 'center';
  format?: (value: any, row: T) => React.ReactNode;
  sortable?: boolean;
}

interface TabelaPaginadaProps<T> {
  colunas: Coluna<T>[];
  dados: T[];
  total: number;
  pagina: number;
  itensPorPagina: number;
  onMudarPagina: (novaPagina: number) => void;
  onMudarItensPorPagina: (novosItens: number) => void;
  onOrdenar?: (campo: string, ordem: 'asc' | 'desc') => void;
  ordenarPor?: string;
  ordem?: 'asc' | 'desc';
}

// Componente de tabela com paginação e ordenação
export function TabelaPaginada<T extends { id: string }>({
  colunas,
  dados,
  total,
  pagina,
  itensPorPagina,
  onMudarPagina,
  onMudarItensPorPagina,
  onOrdenar,
  ordenarPor,
  ordem,
}: TabelaPaginadaProps<T>) {
  const handleChangePage = (event: unknown, newPage: number) => {
    onMudarPagina(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    onMudarItensPorPagina(parseInt(event.target.value, 10));
    onMudarPagina(0);
  };

  const handleSort = (campo: string) => {
    if (onOrdenar) {
      const novaOrdem = ordenarPor === campo && ordem === 'asc' ? 'desc' : 'asc';
      onOrdenar(campo, novaOrdem);
    }
  };

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {colunas.map((coluna) => (
                <TableCell
                  key={String(coluna.id)}
                  align={coluna.align}
                  style={{ minWidth: coluna.minWidth }}
                >
                  {coluna.sortable && onOrdenar ? (
                    <TableSortLabel
                      active={ordenarPor === coluna.id}
                      direction={ordenarPor === coluna.id ? ordem : 'asc'}
                      onClick={() => handleSort(String(coluna.id))}
                    >
                      {coluna.label}
                    </TableSortLabel>
                  ) : (
                    coluna.label
                  )}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {dados.map((row) => (
              <TableRow hover key={row.id}>
                {colunas.map((coluna) => {
                  const valor = coluna.id === 'actions' ? row : (row as any)[coluna.id];
                  return (
                    <TableCell key={String(coluna.id)} align={coluna.align}>
                      {coluna.format ? coluna.format(valor, row) : valor}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25, 50]}
        component="div"
        count={total}
        rowsPerPage={itensPorPagina}
        page={pagina}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage="Itens por página:"
        labelDisplayedRows={({ from, to, count }) =>
          `${from}-${to} de ${count !== -1 ? count : `mais de ${to}`}`
        }
      />
    </Paper>
  );
}

