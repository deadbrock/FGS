import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  LinearProgress,
} from '@mui/material';
import { RelatorioCustos as RelatorioCustosType } from '../../types/beneficios';
import { formatarMoeda, getTipoNome, getTipoIcone } from '../../utils/beneficiosUtils';

interface RelatorioCustosProps {
  relatorio: RelatorioCustosType;
}

export const RelatorioCustos: React.FC<RelatorioCustosProps> = ({ relatorio }) => {
  // Garantir que arrays existam
  const porTipo = Array.isArray(relatorio?.porTipo) ? relatorio.porTipo : [];
  const porDepartamento = Array.isArray(relatorio?.porDepartamento) ? relatorio.porDepartamento : [];
  const topColaboradores = Array.isArray(relatorio?.topColaboradores) ? relatorio.topColaboradores : [];

  // Função auxiliar para garantir valores numéricos válidos
  const safeNumber = (value: any): number => {
    const num = Number(value);
    return isNaN(num) || !isFinite(num) ? 0 : num;
  };

  return (
    <Box>
      {/* Cards de Resumo */}
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="caption" color="text.secondary">
                Custo Total Empresa
              </Typography>
              <Typography variant="h5" color="primary">
                {formatarMoeda(safeNumber(relatorio?.custoTotalEmpresa))}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="caption" color="text.secondary">
                Custo Total Colaborador
              </Typography>
              <Typography variant="h5" color="secondary">
                {formatarMoeda(safeNumber(relatorio?.custoTotalColaborador))}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="caption" color="text.secondary">
                Total de Benefícios
              </Typography>
              <Typography variant="h5">
                {safeNumber(relatorio?.totalBeneficios)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="caption" color="text.secondary">
                Colaboradores Atendidos
              </Typography>
              <Typography variant="h5">
                {safeNumber(relatorio?.totalColaboradores)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Custos por Tipo */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Custos por Tipo de Benefício
          </Typography>
          
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Tipo</TableCell>
                  <TableCell align="right">Quantidade</TableCell>
                  <TableCell align="right">Custo Empresa</TableCell>
                  <TableCell align="right">Custo Colaborador</TableCell>
                  <TableCell align="right">Total</TableCell>
                  <TableCell align="right">% do Total</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {porTipo.length > 0 ? (
                  porTipo.map((item) => (
                  <TableRow key={item.tipo}>
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={1}>
                        <span>{getTipoIcone(item.tipo)}</span>
                        <span>{getTipoNome(item.tipo)}</span>
                      </Box>
                    </TableCell>
                    <TableCell align="right">{safeNumber(item.quantidade)}</TableCell>
                    <TableCell align="right">{formatarMoeda(safeNumber(item.custoEmpresa))}</TableCell>
                    <TableCell align="right">{formatarMoeda(safeNumber(item.custoColaborador))}</TableCell>
                    <TableCell align="right">
                      <Typography fontWeight={600}>
                        {formatarMoeda(safeNumber(item.custoTotal))}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Box display="flex" alignItems="center" gap={1}>
                        <LinearProgress
                          variant="determinate"
                          value={Math.min(100, Math.max(0, safeNumber(item.percentualTotal)))}
                          sx={{ flex: 1, height: 6, borderRadius: 1 }}
                        />
                        <Typography variant="caption">
                          {safeNumber(item.percentualTotal).toFixed(1)}%
                        </Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      <Typography variant="body2" color="text.secondary">
                        Nenhum dado disponível
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Custos por Departamento */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Custos por Departamento
          </Typography>
          
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Departamento</TableCell>
                  <TableCell align="right">Benefícios</TableCell>
                  <TableCell align="right">Colaboradores</TableCell>
                  <TableCell align="right">Custo Total</TableCell>
                  <TableCell align="right">Média por Colaborador</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {porDepartamento.length > 0 ? (
                  porDepartamento.map((item) => (
                  <TableRow key={item.departamento}>
                    <TableCell>{item.departamento || '-'}</TableCell>
                    <TableCell align="right">{safeNumber(item.quantidade)}</TableCell>
                    <TableCell align="right">{safeNumber(item.colaboradoresAtendidos)}</TableCell>
                    <TableCell align="right">
                      <Typography fontWeight={600}>
                        {formatarMoeda(safeNumber(item.custoTotal))}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      {(() => {
                        const custoTotal = safeNumber(item.custoTotal);
                        const colaboradores = safeNumber(item.colaboradoresAtendidos);
                        const media = colaboradores > 0 ? custoTotal / colaboradores : 0;
                        return formatarMoeda(media);
                      })()}
                    </TableCell>
                  </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      <Typography variant="body2" color="text.secondary">
                        Nenhum dado disponível
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );
};

