import { Router } from 'express';
import usersRouter from './users.js';
import documentsRouter from './documents.js';
import permissionsRouter from './permissions.js';

const router = Router();

router.use('/users', usersRouter);
router.use('/documents', documentsRouter);
router.use('/permissions', permissionsRouter);


export default router;
