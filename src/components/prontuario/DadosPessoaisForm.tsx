import React from 'react';
import { Grid, TextField, MenuItem } from '@mui/material';
import { DadosPessoais } from '../../types/prontuario';

interface DadosPessoaisFormProps {
  dados?: Partial<DadosPessoais>;
  onChange: (campo: string, valor: any) => void;
  readonly?: boolean;
}

export const DadosPessoaisForm: React.FC<DadosPessoaisFormProps> = ({
  dados = {},
  onChange,
  readonly = false,
}) => {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Nome Completo"
          value={dados?.nome || ''}
          onChange={(e) => onChange('nome', e.target.value)}
          required
          disabled={readonly}
        />
      </Grid>

      <Grid item xs={12} md={3}>
        <TextField
          fullWidth
          label="CPF"
          value={dados.cpf || ''}
          onChange={(e) => onChange('cpf', e.target.value)}
          required
          disabled={readonly}
        />
      </Grid>

      <Grid item xs={12} md={3}>
        <TextField
          fullWidth
          label="RG"
          value={dados.rg || ''}
          onChange={(e) => onChange('rg', e.target.value)}
          required
          disabled={readonly}
        />
      </Grid>

      <Grid item xs={12} md={4}>
        <TextField
          fullWidth
          type="date"
          label="Data de Nascimento"
          value={dados.dataNascimento || ''}
          onChange={(e) => onChange('dataNascimento', e.target.value)}
          InputLabelProps={{ shrink: true }}
          required
          disabled={readonly}
        />
      </Grid>

      <Grid item xs={12} md={4}>
        <TextField
          fullWidth
          select
          label="Sexo"
          value={dados.sexo || ''}
          onChange={(e) => onChange('sexo', e.target.value)}
          required
          disabled={readonly}
        >
          <MenuItem value="M">Masculino</MenuItem>
          <MenuItem value="F">Feminino</MenuItem>
          <MenuItem value="Outro">Outro</MenuItem>
        </TextField>
      </Grid>

      <Grid item xs={12} md={4}>
        <TextField
          fullWidth
          select
          label="Estado Civil"
          value={dados.estadoCivil || ''}
          onChange={(e) => onChange('estadoCivil', e.target.value)}
          required
          disabled={readonly}
        >
          <MenuItem value="Solteiro(a)">Solteiro(a)</MenuItem>
          <MenuItem value="Casado(a)">Casado(a)</MenuItem>
          <MenuItem value="Divorciado(a)">Divorciado(a)</MenuItem>
          <MenuItem value="Viúvo(a)">Viúvo(a)</MenuItem>
          <MenuItem value="União Estável">União Estável</MenuItem>
        </TextField>
      </Grid>

      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Nacionalidade"
          value={dados.nacionalidade || ''}
          onChange={(e) => onChange('nacionalidade', e.target.value)}
          required
          disabled={readonly}
        />
      </Grid>

      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Naturalidade"
          value={dados.naturalidade || ''}
          onChange={(e) => onChange('naturalidade', e.target.value)}
          required
          disabled={readonly}
        />
      </Grid>

      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Nome da Mãe"
          value={dados.nomeMae || ''}
          onChange={(e) => onChange('nomeMae', e.target.value)}
          required
          disabled={readonly}
        />
      </Grid>

      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Nome do Pai"
          value={dados.nomePai || ''}
          onChange={(e) => onChange('nomePai', e.target.value)}
          disabled={readonly}
        />
      </Grid>

      <Grid item xs={12} md={4}>
        <TextField
          fullWidth
          label="Telefone"
          value={dados.telefone || ''}
          onChange={(e) => onChange('telefone', e.target.value)}
          disabled={readonly}
        />
      </Grid>

      <Grid item xs={12} md={4}>
        <TextField
          fullWidth
          label="Celular"
          value={dados.celular || ''}
          onChange={(e) => onChange('celular', e.target.value)}
          required
          disabled={readonly}
        />
      </Grid>

      <Grid item xs={12} md={4}>
        <TextField
          fullWidth
          type="email"
          label="E-mail"
          value={dados.email || ''}
          onChange={(e) => onChange('email', e.target.value)}
          required
          disabled={readonly}
        />
      </Grid>

      <Grid item xs={12} md={4}>
        <TextField
          fullWidth
          label="WhatsApp"
          value={dados.whatsapp || ''}
          onChange={(e) => onChange('whatsapp', e.target.value)}
          placeholder="(00) 00000-0000"
          disabled={readonly}
        />
      </Grid>

      <Grid item xs={12} md={4}>
        <TextField
          fullWidth
          select
          label="Escolaridade"
          value={dados.escolaridade || ''}
          onChange={(e) => onChange('escolaridade', e.target.value)}
          disabled={readonly}
        >
          <MenuItem value="">Selecione...</MenuItem>
          <MenuItem value="Fundamental Incompleto">Fundamental Incompleto</MenuItem>
          <MenuItem value="Fundamental Completo">Fundamental Completo</MenuItem>
          <MenuItem value="Médio Incompleto">Médio Incompleto</MenuItem>
          <MenuItem value="Médio Completo">Médio Completo</MenuItem>
          <MenuItem value="Superior Incompleto">Superior Incompleto</MenuItem>
          <MenuItem value="Superior Completo">Superior Completo</MenuItem>
          <MenuItem value="Pós-graduação">Pós-graduação</MenuItem>
          <MenuItem value="Mestrado">Mestrado</MenuItem>
          <MenuItem value="Doutorado">Doutorado</MenuItem>
        </TextField>
      </Grid>

      {/* Endereço */}
      <Grid item xs={12}>
        <strong>Endereço</strong>
      </Grid>

      <Grid item xs={12} md={3}>
        <TextField
          fullWidth
          label="CEP"
          value={dados.endereco?.cep || ''}
          onChange={(e) => onChange('endereco.cep', e.target.value)}
          required
          disabled={readonly}
        />
      </Grid>

      <Grid item xs={12} md={7}>
        <TextField
          fullWidth
          label="Logradouro"
          value={dados.endereco?.logradouro || ''}
          onChange={(e) => onChange('endereco.logradouro', e.target.value)}
          required
          disabled={readonly}
        />
      </Grid>

      <Grid item xs={12} md={2}>
        <TextField
          fullWidth
          label="Número"
          value={dados.endereco?.numero || ''}
          onChange={(e) => onChange('endereco.numero', e.target.value)}
          required
          disabled={readonly}
        />
      </Grid>

      <Grid item xs={12} md={4}>
        <TextField
          fullWidth
          label="Complemento"
          value={dados.endereco?.complemento || ''}
          onChange={(e) => onChange('endereco.complemento', e.target.value)}
          disabled={readonly}
        />
      </Grid>

      <Grid item xs={12} md={4}>
        <TextField
          fullWidth
          label="Bairro"
          value={dados.endereco?.bairro || ''}
          onChange={(e) => onChange('endereco.bairro', e.target.value)}
          required
          disabled={readonly}
        />
      </Grid>

      <Grid item xs={12} md={3}>
        <TextField
          fullWidth
          label="Cidade"
          value={dados.endereco?.cidade || ''}
          onChange={(e) => onChange('endereco.cidade', e.target.value)}
          required
          disabled={readonly}
        />
      </Grid>

      <Grid item xs={12} md={1}>
        <TextField
          fullWidth
          label="UF"
          value={dados.endereco?.estado || ''}
          onChange={(e) => onChange('endereco.estado', e.target.value)}
          required
          disabled={readonly}
          inputProps={{ maxLength: 2 }}
        />
      </Grid>
    </Grid>
  );
};

