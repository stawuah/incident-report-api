import express, { NextFunction, Response, Request } from 'express';
import { CustomError } from './middleware/errHandler';
import 'dotenv/config';
import cors from 'cors';
import helmet from 'helmet';
import IncidentRoute from './routes/incidentRoute';

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(
	helmet({
		contentSecurityPolicy: false,
		xDownloadOptions: false,
	}),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', IncidentRoute);

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
	if (err instanceof CustomError) {
		return res.status(err.statusCode).json({ error: err.message });
	}
	console.error(err);
	res.status(500).json({ error: 'Internal Server Error' });
	_next();
});

app.listen(port, () => {
	console.log(`Server is running at http://localhost:${port}`);
});
