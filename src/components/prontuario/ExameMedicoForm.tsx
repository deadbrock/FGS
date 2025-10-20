import React from 'react';
import { Grid, TextField, MenuItem } from '@mui/material';
import { ExameMedico } from '../../types/prontuario';
import { FileUpload } from '../FileUpload';

interface ExameMedicoFormProps {
  dados: Partial<ExameMedico>;
  onChange: (campo: string, valor: any) => void;
  onFileUpload?: (files: File[]) => void;
  readonly?: boolean;
}

export const ExameMedicoForm: React.FC<ExameMedicoFormProps> = ({
  dados,
  onChange,
  onFileUpload,
  readonly = false,
}) => {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          select
          label="Tipo de Exame"
          value={dados.tipo || ''}
          onChange={(e) => onChange('tipo', e.target.value)}
          required
          disabled={readonly}
        >
          <MenuItem value="Admissional">Admissional</MenuItem>
          <MenuItem value="Periódico">Periódico</MenuItem>
          <MenuItem value="Demissional">Demissional</MenuItem>
          <MenuItem value="Retorno ao Trabalho">Retorno ao Trabalho</MenuItem>
          <MenuItem value="Mudança de Função">Mudança de Função</MenuItem>
        </TextField>
      </Grid>

      <Grid item xs={12} md={3}>
        <TextField
          fullWidth
          type="date"
          label="Data de Realização"
          value={dados.dataRealizacao || ''}
          onChange={(e) => onChange('dataRealizacao', e.target.value)}
          InputLabelProps={{ shrink: true }}
          required
          disabled={readonly}
        />
      </Grid>

      <Grid item xs={12} md={3}>
        <TextField
          fullWidth
          type="date"
          label="Data de Validade"
          value={dados.dataValidade || ''}
          onChange={(e) => onChange('dataValidade', e.target.value)}
          InputLabelProps={{ shrink: true }}
          required
          disabled={readonly}
        />
      </Grid>

      <Grid item xs={12} md={4}>
        <TextField
          fullWidth
          select
          label="Resultado"
          value={dados.resultado || ''}
          onChange={(e) => onChange('resultado', e.target.value)}
          required
          disabled={readonly}
        >
          <MenuItem value="Apto">Apto</MenuItem>
          <MenuItem value="Inapto">Inapto</MenuItem>
          <MenuItem value="Apto com Restrições">Apto com Restrições</MenuItem>
        </TextField>
      </Grid>

      <Grid item xs={12} md={4}>
        <TextField
          fullWidth
          label="Médico Responsável"
          value={dados.medico || ''}
          onChange={(e) => onChange('medico', e.target.value)}
          required
          disabled={readonly}
        />
      </Grid>

      <Grid item xs={12} md={4}>
        <TextField
          fullWidth
          label="CRM"
          value={dados.crm || ''}
          onChange={(e) => onChange('crm', e.target.value)}
          required
          disabled={readonly}
        />
      </Grid>

      <Grid item xs={12}>
        <TextField
          fullWidth
          multiline
          rows={3}
          label="Observações"
          value={dados.observacoes || ''}
          onChange={(e) => onChange('observacoes', e.target.value)}
          disabled={readonly}
        />
      </Grid>

      {onFileUpload && !readonly && (
        <Grid item xs={12}>
          <FileUpload
            label="Upload do Exame"
            accept=".pdf,.jpg,.jpeg,.png"
            onFilesSelected={onFileUpload}
          />
        </Grid>
      )}
    </Grid>
  );
};

