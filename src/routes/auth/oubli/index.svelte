<script lang="ts">
	import { Button, Input } from '$lib/ui/base';
	import { post } from '$lib/utils/post';

	type RequestStep = 'start' | 'success' | 'error';

	let requestStep: RequestStep = 'start';
	let email: string;

	async function handleSubmit() {
		const { protocol, host } = window.location;

		/* @TODO support account recovery for other types; either through a selector or automagically? */
		const type = 'professional';

		const response = await post('/auth/oubli', {
			email,
			type,
			appUrl: `${protocol}//${host}`
		});
		if (response.status === 401) {
			requestStep = 'error';
		}
		if (response.status === 200) {
			requestStep = 'success';
		}
	}
</script>

<div class="flex flex-row">
	<div class="w-1/2 bg-gray-bg"><img src="" alt="" /></div>
	<div class="w-1/2 p-20">
		{#if requestStep !== 'success'}
			<h1 class="">
				<div>Se connecter</div>
				<div>au Carnet de bord</div>
			</h1>
			<form class="flex w-full flex-col space-y-6" on:submit|preventDefault={handleSubmit}>
				<div>Veuillez saisir votre adresse de courriel pour recevoir votre identifiant.</div>
				<div class="flex w-full flex-col gap-16">
					<div class="flex w-full flex-col gap-6">
						<Input
							bind:val={email}
							inputLabel="Adresse de courriel"
							inputHint="Ex : manu@elysee.fr"
							error={requestStep === 'error'
								? "Cette adresse de courriel n'est pas rattachée à un compte existant"
								: ''}
						/>
						<div>
							<Button type="submit" disabled={!email}>Envoyer</Button>
						</div>
					</div>
				</div>
			</form>
		{:else}
			<div class="flex w-full flex-col gap-16">
				<div class="flex w-full flex-col gap-6">
					<h1 style="margin-bottom: 0;">
						<div>Demande de rappel</div>
						<div>d'identifiant envoyée !</div>
					</h1>
					<div>Nous avons bien pris en compte votre demande.</div>
					<div>
						Vous recevrez un email contenant votre identifiant et un lien pour vous connecter au
						Carnet de bord.
					</div>
					<!-- @TODO what is this button supposed to do?
					<div>
						<Button>J'ai compris</Button>
					</div>
					-->
				</div>
			</div>
		{/if}
	</div>
</div>
