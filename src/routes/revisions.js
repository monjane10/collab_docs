import { Router } from 'express';
import Revision from '../models/Revision.js';
import Document from '../models/Document.js';
import { authenticateJWT } from '../midlewares/auth.js';
import logger from '../utils/logger.js';

const revisionRrouter = Router();

// Listar revisões (protegido)
revisionRrouter.get('/:documentId', authenticateJWT, async (req, res) => {
  try {
    const revisions = await Revision.findAll({ where: { documentId: req.params.documentId } });
    logger.info('Revisões listadas', { documentId: req.params.documentId, userId: req.user.id });
    res.json(revisions);
  } catch (err) {
    logger.error('Erro ao listar revisões', { error: err.message, userId: req.user.id });
    res.status(500).json({ error: 'Erro ao listar revisões.' });
  }
});

// Criar revisão automática ao atualizar documento
revisionRrouter.post('/:documentId/auto', authenticateJWT, async (req, res) => {
  try {
    const { content, editedById } = req.body;
    const document = await Document.findByPk(req.params.documentId);
    if (!document) {
      logger.warn('Tentativa de revisão automática em documento inexistente', { documentId: req.params.documentId, userId: req.user.id });
      return res.status(404).json({ error: 'Documento não encontrado.' });
    }
    await Revision.create({ documentId: document.id, content: document.content, editedById });
    document.content = content;
    await document.save();
    logger.info('Revisão automática criada', { documentId: document.id, userId: req.user.id });
    res.json({ message: 'Documento atualizado e revisão criada.' });
  } catch (err) {
    logger.error('Erro ao criar revisão automática', { error: err.message, userId: req.user.id });
    res.status(500).json({ error: 'Erro ao criar revisão automática.' });
  }
});

// Reverter para uma revisão (protegido)
revisionRrouter.post('/:documentId/revert', authenticateJWT, async (req, res) => {
  try {
    const { revisionId } = req.body;
    const revision = await Revision.findByPk(revisionId);
    if (!revision) {
      logger.warn('Tentativa de reverter para revisão inexistente', { revisionId, userId: req.user.id });
      return res.status(404).json({ error: 'Revisão não encontrada.' });
    }
    const document = await Document.findByPk(req.params.documentId);
    if (!document) {
      logger.warn('Tentativa de reverter revisão em documento inexistente', { documentId: req.params.documentId, userId: req.user.id });
      return res.status(404).json({ error: 'Documento não encontrado.' });
    }
    document.content = revision.content;
    await document.save();
    logger.info('Documento revertido para revisão', { documentId: document.id, revisionId, userId: req.user.id });
    res.json({ message: 'Documento revertido para revisão.', revision });
  } catch (err) {
    logger.error('Erro ao reverter revisão', { error: err.message, userId: req.user.id });
    res.status(500).json({ error: 'Erro ao reverter revisão.' });
  }
});

export default revisionRrouter;
