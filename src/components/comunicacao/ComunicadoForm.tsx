import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  MenuItem,
  FormControlLabel,
  Checkbox,
  FormGroup,
  Chip,
  Box,
  Typography,
  Alert,
} from '@mui/material';
import {
  Comunicado,
  TipoComunicado,
  PrioridadeComunicado,
  CategoriaComunicado,
  CanalNotificacao,
} from '../../types/comunicacao';
import {
  getTipoNome,
  getPrioridadeNome,
  getCategoriaNome,
  getCanalNome,
  getCanalIcone,
  validarEnvio,
  contarPalavras,
  estimarTempoLeitura,
} from '../../utils/comunicacaoUtils';

interface ComunicadoFormProps {
  open: boolean;
  comunicado?: Comunicado;
  onClose: () => void;
  onSave: (comunicado: Partial<Comunicado>) => void;
}

export const ComunicadoForm: React.FC<ComunicadoFormProps> = ({
  open,
  comunicado,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState<Partial<Comunicado>>(
    comunicado || {
      tipo: TipoComunicado.GERAL,
      prioridade: PrioridadeComunicado.NORMAL,
      categoria: CategoriaComunicado.INFORMATIVO,
      canais: [CanalNotificacao.APP],
      envioImediato: true,
      exigeLeitura: false,
      destinatarios: { todos: true },
    }
  );

  const [erros, setErros] = useState<string[]>([]);

  const handleSubmit = () => {
    const validacao = validarEnvio(
      formData.titulo || '',
      formData.conteudo || '',
      formData.canais || []
    );

    if (!validacao.valido) {
      setErros(validacao.erros);
      return;
    }

    onSave(formData);
    onClose();
  };

  const tipos = Object.values(TipoComunicado);
  const prioridades = Object.values(PrioridadeComunicado);
  const categorias = Object.values(CategoriaComunicado);
  const canais = Object.values(CanalNotificacao);

  const palavras = contarPalavras(formData.conteudo || '');
  const tempoLeitura = estimarTempoLeitura(formData.conteudo || '');

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {comunicado ? 'Editar Comunicado' : 'Novo Comunicado'}
      </DialogTitle>
      <DialogContent>
        {erros.length > 0 && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {erros.map((erro, i) => (
              <div key={i}>• {erro}</div>
            ))}
          </Alert>
        )}

        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12} md={6}>
            <TextField
              select
              fullWidth
              label="Tipo de Envio"
              value={formData.tipo || ''}
              onChange={(e) => setFormData({ ...formData, tipo: e.target.value as TipoComunicado })}
            >
              {tipos.map((tipo) => (
                <MenuItem key={tipo} value={tipo}>
                  {getTipoNome(tipo)}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              select
              fullWidth
              label="Categoria"
              value={formData.categoria || ''}
              onChange={(e) => setFormData({ ...formData, categoria: e.target.value as CategoriaComunicado })}
            >
              {categorias.map((cat) => (
                <MenuItem key={cat} value={cat}>
                  {getCategoriaNome(cat)}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              select
              fullWidth
              label="Prioridade"
              value={formData.prioridade || ''}
              onChange={(e) => setFormData({ ...formData, prioridade: e.target.value as PrioridadeComunicado })}
            >
              {prioridades.map((prior) => (
                <MenuItem key={prior} value={prior}>
                  {getPrioridadeNome(prior)}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Título"
              value={formData.titulo || ''}
              onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
              placeholder="Digite o título do comunicado"
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={6}
              label="Conteúdo"
              value={formData.conteudo || ''}
              onChange={(e) => setFormData({ ...formData, conteudo: e.target.value })}
              placeholder="Digite o conteúdo do comunicado..."
            />
            <Box display="flex" justifyContent="space-between" mt={1}>
              <Typography variant="caption" color="text.secondary">
                {palavras} palavras
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Tempo de leitura: {tempoLeitura}
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle2" gutterBottom>
              Canais de Envio
            </Typography>
            <FormGroup row>
              {canais.map((canal) => (
                <FormControlLabel
                  key={canal}
                  control={
                    <Checkbox
                      checked={formData.canais?.includes(canal) || false}
                      onChange={(e) => {
                        const novosCanais = e.target.checked
                          ? [...(formData.canais || []), canal]
                          : (formData.canais || []).filter(c => c !== canal);
                        setFormData({ ...formData, canais: novosCanais });
                      }}
                    />
                  }
                  label={
                    <Box display="flex" alignItems="center" gap={0.5}>
                      <span>{getCanalIcone(canal)}</span>
                      <span>{getCanalNome(canal)}</span>
                    </Box>
                  }
                />
              ))}
            </FormGroup>
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.envioImediato || false}
                  onChange={(e) => setFormData({ ...formData, envioImediato: e.target.checked })}
                />
              }
              label="Envio Imediato"
            />
          </Grid>

          {!formData.envioImediato && (
            <>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  type="date"
                  label="Data de Envio"
                  value={formData.dataEnvio || ''}
                  onChange={(e) => setFormData({ ...formData, dataEnvio: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  type="time"
                  label="Hora de Envio"
                  value={formData.horaEnvio || ''}
                  onChange={(e) => setFormData({ ...formData, horaEnvio: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
            </>
          )}

          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.exigeLeitura || false}
                  onChange={(e) => setFormData({ ...formData, exigeLeitura: e.target.checked })}
                />
              }
              label="Exigir Confirmação de Leitura"
            />
          </Grid>

          {formData.exigeLeitura && (
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="number"
                label="Prazo (dias)"
                value={formData.prazoDias || ''}
                onChange={(e) => setFormData({ ...formData, prazoDias: Number(e.target.value) })}
                placeholder="Ex: 7"
              />
            </Grid>
          )}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button variant="outlined" onClick={() => onSave({ ...formData, status: 'RASCUNHO' as any })}>
          Salvar Rascunho
        </Button>
        <Button variant="contained" onClick={handleSubmit}>
          {formData.envioImediato ? 'Enviar Agora' : 'Agendar Envio'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

