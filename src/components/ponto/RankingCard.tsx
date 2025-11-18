import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Chip,
  LinearProgress,
} from '@mui/material';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import { ColaboradorRanking } from '../../types/ponto';

interface RankingCardProps {
  ranking: ColaboradorRanking[];
  titulo?: string;
  topN?: number;
}

export const RankingCard: React.FC<RankingCardProps> = ({
  ranking,
  titulo = 'Ranking de Pontualidade',
  topN = 10,
}) => {
  // Garantir que ranking seja sempre um array
  const rankingArray = Array.isArray(ranking) ? ranking : [];
  const topRanking = rankingArray.slice(0, topN);

  const getMedalha = (posicao: number) => {
    switch (posicao) {
      case 1:
        return '🥇';
      case 2:
        return '🥈';
      case 3:
        return '🥉';
      default:
        return `${posicao}º`;
    }
  };

  const getCorPontuacao = (pontuacao: number) => {
    if (pontuacao >= 90) return 'success';
    if (pontuacao >= 70) return 'warning';
    return 'error';
  };

  return (
    <Card>
      <CardContent>
        <Box display="flex" alignItems="center" gap={1} mb={2}>
          <EmojiEventsIcon color="primary" />
          <Typography variant="h6">{titulo}</Typography>
        </Box>

        {topRanking.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            Sem dados disponíveis
          </Typography>
        ) : (
          <List>
            {topRanking.map((colaborador) => (
              <ListItem
                key={colaborador.colaboradorId}
                sx={{
                  bgcolor: colaborador.posicao <= 3 ? 'action.hover' : 'transparent',
                  borderRadius: 1,
                  mb: 1,
                }}
              >
                <ListItemAvatar>
                  <Avatar
                    sx={{
                      bgcolor: colaborador.posicao <= 3 ? 'primary.main' : 'grey.400',
                      fontWeight: 700,
                    }}
                  >
                    {getMedalha(colaborador.posicao)}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  component="div"
                  primary={
                    <Box display="flex" alignItems="center" gap={1}>
                      <Typography variant="body1" fontWeight={500}>
                        {colaborador.colaboradorNome}
                      </Typography>
                      <Chip
                        label={`${colaborador.percentualPontualidade}%`}
                        size="small"
                        color={getCorPontuacao(colaborador.pontuacao) as any}
                      />
                    </Box>
                  }
                  secondary={
                    <>
                      <Typography variant="caption" color="text.secondary" component="span">
                        {colaborador.departamento} • {colaborador.cargo}
                      </Typography>
                      <br />
                      <Typography variant="caption" color="text.secondary" component="span">
                        {colaborador.diasPontuais}/{colaborador.diasTrabalhados} dias pontuais
                        {colaborador.atrasos > 0 && ` • ${colaborador.atrasos} atrasos`}
                        {colaborador.faltas > 0 && ` • ${colaborador.faltas} faltas`}
                      </Typography>
                      <Box mt={1}>
                        <LinearProgress
                          variant="determinate"
                          value={colaborador.pontuacao}
                          color={getCorPontuacao(colaborador.pontuacao) as any}
                          sx={{ height: 6, borderRadius: 1 }}
                        />
                      </Box>
                    </>
                  }
                />
                <Box textAlign="right">
                  <Typography variant="h6" color="primary">
                    {colaborador.pontuacao}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    pontos
                  </Typography>
                </Box>
              </ListItem>
            ))}
          </List>
        )}
      </CardContent>
    </Card>
  );
};

