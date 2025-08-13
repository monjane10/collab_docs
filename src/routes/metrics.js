import { Router } from 'express';
import Document from '../models/Document.js';
import User from '../models/User.js';
import Revision from '../models/Revision.js';
import Permission from '../models/Permission.js';
import { authenticateJWT } from '../midlewares/auth.js';

const metricsRouter = Router();

// Total de documentos
metricsRouter.get('/documents/count', authenticateJWT, async (req, res) => {
  const count = await Document.count();
  res.json({ totalDocuments: count });
});

// Total de utilizadores
metricsRouter.get('/users/count', authenticateJWT, async (req, res) => {
  const count = await User.count();
  res.json({ totalUsers: count });
});

// Total de revisões
metricsRouter.get('/revisions/count', authenticateJWT, async (req, res) => {
  const count = await Revision.count();
  res.json({ totalRevisions: count });
});

// Total de permissões
metricsRouter.get('/permissions/count', authenticateJWT, async (req, res) => {
  const count = await Permission.count();
  res.json({ totalPermissions: count });
});

// Documentos mais editados
metricsRouter.get('/documents/most-edited', authenticateJWT, async (req, res) => {
  const docs = await Revision.findAll({
    attributes: ['documentId', [Revision.sequelize.fn('COUNT', Revision.sequelize.col('id')), 'editCount']],
    group: ['documentId'],
    order: [[Revision.sequelize.fn('COUNT', Revision.sequelize.col('id')), 'DESC']],
    limit: 5
  });
  res.json(docs);
});

// Utilizadores mais ativos
metricsRouter.get('/users/most-active', authenticateJWT, async (req, res) => {
  const users = await Revision.findAll({
    attributes: ['editedById', [Revision.sequelize.fn('COUNT', Revision.sequelize.col('id')), 'editCount']],
    group: ['editedById'],
    order: [[Revision.sequelize.fn('COUNT', Revision.sequelize.col('id')), 'DESC']],
    limit: 5
  });
  res.json(users);
});

export default metricsRouter;
