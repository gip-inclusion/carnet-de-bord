<script lang="ts">
	import type Pro from '$lib/ui/ProNotebookMember/ProWithStructureView.svelte';
	import { Button } from '$lib/ui/base/index';
	import { mutation, operationStore, query } from '@urql/svelte';
	import {
		AddNotebookAppointmentDocument,
		GetNotebookAppointmentsDocument,
	} from '$lib/graphql/_gen/typed-document-nodes';
	import type { Appointment } from '$lib/models/Appointment';
	import { formatDateLocale } from '$lib/utils/date';
	import { Input, Select } from '$lib/ui/base/index';
	import { AppointmentsMapping } from '$lib/constants/keys';
	import type { Option } from '$lib/types';
	import { Text } from '$lib/ui/utils/index';

	export let professional: Pro;
	export let notebookId: string;

	const getAppointmentStore = operationStore(GetNotebookAppointmentsDocument, {
		professionalId: professional.id,
		notebookId: notebookId,
	});
	query(getAppointmentStore);

	const setAppointmentMutation = mutation(operationStore(AddNotebookAppointmentDocument));

	let appointments: Array<Appointment & { isEdited: boolean }> = [];

	const appointmentOptions: Option = Object.keys(AppointmentsMapping).map((key) => ({
		label: AppointmentsMapping[key],
		name: key,
	})) as Option;

	$: appointments = $getAppointmentStore.data?.getNotebookAppointments ?? [];

	function setupNewAppointment() {
		if (appointments.length === 0 || appointments[0].id != null) {
			const newAppointment: Appointment & { isEdited: boolean } = {
				id: null,
				date: null,
				status: null,
				isEdited: true,
			};
			let newAppointments: Array<Appointment & { isEdited: boolean }> = appointments;
			newAppointments.unshift(newAppointment);
			appointments = newAppointments;
		}
	}

	function cancelEdition(index: number) {
		if (appointments[index].id) {
			appointments[index].isEdited = false;
		} else {
			appointments = appointments.slice(1, appointments.length - 1);
		}
	}

	function editAppointment(index: number) {
		appointments[index].isEdited = true;
	}

	async function validateAppointment(index: number) {
		appointments[index].isEdited = false;
		const result = await setAppointmentMutation({
			professionalId: professional.id,
			notebookId: notebookId,
			status: appointments[index].status,
			date: appointments[index].date,
		});
		if (result.error) {
			console.log(result.error);
		} else {
			console.log('ADDED');
			appointments = appointments;
		}
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
					{#each appointments as appointment, index}
						<tr>
							{#if appointment.isEdited}
								<td>
									<Input class="date-input" type="date" bind:value={appointment.date} />
								</td>
								<td>
									<Select
										name={appointment.id}
										options={appointmentOptions}
										bind:selected={appointment.status}
									/>
								</td>
								<td class="block">
									<Button classNames="edit-btn" on:click={() => validateAppointment(index)}
										>Valider</Button
									>
								</td>
								<td>
									<Button
										classNames="self-start edit-btn"
										on:click={() => cancelEdition(index)}
										outline>Annuler</Button
									>
								</td>
							{:else}
								<td>
									<Text value={formatDateLocale(appointment.date)} />
								</td>
								<td>
									<Text value={AppointmentsMapping[appointment.status]} />
								</td>
								<td />
								<td>
									<Button
										classNames="self-start edit-btn"
										on:click={() => editAppointment(index)}
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
