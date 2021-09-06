<script context="module" lang="ts">
	import type { Beneficiary, NotebookMember } from '$lib/graphql/_gen/typed-document-nodes';
	import type { UpdateNotebookVisitDateMutationStore } from '$lib/graphql/_gen/typed-document-nodes';
	import { UpdateNotebookVisitDateDocument } from '$lib/graphql/_gen/typed-document-nodes';
	import { operationStore } from '@urql/svelte';
	import type { Load } from '@sveltejs/kit';

	export const load: Load = ({ page }) => {
		const id = page.params.uuid;
		const updateVisitDateResult = operationStore(UpdateNotebookVisitDateDocument, {
			beneficiaryId: id,
			notebookVisitDate: new Date()
		});
		return {
			props: {
				updateVisitDateResult
			}
		};
	};
</script>

<script lang="ts">
	import type { Option } from '$lib/ui/base/types';
	import LoaderIndicator from '$lib/ui/utils/LoaderIndicator.svelte';
	import { Button, Select, SearchBar, Table } from '$lib/ui/base';
	import Text from '$lib/ui/utils/Text.svelte';
	import { displayFullName, displayMobileNumber, displayFullAddress } from '$lib/ui/format';
	import { mutation } from '@urql/svelte';
	import { formatDate } from '$lib/utils/date';
	import { getLabels } from '$lib/utils/getLabels';
	import {
		cerObjectLabelValue,
		rightLabelValue,
		workSituationLabelValue
	} from '$lib/constants/LabelValues';

	export let updateVisitDateResult: UpdateNotebookVisitDateMutationStore;

	const updateVisitDate = mutation(updateVisitDateResult);
	updateVisitDate();

	$: notebook = $updateVisitDateResult.data?.update_notebook_member.returning[0].notebook;
	$: beneficiary = notebook?.beneficiary as Beneficiary;
	$: members = notebook?.members as NotebookMember[];
	$: member = members?.length ? members[0] : null;

	let search = '';
	let selectedPeriod: Option | null;
	let periodOptions = [];
	let selectedOrder: Option | null;
	let orderOptions = [];
</script>

<LoaderIndicator result={updateVisitDateResult}>
	<div class="flex flex-col space-y-8 px-40">
		<div class="flex flex-col space-y-2">
			<div class="flex flex-col">
				{#if member}
					<div class="mb-2">
						Informations mises à jour le {formatDate(member.notebookModificationDate)} par
						{member.professional.firstname}
						{member.professional.lastname}
					</div>
				{/if}
				<div>
					<h1 class="fr-h2 float-left bf-500">
						{displayFullName(beneficiary)}
					</h1>
					<div class="float-right align-middle">
						<Button
							disabled={true}
							on:click={() => alert('Not implemented!')}
							outline={true}
							icon="ri-printer-line"
						/>
						<Button
							disabled={true}
							on:click={() => alert('Not implemented!')}
							outline={true}
							icon="ri-edit-line"
						/>
					</div>
				</div>
				<div>Né le {beneficiary.dateOfBirth}</div>
			</div>
			<!-- extract Infos -->
			<div class="flex flex-row">
				<div class="flex flex-col w-7/12 space-y-4">
					<div class="w-full">
						<h3 class="text-lg bf-500 mb-none">{displayMobileNumber(beneficiary)}</h3>
						<div>{beneficiary.email}</div>
						<div>
							{displayFullAddress(beneficiary)}
						</div>
					</div>
					<div class="w-full">
						<h4 class="text-base mb-none">Identifiant Pôle emploi</h4>
						<div>{beneficiary.peNumber}</div>
					</div>
					<div class="w-full">
						<h4 class="text-base mb-none">Identifiant CAF</h4>
						<div>{beneficiary.cafNumber}</div>
					</div>
				</div>
				<div class="flex flex-col w-5/12 space-y-4">
					<div class="flex flex-row">
						<div class="w-full">
							<h3 class="text-lg bf-500 mb-none">Situation</h3>
							<Text
								value={getLabels(notebook.workSituations, workSituationLabelValue).join(', ')}
							/>
						</div>
						<div class="w-full">
							<h3 class="text-lg bf-500 mb-none">Sujet du CER</h3>
							<Text value={getLabels(notebook.cerObjects, cerObjectLabelValue).join(', ')} />
						</div>
					</div>
					<div class="flex flex-row">
						<div class="w-full">
							<h3 class="text-lg bf-500 mb-none">Mes droits</h3>
							<Text value={getLabels(notebook.rights, rightLabelValue).join(', ')} />
						</div>
					</div>
				</div>
			</div>
			<!-- extract Infos -->
		</div>
		<!-- extract Groupe de suivi -->
		<div class="flex flex-col">
			<h2 class="fr-h4 bf-500">Groupe de suivi</h2>
			<div class="flex flex-row w-full justify-between">
				<Button disabled={true} on:click={() => alert('Not implemented!')}
					>Ajouter un accompagnateur
				</Button>
				<SearchBar {search} size="md" inputHint="Nom, fonction, structure" />
			</div>
			<!-- @TODO find a way to make Table generically-typed; does not seem obvious -->
			<Table headers={[]} rows={[]} captionText="Groupe de suivi" captionPosition="none" />
		</div>
		<!-- extract Groupe de suivi -->
		<!-- extract Historique des démarches -->
		<div class="flex flex-col">
			<h2 class="fr-h4 bf-500">Historique des démarches</h2>
			<div class="flex flex-row w-full justify-between">
				<Button disabled={true} on:click={() => alert('Not implemented!')}
					>Ajouter une étape
				</Button>
				<div class="flex flex-row justify-between space-x-4">
					<Select
						disabled={true}
						selected={selectedPeriod}
						options={periodOptions}
						selectLabel=""
						selectHint="Sélectionner une période"
					/>
					<Select
						disabled={true}
						selected={selectedOrder}
						options={orderOptions}
						selectLabel=""
						selectHint="Sélectionner un tri"
					/>
				</div>
			</div>
		</div>
		<!-- extract Historique des démarches -->
	</div>
</LoaderIndicator>

<style lang="postcss">
	.bf-500 {
		color: var(--bf500);
	}

	.mb-none {
		margin-bottom: 0 !important;
	}
</style>
