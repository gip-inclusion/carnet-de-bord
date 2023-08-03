<script lang="ts">
	import { openComponent } from '$lib/stores';
	import type {
		Professional,
		ProfessionalSetInput,
		StructureOrientationSystem,
	} from '$lib/graphql/_gen/typed-document-nodes';
	import { mutation, operationStore } from '@urql/svelte';
	import { UpdateProfessionalAccountDocument } from '$lib/graphql/_gen/typed-document-nodes';
	import { Form, Input } from '$lib/ui/forms';
	import { Alert, Button, Checkboxes } from '../base/';
	import { proAccountSchema } from '$lib/ui/ProCreationForm/pro.schema';
	import type { LabelName } from '$lib/types';
	import { captureException } from '$lib/utils/sentry';

	export let professional: Professional;

	let errorMessage = '';

	function closeLayer() {
		openComponent.close();
	}

	const updateProfessionalAccountStore = operationStore(UpdateProfessionalAccountDocument);
	const updateProfessionalAccount = mutation(updateProfessionalAccountStore);

	function buildOrientationSystemOptions(
		structureOrientationSystems: StructureOrientationSystem[] = []
	): LabelName[] {
		const options = structureOrientationSystems.map(({ orientationSystem }) => {
			return {
				label: orientationSystem.name,
				name: orientationSystem.id,
			};
		});
		options.sort((leftOption, rightOption) => leftOption.label.localeCompare(rightOption.label));
		return options;
	}

	const orientationSystemOptions = buildOrientationSystemOptions(
		professional.structure.orientationSystems
	);

	let orientationSystems: string[] = professional.orientationSystems.map(
		({ orientationSystem }) => {
			return orientationSystem.id;
		}
	);

	async function editProfessionalAccountSubmitHandler(payload: ProfessionalSetInput) {
		try {
			const orientationSystemsValues = orientationSystems.map((orientationSystemId) => {
				return { orientationSystemId, professionalId: professional.id };
			});
			await updateProfessionalAccount({
				id: professional.id,
				payload,
				orientationSystems: orientationSystemsValues,
			});
			if (updateProfessionalAccountStore.error) {
				console.error(updateProfessionalAccountStore.error);
				captureException(updateProfessionalAccountStore.error);
				errorMessage = 'Impossible de modifier ce professionnel';
			} else {
				closeLayer();
			}
		} catch (error) {
			console.error(error);
			captureException(error);
			errorMessage = 'Impossible de modifier ce professionnel';
		}
	}
</script>

<div class="flex flex-col gap-6">
	<div>
		<h1>Mettre à jour les informations du professionnel</h1>
	</div>

	<Form
		initialValues={{
			firstname: professional.firstname,
			lastname: professional.lastname,
			email: professional.email,
			mobileNumber: professional.mobileNumber,
			position: professional.position,
		}}
		validationSchema={proAccountSchema}
		onSubmit={editProfessionalAccountSubmitHandler}
		let:isSubmitting
		let:isSubmitted
		let:isValid
	>
		<div class="max-w-sm">
			<h2 class="text-vert-cdb fr-h4">Informations personnelles</h2>

			<Input placeholder="Jean Baptiste" inputLabel="Prénom" name="firstname" required />
			<Input placeholder="Poquelin" inputLabel="Nom" name="lastname" required />
			<Input placeholder="b@poquelin.fr" inputLabel="Courriel" name="email" required />
			<Input placeholder="0789542136" inputLabel="Numéro de téléphone" name="mobileNumber" />
			<Input placeholder="Conseiller en insertion" inputLabel="Position" name="position" />

			<h2 class="text-vert-cdb fr-h4">Dispositifs d'accompagnement</h2>

			{#if orientationSystemOptions.length === 0}
				<p>Aucun dispositif d'accompagnement affecté à cette structure.</p>
			{:else}
				<Checkboxes
					globalClassNames={'flex flex-row flex-wrap gap-4'}
					checkboxesCommonClassesNames={'!mt-0 w-5/12'}
					caption={''}
					bind:selectedOptions={orientationSystems}
					options={orientationSystemOptions}
					name="orientationSystems"
				/>
			{/if}

			<div class="flex flex-row gap-6 mt-12">
				<Button type="submit" disabled={(isSubmitted && !isValid) || isSubmitting}
					>Enregistrer les modifications</Button
				>
				<Button outline={true} on:click={closeLayer}>Annuler</Button>
			</div>
		</div>
	</Form>
	{#if errorMessage}
		<div class="mb-8">
			<Alert type="error" description={errorMessage} />
		</div>
	{/if}
</div>
