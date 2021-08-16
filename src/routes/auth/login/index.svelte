<script lang="ts">
	import { Button, Input, Link } from '$lib/ui/base';
	import { post } from '$lib/utils/post';

	type RequestStep = 'start' | 'success' | 'error';

	let requestStep: RequestStep = 'start';
	let username: string;

	async function handleSubmit() {
		const { protocol, host } = window.location;
		const response = await post('/auth/login', { username, appUrl: `${protocol}//${host}` });
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
				<div>Veuillez saisir votre identifiant pour recevoir votre lien de connexion.</div>
				<div class="flex w-full flex-col gap-16">
					<div class="flex w-full flex-col gap-6">
						<Input
							bind:val={username}
							inputLabel="Identifiant"
							inputHint="Ex : Manu"
							error={requestStep === 'error'
								? "Ce nom d'utilisateur n'est pas rattaché à un compte existant"
								: ''}
						/>
						<div><Link href="/auth/oubli">J'ai oublié mon identifiant</Link></div>
						<div>
							<Button type="submit" disabled={!username}>Se connecter</Button>
						</div>
					</div>
					<div class="flex flex-col gap-6">
						<div class="text-sm font-bold">Vous n’êtes pas encore inscrit ?</div>
						<div>
							<Button outline={true}>Je m'inscris</Button>
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
	</div>
</div>
