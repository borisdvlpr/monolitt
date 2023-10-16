import { CronJob } from 'cron';
import log from './logger.util';
import config from 'config';
import { deleteExpiredSessions } from '../service/session.service';

export default function sessionScheduler() {
	const job = new CronJob('0 0 0 * * *', async () => {
		const deletionDate = Date.now() - (config.get<number>('sessionTimeout') * 60 * 1000);
		
		try {
			const count = await deleteExpiredSessions({createdAt : {$lte : deletionDate}});
			log.info(`Deleted ${count.deletedCount} expired sessions.`);

		} catch(err: any) {
			log.error(`Session Scheduler: ${err}`);
		}
	});

	job.start();
}