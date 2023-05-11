<script lang="ts">
	import {
		type GetNotebookFocusByIdQuery,
		UpdateActionStatusDocument,
		type UpdateActionStatusMutation,
		AddNotebookActionDocument,
		type AddNotebookActionMutation,
	} from '$lib/graphql/_gen/typed-document-nodes';
	import { Elm } from '$elm/Pages/Pro/Carnet/Action/List/Main.elm';
	import ElmWrapper from '$lib/utils/ElmWrapper.svelte';
	import { graphqlAPI, token } from '$lib/stores';
	import { captureException } from '$lib/utils/sentry';
	import { type OperationStore, mutation, operationStore } from '@urql/svelte';
	import { trackEvent } from '$lib/tracking/matomo';

	export let theme: string;
	export let target: GetNotebookFocusByIdQuery['focus']['targets'][0];

	const updateNotebookActionResult = operationStore(UpdateActionStatusDocument);
	const updateNotebookAction = mutation(updateNotebookActionResult);
	let updateResult: OperationStore<UpdateActionStatusMutation>;

	const createActionStore = operationStore(AddNotebookActionDocument);
	const createActionMutation = mutation(createActionStore);
	let addResult: OperationStore<AddNotebookActionMutation>;

	const elmSetup = (node: HTMLElement) => {
		const app = Elm.Pages.Pro.Carnet.Action.List.Main.init({
			node,
			flags: {
				api: { token: $token, url: $graphqlAPI },
				targetId: target.id,
				theme: theme,
			},
		});

		app.ports.sendError.subscribe((message: string) => captureException(new Error(message)));
		app.ports.addAction.subscribe(async (params) => {
			trackEvent('pro', 'notebook', `add action ${params.action}`);
			addResult = await createActionMutation({
				action: params.action,
				targetId: target.id,
				status: params.status,
			});
			if (addResult.error) {
				app.ports.addFailed.send('');
				captureException(new Error(JSON.stringify(addResult.error)));
			} else {
				app.ports.refreshActions.send('');
			}
		});
		app.ports.updateStatus.subscribe(async (params) => {
			updateResult = await updateNotebookAction({
				id: params.actionId,
				status: params.status,
			});

			if (updateResult.error) {
				app.ports.updateStatusFailed.send('');
				captureException(new Error(JSON.stringify(addResult.error)));
			}
		});
	};
</script>

<ElmWrapper setup={elmSetup} />
