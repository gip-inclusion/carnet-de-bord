import { getApiParticulierConfig } from '$lib/config/variables/private';
import type { CAFResponse, PEResponse } from '$lib/services/particuliers.api';
import {
	isCAFData,
	isPEData,
	requestCAFUsers,
	requestPEUser,
} from '$lib/services/particuliers.api';
import type { ExternalUser } from '$lib/types';
import { authorizeOnly } from '$lib/utils/security';
import type { RequestHandler } from '@sveltejs/kit';

const { API_PARTICULIER_URL, API_PARTICULIER_TOKEN_CAF, API_PARTICULIER_TOKEN_PE } =
	getApiParticulierConfig();

const convertCAFUserToExternalUser =
	(cafNumber: string) =>
	(user: CAFResponse): ExternalUser[] | null => {
		return user.allocataires?.map((allocataire) => {
			const [firstname, lastname] = (allocataire.nomPrenom || '').split(' ');
			const cpVilleMatch = user.adresse.codePostalVille.match(/^([\d]+)\s(.+)$/);
			const address1 = [user.adresse.numeroRue, user.adresse.lieuDit].filter(Boolean).join(' - ');
			const address2 = [user.adresse.complementIdentite, user.adresse.complementIdentiteGeo]
				.filter(Boolean)
				.join(', ');
			return {
				firstname,
				lastname,
				postalCode: cpVilleMatch && cpVilleMatch[1],
				city: cpVilleMatch ? cpVilleMatch[2] : user.adresse.codePostalVille,
				address1,
				address2,
				dateOfBirth: `${allocataire.dateDeNaissance.slice(-4)}-${allocataire.dateDeNaissance.slice(
					2,
					4
				)}-${allocataire.dateDeNaissance.slice(0, 2)}`,
				cafNumber,
			};
		});
	};

const getCAFUsers = async (data: unknown): Promise<ExternalUser[] | null> => {
	if (!isCAFData(data)) {
		return null;
	}

	const cafNumber = data.idCAF;

	return requestCAFUsers(API_PARTICULIER_URL, API_PARTICULIER_TOKEN_CAF, data).then(
		convertCAFUserToExternalUser(cafNumber)
	);
};
const convertPEUserToExternalUser = (user: PEResponse): ExternalUser => {
	const address2 = [user.adresse.ligneComplementDistribution, user.adresse.ligneComplementAdresse]
		.filter(Boolean)
		.join(', ');
	const address1 = user.adresse.ligneVoie;
	return {
		firstname: user.prenom,
		lastname: user.nom,
		dateOfBirth: user.dateNaissance,
		mobileOrPhoneNumber: user.telephone ?? user.telephone2,
		address1,
		address2,
		email: user.email,
		city: user.adresse.localite,
		postalCode: user.adresse.codePostal,
		peNumber: user.identifiant,
	};
};

const getPEUsers = async (data: unknown): Promise<ExternalUser[] | null> => {
	if (!isPEData(data)) {
		return null;
	}

	const user: PEResponse | null = await requestPEUser(
		API_PARTICULIER_URL,
		API_PARTICULIER_TOKEN_PE,
		data
	);

	if (user) {
		return [convertPEUserToExternalUser(user)];
	}
	return null;
};

export const post: RequestHandler = async (request) => {
	try {
		authorizeOnly(['professional'])(request);
	} catch (e) {
		return {
			status: 403,
		};
	}

	const { service, data } = request.body as unknown as {
		service: 'CAF' | 'PE';
		data: unknown;
	};

	let users: ExternalUser[] | null;

	try {
		if (service === 'CAF') {
			users = await getCAFUsers(data);
		} else if (service === 'PE') {
			users = await getPEUsers(data);
		}
	} catch (err) {
		return {
			status: 400,
			body: {
				error: err.message,
			},
		};
	}

	if (!users) {
		return {
			status: 400,
			body: {
				error: "Impossible de trouver l'utilisateur demandé",
			},
		};
	}

	return {
		status: 200,
		body: { users },
	};
};
