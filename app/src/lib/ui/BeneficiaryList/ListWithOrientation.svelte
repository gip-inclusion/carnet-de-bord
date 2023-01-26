<script lang="ts">
	import {
		RoleEnum,
		GetBeneficiariesWithOrientationRequestQuery,
	} from '$lib/graphql/_gen/typed-document-nodes';
	import { formatDateLocale } from '$lib/utils/date';
	import { displayFullName } from '$lib/ui/format';
	import { accountData, openComponent } from '$lib/stores';
	import { getContext } from 'svelte';
	import { type SelectionStore, selectionContextKey } from './MultipageSelectionStore';
	import AddOrientationManagerForm from './AddOrientationManagerForm.svelte';
	import { baseUrlForRole } from '$lib/routes';
	import ChangeOrientationForm from '$lib/ui/OrientationRequest/ChangeOrientationForm.svelte';
	import { createEventDispatcher } from 'svelte';
	import Dialog from '../Dialog.svelte';
	import Text from '../utils/Text.svelte';
	import { getOrientationSystemLabel } from '$lib/utils/getOrientationSystemLabel';

	type Beneficiary = GetBeneficiariesWithOrientationRequestQuery['beneficiaries'][0];

	export let beneficiaries: Beneficiary[];

	const dispatch = createEventDispatcher();

	function onBeneficiaryOrientationChanged() {
		dispatch('beneficiary-orientation-changed');
	}

	function openEditLayer(beneficiary: Beneficiary) {
		openComponent.open({
			component: ChangeOrientationForm,
			props: {
				notebooks: [{ id: beneficiary.notebook.id, beneficiaryId: beneficiary.id }],
				onBeneficiaryOrientationChanged,
			},
		});
	}

	function openOrientationManagerLayer(beneficiary: Beneficiary) {
		openComponent.open({
			component: AddOrientationManagerForm,
			props: {
				notebooks: [{ notebookId: beneficiary.notebook.id, beneficiaryId: beneficiary.id }],
				member: beneficiary.notebook.orientationManager[0]?.account.id ?? null,
			},
		});
	}

	const selectionStore = getContext<SelectionStore<Beneficiary>>(selectionContextKey);

	function updateSelection(beneficiary: Beneficiary) {
		selectionStore.toggle(beneficiary.notebook.id, beneficiary);
	}
	function getNotebookUrl(beneficiary: Beneficiary) {
		return beneficiary.notebook.orientationManager.some(
			(member) => member.account.id === $accountData.id
		)
			? `${baseUrlForRole(RoleEnum.OrientationManager)}/carnets/edition/${beneficiary.notebook.id}`
			: `${baseUrlForRole(RoleEnum.OrientationManager)}/carnets/${beneficiary.notebook.id}`;
	}
</script>

<table class="w-full fr-table fr-table--layout-fixed">
	<caption class="sr-only">Liste des bénéficiaires</caption>
	<thead>
		<tr>
			<th />
			<th class="text-left">Nom Prénom</th>
			<th class="text-left">Ville</th>
			<th class="text-left">Chargé d'orientation</th>
			<th class="text-left">Référent unique</th>
			<th class="text-center">Demande de réorientation</th>
			<th class="!text-center">Voir le carnet</th>
		</tr>
	</thead>
	<tbody>
		{#each beneficiaries as beneficiary}
			{@const referents = beneficiary?.notebook.referent}
			{@const orientationManager = beneficiary?.notebook.orientationManager[0]}
			{@const orientationRequest = beneficiary?.orientationRequest[0]}
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
				<td>{beneficiary.lastname} {beneficiary.firstname}</td>
				<td>{beneficiary.city}</td>
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
							class="fr-tag fr-tag-sm fr-tag--purple-glycine"
							on:click={() => openEditLayer(beneficiary)}
						>
							Non rattaché
						</button>
					{/if}
				</td>

				<td class="text-center">
					{#if orientationRequest}
						<Dialog
							label={`Voir la demande de réorientation de ${displayFullName(beneficiary)}`}
							buttonLabel={null}
							title={`Demande de réorientation de ${displayFullName(beneficiary)}`}
							size={'large'}
							showButtons={false}
							buttonCssClasses="fr-btn--tertiary-no-outline fr-icon-message-2-line"
						>
							<p>
								Date de la demande&nbsp;: <b>
									{formatDateLocale(orientationRequest.createdAt)}
								</b>
							</p>
							<p>
								Nouvelle orientation :
								<span class="fr-badge fr-badge-sm fr-badge--blue-cumulus"
									>{getOrientationSystemLabel(orientationRequest.requestedOrientationSystem)}
								</span>
								{#if beneficiary.notebook?.notebookInfo?.orientationSystem}
									(orientation actuelle <span class="fr-badge fr-badge-sm fr-badge--grey"
										>{getOrientationSystemLabel(
											beneficiary.notebook?.notebookInfo.orientationSystem
										)}
									</span>
									)
								{/if}
							</p>
							<h2 class="fr-h4">Motif de la demande</h2>
							<div class="bg-gray-100 py-4">
								<p>
									<Text
										value={orientationRequest && orientationRequest.reason}
										defaultValue="Motif non saisi."
										defaultValueClassNames=" italic text-gray"
									/>
								</p>
							</div>
						</Dialog>
					{:else}
						--
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
			<tr><td colspan="10">Aucun bénéficiaire.</td></tr>
		{/if}
	</tbody>
</table>
