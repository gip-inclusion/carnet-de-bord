import Knex from 'knex';

import config from '../../knexfile';

const knex = Knex(config);

export default knex;
