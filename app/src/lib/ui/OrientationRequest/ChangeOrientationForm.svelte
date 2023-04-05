<script lang="ts">
	import { token } from '$lib/stores';
	import { openComponent } from '$lib/stores';
	import { postApiJson } from '$lib/utils/post';
	import OrientationForm, {
		type OrientationValidationSchema,
	} from '../OrientationManager/OrientationForm.svelte';
	import { captureException } from '$lib/utils/sentry';

	type Notebook = {
		id: string;
		beneficiaryId: string;
		notebookInfo: { needOrientation: boolean } | undefined;
	};

	export let notebooks: Notebook[];
	export let onBeneficiaryOrientationChanged: () => void;
	export let orientationRequestId: string | undefined = undefined;
	export let structureId: string = null;

	let displayError = false;
	const formTitle =
		notebooks.length == 1 && notebooks[0].notebookInfo?.needOrientation ? 'Orienter' : 'Réorienter';

	async function handleSubmit(values: OrientationValidationSchema) {
		for (const notebook of notebooks) {
			try {
				await changeBeneficiaryOrientation(notebook, values);
			} catch (err) {
				console.error(err);
				captureException(err);
				displayError = true;
				return;
			}
		}
		onBeneficiaryOrientationChanged();
		openComponent.close();
	}

	async function changeBeneficiaryOrientation(
		notebook: Notebook,
		values: OrientationValidationSchema
	) {
		return postApiJson(
			'/v1/orientations/change',
			{
				orientation_request_id: orientationRequestId,
				orientation_system_id: values.orientationSystemId,
				notebook_id: notebook.id,
				structure_id: values.structureId,
				new_referent_account_id: values.professionalAccountId,
				orientation_reason: values.orientationReason,
			},
			{ 'jwt-token': $token }
		);
	}
</script>

<OrientationForm {handleSubmit} {displayError} {formTitle} {structureId} />
