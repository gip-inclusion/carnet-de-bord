<script lang="ts">
	import { AddNotebookMemberDocument } from '$lib/graphql/_gen/typed-document-nodes';

	import ProCreationForm from '$lib/ui/ProCreationForm/index.svelte';
	import { post } from '$lib/utils/post';
	import { mutation, operationStore } from '@urql/svelte';
	import { openComponent } from '$lib/stores';
	import ProAddedConfirmation from './ProAddedConfirmation.svelte';
	import { Alert } from '$lib/ui/base';
	import type { AccountRequest } from '$lib/types';

	export let firstname: string;
	export let lastname: string;
	export let notebookId: string;

	const addNotebookMemberStore = operationStore(AddNotebookMemberDocument);
	const addNotebookMember = mutation(addNotebookMemberStore);
	let error: string;

	async function addMemberToNotebook(accountId: string) {
		// TODO(tglatt): should wrap into a hasura action
		const store = await addNotebookMember({
			accountId,
			notebookId: notebookId,
		});
		const { id: notebookMemberId } = store.data.newMember;
		//send email
		post('/pro/carnet/invitation', { notebookMemberId });
		openComponent.replace({ component: ProAddedConfirmation, props: { confirmed: true } });
	}

	async function onSubmit(values: AccountRequest & { structureId: string }) {
		const { structureId, ...accountRequest } = values;
		try {
			const { accountId } = await post<{ accountId: string }>('/inscription/request', {
				accountRequest,
				structureId,
				requester: { firstname, lastname },
			});
			await addMemberToNotebook(accountId);
			openComponent.replace({ component: ProAddedConfirmation, props: { confirmed: false } });
		} catch (err) {
			console.error(err);
			error = "La création d'un nouvel accompagnant a échoué.";
		}
	}
	function onCancel() {
		openComponent.close();
	}
</script>

<section class="flex flex-col gap-6">
	<div>
		<h1 class="mb-0">Ajouter un nouvel accompagnateur</h1>
		<p class="mb-0">
			Recherchez un accompagnateur et envoyez une invitation à rejoindre le groupe de suivi de {firstname}
			{lastname}.
		</p>
	</div>
	<ProCreationForm {onSubmit} {onCancel} />
	{#if error}
		<div class="mb-8">
			<Alert type="error" description={error} />
		</div>
	{/if}
</section>
