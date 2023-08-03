<script lang="ts">
	import type { GetStructuresForDeploymentQuery } from '$lib/graphql/_gen/typed-document-nodes';
	import { createEventDispatcher } from 'svelte';

	import IconButton from '../base/IconButton.svelte';

	type Structure = GetStructuresForDeploymentQuery['structure'][number];

	const dispatch = createEventDispatcher();

	export let structures: Structure[];

	function editClickHandler(structure: Structure) {
		dispatch('edit', { structure });
	}

	function getOrientationSystemLabels(
		orientationSystems: Structure['orientationSystems']
	): string[] {
		const labels = orientationSystems.map(({ orientationSystem }) => orientationSystem.name);
		labels.sort();
		return labels;
	}
</script>

<div class={`fr-table fr-table--layout-fixed fr-table--no-caption`}>
	<table>
		<caption>Liste des structures</caption>
		<thead>
			<tr>
				<th class="w-2/5">Nom</th>
				<th class="text-right">Code postal</th>
				<th>Ville</th>
				<th class="">Dispositifs d'accompagnement</th>
				<th class="text-center w-20">Éditer</th>
			</tr>
		</thead>
		<tbody>
			{#each structures as structure (structure.id)}
				<tr>
					<td>{structure.name}</td>
					<td class="text-right">{structure.postalCode || ''}</td>
					<td>{structure.city || ''}</td>
					<td>
						<ul>
							{#each getOrientationSystemLabels(structure.orientationSystems) as orientationSystemLabel}
								<li>{orientationSystemLabel}</li>
							{/each}
						</ul>
					</td>
					<td class="text-center">
						<IconButton
							icon="fr-icon-edit-line"
							class="fr-btn--tertiary"
							on:click={() => editClickHandler(structure)}
							title={`Éditer la structure ${structure.name}`}
						/>
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>
