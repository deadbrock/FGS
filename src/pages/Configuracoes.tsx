import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  Divider,
  Alert,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Avatar,
  Tabs,
  Tab,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonIcon from '@mui/icons-material/Person';
import BusinessIcon from '@mui/icons-material/Business';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { useNavigationLog } from '../hooks/useNavigationLog';
import { useAuth } from '../hooks/useAuth';
import { RoleBadge } from '../components/RoleBadge';
import logService from '../services/logService';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`config-tabpanel-${index}`}
      aria-labelledby={`config-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

export const Configuracoes: React.FC = () => {
  const { logAction } = useNavigationLog();
  const { user } = useAuth();
  const [success, setSuccess] = useState(false);
  const [tabValue, setTabValue] = useState(0);

  const [perfil, setPerfil] = useState({
    nome: user?.nome || '',
    email: user?.email || '',
    telefone: '(11) 98765-4321',
    cargo: 'Administrador do Sistema',
  });

  const [config, setConfig] = useState({
    nomeEmpresa: 'FGS - Formando Gente de Sucesso',
    email: 'contato@fgs.com',
    telefone: '(11) 98765-4321',
    notificacoesEmail: true,
    notificacoesPush: true,
    logs: true,
    backupAutomatico: true,
  });

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleSave = () => {
    logAction('Configurações salvas');
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  const handleClearLogs = () => {
    if (confirm('Tem certeza que deseja limpar todos os logs?')) {
      logService.clearLogs();
      logAction('Logs limpos');
      alert('Logs limpos com sucesso!');
    }
  };

  const logs = logService.getLogs().slice(0, 10);

  return (
    <Box>
      <Box mb={4}>
        <Typography variant="h4" gutterBottom fontWeight={600}>
          Configurações
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Gerencie seu perfil e configurações do sistema
        </Typography>
      </Box>

      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Configurações salvas com sucesso!
        </Alert>
      )}

      {/* Tabs */}
      <Card sx={{ mb: 3 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="fullWidth"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab icon={<PersonIcon />} label="Meu Perfil" iconPosition="start" />
          <Tab icon={<BusinessIcon />} label="Empresa" iconPosition="start" />
          <Tab icon={<NotificationsIcon />} label="Sistema" iconPosition="start" />
        </Tabs>
      </Card>

      {/* Aba: Meu Perfil */}
      <TabPanel value={tabValue} index={0}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
                  <Avatar
                    sx={{
                      width: 120,
                      height: 120,
                      bgcolor: '#a2122a',
                      fontSize: '3rem',
                      fontWeight: 700,
                    }}
                  >
                    {user?.nome?.charAt(0).toUpperCase() || 'U'}
                  </Avatar>
                  <Box textAlign="center">
                    <Typography variant="h6" fontWeight={600}>
                      {user?.nome || 'Usuário'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {user?.email || 'email@exemplo.com'}
                    </Typography>
                    <RoleBadge role={user?.role || 'COLABORADOR'} />
                  </Box>
                  <Button
                    variant="outlined"
                    fullWidth
                    startIcon={<PersonIcon />}
                    sx={{ mt: 2 }}
                  >
                    Alterar Foto
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom fontWeight={600}>
                  Informações Pessoais
                </Typography>
                <Divider sx={{ mb: 3 }} />

                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Nome Completo"
                      value={perfil.nome}
                      onChange={(e) => setPerfil({ ...perfil, nome: e.target.value })}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Email"
                      type="email"
                      value={perfil.email}
                      onChange={(e) => setPerfil({ ...perfil, email: e.target.value })}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Telefone"
                      value={perfil.telefone}
                      onChange={(e) => setPerfil({ ...perfil, telefone: e.target.value })}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Cargo"
                      value={perfil.cargo}
                      onChange={(e) => setPerfil({ ...perfil, cargo: e.target.value })}
                    />
                  </Grid>
                </Grid>

                <Divider sx={{ my: 3 }} />

                <Typography variant="h6" gutterBottom fontWeight={600}>
                  Alterar Senha
                </Typography>
                <Grid container spacing={2} sx={{ mt: 1 }}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Senha Atual"
                      type="password"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Nova Senha"
                      type="password"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Confirmar Nova Senha"
                      type="password"
                    />
                  </Grid>
                </Grid>

                <Box display="flex" justifyContent="flex-end" gap={2} mt={3}>
                  <Button variant="outlined">
                    Cancelar
                  </Button>
                  <Button
                    variant="contained"
                    startIcon={<SaveIcon />}
                    onClick={handleSave}
                    sx={{
                      background: 'linear-gradient(135deg, #a2122a 0%, #354a80 100%)',
                    }}
                  >
                    Salvar Alterações
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>

      {/* Aba: Empresa */}
      <TabPanel value={tabValue} index={1}>
        <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom fontWeight={600}>
                Informações da Empresa
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <TextField
                fullWidth
                label="Nome da Empresa"
                value={config.nomeEmpresa}
                onChange={(e) =>
                  setConfig({ ...config, nomeEmpresa: e.target.value })
                }
                margin="normal"
              />

              <TextField
                fullWidth
                label="Email"
                type="email"
                value={config.email}
                onChange={(e) => setConfig({ ...config, email: e.target.value })}
                margin="normal"
              />

              <TextField
                fullWidth
                label="Telefone"
                value={config.telefone}
                onChange={(e) =>
                  setConfig({ ...config, telefone: e.target.value })
                }
                margin="normal"
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Box display="flex" justifyContent="flex-end">
            <Button
              variant="contained"
              size="large"
              startIcon={<SaveIcon />}
              onClick={handleSave}
              sx={{
                background: 'linear-gradient(135deg, #a2122a 0%, #354a80 100%)',
              }}
            >
              Salvar Informações
            </Button>
          </Box>
        </Grid>
        </Grid>
      </TabPanel>

      {/* Aba: Sistema */}
      <TabPanel value={tabValue} index={2}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom fontWeight={600}>
                  Notificações
                </Typography>
                <Divider sx={{ mb: 2 }} />

                <FormControlLabel
                  control={
                    <Switch
                      checked={config.notificacoesEmail}
                      onChange={(e) =>
                        setConfig({ ...config, notificacoesEmail: e.target.checked })
                      }
                    />
                  }
                  label="Notificações por Email"
                />

                <FormControlLabel
                  control={
                    <Switch
                      checked={config.notificacoesPush}
                      onChange={(e) =>
                        setConfig({ ...config, notificacoesPush: e.target.checked })
                      }
                    />
                  }
                  label="Notificações Push"
                />

                <Divider sx={{ my: 2 }} />

                <Typography variant="h6" gutterBottom fontWeight={600}>
                  Sistema
                </Typography>
                <Divider sx={{ mb: 2 }} />

                <FormControlLabel
                  control={
                    <Switch
                      checked={config.logs}
                      onChange={(e) =>
                        setConfig({ ...config, logs: e.target.checked })
                      }
                    />
                  }
                  label="Registrar Logs de Navegação"
                />

                <FormControlLabel
                  control={
                    <Switch
                      checked={config.backupAutomatico}
                      onChange={(e) =>
                        setConfig({ ...config, backupAutomatico: e.target.checked })
                      }
                    />
                  }
                  label="Backup Automático"
                />
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  mb={2}
                >
                  <Typography variant="h6" fontWeight={600}>
                    Logs Recentes
                  </Typography>
                  <Button
                    variant="outlined"
                    color="error"
                    size="small"
                    startIcon={<DeleteIcon />}
                    onClick={handleClearLogs}
                  >
                    Limpar
                  </Button>
                </Box>
                <Divider sx={{ mb: 2 }} />

                <List sx={{ maxHeight: 400, overflow: 'auto' }}>
                  {logs.map((log) => (
                    <ListItem key={log.id}>
                      <ListItemText
                        primary={`${log.userName} - ${log.action}`}
                        secondary={`${log.route} • ${new Date(
                          log.timestamp
                        ).toLocaleString('pt-BR')}`}
                      />
                    </ListItem>
                  ))}
                </List>

                {logs.length === 0 && (
                  <Typography variant="body2" color="text.secondary" align="center">
                    Nenhum log registrado
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12}>
            <Box display="flex" justifyContent="flex-end">
              <Button
                variant="contained"
                size="large"
                startIcon={<SaveIcon />}
                onClick={handleSave}
                sx={{
                  background: 'linear-gradient(135deg, #a2122a 0%, #354a80 100%)',
                }}
              >
                Salvar Configurações
              </Button>
            </Box>
          </Grid>
        </Grid>
      </TabPanel>
    </Box>
  );
};

