<script lang="ts">
	import { type GetBeneficiariesQuery, RoleEnum } from '$lib/graphql/_gen/typed-document-nodes';
	import { formatDateLocale } from '$lib/utils/date';
	import { displayFullName } from '$lib/ui/format';
	import { openComponent } from '$lib/stores';
	import { pluralize } from '$lib/helpers';
	import { getContext } from 'svelte';
	import { type SelectionStore, selectionContextKey } from './MultipageSelectionStore';
	import ChangeOrientationForm from '$lib/ui/OrientationRequest/ChangeOrientationForm.svelte';
	import { createEventDispatcher } from 'svelte';
	import { isOriented } from '$lib/models/Orientation';

	type Beneficiary = GetBeneficiariesQuery['beneficiaries'][0];

	export let beneficiaries: Beneficiary[];

	const dispatch = createEventDispatcher();

	function onBeneficiaryOrientationChanged() {
		dispatch('beneficiary-orientation-changed');
	}

	function openEditLayer(beneficiary: Beneficiary) {
		openComponent.open({
			component: ChangeOrientationForm,
			props: {
				notebooks: [
					{
						id: beneficiary.notebook.id,
						beneficiaryId: beneficiary.id,
						isOriented: isOriented(beneficiary),
					},
				],
				onBeneficiaryOrientationChanged,
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
			<th class="text-left">Date de naissance</th>
			<th class="text-left">Dispositif</th>
			<th class="text-left">Structure</th>
			<th class="text-left">Référent unique</th>
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
							<span class="sr-only">Sélectionner {displayFullName(beneficiary)}</span>
						</label>
					</div>
				</td>
				<td>{beneficiary.lastname}</td>
				<td>{beneficiary.firstname}</td>
				<td>{formatDateLocale(beneficiary.dateOfBirth)}</td>
				<td>{beneficiary.notebook.notebookInfo?.orientationSystem?.name ?? ''}</td>
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
						<button class="fr-tag fr-tag-sm" on:click={() => openEditLayer(beneficiary)}>
							{displayFullName(referents[0].account?.professional)}
						</button>
						{#if referents.length > 1}
							<span>
								et {referents.length - 1}
								{pluralize('référent', referents.length - 1)}
							</span>
						{/if}
					{:else}
						<button
							class="fr-tag fr-tag-sm fr-tag--purple-glycine"
							on:click={() => openEditLayer(beneficiary)}
						>
							Non rattaché
						</button>
					{/if}
				</td>
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
			<tr><td colspan="10">Aucun bénéficiaire.</td></tr>
		{/if}
	</tbody>
</table>
