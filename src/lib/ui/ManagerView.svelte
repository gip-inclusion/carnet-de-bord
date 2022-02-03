<script lang="ts" context="module">
	import type { Manager } from '$lib/graphql/_gen/typed-document-nodes';

	export type Mana = Pick<Manager, 'id' | 'firstname' | 'lastname' | 'email'>;
</script>

<script lang="ts">
	import { displayFullName } from '$lib/ui/format';
	import { Text } from '$lib/ui/utils';

	export let manager: Mana;
	export let mainTitle = 'Manager';
</script>

<div class="w-1/2 flex flex-col">
	<span class="mb-1 text-sm">{mainTitle}</span>
	<h2 class="fr-h5 !mb-0 text-france-blue truncate" title={displayFullName(manager)}>
		{displayFullName(manager)}
	</h2>
	<div class="flex flex-col gap-1">
		<Text defaultValueClassNames="italic" defaultValue="Pas d'email" value={manager.email} />
	</div>
</div>
