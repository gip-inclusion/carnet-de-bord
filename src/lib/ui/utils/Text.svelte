<script lang="ts">
	export let value: string;
	export let classNames = '';
	export let defaultValue = '-';
	export let defaultValueClassNames = '';
</script>

<div class={classNames}>
	{#if value}
		{value}
	{:else if defaultValueClassNames}
		<span class={defaultValueClassNames}>
			{defaultValue}
		</span>
	{:else}
		{defaultValue}
	{/if}
</div>
