<script lang="ts">
	import { setContext } from 'svelte';

	import { writable } from 'svelte/store';
	import { createForm, key } from 'svelte-forms-lib';
	import type { ObjectSchema } from 'yup';
	import { dev } from '$app/env';
	import DebugForm from './DebugForm.svelte';
	import type { ObjectShape } from 'yup/lib/object';

	export let initialValues: Record<string, unknown>;
	export let validationSchema: ObjectSchema<ObjectShape>;
	export let onSubmit: (values: Record<string, unknown>) => void;

	const formHandler = createForm({ initialValues, validationSchema, onSubmit });

	const {
		errors,
		form,
		touched,
		modified,
		handleSubmit,
		isValid,
		isValidating,
		isSubmitting,
		isModified,
	} = formHandler;

	const isSubmitted = writable(false);

	setContext(key, { ...formHandler, isSubmitted });

	function submitHandler(e) {
		$isSubmitted = true;
		handleSubmit(e);
	}

	$: {
		formHandler.updateInitialValues(initialValues);
	}
</script>

<form on:submit|preventDefault={submitHandler} novalidate {...$$props}>
	<slot
		isValid={$isValid}
		isSubmitting={$isSubmitting}
		isSubmitted={$isSubmitted}
		isValidating={$isValidating}
		isModified={$isModified}
		touched={$touched}
		modified={$modified}
		errors={$errors}
		form={$form}
	/>
	{#if dev}
		<DebugForm />
	{/if}
</form>
