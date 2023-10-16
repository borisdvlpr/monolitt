require('dotenv').config();
import express, { Application } from 'express';
import config from 'config';
import log from './utils/logger.util';
import connectDB from './db/dbConnect';
import routes from './routes';
import deserializeUser from './middleware/deserializeUser';
import sessionScheduler from './utils/cron.util';

const app: Application = express();
const PORT: number = config.get('port'); 

// Middleware used to parse body
app.use(express.json());
// We want to deserialize the user in every route, but don't want to add it manually
// ... to every route (not a good practice, might forget something)
app.use(deserializeUser);
app.use(routes);

app.listen(PORT, () => {
	log.info(`App started at http://localhost:${PORT}`);

	connectDB();
	sessionScheduler();
});
