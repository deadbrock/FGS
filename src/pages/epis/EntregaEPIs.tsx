import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  TextField,
  MenuItem,
  Button,
  Paper,
  Typography,
  Alert,
  CircularProgress,
  Autocomplete,
  Card,
  CardContent,
  Divider,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import {
  Search as SearchIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import { GradientButton, AnimatedCard } from '../../components';
import epiService from '../../services/epiService';
import { EPI, CreateEntregaEPIDTO } from '../../types/epi';
import { formatarData } from '../../utils/statusUtils';

interface Colaborador {
  id: string;
  nome: string;
  cpf: string;
  cargo: string;
  departamento: string;
}

export const EntregaEPIs: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Dados do formulário
  const [colaboradorSelecionado, setColaboradorSelecionado] = useState<Colaborador | null>(null);
  const [epiSelecionado, setEpiSelecionado] = useState<EPI | null>(null);
  const [quantidade, setQuantidade] = useState(1);
  const [dataEntrega, setDataEntrega] = useState(new Date().toISOString().split('T')[0]);
  const [observacoes, setObservacoes] = useState('');

  // Listas
  const [epis, setEpis] = useState<EPI[]>([]);
  const [colaboradores, setColaboradores] = useState<Colaborador[]>([]);
  const [entregasRecentes, setEntregasRecentes] = useState<any[]>([]);

  // Dados calculados
  const [dataValidade, setDataValidade] = useState<string>('');

  useEffect(() => {
    carregarDados();
  }, []);

  useEffect(() => {
    if (epiSelecionado && dataEntrega) {
      calcularDataValidade();
    }
  }, [epiSelecionado, dataEntrega]);

  const carregarDados = async () => {
    try {
      setLoading(true);
      const [episData, entregasData] = await Promise.all([
        epiService.getEPIs({ ativo: true }),
        epiService.getEntregas({ limit: 5, offset: 0 }),
      ]);
      setEpis(episData.data.filter(epi => epi.quantidade_estoque > 0));
      setEntregasRecentes(entregasData.data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const buscarColaborador = async (cpf: string) => {
    if (cpf.length < 11) return;
    
    try {
      setLoading(true);
      // TODO: Implementar busca real de colaborador
      // Por enquanto, simulando
      const colaboradorMock: Colaborador = {
        id: '123',
        nome: 'João Silva',
        cpf: cpf,
        cargo: 'Operador',
        departamento: 'Produção',
      };
      setColaboradorSelecionado(colaboradorMock);
    } catch (err: any) {
      setError('Colaborador não encontrado');
    } finally {
      setLoading(false);
    }
  };

  const calcularDataValidade = () => {
    if (!epiSelecionado || !dataEntrega) return;

    const data = new Date(dataEntrega);
    data.setMonth(data.getMonth() + epiSelecionado.durabilidade_meses);
    setDataValidade(data.toISOString().split('T')[0]);
  };

  const validarFormulario = (): string | null => {
    if (!colaboradorSelecionado) return 'Selecione um colaborador';
    if (!epiSelecionado) return 'Selecione um EPI';
    if (quantidade <= 0) return 'Quantidade deve ser maior que zero';
    if (quantidade > epiSelecionado.quantidade_estoque) {
      return `Estoque insuficiente. Disponível: ${epiSelecionado.quantidade_estoque}`;
    }
    if (!dataEntrega) return 'Informe a data de entrega';
    return null;
  };

  const handleEntregar = async () => {
    const erroValidacao = validarFormulario();
    if (erroValidacao) {
      setError(erroValidacao);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const dados: CreateEntregaEPIDTO = {
        epi_id: epiSelecionado!.id,
        colaborador_id: colaboradorSelecionado!.id,
        quantidade,
        data_entrega: dataEntrega,
        data_validade: dataValidade,
        observacoes: observacoes || undefined,
      };

      await epiService.entregarEPI(dados);
      
      setSuccess('EPI entregue com sucesso!');
      limparFormulario();
      carregarDados();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const limparFormulario = () => {
    setColaboradorSelecionado(null);
    setEpiSelecionado(null);
    setQuantidade(1);
    setDataEntrega(new Date().toISOString().split('T')[0]);
    setObservacoes('');
    setDataValidade('');
  };

  const getStatusEstoque = (epi: EPI) => {
    if (epi.quantidade_estoque === 0) return { label: 'SEM ESTOQUE', color: 'error' as const };
    if (epi.quantidade_estoque <= epi.estoque_minimo) return { label: 'ESTOQUE BAIXO', color: 'warning' as const };
    return { label: 'DISPONÍVEL', color: 'success' as const };
  };

  return (
    <Box>
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess(null)}>
          {success}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Formulário de Entrega */}
        <Grid item xs={12} md={8}>
          <AnimatedCard>
            <Box sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Nova Entrega de EPI
              </Typography>
              <Divider sx={{ mb: 3 }} />

            <Grid container spacing={2}>
              {/* Buscar Colaborador */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="CPF do Colaborador"
                  placeholder="000.000.000-00"
                  onChange={(e) => {
                    const cpf = e.target.value.replace(/\D/g, '');
                    if (cpf.length === 11) buscarColaborador(cpf);
                  }}
                  InputProps={{
                    endAdornment: loading ? <CircularProgress size={20} /> : <SearchIcon />,
                  }}
                />
              </Grid>

              {/* Dados do Colaborador */}
              {colaboradorSelecionado && (
                <Grid item xs={12}>
                  <Card variant="outlined" sx={{ bgcolor: 'success.light', color: 'success.contrastText' }}>
                    <CardContent>
                      <Grid container spacing={1}>
                        <Grid item xs={12}>
                          <Typography variant="subtitle2">Colaborador Encontrado</Typography>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <Typography variant="body2">
                            <strong>Nome:</strong> {colaboradorSelecionado.nome}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <Typography variant="body2">
                            <strong>CPF:</strong> {colaboradorSelecionado.cpf}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <Typography variant="body2">
                            <strong>Cargo:</strong> {colaboradorSelecionado.cargo}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <Typography variant="body2">
                            <strong>Departamento:</strong> {colaboradorSelecionado.departamento}
                          </Typography>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>
              )}

              {/* Selecionar EPI */}
              <Grid item xs={12}>
                <Autocomplete
                  options={epis}
                  getOptionLabel={(option) => `${option.codigo} - ${option.nome} (Estoque: ${option.quantidade_estoque})`}
                  value={epiSelecionado}
                  onChange={(_, newValue) => setEpiSelecionado(newValue)}
                  renderInput={(params) => <TextField {...params} label="Selecionar EPI" />}
                  renderOption={(props, option) => {
                    const status = getStatusEstoque(option);
                    return (
                      <li {...props}>
                        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Box>
                            <Typography variant="body2">
                              {option.codigo} - {option.nome}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              CA: {option.ca} | Estoque: {option.quantidade_estoque}
                            </Typography>
                          </Box>
                          <Chip label={status.label} size="small" color={status.color} />
                        </Box>
                      </li>
                    );
                  }}
                />
              </Grid>

              {/* Detalhes do EPI Selecionado */}
              {epiSelecionado && (
                <Grid item xs={12}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="subtitle2" gutterBottom>
                        Detalhes do EPI
                      </Typography>
                      <Grid container spacing={1}>
                        <Grid item xs={12} md={6}>
                          <Typography variant="body2">
                            <strong>Categoria:</strong> {epiSelecionado.categoria}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <Typography variant="body2">
                            <strong>Fabricante:</strong> {epiSelecionado.fabricante}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <Typography variant="body2">
                            <strong>Durabilidade:</strong> {epiSelecionado.durabilidade_meses} meses
                          </Typography>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <Typography variant="body2">
                            <strong>Validade do CA:</strong> {formatarData(epiSelecionado.validade_ca)}
                          </Typography>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>
              )}

              {/* Quantidade */}
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  type="number"
                  label="Quantidade"
                  value={quantidade}
                  onChange={(e) => setQuantidade(parseInt(e.target.value) || 1)}
                  inputProps={{ min: 1, max: epiSelecionado?.quantidade_estoque || 1 }}
                />
              </Grid>

              {/* Data de Entrega */}
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  type="date"
                  label="Data de Entrega"
                  value={dataEntrega}
                  onChange={(e) => setDataEntrega(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              {/* Data de Validade (calculada) */}
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  type="date"
                  label="Data de Validade (calculada)"
                  value={dataValidade}
                  InputLabelProps={{ shrink: true }}
                  disabled
                  helperText="Calculada automaticamente"
                />
              </Grid>

              {/* Observações */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Observações"
                  value={observacoes}
                  onChange={(e) => setObservacoes(e.target.value)}
                  placeholder="Informações adicionais sobre a entrega..."
                />
              </Grid>

              {/* Botões */}
              <Grid item xs={12}>
                <Box display="flex" gap={2} justifyContent="flex-end">
                  <Button variant="outlined" onClick={limparFormulario}>
                    Limpar
                  </Button>
                  <GradientButton
                    startIcon={loading ? <CircularProgress size={20} /> : <CheckCircleIcon />}
                    onClick={handleEntregar}
                    disabled={loading}
                  >
                    Registrar Entrega
                  </GradientButton>
                </Box>
              </Grid>
            </Grid>
            </Box>
          </AnimatedCard>
        </Grid>

        {/* Entregas Recentes */}
        <Grid item xs={12} md={4}>
          <AnimatedCard>
            <Box sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Entregas Recentes
              </Typography>
              <Divider sx={{ mb: 2 }} />

            {entregasRecentes.length === 0 ? (
              <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 3 }}>
                Nenhuma entrega registrada
              </Typography>
            ) : (
              <Box>
                {entregasRecentes.map((entrega, index) => (
                  <Card key={index} variant="outlined" sx={{ mb: 2 }}>
                    <CardContent>
                      <Typography variant="body2" gutterBottom>
                        <strong>{entrega.epi_nome || 'EPI'}</strong>
                      </Typography>
                      <Typography variant="caption" display="block" color="text.secondary">
                        Colaborador: {entrega.colaborador_nome || 'N/A'}
                      </Typography>
                      <Typography variant="caption" display="block" color="text.secondary">
                        Data: {formatarData(entrega.data_entrega)}
                      </Typography>
                      <Typography variant="caption" display="block" color="text.secondary">
                        Quantidade: {entrega.quantidade}
                      </Typography>
                      <Chip
                        label={entrega.status}
                        size="small"
                        color={entrega.status === 'ENTREGUE' ? 'success' : 'default'}
                        sx={{ mt: 1 }}
                      />
                    </CardContent>
                  </Card>
                ))}
              </Box>
            )}
            </Box>
          </AnimatedCard>
        </Grid>
      </Grid>
    </Box>
  );
};

