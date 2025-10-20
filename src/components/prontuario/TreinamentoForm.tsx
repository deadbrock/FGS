import React from 'react';
import { Grid, TextField } from '@mui/material';
import { Treinamento } from '../../types/prontuario';
import { FileUpload } from '../FileUpload';

interface TreinamentoFormProps {
  dados: Partial<Treinamento>;
  onChange: (campo: string, valor: any) => void;
  onFileUpload?: (files: File[]) => void;
  readonly?: boolean;
}

export const TreinamentoForm: React.FC<TreinamentoFormProps> = ({
  dados,
  onChange,
  onFileUpload,
  readonly = false,
}) => {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Título do Treinamento"
          value={dados.titulo || ''}
          onChange={(e) => onChange('titulo', e.target.value)}
          required
          disabled={readonly}
        />
      </Grid>

      <Grid item xs={12}>
        <TextField
          fullWidth
          multiline
          rows={3}
          label="Descrição"
          value={dados.descricao || ''}
          onChange={(e) => onChange('descricao', e.target.value)}
          required
          disabled={readonly}
        />
      </Grid>

      <Grid item xs={12} md={4}>
        <TextField
          fullWidth
          type="date"
          label="Data de Início"
          value={dados.dataInicio || ''}
          onChange={(e) => onChange('dataInicio', e.target.value)}
          InputLabelProps={{ shrink: true }}
          required
          disabled={readonly}
        />
      </Grid>

      <Grid item xs={12} md={4}>
        <TextField
          fullWidth
          type="date"
          label="Data de Fim"
          value={dados.dataFim || ''}
          onChange={(e) => onChange('dataFim', e.target.value)}
          InputLabelProps={{ shrink: true }}
          required
          disabled={readonly}
        />
      </Grid>

      <Grid item xs={12} md={4}>
        <TextField
          fullWidth
          type="number"
          label="Carga Horária (horas)"
          value={dados.cargaHoraria || ''}
          onChange={(e) => onChange('cargaHoraria', parseInt(e.target.value))}
          required
          disabled={readonly}
        />
      </Grid>

      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Instrutor"
          value={dados.instrutor || ''}
          onChange={(e) => onChange('instrutor', e.target.value)}
          required
          disabled={readonly}
        />
      </Grid>

      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Instituição"
          value={dados.instituicao || ''}
          onChange={(e) => onChange('instituicao', e.target.value)}
          required
          disabled={readonly}
        />
      </Grid>

      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          type="number"
          label="Nota (0-10)"
          value={dados.nota || ''}
          onChange={(e) => onChange('nota', parseFloat(e.target.value))}
          inputProps={{ min: 0, max: 10, step: 0.1 }}
          disabled={readonly}
        />
      </Grid>

      {onFileUpload && !readonly && (
        <Grid item xs={12}>
          <FileUpload
            label="Upload do Certificado"
            accept=".pdf,.jpg,.jpeg,.png"
            onFilesSelected={onFileUpload}
          />
        </Grid>
      )}
    </Grid>
  );
};

