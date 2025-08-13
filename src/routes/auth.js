import { Router } from 'express';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import logger from '../utils/logger.js';

const authRouter = Router();

// Login
authRouter.post('/', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      logger.warn('Tentativa de login com dados em falta', { body: req.body });
      return res.status(400).json({ error: 'Email e password são obrigatórios.' });
    }
    const user = await User.findOne({ where: { email } });
    if (!user) {
      logger.warn('Tentativa de login com email inválido', { email });
      return res.status(401).json({ error: 'Credenciais inválidas.' });
    }
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      logger.warn('Tentativa de login com password inválida', { email });
      return res.status(401).json({ error: 'Credenciais inválidas.' });
    }
    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
    logger.info('Login realizado com sucesso', { userId: user.id });
    res.json({ token, user: { id: user.id, username: user.username, email: user.email, role: user.role } });
  } catch (err) {
    logger.error('Erro ao autenticar', { error: err.message });
    res.status(500).json({ error: 'Erro ao autenticar.', details: err.message });
  }
});

export default authRouter;
