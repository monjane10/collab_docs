import { Router } from 'express';
import { listRevisions, createAutoRevision, revertRevision } from '../controllers/revisionsController.js';
import { authenticateJWT } from '../midlewares/auth.js';
import logger from '../utils/logger.js';

const revisionRrouter = Router();

// Listar revisões (protegido)
revisionRrouter.get('/:documentId', authenticateJWT, listRevisions);

// Criar revisão automática ao atualizar documento
revisionRrouter.post('/:documentId/auto', authenticateJWT, createAutoRevision);

// Reverter para uma revisão (protegido)
revisionRrouter.post('/:documentId/revert', authenticateJWT, revertRevision);

export default revisionRrouter;
