import Knex from 'knex';

import config from './knexfile';
import { dev } from '$app/env';

const knexConfig = config[dev ? 'development' : 'production'];

const knex = Knex(knexConfig);

export default knex;
