import { describe, test } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import ProNotebookTargetCreate from './ProNotebookTargetCreate.svelte';
import type { Target } from '.';
import userEvent from '@testing-library/user-event';

const user = userEvent.setup();

const targets: Target[] = [
	{
		id: 'a',
		description: 'Objectif A1',
		refTheme: { label: 'Theme 1' },
	},
	{
		id: 'b',
		description: 'Objectif B1',
		refTheme: { label: 'Theme 1' },
	},
	{
		id: 'c',
		description: 'Objectif C',
		refTheme: { label: 'Theme 2' },
	},
	{
		id: 'd',
		description: 'Objectif D',
		refTheme: { label: 'Theme 2' },
	},
];
describe('ProNoteBookTargetCreate', () => {
	test('display a form', () => {
		setupComponent();
		expect(screen.getByText('Objectif')).toBeInTheDocument();
		expect(
			screen.getByText(/Veuillez sélectionner le type de contrat lié à cet objectif/)
		).toBeInTheDocument();
	});

	test('dispatch a cancel event on cancel', async () => {
		const { onCancel } = setupComponent();
		const cancelButton = screen.getByText('Annuler');
		await user.click(cancelButton);

		expect(onCancel).toHaveBeenCalled();
	});

	test('dispatch a data on create target', async () => {
		const { onAdd } = setupComponent();
		const addButton = screen.getByTitle(/Ajouter/);
		const select = screen.getByLabelText(/objectif/i);
		await user.selectOptions(select, ['Objectif B1']);
		expect(addButton).toBeDisabled();
		await user.click(screen.getByText(/CER/i));

		expect(addButton).toBeEnabled();

		await user.click(addButton);
		expect(onAdd).toBeCalledWith({ target: 'Objectif B1', linkedTo: 'cer' });
	});
});

function setupComponent() {
	const { component } = render(ProNotebookTargetCreate, {
		props: {
			targets: targets,
		},
	});
	const onCancel = vi.fn();
	const onAdd = vi.fn();
	component.$on('cancel', onCancel);
	component.$on('create-target', (e) => {
		onAdd(e.detail);
	});
	return { onCancel, onAdd };
}
