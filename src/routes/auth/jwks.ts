import { getSecret } from '$lib/config/jwk/getSecret';
import type { RequestHandler } from '@sveltejs/kit';
import Rasha from 'rasha';

/**
 * Sends the JWT key set
 */

export const get: RequestHandler = async () => {
	const { publicKey, kid } = await getSecret();
	const data = await Rasha.import({ pem: publicKey, public: false });
	const jwk = {
		...data,
		kty: 'RSA',
		alg: 'RS256',
		kid,
		use: 'sig'
	};
	const jwks = {
		keys: [jwk]
	};
	return {
		status: 200,
		body: JSON.stringify(jwks, undefined, 2)
	};
};
