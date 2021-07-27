import jwt, { SignOptions } from 'jsonwebtoken';

const { HASURA_GRAPHQL_JWT_SECRET } = process.env;

console.log({ HASURA_GRAPHQL_JWT_SECRET });

let jwtSecret;
try {
	jwtSecret = JSON.parse(HASURA_GRAPHQL_JWT_SECRET);
} catch (error) {
	console.error('[JWT], HASURA_GRAPHQL_JWT_SECRET is not a valid json');
}

export function getJwtUser({
	id,
	type,
	username,
	professionalId,
	beneficiaryId
}: {
	id: string;
	username: string;
	type: string;
	professionalId: string;
	beneficiaryId: string;
}): {
	id: string;
	username: string;
	roles: string[];
	token: string;
	type: string;
} {
	const token = getJwt({ id, type, beneficiaryId, professionalId });
	return {
		id: id,
		username: username,
		roles: [type],
		token: token,
		type: type
	};
}

export function getJwt({
	id,
	type,
	beneficiaryId,
	professionalId
}: {
	id: string;
	type: string;
	beneficiaryId: string;
	professionalId: string;
}): string {
	const signOptions: SignOptions = {
		algorithm: 'HS256',
		expiresIn: '30d',
		subject: id
	};

	const hasuraClaims = getHasuraClaims(id, type, beneficiaryId, professionalId);
	const claim = {
		'https://hasura.io/jwt/claims': hasuraClaims,
		id: id,
		role: type
	};

	const { key } = jwtSecret;

	const token = jwt.sign(claim, key, signOptions);
	return token;
}

function getHasuraClaims(
	id: string,
	type: string,
	beneficiaryId: string,
	professionalId: string
): unknown {
	return {
		'x-hasura-allowed-roles': [type],
		'x-hasura-default-role': type,
		'x-hasura-user-id': `${id}`,
		'x-hasura-professional-id': `${professionalId}`,
		'x-hasura-beneficiary-id': `${beneficiaryId}`
	};
}
