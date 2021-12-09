<script lang="ts">
	import type { InputType } from '$lib/types';
	import { getContext } from 'svelte';
	import { key } from 'svelte-forms-lib';
	import { Input } from '../base';

	export let name: string;
	export let placeholder: string;
	export let inputLabel: string;
	export let inputHint: string | null = '';
	export let type: InputType = 'text';
	export let valid: string | null = '';
	export let additionnalClasses = '';
	export let disabled = false;
	export let required = false;

	const { form, handleChange, errors, isSubmitted } = getContext(key);

	$: hasError = Boolean($errors[name]) && $isSubmitted;
	$: error = $errors[name];
</script>

<Input
	{name}
	{placeholder}
	{type}
	{required}
	{inputLabel}
	{inputHint}
	{valid}
	{disabled}
	{additionnalClasses}
	error={hasError && error}
	value={$form[name]}
	on:input={handleChange}
	on:blur={handleChange}
/>
