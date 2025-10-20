import React from 'react';
import { Grid, TextField, MenuItem, FormControlLabel, Switch } from '@mui/material';
import { TipoTreinamento } from '../../types/treinamentos';

interface TipoTreinamentoFormProps {
  dados: Partial<TipoTreinamento>;
  onChange: (campo: string, valor: any) => void;
  readonly?: boolean;
}

export const TipoTreinamentoForm: React.FC<TipoTreinamentoFormProps> = ({
  dados,
  onChange,
  readonly = false,
}) => {
  const categorias = [
    'Segurança do Trabalho',
    'Técnico',
    'Comportamental',
    'Gestão',
    'Compliance',
    'Tecnologia',
    'Operacional',
    'Outro',
  ];

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={8}>
        <TextField
          fullWidth
          label="Nome do Treinamento"
          value={dados.nome || ''}
          onChange={(e) => onChange('nome', e.target.value)}
          required
          disabled={readonly}
          placeholder="Ex: NR-10, Primeiros Socorros, Excel Avançado"
        />
      </Grid>

      <Grid item xs={12} md={4}>
        <TextField
          fullWidth
          select
          label="Categoria"
          value={dados.categoria || ''}
          onChange={(e) => onChange('categoria', e.target.value)}
          required
          disabled={readonly}
        >
          {categorias.map((cat) => (
            <MenuItem key={cat} value={cat}>
              {cat}
            </MenuItem>
          ))}
        </TextField>
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
          placeholder="Descreva o conteúdo e objetivos do treinamento"
        />
      </Grid>

      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          type="number"
          label="Carga Horária (horas)"
          value={dados.cargaHoraria || ''}
          onChange={(e) => onChange('cargaHoraria', parseInt(e.target.value))}
          required
          disabled={readonly}
          inputProps={{ min: 1 }}
        />
      </Grid>

      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          type="number"
          label="Validade (dias)"
          value={dados.validadeDias || ''}
          onChange={(e) => onChange('validadeDias', parseInt(e.target.value))}
          required
          disabled={readonly}
          helperText="0 = sem validade, treinamento permanente"
          inputProps={{ min: 0 }}
        />
      </Grid>

      <Grid item xs={12} md={6}>
        <FormControlLabel
          control={
            <Switch
              checked={dados.obrigatorio || false}
              onChange={(e) => onChange('obrigatorio', e.target.checked)}
              disabled={readonly}
            />
          }
          label="Treinamento Obrigatório"
        />
      </Grid>

      <Grid item xs={12} md={6}>
        <FormControlLabel
          control={
            <Switch
              checked={dados.ativo !== false}
              onChange={(e) => onChange('ativo', e.target.checked)}
              disabled={readonly}
            />
          }
          label="Ativo"
        />
      </Grid>
    </Grid>
  );
};

