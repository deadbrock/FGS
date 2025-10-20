import React from 'react';
import {
  Card,
  CardContent,
  Grid,
  TextField,
  Button,
  Autocomplete,
  Chip,
} from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import { FiltrosRelatorio as FiltrosRelatorioType } from '../../types/relatorios';

interface FiltrosRelatorioProps {
  filtros: FiltrosRelatorioType;
  onChangeFiltros: (filtros: FiltrosRelatorioType) => void;
  onAplicar: () => void;
}

const setoresMock = ['TI', 'RH', 'Vendas', 'Operações', 'Financeiro'];
const funcoesMock = ['Analista', 'Gerente', 'Coordenador', 'Assistente', 'Diretor'];
const unidadesMock = ['Matriz', 'Filial SP', 'Filial RJ', 'Filial BH'];

export const FiltrosRelatorio: React.FC<FiltrosRelatorioProps> = ({
  filtros,
  onChangeFiltros,
  onAplicar,
}) => {
  return (
    <Card>
      <CardContent>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              type="date"
              label="Data Início"
              value={filtros.dataInicio || ''}
              onChange={(e) => onChangeFiltros({ ...filtros, dataInicio: e.target.value })}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              type="date"
              label="Data Fim"
              value={filtros.dataFim || ''}
              onChange={(e) => onChangeFiltros({ ...filtros, dataFim: e.target.value })}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          <Grid item xs={12} md={2}>
            <Autocomplete
              multiple
              options={setoresMock}
              value={filtros.setores || []}
              onChange={(_, newValue) => onChangeFiltros({ ...filtros, setores: newValue })}
              renderInput={(params) => <TextField {...params} label="Setores" />}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip key={option} label={option} {...getTagProps({ index })} size="small" />
                ))
              }
            />
          </Grid>

          <Grid item xs={12} md={2}>
            <Autocomplete
              multiple
              options={funcoesMock}
              value={filtros.funcoes || []}
              onChange={(_, newValue) => onChangeFiltros({ ...filtros, funcoes: newValue })}
              renderInput={(params) => <TextField {...params} label="Funções" />}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip key={option} label={option} {...getTagProps({ index })} size="small" />
                ))
              }
            />
          </Grid>

          <Grid item xs={12} md={2}>
            <Button
              fullWidth
              variant="contained"
              startIcon={<FilterListIcon />}
              onClick={onAplicar}
            >
              Aplicar
            </Button>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

