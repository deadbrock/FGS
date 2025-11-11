import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Grid,
  Box,
  IconButton,
  Typography,
  Divider,
  Alert,
  Chip,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SaveIcon from '@mui/icons-material/Save';
import {
  TipoEventoHistorico,
  TipoAdvertencia,
  EventoHistorico,
} from '../../types';
import prontuarioService from '../../services/prontuarioService.mock';
import { useAuth } from '../../hooks/useAuth';

interface AdicionarEventoModalProps {
  open: boolean;
  onClose: () => void;
  colaboradorId: string;
  onEventoAdicionado: () => void;
}

export const AdicionarEventoModal: React.FC<AdicionarEventoModalProps> = ({
  open,
  onClose,
  colaboradorId,
  onEventoAdicionado,
}) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Campos comuns
  const [tipoEvento, setTipoEvento] = useState<TipoEventoHistorico>(
    TipoEventoHistorico.TREINAMENTO
  );
  const [data, setData] = useState(new Date().toISOString().split('T')[0]);
  const [descricao, setDescricao] = useState('');
  const [observacoes, setObservacoes] = useState('');

  // Campos específicos - Atestado
  const [atestadoCid, setAtestadoCid] = useState('');
  const [atestadoDiasAfastamento, setAtestadoDiasAfastamento] = useState('');
  const [atestadoDataInicio, setAtestadoDataInicio] = useState('');
  const [atestadoDataFim, setAtestadoDataFim] = useState('');
  const [atestadoMedicoNome, setAtestadoMedicoNome] = useState('');
  const [atestadoMedicoCrm, setAtestadoMedicoCrm] = useState('');

  // Campos específicos - Advertência
  const [advertenciaTipo, setAdvertenciaTipo] = useState<TipoAdvertencia>(
    TipoAdvertencia.VERBAL
  );
  const [advertenciaMotivo, setAdvertenciaMotivo] = useState('');
  const [advertenciaGravidade, setAdvertenciaGravidade] = useState<'LEVE' | 'MEDIA' | 'GRAVE'>(
    'LEVE'
  );
  const [advertenciaTestemunhas, setAdvertenciaTestemunhas] = useState('');

  // Campos específicos - Férias
  const [feriasDataInicio, setFeriasDataInicio] = useState('');
  const [feriasDataFim, setFeriasDataFim] = useState('');
  const [feriasDiasCorridos, setFeriasDiasCorridos] = useState('');
  const [feriasPeriodoAquisitivo, setFeriasPeriodoAquisitivo] = useState('');

  // Campos específicos - Promoção
  const [promocaoCargoAnterior, setPromocaoCargoAnterior] = useState('');
  const [promocaoCargoNovo, setPromocaoCargoNovo] = useState('');
  const [promocaoSalarioAnterior, setPromocaoSalarioAnterior] = useState('');
  const [promocaoSalarioNovo, setPromocaoSalarioNovo] = useState('');

  // Campos específicos - Transferência
  const [transferenciaDepartamentoOrigem, setTransferenciaDepartamentoOrigem] = useState('');
  const [transferenciaDepartamentoDestino, setTransferenciaDepartamentoDestino] = useState('');
  const [transferenciaMotivo, setTransferenciaMotivo] = useState('');

  // Campos específicos - Demissão
  const [demissaoMotivo, setDemissaoMotivo] = useState('');
  const [demissaoTipo, setDemissaoTipo] = useState<
    'VOLUNTARIA' | 'SEM_JUSTA_CAUSA' | 'JUSTA_CAUSA' | 'ACORDO'
  >('ACORDO');
  const [demissaoDataAviso, setDemissaoDataAviso] = useState('');

  const handleSubmit = async () => {
    if (!descricao.trim()) {
      setError('A descrição é obrigatória');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const eventoBase: Omit<EventoHistorico, 'id'> = {
        colaboradorId,
        tipo: tipoEvento,
        data: new Date(data),
        descricao,
        observacoes: observacoes || undefined,
        registradoPor: user?.id || '1',
        registradoPorNome: user?.nome || 'Sistema',
      };

      // Adicionar campos específicos baseado no tipo
      switch (tipoEvento) {
        case TipoEventoHistorico.ATESTADO:
          if (atestadoDataInicio && atestadoDataFim && atestadoDiasAfastamento) {
            eventoBase.atestado = {
              cid: atestadoCid || undefined,
              diasAfastamento: parseInt(atestadoDiasAfastamento),
              dataInicio: new Date(atestadoDataInicio),
              dataFim: new Date(atestadoDataFim),
              medicoNome: atestadoMedicoNome || undefined,
              medicoCrm: atestadoMedicoCrm || undefined,
            };
          } else {
            setError('Preencha todos os campos obrigatórios do atestado');
            return;
          }
          break;

        case TipoEventoHistorico.ADVERTENCIA:
          if (advertenciaMotivo) {
            eventoBase.advertencia = {
              tipo: advertenciaTipo,
              motivo: advertenciaMotivo,
              gravidade: advertenciaGravidade,
              testemunhas: advertenciaTestemunhas
                ? advertenciaTestemunhas.split(',').map((t) => t.trim())
                : undefined,
            };
          } else {
            setError('O motivo da advertência é obrigatório');
            return;
          }
          break;

        case TipoEventoHistorico.FERIAS:
          if (feriasDataInicio && feriasDataFim && feriasDiasCorridos && feriasPeriodoAquisitivo) {
            eventoBase.ferias = {
              dataInicio: new Date(feriasDataInicio),
              dataFim: new Date(feriasDataFim),
              diasCorridos: parseInt(feriasDiasCorridos),
              periodoAquisitivo: feriasPeriodoAquisitivo,
            };
          } else {
            setError('Preencha todos os campos obrigatórios das férias');
            return;
          }
          break;

        case TipoEventoHistorico.PROMOCAO:
          if (promocaoCargoAnterior && promocaoCargoNovo) {
            eventoBase.promocao = {
              cargoAnterior: promocaoCargoAnterior,
              cargoNovo: promocaoCargoNovo,
              salarioAnterior: promocaoSalarioAnterior
                ? parseFloat(promocaoSalarioAnterior)
                : undefined,
              salarioNovo: promocaoSalarioNovo ? parseFloat(promocaoSalarioNovo) : undefined,
            };
          } else {
            setError('Preencha os cargos anterior e novo');
            return;
          }
          break;

        case TipoEventoHistorico.TRANSFERENCIA:
          if (transferenciaDepartamentoOrigem && transferenciaDepartamentoDestino) {
            eventoBase.transferencia = {
              departamentoOrigem: transferenciaDepartamentoOrigem,
              departamentoDestino: transferenciaDepartamentoDestino,
              motivoTransferencia: transferenciaMotivo || undefined,
            };
          } else {
            setError('Preencha os departamentos de origem e destino');
            return;
          }
          break;

        case TipoEventoHistorico.DEMISSAO:
          if (demissaoMotivo) {
            eventoBase.demissao = {
              motivoDemissao: demissaoMotivo,
              tipoDemissao: demissaoTipo,
              dataAviso: demissaoDataAviso ? new Date(demissaoDataAviso) : undefined,
            };
          } else {
            setError('O motivo da demissão é obrigatório');
            return;
          }
          break;
      }

      await prontuarioService.adicionarEvento(eventoBase);
      onEventoAdicionado();
      handleClose();
    } catch (err) {
      setError('Erro ao adicionar evento. Tente novamente.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    // Resetar todos os campos
    setTipoEvento(TipoEventoHistorico.TREINAMENTO);
    setData(new Date().toISOString().split('T')[0]);
    setDescricao('');
    setObservacoes('');
    setError('');
    
    // Resetar campos específicos
    setAtestadoCid('');
    setAtestadoDiasAfastamento('');
    setAtestadoDataInicio('');
    setAtestadoDataFim('');
    setAtestadoMedicoNome('');
    setAtestadoMedicoCrm('');
    
    setAdvertenciaTipo(TipoAdvertencia.VERBAL);
    setAdvertenciaMotivo('');
    setAdvertenciaGravidade('LEVE');
    setAdvertenciaTestemunhas('');
    
    setFeriasDataInicio('');
    setFeriasDataFim('');
    setFeriasDiasCorridos('');
    setFeriasPeriodoAquisitivo('');
    
    setPromocaoCargoAnterior('');
    setPromocaoCargoNovo('');
    setPromocaoSalarioAnterior('');
    setPromocaoSalarioNovo('');
    
    setTransferenciaDepartamentoOrigem('');
    setTransferenciaDepartamentoDestino('');
    setTransferenciaMotivo('');
    
    setDemissaoMotivo('');
    setDemissaoTipo('ACORDO');
    setDemissaoDataAviso('');
    
    onClose();
  };

  const renderCamposEspecificos = () => {
    switch (tipoEvento) {
      case TipoEventoHistorico.ATESTADO:
        return (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }}>
                <Chip label="Dados do Atestado" />
              </Divider>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="CID (opcional)"
                value={atestadoCid}
                onChange={(e) => setAtestadoCid(e.target.value)}
                placeholder="Ex: J11"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Dias de Afastamento *"
                type="number"
                value={atestadoDiasAfastamento}
                onChange={(e) => setAtestadoDiasAfastamento(e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Data Início *"
                type="date"
                value={atestadoDataInicio}
                onChange={(e) => setAtestadoDataInicio(e.target.value)}
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Data Fim *"
                type="date"
                value={atestadoDataFim}
                onChange={(e) => setAtestadoDataFim(e.target.value)}
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Nome do Médico (opcional)"
                value={atestadoMedicoNome}
                onChange={(e) => setAtestadoMedicoNome(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="CRM do Médico (opcional)"
                value={atestadoMedicoCrm}
                onChange={(e) => setAtestadoMedicoCrm(e.target.value)}
                placeholder="Ex: 123456-SP"
              />
            </Grid>
          </Grid>
        );

      case TipoEventoHistorico.ADVERTENCIA:
        return (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }}>
                <Chip label="Dados da Advertência" color="error" />
              </Divider>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                label="Tipo de Advertência *"
                value={advertenciaTipo}
                onChange={(e) => setAdvertenciaTipo(e.target.value as TipoAdvertencia)}
                required
              >
                <MenuItem value={TipoAdvertencia.VERBAL}>Verbal</MenuItem>
                <MenuItem value={TipoAdvertencia.ESCRITA}>Escrita</MenuItem>
                <MenuItem value={TipoAdvertencia.SUSPENSAO}>Suspensão</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                label="Gravidade *"
                value={advertenciaGravidade}
                onChange={(e) => setAdvertenciaGravidade(e.target.value as any)}
                required
              >
                <MenuItem value="LEVE">Leve</MenuItem>
                <MenuItem value="MEDIA">Média</MenuItem>
                <MenuItem value="GRAVE">Grave</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Motivo *"
                value={advertenciaMotivo}
                onChange={(e) => setAdvertenciaMotivo(e.target.value)}
                multiline
                rows={3}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Testemunhas (separadas por vírgula)"
                value={advertenciaTestemunhas}
                onChange={(e) => setAdvertenciaTestemunhas(e.target.value)}
                placeholder="Ex: João Silva, Maria Santos"
              />
            </Grid>
          </Grid>
        );

      case TipoEventoHistorico.FERIAS:
        return (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }}>
                <Chip label="Dados das Férias" color="info" />
              </Divider>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Data Início *"
                type="date"
                value={feriasDataInicio}
                onChange={(e) => setFeriasDataInicio(e.target.value)}
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Data Fim *"
                type="date"
                value={feriasDataFim}
                onChange={(e) => setFeriasDataFim(e.target.value)}
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Dias Corridos *"
                type="number"
                value={feriasDiasCorridos}
                onChange={(e) => setFeriasDiasCorridos(e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Período Aquisitivo *"
                value={feriasPeriodoAquisitivo}
                onChange={(e) => setFeriasPeriodoAquisitivo(e.target.value)}
                placeholder="Ex: 2023-2024"
                required
              />
            </Grid>
          </Grid>
        );

      case TipoEventoHistorico.PROMOCAO:
        return (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }}>
                <Chip label="Dados da Promoção" color="success" />
              </Divider>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Cargo Anterior *"
                value={promocaoCargoAnterior}
                onChange={(e) => setPromocaoCargoAnterior(e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Cargo Novo *"
                value={promocaoCargoNovo}
                onChange={(e) => setPromocaoCargoNovo(e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Salário Anterior (opcional)"
                type="number"
                value={promocaoSalarioAnterior}
                onChange={(e) => setPromocaoSalarioAnterior(e.target.value)}
                InputProps={{
                  startAdornment: 'R$',
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Salário Novo (opcional)"
                type="number"
                value={promocaoSalarioNovo}
                onChange={(e) => setPromocaoSalarioNovo(e.target.value)}
                InputProps={{
                  startAdornment: 'R$',
                }}
              />
            </Grid>
          </Grid>
        );

      case TipoEventoHistorico.TRANSFERENCIA:
        return (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }}>
                <Chip label="Dados da Transferência" color="primary" />
              </Divider>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Departamento de Origem *"
                value={transferenciaDepartamentoOrigem}
                onChange={(e) => setTransferenciaDepartamentoOrigem(e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Departamento de Destino *"
                value={transferenciaDepartamentoDestino}
                onChange={(e) => setTransferenciaDepartamentoDestino(e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Motivo da Transferência (opcional)"
                value={transferenciaMotivo}
                onChange={(e) => setTransferenciaMotivo(e.target.value)}
                multiline
                rows={2}
              />
            </Grid>
          </Grid>
        );

      case TipoEventoHistorico.DEMISSAO:
        return (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }}>
                <Chip label="Dados da Demissão - ENCERRAMENTO DO CICLO" color="error" />
              </Divider>
              <Alert severity="warning" sx={{ mb: 2 }}>
                Este evento marca o fim do ciclo do colaborador na empresa
              </Alert>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                label="Tipo de Demissão *"
                value={demissaoTipo}
                onChange={(e) => setDemissaoTipo(e.target.value as any)}
                required
              >
                <MenuItem value="VOLUNTARIA">Voluntária</MenuItem>
                <MenuItem value="SEM_JUSTA_CAUSA">Sem Justa Causa</MenuItem>
                <MenuItem value="JUSTA_CAUSA">Justa Causa</MenuItem>
                <MenuItem value="ACORDO">Acordo</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Data do Aviso Prévio (opcional)"
                type="date"
                value={demissaoDataAviso}
                onChange={(e) => setDemissaoDataAviso(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Motivo da Demissão *"
                value={demissaoMotivo}
                onChange={(e) => setDemissaoMotivo(e.target.value)}
                multiline
                rows={3}
                required
              />
            </Grid>
          </Grid>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 3 },
      }}
    >
      <DialogTitle
        sx={{
          background: 'linear-gradient(135deg, #a2122a 0%, #354a80 100%)',
          color: 'white',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography variant="h6" fontWeight={600}>
          ➕ Adicionar Evento ao Histórico
        </Typography>
        <IconButton onClick={handleClose} sx={{ color: 'white' }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ mt: 3 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Grid container spacing={2}>
          {/* Campos comuns */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              select
              label="Tipo de Evento *"
              value={tipoEvento}
              onChange={(e) => setTipoEvento(e.target.value as TipoEventoHistorico)}
              required
            >
              <MenuItem value={TipoEventoHistorico.ADMISSAO}>Admissão</MenuItem>
              <MenuItem value={TipoEventoHistorico.ATESTADO}>Atestado Médico</MenuItem>
              <MenuItem value={TipoEventoHistorico.ADVERTENCIA}>Advertência</MenuItem>
              <MenuItem value={TipoEventoHistorico.SUSPENSAO}>Suspensão</MenuItem>
              <MenuItem value={TipoEventoHistorico.PROMOCAO}>Promoção</MenuItem>
              <MenuItem value={TipoEventoHistorico.TRANSFERENCIA}>Transferência</MenuItem>
              <MenuItem value={TipoEventoHistorico.FERIAS}>Férias</MenuItem>
              <MenuItem value={TipoEventoHistorico.LICENCA}>Licença</MenuItem>
              <MenuItem value={TipoEventoHistorico.AFASTAMENTO}>Afastamento</MenuItem>
              <MenuItem value={TipoEventoHistorico.TREINAMENTO}>Treinamento</MenuItem>
              <MenuItem value={TipoEventoHistorico.ELOGIO}>Elogio</MenuItem>
              <MenuItem value={TipoEventoHistorico.DEMISSAO}>Demissão</MenuItem>
            </TextField>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Data do Evento *"
              type="date"
              value={data}
              onChange={(e) => setData(e.target.value)}
              InputLabelProps={{ shrink: true }}
              required
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Descrição *"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              multiline
              rows={2}
              required
              placeholder="Descreva brevemente o evento"
            />
          </Grid>

          {/* Campos específicos por tipo */}
          {renderCamposEspecificos()}

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Observações Adicionais (opcional)"
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
              multiline
              rows={2}
              placeholder="Informações complementares sobre o evento"
            />
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 2 }}>
        <Button onClick={handleClose} disabled={loading}>
          Cancelar
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          startIcon={<SaveIcon />}
          disabled={loading}
          sx={{
            background: 'linear-gradient(135deg, #a2122a 0%, #354a80 100%)',
          }}
        >
          {loading ? 'Salvando...' : 'Salvar Evento'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

