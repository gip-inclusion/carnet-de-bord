<script lang="ts">
	import { getContext } from 'svelte';
	import { type FormProps, key } from 'svelte-forms-lib';
	import { Textarea } from '$lib/ui/base';
	import type { Writable } from 'svelte/store';

	export let name: string;
	export let label;
	export let placeholder;
	export let hint: string | null = null;
	export let valid: string | null = null;
	export let disabled = false;
	export let required = false;

	const { form, handleChange, errors, isSubmitted } = getContext<
		{ isSubmitted: Writable<boolean> } & FormProps['context']
	>(key);

	$: hasError = Boolean($errors[name]) && $isSubmitted;
	$: error = $errors[name];
</script>

<Textarea
	{name}
	{placeholder}
	{label}
	{hint}
	{valid}
	{disabled}
	{required}
	{...$$props}
	error={hasError && error}
	text={$form[name]}
	on:input={handleChange}
	on:blur={handleChange}
/>
