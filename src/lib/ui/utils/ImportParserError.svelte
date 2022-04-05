<script lang="ts">
	export let parseErrors: string[];
</script>

{#if parseErrors.length > 0}
	<ul>
		{#each parseErrors as error}
			<li class="text-error">
				{error}
			</li>
		{/each}
	</ul>
{/if}
