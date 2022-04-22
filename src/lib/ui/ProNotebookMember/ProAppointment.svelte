<script lang="ts">
	import type Pro from '$lib/ui/ProNotebookMember/ProWithStructureView.svelte';
	import { Button } from '$lib/ui/base/index';
	import { operationStore, query } from '@urql/svelte';
	import { GetNotebookAppointmentsDocument } from '$lib/graphql/_gen/typed-document-nodes';
	import type { Appointment } from '$lib/models/Appointment';
	import { formatDateLocale } from '$lib/utils/date';
	import { AppointmentsMapping } from '$lib/constants/keys';

	export let professional: Pro;
	export let notebookId: string;

	const getAppointmentStore = operationStore(GetNotebookAppointmentsDocument, {
		professional_id: professional.id,
		notebook_id: notebookId,
	});
	query(getAppointmentStore);

	let appointments: Array<Appointment> = [];

	$: appointments = $getAppointmentStore.data?.getNotebookAppointments ?? [];
</script>

<div id="appointments">
	<div class="heading fr-grid-row">
		<div class="fr-col-6">
			<h4 class="text-france-blue m-0">Rendez-vous</h4>
		</div>
		<div class="fr-col-6 text-right">
			<Button>Ajouter un rendez-vous</Button>
		</div>
	</div>
	<div class="fr-table fr-table--layout-fixed blue-france-950">
		<table>
			<thead class="--bg-blue-france-975">
				<tr>
					<th style="width: 50%">Date</th>
					<th style="width: 50%">Présence</th>
				</tr>
			</thead>
			<tbody>
				{#if appointments.length === 0}
					<tr>
						<td colspan="2">Aucun rendez-vous n'a été pris pour le moment.</td>
					</tr>
				{:else}
					{#each appointments as appointment}
						<tr>
							<td>{formatDateLocale(appointment.date)}</td>
							<td>{AppointmentsMapping[appointment.status] ?? '--'}</td>
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
</style>
