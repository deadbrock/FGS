import express from 'express';
import { login, me } from '../controllers/authController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Rota de login (pública)
router.post('/login', login);

// Rota para obter usuário autenticado (requer autenticação JWT)
router.get('/me', authenticateToken, me);

export default router;

