<script lang="ts">
	import { MainSection, SearchBar, Select } from '$lib/ui/base';
	import type {
		GetNotebookQuery,
		GetNotebookEventsQueryStore,
		GetNotebookEventsQuery,
	} from '$lib/graphql/_gen/typed-document-nodes';
	import { stringsMatch } from '$lib/helpers';
	import { addMonths } from 'date-fns';
	import { operationStore, query } from '@urql/svelte';
	import {
		GetNotebookEventsDocument,
		NotebookEventTypeEnum,
	} from '$lib/graphql/_gen/typed-document-nodes';
	import { focusThemeKeys } from '$lib/constants/keys';
	import { actionStatusValues, eventTypes, targetStatusValues } from '$lib/constants';
	import { formatDateLocale } from '$lib/utils/date';

	type Notebook = GetNotebookQuery['notebook_public_view'][0]['notebook'];
	export let notebook: Notebook;

	const allEvents = 'allEvents';
	const threeMonths = '-3months';
	const threeSixMonths = '3-6months';
	const sixTwelveMonths = '6-12months';
	const twelveMonths = '+12months';

	type Period =
		| typeof allEvents
		| typeof threeMonths
		| typeof threeSixMonths
		| typeof sixTwelveMonths
		| typeof twelveMonths
		| null;

	type NotebookEvent = GetNotebookEventsQuery['notebook_event'][number];

	let search = '';
	const allValues = targetStatusValues.concat(actionStatusValues);
	let selected: Period = threeMonths;

	const getNotebookEvents: GetNotebookEventsQueryStore = operationStore(
		GetNotebookEventsDocument,
		buildQueryVariables({ notebookId: notebook?.id }, selected),
		{ requestPolicy: 'network-only', additionalTypenames: ['notebook_event'] }
	);

	query(getNotebookEvents);

	$: events = $getNotebookEvents.data?.notebook_event || [];
	$: filteredEvents = events;

	function eventCategory(event): string {
		if (event.eventType == NotebookEventTypeEnum.Orientation) {
			return 'Accompagnement';
		}
		console.log(
			event,
			event.eventType,
			NotebookEventTypeEnum.Orientation,
			event.enventType == NotebookEventTypeEnum.Orientation
		);
		if (
			(event.eventType != NotebookEventTypeEnum.Action &&
				event.eventType != NotebookEventTypeEnum.Target) ||
			!focusThemeKeys.byKey[event.event.category]
		) {
			return 'Action inconnue';
		}

		return (
			constantToString(event.eventType, eventTypes) +
			' ' +
			focusThemeKeys.byKey[event.event.category]
		);
	}

	function eventLabel(notebookEvent: NotebookEvent): string {
		if (notebookEvent.eventType === NotebookEventTypeEnum.Orientation) return '(Ré)orientation';
		else return notebookEvent.event.event_label;
	}

	function eventStructure(notebookEvent: NotebookEvent): string {
		if (notebookEvent.eventType === NotebookEventTypeEnum.Orientation) {
			let str = notebookEvent.event?.structure ?? '-';
			str += ` (Dispositif: ${notebookEvent.event.orientation})`;
			return str;
		}
		if (!notebookEvent.creator && notebookEvent.event.from == 'pole_emploi') {
			return 'Pôle emploi';
		} else {
			return notebookEvent.creator?.professional?.structure.name ?? '-';
		}
	}

	function eventStatus(event: NotebookEvent): string {
		if (event.eventType == NotebookEventTypeEnum.Orientation) {
			return 'En cours';
		}
		return constantToString(
			event.event.status,
			event.eventType == NotebookEventTypeEnum.Action ? actionStatusValues : targetStatusValues
		);
	}

	function constantToString(
		status: string,
		statusValues: { label: string; name: string }[]
	): string {
		const status_string = statusValues.find((v) => v.name == status);
		return status_string ? status_string.label : 'Inconnu';
	}

	function handleSearch() {
		const matcher = stringsMatch(search);
		filteredEvents = events?.filter(
			(filtered_event) =>
				matcher(filtered_event.event.event_label) ||
				matcher(filtered_event.creator?.professional?.structure.name) ||
				matcher(eventCategory(filtered_event)) ||
				matcher(constantToString(filtered_event.event.status, allValues))
		);
	}

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

	function onSelect(event: CustomEvent<{ selected: Period }>) {
		selected = event.detail.selected;
		$getNotebookEvents.variables = buildQueryVariables({ notebookId: notebook?.id }, selected);
		$getNotebookEvents.reexecute();
	}
</script>

{#if events}
	<MainSection title="Historique de parcours">
		<div class="flex flex-row justify-between mb-2">
			<Select
				on:select={onSelect}
				options={[
					{ name: allEvents, label: 'Tous les évènements' },
					{ name: threeMonths, label: 'Dans les 3 derniers mois' },
					{ name: threeSixMonths, label: 'Entre les 3 et 6 derniers mois' },
					{ name: sixTwelveMonths, label: 'Entre les 6 et 12 derniers mois' },
					{ name: twelveMonths, label: 'Il y a plus de 12 mois' },
				]}
				{selected}
				selectHint="Sélectionner un filtre"
				selectLabel="Période"
				classNames="self-center"
				twWidthClass="w-5/12"
			/>
			<SearchBar
				inputLabel=""
				inputHint="Axe de travail, action, structure"
				bind:search
				handleSubmit={handleSearch}
				classNames="self-center"
				twWidthClass="w-5/12"
			/>
		</div>
		<div class={`w-full fr-table fr-table--layout-fixed`}>
			<table class="w-full">
				<caption class="sr-only">Historique de parcours</caption>
				<thead>
					<tr>
						<th>Date</th>
						<th>Catégorie</th>
						<th>Évènements</th>
						<th>Structure</th>
						<th>Statut</th>
					</tr>
				</thead>
				<tbody class="w-full">
					{#each filteredEvents as event (event.id)}
						<tr>
							<td>{formatDateLocale(event.eventDate)} </td>
							<td>{eventCategory(event)}</td>
							<td>{eventLabel(event)}</td>
							<td>{eventStructure(event)}</td>
							<td>{eventStatus(event)}</td>
						</tr>
						{#if event.eventType == NotebookEventTypeEnum.Orientation && event.event.previousStructure}
							<tr>
								<td>{formatDateLocale(event.eventDate)} </td>
								<td>{eventCategory(event)}</td>
								<td>{eventLabel(event)}</td>
								<td>
									{event.event.previousStructure}
									{#if event.event.previousOrientation}
										(Dispositif: {event.event.previousOrientation})
									{/if}
								</td>
								<td>Clos</td>
							</tr>
						{/if}
					{:else}
						<tr class="shadow-sm">
							<td class="!text-center" colspan="5">
								{#if events.length > 0}
									Aucun évènement ne correspond à votre recherche.
								{:else}
									Aucun évènement pour le moment.
								{/if}
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</MainSection>
{/if}
