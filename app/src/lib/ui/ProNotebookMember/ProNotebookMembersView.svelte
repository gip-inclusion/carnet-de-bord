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
	import { referentLabelInParens } from '$lib/models/Member';

	type Member = GetNotebookQuery['notebook_public_view'][number]['members'][number];
	type Appointment =
		GetNotebookQuery['notebook_public_view'][number]['notebook']['appointments'][number];

	export let notebookId: string;
	export let orientationSystem: string | null;
	export let beneficiaryFirstname: string;
	export let beneficiaryLastname: string;
	export let members: Member[];
	export let appointments: Appointment[];
	export let displayMemberManagementButtons = false;

	type NotebookMember = {
		fullname: string;
		memberType: Member['memberType'];
		structureName: string | undefined;
		position: string;
		accountId: Member['id'];
		member: Member;
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
			accountId: member.account?.id,
			member,
		};
	}
	$: notebookMembers = members.map(toNotebookMember);

	const removeNotebookMemberStore = operationStore(RemoveMemberFromNotebookDocument);
	const removeNotebookMember = mutation(removeNotebookMemberStore);

	function openMemberInfo({ member }: NotebookMember) {
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

	function currentAccountIsTheOnlyMemberOfStructure(): boolean {
		const structureIds = members.map((member) => member.account.professional?.structure?.id);
		const membersInStructure = structureIds.filter(
			(structureId) => structureId === $accountData.professional.structure.id
		);
		return membersInStructure.length === 1;
	}

	async function removeMember() {
		trackEvent('pro', 'member', 'leave_notebook_members');
		await removeNotebookMember({
			notebookId,
			accountId: $accountData.id,
			structureId: $accountData.professional.structure.id,
			removeBeneficiaryStructure: currentAccountIsTheOnlyMemberOfStructure(),
		});
	}

	function filterAppointmentsByAccountId(memberAccountId: string): string {
		const proAppointment: Appointment = appointments.filter(
			(appointment) => appointment.memberAccountId === memberAccountId
		)[0];

		return proAppointment ? formatDateTimeLocale(proAppointment.date) : '';
	}

	$: showRemoveButton =
		members?.find((member: Member) => member.memberType === 'referent')?.account.id !==
			$accountData.id && $accountData.type == RoleEnum.Professional;
</script>

{#if displayMemberManagementButtons}
	<div class="pb-6">
		<Button
			on:click={() => {
				openInviteMember();
			}}>Inviter un accompagnateur</Button
		>
		{#if showRemoveButton}
			<Dialog
				buttonFullWidth={true}
				outlineButton={false}
				title="Se détacher"
				label="Se détacher"
				confirmLabel="Oui"
				on:confirm={() => removeMember()}
			>
				<p>
					Souhaitez-vous être détaché du carnet de bord et ne plus accéder en écriture à celui-ci ?
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
			{#each notebookMembers as member}
				<tr class="cursor-pointer" on:click={() => openMemberInfo(member)}>
					<td>
						<span class="inline-flex gap-2" class:font-bold={member.memberType === 'referent'}>
							<Text value={member.fullname} />
							{referentLabelInParens(member, orientationSystem)}
						</span>
						{#if member.structureName}<Text value={member.structureName} />{/if}
					</td>
					<td>
						<Text value={member.position} />
					</td>
					<td>
						<Text value={filterAppointmentsByAccountId(member.accountId)} />
					</td>
					<td class="text-center">
						<button>
							<i class="text-2xl text-vert-cdb ri-arrow-right-line" />
						</button>
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>
