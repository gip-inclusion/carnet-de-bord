<script lang="ts">
	import type { GetBeneficiariesQuery } from '$lib/graphql/_gen/typed-document-nodes';
	import { formatDateISO } from '$lib/utils/date';
	import { displayFullName } from '$lib/ui/format';
	import { openComponent } from '$lib/stores';
	import AddProfessionnalForm from './AddProfessionnalForm.svelte';
	import { pluralize } from '$lib/helpers';
	import { getContext } from 'svelte';
	import { selectionContextKey, SelectionStore } from './MultipageSelectionStore';

	type Beneficiary = GetBeneficiariesQuery['beneficiaries'][0];

	export let beneficiaries: Beneficiary[];
	export let hideStructure = false;
	export let showNotebook = false;

	function openEditLayer(beneficiary: Beneficiary) {
		openComponent.open({
			component: AddProfessionnalForm,
			props: {
				notebooks: [{ notebookId: beneficiary.notebook.id, beneficiaryId: beneficiary.id }],
				structuresId: beneficiary.structures.map(({ structure }) => structure.id),
				member: beneficiary.notebook.members[0]?.professional.id ?? null,
				showResetMembers: beneficiary.notebook.members.length > 0,
			},
		});
	}
	const selectionStore = getContext<SelectionStore<Beneficiary>>(selectionContextKey);

	function updateSelection(beneficiary: Beneficiary) {
		selectionStore.toggle(beneficiary.notebook.id, beneficiary);
	}
</script>

<table class="w-full fr-table fr-table--layout-fixed">
	<caption class="sr-only">Liste des bénéficiaires</caption>
	<thead>
		<tr>
			<th />
			<th class="text-left">Nom</th>
			<th class="text-left">Prénom</th>
			{#if !hideStructure}<th class="text-left">Structure</th>{/if}
			<th class="text-left"><span class="fr-tag no-bg">Suivi par</span></th>
			<th class="text-left">Depuis le</th>
			{#if showNotebook}<th class="!text-center">Voir le carnet</th>{/if}
		</tr>
	</thead>
	<tbody>
		{#each beneficiaries as beneficiary}
			<tr>
				<td class="align-middle">
					<div class={`fr-checkbox-group bottom-3 left-3`}>
						<input
							type="checkbox"
							checked={$selectionStore[beneficiary.notebook.id] ? true : false}
							on:change={() => updateSelection(beneficiary)}
							id={beneficiary.id}
							name="selection"
						/>
						<label class="fr-label" for={beneficiary.id}>
							<span class="sr-only"> Selectionner {displayFullName(beneficiary)}</span>
						</label>
					</div>
				</td>
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
				{#if showNotebook}<td class="!text-center">
						<a
							href={`carnets/${beneficiary.notebook.id}`}
							class="fr-link"
							target="_blank"
							title={`Voir le carnet de ${beneficiary.firstname} ${beneficiary.lastname}`}
						>
							<span class="fr-fi-file-line" aria-hidden />
						</a>
					</td>
				{/if}
			</tr>
		{/each}
		{#if beneficiaries.length === 0}
			<tr><td colspan="10">Aucun bénéficiaire.</td></tr>
		{/if}
	</tbody>
</table>
