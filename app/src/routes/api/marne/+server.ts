import type {
	NotebookActionInsertInput,
	NotebookFocus,
	NotebookFocusInsertInput,
	NotebookTarget,
	NotebookTargetInsertInput,
} from '$lib/graphql/_gen/typed-document-nodes';
import type { BeneficiaryAccount } from '$lib/types';
import type { RequestHandler } from '@sveltejs/kit';
import type {
	ExternalDeploymentApiBody,
	ExternalDeploymentApiOutput,
} from '../../actions/update_notebook';
import type { MarneInput, MarneAction, MarneFocus } from '../marne.types';

export const POST: RequestHandler = async ({ request }) => {
	const { url, headers, input, accountId, notebookId, focuses } =
		(await request.json()) as ExternalDeploymentApiBody;
	try {
		const data: MarneInput = await fetch(`${url}${urlify(input)}`, { headers }).then(
			async (response) => {
				if (response.ok) {
					return response.json();
				}
				const errorMessage = await response.text();
				return Promise.reject(
					new Error(
						`api call failed (${response.status} - ${response.statusText})\n${errorMessage}`
					)
				);
			}
		);
		throw new Error(
			'@migration task: Migrate this return statement (https://github.com/sveltejs/kit/discussions/5774#discussioncomment-3292701)'
		);
		// Suggestion (check for correctness before using):
		// return new Response(parse(data, accountId, notebookId, focuses));
		return {
			status: 200,
			body: parse(data, accountId, notebookId, focuses),
		};
	} catch (error) {
		console.error('[marne parser]', error, input);
		return new Response('API PARSE ERROR', { status: 500 });
	}
};

function parse(
	data: MarneInput,
	accountId: string,
	notebookId: string,
	existingFocuses: NotebookFocus[]
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
		...parseFocuses(data, accountId, notebookId, existingFocuses),
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
	notebookId: string,
	existingFocuses: NotebookFocus[]
): Pick<ExternalDeploymentApiOutput, 'actions' | 'focuses' | 'targets'> {
	const existingTargets = existingFocuses.flatMap((focus) => focus.targets);
	const existingActions = existingTargets.flatMap((target) => target.actions);
	const existingActionIds = existingActions.map((action) => action.initialId).filter(Boolean);

	const focusWithNewActions = data.axeDeTravails.flatMap((focus) => {
		if (
			focus.actions.some((action) =>
				existingActionIds.includes(`${focus.code}_${action.type}_${action.code}`)
			)
		) {
			return [];
		}
		return [focus];
	});
	const focuses: NotebookFocusInsertInput[] = [];
	const targets: NotebookTargetInsertInput[] = [];
	const actions: NotebookActionInsertInput[] = [];

	for (const focus of focusWithNewActions) {
		const cdbfocus = findFocus(existingFocuses, focus);
		if (cdbfocus) {
			const situations = parseSituations(focus.actions);
			focuses.push({
				id: cdbfocus.id,
				situations: [...new Set(cdbfocus.situations.concat(situations))],
			});
			for (const action of focus.actions) {
				const cdbtarget = findTarget(cdbfocus, action);
				if (cdbtarget) {
					// existing target and focus
					actions.push({
						targetId: cdbtarget.id,
						action: action.action,
						creatorId,
						status: 'new',
						initialId: `${focus.code}_${action.type}_${action.code}`,
					});
				} else {
					// new target, existing focus
					// we need to check if we don't already add this target
					const cdbtheme = getCdbTheme(focus.theme);
					const targetName = getTargetFromAction(action, cdbtheme);
					const targetToCreate = targets.find(({ target }) => target === targetName);
					if (targetToCreate) {
						targetToCreate.actions.data.push(action);
					} else {
						targets.push({
							focusId: cdbfocus.id,
							target: targetName,
							creatorId,
							actions: {
								data: [marneActionToCdbAction(action, focus.code, creatorId)],
							},
						});
					}
				}
			}
		} else {
			// new focus / target / theme
			focuses.push({
				theme: marneThemesToCDBThemes[focus.theme] || focus.theme,
				creatorId,
				notebookId,
				...(focus.linkedTo && { linkedTo: focus.linkedTo.toLowerCase() }),
				situations: parseSituations(focus.actions),
				targets: { data: parseActions(focus, creatorId) },
			});
		}
	}
	const nbFocuses = focuses.length;
	const nbTargets = focuses.flatMap((focus) => focus.targets?.data ?? []).concat(targets).length;
	const nbActions = focuses
		.flatMap((focus) => focus.targets?.data.flatMap((target) => target.actions?.data ?? []) ?? [])
		.concat(targets.flatMap((target) => target.actions.data ?? []))
		.concat(actions).length;

	console.log(`parse: found ${nbFocuses} focus | ${nbTargets} targets | ${nbActions} actions`);

	return {
		focuses,
		targets,
		actions,
	};
}

function findFocus(existingFocuses: NotebookFocus[], focus: MarneFocus): NotebookFocus | null {
	const cdbtheme = marneThemesToCDBThemes[focus.theme.trim()] || focus.theme;
	return existingFocuses.find(
		({ theme, linkedTo }) => theme === cdbtheme && linkedTo === focus.linkedTo.toLowerCase()
	);
}

function findTarget(focus: NotebookFocus, action: MarneAction): NotebookTarget | null {
	const actionName = getTargetFromAction(action, focus.theme);
	if (!actionName) return null;

	return focus.targets.find(({ target }) => target.toLowerCase() === actionName.toLowerCase());
}

function parseSituations(actions: MarneAction[]): string[] {
	return actions.flatMap((action) => upperCaseFirstLetter(parseTarget('frein', action.objectif)));
}

function parseActions(focus: MarneFocus, creatorId: string): NotebookTargetInsertInput[] {
	const theme = getCdbTheme(focus.theme);
	const targetMap = focus.actions.reduce((targets, action) => {
		const target = getTargetFromAction(action, theme);
		if (!targets[target]) {
			targets[target] = {
				target,
				creatorId,
				actions: {
					data: [],
				},
			};
		}
		targets[target].actions.data.push(marneActionToCdbAction(action, focus.code, creatorId));
		return targets;
	}, {} as Record<string, NotebookTargetInsertInput>);
	return Object.values(targetMap);
}

function marneActionToCdbAction(
	data: MarneAction,
	focusCode: number,
	creatorId: string,
	targetId?: string
): NotebookActionInsertInput {
	return {
		action: data.action,
		creatorId,
		...(targetId && { targetId }),
		status: 'new',
		initialId: `${focusCode}_${data.type}_${data.code}`,
		createdAt: data.dateStart,
	};
}

function getCdbTheme(theme: string): string {
	const cdbTheme = marneThemesToCDBThemes[theme.trim()];
	if (!cdbTheme) {
		throw new Error(`Unknown theme ${theme}`);
	}
	return cdbTheme;
}

function getTargetFromAction(actionObj: MarneAction, cdbTheme: string): string {
	if (!actionsToTarget[cdbTheme]) {
		throw new Error(`Unknown theme ${cdbTheme} for action ${actionObj.action}`);
	}
	return actionsToTarget[cdbTheme][actionObj.action];
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
	if (!contract) return {};
	return { contractSignDate: contract.contractSignDate, contractType: contract.contractType };
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
				.map((s: string) => upperCaseFirstLetter(s))
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

const actionsToTarget = {
	logement: {
		'Accompagnement lié au logement': 'Accéder ou se maintenir dans un logement',
		'Actions collectives liées au logement':
			"S'informer sur les démarches liées au logement (budget, état des lieux …)",
		'DAHO, 115': "Trouver une solution d'hébergement",
		'Accompagnement par le chargé de mission logement': 'Accéder ou se maintenir dans un logement',
		"Accès au logement Social de la Maison de l'Habitat":
			'Mise en œuvre des préconisations du chargé de mission logement ou travailleur social',
		'Réalisation autonome des démarches liées au logement au regard des conseils formulés par un travailleur social':
			'Mise en œuvre des préconisations du chargé de mission logement ou travailleur social',
		"Les aides financières à l'accès ou au maintien dans le logement FSL ":
			"Favoriser l'accès au logement ou la résorption d'un impayé",
	},
	difficulte_financiere: {
		'Action Educative Budgétaire (AEB)':
			"Prévenir le surendettement et tendre vers l'autonomie de la gestion budgétaire",
		'L’accompagnement budgétaire':
			"Acquérir des compétences techniques et administratives dans le but d'éviter l’aggravation de la situation financière",
		'L’accompagnement social personnalisé':
			'Acquérir une autonomie sociale et budgétaire ou une mesure de protection',
	},
	contraintes_familiales: {
		'Accès à un mode de garde': 'Recherche de mode de garde',
	},
	mobilite: {
		'La navette insertion':
			"Favoriser l'accès aux dispositifs d'insertion sociale ou professionnel",
		'aide à la mobilité du CCAS':
			"Bénéficier d'une aide financière pour le passage du permis de conduire ou achant de véhicule",
		'Conseiller en mobilité inclusive':
			"Bénéficier d'un accompagnement permettant d'accèder à la mobilité",
		'Bourse au permis': "Bénéficier d'une aide financière pour le passage du permis de conduire",
		'Préparation au code': "Bénéficier d'un accompagnement pour le passage du code de la route",
		'Location /Achat véhicule':
			"Favoriser l'accès aux dispositifs d'insertion sociale ou professionnelle",
		'Passage du permis B (code et conduite)':
			"Acquérir les compétences garantissant la réussite au code et à l'examen de conduite",
	},
	sante: {
		PAIS: 'Etre accompagné dans les démarches accès au soin',
		APS: "Bénéficier d'un accompagnement de proximité favorisant l'amélioration de son état de santé",
		'Bilan de santé CMPS': 'Faire un bilan de santé complet et engager un parcours de soins',
		'Suivi santé': 'Bénéficier de soins',
	},
	difficulte_administrative: {
		'Coordonnatrice de Levée des Freins Périphériques':
			"Identification et appui dans la réalisation des démarches/Relais  avec les partenaires/Mise en œuvre d'aides financières",
		"L'accompagnement social personnalisé":
			'Acquérir une autonomie sociale et budgétaire ou une mesure de protection',
		"L’accompagnement par les travailleurs sociaux en matière d'accès au droit":
			'Accéder à un droit',
		"Réalisation autonome des démarches liées à l'accès aux droits":
			'Mise en œuvre des préconisations du travailleur social',
		'Ecrivain Public Numérique': 'Accompagnement dans les démarches numériques',
		"Accompagnement à la constitution d'un dossier de surendettement ":
			'Rétablir la situation financière',
		'Les aides des épiceries sociales': 'Accéder à une aide alimentaire et un accompagnement',
		'Mesures de protection administratives ou judiciaires (MASP, tutelle, curatelle, sauvegarde de justice,...)':
			"Mise en place d'une mesure d'accompagnement adapté",
		'APA, PCH,…': "Accèder à une indemnisation de compensation de l'accompagnement",
	},
	maitrise_langue: {
		'Ateliers socio-linguistiques Maison de quartier':
			'Acquérir les compétences langagières de base à une insertion',
		'Parcours langue': 'Acquérir les compétences langagières de base à une insertion',
	},
	emploi: {
		"Orientation vers un Chantier d'insertion (ACI)": 'Accéder à  un CDDI',
		'CEC/CIE': 'Accéder à un emploi aidé',
		Shaker:
			'Accèder à une qualification en lien avec les métiers en tension  (BTP, propreté, logistique, industrie,...)',
		'Coaching intensif':
			"Accèder rapidement à un emploi grâce à la mise en œuvre d'une stratégie de recherches d'emploi en adéquation avec le projet professionnel",
		'Espace Linguistique Pro (ELP)':
			"Acquérir les compétences langagières nécessaires à la reprise d'un emploi",
		REAGIR:
			"Etre accompagné pour redéfinir un projet professionnel, être accompagné pour développer et améliorer l'activité",
		'Permanence du Jard':
			"Evaluer ses capacités de retour à l'emploi / évaluer une orientation ESAT sur demande de la MDPH ou en amont d'une demande MDPH / bénéficier d'un accompagnement adapté à la RQTH",
		"Partenariat Chambre de l'agriculture": "Faciliter l'accès à l'emploi agricole",
		'RSA et Vendanges en Champagne': "Faciliter l'accès aux vendanges",
		'Accompagnement des TNS': "Faciliter le développement et la viabilité économique de l'activité",
		'PLATEFORME actif51':
			'Favoriser la mise en relation entre un candidat et un employeur en aidant les bénéficiaires à mieux cibler les emplois de proximité',
		'Coaching ':
			"Identifier ses atouts et ses freins dans la recherche d'emploi et définir une stratégie de recherche d'emploi en adéquation avec le marché du travail",
		'Coaching dipômés':
			"Identifier ses atouts et ses freins dans la recherche d'emploi et définir une stratégie de recherche d'emploi en adéquation avec le marché du travail",
		'Coaching Sport et Loisirs':
			"Identifier ses freins liés à l'accès à l'emploi dans le domaine du sport et des loisirs.  Définir et mettre en œuvre un plan d'action permettant de lever ces freins.",
		'Orientation vers AI/ETTI': 'Incription HUMANDO / SUEZ Insertion/Partage Travail',
		'Partenariat intérim': "Inscription à l'agence Triangle",
		'Pôle Emploi': 'Inscription à Pôle Emploi',
		'Inscription Interim': "Inscription en agence d'intérim",
		'CAP Emploi': 'Inscription et/ou CAP Emploi',
		PAUPA: 'Inscription sur actif51',
		'Suites accompagnement spécialisé TNS':
			"Mise en œuvre des préconisations d'une structure d'accompagnement spécialisée de type ADIE, CCI...",
		'Comité Rebond':
			"Mobiliser l'ensemble des partenaires du SPIE et de nouveaux dispositifs concourant au rebond de l'usager",
		'Accompagnement global':
			"Proposer un accompagnement conjoint par le conseiller de Pôle emploi et le chargé de mission RSA du Département, permettant  de lever l'ensemble des freins et d'accèder à l'emploi",
	},
	formation: {
		'Itinéraire Bis':
			'Accéder à la citoyenneté par une meilleure intégration sociale et culturelle',
		'Recherche de formation': 'Accéder à la formation',
		'Service Militaire Volontaire': 'Accéder à un accompagnement',
		'Accompagnement MILO': 'Accéder à un accompagnement',
		'Le Partenariat Garantie Jeunes (expérimental)':
			'Accéder au parcours d’accompagnement proposé dans le cadre de la Garantie Jeunes',
		"Parcours d'Acquisition des Compétences en Entreprise (PACE)":
			"Acquérir des compétences en entreprise favorisant l'employabilité",
		'Le Service civique':
			"Acquérir et/ou développer  des compétences et de l'expérience au travers d’une intégration au sein d’un collectif et d’une mission spécifique confiée aux jeunes",
		"Atelier d'initiation aux savoirs de base numériques":
			"Acquérir les compétences de base numériques permettant l'accès aux droits et favorisant l'insertion",
		'Parcours langue': 'Acquérir les compétences langagières de base à une insertion',
		'Ateliers socio-linguistiques Maison de quartier':
			'Acquérir les compétences langagières de base à une insertion',
		"Activ'compétences":
			"Acquérir les fondamentaux permettant la construction d'un parcours d'insertion",
		'Diagnostics individuels approfondis (DIA)':
			'Améliorer la connaissance des savoirs de base ou du potentiel de bénéficiaires du RSA',
		'Prépa compétences': "Définition d'un parcours de formation personnalisé",
		'Ecole de la 2ème chance':
			"Elaborer un parcours pédagogique favorisant l'insertion professionnelle",
		"Ateliers d'intégration à visée professionnelle":
			'Remobiliser les bénéficiaires du RSA dans un parcours d’insertion socio-professionnel',
	},
};
const marneThemesToCDBThemes = {
	"PRO1 Accès Offres d'Emploi Spécifiques": 'emploi',
	'PRO1 Accompagnement Parcours Insertion Pro': 'emploi',
	"PRO1 Accompagnement Renforcé vers et dans l'emploi": 'emploi',
	"PRO1 Accompagnement Spéci. Créateurs d'Entpse": 'emploi',
	'PRO1 Accompagnement spécifique Jeunes Diplômés': 'emploi',
	'PRO1 Accompagnement Spécifique TH': 'emploi',
	'PRO1 En emploi aidé': 'emploi',
	'PRO1 En emploi non aidé': 'emploi',
	"PRO1 Evaluation d'autonomie professionnelle": 'emploi',
	'PRO1 Evaluation professionnelle': 'emploi',
	"PRO1 Parcours autonome accès direct à l'emploi": 'emploi',
	'PRO1 Parcours de Formation': 'formation',
	'PRO1 Parcours de Qualification': 'formation',
	'PRO1 Travailleurs indépendants': 'emploi',
	'PRO2 Accompagnement Parcours Insertion Pro': 'emploi',
	'PRO2 Evaluation Parcours Insertion Pro': 'emploi',
	'PRO2 Parcours IAE': 'emploi',
	'SOCPRO1  Recherche mode de garde': 'contraintes_familiales',
	'SOCPRO1 Accomp. Parcours post formation prof.': 'formation',
	'SOCPRO1 Financement Formation APRE': 'formation',
	'SOCPRO1 Parcours Formation': 'formation',
	'SOCPRO1 Passage Permis VL APRE': 'mobilite',
	'SOCPRO1 Poursuite scolarité': 'formation',
	'SOCPRO1 SAS Formations/Validation en entreprises': 'formation',
	'SOCPRO1 Scolarité': 'formation',
	'SOCPRO2 Accomp. Coaching': 'formation',
	'SOCPRO2 Accomp. Coaching diplômés': 'formation',
	'SOCPRO2 Accomp. Emergence Socio Professionnelle': 'formation',
	'SOCPRO2 Accomp. Spécif. Jeunes Chantiers Educatifs': 'emploi',
	'SOCPRO2 Accomp. Spécif. Jeunes Contrat Civis': 'emploi',
	'SOCPRO2 Accomp. Spécif. Jeunes Ecole 2ème Chance': 'formation',
	'SOCPRO2 Accomp. Spécif. jeunes MILO': 'formation',
	'SOCPRO2 ACQUIS. Compétence de base Spec. Informat.': 'formation',
	'SOCPRO2 ACQUIS. Compétences de base Niv1 Alphab.': 'formation',
	'SOCPRO2 ACQUIS. Compétences de base Niv2': 'formation',
	'SOCPRO2 Auto école sociale': 'mobilite',
	"SOCPRO2 Orientation vers un Chantier d'Insertion": 'emploi',
	"SOCPRO2 Parcours Chantier d'Insertion": 'emploi',
	'SOCPRO2 Parcours intégration CUI 7 heures': 'emploi',
	'SOCPRO2 Parcours pré-intégration CI': 'emploi',
	'SOCPRO2 Pré-Pro Public Spécifique': 'formation',
	'SOC1 LG1 Accès au logement décent': 'logement',
	'SOC1 LG1 Maintien dans le logement': 'logement',
	'SOC1 ST1 HKP Attribution AAH': 'sante',
	'SOC1 ST1 HKP Reconnaissance TH': 'sante',
	'SOC1 ST1 MAT Parcours de soins': 'sante',
	'SOC1 ST1 MEDIC Parcours Accès aux soins': 'sante',
	'SOC1 ST1 MEDIC-PSY Parcours Accès aux soins': 'sante',
	'SOC1 ST1 Parcours Bilan de santé': 'sante',
	'SOC2 Accès au Droit de la Famille': 'difficulte_administrative',
	'SOC2 Accès au Droit du Travail': 'difficulte_administrative',
	'SOC2 Accomp Soutien Parcours Santé Tierce Personne': 'sante',
	'SOC2 Alphabétisation renforcée': 'maitrise_langue',
	"SOC2 Reconnaissance du Statut d'Aidant Familial": 'contraintes_familiales',
	'SOC2 Sécurisation GAB Mesure Banque de France': 'difficulte_financiere',
	'SOC2 Sécurisation GAB Mesure Protection Judiciaire': 'difficulte_administrative',
	'SOC2 Sécurisation GAB Règlement créance amiable': 'difficulte_financiere',
	'SOC2 ST2 HDK Attribution AAH': 'sante',
	'SOC2 ST2 HDK Reconnaissance TH': 'sante',
	'SOC2 ST2 MEDIC Parcours accès aux soins': 'sante',
	'SOC2 ST2 MEDIC-PSY Parcours accès aux soins': 'sante',
	'SOC2 ST2 MEDIC-PSY Parcours bilan de santé': 'sante',
	'SOC2 ST2 Parcours Bilan de santé': 'sante',
	'zNE + UTILISER PRO2 Acc Spécif Jeune Contrat CIVIS': 'emploi',
	'zNE+UTILISER PRO2 Acc Spéc Jeunes Ecole 2è Chance': 'formation',
	'zNE+UTILISER PRO2 Accomp. Spécif. Jeunes MILO': 'emploi',
	'zNE+UTILISERPRO2 Acc Spéc. Jeune Chantier Educatif': 'formation',
	"1- Accès rapide à l'emploi": 'emploi',
	'2- Renforcement des compétences et savoirs être': 'formation',
	'3- Lever les freins périphériques': 'mobilite',
	'4- Accès à la santé': 'sante',
	'6- Parentalité': 'contraintes_familiales',
	'8- Intégrer et se maintenir ds le logement': 'logement',
	"9- Favoriser l'autonomie sociale et budgétaire": 'difficulte_financiere',
};
