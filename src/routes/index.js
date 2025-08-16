import { Router } from 'express';
import usersRouter from './users.js';
import documentsRouter from './documents.js';
import permissionsRouter from './permissions.js';
import revisionRrouter from './revisions.js';
import authRouter from './auth.js';
import metricsRouter from './metrics.js'

const router = Router();
router.use('/login', authRouter); 
router.use('/users', usersRouter);
router.use('/documents', documentsRouter);
router.use('/permissions', permissionsRouter);
router.use('/revisions', revisionRrouter);
router.use('/metrics', metricsRouter);



export default router;
