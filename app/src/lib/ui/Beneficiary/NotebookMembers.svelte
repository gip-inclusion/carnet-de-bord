<script lang="ts">
	import {
		type GetNotebookByBeneficiaryIdQuery,
		RoleEnum,
	} from '$lib/graphql/_gen/typed-document-nodes';
	import { Text } from '$lib/ui/utils';
	import Dialog from '$lib/ui/Dialog.svelte';
	import { accountData } from '$lib/stores';
	import { displayFullName } from '../format';
	import JoinNotebookMembers from './JoinNotebookMembers.svelte';
	import { createEventDispatcher } from 'svelte';
	import { referentLabelInParens } from '$lib/models/Member';

	type Notebook = GetNotebookByBeneficiaryIdQuery['notebook'][number];
	type Member = Notebook['members'][number];
	export let members: Member[];
	export let notebookId: Notebook['id'];
	export let orientationSystem: string;

	const dispatch = createEventDispatcher();

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
			<Dialog
				buttonFullWidth={true}
				outlineButton={false}
				title="Se rattacher"
				label="Se rattacher"
				showButtons={false}
			>
				<JoinNotebookMembers {notebookId} on:joined-notebook={() => dispatch('joined-notebook')} />
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
			{#each notebookMembers as member}
				<tr class:font-bold={member.memberType === 'referent'}>
					<td>
						{#if member.structureName}<Text value={member.structureName} />{/if}
					</td>
					<td>
						<div class="flex flex-row gap-2">
							<Text value={member.fullname} />
							{referentLabelInParens(member, orientationSystem)}
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
