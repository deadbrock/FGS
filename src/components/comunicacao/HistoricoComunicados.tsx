import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Paper,
  Stack,
  LinearProgress,
  IconButton,
  Tooltip,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { Comunicado } from '../../types/comunicacao';
import {
  getStatusNome,
  getStatusCor,
  getPrioridadeNome,
  getCategoriaIcone,
  getCategoriaNome,
  getCanalIcone,
  calcularTaxaLeitura,
  gerarPreview,
} from '../../utils/comunicacaoUtils';
import { formatarData } from '../../utils/statusUtils';

interface HistoricoComunicadosProps {
  comunicados: Comunicado[];
  onView?: (comunicado: Comunicado) => void;
  onEdit?: (comunicado: Comunicado) => void;
  onDelete?: (id: string) => void;
}

export const HistoricoComunicados: React.FC<HistoricoComunicadosProps> = ({
  comunicados,
  onView,
  onEdit,
  onDelete,
}) => {
  if (comunicados.length === 0) {
    return (
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Histórico de Comunicados
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Nenhum comunicado encontrado
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Histórico de Comunicados
        </Typography>

        <Stack spacing={2} mt={2}>
          {comunicados.map((comunicado) => {
            const taxaLeitura = calcularTaxaLeitura(
              comunicado.totalLidos,
              comunicado.totalDestinatarios
            );

            return (
              <Paper key={comunicado.id} elevation={1} sx={{ p: 2 }}>
                <Box>
                  {/* Cabeçalho */}
                  <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                    <Box flex={1}>
                      <Box display="flex" alignItems="center" gap={1} mb={1}>
                        <span>{getCategoriaIcone(comunicado.categoria)}</span>
                        <Typography variant="h6" component="span">
                          {comunicado.titulo}
                        </Typography>
                      </Box>
                      
                      <Box display="flex" gap={1} flexWrap="wrap" mb={1}>
                        <Chip
                          label={getStatusNome(comunicado.status)}
                          size="small"
                          sx={{ bgcolor: getStatusCor(comunicado.status), color: 'white' }}
                        />
                        <Chip
                          label={getCategoriaNome(comunicado.categoria)}
                          size="small"
                          variant="outlined"
                        />
                        <Chip
                          label={getPrioridadeNome(comunicado.prioridade)}
                          size="small"
                          variant="outlined"
                        />
                      </Box>
                    </Box>

                    <Box display="flex" gap={0.5}>
                      {onView && (
                        <Tooltip title="Visualizar">
                          <IconButton size="small" onClick={() => onView(comunicado)}>
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                      {onEdit && comunicado.status === 'RASCUNHO' && (
                        <Tooltip title="Editar">
                          <IconButton size="small" onClick={() => onEdit(comunicado)}>
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                      {onDelete && (
                        <Tooltip title="Excluir">
                          <IconButton size="small" onClick={() => onDelete(comunicado.id)}>
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                    </Box>
                  </Box>

                  {/* Preview do Conteúdo */}
                  <Typography variant="body2" color="text.secondary" mb={2}>
                    {gerarPreview(comunicado.conteudo, 150)}
                  </Typography>

                  {/* Informações */}
                  <Box display="flex" flexWrap="wrap" gap={2} mb={2}>
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Destinatários
                      </Typography>
                      <Typography variant="body2" fontWeight={500}>
                        {comunicado.totalDestinatarios}
                      </Typography>
                    </Box>

                    {comunicado.status === 'ENVIADO' && (
                      <>
                        <Box>
                          <Typography variant="caption" color="text.secondary">
                            Enviados
                          </Typography>
                          <Typography variant="body2" fontWeight={500}>
                            {comunicado.totalEnviados}
                          </Typography>
                        </Box>

                        <Box>
                          <Typography variant="caption" color="text.secondary">
                            Lidos
                          </Typography>
                          <Typography variant="body2" fontWeight={500}>
                            {comunicado.totalLidos}
                          </Typography>
                        </Box>

                        {comunicado.exigeLeitura && (
                          <Box>
                            <Typography variant="caption" color="text.secondary">
                              Confirmados
                            </Typography>
                            <Typography variant="body2" fontWeight={500}>
                              {comunicado.totalConfirmados}
                            </Typography>
                          </Box>
                        )}
                      </>
                    )}

                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Canais
                      </Typography>
                      <Box display="flex" gap={0.5}>
                        {comunicado.canais.map((canal) => (
                          <span key={canal}>{getCanalIcone(canal)}</span>
                        ))}
                      </Box>
                    </Box>
                  </Box>

                  {/* Barra de Progresso (só para enviados) */}
                  {comunicado.status === 'ENVIADO' && (
                    <Box>
                      <Box display="flex" justifyContent="space-between" mb={0.5}>
                        <Typography variant="caption" color="text.secondary">
                          Taxa de Leitura
                        </Typography>
                        <Typography variant="caption" fontWeight={600}>
                          {taxaLeitura}%
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={taxaLeitura}
                        sx={{ height: 6, borderRadius: 1 }}
                      />
                    </Box>
                  )}

                  {/* Footer */}
                  <Box display="flex" justifyContent="space-between" mt={2}>
                    <Typography variant="caption" color="text.secondary">
                      {comunicado.status === 'ENVIADO' && comunicado.enviadoEm
                        ? `Enviado em ${formatarData(comunicado.enviadoEm)}`
                        : `Criado em ${formatarData(comunicado.criadoEm)}`}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Por: {comunicado.criadoPor}
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            );
          })}
        </Stack>
      </CardContent>
    </Card>
  );
};

