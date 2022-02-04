<script lang="ts" context="module">
	import type { AdminStructure } from '$lib/graphql/_gen/typed-document-nodes';

	export type Admin = Pick<
		AdminStructure,
		'id' | 'firstname' | 'lastname' | 'email' | 'phoneNumbers'
	>;
</script>

<script lang="ts">
	import { displayFullName } from '$lib/ui/format';
	import { Text } from '$lib/ui/utils';

	export let adminStructure: Admin;
	export let mainTitle = 'Gestionnaire de structure';
</script>

<div class="w-1/2 flex flex-col">
	<span class="mb-1 text-sm">
		{mainTitle}
	</span>
	<h2 class="fr-h5 !mb-0 text-france-blue truncate" title={displayFullName(adminStructure)}>
		{displayFullName(adminStructure)}
	</h2>
	<div class="flex flex-col gap-1">
		<Text defaultValueClassNames="italic" defaultValue="Pas d'email" value={adminStructure.email} />
	</div>
	<div class="flex flex-col gap-1">
		<Text defaultValueClassNames="italic" defaultValue="Pas de numéro de téléphone" value={adminStructure.phoneNumbers} />
	</div>
</div>
