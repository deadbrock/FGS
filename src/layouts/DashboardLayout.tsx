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
import PublicIcon from '@mui/icons-material/Public';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsIcon from '@mui/icons-material/Notifications';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { Logo } from '../components/Logo';
import { RoleBadge } from '../components/RoleBadge';
import { PageTransition } from '../components/PageTransition';
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
    allowedRoles: [UserRole.ADMINISTRADOR, UserRole.RH, UserRole.GESTOR, UserRole.SEGURANCA_TRABALHO],
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
    title: 'Regionais',
    path: '/regionais',
    icon: <PublicIcon />,
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
      {/* AppBar Moderno */}
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          width: drawerOpen ? `calc(100% - ${DRAWER_WIDTH}px)` : '100%',
          ml: drawerOpen ? `${DRAWER_WIDTH}px` : 0,
          transition: 'all 0.3s ease',
          background: (theme) => 
            mode === 'dark'
              ? 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)'
              : 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
          color: (theme) => theme.palette.text.primary,
          borderBottom: (theme) => `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          backdropFilter: 'blur(10px)',
          boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
        }}
      >
        <Toolbar sx={{ py: 1 }}>
          <IconButton
            color="inherit"
            aria-label="toggle drawer"
            onClick={toggleDrawer}
            edge="start"
            sx={{ 
              mr: 2,
              background: (theme) => alpha(theme.palette.primary.main, 0.1),
              '&:hover': {
                background: (theme) => alpha(theme.palette.primary.main, 0.2),
                transform: 'rotate(180deg)',
              },
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          >
            {drawerOpen ? <ChevronLeftIcon /> : <MenuIcon />}
          </IconButton>

          <Logo size="small" showText={false} />

          {/* Campo de Busca Moderno */}
          <Box
            sx={{
              position: 'relative',
              borderRadius: 3,
              backgroundColor: (theme) => 
                mode === 'dark' 
                  ? alpha(theme.palette.common.white, 0.05)
                  : alpha(theme.palette.grey[500], 0.08),
              border: (theme) => `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              '&:hover': {
                backgroundColor: (theme) => 
                  mode === 'dark'
                    ? alpha(theme.palette.common.white, 0.08)
                    : alpha(theme.palette.grey[500], 0.12),
                boxShadow: `0 4px 12px ${alpha('#6366f1', 0.1)}`,
              },
              '&:focus-within': {
                backgroundColor: (theme) => 
                  mode === 'dark'
                    ? alpha(theme.palette.common.white, 0.1)
                    : alpha(theme.palette.grey[500], 0.15),
                border: (theme) => `1px solid ${theme.palette.primary.main}`,
                boxShadow: `0 4px 16px ${alpha('#6366f1', 0.2)}`,
              },
              marginLeft: 4,
              marginRight: 2,
              width: 'auto',
              maxWidth: 400,
              display: { xs: 'none', md: 'flex' },
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
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
                color: 'text.secondary',
              }}
            >
              <SearchIcon />
            </Box>
            <InputBase
              placeholder="Buscar no sistema..."
              inputProps={{ 'aria-label': 'search' }}
              sx={{
                color: 'inherit',
                width: '100%',
                '& .MuiInputBase-input': {
                  padding: (theme) => theme.spacing(1.5, 2, 1.5, 0),
                  paddingLeft: `calc(1em + ${40}px)`,
                  transition: 'width 0.3s',
                  width: '100%',
                  minWidth: 250,
                  fontSize: '0.95rem',
                  '&::placeholder': {
                    opacity: 0.7,
                  },
                },
              }}
            />
          </Box>

          <Box sx={{ flexGrow: 1 }} />

          {/* Ícones de Ação Modernos */}
          <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
            {/* Toggle Tema */}
            <Tooltip title={mode === 'dark' ? 'Modo Claro' : 'Modo Escuro'} arrow>
              <IconButton 
                color="inherit" 
                onClick={toggleTheme}
                sx={{
                  background: (theme) => alpha(theme.palette.primary.main, 0.1),
                  '&:hover': {
                    background: (theme) => alpha(theme.palette.primary.main, 0.2),
                    transform: 'rotate(180deg)',
                  },
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
              >
                {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
              </IconButton>
            </Tooltip>

            {/* Notificações */}
            <Tooltip title="Notificações" arrow>
              <IconButton 
                color="inherit" 
                onClick={handleNotifMenuOpen}
                sx={{
                  background: (theme) => alpha(theme.palette.primary.main, 0.1),
                  '&:hover': {
                    background: (theme) => alpha(theme.palette.primary.main, 0.2),
                  },
                  transition: 'all 0.3s',
                }}
              >
                <Badge 
                  badgeContent={3} 
                  color="error"
                  sx={{
                    '& .MuiBadge-badge': {
                      animation: 'pulse 2s infinite',
                      '@keyframes pulse': {
                        '0%': {
                          transform: 'scale(1)',
                          boxShadow: '0 0 0 0 rgba(239, 68, 68, 0.7)',
                        },
                        '50%': {
                          transform: 'scale(1.1)',
                          boxShadow: '0 0 0 4px rgba(239, 68, 68, 0)',
                        },
                        '100%': {
                          transform: 'scale(1)',
                          boxShadow: '0 0 0 0 rgba(239, 68, 68, 0)',
                        },
                      },
                    },
                  }}
                >
                  <NotificationsIcon />
                </Badge>
              </IconButton>
            </Tooltip>

            {/* Avatar do Usuário */}
            <Tooltip title="Perfil" arrow>
              <IconButton 
                onClick={handleProfileMenuOpen} 
                sx={{ 
                  p: 0, 
                  ml: 1,
                  transition: 'all 0.3s',
                  '&:hover': {
                    transform: 'scale(1.1)',
                  },
                }}
              >
                <Avatar
                  sx={{
                    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                    width: 42,
                    height: 42,
                    fontWeight: 700,
                    boxShadow: '0 4px 16px rgba(99, 102, 241, 0.4)',
                    border: '2px solid',
                    borderColor: 'background.paper',
                  }}
                >
                  {user?.nome?.charAt(0).toUpperCase() || 'U'}
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
                {user?.nome || 'Usuário'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {user?.email || 'email@exemplo.com'}
              </Typography>
              <Box mt={1}>
                <RoleBadge role={user?.role || UserRole.COLABORADOR} />
              </Box>
            </Box>
            <Divider />
            <MenuItem
              onClick={() => {
                handleProfileMenuClose();
                handleNavigate('/configuracoes');
              }}
            >
              <ListItemIcon>
                <AccountCircleIcon fontSize="small" />
              </ListItemIcon>
              Meu Perfil
            </MenuItem>
            <MenuItem
              onClick={() => {
                handleProfileMenuClose();
                handleNavigate('/configuracoes');
              }}
            >
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

      {/* Drawer/Sidebar Moderna */}
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
            background: (theme) => 
              mode === 'dark' 
                ? 'linear-gradient(180deg, #1e293b 0%, #0f172a 100%)'
                : 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)',
            borderRight: (theme) => 
              `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            boxShadow: '4px 0 24px rgba(0,0,0,0.05)',
          },
        }}
      >
        <Toolbar sx={{ minHeight: '48px !important', height: '48px' }} />
        <Box sx={{ overflowY: 'auto', overflowX: 'hidden', px: 2, pb: 2, pt: 6, height: '100%', display: 'flex', flexDirection: 'column' }}>
          {/* Foto do Usuário - Ocupando espaço da Toolbar */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              mb: 1,
              position: 'relative',
              mt: -5,
              overflow: 'visible',
            }}
          >
            <Box
              sx={{
                position: 'relative',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  inset: -4,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #6366f1, #8b5cf6, #ec4899)',
                  opacity: 0.8,
                  zIndex: 0,
                  animation: 'pulse 2s ease-in-out infinite',
                },
                '@keyframes pulse': {
                  '0%, 100%': { opacity: 0.8 },
                  '50%': { opacity: 1 },
                },
              }}
            >
              <Avatar
                src={user?.avatar}
                alt={user?.nome}
                sx={{
                  width: 100,
                  height: 100,
                  border: '4px solid',
                  borderColor: 'background.paper',
                  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                  fontSize: '2.5rem',
                  fontWeight: 700,
                  boxShadow: '0 8px 24px rgba(99, 102, 241, 0.5)',
                  position: 'relative',
                  zIndex: 1,
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  cursor: 'pointer',
                  '&:hover': {
                    transform: 'scale(1.05)',
                    boxShadow: '0 12px 32px rgba(99, 102, 241, 0.6)',
                  },
                }}
              >
                {!user?.avatar && user?.nome.charAt(0).toUpperCase()}
              </Avatar>
            </Box>
          </Box>

          {/* Seção do Usuário - Card com informações */}
          <Box
            sx={{
              mb: 2,
              p: 1.5,
              borderRadius: 3,
              mt: -1,
              background: (theme) =>
                mode === 'dark'
                  ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)'
                  : 'linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, rgba(139, 92, 246, 0.05) 100%)',
              border: (theme) =>
                `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 0.5,
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '3px',
                background: 'linear-gradient(90deg, #6366f1, #8b5cf6)',
              },
            }}
          >
            <Typography variant="subtitle2" fontWeight={700} textAlign="center">
              {user?.nome}
            </Typography>
            <RoleBadge role={user?.role || UserRole.COLABORADOR} />
          </Box>

          {/* Lista de Menu */}
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="caption"
              sx={{
                px: 1,
                pb: 1,
                display: 'block',
                fontWeight: 700,
                letterSpacing: '0.5px',
                textTransform: 'uppercase',
                color: 'text.secondary',
                fontSize: '0.7rem',
              }}
            >
              Menu Principal
            </Typography>
            <List sx={{ px: 0 }}>
              {filteredMenuItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <ListItem key={item.path} disablePadding sx={{ mb: 0.5 }}>
                    <ListItemButton
                      selected={isActive}
                      onClick={() => handleNavigate(item.path)}
                      sx={{
                        borderRadius: 2,
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        position: 'relative',
                        overflow: 'hidden',
                        '&.Mui-selected': {
                          background: (theme) =>
                            mode === 'dark'
                              ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(139, 92, 246, 0.2) 100%)'
                              : 'linear-gradient(135deg, rgba(99, 102, 241, 0.12) 0%, rgba(139, 92, 246, 0.12) 100%)',
                          '&:hover': {
                            background: (theme) =>
                              mode === 'dark'
                                ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.25) 0%, rgba(139, 92, 246, 0.25) 100%)'
                                : 'linear-gradient(135deg, rgba(99, 102, 241, 0.16) 0%, rgba(139, 92, 246, 0.16) 100%)',
                          },
                          '&::before': {
                            content: '""',
                            position: 'absolute',
                            left: 0,
                            top: '50%',
                            transform: 'translateY(-50%)',
                            width: '4px',
                            height: '60%',
                            borderRadius: '0 4px 4px 0',
                            background: 'linear-gradient(180deg, #6366f1, #8b5cf6)',
                            boxShadow: '0 0 12px rgba(99, 102, 241, 0.6)',
                          },
                        },
                        '&:hover': {
                          backgroundColor: (theme) =>
                            alpha(theme.palette.action.hover, 0.08),
                          transform: 'translateX(6px)',
                        },
                      }}
                    >
                      <ListItemIcon 
                        sx={{ 
                          minWidth: 40,
                          color: isActive ? 'primary.main' : 'text.secondary',
                          transition: 'all 0.3s',
                          transform: isActive ? 'scale(1.1)' : 'scale(1)',
                        }}
                      >
                        {item.icon}
                      </ListItemIcon>
                      <ListItemText
                        primary={item.title}
                        primaryTypographyProps={{
                          fontWeight: isActive ? 700 : 500,
                          fontSize: '0.9rem',
                          color: isActive ? 'primary.main' : 'text.primary',
                        }}
                      />
                    </ListItemButton>
                  </ListItem>
                );
              })}
            </List>
          </Box>

          {/* Footer da Sidebar */}
          <Box
            sx={{
              pt: 2,
              mt: 'auto',
              borderTop: 1,
              borderColor: 'divider',
            }}
          >
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{
                display: 'block',
                textAlign: 'center',
                fontSize: '0.7rem',
              }}
            >
              FGS © 2025
            </Typography>
          </Box>
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
        <PageTransition>
          <Outlet />
        </PageTransition>
      </Box>
    </Box>
  );
};

