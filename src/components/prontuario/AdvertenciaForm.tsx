import React from 'react';
import { Grid, TextField, MenuItem } from '@mui/material';
import { Advertencia } from '../../types/prontuario';

interface AdvertenciaFormProps {
  dados?: Partial<Advertencia>;
  onChange: (dados: Partial<Advertencia>) => void;
}

export const AdvertenciaForm: React.FC<AdvertenciaFormProps> = ({
  dados = {},
  onChange,
}) => {
  const handleChange = (field: keyof Advertencia, value: any) => {
    onChange({ ...dados, [field]: value });
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          select
          label="Tipo de Advertência"
          value={dados.tipo || ''}
          onChange={(e) => handleChange('tipo', e.target.value)}
          required
        >
          <MenuItem value="Verbal">Verbal</MenuItem>
          <MenuItem value="Escrita">Escrita</MenuItem>
          <MenuItem value="Suspensão">Suspensão</MenuItem>
        </TextField>
      </Grid>

      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Data da Advertência"
          type="date"
          value={dados.data || ''}
          onChange={(e) => handleChange('data', e.target.value)}
          InputLabelProps={{ shrink: true }}
          required
        />
      </Grid>

      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Motivo"
          value={dados.motivo || ''}
          onChange={(e) => handleChange('motivo', e.target.value)}
          placeholder="Ex: Atraso reiterado, Falta injustificada, Insubordinação..."
          required
        />
      </Grid>

      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Descrição Detalhada"
          value={dados.descricao || ''}
          onChange={(e) => handleChange('descricao', e.target.value)}
          multiline
          rows={4}
          placeholder="Descreva detalhadamente a situação que levou à advertência..."
          required
        />
      </Grid>

      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Aplicado Por"
          value={dados.aplicadoPor || ''}
          onChange={(e) => handleChange('aplicadoPor', e.target.value)}
          placeholder="Nome do responsável pela aplicação"
          required
        />
      </Grid>

      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Cargo do Responsável"
          value={dados.cargoResponsavel || ''}
          onChange={(e) => handleChange('cargoResponsavel', e.target.value)}
          placeholder="Ex: Gerente de RH, Supervisor"
        />
      </Grid>

      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Medidas Corretivas / Orientações"
          value={dados.medidasCorretivas || ''}
          onChange={(e) => handleChange('medidasCorretivas', e.target.value)}
          multiline
          rows={3}
          placeholder="Descreva as medidas que devem ser tomadas para evitar reincidência..."
        />
      </Grid>

      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Observações Adicionais"
          value={dados.observacoes || ''}
          onChange={(e) => handleChange('observacoes', e.target.value)}
          multiline
          rows={2}
          placeholder="Outras informações relevantes..."
        />
      </Grid>
    </Grid>
  );
};

