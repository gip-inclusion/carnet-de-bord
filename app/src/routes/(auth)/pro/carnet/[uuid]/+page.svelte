<script lang="ts">
	import Alert from '$lib/ui/base/Alert.svelte';
	import Dialog from '$lib/ui/Dialog.svelte';
	import { Button } from '$lib/ui/base';
	import { Text } from '$lib/ui/utils';
	import { OrientationRequestStatus } from '$lib/constants/keys';
	import { accountData, openComponent } from '$lib/stores';
	import { baseUrlForRole } from '$lib/routes';
	import { RoleEnum } from '$lib/graphql/_gen/typed-document-nodes';
	import {
		GetNotebookDocument,
		UpdateNotebookVisitDateDocument,
	} from '$lib/graphql/_gen/typed-document-nodes';
	import { MainSection } from '$lib/ui/base';
	import NotebookEventList from '$lib/ui/NotebookEvent/NotebookEventList.svelte';
	import { ProNotebookFocusView } from '$lib/ui/ProNotebookFocus';
	import { ProNotebookMembersView } from '$lib/ui/ProNotebookMember';
	import { ProNotebookPersonalInfoView } from '$lib/ui/ProNotebookPersonalInfo';
	import { ProNotebookSocioProView } from '$lib/ui/ProNotebookSocioPro';
	import CreateOrientationRequest from '$lib/ui/OrientationRequest/CreateOrientationRequestForm.svelte';
	import { LoaderIndicator } from '$lib/ui/utils';
	import { mutation, operationStore, query } from '@urql/svelte';
	import ProOrientationRequestBanner from '$lib/ui/OrientationRequest/ProOrientationRequestBanner.svelte';
	import Portal from 'svelte-portal';
	import { Elm as RsaRightNotice } from '../../../../../../elm/RsaRightNotice/Main.elm';

	import type { PageData } from './$types';
	import NotebookMembers from '$lib/ui/Beneficiary/NotebookMembers.svelte';
	import { goto } from '$app/navigation';
	import ElmWrapper from '$lib/utils/ElmWrapper.svelte';

	const elmSetup = (node: HTMLElement) => {
		RsaRightNotice.RsaRightNotice.Main.init({
			node,
			flags: {
				rsaRight: publicNotebook?.beneficiary.rightRsa,
				rsaClosureDate: publicNotebook?.beneficiary.rsaClosureDate,
				rsaClosureReason: publicNotebook?.beneficiary.rsaClosureReason,
				rsaSuspensionReason: publicNotebook?.beneficiary.rsaSuspensionReason,
			},
		});
	};

	export let data: PageData;

	const variables = { id: data.notebookId };
	const getNotebook = operationStore(GetNotebookDocument, variables, {
		additionalTypenames: [
			'notebook_focus',
			'notebook_action',
			'notebook_appointment',
			'orientation_request',
		],
	});

	const updateVisitDateMutation = mutation(operationStore(UpdateNotebookVisitDateDocument));

	function recordVisit() {
		if (visitRecorded) {
			return;
		}
		visitRecorded = true;
		updateVisitDateMutation({
			id: data.notebookId,
			accountId: data.account.id,
			date: new Date().toISOString(),
		});
	}

	function requireReorientation() {
		openComponent.open({
			component: CreateOrientationRequest,
			props: {
				beneficiaryId: beneficiary.id,
			},
		});
	}

	function onJoinedNotebook() {
		$getNotebook.reexecute({ requestPolicy: 'network-only' });
	}

	query(getNotebook);
	let visitRecorded = false;
	let notebook = null;
	$: publicNotebook = $getNotebook.data?.notebook_public_view[0];
	$: {
		notebook = publicNotebook?.notebook;
		if (notebook) {
			recordVisit();
		}
	}
	$: beneficiary = publicNotebook?.beneficiary;
	$: members = publicNotebook?.members ?? [];
	$: appointments = notebook?.appointments ?? [];
	$: lastMember = members?.length ? members[0] : null;
	$: reorientationRequest =
		beneficiary?.orientationRequest?.length > 0 ? beneficiary.orientationRequest[0] : null;
	$: previousReferent = publicNotebook?.previousReferent?.length
		? publicNotebook.previousReferent[0]
		: null;

	$: isReferent = members.some(
		(member) => member.account.id === $accountData.id && member.memberType === 'referent'
	);
	$: isPreviousReferent = $accountData.id === previousReferent?.account?.id;
	$: isMember = members.some(({ account }) => $accountData.id === account.id);

	$: peData = beneficiary?.peInfos.length > 0 ? beneficiary.peInfos[0].externalData : null;
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
		<Portal target="#bandeau">
			<ElmWrapper setup={elmSetup} />
			{#if reorientationRequest}
				<ProOrientationRequestBanner {reorientationRequest} />
			{/if}
		</Portal>
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
						on:joined-notebook={onJoinedNotebook}
					/>
				{/if}
			</MainSection>
			{#if notebook}
				<MainSection title="Diagnostic socioprofessionnel">
					<ProNotebookSocioProView
						{notebook}
						externalDataDetail={peData}
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
			{#if isMember}
				<NotebookEventList {notebook} />
			{/if}
		</div>
	{/if}
</LoaderIndicator>

<style>
	:global(.text-warning) {
		color: var(--text-default-warning);
	}

	:global(.text-error) {
		color: var(--text-default-error);
	}
</style>
