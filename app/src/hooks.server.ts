import type { Handle, HandleServerError } from '@sveltejs/kit';
import { logger } from '$lib/utils/logger';
import * as Sentry from '@sentry/node';
import { initSentry, captureException } from '$lib/utils/sentry';
import { expandURLsInCSP } from '$lib/utils/csp';

initSentry(Sentry);

export const handle: Handle = async ({ event, resolve }) => {
	const requestStartTime = Date.now();

	const response = await resolve(event, {
		// this is needed to make it work on server side request
		// in order to include Content-type header
		// @see https://kit.svelte.dev/docs/hooks#server-hooks-handle
		filterSerializedResponseHeaders: (name) => name.toLowerCase().startsWith('content'),
	});

	const csp = response.headers.get('content-security-policy');
	if (csp) {
		response.headers.set('content-security-policy', expandURLsInCSP(csp));
	}

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
	if (err?.message.match(/^Not found:/)) {
		return;
	}
	captureException(err);
};
