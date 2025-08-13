import { Router } from 'express';
import Permission from '../models/Permission.js';
import User from '../models/User.js';
import Document from '../models/Document.js';
import { authenticateJWT } from '../midlewares/auth.js';
import logger from '../utils/logger.js';

const permissionsRouter = Router();

// Definir permissão de utilizador num documento
permissionsRouter.post('/', authenticateJWT, async (req, res) => {
    try {
        const { userId, documentId, access } = req.body;
        if (!userId || !documentId || !access) {
            logger.warn('Tentativa de definir permissão com dados em falta', { body: req.body, userId: req.user.id });
            return res.status(400).json({ error: 'Campos obrigatórios em falta.' });
        }
        const permission = await Permission.create({ userId, documentId, access });
        logger.info('Permissão definida', { permissionId: permission.id, userId: req.user.id });
        res.status(201).json(permission);
    } catch (err) {
        logger.error('Erro ao definir permissão', { error: err.message, userId: req.user.id });
        res.status(500).json({ error: 'Erro ao definir permissão.', details: err.message });
    }
});

// Listar permissões de um documento
permissionsRouter.get('/:documentId', authenticateJWT, async (req, res) => {
    try {
        const permissions = await Permission.findAll({
            where: { documentId: req.params.documentId },
            include: [
                {
                    model: User,
                    attributes: ['id', 'username', 'email'] // pega o nome e o email do colaborador
                },
                {
                    model: Document,
                    attributes: ['id', 'title', 'content'] // pega o título e o conteudo do documento
                }
            ]
        });
        logger.info('Permissões listadas', { documentId: req.params.documentId, userId: req.user.id });
        res.json(permissions);
    } catch (err) {
        logger.error('Erro ao listar permissões', { error: err.message, userId: req.user.id });
        res.status(500).json({ error: 'Erro ao listar permissões.' });
    }
});
export default permissionsRouter;
