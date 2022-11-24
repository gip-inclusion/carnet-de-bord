import type { Handle, HandleServerError } from '@sveltejs/kit';
import { logger } from '$lib/utils/logger';
import * as Sentry from '@sentry/node';
import { env } from '$env/dynamic/public';

const appVersion = __version__;
Sentry.init({
	dsn: env.PUBLIC_SENTRY_DSN,
	environment: env.PUBLIC_SENTRY_ENVIRONMENT,
	release: `carnet-de-bord-app@${appVersion}`,
});

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
	Sentry.captureException(err);
};
