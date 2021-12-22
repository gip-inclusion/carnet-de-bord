import type {
	NotebookFocusInsertInput,
	NotebookTargetInsertInput,
} from '$lib/graphql/_gen/typed-document-nodes';
import type { BeneficiaryAccount } from '$lib/types';
import type { EndpointOutput } from '@sveltejs/kit';
import type { ServerRequest } from '@sveltejs/kit/types/hooks';
import type {
	ExternalDeploymentApiBody,
	ExternalDeploymentApiOutput,
} from '../actions/update_notebook';
import type { MarneInput, MarneTarget } from './marne.types';

export const post = async (
	request: ServerRequest<unknown, ExternalDeploymentApiBody>
): Promise<EndpointOutput<ExternalDeploymentApiOutput | string>> => {
	try {
		const { url, headers, input, professionalId, notebookId } = request.body;
		const data: MarneInput = await fetch(`${url}${urlify(input)}`, { headers }).then((response) => {
			if (response.ok) {
				return response.json();
			}
			Promise.reject(response.json());
		});
		return {
			status: 200,
			body: parse(data, professionalId, notebookId),
		};
	} catch (error) {
		console.error(error, request.body.input);
		return {
			status: 500,
			body: 'API PARSE ERROR',
		};
	}
};

function parse(
	data: MarneInput,
	professionalId: string,
	notebookId: string
): ExternalDeploymentApiOutput {
	return {
		notebook: {
			...(data.educationLevel && { educationLevel: data.educationLevel }),
			...(data.rightRsa && { rightRsa: data.rightRsa }),
			...getLastContracts(data),
		},
		beneficiary: Object.fromEntries(
			Object.entries(parseBeneficiary(data)).filter(([_, v]) => v != null)
		),
		focuses: parseFocuses(data, professionalId, notebookId),
	};
}

function parseBeneficiary(
	data: Omit<MarneInput, 'educationLevel' | 'rightRsa' | 'contracts' | 'axeDeTravails'>
): BeneficiaryAccount {
	return {
		firstname: capitalize(data.firstname),
		lastname: capitalize(data.lastname),
		dateOfBirth: data.dateOfBirth,
		mobileNumber: data.mobileNumber,
		email: data.email,
		address1: data.address1,
		address2: data.address2,
		postalCode: data.postalCode,
		city: data.city,
		cafNumber: data.cafNumber,
		peNumber: data.peNumber,
	};
}

function parseFocuses(
	data: Pick<MarneInput, 'axeDeTravails'>,
	creatorId: string,
	notebookId: string
): NotebookFocusInsertInput[] {
	return data.axeDeTravails.map((focus) => ({
		theme: cdThemesToCDBThemes[focus.theme] || focus.theme,
		creatorId,
		notebookId,
		...(focus.linkedTo && { linkedTo: focus.linkedTo }),
		situations: parseSituations(focus.objectifs),
		targets: { data: parseTargets(focus.objectifs) },
	}));
}

function parseTargets(targets: MarneTarget[]): NotebookTargetInsertInput[] {
	return targets.map((target) => ({
		target: upperCaseFirstLetter(parseTarget('objectif', target.objectif)),
	}));
}
function parseSituations(targets: MarneTarget[]): string[] {
	return targets.flatMap((target) => upperCaseFirstLetter(parseTarget('frein', target.objectif)));
}

/**
 *
 * @param data Contract Array
 * @returns last contracts
 */
function getLastContracts(data: Pick<MarneInput, 'contracts'>) {
	const [contract] = data.contracts.sort(
		(a, b) => new Date(b.contractSignDate).getTime() - new Date(a.contractSignDate).getTime()
	);
	return contract ?? {};
}

/**
 * Transform a beneficiary into a urls tokens
 * @param beneficiary BeneficiaryAccount
 * @returns a string which represent a beneficiary url tokens
 * ex : /LASTNAME/FIRSTNAME/DD-MM-YYYY
 */
function urlify(beneficiary: BeneficiaryAccount) {
	return `/${stripDiacritics(beneficiary.lastname).toUpperCase()}/${stripDiacritics(
		beneficiary.firstname
	).toUpperCase()}/${formatDate(beneficiary.dateOfBirth)}`;
}

/**
 * a function that remove diacritic from the letter
 * ex: é => e
 */
function stripDiacritics(input: string): string {
	const diacritics = 'àâäçéèêëiîïôöùûüŷÿ';
	const unaccented = 'aaaceeeeiiioouuuyy';
	const p = new RegExp(`[${diacritics}]`, 'g');
	return input
		.toString()
		.toLowerCase()
		.replace(p, (c: string) => unaccented.charAt(diacritics.indexOf(c)));
}

/**
 * reformat a YYYY-MM-DD date to DD-MM-YYYY
 */
function formatDate(date: string): string {
	return date.split('-').reverse().join('-');
}

function upperCaseFirstLetter(s: string) {
	if (s) {
		return `${s[0].toUpperCase()}${s.slice(1)}`;
	}
	return '';
}

function capitalize(text: string) {
	const parts = text.split(' ');
	return parts
		.map((part: string) => {
			const subparts = part.split('-');
			return subparts
				.map((s: string) => s.toLowerCase())
				.map(upperCaseFirstLetter)
				.join('-');
		})
		.join(' ');
}

function parseTarget(key: string, target = '') {
	const pattern = new RegExp(`${key}\\s?:\\s?(.*)$`, 'i');
	const splits = target.split(/(\r\n|\r|\n)/).flatMap((line) => {
		const match = line.trim().match(pattern);
		return match ? [match[1].trim()] : [];
	});
	return splits.length > 0 ? splits[0] : target;
}

const cdThemesToCDBThemes = {
	'1 ST1 MEDIC-PSY Parcours Accès aux soins': 'sante',
	'1 Accompagnement Parcours Insertion Pro': 'emploi',
	"Accès rapide à l'emploi": 'emploi',
	'2 ST2 MEDIC-PSY Parcours bilan de santé': 'sante',
	'Accès à la santé': 'sante',
	'Renforcement des compétences et savoirs être': 'formation',
	'1 Accompagnement Spécifique TH': 'emploi',
	"2 Reconnaissance du Statut d'Aidant Familial": 'contraintes_familiales',
};
