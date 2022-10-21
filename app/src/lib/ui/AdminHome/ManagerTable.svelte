<script lang="ts">
	import {
		DeleteManagerDocument,
		type GetDeploymentByIdQuery,
	} from '$lib/graphql/_gen/typed-document-nodes';
	import { openComponent } from '$lib/stores';
	import IconButton from '$lib/ui/base/IconButton.svelte';
	import { mutation, operationStore } from '@urql/svelte';
	import { displayFullName } from '../format';
	import ConfirmLayer from './ConfirmLayer.svelte';

	export let managers: GetDeploymentByIdQuery['deployment']['managers'] = [];

	const deleteManagerStore = operationStore(DeleteManagerDocument);
	const deleteManager = mutation(deleteManagerStore);

	function onDelete(id: string): void {
		openComponent.open({
			component: ConfirmLayer,
			props: {
				title: 'Supprimer un responsable',
				text: 'Êtes-vous sûr de vouloir supprimer le compte du responsable?',
				acceptHandler: () => {
					deleteManager({ id });
				},
			},
		});
	}
</script>

<table class="w-full fr-table fr-table--layout-fixed">
	<caption class="sr-only">Liste des managers</caption>
	<thead>
		<tr>
			<th class="text-left">Nom</th>
			<th class="text-left">Couriel</th>
			<th class="text-left">Onboarding</th>
			<th class="!text-center">Supprimer</th>
		</tr>
	</thead>
	<tbody>
		{#each managers as manager}
			<tr>
				<td>{displayFullName(manager) || '-'}</td>
				<td>{manager.email}</td>
				<td>{manager.account.onboardingDone ? 'Oui' : 'Non'}</td>
				<td class="text-center">
					<IconButton
						icon="fr-icon-delete-bin-line"
						on:click={() => onDelete(manager.id)}
						title={`Supprimer ${displayFullName(manager)}`}
						class="fr-btn--tertiary-no-outline"
					/>
				</td>
			</tr>
		{/each}
	</tbody>
</table>
