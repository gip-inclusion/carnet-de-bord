<script lang="ts">
	import type { InputType } from '$lib/types';
	import { getContext } from 'svelte';
	import { FormProps, key } from 'svelte-forms-lib';
	import { Input } from '$lib/ui/base';
	import type { Writable } from 'svelte/store';

	export let name: string;
	export let placeholder = '';
	export let inputLabel = '';
	export let inputHint: string | null = '';
	export let type: InputType = 'text';
	export let valid: string | null = '';
	export let disabled = false;
	export let required = false;

	const { form, handleChange, errors, isSubmitted } = getContext<
		{ isSubmitted: Writable<boolean> } & FormProps['context']
	>(key);

	$: hasError = Boolean($errors[name]) && $isSubmitted;
	$: error = $errors[name];
</script>

<Input
	{placeholder}
	{inputLabel}
	{inputHint}
	{type}
	{valid}
	{disabled}
	{required}
	{...$$props}
	error={hasError && error}
	value={$form[name]}
	on:input={handleChange}
	on:blur={handleChange}
/>
