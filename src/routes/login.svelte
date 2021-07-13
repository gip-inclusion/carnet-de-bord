<script lang="ts">
	import { goto } from '$app/navigation';
	import { session } from '$app/stores';
	import { post } from '$lib/utils';

	let email = '';

	async function handleSubmit() {
		const response = await post(`/auth/login`, { email });

		if (response.user) {
			$session.user = response.user;
			goto('/');
		}
	}
</script>

<h1 class="mt-20 mb-4 text-4xl font-bold text-center">Se connecter</h1>
<form
	class="flex flex-col max-w-xl gap-6 p-8 mx-auto mt-8 bg-back2"
	on:submit|preventDefault={handleSubmit}
>
	<label class="flex flex-row items-center">
		<span class="inline-block w-40 font-bold">Couriel</span>
		<input
			class="flex-grow inline-block border-gray-300"
			type="email"
			required
			bind:value={email}
		/>
	</label>
	<button
		type="submit"
		disabled={!email}
		class="self-end block w-32 p-2 px-4 text-white border-2 rounded bg-action disabled:bg-back2"
	>
		Connexion
	</button>
</form>
