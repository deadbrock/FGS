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
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { ConfiguracaoPontoEletronico, StatusIntegracao } from '../../types/integracoes';

interface ConfiguracaoPontoProps {
  configuracao?: ConfiguracaoPontoEletronico;
  onSalvar: (config: ConfiguracaoPontoEletronico) => void;
  onTestar: () => void;
}

export const ConfiguracaoPonto: React.FC<ConfiguracaoPontoProps> = ({
  configuracao,
  onSalvar,
  onTestar,
}) => {
  const [config, setConfig] = useState<ConfiguracaoPontoEletronico>(
    configuracao || {
      fornecedor: 'IDCLASS',
      modelo: '',
      intervaloSincronizacao: 15,
      sincronizarAutomaticamente: true,
      armazenarFotos: true,
      validarReconhecimentoFacial: true,
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
            Configuração de Ponto Eletrônico
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Configure a integração com seu sistema de ponto eletrônico
          </Typography>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Fornecedor</InputLabel>
              <Select
                value={config.fornecedor}
                label="Fornecedor"
                onChange={(e) => setConfig({ ...config, fornecedor: e.target.value as any })}
              >
                <MenuItem value="IDCLASS">IDClass</MenuItem>
                <MenuItem value="REP">REP</MenuItem>
                <MenuItem value="SECULLUM">Secullum</MenuItem>
                <MenuItem value="OUTRO">Outro</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Modelo do Equipamento"
              value={config.modelo}
              onChange={(e) => setConfig({ ...config, modelo: e.target.value })}
              placeholder="Ex: iDFace Pro"
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="IP do Dispositivo"
              value={config.ipDispositivo || ''}
              onChange={(e) => setConfig({ ...config, ipDispositivo: e.target.value })}
              placeholder="192.168.1.100"
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              type="number"
              label="Intervalo de Sincronização (minutos)"
              value={config.intervaloSincronizacao}
              onChange={(e) =>
                setConfig({ ...config, intervaloSincronizacao: parseInt(e.target.value) })
              }
              InputProps={{ inputProps: { min: 1, max: 1440 } }}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <FormControlLabel
              control={
                <Switch
                  checked={config.sincronizarAutomaticamente}
                  onChange={(e) =>
                    setConfig({ ...config, sincronizarAutomaticamente: e.target.checked })
                  }
                />
              }
              label="Sincronizar Automaticamente"
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <FormControlLabel
              control={
                <Switch
                  checked={config.armazenarFotos}
                  onChange={(e) => setConfig({ ...config, armazenarFotos: e.target.checked })}
                />
              }
              label="Armazenar Fotos"
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <FormControlLabel
              control={
                <Switch
                  checked={config.validarReconhecimentoFacial}
                  onChange={(e) =>
                    setConfig({ ...config, validarReconhecimentoFacial: e.target.checked })
                  }
                />
              }
              label="Validar Reconhecimento Facial"
            />
          </Grid>

          <Grid item xs={12}>
            <Alert severity="info">
              A sincronização automática importará os registros de ponto a cada{' '}
              {config.intervaloSincronizacao} minutos.
            </Alert>
          </Grid>

          <Grid item xs={12}>
            <Box display="flex" gap={2}>
              <Button
                variant="contained"
                startIcon={<SaveIcon />}
                onClick={handleSalvar}
              >
                Salvar Configurações
              </Button>
              <Button
                variant="outlined"
                startIcon={<PlayArrowIcon />}
                onClick={onTestar}
              >
                Testar Conexão
              </Button>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

