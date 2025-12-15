import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
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
  CalendarMonth as CalendarIcon,
  CheckCircle as CheckIcon,
  Description as DescriptionIcon,
} from '@mui/icons-material';
import { useNavigationLog } from '../../hooks/useNavigationLog';
import { PageHeader, GradientButton, AnimatedCard } from '../../components';
import solicitacoesService from '../../services/solicitacoesService';
import {
  SolicitacaoExame,
  CreateSolicitacaoDTO,
  CreateAgendamentoDTO,
  UpdateResultadoExameDTO,
  Clinica,
} from '../../types/solicitacoes';
import { formatarData } from '../../utils/statusUtils';

export const Demissional: React.FC = () => {
  useNavigationLog();

  const [solicitacoes, setSolicitacoes] = useState<SolicitacaoExame[]>([]);
  const [clinicas, setClinicas] = useState<Clinica[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [dialogNovaAberto, setDialogNovaAberto] = useState(false);
  const [dialogAgendamentoAberto, setDialogAgendamentoAberto] = useState(false);
  const [dialogResultadoAberto, setDialogResultadoAberto] = useState(false);
  const [solicitacaoSelecionada, setSolicitacaoSelecionada] = useState<SolicitacaoExame | null>(null);

  const [formNova, setFormNova] = useState<CreateSolicitacaoDTO>({
    tipo_exame: 'DEMISSIONAL',
    colaborador_id: '',
    colaborador_nome: '',
    colaborador_cpf: '',
    colaborador_email: '',
    colaborador_telefone: '',
    cargo: '',
    departamento: '',
    setor: '',
    data_desligamento: '',
    motivo_desligamento: '',
    observacoes: '',
  });

  const [formAgendamento, setFormAgendamento] = useState<CreateAgendamentoDTO>({
    solicitacao_id: '',
    clinica_id: '',
    data_agendamento: '',
    hora_agendamento: '',
    observacoes: '',
  });

  const [formResultado, setFormResultado] = useState<UpdateResultadoExameDTO>({
    resultado: 'APTO',
    restricoes: '',
    data_realizacao: '',
    medico_responsavel: '',
    crm_medico: '',
    aso_arquivo_url: '',
  });

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      setLoading(true);
      const [solicitacoesData, clinicasData] = await Promise.all([
        solicitacoesService.getAll({ tipo_exame: 'DEMISSIONAL' }),
        solicitacoesService.getClinicas(),
      ]);
      setSolicitacoes(solicitacoesData.data);
      setClinicas(clinicasData.filter((c) => c.ativo));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCriarSolicitacao = async () => {
    try {
      setLoading(true);
      setError(null);
      await solicitacoesService.create(formNova);
      setDialogNovaAberto(false);
      setFormNova({
        tipo_exame: 'DEMISSIONAL',
        colaborador_id: '',
        colaborador_nome: '',
        colaborador_cpf: '',
        colaborador_email: '',
        colaborador_telefone: '',
        cargo: '',
        departamento: '',
        setor: '',
        data_desligamento: '',
        motivo_desligamento: '',
        observacoes: '',
      });
      carregarDados();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAbrirAgendamento = (solicitacao: SolicitacaoExame) => {
    setSolicitacaoSelecionada(solicitacao);
    setFormAgendamento({
      solicitacao_id: solicitacao.id,
      clinica_id: '',
      data_agendamento: '',
      hora_agendamento: '',
      observacoes: '',
    });
    setDialogAgendamentoAberto(true);
  };

  const handleCriarAgendamento = async () => {
    try {
      setLoading(true);
      setError(null);
      await solicitacoesService.createAgendamento(formAgendamento);
      setDialogAgendamentoAberto(false);
      carregarDados();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAbrirResultado = (solicitacao: SolicitacaoExame) => {
    setSolicitacaoSelecionada(solicitacao);
    setFormResultado({
      resultado: 'APTO',
      restricoes: '',
      data_realizacao: new Date().toISOString().split('T')[0],
      medico_responsavel: '',
      crm_medico: '',
      aso_arquivo_url: '',
    });
    setDialogResultadoAberto(true);
  };

  const handleRegistrarResultado = async () => {
    if (!solicitacaoSelecionada) return;

    try {
      setLoading(true);
      setError(null);
      await solicitacoesService.atualizarResultado(solicitacaoSelecionada.id, formResultado);
      setDialogResultadoAberto(false);
      carregarDados();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, 'default' | 'warning' | 'info' | 'success' | 'error'> = {
      PENDENTE: 'warning',
      AGENDADO: 'info',
      REALIZADO: 'success',
      CANCELADO: 'error',
      REPROVADO: 'error',
    };
    return colors[status] || 'default';
  };

  const getResultadoColor = (resultado?: string) => {
    const colors: Record<string, 'success' | 'error' | 'warning'> = {
      APTO: 'success',
      INAPTO: 'error',
      APTO_COM_RESTRICOES: 'warning',
    };
    return resultado ? colors[resultado] : 'default';
  };

  return (
    <Box>
      <PageHeader
        title="Exame Demissional"
        subtitle="Gestão de exames demissionais para colaboradores em processo de desligamento"
        breadcrumbs={[
          { label: 'Home', path: '/dashboard' },
          { label: 'Solicitações', path: '/solicitacoes' },
          { label: 'Demissional' },
        ]}
        action={
          <GradientButton startIcon={<AddIcon />} onClick={() => setDialogNovaAberto(true)}>
            Nova Solicitação
          </GradientButton>
        }
      />

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <AnimatedCard>
        {loading ? (
          <Box display="flex" justifyContent="center" py={4}>
            <CircularProgress />
          </Box>
        ) : (
          <TableContainer component={Paper} elevation={0}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Colaborador</TableCell>
                  <TableCell>Cargo</TableCell>
                  <TableCell>Departamento</TableCell>
                  <TableCell>Data Desligamento</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Data Agendamento</TableCell>
                  <TableCell>Resultado</TableCell>
                  <TableCell align="right">Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {solicitacoes.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                      <Typography color="text.secondary">
                        Nenhuma solicitação de exame demissional encontrada
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  solicitacoes.map((solicitacao) => (
                    <TableRow key={solicitacao.id} hover>
                      <TableCell>
                        <Box>
                          <Typography variant="body2" fontWeight={600}>
                            {solicitacao.colaborador_nome}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            CPF: {solicitacao.colaborador_cpf}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>{solicitacao.cargo}</TableCell>
                      <TableCell>{solicitacao.departamento}</TableCell>
                      <TableCell>
                        {solicitacao.data_desligamento ? formatarData(solicitacao.data_desligamento) : '-'}
                      </TableCell>
                      <TableCell>
                        <Chip label={solicitacao.status} size="small" color={getStatusColor(solicitacao.status)} />
                      </TableCell>
                      <TableCell>
                        {solicitacao.data_agendamento
                          ? `${formatarData(solicitacao.data_agendamento)} ${solicitacao.hora_agendamento || ''}`
                          : '-'}
                      </TableCell>
                      <TableCell>
                        {solicitacao.resultado ? (
                          <Chip
                            label={solicitacao.resultado.replace(/_/g, ' ')}
                            size="small"
                            color={getResultadoColor(solicitacao.resultado)}
                          />
                        ) : (
                          '-'
                        )}
                      </TableCell>
                      <TableCell align="right">
                        {solicitacao.status === 'PENDENTE' && (
                          <Tooltip title="Agendar Exame">
                            <IconButton size="small" color="primary" onClick={() => handleAbrirAgendamento(solicitacao)}>
                              <CalendarIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}
                        {solicitacao.status === 'AGENDADO' && (
                          <Tooltip title="Registrar Resultado">
                            <IconButton size="small" color="success" onClick={() => handleAbrirResultado(solicitacao)}>
                              <CheckIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}
                        {solicitacao.aso_arquivo_url && (
                          <Tooltip title="Ver ASO">
                            <IconButton size="small" onClick={() => window.open(solicitacao.aso_arquivo_url, '_blank')}>
                              <DescriptionIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </AnimatedCard>

      {/* Dialog Nova Solicitação */}
      <Dialog open={dialogNovaAberto} onClose={() => setDialogNovaAberto(false)} maxWidth="md" fullWidth>
        <DialogTitle>Nova Solicitação de Exame Demissional</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="ID do Colaborador"
                value={formNova.colaborador_id}
                onChange={(e) => setFormNova({ ...formNova, colaborador_id: e.target.value })}
                helperText="Se existir no sistema"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Nome do Colaborador *"
                value={formNova.colaborador_nome}
                onChange={(e) => setFormNova({ ...formNova, colaborador_nome: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="CPF *"
                value={formNova.colaborador_cpf}
                onChange={(e) => setFormNova({ ...formNova, colaborador_cpf: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={formNova.colaborador_email}
                onChange={(e) => setFormNova({ ...formNova, colaborador_email: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Telefone"
                value={formNova.colaborador_telefone}
                onChange={(e) => setFormNova({ ...formNova, colaborador_telefone: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Cargo *"
                value={formNova.cargo}
                onChange={(e) => setFormNova({ ...formNova, cargo: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Departamento *"
                value={formNova.departamento}
                onChange={(e) => setFormNova({ ...formNova, departamento: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Setor *"
                value={formNova.setor}
                onChange={(e) => setFormNova({ ...formNova, setor: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="date"
                label="Data de Desligamento *"
                value={formNova.data_desligamento}
                onChange={(e) => setFormNova({ ...formNova, data_desligamento: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Motivo do Desligamento"
                value={formNova.motivo_desligamento}
                onChange={(e) => setFormNova({ ...formNova, motivo_desligamento: e.target.value })}
                placeholder="Ex: Pedido de demissão, Justa causa, etc."
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Observações"
                value={formNova.observacoes}
                onChange={(e) => setFormNova({ ...formNova, observacoes: e.target.value })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogNovaAberto(false)}>Cancelar</Button>
          <GradientButton onClick={handleCriarSolicitacao} disabled={loading}>
            {loading ? <CircularProgress size={20} /> : 'Criar Solicitação'}
          </GradientButton>
        </DialogActions>
      </Dialog>

      {/* Dialog Agendamento */}
      <Dialog open={dialogAgendamentoAberto} onClose={() => setDialogAgendamentoAberto(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Agendar Exame</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                select
                label="Clínica *"
                value={formAgendamento.clinica_id}
                onChange={(e) => setFormAgendamento({ ...formAgendamento, clinica_id: e.target.value })}
              >
                {clinicas.map((clinica) => (
                  <MenuItem key={clinica.id} value={clinica.id}>
                    {clinica.nome} - {clinica.endereco.cidade}/{clinica.endereco.estado}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="date"
                label="Data *"
                value={formAgendamento.data_agendamento}
                onChange={(e) => setFormAgendamento({ ...formAgendamento, data_agendamento: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="time"
                label="Hora *"
                value={formAgendamento.hora_agendamento}
                onChange={(e) => setFormAgendamento({ ...formAgendamento, hora_agendamento: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={2}
                label="Observações"
                value={formAgendamento.observacoes}
                onChange={(e) => setFormAgendamento({ ...formAgendamento, observacoes: e.target.value })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogAgendamentoAberto(false)}>Cancelar</Button>
          <GradientButton onClick={handleCriarAgendamento} disabled={loading}>
            {loading ? <CircularProgress size={20} /> : 'Confirmar Agendamento'}
          </GradientButton>
        </DialogActions>
      </Dialog>

      {/* Dialog Resultado */}
      <Dialog open={dialogResultadoAberto} onClose={() => setDialogResultadoAberto(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Registrar Resultado do Exame</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                select
                label="Resultado *"
                value={formResultado.resultado}
                onChange={(e) => setFormResultado({ ...formResultado, resultado: e.target.value as any })}
              >
                <MenuItem value="APTO">Apto</MenuItem>
                <MenuItem value="INAPTO">Inapto</MenuItem>
                <MenuItem value="APTO_COM_RESTRICOES">Apto com Restrições</MenuItem>
              </TextField>
            </Grid>
            {formResultado.resultado === 'APTO_COM_RESTRICOES' && (
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={2}
                  label="Restrições *"
                  value={formResultado.restricoes}
                  onChange={(e) => setFormResultado({ ...formResultado, restricoes: e.target.value })}
                />
              </Grid>
            )}
            <Grid item xs={12}>
              <TextField
                fullWidth
                type="date"
                label="Data de Realização *"
                value={formResultado.data_realizacao}
                onChange={(e) => setFormResultado({ ...formResultado, data_realizacao: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Médico Responsável *"
                value={formResultado.medico_responsavel}
                onChange={(e) => setFormResultado({ ...formResultado, medico_responsavel: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="CRM *"
                value={formResultado.crm_medico}
                onChange={(e) => setFormResultado({ ...formResultado, crm_medico: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="URL do ASO (PDF)"
                value={formResultado.aso_arquivo_url}
                onChange={(e) => setFormResultado({ ...formResultado, aso_arquivo_url: e.target.value })}
                placeholder="https://..."
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogResultadoAberto(false)}>Cancelar</Button>
          <GradientButton onClick={handleRegistrarResultado} disabled={loading}>
            {loading ? <CircularProgress size={20} /> : 'Registrar Resultado'}
          </GradientButton>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

