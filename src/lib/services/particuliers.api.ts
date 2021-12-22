export type CAFResponse = {
	allocataires?: Array<{
		nomPrenom?: string;
		dateDeNaissance?: string;
		sexe?: 'M' | 'F';
	}>;
	enfants?: Array<{
		nomPrenom?: string;
		dateDeNaissance?: string;
		sexe?: 'M' | 'F';
	}>;
	adresse?: {
		identite?: string;
		complementIdentite?: string;
		complementIdentiteGeo?: string;
		numeroRue?: string;
		lieuDit?: string;
		codePostalVille?: string;
		pays?: string;
	};
	quotientFamilial?: number;
	annee?: number;
	mois?: number;
};

export type CAFData = { idCAF: string; postalCode: string };

export type PEResponse = {
	civilite?: string;
	nom?: string;
	nomUsage?: string;
	prenom?: string;
	sexe?: string;
	dateNaissance?: string; // '2021-08-31'
	telephone?: string;
	telephone2?: string;
	email?: string;
	adresse?: {
		codePostal?: string;
		INSEECommune?: string;
		localite?: string;
		ligneVoie?: string;
		ligneComplementDestinaire?: string;
		ligneComplementAdresse?: string;
		ligneComplementDistribution?: string;
		ligneNom?: string;
	};
	identifiant?: string;
	dateInscription?: string;
	dateCessationInscription?: string;
	codeCategorieInscription?: number;
	libelleCategorieInscription?: string;
};

export type PEData = { idPE: string; postalCode: string };

export const isCAFData = (_data: unknown): _data is CAFData => {
	return true;
};

export const requestCAFUsers = async (
	apiEndpoint: string,
	token: string,
	data: CAFData
): Promise<CAFResponse | null> => {
	const endpointCAF = `${apiEndpoint}/v2/composition-familiale`;
	const queryCAF = { numeroAllocataire: data.idCAF, codePostal: data.postalCode };
	const url = new URL(endpointCAF);
	url.search = new URLSearchParams(queryCAF).toString();

	return fetch(url.toString(), {
		method: 'GET',
		headers: {
			'X-Api-Key': token,
			'Content-Type': 'application/json',
		},
	}).then((response) => {
		if (response.status === 200) {
			return response.json();
		}
		throw new Error('Impossible de se connecter au service demandé.');
	});
};

export const isPEData = (_data: unknown): _data is PEData => {
	return true;
};

export const requestPEUser = async (
	apiEndpoit: string,
	token: string,
	data: PEData
): Promise<PEResponse | null> => {
	const endpointPE = `${apiEndpoit}/v2/situations-pole-emploi`;
	const identifiant = data.idPE;
	const queryPE = { identifiant };
	const url = new URL(endpointPE);
	url.search = new URLSearchParams(queryPE).toString();

	return fetch(url.toString(), {
		method: 'GET',
		headers: {
			'X-Api-Key': token,
			'Content-Type': 'application/json',
		},
	}).then((response) => {
		if (response.status === 200) {
			return response.json();
		}
		throw new Error('Impossible de se connecter au service demandé.');
	});
};
