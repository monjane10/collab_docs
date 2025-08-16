import { Router } from 'express';
import { login } from '../controllers/authController.js';

const authRouter = Router();

// Login
authRouter.post('/', login);

export default authRouter;
