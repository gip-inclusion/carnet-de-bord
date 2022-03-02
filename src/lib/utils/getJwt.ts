import { getJwtKey } from '$lib/config/variables/private';
import type { Account } from '$lib/graphql/_gen/typed-document-nodes';
import type { AppRoles } from '$lib/routes';
import type { SignOptions } from 'jsonwebtoken';
import jwt from 'jsonwebtoken';

export type JwtAccount = Pick<
	Account,
	'id' | 'type' | 'username' | 'managerId' | 'beneficiaryId' | 'adminStructureId' | 'professionalId'
> & { deploymentId: string };

export type JwtPayload = {
	id: string;
	role: AppRoles;
	beneficiaryId?: string;
	professionalId?: string;
	deploymentId?: string;
	managerId?: string;
	adminStructureId?: string;
};

export type HasuraClaims = {
	'x-hasura-allowed-roles': string[];
	'x-hasura-default-role': string;
	'x-hasura-user-id': string;
	'x-hasura-professional-id'?: string;
	'x-hasura-beneficiary-id'?: string;
	'x-hasura-manager-id'?: string;
	'x-hasura-adminStructure-id'?: string;
	'x-hasura-deployment-id'?: string;
};

export function createJwt(account: JwtAccount): string {
	const { id, type, managerId, professionalId, beneficiaryId, deploymentId, adminStructureId } =
		account;

	const signOptions: SignOptions = {
		algorithm: 'HS256',
		expiresIn: '30d',
		subject: id,
	};

	const claim = {
		'https://hasura.io/jwt/claims': getHasuraClaims(account),
		id: id,
		role: type,
		...(beneficiaryId && { beneficiaryId }),
		...(professionalId && { professionalId }),
		...(deploymentId && { deploymentId }),
		...(managerId && { managerId }),
		...(adminStructureId && { adminStructureId }),
	};

	const { key } = getJwtKey();

	const token = jwt.sign(claim, key, signOptions);
	return token;
}

function getHasuraClaims(account: JwtAccount): HasuraClaims {
	const { id, type, managerId, professionalId, beneficiaryId, deploymentId, adminStructureId } =
		account;

	return {
		'x-hasura-allowed-roles': [type],
		'x-hasura-default-role': type,
		'x-hasura-user-id': `${id}`,
		...(professionalId && { 'x-hasura-professional-id': `${professionalId}` }),
		...(beneficiaryId && { 'x-hasura-beneficiary-id': `${beneficiaryId}` }),
		...(managerId && { 'x-hasura-manager-id': `${managerId}` }),
		...(adminStructureId && { 'x-hasura-adminStructure-id': `${adminStructureId}` }),
		...(deploymentId && { 'x-hasura-deployment-id': `${deploymentId}` }),
	};
}
