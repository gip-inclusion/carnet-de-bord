import type { Handle, HandleServerError } from '@sveltejs/kit';
import path from 'path';
import { config as configDotenv } from 'dotenv';
import { logger } from '$lib/utils/logger';

// hack: this is still needed since providing .env in svelte.config
// do not work properly (ie: $env/dynamic/public are not set correctly)
if (process.env.NODE_ENV !== 'production') {
	configDotenv({ path: path.resolve('../.env') });
}

export const handle: Handle = async ({ event, resolve }) => {
	const requestStartTime = Date.now();

	const response = await resolve(event, {
		// this is needed to make it work on server side request
		// in order to include Content-type header
		// @see https://kit.svelte.dev/docs/hooks#server-hooks-handle
		filterSerializedResponseHeaders: (name) => name.toLowerCase().startsWith('content'),
	});

	logger.info({
		startTime: new Date(requestStartTime).toISOString(),
		event: 'response',
		method: event.request.method,
		url: event.url,
		duration: `${Date.now() - requestStartTime}ms`,
		status: response.status,
	});
	return response;
};

export const handleError: HandleServerError = ({ error, event }) => {
	const err = error as Error;
	logger.error({
		event: 'error',
		err: {
			message: err?.message ?? 'unknow error',
			stack: err?.stack ?? null,
		},
		method: event.request.method,
		url: event.url,
	});
};
