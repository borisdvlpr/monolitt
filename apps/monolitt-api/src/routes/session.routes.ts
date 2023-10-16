import express, { Router } from 'express';
import { createSessionHandler, deleteSessionHandler, getUserSessionsHandler, refreshAccessTokenHandler } from '../controller/session.controller';
import requireUser from '../middleware/requireUser';
import validateResource from '../middleware/validateResource';
import { createSessionSchema } from '../schema/session.schema';

const router: Router = express.Router();

router.post('/api/session', validateResource(createSessionSchema), createSessionHandler);
router.get('/api/sessions', requireUser, getUserSessionsHandler);
router.post('/api/session/refresh', refreshAccessTokenHandler);
router.delete('/api/session', requireUser, deleteSessionHandler);

export default router;