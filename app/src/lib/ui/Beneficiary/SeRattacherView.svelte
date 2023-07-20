<script context="module" lang="ts">
	import { Button } from '$lib/ui/base';
	import { Form, Select, Radio } from '$lib/ui/forms';
	import { Alert } from '$lib/ui/base';
	import type { GetProfessionalOrientationOptionsQuery } from '$lib/graphql/_gen/typed-document-nodes';
	import type { Option } from '$lib/types';
	import * as yup from 'yup';

	export type OrientationOption = GetProfessionalOrientationOptionsQuery['orientation'][number];
	function toOrientationOption(orientation: OrientationOption): Option {
		return { name: orientation.id, label: orientation.name };
	}

	const options: Option[] = [
		{ name: 'referent', label: 'Oui' },
		{ name: 'no_referent', label: 'Non' },
	];

	const addMemberSchema = yup.object().shape({
		memberType: yup.string().oneOf(['referent', 'no_referent']).required(),
		orientation: yup.string().uuid().when('memberType', {
			is: 'referent',
			then: yup.string().uuid().required(),
		}),
	});
	export type addMemberType = yup.InferType<typeof addMemberSchema>;
</script>

<script lang="ts">
	export let orientations: OrientationOption[];
	export let onSubmit: (values: addMemberType) => void;

	let orientationOptions: Option[];
	$: orientationOptions = orientations.map(toOrientationOption) || [];
	$: initialValues = {
		memberType: 'no_referent',
		orientation: orientationOptions?.length === 1 ? orientationOptions[0].name : undefined,
	};
</script>

<Form {initialValues} validationSchema={addMemberSchema} {onSubmit} let:form>
	<Radio
		legend="Bénéficiez-vous d'un mandat d'orientation en la qualité de référent ?"
		name="memberType"
		{options}
		ariaControls="orientation-system"
	/>
	{#if form.memberType === 'referent'}
		{#if orientationOptions.length}
			<div class="fr-form-group pb-6">
				<Select
					options={orientationOptions}
					name="orientation"
					selectLabel="Dispositif d’accompagnement"
					required
				/>
			</div>
		{:else}
			<div class="pb-6">
				<Alert
					type="error"
					size="sm"
					description={`Vous ne pouvez pas vous rattacher à ce bénéficiaire en tant que référent car aucun dispositif ne vous a été attribué. Vérifiez auprès du gestionnaire de votre structure que vous disposez des habilitations nécessaire.`}
				/>
			</div>
		{/if}
	{/if}
	<Button type="submit" disabled={form.memberType === 'referent' && orientationOptions.length === 0}
		>Se rattacher</Button
	>
</Form>
