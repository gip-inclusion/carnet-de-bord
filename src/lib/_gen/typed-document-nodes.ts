import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
	ID: string;
	String: string;
	Boolean: boolean;
	Int: number;
	Float: number;
	timestamptz: any;
	uuid: any;
};

/** Boolean expression to compare columns of type "String". All fields are combined with logical 'AND'. */
export type String_Comparison_Exp = {
	_eq?: Maybe<Scalars['String']>;
	_gt?: Maybe<Scalars['String']>;
	_gte?: Maybe<Scalars['String']>;
	/** does the column match the given case-insensitive pattern */
	_ilike?: Maybe<Scalars['String']>;
	_in?: Maybe<Array<Scalars['String']>>;
	/** does the column match the given POSIX regular expression, case insensitive */
	_iregex?: Maybe<Scalars['String']>;
	_is_null?: Maybe<Scalars['Boolean']>;
	/** does the column match the given pattern */
	_like?: Maybe<Scalars['String']>;
	_lt?: Maybe<Scalars['String']>;
	_lte?: Maybe<Scalars['String']>;
	_neq?: Maybe<Scalars['String']>;
	/** does the column NOT match the given case-insensitive pattern */
	_nilike?: Maybe<Scalars['String']>;
	_nin?: Maybe<Array<Scalars['String']>>;
	/** does the column NOT match the given POSIX regular expression, case insensitive */
	_niregex?: Maybe<Scalars['String']>;
	/** does the column NOT match the given pattern */
	_nlike?: Maybe<Scalars['String']>;
	/** does the column NOT match the given POSIX regular expression, case sensitive */
	_nregex?: Maybe<Scalars['String']>;
	/** does the column NOT match the given SQL regular expression */
	_nsimilar?: Maybe<Scalars['String']>;
	/** does the column match the given POSIX regular expression, case sensitive */
	_regex?: Maybe<Scalars['String']>;
	/** does the column match the given SQL regular expression */
	_similar?: Maybe<Scalars['String']>;
};

/** columns and relationships of "account" */
export type Account = {
	__typename?: 'account';
	access_key?: Maybe<Scalars['String']>;
	access_key_date?: Maybe<Scalars['timestamptz']>;
	/** An object relationship */
	admin?: Maybe<Admin>;
	admin_id?: Maybe<Scalars['uuid']>;
	/** An object relationship */
	beneficiary?: Maybe<Beneficiary>;
	beneficiary_id?: Maybe<Scalars['uuid']>;
	id: Scalars['uuid'];
	last_login?: Maybe<Scalars['timestamptz']>;
	/** An object relationship */
	professional?: Maybe<Professional>;
	professional_id?: Maybe<Scalars['uuid']>;
	type: Scalars['String'];
	username: Scalars['String'];
};

/** aggregated selection of "account" */
export type Account_Aggregate = {
	__typename?: 'account_aggregate';
	aggregate?: Maybe<Account_Aggregate_Fields>;
	nodes: Array<Account>;
};

/** aggregate fields of "account" */
export type Account_Aggregate_Fields = {
	__typename?: 'account_aggregate_fields';
	count: Scalars['Int'];
	max?: Maybe<Account_Max_Fields>;
	min?: Maybe<Account_Min_Fields>;
};

/** aggregate fields of "account" */
export type Account_Aggregate_FieldsCountArgs = {
	columns?: Maybe<Array<Account_Select_Column>>;
	distinct?: Maybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "account" */
export type Account_Aggregate_Order_By = {
	count?: Maybe<Order_By>;
	max?: Maybe<Account_Max_Order_By>;
	min?: Maybe<Account_Min_Order_By>;
};

/** input type for inserting array relation for remote table "account" */
export type Account_Arr_Rel_Insert_Input = {
	data: Array<Account_Insert_Input>;
	/** on conflict condition */
	on_conflict?: Maybe<Account_On_Conflict>;
};

/** Boolean expression to filter rows from the table "account". All fields are combined with a logical 'AND'. */
export type Account_Bool_Exp = {
	_and?: Maybe<Array<Account_Bool_Exp>>;
	_not?: Maybe<Account_Bool_Exp>;
	_or?: Maybe<Array<Account_Bool_Exp>>;
	access_key?: Maybe<String_Comparison_Exp>;
	access_key_date?: Maybe<Timestamptz_Comparison_Exp>;
	admin?: Maybe<Admin_Bool_Exp>;
	admin_id?: Maybe<Uuid_Comparison_Exp>;
	beneficiary?: Maybe<Beneficiary_Bool_Exp>;
	beneficiary_id?: Maybe<Uuid_Comparison_Exp>;
	id?: Maybe<Uuid_Comparison_Exp>;
	last_login?: Maybe<Timestamptz_Comparison_Exp>;
	professional?: Maybe<Professional_Bool_Exp>;
	professional_id?: Maybe<Uuid_Comparison_Exp>;
	type?: Maybe<String_Comparison_Exp>;
	username?: Maybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "account" */
export enum Account_Constraint {
	/** unique or primary key constraint */
	AccountPkey = 'account_pkey',
	/** unique or primary key constraint */
	AccountUsernameUnique = 'account_username_unique'
}

/** input type for inserting data into table "account" */
export type Account_Insert_Input = {
	access_key?: Maybe<Scalars['String']>;
	access_key_date?: Maybe<Scalars['timestamptz']>;
	admin?: Maybe<Admin_Obj_Rel_Insert_Input>;
	admin_id?: Maybe<Scalars['uuid']>;
	beneficiary?: Maybe<Beneficiary_Obj_Rel_Insert_Input>;
	beneficiary_id?: Maybe<Scalars['uuid']>;
	id?: Maybe<Scalars['uuid']>;
	last_login?: Maybe<Scalars['timestamptz']>;
	professional?: Maybe<Professional_Obj_Rel_Insert_Input>;
	professional_id?: Maybe<Scalars['uuid']>;
	type?: Maybe<Scalars['String']>;
	username?: Maybe<Scalars['String']>;
};

/** aggregate max on columns */
export type Account_Max_Fields = {
	__typename?: 'account_max_fields';
	access_key?: Maybe<Scalars['String']>;
	access_key_date?: Maybe<Scalars['timestamptz']>;
	admin_id?: Maybe<Scalars['uuid']>;
	beneficiary_id?: Maybe<Scalars['uuid']>;
	id?: Maybe<Scalars['uuid']>;
	last_login?: Maybe<Scalars['timestamptz']>;
	professional_id?: Maybe<Scalars['uuid']>;
	type?: Maybe<Scalars['String']>;
	username?: Maybe<Scalars['String']>;
};

/** order by max() on columns of table "account" */
export type Account_Max_Order_By = {
	access_key?: Maybe<Order_By>;
	access_key_date?: Maybe<Order_By>;
	admin_id?: Maybe<Order_By>;
	beneficiary_id?: Maybe<Order_By>;
	id?: Maybe<Order_By>;
	last_login?: Maybe<Order_By>;
	professional_id?: Maybe<Order_By>;
	type?: Maybe<Order_By>;
	username?: Maybe<Order_By>;
};

/** aggregate min on columns */
export type Account_Min_Fields = {
	__typename?: 'account_min_fields';
	access_key?: Maybe<Scalars['String']>;
	access_key_date?: Maybe<Scalars['timestamptz']>;
	admin_id?: Maybe<Scalars['uuid']>;
	beneficiary_id?: Maybe<Scalars['uuid']>;
	id?: Maybe<Scalars['uuid']>;
	last_login?: Maybe<Scalars['timestamptz']>;
	professional_id?: Maybe<Scalars['uuid']>;
	type?: Maybe<Scalars['String']>;
	username?: Maybe<Scalars['String']>;
};

/** order by min() on columns of table "account" */
export type Account_Min_Order_By = {
	access_key?: Maybe<Order_By>;
	access_key_date?: Maybe<Order_By>;
	admin_id?: Maybe<Order_By>;
	beneficiary_id?: Maybe<Order_By>;
	id?: Maybe<Order_By>;
	last_login?: Maybe<Order_By>;
	professional_id?: Maybe<Order_By>;
	type?: Maybe<Order_By>;
	username?: Maybe<Order_By>;
};

/** response of any mutation on the table "account" */
export type Account_Mutation_Response = {
	__typename?: 'account_mutation_response';
	/** number of rows affected by the mutation */
	affected_rows: Scalars['Int'];
	/** data from the rows affected by the mutation */
	returning: Array<Account>;
};

/** on conflict condition type for table "account" */
export type Account_On_Conflict = {
	constraint: Account_Constraint;
	update_columns?: Array<Account_Update_Column>;
	where?: Maybe<Account_Bool_Exp>;
};

/** Ordering options when selecting data from "account". */
export type Account_Order_By = {
	access_key?: Maybe<Order_By>;
	access_key_date?: Maybe<Order_By>;
	admin?: Maybe<Admin_Order_By>;
	admin_id?: Maybe<Order_By>;
	beneficiary?: Maybe<Beneficiary_Order_By>;
	beneficiary_id?: Maybe<Order_By>;
	id?: Maybe<Order_By>;
	last_login?: Maybe<Order_By>;
	professional?: Maybe<Professional_Order_By>;
	professional_id?: Maybe<Order_By>;
	type?: Maybe<Order_By>;
	username?: Maybe<Order_By>;
};

/** primary key columns input for table: account */
export type Account_Pk_Columns_Input = {
	id: Scalars['uuid'];
};

/** select columns of table "account" */
export enum Account_Select_Column {
	/** column name */
	AccessKey = 'access_key',
	/** column name */
	AccessKeyDate = 'access_key_date',
	/** column name */
	AdminId = 'admin_id',
	/** column name */
	BeneficiaryId = 'beneficiary_id',
	/** column name */
	Id = 'id',
	/** column name */
	LastLogin = 'last_login',
	/** column name */
	ProfessionalId = 'professional_id',
	/** column name */
	Type = 'type',
	/** column name */
	Username = 'username'
}

/** input type for updating data in table "account" */
export type Account_Set_Input = {
	access_key?: Maybe<Scalars['String']>;
	access_key_date?: Maybe<Scalars['timestamptz']>;
	admin_id?: Maybe<Scalars['uuid']>;
	beneficiary_id?: Maybe<Scalars['uuid']>;
	id?: Maybe<Scalars['uuid']>;
	last_login?: Maybe<Scalars['timestamptz']>;
	professional_id?: Maybe<Scalars['uuid']>;
	type?: Maybe<Scalars['String']>;
	username?: Maybe<Scalars['String']>;
};

/** update columns of table "account" */
export enum Account_Update_Column {
	/** column name */
	AccessKey = 'access_key',
	/** column name */
	AccessKeyDate = 'access_key_date',
	/** column name */
	AdminId = 'admin_id',
	/** column name */
	BeneficiaryId = 'beneficiary_id',
	/** column name */
	Id = 'id',
	/** column name */
	LastLogin = 'last_login',
	/** column name */
	ProfessionalId = 'professional_id',
	/** column name */
	Type = 'type',
	/** column name */
	Username = 'username'
}

/** columns and relationships of "admin" */
export type Admin = {
	__typename?: 'admin';
	/** An array relationship */
	accounts: Array<Account>;
	/** An aggregate relationship */
	accounts_aggregate: Account_Aggregate;
	email: Scalars['String'];
	id: Scalars['uuid'];
};

/** columns and relationships of "admin" */
export type AdminAccountsArgs = {
	distinct_on?: Maybe<Array<Account_Select_Column>>;
	limit?: Maybe<Scalars['Int']>;
	offset?: Maybe<Scalars['Int']>;
	order_by?: Maybe<Array<Account_Order_By>>;
	where?: Maybe<Account_Bool_Exp>;
};

/** columns and relationships of "admin" */
export type AdminAccounts_AggregateArgs = {
	distinct_on?: Maybe<Array<Account_Select_Column>>;
	limit?: Maybe<Scalars['Int']>;
	offset?: Maybe<Scalars['Int']>;
	order_by?: Maybe<Array<Account_Order_By>>;
	where?: Maybe<Account_Bool_Exp>;
};

/** aggregated selection of "admin" */
export type Admin_Aggregate = {
	__typename?: 'admin_aggregate';
	aggregate?: Maybe<Admin_Aggregate_Fields>;
	nodes: Array<Admin>;
};

/** aggregate fields of "admin" */
export type Admin_Aggregate_Fields = {
	__typename?: 'admin_aggregate_fields';
	count: Scalars['Int'];
	max?: Maybe<Admin_Max_Fields>;
	min?: Maybe<Admin_Min_Fields>;
};

/** aggregate fields of "admin" */
export type Admin_Aggregate_FieldsCountArgs = {
	columns?: Maybe<Array<Admin_Select_Column>>;
	distinct?: Maybe<Scalars['Boolean']>;
};

/** Boolean expression to filter rows from the table "admin". All fields are combined with a logical 'AND'. */
export type Admin_Bool_Exp = {
	_and?: Maybe<Array<Admin_Bool_Exp>>;
	_not?: Maybe<Admin_Bool_Exp>;
	_or?: Maybe<Array<Admin_Bool_Exp>>;
	accounts?: Maybe<Account_Bool_Exp>;
	email?: Maybe<String_Comparison_Exp>;
	id?: Maybe<Uuid_Comparison_Exp>;
};

/** unique or primary key constraints on table "admin" */
export enum Admin_Constraint {
	/** unique or primary key constraint */
	AdminEmailUnique = 'admin_email_unique',
	/** unique or primary key constraint */
	AdminPkey = 'admin_pkey'
}

/** input type for inserting data into table "admin" */
export type Admin_Insert_Input = {
	accounts?: Maybe<Account_Arr_Rel_Insert_Input>;
	email?: Maybe<Scalars['String']>;
	id?: Maybe<Scalars['uuid']>;
};

/** aggregate max on columns */
export type Admin_Max_Fields = {
	__typename?: 'admin_max_fields';
	email?: Maybe<Scalars['String']>;
	id?: Maybe<Scalars['uuid']>;
};

/** aggregate min on columns */
export type Admin_Min_Fields = {
	__typename?: 'admin_min_fields';
	email?: Maybe<Scalars['String']>;
	id?: Maybe<Scalars['uuid']>;
};

/** response of any mutation on the table "admin" */
export type Admin_Mutation_Response = {
	__typename?: 'admin_mutation_response';
	/** number of rows affected by the mutation */
	affected_rows: Scalars['Int'];
	/** data from the rows affected by the mutation */
	returning: Array<Admin>;
};

/** input type for inserting object relation for remote table "admin" */
export type Admin_Obj_Rel_Insert_Input = {
	data: Admin_Insert_Input;
	/** on conflict condition */
	on_conflict?: Maybe<Admin_On_Conflict>;
};

/** on conflict condition type for table "admin" */
export type Admin_On_Conflict = {
	constraint: Admin_Constraint;
	update_columns?: Array<Admin_Update_Column>;
	where?: Maybe<Admin_Bool_Exp>;
};

/** Ordering options when selecting data from "admin". */
export type Admin_Order_By = {
	accounts_aggregate?: Maybe<Account_Aggregate_Order_By>;
	email?: Maybe<Order_By>;
	id?: Maybe<Order_By>;
};

/** primary key columns input for table: admin */
export type Admin_Pk_Columns_Input = {
	id: Scalars['uuid'];
};

/** select columns of table "admin" */
export enum Admin_Select_Column {
	/** column name */
	Email = 'email',
	/** column name */
	Id = 'id'
}

/** input type for updating data in table "admin" */
export type Admin_Set_Input = {
	email?: Maybe<Scalars['String']>;
	id?: Maybe<Scalars['uuid']>;
};

/** update columns of table "admin" */
export enum Admin_Update_Column {
	/** column name */
	Email = 'email',
	/** column name */
	Id = 'id'
}

/** columns and relationships of "beneficiary" */
export type Beneficiary = {
	__typename?: 'beneficiary';
	/** An array relationship */
	accounts: Array<Account>;
	/** An aggregate relationship */
	accounts_aggregate: Account_Aggregate;
	address1?: Maybe<Scalars['String']>;
	address2?: Maybe<Scalars['String']>;
	caf_number?: Maybe<Scalars['String']>;
	city?: Maybe<Scalars['String']>;
	email: Scalars['String'];
	firstname: Scalars['String'];
	id: Scalars['uuid'];
	lastname: Scalars['String'];
	mobile_number?: Maybe<Scalars['String']>;
	pe_number?: Maybe<Scalars['String']>;
	postal_code?: Maybe<Scalars['String']>;
};

/** columns and relationships of "beneficiary" */
export type BeneficiaryAccountsArgs = {
	distinct_on?: Maybe<Array<Account_Select_Column>>;
	limit?: Maybe<Scalars['Int']>;
	offset?: Maybe<Scalars['Int']>;
	order_by?: Maybe<Array<Account_Order_By>>;
	where?: Maybe<Account_Bool_Exp>;
};

/** columns and relationships of "beneficiary" */
export type BeneficiaryAccounts_AggregateArgs = {
	distinct_on?: Maybe<Array<Account_Select_Column>>;
	limit?: Maybe<Scalars['Int']>;
	offset?: Maybe<Scalars['Int']>;
	order_by?: Maybe<Array<Account_Order_By>>;
	where?: Maybe<Account_Bool_Exp>;
};

/** aggregated selection of "beneficiary" */
export type Beneficiary_Aggregate = {
	__typename?: 'beneficiary_aggregate';
	aggregate?: Maybe<Beneficiary_Aggregate_Fields>;
	nodes: Array<Beneficiary>;
};

/** aggregate fields of "beneficiary" */
export type Beneficiary_Aggregate_Fields = {
	__typename?: 'beneficiary_aggregate_fields';
	count: Scalars['Int'];
	max?: Maybe<Beneficiary_Max_Fields>;
	min?: Maybe<Beneficiary_Min_Fields>;
};

/** aggregate fields of "beneficiary" */
export type Beneficiary_Aggregate_FieldsCountArgs = {
	columns?: Maybe<Array<Beneficiary_Select_Column>>;
	distinct?: Maybe<Scalars['Boolean']>;
};

/** Boolean expression to filter rows from the table "beneficiary". All fields are combined with a logical 'AND'. */
export type Beneficiary_Bool_Exp = {
	_and?: Maybe<Array<Beneficiary_Bool_Exp>>;
	_not?: Maybe<Beneficiary_Bool_Exp>;
	_or?: Maybe<Array<Beneficiary_Bool_Exp>>;
	accounts?: Maybe<Account_Bool_Exp>;
	address1?: Maybe<String_Comparison_Exp>;
	address2?: Maybe<String_Comparison_Exp>;
	caf_number?: Maybe<String_Comparison_Exp>;
	city?: Maybe<String_Comparison_Exp>;
	email?: Maybe<String_Comparison_Exp>;
	firstname?: Maybe<String_Comparison_Exp>;
	id?: Maybe<Uuid_Comparison_Exp>;
	lastname?: Maybe<String_Comparison_Exp>;
	mobile_number?: Maybe<String_Comparison_Exp>;
	pe_number?: Maybe<String_Comparison_Exp>;
	postal_code?: Maybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "beneficiary" */
export enum Beneficiary_Constraint {
	/** unique or primary key constraint */
	BeneficiaryEmailUnique = 'beneficiary_email_unique',
	/** unique or primary key constraint */
	BeneficiaryPkey = 'beneficiary_pkey'
}

/** input type for inserting data into table "beneficiary" */
export type Beneficiary_Insert_Input = {
	accounts?: Maybe<Account_Arr_Rel_Insert_Input>;
	address1?: Maybe<Scalars['String']>;
	address2?: Maybe<Scalars['String']>;
	caf_number?: Maybe<Scalars['String']>;
	city?: Maybe<Scalars['String']>;
	email?: Maybe<Scalars['String']>;
	firstname?: Maybe<Scalars['String']>;
	id?: Maybe<Scalars['uuid']>;
	lastname?: Maybe<Scalars['String']>;
	mobile_number?: Maybe<Scalars['String']>;
	pe_number?: Maybe<Scalars['String']>;
	postal_code?: Maybe<Scalars['String']>;
};

/** aggregate max on columns */
export type Beneficiary_Max_Fields = {
	__typename?: 'beneficiary_max_fields';
	address1?: Maybe<Scalars['String']>;
	address2?: Maybe<Scalars['String']>;
	caf_number?: Maybe<Scalars['String']>;
	city?: Maybe<Scalars['String']>;
	email?: Maybe<Scalars['String']>;
	firstname?: Maybe<Scalars['String']>;
	id?: Maybe<Scalars['uuid']>;
	lastname?: Maybe<Scalars['String']>;
	mobile_number?: Maybe<Scalars['String']>;
	pe_number?: Maybe<Scalars['String']>;
	postal_code?: Maybe<Scalars['String']>;
};

/** aggregate min on columns */
export type Beneficiary_Min_Fields = {
	__typename?: 'beneficiary_min_fields';
	address1?: Maybe<Scalars['String']>;
	address2?: Maybe<Scalars['String']>;
	caf_number?: Maybe<Scalars['String']>;
	city?: Maybe<Scalars['String']>;
	email?: Maybe<Scalars['String']>;
	firstname?: Maybe<Scalars['String']>;
	id?: Maybe<Scalars['uuid']>;
	lastname?: Maybe<Scalars['String']>;
	mobile_number?: Maybe<Scalars['String']>;
	pe_number?: Maybe<Scalars['String']>;
	postal_code?: Maybe<Scalars['String']>;
};

/** response of any mutation on the table "beneficiary" */
export type Beneficiary_Mutation_Response = {
	__typename?: 'beneficiary_mutation_response';
	/** number of rows affected by the mutation */
	affected_rows: Scalars['Int'];
	/** data from the rows affected by the mutation */
	returning: Array<Beneficiary>;
};

/** input type for inserting object relation for remote table "beneficiary" */
export type Beneficiary_Obj_Rel_Insert_Input = {
	data: Beneficiary_Insert_Input;
	/** on conflict condition */
	on_conflict?: Maybe<Beneficiary_On_Conflict>;
};

/** on conflict condition type for table "beneficiary" */
export type Beneficiary_On_Conflict = {
	constraint: Beneficiary_Constraint;
	update_columns?: Array<Beneficiary_Update_Column>;
	where?: Maybe<Beneficiary_Bool_Exp>;
};

/** Ordering options when selecting data from "beneficiary". */
export type Beneficiary_Order_By = {
	accounts_aggregate?: Maybe<Account_Aggregate_Order_By>;
	address1?: Maybe<Order_By>;
	address2?: Maybe<Order_By>;
	caf_number?: Maybe<Order_By>;
	city?: Maybe<Order_By>;
	email?: Maybe<Order_By>;
	firstname?: Maybe<Order_By>;
	id?: Maybe<Order_By>;
	lastname?: Maybe<Order_By>;
	mobile_number?: Maybe<Order_By>;
	pe_number?: Maybe<Order_By>;
	postal_code?: Maybe<Order_By>;
};

/** primary key columns input for table: beneficiary */
export type Beneficiary_Pk_Columns_Input = {
	id: Scalars['uuid'];
};

/** select columns of table "beneficiary" */
export enum Beneficiary_Select_Column {
	/** column name */
	Address1 = 'address1',
	/** column name */
	Address2 = 'address2',
	/** column name */
	CafNumber = 'caf_number',
	/** column name */
	City = 'city',
	/** column name */
	Email = 'email',
	/** column name */
	Firstname = 'firstname',
	/** column name */
	Id = 'id',
	/** column name */
	Lastname = 'lastname',
	/** column name */
	MobileNumber = 'mobile_number',
	/** column name */
	PeNumber = 'pe_number',
	/** column name */
	PostalCode = 'postal_code'
}

/** input type for updating data in table "beneficiary" */
export type Beneficiary_Set_Input = {
	address1?: Maybe<Scalars['String']>;
	address2?: Maybe<Scalars['String']>;
	caf_number?: Maybe<Scalars['String']>;
	city?: Maybe<Scalars['String']>;
	email?: Maybe<Scalars['String']>;
	firstname?: Maybe<Scalars['String']>;
	id?: Maybe<Scalars['uuid']>;
	lastname?: Maybe<Scalars['String']>;
	mobile_number?: Maybe<Scalars['String']>;
	pe_number?: Maybe<Scalars['String']>;
	postal_code?: Maybe<Scalars['String']>;
};

/** update columns of table "beneficiary" */
export enum Beneficiary_Update_Column {
	/** column name */
	Address1 = 'address1',
	/** column name */
	Address2 = 'address2',
	/** column name */
	CafNumber = 'caf_number',
	/** column name */
	City = 'city',
	/** column name */
	Email = 'email',
	/** column name */
	Firstname = 'firstname',
	/** column name */
	Id = 'id',
	/** column name */
	Lastname = 'lastname',
	/** column name */
	MobileNumber = 'mobile_number',
	/** column name */
	PeNumber = 'pe_number',
	/** column name */
	PostalCode = 'postal_code'
}

/** mutation root */
export type Mutation_Root = {
	__typename?: 'mutation_root';
	/** delete data from the table: "account" */
	delete_account?: Maybe<Account_Mutation_Response>;
	/** delete single row from the table: "account" */
	delete_account_by_pk?: Maybe<Account>;
	/** delete data from the table: "admin" */
	delete_admin?: Maybe<Admin_Mutation_Response>;
	/** delete single row from the table: "admin" */
	delete_admin_by_pk?: Maybe<Admin>;
	/** delete data from the table: "beneficiary" */
	delete_beneficiary?: Maybe<Beneficiary_Mutation_Response>;
	/** delete single row from the table: "beneficiary" */
	delete_beneficiary_by_pk?: Maybe<Beneficiary>;
	/** delete data from the table: "professional" */
	delete_professional?: Maybe<Professional_Mutation_Response>;
	/** delete single row from the table: "professional" */
	delete_professional_by_pk?: Maybe<Professional>;
	/** delete data from the table: "structure" */
	delete_structure?: Maybe<Structure_Mutation_Response>;
	/** delete single row from the table: "structure" */
	delete_structure_by_pk?: Maybe<Structure>;
	/** insert data into the table: "account" */
	insert_account?: Maybe<Account_Mutation_Response>;
	/** insert a single row into the table: "account" */
	insert_account_one?: Maybe<Account>;
	/** insert data into the table: "admin" */
	insert_admin?: Maybe<Admin_Mutation_Response>;
	/** insert a single row into the table: "admin" */
	insert_admin_one?: Maybe<Admin>;
	/** insert data into the table: "beneficiary" */
	insert_beneficiary?: Maybe<Beneficiary_Mutation_Response>;
	/** insert a single row into the table: "beneficiary" */
	insert_beneficiary_one?: Maybe<Beneficiary>;
	/** insert data into the table: "professional" */
	insert_professional?: Maybe<Professional_Mutation_Response>;
	/** insert a single row into the table: "professional" */
	insert_professional_one?: Maybe<Professional>;
	/** insert data into the table: "structure" */
	insert_structure?: Maybe<Structure_Mutation_Response>;
	/** insert a single row into the table: "structure" */
	insert_structure_one?: Maybe<Structure>;
	/** update data of the table: "account" */
	update_account?: Maybe<Account_Mutation_Response>;
	/** update single row of the table: "account" */
	update_account_by_pk?: Maybe<Account>;
	/** update data of the table: "admin" */
	update_admin?: Maybe<Admin_Mutation_Response>;
	/** update single row of the table: "admin" */
	update_admin_by_pk?: Maybe<Admin>;
	/** update data of the table: "beneficiary" */
	update_beneficiary?: Maybe<Beneficiary_Mutation_Response>;
	/** update single row of the table: "beneficiary" */
	update_beneficiary_by_pk?: Maybe<Beneficiary>;
	/** update data of the table: "professional" */
	update_professional?: Maybe<Professional_Mutation_Response>;
	/** update single row of the table: "professional" */
	update_professional_by_pk?: Maybe<Professional>;
	/** update data of the table: "structure" */
	update_structure?: Maybe<Structure_Mutation_Response>;
	/** update single row of the table: "structure" */
	update_structure_by_pk?: Maybe<Structure>;
};

/** mutation root */
export type Mutation_RootDelete_AccountArgs = {
	where: Account_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Account_By_PkArgs = {
	id: Scalars['uuid'];
};

/** mutation root */
export type Mutation_RootDelete_AdminArgs = {
	where: Admin_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Admin_By_PkArgs = {
	id: Scalars['uuid'];
};

/** mutation root */
export type Mutation_RootDelete_BeneficiaryArgs = {
	where: Beneficiary_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Beneficiary_By_PkArgs = {
	id: Scalars['uuid'];
};

/** mutation root */
export type Mutation_RootDelete_ProfessionalArgs = {
	where: Professional_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Professional_By_PkArgs = {
	id: Scalars['uuid'];
};

/** mutation root */
export type Mutation_RootDelete_StructureArgs = {
	where: Structure_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Structure_By_PkArgs = {
	id: Scalars['uuid'];
};

/** mutation root */
export type Mutation_RootInsert_AccountArgs = {
	objects: Array<Account_Insert_Input>;
	on_conflict?: Maybe<Account_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Account_OneArgs = {
	object: Account_Insert_Input;
	on_conflict?: Maybe<Account_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_AdminArgs = {
	objects: Array<Admin_Insert_Input>;
	on_conflict?: Maybe<Admin_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Admin_OneArgs = {
	object: Admin_Insert_Input;
	on_conflict?: Maybe<Admin_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_BeneficiaryArgs = {
	objects: Array<Beneficiary_Insert_Input>;
	on_conflict?: Maybe<Beneficiary_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Beneficiary_OneArgs = {
	object: Beneficiary_Insert_Input;
	on_conflict?: Maybe<Beneficiary_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_ProfessionalArgs = {
	objects: Array<Professional_Insert_Input>;
	on_conflict?: Maybe<Professional_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Professional_OneArgs = {
	object: Professional_Insert_Input;
	on_conflict?: Maybe<Professional_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_StructureArgs = {
	objects: Array<Structure_Insert_Input>;
	on_conflict?: Maybe<Structure_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Structure_OneArgs = {
	object: Structure_Insert_Input;
	on_conflict?: Maybe<Structure_On_Conflict>;
};

/** mutation root */
export type Mutation_RootUpdate_AccountArgs = {
	_set?: Maybe<Account_Set_Input>;
	where: Account_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Account_By_PkArgs = {
	_set?: Maybe<Account_Set_Input>;
	pk_columns: Account_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdate_AdminArgs = {
	_set?: Maybe<Admin_Set_Input>;
	where: Admin_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Admin_By_PkArgs = {
	_set?: Maybe<Admin_Set_Input>;
	pk_columns: Admin_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdate_BeneficiaryArgs = {
	_set?: Maybe<Beneficiary_Set_Input>;
	where: Beneficiary_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Beneficiary_By_PkArgs = {
	_set?: Maybe<Beneficiary_Set_Input>;
	pk_columns: Beneficiary_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdate_ProfessionalArgs = {
	_set?: Maybe<Professional_Set_Input>;
	where: Professional_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Professional_By_PkArgs = {
	_set?: Maybe<Professional_Set_Input>;
	pk_columns: Professional_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdate_StructureArgs = {
	_set?: Maybe<Structure_Set_Input>;
	where: Structure_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Structure_By_PkArgs = {
	_set?: Maybe<Structure_Set_Input>;
	pk_columns: Structure_Pk_Columns_Input;
};

/** column ordering options */
export enum Order_By {
	/** in ascending order, nulls last */
	Asc = 'asc',
	/** in ascending order, nulls first */
	AscNullsFirst = 'asc_nulls_first',
	/** in ascending order, nulls last */
	AscNullsLast = 'asc_nulls_last',
	/** in descending order, nulls first */
	Desc = 'desc',
	/** in descending order, nulls first */
	DescNullsFirst = 'desc_nulls_first',
	/** in descending order, nulls last */
	DescNullsLast = 'desc_nulls_last'
}

/** columns and relationships of "professional" */
export type Professional = {
	__typename?: 'professional';
	/** An array relationship */
	accounts: Array<Account>;
	/** An aggregate relationship */
	accounts_aggregate: Account_Aggregate;
	email: Scalars['String'];
	firstname: Scalars['String'];
	id: Scalars['uuid'];
	lastname: Scalars['String'];
	/** An object relationship */
	structure: Structure;
	structure_id: Scalars['uuid'];
};

/** columns and relationships of "professional" */
export type ProfessionalAccountsArgs = {
	distinct_on?: Maybe<Array<Account_Select_Column>>;
	limit?: Maybe<Scalars['Int']>;
	offset?: Maybe<Scalars['Int']>;
	order_by?: Maybe<Array<Account_Order_By>>;
	where?: Maybe<Account_Bool_Exp>;
};

/** columns and relationships of "professional" */
export type ProfessionalAccounts_AggregateArgs = {
	distinct_on?: Maybe<Array<Account_Select_Column>>;
	limit?: Maybe<Scalars['Int']>;
	offset?: Maybe<Scalars['Int']>;
	order_by?: Maybe<Array<Account_Order_By>>;
	where?: Maybe<Account_Bool_Exp>;
};

/** aggregated selection of "professional" */
export type Professional_Aggregate = {
	__typename?: 'professional_aggregate';
	aggregate?: Maybe<Professional_Aggregate_Fields>;
	nodes: Array<Professional>;
};

/** aggregate fields of "professional" */
export type Professional_Aggregate_Fields = {
	__typename?: 'professional_aggregate_fields';
	count: Scalars['Int'];
	max?: Maybe<Professional_Max_Fields>;
	min?: Maybe<Professional_Min_Fields>;
};

/** aggregate fields of "professional" */
export type Professional_Aggregate_FieldsCountArgs = {
	columns?: Maybe<Array<Professional_Select_Column>>;
	distinct?: Maybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "professional" */
export type Professional_Aggregate_Order_By = {
	count?: Maybe<Order_By>;
	max?: Maybe<Professional_Max_Order_By>;
	min?: Maybe<Professional_Min_Order_By>;
};

/** input type for inserting array relation for remote table "professional" */
export type Professional_Arr_Rel_Insert_Input = {
	data: Array<Professional_Insert_Input>;
	/** on conflict condition */
	on_conflict?: Maybe<Professional_On_Conflict>;
};

/** Boolean expression to filter rows from the table "professional". All fields are combined with a logical 'AND'. */
export type Professional_Bool_Exp = {
	_and?: Maybe<Array<Professional_Bool_Exp>>;
	_not?: Maybe<Professional_Bool_Exp>;
	_or?: Maybe<Array<Professional_Bool_Exp>>;
	accounts?: Maybe<Account_Bool_Exp>;
	email?: Maybe<String_Comparison_Exp>;
	firstname?: Maybe<String_Comparison_Exp>;
	id?: Maybe<Uuid_Comparison_Exp>;
	lastname?: Maybe<String_Comparison_Exp>;
	structure?: Maybe<Structure_Bool_Exp>;
	structure_id?: Maybe<Uuid_Comparison_Exp>;
};

/** unique or primary key constraints on table "professional" */
export enum Professional_Constraint {
	/** unique or primary key constraint */
	ProfessionalEmailUnique = 'professional_email_unique',
	/** unique or primary key constraint */
	ProfessionalPkey = 'professional_pkey'
}

/** input type for inserting data into table "professional" */
export type Professional_Insert_Input = {
	accounts?: Maybe<Account_Arr_Rel_Insert_Input>;
	email?: Maybe<Scalars['String']>;
	firstname?: Maybe<Scalars['String']>;
	id?: Maybe<Scalars['uuid']>;
	lastname?: Maybe<Scalars['String']>;
	structure?: Maybe<Structure_Obj_Rel_Insert_Input>;
	structure_id?: Maybe<Scalars['uuid']>;
};

/** aggregate max on columns */
export type Professional_Max_Fields = {
	__typename?: 'professional_max_fields';
	email?: Maybe<Scalars['String']>;
	firstname?: Maybe<Scalars['String']>;
	id?: Maybe<Scalars['uuid']>;
	lastname?: Maybe<Scalars['String']>;
	structure_id?: Maybe<Scalars['uuid']>;
};

/** order by max() on columns of table "professional" */
export type Professional_Max_Order_By = {
	email?: Maybe<Order_By>;
	firstname?: Maybe<Order_By>;
	id?: Maybe<Order_By>;
	lastname?: Maybe<Order_By>;
	structure_id?: Maybe<Order_By>;
};

/** aggregate min on columns */
export type Professional_Min_Fields = {
	__typename?: 'professional_min_fields';
	email?: Maybe<Scalars['String']>;
	firstname?: Maybe<Scalars['String']>;
	id?: Maybe<Scalars['uuid']>;
	lastname?: Maybe<Scalars['String']>;
	structure_id?: Maybe<Scalars['uuid']>;
};

/** order by min() on columns of table "professional" */
export type Professional_Min_Order_By = {
	email?: Maybe<Order_By>;
	firstname?: Maybe<Order_By>;
	id?: Maybe<Order_By>;
	lastname?: Maybe<Order_By>;
	structure_id?: Maybe<Order_By>;
};

/** response of any mutation on the table "professional" */
export type Professional_Mutation_Response = {
	__typename?: 'professional_mutation_response';
	/** number of rows affected by the mutation */
	affected_rows: Scalars['Int'];
	/** data from the rows affected by the mutation */
	returning: Array<Professional>;
};

/** input type for inserting object relation for remote table "professional" */
export type Professional_Obj_Rel_Insert_Input = {
	data: Professional_Insert_Input;
	/** on conflict condition */
	on_conflict?: Maybe<Professional_On_Conflict>;
};

/** on conflict condition type for table "professional" */
export type Professional_On_Conflict = {
	constraint: Professional_Constraint;
	update_columns?: Array<Professional_Update_Column>;
	where?: Maybe<Professional_Bool_Exp>;
};

/** Ordering options when selecting data from "professional". */
export type Professional_Order_By = {
	accounts_aggregate?: Maybe<Account_Aggregate_Order_By>;
	email?: Maybe<Order_By>;
	firstname?: Maybe<Order_By>;
	id?: Maybe<Order_By>;
	lastname?: Maybe<Order_By>;
	structure?: Maybe<Structure_Order_By>;
	structure_id?: Maybe<Order_By>;
};

/** primary key columns input for table: professional */
export type Professional_Pk_Columns_Input = {
	id: Scalars['uuid'];
};

/** select columns of table "professional" */
export enum Professional_Select_Column {
	/** column name */
	Email = 'email',
	/** column name */
	Firstname = 'firstname',
	/** column name */
	Id = 'id',
	/** column name */
	Lastname = 'lastname',
	/** column name */
	StructureId = 'structure_id'
}

/** input type for updating data in table "professional" */
export type Professional_Set_Input = {
	email?: Maybe<Scalars['String']>;
	firstname?: Maybe<Scalars['String']>;
	id?: Maybe<Scalars['uuid']>;
	lastname?: Maybe<Scalars['String']>;
	structure_id?: Maybe<Scalars['uuid']>;
};

/** update columns of table "professional" */
export enum Professional_Update_Column {
	/** column name */
	Email = 'email',
	/** column name */
	Firstname = 'firstname',
	/** column name */
	Id = 'id',
	/** column name */
	Lastname = 'lastname',
	/** column name */
	StructureId = 'structure_id'
}

export type Query_Root = {
	__typename?: 'query_root';
	/** fetch data from the table: "account" */
	account: Array<Account>;
	/** fetch aggregated fields from the table: "account" */
	account_aggregate: Account_Aggregate;
	/** fetch data from the table: "account" using primary key columns */
	account_by_pk?: Maybe<Account>;
	/** fetch data from the table: "admin" */
	admin: Array<Admin>;
	/** fetch aggregated fields from the table: "admin" */
	admin_aggregate: Admin_Aggregate;
	/** fetch data from the table: "admin" using primary key columns */
	admin_by_pk?: Maybe<Admin>;
	/** fetch data from the table: "beneficiary" */
	beneficiary: Array<Beneficiary>;
	/** fetch aggregated fields from the table: "beneficiary" */
	beneficiary_aggregate: Beneficiary_Aggregate;
	/** fetch data from the table: "beneficiary" using primary key columns */
	beneficiary_by_pk?: Maybe<Beneficiary>;
	/** fetch data from the table: "professional" */
	professional: Array<Professional>;
	/** fetch aggregated fields from the table: "professional" */
	professional_aggregate: Professional_Aggregate;
	/** fetch data from the table: "professional" using primary key columns */
	professional_by_pk?: Maybe<Professional>;
	/** fetch data from the table: "structure" */
	structure: Array<Structure>;
	/** fetch aggregated fields from the table: "structure" */
	structure_aggregate: Structure_Aggregate;
	/** fetch data from the table: "structure" using primary key columns */
	structure_by_pk?: Maybe<Structure>;
};

export type Query_RootAccountArgs = {
	distinct_on?: Maybe<Array<Account_Select_Column>>;
	limit?: Maybe<Scalars['Int']>;
	offset?: Maybe<Scalars['Int']>;
	order_by?: Maybe<Array<Account_Order_By>>;
	where?: Maybe<Account_Bool_Exp>;
};

export type Query_RootAccount_AggregateArgs = {
	distinct_on?: Maybe<Array<Account_Select_Column>>;
	limit?: Maybe<Scalars['Int']>;
	offset?: Maybe<Scalars['Int']>;
	order_by?: Maybe<Array<Account_Order_By>>;
	where?: Maybe<Account_Bool_Exp>;
};

export type Query_RootAccount_By_PkArgs = {
	id: Scalars['uuid'];
};

export type Query_RootAdminArgs = {
	distinct_on?: Maybe<Array<Admin_Select_Column>>;
	limit?: Maybe<Scalars['Int']>;
	offset?: Maybe<Scalars['Int']>;
	order_by?: Maybe<Array<Admin_Order_By>>;
	where?: Maybe<Admin_Bool_Exp>;
};

export type Query_RootAdmin_AggregateArgs = {
	distinct_on?: Maybe<Array<Admin_Select_Column>>;
	limit?: Maybe<Scalars['Int']>;
	offset?: Maybe<Scalars['Int']>;
	order_by?: Maybe<Array<Admin_Order_By>>;
	where?: Maybe<Admin_Bool_Exp>;
};

export type Query_RootAdmin_By_PkArgs = {
	id: Scalars['uuid'];
};

export type Query_RootBeneficiaryArgs = {
	distinct_on?: Maybe<Array<Beneficiary_Select_Column>>;
	limit?: Maybe<Scalars['Int']>;
	offset?: Maybe<Scalars['Int']>;
	order_by?: Maybe<Array<Beneficiary_Order_By>>;
	where?: Maybe<Beneficiary_Bool_Exp>;
};

export type Query_RootBeneficiary_AggregateArgs = {
	distinct_on?: Maybe<Array<Beneficiary_Select_Column>>;
	limit?: Maybe<Scalars['Int']>;
	offset?: Maybe<Scalars['Int']>;
	order_by?: Maybe<Array<Beneficiary_Order_By>>;
	where?: Maybe<Beneficiary_Bool_Exp>;
};

export type Query_RootBeneficiary_By_PkArgs = {
	id: Scalars['uuid'];
};

export type Query_RootProfessionalArgs = {
	distinct_on?: Maybe<Array<Professional_Select_Column>>;
	limit?: Maybe<Scalars['Int']>;
	offset?: Maybe<Scalars['Int']>;
	order_by?: Maybe<Array<Professional_Order_By>>;
	where?: Maybe<Professional_Bool_Exp>;
};

export type Query_RootProfessional_AggregateArgs = {
	distinct_on?: Maybe<Array<Professional_Select_Column>>;
	limit?: Maybe<Scalars['Int']>;
	offset?: Maybe<Scalars['Int']>;
	order_by?: Maybe<Array<Professional_Order_By>>;
	where?: Maybe<Professional_Bool_Exp>;
};

export type Query_RootProfessional_By_PkArgs = {
	id: Scalars['uuid'];
};

export type Query_RootStructureArgs = {
	distinct_on?: Maybe<Array<Structure_Select_Column>>;
	limit?: Maybe<Scalars['Int']>;
	offset?: Maybe<Scalars['Int']>;
	order_by?: Maybe<Array<Structure_Order_By>>;
	where?: Maybe<Structure_Bool_Exp>;
};

export type Query_RootStructure_AggregateArgs = {
	distinct_on?: Maybe<Array<Structure_Select_Column>>;
	limit?: Maybe<Scalars['Int']>;
	offset?: Maybe<Scalars['Int']>;
	order_by?: Maybe<Array<Structure_Order_By>>;
	where?: Maybe<Structure_Bool_Exp>;
};

export type Query_RootStructure_By_PkArgs = {
	id: Scalars['uuid'];
};

/** columns and relationships of "structure" */
export type Structure = {
	__typename?: 'structure';
	address1?: Maybe<Scalars['String']>;
	address2?: Maybe<Scalars['String']>;
	city?: Maybe<Scalars['String']>;
	creation_date?: Maybe<Scalars['timestamptz']>;
	email?: Maybe<Scalars['String']>;
	id: Scalars['uuid'];
	modification_date?: Maybe<Scalars['timestamptz']>;
	name?: Maybe<Scalars['String']>;
	phone?: Maybe<Scalars['String']>;
	postal_code?: Maybe<Scalars['String']>;
	/** An array relationship */
	professionals: Array<Professional>;
	/** An aggregate relationship */
	professionals_aggregate: Professional_Aggregate;
	short_desc?: Maybe<Scalars['String']>;
	siret?: Maybe<Scalars['String']>;
};

/** columns and relationships of "structure" */
export type StructureProfessionalsArgs = {
	distinct_on?: Maybe<Array<Professional_Select_Column>>;
	limit?: Maybe<Scalars['Int']>;
	offset?: Maybe<Scalars['Int']>;
	order_by?: Maybe<Array<Professional_Order_By>>;
	where?: Maybe<Professional_Bool_Exp>;
};

/** columns and relationships of "structure" */
export type StructureProfessionals_AggregateArgs = {
	distinct_on?: Maybe<Array<Professional_Select_Column>>;
	limit?: Maybe<Scalars['Int']>;
	offset?: Maybe<Scalars['Int']>;
	order_by?: Maybe<Array<Professional_Order_By>>;
	where?: Maybe<Professional_Bool_Exp>;
};

/** aggregated selection of "structure" */
export type Structure_Aggregate = {
	__typename?: 'structure_aggregate';
	aggregate?: Maybe<Structure_Aggregate_Fields>;
	nodes: Array<Structure>;
};

/** aggregate fields of "structure" */
export type Structure_Aggregate_Fields = {
	__typename?: 'structure_aggregate_fields';
	count: Scalars['Int'];
	max?: Maybe<Structure_Max_Fields>;
	min?: Maybe<Structure_Min_Fields>;
};

/** aggregate fields of "structure" */
export type Structure_Aggregate_FieldsCountArgs = {
	columns?: Maybe<Array<Structure_Select_Column>>;
	distinct?: Maybe<Scalars['Boolean']>;
};

/** Boolean expression to filter rows from the table "structure". All fields are combined with a logical 'AND'. */
export type Structure_Bool_Exp = {
	_and?: Maybe<Array<Structure_Bool_Exp>>;
	_not?: Maybe<Structure_Bool_Exp>;
	_or?: Maybe<Array<Structure_Bool_Exp>>;
	address1?: Maybe<String_Comparison_Exp>;
	address2?: Maybe<String_Comparison_Exp>;
	city?: Maybe<String_Comparison_Exp>;
	creation_date?: Maybe<Timestamptz_Comparison_Exp>;
	email?: Maybe<String_Comparison_Exp>;
	id?: Maybe<Uuid_Comparison_Exp>;
	modification_date?: Maybe<Timestamptz_Comparison_Exp>;
	name?: Maybe<String_Comparison_Exp>;
	phone?: Maybe<String_Comparison_Exp>;
	postal_code?: Maybe<String_Comparison_Exp>;
	professionals?: Maybe<Professional_Bool_Exp>;
	short_desc?: Maybe<String_Comparison_Exp>;
	siret?: Maybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "structure" */
export enum Structure_Constraint {
	/** unique or primary key constraint */
	StructurePkey = 'structure_pkey'
}

/** input type for inserting data into table "structure" */
export type Structure_Insert_Input = {
	address1?: Maybe<Scalars['String']>;
	address2?: Maybe<Scalars['String']>;
	city?: Maybe<Scalars['String']>;
	creation_date?: Maybe<Scalars['timestamptz']>;
	email?: Maybe<Scalars['String']>;
	id?: Maybe<Scalars['uuid']>;
	modification_date?: Maybe<Scalars['timestamptz']>;
	name?: Maybe<Scalars['String']>;
	phone?: Maybe<Scalars['String']>;
	postal_code?: Maybe<Scalars['String']>;
	professionals?: Maybe<Professional_Arr_Rel_Insert_Input>;
	short_desc?: Maybe<Scalars['String']>;
	siret?: Maybe<Scalars['String']>;
};

/** aggregate max on columns */
export type Structure_Max_Fields = {
	__typename?: 'structure_max_fields';
	address1?: Maybe<Scalars['String']>;
	address2?: Maybe<Scalars['String']>;
	city?: Maybe<Scalars['String']>;
	creation_date?: Maybe<Scalars['timestamptz']>;
	email?: Maybe<Scalars['String']>;
	id?: Maybe<Scalars['uuid']>;
	modification_date?: Maybe<Scalars['timestamptz']>;
	name?: Maybe<Scalars['String']>;
	phone?: Maybe<Scalars['String']>;
	postal_code?: Maybe<Scalars['String']>;
	short_desc?: Maybe<Scalars['String']>;
	siret?: Maybe<Scalars['String']>;
};

/** aggregate min on columns */
export type Structure_Min_Fields = {
	__typename?: 'structure_min_fields';
	address1?: Maybe<Scalars['String']>;
	address2?: Maybe<Scalars['String']>;
	city?: Maybe<Scalars['String']>;
	creation_date?: Maybe<Scalars['timestamptz']>;
	email?: Maybe<Scalars['String']>;
	id?: Maybe<Scalars['uuid']>;
	modification_date?: Maybe<Scalars['timestamptz']>;
	name?: Maybe<Scalars['String']>;
	phone?: Maybe<Scalars['String']>;
	postal_code?: Maybe<Scalars['String']>;
	short_desc?: Maybe<Scalars['String']>;
	siret?: Maybe<Scalars['String']>;
};

/** response of any mutation on the table "structure" */
export type Structure_Mutation_Response = {
	__typename?: 'structure_mutation_response';
	/** number of rows affected by the mutation */
	affected_rows: Scalars['Int'];
	/** data from the rows affected by the mutation */
	returning: Array<Structure>;
};

/** input type for inserting object relation for remote table "structure" */
export type Structure_Obj_Rel_Insert_Input = {
	data: Structure_Insert_Input;
	/** on conflict condition */
	on_conflict?: Maybe<Structure_On_Conflict>;
};

/** on conflict condition type for table "structure" */
export type Structure_On_Conflict = {
	constraint: Structure_Constraint;
	update_columns?: Array<Structure_Update_Column>;
	where?: Maybe<Structure_Bool_Exp>;
};

/** Ordering options when selecting data from "structure". */
export type Structure_Order_By = {
	address1?: Maybe<Order_By>;
	address2?: Maybe<Order_By>;
	city?: Maybe<Order_By>;
	creation_date?: Maybe<Order_By>;
	email?: Maybe<Order_By>;
	id?: Maybe<Order_By>;
	modification_date?: Maybe<Order_By>;
	name?: Maybe<Order_By>;
	phone?: Maybe<Order_By>;
	postal_code?: Maybe<Order_By>;
	professionals_aggregate?: Maybe<Professional_Aggregate_Order_By>;
	short_desc?: Maybe<Order_By>;
	siret?: Maybe<Order_By>;
};

/** primary key columns input for table: structure */
export type Structure_Pk_Columns_Input = {
	id: Scalars['uuid'];
};

/** select columns of table "structure" */
export enum Structure_Select_Column {
	/** column name */
	Address1 = 'address1',
	/** column name */
	Address2 = 'address2',
	/** column name */
	City = 'city',
	/** column name */
	CreationDate = 'creation_date',
	/** column name */
	Email = 'email',
	/** column name */
	Id = 'id',
	/** column name */
	ModificationDate = 'modification_date',
	/** column name */
	Name = 'name',
	/** column name */
	Phone = 'phone',
	/** column name */
	PostalCode = 'postal_code',
	/** column name */
	ShortDesc = 'short_desc',
	/** column name */
	Siret = 'siret'
}

/** input type for updating data in table "structure" */
export type Structure_Set_Input = {
	address1?: Maybe<Scalars['String']>;
	address2?: Maybe<Scalars['String']>;
	city?: Maybe<Scalars['String']>;
	creation_date?: Maybe<Scalars['timestamptz']>;
	email?: Maybe<Scalars['String']>;
	id?: Maybe<Scalars['uuid']>;
	modification_date?: Maybe<Scalars['timestamptz']>;
	name?: Maybe<Scalars['String']>;
	phone?: Maybe<Scalars['String']>;
	postal_code?: Maybe<Scalars['String']>;
	short_desc?: Maybe<Scalars['String']>;
	siret?: Maybe<Scalars['String']>;
};

/** update columns of table "structure" */
export enum Structure_Update_Column {
	/** column name */
	Address1 = 'address1',
	/** column name */
	Address2 = 'address2',
	/** column name */
	City = 'city',
	/** column name */
	CreationDate = 'creation_date',
	/** column name */
	Email = 'email',
	/** column name */
	Id = 'id',
	/** column name */
	ModificationDate = 'modification_date',
	/** column name */
	Name = 'name',
	/** column name */
	Phone = 'phone',
	/** column name */
	PostalCode = 'postal_code',
	/** column name */
	ShortDesc = 'short_desc',
	/** column name */
	Siret = 'siret'
}

export type Subscription_Root = {
	__typename?: 'subscription_root';
	/** fetch data from the table: "account" */
	account: Array<Account>;
	/** fetch aggregated fields from the table: "account" */
	account_aggregate: Account_Aggregate;
	/** fetch data from the table: "account" using primary key columns */
	account_by_pk?: Maybe<Account>;
	/** fetch data from the table: "admin" */
	admin: Array<Admin>;
	/** fetch aggregated fields from the table: "admin" */
	admin_aggregate: Admin_Aggregate;
	/** fetch data from the table: "admin" using primary key columns */
	admin_by_pk?: Maybe<Admin>;
	/** fetch data from the table: "beneficiary" */
	beneficiary: Array<Beneficiary>;
	/** fetch aggregated fields from the table: "beneficiary" */
	beneficiary_aggregate: Beneficiary_Aggregate;
	/** fetch data from the table: "beneficiary" using primary key columns */
	beneficiary_by_pk?: Maybe<Beneficiary>;
	/** fetch data from the table: "professional" */
	professional: Array<Professional>;
	/** fetch aggregated fields from the table: "professional" */
	professional_aggregate: Professional_Aggregate;
	/** fetch data from the table: "professional" using primary key columns */
	professional_by_pk?: Maybe<Professional>;
	/** fetch data from the table: "structure" */
	structure: Array<Structure>;
	/** fetch aggregated fields from the table: "structure" */
	structure_aggregate: Structure_Aggregate;
	/** fetch data from the table: "structure" using primary key columns */
	structure_by_pk?: Maybe<Structure>;
};

export type Subscription_RootAccountArgs = {
	distinct_on?: Maybe<Array<Account_Select_Column>>;
	limit?: Maybe<Scalars['Int']>;
	offset?: Maybe<Scalars['Int']>;
	order_by?: Maybe<Array<Account_Order_By>>;
	where?: Maybe<Account_Bool_Exp>;
};

export type Subscription_RootAccount_AggregateArgs = {
	distinct_on?: Maybe<Array<Account_Select_Column>>;
	limit?: Maybe<Scalars['Int']>;
	offset?: Maybe<Scalars['Int']>;
	order_by?: Maybe<Array<Account_Order_By>>;
	where?: Maybe<Account_Bool_Exp>;
};

export type Subscription_RootAccount_By_PkArgs = {
	id: Scalars['uuid'];
};

export type Subscription_RootAdminArgs = {
	distinct_on?: Maybe<Array<Admin_Select_Column>>;
	limit?: Maybe<Scalars['Int']>;
	offset?: Maybe<Scalars['Int']>;
	order_by?: Maybe<Array<Admin_Order_By>>;
	where?: Maybe<Admin_Bool_Exp>;
};

export type Subscription_RootAdmin_AggregateArgs = {
	distinct_on?: Maybe<Array<Admin_Select_Column>>;
	limit?: Maybe<Scalars['Int']>;
	offset?: Maybe<Scalars['Int']>;
	order_by?: Maybe<Array<Admin_Order_By>>;
	where?: Maybe<Admin_Bool_Exp>;
};

export type Subscription_RootAdmin_By_PkArgs = {
	id: Scalars['uuid'];
};

export type Subscription_RootBeneficiaryArgs = {
	distinct_on?: Maybe<Array<Beneficiary_Select_Column>>;
	limit?: Maybe<Scalars['Int']>;
	offset?: Maybe<Scalars['Int']>;
	order_by?: Maybe<Array<Beneficiary_Order_By>>;
	where?: Maybe<Beneficiary_Bool_Exp>;
};

export type Subscription_RootBeneficiary_AggregateArgs = {
	distinct_on?: Maybe<Array<Beneficiary_Select_Column>>;
	limit?: Maybe<Scalars['Int']>;
	offset?: Maybe<Scalars['Int']>;
	order_by?: Maybe<Array<Beneficiary_Order_By>>;
	where?: Maybe<Beneficiary_Bool_Exp>;
};

export type Subscription_RootBeneficiary_By_PkArgs = {
	id: Scalars['uuid'];
};

export type Subscription_RootProfessionalArgs = {
	distinct_on?: Maybe<Array<Professional_Select_Column>>;
	limit?: Maybe<Scalars['Int']>;
	offset?: Maybe<Scalars['Int']>;
	order_by?: Maybe<Array<Professional_Order_By>>;
	where?: Maybe<Professional_Bool_Exp>;
};

export type Subscription_RootProfessional_AggregateArgs = {
	distinct_on?: Maybe<Array<Professional_Select_Column>>;
	limit?: Maybe<Scalars['Int']>;
	offset?: Maybe<Scalars['Int']>;
	order_by?: Maybe<Array<Professional_Order_By>>;
	where?: Maybe<Professional_Bool_Exp>;
};

export type Subscription_RootProfessional_By_PkArgs = {
	id: Scalars['uuid'];
};

export type Subscription_RootStructureArgs = {
	distinct_on?: Maybe<Array<Structure_Select_Column>>;
	limit?: Maybe<Scalars['Int']>;
	offset?: Maybe<Scalars['Int']>;
	order_by?: Maybe<Array<Structure_Order_By>>;
	where?: Maybe<Structure_Bool_Exp>;
};

export type Subscription_RootStructure_AggregateArgs = {
	distinct_on?: Maybe<Array<Structure_Select_Column>>;
	limit?: Maybe<Scalars['Int']>;
	offset?: Maybe<Scalars['Int']>;
	order_by?: Maybe<Array<Structure_Order_By>>;
	where?: Maybe<Structure_Bool_Exp>;
};

export type Subscription_RootStructure_By_PkArgs = {
	id: Scalars['uuid'];
};

/** Boolean expression to compare columns of type "timestamptz". All fields are combined with logical 'AND'. */
export type Timestamptz_Comparison_Exp = {
	_eq?: Maybe<Scalars['timestamptz']>;
	_gt?: Maybe<Scalars['timestamptz']>;
	_gte?: Maybe<Scalars['timestamptz']>;
	_in?: Maybe<Array<Scalars['timestamptz']>>;
	_is_null?: Maybe<Scalars['Boolean']>;
	_lt?: Maybe<Scalars['timestamptz']>;
	_lte?: Maybe<Scalars['timestamptz']>;
	_neq?: Maybe<Scalars['timestamptz']>;
	_nin?: Maybe<Array<Scalars['timestamptz']>>;
};

/** Boolean expression to compare columns of type "uuid". All fields are combined with logical 'AND'. */
export type Uuid_Comparison_Exp = {
	_eq?: Maybe<Scalars['uuid']>;
	_gt?: Maybe<Scalars['uuid']>;
	_gte?: Maybe<Scalars['uuid']>;
	_in?: Maybe<Array<Scalars['uuid']>>;
	_is_null?: Maybe<Scalars['Boolean']>;
	_lt?: Maybe<Scalars['uuid']>;
	_lte?: Maybe<Scalars['uuid']>;
	_neq?: Maybe<Scalars['uuid']>;
	_nin?: Maybe<Array<Scalars['uuid']>>;
};

export type GetAllBeneficiariesQueryVariables = Exact<{ [key: string]: never }>;

export type GetAllBeneficiariesQuery = { __typename?: 'query_root' } & {
	beneficiary: Array<
		{ __typename?: 'beneficiary' } & Pick<
			Beneficiary,
			'id' | 'firstname' | 'lastname' | 'email' | 'mobile_number'
		>
	>;
};

export const GetAllBeneficiariesDocument = {
	kind: 'Document',
	definitions: [
		{
			kind: 'OperationDefinition',
			operation: 'query',
			name: { kind: 'Name', value: 'GetAllBeneficiaries' },
			selectionSet: {
				kind: 'SelectionSet',
				selections: [
					{
						kind: 'Field',
						name: { kind: 'Name', value: 'beneficiary' },
						selectionSet: {
							kind: 'SelectionSet',
							selections: [
								{ kind: 'Field', name: { kind: 'Name', value: 'id' } },
								{ kind: 'Field', name: { kind: 'Name', value: 'firstname' } },
								{ kind: 'Field', name: { kind: 'Name', value: 'lastname' } },
								{ kind: 'Field', name: { kind: 'Name', value: 'email' } },
								{ kind: 'Field', name: { kind: 'Name', value: 'mobile_number' } }
							]
						}
					}
				]
			}
		}
	]
} as unknown as DocumentNode<GetAllBeneficiariesQuery, GetAllBeneficiariesQueryVariables>;
