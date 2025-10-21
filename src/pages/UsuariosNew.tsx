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
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import {
  PageHeader,
  GradientButton,
  AnimatedCard,
  ActionButton,
  SkeletonTable,
} from '../components';
import { RoleBadge } from '../components/RoleBadge';
import { useNavigationLog } from '../hooks/useNavigationLog';
import { UserRole, User } from '../types';

export const Usuarios: React.FC = () => {
  const { logAction } = useNavigationLog();
  const [searchTerm, setSearchTerm] = useState('');

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
    {
      id: '4',
      nome: 'Ana Costa',
      email: 'ana@fgs.com',
      role: UserRole.COLABORADOR,
      departamento: 'Operações',
      cargo: 'Assistente',
    },
    {
      id: '5',
      nome: 'Pedro Oliveira',
      email: 'pedro@fgs.com',
      role: UserRole.COLABORADOR,
      departamento: 'Vendas',
      cargo: 'Vendedor',
    },
  ]);

  const filteredUsers = users.filter(
    (user) =>
      user.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.departamento?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddUser = () => {
    logAction('Botão Adicionar Usuário clicado');
    alert('Funcionalidade de adicionar usuário será implementada');
  };

  const handleEditUser = (userId: string) => {
    logAction(`Editar usuário ${userId}`);
    alert(`Editar usuário ${userId}`);
  };

  const handleDeleteUser = (userId: string) => {
    logAction(`Excluir usuário ${userId}`);
    if (confirm('Tem certeza que deseja excluir este usuário?')) {
      alert(`Usuário ${userId} excluído`);
    }
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
            />
          </Box>

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
                              onClick={() => handleEditUser(user.id)}
                            />
                            <ActionButton
                              action="delete"
                              onClick={() => handleDeleteUser(user.id)}
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
                <Box display="flex" gap={1}>
                  <GradientButton
                    size="small"
                    gradient="secondary"
                    startIcon={<SearchIcon />}
                  >
                    Filtros Avançados
                  </GradientButton>
                </Box>
              </Box>
        </CardContent>
      </AnimatedCard>
    </Box>
  );
};

