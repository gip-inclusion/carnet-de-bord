import { getDevDatabaseParameters } from '@socialgouv/kosko-charts/components/azure-pg/params';
import { Job } from 'kubernetes-models/batch/v1';
import environments from '@socialgouv/kosko-charts/environments';

const ciEnv = environments(process.env);
const pgParams = getDevDatabaseParameters({ suffix: ciEnv.branchSlug });

const job = new Job({
	metadata: {
		name: 'restore-db-' + (new Date()).getTime(),
		namespace: 'carnet-de-bord-ci',
		labels: ciEnv.metadata.labels,
		annotations: ciEnv.metadata.annotations,
	},
	spec: {
		template: {
			metadata: {},
			spec: {
				volumes: [
					{
						name: 'restore-db-volume',
						emptyDir: {},
					},
				],
				initContainers: [
					{
						name: 'restore-db-init',
						image: 'alpine/git:v2.30.2',
						command: ['git'],
						args: [
							'clone',
							'-b',
							`${ciEnv.branch}`,
							'--single-branch',
							'--depth=1',
							'https://github.com/SocialGouv/carnet-de-bord.git',
							'/mnt/carnet-de-bord',
						],
						volumeMounts: [
							{
								name: 'restore-db-volume',
								mountPath: '/mnt/carnet-de-bord',
							},
						],
					},
				],
				containers: [
					{
						name: 'restore-db',
						image: 'postgres:10.16',
						command: ['sh', '-c'],
						args: ['psql < /mnt/carnet-de-bord/hasura/seeds/carnet_de_bord/seed-data.sql'],
						envFrom: [
							{
								secretRef: {
									name: 'azure-pg-admin-user',
								},
							},
						],
						env: [
							{
								name: 'PGDATABASE',
								value: pgParams.database,
							},
						],
						volumeMounts: [
							{
								name: 'restore-db-volume',
								mountPath: '/mnt/carnet-de-bord',
							},
						],
					},
				],
				restartPolicy: 'OnFailure',
			},
		},
		ttlSecondsAfterFinished: 86400,
	},
});

export default [job];
