<script context="module" lang="ts">
	import type { GetStructureQueryStore } from '$lib/graphql/_gen/typed-document-nodes';
	import { GetStructureDocument } from '$lib/graphql/_gen/typed-document-nodes';
	import { homeForRole } from '$lib/routes';
	import { Breadcrumbs, Button, Card } from '$lib/ui/base';
	import { LoaderIndicator } from '$lib/ui/utils';
	import type { Load } from '@sveltejs/kit';
	import { operationStore, query } from '@urql/svelte';

	const professionnelIcon = '/images/professionnel.svg';
	const rattachementIcon = '/images/rattachement.svg';

	export const load: Load = ({ params }) => {
		const structureId = params.uuid;
		const getStructure = operationStore(GetStructureDocument, { structureId });

		return {
			props: {
				structureId,
				getStructure,
			},
		};
	};
</script>

<script lang="ts">
	import AdminStructureCard from '$lib/ui/AdminStructure/Card.svelte';
	import Tile from '$lib/ui/base/Tile.svelte';
	import Text from '$lib/ui/utils/Text.svelte';
	import Dialog from '$lib/ui/Dialog.svelte';
	import ProfessionalsImport from '$lib/ui/AdminStructure/ImportProfessionals.svelte';
	import ImportNotebookMembers from '$lib/ui/AdminStructure/ImportNotebookMembers.svelte';
	import { browser } from '$app/env';
	import { pluralize } from '$lib/helpers';
	import { openComponent } from '$lib/stores';
	import AddAdminStructureLayer from '$lib/ui/AdminStructure/AddAdminStructureLayer.svelte';

	export let structureId: string;
	export let getStructure: GetStructureQueryStore;

	query(getStructure);

	function refreshStore() {
		getStructure.reexecute({ requestPolicy: 'cache-and-network' });
	}
	$: beneficiaries = $getStructure.data?.beneficiaries?.aggregate?.count;
	$: structure = $getStructure.data?.structure_by_pk;
	$: members = structure?.admins_aggregate?.nodes?.map(({ admin_structure }) => admin_structure);
	$: professionals = structure?.professionals;

	$: breadcrumbs = [
		{
			name: 'accueil',
			path: homeForRole('admin_structure'),
			label: 'Accueil',
		},
		{
			name: 'structure',
			path: '',
			label: `${structure?.name ?? ''}`,
		},
	];
	$: metrics = [
		{
			label: pluralize('Professionnel', structure?.professionals_aggregate?.aggregate?.count ?? 0),
			amount: structure?.professionals_aggregate?.aggregate?.count ?? 0,
			link: `${structureId}/professionnels`,
		},
		{
			label: `${pluralize('Bénéficiaire', beneficiaries)} ${pluralize(
				'accompagné',
				beneficiaries
			)}`,
			amount: beneficiaries,
			link: `${structureId}/beneficiaires?filter=withMember`,
		},
		{
			label: `${pluralize(
				'Bénéficiaire',
				structure?.pendingBeneficiaries?.aggregate?.count ?? 0
			)} non ${pluralize('rattaché', structure?.pendingBeneficiaries?.aggregate?.count ?? 0)}`,
			amount: structure?.pendingBeneficiaries?.aggregate?.count ?? 0,
			classNames:
				structure?.pendingBeneficiaries?.aggregate?.count > 0
					? 'text-marianne-red'
					: 'text-success',
			link: `${structureId}/beneficiaires?filter=noMember`,
		},
	];

	function openCrisp() {
		if (browser && window.$crisp) {
			window.$crisp.push(['do', 'chat:open']);
		}
	}

	function openAddAdminLayer() {
		openComponent.open({
			component: AddAdminStructureLayer,
			props: { structureId, onClose: refreshStore },
		});
	}
</script>

<svelte:head>
	<title>Structure - Carnet de bord</title>
</svelte:head>

<Breadcrumbs segments={breadcrumbs} />
<LoaderIndicator result={getStructure}>
	<div class="flex flex-col gap-6">
		<div class="flex flex-row gap-4">
			<h1 class="fr-h2 grow">{structure.name}</h1>
			{#if browser && window.$crisp}
				<div class="flex flex-col gap-2">
					<span class="bold">Vous rencontrez des difficultés ?</span>
					<Button on:click={openCrisp} classNames="!bg-success">
						<span class="w-full text-center">Demander de l'aide</span>
					</Button>
				</div>
			{/if}
		</div>
		<div class="flex flex-row gap-6">
			<div>
				<h2 class="fr-h4 !text-france-blue">Coordonnées</h2>

				<div class="flex flex-col gap-1">
					<Text
						defaultValueClassNames="italic"
						defaultValue="Pas de numéro de téléphone"
						classNames="font-bold text-xl"
						value={structure?.phone}
					/>
					<Text
						defaultValueClassNames="italic"
						defaultValue="Pas d'adresse email"
						classNames="font-bold"
						value={structure?.email}
					/>
					{#each [structure?.address1, structure?.address2].filter( (field) => Boolean(field) ) as line}
						<Text value={line} />
					{/each}
					<Text
						value={[structure?.postalCode, structure?.city]
							.filter((field) => Boolean(field))
							.join(' ')}
					/>
					<Text
						defaultValueClassNames="italic"
						defaultValue="Pas de site web"
						value={structure?.website}
					/>
				</div>
			</div>
			<div class="grow">
				<h2 class="fr-h4 !text-france-blue">Portefeuille de la structure</h2>
				<div class="fr-grid-row fr-grid-row--gutters">
					{#each metrics as item (item.label)}
						<div class="fr-col-sm-6 fr-col-md-4 fr-col-lg-4">
							<Card horizontal={true} hideArrow={!item.link} href={item.link}>
								<div slot="title">
									<div
										class={`pb-1 flex flex-row font-bold text-3xl tracking-wider ${
											item.classNames || ''
										}`}
									>
										{item.amount}
									</div>
									<span class={`font-normal leading-6 text-sm ${item.classNames}`}
										>{item.label}</span
									>
								</div>
							</Card>
						</div>
					{/each}
				</div>
			</div>
		</div>
		<div>
			<h2 class="fr-h4 !text-france-blue">Actions</h2>
			<div class="fr-grid-row fr-grid-row--gutters">
				<div class="fr-col-12 fr-col-sm-6 fr-col-md-6 fr-col-lg-4">
					<Tile imageUrl={professionnelIcon}>
						<Dialog
							outlineButton={false}
							label="Importer des professionnels"
							title="Importer des professionnels"
							size={'large'}
							showButtons={false}
							buttonCssClasses="mw-200px"
							on:close={refreshStore}
						>
							<svelte:fragment slot="buttonLabel"
								>Importer une liste de professionnels</svelte:fragment
							>
							<ProfessionalsImport {structureId} />
						</Dialog>
					</Tile>
				</div>
				<div class="fr-col-12 fr-col-sm-6 fr-col-md-6 fr-col-lg-4">
					<Tile imageUrl={rattachementIcon}>
						<Dialog
							outlineButton={false}
							label="Rattacher des professionnels"
							title="Rattacher des professionnels"
							size={'large'}
							showButtons={false}
							buttonCssClasses="mw-200px"
						>
							<svelte:fragment slot="buttonLabel">
								Importer une liste de rattachement
							</svelte:fragment>
							<ImportNotebookMembers {professionals} />
						</Dialog>
					</Tile>
				</div>
			</div>
		</div>
		<div>
			<div class="flex flex-row gap-8 items-baseline mt-4">
				<h2 class="fr-h4 !text-france-blue">{pluralize('Gestionnaire', members.length)}</h2>
				<Button on:click={openAddAdminLayer} classNames="fr-btn--md">Ajouter un gestionnaire</Button
				>
			</div>
			<div class="fr-grid-row fr-grid-row--gutters">
				{#each members as member (member.id)}
					<div class="fr-col-6 fr-col-md-4">
						<AdminStructureCard adminStructure={member} />
					</div>
				{/each}
			</div>
		</div>
	</div>
</LoaderIndicator>
