import createLogger from 'pino';
import { env } from '$env/dynamic/private';

const loggerOptions = {
	level: env.LOG_LEVEL ?? 'info',
};

const developmentOptions =
	process.env.NODE_ENV === 'production'
		? {}
		: {
				transport: {
					target: 'pino-pretty',
					options: {
						colorize: true,
					},
				},
		  };

export const logger = createLogger({ ...loggerOptions, ...developmentOptions });
