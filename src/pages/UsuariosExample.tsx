import React, { useState } from 'react';
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
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import SaveIcon from '@mui/icons-material/Save';
import {
  PageHeader,
  GradientButton,
  AnimatedCard,
  ActionButton,
  SkeletonTable,
  LoaderFGS,
  AnimatedModal,
} from '../components';
import { RoleBadge } from '../components/RoleBadge';
import { useNavigationLog } from '../hooks/useNavigationLog';
import { useNotification } from '../hooks/useNotification';
import { UserRole, User } from '../types';

export const Usuarios: React.FC = () => {
  const { logAction } = useNavigationLog();
  const { showSuccess, showError, showWarning, showInfo } = useNotification();
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null);

  const [users] = useState<User[]>([
    {
      id: '1',
      nome: 'Admin Sistema',
      email: 'admin@fgs.com',
      role: UserRole.ADMINISTRADOR,
      departamento: 'TI',
      cargo: 'Administrador do Sistema',
    },
    {
      id: '2',
      nome: 'Maria Silva',
      email: 'maria@fgs.com',
      role: UserRole.RH,
      departamento: 'Recursos Humanos',
      cargo: 'Analista de RH',
    },
    {
      id: '3',
      nome: 'João Santos',
      email: 'joao@fgs.com',
      role: UserRole.GESTOR,
      departamento: 'Vendas',
      cargo: 'Gerente de Vendas',
    },
  ]);

  const filteredUsers = users.filter(
    (user) =>
      user.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddUser = () => {
    setEditUser(null);
    setDialogOpen(true);
    logAction('Abrir modal de adicionar usuário');
    showInfo('Preencha os dados do novo usuário');
  };

  const handleEditUser = (user: User) => {
    setEditUser(user);
    setDialogOpen(true);
    logAction(`Editar usuário ${user.id}`);
    showInfo(`Editando: ${user.nome}`);
  };

  const handleSaveUser = () => {
    setLoading(true);
    
    // Simula salvamento
    setTimeout(() => {
      setLoading(false);
      setDialogOpen(false);
      
      if (editUser) {
        showSuccess('✅ Usuário atualizado com sucesso!');
        logAction(`Usuário ${editUser.id} atualizado`);
      } else {
        showSuccess('✅ Novo usuário criado com sucesso!');
        logAction('Novo usuário criado');
      }
    }, 1500);
  };

  const handleDeleteUser = (user: User) => {
    logAction(`Tentar excluir usuário ${user.id}`);
    showWarning(`⚠️ Tem certeza que deseja excluir ${user.nome}?`);
    
    // Simula exclusão após confirmação
    setTimeout(() => {
      showError(`🗑️ Usuário ${user.nome} foi removido`);
    }, 2000);
  };

  return (
    <Box>
      <PageHeader
        title="Gestão de Usuários"
        subtitle="Gerencie os usuários e suas permissões no sistema"
        breadcrumbs={[
          { label: 'Home', path: '/dashboard' },
          { label: 'Usuários' },
        ]}
        action={
          <GradientButton
            startIcon={<AddIcon />}
            onClick={handleAddUser}
            gradient="primary"
          >
            Adicionar Usuário
          </GradientButton>
        }
      />

      <AnimatedCard>
        <CardContent>
          <Box mb={3}>
            <TextField
              fullWidth
              placeholder="Buscar por nome ou email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          {loading ? (
            <SkeletonTable rows={5} columns={6} />
          ) : (
            <>
              <TableContainer component={Paper} elevation={0}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Usuário</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell>Departamento</TableCell>
                      <TableCell>Cargo</TableCell>
                      <TableCell>Perfil</TableCell>
                      <TableCell align="center">Ações</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredUsers.map((user, index) => (
                      <TableRow
                        key={user.id}
                        hover
                        sx={{
                          animation: `fadeInRow 0.3s ease-out ${index * 0.05}s both`,
                          '@keyframes fadeInRow': {
                            from: {
                              opacity: 0,
                              transform: 'translateX(-10px)',
                            },
                            to: {
                              opacity: 1,
                              transform: 'translateX(0)',
                            },
                          },
                        }}
                      >
                        <TableCell>
                          <Box display="flex" alignItems="center" gap={2}>
                            <Avatar
                              sx={{
                                bgcolor: 'primary.main',
                                width: 40,
                                height: 40,
                              }}
                            >
                              {user.nome.charAt(0).toUpperCase()}
                            </Avatar>
                            <Typography variant="body2" fontWeight={600}>
                              {user.nome}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.departamento}</TableCell>
                        <TableCell>{user.cargo}</TableCell>
                        <TableCell>
                          <RoleBadge role={user.role} />
                        </TableCell>
                        <TableCell align="center">
                          <Box display="flex" gap={0.5} justifyContent="center">
                            <ActionButton
                              action="edit"
                              onClick={() => handleEditUser(user)}
                              tooltip="Editar usuário"
                            />
                            <ActionButton
                              action="delete"
                              onClick={() => handleDeleteUser(user)}
                              tooltip="Excluir usuário"
                            />
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              <Box
                mt={3}
                pt={2}
                borderTop={1}
                borderColor="divider"
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography variant="body2" color="text.secondary">
                  Mostrando <strong>{filteredUsers.length}</strong> de{' '}
                  <strong>{users.length}</strong> usuários
                </Typography>
              </Box>
            </>
          )}
        </CardContent>
      </AnimatedCard>

      {/* Modal Animado */}
      <AnimatedModal
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {editUser ? 'Editar Usuário' : 'Novo Usuário'}
        </DialogTitle>
        <DialogContent>
          {loading ? (
            <LoaderFGS message="Salvando..." fullScreen={false} />
          ) : (
            <Box mt={2} display="flex" flexDirection="column" gap={2}>
              <TextField
                label="Nome Completo"
                defaultValue={editUser?.nome}
                fullWidth
              />
              <TextField
                label="Email"
                defaultValue={editUser?.email}
                fullWidth
              />
              <TextField
                label="Departamento"
                defaultValue={editUser?.departamento}
                fullWidth
              />
              <TextField
                label="Cargo"
                defaultValue={editUser?.cargo}
                fullWidth
              />
              <FormControl fullWidth>
                <InputLabel>Perfil</InputLabel>
                <Select defaultValue={editUser?.role || UserRole.COLABORADOR}>
                  <MenuItem value={UserRole.ADMINISTRADOR}>Administrador</MenuItem>
                  <MenuItem value={UserRole.RH}>RH</MenuItem>
                  <MenuItem value={UserRole.GESTOR}>Gestor</MenuItem>
                  <MenuItem value={UserRole.COLABORADOR}>Colaborador</MenuItem>
                </Select>
              </FormControl>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <GradientButton
            gradient="secondary"
            onClick={() => setDialogOpen(false)}
            disabled={loading}
          >
            Cancelar
          </GradientButton>
          <GradientButton
            startIcon={<SaveIcon />}
            onClick={handleSaveUser}
            loading={loading}
          >
            Salvar
          </GradientButton>
        </DialogActions>
      </AnimatedModal>
    </Box>
  );
};

