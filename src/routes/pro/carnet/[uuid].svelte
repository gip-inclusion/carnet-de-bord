<script context="module" lang="ts">
	import type {
		Beneficiary,
		GetNotebookQueryStore,
		GetNotebookEventsQueryStore,
		NotebookMember,
	} from '$lib/graphql/_gen/typed-document-nodes';
	import {
		GetNotebookDocument,
		UpdateNotebookVisitDateDocument,
		GetNotebookEventsDocument,
	} from '$lib/graphql/_gen/typed-document-nodes';
	import { MainAccordion, Accordions, Select } from '$lib/ui/base';
	import { ProNotebookFocusView } from '$lib/ui/ProNotebookFocus';
	import { ProNotebookMembersView } from '$lib/ui/ProNotebookMember';
	import { ProNotebookPersonalInfoView } from '$lib/ui/ProNotebookPersonalInfo';
	import { ProNotebookSocioProView } from '$lib/ui/ProNotebookSocioPro';
	import { LoaderIndicator } from '$lib/ui/utils';
	import { formatDateLocale } from '$lib/utils/date';
	import type { Load } from '@sveltejs/kit';
	import { operationStore, query } from '@urql/svelte';
	import { addMonths } from 'date-fns';

	type Period =
		| typeof threeMonths
		| typeof threeSixMonths
		| typeof sixTwelveMonths
		| typeof twelveMonths
		| null;
	const threeMonths = '-3months';
	const threeSixMonths = '3-6months';
	const sixTwelveMonths = '6-12months';
	const twelveMonths = '+12months';

	function toDateFormat(date: Date) {
		const yyyy = date.getFullYear().toString().padStart(4, '0');
		const mm = (1 + date.getMonth()).toString().padStart(2, '0');
		const dd = date.getDate().toString().padStart(2, '0');

		return `${yyyy}-${mm}-${dd}`;
	}

	function buildQueryVariables<Vars>(
		variables: Vars & {
			eventsStart?: string;
			eventsEnd?: string;
		},
		selected: Period
	) {
		let eventsStart: Date;
		let eventsEnd: Date;
		const today = new Date();
		if (selected === threeMonths) {
			eventsStart = addMonths(today, -3);
		} else if (selected === threeSixMonths) {
			eventsStart = addMonths(today, -6);
			eventsEnd = addMonths(today, -3);
		} else if (selected === sixTwelveMonths) {
			eventsStart = addMonths(today, -12);
			eventsEnd = addMonths(today, -6);
		} else if (selected === twelveMonths) {
			eventsEnd = addMonths(today, -12);
		}

		if (eventsStart) {
			variables.eventsStart = toDateFormat(eventsStart);
		}
		if (eventsEnd) {
			variables.eventsEnd = toDateFormat(eventsEnd);
		}
		return variables;
	}

	export const load: Load = ({ page }) => {
		const notebookId = page.params.uuid;
		const variables = { id: notebookId };
		const getNotebookStore = operationStore(
			GetNotebookDocument,
			buildQueryVariables(variables, null)
		);

		const updateVisitDateResult = operationStore(UpdateNotebookVisitDateDocument, {
			notebookId,
			notebookVisitDate: new Date(),
		});
		return {
			props: {
				notebookId,
				getNotebookStore,
				updateVisitDateResult,
			},
		};
	};
</script>

<script lang="ts">
	export let notebookId: string;
	export let getNotebookStore: GetNotebookQueryStore;
	let selected: Period = null;
	let getNotebookEventsStore: GetNotebookEventsQueryStore = operationStore(
		GetNotebookEventsDocument,
		{ notebookId, eventsStart: null, eventsEnd: null },
		{ pause: true }
	);

	query(getNotebookStore);
	query(getNotebookEventsStore);

	function onSelect() {
		$getNotebookEventsStore.context.pause = false;
		const variables = { notebookId };
		$getNotebookEventsStore.variables = buildQueryVariables(variables, selected);
		$getNotebookEventsStore.reexecute();
	}

	$: notebook = $getNotebookStore.data?.notebook;
	$: events =
		$getNotebookEventsStore.data?.notebook_event || $getNotebookStore.data?.notebook.events;
	$: beneficiary = notebook?.beneficiary as Beneficiary;
	$: members = notebook?.members as NotebookMember[];
	$: lastMember = members?.length ? members[0] : null;
</script>

<LoaderIndicator result={getNotebookStore}>
	<div class="flex flex-col gap-8 px-40">
		<ProNotebookPersonalInfoView
			{beneficiary}
			on:edit={() => alert('Not implemented!')}
			on:print={() => alert('Not implemented!')}
			lastUpdateDate={lastMember?.notebookModificationDate}
			lastUpdateFrom={lastMember?.professional}
		/>
		<Accordions>
			<MainAccordion title="Situation socioprofessionnelle">
				<ProNotebookSocioProView {notebook} />
			</MainAccordion>
			<MainAccordion title="Groupe de suivi">
				<ProNotebookMembersView
					{members}
					notebookId={notebook.id}
					beneficiaryFirstname={beneficiary.firstname}
					beneficiaryLastname={beneficiary.lastname}
				/>
			</MainAccordion>
			<MainAccordion title="Axes de travail">
				<ProNotebookFocusView {notebook} focuses={notebook.focuses} />
			</MainAccordion>
			<MainAccordion title="Historique de parcours">
				<div class="mb-2">
					<Select
						on:select={onSelect}
						options={[
							{ name: null, label: 'Tous les évènements' },
							{ name: threeMonths, label: 'Dans les 3 derniers mois' },
							{ name: threeSixMonths, label: 'Entre les 3 et 6 derniers mois' },
							{ name: sixTwelveMonths, label: 'Entre les 6 et 12 derniers mois' },
							{ name: twelveMonths, label: 'Il y a plus de 12 mois' },
						]}
						bind:selected
						selectHint="Sélectionner un filtre"
						selectLabel=""
					/>
				</div>
				<div class={`w-full fr-table fr-table--layout-fixed`}>
					<table class="w-full">
						<thead>
							<tr>
								<th>Date</th>
								<th>Événements</th>
								<th>Auteurs</th>
							</tr>
						</thead>
						<tbody class="w-full">
							{#each events || [] as event (event.id)}
								<tr>
									<td>{formatDateLocale(event.eventDate)} </td>
									<td>{event.event}</td>
									<td>{event.structure} </td>
								</tr>
							{:else}
								<tr class="shadow-sm">
									<td class="!text-center" colspan="3"> Aucun événement pour le moment. </td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			</MainAccordion>
		</Accordions>
	</div>
</LoaderIndicator>
