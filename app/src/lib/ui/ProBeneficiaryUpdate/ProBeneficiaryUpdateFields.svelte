<script context="module" lang="ts">
	export type Field =
		| 'firstname'
		| 'lastname'
		| 'nir'
		| 'dateOfBirth'
		| 'rightRsa'
		| 'rightAre'
		| 'rightAss'
		| 'rightBonus';
</script>

<script lang="ts">
	import { rsaRightKeys } from '$lib/constants/keys';

	import Input from '$lib/ui/forms/Input.svelte';
	import { Checkbox, Radio } from '../forms';

	export let disabledFields: Field[];

	function titleForField(fieldName: Field) {
		return disabledFields.includes(fieldName)
			? 'Ce champ n‘est pas modifiable. Si toutefois vous devez y apporter une modification, merci de nous contacter par chat.'
			: '';
	}
</script>

<Input
	inputLabel="Prénom"
	placeholder="Jean-Baptiste"
	name="firstname"
	required
	disabled={disabledFields.includes('firstname')}
	title={titleForField('firstname')}
/>

<Input
	inputLabel="Nom"
	placeholder="Poquelin"
	name="lastname"
	required
	disabled={disabledFields.includes('lastname')}
	title={titleForField('lastname')}
/>

<Input
	class="max-w-max"
	type="date"
	inputLabel="Date de naissance"
	placeholder="21/12/1977"
	inputHint="Format JJ/MM/AAAA"
	name="dateOfBirth"
	required
	disabled={disabledFields.includes('dateOfBirth')}
	title={titleForField('dateOfBirth')}
/>

<Input
	inputLabel="NIR"
	placeholder="1234567890123"
	type="text"
	pattern={'[0-9]{13}'}
	name="nir"
	disabled={disabledFields.includes('nir')}
	title={titleForField('nir')}
/>

<Input inputLabel="Courriel" placeholder="jb@poquelin.fr" name="email" />
<Input inputLabel="Téléphone" placeholder="0123456789" name="mobileNumber" class="max-w-max" />
<Input inputLabel="Adresse" placeholder="55-57 rue du Faubourg Saint-Honoré" name="address1" />
<Input inputLabel="Adresse (complément)" placeholder="1er étage" name="address2" />
<div class="fr-grid-row fr-grid-row--gutters">
	<Input
		class="fr-col-3 mb-1 max-w-max"
		inputLabel="Code postal"
		placeholder="75008"
		name="postalCode"
	/>
	<Input class="fr-col-9 mb-1" inputLabel="Ville" placeholder="Paris" name="city" />
</div>

<div class="fr-form-group mt-6">
	<Radio
		legend="Revenu de solidarité active (RSA)"
		name="rightRsa"
		options={rsaRightKeys.options}
		disabled={disabledFields.includes('rightRsa')}
	/>
</div>

<div class="fr-fieldset">
	<legend class="fr-fieldset__legend--regular fr-fieldset__legend">Autres aides</legend>
	<div class="fr-fieldset__element">
		<Checkbox name="rightAre" label="ARE" disabled={disabledFields.includes('rightAre')} />
	</div>
	<div class="fr-fieldset__element">
		<Checkbox name="rightAss" label="ASS" disabled={disabledFields.includes('rightAss')} />
	</div>
	<div class="fr-fieldset__element">
		<Checkbox
			name="rightBonus"
			label="Prime d'activité"
			disabled={disabledFields.includes('rightBonus')}
		/>
	</div>
</div>
