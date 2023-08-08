import '@testing-library/jest-dom';

import { RoleEnum } from '$lib/graphql/_gen/typed-document-nodes';
import { faker } from '@faker-js/faker';
import { fireEvent, render, screen, waitFor } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import { v4 as uuidv4 } from 'uuid';
import { expect, vi } from 'vitest';
import ProNotebookPersonalInfoUpdateView from './ProNotebookPersonalInfoUpdateView.svelte';

const user = userEvent.setup();
describe('Mise à jour des données personelles', () => {
	describe('Permissions', () => {
		it('Un professionel ne peut pas éditer,prénom, nom, date de naissance et NIR', () => {
			setup({ role: RoleEnum.Professional });

			expect(screen.getByRole('textbox', { name: /Prénom/ })).toBeDisabled();
			expect(screen.getByRole('textbox', { name: /Nom/ })).toBeDisabled();
			expect(screen.getByLabelText(/Date de naissance/)).toBeDisabled();
			expect(screen.getByRole('textbox', { name: /NIR/ })).toBeDisabled();
		});
	});
	describe('NIR', () => {
		it(`Met à jour le NIR`, async () => {
			const { onSubmit } = setup();

			const newNIR = '1234567890123';
			await changeNir(newNIR);
			await submit();

			await waitFor(() =>
				expect(onSubmit.mock.lastCall[1]).toEqual(expect.objectContaining({ nir: newNIR }))
			);
		});

		it(`Rejette les valeurs incorrectes`, async () => {
			setup();

			await changeNir('Je ne suis pas un NIR');
			await submit();

			await waitFor(() =>
				expect(screen.getByText('Le NIR doit être composé de 13 chiffres')).toBeInTheDocument()
			);
		});
		it('transforme un NIR blanc en undefined', async () => {
			const { onSubmit } = setup();

			await changeNir('    ');
			await submit();

			await waitFor(() =>
				expect(onSubmit.mock.lastCall[1]).toEqual(expect.objectContaining({ nir: null }))
			);
		});
	});
});

const setup = (params: { role: RoleEnum } = { role: RoleEnum.Manager }) => {
	const onSubmit = vi.fn();
	const onCancel = vi.fn();
	render(ProNotebookPersonalInfoUpdateView, {
		beneficiary: {
			id: uuidv4(),
			firstname: faker.person.firstName(),
			lastname: faker.person.lastName(),
			dateOfBirth: faker.date.past().toISOString(),
			nir: faker.number.int({ min: 1000000000000, max: 9999999999999 }) + '',
			rightAre: false,
			rightAss: false,
			rightBonus: false,
		},
		role: params.role,
		onSubmit,
		onCancel,
	});
	// throw Error(printDateFr(faker.date.past()));
	return { onSubmit, onCancel };
};
async function changeNir(nir: string) {
	const nirField = screen.getByRole('textbox', { name: 'NIR' });
	await user.clear(nirField);
	await user.type(nirField, nir);
	expect(nirField).toHaveValue(nir);
	return nir;
}

async function submit() {
	await fireEvent.click(screen.getByRole('button', { name: 'Enregistrer' }));
}
