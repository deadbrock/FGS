import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  MenuItem,
  FormControlLabel,
  Checkbox,
  InputAdornment,
} from '@mui/material';
import {
  Beneficio,
  TipoBeneficio,
  StatusBeneficio,
  FrequenciaBeneficio,
  TipoValor,
} from '../../types/beneficios';
import { getTipoNome, getFrequenciaNome } from '../../utils/beneficiosUtils';

interface BeneficioFormProps {
  open: boolean;
  beneficio?: Beneficio;
  onClose: () => void;
  onSave: (beneficio: Partial<Beneficio>) => void;
}

const defaultFormData: Partial<Beneficio> = {
  tipo: TipoBeneficio.VALE_REFEICAO,
  tipoValor: TipoValor.VALOR_FIXO,
  frequencia: FrequenciaBeneficio.MENSAL,
  status: StatusBeneficio.ATIVO,
  exigeComprovacao: false,
  custoEmpresa: 0,
  custoColaborador: 0,
};

export const BeneficioForm: React.FC<BeneficioFormProps> = ({
  open,
  beneficio,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState<Partial<Beneficio>>(defaultFormData);

  // Atualizar formData quando o beneficio mudar ou o modal abrir
  useEffect(() => {
    if (open) {
      if (beneficio) {
        setFormData(beneficio);
      } else {
        setFormData(defaultFormData);
      }
    }
  }, [open, beneficio]);

  const handleSubmit = () => {
    onSave(formData);
    onClose();
  };

  const tipos = Object.values(TipoBeneficio);
  const frequencias = Object.values(FrequenciaBeneficio);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {beneficio ? 'Editar Benefício' : 'Novo Benefício'}
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12} md={6}>
            <TextField
              select
              fullWidth
              label="Tipo de Benefício"
              value={formData.tipo || ''}
              onChange={(e) => setFormData({ ...formData, tipo: e.target.value as TipoBeneficio })}
            >
              {tipos.map((tipo) => (
                <MenuItem key={tipo} value={tipo}>
                  {getTipoNome(tipo)}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Nome do Benefício"
              value={formData.nome || ''}
              onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={2}
              label="Descrição"
              value={formData.descricao || ''}
              onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Fornecedor"
              placeholder="Ex: Alelo, Sodexo, Unimed"
              value={formData.fornecedor || ''}
              onChange={(e) => setFormData({ ...formData, fornecedor: e.target.value })}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              select
              fullWidth
              label="Tipo de Valor"
              value={formData.tipoValor || ''}
              onChange={(e) => setFormData({ ...formData, tipoValor: e.target.value as TipoValor })}
            >
              <MenuItem value={TipoValor.VALOR_FIXO}>Valor Fixo</MenuItem>
              <MenuItem value={TipoValor.PERCENTUAL_SALARIO}>% do Salário</MenuItem>
              <MenuItem value={TipoValor.VARIAVEL}>Variável</MenuItem>
            </TextField>
          </Grid>

          {formData.tipoValor === TipoValor.VALOR_FIXO && (
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="number"
                label="Valor Fixo"
                value={formData.valorFixo || ''}
                onChange={(e) => setFormData({ ...formData, valorFixo: Number(e.target.value) })}
                InputProps={{
                  startAdornment: <InputAdornment position="start">R$</InputAdornment>,
                }}
              />
            </Grid>
          )}

          {formData.tipoValor === TipoValor.PERCENTUAL_SALARIO && (
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="number"
                label="Percentual do Salário"
                value={formData.percentualSalario || ''}
                onChange={(e) => setFormData({ ...formData, percentualSalario: Number(e.target.value) })}
                InputProps={{
                  endAdornment: <InputAdornment position="end">%</InputAdornment>,
                }}
              />
            </Grid>
          )}

          <Grid item xs={12} md={6}>
            <TextField
              select
              fullWidth
              label="Frequência"
              value={formData.frequencia || ''}
              onChange={(e) => setFormData({ ...formData, frequencia: e.target.value as FrequenciaBeneficio })}
            >
              {frequencias.map((freq) => (
                <MenuItem key={freq} value={freq}>
                  {getFrequenciaNome(freq)}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              type="number"
              label="Custo Empresa"
              value={formData.custoEmpresa || ''}
              onChange={(e) => setFormData({ ...formData, custoEmpresa: Number(e.target.value) })}
              InputProps={{
                startAdornment: <InputAdornment position="start">R$</InputAdornment>,
              }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              type="number"
              label="Custo Colaborador"
              value={formData.custoColaborador || ''}
              onChange={(e) => setFormData({ ...formData, custoColaborador: Number(e.target.value) })}
              InputProps={{
                startAdornment: <InputAdornment position="start">R$</InputAdornment>,
              }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              type="date"
              label="Data Início"
              value={formData.dataInicio || ''}
              onChange={(e) => setFormData({ ...formData, dataInicio: e.target.value })}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.exigeComprovacao || false}
                  onChange={(e) => setFormData({ ...formData, exigeComprovacao: e.target.checked })}
                />
              }
              label="Exige Comprovação"
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button variant="contained" onClick={handleSubmit}>
          Salvar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

