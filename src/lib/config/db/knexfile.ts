import { getDatabaseUrl } from '../variables';

const pool = {
	max: 5,
	min: 5,
	propagateCreateError: false
};

const config = {
	development: {
		client: 'pg',
		connection: getDatabaseUrl() || {
			database: 'carnet_de_bord',
			host: 'localhost',
			password: 'test',
			port: '5434',
			user: 'cdb'
		},
		migrations: {},
		pool
	},
	production: {
		client: 'pg',
		connection: getDatabaseUrl(),
		migrations: {},
		pool
	}
};

export default config;
