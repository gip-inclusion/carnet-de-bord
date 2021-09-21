<script lang="ts">
	import type { NotebookMember } from '$lib/graphql/_gen/typed-document-nodes';
	import { openComponent } from '$lib/stores';
	import { Button } from '../base';
	import { Text } from '../utils';
	import ProNotebookMemberInvitation from './ProNotebookMemberInvitation.svelte';
	import ProNotebookMemberView from './ProNotebookMemberView.svelte';

	export let notebookId: string;
	export let beneficiaryFirstname: string;
	export let beneficiaryLastname: string;
	export let members: NotebookMember[];

	const openMemberInfo = (member: NotebookMember) => {
		openComponent.open({ component: ProNotebookMemberView, props: { member } });
	};

	const openInviteMember = () => {
		openComponent.open({
			component: ProNotebookMemberInvitation,
			props: {
				beneficiaryFirstname,
				beneficiaryLastname,
				notebookId,
				professionalIds: members ? members.map((m) => m.professional.id) : [],
			},
		});
	};
</script>

<div class="pb-6">
	<Button
		on:click={() => {
			openInviteMember();
		}}>Ajouter un accompagnateur</Button
	>
</div>
<div class={`fr-table fr-table--layout-fixed`}>
	<table>
		<thead>
			<tr>
				<th style="width: 40%">Structure</th>
				<th style="width: 30%">Accompagnateur</th>
				<th style="width: 20%">Fonction</th>
				<th style="width: 10%" />
			</tr>
		</thead>
		<tbody>
			{#each members as member, i}
				<tr class="cursor-pointer" on:click={() => openMemberInfo(member)}>
					<td>
						<Text value={member.professional.structure.name} />
					</td>
					<td>
						<div class="flex flex-row gap-2">
							<Text value={member.professional.firstname} />
							<Text value={member.professional.lastname} />
						</div>
					</td>
					<td>
						<Text value={member.professional.position} />
					</td>
					<td>
						<button>
							<i class="text-2xl text-france-blue ri-arrow-right-line" />
						</button>
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>
