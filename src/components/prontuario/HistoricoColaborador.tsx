import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Chip,
  Button,
  Collapse,
  IconButton,
  Divider,
  Alert,
} from '@mui/material';
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineOppositeContent,
} from '@mui/lab';
import {
  WorkOutline as AdmissaoIcon,
  LocalHospital as AtestadoIcon,
  Warning as AdvertenciaIcon,
  TrendingUp as PromocaoIcon,
  BeachAccess as FeriasIcon,
  SwapHoriz as TransferenciaIcon,
  School as TreinamentoIcon,
  EmojiEvents as ElogioIcon,
  ExitToApp as DemissaoIcon,
  PersonOff as AfastamentoIcon,
  Block as SuspensaoIcon,
  Assignment as LicencaIcon,
  ExpandMore as ExpandMoreIcon,
  AttachFile as AttachFileIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { EventoHistorico, TipoEventoHistorico } from '../../types';
import prontuarioService from '../../services/prontuarioService.mock';
import { AdicionarEventoModal } from './AdicionarEventoModal';

interface HistoricoColaboradorProps {
  colaboradorId: string;
}

export const HistoricoColaborador: React.FC<HistoricoColaboradorProps> = ({
  colaboradorId,
}) => {
  const [eventos, setEventos] = useState<EventoHistorico[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedEventos, setExpandedEventos] = useState<Set<string>>(new Set());
  const [modalOpen, setModalOpen] = useState(false);

  // Carregar histórico
  const loadHistorico = async () => {
    try {
      setLoading(true);
      const data = await prontuarioService.getHistoricoColaborador(colaboradorId);
      setEventos(data);
    } catch (error) {
      console.error('Erro ao carregar histórico:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistorico();
  }, [colaboradorId]);

  // Callback para quando um evento é adicionado
  const handleEventoAdicionado = () => {
    loadHistorico();
  };

  // Toggle expand evento
  const toggleExpand = (eventoId: string) => {
    setExpandedEventos((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(eventoId)) {
        newSet.delete(eventoId);
      } else {
        newSet.add(eventoId);
      }
      return newSet;
    });
  };

  // Obter ícone por tipo de evento
  const getEventoIcon = (tipo: TipoEventoHistorico) => {
    switch (tipo) {
      case TipoEventoHistorico.ADMISSAO:
        return <AdmissaoIcon />;
      case TipoEventoHistorico.ATESTADO:
        return <AtestadoIcon />;
      case TipoEventoHistorico.ADVERTENCIA:
        return <AdvertenciaIcon />;
      case TipoEventoHistorico.PROMOCAO:
        return <PromocaoIcon />;
      case TipoEventoHistorico.FERIAS:
        return <FeriasIcon />;
      case TipoEventoHistorico.TRANSFERENCIA:
        return <TransferenciaIcon />;
      case TipoEventoHistorico.TREINAMENTO:
        return <TreinamentoIcon />;
      case TipoEventoHistorico.ELOGIO:
        return <ElogioIcon />;
      case TipoEventoHistorico.DEMISSAO:
        return <DemissaoIcon />;
      case TipoEventoHistorico.AFASTAMENTO:
        return <AfastamentoIcon />;
      case TipoEventoHistorico.SUSPENSAO:
        return <SuspensaoIcon />;
      case TipoEventoHistorico.LICENCA:
        return <LicencaIcon />;
      default:
        return <WorkOutline />;
    }
  };

  // Obter cor por tipo de evento
  const getEventoColor = (
    tipo: TipoEventoHistorico
  ): 'primary' | 'success' | 'error' | 'warning' | 'info' | 'grey' => {
    switch (tipo) {
      case TipoEventoHistorico.ADMISSAO:
        return 'success';
      case TipoEventoHistorico.ATESTADO:
        return 'warning';
      case TipoEventoHistorico.ADVERTENCIA:
        return 'error';
      case TipoEventoHistorico.PROMOCAO:
        return 'success';
      case TipoEventoHistorico.FERIAS:
        return 'info';
      case TipoEventoHistorico.TRANSFERENCIA:
        return 'primary';
      case TipoEventoHistorico.TREINAMENTO:
        return 'info';
      case TipoEventoHistorico.ELOGIO:
        return 'success';
      case TipoEventoHistorico.DEMISSAO:
        return 'error';
      case TipoEventoHistorico.AFASTAMENTO:
        return 'warning';
      case TipoEventoHistorico.SUSPENSAO:
        return 'error';
      case TipoEventoHistorico.LICENCA:
        return 'warning';
      default:
        return 'grey';
    }
  };

  // Formatar data
  const formatDate = (date: Date): string => {
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  // Formatar data e hora
  const formatDateTime = (date: Date): string => {
    return new Date(date).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Renderizar detalhes específicos do evento
  const renderEventoDetalhes = (evento: EventoHistorico) => {
    const isExpanded = expandedEventos.has(evento.id);

    return (
      <Box>
        {/* Atestado */}
        {evento.atestado && (
          <Box mt={2}>
            <Divider sx={{ my: 2 }} />
            <Typography variant="body2" color="text.secondary" gutterBottom>
              <strong>Detalhes do Atestado:</strong>
            </Typography>
            <Box sx={{ pl: 2 }}>
              {evento.atestado.cid && (
                <Typography variant="body2">• CID: {evento.atestado.cid}</Typography>
              )}
              <Typography variant="body2">
                • Período: {formatDate(evento.atestado.dataInicio)} até{' '}
                {formatDate(evento.atestado.dataFim)}
              </Typography>
              <Typography variant="body2">
                • Dias de afastamento: {evento.atestado.diasAfastamento}
              </Typography>
              {evento.atestado.medicoNome && (
                <Typography variant="body2">
                  • Médico: {evento.atestado.medicoNome}
                  {evento.atestado.medicoCrm && ` (CRM: ${evento.atestado.medicoCrm})`}
                </Typography>
              )}
            </Box>
          </Box>
        )}

        {/* Advertência */}
        {evento.advertencia && (
          <Box mt={2}>
            <Divider sx={{ my: 2 }} />
            <Typography variant="body2" color="text.secondary" gutterBottom>
              <strong>Detalhes da Advertência:</strong>
            </Typography>
            <Box sx={{ pl: 2 }}>
              <Typography variant="body2">• Tipo: {evento.advertencia.tipo}</Typography>
              <Typography variant="body2">
                • Gravidade:{' '}
                <Chip
                  label={evento.advertencia.gravidade}
                  size="small"
                  color={
                    evento.advertencia.gravidade === 'GRAVE'
                      ? 'error'
                      : evento.advertencia.gravidade === 'MEDIA'
                      ? 'warning'
                      : 'info'
                  }
                  sx={{ ml: 1 }}
                />
              </Typography>
              <Typography variant="body2">• Motivo: {evento.advertencia.motivo}</Typography>
              {evento.advertencia.testemunhas && evento.advertencia.testemunhas.length > 0 && (
                <Typography variant="body2">
                  • Testemunhas: {evento.advertencia.testemunhas.join(', ')}
                </Typography>
              )}
            </Box>
          </Box>
        )}

        {/* Férias */}
        {evento.ferias && (
          <Box mt={2}>
            <Divider sx={{ my: 2 }} />
            <Typography variant="body2" color="text.secondary" gutterBottom>
              <strong>Detalhes das Férias:</strong>
            </Typography>
            <Box sx={{ pl: 2 }}>
              <Typography variant="body2">
                • Período: {formatDate(evento.ferias.dataInicio)} até{' '}
                {formatDate(evento.ferias.dataFim)}
              </Typography>
              <Typography variant="body2">
                • Dias corridos: {evento.ferias.diasCorridos}
              </Typography>
              <Typography variant="body2">
                • Período aquisitivo: {evento.ferias.periodoAquisitivo}
              </Typography>
            </Box>
          </Box>
        )}

        {/* Promoção */}
        {evento.promocao && (
          <Box mt={2}>
            <Divider sx={{ my: 2 }} />
            <Typography variant="body2" color="text.secondary" gutterBottom>
              <strong>Detalhes da Promoção:</strong>
            </Typography>
            <Box sx={{ pl: 2 }}>
              <Typography variant="body2">
                • Cargo anterior: {evento.promocao.cargoAnterior}
              </Typography>
              <Typography variant="body2">• Cargo novo: {evento.promocao.cargoNovo}</Typography>
              {evento.promocao.salarioAnterior && evento.promocao.salarioNovo && (
                <>
                  <Typography variant="body2">
                    • Salário anterior: R${' '}
                    {evento.promocao.salarioAnterior.toLocaleString('pt-BR', {
                      minimumFractionDigits: 2,
                    })}
                  </Typography>
                  <Typography variant="body2" color="success.main">
                    • Salário novo: R${' '}
                    {evento.promocao.salarioNovo.toLocaleString('pt-BR', {
                      minimumFractionDigits: 2,
                    })}
                  </Typography>
                </>
              )}
            </Box>
          </Box>
        )}

        {/* Transferência */}
        {evento.transferencia && (
          <Box mt={2}>
            <Divider sx={{ my: 2 }} />
            <Typography variant="body2" color="text.secondary" gutterBottom>
              <strong>Detalhes da Transferência:</strong>
            </Typography>
            <Box sx={{ pl: 2 }}>
              <Typography variant="body2">
                • De: {evento.transferencia.departamentoOrigem}
              </Typography>
              <Typography variant="body2">
                • Para: {evento.transferencia.departamentoDestino}
              </Typography>
              {evento.transferencia.motivoTransferencia && (
                <Typography variant="body2">
                  • Motivo: {evento.transferencia.motivoTransferencia}
                </Typography>
              )}
            </Box>
          </Box>
        )}

        {/* Demissão */}
        {evento.demissao && (
          <Box mt={2}>
            <Divider sx={{ my: 2 }} />
            <Alert severity="error" sx={{ mb: 2 }}>
              <Typography variant="body2" fontWeight={600}>
                Encerramento do Ciclo do Colaborador
              </Typography>
            </Alert>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              <strong>Detalhes da Demissão:</strong>
            </Typography>
            <Box sx={{ pl: 2 }}>
              <Typography variant="body2">• Tipo: {evento.demissao.tipoDemissao}</Typography>
              <Typography variant="body2">• Motivo: {evento.demissao.motivoDemissao}</Typography>
              {evento.demissao.dataAviso && (
                <Typography variant="body2">
                  • Data do aviso: {formatDate(evento.demissao.dataAviso)}
                </Typography>
              )}
            </Box>
          </Box>
        )}

        {/* Observações */}
        {evento.observacoes && (
          <Box mt={2}>
            <Divider sx={{ my: 2 }} />
            <Typography variant="body2" color="text.secondary" gutterBottom>
              <strong>Observações:</strong>
            </Typography>
            <Typography variant="body2" sx={{ pl: 2 }}>
              {evento.observacoes}
            </Typography>
          </Box>
        )}

        {/* Documento anexo */}
        {evento.documentoAnexo && (
          <Box mt={2}>
            <Button
              size="small"
              startIcon={<AttachFileIcon />}
              sx={{ textTransform: 'none' }}
            >
              Visualizar documento anexo
            </Button>
          </Box>
        )}

        {/* Registrado por */}
        <Box mt={2} pt={2} borderTop="1px dashed #ccc">
          <Typography variant="caption" color="text.secondary">
            Registrado por: <strong>{evento.registradoPorNome}</strong> em{' '}
            {formatDateTime(evento.data)}
          </Typography>
        </Box>
      </Box>
    );
  };

  if (loading) {
    return (
      <Box textAlign="center" py={4}>
        <Typography color="text.secondary">Carregando histórico...</Typography>
      </Box>
    );
  }

  if (eventos.length === 0) {
    return (
      <Box textAlign="center" py={4}>
        <Typography color="text.secondary">Nenhum evento registrado no histórico</Typography>
      </Box>
    );
  }

  return (
    <Box>
      {/* Cabeçalho com botão de adicionar */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h6" fontWeight={600}>
          📜 Linha do Tempo - Histórico Completo
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setModalOpen(true)}
          sx={{
            background: 'linear-gradient(135deg, #a2122a 0%, #354a80 100%)',
            textTransform: 'none',
          }}
        >
          Adicionar Evento
        </Button>
      </Box>

      {/* Modal de adicionar evento */}
      <AdicionarEventoModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        colaboradorId={colaboradorId}
        onEventoAdicionado={handleEventoAdicionado}
      />

      <Timeline position="alternate">
        {eventos.map((evento, index) => (
          <TimelineItem key={evento.id}>
            <TimelineOppositeContent color="text.secondary">
              <Typography variant="body2" fontWeight={600}>
                {formatDate(evento.data)}
              </Typography>
            </TimelineOppositeContent>

            <TimelineSeparator>
              <TimelineDot color={getEventoColor(evento.tipo)} variant="outlined">
                {getEventoIcon(evento.tipo)}
              </TimelineDot>
              {index < eventos.length - 1 && <TimelineConnector />}
            </TimelineSeparator>

            <TimelineContent>
              <Paper
                elevation={3}
                sx={{
                  p: 2,
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: 6,
                  },
                }}
                onClick={() => toggleExpand(evento.id)}
              >
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Box>
                    <Chip
                      label={evento.tipo}
                      color={getEventoColor(evento.tipo)}
                      size="small"
                      sx={{ mb: 1 }}
                    />
                    <Typography variant="body1" fontWeight={600}>
                      {evento.descricao}
                    </Typography>
                  </Box>
                  <IconButton
                    size="small"
                    sx={{
                      transform: expandedEventos.has(evento.id)
                        ? 'rotate(180deg)'
                        : 'rotate(0deg)',
                      transition: 'transform 0.3s',
                    }}
                  >
                    <ExpandMoreIcon />
                  </IconButton>
                </Box>

                <Collapse in={expandedEventos.has(evento.id)}>
                  {renderEventoDetalhes(evento)}
                </Collapse>
              </Paper>
            </TimelineContent>
          </TimelineItem>
        ))}
      </Timeline>

      {/* Indicador de final do histórico */}
      {eventos.some((e) => e.tipo === TipoEventoHistorico.DEMISSAO) && (
        <Box textAlign="center" mt={4}>
          <Chip
            label="🏁 Fim do Ciclo do Colaborador"
            color="error"
            sx={{
              fontSize: '1rem',
              py: 2,
              px: 3,
              fontWeight: 600,
            }}
          />
        </Box>
      )}
    </Box>
  );
};

