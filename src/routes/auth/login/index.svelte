<script lang="ts">
	import Button from '$lib/ui/base/Button.svelte';
	import { post } from '$lib/utils/post';

	type RequestStep = 'start' | 'success' | 'error';

	let requestStep: RequestStep = 'start';
	let username;

	async function handleSubmit() {
		const { protocol, host } = window.location;
		const response = await post(`/auth/login`, { username, appUrl: `${protocol}//${host}` });
		if (response.status === 401) {
			requestStep = 'error';
		}
		if (response.status === 200) {
			requestStep = 'success';
		}
	}
</script>

<h1 class="mt-4 mb-20 text-3xl font-bold text-center">
	<div>Faciliter la vie des personnes en insertion</div>
	<div>et de leurs accompagnants</div>
</h1>
<div class="flex gap-x-4">
	<div class="w-1/2 bg-back2" />
	{#if requestStep !== 'success'}
		<form class="w-1/2 flex flex-col" on:submit|preventDefault={handleSubmit}>
			<div class="pt-4 pb-12">
				<div class="text-1xl font-bold pt-8">Veuillez saisir votre nom d'utilisateur</div>
				<div class="text-xs">pour recevoir pour lien de connexion</div>
			</div>
			<div class="flex flex-col gap-16">
				<div class="flex flex-col gap-6">
					<div>
						<input
							class="border-b-2 border-black border-opacity-30 h-10 bg-gray-100 w-full"
							required
							bind:value={username}
						/>
						{#if requestStep === 'error'}
							<div class="text-xs text-error pt-4">
								Cet nom d'utilisateur n’est pas rattaché à un compte existant.
							</div>
						{/if}
					</div>
					<div class="flex items-center justify-end">
						<Button type="submit" disabled={!username}>Valider</Button>
					</div>
				</div>
				<div class="flex justify-between items-center">
					<div class="text-sm">Vous n’êtes pas encore inscrit ?</div>
					<Button style="outline">Je m'inscris</Button>
				</div>
			</div>
		</form>
	{:else}
		<div class="w-1/2 flex">
			<div class="pt-4 pb-12 text-xl leading-relaxed font-thin">
				<div>Veuillez vérifier votre boîte mail.</div>
				<div>un lien vous a été envoyé pour vous connecter au Carnet de bord.</div>
			</div>
		</div>
	{/if}
</div>
