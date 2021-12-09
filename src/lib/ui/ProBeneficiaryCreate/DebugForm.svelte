<script>
	import { getContext } from 'svelte';

	import { key } from 'svelte-forms-lib';
	const { touched, errors, state, isValid, isValidating, isSubmitting } = getContext(key);
</script>

<details>
	<summary>form details</summary>
	<pre>{JSON.stringify({errors: $errors, state: $state, touched: $touched, isValid: $isValid, isValidating: $isValidating, isSubmitting: $isSubmitting}, null, 2)}</pre>
</details>
