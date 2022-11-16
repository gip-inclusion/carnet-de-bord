<script lang="ts">
	import { pluck } from '$lib/helpers';

	export let value: string;
	export let defaultValue = '--';
	export let defaultValueClassNames = '';
	$: textProps = pluck(['class'], $$props);
</script>

<div {...textProps} class={`${$$props.class} ${!value ? defaultValueClassNames : ''}`}>
	{#if value}
		{value}
	{:else}
		{defaultValue}
	{/if}
</div>
