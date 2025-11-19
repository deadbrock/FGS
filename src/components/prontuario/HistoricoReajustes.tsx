import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  Alert,
  MenuItem,
  Tooltip,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';
import { HistoricoReajuste, CreateReajusteDTO } from '../../types/reajustes';
import reajustesService from '../../services/reajustesService';
import { formatarMoeda } from '../../utils/formatUtils';

interface HistoricoReajustesProps {
  colaboradorId: string;
  salarioAtual?: number;
}

export const HistoricoReajustes: React.FC<HistoricoReajustesProps> = ({
  colaboradorId,
  salarioAtual,
}) => {
  const [reajustes, setReajustes] = useState<HistoricoReajuste[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingReajuste, setEditingReajuste] = useState<HistoricoReajuste | null>(null);
  const [formData, setFormData] = useState<CreateReajusteDTO>({
    salario_anterior: salarioAtual || 0,
    salario_novo: 0,
    data_reajuste: new Date().toISOString().split('T')[0],
    data_efetivacao: new Date().toISOString().split('T')[0],
    motivo: '',
    observacoes: '',
  });

  useEffect(() => {
    carregarHistorico();
  }, [colaboradorId]);

  const carregarHistorico = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await reajustesService.getHistorico(colaboradorId);
      setReajustes(response.data);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar histórico de reajustes');
      console.error('Erro ao carregar histórico:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (reajuste?: HistoricoReajuste) => {
    if (reajuste) {
      setEditingReajuste(reajuste);
      setFormData({
        salario_anterior: reajuste.salario_anterior,
        salario_novo: reajuste.salario_novo,
        data_reajuste: reajuste.data_reajuste.split('T')[0],
        data_efetivacao: reajuste.data_efetivacao.split('T')[0],
        motivo: reajuste.motivo || '',
        observacoes: reajuste.observacoes || '',
      });
    } else {
      setEditingReajuste(null);
      setFormData({
        salario_anterior: salarioAtual || 0,
        salario_novo: 0,
        data_reajuste: new Date().toISOString().split('T')[0],
        data_efetivacao: new Date().toISOString().split('T')[0],
        motivo: '',
        observacoes: '',
      });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingReajuste(null);
    setError('');
  };

  const handleSave = async () => {
    try {
      setError('');

      // Validações
      if (!formData.salario_anterior || !formData.salario_novo) {
        setError('Salário anterior e novo são obrigatórios');
        return;
      }

      if (formData.salario_novo <= formData.salario_anterior) {
        setError('Salário novo deve ser maior que o anterior');
        return;
      }

      if (!formData.data_reajuste || !formData.data_efetivacao) {
        setError('Datas são obrigatórias');
        return;
      }

      if (editingReajuste) {
        await reajustesService.update(colaboradorId, editingReajuste.id, formData);
      } else {
        await reajustesService.create(colaboradorId, formData);
      }

      handleCloseDialog();
      await carregarHistorico();
    } catch (err: any) {
      setError(err.message || 'Erro ao salvar reajuste');
      console.error('Erro ao salvar reajuste:', err);
    }
  };

  const handleDelete = async (reajusteId: string) => {
    if (!confirm('Tem certeza que deseja excluir este reajuste?')) {
      return;
    }

    try {
      await reajustesService.delete(colaboradorId, reajusteId);
      await carregarHistorico();
    } catch (err: any) {
      setError(err.message || 'Erro ao excluir reajuste');
      console.error('Erro ao excluir reajuste:', err);
    }
  };

  const formatarData = (data: string) => {
    return new Date(data).toLocaleDateString('pt-BR');
  };

  const formatarPercentual = (percentual: number) => {
    return `${percentual >= 0 ? '+' : ''}${percentual.toFixed(2)}%`;
  };

  if (loading) {
    return (
      <Card>
        <CardContent>
          <Typography>Carregando histórico de reajustes...</Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h6" fontWeight={600}>
          Histórico de Reajustes de Salário
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
          sx={{
            background: 'linear-gradient(135deg, #a2122a 0%, #354a80 100%)',
          }}
        >
          Novo Reajuste
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {reajustes.length === 0 ? (
        <Card>
          <CardContent>
            <Box textAlign="center" py={4}>
              <TrendingUpIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
              <Typography variant="body1" color="text.secondary">
                Nenhum reajuste registrado ainda
              </Typography>
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={() => handleOpenDialog()}
                sx={{ mt: 2 }}
              >
                Registrar Primeiro Reajuste
              </Button>
            </Box>
          </CardContent>
        </Card>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Data Reajuste</TableCell>
                <TableCell>Data Efetivação</TableCell>
                <TableCell align="right">Salário Anterior</TableCell>
                <TableCell align="right">Salário Novo</TableCell>
                <TableCell align="right">Reajuste</TableCell>
                <TableCell>Motivo</TableCell>
                <TableCell>Aprovado Por</TableCell>
                <TableCell align="center">Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {reajustes.map((reajuste) => (
                <TableRow key={reajuste.id} hover>
                  <TableCell>{formatarData(reajuste.data_reajuste)}</TableCell>
                  <TableCell>{formatarData(reajuste.data_efetivacao)}</TableCell>
                  <TableCell align="right">{formatarMoeda(reajuste.salario_anterior)}</TableCell>
                  <TableCell align="right">
                    <strong>{formatarMoeda(reajuste.salario_novo)}</strong>
                  </TableCell>
                  <TableCell align="right">
                    <Chip
                      label={formatarPercentual(reajuste.percentual_reajuste)}
                      color="success"
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{reajuste.motivo || '-'}</TableCell>
                  <TableCell>{reajuste.aprovado_por_nome || '-'}</TableCell>
                  <TableCell align="center">
                    <Tooltip title="Editar">
                      <IconButton
                        size="small"
                        onClick={() => handleOpenDialog(reajuste)}
                        color="primary"
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Excluir">
                      <IconButton
                        size="small"
                        onClick={() => handleDelete(reajuste.id)}
                        color="error"
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Dialog de Criar/Editar Reajuste */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingReajuste ? 'Editar Reajuste' : 'Novo Reajuste de Salário'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Salário Anterior"
                type="number"
                value={formData.salario_anterior}
                onChange={(e) =>
                  setFormData({ ...formData, salario_anterior: parseFloat(e.target.value) || 0 })
                }
                InputProps={{
                  startAdornment: <Typography sx={{ mr: 1 }}>R$</Typography>,
                }}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Salário Novo"
                type="number"
                value={formData.salario_novo}
                onChange={(e) =>
                  setFormData({ ...formData, salario_novo: parseFloat(e.target.value) || 0 })
                }
                InputProps={{
                  startAdornment: <Typography sx={{ mr: 1 }}>R$</Typography>,
                }}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="date"
                label="Data do Reajuste"
                value={formData.data_reajuste}
                onChange={(e) => setFormData({ ...formData, data_reajuste: e.target.value })}
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="date"
                label="Data de Efetivação"
                value={formData.data_efetivacao}
                onChange={(e) => setFormData({ ...formData, data_efetivacao: e.target.value })}
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                select
                label="Motivo do Reajuste"
                value={formData.motivo || ''}
                onChange={(e) => setFormData({ ...formData, motivo: e.target.value })}
              >
                <MenuItem value="">Selecione...</MenuItem>
                <MenuItem value="Reajuste Anual">Reajuste Anual</MenuItem>
                <MenuItem value="Promoção">Promoção</MenuItem>
                <MenuItem value="Ajuste de Mercado">Ajuste de Mercado</MenuItem>
                <MenuItem value="Aumento por Mérito">Aumento por Mérito</MenuItem>
                <MenuItem value="Reajuste por Inflação">Reajuste por Inflação</MenuItem>
                <MenuItem value="Outro">Outro</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Observações"
                value={formData.observacoes || ''}
                onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
              />
            </Grid>
            {formData.salario_anterior > 0 && formData.salario_novo > formData.salario_anterior && (
              <Grid item xs={12}>
                <Alert severity="info">
                  Percentual de reajuste:{' '}
                  <strong>
                    {formatarPercentual(
                      ((formData.salario_novo - formData.salario_anterior) /
                        formData.salario_anterior) *
                        100
                    )}
                  </strong>
                </Alert>
              </Grid>
            )}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button
            onClick={handleSave}
            variant="contained"
            sx={{
              background: 'linear-gradient(135deg, #a2122a 0%, #354a80 100%)',
            }}
          >
            Salvar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

