import type { Handle } from '@sveltejs/kit';
import path from 'path';
import { config } from 'dotenv';

// hack: this is still needed since providing .env in svelte.config
// do not work properly (ie: $env/dynamic/public are not set correctly)
config({ path: path.resolve('../.env') });

export const handle: Handle = async ({ event, resolve }) => {
	return await resolve(event, {
		// this is needed to make it work on server side request
		// in order to include Content-type header
		// @see https://kit.svelte.dev/docs/hooks#server-hooks-handle
		filterSerializedResponseHeaders: (name) => name.toLowerCase().startsWith('content'),
	});
};
