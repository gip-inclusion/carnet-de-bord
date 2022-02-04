import { getJwtKey } from '$lib/config/variables/private';
import type { SignOptions } from 'jsonwebtoken';
import jwt from 'jsonwebtoken';

export function getJwtUser({
	id,
	type,
	username,
	managerId,
	professionalId,
	beneficiaryId,
	deploymentId,
	adminStructureId,
}: {
	id: string;
	username: string;
	type: string;
	managerId: string;
	professionalId: string;
	beneficiaryId: string;
	deploymentId: string;
	adminStructureId: string;
}): {
	id: string;
	username: string;
	roles: string[];
	token: string;
	type: string;
} {
	const token = getJwt({ id, type, beneficiaryId, professionalId, managerId, deploymentId, adminStructureId });
	return {
		id: id,
		username: username,
		roles: [type],
		token: token,
		type: type,
	};
}

export function getJwt({
	id,
	type,
	beneficiaryId,
	professionalId,
	managerId,
	deploymentId,
	adminStructureId,
}: {
	id: string;
	type: string;
	beneficiaryId: string;
	professionalId: string;
	managerId: string;
	deploymentId: string;
	adminStructureId: string;
}): string {
	const signOptions: SignOptions = {
		algorithm: 'HS256',
		expiresIn: '30d',
		subject: id,
	};

	const hasuraClaims = getHasuraClaims(
		id,
		type,
		beneficiaryId,
		professionalId,
		managerId,
		deploymentId,
		adminStructureId
	);
	const claim = {
		'https://hasura.io/jwt/claims': hasuraClaims,
		id: id,
		role: type,
		beneficiaryId,
		professionalId,
		deploymentId,
		managerId,
	};

	const { key } = getJwtKey();

	const token = jwt.sign(claim, key, signOptions);
	return token;
}

function getHasuraClaims(
	id: string,
	type: string,
	beneficiaryId: string,
	professionalId: string,
	managerId: string,
	deploymentId: string,
	adminStructureId: string
): unknown {
	return {
		'x-hasura-allowed-roles': [type],
		'x-hasura-default-role': type,
		'x-hasura-user-id': `${id}`,
		'x-hasura-professional-id': `${professionalId}`,
		'x-hasura-beneficiary-id': `${beneficiaryId}`,
		'x-hasura-manager-id': `${managerId}`,
		'x-hasura-adminStructure-id': `${adminStructureId}`,
		'x-hasura-deployment-id': `${deploymentId}`,
	};
}
