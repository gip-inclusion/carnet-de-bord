/// <reference types="@sveltejs/kit" />

export interface IBeneficiaire {
	id: number;
	nom: string;
	prenom: string;
	email: string;
	emtelPortable: string;
	numeroCaf: string;
	numeroPe: string;
}
