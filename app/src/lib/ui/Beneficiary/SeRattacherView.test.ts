import '@testing-library/jest-dom';

import { render, fireEvent, screen } from '@testing-library/svelte';

import SeRattacher from './SeRattacherView.svelte';

describe('Se rattacher', () => {
	describe('Sans dispositif', () => {
		it(`Affiche une erreur quand on veut se rattacher`, async () => {
			render(SeRattacher, {
				orientations: [],
				onSubmit: () => {
					return;
				},
			});

			const oui = screen.getByText('Oui');
			await fireEvent.click(oui);

			expect(screen.getByRole('alert')).toContainHTML(
				`Vous ne pouvez pas vous rattacher à ce bénéficiaire en tant que référent car aucun dispositif ne vous a été attribué. Vérifiez auprès du gestionnaire de votre structure que vous disposez des habilitations nécessaire.`
			);
			expect(screen.getByRole('button', { name: 'Se rattacher' })).toBeDisabled();
		});
		it('Le bouton de validation est activé quand on cliqué sur Non', async () => {
			render(SeRattacher, {
				orientations: [],
				onSubmit: () => {
					return;
				},
			});

			const oui = screen.getByText('Non');
			await fireEvent.click(oui);

			expect(screen.getByRole('button', { name: 'Se rattacher' })).not.toBeDisabled();
		});
	});
	it(`N'affiche pas d'erreur lorsqu'on a un dispositif (et qu'on a pas cliqué sur Oui)`, async () => {
		render(SeRattacher, {
			orientations: [{ id: 'dispositif-1', name: 'dispositif 1' }],
			onSubmit: () => {
				return;
			},
		});

		expect(screen.queryByRole('alert')).not.toBeInTheDocument();
		expect(screen.getByRole('button', { name: 'Se rattacher' })).not.toBeDisabled();
	});
});
