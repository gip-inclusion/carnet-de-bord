/// <reference types="@sveltejs/kit" />

export interface IBeneficiaire {
	id: number;
	nom: string;
	prenom: string;
	email: string;
	telPortable: string;
	numeroCaf: string;
	numeroPe: string;
}

export interface ImportMetaEnv {
	VITE_JWT_SECRET_KEY: string;
}
