import { getDatabaseUrl } from '../variables/private';

const pool = {
	max: 5,
	min: 5,
	propagateCreateError: false,
};

const databaseUrl = getDatabaseUrl();

const config = {
	development: {
		client: 'pg',
		connection: databaseUrl || {
			database: 'carnet_de_bord',
			host: 'localhost',
			password: 'test',
			port: '5434',
			user: 'cdb',
		},
		migrations: {},
		pool,
	},
	production: {
		client: 'pg',
		connection: databaseUrl,
		migrations: {},
		pool,
	},
};

export default config;
