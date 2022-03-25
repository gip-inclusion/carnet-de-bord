<script lang="ts">
	import type { GetBeneficiariesQuery } from '$lib/graphql/_gen/typed-document-nodes';
	import { formatDateISO } from '$lib/utils/date';
	import type { OperationStore } from '@urql/svelte';
	import { displayFullName } from '$lib/ui/format';
	import { openComponent } from '$lib/stores';
	import AddProfessionnalForm from './AddProfessionnalForm.svelte';
	import { pluralize } from '$lib/helpers';

	export let beneficiaries: OperationStore<GetBeneficiariesQuery>['data']['beneficiaries'];
	export let hideStructure = false;
	function openEditLayer(
		beneficiary: OperationStore<GetBeneficiariesQuery>['data']['beneficiaries'][0]
	) {
		openComponent.open({
			component: AddProfessionnalForm,
			props: {
				notebookId: beneficiary.notebook.id,
				structuresId: beneficiary.structures.map(({ structure }) => structure.id),
				member: beneficiary.notebook.members[0] ?? null,
			},
		});
	}
</script>

<table class="w-full fr-table fr-table--layout-fixed">
	<caption class="sr-only">Liste des bénéficiaires</caption>
	<thead>
		<tr>
			<th class="text-left">Nom</th>
			<th class="text-left">Prénom</th>
			{#if !hideStructure}<th class="text-left">Structure</th>{/if}
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
				{#if !hideStructure}
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
				{/if}
				<td>
					{#if beneficiary.notebook.members.length > 0}
						<button class="fr-tag fr-tag-sm" on:click={() => openEditLayer(beneficiary)}>
							{displayFullName(beneficiary.notebook.members[0].professional)}
						</button>
						{#if beneficiary.notebook.members.length > 1}
							<span>
								et {beneficiary.notebook.members.length - 1}
								{pluralize('référent', beneficiary.notebook.members.length - 1)}
							</span>
						{/if}
					{:else}
						<button
							href="#"
							class="fr-tag fr-tag-sm fr-tag--purple-glycine"
							on:click={() => openEditLayer(beneficiary)}
						>
							Non rattaché
						</button>
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
