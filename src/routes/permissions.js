import { Router } from 'express';
import Permission from '../models/Permission.js';
import User from '../models/User.js';
import Document from '../models/Document.js';
import { authenticateJWT } from '../midlewares/auth.js';

const permissionsRouter = Router();

// Definir permissão de utilizador num documento
permissionsRouter.post('/', authenticateJWT, async (req, res) => {
    try {
        const { userId, documentId, access } = req.body;
        if (!userId || !documentId || !access) {
            return res.status(400).json({ error: 'Campos obrigatórios em falta.' });
        }
        const permission = await Permission.create({ userId, documentId, access });
        res.status(201).json(permission);
    } catch (err) {
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

        res.json(permissions);
    } catch (err) {
        res.status(500).json({ error: 'Erro ao listar permissões.' });
    }
});
export default permissionsRouter;
