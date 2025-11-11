import React, { useState } from 'react';
import { Box, Tooltip, alpha, Typography, useTheme as useMuiTheme } from '@mui/material';
import { EstadoBrasil } from '../../types/regionais';
import { useTheme } from '../../hooks/useTheme';

interface MapaBrasilInterativoProps {
  dadosEstados: Record<EstadoBrasil, number>;
  estadoSelecionado?: EstadoBrasil | null;
  onEstadoClick: (estado: EstadoBrasil) => void;
  mostrarLegenda?: boolean;
}

export const MapaBrasilInterativo: React.FC<MapaBrasilInterativoProps> = ({
  dadosEstados,
  estadoSelecionado,
  onEstadoClick,
  mostrarLegenda = true,
}) => {
  const [estadoHover, setEstadoHover] = useState<EstadoBrasil | null>(null);
  const { mode } = useTheme();
  const muiTheme = useMuiTheme();

  // Calcular intensidade da cor baseado no número de colaboradores
  const getCorEstado = (estado: EstadoBrasil): string => {
    const total = dadosEstados[estado] || 0;
    const maxValue = Math.max(...Object.values(dadosEstados));
    const intensidade = maxValue > 0 ? total / maxValue : 0;

    if (estadoSelecionado === estado) {
      return muiTheme.palette.primary.main;
    }

    if (total === 0) {
      return mode === 'dark' ? '#2d3748' : '#e2e8f0';
    }

    // Escala de cores: do azul claro ao azul escuro
    const baseColor = mode === 'dark' ? [99, 102, 241] : [99, 102, 241]; // #6366f1
    const minOpacity = 0.2;
    const maxOpacity = 1;
    const opacity = minOpacity + (maxOpacity - minOpacity) * intensidade;

    return `rgba(${baseColor[0]}, ${baseColor[1]}, ${baseColor[2]}, ${opacity})`;
  };

  // Estilo base para os estados
  const getEstiloEstado = (estado: EstadoBrasil) => ({
    fill: getCorEstado(estado),
    stroke: mode === 'dark' ? '#1a202c' : '#ffffff',
    strokeWidth: estadoSelecionado === estado ? 2 : 1,
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    filter:
      estadoHover === estado
        ? 'brightness(1.2) drop-shadow(0 4px 8px rgba(0,0,0,0.3))'
        : 'none',
    transform: estadoHover === estado ? 'scale(1.02)' : 'scale(1)',
    transformOrigin: 'center',
  });

  // Coordenadas SVG dos estados - Layout organizado por regiões
  const pathsEstados: Record<EstadoBrasil, string> = {
    // ============ REGIÃO NORTE ============
    // Linha 1: Roraima e Amapá (topo)
    [EstadoBrasil.RR]: 'M 140,30 L 140,90 L 210,90 L 210,30 Z',
    [EstadoBrasil.AP]: 'M 280,50 L 280,110 L 340,110 L 340,50 Z',
    
    // Linha 2: Amazonas (grande, esquerda) e Pará (grande, direita)
    [EstadoBrasil.AM]: 'M 50,90 L 50,200 L 210,200 L 210,90 Z',
    [EstadoBrasil.PA]: 'M 210,110 L 210,220 L 360,220 L 360,110 Z',
    
    // Linha 3: Acre, Rondônia e Tocantins
    [EstadoBrasil.AC]: 'M 20,180 L 20,240 L 80,240 L 80,180 Z',
    [EstadoBrasil.RO]: 'M 80,180 L 80,240 L 150,240 L 150,180 Z',
    [EstadoBrasil.TO]: 'M 280,220 L 280,320 L 350,320 L 350,220 Z',
    
    // ============ REGIÃO NORDESTE ============
    // Linha 1: Maranhão (grande) e Ceará
    [EstadoBrasil.MA]: 'M 320,160 L 320,240 L 400,240 L 400,160 Z',
    [EstadoBrasil.CE]: 'M 400,160 L 400,220 L 470,220 L 470,160 Z',
    
    // Linha 2: Piauí, RN, PB
    [EstadoBrasil.PI]: 'M 350,240 L 350,320 L 420,320 L 420,240 Z',
    [EstadoBrasil.RN]: 'M 450,220 L 450,250 L 490,250 L 490,220 Z',
    [EstadoBrasil.PB]: 'M 450,250 L 450,280 L 490,280 L 490,250 Z',
    
    // Linha 3: Bahia (grande), PE, AL, SE
    [EstadoBrasil.BA]: 'M 360,320 L 360,440 L 450,440 L 450,320 Z',
    [EstadoBrasil.PE]: 'M 420,280 L 420,330 L 480,330 L 480,280 Z',
    [EstadoBrasil.AL]: 'M 450,330 L 450,365 L 485,365 L 485,330 Z',
    [EstadoBrasil.SE]: 'M 430,365 L 430,395 L 465,395 L 465,365 Z',
    
    // ============ REGIÃO CENTRO-OESTE ============
    [EstadoBrasil.MT]: 'M 150,240 L 150,370 L 280,370 L 280,240 Z',
    [EstadoBrasil.GO]: 'M 280,320 L 280,420 L 360,420 L 360,320 Z',
    [EstadoBrasil.DF]: 'M 310,365 L 310,385 L 330,385 L 330,365 Z',
    [EstadoBrasil.MS]: 'M 180,370 L 180,470 L 280,470 L 280,370 Z',
    
    // ============ REGIÃO SUDESTE ============
    [EstadoBrasil.MG]: 'M 310,400 L 310,490 L 400,490 L 400,400 Z',
    [EstadoBrasil.ES]: 'M 400,430 L 400,475 L 435,475 L 435,430 Z',
    [EstadoBrasil.SP]: 'M 260,460 L 260,530 L 350,530 L 350,460 Z',
    [EstadoBrasil.RJ]: 'M 350,480 L 350,520 L 395,520 L 395,480 Z',
    
    // ============ REGIÃO SUL ============
    [EstadoBrasil.PR]: 'M 240,500 L 240,560 L 320,560 L 320,500 Z',
    [EstadoBrasil.SC]: 'M 260,560 L 260,600 L 340,600 L 340,560 Z',
    [EstadoBrasil.RS]: 'M 230,600 L 230,680 L 320,680 L 320,600 Z',
  };

  // Posições para os rótulos (siglas) - centralizadas nos estados
  const posicoesRotulos: Record<EstadoBrasil, { x: number; y: number }> = {
    // REGIÃO NORTE
    [EstadoBrasil.RR]: { x: 175, y: 60 },
    [EstadoBrasil.AP]: { x: 310, y: 80 },
    [EstadoBrasil.AM]: { x: 130, y: 145 },
    [EstadoBrasil.PA]: { x: 285, y: 165 },
    [EstadoBrasil.AC]: { x: 50, y: 210 },
    [EstadoBrasil.RO]: { x: 115, y: 210 },
    [EstadoBrasil.TO]: { x: 315, y: 270 },
    
    // REGIÃO NORDESTE
    [EstadoBrasil.MA]: { x: 360, y: 200 },
    [EstadoBrasil.CE]: { x: 435, y: 190 },
    [EstadoBrasil.PI]: { x: 385, y: 280 },
    [EstadoBrasil.RN]: { x: 470, y: 235 },
    [EstadoBrasil.PB]: { x: 470, y: 265 },
    [EstadoBrasil.PE]: { x: 450, y: 305 },
    [EstadoBrasil.AL]: { x: 467, y: 347 },
    [EstadoBrasil.SE]: { x: 447, y: 380 },
    [EstadoBrasil.BA]: { x: 405, y: 380 },
    
    // REGIÃO CENTRO-OESTE
    [EstadoBrasil.MT]: { x: 215, y: 305 },
    [EstadoBrasil.GO]: { x: 320, y: 370 },
    [EstadoBrasil.DF]: { x: 320, y: 375 },
    [EstadoBrasil.MS]: { x: 230, y: 420 },
    
    // REGIÃO SUDESTE
    [EstadoBrasil.MG]: { x: 355, y: 445 },
    [EstadoBrasil.ES]: { x: 417, y: 452 },
    [EstadoBrasil.SP]: { x: 305, y: 495 },
    [EstadoBrasil.RJ]: { x: 372, y: 500 },
    
    // REGIÃO SUL
    [EstadoBrasil.PR]: { x: 280, y: 530 },
    [EstadoBrasil.SC]: { x: 300, y: 580 },
    [EstadoBrasil.RS]: { x: 275, y: 640 },
  };

  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
      }}
    >
      {/* Mapa */}
      <Box
        sx={{
          flex: 1,
          position: 'relative',
          backgroundColor: mode === 'dark' ? alpha('#000', 0.2) : alpha('#fff', 0.5),
          borderRadius: 3,
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 2,
        }}
      >
        <svg
          viewBox="0 0 520 700"
          style={{
            width: '100%',
            height: '100%',
            maxWidth: '600px',
            maxHeight: '800px',
          }}
        >
          {/* Grid de fundo para organização visual */}
          <defs>
            <pattern
              id="grid"
              width="20"
              height="20"
              patternUnits="userSpaceOnUse"
              opacity="0.05"
            >
              <path
                d="M 20 0 L 0 0 0 20"
                fill="none"
                stroke={mode === 'dark' ? '#fff' : '#000'}
                strokeWidth="0.5"
              />
            </pattern>
          </defs>
          <rect width="520" height="700" fill="url(#grid)" />

          {/* Renderizar estados */}
          {Object.entries(pathsEstados).map(([estado, path]) => {
            const estadoKey = estado as EstadoBrasil;
            const total = dadosEstados[estadoKey] || 0;

            return (
              <Tooltip
                key={estadoKey}
                title={
                  <Box sx={{ p: 0.5 }}>
                    <Typography variant="subtitle2" fontWeight={700}>
                      {estadoKey}
                    </Typography>
                    <Typography variant="body2">
                      {total} colaborador{total !== 1 ? 'es' : ''}
                    </Typography>
                  </Box>
                }
                arrow
                placement="top"
              >
                <g>
                  <path
                    d={path}
                    style={getEstiloEstado(estadoKey)}
                    onClick={() => onEstadoClick(estadoKey)}
                    onMouseEnter={() => setEstadoHover(estadoKey)}
                    onMouseLeave={() => setEstadoHover(null)}
                  />
                  {/* Sigla do estado */}
                  <text
                    x={posicoesRotulos[estadoKey].x}
                    y={posicoesRotulos[estadoKey].y}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    style={{
                      fontSize: estadoKey === EstadoBrasil.DF ? '10px' : '12px',
                      fontWeight: 700,
                      fill: mode === 'dark' ? '#fff' : '#1a202c',
                      pointerEvents: 'none',
                      userSelect: 'none',
                      textShadow: '0 1px 2px rgba(0,0,0,0.3)',
                    }}
                  >
                    {estadoKey}
                  </text>
                </g>
              </Tooltip>
            );
          })}
        </svg>
      </Box>

      {/* Legenda */}
      {mostrarLegenda && (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 3,
            p: 2,
            backgroundColor: mode === 'dark' ? alpha('#000', 0.2) : alpha('#fff', 0.5),
            borderRadius: 2,
          }}
        >
          <Typography variant="caption" fontWeight={600} color="text.secondary">
            Densidade de Colaboradores:
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box
              sx={{
                width: 20,
                height: 20,
                borderRadius: 1,
                backgroundColor: 'rgba(99, 102, 241, 0.2)',
              }}
            />
            <Typography variant="caption">Baixa</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box
              sx={{
                width: 20,
                height: 20,
                borderRadius: 1,
                backgroundColor: 'rgba(99, 102, 241, 0.6)',
              }}
            />
            <Typography variant="caption">Média</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box
              sx={{
                width: 20,
                height: 20,
                borderRadius: 1,
                backgroundColor: 'rgba(99, 102, 241, 1)',
              }}
            />
            <Typography variant="caption">Alta</Typography>
          </Box>
        </Box>
      )}
    </Box>
  );
};

