<script lang="ts">
	import { contractTypeFullKeys } from '$lib/constants/keys';
	import {
		type GetNotebookQuery,
		UpdateNotebookContractDocument,
	} from '$lib/graphql/_gen/typed-document-nodes';
	import { openComponent } from '$lib/stores';
	import { trackEvent } from '$lib/tracking/matomo';
	import { Button } from '$lib/ui/base';
	import { mutation, operationStore } from '@urql/svelte';
	import { formatDateISO } from '$lib/utils/date';
	import { add } from 'date-fns';
	import {
		type ProNotebookContractInput,
		proNotebookContractSchema,
	} from './ProNotebookContract.schema';
	import { Form, Input, Radio } from '$lib/ui/forms';
	import { captureException } from '$lib/utils/sentry';

	export let notebook: GetNotebookQuery['notebook_public_view'][0]['notebook'];

	const updateNotebookContractStore = operationStore(UpdateNotebookContractDocument);
	const updateNotebookContract = mutation(updateNotebookContractStore);

	function initFormData() {
		return {
			contractType: notebook.contractType || null,
			contractSignDate: notebook.contractSignDate || null,
			contractStartDate: notebook.contractStartDate || null,
			contractEndDate: notebook.contractEndDate || null,
		};
	}

	const initialValues = initFormData();

	function close() {
		openComponent.close();
	}

	async function saveContract(values: ProNotebookContractInput) {
		trackEvent('pro', 'notebook', `update contract type`);

		let payload = { id: notebook.id, ...values };
		if (values.contractType === 'no') {
			payload = {
				id: notebook.id,
				contractType: values.contractType,
				contractSignDate: null,
				contractStartDate: null,
				contractEndDate: null,
			};
		}
		await updateNotebookContract(payload);
		close();
	}

	function handleContractChange(
		event: Event,
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		updateValidateField: (filed: string, value: any) => void,
		handleReset: () => void
	) {
		const target = event.target as HTMLInputElement;
		updateValidateField('contractType', target.value);
		handleReset();
	}

	function setContractEndDate(initialDate: unknown, monthInterval: number) {
		if (
			typeof initialDate !== 'string' &&
			typeof initialDate !== 'number' &&
			!(initialDate instanceof Date)
		) {
			captureException(
				new Error(
					`[setContractEndDate] Une date était attendue mais la sélection reçue est ${JSON.stringify(
						initialDate
					)}.`
				)
			);
			return initialDate;
		}
		if (monthInterval) {
			return formatDateISO(add(new Date(initialDate), { months: monthInterval }));
		}
		return initialDate;
	}
</script>

<section>
	<h1>Type de contrat</h1>
	<Form
		{initialValues}
		validationSchema={proNotebookContractSchema}
		onSubmit={saveContract}
		let:form
		let:updateValidateField
		let:handleReset
		let:isSubmitted
		let:isSubmitting
		let:isValid
	>
		<Radio
			legend={'Veuillez sélectionner le type de contrat.'}
			name="contractType"
			required
			on:change={(e) => handleContractChange(e, updateValidateField, handleReset)}
			options={contractTypeFullKeys.options}
		/>
		{#if form.contractType !== 'no'}
			<div class="row-auto mb-10">
				<Input name="contractSignDate" type="date" inputLabel="Date de signature" required />
			</div>

			<div class="row-auto mb-10">
				<div class="grid grid-cols-2 gap-4">
					<div>
						<Input name="contractStartDate" inputLabel="Début du contrat" type="date" required />
					</div>
					<div class="w-full">
						<Input class="mb-0" name="contractEndDate" inputLabel="Fin du contrat" type="date" />
						<div class="col-end-3 italic text-xs mt-1 text-vert-cdb-500">
							<span>Durée : </span>
							<button
								id="3-months"
								aria-controls="contract-end-date"
								aria-label="Définir la fin du contrat dans 3 mois"
								type="button"
								class="cursor-pointer underline"
								on:click={() => {
									updateValidateField(
										'contractEndDate',
										setContractEndDate(form.contractStartDate, 3)
									);
								}}>3 mois</button
							>
							-
							<button
								id="6-months"
								aria-controls="contract-end-date"
								aria-label="Définir la fin du contrat dans 6 mois"
								type="button"
								class="cursor-pointer underline"
								on:click={() => {
									updateValidateField(
										'contractEndDate',
										setContractEndDate(form.contractStartDate, 6)
									);
								}}>6 mois</button
							>
							-
							<button
								id="12-months"
								aria-controls="contract-end-date"
								aria-label="Définir la fin du contrat dans 12 mois"
								type="button"
								class="cursor-pointer underline"
								on:click={() => {
									updateValidateField(
										'contractEndDate',
										setContractEndDate(form.contractStartDate, 12)
									);
								}}>12 mois</button
							>
							-
							<button
								id="24-months"
								aria-controls="contract-end-date"
								aria-label="Définir la fin du contrat dans 24 mois"
								type="button"
								class="cursor-pointer underline"
								on:click={() => {
									updateValidateField(
										'contractEndDate',
										setContractEndDate(form.contractStartDate, 24)
									);
								}}>24 mois</button
							>
							-
							<button
								id="undetermined"
								aria-controls="contract-end-date"
								aria-label="Définir comme contrat à durée indéterminée"
								type="button"
								class="cursor-pointer underline"
								on:click={() => {
									updateValidateField('contractEndDate', null);
								}}>indéterminée</button
							>
						</div>
					</div>
				</div>
			</div>
		{/if}
		<div class="flex flex-row gap-6">
			<Button type="submit" disabled={isSubmitting || (isSubmitted && !isValid)}>Enregistrer</Button
			>
			<Button outline on:click={close}>Annuler</Button>
		</div>
	</Form>
</section>
