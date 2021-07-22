/* eslint-disable @typescript-eslint/no-explicit-any */
import fnv from 'fnv-plus';
import {
	AUTH_PRIVATE_KEY,
	AUTH_PRIVATE_KEY_FILE,
	AUTH_PUBLIC_KEY,
	AUTH_PUBLIC_KEY_FILE
} from '../env';
import { DEV_PRIVATE_KEY } from './dev-secrets/private.pem.js';
import { DEV_PUBLIC_KEY } from './dev-secrets/public.pem.js';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function getSecret(): {
	key: string;
	kid: string;
	publicKey: string;
} {
	let authPrivateKeyFile;
	let authPublicKeyFile;
	let authPrivateKey;
	let authPublicKey;

	// dev (yarn test) and CI
	if (!(AUTH_PRIVATE_KEY || AUTH_PRIVATE_KEY_FILE)) {
		authPrivateKeyFile = DEV_PRIVATE_KEY;
	}
	if (!(AUTH_PUBLIC_KEY || AUTH_PUBLIC_KEY_FILE)) {
		authPublicKeyFile = DEV_PUBLIC_KEY;
	}

	if (authPrivateKeyFile) {
		authPrivateKey = DEV_PRIVATE_KEY;
	}
	if (authPublicKeyFile) {
		authPublicKey = DEV_PUBLIC_KEY;
	}

	const key = authPrivateKey.replace(/\\n/g, '\n');
	const publicKey = authPublicKey.replace(/\\n/g, '\n');

	// Key Identifier – Acts as an ‘alias’ for the key
	const kid = fnv.hash(publicKey, 128).hex();

	return {
		key,
		kid,
		publicKey
	};
}
