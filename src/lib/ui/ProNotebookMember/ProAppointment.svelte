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
	import { Input, Select } from '$lib/ui/base/index';
	import { AppointmentsMapping } from '$lib/constants/keys';
	import type { Option } from '$lib/types';
	import { Text } from '$lib/ui/utils/index';
	import { jsonCopy } from '$lib/helpers';
	import { LoaderIndicator } from '$lib/ui/utils/index';
	import { onDestroy } from 'svelte';
	import type { Member } from './ProNotebookMemberView.svelte';
	import { trackEvent } from '$lib/tracking/matomo';
	import { session } from '$app/stores';
	import { parseISO } from 'date-fns';
	import { formatDateTimeLocale } from '$lib/utils/date';
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

	const hourOptions = Array.from({ length: 14 }, (_, i) => ({
		label: `0${i + 7}`.slice(-2),
		name: `${i + 7}`,
	}));
	const minuteOptions = Array.from({ length: 12 }, (_, i) => ({
		label: `0${i * 5}`.slice(-2),
		name: `${i * 5}`,
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
					appointment.fullDate = appointment.date;
					let d = parseISO(appointment.date);
					appointment.date = appointment.date.split('T')[0];
					appointment.hours = d.getHours().toString();
					appointment.minutes = d.getMinutes().toString();
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
				hours: null,
				fullDate: null,
				minutes: null,
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
			// we use baseUrlForRole since first event categorie for professional where pro
			let role = $session.user.role;
			if (role === 'professional') {
				role = 'pro';
			}
			const datetime = new Date(appointments[index].date);
			datetime.setUTCHours(parseInt(appointments[index].hours));
			datetime.setUTCMinutes(parseInt(appointments[index].minutes));

			if (appointments[index].id) {
				if (appointmentsBuffer[index].status !== appointments[index].status) {
					trackEvent(role, 'members', 'update_appointment_status');
				}
				if (appointmentsBuffer[index].date !== appointments[index].date) {
					trackEvent(role, 'members', 'update_appointment_date');
				}
				result = await updateAppointmentMutation({
					id: appointments[index].id,
					status: appointments[index].status,
					date: datetime.toISOString(),
				});
			} else {
				trackEvent(role, 'members', 'create_appointment');
				result = await setAppointmentMutation({
					memberAccountId: member.account?.id,
					notebookId: notebookId,
					status: appointments[index].status,
					date: datetime.toISOString(),
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
					<th style="width:54%">Date et heure </th>
					<th style="width:23%">Présence</th>
					<th style="width:23%" />
				</tr>
			</thead>
			<tbody>
				{#if appointments.length === 0}
					<tr>
						<td colspan="3">Aucun rendez-vous n'a été pris avec cet accompagnateur.</td>
					</tr>
				{:else}
					{#each appointments as appointment, index}
						<tr>
							{#if appointment.isEdited}
								<td class="align-top" colspan="3">
									<div class="flex flex-wrap gap-4 items-start  ">
										<div class="flex items-center gap-4">
											Le
											<Input
												inputLabel="Date de rendez-vous"
												class="no-label m-0"
												type="date"
												required
												bind:value={appointment.date}
												error={!appointment.date && appointment.dirty ? 'Champ obligatoire' : null}
											/>
										</div>
										<div class="flex items-center gap-4">
											à
											<Select
												id="hours"
												name="hours"
												selectLabel="Heures"
												options={hourOptions}
												class="w-28	"
												classNames="no-label w-20 m-0"
												bind:selected={appointment.hours}
												error={!appointment.hours && appointment.dirty ? 'Champ obligatoire' : null}
											/>
											h
											<Select
												id="minutes"
												name="minutes"
												selectLabel="Minutes"
												options={minuteOptions}
												bind:selected={appointment.minutes}
												classNames="no-label w-20 m-0"
												error={!appointment.minutes && appointment.dirty
													? 'Champ obligatoire'
													: null}
											/>
										</div>
										<Select
											selectLabel="Statut du rendez-vous"
											selectHint="Statut"
											classNames="no-label  m-0"
											name={appointment.id}
											options={appointmentOptions}
											bind:selected={appointment.status}
											error={!appointment.status && appointment.dirty ? 'Champ obligatoire' : null}
										/>

										<div class="my-2 whitespace-nowrap ml-auto">
											<Button classNames="fr-btn--sm" on:click={() => validateAppointment(index)}
												>Valider
											</Button>

											<Button
												classNames="self-start fr-btn--sm"
												on:click={() => cancelEdition()}
												outline
												>Annuler
											</Button>
										</div>
									</div>
								</td>
							{:else}
								<td>
									<Text value={formatDateTimeLocale(appointment.fullDate)} />
								</td>
								<td>
									<Text value={AppointmentsMapping[appointment.status]} />
								</td>
								<td>
									<Button
										classNames="self-start fr-btn--sm"
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
