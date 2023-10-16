import mongoose from 'mongoose';
import config from 'config';
import log from '../utils/logger.util';

export default async function connectDB() {
	const dbURI: string = config.get('dbURI');

	try {
		await mongoose.connect(dbURI);

		log.info('Connected to MongoDB.');

	} catch(err: any) {
		process.exit(1);
	}
}