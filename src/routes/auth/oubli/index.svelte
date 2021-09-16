<script lang="ts">
	import type { RequestStep } from '$lib/types';
	import { Button, Input } from '$lib/ui/base';
	import { post } from '$lib/utils/post';

	let requestStep: RequestStep = 'start';
	let email: string;

	async function handleSubmit() {
		const response = await post('/auth/oubli', {
			email,
		});
		if (response.status === 401) {
			requestStep = 'error';
		}
		if (response.status === 200) {
			requestStep = 'success';
		}
	}
</script>

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
					inputHint="Ex : paul@cdb.fr"
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
				Vous recevrez un email contenant votre identifiant et un lien pour vous connecter au Carnet
				de bord.
			</div>
			<!-- @TODO what is this button supposed to do?
					<div>
						<Button>J'ai compris</Button>
					</div>
					-->
		</div>
	</div>
{/if}
