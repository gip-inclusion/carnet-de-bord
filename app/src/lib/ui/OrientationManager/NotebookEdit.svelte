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

	export let notebook: GetNotebookQuery['notebook'];

	$: beneficiary = notebook.beneficiary;
	$: orientationRequest =
		beneficiary?.orientationRequest?.length > 0 ? beneficiary.orientationRequest[0] : null;
</script>

<svelte:head>
	<title>Carnet de {displayFullName(notebook.beneficiary)} - Carnet de bord</title>
</svelte:head>

<div class="fr-py-6w flex flex-col gap-8">
	{#if orientationRequest && !orientationRequest?.decidedAt}
		<OrientationRequestBanner {orientationRequest} />
	{:else}
		<OrientationHeader {notebook} />
	{/if}
	<ProNotebookPersonalInfoView
		beneficiary={notebook.beneficiary}
		on:edit={() => alert('Not implemented!')}
		on:print={() => alert('Not implemented!')}
		lastUpdateDate={notebook.members[0]?.lastModifiedAt}
		lastUpdateFrom={notebook.members[0]?.account?.professional ||
			notebook.members[0]?.account?.orientation_manager}
	/>
	<div>
		<MainSection title="Situation socioprofessionnelle">
			<ProNotebookSocioProView {notebook} />
		</MainSection>
		<MainSection title="Groupe de suivi">
			<ProNotebookMembersView
				members={notebook.members}
				notebookId={notebook.id}
				beneficiaryFirstname={notebook.beneficiary.firstname}
				beneficiaryLastname={notebook.beneficiary.lastname}
				appointments={notebook?.appointments}
			/>
		</MainSection>
		<MainSection title="Plan d'action">
			<ProNotebookFocusView {notebook} focuses={notebook.focuses} />
		</MainSection>
	</div>
</div>
