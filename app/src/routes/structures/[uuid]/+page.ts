import type { GetStructureQueryStore } from '$lib/graphql/_gen/typed-document-nodes';
import { GetStructureDocument } from '$lib/graphql/_gen/typed-document-nodes';
import { homeForRole } from '$lib/routes';
import { Breadcrumbs, Button, Card } from '$lib/ui/base';
import { LoaderIndicator } from '$lib/ui/utils';
import type { PageLoad } from '@sveltejs/kit';
import { operationStore, query } from '@urql/svelte';

const professionnelIcon = '/images/professionnel.svg';
const rattachementIcon = '/images/rattachement.svg';

export const load: PageLoad = ({ params }) => {
	const structureId = params.uuid;
	const getStructure = operationStore(
		GetStructureDocument,
		{ structureId },
		{ additionalTypenames: ['professional'] }
	);

	return {
		structureId,
		getStructure,
	};
};
