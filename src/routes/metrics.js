import { Router } from 'express';
import { countDocuments, countUsers, countRevisions, countPermissions, mostEditedDocuments, mostActiveUsers } from '../controllers/metricsController.js';
import { authenticateJWT } from '../midlewares/auth.js';

const metricsRouter = Router();

// Total de documentos
metricsRouter.get('/documents/count', authenticateJWT, countDocuments);

// Total de utilizadores
metricsRouter.get('/users/count', authenticateJWT, countUsers);

// Total de revisões
metricsRouter.get('/revisions/count', authenticateJWT, countRevisions);

// Total de permissões
metricsRouter.get('/permissions/count', authenticateJWT, countPermissions);

// Documentos mais editados
metricsRouter.get('/documents/most-edited', authenticateJWT, mostEditedDocuments);

// Utilizadores mais ativos
metricsRouter.get('/users/most-active', authenticateJWT, mostActiveUsers);

export default metricsRouter;
