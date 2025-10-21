import React from 'react';
import { Grid, TextField } from '@mui/material';
import { AtestadoMedico } from '../../types/prontuario';

interface AtestadoMedicoFormProps {
  dados?: Partial<AtestadoMedico>;
  onChange: (dados: Partial<AtestadoMedico>) => void;
}

export const AtestadoMedicoForm: React.FC<AtestadoMedicoFormProps> = ({
  dados = {},
  onChange,
}) => {
  const handleChange = (field: keyof AtestadoMedico, value: any) => {
    onChange({ ...dados, [field]: value });
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Data de Emissão"
          type="date"
          value={dados.dataEmissao || ''}
          onChange={(e) => handleChange('dataEmissao', e.target.value)}
          InputLabelProps={{ shrink: true }}
          required
        />
      </Grid>

      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Data de Início do Afastamento"
          type="date"
          value={dados.dataInicio || ''}
          onChange={(e) => handleChange('dataInicio', e.target.value)}
          InputLabelProps={{ shrink: true }}
          required
        />
      </Grid>

      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Data de Fim do Afastamento"
          type="date"
          value={dados.dataFim || ''}
          onChange={(e) => handleChange('dataFim', e.target.value)}
          InputLabelProps={{ shrink: true }}
          required
        />
      </Grid>

      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Dias de Afastamento"
          type="number"
          value={dados.diasAfastamento || ''}
          onChange={(e) => handleChange('diasAfastamento', parseInt(e.target.value))}
          required
        />
      </Grid>

      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Médico Responsável"
          value={dados.medico || ''}
          onChange={(e) => handleChange('medico', e.target.value)}
          required
        />
      </Grid>

      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="CRM"
          value={dados.crm || ''}
          onChange={(e) => handleChange('crm', e.target.value)}
          placeholder="123456-UF"
          required
        />
      </Grid>

      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="CID (Código Internacional de Doenças)"
          value={dados.cid || ''}
          onChange={(e) => handleChange('cid', e.target.value)}
          placeholder="Ex: J00"
        />
      </Grid>

      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Descrição / Observações"
          value={dados.observacoes || ''}
          onChange={(e) => handleChange('observacoes', e.target.value)}
          multiline
          rows={4}
          placeholder="Descreva os detalhes do atestado médico..."
        />
      </Grid>
    </Grid>
  );
};

