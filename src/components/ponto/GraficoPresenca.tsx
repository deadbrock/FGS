import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
} from '@mui/material';
import { DadosGraficoPresenca } from '../../types/ponto';
import { formatarData } from '../../utils/statusUtils';

interface GraficoPresencaProps {
  dados: DadosGraficoPresenca[];
  titulo?: string;
}

export const GraficoPresenca: React.FC<GraficoPresencaProps> = ({
  dados,
  titulo = 'Presença dos Últimos 7 Dias',
}) => {
  if (dados.length === 0) {
    return (
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            {titulo}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Sem dados disponíveis
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {titulo}
        </Typography>

        <Box mt={3}>
          {dados.map((dia, index) => {
            const total = dia.presentes + dia.ausentes + dia.atrasados;
            const percentualPresentes = total > 0 ? (dia.presentes / total) * 100 : 0;
            const percentualAtrasados = total > 0 ? (dia.atrasados / total) * 100 : 0;
            const percentualAusentes = total > 0 ? (dia.ausentes / total) * 100 : 0;

            return (
              <Box key={index} mb={2}>
                <Box display="flex" justifyContent="space-between" mb={0.5}>
                  <Typography variant="body2">
                    {formatarData(dia.data)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {total} colaboradores
                  </Typography>
                </Box>
                
                <Box
                  sx={{
                    height: 24,
                    display: 'flex',
                    borderRadius: 1,
                    overflow: 'hidden',
                  }}
                >
                  {percentualPresentes > 0 && (
                    <Box
                      sx={{
                        width: `${percentualPresentes}%`,
                        bgcolor: '#388e3c',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Typography variant="caption" color="white" fontWeight={600}>
                        {dia.presentes}
                      </Typography>
                    </Box>
                  )}
                  {percentualAtrasados > 0 && (
                    <Box
                      sx={{
                        width: `${percentualAtrasados}%`,
                        bgcolor: '#f57c00',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Typography variant="caption" color="white" fontWeight={600}>
                        {dia.atrasados}
                      </Typography>
                    </Box>
                  )}
                  {percentualAusentes > 0 && (
                    <Box
                      sx={{
                        width: `${percentualAusentes}%`,
                        bgcolor: '#d32f2f',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Typography variant="caption" color="white" fontWeight={600}>
                        {dia.ausentes}
                      </Typography>
                    </Box>
                  )}
                </Box>

                <Box display="flex" gap={2} mt={0.5}>
                  <Typography variant="caption" color="text.secondary">
                    🟢 Presentes | 🟠 Atrasados | 🔴 Ausentes
                  </Typography>
                </Box>
              </Box>
            );
          })}
        </Box>
      </CardContent>
    </Card>
  );
};

