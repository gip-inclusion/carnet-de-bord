import type { RequestHandler } from '@sveltejs/kit';
import { post as postRequest } from '$lib/utils/post';
import { createClient } from '@urql/svelte';
import { getGraphqlAPI } from '$lib/config/variables/public';
import {
	AddNotebookFocusDocument,
	AddNotebookFocusMutation,
	AddNotebookTargetDocument,
	AddNotebookTargetMutation,
	CreateBeneficiaryDocument,
	CreateBeneficiaryMutation,
	UpdateNotebookContractMutation,
	UpdateNotebookContractDocument,
} from '$lib/graphql/_gen/typed-document-nodes';
import { getHasuraAdminSecret } from '$lib/config/variables/private';

const sourceToken = '';
const sourceUrl = 'http://localhost:3000/pro/accueil/fixtures';
const sourceHeaders = { Authorization: `Bearer ${sourceToken}` };

const allThemes: Set<string> = new Set();

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

const professionalId = 'e1fdb7a8-7d0e-4b2e-b28c-89a662d090a3';
const client = createClient({
	url: getGraphqlAPI(),
	fetch,
	fetchOptions: {
		headers: {
			'Content-Type': 'application/json',
			'x-hasura-admin-secret': getHasuraAdminSecret(),
			'x-hasura-professional-id': professionalId,
		},
	},
	requestPolicy: 'network-only',
});

const upperCaseFirstLetter = (s) => {
	if (s) {
		return `${s[0].toUpperCase()}${s.slice(1)}`;
	}
	return '';
};

const capitalize = (text) => {
	const parts = text.split(' ');
	return parts
		.map((part) => {
			const subparts = part.split('-');
			return subparts
				.map((s) => s.toLowerCase())
				.map(upperCaseFirstLetter)
				.join('-');
		})
		.join(' ');
};

const parseBeneficiary = async (source) => {
	const {
		firstname,
		lastname,
		dateOfBirth,
		mobileNumber,
		email,
		address1,
		address2,
		postalCode,
		city,
		cafNumber,
		peNumber,
	} = source;
	const request = {
		firstname: capitalize(firstname),
		lastname: capitalize(lastname),
		dateOfBirth,
		mobileNumber,
		email,
		address1,
		address2,
		postalCode,
		city,
		cafNumber,
		peNumber,
		professionalId,
	};
	const { data, error } = await client
		.mutation<CreateBeneficiaryMutation>(CreateBeneficiaryDocument, request)
		.toPromise();
	if (error) console.log({ data, error });
	return data?.newNotebook?.id;
};

const splitTarget = (target) => {
	const splits = target.split('\r');
	if (splits && splits[0] && splits[0] !== target) {
		const split = splits.reduce((acc, text) => {
			if (!acc) {
				if (text.startsWith('Objectif : ')) {
					return text.slice(11);
				}
			}
			return acc;
		}, null);
		return split;
	}
	return target;
};

const parseFocuses = (notebookId) => async (source) => {
	const focuses = source.axeDeTravails;
	for (const focus of focuses) {
		const situations = [];
		const { theme, linkedTo, objectifs } = focus;
		allThemes.add(theme);
		const request = {
			notebookId,
			situations,
			theme: cdThemesToCDBThemes[theme] || theme,
			linkedTo: linkedTo.toLowerCase(),
			creatorId: professionalId,
		};
		const { data, error } = await client
			.mutation<AddNotebookFocusMutation>(AddNotebookFocusDocument, request)
			.toPromise();
		if (error) console.log({ data, error });
		const focusId = data?.insert_notebook_focus_one?.id;
		for (const objectif of objectifs) {
			const { objectif: target } = objectif;
			if (target) {
				const request = {
					focusId,
					target: upperCaseFirstLetter(splitTarget(target)),
				};
				const { data, error } = await client
					.mutation<AddNotebookTargetMutation>(AddNotebookTargetDocument, request)
					.toPromise();
				if (error) console.log({ data, error });
			}
		}
	}
};

const parseContract = (notebookId) => async (source) => {
	const contracts = source.contracts;
	contracts.sort(function (a, b) {
		return a.contractSignDate > b.contractSignDate
			? -1
			: a.contractSignDate < b.contractSignDate
			? 1
			: 0;
	});
	const contract = contracts[0];
	if (contract) {
		const { contractType, contractSignDate } = contract;
		const request = {
			id: notebookId,
			contractType,
			contractSignDate,
		};

		const { data, error } = await client
			.mutation<UpdateNotebookContractMutation>(UpdateNotebookContractDocument, request)
			.toPromise();
		if (error) console.log({ data, error });
	}
};

const parseJson = async function parseJson(sources) {
	for (const source of sources) {
		const notebookId = await parseBeneficiary(source);
		await parseFocuses(notebookId)(source);
		await parseContract(notebookId)(source);

		Array.from(allThemes).forEach((theme) => {
			if (!Object.keys(cdThemesToCDBThemes).includes(theme)) {
				console.error(`Le thème "${theme}" n'a pas été trouvé dans l'objet de traduction.`, {
					traduction: cdThemesToCDBThemes,
				});
			}
		});
	}
};

export const post: RequestHandler = async (_request) => {
	const source = await postRequest(sourceUrl, {}, sourceHeaders).then((r) => r.json());

	await parseJson(source);

	return {
		status: 200,
		body: {},
	};
};
