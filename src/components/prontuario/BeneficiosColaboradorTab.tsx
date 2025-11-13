import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  MenuItem,
  Grid,
  Chip,
  Alert,
  InputAdornment,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { GradientButton, ActionButton } from '../';
import { BeneficioColaborador, Beneficio } from '../../types/beneficios';
import beneficiosService from '../../services/beneficiosService';
import { formatarData } from '../../utils/statusUtils';
import { formatarMoeda, getTipoNome, getStatusNome } from '../../utils/beneficiosUtils';

interface BeneficiosColaboradorTabProps {
  colaboradorId: string;
}

export const BeneficiosColaboradorTab: React.FC<BeneficiosColaboradorTabProps> = ({
  colaboradorId,
}) => {
  const [beneficiosColaborador, setBeneficiosColaborador] = useState<BeneficioColaborador[]>([]);
  const [beneficiosDisponiveis, setBeneficiosDisponiveis] = useState<Beneficio[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Formulário
  const [beneficioSelecionado, setBeneficioSelecionado] = useState('');
  const [valorConcedido, setValorConcedido] = useState('');
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  const [observacoes, setObservacoes] = useState('');

  useEffect(() => {
    carregarBeneficiosColaborador();
    carregarBeneficiosDisponiveis();
  }, [colaboradorId]);

  const carregarBeneficiosColaborador = async () => {
    try {
      setLoading(true);
      const dados = await beneficiosService.listarBeneficiosColaborador(colaboradorId);
      setBeneficiosColaborador(dados);
    } catch (error) {
      console.error('Erro ao carregar benefícios do colaborador:', error);
    } finally {
      setLoading(false);
    }
  };

  const carregarBeneficiosDisponiveis = async () => {
    try {
      const dados = await beneficiosService.listarBeneficios();
      // Filtrar apenas benefícios ativos
      setBeneficiosDisponiveis(dados.filter(b => b.status === 'ATIVO'));
    } catch (error) {
      console.error('Erro ao carregar benefícios disponíveis:', error);
    }
  };

  const handleAbrirModal = () => {
    // Resetar formulário
    setBeneficioSelecionado('');
    setValorConcedido('');
    setDataInicio(new Date().toISOString().split('T')[0]);
    setDataFim('');
    setObservacoes('');
    setDialogOpen(true);
  };

  const handleAdicionarBeneficio = async () => {
    if (!beneficioSelecionado || !valorConcedido || !dataInicio) {
      alert('Preencha todos os campos obrigatórios');
      return;
    }

    try {
      const beneficio = beneficiosDisponiveis.find(b => b.id === beneficioSelecionado);
      if (!beneficio) return;

      const novoBeneficio: Partial<BeneficioColaborador> = {
        colaboradorId,
        colaboradorNome: 'Colaborador', // Será preenchido pelo serviço
        beneficioId: beneficioSelecionado,
        beneficio: beneficio,
        valorConcedido: parseFloat(valorConcedido),
        dataInicio,
        dataFim: dataFim || undefined,
        observacoes: observacoes || undefined,
        status: 'ATIVO',
      };

      await beneficiosService.associarBeneficio(novoBeneficio);
      await carregarBeneficiosColaborador();
      setDialogOpen(false);
    } catch (error) {
      console.error('Erro ao adicionar benefício:', error);
      alert('Erro ao adicionar benefício. Tente novamente.');
    }
  };

  const handleRemoverBeneficio = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja remover este benefício do colaborador?')) {
      return;
    }

    try {
      // Implementar remoção
      const beneficiosFiltrados = beneficiosColaborador.filter(b => b.id !== id);
      setBeneficiosColaborador(beneficiosFiltrados);
    } catch (error) {
      console.error('Erro ao remover benefício:', error);
      alert('Erro ao remover benefício. Tente novamente.');
    }
  };

  const beneficioSelecionadoObj = beneficiosDisponiveis.find(b => b.id === beneficioSelecionado);

  return (
    <Box>
      <Box mb={3} display="flex" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography variant="h6" fontWeight={600}>
            Benefícios do Colaborador
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Gerencie os benefícios concedidos ao colaborador
          </Typography>
        </Box>
        <GradientButton startIcon={<AddIcon />} onClick={handleAbrirModal}>
          Adicionar Benefício
        </GradientButton>
      </Box>

      {loading ? (
        <Typography color="text.secondary">Carregando benefícios...</Typography>
      ) : beneficiosColaborador.length === 0 ? (
        <Alert severity="info">
          Nenhum benefício concedido a este colaborador ainda.
        </Alert>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Benefício</TableCell>
                <TableCell>Tipo</TableCell>
                <TableCell>Valor Concedido</TableCell>
                <TableCell>Data Início</TableCell>
                <TableCell>Data Fim</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {beneficiosColaborador.map((bc) => (
                <TableRow key={bc.id} hover>
                  <TableCell>
                    <Typography variant="body2" fontWeight={600}>
                      {bc.beneficio.nome}
                    </Typography>
                    {bc.observacoes && (
                      <Typography variant="caption" color="text.secondary">
                        {bc.observacoes}
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>{getTipoNome(bc.beneficio.tipo)}</TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight={600} color="success.main">
                      {formatarMoeda(bc.valorConcedido)}
                    </Typography>
                  </TableCell>
                  <TableCell>{formatarData(bc.dataInicio)}</TableCell>
                  <TableCell>{bc.dataFim ? formatarData(bc.dataFim) : 'Indeterminado'}</TableCell>
                  <TableCell>
                    <Chip
                      label={getStatusNome(bc.status)}
                      size="small"
                      color={bc.status === 'ATIVO' ? 'success' : 'default'}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <ActionButton
                      action="delete"
                      onClick={() => handleRemoverBeneficio(bc.id)}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Modal Adicionar Benefício */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          <Typography variant="h6" fontWeight={600}>
            Adicionar Benefício ao Colaborador
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                select
                fullWidth
                label="Selecione o Benefício *"
                value={beneficioSelecionado}
                onChange={(e) => setBeneficioSelecionado(e.target.value)}
                required
              >
                {beneficiosDisponiveis.length === 0 ? (
                  <MenuItem value="">
                    <em>Nenhum benefício disponível</em>
                  </MenuItem>
                ) : (
                  beneficiosDisponiveis.map((beneficio) => (
                    <MenuItem key={beneficio.id} value={beneficio.id}>
                      <Box>
                        <Typography variant="body2" fontWeight={600}>
                          {beneficio.nome} - {getTipoNome(beneficio.tipo)}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {beneficio.descricao}
                        </Typography>
                      </Box>
                    </MenuItem>
                  ))
                )}
              </TextField>
            </Grid>

            {beneficioSelecionadoObj && (
              <Grid item xs={12}>
                <Paper sx={{ p: 2, bgcolor: '#f5f5f5' }}>
                  <Typography variant="body2" gutterBottom>
                    <strong>Informações do Benefício:</strong>
                  </Typography>
                  <Typography variant="caption" display="block">
                    • Fornecedor: {beneficioSelecionadoObj.fornecedor || 'N/A'}
                  </Typography>
                  <Typography variant="caption" display="block">
                    • Custo Empresa: {formatarMoeda(beneficioSelecionadoObj.custoEmpresa)}
                  </Typography>
                  {beneficioSelecionadoObj.valorFixo && (
                    <Typography variant="caption" display="block">
                      • Valor Padrão: {formatarMoeda(beneficioSelecionadoObj.valorFixo)}
                    </Typography>
                  )}
                </Paper>
              </Grid>
            )}

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="number"
                label="Valor Concedido *"
                value={valorConcedido}
                onChange={(e) => setValorConcedido(e.target.value)}
                required
                InputProps={{
                  startAdornment: <InputAdornment position="start">R$</InputAdornment>,
                }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="date"
                label="Data de Início *"
                value={dataInicio}
                onChange={(e) => setDataInicio(e.target.value)}
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="date"
                label="Data de Fim (Opcional)"
                value={dataFim}
                onChange={(e) => setDataFim(e.target.value)}
                InputLabelProps={{ shrink: true }}
                helperText="Deixe em branco para benefício indeterminado"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Observações (Opcional)"
                value={observacoes}
                onChange={(e) => setObservacoes(e.target.value)}
                placeholder="Informações adicionais sobre o benefício..."
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancelar</Button>
          <Button
            variant="contained"
            onClick={handleAdicionarBeneficio}
            disabled={!beneficioSelecionado || !valorConcedido || !dataInicio}
            sx={{
              background: 'linear-gradient(135deg, #a2122a 0%, #354a80 100%)',
            }}
          >
            Adicionar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

