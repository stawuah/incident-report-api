class GlobalCustomError extends Error {
	public statusCode: number;

	constructor(message: string, statusCode: number) {
		super(message);
		this.name = this.constructor.name;
		this.statusCode = statusCode;
		Error.captureStackTrace(this, this.constructor);
	}
}

export class CustomError extends GlobalCustomError {
	constructor(message: string, statusCode: number) {
		super(message, statusCode);
	}
}
