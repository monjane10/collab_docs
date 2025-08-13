import { Router } from 'express';
import Revision from '../models/Revision.js';

const revisionRrouter = Router();

// Listar revisões de um documento
revisionRrouter.get('/:documentId', async (req, res) => {
  try {
    const revisions = await Revision.findAll({ where: { documentId: req.params.documentId } });
    res.json(revisions);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao listar revisões.' });
  }
});

// Reverter para uma revisão
revisionRrouter.post('/:documentId/revert', async (req, res) => {
  try {
    const { revisionId } = req.body;
    const revision = await Revision.findByPk(revisionId);
    if (!revision) return res.status(404).json({ error: 'Revisão não encontrada.' });
    // Aqui pode adicionar lógica para atualizar o documento com o conteúdo da revisão
    res.json({ message: 'Documento revertido para revisão.', revision });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao reverter revisão.' });
  }
});

export default revisionRrouter;
