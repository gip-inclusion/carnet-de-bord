<script lang="ts">
	import Breadcrumbs from '$lib/ui/base/Breadcrumbs.svelte';
	import { GetNotebookDocument, RoleEnum } from '$lib/graphql/_gen/typed-document-nodes';
	import ProNotebookSocioProUpdate from '$lib/ui/ProNotebookSocioPro/ProNotebookSocioProUpdate.svelte';
	import LoaderIndicator from '$lib/ui/utils/LoaderIndicator.svelte';
	import { operationStore, query } from '@urql/svelte';
	import { goto } from '$app/navigation';
	import { homeForRole } from '$lib/routes';
	import { displayFullName } from '$lib/ui/format';
	import { connectedUser, token, graphqlAPI } from '$lib/stores';
	import { afterUpdate } from 'svelte';
	import {
		Elm as DiagnosticEditElm,
		ProfessionalProjectOut,
	} from '../../../../elm/DiagnosticEdit/Main.elm';

	export let notebookId: string;
	$: notebookPath =
		$connectedUser.role === RoleEnum.Professional
			? `${homeForRole($connectedUser.role)}/carnet/${notebookId}`
			: `${homeForRole($connectedUser.role)}/carnets/edition/${notebookId}`;

	const getNotebook = operationStore(GetNotebookDocument, { id: notebookId });

	$: breadcrumbs = [
		{
			name: 'Carnet de ${displayFullName(beneficiary)}',
			path: notebookPath,
			label: `Carnet de ${displayFullName(beneficiary)}`,
		},
		{
			label: 'Édition du diagnostic socioprofessionnel',
		},
	];

	query(getNotebook);

	$: publicNotebook = $getNotebook.data?.notebook_public_view[0];
	$: notebook = publicNotebook?.notebook;
	$: beneficiary = publicNotebook?.beneficiary;
	$: refSituations = $getNotebook.data?.refSituations;

	let selectedSituations: string[] = [];
	$: professionalProjects =
		notebook?.professionalProjects?.map((professionalProject) => {
			return {
				id: professionalProject.id,
				mobilityRadius: professionalProject.mobilityRadius,
				romeId: professionalProject.rome_code.id,
			};
		}) ?? [];

	let elmNode: HTMLElement;
	afterUpdate(() => {
		if (!elmNode || !elmNode.parentNode) return;

		const app = DiagnosticEditElm.DiagnosticEdit.Main.init({
			node: elmNode,
			flags: {
				token: $token,
				serverUrl: $graphqlAPI,
				refSituations,
				situations: notebook.situations,
				professionalProjects: notebook.professionalProjects.map(
					({ id, createdAt, updatedAt, mobilityRadius, rome_code }) => ({
						id,
						createdAt,
						updatedAt,
						mobilityRadius,
						rome: rome_code,
					})
				),
			},
		});

		app.ports.sendSelectedSituations.subscribe((updatedSelection: string[]) => {
			selectedSituations = updatedSelection;
		});

		app.ports.sendUpdatedProfessionalProjects.subscribe(
			(updatedProfessionalProjects: ProfessionalProjectOut[]) => {
				console.log(updatedProfessionalProjects);
				professionalProjects = updatedProfessionalProjects;
			}
		);
	});

	function goToNotebook() {
		goto(notebookPath);
	}
</script>

<LoaderIndicator result={$getNotebook}>
	<Breadcrumbs segments={breadcrumbs} />
	<div class="flex flex-col space-y-6">
		<ProNotebookSocioProUpdate
			{notebook}
			{selectedSituations}
			{professionalProjects}
			onClose={goToNotebook}
		>
			{#key refSituations}
				<div class="elm-node">
					<!-- Elm app needs to be wrapped by a div to avoid navigation exceptions when unmounting -->
					<div bind:this={elmNode} />
				</div>
			{/key}
		</ProNotebookSocioProUpdate>
	</div>
</LoaderIndicator>

<style>
	/* this rules overrides the tailwind box shadow that mimic the outline on focus */
	:global(.elm-select input[type='text']) {
		box-shadow: none;
	}
</style>
