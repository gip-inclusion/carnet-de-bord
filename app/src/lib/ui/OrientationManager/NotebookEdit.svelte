<script lang="ts">
	import MainSection from '$lib/ui/base/MainSection.svelte';

	import { ProNotebookSocioProView } from '$lib/ui/ProNotebookSocioPro';
	import { ProNotebookPersonalInfoView } from '$lib/ui/ProNotebookPersonalInfo';
	import { ProNotebookMembersView } from '$lib/ui/ProNotebookMember';
	import { ProNotebookFocusView } from '$lib/ui/ProNotebookFocus';
	import { displayFullName } from '../format';
	import type { GetNotebookQuery } from '$lib/graphql/_gen/typed-document-nodes';
	import OrientationRequestBanner from '../OrientationRequest/OrientationRequestBanner.svelte';
	import OrientationHeader from '../OrientationHeader/OrientationHeader.svelte';
	import { accountData } from '$lib/stores';

	export let notebook: GetNotebookQuery['notebook_public_view'][0];

	$: beneficiary = notebook.beneficiary;
	$: orientationRequest =
		beneficiary?.orientationRequest?.length > 0 ? beneficiary.orientationRequest[0] : null;
	$: isMember = notebook.members.some((member) => member.account.id === $accountData.id);
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
		on:edit={() => alert('Not implemented!')}
		on:print={() => alert('Not implemented!')}
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
			<ProNotebookSocioProView notebook={notebook?.notebook} />
		</MainSection>
		<MainSection title="Plan d'action">
			<ProNotebookFocusView notebook={notebook?.notebook} focuses={notebook?.notebook?.focuses} />
		</MainSection>
	</div>
</div>
