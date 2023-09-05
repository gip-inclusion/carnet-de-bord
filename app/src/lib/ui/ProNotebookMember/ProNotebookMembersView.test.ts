import { test } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import ProNotebookMembersView from './ProNotebookMembersView.svelte';
import { accountData } from '$lib/stores';
import { RoleEnum } from '$lib/graphql/_gen/typed-document-nodes';

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
			deployment: { label: 'CD93' },
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
			deployment: { label: 'CD93' },
		},
	},
};

const giuiliaDiabyAccount = {
	id: 'acc3',
	type: RoleEnum.OrientationManager,
	confirmed: true,
	username: 'giuilia.diabby',
	orientation_manager: {
		id: 'om1',
		firstname: 'giuilia',
		lastname: 'diaby',
		email: 'orientation.manager@email.net',
	},
};

const notebookMembers = [
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
	{
		id: '3',
		memberType: 'orientation_manager',
		createdAt: '2020-01-01',
		account: giuiliaDiabyAccount,
	},
];

test('do not show remove button for referent', () => {
	accountData.set(pierreChevalierAccount);

	render(ProNotebookMembersView, {
		props: {
			notebookId: 'id',
			beneficiaryFirstname: 'leon',
			beneficiaryLastname: 'leon',
			appointments: [],
			displayMemberManagementButtons: true,
			members: notebookMembers,
			orientationSystem: null,
		},
	});
	expect(screen.getByText('Inviter un accompagnateur')).toBeInTheDocument();
	expect(screen.queryByText('Se détacher')).not.toBeInTheDocument();
});

test('show remove button for no referent', () => {
	accountData.set(sankaAccount);

	render(ProNotebookMembersView, {
		props: {
			notebookId: 'id',
			beneficiaryFirstname: 'leon',
			beneficiaryLastname: 'leon',
			appointments: [],
			displayMemberManagementButtons: true,
			members: notebookMembers,
			orientationSystem: null,
		},
	});
	expect(screen.getByText('Inviter un accompagnateur')).toBeInTheDocument();
	expect(screen.getByText('Se détacher')).toBeInTheDocument();
});

test('do not show remove button for orientation managers', () => {
	accountData.set(giuiliaDiabyAccount);

	render(ProNotebookMembersView, {
		props: {
			notebookId: 'id',
			beneficiaryFirstname: 'leon',
			beneficiaryLastname: 'leon',
			appointments: [],
			displayMemberManagementButtons: true,
			members: notebookMembers,
			orientationSystem: null,
		},
	});
	expect(screen.getByText('Inviter un accompagnateur')).toBeInTheDocument();
	expect(screen.queryByText('Se détacher')).not.toBeInTheDocument();
});
