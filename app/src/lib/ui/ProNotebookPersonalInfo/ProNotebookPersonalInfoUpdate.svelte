<script lang="ts">
	import { UpdateBeneficiaryPersonalInfoDocument } from '$lib/graphql/_gen/typed-document-nodes';
	import { accountData, openComponent } from '$lib/stores';
	import { mutation, operationStore } from '@urql/svelte';
	import type { BeneficiaryAccountInput } from '$lib/ui/ProBeneficiaryUpdate/beneficiary.schema';
	import { trackEvent } from '$lib/tracking/matomo';

	import ProNotebookPersonalInfoUpdateView, {
		type FormBeneficiary,
	} from './ProNotebookPersonalInfoUpdateView.svelte';

	export let beneficiary: FormBeneficiary;
	export let canEditDetailedInfo = false;

	const update = mutation(operationStore(UpdateBeneficiaryPersonalInfoDocument));

	const onSubmit = async (isPartialUpdate: boolean, values: BeneficiaryAccountInput) => {
		const partialUpdatePayload = isPartialUpdate
			? {
					...values,
					firstname: undefined,
					lastname: undefined,
					dateOfBirth: undefined,
					nir: undefined,
			  }
			: { ...values };

		const payload = canEditDetailedInfo
			? { ...partialUpdatePayload }
			: {
					...partialUpdatePayload,
					peNumber: undefined,
					cafNumber: undefined,
					rightAre: undefined,
					rightAss: undefined,
					rightBonus: undefined,
					rightRsa: undefined,
			  };
		trackEvent('pro', 'notebook', 'update personnal info');

		await update({
			id: beneficiary.id,
			accountId: $accountData.id,
			payload,
		});
		openComponent.close();
	};
</script>

<ProNotebookPersonalInfoUpdateView
	{beneficiary}
	role={$accountData.type}
	{onSubmit}
	onCancel={openComponent.close}
	{canEditDetailedInfo}
/>
