<script lang="ts">
	import { goto } from '$app/navigation';

	import type { RequestStep } from '$lib/types';
	import { Button, Input, Link } from '$lib/ui/base';
	import { post } from '$lib/utils/post';

	let requestStep: RequestStep = 'start';
	let username: string;

	let magicLink = '';

	async function registration() {
		goto('/inscription');
	}

	async function handleSubmit() {
		const response = await post('/auth/login', { username });
		if (response.status === 401) {
			requestStep = 'error';
		}
		if (response.status === 200) {
			const { accessUrl } = await response.json();
			magicLink = accessUrl;
			requestStep = 'success';
		} else {
			magicLink = '';
		}
	}
</script>

<svelte:head>
	<title>Connexion - carnet de bord</title>
</svelte:head>

{#if requestStep !== 'success'}
	<h1>
		<div>Se connecter</div>
		<div>au Carnet de bord</div>
	</h1>
	<form class="flex w-full flex-col space-y-6" on:submit|preventDefault={handleSubmit}>
		<div>Veuillez saisir votre identifiant pour recevoir votre lien de connexion.</div>
		<div class="flex w-full flex-col gap-16">
			<div class="flex w-full flex-col gap-6">
				<Input
					bind:value={username}
					inputLabel="Identifiant"
					inputHint="Ex : Paul"
					error={requestStep === 'error'
						? "Ce nom d'utilisateur n'est pas rattaché à un compte existant"
						: ''}
					required={true}
				/>
				<div><Link href="/auth/oubli">J'ai oublié mon identifiant</Link></div>
				<div>
					<Button type="submit" disabled={!username}>Se connecter</Button>
				</div>
			</div>
			<div class="flex flex-col gap-6">
				<div class="text-sm font-bold">Vous n’êtes pas encore inscrit ?</div>
				<div>
					<Button outline={true} on:click={registration}>Je m'inscris</Button>
				</div>
			</div>
		</div>
	</form>
{:else}
	<div class="flex w-full flex-col gap-16">
		<div class="flex w-full flex-col gap-6">
			<h1 style="margin-bottom: 0;">
				<div>Connectez-vous</div>
				<div>au Carnet de bord</div>
			</h1>
			<div>Un lien vous a été envoyé pour vous connecter au Carnet de bord.</div>
			<!-- @TODO what is this button supposed to do?
					<div>
						<Button>J'ai compris</Button>
					</div>
					-->
			{#if magicLink}
				<div><Link href={magicLink}>Ouvrir carnet de bord</Link></div>
			{/if}
		</div>
		<div class="flex flex-col gap-6">
			<div class="text-sm">
				Si vous n'avez pas reçu le lien, vous pouvez cliquer sur le bouton ci-dessous.
			</div>
			<div>
				<Button outline={true}>Renvoyer le lien</Button>
			</div>
		</div>
	</div>
{/if}
