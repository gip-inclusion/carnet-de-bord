<script lang="ts">
	import type Pro from '$lib/ui/ProNotebookMember/ProWithStructureView.svelte';
	import { Button } from '$lib/ui/base/index';

	export let professional: Pro;
	export let notebookId: string;

	console.log(professional);
	console.log(notebookId);
</script>

<div id="appointments">
	<div class="heading fr-grid-row">
		<div class="fr-col-6">
			<h4 class="text-france-blue m-0">Rendez-vous</h4>
		</div>
		<div class="fr-col-6 text-right">
			<Button>Ajouter un rendez-vous</Button>
		</div>
	</div>
	<div class="fr-table fr-table--layout-fixed blue-france-950">
		<table>
			<thead class="--bg-blue-france-975">
				<tr>
					<th style="width: 50%">Date</th>
					<th style="width: 50%">Présence</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td>01/01/2022</td>
					<td>Présent</td>
				</tr>
				<tr>
					<td>01/01/2022</td>
					<td>Présent</td>
				</tr>
			</tbody>
		</table>
	</div>
</div>

<style>
	.heading {
		margin-top: 40px;
		margin-bottom: 8px;
	}
</style>
