import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Grid,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Typography,
  Box,
  Alert,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import SendIcon from '@mui/icons-material/Send';
import { ConfiguracaoEmail } from '../../types/integracoes';

interface ConfiguracaoEmailProps {
  configuracao?: ConfiguracaoEmail;
  onSalvar: (config: ConfiguracaoEmail) => void;
  onTestar: () => void;
}

export const ConfiguracaoEmailComponent: React.FC<ConfiguracaoEmailProps> = ({
  configuracao,
  onSalvar,
  onTestar,
}) => {
  const [config, setConfig] = useState<ConfiguracaoEmail>(
    configuracao || {
      provedor: 'SMTP',
      host: '',
      porta: 587,
      seguranca: 'TLS',
      remetentePadrao: '',
      nomeRemetente: 'FGS Sistema',
      usarAutenticacao: true,
      testarConexao: false,
      limiteEnvioHora: 100,
      limiteEnvioDia: 1000,
    }
  );

  const handleSalvar = () => {
    onSalvar(config);
  };

  return (
    <Card>
      <CardContent>
        <Box mb={3}>
          <Typography variant="h6" gutterBottom>
            Configuração de E-mail Corporativo
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Configure o servidor SMTP para envio de e-mails do sistema
          </Typography>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Provedor</InputLabel>
              <Select
                value={config.provedor}
                label="Provedor"
                onChange={(e) => setConfig({ ...config, provedor: e.target.value as any })}
              >
                <MenuItem value="SMTP">SMTP Genérico</MenuItem>
                <MenuItem value="GMAIL">Gmail</MenuItem>
                <MenuItem value="OUTLOOK">Outlook/Office 365</MenuItem>
                <MenuItem value="SENDGRID">SendGrid</MenuItem>
                <MenuItem value="AWS_SES">AWS SES</MenuItem>
                <MenuItem value="OUTRO">Outro</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Segurança</InputLabel>
              <Select
                value={config.seguranca}
                label="Segurança"
                onChange={(e) => setConfig({ ...config, seguranca: e.target.value as any })}
              >
                <MenuItem value="TLS">TLS</MenuItem>
                <MenuItem value="SSL">SSL</MenuItem>
                <MenuItem value="STARTTLS">STARTTLS</MenuItem>
                <MenuItem value="NENHUMA">Nenhuma</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={8}>
            <TextField
              fullWidth
              label="Host SMTP"
              value={config.host}
              onChange={(e) => setConfig({ ...config, host: e.target.value })}
              placeholder="smtp.gmail.com"
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              type="number"
              label="Porta"
              value={config.porta}
              onChange={(e) => setConfig({ ...config, porta: parseInt(e.target.value) })}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="E-mail Remetente"
              type="email"
              value={config.remetentePadrao}
              onChange={(e) => setConfig({ ...config, remetentePadrao: e.target.value })}
              placeholder="noreply@fgs.com"
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Nome do Remetente"
              value={config.nomeRemetente}
              onChange={(e) => setConfig({ ...config, nomeRemetente: e.target.value })}
              placeholder="FGS Sistema"
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              type="number"
              label="Limite de Envio por Hora"
              value={config.limiteEnvioHora || ''}
              onChange={(e) =>
                setConfig({ ...config, limiteEnvioHora: parseInt(e.target.value) })
              }
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              type="number"
              label="Limite de Envio por Dia"
              value={config.limiteEnvioDia || ''}
              onChange={(e) => setConfig({ ...config, limiteEnvioDia: parseInt(e.target.value) })}
            />
          </Grid>

          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Switch
                  checked={config.usarAutenticacao}
                  onChange={(e) => setConfig({ ...config, usarAutenticacao: e.target.checked })}
                />
              }
              label="Usar Autenticação"
            />
          </Grid>

          <Grid item xs={12}>
            <Alert severity="warning">
              Certifique-se de configurar as credenciais de autenticação nas configurações de
              segurança.
            </Alert>
          </Grid>

          <Grid item xs={12}>
            <Box display="flex" gap={2}>
              <Button variant="contained" startIcon={<SaveIcon />} onClick={handleSalvar}>
                Salvar Configurações
              </Button>
              <Button variant="outlined" startIcon={<SendIcon />} onClick={onTestar}>
                Enviar E-mail de Teste
              </Button>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

