import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('🔴 ErrorBoundary capturou erro:', error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });
  }

  private handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
    window.location.href = '/dashboard';
  };

  public render() {
    if (this.state.hasError) {
      return (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            backgroundColor: '#f5f5f5',
            p: 3,
          }}
        >
          <Paper
            elevation={3}
            sx={{
              maxWidth: 600,
              p: 4,
              textAlign: 'center',
            }}
          >
            <ErrorOutlineIcon
              sx={{
                fontSize: 80,
                color: 'error.main',
                mb: 2,
              }}
            />
            <Typography variant="h4" gutterBottom fontWeight={700}>
              Oops! Algo deu errado
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              Ocorreu um erro inesperado. Por favor, tente novamente.
            </Typography>
            
            {this.state.error && (
              <Box
                sx={{
                  mt: 3,
                  p: 2,
                  backgroundColor: '#f5f5f5',
                  borderRadius: 2,
                  textAlign: 'left',
                }}
              >
                <Typography variant="subtitle2" fontWeight={700} gutterBottom>
                  Detalhes do erro:
                </Typography>
                <Typography
                  variant="body2"
                  component="pre"
                  sx={{
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                    fontSize: '0.75rem',
                    fontFamily: 'monospace',
                  }}
                >
                  {this.state.error.toString()}
                </Typography>
                {this.state.errorInfo && (
                  <Typography
                    variant="body2"
                    component="pre"
                    sx={{
                      mt: 1,
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-word',
                      fontSize: '0.7rem',
                      fontFamily: 'monospace',
                      maxHeight: '200px',
                      overflow: 'auto',
                    }}
                  >
                    {this.state.errorInfo.componentStack}
                  </Typography>
                )}
              </Box>
            )}

            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={this.handleReset}
              sx={{ mt: 3 }}
            >
              Voltar ao Dashboard
            </Button>
          </Paper>
        </Box>
      );
    }

    return this.props.children;
  }
}

