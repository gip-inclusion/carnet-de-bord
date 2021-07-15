/// <reference types="@sveltejs/kit" />

export type EtatCivile = {
	civilite: !string;
	nom: !string;
	prenom: !string;
};

export type Adresse = {
	codePostal: string;
	commune: string;
	voie: string;
};

export type Contact = {
	email: string;
	telPortable: string;
};

export interface ICompte {
	id: string;
	beneficiaire: IBeneficiaire;
	professionnelle: IProfessionnel;
}

export interface IBeneficiaire {
	id: string;
	numeroCaf: string;
	numeroPe: string;
	etatCivile: EtatCivile;
	adresse: Adresse;
	contact: Contact;
}

export interface IProfessionnel {
	id: string;
	etatCivile: EtatCivile;
	contact: Contact;
	structure: Structure;
}

export interface IStructure {
	id: string;
	nom: string;
	adresse: Adresse;
}

export interface ImportMetaEnv {
	VITE_JWT_SECRET_KEY: string;
}
