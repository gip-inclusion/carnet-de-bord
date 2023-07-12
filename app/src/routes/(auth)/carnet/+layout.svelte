<script lang="ts">
	import type { MenuItem } from '$lib/types';
	import { accountData } from '$lib/stores';
	import { NPSRating } from '$lib/ui/NPSRating';
	import Footer from '$lib/ui/base/Footer.svelte';
	import Header from '$lib/ui/base/Header.svelte';
	import { operationStore, query } from '@urql/svelte';
	import Breadcrumbs from '$lib/ui/base/Breadcrumbs.svelte';
	import LoaderIndicator from '$lib/ui/utils/LoaderIndicator.svelte';
	import { GetNotebookBreadcrumbDocument, RoleEnum } from '$lib/graphql/_gen/typed-document-nodes';
	import { homeForRole, type Segment } from '$lib/routes';
	import { connectedUser } from '$lib/stores';
	import { displayFullName } from '$lib/ui/format';
	import { page } from '$app/stores';
	const menuItems: MenuItem[] = [
		{
			id: 'accueil',
			path: homeForRole($accountData.type),
			label: 'Accueil',
		},
	];

	const getNotebookBreadcrumb = operationStore(GetNotebookBreadcrumbDocument, {
		notebookId: $page.data.notebookId,
	});

	query(getNotebookBreadcrumb);

	$: beneficiary = $getNotebookBreadcrumb.data?.notebook.beneficiary;
	$: structureId = beneficiary?.structures[0].structureId;
	$: breadcrumbs = getBreadcrumbForRole($connectedUser.role, $page.data.notebookId, structureId);

	function getNotebookUrlForRole(role: string, notebookId: string, structureId?: string): string {
		switch (role) {
			case RoleEnum.Professional:
				return `${homeForRole(role)}/carnet/${notebookId}`;
			case RoleEnum.AdminStructure:
				return `${homeForRole(role)}/${structureId}/carnets/${notebookId}`;
			case RoleEnum.Manager:
				return `${homeForRole(role)}/carnets/${notebookId}`;
			case RoleEnum.OrientationManager:
				return `${homeForRole(role)}/carnets/edition/${notebookId}`;
			default:
				return '';
		}
	}

	function getBreadcrumbForRole(role: string, notebookId: string, structureId?: string): Segment[] {
		return [
			{
				name: 'notebook',
				path: getNotebookUrlForRole(role, notebookId, structureId),
				label: `Carnet de ${displayFullName(beneficiary)}`,
			},
			{ name: 'diagnostic', label: 'Diagnostic France Travail' },
		];
	}
</script>

<Header {menuItems} />

<LoaderIndicator result={$getNotebookBreadcrumb}>
	<div class="fr-container fr-pb-6w fr-px-2w">
		<Breadcrumbs segments={breadcrumbs} />
		<div class="flex flex-col gap-8">
			<slot />
		</div>
		<NPSRating />
	</div>
</LoaderIndicator>
<Footer />
