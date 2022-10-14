import { getGraphqlAPI, getBackendAPI, getJwtKey } from '$lib/config/variables/private';
import type { Handle } from '@sveltejs/kit';
import cookie from 'cookie';
import path from 'path';
import { config } from 'dotenv';
// jsonwebtoken is cjs module and has no verify named export
import jwt from 'jsonwebtoken';

config({ path: path.resolve('../.env') });

export const handle: Handle = async ({ event, resolve }) => {
	return resolve(event);
};
