export const updatePermission = async (req, res) => {
    try {
        const { access } = req.body;
        const permission = await Permission.findByPk(req.params.id);
        if (!permission) {
            logger.warn('Tentativa de atualizar permissão inexistente', { permissionId: req.params.id, userId: req.user.id });
            return res.status(404).json({ error: 'Permissão não encontrada.' });
        }
        if (access) permission.access = access;
        await permission.save();
        logger.info('Permissão atualizada', { permissionId: permission.id, userId: req.user.id });
        res.json(permission);
    } catch (err) {
        logger.error('Erro ao atualizar permissão', { error: err.message, userId: req.user.id });
        res.status(500).json({ error: 'Erro ao atualizar permissão.' });
    }
};

export const deletePermission = async (req, res) => {
    try {
        const permission = await Permission.findByPk(req.params.id);
        if (!permission) {
            logger.warn('Tentativa de remover permissão inexistente', { permissionId: req.params.id, userId: req.user.id });
            return res.status(404).json({ error: 'Permissão não encontrada.' });
        }
        await permission.destroy();
        logger.info('Permissão removida', { permissionId: req.params.id, userId: req.user.id });
        res.json({ message: 'Permissão removida com sucesso.' });
    } catch (err) {
        logger.error('Erro ao remover permissão', { error: err.message, userId: req.user.id });
        res.status(500).json({ error: 'Erro ao remover permissão.' });
    }
};
import Permission from '../models/Permission.js';
import User from '../models/User.js';
import Document from '../models/Document.js';
import logger from '../utils/logger.js';

export const setPermission = async (req, res) => {
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
};

export const listPermissions = async (req, res) => {
    try {
        const permissions = await Permission.findAll({
            where: { documentId: req.params.documentId },
            include: [
                {
                    model: User,
                    attributes: ['id', 'username', 'email']
                },
                {
                    model: Document,
                    attributes: ['id', 'title', 'content']
                }
            ]
        });
        res.json(permissions);
    } catch (err) {
        logger.error('Erro ao listar permissões', { error: err.message, userId: req.user.id });
        res.status(500).json({ error: 'Erro ao listar permissões.' });
    }
};
