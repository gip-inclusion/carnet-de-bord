<script lang="ts">
	import type { GetNotebookFocusByIdQuery } from '$lib/graphql/_gen/typed-document-nodes';
	import { displayFullName, notNullish } from '$lib/ui/format';
	import { formatDateLocale } from '$lib/utils/date';
	import { Text } from '$lib/ui/utils';
	import { Button } from '$lib/ui/base';
	import { openComponent } from '$lib/stores';

	export let creator: GetNotebookFocusByIdQuery['focus']['creator'];
	export let createdAt: Date;
</script>

<div class="flex flex-col gap-6">
	<h1>Auteur de l'axe de travail</h1>
	<p class="mb-0">Ajouté le {formatDateLocale(createdAt.toString())}</p>
	<div class="flex flex-row gap-4">
		{#if creator?.professional?.structure}
			<div class="w-1/2 flex flex-col">
				<span class="mb-1 text-sm">Structure</span>
				<h2 class="fr-h5 !mb-0 text-vert-cdb truncate" title={creator.professional.structure?.name}>
					{creator.professional.structure?.name}
				</h2>
				<div class="flex flex-col gap-1">
					<Text
						value={[
							creator.professional.structure?.address1,
							creator.professional.structure?.address2,
						]
							.filter((field) => notNullish(field))
							.join(', ')}
					/>
					<Text
						value={[
							creator.professional.structure?.postalCode,
							creator.professional.structure?.city,
						].join(' - ')}
					/>
					<Text
						defaultValueClassNames="italic"
						defaultValue="Pas de site web"
						value={creator.professional.structure?.website}
					/>
				</div>
			</div>
		{/if}
		<div class="w-1/2 flex flex-col">
			<span class="mb-1 text-sm"
				>{creator.professional ? 'Accompagnateur' : "Chargé d'orientation"}</span
			>
			<h2
				class="fr-h5 !mb-0 text-vert-cdb truncate"
				title={displayFullName(creator.professional || creator.orientation_manager)}
			>
				{displayFullName(creator.professional || creator.orientation_manager)}
			</h2>
			<div class="flex flex-col gap-1">
				{#if creator.professional}
					<Text
						defaultValueClassNames="italic"
						defaultValue="Fonction inconnue"
						value={creator.professional?.position}
					/>
				{/if}
				<Text
					class="font-bold"
					defaultValueClassNames="italic"
					defaultValue="Pas de numéro de téléphone"
					value={creator.professional
						? creator.professional.mobileNumber
						: creator.orientation_manager.phoneNumbers}
				/>
				<Text
					defaultValueClassNames="italic"
					defaultValue="Pas d'email"
					value={creator?.professional?.email || creator?.orientation_manager?.email}
				/>
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
