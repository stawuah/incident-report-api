import express, { NextFunction, Response, Request } from 'express';
import { CustomError } from './middleware/errHandler';
import cors from 'cors';
import helmet from 'helmet';
import incidentRoutes from './routes/incidentRoute';
import db from '../src/db/db';
import { Pool } from 'pg';

const app = express();

app.use(cors());
app.use(
	helmet({
		contentSecurityPolicy: false,
		xDownloadOptions: false,
	}),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/health-check', function (req, res) {
	res.status(200).send('ok');
});

app.use('/api', incidentRoutes(db as Pool));
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
	if (err instanceof CustomError) {
		return res.status(err.statusCode).json({ error: err.message });
	}
	console.error(err);
	res.status(500).json({ error: 'Internal Server Error' });
	_next();
});

export default app;
