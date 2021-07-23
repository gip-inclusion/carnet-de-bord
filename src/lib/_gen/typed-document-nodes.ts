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
	accessKey?: Maybe<Scalars['String']>;
	accessKeyDate?: Maybe<Scalars['timestamptz']>;
	/** An object relationship */
	admin?: Maybe<Admin>;
	adminId?: Maybe<Scalars['uuid']>;
	/** An object relationship */
	beneficiary?: Maybe<Beneficiary>;
	beneficiaryId?: Maybe<Scalars['uuid']>;
	id: Scalars['uuid'];
	lastLogin?: Maybe<Scalars['timestamptz']>;
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
	id?: Maybe<Uuid_Comparison_Exp>;
	lastLogin?: Maybe<Timestamptz_Comparison_Exp>;
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
	id?: Maybe<Scalars['uuid']>;
	lastLogin?: Maybe<Scalars['timestamptz']>;
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
	id?: Maybe<Order_By>;
	lastLogin?: Maybe<Order_By>;
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
	Id = 'id',
	/** column name */
	LastLogin = 'lastLogin',
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
	id?: Maybe<Scalars['uuid']>;
	lastLogin?: Maybe<Scalars['timestamptz']>;
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
	Id = 'id',
	/** column name */
	LastLogin = 'lastLogin',
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
	peNumber?: Maybe<Scalars['String']>;
	postalCode?: Maybe<Scalars['String']>;
	/** An array relationship */
	teamMembers: Array<Team_Member>;
	/** An aggregate relationship */
	teamMembers_aggregate: Team_Member_Aggregate;
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

/** columns and relationships of "beneficiary" */
export type BeneficiaryTeamMembersArgs = {
	distinct_on?: Maybe<Array<Team_Member_Select_Column>>;
	limit?: Maybe<Scalars['Int']>;
	offset?: Maybe<Scalars['Int']>;
	order_by?: Maybe<Array<Team_Member_Order_By>>;
	where?: Maybe<Team_Member_Bool_Exp>;
};

/** columns and relationships of "beneficiary" */
export type BeneficiaryTeamMembers_AggregateArgs = {
	distinct_on?: Maybe<Array<Team_Member_Select_Column>>;
	limit?: Maybe<Scalars['Int']>;
	offset?: Maybe<Scalars['Int']>;
	order_by?: Maybe<Array<Team_Member_Order_By>>;
	where?: Maybe<Team_Member_Bool_Exp>;
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
	peNumber?: Maybe<String_Comparison_Exp>;
	postalCode?: Maybe<String_Comparison_Exp>;
	teamMembers?: Maybe<Team_Member_Bool_Exp>;
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
	peNumber?: Maybe<Scalars['String']>;
	postalCode?: Maybe<Scalars['String']>;
	teamMembers?: Maybe<Team_Member_Arr_Rel_Insert_Input>;
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
	peNumber?: Maybe<Order_By>;
	postalCode?: Maybe<Order_By>;
	teamMembers_aggregate?: Maybe<Team_Member_Aggregate_Order_By>;
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
	/** delete data from the table: "team_member" */
	delete_team_member?: Maybe<Team_Member_Mutation_Response>;
	/** delete single row from the table: "team_member" */
	delete_team_member_by_pk?: Maybe<Team_Member>;
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
	/** insert data into the table: "team_member" */
	insert_team_member?: Maybe<Team_Member_Mutation_Response>;
	/** insert a single row into the table: "team_member" */
	insert_team_member_one?: Maybe<Team_Member>;
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
	/** update data of the table: "team_member" */
	update_team_member?: Maybe<Team_Member_Mutation_Response>;
	/** update single row of the table: "team_member" */
	update_team_member_by_pk?: Maybe<Team_Member>;
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
export type Mutation_RootDelete_Team_MemberArgs = {
	where: Team_Member_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Team_Member_By_PkArgs = {
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
export type Mutation_RootInsert_Team_MemberArgs = {
	objects: Array<Team_Member_Insert_Input>;
	on_conflict?: Maybe<Team_Member_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Team_Member_OneArgs = {
	object: Team_Member_Insert_Input;
	on_conflict?: Maybe<Team_Member_On_Conflict>;
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

/** mutation root */
export type Mutation_RootUpdate_Team_MemberArgs = {
	_set?: Maybe<Team_Member_Set_Input>;
	where: Team_Member_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Team_Member_By_PkArgs = {
	_set?: Maybe<Team_Member_Set_Input>;
	pk_columns: Team_Member_Pk_Columns_Input;
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
	structureId: Scalars['uuid'];
	/** An array relationship */
	teamMembers: Array<Team_Member>;
	/** An aggregate relationship */
	teamMembers_aggregate: Team_Member_Aggregate;
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

/** columns and relationships of "professional" */
export type ProfessionalTeamMembersArgs = {
	distinct_on?: Maybe<Array<Team_Member_Select_Column>>;
	limit?: Maybe<Scalars['Int']>;
	offset?: Maybe<Scalars['Int']>;
	order_by?: Maybe<Array<Team_Member_Order_By>>;
	where?: Maybe<Team_Member_Bool_Exp>;
};

/** columns and relationships of "professional" */
export type ProfessionalTeamMembers_AggregateArgs = {
	distinct_on?: Maybe<Array<Team_Member_Select_Column>>;
	limit?: Maybe<Scalars['Int']>;
	offset?: Maybe<Scalars['Int']>;
	order_by?: Maybe<Array<Team_Member_Order_By>>;
	where?: Maybe<Team_Member_Bool_Exp>;
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
	structureId?: Maybe<Uuid_Comparison_Exp>;
	teamMembers?: Maybe<Team_Member_Bool_Exp>;
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
	structureId?: Maybe<Scalars['uuid']>;
	teamMembers?: Maybe<Team_Member_Arr_Rel_Insert_Input>;
};

/** aggregate max on columns */
export type Professional_Max_Fields = {
	__typename?: 'professional_max_fields';
	email?: Maybe<Scalars['String']>;
	firstname?: Maybe<Scalars['String']>;
	id?: Maybe<Scalars['uuid']>;
	lastname?: Maybe<Scalars['String']>;
	structureId?: Maybe<Scalars['uuid']>;
};

/** order by max() on columns of table "professional" */
export type Professional_Max_Order_By = {
	email?: Maybe<Order_By>;
	firstname?: Maybe<Order_By>;
	id?: Maybe<Order_By>;
	lastname?: Maybe<Order_By>;
	structureId?: Maybe<Order_By>;
};

/** aggregate min on columns */
export type Professional_Min_Fields = {
	__typename?: 'professional_min_fields';
	email?: Maybe<Scalars['String']>;
	firstname?: Maybe<Scalars['String']>;
	id?: Maybe<Scalars['uuid']>;
	lastname?: Maybe<Scalars['String']>;
	structureId?: Maybe<Scalars['uuid']>;
};

/** order by min() on columns of table "professional" */
export type Professional_Min_Order_By = {
	email?: Maybe<Order_By>;
	firstname?: Maybe<Order_By>;
	id?: Maybe<Order_By>;
	lastname?: Maybe<Order_By>;
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
	structure?: Maybe<Structure_Order_By>;
	structureId?: Maybe<Order_By>;
	teamMembers_aggregate?: Maybe<Team_Member_Aggregate_Order_By>;
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
	StructureId = 'structureId'
}

/** input type for updating data in table "professional" */
export type Professional_Set_Input = {
	email?: Maybe<Scalars['String']>;
	firstname?: Maybe<Scalars['String']>;
	id?: Maybe<Scalars['uuid']>;
	lastname?: Maybe<Scalars['String']>;
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
	/** fetch data from the table: "team_member" */
	team_member: Array<Team_Member>;
	/** fetch aggregated fields from the table: "team_member" */
	team_member_aggregate: Team_Member_Aggregate;
	/** fetch data from the table: "team_member" using primary key columns */
	team_member_by_pk?: Maybe<Team_Member>;
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

export type Query_RootTeam_MemberArgs = {
	distinct_on?: Maybe<Array<Team_Member_Select_Column>>;
	limit?: Maybe<Scalars['Int']>;
	offset?: Maybe<Scalars['Int']>;
	order_by?: Maybe<Array<Team_Member_Order_By>>;
	where?: Maybe<Team_Member_Bool_Exp>;
};

export type Query_RootTeam_Member_AggregateArgs = {
	distinct_on?: Maybe<Array<Team_Member_Select_Column>>;
	limit?: Maybe<Scalars['Int']>;
	offset?: Maybe<Scalars['Int']>;
	order_by?: Maybe<Array<Team_Member_Order_By>>;
	where?: Maybe<Team_Member_Bool_Exp>;
};

export type Query_RootTeam_Member_By_PkArgs = {
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
	/** fetch data from the table: "team_member" */
	team_member: Array<Team_Member>;
	/** fetch aggregated fields from the table: "team_member" */
	team_member_aggregate: Team_Member_Aggregate;
	/** fetch data from the table: "team_member" using primary key columns */
	team_member_by_pk?: Maybe<Team_Member>;
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

export type Subscription_RootTeam_MemberArgs = {
	distinct_on?: Maybe<Array<Team_Member_Select_Column>>;
	limit?: Maybe<Scalars['Int']>;
	offset?: Maybe<Scalars['Int']>;
	order_by?: Maybe<Array<Team_Member_Order_By>>;
	where?: Maybe<Team_Member_Bool_Exp>;
};

export type Subscription_RootTeam_Member_AggregateArgs = {
	distinct_on?: Maybe<Array<Team_Member_Select_Column>>;
	limit?: Maybe<Scalars['Int']>;
	offset?: Maybe<Scalars['Int']>;
	order_by?: Maybe<Array<Team_Member_Order_By>>;
	where?: Maybe<Team_Member_Bool_Exp>;
};

export type Subscription_RootTeam_Member_By_PkArgs = {
	id: Scalars['uuid'];
};

/** columns and relationships of "team_member" */
export type Team_Member = {
	__typename?: 'team_member';
	/** An object relationship */
	beneficiary: Beneficiary;
	beneficiaryId: Scalars['uuid'];
	id: Scalars['uuid'];
	lastSeenDate?: Maybe<Scalars['timestamptz']>;
	memberType: Scalars['String'];
	modificationDate?: Maybe<Scalars['timestamptz']>;
	/** An object relationship */
	professional: Professional;
	professionalId: Scalars['uuid'];
};

/** aggregated selection of "team_member" */
export type Team_Member_Aggregate = {
	__typename?: 'team_member_aggregate';
	aggregate?: Maybe<Team_Member_Aggregate_Fields>;
	nodes: Array<Team_Member>;
};

/** aggregate fields of "team_member" */
export type Team_Member_Aggregate_Fields = {
	__typename?: 'team_member_aggregate_fields';
	count: Scalars['Int'];
	max?: Maybe<Team_Member_Max_Fields>;
	min?: Maybe<Team_Member_Min_Fields>;
};

/** aggregate fields of "team_member" */
export type Team_Member_Aggregate_FieldsCountArgs = {
	columns?: Maybe<Array<Team_Member_Select_Column>>;
	distinct?: Maybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "team_member" */
export type Team_Member_Aggregate_Order_By = {
	count?: Maybe<Order_By>;
	max?: Maybe<Team_Member_Max_Order_By>;
	min?: Maybe<Team_Member_Min_Order_By>;
};

/** input type for inserting array relation for remote table "team_member" */
export type Team_Member_Arr_Rel_Insert_Input = {
	data: Array<Team_Member_Insert_Input>;
	/** on conflict condition */
	on_conflict?: Maybe<Team_Member_On_Conflict>;
};

/** Boolean expression to filter rows from the table "team_member". All fields are combined with a logical 'AND'. */
export type Team_Member_Bool_Exp = {
	_and?: Maybe<Array<Team_Member_Bool_Exp>>;
	_not?: Maybe<Team_Member_Bool_Exp>;
	_or?: Maybe<Array<Team_Member_Bool_Exp>>;
	beneficiary?: Maybe<Beneficiary_Bool_Exp>;
	beneficiaryId?: Maybe<Uuid_Comparison_Exp>;
	id?: Maybe<Uuid_Comparison_Exp>;
	lastSeenDate?: Maybe<Timestamptz_Comparison_Exp>;
	memberType?: Maybe<String_Comparison_Exp>;
	modificationDate?: Maybe<Timestamptz_Comparison_Exp>;
	professional?: Maybe<Professional_Bool_Exp>;
	professionalId?: Maybe<Uuid_Comparison_Exp>;
};

/** unique or primary key constraints on table "team_member" */
export enum Team_Member_Constraint {
	/** unique or primary key constraint */
	TeamMemberPkey = 'team_member_pkey'
}

/** input type for inserting data into table "team_member" */
export type Team_Member_Insert_Input = {
	beneficiary?: Maybe<Beneficiary_Obj_Rel_Insert_Input>;
	beneficiaryId?: Maybe<Scalars['uuid']>;
	id?: Maybe<Scalars['uuid']>;
	lastSeenDate?: Maybe<Scalars['timestamptz']>;
	memberType?: Maybe<Scalars['String']>;
	modificationDate?: Maybe<Scalars['timestamptz']>;
	professional?: Maybe<Professional_Obj_Rel_Insert_Input>;
	professionalId?: Maybe<Scalars['uuid']>;
};

/** aggregate max on columns */
export type Team_Member_Max_Fields = {
	__typename?: 'team_member_max_fields';
	beneficiaryId?: Maybe<Scalars['uuid']>;
	id?: Maybe<Scalars['uuid']>;
	lastSeenDate?: Maybe<Scalars['timestamptz']>;
	memberType?: Maybe<Scalars['String']>;
	modificationDate?: Maybe<Scalars['timestamptz']>;
	professionalId?: Maybe<Scalars['uuid']>;
};

/** order by max() on columns of table "team_member" */
export type Team_Member_Max_Order_By = {
	beneficiaryId?: Maybe<Order_By>;
	id?: Maybe<Order_By>;
	lastSeenDate?: Maybe<Order_By>;
	memberType?: Maybe<Order_By>;
	modificationDate?: Maybe<Order_By>;
	professionalId?: Maybe<Order_By>;
};

/** aggregate min on columns */
export type Team_Member_Min_Fields = {
	__typename?: 'team_member_min_fields';
	beneficiaryId?: Maybe<Scalars['uuid']>;
	id?: Maybe<Scalars['uuid']>;
	lastSeenDate?: Maybe<Scalars['timestamptz']>;
	memberType?: Maybe<Scalars['String']>;
	modificationDate?: Maybe<Scalars['timestamptz']>;
	professionalId?: Maybe<Scalars['uuid']>;
};

/** order by min() on columns of table "team_member" */
export type Team_Member_Min_Order_By = {
	beneficiaryId?: Maybe<Order_By>;
	id?: Maybe<Order_By>;
	lastSeenDate?: Maybe<Order_By>;
	memberType?: Maybe<Order_By>;
	modificationDate?: Maybe<Order_By>;
	professionalId?: Maybe<Order_By>;
};

/** response of any mutation on the table "team_member" */
export type Team_Member_Mutation_Response = {
	__typename?: 'team_member_mutation_response';
	/** number of rows affected by the mutation */
	affected_rows: Scalars['Int'];
	/** data from the rows affected by the mutation */
	returning: Array<Team_Member>;
};

/** on conflict condition type for table "team_member" */
export type Team_Member_On_Conflict = {
	constraint: Team_Member_Constraint;
	update_columns?: Array<Team_Member_Update_Column>;
	where?: Maybe<Team_Member_Bool_Exp>;
};

/** Ordering options when selecting data from "team_member". */
export type Team_Member_Order_By = {
	beneficiary?: Maybe<Beneficiary_Order_By>;
	beneficiaryId?: Maybe<Order_By>;
	id?: Maybe<Order_By>;
	lastSeenDate?: Maybe<Order_By>;
	memberType?: Maybe<Order_By>;
	modificationDate?: Maybe<Order_By>;
	professional?: Maybe<Professional_Order_By>;
	professionalId?: Maybe<Order_By>;
};

/** primary key columns input for table: team_member */
export type Team_Member_Pk_Columns_Input = {
	id: Scalars['uuid'];
};

/** select columns of table "team_member" */
export enum Team_Member_Select_Column {
	/** column name */
	BeneficiaryId = 'beneficiaryId',
	/** column name */
	Id = 'id',
	/** column name */
	LastSeenDate = 'lastSeenDate',
	/** column name */
	MemberType = 'memberType',
	/** column name */
	ModificationDate = 'modificationDate',
	/** column name */
	ProfessionalId = 'professionalId'
}

/** input type for updating data in table "team_member" */
export type Team_Member_Set_Input = {
	beneficiaryId?: Maybe<Scalars['uuid']>;
	id?: Maybe<Scalars['uuid']>;
	lastSeenDate?: Maybe<Scalars['timestamptz']>;
	memberType?: Maybe<Scalars['String']>;
	modificationDate?: Maybe<Scalars['timestamptz']>;
	professionalId?: Maybe<Scalars['uuid']>;
};

/** update columns of table "team_member" */
export enum Team_Member_Update_Column {
	/** column name */
	BeneficiaryId = 'beneficiaryId',
	/** column name */
	Id = 'id',
	/** column name */
	LastSeenDate = 'lastSeenDate',
	/** column name */
	MemberType = 'memberType',
	/** column name */
	ModificationDate = 'modificationDate',
	/** column name */
	ProfessionalId = 'professionalId'
}

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

export type GetTeamMembersQueryVariables = Exact<{ [key: string]: never }>;

export type GetTeamMembersQuery = { __typename?: 'query_root' } & {
	teamMember: Array<
		{ __typename?: 'team_member' } & Pick<
			Team_Member,
			'memberType' | 'lastSeenDate' | 'modificationDate'
		> & {
				beneficiary: { __typename?: 'beneficiary' } & Pick<
					Beneficiary,
					| 'address1'
					| 'address2'
					| 'cafNumber'
					| 'city'
					| 'dateOfBirth'
					| 'email'
					| 'firstname'
					| 'id'
					| 'lastname'
					| 'mobileNumber'
					| 'peNumber'
					| 'postalCode'
				>;
			}
	>;
};

export type GetBeneficiaryByIdQueryVariables = Exact<{
	id: Scalars['uuid'];
}>;

export type GetBeneficiaryByIdQuery = { __typename?: 'query_root' } & {
	beneficiary_by_pk?: Maybe<
		{ __typename?: 'beneficiary' } & Pick<
			Beneficiary,
			| 'address1'
			| 'address2'
			| 'cafNumber'
			| 'city'
			| 'dateOfBirth'
			| 'email'
			| 'firstname'
			| 'id'
			| 'lastname'
			| 'mobileNumber'
			| 'peNumber'
			| 'postalCode'
		>
	>;
};

export const GetTeamMembersDocument = {
	kind: 'Document',
	definitions: [
		{
			kind: 'OperationDefinition',
			operation: 'query',
			name: { kind: 'Name', value: 'GetTeamMembers' },
			selectionSet: {
				kind: 'SelectionSet',
				selections: [
					{
						kind: 'Field',
						alias: { kind: 'Name', value: 'teamMember' },
						name: { kind: 'Name', value: 'team_member' },
						selectionSet: {
							kind: 'SelectionSet',
							selections: [
								{ kind: 'Field', name: { kind: 'Name', value: 'memberType' } },
								{ kind: 'Field', name: { kind: 'Name', value: 'lastSeenDate' } },
								{ kind: 'Field', name: { kind: 'Name', value: 'modificationDate' } },
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
} as unknown as DocumentNode<GetTeamMembersQuery, GetTeamMembersQueryVariables>;
export const GetBeneficiaryByIdDocument = {
	kind: 'Document',
	definitions: [
		{
			kind: 'OperationDefinition',
			operation: 'query',
			name: { kind: 'Name', value: 'GetBeneficiaryById' },
			variableDefinitions: [
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
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
						name: { kind: 'Name', value: 'beneficiary_by_pk' },
						arguments: [
							{
								kind: 'Argument',
								name: { kind: 'Name', value: 'id' },
								value: { kind: 'Variable', name: { kind: 'Name', value: 'id' } }
							}
						],
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
} as unknown as DocumentNode<GetBeneficiaryByIdQuery, GetBeneficiaryByIdQueryVariables>;
