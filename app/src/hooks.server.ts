import type { Handle } from '@sveltejs/kit';
import path from 'path';
import { config } from 'dotenv';
// jsonwebtoken is cjs module and has no verify named export

// hack: this is still needed since providing .env in svelte.config
// do not work properly (ie: $env/dynamic/public are not set correctly)
config({ path: path.resolve('../.env') });

export const handle: Handle = async ({ event, resolve }) => {
	return resolve(event);
};
