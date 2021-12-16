<script lang="ts">
	import { CreateDeploymentDocument } from '$lib/graphql/_gen/typed-document-nodes';
	import { openComponent } from '$lib/stores';

	import { mutation, operationStore } from '@urql/svelte';
	import { Button, Input } from '$lib/ui/base';

	const deploymentStore = operationStore(CreateDeploymentDocument);
	const insertDeployment = mutation(deploymentStore);

	const deployment = {
		label: '',
	};
	const manager = {
		firstname: '',
		lastname: '',
		email: '',
		account: {
			data: {
				username: '',
				type: 'manager',
			},
		},
	};

	async function handleSubmit() {
		// todo validate inputs
		try {
			await insertDeployment({
				object: { label: deployment.label, managers: { data: [manager] } },
			});
			openComponent.close();
		} catch (err) {
			console.error(err);
		}
	}
	function close() {
		openComponent.close();
	}
</script>

<div class="flex flex-col gap-6">
	<div>
		<h1>Ajouter un Déploiement</h1>
		<p class="mb-0">
			Veuillez renseigner les informations ci-dessous pour créer un nouveau déploiement. Un
			déploiement permet de rattacher des structures, professionnels et bénéficiaires.
		</p>
	</div>

	<form class="flex flex-col gap-6" on:submit|preventDefault={handleSubmit}>
		<Input name="account" required inputLabel="Nom du déploiement" bind:value={deployment.label} />
		<div>
			<fieldset>
				<legend>Responsable</legend>
				<Input
					name="account"
					required
					inputLabel="Identifiant"
					bind:value={manager.account.data.username}
				/>
				<Input name="firstname" required inputLabel="Prénom" bind:value={manager.firstname} />
				<Input name="lastname" required inputLabel="Nom" bind:value={manager.lastname} />
				<Input name="email" required inputLabel="Courriel" bind:value={manager.email} />
			</fieldset>
		</div>
		<div class="flex flex-row gap-6 mt-12">
			<Button type="submit">Créer le déploiement</Button>
			<Button outline={true} on:click={close}>Annuler</Button>
		</div>
	</form>
</div>
