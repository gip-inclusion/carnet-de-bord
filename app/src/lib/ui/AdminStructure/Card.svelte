<script lang="ts">
	import { Button, Card } from '$lib/ui/base';
	import { Text } from '$lib/ui/utils';
	import { displayFullName, displayMobileNumber } from '$lib/ui/format';
	import {
		type AdminStructure,
		RemoveAdminStructureStructureMutationDocument,
	} from '$lib/graphql/_gen/typed-document-nodes';
	import { openComponent } from '$lib/stores';
	import EditAdminStructureLayer from '$lib/ui/AdminStructure/EditAdminStructureLayer.svelte';
	import Dialog from '$lib/ui/Dialog.svelte';
	import { mutation, operationStore } from '@urql/svelte';
	import { accountData } from '$lib/stores';

	export let adminStructure: Pick<
		AdminStructure,
		'id' | 'firstname' | 'lastname' | 'phoneNumbers' | 'email'
	>;
	export let href: string = null;
	export let structureId: string;

	const isNotCurrentAccount = $accountData.admin_structure.id !== adminStructure.id;

	function openUpdateAdminLayer() {
		openComponent.open({
			component: EditAdminStructureLayer,
			props: { adminStructure },
		});
	}

	const removeAdminStructureMutation = operationStore(
		RemoveAdminStructureStructureMutationDocument
	);
	const removeAdminStructure = mutation(removeAdminStructureMutation);

	async function removeAdminStructureFromStructure() {
		await removeAdminStructure({ structureId, adminStructureId: adminStructure.id });
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
	<span slot="actions" class="flex flex-row gap-2">
		<Button classNames="fr-btn--secondary fr-btn--sm" on:click={openUpdateAdminLayer}
			>Mettre à jour</Button
		>
		{#if isNotCurrentAccount}
			<Dialog
				buttonCssClasses="fr-btn--sm"
				buttonFullWidth={false}
				buttonIcon="fr-icon-delete-bin-line"
				title="Supprimer un gestionnaire de structure"
				label="Supprimer"
				on:confirm={() => removeAdminStructureFromStructure()}
			>
				<p>
					Vous allez supprimer les droits de gestionnaire de structure au compte de
					<strong>{displayFullName(adminStructure)}</strong>.
					<br />Veuillez confirmer la suppression.
				</p>
			</Dialog>
		{/if}
	</span>
</Card>
