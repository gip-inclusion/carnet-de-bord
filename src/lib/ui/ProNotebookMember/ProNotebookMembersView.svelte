<script lang="ts">
	import { openComponent } from '$lib/stores';
	import { Button } from '$lib/ui/base';
	import { Text } from '$lib/ui/utils';
	import ProNotebookMemberInvitation from './ProNotebookMemberInvitation.svelte';
	import ProNotebookMemberView from './ProNotebookMemberView.svelte';
	import { trackEvent } from '$lib/tracking/matomo';
	import { formatDateLocale } from '$lib/utils/date';
	import { GetNotebookQuery, RoleEnum } from '$lib/graphql/_gen/typed-document-nodes';
	import { displayFullName } from '../format';

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
				accountIds: members ? members.map((m) => m.account.id) : [],
			},
		});
	};

	function filterAppointmentsByAccountId(memberAccountId: string): string {
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
	<table summary="Groupe de suivi" aria-label="Groupe de suivi">
		<thead>
			<tr>
				<th style="width: 50%">Accompagnateur (structure)</th>
				<th style="">Fonction</th>
				<th style="">Rendez-vous</th>
				<th style="width: 10%" class="text-center">Voir plus</th>
			</tr>
		</thead>
		<tbody>
			{#each members.filter(({ account }) => account.type === RoleEnum.Professional) as member}
				<tr class="cursor-pointer" on:click={() => openMemberInfo(member)}>
					<td>
						<div class="flex flex-row gap-2">
							<Text value={displayFullName(member.account?.professional)} />
							<Text value={`(${member.account?.professional.structure.name})`} />
						</div>
					</td>
					<td>
						<Text value={member.account?.professional.position} />
					</td>
					<td>
						<Text value={filterAppointmentsByAccountId(member.account?.id)} />
					</td>
					<td class="text-center">
						<button>
							<i class="text-2xl text-france-blue ri-arrow-right-line" />
						</button>
					</td>
				</tr>
			{/each}
			{#each members.filter(({ account }) => account.type === RoleEnum.OrientationManager) as member}
				<tr class="cursor-pointer" on:click={() => openMemberInfo(member)}>
					<td>
						<div class="flex flex-row gap-2">
							<Text value={displayFullName(member.account?.orientation_manager)} />
						</div>
					</td>
					<td> Chargé d'orientation </td>
					<td>
						<Text value={filterAppointmentsByAccountId(member.account?.id)} />
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
