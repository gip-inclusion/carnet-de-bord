import objection, { ColumnNameMappers } from 'objection';
import type { IBeneficiaire, ICompte, IProfessionnel } from 'src/global';
import Beneficiaire from './Beneficiaire';
import knex from './knex';
import Professionnel from './Professionnel';

const { Model, snakeCaseMappers } = objection;

Model.knex(knex);

export default class Compte extends Model implements ICompte {
	id!: string;

	beneficiaire: IBeneficiaire;
	professionnelle: IProfessionnel;

	static tableName = 'compte';

	static get columnNameMappers(): ColumnNameMappers {
		return snakeCaseMappers();
	}

	static relationMappings = {
		beneficiaire: {
			relation: Model.BelongsToOneRelation,
			modelClass: Beneficiaire,
			join: {
				from: 'compte.beneficiaire_id',
				to: 'beneficiaire.id'
			}
		},
		professionnelle: {
			relation: Model.BelongsToOneRelation,
			modelClass: Professionnel,
			join: {
				from: 'compte.professionnelle_id',
				to: 'professionnelle.id'
			}
		}
	};

	static jsonSchema = {
		type: 'object',
		properties: {
			id: { type: 'string' }
		}
	};
}
