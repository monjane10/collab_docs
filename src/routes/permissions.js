import { Router } from 'express';
import Permission from '../models/Permission.js';

const permissionsRouter = Router();


// Definir permissão de utilizador num documento
permissionsRouter.post('/', async (req, res) => {
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
permissionsRouter.get('/:documentId', async (req, res) => {
  try {
    const permissions = await Permission.findAll({ where: { documentId: req.params.documentId } });
    res.json(permissions);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao listar permissões.' });
  }
});

export default permissionsRouter;
