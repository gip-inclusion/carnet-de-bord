<script lang="ts">
	import MainSection from '$lib/ui/base/MainSection.svelte';

	import { ProNotebookSocioProView } from '$lib/ui/ProNotebookSocioPro';
	import { ProNotebookPersonalInfoView } from '$lib/ui/ProNotebookPersonalInfo';
	import { ProNotebookMembersView } from '$lib/ui/ProNotebookMember';
	import { ProNotebookFocusView } from '$lib/ui/ProNotebookFocus';
	import { displayFullName } from '../format';
	import { GetNotebookQuery, RoleEnum } from '$lib/graphql/_gen/typed-document-nodes';
	import OrientationRequestBanner from '../OrientationRequest/OrientationRequestBanner.svelte';
	import OrientationHeader from '../OrientationHeader/OrientationHeader.svelte';
	import { accountData } from '$lib/stores';
	import { goto } from '$app/navigation';
	import { baseUrlForRole } from '$lib/routes';

	export let notebook: GetNotebookQuery['notebook_public_view'][number];

	$: beneficiary = notebook.beneficiary;
	$: orientationRequest =
		beneficiary?.orientationRequest?.length > 0 ? beneficiary.orientationRequest[0] : null;
	$: isMember = notebook.members.some((member) => member.account.id === $accountData.id);

	$: externalData =
		beneficiary?.externalDataInfos.length > 0
			? beneficiary.externalDataInfos[0].externalData
			: null;
</script>

<svelte:head>
	<title>Carnet de {displayFullName(notebook.beneficiary)} - Carnet de bord</title>
</svelte:head>

<div class="fr-py-6w flex flex-col gap-8">
	{#if orientationRequest && !orientationRequest?.decidedAt}
		<OrientationRequestBanner
			notebook={notebook?.notebook}
			{orientationRequest}
			on:beneficiary-orientation-changed
		/>
	{:else}
		<OrientationHeader notebook={notebook?.notebook} on:beneficiary-orientation-changed />
	{/if}
	<ProNotebookPersonalInfoView
		beneficiary={notebook.beneficiary}
		lastUpdateDate={notebook.members[0]?.lastModifiedAt}
		lastUpdateFrom={notebook.members[0]?.account?.professional ||
			notebook.members[0]?.account?.orientation_manager}
		displayEditButton={isMember}
	/>
	<div>
		<MainSection title="Groupe de suivi">
			<ProNotebookMembersView
				members={notebook.members}
				notebookId={notebook.id}
				beneficiaryFirstname={notebook.beneficiary.firstname}
				beneficiaryLastname={notebook.beneficiary.lastname}
				appointments={notebook?.notebook?.appointments}
				displayMemberManagementButtons={isMember}
			/>
		</MainSection>
		<MainSection title="Diagnostic socioprofessionnel">
			<ProNotebookSocioProView
				notebook={notebook?.notebook}
				externalDataDetail={externalData}
				focuses={notebook?.notebook?.focuses}
				on:click={() =>
					goto(
						`${baseUrlForRole(RoleEnum.OrientationManager)}/carnets/edition/${
							notebook?.id
						}/diagnostic`
					)}
			/>
		</MainSection>
		<MainSection title="Plan d'action">
			<ProNotebookFocusView notebook={notebook?.notebook} focuses={notebook?.notebook?.focuses} />
		</MainSection>
	</div>
</div>
