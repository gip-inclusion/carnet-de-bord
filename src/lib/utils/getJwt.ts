import { getSecret } from '$lib/config/jwk/getSecret';
import jwt, { SignOptions } from 'jsonwebtoken';

export function getJwtUser({
	id,
	type,
	username
}: {
	id: string;
	username: string;
	type: string;
}): {
	id: string;
	username: string;
	roles: string[];
	token: string;
	type: string;
} {
	const token = getJwt({ id, type });
	return {
		id: id,
		username: username,
		roles: [type],
		token: token,
		type: type
	};
}

export function getJwt({ id, type }: { id: string; type: string }): string {
	const signOptions: SignOptions = {
		algorithm: 'RS256',
		expiresIn: '30d',
		subject: id
	};

	const hasuraClaims = getHasuraClaims(id, type);
	const claim = {
		'https://hasura.io/jwt/claims': hasuraClaims,
		id: id,
		role: type
	};

	const { key } = getSecret();

	const token = jwt.sign(claim, key, signOptions);
	return token;
}

function getHasuraClaims(id: string, type: string): unknown {
	return {
		'x-hasura-allowed-roles': [type],
		'x-hasura-default-role': type,
		'x-hasura-user-id': `${id}`
	};
}
