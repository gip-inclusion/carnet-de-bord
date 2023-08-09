const { I } = inject();
const { loginStub, onBoardingSetup, rejectConsent } = require('../../step_definitions/fixtures');
const assert = require('assert');

async function importOrientationFile(filename) {
	rejectConsent();
	await onBoardingSetup(
		'administrateur de territoire',
		'contact+cd93@carnetdebord.inclusion.beta.gouv.fr',
		true
	);
	const uuid = await loginStub(
		'administrateur de territoire',
		'contact+cd93@carnetdebord.inclusion.beta.gouv.fr'
	);
	I.amOnPage(`/auth/jwt/${uuid}`);
	I.click('Continuer sur Carnet de bord');
	I.click('Importer une liste de réorientations');
	I.attachFile('.dropzone input[type=file]', filename);
	I.click('Confirmer');
}

async function getResultsForBeneficiary(name) {
	return await I.sendQuery(
		`
		query($name:String!) {
			notebook(where: {beneficiary: {lastname: {_eq: $name}}}){
				beneficiary {
					structures {
						status
						structure {name}
					}
				}
				members {
					active, memberType, account {professional {email}}
				}
			}
		}
	`,
		{ name }
	);
}

Feature("Import fichier d'orientation");

Scenario('Changement de référent', async () => {
	await importOrientationFile('/resources/import_reorientation_change_referent.csv');
	const result = await getResultsForBeneficiary('Herring');
	assert.deepEqual(
		[
			{ status: 'outdated', structure: { name: 'Service Social Départemental' } },
			{ status: 'current', structure: { name: 'Groupe NS' } },
		],
		result.data.data.notebook[0]?.beneficiary.structures,
		'beneficiary_structure not match'
	);
	assert.deepEqual(
		[
			{
				account: { professional: { email: 'pcamara@seinesaintdenis.fr' } },
				active: false,
				memberType: 'referent',
			},
			{
				account: { professional: { email: 'sanka@groupe-ns.fr' } },
				active: false,
				memberType: 'no_referent',
			},
			{
				account: { professional: { email: 'sanka@groupe-ns.fr' } },
				active: true,
				memberType: 'referent',
			},
		],
		result.data.data.notebook[0]?.members,
		'members not match'
	);
});

Scenario('Suppression du référent', async () => {
	await importOrientationFile('/resources/import_reorientation_deactivate_referent.csv');
	const result = await getResultsForBeneficiary('Herring');
	assert.deepEqual(
		[{ status: 'current', structure: { name: 'Service Social Départemental' } }],
		result.data.data.notebook[0]?.beneficiary.structures,
		'beneficiary_structure not match'
	);
	assert.deepEqual(
		[
			{
				account: { professional: { email: 'sanka@groupe-ns.fr' } },
				active: true,
				memberType: 'no_referent',
			},
			{
				account: { professional: { email: 'pcamara@seinesaintdenis.fr' } },
				active: false,
				memberType: 'referent',
			},
		],
		result.data.data.notebook[0]?.members?.sort(),
		'members not match'
	);
});

Scenario('Changement de structure', async () => {
	await importOrientationFile('/resources/import_reorientation_change_structure.csv');
	const result = await getResultsForBeneficiary('Herring');
	assert.deepEqual(
		[
			{ status: 'outdated', structure: { name: 'Service Social Départemental' } },
			{ status: 'current', structure: { name: 'Groupe NS' } },
		],
		result.data.data.notebook[0]?.beneficiary.structures,
		'beneficiary_structure not match'
	);
	assert.deepEqual(
		[
			{
				account: { professional: { email: 'sanka@groupe-ns.fr' } },
				active: true,
				memberType: 'no_referent',
			},
			{
				account: { professional: { email: 'pcamara@seinesaintdenis.fr' } },
				active: false,
				memberType: 'referent',
			},
		],
		result.data.data.notebook[0]?.members,
		'members not match'
	);
});

Scenario('Changement de référent (meme structure)', async () => {
	await importOrientationFile('/resources/import_reorientation_change_referent_same_structure.csv');
	const result = await getResultsForBeneficiary('Jennings');
	assert.deepEqual(
		[{ status: 'current', structure: { name: 'Interlogement 93' } }],
		result.data.data.notebook[0]?.beneficiary.structures,
		'beneficiary_structure not match'
	);
	assert.deepEqual(
		[
			{
				account: { professional: { email: 'edith.orial@interlogement93.fr' } },
				active: false,
				memberType: 'referent',
			},
			{
				account: { professional: { email: 'bienvenu.lejeune@mission-locale.fr' } },
				active: true,
				memberType: 'referent',
			},
		],
		result.data.data.notebook[0]?.members,
		'members not match'
	);
});
