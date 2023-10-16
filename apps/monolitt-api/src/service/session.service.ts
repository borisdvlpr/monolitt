import config from 'config';
import SessionModel from '../model/session.model';
import { SessionDocument, UserDocument } from '../../global/types';
import { signJWT } from '../utils/jwt.util';
import { FilterQuery, UpdateQuery } from 'mongoose';

export async function createSession({userID}: {userID: string}) {
	return SessionModel.create({user: userID});
}

export async function findSessionById(id: string) {
	return SessionModel.findById(id);
}

export async function findAllSessions(query: FilterQuery<SessionDocument>) {
	return SessionModel.find(query).lean();
}

export async function updateSession(query: FilterQuery<SessionDocument>, update: UpdateQuery<SessionDocument>) {
	return SessionModel.updateOne(query, update);
}

export async function deleteSession(id: string) {
	return SessionModel.findByIdAndDelete(id);
}

export async function deleteExpiredSessions(query: FilterQuery<SessionDocument>) {
	return SessionModel.deleteMany(query);
}

export async function signToken(tokenType: 'accessToken' | 'refreshToken', user: UserDocument, sessionId: string) {
	const payload = user.toJSON();

	const token = signJWT(
		{...payload, session: sessionId}, `${tokenType}PrivateKey`, {
			expiresIn: config.get(`${tokenType}TTL`)
		}
	);

	return token;
}
