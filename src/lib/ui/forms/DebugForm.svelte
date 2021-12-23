<script lang="ts">
	import { getContext } from 'svelte';
	import { key, FormProps } from 'svelte-forms-lib';
	import type { Writable } from 'svelte/store';

	const { touched, errors, state, isValid, isValidating, isSubmitting } = getContext<
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
			},
			null,
			2
		)}</pre>
</details>
