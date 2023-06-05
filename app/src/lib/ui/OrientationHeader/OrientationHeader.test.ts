import { test } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import OrientationHeader from '../OrientationHeader/OrientationHeader.svelte';
import { accountData } from '$lib/stores';
import {
	type GetNotebookByBeneficiaryIdQuery,
	RoleEnum,
} from '$lib/graphql/_gen/typed-document-nodes';

const pierreChevalierAccount = {
	id: 'acc1',
	type: RoleEnum.Professional,
	confirmed: true,
	username: 'pierre.chevalier',
	professional: {
		id: 'p1',
		firstname: 'Pierre',
		lastname: 'Chevalier',
		email: 'pierre.chevalier@livry-gargan.fr',
		structure: {
			id: 's1',
			name: 'Centre communal Livry gargan',
		},
	},
};

const sankaAccount = {
	id: 'acc2',
	type: RoleEnum.Professional,
	confirmed: true,
	username: 'sanka',
	professional: {
		id: 'p2',
		firstname: 'Simon',
		lastname: 'Anka',
		email: 'sanka@groupe-ns',
		structure: {
			id: 's2',
			name: 'Groupe NS',
		},
	},
};

const adminStructureAccount = {
	id: 'admin-structure-account-id',
	type: RoleEnum.AdminStructure,
	confirmed: true,
	username: 'admin.structure',
	admin_structure: {
		id: 'admin-structure-id',
		firstname: 'Admin',
		lastname: 'Structure',
		email: 'admin.structure@email.net',
	},
};

const orientationManagerAccount = {
	id: 'orientation-manager-account-id',
	type: RoleEnum.OrientationManager,
	confirmed: true,
	username: 'orientation.manager',
	orientation_manager: {
		id: 'orientation-manager-id',
		firstname: 'Orientation',
		lastname: 'Manager',
		email: 'orientation.manager@email.net',
	},
};

const managerAccount = {
	id: 'manager-account-id',
	type: RoleEnum.Manager,
	confirmed: true,
	username: 'manager',
	manager: {
		id: 'manager-id',
		firstname: 'Admin',
		lastname: 'Territoire',
		email: 'admin.territoire@email.net',
	},
};

const members = [
	{
		id: '1',
		memberType: 'referent',
		createdAt: '2020-01-01',
		account: pierreChevalierAccount,
	},
	{
		id: '2',
		memberType: 'no-referent',
		createdAt: '2020-01-01',
		account: sankaAccount,
	},
];

const beneficiary: GetNotebookByBeneficiaryIdQuery['notebook'][number]['beneficiary'] = {
	id: 'beneficiary-id',
	firstname: 'Béné',
	lastname: 'Ficiaire',
	dateOfBirth: '1998-07-12',
	rightAre: false,
	rightBonus: false,
	rightAss: false,
	externalDataInfos: [],
};

const notebook: GetNotebookByBeneficiaryIdQuery['notebook'][number] = {
	id: 'notebook-id',
	beneficiary,
	beneficiaryId: beneficiary.id,
	members,
	professionalProjects: [],
	focuses: [],
	notebookInfo: { needOrientation: false },
	rightRqth: false,
	situations: [],
	appointments: [],
};

test('do not show "Réorienter" button for admin_structure', () => {
	accountData.set(adminStructureAccount);

	render(OrientationHeader, {
		props: {
			notebook,
		},
	});
	expect(screen.queryByText('Orienter')).not.toBeInTheDocument();
	expect(screen.queryByText('Réorienter')).not.toBeInTheDocument();
});

describe('when beneficiary needs orientation', () => {
	const notebookNeedingOrientation = {
		...notebook,
		notebookInfo: { needOrientation: true },
	};
	test('show "Orienter" button for orientation_manager', () => {
		accountData.set(orientationManagerAccount);

		render(OrientationHeader, {
			props: {
				notebook: notebookNeedingOrientation,
			},
		});
		expect(screen.getByText('Orienter')).toBeInTheDocument();
		expect(screen.queryByText('Réorienter')).not.toBeInTheDocument();
	});

	test('show "Orienter" button for manager', () => {
		accountData.set(managerAccount);

		render(OrientationHeader, {
			props: {
				notebook: notebookNeedingOrientation,
			},
		});
		expect(screen.getByText('Orienter')).toBeInTheDocument();
		expect(screen.queryByText('Réorienter')).not.toBeInTheDocument();
	});
});

describe('when beneficiary does not need orientation', () => {
	test('show "Réorienter" button for orientation_manager', () => {
		accountData.set(orientationManagerAccount);

		render(OrientationHeader, {
			props: {
				notebook,
			},
		});
		expect(screen.getByText('Réorienter')).toBeInTheDocument();
		expect(screen.queryByText('Orienter')).not.toBeInTheDocument();
	});

	test('show "Réorienter" button for manager', () => {
		accountData.set(managerAccount);

		render(OrientationHeader, {
			props: {
				notebook,
			},
		});
		expect(screen.getByText('Réorienter')).toBeInTheDocument();
		expect(screen.queryByText('Orienter')).not.toBeInTheDocument();
	});
});
