const config = {
	client: 'pg',
	connection: {
		database: 'carnet_de_bord',
		host: 'localhost',
		port: 5434,
		user: 'cdb',
		password: 'test'
	},
	pool: {
		min: 2,
		max: 10
	},
	migrations: {
		tableName: 'knex_migrations',
		directory: 'migrations'
	}
};

export default config;
