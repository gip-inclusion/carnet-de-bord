<script lang="ts">
	import {
		BeneficiariesWithOrientationRequestDocument,
		RoleEnum,
	} from '$lib/graphql/_gen/typed-document-nodes';
	import { homeForRole } from '$lib/routes';
	import Breadcrumbs from '$lib/ui/base/Breadcrumbs.svelte';
	import { displayFullName } from '$lib/ui/format';
	import { formatDateLocale } from '$lib/utils/date';
	import { operationStore, query } from '@urql/svelte';
	import { LoaderIndicator, Text } from '$lib/ui/utils';
	import Dialog from '$lib/ui/Dialog.svelte';

	const breadcrumbs = [
		{
			name: 'accueil',
			path: homeForRole(RoleEnum.OrientationManager),
			label: 'Accueil',
		},
		{
			name: 'demandes',
			path: '',
			label: 'Demandes de réorientation',
		},
	];

	const result = operationStore(BeneficiariesWithOrientationRequestDocument, null, {
		additionalTypenames: [
			'notebook_member',
			'notebook_info',
			'beneficiary_structure',
			'orientation_request',
		],
		requestPolicy: 'network-only',
	});
	query(result);

	$: beneficiaries = $result?.data?.beneficiaries ?? [];
</script>

<svelte:head>
	<title>Liste des demandes de réorientation - Carnet de bord</title>
</svelte:head>
<Breadcrumbs segments={breadcrumbs} />
<h1>Demandes de réorientation</h1>
<LoaderIndicator {result}>
	<table class="w-full fr-table fr-table--layout-fixed">
		<caption class="sr-only">Liste des demandes de réorientation</caption>
		<thead>
			<tr>
				<th class="text-left">Reçu le</th>
				<th class="text-left">Nom & Prénom</th>
				<th class="text-left">Référent unique</th>
				<th class="text-left">Orientation actuelle</th>
				<th class="text-left">Orientation recommandée</th>
				<th class="text-left">Motif</th>
				<th class="text-left">Voir le carnet</th>
			</tr>
		</thead>
		<tbody>
			{#each beneficiaries as beneficiary}
				{@const referents = beneficiary.notebook.members.filter(
					(member) => member.account.type === RoleEnum.Professional
				)}
				{@const orientationRequest = beneficiary.orientationRequest[0]}
				<tr>
					<td>{formatDateLocale(orientationRequest.createdAt)}</td>
					<td>{displayFullName(beneficiary)}</td>
					<td>
						{#if referents.length > 0 || beneficiary.structures.length > 0}
							{#if beneficiary.structures.length > 0}
								{beneficiary.structures[0].structure.name}
							{/if}

							{#if referents.length > 0}
								- {displayFullName(referents[0].account.professional)}
							{/if}
						{:else}
							Non rattaché
						{/if}
					</td>
					<td>
						<div class="flex">
							<Text
								class="flex-auto"
								value={beneficiary.notebook.notebookInfo?.orientationSystem?.name}
							/>
							<span class="flex-none fr-icon-arrow-right-line text-france-blue" aria-hidden />
						</div>
					</td>
					<td>
						<Text
							class="fr-text--bold"
							value={orientationRequest.requestedOrientationSystem.name}
						/>
					</td>
					<td class="!text-center">
						{#if beneficiary.orientationRequest[0].reason}
							<Dialog
								label={`Motif de la demande de réorientation de ${displayFullName(beneficiary)}`}
								buttonLabel={null}
								title={`Motif de la demande de réorientation de ${displayFullName(beneficiary)}`}
								size={'large'}
								showButtons={false}
								buttonCssClasses="fr-btn--tertiary-no-outline fr-icon-message-2-line"
							>
								<Text value={beneficiary.orientationRequest[0].reason} />
							</Dialog>
						{:else}
							--
						{/if}
					</td>
					<td class="!text-center">
						<a
							href={`carnets/${beneficiary.notebook.id}`}
							class="fr-link"
							title={`Voir le carnet de ${beneficiary.firstname} ${beneficiary.lastname}`}
						>
							<span class="fr-icon-file-line" aria-hidden />
						</a>
					</td>
				</tr>
			{/each}
			{#if beneficiaries.length === 0}
				<tr><td class="text-center" colspan="7">Aucune demande.</td></tr>
			{/if}
		</tbody>
	</table>
</LoaderIndicator>
