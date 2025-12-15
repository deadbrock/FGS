import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
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
  Grid,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Inventory as InventoryIcon,
} from '@mui/icons-material';
import { GradientButton, AnimatedCard } from '../../components';
import epiService from '../../services/epiService';
import { EPI, CreateEPIDTO } from '../../types/epi';
import { formatarData } from '../../utils/statusUtils';

export const CadastroEPIs: React.FC = () => {
  const [epis, setEpis] = useState<EPI[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dialogAberto, setDialogAberto] = useState(false);
  const [epiEditando, setEpiEditando] = useState<EPI | null>(null);

  const [formData, setFormData] = useState<CreateEPIDTO>({
    codigo: '',
    nome: '',
    descricao: '',
    categoria: '',
    ca: '',
    fabricante: '',
    validade_ca: '',
    durabilidade_meses: 12,
    quantidade_estoque: 0,
    estoque_minimo: 10,
    preco_unitario: 0,
    fornecedor: '',
    observacoes: '',
  });

  useEffect(() => {
    carregarEPIs();
  }, []);

  const carregarEPIs = async () => {
    try {
      setLoading(true);
      const { data } = await epiService.getEPIs();
      setEpis(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAbrirDialog = (epi?: EPI) => {
    if (epi) {
      setEpiEditando(epi);
      setFormData({
        codigo: epi.codigo,
        nome: epi.nome,
        descricao: epi.descricao || '',
        categoria: epi.categoria,
        ca: epi.ca,
        fabricante: epi.fabricante,
        validade_ca: epi.validade_ca,
        durabilidade_meses: epi.durabilidade_meses,
        quantidade_estoque: epi.quantidade_estoque,
        estoque_minimo: epi.estoque_minimo,
        preco_unitario: epi.preco_unitario,
        fornecedor: epi.fornecedor,
        observacoes: epi.observacoes,
      });
    } else {
      setEpiEditando(null);
      setFormData({
        codigo: '',
        nome: '',
        descricao: '',
        categoria: '',
        ca: '',
        fabricante: '',
        validade_ca: '',
        durabilidade_meses: 12,
        quantidade_estoque: 0,
        estoque_minimo: 10,
        preco_unitario: 0,
        fornecedor: '',
        observacoes: '',
      });
    }
    setDialogAberto(true);
  };

  const handleSalvar = async () => {
    try {
      setLoading(true);
      if (epiEditando) {
        await epiService.updateEPI(epiEditando.id, formData);
      } else {
        await epiService.createEPI(formData);
      }
      setDialogAberto(false);
      carregarEPIs();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleExcluir = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja excluir este EPI?')) return;
    try {
      setLoading(true);
      await epiService.deleteEPI(id);
      carregarEPIs();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusEstoque = (epi: EPI) => {
    if (epi.quantidade_estoque === 0) return { label: 'SEM ESTOQUE', color: 'error' as const };
    if (epi.quantidade_estoque <= epi.estoque_minimo) return { label: 'ESTOQUE BAIXO', color: 'warning' as const };
    return { label: 'DISPONÍVEL', color: 'success' as const };
  };

  return (
    <Box>
      {error && <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>{error}</Alert>}

      <Box display="flex" justifyContent="space-between" mb={3}>
        <GradientButton startIcon={<AddIcon />} onClick={() => handleAbrirDialog()}>
          Novo EPI
        </GradientButton>
      </Box>

      <AnimatedCard>
        {loading ? (
          <Box display="flex" justifyContent="center" py={4}><CircularProgress /></Box>
        ) : (
          <TableContainer component={Paper} elevation={0}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Código</TableCell>
                  <TableCell>Nome</TableCell>
                  <TableCell>CA</TableCell>
                  <TableCell>Categoria</TableCell>
                  <TableCell>Estoque</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {epis.map((epi) => {
                  const status = getStatusEstoque(epi);
                  return (
                    <TableRow key={epi.id} hover>
                      <TableCell>{epi.codigo}</TableCell>
                      <TableCell>{epi.nome}</TableCell>
                      <TableCell>{epi.ca}</TableCell>
                      <TableCell>{epi.categoria}</TableCell>
                      <TableCell>{epi.quantidade_estoque} / {epi.estoque_minimo}</TableCell>
                      <TableCell><Chip label={status.label} size="small" color={status.color} /></TableCell>
                      <TableCell align="right">
                        <Tooltip title="Editar">
                          <IconButton size="small" onClick={() => handleAbrirDialog(epi)}><EditIcon fontSize="small" /></IconButton>
                        </Tooltip>
                        <Tooltip title="Excluir">
                          <IconButton size="small" color="error" onClick={() => handleExcluir(epi.id)}><DeleteIcon fontSize="small" /></IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </AnimatedCard>

      <Dialog open={dialogAberto} onClose={() => setDialogAberto(false)} maxWidth="md" fullWidth>
        <DialogTitle>{epiEditando ? 'Editar EPI' : 'Novo EPI'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Código *" value={formData.codigo} onChange={(e) => setFormData({ ...formData, codigo: e.target.value })} />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Nome *" value={formData.nome} onChange={(e) => setFormData({ ...formData, nome: e.target.value })} />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="Descrição" multiline rows={2} value={formData.descricao} onChange={(e) => setFormData({ ...formData, descricao: e.target.value })} />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Categoria *" value={formData.categoria} onChange={(e) => setFormData({ ...formData, categoria: e.target.value })} />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="CA (Certificado de Aprovação) *" value={formData.ca} onChange={(e) => setFormData({ ...formData, ca: e.target.value })} />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Fabricante *" value={formData.fabricante} onChange={(e) => setFormData({ ...formData, fabricante: e.target.value })} />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth type="date" label="Validade do CA *" value={formData.validade_ca} onChange={(e) => setFormData({ ...formData, validade_ca: e.target.value })} InputLabelProps={{ shrink: true }} />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField fullWidth type="number" label="Durabilidade (meses) *" value={formData.durabilidade_meses} onChange={(e) => setFormData({ ...formData, durabilidade_meses: parseInt(e.target.value) })} />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField fullWidth type="number" label="Quantidade em Estoque *" value={formData.quantidade_estoque} onChange={(e) => setFormData({ ...formData, quantidade_estoque: parseInt(e.target.value) })} />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField fullWidth type="number" label="Estoque Mínimo *" value={formData.estoque_minimo} onChange={(e) => setFormData({ ...formData, estoque_minimo: parseInt(e.target.value) })} />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth type="number" label="Preço Unitário" value={formData.preco_unitario} onChange={(e) => setFormData({ ...formData, preco_unitario: parseFloat(e.target.value) })} />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Fornecedor" value={formData.fornecedor} onChange={(e) => setFormData({ ...formData, fornecedor: e.target.value })} />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="Observações" multiline rows={2} value={formData.observacoes} onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })} />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogAberto(false)}>Cancelar</Button>
          <GradientButton onClick={handleSalvar} disabled={loading}>
            {loading ? <CircularProgress size={20} /> : 'Salvar'}
          </GradientButton>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

