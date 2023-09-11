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
	test('dispatch a cancel event on cancel', async () => {
		const { onCancel } = setupComponent();
		const cancelButton = screen.getByText('Annuler');
		await user.click(cancelButton);

		expect(onCancel).toHaveBeenCalled();
	});

	test('dispatch  create-target event', async () => {
		const { onAdd, submit } = setupComponent();
		const select = screen.getByLabelText(/Objectif/);
		await user.selectOptions(select, ['Objectif B1']);
		await user.click(screen.getByText(/CER/i));
		await user.click(screen.getByLabelText(/le bénéficiaire s'engage/i));
		await submit();
		expect(onAdd).toBeCalledWith({ target: 'Objectif B1', linkedTo: 'cer', consent: true });
	});

	test('show error when submited with empty field', async () => {
		const { submit } = setupComponent();
		await submit();
		const statuses = screen.getAllByText(/Ce champ est requis/i);
		expect(statuses.length).toBe(2);
	});

	test('hide error when fixed', async () => {
		const { onAdd, submit } = setupComponent();
		await submit();
		let errorMsg = screen.getAllByText(/Ce champ est requis/i);
		expect(errorMsg.length).toBe(2);
		const select = screen.getByLabelText(/Objectif/);
		await user.selectOptions(select, ['Objectif B1']);
		errorMsg = screen.getAllByText(/Ce champ est requis/i);
		await user.click(screen.getByText(/CER/i));
		expect(screen.queryByText('Ce champ est requis')).toBe(null);
		screen.getByText(/le consentement/i);
		await user.click(screen.getByLabelText(/le bénéficiaire s'engage/i));
		await submit();
		expect(onAdd).toBeCalledWith({ target: 'Objectif B1', linkedTo: 'cer', consent: true });
	});
});

function setupComponent() {
	const { component, debug } = render(ProNotebookTargetCreate, {
		props: {
			targets: targets,
		},
	});
	const onCancel = vi.fn();
	const onAdd = vi.fn();
	const submit = async () => {
		const addButton = screen.getByText(/Ajouter/);
		await user.click(addButton);
	};

	component.$on('cancel', onCancel);
	component.$on('create-target', (e) => {
		onAdd(e.detail);
	});

	return { onCancel, onAdd, submit, debug };
}
