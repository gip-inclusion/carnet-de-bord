<script lang="ts">
	import Alert from '$lib/ui/base/Alert.svelte';
	import { Button } from '$lib/ui/base';
	import { accountData, openComponent } from '$lib/stores';
	import { baseUrlForRole } from '$lib/routes';
	import type { GetNotebookEventsQueryStore } from '$lib/graphql/_gen/typed-document-nodes';
	import {
		GetNotebookDocument,
		GetNotebookEventsDocument,
		UpdateNotebookVisitDateDocument,
	} from '$lib/graphql/_gen/typed-document-nodes';
	import { stringsMatch } from '$lib/helpers';
	import { MainSection, SearchBar, Select } from '$lib/ui/base';
	import { ProNotebookFocusView } from '$lib/ui/ProNotebookFocus';
	import { ProNotebookMembersView } from '$lib/ui/ProNotebookMember';
	import { ProNotebookPersonalInfoView } from '$lib/ui/ProNotebookPersonalInfo';
	import { ProNotebookSocioProView } from '$lib/ui/ProNotebookSocioPro';
	import { RequireReorientation } from '$lib/ui/RequireReorientation';
	import { LoaderIndicator } from '$lib/ui/utils';
	import { eventTypes, statusValues } from '$lib/constants';
	import { EventType } from '$lib/enums';
	import { formatDateLocale } from '$lib/utils/date';
	import { mutation, operationStore, query } from '@urql/svelte';
	import { addMonths } from 'date-fns';
	import { focusThemeKeys } from '$lib/constants/keys';
	import OrientationRequestBanner from '$lib/ui/OrientationRequest/OrientationRequestBanner.svelte';

	import type { PageData } from './$types';

	function toDateFormat(date: Date) {
		const yyyy = date.getFullYear().toString().padStart(4, '0');
		const mm = (1 + date.getMonth()).toString().padStart(2, '0');
		const dd = date.getDate().toString().padStart(2, '0');

		return `${yyyy}-${mm}-${dd}`;
	}

	function eventCategory(event): string {
		if (event.eventType == EventType.Action || event.eventType == EventType.Target) {
			return (
				constantToString(event.eventType, eventTypes) +
				' ' +
				focusThemeKeys.byKey[event.event.category]
			);
		} else {
			return 'Inconnue';
		}
	}

	function constantToString(
		status: string,
		statusValues: { label: string; name: string }[]
	): string {
		let status_string: { label: string; name: string } = statusValues.find((v) => v.name == status);

		return status_string ? status_string.label : 'Inconnu';
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
	let selected: Period = threeMonths;

	export let data: PageData;

	const updateVisitDateStore = operationStore(UpdateNotebookVisitDateDocument);
	let getNotebookEvents: GetNotebookEventsQueryStore = operationStore(
		GetNotebookEventsDocument,
		{ notebookId: data.notebookId },
		{ pause: true }
	);
	const variables = { id: data.notebookId };
	const getNotebook = operationStore(
		GetNotebookDocument,
		buildQueryVariables(variables, selected),
		{ additionalTypenames: ['notebook_action', 'notebook_appointment'] }
	);

	query(getNotebook);
	query(getNotebookEvents);

	const updateVisitDateMutation = mutation(updateVisitDateStore);
	updateVisitDateMutation({
		id: data.notebookId,
		date: new Date().toISOString(),
	});

	function onSelect(event: CustomEvent<{ selected: Period }>) {
		selected = event.detail.selected;
		$getNotebookEvents.context.pause = false;
		const variables = { notebookId: data.notebookId };
		$getNotebookEvents.variables = buildQueryVariables(variables, selected);
		$getNotebookEvents.reexecute();
	}

	const requireReorientation = () => {
		openComponent.open({
			component: RequireReorientation,
			props: {
				beneficiaryId: beneficiary.id,
			},
		});
	};

	$: notebook = $getNotebook.data?.notebook;
	$: events = $getNotebookEvents.data?.notebook_event || $getNotebook.data?.notebook?.events;
	$: beneficiary = notebook?.beneficiary;
	$: members = notebook?.members ?? [];
	$: appointments = notebook?.appointments;
	$: lastMember = members?.length ? members[0] : null;
	$: orientationRequest =
		beneficiary?.orientationRequest?.length > 0 ? beneficiary.orientationRequest[0] : null;

	$: console.log(orientationRequest);

	let search = '';

	$: filteredEvents = events;

	function handleSearch() {
		const matcher = stringsMatch(search);
		filteredEvents = events?.filter(
			(filtered_event) =>
				matcher(filtered_event.event.event_label) ||
				matcher(filtered_event.creator?.professional?.structure.name) ||
				matcher(eventCategory(filtered_event)) ||
				matcher(constantToString(filtered_event.event.status, statusValues))
		);
	}
	$: isReferent = members.some(
		(member) => member.account.id === $accountData.id && member.memberType === 'referent'
	);
</script>

<svelte:head>
	<title>Carnet bénéficiaire - Carnet de bord</title>
</svelte:head>

<LoaderIndicator result={getNotebook}>
	{#if !notebook}
		<Alert type="info" title="erreur"
			>Carnet introuvable. Essayer de passer par <a
				href={`${baseUrlForRole('professional')}/annuaire`}
				title="Rechercher un bénéficiaire">l'annuaire</a
			> pour rechercher le bénéficiaire.</Alert
		>
	{:else}
		{#if orientationRequest}
			<OrientationRequestBanner {orientationRequest} />
		{/if}
		<ProNotebookPersonalInfoView
			{beneficiary}
			on:edit={() => alert('Not implemented!')}
			on:print={() => alert('Not implemented!')}
			lastUpdateDate={lastMember?.lastModifiedAt}
			lastUpdateFrom={lastMember?.account?.professional || lastMember?.account?.orientation_manager}
		/>
		<div>
			<MainSection title="Situation socioprofessionnelle">
				<ProNotebookSocioProView {notebook} />
			</MainSection>
			<MainSection title="Groupe de suivi">
				<ProNotebookMembersView
					{members}
					notebookId={notebook.id}
					beneficiaryFirstname={beneficiary.firstname}
					beneficiaryLastname={beneficiary.lastname}
					{appointments}
				/>
			</MainSection>
			<MainSection title="Plan d'action">
				<ProNotebookFocusView {notebook} focuses={notebook.focuses} />
			</MainSection>
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
							{#each filteredEvents || [] as event (event.id)}
								<tr>
									<td>{formatDateLocale(event.eventDate)} </td>
									<td>{eventCategory(event)}</td>
									<td>{event.event.event_label}</td>
									<td>{event.creator?.professional?.structure.name ?? '-'} </td>
									<td>{constantToString(event.event.status, statusValues)}</td>
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
		</div>
		{#if isReferent && !orientationRequest}
			<Button outline on:click={requireReorientation}>Demander une réorientation</Button>
		{/if}
	{/if}
</LoaderIndicator>
