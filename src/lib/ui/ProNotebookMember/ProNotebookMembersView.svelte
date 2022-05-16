<script lang="ts">
	import { openComponent } from '$lib/stores';
	import { Button } from '$lib/ui/base';
	import { Text } from '$lib/ui/utils';
	import ProNotebookMemberInvitation from './ProNotebookMemberInvitation.svelte';
	import ProNotebookMemberView from './ProNotebookMemberView.svelte';
	import { trackEvent } from '$lib/tracking/matomo';
	import { formatDateLocale } from '$lib/utils/date';
	import type { GetNotebookQuery } from '$lib/graphql/_gen/typed-document-nodes';

	type Member = GetNotebookQuery['notebook']['members'][0];
	type Appointment = GetNotebookQuery['notebook']['appointments'][0];

	export let notebookId: string;
	export let beneficiaryFirstname: string;
	export let beneficiaryLastname: string;
	export let members: Member[];
	export let appointments: Appointment[];

	const openMemberInfo = (member: Member) => {
		trackEvent('pro', 'members', 'view info');
		openComponent.open({ component: ProNotebookMemberView, props: { member, notebookId } });
	};
	const openInviteMember = () => {
		trackEvent('pro', 'members', 'add new member form');
		openComponent.open({
			component: ProNotebookMemberInvitation,
			props: {
				beneficiaryFirstname,
				beneficiaryLastname,
				notebookId,
				professionalIds: members ? members.map((m) => m.account?.professional.id) : [],
			},
		});
	};

	function filterAppointmentsByProAccountId(memberAccountId: string): string {
		const proAppointment: Appointment = appointments.filter(
			(appointment) => appointment.memberAccountId === memberAccountId
		)[0];

		return proAppointment ? formatDateLocale(proAppointment.date) : '';
	}
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
				<th style="width: 30%">Structure</th>
				<th style="">Accompagnateur</th>
				<th style="">Fonction</th>
				<th style="">Rendez-vous</th>
				<th style="width: 10%" class="text-center">Voir plus</th>
			</tr>
		</thead>
		<tbody>
			{#each members as member}
				<tr class="cursor-pointer" on:click={() => openMemberInfo(member)}>
					<td>
						<Text value={member.account?.professional.structure.name} />
					</td>
					<td>
						<div class="flex flex-row gap-2">
							<Text
								value={`${member.account?.professional.firstname} ${member.account?.professional.lastname}`}
							/>
						</div>
					</td>
					<td>
						<Text value={member.account?.professional.position} />
					</td>
					<td>
						<Text value={filterAppointmentsByProAccountId(member.account?.id)} />
					</td>
					<td class="text-center">
						<button>
							<i class="text-2xl text-france-blue ri-arrow-right-line" />
						</button>
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>
