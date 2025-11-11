import express from 'express';
import {
  getUsuarios,
  getUsuarioById,
  createUsuario,
  updateUsuario,
  deleteUsuario,
  checkEmailDisponivel
} from '../controllers/usuariosController.js';

const router = express.Router();

// Rotas de usuários
router.get('/', getUsuarios);
router.get('/check-email', checkEmailDisponivel);
router.get('/:id', getUsuarioById);
router.post('/', createUsuario);
router.put('/:id', updateUsuario);
router.delete('/:id', deleteUsuario);

export default router;

