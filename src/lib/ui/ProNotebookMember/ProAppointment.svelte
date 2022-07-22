<script lang="ts">
	import { Button } from '$lib/ui/base/index';
	import { mutation, OperationStore, operationStore, query } from '@urql/svelte';
	import {
		AddNotebookAppointmentDocument,
		GetNotebookAppointmentsDocument,
		GetNotebookAppointmentsQuery,
		GetNotebookAppointmentsQueryVariables,
		UpdateNotebookAppointmentDocument,
	} from '$lib/graphql/_gen/typed-document-nodes';
	import type { AppointmentUI } from '$lib/models/Appointment';
	import { formatDateLocale } from '$lib/utils/date';
	import { Input, Select } from '$lib/ui/base/index';
	import { AppointmentsMapping } from '$lib/constants/keys';
	import type { Option } from '$lib/types';
	import { Text } from '$lib/ui/utils/index';
	import { jsonCopy } from '$lib/helpers';
	import { LoaderIndicator } from '$lib/ui/utils/index';
	import { onDestroy } from 'svelte';
	import type { Member } from './ProNotebookMemberView.svelte';

	export let member: Member;
	export let notebookId: string;

	const getAppointmentStore = operationStore(
		GetNotebookAppointmentsDocument,
		{
			memberAccountId: member.account?.id,
			notebookId: notebookId,
		},
		{ additionalTypenames: ['notebook_appointment'] }
	);

	const setAppointmentMutation = mutation(operationStore(AddNotebookAppointmentDocument));
	const updateAppointmentMutation = mutation(operationStore(UpdateNotebookAppointmentDocument));

	let appointments: Array<AppointmentUI> = [];
	let appointmentsBuffer: Array<AppointmentUI> = [];

	const appointmentOptions: Option[] = Object.keys(AppointmentsMapping).map((key) => ({
		label: AppointmentsMapping[key],
		name: key,
	}));

	query(getAppointmentStore);
	const subscription = $getAppointmentStore.subscribe(
		(
			resp: OperationStore<
				GetNotebookAppointmentsQuery,
				GetNotebookAppointmentsQueryVariables,
				GetNotebookAppointmentsQuery
			>
		) => {
			if (resp.data) {
				appointments = jsonCopy(resp.data.getNotebookAppointments) ?? [];
				appointments.map((appointment) => {
					appointment.status = appointment.status.toLowerCase();
					return appointment;
				});
				appointmentsBuffer = jsonCopy(appointments);
			}
		}
	);

	function setupNewAppointment() {
		if (appointments.length === 0 || appointments[0].id != null) {
			appointments = jsonCopy(appointmentsBuffer).map((appointment: AppointmentUI) => {
				appointment.isDisabled = true;
				appointment.isEdited = false;
				return appointment;
			});
			const newAppointment: AppointmentUI = {
				date: null,
				id: null,
				status: null,
				isEdited: true,
				isDisabled: false,
				dirty: false,
			};
			appointments.unshift(newAppointment);
		}
	}

	function cancelEdition() {
		appointments = jsonCopy(appointmentsBuffer).map((appointment: AppointmentUI) => {
			appointment.isDisabled = false;
			appointment.isEdited = false;
			return appointment;
		});
	}

	function editAppointment(index: number) {
		appointments = appointments.map((appointment: AppointmentUI) => {
			appointment.isDisabled = true;
			appointment.isEdited = false;
			return appointment;
		});
		appointments[index].isDisabled = false;
		appointments[index].isEdited = true;
	}

	async function validateAppointment(index: number) {
		let result;
		appointments[index].dirty = true;

		if (appointments[index].date && appointments[index].status) {
			if (appointments[index].id) {
				result = await updateAppointmentMutation({
					id: appointments[index].id,
					status: appointments[index].status,
					date: appointments[index].date,
				});
			} else {
				result = await setAppointmentMutation({
					memberAccountId: member.account?.id,
					notebookId: notebookId,
					status: appointments[index].status,
					date: appointments[index].date,
				});
			}
			if (result.error) {
				console.error(result.error);
			}
		}
	}

	onDestroy(subscription);
</script>

<LoaderIndicator result={getAppointmentStore}>
	<div class="fr-grid-row mt-10 mb-3">
		<div class="fr-col-6">
			<h4 class="text-france-blue m-0">Rendez-vous</h4>
		</div>
		<div class="fr-col-6 text-right">
			<Button on:click={setupNewAppointment}>Ajouter un rendez-vous</Button>
		</div>
	</div>
	<div class="fr-table fr-table--layout-fixed blue-france-950">
		<table>
			<caption class="sr-only">Liste des rendez-vous</caption>
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
								<td class="align-top">
									<Input
										inputLabel="Date de rendez-vous"
										class="no-label"
										type="date"
										required
										bind:value={appointment.date}
										error={!appointment.date && appointment.dirty ? 'Champ obligatoire' : null}
									/>
								</td>
								<td class="align-top">
									<Select
										selectLabel="Statut du rendez-vous"
										selectHint="Statut"
										classNames="no-label"
										name={appointment.id}
										options={appointmentOptions}
										bind:selected={appointment.status}
										error={!appointment.status && appointment.dirty ? 'Champ obligatoire' : null}
									/>
								</td>
								<td class="align-top">
									<Button classNames="edit-btn" on:click={() => validateAppointment(index)}
										>Valider
									</Button>
								</td>
								<td class="align-top">
									<Button classNames="self-start edit-btn" on:click={() => cancelEdition()} outline
										>Annuler
									</Button>
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
										disabled={appointment.isDisabled}
										on:click={() => editAppointment(index)}
										outline
										>Modifier
									</Button>
								</td>
							{/if}
						</tr>
					{/each}
				{/if}
			</tbody>
		</table>
	</div>
</LoaderIndicator>
