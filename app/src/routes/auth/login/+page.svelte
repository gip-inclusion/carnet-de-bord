<script lang="ts">
	import { Button, Input } from '$lib/ui/base';
	import { post } from '$lib/utils/post';
	import type { RequestStep } from '$lib/types';

	let request: RequestStep = 'start';
	let username = '';
	let errorMessage = '';
	let magicLink = '';

	async function handleSubmit() {
		request = 'loading';
		magicLink = '';
		try {
			const { accessUrl } = await post<{ accessUrl?: string }>('/auth/login', { username });
			magicLink = accessUrl;
			request = 'success';
		} catch (error) {
			request = 'error';
			console.error(error.statusText, error.status, error.message);
			if (error.message === 'ACCOUNT_NOT_FOUND') {
				errorMessage = "Ce courriel n'est pas rattaché à un compte existant";
			} else if (error.message === 'ACCOUNT_NOT_CONFIRMED') {
				errorMessage =
					"Ce compte n'est pas confirmé. Contactez votre administrateur de territoire de Carnet de Bord.";
			} else {
				errorMessage = 'Une erreur est survenue, veuillez ré-essayer ultérieurement.';
			}
		}
	}
</script>

<svelte:head>
	<title>Connexion - Carnet de bord</title>
</svelte:head>

<h1>
	<div>Se connecter</div>
	<div>au Carnet de bord</div>
</h1>
{#if request !== 'success'}
	<form class="flex w-full flex-col space-y-6" on:submit|preventDefault={handleSubmit}>
		<div>Veuillez saisir votre adresse de courriel pour recevoir votre lien de connexion.</div>
		<div class="flex w-full flex-col gap-8">
			<div class="flex w-full flex-col gap-4">
				<Input
					class="!mb-0"
					bind:value={username}
					inputLabel="Courriel"
					placeholder="nour@social.gouv.fr"
					error={request === 'error' ? errorMessage : ''}
					required={true}
				/>
				<div>
					<Button type="submit" disabled={!username || request === 'loading'}>
						{#if request === 'loading'}
							<span class="ri ri-refresh-line" /> Connexion...
						{:else}
							Se connecter
						{/if}
					</Button>
				</div>
			</div>
		</div>
	</form>
{:else}
	<div class="flex w-full flex-col gap-16">
		<div class="flex w-full flex-col gap-6">
			<div>Un lien vous a été envoyé pour vous connecter au Carnet de bord.</div>
			{#if magicLink}
				<div><a href={magicLink}>Ouvrir Carnet de bord</a></div>
			{/if}
		</div>
		<div class="flex flex-col gap-6">
			<div class="text-sm">
				Si vous n'avez pas reçu le lien, vous pouvez cliquer sur le bouton ci-dessous.
			</div>
			<div>
				<!-- le bouton devrait être supprimé mais il permet à l'utilisateur de faire une action pour patienter pendant que le courriel est délivré -->
				<Button outline={true}>Renvoyer le lien</Button>
			</div>
		</div>
	</div>
{/if}
