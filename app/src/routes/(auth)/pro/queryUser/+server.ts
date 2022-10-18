import { json as json$1 } from '@sveltejs/kit';
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
import * as yup from 'yup';

const { API_PARTICULIER_URL, API_PARTICULIER_TOKEN_CAF, API_PARTICULIER_TOKEN_PE } =
	getApiParticulierConfig();

const convertCAFUserToExternalUser =
	(cafNumber: string) =>
	(user: CAFResponse): ExternalUser[] | null => {
		return user.allocataires?.map((allocataire) => {
			const [firstname, lastname] = (allocataire.nomPrenom || '').split(' ');
			const cpVilleMatch = user.adresse.codePostalVille.match(/^([\d]+)\s(.+)$/);
			const address1 = [user.adresse.numeroRue, user.adresse.lieuDit]
				.filter((field) => Boolean(field))
				.join(' - ');
			const address2 = [user.adresse.complementIdentite, user.adresse.complementIdentiteGeo]
				.filter((field) => Boolean(field))
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
		.filter((field) => Boolean(field))
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

const queryUserSchema = yup.object().shape({
	service: yup.string().oneOf(['CAF', 'PE']).required(),
	data: yup.object().defined(),
});

type QueryUser = {
	service: 'CAF' | 'PE';
	data: unknown;
};

const validateBody = (body: unknown): body is QueryUser => {
	return queryUserSchema.isType(body);
};

export const POST: RequestHandler = async ({ request }) => {
	try {
		authorizeOnly(['professional'])(request);
	} catch (e) {
		return new Response(undefined, { status: 403 });
	}

	const body = await request.json();

	if (!validateBody(body)) {
		return json$1(
			{
				errors: 'INVALID_BODY',
			},
			{
				status: 400,
			}
		);
	}

	const { service, data } = body;

	let users: ExternalUser[] | null;

	try {
		if (service === 'CAF') {
			users = await getCAFUsers(data);
		} else if (service === 'PE') {
			users = await getPEUsers(data);
		}
	} catch (err) {
		return json$1(
			{
				error: err.message,
			},
			{
				status: 400,
			}
		);
	}

	if (!users) {
		return json$1(
			{
				error: "Impossible de trouver l'utilisateur demandé",
			},
			{
				status: 400,
			}
		);
	}

	return json$1({ users });
};
