import React, { useState } from 'react';
import {
  Box,
  Grid,
  TextField,
  Button,
  Typography,
  Autocomplete,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Alert,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { TipoTreinamento, ColaboradorAgendado } from '../../types/treinamentos';

interface AgendamentoMassaProps {
  tiposTreinamento: TipoTreinamento[];
  colaboradoresDisponiveis: any[]; // Lista de colaboradores
  onAgendar: (agendamento: any) => Promise<void>;
}

export const AgendamentoMassa: React.FC<AgendamentoMassaProps> = ({
  tiposTreinamento,
  colaboradoresDisponiveis,
  onAgendar,
}) => {
  const [tipoSelecionado, setTipoSelecionado] = useState<TipoTreinamento | null>(null);
  const [colaboradoresSelecionados, setColaboradoresSelecionados] = useState<any[]>([]);
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  const [horario, setHorario] = useState('');
  const [local, setLocal] = useState('');
  const [instrutor, setInstrutor] = useState('');
  const [instituicao, setInstituicao] = useState('');
  const [vagasTotal, setVagasTotal] = useState(0);
  const [erro, setErro] = useState('');

  const handleAdicionarColaborador = (colaborador: any) => {
    if (colaboradoresSelecionados.find((c) => c.id === colaborador.id)) {
      setErro('Colaborador já adicionado');
      return;
    }

    if (colaboradoresSelecionados.length >= vagasTotal && vagasTotal > 0) {
      setErro(`Número máximo de vagas (${vagasTotal}) atingido`);
      return;
    }

    setColaboradoresSelecionados([...colaboradoresSelecionados, colaborador]);
    setErro('');
  };

  const handleRemoverColaborador = (colaboradorId: string) => {
    setColaboradoresSelecionados(
      colaboradoresSelecionados.filter((c) => c.id !== colaboradorId)
    );
  };

  const handleSubmit = async () => {
    if (!tipoSelecionado) {
      setErro('Selecione um tipo de treinamento');
      return;
    }

    if (colaboradoresSelecionados.length === 0) {
      setErro('Adicione pelo menos um colaborador');
      return;
    }

    if (!dataInicio || !dataFim || !horario || !local || !instrutor) {
      setErro('Preencha todos os campos obrigatórios');
      return;
    }

    const agendamento = {
      tipoTreinamentoId: tipoSelecionado.id,
      tipoTreinamentoNome: tipoSelecionado.nome,
      dataInicio,
      dataFim,
      horario,
      local,
      instrutor,
      instituicao,
      vagasTotal: vagasTotal || colaboradoresSelecionados.length,
      colaboradores: colaboradoresSelecionados.map((c) => ({
        colaboradorId: c.id,
        colaboradorNome: c.nome,
        departamento: c.departamento || '',
        cargo: c.cargo || '',
        confirmado: false,
      })),
    };

    try {
      await onAgendar(agendamento);
      handleLimpar();
    } catch (error: any) {
      setErro(error.message || 'Erro ao agendar treinamento');
    }
  };

  const handleLimpar = () => {
    setTipoSelecionado(null);
    setColaboradoresSelecionados([]);
    setDataInicio('');
    setDataFim('');
    setHorario('');
    setLocal('');
    setInstrutor('');
    setInstituicao('');
    setVagasTotal(0);
    setErro('');
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Agendar Treinamento em Massa
      </Typography>

      {erro && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {erro}
        </Alert>
      )}

      <Grid container spacing={2}>
        <Grid item xs={12} md={8}>
          <Autocomplete
            options={tiposTreinamento}
            getOptionLabel={(option) => `${option.nome} - ${option.categoria}`}
            value={tipoSelecionado}
            onChange={(_, newValue) => setTipoSelecionado(newValue)}
            renderInput={(params) => (
              <TextField {...params} label="Tipo de Treinamento" required />
            )}
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            type="number"
            label="Vagas Totais"
            value={vagasTotal || ''}
            onChange={(e) => setVagasTotal(parseInt(e.target.value) || 0)}
            inputProps={{ min: 0 }}
            helperText="0 = ilimitado"
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            type="date"
            label="Data de Início"
            value={dataInicio}
            onChange={(e) => setDataInicio(e.target.value)}
            InputLabelProps={{ shrink: true }}
            required
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            type="date"
            label="Data de Fim"
            value={dataFim}
            onChange={(e) => setDataFim(e.target.value)}
            InputLabelProps={{ shrink: true }}
            required
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            type="time"
            label="Horário"
            value={horario}
            onChange={(e) => setHorario(e.target.value)}
            InputLabelProps={{ shrink: true }}
            required
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Local"
            value={local}
            onChange={(e) => setLocal(e.target.value)}
            required
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Instrutor"
            value={instrutor}
            onChange={(e) => setInstrutor(e.target.value)}
            required
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Instituição (opcional)"
            value={instituicao}
            onChange={(e) => setInstituicao(e.target.value)}
          />
        </Grid>

        <Grid item xs={12}>
          <Typography variant="subtitle1" gutterBottom>
            Adicionar Colaboradores
          </Typography>
          <Autocomplete
            options={colaboradoresDisponiveis}
            getOptionLabel={(option) => `${option.nome} - ${option.departamento}`}
            onChange={(_, newValue) => newValue && handleAdicionarColaborador(newValue)}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Buscar Colaborador"
                placeholder="Digite o nome..."
              />
            )}
          />
        </Grid>

        <Grid item xs={12}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={2}
          >
            <Typography variant="subtitle2">
              Colaboradores Selecionados ({colaboradoresSelecionados.length}
              {vagasTotal > 0 && ` / ${vagasTotal}`})
            </Typography>
          </Box>

          {colaboradoresSelecionados.length > 0 ? (
            <TableContainer component={Paper} variant="outlined">
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Nome</TableCell>
                    <TableCell>Departamento</TableCell>
                    <TableCell>Cargo</TableCell>
                    <TableCell align="right">Ações</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {colaboradoresSelecionados.map((colaborador) => (
                    <TableRow key={colaborador.id}>
                      <TableCell>{colaborador.nome}</TableCell>
                      <TableCell>{colaborador.departamento || '-'}</TableCell>
                      <TableCell>{colaborador.cargo || '-'}</TableCell>
                      <TableCell align="right">
                        <IconButton
                          size="small"
                          onClick={() => handleRemoverColaborador(colaborador.id)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Alert severity="info">
              Nenhum colaborador selecionado. Use o campo acima para adicionar.
            </Alert>
          )}
        </Grid>

        <Grid item xs={12}>
          <Box display="flex" gap={2} justifyContent="flex-end">
            <Button variant="outlined" onClick={handleLimpar}>
              Limpar
            </Button>
            <Button variant="contained" onClick={handleSubmit}>
              Agendar Treinamento
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

