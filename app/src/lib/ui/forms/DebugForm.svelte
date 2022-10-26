<script lang="ts">
	import { getContext } from 'svelte';
	import { key, type FormProps } from 'svelte-forms-lib';
	import type { Writable } from 'svelte/store';

	const { touched, errors, state, isValid, isSubmitted, isValidating, isSubmitting } = getContext<
		{ isSubmitted: Writable<boolean> } & FormProps['context']
	>(key);
</script>

<details>
	<summary>form details</summary>
	<pre>{JSON.stringify(
			{
				errors: $errors,
				state: $state,
				touched: $touched,
				isValid: $isValid,
				isValidating: $isValidating,
				isSubmitting: $isSubmitting,
				isSubmitted: $isSubmitted,
			},
			null,
			2
		)}</pre>
</details>
