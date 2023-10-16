import { Request, Response } from 'express';
import { nanoid } from 'nanoid';
import { CreateUserInputSchema, ForgotPasswordInputSchema, ResetPasswordInputSchema, VerifyUserInputSchema } from '../schema/user.schema';
import { createUser, findUserById, findUserByEmail } from '../service/user.service';
import log from '../utils/logger.util';
import sendEmail from '../utils/mailer.util';

// Hence first req parameters are not needed, they can be empty objects. The third one, the reqBody, 
// ... needs to be defined as the same type as the CreateUserInputSchema.
export async function createUserHandler(req: Request<{}, {}, CreateUserInputSchema>, res: Response) {
	const body = req.body;

	try {
		// Since the controllers do not communicate with the database, the user.service is used
		const user = await createUser(body);

		sendEmail({
			from: 'test@example.com',
			to: user.email,
			subject: 'Verify your account!',
			text: `Verification code: ${user.verificationCode} | ID: ${user._id}`
		});

		res.status(200).send('User successfully created.');

	} catch(e: any) {
		if(e.code === 11000) {
			return res.status(409).send('Account already exists');
		}

		return res.status(500).send(e);
	}
}

// The URL params are the first params on the Request, so they need to be defined as the same
// ... type as the VerifyUserInputSchema
export async function verifyUserHandler(req: Request<VerifyUserInputSchema>, res: Response) {
	const id = req.params.id;
	const verificationCode = req.params.verificationCode;

	// Find the user by id
	const user = await findUserById(id);

	// Check if user exists
	if(!user) {
		return res.send('Could not found user.');
	}

	// Check to see if they are already verified
	if(user.verified) {
		return res.send('User is already verified.');
	}
	
	// CHeck to see if the verification code matches
	if(user.verificationCode === verificationCode) {
		user.verified = true;
		await user.save();

		return res.send('User verified');
	}

	return res.send('Could not verify user');
}

export async function forgotPasswordHandler(req: Request<{}, {}, ForgotPasswordInputSchema>, res: Response) {
	const { email } = req.body;
	const user = await findUserByEmail(email);

	const message = 'If a user with that email is registered, you will recieve a password reset email.';

	if(!user) {
		log.debug(`User with email ${email} does not exist.`);
		return res.send(message);
	}

	if(!user.verified) {
		return res.send('User is not verified.').status(403);
	}

	// If the user exists and it's verified, it set's the passwordResetCode and saves it
	const passwordResetCode = nanoid();
	user.passwordResetCode = passwordResetCode;

	await user.save();

	await sendEmail({
		to: user.email,
		from: 'test@example.com',
		subject: 'Reset your account password.',
		text: `Password reset code: ${passwordResetCode} | Id: ${user.id}`
	});

	return res.send(message);
}

// Hence the RequestPasswordInputSchema is defined by two different objects, we have to
// ... call each one at their respective positions
export async function resetPasswordHandler(req: Request<ResetPasswordInputSchema['params'], {}, ResetPasswordInputSchema['body']>, res: Response) {
	const {id, passwordResetCode} = req.params;
	const {password} = req.body;

	const user = await findUserById(id);

	// Check if: user exists; passwordResetCode exists; passwordResetCode matches the one passed on the params
	if(!user || !user.passwordResetCode || user.passwordResetCode !== passwordResetCode) {
		return res.status(400).send('Could not reset user password.');
	}

	// Making sure that the passwordResetCode is only used once
	user.passwordResetCode = null;
	// Setting new password which is going to be hashed once the user is saved
	user.password = password;

	await user.save();

	return res.send('Succefully updated password.');
}

export async function getCurrentUserHandler(req: Request, res: Response) {
	return res.send(res.locals.user);
}
