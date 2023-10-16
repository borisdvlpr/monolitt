import jwt from 'jsonwebtoken';
import config from 'config';

export function signJWT(
	object: Object, 
	keyname: 'accessTokenPrivateKey' | 'refreshTokenPrivateKey',
	options?: jwt.SignOptions | undefined) {

	// The keys are in base64, which means they need to be converted to string before using
	const signingKey = Buffer.from(config.get<string>(keyname), 'base64').toString('ascii');

	return jwt.sign(object, signingKey, {
		...(options && options),
		// Means that we are using public and private key
		algorithm: 'RS256'
	});
}

export function verifyJWT<T>(
	token: string, 
	keyname: 'accessTokenPublicKey' | 'refreshTokenPublicKey'): T | null {

	const publicKey = Buffer.from(config.get<string>(keyname), 'base64').toString('ascii');

	try {
		const decoded = jwt.verify(token, publicKey) as T;
		return decoded;

	} catch(err: any) {
		return null; 
	}
}
 