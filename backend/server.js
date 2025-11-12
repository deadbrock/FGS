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

// Função para criar usuário admin padrão
async function initDefaultAdmin() {
  try {
    const checkAdmin = await pool.query(
      "SELECT id FROM users WHERE email = 'admin@fgs.com'"
    );

    if (checkAdmin.rows.length === 0) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await pool.query(`
        INSERT INTO users (nome, email, senha, role, cargo, departamento)
        VALUES ($1, $2, $3, $4, $5, $6)
      `, [
        'Administrador',
        'admin@fgs.com',
        hashedPassword,
        'ADMINISTRADOR',
        'Administrador do Sistema',
        'TI'
      ]);
      console.log('✅ Usuário admin criado: admin@fgs.com / admin123');
    }
  } catch (error) {
    console.error('⚠️  Erro ao criar admin padrão:', error.message);
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

// Rotas
import usuariosRoutes from './routes/usuariosRoutes.js';

app.use('/api/usuarios', usuariosRoutes);

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

