import React, { useState, useEffect, useRef } from 'react';
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  CircularProgress,
  Alert,
  LinearProgress,
} from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import DownloadIcon from '@mui/icons-material/Download';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { HistoricoImportacao, FormatoArquivo } from '../../types/integracoes';
import { formatarData } from '../../utils/statusUtils';
import integracoesService from '../../services/integracoesService';

export const ImportacaoExportacao: React.FC = () => {
  const [historico, setHistorico] = useState<HistoricoImportacao[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dialogImportar, setDialogImportar] = useState(false);
  const [dialogExportar, setDialogExportar] = useState(false);
  const [dialogDetalhes, setDialogDetalhes] = useState(false);
  const [detalhesImportacao, setDetalhesImportacao] = useState<any>(null);
  const [moduloImportar, setModuloImportar] = useState('colaboradores');
  const [moduloExportar, setModuloExportar] = useState('colaboradores');
  const [formatoExportar, setFormatoExportar] = useState<FormatoArquivo>(FormatoArquivo.XLSX);
  const [arquivoSelecionado, setArquivoSelecionado] = useState<File | null>(null);
  const [processando, setProcessando] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    carregarHistorico();
  }, []);

  const carregarHistorico = async () => {
    try {
      setLoading(true);
      setError(null);
      const dados = await integracoesService.getHistoricoImportacoes();
      setHistorico(dados);
    } catch (err: any) {
      console.error('Erro ao carregar histórico:', err);
      setError(err.message || 'Erro ao carregar histórico');
    } finally {
      setLoading(false);
    }
  };

  const handleImportar = () => {
    setDialogImportar(true);
  };

  const handleSelecionarArquivo = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validar tamanho (50MB)
      if (file.size > 50 * 1024 * 1024) {
        alert('Arquivo muito grande. Tamanho máximo: 50MB');
        return;
      }
      setArquivoSelecionado(file);
    }
  };

  const handleConfirmarImportacao = async () => {
    if (!arquivoSelecionado) {
      alert('Selecione um arquivo para importar');
      return;
    }

    try {
      setProcessando(true);
      const resultado = await integracoesService.importarArquivo(arquivoSelecionado, moduloImportar);
      
      alert(
        `Importação concluída!\n` +
        `Linhas importadas: ${resultado.linhasImportadas}/${resultado.totalLinhas}\n` +
        `Erros: ${resultado.linhasErro}`
      );

      setDialogImportar(false);
      setArquivoSelecionado(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      carregarHistorico();
    } catch (err: any) {
      alert(`Erro ao importar: ${err.message}`);
    } finally {
      setProcessando(false);
    }
  };

  const handleExportar = () => {
    setDialogExportar(true);
  };

  const handleConfirmarExportacao = async () => {
    try {
      setProcessando(true);
      const blob = await integracoesService.exportarDados(moduloExportar, formatoExportar);
      
      // Criar link para download
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${moduloExportar}_${Date.now()}.${formatoExportar.toLowerCase()}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      setDialogExportar(false);
      alert('Exportação concluída!');
    } catch (err: any) {
      alert(`Erro ao exportar: ${err.message}`);
    } finally {
      setProcessando(false);
    }
  };

  const handleVisualizarDetalhes = async (id: string) => {
    try {
      const detalhes = await integracoesService.getDetalhesImportacao(id);
      setDetalhesImportacao(detalhes);
      setDialogDetalhes(true);
    } catch (err: any) {
      alert(`Erro ao carregar detalhes: ${err.message}`);
    }
  };

  const handleDownloadRelatorio = async (id: string) => {
    try {
      const blob = await integracoesService.downloadRelatorioImportacao(id);
      
      // Criar link para download
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `relatorio_erros_${id}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      alert(`Erro ao baixar relatório: ${err.message}`);
    }
  };

  const getStatusColor = (status: string) => {
    const cores: Record<string, 'success' | 'warning' | 'error'> = {
      SUCESSO: 'success',
      PARCIAL: 'warning',
      FALHA: 'error',
    };
    return cores[status] || 'default';
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

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
                disabled={processando}
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
                disabled={processando}
              >
                Exportar Dados
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6">Histórico de Importações</Typography>
                <Button size="small" onClick={carregarHistorico}>
                  Atualizar
                </Button>
              </Box>

              {historico.length === 0 ? (
                <Typography variant="body2" color="text.secondary" align="center" py={4}>
                  Nenhuma importação realizada ainda
                </Typography>
              ) : (
                <TableContainer component={Paper} variant="outlined">
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
                              <IconButton
                                size="small"
                                onClick={() => handleVisualizarDetalhes(item.id)}
                              >
                                <VisibilityIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            {item.linhasErro > 0 && (
                              <Tooltip title="Baixar Relatório de Erros">
                                <IconButton
                                  size="small"
                                  onClick={() => handleDownloadRelatorio(item.id)}
                                >
                                  <DownloadIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
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

      {/* Dialog Importar */}
      <Dialog open={dialogImportar} onClose={() => !processando && setDialogImportar(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Importar Arquivo</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Módulo</InputLabel>
              <Select
                value={moduloImportar}
                onChange={(e) => setModuloImportar(e.target.value)}
                label="Módulo"
              >
                <MenuItem value="colaboradores">Colaboradores</MenuItem>
                <MenuItem value="treinamentos">Treinamentos</MenuItem>
                <MenuItem value="beneficios">Benefícios</MenuItem>
              </Select>
            </FormControl>

            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,.xlsx,.xls,.json"
              onChange={handleSelecionarArquivo}
              style={{ display: 'none' }}
            />

            <Button
              variant="outlined"
              component="label"
              fullWidth
              startIcon={<UploadFileIcon />}
              sx={{ mb: 2 }}
            >
              {arquivoSelecionado ? arquivoSelecionado.name : 'Selecionar Arquivo'}
              <input
                type="file"
                accept=".csv,.xlsx,.xls,.json"
                onChange={handleSelecionarArquivo}
                hidden
              />
            </Button>

            {processando && (
              <Box sx={{ mt: 2 }}>
                <LinearProgress />
                <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 1 }}>
                  Processando arquivo...
                </Typography>
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogImportar(false)} disabled={processando}>
            Cancelar
          </Button>
          <Button
            onClick={handleConfirmarImportacao}
            variant="contained"
            disabled={!arquivoSelecionado || processando}
          >
            Importar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog Exportar */}
      <Dialog open={dialogExportar} onClose={() => !processando && setDialogExportar(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Exportar Dados</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Módulo</InputLabel>
              <Select
                value={moduloExportar}
                onChange={(e) => setModuloExportar(e.target.value)}
                label="Módulo"
              >
                <MenuItem value="colaboradores">Colaboradores</MenuItem>
                <MenuItem value="treinamentos">Treinamentos</MenuItem>
                <MenuItem value="beneficios">Benefícios</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Formato</InputLabel>
              <Select
                value={formatoExportar}
                onChange={(e) => setFormatoExportar(e.target.value as FormatoArquivo)}
                label="Formato"
              >
                <MenuItem value={FormatoArquivo.CSV}>CSV</MenuItem>
                <MenuItem value={FormatoArquivo.XLSX}>XLSX (Excel)</MenuItem>
                <MenuItem value={FormatoArquivo.JSON}>JSON</MenuItem>
              </Select>
            </FormControl>

            {processando && (
              <Box sx={{ mt: 2 }}>
                <LinearProgress />
                <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 1 }}>
                  Gerando arquivo...
                </Typography>
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogExportar(false)} disabled={processando}>
            Cancelar
          </Button>
          <Button onClick={handleConfirmarExportacao} variant="contained" disabled={processando}>
            Exportar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog Detalhes */}
      <Dialog
        open={dialogDetalhes}
        onClose={() => setDialogDetalhes(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Detalhes da Importação</DialogTitle>
        <DialogContent>
          {detalhesImportacao && (
            <Box sx={{ pt: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">
                    Data/Hora
                  </Typography>
                  <Typography variant="body1">{formatarData(detalhesImportacao.dataHora)}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">
                    Usuário
                  </Typography>
                  <Typography variant="body1">{detalhesImportacao.usuario}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">
                    Módulo
                  </Typography>
                  <Typography variant="body1">{detalhesImportacao.modulo}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">
                    Arquivo
                  </Typography>
                  <Typography variant="body1">{detalhesImportacao.arquivo}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">
                    Status
                  </Typography>
                  <Chip
                    label={detalhesImportacao.status}
                    size="small"
                    color={getStatusColor(detalhesImportacao.status)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">
                    Tempo de Processamento
                  </Typography>
                  <Typography variant="body1">{detalhesImportacao.tempoProcessamento}s</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary">
                    Resultado
                  </Typography>
                  <Typography variant="body1">
                    {detalhesImportacao.linhasImportadas} de {detalhesImportacao.totalLinhas} linhas
                    importadas
                  </Typography>
                  {detalhesImportacao.linhasErro > 0 && (
                    <Typography variant="body2" color="error" sx={{ mt: 1 }}>
                      {detalhesImportacao.linhasErro} erros encontrados
                    </Typography>
                  )}
                </Grid>
                {detalhesImportacao.mensagemErro && (
                  <Grid item xs={12}>
                    <Alert severity="error">{detalhesImportacao.mensagemErro}</Alert>
                  </Grid>
                )}
                {detalhesImportacao.erros && detalhesImportacao.erros.length > 0 && (
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" gutterBottom>
                      Erros Detalhados
                    </Typography>
                    <TableContainer component={Paper} variant="outlined">
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>Linha</TableCell>
                            <TableCell>Erro</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {detalhesImportacao.erros.slice(0, 10).map((erro: any, index: number) => (
                            <TableRow key={index}>
                              <TableCell>{erro.linha}</TableCell>
                              <TableCell>{erro.erro}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                      {detalhesImportacao.erros.length > 10 && (
                        <Box p={2}>
                          <Typography variant="body2" color="text.secondary">
                            ... e mais {detalhesImportacao.erros.length - 10} erros
                          </Typography>
                        </Box>
                      )}
                    </TableContainer>
                  </Grid>
                )}
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          {detalhesImportacao?.linhasErro > 0 && (
            <Button
              startIcon={<DownloadIcon />}
              onClick={() => {
                if (detalhesImportacao?.id) {
                  handleDownloadRelatorio(detalhesImportacao.id);
                }
              }}
            >
              Baixar Relatório Completo
            </Button>
          )}
          <Button onClick={() => setDialogDetalhes(false)}>Fechar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
