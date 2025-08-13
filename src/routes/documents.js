import { Router } from 'express';
import Document from '../models/Document.js';
import User from '../models/User.js';
import { authenticateJWT } from '../midlewares/auth.js';
import { isOwner, hasWriteAccess } from '../midlewares/authorization.js';

const documentsRouter = Router();

// Criar documento (apenas quem tem acesso de escrita)
documentsRouter.post('/', authenticateJWT, hasWriteAccess, async (req, res) => {
  try {
    const { title, content, ownerId, collaborators } = req.body;
    if (!title || !ownerId) {
      return res.status(400).json({ error: 'Título e ownerId são obrigatórios.' });
    }
    const document = await Document.create({ title, content, ownerId });
    if (collaborators && Array.isArray(collaborators)) {
      await document.setCollaborators(collaborators);
    }
    res.status(201).json(document);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao criar documento.', details: err.message });
  }
});

// Listar documentos (apenas autenticados)
documentsRouter.get('/', authenticateJWT, async (req, res) => {
  try {
    const documents = await Document.findAll({ include: [{ model: User, as: 'owner', attributes: ['id', 'username', 'email'] }] });
    res.json(documents);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao listar documentos.' });
  }
});

// Detalhes do documento (apenas autenticados)
documentsRouter.get('/:id', authenticateJWT, async (req, res) => {
  try {
    const document = await Document.findByPk(req.params.id, { include: [{ model: User, as: 'owner', attributes: ['id', 'username', 'email'] }] });
    if (!document) return res.status(404).json({ error: 'Documento não encontrado.' });
    res.json(document);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao obter documento.' });
  }
});

// Atualizar documento (apenas quem tem acesso de escrita)
documentsRouter.put('/:id', authenticateJWT, hasWriteAccess, async (req, res) => {
  try {
    const { title, content, collaborators } = req.body;
    const document = await Document.findByPk(req.params.id);
    if (!document) return res.status(404).json({ error: 'Documento não encontrado.' });
    if (title) document.title = title;
    if (content) document.content = content;
    await document.save();
    if (collaborators && Array.isArray(collaborators)) {
      await document.setCollaborators(collaborators);
    }
    res.json(document);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao atualizar documento.' });
  }
});

// Remover documento (apenas owner ou admin)
documentsRouter.delete('/:id', authenticateJWT, isOwner, async (req, res) => {
  try {
    const document = await Document.findByPk(req.params.id);
    if (!document) return res.status(404).json({ error: 'Documento não encontrado.' });
    await document.destroy();
    res.json({ message: 'Documento removido com sucesso.' });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao remover documento.' });
  }
});

export default documentsRouter;
