import { Router } from 'express';
import Document from '../models/Document.js';
import User from '../models/User.js';
import { authenticateJWT } from '../midlewares/auth.js';
import { isOwner, hasWriteAccess } from '../midlewares/authorization.js';
import logger from '../utils/logger.js';

const documentsRouter = Router();

// Criar documento (apenas quem tem acesso de escrita)
documentsRouter.post('/', authenticateJWT, hasWriteAccess, async (req, res) => {
  try {
    const { title, content, ownerId, collaborators } = req.body;
    if (!title || !ownerId) {
      logger.warn('Tentativa de criar documento sem título ou ownerId', { userId: req.user.id });
      return res.status(400).json({ error: 'Título e ownerId são obrigatórios.' });
    }
    const document = await Document.create({ title, content, ownerId });
    if (collaborators && Array.isArray(collaborators)) {
      await document.setCollaborators(collaborators);
    }
    logger.info('Documento criado', { documentId: document.id, userId: req.user.id });
    res.status(201).json(document);
  } catch (err) {
    logger.error('Erro ao criar documento', { error: err.message, userId: req.user.id });
    res.status(500).json({ error: 'Erro ao criar documento.', details: err.message });
  }
});

// Listar documentos (apenas autenticados)
documentsRouter.get('/', authenticateJWT, async (req, res) => {
  try {
    const documents = await Document.findAll({ include: [{ model: User, as: 'owner', attributes: ['id', 'username', 'email'] }] });
    logger.info('Documentos listados', { userId: req.user.id });
    res.json(documents);
  } catch (err) {
    logger.error('Erro ao listar documentos', { error: err.message, userId: req.user.id });
    res.status(500).json({ error: 'Erro ao listar documentos.' });
  }
});

// Detalhes do documento (apenas autenticados)
documentsRouter.get('/:id', authenticateJWT, async (req, res) => {
  try {
    const document = await Document.findByPk(req.params.id, { include: [{ model: User, as: 'owner', attributes: ['id', 'username', 'email'] }] });
    if (!document) {
      logger.warn('Documento não encontrado', { documentId: req.params.id, userId: req.user.id });
      return res.status(404).json({ error: 'Documento não encontrado.' });
    }
    logger.info('Documento consultado', { documentId: document.id, userId: req.user.id });
    res.json(document);
  } catch (err) {
    logger.error('Erro ao obter documento', { error: err.message, userId: req.user.id });
    res.status(500).json({ error: 'Erro ao obter documento.' });
  }
});

// Atualizar documento (apenas quem tem acesso de escrita)
documentsRouter.put('/:id', authenticateJWT, hasWriteAccess, async (req, res) => {
  try {
    const { title, content, collaborators } = req.body;
    const document = await Document.findByPk(req.params.id);
    if (!document) {
      logger.warn('Tentativa de atualizar documento inexistente', { documentId: req.params.id, userId: req.user.id });
      return res.status(404).json({ error: 'Documento não encontrado.' });
    }
    if (title) document.title = title;
    if (content) document.content = content;
    await document.save();
    if (collaborators && Array.isArray(collaborators)) {
      await document.setCollaborators(collaborators);
    }
    logger.info('Documento atualizado', { documentId: document.id, userId: req.user.id });
    res.json(document);
  } catch (err) {
    logger.error('Erro ao atualizar documento', { error: err.message, userId: req.user.id });
    res.status(500).json({ error: 'Erro ao atualizar documento.' });
  }
});

// Remover documento (apenas owner ou admin)
documentsRouter.delete('/:id', authenticateJWT, isOwner, async (req, res) => {
  try {
    const document = await Document.findByPk(req.params.id);
    if (!document) {
      logger.warn('Tentativa de remover documento inexistente', { documentId: req.params.id, userId: req.user.id });
      return res.status(404).json({ error: 'Documento não encontrado.' });
    }
    await document.destroy();
    logger.info('Documento removido', { documentId: req.params.id, userId: req.user.id });
    res.json({ message: 'Documento removido com sucesso.' });
  } catch (err) {
    logger.error('Erro ao remover documento', { error: err.message, userId: req.user.id });
    res.status(500).json({ error: 'Erro ao remover documento.' });
  }
});

export default documentsRouter;
