<script lang="ts">
	import Alert from '$lib/ui/base/Alert.svelte';
	import Dialog from '$lib/ui/Dialog.svelte';
	import { Button } from '$lib/ui/base';
	import { Text } from '$lib/ui/utils';
	import { OrientationRequestStatus } from '$lib/constants/keys';
	import { accountData, openComponent } from '$lib/stores';
	import { baseUrlForRole } from '$lib/routes';
	import { GetNotebookEventsQueryStore, RoleEnum } from '$lib/graphql/_gen/typed-document-nodes';
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
	import CreateOrientationRequest from '$lib/ui/OrientationRequest/CreateOrientationRequestForm.svelte';
	import { LoaderIndicator } from '$lib/ui/utils';
	import { eventTypes, statusValues } from '$lib/constants';
	import { EventType } from '$lib/enums';
	import { formatDateLocale } from '$lib/utils/date';
	import { mutation, operationStore, query } from '@urql/svelte';
	import { addMonths } from 'date-fns';
	import { focusThemeKeys } from '$lib/constants/keys';
	import ProOrientationRequestBanner from '$lib/ui/OrientationRequest/ProOrientationRequestBanner.svelte';

	import Portal from 'svelte-portal';

	import type { PageData } from './$types';
	import NotebookMembers from '$lib/ui/Beneficiary/NotebookMembers.svelte';
	import { goto } from '$app/navigation';

	function toDateFormat(date: Date) {
		const yyyy = date.getFullYear().toString().padStart(4, '0');
		const mm = (1 + date.getMonth()).toString().padStart(2, '0');
		const dd = date.getDate().toString().padStart(2, '0');

		return `${yyyy}-${mm}-${dd}`;
	}

	function eventCategory(event): string {
		if (
			(event.eventType == EventType.Action || event.eventType == EventType.Target) &&
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
	const getNotebookEvents: GetNotebookEventsQueryStore = operationStore(
		GetNotebookEventsDocument,
		{ notebookId: data.notebookId },
		{ pause: true }
	);
	const variables = { id: data.notebookId };
	const getNotebook = operationStore(
		GetNotebookDocument,
		buildQueryVariables(variables, selected),
		{
			additionalTypenames: [
				'notebook_focus',
				'notebook_action',
				'notebook_appointment',
				'orientation_request',
			],
		}
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
			component: CreateOrientationRequest,
			props: {
				beneficiaryId: beneficiary.id,
			},
		});
	};

	function refreshNotebook() {
		$getNotebook.reexecute({ requestPolicy: 'network-only' });
		$getNotebookEvents.reexecute({ requestPolicy: 'network-only' });
	}

	$: publicNotebook = $getNotebook.data?.notebook_public_view[0];
	$: notebook = publicNotebook?.notebook;
	$: events = $getNotebookEvents.data?.notebook_event || notebook?.events;
	$: beneficiary = publicNotebook?.beneficiary;
	$: members = publicNotebook?.members ?? [];
	$: appointments = notebook?.appointments ?? [];
	$: lastMember = members?.length ? members[0] : null;
	$: reorientationRequest =
		beneficiary?.orientationRequest?.length > 0 ? beneficiary.orientationRequest[0] : null;
	$: previousReferent = publicNotebook?.previousReferent?.length
		? publicNotebook.previousReferent[0]
		: null;

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
	$: isPreviousReferent = $accountData.id === previousReferent?.account?.id;
	$: isMember = members.some(({ account }) => $accountData.id === account.id);

	$: externalData =
		beneficiary?.externalDataInfos.length > 0
			? beneficiary.externalDataInfos[0].externalData
			: null;
</script>

<svelte:head>
	<title>Carnet bénéficiaire - Carnet de bord</title>
</svelte:head>

<LoaderIndicator result={getNotebook}>
	{#if !publicNotebook}
		<Alert type="info" title="erreur"
			>Carnet introuvable. Essayer de passer par <a
				href={`${baseUrlForRole('professional')}/annuaire`}
				title="Rechercher un bénéficiaire">l'annuaire</a
			> pour rechercher le bénéficiaire.</Alert
		>
	{:else}
		{#if reorientationRequest}
			<Portal target="#bandeau">
				<ProOrientationRequestBanner {reorientationRequest} />
			</Portal>
		{/if}
		<div>
			{#if !reorientationRequest || reorientationRequest.status != OrientationRequestStatus.pending}
				{#if notebook?.notebookInfo?.orientationReason && (isReferent || isPreviousReferent)}
					<Dialog
						label="Voir le motif de l‘orientation"
						buttonLabel="Voir le motif de l‘orientation"
						title="Motif de l‘orientation"
						showButtons={false}
						buttonCssClasses="inline mr-6"
					>
						<Text value={notebook.notebookInfo?.orientationReason} />
					</Dialog>
				{/if}
				{#if isReferent}
					<Button classNames="inline" outline on:click={requireReorientation}
						>Demander une réorientation</Button
					>
				{/if}
			{/if}
		</div>
		<ProNotebookPersonalInfoView
			{beneficiary}
			lastUpdateDate={lastMember?.lastModifiedAt}
			lastUpdateFrom={lastMember?.account?.professional || lastMember?.account?.orientation_manager}
			displayEditButton={isMember}
		/>
		<div>
			<MainSection title="Groupe de suivi">
				{#if notebook}
					<ProNotebookMembersView
						{members}
						notebookId={publicNotebook.id}
						beneficiaryFirstname={beneficiary.firstname}
						beneficiaryLastname={beneficiary.lastname}
						{appointments}
						displayMemberManagementButtons={isMember}
					/>
				{:else}
					<NotebookMembers
						{members}
						notebookId={publicNotebook.id}
						on:notebook-member-added={refreshNotebook}
					/>
				{/if}
			</MainSection>
			{#if notebook}
				<MainSection title="Diagnostic socioprofessionnel">
					<ProNotebookSocioProView
						{notebook}
						externalDataDetail={externalData}
						on:click={() =>
							goto(`${baseUrlForRole(RoleEnum.Professional)}/carnet/${notebook.id}/diagnostic`)}
					/>
				</MainSection>
			{/if}

			{#if notebook?.focuses}
				<MainSection title="Plan d'action">
					<ProNotebookFocusView {notebook} focuses={notebook.focuses} />
				</MainSection>
			{/if}
			{#if notebook?.events}
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
										<td
											>{#if !event.creator && event.event.from == 'pole_emploi'}
												Pôle emploi
											{:else}
												{event.creator?.professional?.structure.name ?? '-'}
											{/if}</td
										>
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
			{/if}
		</div>
	{/if}
</LoaderIndicator>
