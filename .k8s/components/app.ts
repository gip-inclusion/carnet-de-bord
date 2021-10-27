import env from '@kosko/env';
import { create } from '@socialgouv/kosko-charts/components/app';
import { addEnv } from '@socialgouv/kosko-charts/utils/addEnv';
import { getIngressHost } from '@socialgouv/kosko-charts/utils/getIngressHost';
import { getManifestByKind } from '@socialgouv/kosko-charts/utils/getManifestByKind';
import { ok } from 'assert';
import { Deployment } from 'kubernetes-models/apps/v1/Deployment';
import { EnvVar } from 'kubernetes-models/v1/EnvVar';
import { getManifests as getHasuraManifests } from './hasura';
import environments from '@socialgouv/kosko-charts/environments';

export const getManifests = async () => {
	const name = 'app';
	const probesPath = '/healthz';
	const subdomain = 'carnet-de-bord';

	const ciEnv = environments(process.env);
	const version = ciEnv.isPreProduction ? "preprod" : ciEnv.tag || `sha-${ciEnv.sha}`;

	const podProbes = ['livenessProbe', 'readinessProbe', 'startupProbe'].reduce(
		(probes, probe) => ({
			...probes,
			[probe]: {
				httpGet: {
					path: probesPath,
					port: 3000
				},
				initialDelaySeconds: 30,
				periodSeconds: 15
			}
		}),
		{}
	);

	const manifests = await create(name, {
		env,
		config: {
			subdomain,
			ingress: true,
			withPostgres: true,
			containerPort: 3000
		},
		deployment: {
			image: `ghcr.io/socialgouv/carnet-de-bord/app:${version}`,
			container: {
				resources: {
					requests: {
						cpu: '50m',
						memory: '128Mi'
					},
					limits: {
						cpu: '200m',
						memory: '256Mi'
					}
				},
				...podProbes
			}
		}
	});

	return manifests;
};

export default async () => {
	const manifests = await getManifests();

	/* pass dynamic deployment URL as env var to the container */
	//@ts-expect-error
	const deployment = getManifestByKind(manifests, Deployment) as Deployment;

	ok(deployment);

	/* pass dynamic deployment URL as env var to the container */
	const frontendUrl = new EnvVar({
		name: 'APP_URL',
		value: `https://${getIngressHost(manifests)}`
	});

	addEnv({ data: frontendUrl, deployment });

	const hasuraManifests = await getHasuraManifests();

	const hasuraUrl = new EnvVar({
		name: 'VITE_GRAPHQL_API_URL',
		value: `https://${getIngressHost(hasuraManifests)}/v1/graphql`
	});

	addEnv({ deployment, data: hasuraUrl });

	return manifests;
};
