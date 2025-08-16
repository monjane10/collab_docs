import { Router } from 'express';
import { setPermission, listPermissions, updatePermission, deletePermission } from '../controllers/permissionsController.js';
import { authenticateJWT } from '../midlewares/auth.js';
import logger from '../utils/logger.js';

const permissionsRouter = Router();

// Definir permissão de utilizador num documento
permissionsRouter.post('/', authenticateJWT, setPermission);

// Listar permissões de um documento
permissionsRouter.get('/:documentId', authenticateJWT, listPermissions);

// Atualizar permissão
permissionsRouter.put('/:id', authenticateJWT, updatePermission);

// Remover permissão
permissionsRouter.delete('/:id', authenticateJWT, deletePermission);
export default permissionsRouter;
