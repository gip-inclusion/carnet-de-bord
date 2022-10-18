import createClient from '$lib/graphql/createClient';
import { GetAccountByPkDocument, RoleEnum } from '$lib/graphql/_gen/typed-document-nodes';
import { account, connectedUser, token } from '$lib/stores';
import type { ConnectedUser } from '$lib/stores/account';
import type { Client } from '@urql/svelte';
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async (event) => {
	console.log('++++ auth Layout Load');
	const data = await event.parent();
	connectedUser.set(data.user);
	token.set(data.token);
	const client: Client = createClient(data.graphqlAPI, data.token, event.fetch);

	const accountInfo = await getAccount(client, data.user.id);
	account.set(accountInfo);
	return {
		client,
		account: accountInfo,
	};
};

async function getAccount(client, accountId: string): Promise<ConnectedUser | null> {
	const result = await client.query(GetAccountByPkDocument, { accountId }).toPromise();
	if (result.data) {
		const { confirmed, onboardingDone, username, type } = result.data.account_by_pk;
		const { id, firstname, lastname, email } =
			result.data.account_by_pk.admin_structure ||
			result.data.account_by_pk.beneficiary ||
			result.data.account_by_pk.manager ||
			result.data.account_by_pk.orientation_manager ||
			result.data.account_by_pk.professional;

		return {
			accountId,
			confirmed,
			onboardingDone,
			username,
			id,
			firstname,
			lastname,
			email,
			...(type === RoleEnum.Beneficiary && {
				type: RoleEnum.Beneficiary,
				mobileNumber: result.data.account_by_pk.beneficiary.mobileNumber,
			}),
			...(type === RoleEnum.Professional && {
				type: RoleEnum.Professional,
				mobileNumber: result.data.account_by_pk.professional.mobileNumber,
				position: result.data.account_by_pk.professional.position,
			}),
			...(type === RoleEnum.AdminStructure && {
				type: RoleEnum.AdminStructure,
				mobileNumber: result.data.account_by_pk.admin_structure.phoneNumbers,
			}),
			...(type === RoleEnum.OrientationManager && {
				type: RoleEnum.OrientationManager,
				mobileNumber: result.data.account_by_pk.orientation_manager.phoneNumbers,
			}),
			...(type === RoleEnum.Manager && {
				type: RoleEnum.Manager,
			}),
			...(type === RoleEnum.AdminCdb && {
				type: RoleEnum.AdminCdb,
			}),
		};
	}
	return null;
}
