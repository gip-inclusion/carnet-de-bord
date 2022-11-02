<script lang="ts">
	import { displayFullName } from '$lib/ui/format';
	import type { Person } from '../../emails';

	export let person: Person;
</script>

<p>
	{#if person}
		Bonjour {displayFullName(person)},
	{:else}
		Bonjour,
	{/if}
</p>
