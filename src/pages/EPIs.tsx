import React, { useState } from 'react';
import { Box, Tabs, Tab } from '@mui/material';
import { useNavigationLog } from '../hooks/useNavigationLog';
import { PageHeader } from '../components';
import { CadastroEPIs } from './epis/CadastroEPIs';
import { EntregaEPIs } from './epis/EntregaEPIs';
import { HistoricoEPIs } from './epis/HistoricoEPIs';
import { ControleValidade } from './epis/ControleValidade';
import { DevolucaoEPIs } from './epis/DevolucaoEPIs';
import { Fichas } from './epis/Fichas';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`epis-tabpanel-${index}`}
      aria-labelledby={`epis-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

export const EPIs: React.FC = () => {
  useNavigationLog();
  const [tabAtual, setTabAtual] = useState(0);

  const handleChangeTab = (_event: React.SyntheticEvent, newValue: number) => {
    setTabAtual(newValue);
  };

  return (
    <Box>
      <PageHeader
        title="Gestão de EPIs"
        subtitle="Controle completo de Equipamentos de Proteção Individual"
        breadcrumbs={[{ label: 'Home', path: '/dashboard' }, { label: 'EPIs' }]}
      />

      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabAtual} onChange={handleChangeTab} aria-label="epis tabs" variant="scrollable" scrollButtons="auto">
          <Tab label="Cadastro de EPIs" />
          <Tab label="Entrega de EPIs" />
          <Tab label="Histórico" />
          <Tab label="Controle de Validade" />
          <Tab label="Devoluções" />
          <Tab label="Fichas" />
        </Tabs>
      </Box>

      <TabPanel value={tabAtual} index={0}>
        <CadastroEPIs />
      </TabPanel>

      <TabPanel value={tabAtual} index={1}>
        <EntregaEPIs />
      </TabPanel>

      <TabPanel value={tabAtual} index={2}>
        <HistoricoEPIs />
      </TabPanel>

      <TabPanel value={tabAtual} index={3}>
        <ControleValidade />
      </TabPanel>

      <TabPanel value={tabAtual} index={4}>
        <DevolucaoEPIs />
      </TabPanel>

      <TabPanel value={tabAtual} index={5}>
        <Fichas />
      </TabPanel>
    </Box>
  );
};

