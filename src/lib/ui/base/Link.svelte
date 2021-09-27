<script lang="ts">
	import { goto } from '$app/navigation';

	export let href: string | null;
	export let classNames: string | null = '';
	export let title: string | null = '';
	export let external: boolean | null = false;
	export let isCurrent: boolean | null = false;
	const target: string = external ? '_blank' : '_self';

	function onClick() {
		goto(href);
	}

	let ariaCurrent = 'page' as const;
	$: additionalProps = isCurrent ? { 'aria-current': ariaCurrent } : {};
</script>

<a
	on:click|preventDefault={onClick}
	{href}
	{title}
	class={classNames}
	rel={external ? 'noreferrer noopener' : ''}
	{target}
	{...additionalProps}
>
	<slot />
</a>
