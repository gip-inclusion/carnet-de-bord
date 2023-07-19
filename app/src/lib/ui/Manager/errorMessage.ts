export function translateError(error = ''): string {
	if (/none is not an allowed value/i.test(error)) {
		return `Champ obligatoire manquant`;
	}
	if (/not a valid email address/i.test(error)) {
		return `Format d'adresse mail invalide`;
	}
	if (/not a valid siret/i.test(error)) {
		return `Numéro siret invalide`;
	}
	if (/not a valid phone/i.test(error)) {
		return `Numéro de téléphone invalide`;
	}
	if (/not a valid postal code/i.test(error)) {
		return `Code postal invalide`;
	}
	if (/URL/i.test(error)) {
		return `Format d'URL invalide`;
	}
	if (/insert structure failed/i.test(error)) {
		return 'Création de la structure impossible';
	}
	if (/insert structure admin failed/i.test(error)) {
		return 'Création du gestionnaire de structure impossible';
	}
	if (/add admin structure to structure failed/i.test(error)) {
		return 'Ajout du gestionnaire à la structure impossible';
	}
	if (/value is not a known date format/i.test(error)) {
		return 'Format de date incorrect';
	}
	if (/NIR/i.test(error)) {
		return 'Format de NIR incorrect';
	}
	if (/value unknown/i.test(error)) {
		return 'Valeur non supportée';
	}
	if (/allowed value/i.test(error)) {
		return 'Valeur non supportée';
	}
	if (/Les parenthèses ne sont pas autorisées dans les noms/i.test(error)) {
		return error;
	}
	console.error('unhandle import error message', error);
	return `Une erreur s'est produite lors de la lecture du fichier.`;
}
