import User from '../models/User.js';

export const revertRevision = async (req, res) => {
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
};
import Revision from '../models/Revision.js';
import Document from '../models/Document.js';
import logger from '../utils/logger.js';

export const listRevisions = async (req, res) => {
  try {
    const revisions = await Revision.findAll({
      where: { documentId: req.params.documentId },
      include: [
        {
          model: User,
          as: "editor", 
          attributes: ["id", "username"] // só pega o que você precisa
        }
      ]
    });

    console.log("DocumentId recebido:", req.params.documentId);
    console.log("Revisões encontradas:", revisions.length);

    logger.info("Revisões listadas", {
      documentId: req.params.documentId,
      userId: req.user.id,
      username: req.user.username
    });

    res.json(revisions);
  } catch (err) {
    logger.error("Erro ao listar revisões", {
      error: err.message,
      userId: req.user.id
    });
    res.status(500).json({ error: "Erro ao listar revisões." });
  }
};


export const createAutoRevision = async (req, res) => {
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
};
