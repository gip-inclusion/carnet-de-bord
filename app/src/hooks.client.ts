import * as Sentry from '@sentry/svelte';

import type { HandleClientError } from '@sveltejs/kit';
import { captureException, initSentry } from '$lib/utils/sentry';

initSentry(Sentry);

export const handleError = (async ({ error, event }) => {
	console.error('handleError', error, event);

	captureException(error as Error);

	return {
		message: 'Une erreur est survenue.',
	};
}) satisfies HandleClientError;
