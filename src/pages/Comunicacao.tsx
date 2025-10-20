import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Card,
  CardContent,
  Grid,
  Alert,
  Button,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useNavigationLog } from '../hooks/useNavigationLog';
import { StatCard } from '../components/StatCard';
import { ComunicadoForm } from '../components/comunicacao/ComunicadoForm';
import { HistoricoComunicados } from '../components/comunicacao/HistoricoComunicados';
import {
  Comunicado,
  EstatisticasComunicacao,
} from '../types/comunicacao';
import { getCanalNome, getCategoriaIcone, getCategoriaNome } from '../utils/comunicacaoUtils';
import CampaignIcon from '@mui/icons-material/Campaign';
import GroupIcon from '@mui/icons-material/Group';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import ScheduleIcon from '@mui/icons-material/Schedule';
import comunicacaoService from '../services/comunicacaoService.mock';
import { PageHeader, GradientButton, AnimatedCard } from '../components';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index } = props;
  return (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

export const Comunicacao: React.FC = () => {
  useNavigationLog();

  const [tabAtual, setTabAtual] = useState(0);
  const [estatisticas, setEstatisticas] = useState<EstatisticasComunicacao | null>(null);
  const [comunicados, setComunicados] = useState<Comunicado[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [comunicadoEdit, setComunicadoEdit] = useState<Comunicado | undefined>();

  useEffect(() => {
    carregarEstatisticas();
  }, []);

  useEffect(() => {
    if (tabAtual === 1 || tabAtual === 2) {
      carregarComunicados();
    }
  }, [tabAtual]);

  const carregarEstatisticas = async () => {
    try {
      const dados = await comunicacaoService.buscarEstatisticas();
      setEstatisticas(dados);
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    }
  };

  const carregarComunicados = async () => {
    try {
      const dados = await comunicacaoService.listarComunicados();
      setComunicados(dados);
    } catch (error) {
      console.error('Erro ao carregar comunicados:', error);
    }
  };

  const handleSaveComunicado = async (comunicado: Partial<Comunicado>) => {
    try {
      if (comunicadoEdit) {
        await comunicacaoService.atualizarComunicado(comunicadoEdit.id, comunicado);
      } else {
        await comunicacaoService.criarComunicado(comunicado);
      }
      carregarComunicados();
      carregarEstatisticas();
    } catch (error) {
      console.error('Erro ao salvar:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await comunicacaoService.deletarComunicado(id);
      carregarComunicados();
      carregarEstatisticas();
    } catch (error) {
      console.error('Erro ao deletar:', error);
    }
  };

  return (
    <Box>
      <PageHeader
        title="Comunicação Interna"
        subtitle="Envie comunicados e notificações para seus colaboradores"
        breadcrumbs={[
          { label: 'Home', path: '/dashboard' },
          { label: 'Comunicação' },
        ]}
      />

      <AnimatedCard>
        <Tabs value={tabAtual} onChange={(_, v) => setTabAtual(v)}>
          <Tab label="Dashboard" />
          <Tab label="Novo Comunicado" />
          <Tab label="Histórico" />
        </Tabs>

        {/* Aba 0: Dashboard */}
        <TabPanel value={tabAtual} index={0}>
          <Box p={3}>
            {estatisticas && (
              <>
                <Grid container spacing={3} mb={4}>
                  <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                      title="Comunicados Enviados"
                      value={estatisticas.totalComunicados}
                      icon={<CampaignIcon />}
                      color="#388e3c"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                      title="Enviados Hoje"
                      value={estatisticas.totalEnviadosHoje}
                      icon={<GroupIcon />}
                      color="#1976d2"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                      title="Taxa de Leitura"
                      value={`${estatisticas.taxaLeituraGeral}%`}
                      icon={<DoneAllIcon />}
                      color="#f57c00"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                      title="Agendados"
                      value={estatisticas.totalAgendados}
                      icon={<ScheduleIcon />}
                      color="#a2122a"
                    />
                  </Grid>
                </Grid>

                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Card variant="outlined">
                      <Box p={2}>
                        <Typography variant="h6" mb={2}>
                          Efetividade por Canal
                        </Typography>
                        {estatisticas.porCanal.map((item) => (
                          <Box key={item.canal} mb={2}>
                            <Box display="flex" justifyContent="space-between" mb={0.5}>
                              <Typography variant="body2">
                                {getCanalNome(item.canal)}
                              </Typography>
                              <Typography variant="body2" fontWeight={600}>
                                {item.taxaAbertura.toFixed(1)}%
                              </Typography>
                            </Box>
                            <Box
                              sx={{
                                height: 8,
                                bgcolor: '#e0e0e0',
                                borderRadius: 1,
                                overflow: 'hidden',
                              }}
                            >
                              <Box
                                sx={{
                                  height: '100%',
                                  width: `${item.taxaAbertura}%`,
                                  bgcolor: '#388e3c',
                                }}
                              />
                            </Box>
                            <Typography variant="caption" color="text.secondary">
                              {item.totalAbertos} de {item.totalEnviados} abertos
                            </Typography>
                          </Box>
                        ))}
                      </Box>
                    </Card>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Card variant="outlined">
                      <Box p={2}>
                        <Typography variant="h6" mb={2}>
                          Por Categoria
                        </Typography>
                        {estatisticas.porCategoria.map((item) => (
                          <Box key={item.categoria} display="flex" justifyContent="space-between" mb={1}>
                            <Box display="flex" alignItems="center" gap={1}>
                              <span>{getCategoriaIcone(item.categoria)}</span>
                              <Typography variant="body2">
                                {getCategoriaNome(item.categoria)}
                              </Typography>
                            </Box>
                            <Typography variant="body2" fontWeight={600}>
                              {item.quantidade} ({item.percentual}%)
                            </Typography>
                          </Box>
                        ))}
                      </Box>
                    </Card>
                  </Grid>
                </Grid>

                {estatisticas.comunicadosNaoLidos > 0 && (
                  <Box mt={3}>
                    <Alert severity="warning">
                      <strong>{estatisticas.comunicadosNaoLidos}</strong> comunicados não lidos pelos destinatários
                    </Alert>
                  </Box>
                )}
              </>
            )}
          </Box>
        </TabPanel>

        {/* Aba 1: Novo Comunicado */}
        <TabPanel value={tabAtual} index={1}>
          <Box p={3}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
              <Typography variant="h6">Criar Novo Comunicado</Typography>
              <GradientButton
                startIcon={<AddIcon />}
                onClick={() => {
                  setComunicadoEdit(undefined);
                  setDialogOpen(true);
                }}
              >
                Novo Comunicado
              </GradientButton>
            </Box>

            <Alert severity="info" sx={{ mb: 3 }}>
              <Typography variant="body2" gutterBottom>
                <strong>Canais disponíveis:</strong>
              </Typography>
              <Typography variant="body2">
                • 📱 <strong>App:</strong> Notificações push no aplicativo móvel
              </Typography>
              <Typography variant="body2">
                • 📧 <strong>E-mail:</strong> Envio para e-mail corporativo
              </Typography>
              <Typography variant="body2">
                • 💬 <strong>WhatsApp:</strong> Integração futura (em desenvolvimento)
              </Typography>
              <Typography variant="body2">
                • 📨 <strong>SMS:</strong> Integração futura (em desenvolvimento)
              </Typography>
            </Alert>

            <Card variant="outlined">
              <Box p={3} textAlign="center">
                <CampaignIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Comece criando um comunicado
                </Typography>
                <Typography variant="body2" color="text.secondary" mb={3}>
                  Clique no botão acima para criar e enviar um novo comunicado para seus colaboradores
                </Typography>
                <Button
                  variant="outlined"
                  onClick={() => setDialogOpen(true)}
                >
                  Criar Agora
                </Button>
              </Box>
            </Card>
          </Box>
        </TabPanel>

        {/* Aba 2: Histórico */}
        <TabPanel value={tabAtual} index={2}>
          <Box p={3}>
            <HistoricoComunicados
              comunicados={comunicados}
              onEdit={(c) => {
                setComunicadoEdit(c);
                setDialogOpen(true);
              }}
              onDelete={handleDelete}
            />
          </Box>
        </TabPanel>
      </AnimatedCard>

      <ComunicadoForm
        open={dialogOpen}
        comunicado={comunicadoEdit}
        onClose={() => setDialogOpen(false)}
        onSave={handleSaveComunicado}
      />
    </Box>
  );
};

