<script lang="ts">
	import {
		type GetNotebookByBeneficiaryIdQuery,
		type GetProfessionalOrientationOptionsQuery,
		RoleEnum,
	} from '$lib/graphql/_gen/typed-document-nodes';
	import { GetProfessionalOrientationOptionsDocument } from '$lib/graphql/_gen/typed-document-nodes';
	import { Text } from '$lib/ui/utils';
	import Dialog from '$lib/ui/Dialog.svelte';
	import { accountData, connectedUser, token } from '$lib/stores';
	import { operationStore, query } from '@urql/svelte';
	import { postApiJson } from '$lib/utils/post';
	import { captureException } from '$lib/utils/sentry';
	import { trackEvent } from '$lib/tracking/matomo';
	import { Button, Radio, Select } from '$lib/ui/base';
	import { createEventDispatcher } from 'svelte';
	import type { Option } from '$lib/types';
	import { goto } from '$app/navigation';
	import { displayFullName } from '../format';

	type Notebook = GetNotebookByBeneficiaryIdQuery['notebook'][number];
	type Member = Notebook['members'][number];
	export let members: Member[];
	export let notebookId: Notebook['id'];

	const dispatch = createEventDispatcher();

	type OrientationOption = GetProfessionalOrientationOptionsQuery['orientation'][number];
	let orientationOptions: Option[];
	const orientationSystemStore = operationStore(
		GetProfessionalOrientationOptionsDocument,
		{ professionalId: $connectedUser.professionalId },
		{ pause: !$accountData.professional }
	);
	query(orientationSystemStore);

	$: orientationOptions = $orientationSystemStore.data?.orientation.map(toOrientationOption) || [];
	function toOrientationOption(orientation: OrientationOption): Option {
		return { name: orientation.id, label: orientation.name };
	}

	const referent = 'referent';
	const options: Option[] = [
		{ name: referent, label: 'Oui' },
		{ name: 'no_referent', label: 'Non' },
	];

	let memberType: 'referent' | 'no_referent' = 'no_referent';
	$: asReferent = memberType === referent;

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
			if (
				err.status === 403 &&
				err.message === 'Unsufficient permission (structureId is missing)'
			) {
				forceLogout();
			} else {
				console.error(err);
				captureException(err);
			}
			return;
		}
	}

	function setSelectedMemberType(selected: CustomEvent) {
		memberType = selected.detail.value;
	}

	function forceLogout() {
		goto('/auth/logout');
	}

	type NotebookMember = {
		fullname: string;
		memberType: Member['memberType'];
		structureName: string | undefined;
		position: string;
	};
	function toNotebookMember(member: Member): NotebookMember {
		return {
			fullname: member.account?.professional
				? displayFullName(member.account?.professional)
				: displayFullName(member.account?.orientation_manager),
			memberType: member.memberType,
			structureName: member.account?.professional?.structure.name,
			position:
				member.account.type === RoleEnum.OrientationManager
					? "Chargé d'orientation"
					: member.account?.professional?.position,
		};
	}
	const notebookMembers = members.map(toNotebookMember);
</script>

<div class="fr-table fr-table--layout-fixed !mb-0">
	{#if $accountData.professional}
		<div class="pb-6">
			{#if orientationOptions.length}
				<Dialog
					buttonFullWidth={true}
					outlineButton={false}
					title="Se rattacher"
					label="Se rattacher"
					on:confirm={addCurrentAccountToNotebookMembers}
				>
					<Radio
						caption="Bénéficiez-vous d'un mandat d'orientation en la qualité de référent ?"
						name="memberType"
						{options}
						selected={memberType}
						on:input={setSelectedMemberType}
						ariaControls="orientation-system"
					/>
					<div class="fr-form-group">
						<Select
							id="orientation-system"
							options={orientationOptions}
							name="orientation"
							selected={orientationOptions.length === 1 ? orientationOptions[0].name : undefined}
							selectLabel="Dispositif d’accompagnement"
							disabled={!asReferent}
							required={asReferent}
						/>
					</div>
				</Dialog>
			{:else}
				<Button type="button" on:click={addCurrentAccountToNotebookMembers}>Se rattacher</Button>
			{/if}
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
			{#each notebookMembers as member}
				<tr class:font-bold={member.memberType === 'referent'}>
					<td>
						{#if member.structureName}<Text value={member.structureName} />{/if}
					</td>
					<td>
						<div class="flex flex-row gap-2">
							<Text value={member.fullname} />
							{#if member.memberType === 'referent'}
								(référent)
							{/if}
						</div>
					</td>
					<td>
						<Text value={member.position} />
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>
