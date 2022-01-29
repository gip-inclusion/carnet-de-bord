<script lang="ts">
	import { openComponent } from '$lib/stores';
	import { Button } from '$lib/ui/base';
	import { Text } from '$lib/ui/utils';
	import ProNotebookMemberInvitation from './ProNotebookMemberInvitation.svelte';
	import ProNotebookMemberView from './ProNotebookMemberView.svelte';
	import type { Member } from './ProNotebookMemberView.svelte';
	import { trackEvent } from '$lib/tracking/matomo';

	export let notebookId: string;
	export let beneficiaryFirstname: string;
	export let beneficiaryLastname: string;
	export let members: Member[];

	const openMemberInfo = (member: Member) => {
		trackEvent('pro', 'members', 'view info');
		openComponent.open({ component: ProNotebookMemberView, props: { member } });
	};

	const openInviteMember = () => {
		trackEvent('pro', 'members', 'add new member form');
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
		}}>Inviter un accompagnateur</Button
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
			{#each members as member}
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
