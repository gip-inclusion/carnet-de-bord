<script lang="ts">
	import {
		type GetNotebookByBeneficiaryIdQuery,
		RoleEnum,
	} from '$lib/graphql/_gen/typed-document-nodes';

	import { Text } from '$lib/ui/utils';
	import Dialog from '$lib/ui/Dialog.svelte';
	import { accountData, token } from '$lib/stores';
	import { postApiJson } from '$lib/utils/post';
	import { captureException } from '$lib/utils/sentry';

	type Notebook = GetNotebookByBeneficiaryIdQuery['notebook'][0];
	export let members: Notebook['members'];
	export let notebookId: Notebook['id'];

	async function addCurrentAccountToNotebookMembers() {
		try {
			await postApiJson(
				`/v1/notebooks/${notebookId}/members`,
				{
					member_type: 'no_referent', // todo: ou referent, en fonction de la réponse de l'utilisateur
				},
				{ 'jwt-token': $token }
			);
		} catch (err) {
			console.error(err);
			captureException(err);
			return;
		}
	}
</script>

<div class="fr-table fr-table--layout-fixed !mb-0">
	{#if $accountData.professional}
		<div class="pb-6">
			<Dialog
				buttonFullWidth={true}
				outlineButton={false}
				title="Se rattacher"
				label="Se rattacher"
				on:confirm={addCurrentAccountToNotebookMembers}
			>
				<p>Bénéficiez-vous d'un mandat d'orientation en la qualité de référent ?</p>
				<!-- TODO: Ajouter les boutons Oui / Non et ajouter en referent ou no_referent en fonction -->
			</Dialog>
		</div>
	{/if}

	<table>
		<table>
			<thead>
				<tr>
					<th style="width: 40%">Structure</th>
					<th style="width: 30%">Accompagnateur</th>
					<th style="width: 30%">Fonction</th>
				</tr>
			</thead>
			<tbody>
				{#each members.filter(({ account }) => account.type === RoleEnum.Professional) as member}
					<tr class:font-bold={member.memberType === 'referent'}>
						<td>
							<Text value={member.account?.professional.structure.name} />
						</td>
						<td>
							<div class="flex flex-row gap-2">
								<Text value={member.account?.professional.firstname} />
								<Text value={member.account?.professional.lastname} />
								{#if member.memberType === 'referent'}
									(référent)
								{/if}
							</div>
						</td>
						<td>
							<Text value={member.account?.professional.position} />
						</td>
					</tr>
				{/each}
				{#each members.filter(({ account }) => account.type === RoleEnum.OrientationManager) as member}
					<tr class:font-bold={member.memberType === 'referent'}>
						<td />
						<td>
							<div class="flex flex-row gap-2">
								<Text value={member.account?.orientation_manager.firstname} />
								<Text value={member.account?.orientation_manager.lastname} />
							</div>
						</td>
						<td>Chargé d'orientation</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</table>
</div>
