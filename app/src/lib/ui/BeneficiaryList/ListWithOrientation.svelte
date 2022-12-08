<script lang="ts">
	import { type GetBeneficiariesQuery, RoleEnum } from '$lib/graphql/_gen/typed-document-nodes';
	import { formatDateLocale } from '$lib/utils/date';
	import { displayFullName } from '$lib/ui/format';
	import { accountData } from '$lib/stores';
	import { baseUrlForRole } from '$lib/routes';

	type Beneficiary = GetBeneficiariesQuery['beneficiaries'][0];

	export let beneficiaries: Beneficiary[];

	function getNotebookUrl(beneficiary: Beneficiary) {
		return beneficiary.notebook.members.some((member) => member.account.id === $accountData.id)
			? `${baseUrlForRole(RoleEnum.OrientationManager)}/carnets/edition/${beneficiary.notebook.id}`
			: `${baseUrlForRole(RoleEnum.OrientationManager)}/carnets/${beneficiary.notebook.id}`;
	}
</script>

<table class="w-full fr-table fr-table--layout-fixed">
	<caption class="sr-only">Liste des bénéficiaires</caption>
	<thead>
		<tr>
			<th class="text-left">Nom</th>
			<th class="text-left">Prénom</th>
			<th class="text-left">Type d'orientation</th>
			<th class="text-left">Chargé d'orientation</th>
			<th class="text-left">Référent unique</th>
			<th class="text-left">Orientation</th>
			<th class="text-left">Depuis le</th>
			<th class="!text-center">Voir le carnet</th>
		</tr>
	</thead>
	<tbody>
		{#each beneficiaries as beneficiary}
			{@const referents =
				beneficiary?.notebook.members.filter(
					(member) => member.account.type === RoleEnum.Professional
				) ?? []}
			{@const orientationManager = beneficiary?.notebook.members.filter(
				(member) => member.account.type === RoleEnum.OrientationManager
			)[0]}
			{@const referentLabel = [
				beneficiary.structures.length > 0 ? beneficiary.structures[0].structure.name : null,
				referents.length > 0 ? displayFullName(referents[0].account.professional) : null,
			]
				.filter((l) => l !== null)
				.join(' - ')}
			<tr>
				<td>{beneficiary.lastname}</td>
				<td>{beneficiary.firstname}</td>
				<td>
					<p class="fr-badge fr-badge--sm fr-badge--yellow-tournesol">
						{beneficiary.notebook?.notebookInfo?.orientationType?.label ?? 'À définir'}
					</p>
				</td>
				<td>
					<p class="fr-badge fr-badge--sm">
						{#if orientationManager}
							{displayFullName(orientationManager.account.orientation_manager)}
						{:else}
							Non assigné
						{/if}
					</p>
				</td>
				<td>
					<p
						class="fr-badge fr-badge--sm"
						class:fr-badge--purple-glycine={referentLabel.length === 0}
					>
						{referentLabel.length > 0 ? referentLabel : 'Non rattaché'}
					</p>
				</td>
				<td>{beneficiary.notebook.notebookInfo?.needOrientation ? 'à orienter' : 'orienté'}</td>
				<td>
					{#if beneficiary.notebook.members.length > 0}
						{formatDateLocale(beneficiary.notebook.members[0].createdAt)}
					{:else}
						-
					{/if}
				</td>
				<td class="!text-center">
					<a
						href={getNotebookUrl(beneficiary)}
						class="fr-link"
						title={`Voir le carnet de ${beneficiary.firstname} ${beneficiary.lastname}`}
					>
						<span class="fr-icon-file-line" aria-hidden />
					</a>
				</td>
			</tr>
		{/each}
		{#if beneficiaries.length === 0}
			<tr><td colspan="9">Aucun bénéficiaire.</td></tr>
		{/if}
	</tbody>
</table>
