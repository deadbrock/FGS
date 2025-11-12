import express from 'express';
import { login, me } from '../controllers/authController.js';
// import { authenticateToken } from '../middleware/auth.js'; // Descomentar quando criar middleware

const router = express.Router();

// Rota de login
router.post('/login', login);

// Rota para obter usuário autenticado (requer autenticação)
// router.get('/me', authenticateToken, me); // Descomentar quando criar middleware
router.get('/me', me); // Temporário sem middleware

export default router;

