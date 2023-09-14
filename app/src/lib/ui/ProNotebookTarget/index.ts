import type { GetRefTargetByFocusQuery } from '$lib/graphql/_gen/typed-document-nodes';
import ProNotebookTargetCreateContainter from './ProNotebookTargetCreateContainter.svelte';

export type Target = GetRefTargetByFocusQuery['refTargets'][number];

export type AddTargetPayload = {
	target: string;
	linkedTo: string | null;
	consent: boolean;
};

export default ProNotebookTargetCreateContainter;
