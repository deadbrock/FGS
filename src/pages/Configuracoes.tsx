import React, { useState, useRef } from 'react';
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
  IconButton,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonIcon from '@mui/icons-material/Person';
import BusinessIcon from '@mui/icons-material/Business';
import NotificationsIcon from '@mui/icons-material/Notifications';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
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
  const [avatarPreview, setAvatarPreview] = useState<string | null>(user?.avatar || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleSave = async () => {
    try {
      // Atualizar dados do usuário no backend
      if (user?.id) {
        console.log('🔍 Atualizando usuário:', { 
          userId: user.id, 
          nome: perfil.nome, 
          email: perfil.email 
        });
        
        const usuariosService = (await import('../services/usuariosService')).default;
        
        await usuariosService.update(user.id, {
          nome: perfil.nome,
          email: perfil.email,
        });

        console.log('✅ Usuário atualizado com sucesso');

        // Atualizar também no localStorage
        const storedUser = localStorage.getItem('@FGS:user');
        if (storedUser) {
          const userObj = JSON.parse(storedUser);
          userObj.nome = perfil.nome;
          userObj.email = perfil.email;
          localStorage.setItem('@FGS:user', JSON.stringify(userObj));
        }
        
        logAction('Configurações salvas');
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
          // Recarregar para atualizar o nome no sidebar
          window.location.reload();
        }, 1500);
      } else {
        console.error('❌ user.id não encontrado:', user);
        alert('Erro: ID do usuário não encontrado. Faça login novamente.');
      }
    } catch (error: any) {
      console.error('❌ Erro ao salvar configurações:', error);
      console.error('Detalhes do erro:', error.response?.data);
      alert(`Erro ao salvar configurações: ${error.message || 'Erro desconhecido'}`);
    }
  };

  const handleClearLogs = () => {
    if (confirm('Tem certeza que deseja limpar todos os logs?')) {
      logService.clearLogs();
      logAction('Logs limpos');
      alert('Logs limpos com sucesso!');
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validar tipo de arquivo
      if (!file.type.startsWith('image/')) {
        alert('Por favor, selecione apenas arquivos de imagem (JPG, PNG, etc.)');
        return;
      }

      // Validar tamanho (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('A imagem deve ter no máximo 5MB');
        return;
      }

      // Criar preview da imagem
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
        logAction('Foto de perfil alterada');
        
        // Aqui você salvaria a imagem no backend/localStorage
        // Por enquanto, vamos apenas salvar no localStorage
        localStorage.setItem('@FGS:userAvatar', reader.result as string);
        
        // Atualizar também no objeto user do localStorage
        const storedUser = localStorage.getItem('@FGS:user');
        if (storedUser) {
          const userObj = JSON.parse(storedUser);
          userObj.avatar = reader.result as string;
          localStorage.setItem('@FGS:user', JSON.stringify(userObj));
        }
        
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
          // Recarregar a página para atualizar o avatar no sidebar
          window.location.reload();
        }, 1500);
      };
      reader.readAsDataURL(file);
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
                  <Box sx={{ position: 'relative' }}>
                    <Avatar
                      src={avatarPreview || undefined}
                      sx={{
                        width: 120,
                        height: 120,
                        bgcolor: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                        fontSize: '3rem',
                        fontWeight: 700,
                        border: '4px solid',
                        borderColor: 'background.paper',
                        boxShadow: '0 8px 24px rgba(99, 102, 241, 0.3)',
                      }}
                    >
                      {!avatarPreview && (user?.nome?.charAt(0).toUpperCase() || 'U')}
                    </Avatar>
                    <IconButton
                      sx={{
                        position: 'absolute',
                        bottom: 0,
                        right: 0,
                        bgcolor: 'primary.main',
                        color: 'white',
                        boxShadow: 2,
                        '&:hover': {
                          bgcolor: 'primary.dark',
                        },
                      }}
                      size="small"
                      onClick={handleAvatarClick}
                    >
                      <PhotoCameraIcon fontSize="small" />
                    </IconButton>
                  </Box>
                  
                  {/* Input escondido para upload de arquivo */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={handleAvatarChange}
                  />
                  
                  <Box textAlign="center">
                    <Typography variant="h6" fontWeight={600}>
                      {perfil.nome || user?.nome || 'Usuário'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {perfil.email || user?.email || 'email@exemplo.com'}
                    </Typography>
                    <RoleBadge role={user?.role || 'COLABORADOR'} />
                  </Box>
                  <Button
                    variant="outlined"
                    fullWidth
                    startIcon={<PhotoCameraIcon />}
                    sx={{ mt: 2 }}
                    onClick={handleAvatarClick}
                  >
                    Alterar Foto
                  </Button>
                  <Typography variant="caption" color="text.secondary" textAlign="center">
                    JPG, PNG ou GIF (máx. 5MB)
                  </Typography>
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

