import { Router } from 'express';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';

const router = Router();

// Criar utilizador
router.post('/', async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Campos obrigatórios em falta.' });
    }
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ username, email, password: hash, role });
    res.status(201).json({ id: user.id, username: user.username, email: user.email, role: user.role });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao criar utilizador.', details: err.message });
  }
});

// Listar utilizadores
router.get('/', async (req, res) => {
  try {
    const users = await User.findAll({ attributes: ['id', 'username', 'email', 'role', 'createdAt'] });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao listar utilizadores.' });
  }
});

// Detalhes de utilizador
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, { attributes: ['id', 'username', 'email', 'role', 'createdAt'] });
    if (!user) return res.status(404).json({ error: 'Utilizador não encontrado.' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao obter utilizador.' });
  }
});

// Atualizar utilizador
router.put('/:id', async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: 'Utilizador não encontrado.' });
    if (password) user.password = await bcrypt.hash(password, 10);
    if (username) user.username = username;
    if (email) user.email = email;
    if (role) user.role = role;
    await user.save();
    res.json({ id: user.id, username: user.username, email: user.email, role: user.role });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao atualizar utilizador.' });
  }
});

// Remover utilizador
router.delete('/:id', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: 'Utilizador não encontrado.' });
    await user.destroy();
    res.json({ message: 'Utilizador removido com sucesso.' });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao remover utilizador.' });
  }
});

export default router;
