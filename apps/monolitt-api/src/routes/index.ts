import express, { Router, Response } from 'express';
import user from './user.routes';
import auth from './session.routes';

const router: Router = express.Router();

router.use(user);
router.use(auth);

router.get('/healthcheck', (_, res: Response) => res.sendStatus(200));

export default router;