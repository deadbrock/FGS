import React, { useState, useRef, useEffect } from 'react';
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
  const { user, login } = useAuth();
  
  // Debug: verificar user ao carregar
  useEffect(() => {
    console.log('👤 User do AuthContext:', user);
    console.log('🔑 User ID:', user?.id);
    console.log('📧 User Email:', user?.email);
  }, [user]);

  // Atualizar perfil quando user mudar
  useEffect(() => {
    if (user) {
      setPerfil({
        nome: user.nome || '',
        email: user.email || '',
        cargo: user.cargo || 'Administrador do Sistema',
      });
      if (user.avatar) {
        setAvatarPreview(user.avatar);
      }
    }
  }, [user]);
  
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string>('');
  const [tabValue, setTabValue] = useState(0);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(user?.avatar || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [perfil, setPerfil] = useState({
    nome: user?.nome || '',
    email: user?.email || '',
    cargo: user?.cargo || 'Administrador do Sistema',
  });

  const [senha, setSenha] = useState({
    senhaAtual: '',
    novaSenha: '',
    confirmarSenha: '',
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
      setError('');
      // Atualizar dados do usuário no backend
      if (user?.id) {
        console.log('🔍 Atualizando usuário:', { 
          userId: user.id, 
          nome: perfil.nome, 
          email: perfil.email,
          hasAvatar: !!avatarPreview
        });
        
        const usuariosService = (await import('../services/usuariosService')).default;
        
        // Preparar dados para atualização
        const updateData: any = {
          nome: perfil.nome,
          email: perfil.email,
        };

        // Incluir cargo se houver
        if (perfil.cargo) {
          updateData.cargo = perfil.cargo;
        }

        // Incluir avatar se houver preview
        if (avatarPreview) {
          updateData.avatar = avatarPreview;
        }

        const updatedUser = await usuariosService.update(user.id, updateData);

        console.log('✅ Usuário atualizado com sucesso:', updatedUser);

        // Atualizar também no localStorage com os dados retornados do backend
        const storedUser = localStorage.getItem('@FGS:user');
        if (storedUser) {
          const userObj = JSON.parse(storedUser);
          userObj.nome = updatedUser.nome || perfil.nome;
          userObj.email = updatedUser.email || perfil.email;
          if (updatedUser.cargo) {
            userObj.cargo = updatedUser.cargo;
          }
          if (updatedUser.avatar) {
            userObj.avatar = updatedUser.avatar;
            localStorage.setItem('@FGS:userAvatar', updatedUser.avatar);
          }
          localStorage.setItem('@FGS:user', JSON.stringify(userObj));
        }
        
        logAction('Configurações salvas');
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
          // Recarregar para atualizar o nome e avatar no sidebar
          window.location.reload();
        }, 1500);
      } else {
        console.error('❌ user.id não encontrado:', user);
        setError('Erro: ID do usuário não encontrado. Faça login novamente.');
      }
    } catch (error: any) {
      console.error('❌ Erro ao salvar configurações:', error);
      console.error('Detalhes do erro:', error.response?.data);
      setError(`Erro ao salvar configurações: ${error.message || 'Erro desconhecido'}`);
    }
  };

  const handleAlterarSenha = async () => {
    try {
      setError('');
      setSuccess(false);

      // Validações
      if (!senha.senhaAtual || !senha.novaSenha || !senha.confirmarSenha) {
        setError('Por favor, preencha todos os campos de senha.');
        return;
      }

      if (senha.novaSenha.length < 6) {
        setError('A nova senha deve ter pelo menos 6 caracteres.');
        return;
      }

      if (senha.novaSenha !== senha.confirmarSenha) {
        setError('A nova senha e a confirmação não coincidem.');
        return;
      }

      if (!user?.email) {
        setError('Erro: Email do usuário não encontrado.');
        return;
      }

      // Verificar se a senha atual está correta (fazendo um login de teste)
      const authService = (await import('../services/authService')).default;
      
      // Salvar token atual antes da verificação
      const tokenAtual = authService.getStoredToken();
      let verificacaoBemSucedida = false;
      try {
        await authService.login({
          email: user.email,
          senha: senha.senhaAtual,
        });
        verificacaoBemSucedida = true;
      } catch (loginError: any) {
        setError('Senha atual incorreta. Por favor, verifique e tente novamente.');
        return;
      }

      // Se a verificação foi bem-sucedida, restaurar o token anterior temporariamente
      if (verificacaoBemSucedida && tokenAtual) {
        localStorage.setItem('@FGS:token', tokenAtual);
      }

      // Atualizar a senha no backend
      if (!user?.id) {
        setError('Erro: ID do usuário não encontrado.');
        return;
      }

      const usuariosService = (await import('../services/usuariosService')).default;
      await usuariosService.update(user.id, {
        senha: senha.novaSenha,
      });

      console.log('✅ Senha atualizada com sucesso');

      // Fazer login novamente com a nova senha para atualizar o token
      try {
        await login({
          email: user.email,
          senha: senha.novaSenha,
        });

        // Limpar campos de senha
        setSenha({
          senhaAtual: '',
          novaSenha: '',
          confirmarSenha: '',
        });

        logAction('Senha alterada com sucesso');
        setSuccess(true);
        setError('');
        
        setTimeout(() => {
          setSuccess(false);
        }, 3000);
      } catch (loginError: any) {
        // Se o login falhar, ainda assim a senha foi alterada
        // O usuário precisará fazer login novamente
        setError('Senha alterada com sucesso, mas houve um erro ao atualizar a sessão. Por favor, faça login novamente.');
        setTimeout(() => {
          window.location.href = '/login';
        }, 2000);
      }
    } catch (error: any) {
      console.error('❌ Erro ao alterar senha:', error);
      setError(`Erro ao alterar senha: ${error.message || 'Erro desconhecido'}`);
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

  const handleAvatarChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validar tipo de arquivo
      if (!file.type.startsWith('image/')) {
        setError('Por favor, selecione apenas arquivos de imagem (JPG, PNG, etc.)');
        return;
      }

      // Validar tamanho (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('A imagem deve ter no máximo 5MB');
        return;
      }

      // Criar preview da imagem
      const reader = new FileReader();
      reader.onloadend = async () => {
        const avatarBase64 = reader.result as string;
        setAvatarPreview(avatarBase64);
        setError('');
        logAction('Foto de perfil alterada');
        
        // Salvar no backend
        if (user?.id) {
          try {
            const usuariosService = (await import('../services/usuariosService')).default;
            const updatedUser = await usuariosService.update(user.id, {
              avatar: avatarBase64,
            });

            console.log('✅ Avatar atualizado no backend:', updatedUser);

            // Atualizar no localStorage
            localStorage.setItem('@FGS:userAvatar', avatarBase64);
            
            const storedUser = localStorage.getItem('@FGS:user');
            if (storedUser) {
              const userObj = JSON.parse(storedUser);
              userObj.avatar = avatarBase64;
              localStorage.setItem('@FGS:user', JSON.stringify(userObj));
            }
            
            setSuccess(true);
            setTimeout(() => {
              setSuccess(false);
              // Recarregar a página para atualizar o avatar no sidebar
              window.location.reload();
            }, 1500);
          } catch (error: any) {
            console.error('❌ Erro ao salvar avatar no backend:', error);
            setError('Erro ao salvar foto de perfil. Tente novamente.');
            // Reverter preview em caso de erro
            setAvatarPreview(user?.avatar || null);
          }
        } else {
          // Fallback: salvar apenas no localStorage se não houver user.id
          localStorage.setItem('@FGS:userAvatar', avatarBase64);
          const storedUser = localStorage.getItem('@FGS:user');
          if (storedUser) {
            const userObj = JSON.parse(storedUser);
            userObj.avatar = avatarBase64;
            localStorage.setItem('@FGS:user', JSON.stringify(userObj));
          }
          setSuccess(true);
          setTimeout(() => {
            setSuccess(false);
            window.location.reload();
          }, 1500);
        }
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
          {tabValue === 0 && senha.novaSenha ? 'Senha alterada com sucesso!' : 'Configurações salvas com sucesso!'}
        </Alert>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
          {error}
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
                      value={senha.senhaAtual}
                      onChange={(e) => setSenha({ ...senha, senhaAtual: e.target.value })}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Nova Senha"
                      type="password"
                      value={senha.novaSenha}
                      onChange={(e) => setSenha({ ...senha, novaSenha: e.target.value })}
                      helperText="Mínimo de 6 caracteres"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Confirmar Nova Senha"
                      type="password"
                      value={senha.confirmarSenha}
                      onChange={(e) => setSenha({ ...senha, confirmarSenha: e.target.value })}
                    />
                  </Grid>
                </Grid>

                <Box display="flex" justifyContent="flex-end" gap={2} mt={3}>
                  <Button
                    variant="outlined"
                    onClick={() => {
                      setSenha({
                        senhaAtual: '',
                        novaSenha: '',
                        confirmarSenha: '',
                      });
                      setError('');
                    }}
                  >
                    Cancelar
                  </Button>
                  <Button
                    variant="contained"
                    startIcon={<SaveIcon />}
                    onClick={handleAlterarSenha}
                    disabled={!senha.senhaAtual || !senha.novaSenha || !senha.confirmarSenha}
                    sx={{
                      background: 'linear-gradient(135deg, #a2122a 0%, #354a80 100%)',
                    }}
                  >
                    Alterar Senha
                  </Button>
                </Box>

                <Divider sx={{ my: 3 }} />

                <Box display="flex" justifyContent="flex-end" gap={2}>
                  <Button
                    variant="contained"
                    startIcon={<SaveIcon />}
                    onClick={handleSave}
                    sx={{
                      background: 'linear-gradient(135deg, #a2122a 0%, #354a80 100%)',
                    }}
                  >
                    Salvar Informações Pessoais
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

