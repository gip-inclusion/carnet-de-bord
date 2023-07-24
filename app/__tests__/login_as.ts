import { createJwt } from '../src/lib/utils/getJwt';
import type { GetAccountInfoQuery } from '../src/lib/graphql/_gen/typed-document-nodes';
import { env } from '$env/dynamic/private';

export async function getAccountAndJwtForUser(user: string) {
	const data = await fetch(env.GRAPHQL_API_URL, {
		method: 'POST',
		headers: {
			'x-hasura-admin-secret': env.HASURA_GRAPHQL_ADMIN_SECRET,
		},
		body: JSON.stringify({
			query: `
query userInfo($user:String!, $mail: citext!) {
	account(where: {_or:[
		{username : {_ilike: $user}}
		{professional: {lastname: {_ilike: $user }}}
		{professional: {email: {_ilike: $mail }}}
		{beneficiary: {email: {_ilike: $mail }}}
		{beneficiary: {lastname: {_ilike: $user }}}
		{manager: {email: {_ilike: $mail }}}
		{manager: {lastname: {_ilike: $user }}}
		{admin_structure: {email: {_ilike: $mail }}}
		{admin_structure: {lastname: {_ilike: $user }}}
	]}) {
		id,
		professionalId
		adminStructureId
		beneficiaryId
		managerId
		username,
		type
		professional { structure { id deploymentId } }
		beneficiary { deploymentId }
		admin_structure {deploymentId}
		manager { deploymentId}
	}
}`,
			variables: {
				user: `%${user}%`,
				mail: `%${user}%`,
			},
		}),
	})
		.then(async (response) => {
			if (response.ok) {
				return response.json();
			}
			const errorMessage = await response.text();
			return Promise.reject(new Error(errorMessage));
		})
		.then((payload) => {
			return (payload.data as GetAccountInfoQuery).account[0];
		});
	if (!data) {
		throw Error(`Account '${user}' not found`);
	}
	const { id, username, type, professionalId, beneficiaryId, managerId, adminStructureId } = data;
	let deploymentId: string | null = null;
	let structureId: string | null = null;
	if (data.professional) {
		deploymentId = data.professional.structure.deploymentId ?? null;
		structureId = data.professional.structure.id ?? null;
	} else if (data.manager) {
		deploymentId = data.manager.deploymentId;
	} else if (data.adminStructure) {
		deploymentId = data.adminStructure.deploymentId;
	}
	const account = {
		id,
		username,
		type,
		professionalId,
		beneficiaryId,
		managerId,
		adminStructureId,
		deploymentId,
		structureId,
	};

	return { account, token: createJwt(account) };
}
