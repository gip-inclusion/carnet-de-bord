<script lang="ts">
	import { goto } from '$app/navigation';
	import { post } from '$lib/utils';

	let username = '';

	async function handleSubmit() {
		const response = await post(`/api/auth/login`, { username });
	}
</script>

<h1 class="mt-20 mb-4 text-4xl font-bold text-center">Se connecter</h1>
<form
	class="flex flex-col max-w-xl gap-6 p-8 mx-auto mt-8 bg-back2"
	on:submit|preventDefault={handleSubmit}
>
	<label class="flex flex-row items-center">
		<span class="inline-block w-40 font-bold">Couriel</span>
		<input class="flex-grow inline-block border-gray-300" required bind:value={username} />
	</label>
	<button
		type="submit"
		disabled={!username}
		class="self-end block w-32 p-2 px-4 text-white border-2 rounded bg-action hover:bg-accent disabled:bg-back2"
	>
		Connexion
	</button>
</form>
