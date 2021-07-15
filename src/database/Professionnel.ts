import objection, { ColumnNameMappers } from 'objection';
import type { Contact, EtatCivile, IProfessionnel } from 'src/global';
import knex from './knex';
import Structure from './Structure';

const { Model, snakeCaseMappers } = objection;

Model.knex(knex);

export default class Professionnel extends Model implements IProfessionnel {
	id!: string;
	etatCivile!: EtatCivile;
	contact!: Contact;
	structure: Structure;

	static tableName = 'professionnel';

	static get columnNameMappers(): ColumnNameMappers {
		return snakeCaseMappers();
	}

	static relationMappings = {
		structure: {
			relation: Model.BelongsToOneRelation,
			modelClass: Structure,
			join: {
				from: 'professionnel.structure_id',
				to: 'structure.id'
			}
		}
	};

	static jsonSchema = {
		type: 'object',
		properties: {
			id: { type: 'string' },
			adresse: {
				type: 'object',
				properties: {
					codePostal: { type: 'string' },
					commune: { type: 'string' },
					voie: { type: 'string' }
				}
			},
			etatCivile: {
				type: 'object',
				properties: {
					civilite: { type: 'string' },
					nom: { type: 'string' },
					prenom: { type: 'string' }
				}
			},
			contact: {
				type: 'object',
				properties: {
					telPortable: { type: 'string' },
					email: { type: 'string' }
				}
			}
		}
	};
}
