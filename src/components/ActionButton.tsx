import React from 'react';
import { IconButton, Tooltip, alpha } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import SaveIcon from '@mui/icons-material/Save';
import AddIcon from '@mui/icons-material/Add';
import DownloadIcon from '@mui/icons-material/Download';
import UploadIcon from '@mui/icons-material/Upload';
import RefreshIcon from '@mui/icons-material/Refresh';
import ErrorIcon from '@mui/icons-material/Error';

export type ActionType =
  | 'edit'
  | 'delete'
  | 'view'
  | 'save'
  | 'add'
  | 'download'
  | 'upload'
  | 'refresh';

// Interface com action predefinido
interface ActionButtonWithActionProps {
  action: ActionType;
  onClick: () => void;
  tooltip?: string;
  disabled?: boolean;
  icon?: never;
  color?: never;
}

// Interface com icon e color customizados
interface ActionButtonWithIconProps {
  action?: never;
  icon: React.ReactNode;
  onClick: () => void;
  tooltip?: string;
  disabled?: boolean;
  color?: string;
}

type ActionButtonProps = ActionButtonWithActionProps | ActionButtonWithIconProps;

const actionConfig: Record<
  ActionType,
  { icon: React.ReactNode; color: string; label: string }
> = {
  edit: { icon: <EditIcon />, color: '#1976d2', label: 'Editar' },
  delete: { icon: <DeleteIcon />, color: '#d32f2f', label: 'Excluir' },
  view: { icon: <VisibilityIcon />, color: '#388e3c', label: 'Visualizar' },
  save: { icon: <SaveIcon />, color: '#388e3c', label: 'Salvar' },
  add: { icon: <AddIcon />, color: '#1976d2', label: 'Adicionar' },
  download: { icon: <DownloadIcon />, color: '#f57c00', label: 'Download' },
  upload: { icon: <UploadIcon />, color: '#1976d2', label: 'Upload' },
  refresh: { icon: <RefreshIcon />, color: '#757575', label: 'Atualizar' },
};

export const ActionButton: React.FC<ActionButtonProps> = (props) => {
  const { onClick, tooltip, disabled = false } = props;

  // Se passou action, usa o config predefinido
  if ('action' in props && props.action) {
    const config = actionConfig[props.action];
    
    // Validação de segurança
    if (!config) {
      console.error('ActionButton: action inválido:', props.action);
      return null;
    }
    
    const label = tooltip || config.label;

    return (
      <Tooltip title={label}>
        <span>
          <IconButton
            onClick={onClick}
            disabled={disabled}
            size="small"
            sx={{
              color: config.color,
              transition: 'all 0.2s ease',
              '&:hover': {
                backgroundColor: alpha(config.color, 0.1),
                transform: 'scale(1.1)',
              },
              '&:active': {
                transform: 'scale(0.95)',
              },
            }}
          >
            {config.icon}
          </IconButton>
        </span>
      </Tooltip>
    );
  }

  // Se passou icon, usa icon customizado
  if ('icon' in props && props.icon) {
    const defaultColor = props.color || '#757575';
    const label = tooltip || 'Ação';

    // Validação: icon não pode ser null/undefined
    if (!props.icon) {
      console.error('ActionButton: icon é null ou undefined');
      return null;
    }

    return (
      <Tooltip title={label}>
        <span>
          <IconButton
            onClick={onClick}
            disabled={disabled}
            size="small"
            sx={{
              color: defaultColor,
              transition: 'all 0.2s ease',
              '&:hover': {
                backgroundColor: alpha(defaultColor, 0.1),
                transform: 'scale(1.1)',
              },
              '&:active': {
                transform: 'scale(0.95)',
              },
            }}
          >
            {props.icon}
          </IconButton>
        </span>
      </Tooltip>
    );
  }

  // Fallback: retorna um botão vazio mas válido
  console.warn('ActionButton: nem action nem icon foram fornecidos', props);
  return (
    <Tooltip title="Ação inválida">
      <span>
        <IconButton disabled size="small">
          <ErrorIcon />
        </IconButton>
      </span>
    </Tooltip>
  );
};

