import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'mui-core': ['@mui/material', '@mui/icons-material'],
          'mui-lab': ['@mui/lab'],
          'router': ['react-router-dom'],
          'charts': ['recharts'],
          'pdf': ['jspdf', 'jspdf-autotable'],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
  server: {
    port: 3000,
    host: '0.0.0.0', // Permite acesso de outros dispositivos na rede
    strictPort: false, // Permite usar outra porta se 3000 estiver ocupada
    open: false, // Desabilita abrir automaticamente (para não abrir no servidor)
    cors: true, // Habilita CORS
    hmr: {
      host: 'localhost', // Host para Hot Module Replacement
      protocol: 'ws', // Protocolo WebSocket
    },
  },
  preview: {
    port: 3000,
    host: '0.0.0.0',
    strictPort: false,
    cors: true,
  },
})

