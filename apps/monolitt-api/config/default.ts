export default {
	port: 8000,
	dbURI: 'mongodb://localhost:27017/ts-auth-boilerplate',
	logLevel: 'info',
	accessTokenPrivateKey: '',
	refreshTokenPrivateKey: '',
	accessTokenTTL: '15m',
	refreshTokenTTL: '31d',
	sessionTimeout: 72,
	smtp: {
		user: 'prince.kub98@ethereal.email',
		pass: 'YGHQbmfdJCNkN5HdRY',
		host: 'smtp.ethereal.email', 
		port: 587,
		secure: false
	}
};
