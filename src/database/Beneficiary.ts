import objection, { ColumnNameMappers } from 'objection';
import type { Address, Contact, CivilStatus, IBeneficiary } from 'src/global';
import knex from './knex';

const { Model, snakeCaseMappers } = objection;

Model.knex(knex);

export default class Beneficiary extends Model implements IBeneficiary {
	id!: string;
	cafNumber: string;
	peNumber: string;

	civilStatus!: CivilStatus;
	address!: Address;
	contact!: Contact;

	static tableName = 'beneficiary';

	static get columnNameMappers(): ColumnNameMappers {
		return snakeCaseMappers();
	}

	static jsonSchema = {
		type: 'object',
		properties: {
			id: { type: 'string' },
			address: {
				type: 'object',
				properties: {
					postalCode: { type: 'string' },
					city: { type: 'string' },
					address1: { type: 'string' }
				}
			},
			civilStatus: {
				type: 'object',
				properties: {
					civility: { type: 'string' },
					lastname: { type: 'string' },
					firstname: { type: 'string' }
				}
			},
			contact: {
				type: 'object',
				properties: {
					mobileNumber: { type: 'string' },
					email: { type: 'string' }
				}
			}
		}
	};
}
