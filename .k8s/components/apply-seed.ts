import { getDevDatabaseParameters } from '@socialgouv/kosko-charts/components/azure-pg/params';
import environments from '@socialgouv/kosko-charts/environments';
import { readFileSync } from 'fs';
import { CronJob } from 'kubernetes-models/batch/v1beta1/CronJob';
import { ConfigMap, Volume, VolumeMount } from 'kubernetes-models/v1';
import path from 'path';

const ciEnv = environments(process.env);
const pgParams = getDevDatabaseParameters({ suffix: ciEnv.branchSlug });
const configMapName = `apply-seed-configmap-${ciEnv.branchSlug}`;
const volumeName = 'cdb';
const cronjob = new CronJob({
	metadata: {
		name: `apply-seed-cronjob`,
		namespace: ciEnv.metadata.namespace.name,
		annotations: ciEnv.metadata.annotations,
		labels: ciEnv.metadata.labels,
	},
	spec: {
		schedule: '30 12 * * *', // at 12:30, every day,
		jobTemplate: {
			spec: {
				template: {
					metadata: {
						name: `apply-seed-cronjob`,
						namespace: ciEnv.metadata.namespace.name,
						annotations: ciEnv.metadata.annotations,
						labels: ciEnv.metadata.labels,
					},
					spec: {
						restartPolicy: 'OnFailure',
						containers: [
							{
								name: `apply-seed-container`,
								image: `postgres:10.16`,
								command: ['sh', '-c'],
								args: ['psql < /mnt/cdb/seed-data.sql'],
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
								volumeMounts: [new VolumeMount({ mountPath: '/mnt/cdb', name: volumeName })],
							},
						],
						volumes: [
							new Volume({
								name: volumeName,
								configMap: {
									name: configMapName,
								},
							}),
						],
					},
				},
			},
		},
	},
});

const cronJobConfigMap = new ConfigMap({
	data: {
		'seed-data.sql': readFileSync(
			path.join(__dirname, '..', '..', 'hasura', 'seeds', 'carnet_de_bord', 'seed-data.sql')
		).toString(),
	},
	metadata: {
		name: configMapName,
		namespace: ciEnv.metadata.namespace.name,
	},
});

export default [cronjob, cronJobConfigMap];
