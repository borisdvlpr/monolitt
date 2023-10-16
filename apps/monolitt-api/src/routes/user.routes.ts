import express, { Router } from 'express';
import { createUserHandler, forgotPasswordHandler, getCurrentUserHandler, resetPasswordHandler, verifyUserHandler } from '../controller/user.controller';
import requireUser from '../middleware/requireUser';
import validateResource from '../middleware/validateResource';
import { createUserSchema, forgotPasswordSchema, resetPasswordSchema, verifyUserSchema } from '../schema/user.schema';

const router: Router = express.Router();

// Calls the validateResource middleware together with the Zod user schema to validate the user's
// ... request data, followed by the controller to handle the data
router.post('/api/users', validateResource(createUserSchema), createUserHandler);
router.post('/api/users/verify/:id/:verificationCode', validateResource(verifyUserSchema), verifyUserHandler);
router.post('/api/users/resetpassword', validateResource(forgotPasswordSchema), forgotPasswordHandler);
router.post('/api/users/resetpassword/:id/:passwordResetCode', validateResource(resetPasswordSchema), resetPasswordHandler);
router.get('/api/users/current', requireUser, getCurrentUserHandler);

export default router;
