<script lang="ts">
	import { Button, Card } from '$lib/ui/base';
	import { Text } from '$lib/ui/utils';
	import { displayFullName, displayMobileNumber } from '$lib/ui/format';
	import type { AdminStructure } from '$lib/graphql/_gen/typed-document-nodes';
	import { openComponent } from '$lib/stores';
	import EditAdminStructureLayer from '$lib/ui/AdminStructure/EditAdminStructureLayer.svelte';

	export let adminStructure: Pick<
		AdminStructure,
		'id' | 'firstname' | 'lastname' | 'phoneNumbers' | 'email'
	>;
	export let href: string = null;

	function openUpdateAdminLayer() {
		openComponent.open({
			component: EditAdminStructureLayer,
			props: { adminStructure },
		});
	}
</script>

<Card {href} horizontal hideArrow>
	<span slot="title">
		<div class="pb-1 flex flex-row font-bold text-xl tracking-wider">
			<Text
				value={displayFullName(adminStructure)}
				defaultValue="Pas de nom"
				defaultValueClassNames="italic"
			/>
		</div>
	</span>
	<span slot="description">
		<div class="pb-1 font-bold tracking-wider">
			<Text
				defaultValueClassNames="italic"
				defaultValue="Pas d'email"
				value={adminStructure.email}
			/>
		</div>
		<div>
			<Text
				defaultValueClassNames="italic"
				defaultValue="Pas de téléphone"
				value={displayMobileNumber({ mobileNumber: adminStructure.phoneNumbers })}
			/>
		</div>
	</span>
	<span slot="actions">
		<Button classNames="fr-btn--secondary fr-btn--sm" on:click={openUpdateAdminLayer}
			>Mettre à jour</Button
		>
	</span>
</Card>
