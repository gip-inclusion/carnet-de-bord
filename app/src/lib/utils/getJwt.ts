import { getJwtKey } from '$lib/config/variables/private';
import type { Account } from '$lib/graphql/_gen/typed-document-nodes';
import type { AppRoles } from '$lib/routes';
import type { SignOptions } from 'jsonwebtoken';
import jwt from 'jsonwebtoken';

export type JwtAccount = Pick<
	Account,
	| 'id'
	| 'type'
	| 'managerId'
	| 'beneficiaryId'
	| 'adminStructureId'
	| 'professionalId'
	| 'orientationManagerId'
> & { deploymentId: string; structureId?: string };

export type JwtPayload = {
	id: string;
	role: AppRoles;
	beneficiaryId?: string;
	professionalId?: string;
	deploymentId?: string;
	managerId?: string;
	adminStructureId?: string;
	orientationManagerId?: string;
	structureId?: string;
};

export type HasuraClaims = {
	'x-hasura-allowed-roles': string[];
	'x-hasura-default-role': string;
	'x-hasura-user-id': string;
	'x-hasura-professional-id'?: string;
	'x-hasura-beneficiary-id'?: string;
	'x-hasura-manager-id'?: string;
	'x-hasura-adminStructure-id'?: string;
	'x-hasura-orientationManager-id'?: string;
	'x-hasura-deployment-id'?: string;
	'x-hasura-structure-id'?: string;
};

export function createJwt(account: JwtAccount): string {
	const {
		id,
		type,
		managerId,
		professionalId,
		beneficiaryId,
		deploymentId,
		adminStructureId,
		orientationManagerId,
		structureId,
	} = account;

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
		...(orientationManagerId && { orientationManagerId }),
		...(structureId && { structureId }),
	};

	const { key } = getJwtKey();

	const token = jwt.sign(claim, key, signOptions);
	return token;
}

function getHasuraClaims(account: JwtAccount): HasuraClaims {
	const {
		id,
		type,
		managerId,
		professionalId,
		beneficiaryId,
		deploymentId,
		adminStructureId,
		orientationManagerId,
		structureId,
	} = account;

	return {
		'x-hasura-allowed-roles': [type],
		'x-hasura-default-role': type,
		'x-hasura-user-id': `${id}`,
		...(professionalId && { 'x-hasura-professional-id': `${professionalId}` }),
		...(beneficiaryId && { 'x-hasura-beneficiary-id': `${beneficiaryId}` }),
		...(managerId && { 'x-hasura-manager-id': `${managerId}` }),
		...(adminStructureId && { 'x-hasura-adminStructure-id': `${adminStructureId}` }),
		...(orientationManagerId && { 'x-hasura-orientationManager-id': `${orientationManagerId}` }),
		...(deploymentId && { 'x-hasura-deployment-id': `${deploymentId}` }),
		...(structureId && { 'x-hasura-structure-id': `${structureId}` }),
	};
}
