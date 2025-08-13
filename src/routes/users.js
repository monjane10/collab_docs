import { Router } from 'express';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import { authenticateJWT } from '../midlewares/auth.js';
import logger from '../utils/logger.js';

const router = Router();

// Criar utilizador (sem autenticação)
router.post('/', async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    if (!username || !email || !password) {
      logger.warn('Tentativa de criar utilizador com dados em falta', { body: req.body });
      return res.status(400).json({ error: 'Campos obrigatórios em falta.' });
    }
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ username, email, password: hash, role });
    logger.info('Utilizador criado', { userId: user.id });
    res.status(201).json({ id: user.id, username: user.username, email: user.email, role: user.role });
  } catch (err) {
    logger.error('Erro ao criar utilizador', { error: err.message });
    res.status(500).json({ error: 'Erro ao criar utilizador.', details: err.message });
  }
});

// Listar utilizadores (protegido)
router.get('/', authenticateJWT, async (req, res) => {
  try {
    const users = await User.findAll({ attributes: ['id', 'username', 'email', 'role', 'createdAt'] });
    logger.info('Utilizadores listados', { userId: req.user.id });
    res.json(users);
  } catch (err) {
    logger.error('Erro ao listar utilizadores', { error: err.message, userId: req.user.id });
    res.status(500).json({ error: 'Erro ao listar utilizadores.' });
  }
});

// Detalhes de utilizador (protegido)
router.get('/:id', authenticateJWT, async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, { attributes: ['id', 'username', 'email', 'role', 'createdAt'] });
    if (!user) {
      logger.warn('Utilizador não encontrado', { userId: req.params.id });
      return res.status(404).json({ error: 'Utilizador não encontrado.' });
    }
    logger.info('Utilizador consultado', { userId: user.id });
    res.json(user);
  } catch (err) {
    logger.error('Erro ao obter utilizador', { error: err.message, userId: req.user.id });
    res.status(500).json({ error: 'Erro ao obter utilizador.' });
  }
});

// Atualizar utilizador (protegido)
router.put('/:id', authenticateJWT, async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    const user = await User.findByPk(req.params.id);
    if (!user) {
      logger.warn('Tentativa de atualizar utilizador inexistente', { userId: req.params.id });
      return res.status(404).json({ error: 'Utilizador não encontrado.' });
    }
    if (password) user.password = await bcrypt.hash(password, 10);
    if (username) user.username = username;
    if (email) user.email = email;
    if (role) user.role = role;
    await user.save();
    logger.info('Utilizador atualizado', { userId: user.id });
    res.json({ id: user.id, username: user.username, email: user.email, role: user.role });
  } catch (err) {
    logger.error('Erro ao atualizar utilizador', { error: err.message, userId: req.user.id });
    res.status(500).json({ error: 'Erro ao atualizar utilizador.' });
  }
});

// Remover utilizador (protegido)
router.delete('/:id', authenticateJWT, async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      logger.warn('Tentativa de remover utilizador inexistente', { userId: req.params.id });
      return res.status(404).json({ error: 'Utilizador não encontrado.' });
    }
    await user.destroy();
    logger.info('Utilizador removido', { userId: req.params.id });
    res.json({ message: 'Utilizador removido com sucesso.' });
  } catch (err) {
    logger.error('Erro ao remover utilizador', { error: err.message, userId: req.user.id });
    res.status(500).json({ error: 'Erro ao remover utilizador.' });
  }
});

export default router;
