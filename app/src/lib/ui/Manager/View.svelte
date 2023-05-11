<script lang="ts" context="module">
	import { connectedUser } from '$lib/stores';
	import type { Manager } from '$lib/graphql/_gen/typed-document-nodes';

	export type Mana = Pick<Manager, 'id' | 'firstname' | 'lastname' | 'email'>;
</script>

<script lang="ts">
	import { GetDeploymentInfosDocument } from '$lib/graphql/_gen/typed-document-nodes';
	import { operationStore, query } from '@urql/svelte';
	import { displayFullName } from '$lib/ui/format';
	import { Text } from '$lib/ui/utils';

	$: deploymentName = $result.data?.deployment?.label;
	const deploymentId = $connectedUser.deploymentId;
	const result = operationStore(GetDeploymentInfosDocument, { id: deploymentId });
	query(result);
	export let manager: Mana;
	export let mainTitle = 'Manager du déploiement';
</script>

<div class="w-1/2 flex flex-col">
	<span class="mb-1 text-sm">
		{mainTitle}
		{#if deploymentName}
			<strong>{deploymentName}</strong>
		{/if}
	</span>
	<h2 class="fr-h5 !mb-0 text-vert-cdb truncate" title={displayFullName(manager)}>
		{displayFullName(manager)}
	</h2>
	<div class="flex flex-col gap-1">
		<Text defaultValueClassNames="italic" defaultValue="Pas d'email" value={manager.email} />
	</div>
</div>
