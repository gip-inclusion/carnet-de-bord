<script lang="ts">
	import Breadcrumbs from '$lib/ui/base/Breadcrumbs.svelte';
	import { GetNotebookDocument, RoleEnum } from '$lib/graphql/_gen/typed-document-nodes';
	import ProNotebookSocioProUpdate from '$lib/ui/ProNotebookSocioPro/ProNotebookSocioProUpdate.svelte';
	import LoaderIndicator from '$lib/ui/utils/LoaderIndicator.svelte';
	import { operationStore, query } from '@urql/svelte';
	import { goto } from '$app/navigation';
	import { homeForRole } from '$lib/routes';
	import { displayFullName } from '$lib/ui/format';
	import { connectedUser } from '$lib/stores';

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
	$: situations = $getNotebook.data?.situations;

	$: notebookWithJobs = {
		...notebook,
		wantedJobs: notebook?.wantedJobs.map(({ rome_code }) => rome_code.id) || [],
	};

	$: options = notebook?.wantedJobs.map(({ rome_code }) => rome_code);

	import { Elm as DiagnosticEditElm } from '../../../../elm/DiagnosticEdit/Main.elm';
	import { afterUpdate } from 'svelte';

	let elmNode: HTMLElement;
	afterUpdate(() => {
		if (!elmNode) return;

		const app = DiagnosticEditElm.DiagnosticEdit.Main.init({
			node: elmNode,
			flags: { situations },
		});

		app.ports.sendSelectedSituations.subscribe(function (message) {
			console.log(message);
		});
	});

	function goToNotebook() {
		goto(notebookPath);
	}
</script>

<LoaderIndicator result={$getNotebook}>
	<Breadcrumbs segments={breadcrumbs} />
	<div class="flex flex-col space-y-6">
		<ProNotebookSocioProUpdate notebook={notebookWithJobs} {options} onClose={goToNotebook}>
			<div class="elm-node">
				<!-- Elm app needs to be wrapped by a div to avoid navigation exceptions when unmounting -->
				<div bind:this={elmNode} />
			</div>
		</ProNotebookSocioProUpdate>
	</div>
</LoaderIndicator>
