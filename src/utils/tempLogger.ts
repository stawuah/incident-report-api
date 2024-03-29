import winston, { Logger as WinstonLogger } from 'winston';
import { Request } from 'express';

class Logger {
	private logger: WinstonLogger;

	constructor(options: winston.LoggerOptions) {
		this.logger = winston.createLogger(options);
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

	http(req: Request, message: string) {
		this.logger.http(message, { method: req.method, url: req.url });
	}
}

export { Logger };
