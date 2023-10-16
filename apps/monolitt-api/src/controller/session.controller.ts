import { Request, Response } from 'express';
import { get } from 'lodash';
import { CreateSessionInputSchema } from '../schema/session.schema';
import { signToken, findSessionById, createSession, findAllSessions, deleteSession, updateSession } from '../service/session.service';
import { findUserByEmail, findUserById } from '../service/user.service';
import { verifyJWT } from '../utils/jwt.util';

export async function createSessionHandler(req: Request<{}, {}, CreateSessionInputSchema>, res: Response) {
	const {email, password} = req.body;
	const message = 'Invalid email or password.';

	const user = await findUserByEmail(email);

	if(!user) {
		return res.send(message);
	}

	if(!user.verified) {
		return res.send('Please verify your email');
	}

	const isValid = await user.validatePassword(password);

	if(!isValid) {
		return res.send(message);
	}

	// creates the session
	const session = await createSession({userID: user._id.toString()});

	// sign an access token
	const accessToken = await signToken('accessToken', user, session._id.toString());

	// sign a refresh token
	const refreshToken = await signToken('refreshToken', user, session._id.toString());

	// send the tokens
	return res.send({accessToken, refreshToken});
} 

export async function getUserSessionsHandler(req: Request, res: Response) {
	const userID = res.locals.user._id;
	const sessions = await findAllSessions({user: userID, valid: true});

	return res.send(sessions);
}

export async function refreshAccessTokenHandler(req: Request, res: Response) {
	const refreshToken = get(req, 'headers.x-refresh');

	// Decoded refresh token
	// refreshToken was signed with session id, so we can retreve the id from the token
	const decoded = verifyJWT<{session: string}>(refreshToken, 'refreshTokenPublicKey');

	if(!decoded) {
		return res.status(401).send('Could not refresh access token.');
	}
	
	const session = await findSessionById(decoded.session);

	if(!session || !session.valid) {
		return res.status(401).send('Could not refresh access token.');
	}

	const user = await findUserById(String(session.user));

	if(!user) {
		return res.status(401).send('Could not refresh access token.');
	}

	const accessToken = await signToken('accessToken', user, String(session._id));

	await updateSession({ _id: session._id }, { updatedAt: Date.now() });

	return res.send({accessToken});
}

export async function deleteSessionHandler(req: Request, res: Response) {
	const sessionId = res.locals.user.session;

	await deleteSession(sessionId);

	return res.send({accessToken: null, refreshToken: null});
}
