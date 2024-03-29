import winston from 'winston';
import { Request } from 'express';

class Logger {
	private logger: winston.Logger;

	constructor() {
		this.logger = winston.createLogger({
			level: 'info',
			format: winston.format.combine(
				winston.format.timestamp(),
				winston.format.errors({ stack: true }),
				winston.format.splat(),
				winston.format.json(),
			),
			transports: [
				new winston.transports.Console({
					format: winston.format.combine(
						winston.format.colorize(),
						winston.format.simple(),
						winston.format.printf(
							({ level, message, timestamp }) => {
								return `${timestamp} [${level}]: ${message}`;
							},
						),
					),
				}),
				new winston.transports.File({
					filename: 'error.log',
					level: 'error',
					format: winston.format.combine(
						winston.format.uncolorize(),
						winston.format.prettyPrint(),
						winston.format.printf(
							({ level, message, timestamp }) => {
								return `${timestamp} [${level}]: ${message}`;
							},
						),
					),
				}),

				//If we use papertrail or betterstack
			],
		});
	}

	init() {
		this.logger.info('Logger initialized');
	}

	log(level: string, message: string) {
		this.logger.log(level, message);
	}

	error(message: string) {
		this.logger.error(message);
	}

	warn(message: string) {
		this.logger.warn(message);
	}

	info(message: string) {
		this.logger.info(message);
	}

	debug(message: string) {
		this.logger.debug(message);
	}

	http(request: Request, message: string) {
		const { method, originalUrl, ip } = request;
		this.logger.http(`${method} ${originalUrl} - ${ip} - ${message}`);
	}
}

export { Logger };
