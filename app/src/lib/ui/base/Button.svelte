<script context="module">
	let counter = 0;
</script>

<script lang="ts">
	counter++;

	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	function click(event: Event) {
		event.preventDefault();
		dispatch('click');
	}

	export let id: string | null = `button-${counter}`;
	export let type: 'button' | 'submit' | 'reset' | null = 'button';
	export let action = type === 'button' ? click : null;
	export let disabled: boolean | null = false;
	export let classNames: string | null = '';
	export let outline: boolean | null = false;
	export let icon: string | null = '';
	export let title: string | null = '';
	export let iconSide: 'left' | 'right' = 'left';
	const iconSideClass = icon ? `fr-btn--icon-${iconSide}` : '';
</script>

<button
	{id}
	on:click={action}
	{type}
	{disabled}
	{title}
	class={`fr-btn ${outline ? 'fr-btn--secondary' : ''} ${classNames} ${icon} ${iconSideClass}`}
>
	<span><slot /></span>
</button>
