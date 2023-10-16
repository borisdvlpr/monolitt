import { Request, Response, NextFunction } from 'express';
import { omit } from 'lodash';
import { verifyJWT } from '../utils/jwt.util';

// This middleware gets the Access Token from the authorization header, verifies
// ... it and then attaches the user to the res.locals property
const deserializeUser = async (req: Request, res: Response, next: NextFunction) => {
	// Get's the token out of the authorization header
	const accessToken = (req.headers.authorization || '').replace(/^Bearer\s/, '');

	if(!accessToken) {
		return next();
	}

	const decoded = verifyJWT(accessToken, 'accessTokenPublicKey');

	if(decoded) {
		res.locals.user = omit(decoded, 'session');
	}
	
	return next();
};

export default deserializeUser;
