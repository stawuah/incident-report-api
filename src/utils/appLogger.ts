import winston from 'winston';
import { Logger } from './tempLogger';

// Create a logger for general application logs
const appLogger = new Logger({
	level: 'info',
	format: winston.format.json(),
	transports: [
		new winston.transports.Console(),
		new winston.transports.File({ filename: 'app.log' }),
	],
});

// Create a logger for HTTP request logging
const httpLogger = new Logger({
	level: 'http',
	format: winston.format.combine(
		winston.format.json(),
		winston.format.printf(({ level, message, timestamp, meta }) => {
			return `${timestamp} [${level}]: ${message} - ${meta.method} ${meta.url}`;
		}),
	),
	transports: [
		new winston.transports.Console(),
		new winston.transports.File({ filename: 'http.log' }),
	],
});

export { appLogger, httpLogger };
