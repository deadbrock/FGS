import React from 'react';
import { Grid, TextField, MenuItem } from '@mui/material';
import { Ferias } from '../../types/prontuario';

interface FeriasFormProps {
  dados?: Partial<Ferias>;
  onChange: (dados: Partial<Ferias>) => void;
}

export const FeriasForm: React.FC<FeriasFormProps> = ({ dados = {}, onChange }) => {
  const handleChange = (field: keyof Ferias, value: any) => {
    onChange({ ...dados, [field]: value });
  };

  const handlePeriodoChange = (field: 'inicio' | 'fim', value: string) => {
    onChange({
      ...dados,
      periodoAquisitivo: {
        ...(dados.periodoAquisitivo || { inicio: '', fim: '' }),
        [field]: value,
      },
    });
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Período Aquisitivo - Início"
          type="date"
          value={dados.periodoAquisitivo?.inicio || ''}
          onChange={(e) => handlePeriodoChange('inicio', e.target.value)}
          InputLabelProps={{ shrink: true }}
          required
        />
      </Grid>

      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Período Aquisitivo - Fim"
          type="date"
          value={dados.periodoAquisitivo?.fim || ''}
          onChange={(e) => handlePeriodoChange('fim', e.target.value)}
          InputLabelProps={{ shrink: true }}
          required
        />
      </Grid>

      <Grid item xs={12} md={4}>
        <TextField
          fullWidth
          label="Dias de Direito"
          type="number"
          value={dados.diasDireito || 30}
          onChange={(e) => handleChange('diasDireito', parseInt(e.target.value))}
          required
        />
      </Grid>

      <Grid item xs={12} md={4}>
        <TextField
          fullWidth
          label="Dias Gozados"
          type="number"
          value={dados.diasGozados || 0}
          onChange={(e) => handleChange('diasGozados', parseInt(e.target.value))}
        />
      </Grid>

      <Grid item xs={12} md={4}>
        <TextField
          fullWidth
          label="Dias Restantes"
          type="number"
          value={dados.diasRestantes || 0}
          onChange={(e) => handleChange('diasRestantes', parseInt(e.target.value))}
        />
      </Grid>

      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Data de Início das Férias"
          type="date"
          value={dados.dataInicio || ''}
          onChange={(e) => handleChange('dataInicio', e.target.value)}
          InputLabelProps={{ shrink: true }}
        />
      </Grid>

      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Data de Fim das Férias"
          type="date"
          value={dados.dataFim || ''}
          onChange={(e) => handleChange('dataFim', e.target.value)}
          InputLabelProps={{ shrink: true }}
        />
      </Grid>

      <Grid item xs={12}>
        <TextField
          fullWidth
          select
          label="Tipo de Férias"
          value={dados.tipo || 'Integral'}
          onChange={(e) => handleChange('tipo', e.target.value)}
          required
        >
          <MenuItem value="Integral">Integral (30 dias)</MenuItem>
          <MenuItem value="Fracionada">Fracionada (períodos divididos)</MenuItem>
          <MenuItem value="Coletiva">Coletiva</MenuItem>
          <MenuItem value="Abono Pecuniário">Abono Pecuniário (venda de 10 dias)</MenuItem>
        </TextField>
      </Grid>

      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Observações"
          value={dados.observacoes || ''}
          onChange={(e) => handleChange('observacoes', e.target.value)}
          multiline
          rows={3}
          placeholder="Adicione observações sobre as férias..."
        />
      </Grid>
    </Grid>
  );
};

