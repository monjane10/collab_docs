import { Router } from 'express';
import { createUser, listUsers, getUserDetails, updateUser, deleteUser } from '../controllers/usersController.js';
import { authenticateJWT } from '../midlewares/auth.js';
import logger from '../utils/logger.js';

const router = Router();

// Criar utilizador (sem autenticação)
router.post('/', createUser);

// Listar utilizadores (protegido)
router.get('/', authenticateJWT, listUsers);

// Detalhes de utilizador (protegido)
router.get('/:id', authenticateJWT, getUserDetails);

// Atualizar utilizador (protegido)
router.put('/:id', authenticateJWT, updateUser);

// Remover utilizador (protegido)
router.delete('/:id', authenticateJWT, deleteUser);

export default router;
