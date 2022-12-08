<script lang="ts">
	import { type GetBeneficiariesQuery, RoleEnum } from '$lib/graphql/_gen/typed-document-nodes';
	import { formatDateLocale } from '$lib/utils/date';
	import { displayFullName } from '$lib/ui/format';
	import { pluralize } from '$lib/helpers';

	type Beneficiary = GetBeneficiariesQuery['beneficiaries'][0];

	export let beneficiaries: Beneficiary[];
</script>

<table class="w-full fr-table fr-table--layout-fixed">
	<caption class="sr-only">Liste des bénéficiaires</caption>
	<thead>
		<tr>
			<th class="text-left">Nom</th>
			<th class="text-left">Prénom</th>
			<th class="text-left">Date de naissance</th>
			<th class="text-left">Structure</th>
			<th class="text-left">Référent unique</th>
			<th class="text-left">Orientation</th>
			<th class="text-left">Depuis le</th>
			<th class="!text-center">Voir le carnet</th>
		</tr>
	</thead>
	<tbody>
		{#each beneficiaries as beneficiary}
			{@const referents = beneficiary.notebook.members.filter(
				(member) => member.account.type === RoleEnum.Professional
			)}
			<tr>
				<td>{beneficiary.lastname}</td>
				<td>{beneficiary.firstname}</td>
				<td>{formatDateLocale(beneficiary.dateOfBirth)}</td>
				<td>
					{#if beneficiary.structures.length > 0}
						{beneficiary.structures[0].structure.name}
						{#if beneficiary.structures.length > 1}
							<span>
								et {beneficiary.structures.length - 1}
								{pluralize('structure', beneficiary.structures.length - 1)}
							</span>
						{/if}
					{:else}
						-
					{/if}
				</td>
				<td>
					{#if referents.length > 0}
						<p class="fr-badge fr-badge--sm">
							{displayFullName(referents[0].account?.professional)}
						</p>
						{#if referents.length > 1}
							<span>
								et {referents.length - 1}
								{pluralize('référent', referents.length - 1)}
							</span>
						{/if}
					{:else}
						<p class="fr-badge fr-badge--sm fr-badge--purple-glycine">Non rattaché</p>
					{/if}
				</td>
				<td>{beneficiary.notebook.notebookInfo?.needOrientation ? 'à orienter' : 'orienté'}</td>
				<td>
					{#if beneficiary.notebook.members.length > 0}
						{formatDateLocale(beneficiary.notebook?.members[0].createdAt)}
					{:else}
						-
					{/if}
				</td>
				<td class="!text-center">
					<a
						href={`carnets/${beneficiary.notebook.id}`}
						class="fr-link"
						target="_blank"
						rel="noreferrer"
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
