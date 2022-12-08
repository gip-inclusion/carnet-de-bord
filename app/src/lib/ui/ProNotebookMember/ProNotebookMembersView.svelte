<script lang="ts">
	import { openComponent } from '$lib/stores';
	import { Button } from '$lib/ui/base';
	import { Text } from '$lib/ui/utils';
	import Dialog from '$lib/ui/Dialog.svelte';
	import ProNotebookMemberInvitation from './ProNotebookMemberInvitation.svelte';
	import ProNotebookMemberView from './ProNotebookMemberView.svelte';
	import { trackEvent } from '$lib/tracking/matomo';
	import { formatDateTimeLocale } from '$lib/utils/date';
	import {
		type GetNotebookQuery,
		RoleEnum,
		RemoveMemberFromNotebookDocument,
	} from '$lib/graphql/_gen/typed-document-nodes';
	import { displayFullName } from '../format';
	import { accountData } from '$lib/stores';
	import { mutation, operationStore } from '@urql/svelte';

	type Member = GetNotebookQuery['notebook_public_view'][0]['members'][0];
	type Appointment = GetNotebookQuery['notebook_public_view'][0]['notebook']['appointments'][0];

	export let notebookId: string;
	export let beneficiaryFirstname: string;
	export let beneficiaryLastname: string;
	export let members: Member[];
	export let appointments: Appointment[];
	export let displayInviteButton = false;

	const removeNotebookMemberStore = operationStore(RemoveMemberFromNotebookDocument);
	const removeNotebookMember = mutation(removeNotebookMemberStore);

	function openMemberInfo(member: Member) {
		trackEvent('pro', 'members', 'view info');
		openComponent.open({ component: ProNotebookMemberView, props: { member, notebookId } });
	}

	function openInviteMember() {
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
	}

	async function removeMember() {
		trackEvent('pro', 'members', 'remove member');
		await removeNotebookMember({ notebookId, accountId: $accountData.id });
	}

	function filterAppointmentsByAccountId(memberAccountId: string): string {
		const proAppointment: Appointment = appointments.filter(
			(appointment) => appointment.memberAccountId === memberAccountId
		)[0];

		return proAppointment ? formatDateTimeLocale(proAppointment.date) : '';
	}

	function currentAccountIsMember() {
		return members.map((member) => member.account.id).includes($accountData.id);
	}
</script>

{#if displayInviteButton || currentAccountIsMember}
	<div class="pb-6">
		{#if displayInviteButton}
			<Button
				on:click={() => {
					openInviteMember();
				}}>Inviter un accompagnateur</Button
			>
		{/if}
		{#if currentAccountIsMember}
			<Dialog
				buttonFullWidth={true}
				outlineButton={false}
				title="Se détacher"
				label="Se détacher"
				confirmLabel="Confirmer"
				on:confirm={() => removeMember()}
			>
				<p>
					Vous souhaitez être retiré du carnet de bord.
					<br />Veuillez confirmer le retrait.
				</p>
			</Dialog>
		{/if}
	</div>
{/if}
<div class="fr-table fr-table--layout-fixed !mb-0">
	<table>
		<caption class="sr-only">Liste des membres du groupe de suivi</caption>
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
						<span class="inline-flex gap-2" class:font-bold={member.memberType === 'referent'}>
							<Text value={displayFullName(member.account?.professional)} />
							{#if member.memberType === 'referent'}
								(référent)
							{/if}
						</span>
						<Text value={member.account?.professional.structure.name} />
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
					<td>Chargé d'orientation</td>
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
