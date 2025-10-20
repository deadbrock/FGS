import React from 'react';
import { Grid, TextField, MenuItem, InputAdornment } from '@mui/material';
import { DadosContratuais } from '../../types/prontuario';
import { FileUpload } from '../FileUpload';

interface DadosContratuaisFormProps {
  dados: Partial<DadosContratuais>;
  onChange: (campo: string, valor: any) => void;
  onFileUpload?: (files: File[]) => void;
  readonly?: boolean;
}

export const DadosContratuaisForm: React.FC<DadosContratuaisFormProps> = ({
  dados,
  onChange,
  onFileUpload,
  readonly = false,
}) => {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={4}>
        <TextField
          fullWidth
          type="date"
          label="Data de Admissão"
          value={dados.dataAdmissao || ''}
          onChange={(e) => onChange('dataAdmissao', e.target.value)}
          InputLabelProps={{ shrink: true }}
          required
          disabled={readonly}
        />
      </Grid>

      <Grid item xs={12} md={4}>
        <TextField
          fullWidth
          type="date"
          label="Data de Desligamento"
          value={dados.dataDesligamento || ''}
          onChange={(e) => onChange('dataDesligamento', e.target.value)}
          InputLabelProps={{ shrink: true }}
          disabled={readonly}
        />
      </Grid>

      <Grid item xs={12} md={4}>
        <TextField
          fullWidth
          select
          label="Tipo de Contrato"
          value={dados.tipoContrato || ''}
          onChange={(e) => onChange('tipoContrato', e.target.value)}
          required
          disabled={readonly}
        >
          <MenuItem value="CLT">CLT</MenuItem>
          <MenuItem value="PJ">PJ</MenuItem>
          <MenuItem value="Estágio">Estágio</MenuItem>
          <MenuItem value="Temporário">Temporário</MenuItem>
        </TextField>
      </Grid>

      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Cargo"
          value={dados.cargo || ''}
          onChange={(e) => onChange('cargo', e.target.value)}
          required
          disabled={readonly}
        />
      </Grid>

      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Departamento"
          value={dados.departamento || ''}
          onChange={(e) => onChange('departamento', e.target.value)}
          required
          disabled={readonly}
        />
      </Grid>

      <Grid item xs={12} md={4}>
        <TextField
          fullWidth
          type="number"
          label="Salário"
          value={dados.salario || ''}
          onChange={(e) => onChange('salario', parseFloat(e.target.value))}
          InputProps={{
            startAdornment: <InputAdornment position="start">R$</InputAdornment>,
          }}
          required
          disabled={readonly}
        />
      </Grid>

      <Grid item xs={12} md={4}>
        <TextField
          fullWidth
          label="Jornada de Trabalho"
          value={dados.jornadaTrabalho || ''}
          onChange={(e) => onChange('jornadaTrabalho', e.target.value)}
          placeholder="Ex: 44h semanais"
          required
          disabled={readonly}
        />
      </Grid>

      <Grid item xs={12} md={2}>
        <TextField
          fullWidth
          type="time"
          label="Horário Entrada"
          value={dados.horarioEntrada || ''}
          onChange={(e) => onChange('horarioEntrada', e.target.value)}
          InputLabelProps={{ shrink: true }}
          required
          disabled={readonly}
        />
      </Grid>

      <Grid item xs={12} md={2}>
        <TextField
          fullWidth
          type="time"
          label="Horário Saída"
          value={dados.horarioSaida || ''}
          onChange={(e) => onChange('horarioSaida', e.target.value)}
          InputLabelProps={{ shrink: true }}
          required
          disabled={readonly}
        />
      </Grid>

      {onFileUpload && !readonly && (
        <Grid item xs={12}>
          <FileUpload
            label="Upload do Contrato"
            accept=".pdf,.doc,.docx"
            onFilesSelected={onFileUpload}
          />
        </Grid>
      )}
    </Grid>
  );
};

