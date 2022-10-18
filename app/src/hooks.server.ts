import type { Handle, HandleServerError } from '@sveltejs/kit';
import path from 'path';
import { config } from 'dotenv';
// jsonwebtoken is cjs module and has no verify named export

config({ path: path.resolve('../.env') });

export const handle: Handle = async ({ event, resolve }) => {
	return resolve(event);
};
export const handleError: HandleServerError = ({ error }) => {
	// example integration with https://sentry.io/
	console.log('errror', error);
	return {
		message: 'Whoops!',
		code: 'UNKNOWN',
	};
};
