<script lang="ts" context="module">
	import type { Professional, Structure } from '$lib/graphql/_gen/typed-document-nodes';

	export type Pro = Pick<
		Professional,
		'id' | 'firstname' | 'lastname' | 'position' | 'email' | 'mobileNumber'
	> & {
		structure: Pick<
			Structure,
			'id' | 'name' | 'address1' | 'address2' | 'postalCode' | 'city' | 'website'
		>;
	};
</script>

<script lang="ts">
	import { displayFullName } from '$lib/ui/format';
	import { Text } from '$lib/ui/utils';

	export let professional: Pro;
	export let mainTitle = 'Accompagnateur';
	export let proFirst = false;
	$: structure = professional?.structure;
</script>

<div class="flex flex-row gap-4" style={proFirst ? 'flex-direction: row-reverse;' : ''}>
	<div class="w-1/2 flex flex-col">
		<span class="mb-1 text-sm">Structure</span>
		<h2 class="fr-h5 !mb-0 text-france-blue truncate" title={structure?.name}>
			{structure?.name}
		</h2>
		<div class="flex flex-col gap-1">
			{#each [structure?.address1, structure?.address2].filter((field) => Boolean(field)) as line}
				<Text value={line} />
			{/each}
			<Text
				value={[structure?.postalCode, structure?.city].filter((field) => Boolean(field)).join(' ')}
			/>
			<Text
				defaultValueClassNames="italic"
				defaultValue="Pas de site web"
				value={structure?.website}
			/>
		</div>
	</div>
	<div class="w-1/2 flex flex-col">
		<span class="mb-1 text-sm">{mainTitle}</span>
		<h2 class="fr-h5 !mb-0 text-france-blue truncate" title={displayFullName(professional)}>
			{displayFullName(professional)}
		</h2>
		<div class="flex flex-col gap-1">
			<Text
				defaultValueClassNames="italic"
				defaultValue="Fonction inconnue"
				value={professional.position}
			/>
			<Text
				classNames="font-bold"
				defaultValueClassNames="italic"
				defaultValue="Pas de numéro de téléphone"
				value={professional.mobileNumber}
			/>
			<Text defaultValueClassNames="italic" defaultValue="Pas d'email" value={professional.email} />
		</div>
	</div>
</div>
