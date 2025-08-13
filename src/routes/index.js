import { Router } from 'express';
import usersRouter from './users.js';
import documentsRouter from './documents.js';
import permissionsRouter from './permissions.js';
import revisionRrouter from './revisions.js';
import authRouter from './auth.js';

const router = Router();
router.use('/login', authRouter); // Import and use the auth routes
router.use('/users', usersRouter);
router.use('/documents', documentsRouter);
router.use('/permissions', permissionsRouter);
router.use('/revisions', revisionRrouter);



export default router;
