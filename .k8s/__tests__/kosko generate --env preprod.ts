import { getEnvManifests } from '@socialgouv/kosko-charts/testing';
import { project } from '@socialgouv/kosko-charts/testing/fake/github-actions.env';

jest.setTimeout(1000 * 60);

test('kosko generate --preprod', async () => {
	expect(
		await getEnvManifests('preprod', '', {
			...project('carnet-de-bord').preprod,
			RANCHER_PROJECT_ID: 'c-gjtkk:p-xgnjr'
		})
	).toMatchSnapshot();
});
