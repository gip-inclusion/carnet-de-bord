<script lang="ts">
	import Input from './Input.svelte';
</script>

<Input inputLabel="Prénom" placeholder="Jean-Baptiste" name="firstname" required />
<Input inputLabel="Nom" placeholder="Poquelin" name="lastname" required />
<Input
	type="date"
	inputLabel="Date de naissance"
	placeholder="21/12/1977"
	inputHint="Format JJ/MM/AAAA"
	name="dateOfBirth"
	required
/>
<Input inputLabel="Courriel" placeholder="jb@poquelin.fr" name="email" />
<Input inputLabel="Téléphone" placeholder="0123456789" name="mobileNumber" />
<Input inputLabel="Adresse" placeholder="55-57 rue du Faubourg Saint-Honoré" name="address1" />
<Input inputLabel="Adresse (complément)" placeholder="1er étage" name="address2" />
<Input inputLabel="Code postal" placeholder="75008" name="postalCode" />
<Input inputLabel="Ville" placeholder="Paris" name="city" />
