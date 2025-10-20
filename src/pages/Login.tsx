import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  InputAdornment,
  IconButton,
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import { LoginLayout } from '../layouts/LoginLayout';
import { useAuth } from '../hooks/useAuth';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login({ email, senha });
      navigate('/dashboard');
    } catch (err) {
      setError('Email ou senha inválidos. Por favor, tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <LoginLayout>
      <Box component="form" onSubmit={handleSubmit} noValidate>
        {/* Título de Boas-vindas */}
        <Typography
          variant="h4"
          align="center"
          gutterBottom
          sx={{
            fontWeight: 700,
            color: 'text.primary',
            mb: 1,
          }}
        >
          Bem-vindo! 👋
        </Typography>
        <Typography
          variant="body1"
          align="center"
          color="text.secondary"
          sx={{ mb: 4, fontWeight: 300 }}
        >
          Acesse sua conta para continuar
        </Typography>

        {/* Alerta de Erro */}
        {error && (
          <Alert
            severity="error"
            sx={{
              mb: 3,
              borderRadius: 2,
              animation: 'shake 0.5s',
              '@keyframes shake': {
                '0%, 100%': { transform: 'translateX(0)' },
                '25%': { transform: 'translateX(-10px)' },
                '75%': { transform: 'translateX(10px)' },
              },
            }}
          >
            {error}
          </Alert>
        )}

        {/* Campo Email */}
        <TextField
          fullWidth
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          margin="normal"
          required
          autoComplete="email"
          autoFocus
          sx={{
            mb: 2,
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
              transition: 'all 0.3s ease',
              '&:hover': {
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              },
              '&.Mui-focused': {
                boxShadow: '0 4px 20px rgba(162, 18, 42, 0.2)',
              },
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <EmailIcon sx={{ color: '#a2122a' }} />
              </InputAdornment>
            ),
          }}
        />

        {/* Campo Senha */}
        <TextField
          fullWidth
          label="Senha"
          type={showPassword ? 'text' : 'password'}
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          margin="normal"
          required
          autoComplete="current-password"
          sx={{
            mb: 3,
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
              transition: 'all 0.3s ease',
              '&:hover': {
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              },
              '&.Mui-focused': {
                boxShadow: '0 4px 20px rgba(53, 74, 128, 0.2)',
              },
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <LockIcon sx={{ color: '#354a80' }} />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={handleTogglePassword} edge="end">
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        {/* Botão de Login com Gradiente */}
        <Button
          type="submit"
          fullWidth
          variant="contained"
          size="large"
          disabled={loading}
          sx={{
            mt: 2,
            mb: 3,
            py: 1.5,
            borderRadius: 2,
            background: 'linear-gradient(135deg, #a2122a 0%, #354a80 100%)',
            fontSize: '1.1rem',
            fontWeight: 600,
            textTransform: 'none',
            boxShadow: '0 4px 20px rgba(162, 18, 42, 0.3)',
            transition: 'all 0.3s ease',
            '&:hover': {
              background: 'linear-gradient(135deg, #8a0f22 0%, #2a3a66 100%)',
              boxShadow: '0 6px 30px rgba(162, 18, 42, 0.5)',
              transform: 'translateY(-2px)',
            },
            '&:active': {
              transform: 'translateY(0)',
            },
            '&:disabled': {
              background: 'linear-gradient(135deg, #ccc 0%, #999 100%)',
              boxShadow: 'none',
            },
          }}
        >
          {loading ? '⏳ Entrando...' : '🔐 Entrar no Sistema'}
        </Button>

        {/* Credenciais de Teste */}
        <Box
          mt={2}
          p={2.5}
          sx={{
            background: 'linear-gradient(135deg, rgba(162, 18, 42, 0.05) 0%, rgba(53, 74, 128, 0.05) 100%)',
            borderRadius: 2,
            border: '1px dashed rgba(162, 18, 42, 0.2)',
          }}
        >
          <Typography
            variant="caption"
            sx={{
              display: 'block',
              textAlign: 'center',
              fontWeight: 600,
              color: 'text.primary',
              mb: 1,
            }}
          >
            🔑 Credenciais de Teste
          </Typography>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ display: 'block', textAlign: 'center', mb: 0.5 }}
          >
            <strong>Admin:</strong> admin@fgs.com / admin123
          </Typography>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ display: 'block', textAlign: 'center' }}
          >
            <strong>RH:</strong> rh@fgs.com / rh123
          </Typography>
        </Box>
      </Box>
    </LoginLayout>
  );
};

