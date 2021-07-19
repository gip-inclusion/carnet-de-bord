<script lang="ts">
	import { post } from '$lib/utils';

	type RequestStep = 'start' | 'success' | 'error';

	let requestStep: RequestStep = 'start';
	let username = '';
	let email;

	async function handleSubmit() {
		const response = await post(`/api/auth/login`, { username });
		if (response.status === 401) {
			requestStep = 'error';
		}
		if (response.status === 200) {
			requestStep = 'success';
			const res = await response.json();
			email = res.email;
		}
	}
</script>

<h1 class="mt-4 mb-20 text-3xl font-bold text-center">
	<div>Faciliter la vie des personnes en insertion</div>
	<div>et de leurs accompagnants</div>
</h1>
<div class="flex gap-x-4">
	<div class="w-1/2 bg-back2" />
	<form class="w-1/2 flex flex-col" on:submit|preventDefault={handleSubmit}>
		<div class="pt-4 pb-12">
			<div class="text-1xl font-bold pt-8">Veuillez saisir votre identifiant</div>
			<div class="text-xs">pour recevoir pour lien de connexion</div>
		</div>
		{#if requestStep === 'start'}
			<div class="w-3/5 flex flex-col gap-8">
				<input
					class="border-b-2 border-black border-opacity-30 h-10 bg-gray-100"
					required
					bind:value={username}
				/>
				<button
					type="submit"
					disabled={!username}
					class="self-end block w-32 p-2 px-4 text-white border-2 border-opacity-20 rounded bg-action hover:bg-accent disabled:bg-back2"
				>
					Valider
				</button>
			</div>
		{:else if requestStep === 'error'}
			<div>
				Cet email n’est pas rattaché à un compte existant. Veuillez vous inscrire pour vous
				connecter au Carnet de bord.
			</div>
			<div>Vous n’êtes pas encore inscrit ? Avec un bouton « je m’inscris »</div>
		{:else if requestStep === 'success'}
			<div>
				Veuillez vérifier votre boîte mail {email}, vous allez recevoir un email avec un lien pour
				vous connecter au Carnet de bord.
			</div>
		{/if}
	</form>
</div>
