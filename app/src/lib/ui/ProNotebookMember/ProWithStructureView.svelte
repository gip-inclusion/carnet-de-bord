<script lang="ts" context="module">
	import type { Member } from './ProNotebookMemberView.svelte';
</script>

<script lang="ts">
	import { displayFullName } from '$lib/ui/format';
	import { Text } from '$lib/ui/utils';
	import { RoleEnum } from '$lib/graphql/_gen/typed-document-nodes';

	export let account: Member['account'];
	export let mainTitle = 'Accompagnant';
	export let proFirst = false;
</script>

<div class="flex flex-row gap-4" class:flex-row-reverse={proFirst}>
	{#if account.type === RoleEnum.Professional}
		<div class="w-1/2 flex flex-col">
			<span class="mb-1 text-sm">Structure</span>

			<h2 class="fr-h5 !mb-0 text-vert-cdb truncate" title={account.professional.structure?.name}>
				{account.professional.structure?.name}
			</h2>
			<div class="flex flex-col gap-1">
				{#each [account.professional.structure?.address1, account.professional.structure?.address2].filter( (field) => Boolean(field) ) as line}
					<Text value={line} />
				{/each}
				<Text
					value={[account.professional.structure?.postalCode, account.professional.structure?.city]
						.filter((field) => Boolean(field))
						.join(' ')}
				/>
				<Text
					defaultValueClassNames="italic"
					defaultValue="Pas de site web"
					value={account.professional.structure?.website}
				/>
			</div>
		</div>
		<div class="w-1/2 flex flex-col">
			<span class="mb-1 text-sm">{mainTitle}</span>
			<h2 class="fr-h5 !mb-0 text-vert-cdb truncate" title={displayFullName(account.professional)}>
				{displayFullName(account.professional)}
			</h2>
			<div class="flex flex-col gap-1">
				<Text
					defaultValueClassNames="italic"
					defaultValue="Fonction inconnue"
					value={account.professional.position}
				/>
				<Text
					class="font-bold"
					defaultValueClassNames="italic"
					defaultValue="Pas de numéro de téléphone"
					value={account.professional.mobileNumber}
				/>
				<Text
					defaultValueClassNames="italic"
					defaultValue="Pas d'email"
					value={account.professional.email}
				/>
			</div>
		</div>
	{:else if account.type === RoleEnum.OrientationManager}
		<div class="w-1/2 flex flex-col">
			<span class="mb-1 text-sm">Chargé d'orientation</span>
			<h2
				class="fr-h5 !mb-0 text-vert-cdb truncate"
				title={displayFullName(account.orientation_manager)}
			>
				{displayFullName(account.orientation_manager)}
			</h2>
			<div class="flex flex-col gap-1">
				<Text defaultValueClassNames="italic" value="Chargé d'orientation" />
				<Text
					class="font-bold"
					defaultValueClassNames="italic"
					defaultValue="Pas de numéro de téléphone"
					value={account.orientation_manager.phoneNumbers}
				/>
				<Text
					defaultValueClassNames="italic"
					defaultValue="Pas d'email"
					value={account.orientation_manager.email}
				/>
			</div>
		</div>
	{/if}
</div>
