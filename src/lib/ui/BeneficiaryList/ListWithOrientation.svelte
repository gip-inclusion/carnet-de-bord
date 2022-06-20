<script lang="ts">
	import { GetBeneficiariesQuery, RoleEnum } from '$lib/graphql/_gen/typed-document-nodes';
	import { formatDateLocale } from '$lib/utils/date';
	import { displayFullName } from '$lib/ui/format';
	import { openComponent } from '$lib/stores';
	import { getContext } from 'svelte';
	import { selectionContextKey, SelectionStore } from './MultipageSelectionStore';
	import AddStructureProfessionnalForm from './AddStructureProfessionnalForm.svelte';
	import AddOrientationManagerForm from './AddOrientationManagerForm.svelte';
	import AddOrientationForm from './AddOrientationForm.svelte';

	type Beneficiary = GetBeneficiariesQuery['beneficiaries'][0];

	export let beneficiaries: Beneficiary[];

	function openEditLayer(beneficiary: Beneficiary) {
		openComponent.open({
			component: AddStructureProfessionnalForm,
			props: {
				notebooks: [{ notebookId: beneficiary.notebook.id, beneficiaryId: beneficiary.id }],
				member:
					beneficiary.notebook.members.filter(
						({ account }) => account.type === RoleEnum.Professional
					)[0]?.account.id ?? null,
				structuresId: [...new Set(beneficiary.structures.map(({ structure }) => structure.id))],
				showResetMembers: beneficiary.notebook.members.length > 0,
			},
		});
	}

	function openOrientationManagerLayer(beneficiary: Beneficiary) {
		openComponent.open({
			component: AddOrientationManagerForm,
			props: {
				notebooks: [{ notebookId: beneficiary.notebook.id, beneficiaryId: beneficiary.id }],
				member:
					beneficiary.notebook.members.filter(
						({ account }) => account.type === RoleEnum.OrientationManager
					)[0]?.account.id ?? null,
			},
		});
	}

	function openOrientationLayer(beneficiary: Beneficiary) {
		openComponent.open({
			component: AddOrientationForm,
			props: {
				notebooks: [{ notebookId: beneficiary.notebook.id, beneficiaryId: beneficiary.id }],
				orientation_type: beneficiary.beneficiaryInfo?.orientation_type.id ?? null,
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
			<th class="text-left">Orientation</th>
			<th class="text-left">Chargé d'orientation</th>
			<th class="text-left">Référent unique</th>
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
			<tr>
				<td class="align-middle">
					<div class={`fr-checkbox-group bottom-3 left-3`}>
						<input
							type="checkbox"
							checked={$selectionStore[beneficiary?.notebook.id] ? true : false}
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
				<td>
					{#if beneficiary.beneficiaryInfo}
						<button
							class="fr-tag fr-tag-sm  fr-tag--yellow-tournesol"
							on:click={() => openOrientationLayer(beneficiary)}
							>{beneficiary.beneficiaryInfo.orientation_type.label}
						</button>
					{:else}
						<button
							class="fr-tag fr-tag-sm  fr-tag--purple-glycine"
							on:click={() => openOrientationLayer(beneficiary)}
							>À orienter
						</button>
					{/if}
				</td>
				<td>
					{#if orientationManager}
						<button
							class="fr-tag fr-tag-sm"
							on:click={() => openOrientationManagerLayer(beneficiary)}
						>
							{displayFullName(orientationManager.account.orientation_manager)}
						</button>
					{:else}
						<button
							href="#"
							class="fr-tag fr-tag-sm fr-tag--purple-glycine"
							on:click={() => openOrientationManagerLayer(beneficiary)}
						>
							Non assigné
						</button>
					{/if}
				</td>
				<td>
					{#if referents.length > 0 || beneficiary.structures.length > 0}
						<button class="fr-tag fr-tag-sm" on:click={() => openEditLayer(beneficiary)}>
							{#if beneficiary.structures.length > 0}
								{beneficiary.structures[0].structure.name}
							{/if}

							{#if referents.length > 0}
								- {displayFullName(referents[0].account.professional)}
							{/if}
						</button>
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
						{formatDateLocale(beneficiary.notebook.members[0].createdAt)}
					{:else}
						-
					{/if}
				</td>
				<td class="!text-center">
					<!-- <a
						href={`carnets/${beneficiary.notebook.id}`}
						class="fr-link"
						target="_blank"
						title={`Voir le carnet de ${beneficiary.firstname} ${beneficiary.lastname}`}
					>
						<span class="fr-fi-file-line" aria-hidden />
					</a> -->
					<span class="fr-fi-file-line" aria-hidden aria-disabled="true" />
				</td>
			</tr>
		{/each}
		{#if beneficiaries.length === 0}
			<tr><td colspan="10">Aucun bénéficiaire.</td></tr>
		{/if}
	</tbody>
</table>
