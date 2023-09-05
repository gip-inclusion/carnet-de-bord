<script lang="ts">
	import { focusThemeKeys } from '$lib/constants/keys';
	import { displayFullName } from '$lib/ui/format';
	import { formatDateLocale } from '$lib/utils/date';
	import { Accordions, MainSection } from '$lib/ui/base';
	import {
		type GetNotebookByBeneficiaryIdQuery,
		RoleEnum,
	} from '$lib/graphql/_gen/typed-document-nodes';
	import SocioProView from '../Beneficiary/SocioProView.svelte';
	import NotebookMembers from '../Beneficiary/NotebookMembers.svelte';
	import Accordion from '../base/Accordion.svelte';
	import ProNotebookPersonalInfoView from '$lib/ui/ProNotebookPersonalInfo/ProNotebookPersonalInfoView.svelte';
	import OrientationRequestBanner from '../OrientationRequest/OrientationRequestBanner.svelte';
	import OrientationHeader from '../OrientationHeader/OrientationHeader.svelte';
	import { ProNotebookMembersView } from '$lib/ui/ProNotebookMember';

	import Portal from 'svelte-portal';
	import { accountData } from '$lib/stores';

	type Notebook = GetNotebookByBeneficiaryIdQuery['notebook'][number];

	export let notebook: Notebook;

	$: beneficiary = notebook.beneficiary;
	$: members = notebook.members;
	// members are sorted by lastModified desc
	$: lastUpdateFrom = members[0]?.account?.professional || members[0]?.account?.orientation_manager;
	$: orientationRequest =
		beneficiary?.orientationRequest?.length > 0 ? beneficiary.orientationRequest[0] : null;
	$: canEdit =
		$accountData.type === RoleEnum.Manager || $accountData.type === RoleEnum.AdminStructure;
	$: appointments = notebook?.appointments ?? [];

	$: canEditDetailedInfo = $accountData.type === RoleEnum.Manager;

	$: externalData =
		beneficiary?.externalDataInfos.length > 0
			? beneficiary.externalDataInfos[0].externalData
			: null;
</script>

<div class="fr-py-6w flex flex-col gap-8">
	{#if orientationRequest && !orientationRequest?.decidedAt}
		<Portal target="#bandeau">
			<OrientationRequestBanner
				{notebook}
				{orientationRequest}
				on:beneficiary-orientation-changed
			/>
		</Portal>
	{:else}
		<OrientationHeader {notebook} on:beneficiary-orientation-changed />
	{/if}

	<ProNotebookPersonalInfoView
		{beneficiary}
		lastUpdateDate={members[0]?.lastModifiedAt}
		{lastUpdateFrom}
		displayEditButton={canEdit}
		{canEditDetailedInfo}
	/>
	<div>
		<MainSection title="Groupe de suivi">
			{#if $accountData.type === RoleEnum.AdminStructure}
				<ProNotebookMembersView
					{members}
					orientationSystem={notebook.notebookInfo?.orientationSystem?.name}
					notebookId={notebook.id}
					beneficiaryFirstname={beneficiary.firstname}
					beneficiaryLastname={beneficiary.lastname}
					{appointments}
					displayMemberManagementButtons={false}
				/>
			{:else}
				<NotebookMembers
					members={notebook.members}
					orientationSystem={notebook.notebookInfo?.orientationSystem?.name}
					notebookId={notebook.id}
				/>
			{/if}
		</MainSection>
		<MainSection title="Diagnostic socioprofessionnel">
			<SocioProView {notebook} externalDataDetail={externalData} />
		</MainSection>
		<MainSection title="Plan d'action">
			{#if notebook.focuses.length === 0}
				Pas d'actions en cours
			{/if}
			<ul class="list-none pl-0">
				{#each notebook.focuses as focus}
					<li>
						<h3 class="fr-h4">
							<span><span class="fr-icon-arrow-right-s-line" aria-hidden="true" /></span
							>{focusThemeKeys.byKey[focus.theme]}
						</h3>
						<div class="py-4">
							<Accordions>
								{#each focus.targets as target}
									<Accordion title={target.target}>
										<ul>
											{#each target.actions as action}
												<li>
													{action.action}
													créé le {formatDateLocale(action.createdAt)}
													{#if action.creator}
														par {displayFullName(
															action.creator?.professional || action.creator?.orientation_manager
														)}
													{/if}
												</li>
											{/each}
										</ul>
									</Accordion>
								{/each}
							</Accordions>
						</div>
					</li>
				{/each}
			</ul>
		</MainSection>
	</div>
</div>
