import { getJwtKey } from '$lib/config/variables/private.js';
import { error, json } from '@sveltejs/kit';
import { verify } from 'jsonwebtoken';
import type { RequestHandler } from './$types';
import * as yup from 'yup';

const TokenSchema = yup.object().shape({
	id: yup.string().required(),
});

export const GET = (async ({ cookies }) => {
	const { key, type } = getJwtKey();
	const jwt = cookies.get('jwt');
	if (!jwt) {
		throw error(401);
	}
	try {
		const rawData = verify(jwt, key, { algorithms: [type] });
		const token = TokenSchema.cast(rawData);
		return json({ accountId: token.id });
	} catch {
		throw error(400);
	}
}) satisfies RequestHandler;
