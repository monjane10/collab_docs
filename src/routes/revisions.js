import { Router } from 'express';
import Revision from '../models/Revision.js';
import Document from '../models/Document.js';
import User from '../models/User.js';

const revisionRrouter = Router();

// Listar revisões de um documento
revisionRrouter.get('/:documentId', async (req, res) => {
    try {
        const revisions = await Revision.findAll({
            where: { documentId: req.params.documentId },
            include: [
                {
                    model: User,
                    as: 'editor',
                    attributes: ['id', 'username', 'email']
                }
            ]
        });
        res.json(revisions);
    } catch (err) {
        res.status(500).json({ error: 'Erro ao listar revisões.' });
    }
});

// Criar revisão automática ao atualizar documento
revisionRrouter.post('/:documentId/auto', async (req, res) => {
    try {
        const { content, editedById } = req.body;
        const document = await Document.findByPk(req.params.documentId);
        if (!document) return res.status(404).json({ error: 'Documento não encontrado.' });
        // Cria revisão antes de atualizar
        await Revision.create({ documentId: document.id, content: document.content, editedById });
        // Atualiza documento
        document.content = content;
        await document.save();
        res.json({ message: 'Documento atualizado e revisão criada.' });
    } catch (err) {
        res.status(500).json({ error: 'Erro ao criar revisão automática.' });
    }
});

// Reverter para uma revisão
revisionRrouter.post('/:documentId/revert', async (req, res) => {
    try {
        const { revisionId } = req.body;
        const revision = await Revision.findByPk(revisionId);
        if (!revision) return res.status(404).json({ error: 'Revisão não encontrada.' });
        const document = await Document.findByPk(req.params.documentId);
        if (!document) return res.status(404).json({ error: 'Documento não encontrado.' });
        document.content = revision.content;
        await document.save();
        res.json({ message: 'Documento revertido para revisão.', revision });
    } catch (err) {
        res.status(500).json({ error: 'Erro ao reverter revisão.' });
    }
});

export default revisionRrouter;
