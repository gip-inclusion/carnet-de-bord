import { getJwtKey } from '$lib/config/variables/private';
import type { SignOptions } from 'jsonwebtoken';
import jwt from 'jsonwebtoken';

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
		role: type,
		beneficiaryId,
		professionalId
	};

	const { key } = getJwtKey();

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
