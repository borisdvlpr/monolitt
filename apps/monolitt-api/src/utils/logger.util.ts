import logger from 'pino';
import config from 'config';

const logLevel: string = config.get('logLevel');

const log = logger({
	transport: {
		target: 'pino-pretty',
		options: {
			colorize: true,
			translateTime: 'SYS:yyyy-mm-dd hh:MM:ss',
			pid: true,
		},
	},
	level: logLevel,
});

export default log;