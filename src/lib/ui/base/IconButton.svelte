<script lang="ts">
	import { pluck } from '$lib/helpers';

	export let icon: string;
	export let ariaLabel: string;
	export let classNames = '';
	export let textColor = 'text-france-blue';
	export let bgColor = 'bg-transparent';

	$: buttonProps = pluck(['icon', 'classNames'], $$props);
</script>

<button
	on:click
	type="button"
	class="bt text-2xl {textColor} {bgColor} {classNames}"
	aria-label={ariaLabel}
	{...buttonProps}
>
	<span class={icon} aria-hidden />
</button>
