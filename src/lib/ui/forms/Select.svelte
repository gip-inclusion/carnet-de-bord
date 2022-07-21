<script lang="ts">
	import type { Option } from '$lib/types';
	import { getContext } from 'svelte';
	import { FormProps, key } from 'svelte-forms-lib';
	import { Select } from '$lib/ui/base';
	import type { Writable } from 'svelte/store';

	export let name: string;
	export let selectHint: string | null = '';
	export let selectLabel: string | null;
	export let additionalLabel: string | null = '';
	export let options: Option[];
	export let valid: string | null = '';
	export let disabled = false;
	export let required = false;

	const { form, handleChange, errors, isSubmitted } = getContext<
		{ isSubmitted: Writable<boolean> } & FormProps['context']
	>(key);

	$: hasError = Boolean($errors[name]) && $isSubmitted;
	$: error = $errors[name];
</script>

<Select
	{name}
	{selectHint}
	{selectLabel}
	{additionalLabel}
	{options}
	{valid}
	{disabled}
	{required}
	error={hasError && error}
	selected={$form[name]}
	on:change={handleChange}
	on:blur={handleChange}
/>
