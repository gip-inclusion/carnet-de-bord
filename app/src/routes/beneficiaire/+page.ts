import NotebookView from '$lib/ui/views/NotebookView.svelte';
import LoaderIndicator from '$lib/ui/utils/LoaderIndicator.svelte';
import type { PageLoad } from '@sveltejs/kit';
import { GetNotebookByBeneficiaryIdDocument } from '$lib/graphql/_gen/typed-document-nodes';
import { operationStore, query } from '@urql/svelte';

export const load: PageLoad = ({ session }) => {
	const beneficiaryId = session.user.beneficiaryId;

	return {
		beneficiaryId,
	};
};
