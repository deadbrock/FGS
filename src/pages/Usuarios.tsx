import React, { useState, useEffect } from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  InputAdornment,
  Avatar,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  MenuItem,
  Alert,
  CircularProgress,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import {
  PageHeader,
  GradientButton,
  AnimatedCard,
  ActionButton,
  SkeletonTable,
} from '../components';
import { RoleBadge } from '../components/RoleBadge';
import { useNavigationLog } from '../hooks/useNavigationLog';
import { useAuth } from '../hooks/useAuth';
import { UserRole, User } from '../types';
import usuariosService, { CreateUsuarioDTO, UpdateUsuarioDTO } from '../services/usuariosService';

interface FormData {
  nome: string;
  email: string;
  senha: string;
  role: UserRole;
  cargo: string;
  departamento: string;
}

const initialFormData: FormData = {
  nome: '',
  email: '',
  senha: '',
  role: UserRole.COLABORADOR,
  cargo: '',
  departamento: '',
};

export const Usuarios: React.FC = () => {
  const { logAction } = useNavigationLog();
  const { user: currentUser } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // Carregar usuários
  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await usuariosService.getAll();
      setUsers(data);
    } catch (err) {
      console.error('Erro ao carregar usuários:', err);
      setError('Erro ao carregar usuários. Verifique se o backend está rodando.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  // Filtrar usuários
  const filteredUsers = users.filter(
    (user) =>
      user.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.departamento?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Abrir dialog para adicionar
  const handleAddUser = () => {
    logAction('Botão Adicionar Usuário clicado');
    setEditingUser(null);
    setFormData(initialFormData);
    setError('');
    setDialogOpen(true);
  };

  // Abrir dialog para editar
  const handleEditUser = (user: User) => {
    logAction(`Editar usuário ${user.id}`);
    setEditingUser(user);
    setFormData({
      nome: user.nome,
      email: user.email,
      senha: '', // Não preencher senha ao editar
      role: user.role,
      cargo: user.cargo || '',
      departamento: user.departamento || '',
    });
    setError('');
    setDialogOpen(true);
  };

  // Deletar usuário
  const handleDeleteUser = async (user: User) => {
    if (user.email === 'admin@fgs.com') {
      alert('Não é possível deletar o administrador principal do sistema.');
      return;
    }

    if (!confirm(`Tem certeza que deseja excluir o usuário ${user.nome}?`)) {
      return;
    }

    try {
      logAction(`Excluir usuário ${user.id}`);
      await usuariosService.delete(user.id);
      await loadUsers();
      alert('Usuário excluído com sucesso!');
    } catch (err: any) {
      alert(err.message || 'Erro ao excluir usuário');
    }
  };

  // Salvar usuário (criar ou editar)
  const handleSave = async () => {
    // Validações
    if (!formData.nome || !formData.email || !formData.role) {
      setError('Preencha os campos obrigatórios: Nome, Email e Perfil');
      return;
    }

    if (!editingUser && !formData.senha) {
      setError('A senha é obrigatória ao criar um novo usuário');
      return;
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Email inválido');
      return;
    }

    // Validar senha (mínimo 6 caracteres se estiver criando ou alterando)
    if (formData.senha && formData.senha.length < 6) {
      setError('A senha deve ter no mínimo 6 caracteres');
      return;
    }

    try {
      setSaving(true);
      setError('');

      if (editingUser) {
        // Atualizar
        const updateData: UpdateUsuarioDTO = {
          nome: formData.nome,
          email: formData.email,
          role: formData.role,
          cargo: formData.cargo || undefined,
          departamento: formData.departamento || undefined,
        };

        // Só enviar senha se foi preenchida
        if (formData.senha) {
          updateData.senha = formData.senha;
        }

        await usuariosService.update(editingUser.id, updateData);
        logAction(`Usuário ${editingUser.id} atualizado`);
        alert('Usuário atualizado com sucesso!');
      } else {
        // Criar
        const createData: CreateUsuarioDTO = {
          nome: formData.nome,
          email: formData.email,
          senha: formData.senha,
          role: formData.role,
          cargo: formData.cargo || undefined,
          departamento: formData.departamento || undefined,
        };

        await usuariosService.create(createData);
        logAction('Novo usuário criado');
        alert('Usuário criado com sucesso!');
      }

      setDialogOpen(false);
      await loadUsers();
    } catch (err: any) {
      setError(err.message || 'Erro ao salvar usuário');
    } finally {
      setSaving(false);
    }
  };

  // Verificar se o usuário atual é administrador
  const isAdmin = currentUser?.role === UserRole.ADMINISTRADOR;

  return (
    <Box>
      <PageHeader
        title="Gestão de Usuários"
        subtitle="Gerencie os usuários do sistema e suas permissões"
      />

      {error && !dialogOpen && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <AnimatedCard delay={0.1}>
        <Box sx={{ p: 3 }}>
          <Box
            sx={{
              display: 'flex',
              gap: 2,
              mb: 3,
              flexDirection: { xs: 'column', sm: 'row' },
            }}
          >
            <TextField
              placeholder="Buscar por nome, email ou departamento..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              sx={{ flex: 1 }}
            />
            {isAdmin && (
              <GradientButton
                startIcon={<AddIcon />}
                onClick={handleAddUser}
                sx={{ minWidth: { xs: '100%', sm: 200 } }}
              >
                Novo Usuário
              </GradientButton>
            )}
          </Box>

          {loading ? (
            <SkeletonTable rows={5} columns={5} />
          ) : filteredUsers.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                {searchTerm ? 'Nenhum usuário encontrado' : 'Nenhum usuário cadastrado'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {searchTerm
                  ? 'Tente buscar com outros termos'
                  : isAdmin
                  ? 'Clique em "Novo Usuário" para começar'
                  : 'Entre em contato com o administrador'}
              </Typography>
            </Box>
          ) : (
            <TableContainer component={Paper} elevation={0}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Usuário</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Perfil</TableCell>
                    <TableCell>Cargo</TableCell>
                    <TableCell>Departamento</TableCell>
                    {isAdmin && <TableCell align="center">Ações</TableCell>}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id} hover>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Avatar
                            src={user.avatar}
                            sx={{
                              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                            }}
                          >
                            {user.nome.charAt(0)}
                          </Avatar>
                          <Typography variant="body2" fontWeight={600}>
                            {user.nome}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <RoleBadge role={user.role || UserRole.COLABORADOR} />
                      </TableCell>
                      <TableCell>{user.cargo || '-'}</TableCell>
                      <TableCell>{user.departamento || '-'}</TableCell>
                      {isAdmin && (
                        <TableCell>
                          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                            <ActionButton
                              icon={<EditIcon />}
                              tooltip="Editar"
                              onClick={() => handleEditUser(user)}
                            />
                            {user.email !== 'admin@fgs.com' && (
                              <ActionButton
                                icon={<DeleteIcon />}
                                tooltip="Excluir"
                                onClick={() => handleDeleteUser(user)}
                                color="#d32f2f"
                              />
                            )}
                          </Box>
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Box>
      </AnimatedCard>

      {/* Dialog de Criar/Editar */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingUser ? 'Editar Usuário' : 'Novo Usuário'}
        </DialogTitle>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <TextField
            label="Nome Completo *"
            fullWidth
            margin="normal"
            value={formData.nome}
            onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
          />

          <TextField
            label="Email *"
            type="email"
            fullWidth
            margin="normal"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />

          <TextField
            label={editingUser ? 'Nova Senha (deixe vazio para manter)' : 'Senha *'}
            type="password"
            fullWidth
            margin="normal"
            value={formData.senha}
            onChange={(e) => setFormData({ ...formData, senha: e.target.value })}
            helperText="Mínimo 6 caracteres"
          />

          <TextField
            label="Perfil de Acesso *"
            select
            fullWidth
            margin="normal"
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
          >
            <MenuItem value={UserRole.ADMINISTRADOR}>Administrador</MenuItem>
            <MenuItem value={UserRole.RH}>RH</MenuItem>
            <MenuItem value={UserRole.GESTOR}>Gestor</MenuItem>
            <MenuItem value={UserRole.COLABORADOR}>Colaborador</MenuItem>
            <MenuItem value={UserRole.SEGURANCA_TRABALHO}>Segurança do Trabalho</MenuItem>
          </TextField>

          <TextField
            label="Cargo"
            fullWidth
            margin="normal"
            value={formData.cargo}
            onChange={(e) => setFormData({ ...formData, cargo: e.target.value })}
          />

          <TextField
            label="Departamento *"
            select
            fullWidth
            margin="normal"
            value={formData.departamento}
            onChange={(e) => setFormData({ ...formData, departamento: e.target.value })}
          >
            <MenuItem value="Recursos Humanos">Recursos Humanos</MenuItem>
            <MenuItem value="Departamento Pessoal">Departamento Pessoal</MenuItem>
            <MenuItem value="Segurança do Trabalho">Segurança do Trabalho</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)} disabled={saving}>
            Cancelar
          </Button>
          <GradientButton onClick={handleSave} disabled={saving}>
            {saving ? <CircularProgress size={24} /> : editingUser ? 'Salvar' : 'Criar'}
          </GradientButton>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
