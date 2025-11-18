import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pkg from 'pg';
import bcrypt from 'bcrypt';
const { Pool } = pkg;

// Carregar variáveis de ambiente
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3333;

// Configuração do PostgreSQL
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? {
    rejectUnauthorized: false
  } : false
});

// Função para criar usuário admin padrão (DESATIVADA - usar apenas usuários reais)
async function initDefaultAdmin() {
  try {
    // Verificar se existe algum admin no banco
    const checkAdmin = await pool.query(
      "SELECT id, nome, email FROM users WHERE role = 'ADMINISTRADOR' LIMIT 1"
    );

    if (checkAdmin.rows.length > 0) {
      console.log('✅ Admin encontrado:', checkAdmin.rows[0].email);
    } else {
      console.log('⚠️  ATENÇÃO: Nenhum administrador encontrado no banco!');
      console.log('⚠️  Crie um usuário administrador via Railway CLI ou interface.');
    }
  } catch (error) {
    console.error('⚠️  Erro ao verificar admin:', error.message);
  }
}

// Testar conexão com o banco
pool.connect(async (err, client, release) => {
  if (err) {
    console.error('❌ Erro ao conectar ao banco de dados:', err.stack);
  } else {
    console.log('✅ Conectado ao PostgreSQL com sucesso!');
    release();
    // Criar admin padrão após conectar
    await initDefaultAdmin();
  }
});

// Middlewares
app.use(cors({
  origin: process.env.FRONTEND_URL || process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware de log
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Servir arquivos estáticos (uploads)
import { fileURLToPath } from 'url';
import path from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Rotas
import usuariosRoutes from './routes/usuariosRoutes.js';
import authRoutes from './routes/authRoutes.js';
import colaboradoresRoutes from './routes/colaboradoresRoutes.js';
import beneficiosRoutes from './routes/beneficiosRoutes.js';
import treinamentosRoutes from './routes/treinamentosRoutes.js';
import regionaisRoutes from './routes/regionaisRoutes.js';
import pontoRoutes from './routes/pontoRoutes.js';
import relatoriosRoutes from './routes/relatoriosRoutes.js';
import documentosRoutes from './routes/documentosRoutes.js';
import segurancaRoutes from './routes/segurancaRoutes.js';

app.use('/api/usuarios', usuariosRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/colaboradores', colaboradoresRoutes);
app.use('/api/beneficios', beneficiosRoutes);
app.use('/api/treinamentos', treinamentosRoutes);
app.use('/api/regionais', regionaisRoutes);
app.use('/api/ponto', pontoRoutes);
app.use('/api/relatorios', relatoriosRoutes);
app.use('/api/documentos', documentosRoutes);
app.use('/api/seguranca', segurancaRoutes);

// Debug: Log de rotas registradas
console.log('✅ Rotas de segurança registradas:');
console.log('   - GET /api/seguranca/estatisticas');
console.log('   - GET /api/seguranca/usuarios');
console.log('   - GET /api/seguranca/logs-acesso');
console.log('   - GET /api/seguranca/logs-alteracoes');

// Rota de health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    database: 'connected'
  });
});

// Rota raiz
app.get('/', (req, res) => {
  res.json({ 
    message: 'API FGS - Sistema de RH',
    version: '1.0.0',
    endpoints: {
      usuarios: '/api/usuarios',
      health: '/health'
    }
  });
});

// Middleware de erro
app.use((err, req, res, next) => {
  console.error('❌ Erro:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Erro interno do servidor',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// 404
app.use((req, res) => {
  res.status(404).json({ error: 'Rota não encontrada' });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`\n🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📡 API disponível em: http://localhost:${PORT}`);
  console.log(`🏥 Health check: http://localhost:${PORT}/health`);
  console.log(`\n📋 Endpoints disponíveis:`);
  console.log(`   - GET    /api/usuarios`);
  console.log(`   - GET    /api/usuarios/:id`);
  console.log(`   - POST   /api/usuarios`);
  console.log(`   - PUT    /api/usuarios/:id`);
  console.log(`   - DELETE /api/usuarios/:id`);
  console.log(`   - GET    /api/seguranca/estatisticas`);
  console.log(`   - GET    /api/seguranca/usuarios`);
  console.log(`   - GET    /api/seguranca/logs-acesso`);
  console.log(`   - GET    /api/seguranca/logs-alteracoes`);
  console.log(`\n✨ Pronto para receber requisições!\n`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM recebido. Fechando servidor...');
  pool.end(() => {
    console.log('Pool do banco encerrado.');
    process.exit(0);
  });
});

