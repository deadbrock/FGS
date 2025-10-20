import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  Tooltip,
  InputBase,
  Badge,
  alpha,
  Fade,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import FolderSharedIcon from '@mui/icons-material/FolderShared';
import SchoolIcon from '@mui/icons-material/School';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import CampaignIcon from '@mui/icons-material/Campaign';
import AssessmentIcon from '@mui/icons-material/Assessment';
import SecurityIcon from '@mui/icons-material/Security';
import IntegrationInstructionsIcon from '@mui/icons-material/IntegrationInstructions';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsIcon from '@mui/icons-material/Notifications';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { Logo } from '../components/Logo';
import { RoleBadge } from '../components/RoleBadge';
import { useAuth } from '../hooks/useAuth';
import { useNavigationLog } from '../hooks/useNavigationLog';
import { useTheme } from '../hooks/useTheme';
import { UserRole } from '../types';

const DRAWER_WIDTH = 280;

interface MenuItem {
  title: string;
  path: string;
  icon: React.ReactNode;
  allowedRoles?: UserRole[];
}

const menuItems: MenuItem[] = [
  {
    title: 'Dashboard',
    path: '/dashboard',
    icon: <DashboardIcon />,
  },
  {
    title: 'Usuários',
    path: '/usuarios',
    icon: <PeopleIcon />,
    allowedRoles: [UserRole.ADMINISTRADOR, UserRole.RH],
  },
  {
    title: 'Prontuário',
    path: '/prontuario',
    icon: <FolderSharedIcon />,
    allowedRoles: [UserRole.ADMINISTRADOR, UserRole.RH, UserRole.GESTOR],
  },
  {
    title: 'Treinamentos',
    path: '/treinamentos',
    icon: <SchoolIcon />,
    allowedRoles: [UserRole.ADMINISTRADOR, UserRole.RH, UserRole.GESTOR],
  },
  {
    title: 'Ponto e Frequência',
    path: '/ponto',
    icon: <AccessTimeIcon />,
    allowedRoles: [UserRole.ADMINISTRADOR, UserRole.RH, UserRole.GESTOR],
  },
  {
    title: 'Benefícios',
    path: '/beneficios',
    icon: <CardGiftcardIcon />,
    allowedRoles: [UserRole.ADMINISTRADOR, UserRole.RH, UserRole.GESTOR],
  },
  {
    title: 'Comunicação',
    path: '/comunicacao',
    icon: <CampaignIcon />,
    allowedRoles: [UserRole.ADMINISTRADOR, UserRole.RH, UserRole.GESTOR],
  },
  {
    title: 'Relatórios',
    path: '/relatorios',
    icon: <AssessmentIcon />,
    allowedRoles: [UserRole.ADMINISTRADOR, UserRole.RH, UserRole.GESTOR],
  },
  {
    title: 'Segurança',
    path: '/seguranca',
    icon: <SecurityIcon />,
    allowedRoles: [UserRole.ADMINISTRADOR],
  },
  {
    title: 'Integrações',
    path: '/integracoes',
    icon: <IntegrationInstructionsIcon />,
    allowedRoles: [UserRole.ADMINISTRADOR],
  },
  {
    title: 'Configurações',
    path: '/configuracoes',
    icon: <SettingsIcon />,
    allowedRoles: [UserRole.ADMINISTRADOR],
  },
];

// Layout principal do dashboard
export const DashboardLayout: React.FC = () => {
  const [drawerOpen, setDrawerOpen] = useState(true);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [notifAnchorEl, setNotifAnchorEl] = useState<null | HTMLElement>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const { logAction } = useNavigationLog();
  const { mode, toggleTheme } = useTheme();

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
    logAction(drawerOpen ? 'Menu fechado' : 'Menu aberto');
  };

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNotifMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setNotifAnchorEl(event.currentTarget);
  };

  const handleNotifMenuClose = () => {
    setNotifAnchorEl(null);
  };

  const handleLogout = () => {
    logAction('Logout realizado');
    logout();
    navigate('/login');
  };

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  // Filtra itens do menu baseado no role do usuário
  const filteredMenuItems = menuItems.filter((item) => {
    if (!item.allowedRoles || !user) return true;
    return item.allowedRoles.includes(user.role);
  });

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* AppBar */}
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          width: drawerOpen ? `calc(100% - ${DRAWER_WIDTH}px)` : '100%',
          ml: drawerOpen ? `${DRAWER_WIDTH}px` : 0,
          transition: 'all 0.3s ease',
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="toggle drawer"
            onClick={toggleDrawer}
            edge="start"
            sx={{ mr: 2 }}
          >
            {drawerOpen ? <ChevronLeftIcon /> : <MenuIcon />}
          </IconButton>

          <Logo size="small" showText={false} />

          {/* Campo de Busca */}
          <Box
            sx={{
              position: 'relative',
              borderRadius: 2,
              backgroundColor: (theme) => alpha(theme.palette.common.white, 0.15),
              '&:hover': {
                backgroundColor: (theme) => alpha(theme.palette.common.white, 0.25),
              },
              marginLeft: 4,
              marginRight: 2,
              width: 'auto',
              maxWidth: 400,
              display: { xs: 'none', md: 'flex' },
            }}
          >
            <Box
              sx={{
                padding: (theme) => theme.spacing(0, 2),
                height: '100%',
                position: 'absolute',
                pointerEvents: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <SearchIcon />
            </Box>
            <InputBase
              placeholder="Buscar..."
              inputProps={{ 'aria-label': 'search' }}
              sx={{
                color: 'inherit',
                '& .MuiInputBase-input': {
                  padding: (theme) => theme.spacing(1, 1, 1, 0),
                  paddingLeft: `calc(1em + ${40}px)`,
                  transition: 'width 0.3s',
                  width: '100%',
                  minWidth: 200,
                },
              }}
            />
          </Box>

          <Box sx={{ flexGrow: 1 }} />

          {/* Ícones de Ação */}
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            {/* Toggle Tema */}
            <Tooltip title={mode === 'dark' ? 'Modo Claro' : 'Modo Escuro'}>
              <IconButton color="inherit" onClick={toggleTheme}>
                {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
              </IconButton>
            </Tooltip>

            {/* Notificações */}
            <Tooltip title="Notificações">
              <IconButton color="inherit" onClick={handleNotifMenuOpen}>
                <Badge badgeContent={3} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
            </Tooltip>

            {/* Avatar do Usuário */}
            <Tooltip title="Perfil">
              <IconButton onClick={handleProfileMenuOpen} sx={{ p: 0, ml: 2 }}>
                <Avatar
                  sx={{
                    bgcolor: '#a2122a',
                    width: 40,
                    height: 40,
                    border: '2px solid',
                    borderColor: 'divider',
                  }}
                >
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </Avatar>
              </IconButton>
            </Tooltip>
          </Box>

          {/* Menu de Perfil */}
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleProfileMenuClose}
            TransitionComponent={Fade}
            PaperProps={{
              sx: {
                mt: 1.5,
                minWidth: 240,
                borderRadius: 2,
              },
            }}
          >
            <Box sx={{ px: 2, py: 1.5 }}>
              <Typography variant="subtitle1" fontWeight={600}>
                {user?.name || 'Usuário'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {user?.email || 'email@exemplo.com'}
              </Typography>
              <Box mt={1}>
                <RoleBadge role={user?.role || UserRole.COLABORADOR} />
              </Box>
            </Box>
            <Divider />
            <MenuItem onClick={handleProfileMenuClose}>
              <ListItemIcon>
                <AccountCircleIcon fontSize="small" />
              </ListItemIcon>
              Meu Perfil
            </MenuItem>
            <MenuItem onClick={handleProfileMenuClose}>
              <ListItemIcon>
                <SettingsIcon fontSize="small" />
              </ListItemIcon>
              Configurações
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <LogoutIcon fontSize="small" />
              </ListItemIcon>
              Sair
            </MenuItem>
          </Menu>

          {/* Menu de Notificações */}
          <Menu
            anchorEl={notifAnchorEl}
            open={Boolean(notifAnchorEl)}
            onClose={handleNotifMenuClose}
            TransitionComponent={Fade}
            PaperProps={{
              sx: {
                mt: 1.5,
                minWidth: 320,
                maxWidth: 400,
                borderRadius: 2,
              },
            }}
          >
            <Box sx={{ px: 2, py: 1.5 }}>
              <Typography variant="h6" fontWeight={600}>
                Notificações
              </Typography>
            </Box>
            <Divider />
            <MenuItem onClick={handleNotifMenuClose}>
              <Box>
                <Typography variant="body2" fontWeight={600}>
                  Novo treinamento disponível
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Há 5 minutos
                </Typography>
              </Box>
            </MenuItem>
            <MenuItem onClick={handleNotifMenuClose}>
              <Box>
                <Typography variant="body2" fontWeight={600}>
                  Atestado aprovado
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Há 1 hora
                </Typography>
              </Box>
            </MenuItem>
            <MenuItem onClick={handleNotifMenuClose}>
              <Box>
                <Typography variant="body2" fontWeight={600}>
                  Lembrete: Reunião às 15h
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Há 2 horas
                </Typography>
              </Box>
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleNotifMenuClose} sx={{ justifyContent: 'center' }}>
              <Typography variant="body2" color="primary" fontWeight={600}>
                Ver todas
              </Typography>
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      {/* Drawer/Sidebar */}
      <Drawer
        variant="permanent"
        open={drawerOpen}
        sx={{
          width: drawerOpen ? DRAWER_WIDTH : 0,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: DRAWER_WIDTH,
            boxSizing: 'border-box',
            transform: drawerOpen ? 'translateX(0)' : `translateX(-${DRAWER_WIDTH}px)`,
            transition: 'transform 0.3s ease',
          },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto', p: 1, mt: 2 }}>
          <List>
            {filteredMenuItems.map((item) => (
              <ListItem key={item.path} disablePadding>
                <ListItemButton
                  selected={location.pathname === item.path}
                  onClick={() => handleNavigate(item.path)}
                >
                  <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
                  <ListItemText
                    primary={item.title}
                    primaryTypographyProps={{
                      fontWeight: location.pathname === item.path ? 600 : 400,
                    }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>

      {/* Conteúdo Principal */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: drawerOpen ? `calc(100% - ${DRAWER_WIDTH}px)` : '100%',
          ml: drawerOpen ? 0 : `-${DRAWER_WIDTH}px`,
          transition: 'all 0.3s ease',
          minHeight: '100vh',
        }}
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
};

