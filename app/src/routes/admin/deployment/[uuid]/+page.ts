import { GetDeploymentByIdDocument } from '$lib/graphql/_gen/typed-document-nodes';
import type { PageLoad } from '@sveltejs/kit';
import { operationStore, query } from '@urql/svelte';

export const load: PageLoad = ({ params }) => {
	const deploymentId = params.uuid;
	return {
		deploymentId,
	};
};
