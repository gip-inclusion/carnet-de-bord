<script lang="ts">
	import type { GetProfessionalsForStructureQuery } from '$lib/graphql/_gen/typed-document-nodes';
	import { displayFullName } from '../format';
	type Professional = GetProfessionalsForStructureQuery['professional'][0];

	export let professionals: Professional[];

	function beneficiariesCount(professional: Professional) {
		return professional.account.notebooksWhereMember_aggregate.aggregate.count;
	}

	function tagClasses(professional: Professional) {
		const tagColor = beneficiariesCount(professional) === 0 ? 'fr-tag--purple-glycine' : '';
		// remove the `cursor-default` class when click action is impletemented
		return `fr-tag fr-tag-sm ${tagColor} cursor-default`;
	}
</script>

<table class="w-full fr-table fr-table--layout-fixed">
	<caption class="sr-only">Liste des professionnels</caption>
	<thead>
		<tr>
			<th class="text-left">Prénom nom</th>
			<th class="text-left">Téléphone</th>
			<th class="text-left">Email</th>
			<th class="text-left">Onboarding</th>
			<th class="text-right">BRSA suivis</th>
		</tr>
	</thead>
	<tbody>
		{#each professionals as professional}
			<tr>
				<td>{displayFullName(professional)}</td>
				<td>{professional.mobileNumber ?? '--'}</td>
				<td>{professional.email}</td>
				<td>{professional.account.onboardingDone ? 'Oui' : 'Non'}</td>
				<td class="flex justify-end">
					<button class={tagClasses(professional)}>
						{beneficiariesCount(professional)}
					</button>
				</td>
			</tr>
		{/each}
		{#if professionals.length === 0}
			<tr><td colspan="10">Aucun professionel.</td></tr>
		{/if}
	</tbody>
</table>
