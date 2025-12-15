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
  Grid,
  Alert,
  CircularProgress,
  Switch,
  FormControlLabel,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  LocationOn as LocationIcon,
} from '@mui/icons-material';
import { useNavigationLog } from '../../hooks/useNavigationLog';
import { PageHeader, GradientButton, AnimatedCard } from '../../components';
import solicitacoesService from '../../services/solicitacoesService';
import { Clinica, CreateClinicaDTO, UpdateClinicaDTO } from '../../types/solicitacoes';

export const CadastroClinicas: React.FC = () => {
  useNavigationLog();

  const [clinicas, setClinicas] = useState<Clinica[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [dialogAberto, setDialogAberto] = useState(false);
  const [clinicaEditando, setClinicaEditando] = useState<Clinica | null>(null);

  const [formData, setFormData] = useState<CreateClinicaDTO | UpdateClinicaDTO>({
    nome: '',
    cnpj: '',
    telefone: '',
    email: '',
    endereco: {
      logradouro: '',
      numero: '',
      complemento: '',
      bairro: '',
      cidade: '',
      estado: '',
      cep: '',
    },
    responsavel_nome: '',
    responsavel_telefone: '',
    responsavel_email: '',
    observacoes: '',
    ativo: true,
  });

  useEffect(() => {
    carregarClinicas();
  }, []);

  const carregarClinicas = async () => {
    try {
      setLoading(true);
      const data = await solicitacoesService.getClinicas();
      setClinicas(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAbrirDialog = (clinica?: Clinica) => {
    if (clinica) {
      setClinicaEditando(clinica);
      setFormData({
        nome: clinica.nome,
        cnpj: clinica.cnpj,
        telefone: clinica.telefone,
        email: clinica.email,
        endereco: clinica.endereco,
        responsavel_nome: clinica.responsavel_nome || '',
        responsavel_telefone: clinica.responsavel_telefone || '',
        responsavel_email: clinica.responsavel_email || '',
        observacoes: clinica.observacoes || '',
        ativo: clinica.ativo,
      });
    } else {
      setClinicaEditando(null);
      setFormData({
        nome: '',
        cnpj: '',
        telefone: '',
        email: '',
        endereco: {
          logradouro: '',
          numero: '',
          complemento: '',
          bairro: '',
          cidade: '',
          estado: '',
          cep: '',
        },
        responsavel_nome: '',
        responsavel_telefone: '',
        responsavel_email: '',
        observacoes: '',
        ativo: true,
      });
    }
    setDialogAberto(true);
  };

  const handleFecharDialog = () => {
    setDialogAberto(false);
    setClinicaEditando(null);
  };

  const handleSalvar = async () => {
    try {
      setLoading(true);
      setError(null);

      if (clinicaEditando) {
        await solicitacoesService.updateClinica(clinicaEditando.id, formData as UpdateClinicaDTO);
        setSuccess('Clínica atualizada com sucesso!');
      } else {
        await solicitacoesService.createClinica(formData as CreateClinicaDTO);
        setSuccess('Clínica cadastrada com sucesso!');
      }

      handleFecharDialog();
      carregarClinicas();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleExcluir = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja excluir esta clínica?')) {
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await solicitacoesService.deleteClinica(id);
      setSuccess('Clínica excluída com sucesso!');
      carregarClinicas();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <PageHeader
        title="Cadastro de Clínicas"
        subtitle="Gestão de clínicas parceiras para realização de exames ocupacionais"
        breadcrumbs={[
          { label: 'Home', path: '/dashboard' },
          { label: 'Solicitações', path: '/solicitacoes' },
          { label: 'Cadastro de Clínicas' },
        ]}
        action={
          <GradientButton startIcon={<AddIcon />} onClick={() => handleAbrirDialog()}>
            Nova Clínica
          </GradientButton>
        }
      />

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
                  <TableCell>Nome</TableCell>
                  <TableCell>CNPJ</TableCell>
                  <TableCell>Contato</TableCell>
                  <TableCell>Endereço</TableCell>
                  <TableCell>Responsável</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {clinicas.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                      <Typography color="text.secondary">Nenhuma clínica cadastrada</Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  clinicas.map((clinica) => (
                    <TableRow key={clinica.id} hover>
                      <TableCell>
                        <Typography variant="body2" fontWeight={600}>
                          {clinica.nome}
                        </Typography>
                      </TableCell>
                      <TableCell>{clinica.cnpj}</TableCell>
                      <TableCell>
                        <Box>
                          <Box display="flex" alignItems="center" gap={0.5}>
                            <PhoneIcon fontSize="small" color="action" />
                            <Typography variant="caption">{clinica.telefone}</Typography>
                          </Box>
                          <Box display="flex" alignItems="center" gap={0.5}>
                            <EmailIcon fontSize="small" color="action" />
                            <Typography variant="caption">{clinica.email}</Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box display="flex" alignItems="start" gap={0.5}>
                          <LocationIcon fontSize="small" color="action" />
                          <Typography variant="caption">
                            {clinica.endereco.cidade}/{clinica.endereco.estado}
                            <br />
                            {clinica.endereco.bairro}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        {clinica.responsavel_nome ? (
                          <Box>
                            <Typography variant="caption" fontWeight={600}>
                              {clinica.responsavel_nome}
                            </Typography>
                            <br />
                            <Typography variant="caption">{clinica.responsavel_telefone}</Typography>
                          </Box>
                        ) : (
                          '-'
                        )}
                      </TableCell>
                      <TableCell>
                        <Chip label={clinica.ativo ? 'Ativa' : 'Inativa'} size="small" color={clinica.ativo ? 'success' : 'default'} />
                      </TableCell>
                      <TableCell align="right">
                        <Tooltip title="Editar">
                          <IconButton size="small" color="primary" onClick={() => handleAbrirDialog(clinica)}>
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Excluir">
                          <IconButton size="small" color="error" onClick={() => handleExcluir(clinica.id)}>
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </AnimatedCard>

      {/* Dialog Cadastro/Edição */}
      <Dialog open={dialogAberto} onClose={handleFecharDialog} maxWidth="md" fullWidth>
        <DialogTitle>{clinicaEditando ? 'Editar Clínica' : 'Nova Clínica'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <Typography variant="subtitle2" color="primary" gutterBottom>
                Dados da Clínica
              </Typography>
            </Grid>
            <Grid item xs={12} md={8}>
              <TextField
                fullWidth
                label="Nome da Clínica *"
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="CNPJ *"
                value={formData.cnpj}
                onChange={(e) => setFormData({ ...formData, cnpj: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Telefone *"
                value={formData.telefone}
                onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Email *"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle2" color="primary" gutterBottom sx={{ mt: 2 }}>
                Endereço
              </Typography>
            </Grid>
            <Grid item xs={12} md={8}>
              <TextField
                fullWidth
                label="Logradouro *"
                value={formData.endereco.logradouro}
                onChange={(e) =>
                  setFormData({ ...formData, endereco: { ...formData.endereco, logradouro: e.target.value } })
                }
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Número *"
                value={formData.endereco.numero}
                onChange={(e) =>
                  setFormData({ ...formData, endereco: { ...formData.endereco, numero: e.target.value } })
                }
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Complemento"
                value={formData.endereco.complemento}
                onChange={(e) =>
                  setFormData({ ...formData, endereco: { ...formData.endereco, complemento: e.target.value } })
                }
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Bairro *"
                value={formData.endereco.bairro}
                onChange={(e) =>
                  setFormData({ ...formData, endereco: { ...formData.endereco, bairro: e.target.value } })
                }
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="CEP *"
                value={formData.endereco.cep}
                onChange={(e) =>
                  setFormData({ ...formData, endereco: { ...formData.endereco, cep: e.target.value } })
                }
              />
            </Grid>
            <Grid item xs={12} md={8}>
              <TextField
                fullWidth
                label="Cidade *"
                value={formData.endereco.cidade}
                onChange={(e) =>
                  setFormData({ ...formData, endereco: { ...formData.endereco, cidade: e.target.value } })
                }
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Estado *"
                value={formData.endereco.estado}
                onChange={(e) =>
                  setFormData({ ...formData, endereco: { ...formData.endereco, estado: e.target.value } })
                }
                inputProps={{ maxLength: 2 }}
                placeholder="Ex: SP"
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle2" color="primary" gutterBottom sx={{ mt: 2 }}>
                Responsável (Opcional)
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Nome do Responsável"
                value={formData.responsavel_nome}
                onChange={(e) => setFormData({ ...formData, responsavel_nome: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Telefone do Responsável"
                value={formData.responsavel_telefone}
                onChange={(e) => setFormData({ ...formData, responsavel_telefone: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Email do Responsável"
                type="email"
                value={formData.responsavel_email}
                onChange={(e) => setFormData({ ...formData, responsavel_email: e.target.value })}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Observações"
                value={formData.observacoes}
                onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
              />
            </Grid>

            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.ativo}
                    onChange={(e) => setFormData({ ...formData, ativo: e.target.checked })}
                  />
                }
                label="Clínica Ativa"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleFecharDialog}>Cancelar</Button>
          <GradientButton onClick={handleSalvar} disabled={loading}>
            {loading ? <CircularProgress size={20} /> : clinicaEditando ? 'Atualizar' : 'Cadastrar'}
          </GradientButton>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

