<script lang="ts">
	import { contractTypeFullKeys } from '$lib/constants/keys';
	import {
		GetNotebookQuery,
		UpdateNotebookContractDocument,
	} from '$lib/graphql/_gen/typed-document-nodes';
	import { openComponent } from '$lib/stores';
	import { trackEvent } from '$lib/tracking/matomo';
	import { Button, Input, Radio } from '$lib/ui/base';
	import { mutation, operationStore } from '@urql/svelte';
	import { formatDateISO } from '$lib/utils/date';
	import { add } from 'date-fns';

	export let notebook: GetNotebookQuery['notebook'];

	const updateNotebookContractStore = operationStore(UpdateNotebookContractDocument);
	const updateNotebookContract = mutation(updateNotebookContractStore);

	function initFormData() {
		return {
			contractType: notebook.contractType,
			contractSignDate: notebook.contractSignDate,
			contractStartDate: notebook.contractStartDate,
			contractEndDate: notebook.contractEndDate,
		};
	}

	const formData = initFormData();

	function close() {
		openComponent.close();
	}

	function onChange(event: CustomEvent<{ value: string }>): void {
		if ('no' == event.detail.value) {
			formData.contractSignDate = null;
			formData.contractStartDate = null;
			formData.contractEndDate = null;
		}
	}

	async function saveContract() {
		trackEvent('pro', 'notebook', `update contract type`);
		sanitizeInputs();
		await updateNotebookContract({
			id: notebook.id,
			...formData,
		});
		close();
	}

	$: isContract = 'no' !== formData.contractType;

	function setContractEndDate(monthInterval: number) {
		let newDate = null;
		if (monthInterval) {
			newDate = formatDateISO(add(new Date(formData.contractStartDate), { months: monthInterval }));
		}
		formData.contractEndDate = newDate;
	}

	function sanitizeInputs() {
		formData.contractStartDate =
			formData.contractStartDate === '' ? null : formData.contractStartDate;
		formData.contractEndDate = formData.contractEndDate === '' ? null : formData.contractEndDate;
	}

	function updateEndDate() {
		if (!formData.contractStartDate) {
			formData.contractEndDate = null;
		}
	}
</script>

<section>
	<h1>Type de contrat</h1>
	<form on:submit|preventDefault={saveContract}>
		<Radio
			caption={'Veuillez sélectionner le type de contrat.'}
			bind:selected={formData.contractType}
			options={contractTypeFullKeys.options}
			on:input={onChange}
		/>
		{#if isContract}
			<div class="row-auto mb-10">
				<Input
					bind:value={formData.contractSignDate}
					inputLabel="Date de signature"
					type="date"
					required={true}
				/>
			</div>

			<div class="row-auto mb-10">
				<div class="grid grid-cols-2 gap-4">
					<div>
						<Input
							bind:value={formData.contractStartDate}
							inputLabel="Début du contrat"
							type="date"
							on:change={updateEndDate}
							required={true}
						/>
					</div>
					<div class={`w-full ${formData.contractStartDate ? '' : 'invisible'}`}>
						<Input
							class="mb-0"
							bind:value={formData.contractEndDate}
							inputLabel="Fin du contrat"
							type="date"
							min={formData.contractStartDate}
							error={formData.contractEndDate &&
							formData.contractEndDate < formData.contractStartDate
								? 'La date de fin est antérieure à la date de deébut'
								: null}
						/>
						<div class="col-end-3 italic text-xs mt-1 text-france-blue-500">
							<span>Durée : </span>
							<button
								type="button"
								class="cursor-pointer underline"
								on:click={() => setContractEndDate(3)}>3 mois</button
							>
							-
							<button
								type="button"
								class="cursor-pointer underline"
								on:click={() => setContractEndDate(6)}>6 mois</button
							>
							-
							<button
								type="button"
								class="cursor-pointer underline"
								on:click={() => setContractEndDate(12)}>12 mois</button
							>
							-
							<button
								type="button"
								class="cursor-pointer underline"
								on:click={() => setContractEndDate(null)}>indéterminée</button
							>
						</div>
					</div>
				</div>
			</div>
		{/if}
		<div class="flex flex-row gap-6">
			<Button type="submit">Enregistrer</Button>
			<Button outline={true} on:click={close}>Annuler</Button>
		</div>
	</form>
</section>
