<script lang="ts">
	import type {
		GetNotebookByBeneficiaryIdQuery,
		GetNotebookQuery,
	} from '$lib/graphql/_gen/typed-document-nodes';
	import { token } from '$lib/stores';
	import { openComponent } from '$lib/stores';
	import { postApiJson } from '$lib/utils/post';
	import OrientationForm, {
		type OrientationValidationSchema,
	} from '../OrientationManager/OrientationForm.svelte';
	import { captureException } from '$lib/utils/sentry';

	export let notebook:
		| GetNotebookByBeneficiaryIdQuery['notebook'][0]
		| GetNotebookQuery['notebook_public_view'][0]['notebook'];
	export let onBeneficiaryOrientationChanged: () => void;
	export let orientationRequestId: string | undefined;

	let displayError = false;
	const formTitle = notebook.notebookInfo?.needOrientation ? 'Orienter' : 'Réorienter';

	let potential_referent = notebook.members.filter((member) => member.memberType == 'referent');
	let referent_id =
		potential_referent.length > 0 ? potential_referent[0].account.professional.id : null;

	async function handleSubmit(values: OrientationValidationSchema) {
		try {
			await postApiJson(
				'/v1/change-beneficiary-orientation',
				{
					orientation_request_id: orientationRequestId,
					orientation_type: values.orientationType,
					notebook_id: notebook.id,
					beneficiary_id: notebook.beneficiaryId,
					structure_id: values.structureId,
					old_referent_account_id: referent_id,
					new_referent_account_id: values.professionalAccountId,
				},
				{ 'jwt-token': $token }
			);
		} catch (err) {
			console.error(err);
			captureException(err);
			displayError = true;
			return;
		}
		onBeneficiaryOrientationChanged();
		openComponent.close();
	}
</script>

<OrientationForm {handleSubmit} {displayError} {formTitle} />
