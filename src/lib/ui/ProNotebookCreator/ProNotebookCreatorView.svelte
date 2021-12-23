<script lang="ts">
	import type { Professional } from '$lib/graphql/_gen/typed-document-nodes';
	import { displayFullName, notNullish } from '$lib/ui/format';
	import { formatDateLocale } from '$lib/utils/date';
	import { Text } from '$lib/ui/utils';
	import Button from '../base/Button.svelte';
	import { openComponent } from '$lib/stores';

	export let creator: Pick<
		Professional,
		'firstname' | 'lastname' | 'structure' | 'position' | 'mobileNumber' | 'email'
	>;
	export let createdAt: Date;
</script>

<div class="flex flex-col gap-6">
	<h1>Auteur de l'axe de travail</h1>
	<p class="mb-0">Ajouté le {formatDateLocale(createdAt.toString())}</p>
	<div class="flex flex-row gap-4">
		<div class="w-1/2 flex flex-col">
			<span class="mb-1 text-sm">Structure</span>
			<h2 class="fr-h5 !mb-0 text-france-blue truncate" title={creator.structure?.name}>
				{creator.structure?.name}
			</h2>
			<div class="flex flex-col gap-1">
				<Text
					value={[creator.structure?.address1, creator.structure?.address2]
						.filter((field) => notNullish(field))
						.join(', ')}
				/>
				<Text value={[creator.structure?.postalCode, creator.structure?.city].join(' - ')} />
				<Text
					defaultValueClassNames="italic"
					defaultValue="Pas de site web"
					value={creator.structure?.website}
				/>
			</div>
		</div>
		<div class="w-1/2 flex flex-col">
			<span class="mb-1 text-sm">Accompagnateur</span>
			<h2 class="fr-h5 !mb-0 text-france-blue truncate" title={displayFullName(creator)}>
				{displayFullName(creator)}
			</h2>
			<div class="flex flex-col gap-1">
				<Text
					defaultValueClassNames="italic"
					defaultValue="Fonction inconnue"
					value={creator.position}
				/>
				<Text
					classNames="font-bold"
					defaultValueClassNames="italic"
					defaultValue="Pas de numéro de téléphone"
					value={creator.mobileNumber}
				/>
				<Text defaultValueClassNames="italic" defaultValue="Pas d'email" value={creator.email} />
			</div>
		</div>
	</div>
	<div class="mt-6">
		<Button
			on:click={() => {
				openComponent.close();
			}}>Fermer</Button
		>
	</div>
</div>
