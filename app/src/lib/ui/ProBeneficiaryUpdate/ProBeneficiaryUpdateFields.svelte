<script context="module" lang="ts">
	export type Field = 'firstname' | 'lastname' | 'dateOfBirth';
</script>

<script lang="ts">
	import { rsaRightKeys } from '$lib/constants/keys';

	import Input from '$lib/ui/forms/Input.svelte';
	import { Checkbox, Radio } from '../forms';

	export let forbiddenFields: Field[];

	function isFieldDisabled(fieldName: Field) {
		return forbiddenFields.includes(fieldName);
	}

	function titleForField(fieldName: Field) {
		return isFieldDisabled(fieldName)
			? 'Ce champ n‘est pas modifiable. Si toutefois vous devez y apporter une modification, merci de nous contacter par chat.'
			: '';
	}
</script>

<Input
	inputLabel="Prénom"
	placeholder="Jean-Baptiste"
	name="firstname"
	required
	disabled={isFieldDisabled('firstname')}
	title={titleForField('firstname')}
/>

<Input
	inputLabel="Nom"
	placeholder="Poquelin"
	name="lastname"
	required
	disabled={isFieldDisabled('lastname')}
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
	disabled={isFieldDisabled('dateOfBirth')}
	title={titleForField('dateOfBirth')}
/>

<Input inputLabel="Courriel" placeholder="jb@poquelin.fr" name="email" />
<Input inputLabel="Téléphone" placeholder="0123456789" name="mobileNumber" class="max-w-max" />
<Input inputLabel="Adresse" placeholder="55-57 rue du Faubourg Saint-Honoré" name="address1" />
<Input inputLabel="Adresse (complément)" placeholder="1er étage" name="address2" />
<div class="fr-grid-row fr-grid-row--gutters">
	<Input
		class="fr-col-3 max-w-max"
		inputLabel="Code postal"
		placeholder="75008"
		name="postalCode"
	/>
	<Input class="fr-col-9" inputLabel="Ville" placeholder="Paris" name="city" />
</div>

<Radio legend="Revenu de solidarité active (RSA)" name="rightRsa" options={rsaRightKeys.options} />

<div class="fr-form-group">
	<div class="pb-2 font-bold">Autres aides</div>
	<Checkbox name="rightAre" label="ARE" />
	<Checkbox name="rightAss" label="ASS" />
	<Checkbox name="rightBonus" label="Prime d'activité" />
</div>
