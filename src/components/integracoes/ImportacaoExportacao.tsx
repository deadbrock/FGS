import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Grid,
  Button,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Tooltip,
} from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import DownloadIcon from '@mui/icons-material/Download';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { HistoricoImportacao, FormatoArquivo } from '../../types/integracoes';
import { formatarData } from '../../utils/statusUtils';

// Mock data
const historicoMock: HistoricoImportacao[] = [
  {
    id: '1',
    dataHora: '2024-10-19T14:30:00',
    usuario: 'Admin Sistema',
    modulo: 'Colaboradores',
    arquivo: 'colaboradores_outubro.xlsx',
    formato: FormatoArquivo.XLSX,
    totalLinhas: 150,
    linhasImportadas: 148,
    linhasErro: 2,
    status: 'PARCIAL',
    tempoProcessamento: 12.5,
  },
  {
    id: '2',
    dataHora: '2024-10-18T10:15:00',
    usuario: 'João Silva',
    modulo: 'Treinamentos',
    arquivo: 'treinamentos_q3.csv',
    formato: FormatoArquivo.CSV,
    totalLinhas: 85,
    linhasImportadas: 85,
    linhasErro: 0,
    status: 'SUCESSO',
    tempoProcessamento: 5.2,
  },
];

export const ImportacaoExportacao: React.FC = () => {
  const [historico] = useState<HistoricoImportacao[]>(historicoMock);

  const handleImportar = () => {
    alert('Funcionalidade de importação em desenvolvimento');
  };

  const handleExportar = () => {
    alert('Funcionalidade de exportação em desenvolvimento');
  };

  const getStatusColor = (status: string) => {
    const cores: Record<string, 'success' | 'warning' | 'error'> = {
      SUCESSO: 'success',
      PARCIAL: 'warning',
      FALHA: 'error',
    };
    return cores[status] || 'default';
  };

  return (
    <Box>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Importar Dados
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Importe dados de colaboradores, treinamentos, benefícios e mais através de
                arquivos CSV ou Excel.
              </Typography>
              <Button
                variant="contained"
                startIcon={<UploadFileIcon />}
                onClick={handleImportar}
                fullWidth
              >
                Importar Arquivo
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Exportar Dados
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Exporte dados do sistema para CSV, Excel ou JSON para análise externa ou backup.
              </Typography>
              <Button
                variant="contained"
                color="secondary"
                startIcon={<DownloadIcon />}
                onClick={handleExportar}
                fullWidth
              >
                Exportar Dados
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Histórico de Importações
              </Typography>

              <TableContainer component={Paper} variant="outlined" sx={{ mt: 2 }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Data/Hora</TableCell>
                      <TableCell>Usuário</TableCell>
                      <TableCell>Módulo</TableCell>
                      <TableCell>Arquivo</TableCell>
                      <TableCell align="center">Formato</TableCell>
                      <TableCell align="center">Linhas</TableCell>
                      <TableCell align="center">Status</TableCell>
                      <TableCell align="center">Ações</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {historico.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{formatarData(item.dataHora)}</TableCell>
                        <TableCell>{item.usuario}</TableCell>
                        <TableCell>{item.modulo}</TableCell>
                        <TableCell>{item.arquivo}</TableCell>
                        <TableCell align="center">
                          <Chip label={item.formato} size="small" />
                        </TableCell>
                        <TableCell align="center">
                          <Box>
                            <Typography variant="body2">
                              {item.linhasImportadas}/{item.totalLinhas}
                            </Typography>
                            {item.linhasErro > 0 && (
                              <Typography variant="caption" color="error">
                                {item.linhasErro} erros
                              </Typography>
                            )}
                          </Box>
                        </TableCell>
                        <TableCell align="center">
                          <Chip
                            label={item.status}
                            size="small"
                            color={getStatusColor(item.status)}
                          />
                        </TableCell>
                        <TableCell align="center">
                          <Tooltip title="Visualizar Detalhes">
                            <IconButton size="small">
                              <VisibilityIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Baixar Relatório">
                            <IconButton size="small">
                              <DownloadIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="subtitle1" gutterBottom>
                Formatos Suportados
              </Typography>
              <Box display="flex" gap={1} flexWrap="wrap">
                <Chip label="CSV" color="primary" size="small" />
                <Chip label="XLSX (Excel)" color="primary" size="small" />
                <Chip label="XLS (Excel Legacy)" color="primary" size="small" />
                <Chip label="JSON" color="primary" size="small" />
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                Tamanho máximo: 50MB | Máximo de linhas: 10.000
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

