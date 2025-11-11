import React from 'react';
import { Grid, TextField, MenuItem, InputAdornment } from '@mui/material';
import { DadosContratuais } from '../../types/prontuario';
import { FileUpload } from '../FileUpload';

interface DadosContratuaisFormProps {
  dados?: Partial<DadosContratuais>;
  onChange: (campo: string, valor: any) => void;
  onFileUpload?: (files: File[]) => void;
  readonly?: boolean;
}

export const DadosContratuaisForm: React.FC<DadosContratuaisFormProps> = ({
  dados = {},
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
          select
          label="Local de Trabalho (Estado)"
          value={dados.localTrabalho || ''}
          onChange={(e) => onChange('localTrabalho', e.target.value)}
          required
          disabled={readonly}
          helperText="Estado onde o colaborador atua"
        >
          <MenuItem value="">Selecione o Estado</MenuItem>
          <MenuItem value="AC">AC - Acre</MenuItem>
          <MenuItem value="AL">AL - Alagoas</MenuItem>
          <MenuItem value="AP">AP - Amapá</MenuItem>
          <MenuItem value="AM">AM - Amazonas</MenuItem>
          <MenuItem value="BA">BA - Bahia</MenuItem>
          <MenuItem value="CE">CE - Ceará</MenuItem>
          <MenuItem value="DF">DF - Distrito Federal</MenuItem>
          <MenuItem value="ES">ES - Espírito Santo</MenuItem>
          <MenuItem value="GO">GO - Goiás</MenuItem>
          <MenuItem value="MA">MA - Maranhão</MenuItem>
          <MenuItem value="MT">MT - Mato Grosso</MenuItem>
          <MenuItem value="MS">MS - Mato Grosso do Sul</MenuItem>
          <MenuItem value="MG">MG - Minas Gerais</MenuItem>
          <MenuItem value="PA">PA - Pará</MenuItem>
          <MenuItem value="PB">PB - Paraíba</MenuItem>
          <MenuItem value="PR">PR - Paraná</MenuItem>
          <MenuItem value="PE">PE - Pernambuco</MenuItem>
          <MenuItem value="PI">PI - Piauí</MenuItem>
          <MenuItem value="RJ">RJ - Rio de Janeiro</MenuItem>
          <MenuItem value="RN">RN - Rio Grande do Norte</MenuItem>
          <MenuItem value="RS">RS - Rio Grande do Sul</MenuItem>
          <MenuItem value="RO">RO - Rondônia</MenuItem>
          <MenuItem value="RR">RR - Roraima</MenuItem>
          <MenuItem value="SC">SC - Santa Catarina</MenuItem>
          <MenuItem value="SP">SP - São Paulo</MenuItem>
          <MenuItem value="SE">SE - Sergipe</MenuItem>
          <MenuItem value="TO">TO - Tocantins</MenuItem>
        </TextField>
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

