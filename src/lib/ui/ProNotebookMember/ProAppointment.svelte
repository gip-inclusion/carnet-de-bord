<script lang="ts">
	import type Pro from '$lib/ui/ProNotebookMember/ProWithStructureView.svelte';
	import { Button } from '$lib/ui/base/index';
	import { operationStore, query } from '@urql/svelte';
	import { GetNotebookAppointmentsDocument } from '$lib/graphql/_gen/typed-document-nodes';
	import type { Appointment } from '$lib/models/Appointment';
	import { formatDateISO } from '$lib/utils/date';
	import { Input, Select } from '$lib/ui/base/index';
	import { AppointmentsMapping } from '$lib/constants/keys';
	import type { Option } from '$lib/types';

	export let professional: Pro;
	export let notebookId: string;

	const getAppointmentStore = operationStore(GetNotebookAppointmentsDocument, {
		professional_id: professional.id,
		notebook_id: notebookId,
	});
	query(getAppointmentStore);

	let appointments: Array<Appointment> = [];

	const appointmentOptions: Option = Object.keys(AppointmentsMapping).map((key) => ({
		label: AppointmentsMapping[key],
		name: key,
	})) as Option;

	$: appointments = $getAppointmentStore.data?.getNotebookAppointments ?? [];

	function setupNewAppointment() {
		const newAppointment: Appointment & { isEdited: boolean } = {
			id: '1',
			date: formatDateISO(new Date()),
			status: null,
			isEdited: true,
		};
		let newAppointments: Appointment[] = appointments;
		newAppointments.unshift(newAppointment);
		appointments = newAppointments;
	}

	function editAppointment(appointmentId: string) {
		console.log(appointmentId);
	}
</script>

<div id="appointments">
	<div class="heading fr-grid-row">
		<div class="fr-col-6">
			<h4 class="text-france-blue m-0">Rendez-vous</h4>
		</div>
		<div class="fr-col-6 text-right">
			<Button on:click={setupNewAppointment}>Ajouter un rendez-vous</Button>
		</div>
	</div>
	<div class="fr-table fr-table--layout-fixed blue-france-950">
		<table>
			<thead class="--bg-blue-france-975">
				<tr>
					<th style="width: 30%">Date</th>
					<th style="width: 30%">Présence</th>
					<th class="block" />
					<th />
				</tr>
			</thead>
			<tbody>
				{#if appointments.length === 0}
					<tr>
						<td colspan="4">Aucun rendez-vous n'a été pris avec cet accompagnateur.</td>
					</tr>
				{:else}
					{#each appointments as appointment}
						<tr>
							<td>
								<Input class="date-input" type="date" value={appointment.date} />
							</td>
							<td>
								<Select options={appointmentOptions} />
								<!--								<select value={AppointmentsMapping[appointment.status]}>-->
								<!--									<option>COUCOU</option>-->
								<!--									<option>TRUC</option>-->
								<!--								</select>-->
							</td>
							{#if appointment.isEdited}
								<td class="block">
									<Button classNames="edit-btn" on:click={(id) => editAppointment(id)}
										>Valider</Button
									>
								</td>
								<td>
									<Button
										classNames="self-start edit-btn"
										on:click={() => editAppointment(appointment.id)}
										outline>Annuler</Button
									>
								</td>
							{:else}
								<td />
								<td>
									<Button
										classNames="self-start edit-btn"
										on:click={() => editAppointment(appointment.id)}
										outline>Modifier</Button
									>
								</td>
							{/if}
						</tr>
					{/each}
				{/if}
			</tbody>
		</table>
	</div>
</div>

<style>
	.heading {
		margin-top: 40px;
		margin-bottom: 8px;
	}
	:global(.edit-btn) {
		padding: 8px 16px;
		font-size: 14px;
		width: 100%;
		text-align: center;
		display: inline-block;
	}
</style>
