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

const notebookMembers = [
	{
		id: '1',
		memberType: 'referent',
		createdAt: '2020-01-01',
		account: {
			id: 'acc1',
			type: RoleEnum.Professional,
			professional: {
				id: 'p1',
				firstname: 'pierre',
				lastname: 'chevalier',
				email: 'pierre.chevalier@livry-gargan.fr',
				structure: {
					id: 's1',
					name: 's1',
				},
			},
		},
	},
	{
		id: '2',
		memberType: 'no-referent',
		createdAt: '2020-01-01',
		account: {
			id: 'acc2',
			type: RoleEnum.Professional,
			professional: {
				id: 'p2',
				firstname: 'simon',
				lastname: 'anka',
				email: 'sanka@groupe-ns.fr',
				structure: {
					id: 's2',
					name: 's2',
				},
			},
		},
	},
	{
		id: '3',
		memberType: 'orientation_manager',
		createdAt: '2020-01-01',
		account: {
			id: 'acc3',
			type: RoleEnum.OrientationManager,
			orientation_manager: {
				id: 'om1',
				firstname: 'giulia',
				lastname: 'diaby',
				email: 'giulia.diaby@cd93.fr',
			},
		},
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
		},
	});
	expect(screen.getByText('Inviter un accompagnateur')).toBeInTheDocument();
	expect(screen.getByText('Se détacher')).toBeInTheDocument();
});
