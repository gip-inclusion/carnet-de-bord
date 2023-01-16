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
	import { trackEvent } from '$lib/tracking/matomo';
	import { Radio } from '$lib/ui/base';
	import { createEventDispatcher } from 'svelte';

	type Notebook = GetNotebookByBeneficiaryIdQuery['notebook'][0];
	export let members: Notebook['members'];
	export let notebookId: Notebook['id'];

	const dispatch = createEventDispatcher();

	const options = [
		{ name: 'referent', label: 'Oui' },
		{ name: 'no_referent', label: 'Non' },
	];

	let memberType: 'referent' | 'no_referent' = 'no_referent';

	async function addCurrentAccountToNotebookMembers() {
		trackEvent('pro', 'members', 'join_notebook_members');
		try {
			await postApiJson(
				`/v1/notebooks/${notebookId}/members`,
				{ member_type: memberType },
				{ 'jwt-token': $token }
			);
			dispatch('notebook-member-added');
		} catch (err) {
			console.error(err);
			captureException(err);
			return;
		}
	}

	function setSelectedMemberType(selected: any) {
		memberType = selected.detail.value;
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
				<div class="fr-form-group">
					<Radio
						caption="Bénéficiez-vous d'un mandat d'orientation en la qualité de référent ?"
						name="memberType"
						{options}
						selected={memberType}
						on:input={setSelectedMemberType}
					/>
				</div>
			</Dialog>
		</div>
	{/if}

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
</div>