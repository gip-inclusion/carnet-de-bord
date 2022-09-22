<script lang="ts">
	import Input from '$lib/ui/forms/Input.svelte';
</script>

<Input inputLabel="Prénom" placeholder="Jean-Baptiste" name="firstname" required />
<Input inputLabel="Nom" placeholder="Poquelin" name="lastname" required />
<Input
	class="max-w-max"
	type="date"
	inputLabel="Date de naissance"
	placeholder="21/12/1977"
	inputHint="Format JJ/MM/AAAA"
	name="dateOfBirth"
	required
/>
<Input inputLabel="Courriel" placeholder="jb@poquelin.fr" name="email" />
<Input inputLabel="Téléphone" placeholder="0123456789" name="mobileNumber" class="max-w-max" />
<Input inputLabel="Adresse" placeholder="55-57 rue du Faubourg Saint-Honoré" name="address1" />
<Input inputLabel="Adresse (complément)" placeholder="1er étage" name="address2" />
<div class="fr-grid-row fr-grid-row--gutters ">
	<Input
		class="fr-col-3 max-w-max"
		inputLabel="Code postal"
		placeholder="75008"
		name="postalCode"
	/>
	<Input class="fr-col-9" inputLabel="Ville" placeholder="Paris" name="city" />
</div>
