<script lang="ts">
	import type { GetBeneficiariesQuery } from '$lib/graphql/_gen/typed-document-nodes';
	import { formatDateISO } from '$lib/utils/date';
	import type { OperationStore } from '@urql/svelte';
	import { displayFullName } from '$lib/ui/format';

	export let beneficiaries: OperationStore<GetBeneficiariesQuery>['data']['beneficiaries'];
</script>

<table class="w-full fr-table fr-table--layout-fixed">
	<caption class="sr-only">Liste des bénéficiaires</caption>
	<thead>
		<tr>
			<th class="text-left">Nom</th>
			<th class="text-left">Prénom</th>
			<th class="text-left">Structure</th>
			<th class="text-left"><span class="fr-tag no-bg">Suivi par</span></th>
			<th class="text-left">Depuis le</th>
			<th class="text-center">
				<!-- Voir le carnet -->
			</th>
		</tr>
	</thead>
	<tbody>
		{#each beneficiaries as beneficiary}
			<tr>
				<td>{beneficiary.lastname}</td>
				<td>{beneficiary.firstname}</td>
				<td>
					{#if beneficiary.structures.length > 0}
						{beneficiary.structures[0].structure.name}
					{:else}
						-
					{/if}
				</td>
				<td>
					{#if beneficiary.notebook.members.length > 0}
						<span class="fr-tag bg-transparent">
							{displayFullName(beneficiary.notebook.members[0].professional)}
						</span>
					{:else}
						<span class="fr-tag bg-marianne-red text-white"> Non rattaché </span>
					{/if}
				</td>
				<td>
					{#if beneficiary.notebook.members.length > 0}
						{formatDateISO(new Date(beneficiary.notebook?.members[0].createdAt))}
					{:else}
						-
					{/if}
				</td>
				<td />
			</tr>
		{/each}
		{#if beneficiaries.length === 0}
			<tr><td colspan="10">Aucun bénéficiaire.</td></tr>
		{/if}
	</tbody>
</table>
