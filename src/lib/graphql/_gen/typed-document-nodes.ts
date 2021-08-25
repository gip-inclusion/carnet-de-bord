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
	date: any;
	jsonb: any;
	timestamptz: any;
	uuid: any;
};

/** Boolean expression to compare columns of type "Boolean". All fields are combined with logical 'AND'. */
export type Boolean_Comparison_Exp = {
	_eq?: Maybe<Scalars['Boolean']>;
	_gt?: Maybe<Scalars['Boolean']>;
	_gte?: Maybe<Scalars['Boolean']>;
	_in?: Maybe<Array<Scalars['Boolean']>>;
	_is_null?: Maybe<Scalars['Boolean']>;
	_lt?: Maybe<Scalars['Boolean']>;
	_lte?: Maybe<Scalars['Boolean']>;
	_neq?: Maybe<Scalars['Boolean']>;
	_nin?: Maybe<Array<Scalars['Boolean']>>;
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
	accessKey?: Maybe<Scalars['String']>;
	accessKeyDate?: Maybe<Scalars['timestamptz']>;
	/** An object relationship */
	admin?: Maybe<Admin>;
	adminId?: Maybe<Scalars['uuid']>;
	/** An object relationship */
	beneficiary?: Maybe<Beneficiary>;
	beneficiaryId?: Maybe<Scalars['uuid']>;
	confirmed: Scalars['Boolean'];
	id: Scalars['uuid'];
	lastLogin?: Maybe<Scalars['timestamptz']>;
	onboarding_done?: Maybe<Scalars['Boolean']>;
	/** An object relationship */
	professional?: Maybe<Professional>;
	professionalId?: Maybe<Scalars['uuid']>;
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
	accessKey?: Maybe<String_Comparison_Exp>;
	accessKeyDate?: Maybe<Timestamptz_Comparison_Exp>;
	admin?: Maybe<Admin_Bool_Exp>;
	adminId?: Maybe<Uuid_Comparison_Exp>;
	beneficiary?: Maybe<Beneficiary_Bool_Exp>;
	beneficiaryId?: Maybe<Uuid_Comparison_Exp>;
	confirmed?: Maybe<Boolean_Comparison_Exp>;
	id?: Maybe<Uuid_Comparison_Exp>;
	lastLogin?: Maybe<Timestamptz_Comparison_Exp>;
	onboarding_done?: Maybe<Boolean_Comparison_Exp>;
	professional?: Maybe<Professional_Bool_Exp>;
	professionalId?: Maybe<Uuid_Comparison_Exp>;
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
	accessKey?: Maybe<Scalars['String']>;
	accessKeyDate?: Maybe<Scalars['timestamptz']>;
	admin?: Maybe<Admin_Obj_Rel_Insert_Input>;
	adminId?: Maybe<Scalars['uuid']>;
	beneficiary?: Maybe<Beneficiary_Obj_Rel_Insert_Input>;
	beneficiaryId?: Maybe<Scalars['uuid']>;
	confirmed?: Maybe<Scalars['Boolean']>;
	id?: Maybe<Scalars['uuid']>;
	lastLogin?: Maybe<Scalars['timestamptz']>;
	onboarding_done?: Maybe<Scalars['Boolean']>;
	professional?: Maybe<Professional_Obj_Rel_Insert_Input>;
	professionalId?: Maybe<Scalars['uuid']>;
	type?: Maybe<Scalars['String']>;
	username?: Maybe<Scalars['String']>;
};

/** aggregate max on columns */
export type Account_Max_Fields = {
	__typename?: 'account_max_fields';
	accessKey?: Maybe<Scalars['String']>;
	accessKeyDate?: Maybe<Scalars['timestamptz']>;
	adminId?: Maybe<Scalars['uuid']>;
	beneficiaryId?: Maybe<Scalars['uuid']>;
	id?: Maybe<Scalars['uuid']>;
	lastLogin?: Maybe<Scalars['timestamptz']>;
	professionalId?: Maybe<Scalars['uuid']>;
	type?: Maybe<Scalars['String']>;
	username?: Maybe<Scalars['String']>;
};

/** order by max() on columns of table "account" */
export type Account_Max_Order_By = {
	accessKey?: Maybe<Order_By>;
	accessKeyDate?: Maybe<Order_By>;
	adminId?: Maybe<Order_By>;
	beneficiaryId?: Maybe<Order_By>;
	id?: Maybe<Order_By>;
	lastLogin?: Maybe<Order_By>;
	professionalId?: Maybe<Order_By>;
	type?: Maybe<Order_By>;
	username?: Maybe<Order_By>;
};

/** aggregate min on columns */
export type Account_Min_Fields = {
	__typename?: 'account_min_fields';
	accessKey?: Maybe<Scalars['String']>;
	accessKeyDate?: Maybe<Scalars['timestamptz']>;
	adminId?: Maybe<Scalars['uuid']>;
	beneficiaryId?: Maybe<Scalars['uuid']>;
	id?: Maybe<Scalars['uuid']>;
	lastLogin?: Maybe<Scalars['timestamptz']>;
	professionalId?: Maybe<Scalars['uuid']>;
	type?: Maybe<Scalars['String']>;
	username?: Maybe<Scalars['String']>;
};

/** order by min() on columns of table "account" */
export type Account_Min_Order_By = {
	accessKey?: Maybe<Order_By>;
	accessKeyDate?: Maybe<Order_By>;
	adminId?: Maybe<Order_By>;
	beneficiaryId?: Maybe<Order_By>;
	id?: Maybe<Order_By>;
	lastLogin?: Maybe<Order_By>;
	professionalId?: Maybe<Order_By>;
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
	accessKey?: Maybe<Order_By>;
	accessKeyDate?: Maybe<Order_By>;
	admin?: Maybe<Admin_Order_By>;
	adminId?: Maybe<Order_By>;
	beneficiary?: Maybe<Beneficiary_Order_By>;
	beneficiaryId?: Maybe<Order_By>;
	confirmed?: Maybe<Order_By>;
	id?: Maybe<Order_By>;
	lastLogin?: Maybe<Order_By>;
	onboarding_done?: Maybe<Order_By>;
	professional?: Maybe<Professional_Order_By>;
	professionalId?: Maybe<Order_By>;
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
	AccessKey = 'accessKey',
	/** column name */
	AccessKeyDate = 'accessKeyDate',
	/** column name */
	AdminId = 'adminId',
	/** column name */
	BeneficiaryId = 'beneficiaryId',
	/** column name */
	Confirmed = 'confirmed',
	/** column name */
	Id = 'id',
	/** column name */
	LastLogin = 'lastLogin',
	/** column name */
	OnboardingDone = 'onboarding_done',
	/** column name */
	ProfessionalId = 'professionalId',
	/** column name */
	Type = 'type',
	/** column name */
	Username = 'username'
}

/** input type for updating data in table "account" */
export type Account_Set_Input = {
	accessKey?: Maybe<Scalars['String']>;
	accessKeyDate?: Maybe<Scalars['timestamptz']>;
	adminId?: Maybe<Scalars['uuid']>;
	beneficiaryId?: Maybe<Scalars['uuid']>;
	confirmed?: Maybe<Scalars['Boolean']>;
	id?: Maybe<Scalars['uuid']>;
	lastLogin?: Maybe<Scalars['timestamptz']>;
	onboarding_done?: Maybe<Scalars['Boolean']>;
	professionalId?: Maybe<Scalars['uuid']>;
	type?: Maybe<Scalars['String']>;
	username?: Maybe<Scalars['String']>;
};

/** update columns of table "account" */
export enum Account_Update_Column {
	/** column name */
	AccessKey = 'accessKey',
	/** column name */
	AccessKeyDate = 'accessKeyDate',
	/** column name */
	AdminId = 'adminId',
	/** column name */
	BeneficiaryId = 'beneficiaryId',
	/** column name */
	Confirmed = 'confirmed',
	/** column name */
	Id = 'id',
	/** column name */
	LastLogin = 'lastLogin',
	/** column name */
	OnboardingDone = 'onboarding_done',
	/** column name */
	ProfessionalId = 'professionalId',
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
	cafNumber?: Maybe<Scalars['String']>;
	city?: Maybe<Scalars['String']>;
	dateOfBirth: Scalars['date'];
	email: Scalars['String'];
	firstname: Scalars['String'];
	id: Scalars['uuid'];
	lastname: Scalars['String'];
	mobileNumber?: Maybe<Scalars['String']>;
	/** An object relationship */
	notebook: Notebook;
	peNumber?: Maybe<Scalars['String']>;
	postalCode?: Maybe<Scalars['String']>;
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
	cafNumber?: Maybe<String_Comparison_Exp>;
	city?: Maybe<String_Comparison_Exp>;
	dateOfBirth?: Maybe<Date_Comparison_Exp>;
	email?: Maybe<String_Comparison_Exp>;
	firstname?: Maybe<String_Comparison_Exp>;
	id?: Maybe<Uuid_Comparison_Exp>;
	lastname?: Maybe<String_Comparison_Exp>;
	mobileNumber?: Maybe<String_Comparison_Exp>;
	notebook?: Maybe<Notebook_Bool_Exp>;
	peNumber?: Maybe<String_Comparison_Exp>;
	postalCode?: Maybe<String_Comparison_Exp>;
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
	cafNumber?: Maybe<Scalars['String']>;
	city?: Maybe<Scalars['String']>;
	dateOfBirth?: Maybe<Scalars['date']>;
	email?: Maybe<Scalars['String']>;
	firstname?: Maybe<Scalars['String']>;
	id?: Maybe<Scalars['uuid']>;
	lastname?: Maybe<Scalars['String']>;
	mobileNumber?: Maybe<Scalars['String']>;
	notebook?: Maybe<Notebook_Obj_Rel_Insert_Input>;
	peNumber?: Maybe<Scalars['String']>;
	postalCode?: Maybe<Scalars['String']>;
};

/** aggregate max on columns */
export type Beneficiary_Max_Fields = {
	__typename?: 'beneficiary_max_fields';
	address1?: Maybe<Scalars['String']>;
	address2?: Maybe<Scalars['String']>;
	cafNumber?: Maybe<Scalars['String']>;
	city?: Maybe<Scalars['String']>;
	dateOfBirth?: Maybe<Scalars['date']>;
	email?: Maybe<Scalars['String']>;
	firstname?: Maybe<Scalars['String']>;
	id?: Maybe<Scalars['uuid']>;
	lastname?: Maybe<Scalars['String']>;
	mobileNumber?: Maybe<Scalars['String']>;
	peNumber?: Maybe<Scalars['String']>;
	postalCode?: Maybe<Scalars['String']>;
};

/** aggregate min on columns */
export type Beneficiary_Min_Fields = {
	__typename?: 'beneficiary_min_fields';
	address1?: Maybe<Scalars['String']>;
	address2?: Maybe<Scalars['String']>;
	cafNumber?: Maybe<Scalars['String']>;
	city?: Maybe<Scalars['String']>;
	dateOfBirth?: Maybe<Scalars['date']>;
	email?: Maybe<Scalars['String']>;
	firstname?: Maybe<Scalars['String']>;
	id?: Maybe<Scalars['uuid']>;
	lastname?: Maybe<Scalars['String']>;
	mobileNumber?: Maybe<Scalars['String']>;
	peNumber?: Maybe<Scalars['String']>;
	postalCode?: Maybe<Scalars['String']>;
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
	cafNumber?: Maybe<Order_By>;
	city?: Maybe<Order_By>;
	dateOfBirth?: Maybe<Order_By>;
	email?: Maybe<Order_By>;
	firstname?: Maybe<Order_By>;
	id?: Maybe<Order_By>;
	lastname?: Maybe<Order_By>;
	mobileNumber?: Maybe<Order_By>;
	notebook?: Maybe<Notebook_Order_By>;
	peNumber?: Maybe<Order_By>;
	postalCode?: Maybe<Order_By>;
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
	CafNumber = 'cafNumber',
	/** column name */
	City = 'city',
	/** column name */
	DateOfBirth = 'dateOfBirth',
	/** column name */
	Email = 'email',
	/** column name */
	Firstname = 'firstname',
	/** column name */
	Id = 'id',
	/** column name */
	Lastname = 'lastname',
	/** column name */
	MobileNumber = 'mobileNumber',
	/** column name */
	PeNumber = 'peNumber',
	/** column name */
	PostalCode = 'postalCode'
}

/** input type for updating data in table "beneficiary" */
export type Beneficiary_Set_Input = {
	address1?: Maybe<Scalars['String']>;
	address2?: Maybe<Scalars['String']>;
	cafNumber?: Maybe<Scalars['String']>;
	city?: Maybe<Scalars['String']>;
	dateOfBirth?: Maybe<Scalars['date']>;
	email?: Maybe<Scalars['String']>;
	firstname?: Maybe<Scalars['String']>;
	id?: Maybe<Scalars['uuid']>;
	lastname?: Maybe<Scalars['String']>;
	mobileNumber?: Maybe<Scalars['String']>;
	peNumber?: Maybe<Scalars['String']>;
	postalCode?: Maybe<Scalars['String']>;
};

/** update columns of table "beneficiary" */
export enum Beneficiary_Update_Column {
	/** column name */
	Address1 = 'address1',
	/** column name */
	Address2 = 'address2',
	/** column name */
	CafNumber = 'cafNumber',
	/** column name */
	City = 'city',
	/** column name */
	DateOfBirth = 'dateOfBirth',
	/** column name */
	Email = 'email',
	/** column name */
	Firstname = 'firstname',
	/** column name */
	Id = 'id',
	/** column name */
	Lastname = 'lastname',
	/** column name */
	MobileNumber = 'mobileNumber',
	/** column name */
	PeNumber = 'peNumber',
	/** column name */
	PostalCode = 'postalCode'
}

/** Boolean expression to compare columns of type "date". All fields are combined with logical 'AND'. */
export type Date_Comparison_Exp = {
	_eq?: Maybe<Scalars['date']>;
	_gt?: Maybe<Scalars['date']>;
	_gte?: Maybe<Scalars['date']>;
	_in?: Maybe<Array<Scalars['date']>>;
	_is_null?: Maybe<Scalars['Boolean']>;
	_lt?: Maybe<Scalars['date']>;
	_lte?: Maybe<Scalars['date']>;
	_neq?: Maybe<Scalars['date']>;
	_nin?: Maybe<Array<Scalars['date']>>;
};

/** Boolean expression to compare columns of type "jsonb". All fields are combined with logical 'AND'. */
export type Jsonb_Comparison_Exp = {
	/** is the column contained in the given json value */
	_contained_in?: Maybe<Scalars['jsonb']>;
	/** does the column contain the given json value at the top level */
	_contains?: Maybe<Scalars['jsonb']>;
	_eq?: Maybe<Scalars['jsonb']>;
	_gt?: Maybe<Scalars['jsonb']>;
	_gte?: Maybe<Scalars['jsonb']>;
	/** does the string exist as a top-level key in the column */
	_has_key?: Maybe<Scalars['String']>;
	/** do all of these strings exist as top-level keys in the column */
	_has_keys_all?: Maybe<Array<Scalars['String']>>;
	/** do any of these strings exist as top-level keys in the column */
	_has_keys_any?: Maybe<Array<Scalars['String']>>;
	_in?: Maybe<Array<Scalars['jsonb']>>;
	_is_null?: Maybe<Scalars['Boolean']>;
	_lt?: Maybe<Scalars['jsonb']>;
	_lte?: Maybe<Scalars['jsonb']>;
	_neq?: Maybe<Scalars['jsonb']>;
	_nin?: Maybe<Array<Scalars['jsonb']>>;
};

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
	/** delete data from the table: "notebook" */
	delete_notebook?: Maybe<Notebook_Mutation_Response>;
	/** delete single row from the table: "notebook" */
	delete_notebook_by_pk?: Maybe<Notebook>;
	/** delete data from the table: "notebook_event" */
	delete_notebook_event?: Maybe<Notebook_Event_Mutation_Response>;
	/** delete single row from the table: "notebook_event" */
	delete_notebook_event_by_pk?: Maybe<Notebook_Event>;
	/** delete data from the table: "notebook_member" */
	delete_notebook_member?: Maybe<Notebook_Member_Mutation_Response>;
	/** delete single row from the table: "notebook_member" */
	delete_notebook_member_by_pk?: Maybe<Notebook_Member>;
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
	/** insert data into the table: "notebook" */
	insert_notebook?: Maybe<Notebook_Mutation_Response>;
	/** insert data into the table: "notebook_event" */
	insert_notebook_event?: Maybe<Notebook_Event_Mutation_Response>;
	/** insert a single row into the table: "notebook_event" */
	insert_notebook_event_one?: Maybe<Notebook_Event>;
	/** insert data into the table: "notebook_member" */
	insert_notebook_member?: Maybe<Notebook_Member_Mutation_Response>;
	/** insert a single row into the table: "notebook_member" */
	insert_notebook_member_one?: Maybe<Notebook_Member>;
	/** insert a single row into the table: "notebook" */
	insert_notebook_one?: Maybe<Notebook>;
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
	/** update data of the table: "notebook" */
	update_notebook?: Maybe<Notebook_Mutation_Response>;
	/** update single row of the table: "notebook" */
	update_notebook_by_pk?: Maybe<Notebook>;
	/** update data of the table: "notebook_event" */
	update_notebook_event?: Maybe<Notebook_Event_Mutation_Response>;
	/** update single row of the table: "notebook_event" */
	update_notebook_event_by_pk?: Maybe<Notebook_Event>;
	/** update data of the table: "notebook_member" */
	update_notebook_member?: Maybe<Notebook_Member_Mutation_Response>;
	/** update single row of the table: "notebook_member" */
	update_notebook_member_by_pk?: Maybe<Notebook_Member>;
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
export type Mutation_RootDelete_NotebookArgs = {
	where: Notebook_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Notebook_By_PkArgs = {
	id: Scalars['uuid'];
};

/** mutation root */
export type Mutation_RootDelete_Notebook_EventArgs = {
	where: Notebook_Event_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Notebook_Event_By_PkArgs = {
	id: Scalars['uuid'];
};

/** mutation root */
export type Mutation_RootDelete_Notebook_MemberArgs = {
	where: Notebook_Member_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Notebook_Member_By_PkArgs = {
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
export type Mutation_RootInsert_NotebookArgs = {
	objects: Array<Notebook_Insert_Input>;
	on_conflict?: Maybe<Notebook_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Notebook_EventArgs = {
	objects: Array<Notebook_Event_Insert_Input>;
	on_conflict?: Maybe<Notebook_Event_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Notebook_Event_OneArgs = {
	object: Notebook_Event_Insert_Input;
	on_conflict?: Maybe<Notebook_Event_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Notebook_MemberArgs = {
	objects: Array<Notebook_Member_Insert_Input>;
	on_conflict?: Maybe<Notebook_Member_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Notebook_Member_OneArgs = {
	object: Notebook_Member_Insert_Input;
	on_conflict?: Maybe<Notebook_Member_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Notebook_OneArgs = {
	object: Notebook_Insert_Input;
	on_conflict?: Maybe<Notebook_On_Conflict>;
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
export type Mutation_RootUpdate_NotebookArgs = {
	_set?: Maybe<Notebook_Set_Input>;
	where: Notebook_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Notebook_By_PkArgs = {
	_set?: Maybe<Notebook_Set_Input>;
	pk_columns: Notebook_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdate_Notebook_EventArgs = {
	_append?: Maybe<Notebook_Event_Append_Input>;
	_delete_at_path?: Maybe<Notebook_Event_Delete_At_Path_Input>;
	_delete_elem?: Maybe<Notebook_Event_Delete_Elem_Input>;
	_delete_key?: Maybe<Notebook_Event_Delete_Key_Input>;
	_prepend?: Maybe<Notebook_Event_Prepend_Input>;
	_set?: Maybe<Notebook_Event_Set_Input>;
	where: Notebook_Event_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Notebook_Event_By_PkArgs = {
	_append?: Maybe<Notebook_Event_Append_Input>;
	_delete_at_path?: Maybe<Notebook_Event_Delete_At_Path_Input>;
	_delete_elem?: Maybe<Notebook_Event_Delete_Elem_Input>;
	_delete_key?: Maybe<Notebook_Event_Delete_Key_Input>;
	_prepend?: Maybe<Notebook_Event_Prepend_Input>;
	_set?: Maybe<Notebook_Event_Set_Input>;
	pk_columns: Notebook_Event_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdate_Notebook_MemberArgs = {
	_set?: Maybe<Notebook_Member_Set_Input>;
	where: Notebook_Member_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Notebook_Member_By_PkArgs = {
	_set?: Maybe<Notebook_Member_Set_Input>;
	pk_columns: Notebook_Member_Pk_Columns_Input;
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

/** columns and relationships of "notebook" */
export type Notebook = {
	__typename?: 'notebook';
	/** An object relationship */
	beneficiary: Beneficiary;
	beneficiaryId: Scalars['uuid'];
	creationDate: Scalars['timestamptz'];
	/** An array relationship */
	events: Array<Notebook_Event>;
	/** An aggregate relationship */
	events_aggregate: Notebook_Event_Aggregate;
	id: Scalars['uuid'];
	/** An array relationship */
	members: Array<Notebook_Member>;
	/** An aggregate relationship */
	members_aggregate: Notebook_Member_Aggregate;
};

/** columns and relationships of "notebook" */
export type NotebookEventsArgs = {
	distinct_on?: Maybe<Array<Notebook_Event_Select_Column>>;
	limit?: Maybe<Scalars['Int']>;
	offset?: Maybe<Scalars['Int']>;
	order_by?: Maybe<Array<Notebook_Event_Order_By>>;
	where?: Maybe<Notebook_Event_Bool_Exp>;
};

/** columns and relationships of "notebook" */
export type NotebookEvents_AggregateArgs = {
	distinct_on?: Maybe<Array<Notebook_Event_Select_Column>>;
	limit?: Maybe<Scalars['Int']>;
	offset?: Maybe<Scalars['Int']>;
	order_by?: Maybe<Array<Notebook_Event_Order_By>>;
	where?: Maybe<Notebook_Event_Bool_Exp>;
};

/** columns and relationships of "notebook" */
export type NotebookMembersArgs = {
	distinct_on?: Maybe<Array<Notebook_Member_Select_Column>>;
	limit?: Maybe<Scalars['Int']>;
	offset?: Maybe<Scalars['Int']>;
	order_by?: Maybe<Array<Notebook_Member_Order_By>>;
	where?: Maybe<Notebook_Member_Bool_Exp>;
};

/** columns and relationships of "notebook" */
export type NotebookMembers_AggregateArgs = {
	distinct_on?: Maybe<Array<Notebook_Member_Select_Column>>;
	limit?: Maybe<Scalars['Int']>;
	offset?: Maybe<Scalars['Int']>;
	order_by?: Maybe<Array<Notebook_Member_Order_By>>;
	where?: Maybe<Notebook_Member_Bool_Exp>;
};

/** aggregated selection of "notebook" */
export type Notebook_Aggregate = {
	__typename?: 'notebook_aggregate';
	aggregate?: Maybe<Notebook_Aggregate_Fields>;
	nodes: Array<Notebook>;
};

/** aggregate fields of "notebook" */
export type Notebook_Aggregate_Fields = {
	__typename?: 'notebook_aggregate_fields';
	count: Scalars['Int'];
	max?: Maybe<Notebook_Max_Fields>;
	min?: Maybe<Notebook_Min_Fields>;
};

/** aggregate fields of "notebook" */
export type Notebook_Aggregate_FieldsCountArgs = {
	columns?: Maybe<Array<Notebook_Select_Column>>;
	distinct?: Maybe<Scalars['Boolean']>;
};

/** Boolean expression to filter rows from the table "notebook". All fields are combined with a logical 'AND'. */
export type Notebook_Bool_Exp = {
	_and?: Maybe<Array<Notebook_Bool_Exp>>;
	_not?: Maybe<Notebook_Bool_Exp>;
	_or?: Maybe<Array<Notebook_Bool_Exp>>;
	beneficiary?: Maybe<Beneficiary_Bool_Exp>;
	beneficiaryId?: Maybe<Uuid_Comparison_Exp>;
	creationDate?: Maybe<Timestamptz_Comparison_Exp>;
	events?: Maybe<Notebook_Event_Bool_Exp>;
	id?: Maybe<Uuid_Comparison_Exp>;
	members?: Maybe<Notebook_Member_Bool_Exp>;
};

/** unique or primary key constraints on table "notebook" */
export enum Notebook_Constraint {
	/** unique or primary key constraint */
	NotebookBeneficiaryIdKey = 'notebook_beneficiary_id_key',
	/** unique or primary key constraint */
	NotebookPkey = 'notebook_pkey'
}

/** columns and relationships of "notebook_event" */
export type Notebook_Event = {
	__typename?: 'notebook_event';
	creationDate: Scalars['timestamptz'];
	data: Scalars['jsonb'];
	eventDate: Scalars['date'];
	id: Scalars['uuid'];
	/** An object relationship */
	notebook: Notebook;
	notebookId: Scalars['uuid'];
	/** An object relationship */
	professional: Professional;
	professionalId: Scalars['uuid'];
};

/** columns and relationships of "notebook_event" */
export type Notebook_EventDataArgs = {
	path?: Maybe<Scalars['String']>;
};

/** aggregated selection of "notebook_event" */
export type Notebook_Event_Aggregate = {
	__typename?: 'notebook_event_aggregate';
	aggregate?: Maybe<Notebook_Event_Aggregate_Fields>;
	nodes: Array<Notebook_Event>;
};

/** aggregate fields of "notebook_event" */
export type Notebook_Event_Aggregate_Fields = {
	__typename?: 'notebook_event_aggregate_fields';
	count: Scalars['Int'];
	max?: Maybe<Notebook_Event_Max_Fields>;
	min?: Maybe<Notebook_Event_Min_Fields>;
};

/** aggregate fields of "notebook_event" */
export type Notebook_Event_Aggregate_FieldsCountArgs = {
	columns?: Maybe<Array<Notebook_Event_Select_Column>>;
	distinct?: Maybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "notebook_event" */
export type Notebook_Event_Aggregate_Order_By = {
	count?: Maybe<Order_By>;
	max?: Maybe<Notebook_Event_Max_Order_By>;
	min?: Maybe<Notebook_Event_Min_Order_By>;
};

/** append existing jsonb value of filtered columns with new jsonb value */
export type Notebook_Event_Append_Input = {
	data?: Maybe<Scalars['jsonb']>;
};

/** input type for inserting array relation for remote table "notebook_event" */
export type Notebook_Event_Arr_Rel_Insert_Input = {
	data: Array<Notebook_Event_Insert_Input>;
	/** on conflict condition */
	on_conflict?: Maybe<Notebook_Event_On_Conflict>;
};

/** Boolean expression to filter rows from the table "notebook_event". All fields are combined with a logical 'AND'. */
export type Notebook_Event_Bool_Exp = {
	_and?: Maybe<Array<Notebook_Event_Bool_Exp>>;
	_not?: Maybe<Notebook_Event_Bool_Exp>;
	_or?: Maybe<Array<Notebook_Event_Bool_Exp>>;
	creationDate?: Maybe<Timestamptz_Comparison_Exp>;
	data?: Maybe<Jsonb_Comparison_Exp>;
	eventDate?: Maybe<Date_Comparison_Exp>;
	id?: Maybe<Uuid_Comparison_Exp>;
	notebook?: Maybe<Notebook_Bool_Exp>;
	notebookId?: Maybe<Uuid_Comparison_Exp>;
	professional?: Maybe<Professional_Bool_Exp>;
	professionalId?: Maybe<Uuid_Comparison_Exp>;
};

/** unique or primary key constraints on table "notebook_event" */
export enum Notebook_Event_Constraint {
	/** unique or primary key constraint */
	NotebookEventPkey = 'notebook_event_pkey'
}

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export type Notebook_Event_Delete_At_Path_Input = {
	data?: Maybe<Array<Scalars['String']>>;
};

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export type Notebook_Event_Delete_Elem_Input = {
	data?: Maybe<Scalars['Int']>;
};

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export type Notebook_Event_Delete_Key_Input = {
	data?: Maybe<Scalars['String']>;
};

/** input type for inserting data into table "notebook_event" */
export type Notebook_Event_Insert_Input = {
	creationDate?: Maybe<Scalars['timestamptz']>;
	data?: Maybe<Scalars['jsonb']>;
	eventDate?: Maybe<Scalars['date']>;
	id?: Maybe<Scalars['uuid']>;
	notebook?: Maybe<Notebook_Obj_Rel_Insert_Input>;
	notebookId?: Maybe<Scalars['uuid']>;
	professional?: Maybe<Professional_Obj_Rel_Insert_Input>;
	professionalId?: Maybe<Scalars['uuid']>;
};

/** aggregate max on columns */
export type Notebook_Event_Max_Fields = {
	__typename?: 'notebook_event_max_fields';
	creationDate?: Maybe<Scalars['timestamptz']>;
	eventDate?: Maybe<Scalars['date']>;
	id?: Maybe<Scalars['uuid']>;
	notebookId?: Maybe<Scalars['uuid']>;
	professionalId?: Maybe<Scalars['uuid']>;
};

/** order by max() on columns of table "notebook_event" */
export type Notebook_Event_Max_Order_By = {
	creationDate?: Maybe<Order_By>;
	eventDate?: Maybe<Order_By>;
	id?: Maybe<Order_By>;
	notebookId?: Maybe<Order_By>;
	professionalId?: Maybe<Order_By>;
};

/** aggregate min on columns */
export type Notebook_Event_Min_Fields = {
	__typename?: 'notebook_event_min_fields';
	creationDate?: Maybe<Scalars['timestamptz']>;
	eventDate?: Maybe<Scalars['date']>;
	id?: Maybe<Scalars['uuid']>;
	notebookId?: Maybe<Scalars['uuid']>;
	professionalId?: Maybe<Scalars['uuid']>;
};

/** order by min() on columns of table "notebook_event" */
export type Notebook_Event_Min_Order_By = {
	creationDate?: Maybe<Order_By>;
	eventDate?: Maybe<Order_By>;
	id?: Maybe<Order_By>;
	notebookId?: Maybe<Order_By>;
	professionalId?: Maybe<Order_By>;
};

/** response of any mutation on the table "notebook_event" */
export type Notebook_Event_Mutation_Response = {
	__typename?: 'notebook_event_mutation_response';
	/** number of rows affected by the mutation */
	affected_rows: Scalars['Int'];
	/** data from the rows affected by the mutation */
	returning: Array<Notebook_Event>;
};

/** on conflict condition type for table "notebook_event" */
export type Notebook_Event_On_Conflict = {
	constraint: Notebook_Event_Constraint;
	update_columns?: Array<Notebook_Event_Update_Column>;
	where?: Maybe<Notebook_Event_Bool_Exp>;
};

/** Ordering options when selecting data from "notebook_event". */
export type Notebook_Event_Order_By = {
	creationDate?: Maybe<Order_By>;
	data?: Maybe<Order_By>;
	eventDate?: Maybe<Order_By>;
	id?: Maybe<Order_By>;
	notebook?: Maybe<Notebook_Order_By>;
	notebookId?: Maybe<Order_By>;
	professional?: Maybe<Professional_Order_By>;
	professionalId?: Maybe<Order_By>;
};

/** primary key columns input for table: notebook_event */
export type Notebook_Event_Pk_Columns_Input = {
	id: Scalars['uuid'];
};

/** prepend existing jsonb value of filtered columns with new jsonb value */
export type Notebook_Event_Prepend_Input = {
	data?: Maybe<Scalars['jsonb']>;
};

/** select columns of table "notebook_event" */
export enum Notebook_Event_Select_Column {
	/** column name */
	CreationDate = 'creationDate',
	/** column name */
	Data = 'data',
	/** column name */
	EventDate = 'eventDate',
	/** column name */
	Id = 'id',
	/** column name */
	NotebookId = 'notebookId',
	/** column name */
	ProfessionalId = 'professionalId'
}

/** input type for updating data in table "notebook_event" */
export type Notebook_Event_Set_Input = {
	creationDate?: Maybe<Scalars['timestamptz']>;
	data?: Maybe<Scalars['jsonb']>;
	eventDate?: Maybe<Scalars['date']>;
	id?: Maybe<Scalars['uuid']>;
	notebookId?: Maybe<Scalars['uuid']>;
	professionalId?: Maybe<Scalars['uuid']>;
};

/** update columns of table "notebook_event" */
export enum Notebook_Event_Update_Column {
	/** column name */
	CreationDate = 'creationDate',
	/** column name */
	Data = 'data',
	/** column name */
	EventDate = 'eventDate',
	/** column name */
	Id = 'id',
	/** column name */
	NotebookId = 'notebookId',
	/** column name */
	ProfessionalId = 'professionalId'
}

/** input type for inserting data into table "notebook" */
export type Notebook_Insert_Input = {
	beneficiary?: Maybe<Beneficiary_Obj_Rel_Insert_Input>;
	beneficiaryId?: Maybe<Scalars['uuid']>;
	creationDate?: Maybe<Scalars['timestamptz']>;
	events?: Maybe<Notebook_Event_Arr_Rel_Insert_Input>;
	id?: Maybe<Scalars['uuid']>;
	members?: Maybe<Notebook_Member_Arr_Rel_Insert_Input>;
};

/** aggregate max on columns */
export type Notebook_Max_Fields = {
	__typename?: 'notebook_max_fields';
	beneficiaryId?: Maybe<Scalars['uuid']>;
	creationDate?: Maybe<Scalars['timestamptz']>;
	id?: Maybe<Scalars['uuid']>;
};

/** columns and relationships of "notebook_member" */
export type Notebook_Member = {
	__typename?: 'notebook_member';
	id: Scalars['uuid'];
	memberType: Scalars['String'];
	/** An object relationship */
	notebook: Notebook;
	notebookId: Scalars['uuid'];
	notebookModificationDate?: Maybe<Scalars['timestamptz']>;
	notebookVisitDate?: Maybe<Scalars['timestamptz']>;
	/** An object relationship */
	professional: Professional;
	professionalId: Scalars['uuid'];
};

/** aggregated selection of "notebook_member" */
export type Notebook_Member_Aggregate = {
	__typename?: 'notebook_member_aggregate';
	aggregate?: Maybe<Notebook_Member_Aggregate_Fields>;
	nodes: Array<Notebook_Member>;
};

/** aggregate fields of "notebook_member" */
export type Notebook_Member_Aggregate_Fields = {
	__typename?: 'notebook_member_aggregate_fields';
	count: Scalars['Int'];
	max?: Maybe<Notebook_Member_Max_Fields>;
	min?: Maybe<Notebook_Member_Min_Fields>;
};

/** aggregate fields of "notebook_member" */
export type Notebook_Member_Aggregate_FieldsCountArgs = {
	columns?: Maybe<Array<Notebook_Member_Select_Column>>;
	distinct?: Maybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "notebook_member" */
export type Notebook_Member_Aggregate_Order_By = {
	count?: Maybe<Order_By>;
	max?: Maybe<Notebook_Member_Max_Order_By>;
	min?: Maybe<Notebook_Member_Min_Order_By>;
};

/** input type for inserting array relation for remote table "notebook_member" */
export type Notebook_Member_Arr_Rel_Insert_Input = {
	data: Array<Notebook_Member_Insert_Input>;
	/** on conflict condition */
	on_conflict?: Maybe<Notebook_Member_On_Conflict>;
};

/** Boolean expression to filter rows from the table "notebook_member". All fields are combined with a logical 'AND'. */
export type Notebook_Member_Bool_Exp = {
	_and?: Maybe<Array<Notebook_Member_Bool_Exp>>;
	_not?: Maybe<Notebook_Member_Bool_Exp>;
	_or?: Maybe<Array<Notebook_Member_Bool_Exp>>;
	id?: Maybe<Uuid_Comparison_Exp>;
	memberType?: Maybe<String_Comparison_Exp>;
	notebook?: Maybe<Notebook_Bool_Exp>;
	notebookId?: Maybe<Uuid_Comparison_Exp>;
	notebookModificationDate?: Maybe<Timestamptz_Comparison_Exp>;
	notebookVisitDate?: Maybe<Timestamptz_Comparison_Exp>;
	professional?: Maybe<Professional_Bool_Exp>;
	professionalId?: Maybe<Uuid_Comparison_Exp>;
};

/** unique or primary key constraints on table "notebook_member" */
export enum Notebook_Member_Constraint {
	/** unique or primary key constraint */
	NotebookMemberPkey = 'notebook_member_pkey'
}

/** input type for inserting data into table "notebook_member" */
export type Notebook_Member_Insert_Input = {
	id?: Maybe<Scalars['uuid']>;
	memberType?: Maybe<Scalars['String']>;
	notebook?: Maybe<Notebook_Obj_Rel_Insert_Input>;
	notebookId?: Maybe<Scalars['uuid']>;
	notebookModificationDate?: Maybe<Scalars['timestamptz']>;
	notebookVisitDate?: Maybe<Scalars['timestamptz']>;
	professional?: Maybe<Professional_Obj_Rel_Insert_Input>;
	professionalId?: Maybe<Scalars['uuid']>;
};

/** aggregate max on columns */
export type Notebook_Member_Max_Fields = {
	__typename?: 'notebook_member_max_fields';
	id?: Maybe<Scalars['uuid']>;
	memberType?: Maybe<Scalars['String']>;
	notebookId?: Maybe<Scalars['uuid']>;
	notebookModificationDate?: Maybe<Scalars['timestamptz']>;
	notebookVisitDate?: Maybe<Scalars['timestamptz']>;
	professionalId?: Maybe<Scalars['uuid']>;
};

/** order by max() on columns of table "notebook_member" */
export type Notebook_Member_Max_Order_By = {
	id?: Maybe<Order_By>;
	memberType?: Maybe<Order_By>;
	notebookId?: Maybe<Order_By>;
	notebookModificationDate?: Maybe<Order_By>;
	notebookVisitDate?: Maybe<Order_By>;
	professionalId?: Maybe<Order_By>;
};

/** aggregate min on columns */
export type Notebook_Member_Min_Fields = {
	__typename?: 'notebook_member_min_fields';
	id?: Maybe<Scalars['uuid']>;
	memberType?: Maybe<Scalars['String']>;
	notebookId?: Maybe<Scalars['uuid']>;
	notebookModificationDate?: Maybe<Scalars['timestamptz']>;
	notebookVisitDate?: Maybe<Scalars['timestamptz']>;
	professionalId?: Maybe<Scalars['uuid']>;
};

/** order by min() on columns of table "notebook_member" */
export type Notebook_Member_Min_Order_By = {
	id?: Maybe<Order_By>;
	memberType?: Maybe<Order_By>;
	notebookId?: Maybe<Order_By>;
	notebookModificationDate?: Maybe<Order_By>;
	notebookVisitDate?: Maybe<Order_By>;
	professionalId?: Maybe<Order_By>;
};

/** response of any mutation on the table "notebook_member" */
export type Notebook_Member_Mutation_Response = {
	__typename?: 'notebook_member_mutation_response';
	/** number of rows affected by the mutation */
	affected_rows: Scalars['Int'];
	/** data from the rows affected by the mutation */
	returning: Array<Notebook_Member>;
};

/** on conflict condition type for table "notebook_member" */
export type Notebook_Member_On_Conflict = {
	constraint: Notebook_Member_Constraint;
	update_columns?: Array<Notebook_Member_Update_Column>;
	where?: Maybe<Notebook_Member_Bool_Exp>;
};

/** Ordering options when selecting data from "notebook_member". */
export type Notebook_Member_Order_By = {
	id?: Maybe<Order_By>;
	memberType?: Maybe<Order_By>;
	notebook?: Maybe<Notebook_Order_By>;
	notebookId?: Maybe<Order_By>;
	notebookModificationDate?: Maybe<Order_By>;
	notebookVisitDate?: Maybe<Order_By>;
	professional?: Maybe<Professional_Order_By>;
	professionalId?: Maybe<Order_By>;
};

/** primary key columns input for table: notebook_member */
export type Notebook_Member_Pk_Columns_Input = {
	id: Scalars['uuid'];
};

/** select columns of table "notebook_member" */
export enum Notebook_Member_Select_Column {
	/** column name */
	Id = 'id',
	/** column name */
	MemberType = 'memberType',
	/** column name */
	NotebookId = 'notebookId',
	/** column name */
	NotebookModificationDate = 'notebookModificationDate',
	/** column name */
	NotebookVisitDate = 'notebookVisitDate',
	/** column name */
	ProfessionalId = 'professionalId'
}

/** input type for updating data in table "notebook_member" */
export type Notebook_Member_Set_Input = {
	id?: Maybe<Scalars['uuid']>;
	memberType?: Maybe<Scalars['String']>;
	notebookId?: Maybe<Scalars['uuid']>;
	notebookModificationDate?: Maybe<Scalars['timestamptz']>;
	notebookVisitDate?: Maybe<Scalars['timestamptz']>;
	professionalId?: Maybe<Scalars['uuid']>;
};

/** update columns of table "notebook_member" */
export enum Notebook_Member_Update_Column {
	/** column name */
	Id = 'id',
	/** column name */
	MemberType = 'memberType',
	/** column name */
	NotebookId = 'notebookId',
	/** column name */
	NotebookModificationDate = 'notebookModificationDate',
	/** column name */
	NotebookVisitDate = 'notebookVisitDate',
	/** column name */
	ProfessionalId = 'professionalId'
}

/** aggregate min on columns */
export type Notebook_Min_Fields = {
	__typename?: 'notebook_min_fields';
	beneficiaryId?: Maybe<Scalars['uuid']>;
	creationDate?: Maybe<Scalars['timestamptz']>;
	id?: Maybe<Scalars['uuid']>;
};

/** response of any mutation on the table "notebook" */
export type Notebook_Mutation_Response = {
	__typename?: 'notebook_mutation_response';
	/** number of rows affected by the mutation */
	affected_rows: Scalars['Int'];
	/** data from the rows affected by the mutation */
	returning: Array<Notebook>;
};

/** input type for inserting object relation for remote table "notebook" */
export type Notebook_Obj_Rel_Insert_Input = {
	data: Notebook_Insert_Input;
	/** on conflict condition */
	on_conflict?: Maybe<Notebook_On_Conflict>;
};

/** on conflict condition type for table "notebook" */
export type Notebook_On_Conflict = {
	constraint: Notebook_Constraint;
	update_columns?: Array<Notebook_Update_Column>;
	where?: Maybe<Notebook_Bool_Exp>;
};

/** Ordering options when selecting data from "notebook". */
export type Notebook_Order_By = {
	beneficiary?: Maybe<Beneficiary_Order_By>;
	beneficiaryId?: Maybe<Order_By>;
	creationDate?: Maybe<Order_By>;
	events_aggregate?: Maybe<Notebook_Event_Aggregate_Order_By>;
	id?: Maybe<Order_By>;
	members_aggregate?: Maybe<Notebook_Member_Aggregate_Order_By>;
};

/** primary key columns input for table: notebook */
export type Notebook_Pk_Columns_Input = {
	id: Scalars['uuid'];
};

/** select columns of table "notebook" */
export enum Notebook_Select_Column {
	/** column name */
	BeneficiaryId = 'beneficiaryId',
	/** column name */
	CreationDate = 'creationDate',
	/** column name */
	Id = 'id'
}

/** input type for updating data in table "notebook" */
export type Notebook_Set_Input = {
	beneficiaryId?: Maybe<Scalars['uuid']>;
	creationDate?: Maybe<Scalars['timestamptz']>;
	id?: Maybe<Scalars['uuid']>;
};

/** update columns of table "notebook" */
export enum Notebook_Update_Column {
	/** column name */
	BeneficiaryId = 'beneficiaryId',
	/** column name */
	CreationDate = 'creationDate',
	/** column name */
	Id = 'id'
}

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
	mobileNumber?: Maybe<Scalars['String']>;
	position?: Maybe<Scalars['String']>;
	/** An object relationship */
	structure: Structure;
	structureId: Scalars['uuid'];
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
	mobileNumber?: Maybe<String_Comparison_Exp>;
	position?: Maybe<String_Comparison_Exp>;
	structure?: Maybe<Structure_Bool_Exp>;
	structureId?: Maybe<Uuid_Comparison_Exp>;
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
	mobileNumber?: Maybe<Scalars['String']>;
	position?: Maybe<Scalars['String']>;
	structure?: Maybe<Structure_Obj_Rel_Insert_Input>;
	structureId?: Maybe<Scalars['uuid']>;
};

/** aggregate max on columns */
export type Professional_Max_Fields = {
	__typename?: 'professional_max_fields';
	email?: Maybe<Scalars['String']>;
	firstname?: Maybe<Scalars['String']>;
	id?: Maybe<Scalars['uuid']>;
	lastname?: Maybe<Scalars['String']>;
	mobileNumber?: Maybe<Scalars['String']>;
	position?: Maybe<Scalars['String']>;
	structureId?: Maybe<Scalars['uuid']>;
};

/** order by max() on columns of table "professional" */
export type Professional_Max_Order_By = {
	email?: Maybe<Order_By>;
	firstname?: Maybe<Order_By>;
	id?: Maybe<Order_By>;
	lastname?: Maybe<Order_By>;
	mobileNumber?: Maybe<Order_By>;
	position?: Maybe<Order_By>;
	structureId?: Maybe<Order_By>;
};

/** aggregate min on columns */
export type Professional_Min_Fields = {
	__typename?: 'professional_min_fields';
	email?: Maybe<Scalars['String']>;
	firstname?: Maybe<Scalars['String']>;
	id?: Maybe<Scalars['uuid']>;
	lastname?: Maybe<Scalars['String']>;
	mobileNumber?: Maybe<Scalars['String']>;
	position?: Maybe<Scalars['String']>;
	structureId?: Maybe<Scalars['uuid']>;
};

/** order by min() on columns of table "professional" */
export type Professional_Min_Order_By = {
	email?: Maybe<Order_By>;
	firstname?: Maybe<Order_By>;
	id?: Maybe<Order_By>;
	lastname?: Maybe<Order_By>;
	mobileNumber?: Maybe<Order_By>;
	position?: Maybe<Order_By>;
	structureId?: Maybe<Order_By>;
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
	mobileNumber?: Maybe<Order_By>;
	position?: Maybe<Order_By>;
	structure?: Maybe<Structure_Order_By>;
	structureId?: Maybe<Order_By>;
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
	MobileNumber = 'mobileNumber',
	/** column name */
	Position = 'position',
	/** column name */
	StructureId = 'structureId'
}

/** input type for updating data in table "professional" */
export type Professional_Set_Input = {
	email?: Maybe<Scalars['String']>;
	firstname?: Maybe<Scalars['String']>;
	id?: Maybe<Scalars['uuid']>;
	lastname?: Maybe<Scalars['String']>;
	mobileNumber?: Maybe<Scalars['String']>;
	position?: Maybe<Scalars['String']>;
	structureId?: Maybe<Scalars['uuid']>;
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
	MobileNumber = 'mobileNumber',
	/** column name */
	Position = 'position',
	/** column name */
	StructureId = 'structureId'
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
	/** fetch data from the table: "notebook" */
	notebook: Array<Notebook>;
	/** fetch aggregated fields from the table: "notebook" */
	notebook_aggregate: Notebook_Aggregate;
	/** fetch data from the table: "notebook" using primary key columns */
	notebook_by_pk?: Maybe<Notebook>;
	/** fetch data from the table: "notebook_event" */
	notebook_event: Array<Notebook_Event>;
	/** fetch aggregated fields from the table: "notebook_event" */
	notebook_event_aggregate: Notebook_Event_Aggregate;
	/** fetch data from the table: "notebook_event" using primary key columns */
	notebook_event_by_pk?: Maybe<Notebook_Event>;
	/** fetch data from the table: "notebook_member" */
	notebook_member: Array<Notebook_Member>;
	/** fetch aggregated fields from the table: "notebook_member" */
	notebook_member_aggregate: Notebook_Member_Aggregate;
	/** fetch data from the table: "notebook_member" using primary key columns */
	notebook_member_by_pk?: Maybe<Notebook_Member>;
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

export type Query_RootNotebookArgs = {
	distinct_on?: Maybe<Array<Notebook_Select_Column>>;
	limit?: Maybe<Scalars['Int']>;
	offset?: Maybe<Scalars['Int']>;
	order_by?: Maybe<Array<Notebook_Order_By>>;
	where?: Maybe<Notebook_Bool_Exp>;
};

export type Query_RootNotebook_AggregateArgs = {
	distinct_on?: Maybe<Array<Notebook_Select_Column>>;
	limit?: Maybe<Scalars['Int']>;
	offset?: Maybe<Scalars['Int']>;
	order_by?: Maybe<Array<Notebook_Order_By>>;
	where?: Maybe<Notebook_Bool_Exp>;
};

export type Query_RootNotebook_By_PkArgs = {
	id: Scalars['uuid'];
};

export type Query_RootNotebook_EventArgs = {
	distinct_on?: Maybe<Array<Notebook_Event_Select_Column>>;
	limit?: Maybe<Scalars['Int']>;
	offset?: Maybe<Scalars['Int']>;
	order_by?: Maybe<Array<Notebook_Event_Order_By>>;
	where?: Maybe<Notebook_Event_Bool_Exp>;
};

export type Query_RootNotebook_Event_AggregateArgs = {
	distinct_on?: Maybe<Array<Notebook_Event_Select_Column>>;
	limit?: Maybe<Scalars['Int']>;
	offset?: Maybe<Scalars['Int']>;
	order_by?: Maybe<Array<Notebook_Event_Order_By>>;
	where?: Maybe<Notebook_Event_Bool_Exp>;
};

export type Query_RootNotebook_Event_By_PkArgs = {
	id: Scalars['uuid'];
};

export type Query_RootNotebook_MemberArgs = {
	distinct_on?: Maybe<Array<Notebook_Member_Select_Column>>;
	limit?: Maybe<Scalars['Int']>;
	offset?: Maybe<Scalars['Int']>;
	order_by?: Maybe<Array<Notebook_Member_Order_By>>;
	where?: Maybe<Notebook_Member_Bool_Exp>;
};

export type Query_RootNotebook_Member_AggregateArgs = {
	distinct_on?: Maybe<Array<Notebook_Member_Select_Column>>;
	limit?: Maybe<Scalars['Int']>;
	offset?: Maybe<Scalars['Int']>;
	order_by?: Maybe<Array<Notebook_Member_Order_By>>;
	where?: Maybe<Notebook_Member_Bool_Exp>;
};

export type Query_RootNotebook_Member_By_PkArgs = {
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
	creationDate?: Maybe<Scalars['timestamptz']>;
	email?: Maybe<Scalars['String']>;
	id: Scalars['uuid'];
	modificationDate?: Maybe<Scalars['timestamptz']>;
	name?: Maybe<Scalars['String']>;
	phone?: Maybe<Scalars['String']>;
	postalCode?: Maybe<Scalars['String']>;
	/** An array relationship */
	professionals: Array<Professional>;
	/** An aggregate relationship */
	professionals_aggregate: Professional_Aggregate;
	shortDesc?: Maybe<Scalars['String']>;
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
	creationDate?: Maybe<Timestamptz_Comparison_Exp>;
	email?: Maybe<String_Comparison_Exp>;
	id?: Maybe<Uuid_Comparison_Exp>;
	modificationDate?: Maybe<Timestamptz_Comparison_Exp>;
	name?: Maybe<String_Comparison_Exp>;
	phone?: Maybe<String_Comparison_Exp>;
	postalCode?: Maybe<String_Comparison_Exp>;
	professionals?: Maybe<Professional_Bool_Exp>;
	shortDesc?: Maybe<String_Comparison_Exp>;
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
	creationDate?: Maybe<Scalars['timestamptz']>;
	email?: Maybe<Scalars['String']>;
	id?: Maybe<Scalars['uuid']>;
	modificationDate?: Maybe<Scalars['timestamptz']>;
	name?: Maybe<Scalars['String']>;
	phone?: Maybe<Scalars['String']>;
	postalCode?: Maybe<Scalars['String']>;
	professionals?: Maybe<Professional_Arr_Rel_Insert_Input>;
	shortDesc?: Maybe<Scalars['String']>;
	siret?: Maybe<Scalars['String']>;
};

/** aggregate max on columns */
export type Structure_Max_Fields = {
	__typename?: 'structure_max_fields';
	address1?: Maybe<Scalars['String']>;
	address2?: Maybe<Scalars['String']>;
	city?: Maybe<Scalars['String']>;
	creationDate?: Maybe<Scalars['timestamptz']>;
	email?: Maybe<Scalars['String']>;
	id?: Maybe<Scalars['uuid']>;
	modificationDate?: Maybe<Scalars['timestamptz']>;
	name?: Maybe<Scalars['String']>;
	phone?: Maybe<Scalars['String']>;
	postalCode?: Maybe<Scalars['String']>;
	shortDesc?: Maybe<Scalars['String']>;
	siret?: Maybe<Scalars['String']>;
};

/** aggregate min on columns */
export type Structure_Min_Fields = {
	__typename?: 'structure_min_fields';
	address1?: Maybe<Scalars['String']>;
	address2?: Maybe<Scalars['String']>;
	city?: Maybe<Scalars['String']>;
	creationDate?: Maybe<Scalars['timestamptz']>;
	email?: Maybe<Scalars['String']>;
	id?: Maybe<Scalars['uuid']>;
	modificationDate?: Maybe<Scalars['timestamptz']>;
	name?: Maybe<Scalars['String']>;
	phone?: Maybe<Scalars['String']>;
	postalCode?: Maybe<Scalars['String']>;
	shortDesc?: Maybe<Scalars['String']>;
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
	creationDate?: Maybe<Order_By>;
	email?: Maybe<Order_By>;
	id?: Maybe<Order_By>;
	modificationDate?: Maybe<Order_By>;
	name?: Maybe<Order_By>;
	phone?: Maybe<Order_By>;
	postalCode?: Maybe<Order_By>;
	professionals_aggregate?: Maybe<Professional_Aggregate_Order_By>;
	shortDesc?: Maybe<Order_By>;
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
	CreationDate = 'creationDate',
	/** column name */
	Email = 'email',
	/** column name */
	Id = 'id',
	/** column name */
	ModificationDate = 'modificationDate',
	/** column name */
	Name = 'name',
	/** column name */
	Phone = 'phone',
	/** column name */
	PostalCode = 'postalCode',
	/** column name */
	ShortDesc = 'shortDesc',
	/** column name */
	Siret = 'siret'
}

/** input type for updating data in table "structure" */
export type Structure_Set_Input = {
	address1?: Maybe<Scalars['String']>;
	address2?: Maybe<Scalars['String']>;
	city?: Maybe<Scalars['String']>;
	creationDate?: Maybe<Scalars['timestamptz']>;
	email?: Maybe<Scalars['String']>;
	id?: Maybe<Scalars['uuid']>;
	modificationDate?: Maybe<Scalars['timestamptz']>;
	name?: Maybe<Scalars['String']>;
	phone?: Maybe<Scalars['String']>;
	postalCode?: Maybe<Scalars['String']>;
	shortDesc?: Maybe<Scalars['String']>;
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
	CreationDate = 'creationDate',
	/** column name */
	Email = 'email',
	/** column name */
	Id = 'id',
	/** column name */
	ModificationDate = 'modificationDate',
	/** column name */
	Name = 'name',
	/** column name */
	Phone = 'phone',
	/** column name */
	PostalCode = 'postalCode',
	/** column name */
	ShortDesc = 'shortDesc',
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
	/** fetch data from the table: "notebook" */
	notebook: Array<Notebook>;
	/** fetch aggregated fields from the table: "notebook" */
	notebook_aggregate: Notebook_Aggregate;
	/** fetch data from the table: "notebook" using primary key columns */
	notebook_by_pk?: Maybe<Notebook>;
	/** fetch data from the table: "notebook_event" */
	notebook_event: Array<Notebook_Event>;
	/** fetch aggregated fields from the table: "notebook_event" */
	notebook_event_aggregate: Notebook_Event_Aggregate;
	/** fetch data from the table: "notebook_event" using primary key columns */
	notebook_event_by_pk?: Maybe<Notebook_Event>;
	/** fetch data from the table: "notebook_member" */
	notebook_member: Array<Notebook_Member>;
	/** fetch aggregated fields from the table: "notebook_member" */
	notebook_member_aggregate: Notebook_Member_Aggregate;
	/** fetch data from the table: "notebook_member" using primary key columns */
	notebook_member_by_pk?: Maybe<Notebook_Member>;
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

export type Subscription_RootNotebookArgs = {
	distinct_on?: Maybe<Array<Notebook_Select_Column>>;
	limit?: Maybe<Scalars['Int']>;
	offset?: Maybe<Scalars['Int']>;
	order_by?: Maybe<Array<Notebook_Order_By>>;
	where?: Maybe<Notebook_Bool_Exp>;
};

export type Subscription_RootNotebook_AggregateArgs = {
	distinct_on?: Maybe<Array<Notebook_Select_Column>>;
	limit?: Maybe<Scalars['Int']>;
	offset?: Maybe<Scalars['Int']>;
	order_by?: Maybe<Array<Notebook_Order_By>>;
	where?: Maybe<Notebook_Bool_Exp>;
};

export type Subscription_RootNotebook_By_PkArgs = {
	id: Scalars['uuid'];
};

export type Subscription_RootNotebook_EventArgs = {
	distinct_on?: Maybe<Array<Notebook_Event_Select_Column>>;
	limit?: Maybe<Scalars['Int']>;
	offset?: Maybe<Scalars['Int']>;
	order_by?: Maybe<Array<Notebook_Event_Order_By>>;
	where?: Maybe<Notebook_Event_Bool_Exp>;
};

export type Subscription_RootNotebook_Event_AggregateArgs = {
	distinct_on?: Maybe<Array<Notebook_Event_Select_Column>>;
	limit?: Maybe<Scalars['Int']>;
	offset?: Maybe<Scalars['Int']>;
	order_by?: Maybe<Array<Notebook_Event_Order_By>>;
	where?: Maybe<Notebook_Event_Bool_Exp>;
};

export type Subscription_RootNotebook_Event_By_PkArgs = {
	id: Scalars['uuid'];
};

export type Subscription_RootNotebook_MemberArgs = {
	distinct_on?: Maybe<Array<Notebook_Member_Select_Column>>;
	limit?: Maybe<Scalars['Int']>;
	offset?: Maybe<Scalars['Int']>;
	order_by?: Maybe<Array<Notebook_Member_Order_By>>;
	where?: Maybe<Notebook_Member_Bool_Exp>;
};

export type Subscription_RootNotebook_Member_AggregateArgs = {
	distinct_on?: Maybe<Array<Notebook_Member_Select_Column>>;
	limit?: Maybe<Scalars['Int']>;
	offset?: Maybe<Scalars['Int']>;
	order_by?: Maybe<Array<Notebook_Member_Order_By>>;
	where?: Maybe<Notebook_Member_Bool_Exp>;
};

export type Subscription_RootNotebook_Member_By_PkArgs = {
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

export type GetAccountsSummaryQueryVariables = Exact<{ [key: string]: never }>;

export type GetAccountsSummaryQuery = {
	__typename?: 'query_root';
	proConfirmed: Array<{
		__typename?: 'account';
		id: any;
		professional?: Maybe<{
			__typename?: 'professional';
			id: any;
			firstname: string;
			lastname: string;
			position?: Maybe<string>;
			structure: { __typename?: 'structure'; name?: Maybe<string> };
		}>;
	}>;
	proUnconfirmed: Array<{
		__typename?: 'account';
		id: any;
		professional?: Maybe<{
			__typename?: 'professional';
			id: any;
			firstname: string;
			lastname: string;
			position?: Maybe<string>;
			structure: { __typename?: 'structure'; name?: Maybe<string> };
		}>;
	}>;
	beneficiaryConfirmed: Array<{
		__typename?: 'account';
		id: any;
		beneficiary?: Maybe<{
			__typename?: 'beneficiary';
			id: any;
			firstname: string;
			lastname: string;
		}>;
	}>;
	beneficiaryUnconfirmed: Array<{
		__typename?: 'account';
		id: any;
		beneficiary?: Maybe<{
			__typename?: 'beneficiary';
			id: any;
			firstname: string;
			lastname: string;
		}>;
	}>;
};

export type GetStructuresQueryVariables = Exact<{ [key: string]: never }>;

export type GetStructuresQuery = {
	__typename?: 'query_root';
	structure: Array<{
		__typename?: 'structure';
		id: any;
		siret?: Maybe<string>;
		name?: Maybe<string>;
		shortDesc?: Maybe<string>;
		phone?: Maybe<string>;
		email?: Maybe<string>;
		postalCode?: Maybe<string>;
		city?: Maybe<string>;
		address1?: Maybe<string>;
		address2?: Maybe<string>;
	}>;
};

export type GetAccountQueryVariables = Exact<{
	accountId: Scalars['uuid'];
}>;

export type GetAccountQuery = {
	__typename?: 'query_root';
	account_by_pk?: Maybe<{
		__typename?: 'account';
		confirmed: boolean;
		username: string;
		onboardingDone?: Maybe<boolean>;
		professional?: Maybe<{
			__typename?: 'professional';
			firstname: string;
			lastname: string;
			mobileNumber?: Maybe<string>;
			email: string;
			position?: Maybe<string>;
		}>;
	}>;
};

export type GetLastVisitedOrUpdatedQueryVariables = Exact<{
	professionalId: Scalars['uuid'];
}>;

export type GetLastVisitedOrUpdatedQuery = {
	__typename?: 'query_root';
	lastVisited: Array<{
		__typename?: 'notebook_member';
		notebook: {
			__typename?: 'notebook';
			beneficiary: {
				__typename?: 'beneficiary';
				id: any;
				firstname: string;
				lastname: string;
				mobileNumber?: Maybe<string>;
				dateOfBirth: any;
			};
		};
	}>;
	lastUpdated: Array<{
		__typename?: 'notebook_member';
		notebook: {
			__typename?: 'notebook';
			beneficiary: {
				__typename?: 'beneficiary';
				id: any;
				firstname: string;
				lastname: string;
				mobileNumber?: Maybe<string>;
				dateOfBirth: any;
			};
		};
	}>;
};

export type SearchBeneficiariesQueryVariables = Exact<{
	filter?: Maybe<Scalars['String']>;
}>;

export type SearchBeneficiariesQuery = {
	__typename?: 'query_root';
	beneficiary: Array<{
		__typename?: 'beneficiary';
		dateOfBirth: any;
		firstname: string;
		id: any;
		lastname: string;
		mobileNumber?: Maybe<string>;
	}>;
};

export type UpdateNotebookVisitDateMutationVariables = Exact<{
	beneficiaryId: Scalars['uuid'];
	notebookVisitDate: Scalars['timestamptz'];
}>;

export type UpdateNotebookVisitDateMutation = {
	__typename?: 'mutation_root';
	update_notebook_member?: Maybe<{
		__typename?: 'notebook_member_mutation_response';
		returning: Array<{
			__typename?: 'notebook_member';
			notebook: {
				__typename?: 'notebook';
				beneficiary: {
					__typename?: 'beneficiary';
					address1?: Maybe<string>;
					address2?: Maybe<string>;
					cafNumber?: Maybe<string>;
					city?: Maybe<string>;
					dateOfBirth: any;
					email: string;
					firstname: string;
					id: any;
					lastname: string;
					mobileNumber?: Maybe<string>;
					peNumber?: Maybe<string>;
					postalCode?: Maybe<string>;
				};
			};
		}>;
	}>;
};

export const GetAccountsSummaryDocument = {
	kind: 'Document',
	definitions: [
		{
			kind: 'OperationDefinition',
			operation: 'query',
			name: { kind: 'Name', value: 'GetAccountsSummary' },
			selectionSet: {
				kind: 'SelectionSet',
				selections: [
					{
						kind: 'Field',
						alias: { kind: 'Name', value: 'proConfirmed' },
						name: { kind: 'Name', value: 'account' },
						arguments: [
							{
								kind: 'Argument',
								name: { kind: 'Name', value: 'where' },
								value: {
									kind: 'ObjectValue',
									fields: [
										{
											kind: 'ObjectField',
											name: { kind: 'Name', value: 'type' },
											value: {
												kind: 'ObjectValue',
												fields: [
													{
														kind: 'ObjectField',
														name: { kind: 'Name', value: '_eq' },
														value: { kind: 'StringValue', value: 'professional', block: false }
													}
												]
											}
										},
										{
											kind: 'ObjectField',
											name: { kind: 'Name', value: 'confirmed' },
											value: {
												kind: 'ObjectValue',
												fields: [
													{
														kind: 'ObjectField',
														name: { kind: 'Name', value: '_eq' },
														value: { kind: 'BooleanValue', value: true }
													}
												]
											}
										}
									]
								}
							}
						],
						selectionSet: {
							kind: 'SelectionSet',
							selections: [
								{ kind: 'Field', name: { kind: 'Name', value: 'id' } },
								{
									kind: 'Field',
									name: { kind: 'Name', value: 'professional' },
									selectionSet: {
										kind: 'SelectionSet',
										selections: [
											{ kind: 'Field', name: { kind: 'Name', value: 'id' } },
											{ kind: 'Field', name: { kind: 'Name', value: 'firstname' } },
											{ kind: 'Field', name: { kind: 'Name', value: 'lastname' } },
											{ kind: 'Field', name: { kind: 'Name', value: 'position' } },
											{
												kind: 'Field',
												name: { kind: 'Name', value: 'structure' },
												selectionSet: {
													kind: 'SelectionSet',
													selections: [{ kind: 'Field', name: { kind: 'Name', value: 'name' } }]
												}
											}
										]
									}
								}
							]
						}
					},
					{
						kind: 'Field',
						alias: { kind: 'Name', value: 'proUnconfirmed' },
						name: { kind: 'Name', value: 'account' },
						arguments: [
							{
								kind: 'Argument',
								name: { kind: 'Name', value: 'where' },
								value: {
									kind: 'ObjectValue',
									fields: [
										{
											kind: 'ObjectField',
											name: { kind: 'Name', value: 'type' },
											value: {
												kind: 'ObjectValue',
												fields: [
													{
														kind: 'ObjectField',
														name: { kind: 'Name', value: '_eq' },
														value: { kind: 'StringValue', value: 'professional', block: false }
													}
												]
											}
										},
										{
											kind: 'ObjectField',
											name: { kind: 'Name', value: 'confirmed' },
											value: {
												kind: 'ObjectValue',
												fields: [
													{
														kind: 'ObjectField',
														name: { kind: 'Name', value: '_eq' },
														value: { kind: 'BooleanValue', value: false }
													}
												]
											}
										}
									]
								}
							}
						],
						selectionSet: {
							kind: 'SelectionSet',
							selections: [
								{ kind: 'Field', name: { kind: 'Name', value: 'id' } },
								{
									kind: 'Field',
									name: { kind: 'Name', value: 'professional' },
									selectionSet: {
										kind: 'SelectionSet',
										selections: [
											{ kind: 'Field', name: { kind: 'Name', value: 'id' } },
											{ kind: 'Field', name: { kind: 'Name', value: 'firstname' } },
											{ kind: 'Field', name: { kind: 'Name', value: 'lastname' } },
											{ kind: 'Field', name: { kind: 'Name', value: 'position' } },
											{
												kind: 'Field',
												name: { kind: 'Name', value: 'structure' },
												selectionSet: {
													kind: 'SelectionSet',
													selections: [{ kind: 'Field', name: { kind: 'Name', value: 'name' } }]
												}
											}
										]
									}
								}
							]
						}
					},
					{
						kind: 'Field',
						alias: { kind: 'Name', value: 'beneficiaryConfirmed' },
						name: { kind: 'Name', value: 'account' },
						arguments: [
							{
								kind: 'Argument',
								name: { kind: 'Name', value: 'where' },
								value: {
									kind: 'ObjectValue',
									fields: [
										{
											kind: 'ObjectField',
											name: { kind: 'Name', value: 'type' },
											value: {
												kind: 'ObjectValue',
												fields: [
													{
														kind: 'ObjectField',
														name: { kind: 'Name', value: '_eq' },
														value: { kind: 'StringValue', value: 'beneficiary', block: false }
													}
												]
											}
										},
										{
											kind: 'ObjectField',
											name: { kind: 'Name', value: 'confirmed' },
											value: {
												kind: 'ObjectValue',
												fields: [
													{
														kind: 'ObjectField',
														name: { kind: 'Name', value: '_eq' },
														value: { kind: 'BooleanValue', value: true }
													}
												]
											}
										}
									]
								}
							}
						],
						selectionSet: {
							kind: 'SelectionSet',
							selections: [
								{ kind: 'Field', name: { kind: 'Name', value: 'id' } },
								{
									kind: 'Field',
									name: { kind: 'Name', value: 'beneficiary' },
									selectionSet: {
										kind: 'SelectionSet',
										selections: [
											{ kind: 'Field', name: { kind: 'Name', value: 'id' } },
											{ kind: 'Field', name: { kind: 'Name', value: 'firstname' } },
											{ kind: 'Field', name: { kind: 'Name', value: 'lastname' } }
										]
									}
								}
							]
						}
					},
					{
						kind: 'Field',
						alias: { kind: 'Name', value: 'beneficiaryUnconfirmed' },
						name: { kind: 'Name', value: 'account' },
						arguments: [
							{
								kind: 'Argument',
								name: { kind: 'Name', value: 'where' },
								value: {
									kind: 'ObjectValue',
									fields: [
										{
											kind: 'ObjectField',
											name: { kind: 'Name', value: 'type' },
											value: {
												kind: 'ObjectValue',
												fields: [
													{
														kind: 'ObjectField',
														name: { kind: 'Name', value: '_eq' },
														value: { kind: 'StringValue', value: 'beneficiary', block: false }
													}
												]
											}
										},
										{
											kind: 'ObjectField',
											name: { kind: 'Name', value: 'confirmed' },
											value: {
												kind: 'ObjectValue',
												fields: [
													{
														kind: 'ObjectField',
														name: { kind: 'Name', value: '_eq' },
														value: { kind: 'BooleanValue', value: false }
													}
												]
											}
										}
									]
								}
							}
						],
						selectionSet: {
							kind: 'SelectionSet',
							selections: [
								{ kind: 'Field', name: { kind: 'Name', value: 'id' } },
								{
									kind: 'Field',
									name: { kind: 'Name', value: 'beneficiary' },
									selectionSet: {
										kind: 'SelectionSet',
										selections: [
											{ kind: 'Field', name: { kind: 'Name', value: 'id' } },
											{ kind: 'Field', name: { kind: 'Name', value: 'firstname' } },
											{ kind: 'Field', name: { kind: 'Name', value: 'lastname' } }
										]
									}
								}
							]
						}
					}
				]
			}
		}
	]
} as unknown as DocumentNode<GetAccountsSummaryQuery, GetAccountsSummaryQueryVariables>;
export const GetStructuresDocument = {
	kind: 'Document',
	definitions: [
		{
			kind: 'OperationDefinition',
			operation: 'query',
			name: { kind: 'Name', value: 'GetStructures' },
			selectionSet: {
				kind: 'SelectionSet',
				selections: [
					{
						kind: 'Field',
						name: { kind: 'Name', value: 'structure' },
						selectionSet: {
							kind: 'SelectionSet',
							selections: [
								{ kind: 'Field', name: { kind: 'Name', value: 'id' } },
								{ kind: 'Field', name: { kind: 'Name', value: 'siret' } },
								{ kind: 'Field', name: { kind: 'Name', value: 'name' } },
								{ kind: 'Field', name: { kind: 'Name', value: 'shortDesc' } },
								{ kind: 'Field', name: { kind: 'Name', value: 'phone' } },
								{ kind: 'Field', name: { kind: 'Name', value: 'email' } },
								{ kind: 'Field', name: { kind: 'Name', value: 'postalCode' } },
								{ kind: 'Field', name: { kind: 'Name', value: 'city' } },
								{ kind: 'Field', name: { kind: 'Name', value: 'address1' } },
								{ kind: 'Field', name: { kind: 'Name', value: 'address2' } }
							]
						}
					}
				]
			}
		}
	]
} as unknown as DocumentNode<GetStructuresQuery, GetStructuresQueryVariables>;
export const GetAccountDocument = {
	kind: 'Document',
	definitions: [
		{
			kind: 'OperationDefinition',
			operation: 'query',
			name: { kind: 'Name', value: 'GetAccount' },
			variableDefinitions: [
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'accountId' } },
					type: {
						kind: 'NonNullType',
						type: { kind: 'NamedType', name: { kind: 'Name', value: 'uuid' } }
					}
				}
			],
			selectionSet: {
				kind: 'SelectionSet',
				selections: [
					{
						kind: 'Field',
						name: { kind: 'Name', value: 'account_by_pk' },
						arguments: [
							{
								kind: 'Argument',
								name: { kind: 'Name', value: 'id' },
								value: { kind: 'Variable', name: { kind: 'Name', value: 'accountId' } }
							}
						],
						selectionSet: {
							kind: 'SelectionSet',
							selections: [
								{
									kind: 'Field',
									alias: { kind: 'Name', value: 'onboardingDone' },
									name: { kind: 'Name', value: 'onboarding_done' }
								},
								{ kind: 'Field', name: { kind: 'Name', value: 'confirmed' } },
								{ kind: 'Field', name: { kind: 'Name', value: 'username' } },
								{
									kind: 'Field',
									name: { kind: 'Name', value: 'professional' },
									selectionSet: {
										kind: 'SelectionSet',
										selections: [
											{ kind: 'Field', name: { kind: 'Name', value: 'firstname' } },
											{ kind: 'Field', name: { kind: 'Name', value: 'lastname' } },
											{ kind: 'Field', name: { kind: 'Name', value: 'mobileNumber' } },
											{ kind: 'Field', name: { kind: 'Name', value: 'email' } },
											{ kind: 'Field', name: { kind: 'Name', value: 'position' } }
										]
									}
								}
							]
						}
					}
				]
			}
		}
	]
} as unknown as DocumentNode<GetAccountQuery, GetAccountQueryVariables>;
export const GetLastVisitedOrUpdatedDocument = {
	kind: 'Document',
	definitions: [
		{
			kind: 'OperationDefinition',
			operation: 'query',
			name: { kind: 'Name', value: 'GetLastVisitedOrUpdated' },
			variableDefinitions: [
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'professionalId' } },
					type: {
						kind: 'NonNullType',
						type: { kind: 'NamedType', name: { kind: 'Name', value: 'uuid' } }
					}
				}
			],
			selectionSet: {
				kind: 'SelectionSet',
				selections: [
					{
						kind: 'Field',
						alias: { kind: 'Name', value: 'lastVisited' },
						name: { kind: 'Name', value: 'notebook_member' },
						arguments: [
							{
								kind: 'Argument',
								name: { kind: 'Name', value: 'order_by' },
								value: {
									kind: 'ObjectValue',
									fields: [
										{
											kind: 'ObjectField',
											name: { kind: 'Name', value: 'notebookVisitDate' },
											value: { kind: 'EnumValue', value: 'desc_nulls_last' }
										}
									]
								}
							},
							{
								kind: 'Argument',
								name: { kind: 'Name', value: 'limit' },
								value: { kind: 'IntValue', value: '3' }
							},
							{
								kind: 'Argument',
								name: { kind: 'Name', value: 'where' },
								value: {
									kind: 'ObjectValue',
									fields: [
										{
											kind: 'ObjectField',
											name: { kind: 'Name', value: 'professionalId' },
											value: {
												kind: 'ObjectValue',
												fields: [
													{
														kind: 'ObjectField',
														name: { kind: 'Name', value: '_eq' },
														value: {
															kind: 'Variable',
															name: { kind: 'Name', value: 'professionalId' }
														}
													}
												]
											}
										}
									]
								}
							}
						],
						selectionSet: {
							kind: 'SelectionSet',
							selections: [
								{
									kind: 'Field',
									name: { kind: 'Name', value: 'notebook' },
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
														{ kind: 'Field', name: { kind: 'Name', value: 'mobileNumber' } },
														{ kind: 'Field', name: { kind: 'Name', value: 'dateOfBirth' } }
													]
												}
											}
										]
									}
								}
							]
						}
					},
					{
						kind: 'Field',
						alias: { kind: 'Name', value: 'lastUpdated' },
						name: { kind: 'Name', value: 'notebook_member' },
						arguments: [
							{
								kind: 'Argument',
								name: { kind: 'Name', value: 'order_by' },
								value: {
									kind: 'ObjectValue',
									fields: [
										{
											kind: 'ObjectField',
											name: { kind: 'Name', value: 'notebookModificationDate' },
											value: { kind: 'EnumValue', value: 'desc_nulls_last' }
										}
									]
								}
							},
							{
								kind: 'Argument',
								name: { kind: 'Name', value: 'limit' },
								value: { kind: 'IntValue', value: '3' }
							},
							{
								kind: 'Argument',
								name: { kind: 'Name', value: 'where' },
								value: {
									kind: 'ObjectValue',
									fields: [
										{
											kind: 'ObjectField',
											name: { kind: 'Name', value: 'professionalId' },
											value: {
												kind: 'ObjectValue',
												fields: [
													{
														kind: 'ObjectField',
														name: { kind: 'Name', value: '_neq' },
														value: {
															kind: 'Variable',
															name: { kind: 'Name', value: 'professionalId' }
														}
													}
												]
											}
										}
									]
								}
							}
						],
						selectionSet: {
							kind: 'SelectionSet',
							selections: [
								{
									kind: 'Field',
									name: { kind: 'Name', value: 'notebook' },
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
														{ kind: 'Field', name: { kind: 'Name', value: 'mobileNumber' } },
														{ kind: 'Field', name: { kind: 'Name', value: 'dateOfBirth' } }
													]
												}
											}
										]
									}
								}
							]
						}
					}
				]
			}
		}
	]
} as unknown as DocumentNode<GetLastVisitedOrUpdatedQuery, GetLastVisitedOrUpdatedQueryVariables>;
export const SearchBeneficiariesDocument = {
	kind: 'Document',
	definitions: [
		{
			kind: 'OperationDefinition',
			operation: 'query',
			name: { kind: 'Name', value: 'SearchBeneficiaries' },
			variableDefinitions: [
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'filter' } },
					type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } }
				}
			],
			selectionSet: {
				kind: 'SelectionSet',
				selections: [
					{
						kind: 'Field',
						name: { kind: 'Name', value: 'beneficiary' },
						arguments: [
							{
								kind: 'Argument',
								name: { kind: 'Name', value: 'where' },
								value: {
									kind: 'ObjectValue',
									fields: [
										{
											kind: 'ObjectField',
											name: { kind: 'Name', value: '_or' },
											value: {
												kind: 'ListValue',
												values: [
													{
														kind: 'ObjectValue',
														fields: [
															{
																kind: 'ObjectField',
																name: { kind: 'Name', value: 'peNumber' },
																value: {
																	kind: 'ObjectValue',
																	fields: [
																		{
																			kind: 'ObjectField',
																			name: { kind: 'Name', value: '_ilike' },
																			value: {
																				kind: 'Variable',
																				name: { kind: 'Name', value: 'filter' }
																			}
																		}
																	]
																}
															}
														]
													},
													{
														kind: 'ObjectValue',
														fields: [
															{
																kind: 'ObjectField',
																name: { kind: 'Name', value: 'cafNumber' },
																value: {
																	kind: 'ObjectValue',
																	fields: [
																		{
																			kind: 'ObjectField',
																			name: { kind: 'Name', value: '_ilike' },
																			value: {
																				kind: 'Variable',
																				name: { kind: 'Name', value: 'filter' }
																			}
																		}
																	]
																}
															}
														]
													},
													{
														kind: 'ObjectValue',
														fields: [
															{
																kind: 'ObjectField',
																name: { kind: 'Name', value: 'lastname' },
																value: {
																	kind: 'ObjectValue',
																	fields: [
																		{
																			kind: 'ObjectField',
																			name: { kind: 'Name', value: '_ilike' },
																			value: {
																				kind: 'Variable',
																				name: { kind: 'Name', value: 'filter' }
																			}
																		}
																	]
																}
															}
														]
													},
													{
														kind: 'ObjectValue',
														fields: [
															{
																kind: 'ObjectField',
																name: { kind: 'Name', value: 'mobileNumber' },
																value: {
																	kind: 'ObjectValue',
																	fields: [
																		{
																			kind: 'ObjectField',
																			name: { kind: 'Name', value: '_ilike' },
																			value: {
																				kind: 'Variable',
																				name: { kind: 'Name', value: 'filter' }
																			}
																		}
																	]
																}
															}
														]
													}
												]
											}
										}
									]
								}
							}
						],
						selectionSet: {
							kind: 'SelectionSet',
							selections: [
								{ kind: 'Field', name: { kind: 'Name', value: 'dateOfBirth' } },
								{ kind: 'Field', name: { kind: 'Name', value: 'firstname' } },
								{ kind: 'Field', name: { kind: 'Name', value: 'id' } },
								{ kind: 'Field', name: { kind: 'Name', value: 'lastname' } },
								{ kind: 'Field', name: { kind: 'Name', value: 'mobileNumber' } }
							]
						}
					}
				]
			}
		}
	]
} as unknown as DocumentNode<SearchBeneficiariesQuery, SearchBeneficiariesQueryVariables>;
export const UpdateNotebookVisitDateDocument = {
	kind: 'Document',
	definitions: [
		{
			kind: 'OperationDefinition',
			operation: 'mutation',
			name: { kind: 'Name', value: 'updateNotebookVisitDate' },
			variableDefinitions: [
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'beneficiaryId' } },
					type: {
						kind: 'NonNullType',
						type: { kind: 'NamedType', name: { kind: 'Name', value: 'uuid' } }
					}
				},
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'notebookVisitDate' } },
					type: {
						kind: 'NonNullType',
						type: { kind: 'NamedType', name: { kind: 'Name', value: 'timestamptz' } }
					}
				}
			],
			selectionSet: {
				kind: 'SelectionSet',
				selections: [
					{
						kind: 'Field',
						name: { kind: 'Name', value: 'update_notebook_member' },
						arguments: [
							{
								kind: 'Argument',
								name: { kind: 'Name', value: 'where' },
								value: {
									kind: 'ObjectValue',
									fields: [
										{
											kind: 'ObjectField',
											name: { kind: 'Name', value: 'notebook' },
											value: {
												kind: 'ObjectValue',
												fields: [
													{
														kind: 'ObjectField',
														name: { kind: 'Name', value: 'beneficiary' },
														value: {
															kind: 'ObjectValue',
															fields: [
																{
																	kind: 'ObjectField',
																	name: { kind: 'Name', value: 'id' },
																	value: {
																		kind: 'ObjectValue',
																		fields: [
																			{
																				kind: 'ObjectField',
																				name: { kind: 'Name', value: '_eq' },
																				value: {
																					kind: 'Variable',
																					name: { kind: 'Name', value: 'beneficiaryId' }
																				}
																			}
																		]
																	}
																}
															]
														}
													}
												]
											}
										}
									]
								}
							},
							{
								kind: 'Argument',
								name: { kind: 'Name', value: '_set' },
								value: {
									kind: 'ObjectValue',
									fields: [
										{
											kind: 'ObjectField',
											name: { kind: 'Name', value: 'notebookVisitDate' },
											value: {
												kind: 'Variable',
												name: { kind: 'Name', value: 'notebookVisitDate' }
											}
										}
									]
								}
							}
						],
						selectionSet: {
							kind: 'SelectionSet',
							selections: [
								{
									kind: 'Field',
									name: { kind: 'Name', value: 'returning' },
									selectionSet: {
										kind: 'SelectionSet',
										selections: [
											{
												kind: 'Field',
												name: { kind: 'Name', value: 'notebook' },
												selectionSet: {
													kind: 'SelectionSet',
													selections: [
														{
															kind: 'Field',
															name: { kind: 'Name', value: 'beneficiary' },
															selectionSet: {
																kind: 'SelectionSet',
																selections: [
																	{ kind: 'Field', name: { kind: 'Name', value: 'address1' } },
																	{ kind: 'Field', name: { kind: 'Name', value: 'address2' } },
																	{ kind: 'Field', name: { kind: 'Name', value: 'cafNumber' } },
																	{ kind: 'Field', name: { kind: 'Name', value: 'city' } },
																	{ kind: 'Field', name: { kind: 'Name', value: 'dateOfBirth' } },
																	{ kind: 'Field', name: { kind: 'Name', value: 'email' } },
																	{ kind: 'Field', name: { kind: 'Name', value: 'firstname' } },
																	{ kind: 'Field', name: { kind: 'Name', value: 'id' } },
																	{ kind: 'Field', name: { kind: 'Name', value: 'lastname' } },
																	{ kind: 'Field', name: { kind: 'Name', value: 'mobileNumber' } },
																	{ kind: 'Field', name: { kind: 'Name', value: 'peNumber' } },
																	{ kind: 'Field', name: { kind: 'Name', value: 'postalCode' } }
																]
															}
														}
													]
												}
											}
										]
									}
								}
							]
						}
					}
				]
			}
		}
	]
} as unknown as DocumentNode<
	UpdateNotebookVisitDateMutation,
	UpdateNotebookVisitDateMutationVariables
>;
