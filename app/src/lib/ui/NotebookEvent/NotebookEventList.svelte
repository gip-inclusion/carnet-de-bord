<script lang="ts">
	import { MainSection, SearchBar, Select } from '$lib/ui/base';
	import type {
		GetNotebookQuery,
		GetNotebookEventsQueryStore,
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

	let search = '';
	const allValues = targetStatusValues.concat(actionStatusValues);
	let selected: Period = threeMonths;

	const getNotebookEvents: GetNotebookEventsQueryStore = operationStore(
		GetNotebookEventsDocument,
		buildQueryVariables({ notebookId: notebook?.id }, selected)
	);

	query(getNotebookEvents);

	$: events = $getNotebookEvents.data?.notebook_event || [];
	$: filteredEvents = events;

	function eventCategory(event): string {
		if (
			(event.eventType == NotebookEventTypeEnum.Action ||
				event.eventType == NotebookEventTypeEnum.Target) &&
			focusThemeKeys.byKey[event.event.category]
		) {
			return (
				constantToString(event.eventType, eventTypes) +
				' ' +
				focusThemeKeys.byKey[event.event.category]
			);
		} else {
			return 'Action inconnue';
		}
	}

	function constantToString(
		status: string,
		statusValues: { label: string; name: string }[]
	): string {
		const status_string: { label: string; name: string } = statusValues.find(
			(v) => v.name == status
		);

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
							<td>{event.event.event_label}</td>
							<td
								>{#if !event.creator && event.event.from == 'pole_emploi'}
									Pôle emploi
								{:else}
									{event.creator?.professional?.structure.name ?? '-'}
								{/if}</td
							>
							<td
								>{constantToString(
									event.event.status,
									event.eventType == NotebookEventTypeEnum.Action
										? actionStatusValues
										: targetStatusValues
								)}</td
							>
						</tr>
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
