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
  Chip,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import { ConfiguracaoWhatsApp } from '../../types/integracoes';

interface ConfiguracaoWhatsAppProps {
  configuracao?: ConfiguracaoWhatsApp;
  onSalvar: (config: ConfiguracaoWhatsApp) => void;
  onTestar: () => void;
}

export const ConfiguracaoWhatsAppComponent: React.FC<ConfiguracaoWhatsAppProps> = ({
  configuracao,
  onSalvar,
  onTestar,
}) => {
  const [config, setConfig] = useState<ConfiguracaoWhatsApp>(
    configuracao || {
      provedor: 'META',
      numeroTelefone: '',
      permitirEnvioEmMassa: false,
      templatesMensagens: [],
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
            Configuração WhatsApp Business API
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Configure a integração com WhatsApp Business para envio de notificações
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
                <MenuItem value="META">Meta (Facebook)</MenuItem>
                <MenuItem value="TWILIO">Twilio</MenuItem>
                <MenuItem value="MESSAGEBIRD">MessageBird</MenuItem>
                <MenuItem value="OUTRO">Outro</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Número de Telefone"
              value={config.numeroTelefone}
              onChange={(e) => setConfig({ ...config, numeroTelefone: e.target.value })}
              placeholder="+55 11 91234-5678"
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Phone Number ID"
              value={config.phoneNumberId || ''}
              onChange={(e) => setConfig({ ...config, phoneNumberId: e.target.value })}
              placeholder="123456789012345"
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="WABA ID"
              value={config.wabaId || ''}
              onChange={(e) => setConfig({ ...config, wabaId: e.target.value })}
              placeholder="WhatsApp Business Account ID"
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Webhook URL"
              value={config.webhookUrl || ''}
              onChange={(e) => setConfig({ ...config, webhookUrl: e.target.value })}
              placeholder="https://seu-dominio.com/webhooks/whatsapp"
            />
          </Grid>

          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Switch
                  checked={config.permitirEnvioEmMassa}
                  onChange={(e) =>
                    setConfig({ ...config, permitirEnvioEmMassa: e.target.checked })
                  }
                />
              }
              label="Permitir Envio em Massa"
            />
          </Grid>

          <Grid item xs={12}>
            <Alert severity="info">
              <Typography variant="body2" gutterBottom>
                <strong>Templates de Mensagens:</strong>
              </Typography>
              <Typography variant="body2">
                Para enviar mensagens via WhatsApp Business API, você precisa criar templates
                aprovados pela Meta. Configure seus templates no Meta Business Manager.
              </Typography>
            </Alert>
          </Grid>

          <Grid item xs={12}>
            <Box display="flex" gap={2}>
              <Button variant="contained" startIcon={<SaveIcon />} onClick={handleSalvar}>
                Salvar Configurações
              </Button>
              <Button variant="outlined" startIcon={<WhatsAppIcon />} onClick={onTestar}>
                Enviar Mensagem de Teste
              </Button>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

