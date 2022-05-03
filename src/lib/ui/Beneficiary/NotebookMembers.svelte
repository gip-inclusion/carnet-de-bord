<script lang="ts">
	import type { GetNotebookByBeneficiaryIdQuery } from '$lib/graphql/_gen/typed-document-nodes';

	import { Text } from '$lib/ui/utils';

	export let members: GetNotebookByBeneficiaryIdQuery['notebook'][0]['members'];
</script>

<div class={`fr-table fr-table--layout-fixed`}>
	<table>
		<thead>
			<tr>
				<th style="width: 40%">Structure</th>
				<th style="width: 30%">Accompagnateur</th>
				<th style="width: 30%">Fonction</th>
			</tr>
		</thead>
		<tbody>
			{#each members as member}
				<tr class:font-bold={member.memberType === 'referent'}>
					<td>
						<Text value={member.account?.professional.structure.name} />
					</td>
					<td>
						<div class="flex flex-row gap-2">
							<Text value={member.account?.professional.firstname} />
							<Text value={member.account?.professional.lastname} />
							{#if member.memberType === 'referent'}
								(référent)
							{/if}
						</div>
					</td>
					<td>
						<Text value={member.account?.professional.position} />
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>
