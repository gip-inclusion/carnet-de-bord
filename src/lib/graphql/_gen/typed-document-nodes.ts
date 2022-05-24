import type { OperationStore } from '@urql/svelte';
import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
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
	bigint: any;
	citext: string;
	date: string;
	jsonb: any;
	timestamptz: string;
	uuid: string;
};

export type AdminStructureInput = {
	adminEmail?: InputMaybe<Scalars['citext']>;
	firstname?: InputMaybe<Scalars['String']>;
	lastname?: InputMaybe<Scalars['String']>;
	phoneNumbers?: InputMaybe<Scalars['String']>;
	position?: InputMaybe<Scalars['String']>;
};

/** Boolean expression to compare columns of type "Boolean". All fields are combined with logical 'AND'. */
export type BooleanComparisonExp = {
	_eq?: InputMaybe<Scalars['Boolean']>;
	_gt?: InputMaybe<Scalars['Boolean']>;
	_gte?: InputMaybe<Scalars['Boolean']>;
	_in?: InputMaybe<Array<Scalars['Boolean']>>;
	_is_null?: InputMaybe<Scalars['Boolean']>;
	_lt?: InputMaybe<Scalars['Boolean']>;
	_lte?: InputMaybe<Scalars['Boolean']>;
	_neq?: InputMaybe<Scalars['Boolean']>;
	_nin?: InputMaybe<Array<Scalars['Boolean']>>;
};

export type CreateDeploymentOutput = {
	__typename?: 'CreateDeploymentOutput';
	id: Scalars['uuid'];
	label: Scalars['String'];
};

export type InsertStructureWithAdminInput = {
	adminStructure?: InputMaybe<AdminStructureInput>;
	forceUpdate?: InputMaybe<Scalars['Boolean']>;
	sendAccountEmail?: InputMaybe<Scalars['Boolean']>;
	structure?: InputMaybe<StructureInput>;
};

export type InsertStructureWithAdminOutput = {
	__typename?: 'InsertStructureWithAdminOutput';
	address1?: Maybe<Scalars['String']>;
	address2?: Maybe<Scalars['String']>;
	adminEmails?: Maybe<Array<Maybe<Scalars['String']>>>;
	city?: Maybe<Scalars['String']>;
	email?: Maybe<Scalars['citext']>;
	id: Scalars['uuid'];
	name?: Maybe<Scalars['String']>;
	phone?: Maybe<Scalars['String']>;
	postalCode?: Maybe<Scalars['String']>;
	shortDesc?: Maybe<Scalars['String']>;
	siret?: Maybe<Scalars['String']>;
	website?: Maybe<Scalars['String']>;
};

/** Boolean expression to compare columns of type "String". All fields are combined with logical 'AND'. */
export type StringComparisonExp = {
	_eq?: InputMaybe<Scalars['String']>;
	_gt?: InputMaybe<Scalars['String']>;
	_gte?: InputMaybe<Scalars['String']>;
	/** does the column match the given case-insensitive pattern */
	_ilike?: InputMaybe<Scalars['String']>;
	_in?: InputMaybe<Array<Scalars['String']>>;
	/** does the column match the given POSIX regular expression, case insensitive */
	_iregex?: InputMaybe<Scalars['String']>;
	_is_null?: InputMaybe<Scalars['Boolean']>;
	/** does the column match the given pattern */
	_like?: InputMaybe<Scalars['String']>;
	_lt?: InputMaybe<Scalars['String']>;
	_lte?: InputMaybe<Scalars['String']>;
	_neq?: InputMaybe<Scalars['String']>;
	/** does the column NOT match the given case-insensitive pattern */
	_nilike?: InputMaybe<Scalars['String']>;
	_nin?: InputMaybe<Array<Scalars['String']>>;
	/** does the column NOT match the given POSIX regular expression, case insensitive */
	_niregex?: InputMaybe<Scalars['String']>;
	/** does the column NOT match the given pattern */
	_nlike?: InputMaybe<Scalars['String']>;
	/** does the column NOT match the given POSIX regular expression, case sensitive */
	_nregex?: InputMaybe<Scalars['String']>;
	/** does the column NOT match the given SQL regular expression */
	_nsimilar?: InputMaybe<Scalars['String']>;
	/** does the column match the given POSIX regular expression, case sensitive */
	_regex?: InputMaybe<Scalars['String']>;
	/** does the column match the given SQL regular expression */
	_similar?: InputMaybe<Scalars['String']>;
};

export type StructureInput = {
	address1?: InputMaybe<Scalars['String']>;
	address2?: InputMaybe<Scalars['String']>;
	city?: InputMaybe<Scalars['String']>;
	email?: InputMaybe<Scalars['String']>;
	name?: InputMaybe<Scalars['String']>;
	phone?: InputMaybe<Scalars['String']>;
	postalCode?: InputMaybe<Scalars['String']>;
	shortDesc?: InputMaybe<Scalars['String']>;
	siret?: InputMaybe<Scalars['String']>;
	website?: InputMaybe<Scalars['String']>;
};

export type UpdateNotebookOutput = {
	__typename?: 'UpdateNotebookOutput';
	id: Scalars['uuid'];
};

/** columns and relationships of "account" */
export type Account = {
	__typename?: 'account';
	accessKey?: Maybe<Scalars['String']>;
	accessKeyDate?: Maybe<Scalars['timestamptz']>;
	/** An object relationship */
	admin?: Maybe<AdminCdb>;
	adminId?: Maybe<Scalars['uuid']>;
	adminStructureId?: Maybe<Scalars['uuid']>;
	/** An object relationship */
	admin_structure?: Maybe<AdminStructure>;
	/** An object relationship */
	beneficiary?: Maybe<Beneficiary>;
	beneficiaryId?: Maybe<Scalars['uuid']>;
	confirmed: Scalars['Boolean'];
	createdAt: Scalars['timestamptz'];
	id: Scalars['uuid'];
	lastLogin?: Maybe<Scalars['timestamptz']>;
	/** An object relationship */
	manager?: Maybe<Manager>;
	managerId?: Maybe<Scalars['uuid']>;
	/** An array relationship */
	notebookActionsCreated: Array<NotebookAction>;
	/** An aggregate relationship */
	notebookActionsCreated_aggregate: NotebookActionAggregate;
	/** An array relationship */
	notebookEventsCreated: Array<NotebookEvent>;
	/** An aggregate relationship */
	notebookEventsCreated_aggregate: NotebookEventAggregate;
	/** An array relationship */
	notebookFocusesCreated: Array<NotebookFocus>;
	/** An aggregate relationship */
	notebookFocusesCreated_aggregate: NotebookFocusAggregate;
	/** An array relationship */
	notebookTargetsCreated: Array<NotebookTarget>;
	/** An aggregate relationship */
	notebookTargetsCreated_aggregate: NotebookTargetAggregate;
	/** An array relationship */
	notebooksCreated: Array<NotebookMember>;
	/** An aggregate relationship */
	notebooksCreated_aggregate: NotebookMemberAggregate;
	/** An array relationship */
	notebooksWhereMember: Array<NotebookMember>;
	/** An aggregate relationship */
	notebooksWhereMember_aggregate: NotebookMemberAggregate;
	onboardingDone?: Maybe<Scalars['Boolean']>;
	/** An object relationship */
	professional?: Maybe<Professional>;
	professionalId?: Maybe<Scalars['uuid']>;
	type: Scalars['String'];
	updatedAt: Scalars['timestamptz'];
	username: Scalars['String'];
};

/** columns and relationships of "account" */
export type AccountNotebookActionsCreatedArgs = {
	distinct_on?: InputMaybe<Array<NotebookActionSelectColumn>>;
	limit?: InputMaybe<Scalars['Int']>;
	offset?: InputMaybe<Scalars['Int']>;
	order_by?: InputMaybe<Array<NotebookActionOrderBy>>;
	where?: InputMaybe<NotebookActionBoolExp>;
};

/** columns and relationships of "account" */
export type AccountNotebookActionsCreatedAggregateArgs = {
	distinct_on?: InputMaybe<Array<NotebookActionSelectColumn>>;
	limit?: InputMaybe<Scalars['Int']>;
	offset?: InputMaybe<Scalars['Int']>;
	order_by?: InputMaybe<Array<NotebookActionOrderBy>>;
	where?: InputMaybe<NotebookActionBoolExp>;
};

/** columns and relationships of "account" */
export type AccountNotebookEventsCreatedArgs = {
	distinct_on?: InputMaybe<Array<NotebookEventSelectColumn>>;
	limit?: InputMaybe<Scalars['Int']>;
	offset?: InputMaybe<Scalars['Int']>;
	order_by?: InputMaybe<Array<NotebookEventOrderBy>>;
	where?: InputMaybe<NotebookEventBoolExp>;
};

/** columns and relationships of "account" */
export type AccountNotebookEventsCreatedAggregateArgs = {
	distinct_on?: InputMaybe<Array<NotebookEventSelectColumn>>;
	limit?: InputMaybe<Scalars['Int']>;
	offset?: InputMaybe<Scalars['Int']>;
	order_by?: InputMaybe<Array<NotebookEventOrderBy>>;
	where?: InputMaybe<NotebookEventBoolExp>;
};

/** columns and relationships of "account" */
export type AccountNotebookFocusesCreatedArgs = {
	distinct_on?: InputMaybe<Array<NotebookFocusSelectColumn>>;
	limit?: InputMaybe<Scalars['Int']>;
	offset?: InputMaybe<Scalars['Int']>;
	order_by?: InputMaybe<Array<NotebookFocusOrderBy>>;
	where?: InputMaybe<NotebookFocusBoolExp>;
};

/** columns and relationships of "account" */
export type AccountNotebookFocusesCreatedAggregateArgs = {
	distinct_on?: InputMaybe<Array<NotebookFocusSelectColumn>>;
	limit?: InputMaybe<Scalars['Int']>;
	offset?: InputMaybe<Scalars['Int']>;
	order_by?: InputMaybe<Array<NotebookFocusOrderBy>>;
	where?: InputMaybe<NotebookFocusBoolExp>;
};

/** columns and relationships of "account" */
export type AccountNotebookTargetsCreatedArgs = {
	distinct_on?: InputMaybe<Array<NotebookTargetSelectColumn>>;
	limit?: InputMaybe<Scalars['Int']>;
	offset?: InputMaybe<Scalars['Int']>;
	order_by?: InputMaybe<Array<NotebookTargetOrderBy>>;
	where?: InputMaybe<NotebookTargetBoolExp>;
};

/** columns and relationships of "account" */
export type AccountNotebookTargetsCreatedAggregateArgs = {
	distinct_on?: InputMaybe<Array<NotebookTargetSelectColumn>>;
	limit?: InputMaybe<Scalars['Int']>;
	offset?: InputMaybe<Scalars['Int']>;
	order_by?: InputMaybe<Array<NotebookTargetOrderBy>>;
	where?: InputMaybe<NotebookTargetBoolExp>;
};

/** columns and relationships of "account" */
export type AccountNotebooksCreatedArgs = {
	distinct_on?: InputMaybe<Array<NotebookMemberSelectColumn>>;
	limit?: InputMaybe<Scalars['Int']>;
	offset?: InputMaybe<Scalars['Int']>;
	order_by?: InputMaybe<Array<NotebookMemberOrderBy>>;
	where?: InputMaybe<NotebookMemberBoolExp>;
};

/** columns and relationships of "account" */
export type AccountNotebooksCreatedAggregateArgs = {
	distinct_on?: InputMaybe<Array<NotebookMemberSelectColumn>>;
	limit?: InputMaybe<Scalars['Int']>;
	offset?: InputMaybe<Scalars['Int']>;
	order_by?: InputMaybe<Array<NotebookMemberOrderBy>>;
	where?: InputMaybe<NotebookMemberBoolExp>;
};

/** columns and relationships of "account" */
export type AccountNotebooksWhereMemberArgs = {
	distinct_on?: InputMaybe<Array<NotebookMemberSelectColumn>>;
	limit?: InputMaybe<Scalars['Int']>;
	offset?: InputMaybe<Scalars['Int']>;
	order_by?: InputMaybe<Array<NotebookMemberOrderBy>>;
	where?: InputMaybe<NotebookMemberBoolExp>;
};

/** columns and relationships of "account" */
export type AccountNotebooksWhereMemberAggregateArgs = {
	distinct_on?: InputMaybe<Array<NotebookMemberSelectColumn>>;
	limit?: InputMaybe<Scalars['Int']>;
	offset?: InputMaybe<Scalars['Int']>;
	order_by?: InputMaybe<Array<NotebookMemberOrderBy>>;
	where?: InputMaybe<NotebookMemberBoolExp>;
};

/** aggregated selection of "account" */
export type AccountAggregate = {
	__typename?: 'account_aggregate';
	aggregate?: Maybe<AccountAggregateFields>;
	nodes: Array<Account>;
};

/** aggregate fields of "account" */
export type AccountAggregateFields = {
	__typename?: 'account_aggregate_fields';
	count: Scalars['Int'];
	max?: Maybe<AccountMaxFields>;
	min?: Maybe<AccountMinFields>;
};

/** aggregate fields of "account" */
export type AccountAggregateFieldsCountArgs = {
	columns?: InputMaybe<Array<AccountSelectColumn>>;
	distinct?: InputMaybe<Scalars['Boolean']>;
};

/** Boolean expression to filter rows from the table "account". All fields are combined with a logical 'AND'. */
export type AccountBoolExp = {
	_and?: InputMaybe<Array<AccountBoolExp>>;
	_not?: InputMaybe<AccountBoolExp>;
	_or?: InputMaybe<Array<AccountBoolExp>>;
	accessKey?: InputMaybe<StringComparisonExp>;
	accessKeyDate?: InputMaybe<TimestamptzComparisonExp>;
	admin?: InputMaybe<AdminCdbBoolExp>;
	adminId?: InputMaybe<UuidComparisonExp>;
	adminStructureId?: InputMaybe<UuidComparisonExp>;
	admin_structure?: InputMaybe<AdminStructureBoolExp>;
	beneficiary?: InputMaybe<BeneficiaryBoolExp>;
	beneficiaryId?: InputMaybe<UuidComparisonExp>;
	confirmed?: InputMaybe<BooleanComparisonExp>;
	createdAt?: InputMaybe<TimestamptzComparisonExp>;
	id?: InputMaybe<UuidComparisonExp>;
	lastLogin?: InputMaybe<TimestamptzComparisonExp>;
	manager?: InputMaybe<ManagerBoolExp>;
	managerId?: InputMaybe<UuidComparisonExp>;
	notebookActionsCreated?: InputMaybe<NotebookActionBoolExp>;
	notebookEventsCreated?: InputMaybe<NotebookEventBoolExp>;
	notebookFocusesCreated?: InputMaybe<NotebookFocusBoolExp>;
	notebookTargetsCreated?: InputMaybe<NotebookTargetBoolExp>;
	notebooksCreated?: InputMaybe<NotebookMemberBoolExp>;
	notebooksWhereMember?: InputMaybe<NotebookMemberBoolExp>;
	onboardingDone?: InputMaybe<BooleanComparisonExp>;
	professional?: InputMaybe<ProfessionalBoolExp>;
	professionalId?: InputMaybe<UuidComparisonExp>;
	type?: InputMaybe<StringComparisonExp>;
	updatedAt?: InputMaybe<TimestamptzComparisonExp>;
	username?: InputMaybe<StringComparisonExp>;
};

/** unique or primary key constraints on table "account" */
export enum AccountConstraint {
	/** unique or primary key constraint */
	AccountAdminIdKey = 'account_admin_id_key',
	/** unique or primary key constraint */
	AccountAdminStructureIdKey = 'account_admin_structure_id_key',
	/** unique or primary key constraint */
	AccountBeneficiaryIdKey = 'account_beneficiary_id_key',
	/** unique or primary key constraint */
	AccountManagerIdKey = 'account_manager_id_key',
	/** unique or primary key constraint */
	AccountPkey = 'account_pkey',
	/** unique or primary key constraint */
	AccountProfessionalIdKey = 'account_professional_id_key',
	/** unique or primary key constraint */
	AccountUsernameUnique = 'account_username_unique',
}

/** input type for inserting data into table "account" */
export type AccountInsertInput = {
	accessKey?: InputMaybe<Scalars['String']>;
	accessKeyDate?: InputMaybe<Scalars['timestamptz']>;
	admin?: InputMaybe<AdminCdbObjRelInsertInput>;
	adminId?: InputMaybe<Scalars['uuid']>;
	adminStructureId?: InputMaybe<Scalars['uuid']>;
	admin_structure?: InputMaybe<AdminStructureObjRelInsertInput>;
	beneficiary?: InputMaybe<BeneficiaryObjRelInsertInput>;
	beneficiaryId?: InputMaybe<Scalars['uuid']>;
	confirmed?: InputMaybe<Scalars['Boolean']>;
	createdAt?: InputMaybe<Scalars['timestamptz']>;
	id?: InputMaybe<Scalars['uuid']>;
	lastLogin?: InputMaybe<Scalars['timestamptz']>;
	manager?: InputMaybe<ManagerObjRelInsertInput>;
	managerId?: InputMaybe<Scalars['uuid']>;
	notebookActionsCreated?: InputMaybe<NotebookActionArrRelInsertInput>;
	notebookEventsCreated?: InputMaybe<NotebookEventArrRelInsertInput>;
	notebookFocusesCreated?: InputMaybe<NotebookFocusArrRelInsertInput>;
	notebookTargetsCreated?: InputMaybe<NotebookTargetArrRelInsertInput>;
	notebooksCreated?: InputMaybe<NotebookMemberArrRelInsertInput>;
	notebooksWhereMember?: InputMaybe<NotebookMemberArrRelInsertInput>;
	onboardingDone?: InputMaybe<Scalars['Boolean']>;
	professional?: InputMaybe<ProfessionalObjRelInsertInput>;
	professionalId?: InputMaybe<Scalars['uuid']>;
	type?: InputMaybe<Scalars['String']>;
	updatedAt?: InputMaybe<Scalars['timestamptz']>;
	username?: InputMaybe<Scalars['String']>;
};

/** aggregate max on columns */
export type AccountMaxFields = {
	__typename?: 'account_max_fields';
	accessKey?: Maybe<Scalars['String']>;
	accessKeyDate?: Maybe<Scalars['timestamptz']>;
	adminId?: Maybe<Scalars['uuid']>;
	adminStructureId?: Maybe<Scalars['uuid']>;
	beneficiaryId?: Maybe<Scalars['uuid']>;
	createdAt?: Maybe<Scalars['timestamptz']>;
	id?: Maybe<Scalars['uuid']>;
	lastLogin?: Maybe<Scalars['timestamptz']>;
	managerId?: Maybe<Scalars['uuid']>;
	professionalId?: Maybe<Scalars['uuid']>;
	type?: Maybe<Scalars['String']>;
	updatedAt?: Maybe<Scalars['timestamptz']>;
	username?: Maybe<Scalars['String']>;
};

/** aggregate min on columns */
export type AccountMinFields = {
	__typename?: 'account_min_fields';
	accessKey?: Maybe<Scalars['String']>;
	accessKeyDate?: Maybe<Scalars['timestamptz']>;
	adminId?: Maybe<Scalars['uuid']>;
	adminStructureId?: Maybe<Scalars['uuid']>;
	beneficiaryId?: Maybe<Scalars['uuid']>;
	createdAt?: Maybe<Scalars['timestamptz']>;
	id?: Maybe<Scalars['uuid']>;
	lastLogin?: Maybe<Scalars['timestamptz']>;
	managerId?: Maybe<Scalars['uuid']>;
	professionalId?: Maybe<Scalars['uuid']>;
	type?: Maybe<Scalars['String']>;
	updatedAt?: Maybe<Scalars['timestamptz']>;
	username?: Maybe<Scalars['String']>;
};

/** response of any mutation on the table "account" */
export type AccountMutationResponse = {
	__typename?: 'account_mutation_response';
	/** number of rows affected by the mutation */
	affected_rows: Scalars['Int'];
	/** data from the rows affected by the mutation */
	returning: Array<Account>;
};

/** input type for inserting object relation for remote table "account" */
export type AccountObjRelInsertInput = {
	data: AccountInsertInput;
	/** on conflict condition */
	on_conflict?: InputMaybe<AccountOnConflict>;
};

/** on conflict condition type for table "account" */
export type AccountOnConflict = {
	constraint: AccountConstraint;
	update_columns?: Array<AccountUpdateColumn>;
	where?: InputMaybe<AccountBoolExp>;
};

/** Ordering options when selecting data from "account". */
export type AccountOrderBy = {
	accessKey?: InputMaybe<OrderBy>;
	accessKeyDate?: InputMaybe<OrderBy>;
	admin?: InputMaybe<AdminCdbOrderBy>;
	adminId?: InputMaybe<OrderBy>;
	adminStructureId?: InputMaybe<OrderBy>;
	admin_structure?: InputMaybe<AdminStructureOrderBy>;
	beneficiary?: InputMaybe<BeneficiaryOrderBy>;
	beneficiaryId?: InputMaybe<OrderBy>;
	confirmed?: InputMaybe<OrderBy>;
	createdAt?: InputMaybe<OrderBy>;
	id?: InputMaybe<OrderBy>;
	lastLogin?: InputMaybe<OrderBy>;
	manager?: InputMaybe<ManagerOrderBy>;
	managerId?: InputMaybe<OrderBy>;
	notebookActionsCreated_aggregate?: InputMaybe<NotebookActionAggregateOrderBy>;
	notebookEventsCreated_aggregate?: InputMaybe<NotebookEventAggregateOrderBy>;
	notebookFocusesCreated_aggregate?: InputMaybe<NotebookFocusAggregateOrderBy>;
	notebookTargetsCreated_aggregate?: InputMaybe<NotebookTargetAggregateOrderBy>;
	notebooksCreated_aggregate?: InputMaybe<NotebookMemberAggregateOrderBy>;
	notebooksWhereMember_aggregate?: InputMaybe<NotebookMemberAggregateOrderBy>;
	onboardingDone?: InputMaybe<OrderBy>;
	professional?: InputMaybe<ProfessionalOrderBy>;
	professionalId?: InputMaybe<OrderBy>;
	type?: InputMaybe<OrderBy>;
	updatedAt?: InputMaybe<OrderBy>;
	username?: InputMaybe<OrderBy>;
};

/** primary key columns input for table: account */
export type AccountPkColumnsInput = {
	id: Scalars['uuid'];
};

/** select columns of table "account" */
export enum AccountSelectColumn {
	/** column name */
	AccessKey = 'accessKey',
	/** column name */
	AccessKeyDate = 'accessKeyDate',
	/** column name */
	AdminId = 'adminId',
	/** column name */
	AdminStructureId = 'adminStructureId',
	/** column name */
	BeneficiaryId = 'beneficiaryId',
	/** column name */
	Confirmed = 'confirmed',
	/** column name */
	CreatedAt = 'createdAt',
	/** column name */
	Id = 'id',
	/** column name */
	LastLogin = 'lastLogin',
	/** column name */
	ManagerId = 'managerId',
	/** column name */
	OnboardingDone = 'onboardingDone',
	/** column name */
	ProfessionalId = 'professionalId',
	/** column name */
	Type = 'type',
	/** column name */
	UpdatedAt = 'updatedAt',
	/** column name */
	Username = 'username',
}

/** input type for updating data in table "account" */
export type AccountSetInput = {
	accessKey?: InputMaybe<Scalars['String']>;
	accessKeyDate?: InputMaybe<Scalars['timestamptz']>;
	adminId?: InputMaybe<Scalars['uuid']>;
	adminStructureId?: InputMaybe<Scalars['uuid']>;
	beneficiaryId?: InputMaybe<Scalars['uuid']>;
	confirmed?: InputMaybe<Scalars['Boolean']>;
	createdAt?: InputMaybe<Scalars['timestamptz']>;
	id?: InputMaybe<Scalars['uuid']>;
	lastLogin?: InputMaybe<Scalars['timestamptz']>;
	managerId?: InputMaybe<Scalars['uuid']>;
	onboardingDone?: InputMaybe<Scalars['Boolean']>;
	professionalId?: InputMaybe<Scalars['uuid']>;
	type?: InputMaybe<Scalars['String']>;
	updatedAt?: InputMaybe<Scalars['timestamptz']>;
	username?: InputMaybe<Scalars['String']>;
};

/** update columns of table "account" */
export enum AccountUpdateColumn {
	/** column name */
	AccessKey = 'accessKey',
	/** column name */
	AccessKeyDate = 'accessKeyDate',
	/** column name */
	AdminId = 'adminId',
	/** column name */
	AdminStructureId = 'adminStructureId',
	/** column name */
	BeneficiaryId = 'beneficiaryId',
	/** column name */
	Confirmed = 'confirmed',
	/** column name */
	CreatedAt = 'createdAt',
	/** column name */
	Id = 'id',
	/** column name */
	LastLogin = 'lastLogin',
	/** column name */
	ManagerId = 'managerId',
	/** column name */
	OnboardingDone = 'onboardingDone',
	/** column name */
	ProfessionalId = 'professionalId',
	/** column name */
	Type = 'type',
	/** column name */
	UpdatedAt = 'updatedAt',
	/** column name */
	Username = 'username',
}

/** columns and relationships of "admin_cdb" */
export type AdminCdb = {
	__typename?: 'admin_cdb';
	/** An object relationship */
	account?: Maybe<Account>;
	createdAt: Scalars['timestamptz'];
	email: Scalars['citext'];
	firstname: Scalars['String'];
	id: Scalars['uuid'];
	lastname: Scalars['String'];
	updatedAt: Scalars['timestamptz'];
};

/** aggregated selection of "admin_cdb" */
export type AdminCdbAggregate = {
	__typename?: 'admin_cdb_aggregate';
	aggregate?: Maybe<AdminCdbAggregateFields>;
	nodes: Array<AdminCdb>;
};

/** aggregate fields of "admin_cdb" */
export type AdminCdbAggregateFields = {
	__typename?: 'admin_cdb_aggregate_fields';
	count: Scalars['Int'];
	max?: Maybe<AdminCdbMaxFields>;
	min?: Maybe<AdminCdbMinFields>;
};

/** aggregate fields of "admin_cdb" */
export type AdminCdbAggregateFieldsCountArgs = {
	columns?: InputMaybe<Array<AdminCdbSelectColumn>>;
	distinct?: InputMaybe<Scalars['Boolean']>;
};

/** Boolean expression to filter rows from the table "admin_cdb". All fields are combined with a logical 'AND'. */
export type AdminCdbBoolExp = {
	_and?: InputMaybe<Array<AdminCdbBoolExp>>;
	_not?: InputMaybe<AdminCdbBoolExp>;
	_or?: InputMaybe<Array<AdminCdbBoolExp>>;
	account?: InputMaybe<AccountBoolExp>;
	createdAt?: InputMaybe<TimestamptzComparisonExp>;
	email?: InputMaybe<CitextComparisonExp>;
	firstname?: InputMaybe<StringComparisonExp>;
	id?: InputMaybe<UuidComparisonExp>;
	lastname?: InputMaybe<StringComparisonExp>;
	updatedAt?: InputMaybe<TimestamptzComparisonExp>;
};

/** unique or primary key constraints on table "admin_cdb" */
export enum AdminCdbConstraint {
	/** unique or primary key constraint */
	AdminEmailUnique = 'admin_email_unique',
	/** unique or primary key constraint */
	AdminPkey = 'admin_pkey',
}

/** input type for inserting data into table "admin_cdb" */
export type AdminCdbInsertInput = {
	account?: InputMaybe<AccountObjRelInsertInput>;
	createdAt?: InputMaybe<Scalars['timestamptz']>;
	email?: InputMaybe<Scalars['citext']>;
	firstname?: InputMaybe<Scalars['String']>;
	id?: InputMaybe<Scalars['uuid']>;
	lastname?: InputMaybe<Scalars['String']>;
	updatedAt?: InputMaybe<Scalars['timestamptz']>;
};

/** aggregate max on columns */
export type AdminCdbMaxFields = {
	__typename?: 'admin_cdb_max_fields';
	createdAt?: Maybe<Scalars['timestamptz']>;
	email?: Maybe<Scalars['citext']>;
	firstname?: Maybe<Scalars['String']>;
	id?: Maybe<Scalars['uuid']>;
	lastname?: Maybe<Scalars['String']>;
	updatedAt?: Maybe<Scalars['timestamptz']>;
};

/** aggregate min on columns */
export type AdminCdbMinFields = {
	__typename?: 'admin_cdb_min_fields';
	createdAt?: Maybe<Scalars['timestamptz']>;
	email?: Maybe<Scalars['citext']>;
	firstname?: Maybe<Scalars['String']>;
	id?: Maybe<Scalars['uuid']>;
	lastname?: Maybe<Scalars['String']>;
	updatedAt?: Maybe<Scalars['timestamptz']>;
};

/** response of any mutation on the table "admin_cdb" */
export type AdminCdbMutationResponse = {
	__typename?: 'admin_cdb_mutation_response';
	/** number of rows affected by the mutation */
	affected_rows: Scalars['Int'];
	/** data from the rows affected by the mutation */
	returning: Array<AdminCdb>;
};

/** input type for inserting object relation for remote table "admin_cdb" */
export type AdminCdbObjRelInsertInput = {
	data: AdminCdbInsertInput;
	/** on conflict condition */
	on_conflict?: InputMaybe<AdminCdbOnConflict>;
};

/** on conflict condition type for table "admin_cdb" */
export type AdminCdbOnConflict = {
	constraint: AdminCdbConstraint;
	update_columns?: Array<AdminCdbUpdateColumn>;
	where?: InputMaybe<AdminCdbBoolExp>;
};

/** Ordering options when selecting data from "admin_cdb". */
export type AdminCdbOrderBy = {
	account?: InputMaybe<AccountOrderBy>;
	createdAt?: InputMaybe<OrderBy>;
	email?: InputMaybe<OrderBy>;
	firstname?: InputMaybe<OrderBy>;
	id?: InputMaybe<OrderBy>;
	lastname?: InputMaybe<OrderBy>;
	updatedAt?: InputMaybe<OrderBy>;
};

/** primary key columns input for table: admin_cdb */
export type AdminCdbPkColumnsInput = {
	id: Scalars['uuid'];
};

/** select columns of table "admin_cdb" */
export enum AdminCdbSelectColumn {
	/** column name */
	CreatedAt = 'createdAt',
	/** column name */
	Email = 'email',
	/** column name */
	Firstname = 'firstname',
	/** column name */
	Id = 'id',
	/** column name */
	Lastname = 'lastname',
	/** column name */
	UpdatedAt = 'updatedAt',
}

/** input type for updating data in table "admin_cdb" */
export type AdminCdbSetInput = {
	createdAt?: InputMaybe<Scalars['timestamptz']>;
	email?: InputMaybe<Scalars['citext']>;
	firstname?: InputMaybe<Scalars['String']>;
	id?: InputMaybe<Scalars['uuid']>;
	lastname?: InputMaybe<Scalars['String']>;
	updatedAt?: InputMaybe<Scalars['timestamptz']>;
};

/** update columns of table "admin_cdb" */
export enum AdminCdbUpdateColumn {
	/** column name */
	CreatedAt = 'createdAt',
	/** column name */
	Email = 'email',
	/** column name */
	Firstname = 'firstname',
	/** column name */
	Id = 'id',
	/** column name */
	Lastname = 'lastname',
	/** column name */
	UpdatedAt = 'updatedAt',
}

/**
 * Table of structure manager, handle pro and brsa attachment
 *
 *
 * columns and relationships of "admin_structure"
 *
 */
export type AdminStructure = {
	__typename?: 'admin_structure';
	/** An object relationship */
	account?: Maybe<Account>;
	createdAt: Scalars['timestamptz'];
	/** An object relationship */
	deployment: Deployment;
	deploymentId: Scalars['uuid'];
	email: Scalars['citext'];
	firstname?: Maybe<Scalars['String']>;
	id: Scalars['uuid'];
	lastname?: Maybe<Scalars['String']>;
	phoneNumbers?: Maybe<Scalars['String']>;
	position?: Maybe<Scalars['String']>;
	/** An array relationship */
	structures: Array<AdminStructureStructure>;
	/** An aggregate relationship */
	structures_aggregate: AdminStructureStructureAggregate;
	updatedAt: Scalars['timestamptz'];
};

/**
 * Table of structure manager, handle pro and brsa attachment
 *
 *
 * columns and relationships of "admin_structure"
 *
 */
export type AdminStructureStructuresArgs = {
	distinct_on?: InputMaybe<Array<AdminStructureStructureSelectColumn>>;
	limit?: InputMaybe<Scalars['Int']>;
	offset?: InputMaybe<Scalars['Int']>;
	order_by?: InputMaybe<Array<AdminStructureStructureOrderBy>>;
	where?: InputMaybe<AdminStructureStructureBoolExp>;
};

/**
 * Table of structure manager, handle pro and brsa attachment
 *
 *
 * columns and relationships of "admin_structure"
 *
 */
export type AdminStructureStructuresAggregateArgs = {
	distinct_on?: InputMaybe<Array<AdminStructureStructureSelectColumn>>;
	limit?: InputMaybe<Scalars['Int']>;
	offset?: InputMaybe<Scalars['Int']>;
	order_by?: InputMaybe<Array<AdminStructureStructureOrderBy>>;
	where?: InputMaybe<AdminStructureStructureBoolExp>;
};

/** aggregated selection of "admin_structure" */
export type AdminStructureAggregate = {
	__typename?: 'admin_structure_aggregate';
	aggregate?: Maybe<AdminStructureAggregateFields>;
	nodes: Array<AdminStructure>;
};

/** aggregate fields of "admin_structure" */
export type AdminStructureAggregateFields = {
	__typename?: 'admin_structure_aggregate_fields';
	count: Scalars['Int'];
	max?: Maybe<AdminStructureMaxFields>;
	min?: Maybe<AdminStructureMinFields>;
};

/** aggregate fields of "admin_structure" */
export type AdminStructureAggregateFieldsCountArgs = {
	columns?: InputMaybe<Array<AdminStructureSelectColumn>>;
	distinct?: InputMaybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "admin_structure" */
export type AdminStructureAggregateOrderBy = {
	count?: InputMaybe<OrderBy>;
	max?: InputMaybe<AdminStructureMaxOrderBy>;
	min?: InputMaybe<AdminStructureMinOrderBy>;
};

/** input type for inserting array relation for remote table "admin_structure" */
export type AdminStructureArrRelInsertInput = {
	data: Array<AdminStructureInsertInput>;
	/** on conflict condition */
	on_conflict?: InputMaybe<AdminStructureOnConflict>;
};

/** Boolean expression to filter rows from the table "admin_structure". All fields are combined with a logical 'AND'. */
export type AdminStructureBoolExp = {
	_and?: InputMaybe<Array<AdminStructureBoolExp>>;
	_not?: InputMaybe<AdminStructureBoolExp>;
	_or?: InputMaybe<Array<AdminStructureBoolExp>>;
	account?: InputMaybe<AccountBoolExp>;
	createdAt?: InputMaybe<TimestamptzComparisonExp>;
	deployment?: InputMaybe<DeploymentBoolExp>;
	deploymentId?: InputMaybe<UuidComparisonExp>;
	email?: InputMaybe<CitextComparisonExp>;
	firstname?: InputMaybe<StringComparisonExp>;
	id?: InputMaybe<UuidComparisonExp>;
	lastname?: InputMaybe<StringComparisonExp>;
	phoneNumbers?: InputMaybe<StringComparisonExp>;
	position?: InputMaybe<StringComparisonExp>;
	structures?: InputMaybe<AdminStructureStructureBoolExp>;
	updatedAt?: InputMaybe<TimestamptzComparisonExp>;
};

/** unique or primary key constraints on table "admin_structure" */
export enum AdminStructureConstraint {
	/** unique or primary key constraint */
	AdminStructureEmailKey = 'admin_structure_email_key',
	/** unique or primary key constraint */
	AdminStructurePkey = 'admin_structure_pkey',
}

/** input type for inserting data into table "admin_structure" */
export type AdminStructureInsertInput = {
	account?: InputMaybe<AccountObjRelInsertInput>;
	createdAt?: InputMaybe<Scalars['timestamptz']>;
	deployment?: InputMaybe<DeploymentObjRelInsertInput>;
	deploymentId?: InputMaybe<Scalars['uuid']>;
	email?: InputMaybe<Scalars['citext']>;
	firstname?: InputMaybe<Scalars['String']>;
	id?: InputMaybe<Scalars['uuid']>;
	lastname?: InputMaybe<Scalars['String']>;
	phoneNumbers?: InputMaybe<Scalars['String']>;
	position?: InputMaybe<Scalars['String']>;
	structures?: InputMaybe<AdminStructureStructureArrRelInsertInput>;
	updatedAt?: InputMaybe<Scalars['timestamptz']>;
};

/** aggregate max on columns */
export type AdminStructureMaxFields = {
	__typename?: 'admin_structure_max_fields';
	createdAt?: Maybe<Scalars['timestamptz']>;
	deploymentId?: Maybe<Scalars['uuid']>;
	email?: Maybe<Scalars['citext']>;
	firstname?: Maybe<Scalars['String']>;
	id?: Maybe<Scalars['uuid']>;
	lastname?: Maybe<Scalars['String']>;
	phoneNumbers?: Maybe<Scalars['String']>;
	position?: Maybe<Scalars['String']>;
	updatedAt?: Maybe<Scalars['timestamptz']>;
};

/** order by max() on columns of table "admin_structure" */
export type AdminStructureMaxOrderBy = {
	createdAt?: InputMaybe<OrderBy>;
	deploymentId?: InputMaybe<OrderBy>;
	email?: InputMaybe<OrderBy>;
	firstname?: InputMaybe<OrderBy>;
	id?: InputMaybe<OrderBy>;
	lastname?: InputMaybe<OrderBy>;
	phoneNumbers?: InputMaybe<OrderBy>;
	position?: InputMaybe<OrderBy>;
	updatedAt?: InputMaybe<OrderBy>;
};

/** aggregate min on columns */
export type AdminStructureMinFields = {
	__typename?: 'admin_structure_min_fields';
	createdAt?: Maybe<Scalars['timestamptz']>;
	deploymentId?: Maybe<Scalars['uuid']>;
	email?: Maybe<Scalars['citext']>;
	firstname?: Maybe<Scalars['String']>;
	id?: Maybe<Scalars['uuid']>;
	lastname?: Maybe<Scalars['String']>;
	phoneNumbers?: Maybe<Scalars['String']>;
	position?: Maybe<Scalars['String']>;
	updatedAt?: Maybe<Scalars['timestamptz']>;
};

/** order by min() on columns of table "admin_structure" */
export type AdminStructureMinOrderBy = {
	createdAt?: InputMaybe<OrderBy>;
	deploymentId?: InputMaybe<OrderBy>;
	email?: InputMaybe<OrderBy>;
	firstname?: InputMaybe<OrderBy>;
	id?: InputMaybe<OrderBy>;
	lastname?: InputMaybe<OrderBy>;
	phoneNumbers?: InputMaybe<OrderBy>;
	position?: InputMaybe<OrderBy>;
	updatedAt?: InputMaybe<OrderBy>;
};

/** response of any mutation on the table "admin_structure" */
export type AdminStructureMutationResponse = {
	__typename?: 'admin_structure_mutation_response';
	/** number of rows affected by the mutation */
	affected_rows: Scalars['Int'];
	/** data from the rows affected by the mutation */
	returning: Array<AdminStructure>;
};

/** input type for inserting object relation for remote table "admin_structure" */
export type AdminStructureObjRelInsertInput = {
	data: AdminStructureInsertInput;
	/** on conflict condition */
	on_conflict?: InputMaybe<AdminStructureOnConflict>;
};

/** on conflict condition type for table "admin_structure" */
export type AdminStructureOnConflict = {
	constraint: AdminStructureConstraint;
	update_columns?: Array<AdminStructureUpdateColumn>;
	where?: InputMaybe<AdminStructureBoolExp>;
};

/** Ordering options when selecting data from "admin_structure". */
export type AdminStructureOrderBy = {
	account?: InputMaybe<AccountOrderBy>;
	createdAt?: InputMaybe<OrderBy>;
	deployment?: InputMaybe<DeploymentOrderBy>;
	deploymentId?: InputMaybe<OrderBy>;
	email?: InputMaybe<OrderBy>;
	firstname?: InputMaybe<OrderBy>;
	id?: InputMaybe<OrderBy>;
	lastname?: InputMaybe<OrderBy>;
	phoneNumbers?: InputMaybe<OrderBy>;
	position?: InputMaybe<OrderBy>;
	structures_aggregate?: InputMaybe<AdminStructureStructureAggregateOrderBy>;
	updatedAt?: InputMaybe<OrderBy>;
};

/** primary key columns input for table: admin_structure */
export type AdminStructurePkColumnsInput = {
	id: Scalars['uuid'];
};

/** select columns of table "admin_structure" */
export enum AdminStructureSelectColumn {
	/** column name */
	CreatedAt = 'createdAt',
	/** column name */
	DeploymentId = 'deploymentId',
	/** column name */
	Email = 'email',
	/** column name */
	Firstname = 'firstname',
	/** column name */
	Id = 'id',
	/** column name */
	Lastname = 'lastname',
	/** column name */
	PhoneNumbers = 'phoneNumbers',
	/** column name */
	Position = 'position',
	/** column name */
	UpdatedAt = 'updatedAt',
}

/** input type for updating data in table "admin_structure" */
export type AdminStructureSetInput = {
	createdAt?: InputMaybe<Scalars['timestamptz']>;
	deploymentId?: InputMaybe<Scalars['uuid']>;
	email?: InputMaybe<Scalars['citext']>;
	firstname?: InputMaybe<Scalars['String']>;
	id?: InputMaybe<Scalars['uuid']>;
	lastname?: InputMaybe<Scalars['String']>;
	phoneNumbers?: InputMaybe<Scalars['String']>;
	position?: InputMaybe<Scalars['String']>;
	updatedAt?: InputMaybe<Scalars['timestamptz']>;
};

/**
 * associative table between admin_structure and structure (many ot many)
 *
 *
 * columns and relationships of "admin_structure_structure"
 *
 */
export type AdminStructureStructure = {
	__typename?: 'admin_structure_structure';
	adminStructureId: Scalars['uuid'];
	/** An object relationship */
	admin_structure: AdminStructure;
	createdAt: Scalars['timestamptz'];
	id: Scalars['uuid'];
	/** An object relationship */
	structure: Structure;
	structureId: Scalars['uuid'];
};

/** aggregated selection of "admin_structure_structure" */
export type AdminStructureStructureAggregate = {
	__typename?: 'admin_structure_structure_aggregate';
	aggregate?: Maybe<AdminStructureStructureAggregateFields>;
	nodes: Array<AdminStructureStructure>;
};

/** aggregate fields of "admin_structure_structure" */
export type AdminStructureStructureAggregateFields = {
	__typename?: 'admin_structure_structure_aggregate_fields';
	count: Scalars['Int'];
	max?: Maybe<AdminStructureStructureMaxFields>;
	min?: Maybe<AdminStructureStructureMinFields>;
};

/** aggregate fields of "admin_structure_structure" */
export type AdminStructureStructureAggregateFieldsCountArgs = {
	columns?: InputMaybe<Array<AdminStructureStructureSelectColumn>>;
	distinct?: InputMaybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "admin_structure_structure" */
export type AdminStructureStructureAggregateOrderBy = {
	count?: InputMaybe<OrderBy>;
	max?: InputMaybe<AdminStructureStructureMaxOrderBy>;
	min?: InputMaybe<AdminStructureStructureMinOrderBy>;
};

/** input type for inserting array relation for remote table "admin_structure_structure" */
export type AdminStructureStructureArrRelInsertInput = {
	data: Array<AdminStructureStructureInsertInput>;
	/** on conflict condition */
	on_conflict?: InputMaybe<AdminStructureStructureOnConflict>;
};

/** Boolean expression to filter rows from the table "admin_structure_structure". All fields are combined with a logical 'AND'. */
export type AdminStructureStructureBoolExp = {
	_and?: InputMaybe<Array<AdminStructureStructureBoolExp>>;
	_not?: InputMaybe<AdminStructureStructureBoolExp>;
	_or?: InputMaybe<Array<AdminStructureStructureBoolExp>>;
	adminStructureId?: InputMaybe<UuidComparisonExp>;
	admin_structure?: InputMaybe<AdminStructureBoolExp>;
	createdAt?: InputMaybe<TimestamptzComparisonExp>;
	id?: InputMaybe<UuidComparisonExp>;
	structure?: InputMaybe<StructureBoolExp>;
	structureId?: InputMaybe<UuidComparisonExp>;
};

/** unique or primary key constraints on table "admin_structure_structure" */
export enum AdminStructureStructureConstraint {
	/** unique or primary key constraint */
	AdminStructureStructurePkey = 'admin_structure_structure_pkey',
}

/** input type for inserting data into table "admin_structure_structure" */
export type AdminStructureStructureInsertInput = {
	adminStructureId?: InputMaybe<Scalars['uuid']>;
	admin_structure?: InputMaybe<AdminStructureObjRelInsertInput>;
	createdAt?: InputMaybe<Scalars['timestamptz']>;
	id?: InputMaybe<Scalars['uuid']>;
	structure?: InputMaybe<StructureObjRelInsertInput>;
	structureId?: InputMaybe<Scalars['uuid']>;
};

/** aggregate max on columns */
export type AdminStructureStructureMaxFields = {
	__typename?: 'admin_structure_structure_max_fields';
	adminStructureId?: Maybe<Scalars['uuid']>;
	createdAt?: Maybe<Scalars['timestamptz']>;
	id?: Maybe<Scalars['uuid']>;
	structureId?: Maybe<Scalars['uuid']>;
};

/** order by max() on columns of table "admin_structure_structure" */
export type AdminStructureStructureMaxOrderBy = {
	adminStructureId?: InputMaybe<OrderBy>;
	createdAt?: InputMaybe<OrderBy>;
	id?: InputMaybe<OrderBy>;
	structureId?: InputMaybe<OrderBy>;
};

/** aggregate min on columns */
export type AdminStructureStructureMinFields = {
	__typename?: 'admin_structure_structure_min_fields';
	adminStructureId?: Maybe<Scalars['uuid']>;
	createdAt?: Maybe<Scalars['timestamptz']>;
	id?: Maybe<Scalars['uuid']>;
	structureId?: Maybe<Scalars['uuid']>;
};

/** order by min() on columns of table "admin_structure_structure" */
export type AdminStructureStructureMinOrderBy = {
	adminStructureId?: InputMaybe<OrderBy>;
	createdAt?: InputMaybe<OrderBy>;
	id?: InputMaybe<OrderBy>;
	structureId?: InputMaybe<OrderBy>;
};

/** response of any mutation on the table "admin_structure_structure" */
export type AdminStructureStructureMutationResponse = {
	__typename?: 'admin_structure_structure_mutation_response';
	/** number of rows affected by the mutation */
	affected_rows: Scalars['Int'];
	/** data from the rows affected by the mutation */
	returning: Array<AdminStructureStructure>;
};

/** on conflict condition type for table "admin_structure_structure" */
export type AdminStructureStructureOnConflict = {
	constraint: AdminStructureStructureConstraint;
	update_columns?: Array<AdminStructureStructureUpdateColumn>;
	where?: InputMaybe<AdminStructureStructureBoolExp>;
};

/** Ordering options when selecting data from "admin_structure_structure". */
export type AdminStructureStructureOrderBy = {
	adminStructureId?: InputMaybe<OrderBy>;
	admin_structure?: InputMaybe<AdminStructureOrderBy>;
	createdAt?: InputMaybe<OrderBy>;
	id?: InputMaybe<OrderBy>;
	structure?: InputMaybe<StructureOrderBy>;
	structureId?: InputMaybe<OrderBy>;
};

/** primary key columns input for table: admin_structure_structure */
export type AdminStructureStructurePkColumnsInput = {
	id: Scalars['uuid'];
};

/** select columns of table "admin_structure_structure" */
export enum AdminStructureStructureSelectColumn {
	/** column name */
	AdminStructureId = 'adminStructureId',
	/** column name */
	CreatedAt = 'createdAt',
	/** column name */
	Id = 'id',
	/** column name */
	StructureId = 'structureId',
}

/** input type for updating data in table "admin_structure_structure" */
export type AdminStructureStructureSetInput = {
	adminStructureId?: InputMaybe<Scalars['uuid']>;
	createdAt?: InputMaybe<Scalars['timestamptz']>;
	id?: InputMaybe<Scalars['uuid']>;
	structureId?: InputMaybe<Scalars['uuid']>;
};

/** update columns of table "admin_structure_structure" */
export enum AdminStructureStructureUpdateColumn {
	/** column name */
	AdminStructureId = 'adminStructureId',
	/** column name */
	CreatedAt = 'createdAt',
	/** column name */
	Id = 'id',
	/** column name */
	StructureId = 'structureId',
}

/** update columns of table "admin_structure" */
export enum AdminStructureUpdateColumn {
	/** column name */
	CreatedAt = 'createdAt',
	/** column name */
	DeploymentId = 'deploymentId',
	/** column name */
	Email = 'email',
	/** column name */
	Firstname = 'firstname',
	/** column name */
	Id = 'id',
	/** column name */
	Lastname = 'lastname',
	/** column name */
	PhoneNumbers = 'phoneNumbers',
	/** column name */
	Position = 'position',
	/** column name */
	UpdatedAt = 'updatedAt',
}

/** columns and relationships of "beneficiary" */
export type Beneficiary = {
	__typename?: 'beneficiary';
	/** An object relationship */
	account?: Maybe<Account>;
	address1?: Maybe<Scalars['String']>;
	address2?: Maybe<Scalars['String']>;
	cafNumber?: Maybe<Scalars['String']>;
	city?: Maybe<Scalars['String']>;
	createdAt: Scalars['timestamptz'];
	dateOfBirth: Scalars['date'];
	/** An object relationship */
	deployment?: Maybe<Deployment>;
	deploymentId?: Maybe<Scalars['uuid']>;
	email?: Maybe<Scalars['citext']>;
	firstname: Scalars['String'];
	id: Scalars['uuid'];
	internalId?: Maybe<Scalars['String']>;
	lastname: Scalars['String'];
	mobileNumber?: Maybe<Scalars['String']>;
	needOrientation: Scalars['Boolean'];
	/** An object relationship */
	notebook?: Maybe<Notebook>;
	peNumber?: Maybe<Scalars['String']>;
	placeOfBirth?: Maybe<Scalars['String']>;
	postalCode?: Maybe<Scalars['String']>;
	/** An array relationship */
	structures: Array<BeneficiaryStructure>;
	/** An aggregate relationship */
	structures_aggregate: BeneficiaryStructureAggregate;
	updatedAt: Scalars['timestamptz'];
};

/** columns and relationships of "beneficiary" */
export type BeneficiaryStructuresArgs = {
	distinct_on?: InputMaybe<Array<BeneficiaryStructureSelectColumn>>;
	limit?: InputMaybe<Scalars['Int']>;
	offset?: InputMaybe<Scalars['Int']>;
	order_by?: InputMaybe<Array<BeneficiaryStructureOrderBy>>;
	where?: InputMaybe<BeneficiaryStructureBoolExp>;
};

/** columns and relationships of "beneficiary" */
export type BeneficiaryStructuresAggregateArgs = {
	distinct_on?: InputMaybe<Array<BeneficiaryStructureSelectColumn>>;
	limit?: InputMaybe<Scalars['Int']>;
	offset?: InputMaybe<Scalars['Int']>;
	order_by?: InputMaybe<Array<BeneficiaryStructureOrderBy>>;
	where?: InputMaybe<BeneficiaryStructureBoolExp>;
};

/** aggregated selection of "beneficiary" */
export type BeneficiaryAggregate = {
	__typename?: 'beneficiary_aggregate';
	aggregate?: Maybe<BeneficiaryAggregateFields>;
	nodes: Array<Beneficiary>;
};

/** aggregate fields of "beneficiary" */
export type BeneficiaryAggregateFields = {
	__typename?: 'beneficiary_aggregate_fields';
	count: Scalars['Int'];
	max?: Maybe<BeneficiaryMaxFields>;
	min?: Maybe<BeneficiaryMinFields>;
};

/** aggregate fields of "beneficiary" */
export type BeneficiaryAggregateFieldsCountArgs = {
	columns?: InputMaybe<Array<BeneficiarySelectColumn>>;
	distinct?: InputMaybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "beneficiary" */
export type BeneficiaryAggregateOrderBy = {
	count?: InputMaybe<OrderBy>;
	max?: InputMaybe<BeneficiaryMaxOrderBy>;
	min?: InputMaybe<BeneficiaryMinOrderBy>;
};

/** input type for inserting array relation for remote table "beneficiary" */
export type BeneficiaryArrRelInsertInput = {
	data: Array<BeneficiaryInsertInput>;
	/** on conflict condition */
	on_conflict?: InputMaybe<BeneficiaryOnConflict>;
};

/** Boolean expression to filter rows from the table "beneficiary". All fields are combined with a logical 'AND'. */
export type BeneficiaryBoolExp = {
	_and?: InputMaybe<Array<BeneficiaryBoolExp>>;
	_not?: InputMaybe<BeneficiaryBoolExp>;
	_or?: InputMaybe<Array<BeneficiaryBoolExp>>;
	account?: InputMaybe<AccountBoolExp>;
	address1?: InputMaybe<StringComparisonExp>;
	address2?: InputMaybe<StringComparisonExp>;
	cafNumber?: InputMaybe<StringComparisonExp>;
	city?: InputMaybe<StringComparisonExp>;
	createdAt?: InputMaybe<TimestamptzComparisonExp>;
	dateOfBirth?: InputMaybe<DateComparisonExp>;
	deployment?: InputMaybe<DeploymentBoolExp>;
	deploymentId?: InputMaybe<UuidComparisonExp>;
	email?: InputMaybe<CitextComparisonExp>;
	firstname?: InputMaybe<StringComparisonExp>;
	id?: InputMaybe<UuidComparisonExp>;
	internalId?: InputMaybe<StringComparisonExp>;
	lastname?: InputMaybe<StringComparisonExp>;
	mobileNumber?: InputMaybe<StringComparisonExp>;
	needOrientation?: InputMaybe<BooleanComparisonExp>;
	notebook?: InputMaybe<NotebookBoolExp>;
	peNumber?: InputMaybe<StringComparisonExp>;
	placeOfBirth?: InputMaybe<StringComparisonExp>;
	postalCode?: InputMaybe<StringComparisonExp>;
	structures?: InputMaybe<BeneficiaryStructureBoolExp>;
	updatedAt?: InputMaybe<TimestamptzComparisonExp>;
};

/** unique or primary key constraints on table "beneficiary" */
export enum BeneficiaryConstraint {
	/** unique or primary key constraint */
	BeneficiaryFirstnameCafNumberDateOfBirthLastnameDeploym = 'beneficiary_firstname_caf_number_date_of_birth_lastname_deploym',
	/** unique or primary key constraint */
	BeneficiaryInternalIdKey = 'beneficiary_internal_id_key',
	/** unique or primary key constraint */
	BeneficiaryPeNumberLastnameFirstnameDateOfBirthDeployme = 'beneficiary_pe_number_lastname_firstname_date_of_birth_deployme',
	/** unique or primary key constraint */
	BeneficiaryPkey = 'beneficiary_pkey',
}

/** input type for inserting data into table "beneficiary" */
export type BeneficiaryInsertInput = {
	account?: InputMaybe<AccountObjRelInsertInput>;
	address1?: InputMaybe<Scalars['String']>;
	address2?: InputMaybe<Scalars['String']>;
	cafNumber?: InputMaybe<Scalars['String']>;
	city?: InputMaybe<Scalars['String']>;
	createdAt?: InputMaybe<Scalars['timestamptz']>;
	dateOfBirth?: InputMaybe<Scalars['date']>;
	deployment?: InputMaybe<DeploymentObjRelInsertInput>;
	deploymentId?: InputMaybe<Scalars['uuid']>;
	email?: InputMaybe<Scalars['citext']>;
	firstname?: InputMaybe<Scalars['String']>;
	id?: InputMaybe<Scalars['uuid']>;
	internalId?: InputMaybe<Scalars['String']>;
	lastname?: InputMaybe<Scalars['String']>;
	mobileNumber?: InputMaybe<Scalars['String']>;
	needOrientation?: InputMaybe<Scalars['Boolean']>;
	notebook?: InputMaybe<NotebookObjRelInsertInput>;
	peNumber?: InputMaybe<Scalars['String']>;
	placeOfBirth?: InputMaybe<Scalars['String']>;
	postalCode?: InputMaybe<Scalars['String']>;
	structures?: InputMaybe<BeneficiaryStructureArrRelInsertInput>;
	updatedAt?: InputMaybe<Scalars['timestamptz']>;
};

/** aggregate max on columns */
export type BeneficiaryMaxFields = {
	__typename?: 'beneficiary_max_fields';
	address1?: Maybe<Scalars['String']>;
	address2?: Maybe<Scalars['String']>;
	cafNumber?: Maybe<Scalars['String']>;
	city?: Maybe<Scalars['String']>;
	createdAt?: Maybe<Scalars['timestamptz']>;
	dateOfBirth?: Maybe<Scalars['date']>;
	deploymentId?: Maybe<Scalars['uuid']>;
	email?: Maybe<Scalars['citext']>;
	firstname?: Maybe<Scalars['String']>;
	id?: Maybe<Scalars['uuid']>;
	internalId?: Maybe<Scalars['String']>;
	lastname?: Maybe<Scalars['String']>;
	mobileNumber?: Maybe<Scalars['String']>;
	peNumber?: Maybe<Scalars['String']>;
	placeOfBirth?: Maybe<Scalars['String']>;
	postalCode?: Maybe<Scalars['String']>;
	updatedAt?: Maybe<Scalars['timestamptz']>;
};

/** order by max() on columns of table "beneficiary" */
export type BeneficiaryMaxOrderBy = {
	address1?: InputMaybe<OrderBy>;
	address2?: InputMaybe<OrderBy>;
	cafNumber?: InputMaybe<OrderBy>;
	city?: InputMaybe<OrderBy>;
	createdAt?: InputMaybe<OrderBy>;
	dateOfBirth?: InputMaybe<OrderBy>;
	deploymentId?: InputMaybe<OrderBy>;
	email?: InputMaybe<OrderBy>;
	firstname?: InputMaybe<OrderBy>;
	id?: InputMaybe<OrderBy>;
	internalId?: InputMaybe<OrderBy>;
	lastname?: InputMaybe<OrderBy>;
	mobileNumber?: InputMaybe<OrderBy>;
	peNumber?: InputMaybe<OrderBy>;
	placeOfBirth?: InputMaybe<OrderBy>;
	postalCode?: InputMaybe<OrderBy>;
	updatedAt?: InputMaybe<OrderBy>;
};

/** aggregate min on columns */
export type BeneficiaryMinFields = {
	__typename?: 'beneficiary_min_fields';
	address1?: Maybe<Scalars['String']>;
	address2?: Maybe<Scalars['String']>;
	cafNumber?: Maybe<Scalars['String']>;
	city?: Maybe<Scalars['String']>;
	createdAt?: Maybe<Scalars['timestamptz']>;
	dateOfBirth?: Maybe<Scalars['date']>;
	deploymentId?: Maybe<Scalars['uuid']>;
	email?: Maybe<Scalars['citext']>;
	firstname?: Maybe<Scalars['String']>;
	id?: Maybe<Scalars['uuid']>;
	internalId?: Maybe<Scalars['String']>;
	lastname?: Maybe<Scalars['String']>;
	mobileNumber?: Maybe<Scalars['String']>;
	peNumber?: Maybe<Scalars['String']>;
	placeOfBirth?: Maybe<Scalars['String']>;
	postalCode?: Maybe<Scalars['String']>;
	updatedAt?: Maybe<Scalars['timestamptz']>;
};

/** order by min() on columns of table "beneficiary" */
export type BeneficiaryMinOrderBy = {
	address1?: InputMaybe<OrderBy>;
	address2?: InputMaybe<OrderBy>;
	cafNumber?: InputMaybe<OrderBy>;
	city?: InputMaybe<OrderBy>;
	createdAt?: InputMaybe<OrderBy>;
	dateOfBirth?: InputMaybe<OrderBy>;
	deploymentId?: InputMaybe<OrderBy>;
	email?: InputMaybe<OrderBy>;
	firstname?: InputMaybe<OrderBy>;
	id?: InputMaybe<OrderBy>;
	internalId?: InputMaybe<OrderBy>;
	lastname?: InputMaybe<OrderBy>;
	mobileNumber?: InputMaybe<OrderBy>;
	peNumber?: InputMaybe<OrderBy>;
	placeOfBirth?: InputMaybe<OrderBy>;
	postalCode?: InputMaybe<OrderBy>;
	updatedAt?: InputMaybe<OrderBy>;
};

/** response of any mutation on the table "beneficiary" */
export type BeneficiaryMutationResponse = {
	__typename?: 'beneficiary_mutation_response';
	/** number of rows affected by the mutation */
	affected_rows: Scalars['Int'];
	/** data from the rows affected by the mutation */
	returning: Array<Beneficiary>;
};

/** input type for inserting object relation for remote table "beneficiary" */
export type BeneficiaryObjRelInsertInput = {
	data: BeneficiaryInsertInput;
	/** on conflict condition */
	on_conflict?: InputMaybe<BeneficiaryOnConflict>;
};

/** on conflict condition type for table "beneficiary" */
export type BeneficiaryOnConflict = {
	constraint: BeneficiaryConstraint;
	update_columns?: Array<BeneficiaryUpdateColumn>;
	where?: InputMaybe<BeneficiaryBoolExp>;
};

/** Ordering options when selecting data from "beneficiary". */
export type BeneficiaryOrderBy = {
	account?: InputMaybe<AccountOrderBy>;
	address1?: InputMaybe<OrderBy>;
	address2?: InputMaybe<OrderBy>;
	cafNumber?: InputMaybe<OrderBy>;
	city?: InputMaybe<OrderBy>;
	createdAt?: InputMaybe<OrderBy>;
	dateOfBirth?: InputMaybe<OrderBy>;
	deployment?: InputMaybe<DeploymentOrderBy>;
	deploymentId?: InputMaybe<OrderBy>;
	email?: InputMaybe<OrderBy>;
	firstname?: InputMaybe<OrderBy>;
	id?: InputMaybe<OrderBy>;
	internalId?: InputMaybe<OrderBy>;
	lastname?: InputMaybe<OrderBy>;
	mobileNumber?: InputMaybe<OrderBy>;
	needOrientation?: InputMaybe<OrderBy>;
	notebook?: InputMaybe<NotebookOrderBy>;
	peNumber?: InputMaybe<OrderBy>;
	placeOfBirth?: InputMaybe<OrderBy>;
	postalCode?: InputMaybe<OrderBy>;
	structures_aggregate?: InputMaybe<BeneficiaryStructureAggregateOrderBy>;
	updatedAt?: InputMaybe<OrderBy>;
};

/** primary key columns input for table: beneficiary */
export type BeneficiaryPkColumnsInput = {
	id: Scalars['uuid'];
};

/** select columns of table "beneficiary" */
export enum BeneficiarySelectColumn {
	/** column name */
	Address1 = 'address1',
	/** column name */
	Address2 = 'address2',
	/** column name */
	CafNumber = 'cafNumber',
	/** column name */
	City = 'city',
	/** column name */
	CreatedAt = 'createdAt',
	/** column name */
	DateOfBirth = 'dateOfBirth',
	/** column name */
	DeploymentId = 'deploymentId',
	/** column name */
	Email = 'email',
	/** column name */
	Firstname = 'firstname',
	/** column name */
	Id = 'id',
	/** column name */
	InternalId = 'internalId',
	/** column name */
	Lastname = 'lastname',
	/** column name */
	MobileNumber = 'mobileNumber',
	/** column name */
	NeedOrientation = 'needOrientation',
	/** column name */
	PeNumber = 'peNumber',
	/** column name */
	PlaceOfBirth = 'placeOfBirth',
	/** column name */
	PostalCode = 'postalCode',
	/** column name */
	UpdatedAt = 'updatedAt',
}

/** input type for updating data in table "beneficiary" */
export type BeneficiarySetInput = {
	address1?: InputMaybe<Scalars['String']>;
	address2?: InputMaybe<Scalars['String']>;
	cafNumber?: InputMaybe<Scalars['String']>;
	city?: InputMaybe<Scalars['String']>;
	createdAt?: InputMaybe<Scalars['timestamptz']>;
	dateOfBirth?: InputMaybe<Scalars['date']>;
	deploymentId?: InputMaybe<Scalars['uuid']>;
	email?: InputMaybe<Scalars['citext']>;
	firstname?: InputMaybe<Scalars['String']>;
	id?: InputMaybe<Scalars['uuid']>;
	internalId?: InputMaybe<Scalars['String']>;
	lastname?: InputMaybe<Scalars['String']>;
	mobileNumber?: InputMaybe<Scalars['String']>;
	needOrientation?: InputMaybe<Scalars['Boolean']>;
	peNumber?: InputMaybe<Scalars['String']>;
	placeOfBirth?: InputMaybe<Scalars['String']>;
	postalCode?: InputMaybe<Scalars['String']>;
	updatedAt?: InputMaybe<Scalars['timestamptz']>;
};

/**
 * associative table between beneficiary and structure (many ot many)
 *
 *
 * columns and relationships of "beneficiary_structure"
 *
 */
export type BeneficiaryStructure = {
	__typename?: 'beneficiary_structure';
	/** An object relationship */
	beneficiary: Beneficiary;
	beneficiaryId: Scalars['uuid'];
	createdAt: Scalars['timestamptz'];
	data: Scalars['jsonb'];
	id: Scalars['uuid'];
	status: Scalars['String'];
	/** An object relationship */
	structure: Structure;
	structureId: Scalars['uuid'];
	updatedAt: Scalars['timestamptz'];
};

/**
 * associative table between beneficiary and structure (many ot many)
 *
 *
 * columns and relationships of "beneficiary_structure"
 *
 */
export type BeneficiaryStructureDataArgs = {
	path?: InputMaybe<Scalars['String']>;
};

/** aggregated selection of "beneficiary_structure" */
export type BeneficiaryStructureAggregate = {
	__typename?: 'beneficiary_structure_aggregate';
	aggregate?: Maybe<BeneficiaryStructureAggregateFields>;
	nodes: Array<BeneficiaryStructure>;
};

/** aggregate fields of "beneficiary_structure" */
export type BeneficiaryStructureAggregateFields = {
	__typename?: 'beneficiary_structure_aggregate_fields';
	count: Scalars['Int'];
	max?: Maybe<BeneficiaryStructureMaxFields>;
	min?: Maybe<BeneficiaryStructureMinFields>;
};

/** aggregate fields of "beneficiary_structure" */
export type BeneficiaryStructureAggregateFieldsCountArgs = {
	columns?: InputMaybe<Array<BeneficiaryStructureSelectColumn>>;
	distinct?: InputMaybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "beneficiary_structure" */
export type BeneficiaryStructureAggregateOrderBy = {
	count?: InputMaybe<OrderBy>;
	max?: InputMaybe<BeneficiaryStructureMaxOrderBy>;
	min?: InputMaybe<BeneficiaryStructureMinOrderBy>;
};

/** append existing jsonb value of filtered columns with new jsonb value */
export type BeneficiaryStructureAppendInput = {
	data?: InputMaybe<Scalars['jsonb']>;
};

/** input type for inserting array relation for remote table "beneficiary_structure" */
export type BeneficiaryStructureArrRelInsertInput = {
	data: Array<BeneficiaryStructureInsertInput>;
	/** on conflict condition */
	on_conflict?: InputMaybe<BeneficiaryStructureOnConflict>;
};

/** Boolean expression to filter rows from the table "beneficiary_structure". All fields are combined with a logical 'AND'. */
export type BeneficiaryStructureBoolExp = {
	_and?: InputMaybe<Array<BeneficiaryStructureBoolExp>>;
	_not?: InputMaybe<BeneficiaryStructureBoolExp>;
	_or?: InputMaybe<Array<BeneficiaryStructureBoolExp>>;
	beneficiary?: InputMaybe<BeneficiaryBoolExp>;
	beneficiaryId?: InputMaybe<UuidComparisonExp>;
	createdAt?: InputMaybe<TimestamptzComparisonExp>;
	data?: InputMaybe<JsonbComparisonExp>;
	id?: InputMaybe<UuidComparisonExp>;
	status?: InputMaybe<StringComparisonExp>;
	structure?: InputMaybe<StructureBoolExp>;
	structureId?: InputMaybe<UuidComparisonExp>;
	updatedAt?: InputMaybe<TimestamptzComparisonExp>;
};

/** unique or primary key constraints on table "beneficiary_structure" */
export enum BeneficiaryStructureConstraint {
	/** unique or primary key constraint */
	BeneficiaryStructurePkey = 'beneficiary_structure_pkey',
	/** unique or primary key constraint */
	BeneficiaryStructureStructureIdBeneficiaryIdKey = 'beneficiary_structure_structure_id_beneficiary_id_key',
}

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export type BeneficiaryStructureDeleteAtPathInput = {
	data?: InputMaybe<Array<Scalars['String']>>;
};

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export type BeneficiaryStructureDeleteElemInput = {
	data?: InputMaybe<Scalars['Int']>;
};

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export type BeneficiaryStructureDeleteKeyInput = {
	data?: InputMaybe<Scalars['String']>;
};

/** input type for inserting data into table "beneficiary_structure" */
export type BeneficiaryStructureInsertInput = {
	beneficiary?: InputMaybe<BeneficiaryObjRelInsertInput>;
	beneficiaryId?: InputMaybe<Scalars['uuid']>;
	createdAt?: InputMaybe<Scalars['timestamptz']>;
	data?: InputMaybe<Scalars['jsonb']>;
	id?: InputMaybe<Scalars['uuid']>;
	status?: InputMaybe<Scalars['String']>;
	structure?: InputMaybe<StructureObjRelInsertInput>;
	structureId?: InputMaybe<Scalars['uuid']>;
	updatedAt?: InputMaybe<Scalars['timestamptz']>;
};

/** aggregate max on columns */
export type BeneficiaryStructureMaxFields = {
	__typename?: 'beneficiary_structure_max_fields';
	beneficiaryId?: Maybe<Scalars['uuid']>;
	createdAt?: Maybe<Scalars['timestamptz']>;
	id?: Maybe<Scalars['uuid']>;
	status?: Maybe<Scalars['String']>;
	structureId?: Maybe<Scalars['uuid']>;
	updatedAt?: Maybe<Scalars['timestamptz']>;
};

/** order by max() on columns of table "beneficiary_structure" */
export type BeneficiaryStructureMaxOrderBy = {
	beneficiaryId?: InputMaybe<OrderBy>;
	createdAt?: InputMaybe<OrderBy>;
	id?: InputMaybe<OrderBy>;
	status?: InputMaybe<OrderBy>;
	structureId?: InputMaybe<OrderBy>;
	updatedAt?: InputMaybe<OrderBy>;
};

/** aggregate min on columns */
export type BeneficiaryStructureMinFields = {
	__typename?: 'beneficiary_structure_min_fields';
	beneficiaryId?: Maybe<Scalars['uuid']>;
	createdAt?: Maybe<Scalars['timestamptz']>;
	id?: Maybe<Scalars['uuid']>;
	status?: Maybe<Scalars['String']>;
	structureId?: Maybe<Scalars['uuid']>;
	updatedAt?: Maybe<Scalars['timestamptz']>;
};

/** order by min() on columns of table "beneficiary_structure" */
export type BeneficiaryStructureMinOrderBy = {
	beneficiaryId?: InputMaybe<OrderBy>;
	createdAt?: InputMaybe<OrderBy>;
	id?: InputMaybe<OrderBy>;
	status?: InputMaybe<OrderBy>;
	structureId?: InputMaybe<OrderBy>;
	updatedAt?: InputMaybe<OrderBy>;
};

/** response of any mutation on the table "beneficiary_structure" */
export type BeneficiaryStructureMutationResponse = {
	__typename?: 'beneficiary_structure_mutation_response';
	/** number of rows affected by the mutation */
	affected_rows: Scalars['Int'];
	/** data from the rows affected by the mutation */
	returning: Array<BeneficiaryStructure>;
};

/** on conflict condition type for table "beneficiary_structure" */
export type BeneficiaryStructureOnConflict = {
	constraint: BeneficiaryStructureConstraint;
	update_columns?: Array<BeneficiaryStructureUpdateColumn>;
	where?: InputMaybe<BeneficiaryStructureBoolExp>;
};

/** Ordering options when selecting data from "beneficiary_structure". */
export type BeneficiaryStructureOrderBy = {
	beneficiary?: InputMaybe<BeneficiaryOrderBy>;
	beneficiaryId?: InputMaybe<OrderBy>;
	createdAt?: InputMaybe<OrderBy>;
	data?: InputMaybe<OrderBy>;
	id?: InputMaybe<OrderBy>;
	status?: InputMaybe<OrderBy>;
	structure?: InputMaybe<StructureOrderBy>;
	structureId?: InputMaybe<OrderBy>;
	updatedAt?: InputMaybe<OrderBy>;
};

/** primary key columns input for table: beneficiary_structure */
export type BeneficiaryStructurePkColumnsInput = {
	id: Scalars['uuid'];
};

/** prepend existing jsonb value of filtered columns with new jsonb value */
export type BeneficiaryStructurePrependInput = {
	data?: InputMaybe<Scalars['jsonb']>;
};

/** select columns of table "beneficiary_structure" */
export enum BeneficiaryStructureSelectColumn {
	/** column name */
	BeneficiaryId = 'beneficiaryId',
	/** column name */
	CreatedAt = 'createdAt',
	/** column name */
	Data = 'data',
	/** column name */
	Id = 'id',
	/** column name */
	Status = 'status',
	/** column name */
	StructureId = 'structureId',
	/** column name */
	UpdatedAt = 'updatedAt',
}

/** input type for updating data in table "beneficiary_structure" */
export type BeneficiaryStructureSetInput = {
	beneficiaryId?: InputMaybe<Scalars['uuid']>;
	createdAt?: InputMaybe<Scalars['timestamptz']>;
	data?: InputMaybe<Scalars['jsonb']>;
	id?: InputMaybe<Scalars['uuid']>;
	status?: InputMaybe<Scalars['String']>;
	structureId?: InputMaybe<Scalars['uuid']>;
	updatedAt?: InputMaybe<Scalars['timestamptz']>;
};

/** update columns of table "beneficiary_structure" */
export enum BeneficiaryStructureUpdateColumn {
	/** column name */
	BeneficiaryId = 'beneficiaryId',
	/** column name */
	CreatedAt = 'createdAt',
	/** column name */
	Data = 'data',
	/** column name */
	Id = 'id',
	/** column name */
	Status = 'status',
	/** column name */
	StructureId = 'structureId',
	/** column name */
	UpdatedAt = 'updatedAt',
}

/** update columns of table "beneficiary" */
export enum BeneficiaryUpdateColumn {
	/** column name */
	Address1 = 'address1',
	/** column name */
	Address2 = 'address2',
	/** column name */
	CafNumber = 'cafNumber',
	/** column name */
	City = 'city',
	/** column name */
	CreatedAt = 'createdAt',
	/** column name */
	DateOfBirth = 'dateOfBirth',
	/** column name */
	DeploymentId = 'deploymentId',
	/** column name */
	Email = 'email',
	/** column name */
	Firstname = 'firstname',
	/** column name */
	Id = 'id',
	/** column name */
	InternalId = 'internalId',
	/** column name */
	Lastname = 'lastname',
	/** column name */
	MobileNumber = 'mobileNumber',
	/** column name */
	NeedOrientation = 'needOrientation',
	/** column name */
	PeNumber = 'peNumber',
	/** column name */
	PlaceOfBirth = 'placeOfBirth',
	/** column name */
	PostalCode = 'postalCode',
	/** column name */
	UpdatedAt = 'updatedAt',
}

/** Boolean expression to compare columns of type "bigint". All fields are combined with logical 'AND'. */
export type BigintComparisonExp = {
	_eq?: InputMaybe<Scalars['bigint']>;
	_gt?: InputMaybe<Scalars['bigint']>;
	_gte?: InputMaybe<Scalars['bigint']>;
	_in?: InputMaybe<Array<Scalars['bigint']>>;
	_is_null?: InputMaybe<Scalars['Boolean']>;
	_lt?: InputMaybe<Scalars['bigint']>;
	_lte?: InputMaybe<Scalars['bigint']>;
	_neq?: InputMaybe<Scalars['bigint']>;
	_nin?: InputMaybe<Array<Scalars['bigint']>>;
};

/** Boolean expression to compare columns of type "citext". All fields are combined with logical 'AND'. */
export type CitextComparisonExp = {
	_eq?: InputMaybe<Scalars['citext']>;
	_gt?: InputMaybe<Scalars['citext']>;
	_gte?: InputMaybe<Scalars['citext']>;
	/** does the column match the given case-insensitive pattern */
	_ilike?: InputMaybe<Scalars['citext']>;
	_in?: InputMaybe<Array<Scalars['citext']>>;
	/** does the column match the given POSIX regular expression, case insensitive */
	_iregex?: InputMaybe<Scalars['citext']>;
	_is_null?: InputMaybe<Scalars['Boolean']>;
	/** does the column match the given pattern */
	_like?: InputMaybe<Scalars['citext']>;
	_lt?: InputMaybe<Scalars['citext']>;
	_lte?: InputMaybe<Scalars['citext']>;
	_neq?: InputMaybe<Scalars['citext']>;
	/** does the column NOT match the given case-insensitive pattern */
	_nilike?: InputMaybe<Scalars['citext']>;
	_nin?: InputMaybe<Array<Scalars['citext']>>;
	/** does the column NOT match the given POSIX regular expression, case insensitive */
	_niregex?: InputMaybe<Scalars['citext']>;
	/** does the column NOT match the given pattern */
	_nlike?: InputMaybe<Scalars['citext']>;
	/** does the column NOT match the given POSIX regular expression, case sensitive */
	_nregex?: InputMaybe<Scalars['citext']>;
	/** does the column NOT match the given SQL regular expression */
	_nsimilar?: InputMaybe<Scalars['citext']>;
	/** does the column match the given POSIX regular expression, case sensitive */
	_regex?: InputMaybe<Scalars['citext']>;
	/** does the column match the given SQL regular expression */
	_similar?: InputMaybe<Scalars['citext']>;
};

/** Boolean expression to compare columns of type "date". All fields are combined with logical 'AND'. */
export type DateComparisonExp = {
	_eq?: InputMaybe<Scalars['date']>;
	_gt?: InputMaybe<Scalars['date']>;
	_gte?: InputMaybe<Scalars['date']>;
	_in?: InputMaybe<Array<Scalars['date']>>;
	_is_null?: InputMaybe<Scalars['Boolean']>;
	_lt?: InputMaybe<Scalars['date']>;
	_lte?: InputMaybe<Scalars['date']>;
	_neq?: InputMaybe<Scalars['date']>;
	_nin?: InputMaybe<Array<Scalars['date']>>;
};

/**
 * list of carnet-de-bord deployments
 *
 *
 * columns and relationships of "deployment"
 *
 */
export type Deployment = {
	__typename?: 'deployment';
	/** An array relationship */
	admin_structures: Array<AdminStructure>;
	/** An aggregate relationship */
	admin_structures_aggregate: AdminStructureAggregate;
	/** An array relationship */
	beneficiaries: Array<Beneficiary>;
	/** An aggregate relationship */
	beneficiaries_aggregate: BeneficiaryAggregate;
	config?: Maybe<Scalars['jsonb']>;
	createdAt: Scalars['timestamptz'];
	id: Scalars['uuid'];
	label: Scalars['String'];
	/** An array relationship */
	managers: Array<Manager>;
	/** An aggregate relationship */
	managers_aggregate: ManagerAggregate;
	/** An array relationship */
	structures: Array<Structure>;
	/** An aggregate relationship */
	structures_aggregate: StructureAggregate;
	updatedAt: Scalars['timestamptz'];
};

/**
 * list of carnet-de-bord deployments
 *
 *
 * columns and relationships of "deployment"
 *
 */
export type DeploymentAdminStructuresArgs = {
	distinct_on?: InputMaybe<Array<AdminStructureSelectColumn>>;
	limit?: InputMaybe<Scalars['Int']>;
	offset?: InputMaybe<Scalars['Int']>;
	order_by?: InputMaybe<Array<AdminStructureOrderBy>>;
	where?: InputMaybe<AdminStructureBoolExp>;
};

/**
 * list of carnet-de-bord deployments
 *
 *
 * columns and relationships of "deployment"
 *
 */
export type DeploymentAdminStructuresAggregateArgs = {
	distinct_on?: InputMaybe<Array<AdminStructureSelectColumn>>;
	limit?: InputMaybe<Scalars['Int']>;
	offset?: InputMaybe<Scalars['Int']>;
	order_by?: InputMaybe<Array<AdminStructureOrderBy>>;
	where?: InputMaybe<AdminStructureBoolExp>;
};

/**
 * list of carnet-de-bord deployments
 *
 *
 * columns and relationships of "deployment"
 *
 */
export type DeploymentBeneficiariesArgs = {
	distinct_on?: InputMaybe<Array<BeneficiarySelectColumn>>;
	limit?: InputMaybe<Scalars['Int']>;
	offset?: InputMaybe<Scalars['Int']>;
	order_by?: InputMaybe<Array<BeneficiaryOrderBy>>;
	where?: InputMaybe<BeneficiaryBoolExp>;
};

/**
 * list of carnet-de-bord deployments
 *
 *
 * columns and relationships of "deployment"
 *
 */
export type DeploymentBeneficiariesAggregateArgs = {
	distinct_on?: InputMaybe<Array<BeneficiarySelectColumn>>;
	limit?: InputMaybe<Scalars['Int']>;
	offset?: InputMaybe<Scalars['Int']>;
	order_by?: InputMaybe<Array<BeneficiaryOrderBy>>;
	where?: InputMaybe<BeneficiaryBoolExp>;
};

/**
 * list of carnet-de-bord deployments
 *
 *
 * columns and relationships of "deployment"
 *
 */
export type DeploymentConfigArgs = {
	path?: InputMaybe<Scalars['String']>;
};

/**
 * list of carnet-de-bord deployments
 *
 *
 * columns and relationships of "deployment"
 *
 */
export type DeploymentManagersArgs = {
	distinct_on?: InputMaybe<Array<ManagerSelectColumn>>;
	limit?: InputMaybe<Scalars['Int']>;
	offset?: InputMaybe<Scalars['Int']>;
	order_by?: InputMaybe<Array<ManagerOrderBy>>;
	where?: InputMaybe<ManagerBoolExp>;
};

/**
 * list of carnet-de-bord deployments
 *
 *
 * columns and relationships of "deployment"
 *
 */
export type DeploymentManagersAggregateArgs = {
	distinct_on?: InputMaybe<Array<ManagerSelectColumn>>;
	limit?: InputMaybe<Scalars['Int']>;
	offset?: InputMaybe<Scalars['Int']>;
	order_by?: InputMaybe<Array<ManagerOrderBy>>;
	where?: InputMaybe<ManagerBoolExp>;
};

/**
 * list of carnet-de-bord deployments
 *
 *
 * columns and relationships of "deployment"
 *
 */
export type DeploymentStructuresArgs = {
	distinct_on?: InputMaybe<Array<StructureSelectColumn>>;
	limit?: InputMaybe<Scalars['Int']>;
	offset?: InputMaybe<Scalars['Int']>;
	order_by?: InputMaybe<Array<StructureOrderBy>>;
	where?: InputMaybe<StructureBoolExp>;
};

/**
 * list of carnet-de-bord deployments
 *
 *
 * columns and relationships of "deployment"
 *
 */
export type DeploymentStructuresAggregateArgs = {
	distinct_on?: InputMaybe<Array<StructureSelectColumn>>;
	limit?: InputMaybe<Scalars['Int']>;
	offset?: InputMaybe<Scalars['Int']>;
	order_by?: InputMaybe<Array<StructureOrderBy>>;
	where?: InputMaybe<StructureBoolExp>;
};

/** aggregated selection of "deployment" */
export type DeploymentAggregate = {
	__typename?: 'deployment_aggregate';
	aggregate?: Maybe<DeploymentAggregateFields>;
	nodes: Array<Deployment>;
};

/** aggregate fields of "deployment" */
export type DeploymentAggregateFields = {
	__typename?: 'deployment_aggregate_fields';
	count: Scalars['Int'];
	max?: Maybe<DeploymentMaxFields>;
	min?: Maybe<DeploymentMinFields>;
};

/** aggregate fields of "deployment" */
export type DeploymentAggregateFieldsCountArgs = {
	columns?: InputMaybe<Array<DeploymentSelectColumn>>;
	distinct?: InputMaybe<Scalars['Boolean']>;
};

/** append existing jsonb value of filtered columns with new jsonb value */
export type DeploymentAppendInput = {
	config?: InputMaybe<Scalars['jsonb']>;
};

/** Boolean expression to filter rows from the table "deployment". All fields are combined with a logical 'AND'. */
export type DeploymentBoolExp = {
	_and?: InputMaybe<Array<DeploymentBoolExp>>;
	_not?: InputMaybe<DeploymentBoolExp>;
	_or?: InputMaybe<Array<DeploymentBoolExp>>;
	admin_structures?: InputMaybe<AdminStructureBoolExp>;
	beneficiaries?: InputMaybe<BeneficiaryBoolExp>;
	config?: InputMaybe<JsonbComparisonExp>;
	createdAt?: InputMaybe<TimestamptzComparisonExp>;
	id?: InputMaybe<UuidComparisonExp>;
	label?: InputMaybe<StringComparisonExp>;
	managers?: InputMaybe<ManagerBoolExp>;
	structures?: InputMaybe<StructureBoolExp>;
	updatedAt?: InputMaybe<TimestamptzComparisonExp>;
};

/** unique or primary key constraints on table "deployment" */
export enum DeploymentConstraint {
	/** unique or primary key constraint */
	DeploymentPkey = 'deployment_pkey',
}

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export type DeploymentDeleteAtPathInput = {
	config?: InputMaybe<Array<Scalars['String']>>;
};

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export type DeploymentDeleteElemInput = {
	config?: InputMaybe<Scalars['Int']>;
};

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export type DeploymentDeleteKeyInput = {
	config?: InputMaybe<Scalars['String']>;
};

/** input type for inserting data into table "deployment" */
export type DeploymentInsertInput = {
	admin_structures?: InputMaybe<AdminStructureArrRelInsertInput>;
	beneficiaries?: InputMaybe<BeneficiaryArrRelInsertInput>;
	config?: InputMaybe<Scalars['jsonb']>;
	createdAt?: InputMaybe<Scalars['timestamptz']>;
	id?: InputMaybe<Scalars['uuid']>;
	label?: InputMaybe<Scalars['String']>;
	managers?: InputMaybe<ManagerArrRelInsertInput>;
	structures?: InputMaybe<StructureArrRelInsertInput>;
	updatedAt?: InputMaybe<Scalars['timestamptz']>;
};

/** aggregate max on columns */
export type DeploymentMaxFields = {
	__typename?: 'deployment_max_fields';
	createdAt?: Maybe<Scalars['timestamptz']>;
	id?: Maybe<Scalars['uuid']>;
	label?: Maybe<Scalars['String']>;
	updatedAt?: Maybe<Scalars['timestamptz']>;
};

/** aggregate min on columns */
export type DeploymentMinFields = {
	__typename?: 'deployment_min_fields';
	createdAt?: Maybe<Scalars['timestamptz']>;
	id?: Maybe<Scalars['uuid']>;
	label?: Maybe<Scalars['String']>;
	updatedAt?: Maybe<Scalars['timestamptz']>;
};

/** response of any mutation on the table "deployment" */
export type DeploymentMutationResponse = {
	__typename?: 'deployment_mutation_response';
	/** number of rows affected by the mutation */
	affected_rows: Scalars['Int'];
	/** data from the rows affected by the mutation */
	returning: Array<Deployment>;
};

/** input type for inserting object relation for remote table "deployment" */
export type DeploymentObjRelInsertInput = {
	data: DeploymentInsertInput;
	/** on conflict condition */
	on_conflict?: InputMaybe<DeploymentOnConflict>;
};

/** on conflict condition type for table "deployment" */
export type DeploymentOnConflict = {
	constraint: DeploymentConstraint;
	update_columns?: Array<DeploymentUpdateColumn>;
	where?: InputMaybe<DeploymentBoolExp>;
};

/** Ordering options when selecting data from "deployment". */
export type DeploymentOrderBy = {
	admin_structures_aggregate?: InputMaybe<AdminStructureAggregateOrderBy>;
	beneficiaries_aggregate?: InputMaybe<BeneficiaryAggregateOrderBy>;
	config?: InputMaybe<OrderBy>;
	createdAt?: InputMaybe<OrderBy>;
	id?: InputMaybe<OrderBy>;
	label?: InputMaybe<OrderBy>;
	managers_aggregate?: InputMaybe<ManagerAggregateOrderBy>;
	structures_aggregate?: InputMaybe<StructureAggregateOrderBy>;
	updatedAt?: InputMaybe<OrderBy>;
};

/** primary key columns input for table: deployment */
export type DeploymentPkColumnsInput = {
	id: Scalars['uuid'];
};

/** prepend existing jsonb value of filtered columns with new jsonb value */
export type DeploymentPrependInput = {
	config?: InputMaybe<Scalars['jsonb']>;
};

/** select columns of table "deployment" */
export enum DeploymentSelectColumn {
	/** column name */
	Config = 'config',
	/** column name */
	CreatedAt = 'createdAt',
	/** column name */
	Id = 'id',
	/** column name */
	Label = 'label',
	/** column name */
	UpdatedAt = 'updatedAt',
}

/** input type for updating data in table "deployment" */
export type DeploymentSetInput = {
	config?: InputMaybe<Scalars['jsonb']>;
	createdAt?: InputMaybe<Scalars['timestamptz']>;
	id?: InputMaybe<Scalars['uuid']>;
	label?: InputMaybe<Scalars['String']>;
	updatedAt?: InputMaybe<Scalars['timestamptz']>;
};

/** update columns of table "deployment" */
export enum DeploymentUpdateColumn {
	/** column name */
	Config = 'config',
	/** column name */
	CreatedAt = 'createdAt',
	/** column name */
	Id = 'id',
	/** column name */
	Label = 'label',
	/** column name */
	UpdatedAt = 'updatedAt',
}

/** Boolean expression to compare columns of type "jsonb". All fields are combined with logical 'AND'. */
export type JsonbComparisonExp = {
	/** is the column contained in the given json value */
	_contained_in?: InputMaybe<Scalars['jsonb']>;
	/** does the column contain the given json value at the top level */
	_contains?: InputMaybe<Scalars['jsonb']>;
	_eq?: InputMaybe<Scalars['jsonb']>;
	_gt?: InputMaybe<Scalars['jsonb']>;
	_gte?: InputMaybe<Scalars['jsonb']>;
	/** does the string exist as a top-level key in the column */
	_has_key?: InputMaybe<Scalars['String']>;
	/** do all of these strings exist as top-level keys in the column */
	_has_keys_all?: InputMaybe<Array<Scalars['String']>>;
	/** do any of these strings exist as top-level keys in the column */
	_has_keys_any?: InputMaybe<Array<Scalars['String']>>;
	_in?: InputMaybe<Array<Scalars['jsonb']>>;
	_is_null?: InputMaybe<Scalars['Boolean']>;
	_lt?: InputMaybe<Scalars['jsonb']>;
	_lte?: InputMaybe<Scalars['jsonb']>;
	_neq?: InputMaybe<Scalars['jsonb']>;
	_nin?: InputMaybe<Array<Scalars['jsonb']>>;
};

/**
 * A manager handle structure and professional for a given deployment
 *
 *
 * columns and relationships of "manager"
 *
 */
export type Manager = {
	__typename?: 'manager';
	/** An object relationship */
	account?: Maybe<Account>;
	createdAt: Scalars['timestamptz'];
	/** An object relationship */
	deployment?: Maybe<Deployment>;
	deploymentId?: Maybe<Scalars['uuid']>;
	email: Scalars['citext'];
	firstname?: Maybe<Scalars['String']>;
	id: Scalars['uuid'];
	lastname?: Maybe<Scalars['String']>;
	updatedAt: Scalars['timestamptz'];
};

/** aggregated selection of "manager" */
export type ManagerAggregate = {
	__typename?: 'manager_aggregate';
	aggregate?: Maybe<ManagerAggregateFields>;
	nodes: Array<Manager>;
};

/** aggregate fields of "manager" */
export type ManagerAggregateFields = {
	__typename?: 'manager_aggregate_fields';
	count: Scalars['Int'];
	max?: Maybe<ManagerMaxFields>;
	min?: Maybe<ManagerMinFields>;
};

/** aggregate fields of "manager" */
export type ManagerAggregateFieldsCountArgs = {
	columns?: InputMaybe<Array<ManagerSelectColumn>>;
	distinct?: InputMaybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "manager" */
export type ManagerAggregateOrderBy = {
	count?: InputMaybe<OrderBy>;
	max?: InputMaybe<ManagerMaxOrderBy>;
	min?: InputMaybe<ManagerMinOrderBy>;
};

/** input type for inserting array relation for remote table "manager" */
export type ManagerArrRelInsertInput = {
	data: Array<ManagerInsertInput>;
	/** on conflict condition */
	on_conflict?: InputMaybe<ManagerOnConflict>;
};

/** Boolean expression to filter rows from the table "manager". All fields are combined with a logical 'AND'. */
export type ManagerBoolExp = {
	_and?: InputMaybe<Array<ManagerBoolExp>>;
	_not?: InputMaybe<ManagerBoolExp>;
	_or?: InputMaybe<Array<ManagerBoolExp>>;
	account?: InputMaybe<AccountBoolExp>;
	createdAt?: InputMaybe<TimestamptzComparisonExp>;
	deployment?: InputMaybe<DeploymentBoolExp>;
	deploymentId?: InputMaybe<UuidComparisonExp>;
	email?: InputMaybe<CitextComparisonExp>;
	firstname?: InputMaybe<StringComparisonExp>;
	id?: InputMaybe<UuidComparisonExp>;
	lastname?: InputMaybe<StringComparisonExp>;
	updatedAt?: InputMaybe<TimestamptzComparisonExp>;
};

/** unique or primary key constraints on table "manager" */
export enum ManagerConstraint {
	/** unique or primary key constraint */
	ManagerEmailKey = 'manager_email_key',
	/** unique or primary key constraint */
	ManagerPkey = 'manager_pkey',
}

/** input type for inserting data into table "manager" */
export type ManagerInsertInput = {
	account?: InputMaybe<AccountObjRelInsertInput>;
	createdAt?: InputMaybe<Scalars['timestamptz']>;
	deployment?: InputMaybe<DeploymentObjRelInsertInput>;
	deploymentId?: InputMaybe<Scalars['uuid']>;
	email?: InputMaybe<Scalars['citext']>;
	firstname?: InputMaybe<Scalars['String']>;
	id?: InputMaybe<Scalars['uuid']>;
	lastname?: InputMaybe<Scalars['String']>;
	updatedAt?: InputMaybe<Scalars['timestamptz']>;
};

/** aggregate max on columns */
export type ManagerMaxFields = {
	__typename?: 'manager_max_fields';
	createdAt?: Maybe<Scalars['timestamptz']>;
	deploymentId?: Maybe<Scalars['uuid']>;
	email?: Maybe<Scalars['citext']>;
	firstname?: Maybe<Scalars['String']>;
	id?: Maybe<Scalars['uuid']>;
	lastname?: Maybe<Scalars['String']>;
	updatedAt?: Maybe<Scalars['timestamptz']>;
};

/** order by max() on columns of table "manager" */
export type ManagerMaxOrderBy = {
	createdAt?: InputMaybe<OrderBy>;
	deploymentId?: InputMaybe<OrderBy>;
	email?: InputMaybe<OrderBy>;
	firstname?: InputMaybe<OrderBy>;
	id?: InputMaybe<OrderBy>;
	lastname?: InputMaybe<OrderBy>;
	updatedAt?: InputMaybe<OrderBy>;
};

/** aggregate min on columns */
export type ManagerMinFields = {
	__typename?: 'manager_min_fields';
	createdAt?: Maybe<Scalars['timestamptz']>;
	deploymentId?: Maybe<Scalars['uuid']>;
	email?: Maybe<Scalars['citext']>;
	firstname?: Maybe<Scalars['String']>;
	id?: Maybe<Scalars['uuid']>;
	lastname?: Maybe<Scalars['String']>;
	updatedAt?: Maybe<Scalars['timestamptz']>;
};

/** order by min() on columns of table "manager" */
export type ManagerMinOrderBy = {
	createdAt?: InputMaybe<OrderBy>;
	deploymentId?: InputMaybe<OrderBy>;
	email?: InputMaybe<OrderBy>;
	firstname?: InputMaybe<OrderBy>;
	id?: InputMaybe<OrderBy>;
	lastname?: InputMaybe<OrderBy>;
	updatedAt?: InputMaybe<OrderBy>;
};

/** response of any mutation on the table "manager" */
export type ManagerMutationResponse = {
	__typename?: 'manager_mutation_response';
	/** number of rows affected by the mutation */
	affected_rows: Scalars['Int'];
	/** data from the rows affected by the mutation */
	returning: Array<Manager>;
};

/** input type for inserting object relation for remote table "manager" */
export type ManagerObjRelInsertInput = {
	data: ManagerInsertInput;
	/** on conflict condition */
	on_conflict?: InputMaybe<ManagerOnConflict>;
};

/** on conflict condition type for table "manager" */
export type ManagerOnConflict = {
	constraint: ManagerConstraint;
	update_columns?: Array<ManagerUpdateColumn>;
	where?: InputMaybe<ManagerBoolExp>;
};

/** Ordering options when selecting data from "manager". */
export type ManagerOrderBy = {
	account?: InputMaybe<AccountOrderBy>;
	createdAt?: InputMaybe<OrderBy>;
	deployment?: InputMaybe<DeploymentOrderBy>;
	deploymentId?: InputMaybe<OrderBy>;
	email?: InputMaybe<OrderBy>;
	firstname?: InputMaybe<OrderBy>;
	id?: InputMaybe<OrderBy>;
	lastname?: InputMaybe<OrderBy>;
	updatedAt?: InputMaybe<OrderBy>;
};

/** primary key columns input for table: manager */
export type ManagerPkColumnsInput = {
	id: Scalars['uuid'];
};

/** select columns of table "manager" */
export enum ManagerSelectColumn {
	/** column name */
	CreatedAt = 'createdAt',
	/** column name */
	DeploymentId = 'deploymentId',
	/** column name */
	Email = 'email',
	/** column name */
	Firstname = 'firstname',
	/** column name */
	Id = 'id',
	/** column name */
	Lastname = 'lastname',
	/** column name */
	UpdatedAt = 'updatedAt',
}

/** input type for updating data in table "manager" */
export type ManagerSetInput = {
	createdAt?: InputMaybe<Scalars['timestamptz']>;
	deploymentId?: InputMaybe<Scalars['uuid']>;
	email?: InputMaybe<Scalars['citext']>;
	firstname?: InputMaybe<Scalars['String']>;
	id?: InputMaybe<Scalars['uuid']>;
	lastname?: InputMaybe<Scalars['String']>;
	updatedAt?: InputMaybe<Scalars['timestamptz']>;
};

/** update columns of table "manager" */
export enum ManagerUpdateColumn {
	/** column name */
	CreatedAt = 'createdAt',
	/** column name */
	DeploymentId = 'deploymentId',
	/** column name */
	Email = 'email',
	/** column name */
	Firstname = 'firstname',
	/** column name */
	Id = 'id',
	/** column name */
	Lastname = 'lastname',
	/** column name */
	UpdatedAt = 'updatedAt',
}

/** mutation root */
export type MutationRoot = {
	__typename?: 'mutation_root';
	createDeploymentWithEmail?: Maybe<CreateDeploymentOutput>;
	/** delete data from the table: "account" */
	delete_account?: Maybe<AccountMutationResponse>;
	/** delete single row from the table: "account" */
	delete_account_by_pk?: Maybe<Account>;
	/** delete data from the table: "admin_cdb" */
	delete_admin_cdb?: Maybe<AdminCdbMutationResponse>;
	/** delete single row from the table: "admin_cdb" */
	delete_admin_cdb_by_pk?: Maybe<AdminCdb>;
	/** delete data from the table: "admin_structure" */
	delete_admin_structure?: Maybe<AdminStructureMutationResponse>;
	/** delete single row from the table: "admin_structure" */
	delete_admin_structure_by_pk?: Maybe<AdminStructure>;
	/** delete data from the table: "admin_structure_structure" */
	delete_admin_structure_structure?: Maybe<AdminStructureStructureMutationResponse>;
	/** delete single row from the table: "admin_structure_structure" */
	delete_admin_structure_structure_by_pk?: Maybe<AdminStructureStructure>;
	/** delete data from the table: "beneficiary" */
	delete_beneficiary?: Maybe<BeneficiaryMutationResponse>;
	/** delete single row from the table: "beneficiary" */
	delete_beneficiary_by_pk?: Maybe<Beneficiary>;
	/** delete data from the table: "beneficiary_structure" */
	delete_beneficiary_structure?: Maybe<BeneficiaryStructureMutationResponse>;
	/** delete single row from the table: "beneficiary_structure" */
	delete_beneficiary_structure_by_pk?: Maybe<BeneficiaryStructure>;
	/** delete data from the table: "deployment" */
	delete_deployment?: Maybe<DeploymentMutationResponse>;
	/** delete single row from the table: "deployment" */
	delete_deployment_by_pk?: Maybe<Deployment>;
	/** delete data from the table: "manager" */
	delete_manager?: Maybe<ManagerMutationResponse>;
	/** delete single row from the table: "manager" */
	delete_manager_by_pk?: Maybe<Manager>;
	/** delete data from the table: "notebook" */
	delete_notebook?: Maybe<NotebookMutationResponse>;
	/** delete data from the table: "notebook_action" */
	delete_notebook_action?: Maybe<NotebookActionMutationResponse>;
	/** delete single row from the table: "notebook_action" */
	delete_notebook_action_by_pk?: Maybe<NotebookAction>;
	/** delete data from the table: "notebook_appointment" */
	delete_notebook_appointment?: Maybe<NotebookAppointmentMutationResponse>;
	/** delete single row from the table: "notebook_appointment" */
	delete_notebook_appointment_by_pk?: Maybe<NotebookAppointment>;
	/** delete single row from the table: "notebook" */
	delete_notebook_by_pk?: Maybe<Notebook>;
	/** delete data from the table: "notebook_event" */
	delete_notebook_event?: Maybe<NotebookEventMutationResponse>;
	/** delete single row from the table: "notebook_event" */
	delete_notebook_event_by_pk?: Maybe<NotebookEvent>;
	/** delete data from the table: "notebook_event_type" */
	delete_notebook_event_type?: Maybe<NotebookEventTypeMutationResponse>;
	/** delete single row from the table: "notebook_event_type" */
	delete_notebook_event_type_by_pk?: Maybe<NotebookEventType>;
	/** delete data from the table: "notebook_focus" */
	delete_notebook_focus?: Maybe<NotebookFocusMutationResponse>;
	/** delete single row from the table: "notebook_focus" */
	delete_notebook_focus_by_pk?: Maybe<NotebookFocus>;
	/** delete data from the table: "notebook_member" */
	delete_notebook_member?: Maybe<NotebookMemberMutationResponse>;
	/** delete single row from the table: "notebook_member" */
	delete_notebook_member_by_pk?: Maybe<NotebookMember>;
	/** delete data from the table: "notebook_target" */
	delete_notebook_target?: Maybe<NotebookTargetMutationResponse>;
	/** delete single row from the table: "notebook_target" */
	delete_notebook_target_by_pk?: Maybe<NotebookTarget>;
	/** delete data from the table: "professional" */
	delete_professional?: Maybe<ProfessionalMutationResponse>;
	/** delete single row from the table: "professional" */
	delete_professional_by_pk?: Maybe<Professional>;
	/** delete data from the table: "ref_action" */
	delete_ref_action?: Maybe<RefActionMutationResponse>;
	/** delete single row from the table: "ref_action" */
	delete_ref_action_by_pk?: Maybe<RefAction>;
	/** delete data from the table: "ref_situation" */
	delete_ref_situation?: Maybe<RefSituationMutationResponse>;
	/** delete single row from the table: "ref_situation" */
	delete_ref_situation_by_pk?: Maybe<RefSituation>;
	/** delete data from the table: "ref_target" */
	delete_ref_target?: Maybe<RefTargetMutationResponse>;
	/** delete single row from the table: "ref_target" */
	delete_ref_target_by_pk?: Maybe<RefTarget>;
	/** delete data from the table: "rome_code" */
	delete_rome_code?: Maybe<RomeCodeMutationResponse>;
	/** delete single row from the table: "rome_code" */
	delete_rome_code_by_pk?: Maybe<RomeCode>;
	/** delete data from the table: "structure" */
	delete_structure?: Maybe<StructureMutationResponse>;
	/** delete single row from the table: "structure" */
	delete_structure_by_pk?: Maybe<Structure>;
	/** delete data from the table: "wanted_job" */
	delete_wanted_job?: Maybe<WantedJobMutationResponse>;
	/** delete single row from the table: "wanted_job" */
	delete_wanted_job_by_pk?: Maybe<WantedJob>;
	insertStructureWithAdmin?: Maybe<InsertStructureWithAdminOutput>;
	/** insert data into the table: "account" */
	insert_account?: Maybe<AccountMutationResponse>;
	/** insert a single row into the table: "account" */
	insert_account_one?: Maybe<Account>;
	/** insert data into the table: "admin_cdb" */
	insert_admin_cdb?: Maybe<AdminCdbMutationResponse>;
	/** insert a single row into the table: "admin_cdb" */
	insert_admin_cdb_one?: Maybe<AdminCdb>;
	/** insert data into the table: "admin_structure" */
	insert_admin_structure?: Maybe<AdminStructureMutationResponse>;
	/** insert a single row into the table: "admin_structure" */
	insert_admin_structure_one?: Maybe<AdminStructure>;
	/** insert data into the table: "admin_structure_structure" */
	insert_admin_structure_structure?: Maybe<AdminStructureStructureMutationResponse>;
	/** insert a single row into the table: "admin_structure_structure" */
	insert_admin_structure_structure_one?: Maybe<AdminStructureStructure>;
	/** insert data into the table: "beneficiary" */
	insert_beneficiary?: Maybe<BeneficiaryMutationResponse>;
	/** insert a single row into the table: "beneficiary" */
	insert_beneficiary_one?: Maybe<Beneficiary>;
	/** insert data into the table: "beneficiary_structure" */
	insert_beneficiary_structure?: Maybe<BeneficiaryStructureMutationResponse>;
	/** insert a single row into the table: "beneficiary_structure" */
	insert_beneficiary_structure_one?: Maybe<BeneficiaryStructure>;
	/** insert data into the table: "deployment" */
	insert_deployment?: Maybe<DeploymentMutationResponse>;
	/** insert a single row into the table: "deployment" */
	insert_deployment_one?: Maybe<Deployment>;
	/** insert data into the table: "manager" */
	insert_manager?: Maybe<ManagerMutationResponse>;
	/** insert a single row into the table: "manager" */
	insert_manager_one?: Maybe<Manager>;
	/** insert data into the table: "notebook" */
	insert_notebook?: Maybe<NotebookMutationResponse>;
	/** insert data into the table: "notebook_action" */
	insert_notebook_action?: Maybe<NotebookActionMutationResponse>;
	/** insert a single row into the table: "notebook_action" */
	insert_notebook_action_one?: Maybe<NotebookAction>;
	/** insert data into the table: "notebook_appointment" */
	insert_notebook_appointment?: Maybe<NotebookAppointmentMutationResponse>;
	/** insert a single row into the table: "notebook_appointment" */
	insert_notebook_appointment_one?: Maybe<NotebookAppointment>;
	/** insert data into the table: "notebook_event" */
	insert_notebook_event?: Maybe<NotebookEventMutationResponse>;
	/** insert a single row into the table: "notebook_event" */
	insert_notebook_event_one?: Maybe<NotebookEvent>;
	/** insert data into the table: "notebook_event_type" */
	insert_notebook_event_type?: Maybe<NotebookEventTypeMutationResponse>;
	/** insert a single row into the table: "notebook_event_type" */
	insert_notebook_event_type_one?: Maybe<NotebookEventType>;
	/** insert data into the table: "notebook_focus" */
	insert_notebook_focus?: Maybe<NotebookFocusMutationResponse>;
	/** insert a single row into the table: "notebook_focus" */
	insert_notebook_focus_one?: Maybe<NotebookFocus>;
	/** insert data into the table: "notebook_member" */
	insert_notebook_member?: Maybe<NotebookMemberMutationResponse>;
	/** insert a single row into the table: "notebook_member" */
	insert_notebook_member_one?: Maybe<NotebookMember>;
	/** insert a single row into the table: "notebook" */
	insert_notebook_one?: Maybe<Notebook>;
	/** insert data into the table: "notebook_target" */
	insert_notebook_target?: Maybe<NotebookTargetMutationResponse>;
	/** insert a single row into the table: "notebook_target" */
	insert_notebook_target_one?: Maybe<NotebookTarget>;
	/** insert data into the table: "professional" */
	insert_professional?: Maybe<ProfessionalMutationResponse>;
	/** insert a single row into the table: "professional" */
	insert_professional_one?: Maybe<Professional>;
	/** insert data into the table: "ref_action" */
	insert_ref_action?: Maybe<RefActionMutationResponse>;
	/** insert a single row into the table: "ref_action" */
	insert_ref_action_one?: Maybe<RefAction>;
	/** insert data into the table: "ref_situation" */
	insert_ref_situation?: Maybe<RefSituationMutationResponse>;
	/** insert a single row into the table: "ref_situation" */
	insert_ref_situation_one?: Maybe<RefSituation>;
	/** insert data into the table: "ref_target" */
	insert_ref_target?: Maybe<RefTargetMutationResponse>;
	/** insert a single row into the table: "ref_target" */
	insert_ref_target_one?: Maybe<RefTarget>;
	/** insert data into the table: "rome_code" */
	insert_rome_code?: Maybe<RomeCodeMutationResponse>;
	/** insert a single row into the table: "rome_code" */
	insert_rome_code_one?: Maybe<RomeCode>;
	/** insert data into the table: "structure" */
	insert_structure?: Maybe<StructureMutationResponse>;
	/** insert a single row into the table: "structure" */
	insert_structure_one?: Maybe<Structure>;
	/** insert data into the table: "wanted_job" */
	insert_wanted_job?: Maybe<WantedJobMutationResponse>;
	/** insert a single row into the table: "wanted_job" */
	insert_wanted_job_one?: Maybe<WantedJob>;
	updateNotebookAct?: Maybe<UpdateNotebookOutput>;
	/** update data of the table: "account" */
	update_account?: Maybe<AccountMutationResponse>;
	/** update single row of the table: "account" */
	update_account_by_pk?: Maybe<Account>;
	/** update data of the table: "admin_cdb" */
	update_admin_cdb?: Maybe<AdminCdbMutationResponse>;
	/** update single row of the table: "admin_cdb" */
	update_admin_cdb_by_pk?: Maybe<AdminCdb>;
	/** update data of the table: "admin_structure" */
	update_admin_structure?: Maybe<AdminStructureMutationResponse>;
	/** update single row of the table: "admin_structure" */
	update_admin_structure_by_pk?: Maybe<AdminStructure>;
	/** update data of the table: "admin_structure_structure" */
	update_admin_structure_structure?: Maybe<AdminStructureStructureMutationResponse>;
	/** update single row of the table: "admin_structure_structure" */
	update_admin_structure_structure_by_pk?: Maybe<AdminStructureStructure>;
	/** update data of the table: "beneficiary" */
	update_beneficiary?: Maybe<BeneficiaryMutationResponse>;
	/** update single row of the table: "beneficiary" */
	update_beneficiary_by_pk?: Maybe<Beneficiary>;
	/** update data of the table: "beneficiary_structure" */
	update_beneficiary_structure?: Maybe<BeneficiaryStructureMutationResponse>;
	/** update single row of the table: "beneficiary_structure" */
	update_beneficiary_structure_by_pk?: Maybe<BeneficiaryStructure>;
	/** update data of the table: "deployment" */
	update_deployment?: Maybe<DeploymentMutationResponse>;
	/** update single row of the table: "deployment" */
	update_deployment_by_pk?: Maybe<Deployment>;
	/** update data of the table: "manager" */
	update_manager?: Maybe<ManagerMutationResponse>;
	/** update single row of the table: "manager" */
	update_manager_by_pk?: Maybe<Manager>;
	/** update data of the table: "notebook" */
	update_notebook?: Maybe<NotebookMutationResponse>;
	/** update data of the table: "notebook_action" */
	update_notebook_action?: Maybe<NotebookActionMutationResponse>;
	/** update single row of the table: "notebook_action" */
	update_notebook_action_by_pk?: Maybe<NotebookAction>;
	/** update data of the table: "notebook_appointment" */
	update_notebook_appointment?: Maybe<NotebookAppointmentMutationResponse>;
	/** update single row of the table: "notebook_appointment" */
	update_notebook_appointment_by_pk?: Maybe<NotebookAppointment>;
	/** update single row of the table: "notebook" */
	update_notebook_by_pk?: Maybe<Notebook>;
	/** update data of the table: "notebook_event" */
	update_notebook_event?: Maybe<NotebookEventMutationResponse>;
	/** update single row of the table: "notebook_event" */
	update_notebook_event_by_pk?: Maybe<NotebookEvent>;
	/** update data of the table: "notebook_event_type" */
	update_notebook_event_type?: Maybe<NotebookEventTypeMutationResponse>;
	/** update single row of the table: "notebook_event_type" */
	update_notebook_event_type_by_pk?: Maybe<NotebookEventType>;
	/** update data of the table: "notebook_focus" */
	update_notebook_focus?: Maybe<NotebookFocusMutationResponse>;
	/** update single row of the table: "notebook_focus" */
	update_notebook_focus_by_pk?: Maybe<NotebookFocus>;
	/** update data of the table: "notebook_member" */
	update_notebook_member?: Maybe<NotebookMemberMutationResponse>;
	/** update single row of the table: "notebook_member" */
	update_notebook_member_by_pk?: Maybe<NotebookMember>;
	/** update data of the table: "notebook_target" */
	update_notebook_target?: Maybe<NotebookTargetMutationResponse>;
	/** update single row of the table: "notebook_target" */
	update_notebook_target_by_pk?: Maybe<NotebookTarget>;
	/** update data of the table: "professional" */
	update_professional?: Maybe<ProfessionalMutationResponse>;
	/** update single row of the table: "professional" */
	update_professional_by_pk?: Maybe<Professional>;
	/** update data of the table: "ref_action" */
	update_ref_action?: Maybe<RefActionMutationResponse>;
	/** update single row of the table: "ref_action" */
	update_ref_action_by_pk?: Maybe<RefAction>;
	/** update data of the table: "ref_situation" */
	update_ref_situation?: Maybe<RefSituationMutationResponse>;
	/** update single row of the table: "ref_situation" */
	update_ref_situation_by_pk?: Maybe<RefSituation>;
	/** update data of the table: "ref_target" */
	update_ref_target?: Maybe<RefTargetMutationResponse>;
	/** update single row of the table: "ref_target" */
	update_ref_target_by_pk?: Maybe<RefTarget>;
	/** update data of the table: "rome_code" */
	update_rome_code?: Maybe<RomeCodeMutationResponse>;
	/** update single row of the table: "rome_code" */
	update_rome_code_by_pk?: Maybe<RomeCode>;
	/** update data of the table: "structure" */
	update_structure?: Maybe<StructureMutationResponse>;
	/** update single row of the table: "structure" */
	update_structure_by_pk?: Maybe<Structure>;
	/** update data of the table: "wanted_job" */
	update_wanted_job?: Maybe<WantedJobMutationResponse>;
	/** update single row of the table: "wanted_job" */
	update_wanted_job_by_pk?: Maybe<WantedJob>;
};

/** mutation root */
export type MutationRootCreateDeploymentWithEmailArgs = {
	deployment: Scalars['String'];
	email: Scalars['citext'];
};

/** mutation root */
export type MutationRootDeleteAccountArgs = {
	where: AccountBoolExp;
};

/** mutation root */
export type MutationRootDeleteAccountByPkArgs = {
	id: Scalars['uuid'];
};

/** mutation root */
export type MutationRootDeleteAdminCdbArgs = {
	where: AdminCdbBoolExp;
};

/** mutation root */
export type MutationRootDeleteAdminCdbByPkArgs = {
	id: Scalars['uuid'];
};

/** mutation root */
export type MutationRootDeleteAdminStructureArgs = {
	where: AdminStructureBoolExp;
};

/** mutation root */
export type MutationRootDeleteAdminStructureByPkArgs = {
	id: Scalars['uuid'];
};

/** mutation root */
export type MutationRootDeleteAdminStructureStructureArgs = {
	where: AdminStructureStructureBoolExp;
};

/** mutation root */
export type MutationRootDeleteAdminStructureStructureByPkArgs = {
	id: Scalars['uuid'];
};

/** mutation root */
export type MutationRootDeleteBeneficiaryArgs = {
	where: BeneficiaryBoolExp;
};

/** mutation root */
export type MutationRootDeleteBeneficiaryByPkArgs = {
	id: Scalars['uuid'];
};

/** mutation root */
export type MutationRootDeleteBeneficiaryStructureArgs = {
	where: BeneficiaryStructureBoolExp;
};

/** mutation root */
export type MutationRootDeleteBeneficiaryStructureByPkArgs = {
	id: Scalars['uuid'];
};

/** mutation root */
export type MutationRootDeleteDeploymentArgs = {
	where: DeploymentBoolExp;
};

/** mutation root */
export type MutationRootDeleteDeploymentByPkArgs = {
	id: Scalars['uuid'];
};

/** mutation root */
export type MutationRootDeleteManagerArgs = {
	where: ManagerBoolExp;
};

/** mutation root */
export type MutationRootDeleteManagerByPkArgs = {
	id: Scalars['uuid'];
};

/** mutation root */
export type MutationRootDeleteNotebookArgs = {
	where: NotebookBoolExp;
};

/** mutation root */
export type MutationRootDeleteNotebookActionArgs = {
	where: NotebookActionBoolExp;
};

/** mutation root */
export type MutationRootDeleteNotebookActionByPkArgs = {
	id: Scalars['uuid'];
};

/** mutation root */
export type MutationRootDeleteNotebookAppointmentArgs = {
	where: NotebookAppointmentBoolExp;
};

/** mutation root */
export type MutationRootDeleteNotebookAppointmentByPkArgs = {
	id: Scalars['uuid'];
};

/** mutation root */
export type MutationRootDeleteNotebookByPkArgs = {
	id: Scalars['uuid'];
};

/** mutation root */
export type MutationRootDeleteNotebookEventArgs = {
	where: NotebookEventBoolExp;
};

/** mutation root */
export type MutationRootDeleteNotebookEventByPkArgs = {
	id: Scalars['uuid'];
};

/** mutation root */
export type MutationRootDeleteNotebookEventTypeArgs = {
	where: NotebookEventTypeBoolExp;
};

/** mutation root */
export type MutationRootDeleteNotebookEventTypeByPkArgs = {
	value: Scalars['String'];
};

/** mutation root */
export type MutationRootDeleteNotebookFocusArgs = {
	where: NotebookFocusBoolExp;
};

/** mutation root */
export type MutationRootDeleteNotebookFocusByPkArgs = {
	id: Scalars['uuid'];
};

/** mutation root */
export type MutationRootDeleteNotebookMemberArgs = {
	where: NotebookMemberBoolExp;
};

/** mutation root */
export type MutationRootDeleteNotebookMemberByPkArgs = {
	id: Scalars['uuid'];
};

/** mutation root */
export type MutationRootDeleteNotebookTargetArgs = {
	where: NotebookTargetBoolExp;
};

/** mutation root */
export type MutationRootDeleteNotebookTargetByPkArgs = {
	id: Scalars['uuid'];
};

/** mutation root */
export type MutationRootDeleteProfessionalArgs = {
	where: ProfessionalBoolExp;
};

/** mutation root */
export type MutationRootDeleteProfessionalByPkArgs = {
	id: Scalars['uuid'];
};

/** mutation root */
export type MutationRootDeleteRefActionArgs = {
	where: RefActionBoolExp;
};

/** mutation root */
export type MutationRootDeleteRefActionByPkArgs = {
	id: Scalars['uuid'];
};

/** mutation root */
export type MutationRootDeleteRefSituationArgs = {
	where: RefSituationBoolExp;
};

/** mutation root */
export type MutationRootDeleteRefSituationByPkArgs = {
	id: Scalars['uuid'];
};

/** mutation root */
export type MutationRootDeleteRefTargetArgs = {
	where: RefTargetBoolExp;
};

/** mutation root */
export type MutationRootDeleteRefTargetByPkArgs = {
	id: Scalars['uuid'];
};

/** mutation root */
export type MutationRootDeleteRomeCodeArgs = {
	where: RomeCodeBoolExp;
};

/** mutation root */
export type MutationRootDeleteRomeCodeByPkArgs = {
	id: Scalars['uuid'];
};

/** mutation root */
export type MutationRootDeleteStructureArgs = {
	where: StructureBoolExp;
};

/** mutation root */
export type MutationRootDeleteStructureByPkArgs = {
	id: Scalars['uuid'];
};

/** mutation root */
export type MutationRootDeleteWantedJobArgs = {
	where: WantedJobBoolExp;
};

/** mutation root */
export type MutationRootDeleteWantedJobByPkArgs = {
	id: Scalars['uuid'];
};

/** mutation root */
export type MutationRootInsertStructureWithAdminArgs = {
	data: InsertStructureWithAdminInput;
};

/** mutation root */
export type MutationRootInsertAccountArgs = {
	objects: Array<AccountInsertInput>;
	on_conflict?: InputMaybe<AccountOnConflict>;
};

/** mutation root */
export type MutationRootInsertAccountOneArgs = {
	object: AccountInsertInput;
	on_conflict?: InputMaybe<AccountOnConflict>;
};

/** mutation root */
export type MutationRootInsertAdminCdbArgs = {
	objects: Array<AdminCdbInsertInput>;
	on_conflict?: InputMaybe<AdminCdbOnConflict>;
};

/** mutation root */
export type MutationRootInsertAdminCdbOneArgs = {
	object: AdminCdbInsertInput;
	on_conflict?: InputMaybe<AdminCdbOnConflict>;
};

/** mutation root */
export type MutationRootInsertAdminStructureArgs = {
	objects: Array<AdminStructureInsertInput>;
	on_conflict?: InputMaybe<AdminStructureOnConflict>;
};

/** mutation root */
export type MutationRootInsertAdminStructureOneArgs = {
	object: AdminStructureInsertInput;
	on_conflict?: InputMaybe<AdminStructureOnConflict>;
};

/** mutation root */
export type MutationRootInsertAdminStructureStructureArgs = {
	objects: Array<AdminStructureStructureInsertInput>;
	on_conflict?: InputMaybe<AdminStructureStructureOnConflict>;
};

/** mutation root */
export type MutationRootInsertAdminStructureStructureOneArgs = {
	object: AdminStructureStructureInsertInput;
	on_conflict?: InputMaybe<AdminStructureStructureOnConflict>;
};

/** mutation root */
export type MutationRootInsertBeneficiaryArgs = {
	objects: Array<BeneficiaryInsertInput>;
	on_conflict?: InputMaybe<BeneficiaryOnConflict>;
};

/** mutation root */
export type MutationRootInsertBeneficiaryOneArgs = {
	object: BeneficiaryInsertInput;
	on_conflict?: InputMaybe<BeneficiaryOnConflict>;
};

/** mutation root */
export type MutationRootInsertBeneficiaryStructureArgs = {
	objects: Array<BeneficiaryStructureInsertInput>;
	on_conflict?: InputMaybe<BeneficiaryStructureOnConflict>;
};

/** mutation root */
export type MutationRootInsertBeneficiaryStructureOneArgs = {
	object: BeneficiaryStructureInsertInput;
	on_conflict?: InputMaybe<BeneficiaryStructureOnConflict>;
};

/** mutation root */
export type MutationRootInsertDeploymentArgs = {
	objects: Array<DeploymentInsertInput>;
	on_conflict?: InputMaybe<DeploymentOnConflict>;
};

/** mutation root */
export type MutationRootInsertDeploymentOneArgs = {
	object: DeploymentInsertInput;
	on_conflict?: InputMaybe<DeploymentOnConflict>;
};

/** mutation root */
export type MutationRootInsertManagerArgs = {
	objects: Array<ManagerInsertInput>;
	on_conflict?: InputMaybe<ManagerOnConflict>;
};

/** mutation root */
export type MutationRootInsertManagerOneArgs = {
	object: ManagerInsertInput;
	on_conflict?: InputMaybe<ManagerOnConflict>;
};

/** mutation root */
export type MutationRootInsertNotebookArgs = {
	objects: Array<NotebookInsertInput>;
	on_conflict?: InputMaybe<NotebookOnConflict>;
};

/** mutation root */
export type MutationRootInsertNotebookActionArgs = {
	objects: Array<NotebookActionInsertInput>;
	on_conflict?: InputMaybe<NotebookActionOnConflict>;
};

/** mutation root */
export type MutationRootInsertNotebookActionOneArgs = {
	object: NotebookActionInsertInput;
	on_conflict?: InputMaybe<NotebookActionOnConflict>;
};

/** mutation root */
export type MutationRootInsertNotebookAppointmentArgs = {
	objects: Array<NotebookAppointmentInsertInput>;
	on_conflict?: InputMaybe<NotebookAppointmentOnConflict>;
};

/** mutation root */
export type MutationRootInsertNotebookAppointmentOneArgs = {
	object: NotebookAppointmentInsertInput;
	on_conflict?: InputMaybe<NotebookAppointmentOnConflict>;
};

/** mutation root */
export type MutationRootInsertNotebookEventArgs = {
	objects: Array<NotebookEventInsertInput>;
	on_conflict?: InputMaybe<NotebookEventOnConflict>;
};

/** mutation root */
export type MutationRootInsertNotebookEventOneArgs = {
	object: NotebookEventInsertInput;
	on_conflict?: InputMaybe<NotebookEventOnConflict>;
};

/** mutation root */
export type MutationRootInsertNotebookEventTypeArgs = {
	objects: Array<NotebookEventTypeInsertInput>;
	on_conflict?: InputMaybe<NotebookEventTypeOnConflict>;
};

/** mutation root */
export type MutationRootInsertNotebookEventTypeOneArgs = {
	object: NotebookEventTypeInsertInput;
	on_conflict?: InputMaybe<NotebookEventTypeOnConflict>;
};

/** mutation root */
export type MutationRootInsertNotebookFocusArgs = {
	objects: Array<NotebookFocusInsertInput>;
	on_conflict?: InputMaybe<NotebookFocusOnConflict>;
};

/** mutation root */
export type MutationRootInsertNotebookFocusOneArgs = {
	object: NotebookFocusInsertInput;
	on_conflict?: InputMaybe<NotebookFocusOnConflict>;
};

/** mutation root */
export type MutationRootInsertNotebookMemberArgs = {
	objects: Array<NotebookMemberInsertInput>;
	on_conflict?: InputMaybe<NotebookMemberOnConflict>;
};

/** mutation root */
export type MutationRootInsertNotebookMemberOneArgs = {
	object: NotebookMemberInsertInput;
	on_conflict?: InputMaybe<NotebookMemberOnConflict>;
};

/** mutation root */
export type MutationRootInsertNotebookOneArgs = {
	object: NotebookInsertInput;
	on_conflict?: InputMaybe<NotebookOnConflict>;
};

/** mutation root */
export type MutationRootInsertNotebookTargetArgs = {
	objects: Array<NotebookTargetInsertInput>;
	on_conflict?: InputMaybe<NotebookTargetOnConflict>;
};

/** mutation root */
export type MutationRootInsertNotebookTargetOneArgs = {
	object: NotebookTargetInsertInput;
	on_conflict?: InputMaybe<NotebookTargetOnConflict>;
};

/** mutation root */
export type MutationRootInsertProfessionalArgs = {
	objects: Array<ProfessionalInsertInput>;
	on_conflict?: InputMaybe<ProfessionalOnConflict>;
};

/** mutation root */
export type MutationRootInsertProfessionalOneArgs = {
	object: ProfessionalInsertInput;
	on_conflict?: InputMaybe<ProfessionalOnConflict>;
};

/** mutation root */
export type MutationRootInsertRefActionArgs = {
	objects: Array<RefActionInsertInput>;
	on_conflict?: InputMaybe<RefActionOnConflict>;
};

/** mutation root */
export type MutationRootInsertRefActionOneArgs = {
	object: RefActionInsertInput;
	on_conflict?: InputMaybe<RefActionOnConflict>;
};

/** mutation root */
export type MutationRootInsertRefSituationArgs = {
	objects: Array<RefSituationInsertInput>;
	on_conflict?: InputMaybe<RefSituationOnConflict>;
};

/** mutation root */
export type MutationRootInsertRefSituationOneArgs = {
	object: RefSituationInsertInput;
	on_conflict?: InputMaybe<RefSituationOnConflict>;
};

/** mutation root */
export type MutationRootInsertRefTargetArgs = {
	objects: Array<RefTargetInsertInput>;
	on_conflict?: InputMaybe<RefTargetOnConflict>;
};

/** mutation root */
export type MutationRootInsertRefTargetOneArgs = {
	object: RefTargetInsertInput;
	on_conflict?: InputMaybe<RefTargetOnConflict>;
};

/** mutation root */
export type MutationRootInsertRomeCodeArgs = {
	objects: Array<RomeCodeInsertInput>;
	on_conflict?: InputMaybe<RomeCodeOnConflict>;
};

/** mutation root */
export type MutationRootInsertRomeCodeOneArgs = {
	object: RomeCodeInsertInput;
	on_conflict?: InputMaybe<RomeCodeOnConflict>;
};

/** mutation root */
export type MutationRootInsertStructureArgs = {
	objects: Array<StructureInsertInput>;
	on_conflict?: InputMaybe<StructureOnConflict>;
};

/** mutation root */
export type MutationRootInsertStructureOneArgs = {
	object: StructureInsertInput;
	on_conflict?: InputMaybe<StructureOnConflict>;
};

/** mutation root */
export type MutationRootInsertWantedJobArgs = {
	objects: Array<WantedJobInsertInput>;
	on_conflict?: InputMaybe<WantedJobOnConflict>;
};

/** mutation root */
export type MutationRootInsertWantedJobOneArgs = {
	object: WantedJobInsertInput;
	on_conflict?: InputMaybe<WantedJobOnConflict>;
};

/** mutation root */
export type MutationRootUpdateNotebookActArgs = {
	id: Scalars['uuid'];
};

/** mutation root */
export type MutationRootUpdateAccountArgs = {
	_set?: InputMaybe<AccountSetInput>;
	where: AccountBoolExp;
};

/** mutation root */
export type MutationRootUpdateAccountByPkArgs = {
	_set?: InputMaybe<AccountSetInput>;
	pk_columns: AccountPkColumnsInput;
};

/** mutation root */
export type MutationRootUpdateAdminCdbArgs = {
	_set?: InputMaybe<AdminCdbSetInput>;
	where: AdminCdbBoolExp;
};

/** mutation root */
export type MutationRootUpdateAdminCdbByPkArgs = {
	_set?: InputMaybe<AdminCdbSetInput>;
	pk_columns: AdminCdbPkColumnsInput;
};

/** mutation root */
export type MutationRootUpdateAdminStructureArgs = {
	_set?: InputMaybe<AdminStructureSetInput>;
	where: AdminStructureBoolExp;
};

/** mutation root */
export type MutationRootUpdateAdminStructureByPkArgs = {
	_set?: InputMaybe<AdminStructureSetInput>;
	pk_columns: AdminStructurePkColumnsInput;
};

/** mutation root */
export type MutationRootUpdateAdminStructureStructureArgs = {
	_set?: InputMaybe<AdminStructureStructureSetInput>;
	where: AdminStructureStructureBoolExp;
};

/** mutation root */
export type MutationRootUpdateAdminStructureStructureByPkArgs = {
	_set?: InputMaybe<AdminStructureStructureSetInput>;
	pk_columns: AdminStructureStructurePkColumnsInput;
};

/** mutation root */
export type MutationRootUpdateBeneficiaryArgs = {
	_set?: InputMaybe<BeneficiarySetInput>;
	where: BeneficiaryBoolExp;
};

/** mutation root */
export type MutationRootUpdateBeneficiaryByPkArgs = {
	_set?: InputMaybe<BeneficiarySetInput>;
	pk_columns: BeneficiaryPkColumnsInput;
};

/** mutation root */
export type MutationRootUpdateBeneficiaryStructureArgs = {
	_append?: InputMaybe<BeneficiaryStructureAppendInput>;
	_delete_at_path?: InputMaybe<BeneficiaryStructureDeleteAtPathInput>;
	_delete_elem?: InputMaybe<BeneficiaryStructureDeleteElemInput>;
	_delete_key?: InputMaybe<BeneficiaryStructureDeleteKeyInput>;
	_prepend?: InputMaybe<BeneficiaryStructurePrependInput>;
	_set?: InputMaybe<BeneficiaryStructureSetInput>;
	where: BeneficiaryStructureBoolExp;
};

/** mutation root */
export type MutationRootUpdateBeneficiaryStructureByPkArgs = {
	_append?: InputMaybe<BeneficiaryStructureAppendInput>;
	_delete_at_path?: InputMaybe<BeneficiaryStructureDeleteAtPathInput>;
	_delete_elem?: InputMaybe<BeneficiaryStructureDeleteElemInput>;
	_delete_key?: InputMaybe<BeneficiaryStructureDeleteKeyInput>;
	_prepend?: InputMaybe<BeneficiaryStructurePrependInput>;
	_set?: InputMaybe<BeneficiaryStructureSetInput>;
	pk_columns: BeneficiaryStructurePkColumnsInput;
};

/** mutation root */
export type MutationRootUpdateDeploymentArgs = {
	_append?: InputMaybe<DeploymentAppendInput>;
	_delete_at_path?: InputMaybe<DeploymentDeleteAtPathInput>;
	_delete_elem?: InputMaybe<DeploymentDeleteElemInput>;
	_delete_key?: InputMaybe<DeploymentDeleteKeyInput>;
	_prepend?: InputMaybe<DeploymentPrependInput>;
	_set?: InputMaybe<DeploymentSetInput>;
	where: DeploymentBoolExp;
};

/** mutation root */
export type MutationRootUpdateDeploymentByPkArgs = {
	_append?: InputMaybe<DeploymentAppendInput>;
	_delete_at_path?: InputMaybe<DeploymentDeleteAtPathInput>;
	_delete_elem?: InputMaybe<DeploymentDeleteElemInput>;
	_delete_key?: InputMaybe<DeploymentDeleteKeyInput>;
	_prepend?: InputMaybe<DeploymentPrependInput>;
	_set?: InputMaybe<DeploymentSetInput>;
	pk_columns: DeploymentPkColumnsInput;
};

/** mutation root */
export type MutationRootUpdateManagerArgs = {
	_set?: InputMaybe<ManagerSetInput>;
	where: ManagerBoolExp;
};

/** mutation root */
export type MutationRootUpdateManagerByPkArgs = {
	_set?: InputMaybe<ManagerSetInput>;
	pk_columns: ManagerPkColumnsInput;
};

/** mutation root */
export type MutationRootUpdateNotebookArgs = {
	_set?: InputMaybe<NotebookSetInput>;
	where: NotebookBoolExp;
};

/** mutation root */
export type MutationRootUpdateNotebookActionArgs = {
	_set?: InputMaybe<NotebookActionSetInput>;
	where: NotebookActionBoolExp;
};

/** mutation root */
export type MutationRootUpdateNotebookActionByPkArgs = {
	_set?: InputMaybe<NotebookActionSetInput>;
	pk_columns: NotebookActionPkColumnsInput;
};

/** mutation root */
export type MutationRootUpdateNotebookAppointmentArgs = {
	_set?: InputMaybe<NotebookAppointmentSetInput>;
	where: NotebookAppointmentBoolExp;
};

/** mutation root */
export type MutationRootUpdateNotebookAppointmentByPkArgs = {
	_set?: InputMaybe<NotebookAppointmentSetInput>;
	pk_columns: NotebookAppointmentPkColumnsInput;
};

/** mutation root */
export type MutationRootUpdateNotebookByPkArgs = {
	_set?: InputMaybe<NotebookSetInput>;
	pk_columns: NotebookPkColumnsInput;
};

/** mutation root */
export type MutationRootUpdateNotebookEventArgs = {
	_append?: InputMaybe<NotebookEventAppendInput>;
	_delete_at_path?: InputMaybe<NotebookEventDeleteAtPathInput>;
	_delete_elem?: InputMaybe<NotebookEventDeleteElemInput>;
	_delete_key?: InputMaybe<NotebookEventDeleteKeyInput>;
	_prepend?: InputMaybe<NotebookEventPrependInput>;
	_set?: InputMaybe<NotebookEventSetInput>;
	where: NotebookEventBoolExp;
};

/** mutation root */
export type MutationRootUpdateNotebookEventByPkArgs = {
	_append?: InputMaybe<NotebookEventAppendInput>;
	_delete_at_path?: InputMaybe<NotebookEventDeleteAtPathInput>;
	_delete_elem?: InputMaybe<NotebookEventDeleteElemInput>;
	_delete_key?: InputMaybe<NotebookEventDeleteKeyInput>;
	_prepend?: InputMaybe<NotebookEventPrependInput>;
	_set?: InputMaybe<NotebookEventSetInput>;
	pk_columns: NotebookEventPkColumnsInput;
};

/** mutation root */
export type MutationRootUpdateNotebookEventTypeArgs = {
	_set?: InputMaybe<NotebookEventTypeSetInput>;
	where: NotebookEventTypeBoolExp;
};

/** mutation root */
export type MutationRootUpdateNotebookEventTypeByPkArgs = {
	_set?: InputMaybe<NotebookEventTypeSetInput>;
	pk_columns: NotebookEventTypePkColumnsInput;
};

/** mutation root */
export type MutationRootUpdateNotebookFocusArgs = {
	_append?: InputMaybe<NotebookFocusAppendInput>;
	_delete_at_path?: InputMaybe<NotebookFocusDeleteAtPathInput>;
	_delete_elem?: InputMaybe<NotebookFocusDeleteElemInput>;
	_delete_key?: InputMaybe<NotebookFocusDeleteKeyInput>;
	_prepend?: InputMaybe<NotebookFocusPrependInput>;
	_set?: InputMaybe<NotebookFocusSetInput>;
	where: NotebookFocusBoolExp;
};

/** mutation root */
export type MutationRootUpdateNotebookFocusByPkArgs = {
	_append?: InputMaybe<NotebookFocusAppendInput>;
	_delete_at_path?: InputMaybe<NotebookFocusDeleteAtPathInput>;
	_delete_elem?: InputMaybe<NotebookFocusDeleteElemInput>;
	_delete_key?: InputMaybe<NotebookFocusDeleteKeyInput>;
	_prepend?: InputMaybe<NotebookFocusPrependInput>;
	_set?: InputMaybe<NotebookFocusSetInput>;
	pk_columns: NotebookFocusPkColumnsInput;
};

/** mutation root */
export type MutationRootUpdateNotebookMemberArgs = {
	_set?: InputMaybe<NotebookMemberSetInput>;
	where: NotebookMemberBoolExp;
};

/** mutation root */
export type MutationRootUpdateNotebookMemberByPkArgs = {
	_set?: InputMaybe<NotebookMemberSetInput>;
	pk_columns: NotebookMemberPkColumnsInput;
};

/** mutation root */
export type MutationRootUpdateNotebookTargetArgs = {
	_set?: InputMaybe<NotebookTargetSetInput>;
	where: NotebookTargetBoolExp;
};

/** mutation root */
export type MutationRootUpdateNotebookTargetByPkArgs = {
	_set?: InputMaybe<NotebookTargetSetInput>;
	pk_columns: NotebookTargetPkColumnsInput;
};

/** mutation root */
export type MutationRootUpdateProfessionalArgs = {
	_set?: InputMaybe<ProfessionalSetInput>;
	where: ProfessionalBoolExp;
};

/** mutation root */
export type MutationRootUpdateProfessionalByPkArgs = {
	_set?: InputMaybe<ProfessionalSetInput>;
	pk_columns: ProfessionalPkColumnsInput;
};

/** mutation root */
export type MutationRootUpdateRefActionArgs = {
	_set?: InputMaybe<RefActionSetInput>;
	where: RefActionBoolExp;
};

/** mutation root */
export type MutationRootUpdateRefActionByPkArgs = {
	_set?: InputMaybe<RefActionSetInput>;
	pk_columns: RefActionPkColumnsInput;
};

/** mutation root */
export type MutationRootUpdateRefSituationArgs = {
	_set?: InputMaybe<RefSituationSetInput>;
	where: RefSituationBoolExp;
};

/** mutation root */
export type MutationRootUpdateRefSituationByPkArgs = {
	_set?: InputMaybe<RefSituationSetInput>;
	pk_columns: RefSituationPkColumnsInput;
};

/** mutation root */
export type MutationRootUpdateRefTargetArgs = {
	_set?: InputMaybe<RefTargetSetInput>;
	where: RefTargetBoolExp;
};

/** mutation root */
export type MutationRootUpdateRefTargetByPkArgs = {
	_set?: InputMaybe<RefTargetSetInput>;
	pk_columns: RefTargetPkColumnsInput;
};

/** mutation root */
export type MutationRootUpdateRomeCodeArgs = {
	_set?: InputMaybe<RomeCodeSetInput>;
	where: RomeCodeBoolExp;
};

/** mutation root */
export type MutationRootUpdateRomeCodeByPkArgs = {
	_set?: InputMaybe<RomeCodeSetInput>;
	pk_columns: RomeCodePkColumnsInput;
};

/** mutation root */
export type MutationRootUpdateStructureArgs = {
	_set?: InputMaybe<StructureSetInput>;
	where: StructureBoolExp;
};

/** mutation root */
export type MutationRootUpdateStructureByPkArgs = {
	_set?: InputMaybe<StructureSetInput>;
	pk_columns: StructurePkColumnsInput;
};

/** mutation root */
export type MutationRootUpdateWantedJobArgs = {
	_set?: InputMaybe<WantedJobSetInput>;
	where: WantedJobBoolExp;
};

/** mutation root */
export type MutationRootUpdateWantedJobByPkArgs = {
	_set?: InputMaybe<WantedJobSetInput>;
	pk_columns: WantedJobPkColumnsInput;
};

/** columns and relationships of "notebook" */
export type Notebook = {
	__typename?: 'notebook';
	/** An array relationship */
	appointments: Array<NotebookAppointment>;
	/** An aggregate relationship */
	appointments_aggregate: NotebookAppointmentAggregate;
	/** An object relationship */
	beneficiary: Beneficiary;
	beneficiaryId: Scalars['uuid'];
	contractSignDate?: Maybe<Scalars['date']>;
	contractType?: Maybe<Scalars['String']>;
	createdAt: Scalars['timestamptz'];
	educationLevel?: Maybe<Scalars['String']>;
	/** An array relationship */
	events: Array<NotebookEvent>;
	/** An aggregate relationship */
	events_aggregate: NotebookEventAggregate;
	/** An array relationship */
	focuses: Array<NotebookFocus>;
	/** An aggregate relationship */
	focuses_aggregate: NotebookFocusAggregate;
	geographicalArea?: Maybe<Scalars['String']>;
	id: Scalars['uuid'];
	/** An array relationship */
	members: Array<NotebookMember>;
	/** An aggregate relationship */
	members_aggregate: NotebookMemberAggregate;
	/** A computed field, executes function "nb_member" */
	nbMembers?: Maybe<Scalars['bigint']>;
	rightAre: Scalars['Boolean'];
	rightAss?: Maybe<Scalars['Boolean']>;
	rightBonus: Scalars['Boolean'];
	rightRqth: Scalars['Boolean'];
	rightRsa?: Maybe<Scalars['String']>;
	updatedAt: Scalars['timestamptz'];
	/** An array relationship */
	wantedJobs: Array<WantedJob>;
	/** An aggregate relationship */
	wantedJobs_aggregate: WantedJobAggregate;
	workSituation?: Maybe<Scalars['String']>;
	workSituationDate?: Maybe<Scalars['date']>;
};

/** columns and relationships of "notebook" */
export type NotebookAppointmentsArgs = {
	distinct_on?: InputMaybe<Array<NotebookAppointmentSelectColumn>>;
	limit?: InputMaybe<Scalars['Int']>;
	offset?: InputMaybe<Scalars['Int']>;
	order_by?: InputMaybe<Array<NotebookAppointmentOrderBy>>;
	where?: InputMaybe<NotebookAppointmentBoolExp>;
};

/** columns and relationships of "notebook" */
export type NotebookAppointmentsAggregateArgs = {
	distinct_on?: InputMaybe<Array<NotebookAppointmentSelectColumn>>;
	limit?: InputMaybe<Scalars['Int']>;
	offset?: InputMaybe<Scalars['Int']>;
	order_by?: InputMaybe<Array<NotebookAppointmentOrderBy>>;
	where?: InputMaybe<NotebookAppointmentBoolExp>;
};

/** columns and relationships of "notebook" */
export type NotebookEventsArgs = {
	distinct_on?: InputMaybe<Array<NotebookEventSelectColumn>>;
	limit?: InputMaybe<Scalars['Int']>;
	offset?: InputMaybe<Scalars['Int']>;
	order_by?: InputMaybe<Array<NotebookEventOrderBy>>;
	where?: InputMaybe<NotebookEventBoolExp>;
};

/** columns and relationships of "notebook" */
export type NotebookEventsAggregateArgs = {
	distinct_on?: InputMaybe<Array<NotebookEventSelectColumn>>;
	limit?: InputMaybe<Scalars['Int']>;
	offset?: InputMaybe<Scalars['Int']>;
	order_by?: InputMaybe<Array<NotebookEventOrderBy>>;
	where?: InputMaybe<NotebookEventBoolExp>;
};

/** columns and relationships of "notebook" */
export type NotebookFocusesArgs = {
	distinct_on?: InputMaybe<Array<NotebookFocusSelectColumn>>;
	limit?: InputMaybe<Scalars['Int']>;
	offset?: InputMaybe<Scalars['Int']>;
	order_by?: InputMaybe<Array<NotebookFocusOrderBy>>;
	where?: InputMaybe<NotebookFocusBoolExp>;
};

/** columns and relationships of "notebook" */
export type NotebookFocusesAggregateArgs = {
	distinct_on?: InputMaybe<Array<NotebookFocusSelectColumn>>;
	limit?: InputMaybe<Scalars['Int']>;
	offset?: InputMaybe<Scalars['Int']>;
	order_by?: InputMaybe<Array<NotebookFocusOrderBy>>;
	where?: InputMaybe<NotebookFocusBoolExp>;
};

/** columns and relationships of "notebook" */
export type NotebookMembersArgs = {
	distinct_on?: InputMaybe<Array<NotebookMemberSelectColumn>>;
	limit?: InputMaybe<Scalars['Int']>;
	offset?: InputMaybe<Scalars['Int']>;
	order_by?: InputMaybe<Array<NotebookMemberOrderBy>>;
	where?: InputMaybe<NotebookMemberBoolExp>;
};

/** columns and relationships of "notebook" */
export type NotebookMembersAggregateArgs = {
	distinct_on?: InputMaybe<Array<NotebookMemberSelectColumn>>;
	limit?: InputMaybe<Scalars['Int']>;
	offset?: InputMaybe<Scalars['Int']>;
	order_by?: InputMaybe<Array<NotebookMemberOrderBy>>;
	where?: InputMaybe<NotebookMemberBoolExp>;
};

/** columns and relationships of "notebook" */
export type NotebookWantedJobsArgs = {
	distinct_on?: InputMaybe<Array<WantedJobSelectColumn>>;
	limit?: InputMaybe<Scalars['Int']>;
	offset?: InputMaybe<Scalars['Int']>;
	order_by?: InputMaybe<Array<WantedJobOrderBy>>;
	where?: InputMaybe<WantedJobBoolExp>;
};

/** columns and relationships of "notebook" */
export type NotebookWantedJobsAggregateArgs = {
	distinct_on?: InputMaybe<Array<WantedJobSelectColumn>>;
	limit?: InputMaybe<Scalars['Int']>;
	offset?: InputMaybe<Scalars['Int']>;
	order_by?: InputMaybe<Array<WantedJobOrderBy>>;
	where?: InputMaybe<WantedJobBoolExp>;
};

/** columns and relationships of "notebook_action" */
export type NotebookAction = {
	__typename?: 'notebook_action';
	action: Scalars['String'];
	createdAt: Scalars['timestamptz'];
	/** An object relationship */
	creator: Account;
	creatorId: Scalars['uuid'];
	id: Scalars['uuid'];
	initialId?: Maybe<Scalars['String']>;
	status: Scalars['String'];
	/** An object relationship */
	target: NotebookTarget;
	targetId: Scalars['uuid'];
	updatedAt: Scalars['timestamptz'];
};

/** aggregated selection of "notebook_action" */
export type NotebookActionAggregate = {
	__typename?: 'notebook_action_aggregate';
	aggregate?: Maybe<NotebookActionAggregateFields>;
	nodes: Array<NotebookAction>;
};

/** aggregate fields of "notebook_action" */
export type NotebookActionAggregateFields = {
	__typename?: 'notebook_action_aggregate_fields';
	count: Scalars['Int'];
	max?: Maybe<NotebookActionMaxFields>;
	min?: Maybe<NotebookActionMinFields>;
};

/** aggregate fields of "notebook_action" */
export type NotebookActionAggregateFieldsCountArgs = {
	columns?: InputMaybe<Array<NotebookActionSelectColumn>>;
	distinct?: InputMaybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "notebook_action" */
export type NotebookActionAggregateOrderBy = {
	count?: InputMaybe<OrderBy>;
	max?: InputMaybe<NotebookActionMaxOrderBy>;
	min?: InputMaybe<NotebookActionMinOrderBy>;
};

/** input type for inserting array relation for remote table "notebook_action" */
export type NotebookActionArrRelInsertInput = {
	data: Array<NotebookActionInsertInput>;
	/** on conflict condition */
	on_conflict?: InputMaybe<NotebookActionOnConflict>;
};

/** Boolean expression to filter rows from the table "notebook_action". All fields are combined with a logical 'AND'. */
export type NotebookActionBoolExp = {
	_and?: InputMaybe<Array<NotebookActionBoolExp>>;
	_not?: InputMaybe<NotebookActionBoolExp>;
	_or?: InputMaybe<Array<NotebookActionBoolExp>>;
	action?: InputMaybe<StringComparisonExp>;
	createdAt?: InputMaybe<TimestamptzComparisonExp>;
	creator?: InputMaybe<AccountBoolExp>;
	creatorId?: InputMaybe<UuidComparisonExp>;
	id?: InputMaybe<UuidComparisonExp>;
	initialId?: InputMaybe<StringComparisonExp>;
	status?: InputMaybe<StringComparisonExp>;
	target?: InputMaybe<NotebookTargetBoolExp>;
	targetId?: InputMaybe<UuidComparisonExp>;
	updatedAt?: InputMaybe<TimestamptzComparisonExp>;
};

/** unique or primary key constraints on table "notebook_action" */
export enum NotebookActionConstraint {
	/** unique or primary key constraint */
	NotebookActionInitialIdKey = 'notebook_action_initial_id_key',
	/** unique or primary key constraint */
	NotebookActionPkey = 'notebook_action_pkey',
	/** unique or primary key constraint */
	NotebookActionTargetIdActionKey = 'notebook_action_target_id_action_key',
}

/** input type for inserting data into table "notebook_action" */
export type NotebookActionInsertInput = {
	action?: InputMaybe<Scalars['String']>;
	createdAt?: InputMaybe<Scalars['timestamptz']>;
	creator?: InputMaybe<AccountObjRelInsertInput>;
	creatorId?: InputMaybe<Scalars['uuid']>;
	id?: InputMaybe<Scalars['uuid']>;
	initialId?: InputMaybe<Scalars['String']>;
	status?: InputMaybe<Scalars['String']>;
	target?: InputMaybe<NotebookTargetObjRelInsertInput>;
	targetId?: InputMaybe<Scalars['uuid']>;
	updatedAt?: InputMaybe<Scalars['timestamptz']>;
};

/** aggregate max on columns */
export type NotebookActionMaxFields = {
	__typename?: 'notebook_action_max_fields';
	action?: Maybe<Scalars['String']>;
	createdAt?: Maybe<Scalars['timestamptz']>;
	creatorId?: Maybe<Scalars['uuid']>;
	id?: Maybe<Scalars['uuid']>;
	initialId?: Maybe<Scalars['String']>;
	status?: Maybe<Scalars['String']>;
	targetId?: Maybe<Scalars['uuid']>;
	updatedAt?: Maybe<Scalars['timestamptz']>;
};

/** order by max() on columns of table "notebook_action" */
export type NotebookActionMaxOrderBy = {
	action?: InputMaybe<OrderBy>;
	createdAt?: InputMaybe<OrderBy>;
	creatorId?: InputMaybe<OrderBy>;
	id?: InputMaybe<OrderBy>;
	initialId?: InputMaybe<OrderBy>;
	status?: InputMaybe<OrderBy>;
	targetId?: InputMaybe<OrderBy>;
	updatedAt?: InputMaybe<OrderBy>;
};

/** aggregate min on columns */
export type NotebookActionMinFields = {
	__typename?: 'notebook_action_min_fields';
	action?: Maybe<Scalars['String']>;
	createdAt?: Maybe<Scalars['timestamptz']>;
	creatorId?: Maybe<Scalars['uuid']>;
	id?: Maybe<Scalars['uuid']>;
	initialId?: Maybe<Scalars['String']>;
	status?: Maybe<Scalars['String']>;
	targetId?: Maybe<Scalars['uuid']>;
	updatedAt?: Maybe<Scalars['timestamptz']>;
};

/** order by min() on columns of table "notebook_action" */
export type NotebookActionMinOrderBy = {
	action?: InputMaybe<OrderBy>;
	createdAt?: InputMaybe<OrderBy>;
	creatorId?: InputMaybe<OrderBy>;
	id?: InputMaybe<OrderBy>;
	initialId?: InputMaybe<OrderBy>;
	status?: InputMaybe<OrderBy>;
	targetId?: InputMaybe<OrderBy>;
	updatedAt?: InputMaybe<OrderBy>;
};

/** response of any mutation on the table "notebook_action" */
export type NotebookActionMutationResponse = {
	__typename?: 'notebook_action_mutation_response';
	/** number of rows affected by the mutation */
	affected_rows: Scalars['Int'];
	/** data from the rows affected by the mutation */
	returning: Array<NotebookAction>;
};

/** on conflict condition type for table "notebook_action" */
export type NotebookActionOnConflict = {
	constraint: NotebookActionConstraint;
	update_columns?: Array<NotebookActionUpdateColumn>;
	where?: InputMaybe<NotebookActionBoolExp>;
};

/** Ordering options when selecting data from "notebook_action". */
export type NotebookActionOrderBy = {
	action?: InputMaybe<OrderBy>;
	createdAt?: InputMaybe<OrderBy>;
	creator?: InputMaybe<AccountOrderBy>;
	creatorId?: InputMaybe<OrderBy>;
	id?: InputMaybe<OrderBy>;
	initialId?: InputMaybe<OrderBy>;
	status?: InputMaybe<OrderBy>;
	target?: InputMaybe<NotebookTargetOrderBy>;
	targetId?: InputMaybe<OrderBy>;
	updatedAt?: InputMaybe<OrderBy>;
};

/** primary key columns input for table: notebook_action */
export type NotebookActionPkColumnsInput = {
	id: Scalars['uuid'];
};

/** select columns of table "notebook_action" */
export enum NotebookActionSelectColumn {
	/** column name */
	Action = 'action',
	/** column name */
	CreatedAt = 'createdAt',
	/** column name */
	CreatorId = 'creatorId',
	/** column name */
	Id = 'id',
	/** column name */
	InitialId = 'initialId',
	/** column name */
	Status = 'status',
	/** column name */
	TargetId = 'targetId',
	/** column name */
	UpdatedAt = 'updatedAt',
}

/** input type for updating data in table "notebook_action" */
export type NotebookActionSetInput = {
	action?: InputMaybe<Scalars['String']>;
	createdAt?: InputMaybe<Scalars['timestamptz']>;
	creatorId?: InputMaybe<Scalars['uuid']>;
	id?: InputMaybe<Scalars['uuid']>;
	initialId?: InputMaybe<Scalars['String']>;
	status?: InputMaybe<Scalars['String']>;
	targetId?: InputMaybe<Scalars['uuid']>;
	updatedAt?: InputMaybe<Scalars['timestamptz']>;
};

/** update columns of table "notebook_action" */
export enum NotebookActionUpdateColumn {
	/** column name */
	Action = 'action',
	/** column name */
	CreatedAt = 'createdAt',
	/** column name */
	CreatorId = 'creatorId',
	/** column name */
	Id = 'id',
	/** column name */
	InitialId = 'initialId',
	/** column name */
	Status = 'status',
	/** column name */
	TargetId = 'targetId',
	/** column name */
	UpdatedAt = 'updatedAt',
}

/** aggregated selection of "notebook" */
export type NotebookAggregate = {
	__typename?: 'notebook_aggregate';
	aggregate?: Maybe<NotebookAggregateFields>;
	nodes: Array<Notebook>;
};

/** aggregate fields of "notebook" */
export type NotebookAggregateFields = {
	__typename?: 'notebook_aggregate_fields';
	count: Scalars['Int'];
	max?: Maybe<NotebookMaxFields>;
	min?: Maybe<NotebookMinFields>;
};

/** aggregate fields of "notebook" */
export type NotebookAggregateFieldsCountArgs = {
	columns?: InputMaybe<Array<NotebookSelectColumn>>;
	distinct?: InputMaybe<Scalars['Boolean']>;
};

/** columns and relationships of "notebook_appointment" */
export type NotebookAppointment = {
	__typename?: 'notebook_appointment';
	/** An object relationship */
	account: Account;
	created_at?: Maybe<Scalars['timestamptz']>;
	date: Scalars['date'];
	id: Scalars['uuid'];
	memberAccountId: Scalars['uuid'];
	/** An object relationship */
	notebook: Notebook;
	notebookId: Scalars['uuid'];
	status: Scalars['String'];
	updated_at?: Maybe<Scalars['timestamptz']>;
};

/** aggregated selection of "notebook_appointment" */
export type NotebookAppointmentAggregate = {
	__typename?: 'notebook_appointment_aggregate';
	aggregate?: Maybe<NotebookAppointmentAggregateFields>;
	nodes: Array<NotebookAppointment>;
};

/** aggregate fields of "notebook_appointment" */
export type NotebookAppointmentAggregateFields = {
	__typename?: 'notebook_appointment_aggregate_fields';
	count: Scalars['Int'];
	max?: Maybe<NotebookAppointmentMaxFields>;
	min?: Maybe<NotebookAppointmentMinFields>;
};

/** aggregate fields of "notebook_appointment" */
export type NotebookAppointmentAggregateFieldsCountArgs = {
	columns?: InputMaybe<Array<NotebookAppointmentSelectColumn>>;
	distinct?: InputMaybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "notebook_appointment" */
export type NotebookAppointmentAggregateOrderBy = {
	count?: InputMaybe<OrderBy>;
	max?: InputMaybe<NotebookAppointmentMaxOrderBy>;
	min?: InputMaybe<NotebookAppointmentMinOrderBy>;
};

/** input type for inserting array relation for remote table "notebook_appointment" */
export type NotebookAppointmentArrRelInsertInput = {
	data: Array<NotebookAppointmentInsertInput>;
	/** on conflict condition */
	on_conflict?: InputMaybe<NotebookAppointmentOnConflict>;
};

/** Boolean expression to filter rows from the table "notebook_appointment". All fields are combined with a logical 'AND'. */
export type NotebookAppointmentBoolExp = {
	_and?: InputMaybe<Array<NotebookAppointmentBoolExp>>;
	_not?: InputMaybe<NotebookAppointmentBoolExp>;
	_or?: InputMaybe<Array<NotebookAppointmentBoolExp>>;
	account?: InputMaybe<AccountBoolExp>;
	created_at?: InputMaybe<TimestamptzComparisonExp>;
	date?: InputMaybe<DateComparisonExp>;
	id?: InputMaybe<UuidComparisonExp>;
	memberAccountId?: InputMaybe<UuidComparisonExp>;
	notebook?: InputMaybe<NotebookBoolExp>;
	notebookId?: InputMaybe<UuidComparisonExp>;
	status?: InputMaybe<StringComparisonExp>;
	updated_at?: InputMaybe<TimestamptzComparisonExp>;
};

/** unique or primary key constraints on table "notebook_appointment" */
export enum NotebookAppointmentConstraint {
	/** unique or primary key constraint */
	NotebookAppointmentPkey = 'notebook_appointment_pkey',
}

/** input type for inserting data into table "notebook_appointment" */
export type NotebookAppointmentInsertInput = {
	account?: InputMaybe<AccountObjRelInsertInput>;
	created_at?: InputMaybe<Scalars['timestamptz']>;
	date?: InputMaybe<Scalars['date']>;
	id?: InputMaybe<Scalars['uuid']>;
	memberAccountId?: InputMaybe<Scalars['uuid']>;
	notebook?: InputMaybe<NotebookObjRelInsertInput>;
	notebookId?: InputMaybe<Scalars['uuid']>;
	status?: InputMaybe<Scalars['String']>;
	updated_at?: InputMaybe<Scalars['timestamptz']>;
};

/** aggregate max on columns */
export type NotebookAppointmentMaxFields = {
	__typename?: 'notebook_appointment_max_fields';
	created_at?: Maybe<Scalars['timestamptz']>;
	date?: Maybe<Scalars['date']>;
	id?: Maybe<Scalars['uuid']>;
	memberAccountId?: Maybe<Scalars['uuid']>;
	notebookId?: Maybe<Scalars['uuid']>;
	status?: Maybe<Scalars['String']>;
	updated_at?: Maybe<Scalars['timestamptz']>;
};

/** order by max() on columns of table "notebook_appointment" */
export type NotebookAppointmentMaxOrderBy = {
	created_at?: InputMaybe<OrderBy>;
	date?: InputMaybe<OrderBy>;
	id?: InputMaybe<OrderBy>;
	memberAccountId?: InputMaybe<OrderBy>;
	notebookId?: InputMaybe<OrderBy>;
	status?: InputMaybe<OrderBy>;
	updated_at?: InputMaybe<OrderBy>;
};

/** aggregate min on columns */
export type NotebookAppointmentMinFields = {
	__typename?: 'notebook_appointment_min_fields';
	created_at?: Maybe<Scalars['timestamptz']>;
	date?: Maybe<Scalars['date']>;
	id?: Maybe<Scalars['uuid']>;
	memberAccountId?: Maybe<Scalars['uuid']>;
	notebookId?: Maybe<Scalars['uuid']>;
	status?: Maybe<Scalars['String']>;
	updated_at?: Maybe<Scalars['timestamptz']>;
};

/** order by min() on columns of table "notebook_appointment" */
export type NotebookAppointmentMinOrderBy = {
	created_at?: InputMaybe<OrderBy>;
	date?: InputMaybe<OrderBy>;
	id?: InputMaybe<OrderBy>;
	memberAccountId?: InputMaybe<OrderBy>;
	notebookId?: InputMaybe<OrderBy>;
	status?: InputMaybe<OrderBy>;
	updated_at?: InputMaybe<OrderBy>;
};

/** response of any mutation on the table "notebook_appointment" */
export type NotebookAppointmentMutationResponse = {
	__typename?: 'notebook_appointment_mutation_response';
	/** number of rows affected by the mutation */
	affected_rows: Scalars['Int'];
	/** data from the rows affected by the mutation */
	returning: Array<NotebookAppointment>;
};

/** on conflict condition type for table "notebook_appointment" */
export type NotebookAppointmentOnConflict = {
	constraint: NotebookAppointmentConstraint;
	update_columns?: Array<NotebookAppointmentUpdateColumn>;
	where?: InputMaybe<NotebookAppointmentBoolExp>;
};

/** Ordering options when selecting data from "notebook_appointment". */
export type NotebookAppointmentOrderBy = {
	account?: InputMaybe<AccountOrderBy>;
	created_at?: InputMaybe<OrderBy>;
	date?: InputMaybe<OrderBy>;
	id?: InputMaybe<OrderBy>;
	memberAccountId?: InputMaybe<OrderBy>;
	notebook?: InputMaybe<NotebookOrderBy>;
	notebookId?: InputMaybe<OrderBy>;
	status?: InputMaybe<OrderBy>;
	updated_at?: InputMaybe<OrderBy>;
};

/** primary key columns input for table: notebook_appointment */
export type NotebookAppointmentPkColumnsInput = {
	id: Scalars['uuid'];
};

/** select columns of table "notebook_appointment" */
export enum NotebookAppointmentSelectColumn {
	/** column name */
	CreatedAt = 'created_at',
	/** column name */
	Date = 'date',
	/** column name */
	Id = 'id',
	/** column name */
	MemberAccountId = 'memberAccountId',
	/** column name */
	NotebookId = 'notebookId',
	/** column name */
	Status = 'status',
	/** column name */
	UpdatedAt = 'updated_at',
}

/** input type for updating data in table "notebook_appointment" */
export type NotebookAppointmentSetInput = {
	created_at?: InputMaybe<Scalars['timestamptz']>;
	date?: InputMaybe<Scalars['date']>;
	id?: InputMaybe<Scalars['uuid']>;
	memberAccountId?: InputMaybe<Scalars['uuid']>;
	notebookId?: InputMaybe<Scalars['uuid']>;
	status?: InputMaybe<Scalars['String']>;
	updated_at?: InputMaybe<Scalars['timestamptz']>;
};

/** update columns of table "notebook_appointment" */
export enum NotebookAppointmentUpdateColumn {
	/** column name */
	CreatedAt = 'created_at',
	/** column name */
	Date = 'date',
	/** column name */
	Id = 'id',
	/** column name */
	MemberAccountId = 'memberAccountId',
	/** column name */
	NotebookId = 'notebookId',
	/** column name */
	Status = 'status',
	/** column name */
	UpdatedAt = 'updated_at',
}

/** Boolean expression to filter rows from the table "notebook". All fields are combined with a logical 'AND'. */
export type NotebookBoolExp = {
	_and?: InputMaybe<Array<NotebookBoolExp>>;
	_not?: InputMaybe<NotebookBoolExp>;
	_or?: InputMaybe<Array<NotebookBoolExp>>;
	appointments?: InputMaybe<NotebookAppointmentBoolExp>;
	beneficiary?: InputMaybe<BeneficiaryBoolExp>;
	beneficiaryId?: InputMaybe<UuidComparisonExp>;
	contractSignDate?: InputMaybe<DateComparisonExp>;
	contractType?: InputMaybe<StringComparisonExp>;
	createdAt?: InputMaybe<TimestamptzComparisonExp>;
	educationLevel?: InputMaybe<StringComparisonExp>;
	events?: InputMaybe<NotebookEventBoolExp>;
	focuses?: InputMaybe<NotebookFocusBoolExp>;
	geographicalArea?: InputMaybe<StringComparisonExp>;
	id?: InputMaybe<UuidComparisonExp>;
	members?: InputMaybe<NotebookMemberBoolExp>;
	nbMembers?: InputMaybe<BigintComparisonExp>;
	rightAre?: InputMaybe<BooleanComparisonExp>;
	rightAss?: InputMaybe<BooleanComparisonExp>;
	rightBonus?: InputMaybe<BooleanComparisonExp>;
	rightRqth?: InputMaybe<BooleanComparisonExp>;
	rightRsa?: InputMaybe<StringComparisonExp>;
	updatedAt?: InputMaybe<TimestamptzComparisonExp>;
	wantedJobs?: InputMaybe<WantedJobBoolExp>;
	workSituation?: InputMaybe<StringComparisonExp>;
	workSituationDate?: InputMaybe<DateComparisonExp>;
};

/** unique or primary key constraints on table "notebook" */
export enum NotebookConstraint {
	/** unique or primary key constraint */
	NotebookBeneficiaryIdKey = 'notebook_beneficiary_id_key',
	/** unique or primary key constraint */
	NotebookPkey = 'notebook_pkey',
}

/** columns and relationships of "notebook_event" */
export type NotebookEvent = {
	__typename?: 'notebook_event';
	creationDate: Scalars['timestamptz'];
	/** An object relationship */
	creator: Account;
	creatorId: Scalars['uuid'];
	event: Scalars['jsonb'];
	eventDate: Scalars['timestamptz'];
	eventType: NotebookEventTypeEnum;
	id: Scalars['uuid'];
	/** An object relationship */
	notebook: Notebook;
	notebookId: Scalars['uuid'];
};

/** columns and relationships of "notebook_event" */
export type NotebookEventEventArgs = {
	path?: InputMaybe<Scalars['String']>;
};

/** aggregated selection of "notebook_event" */
export type NotebookEventAggregate = {
	__typename?: 'notebook_event_aggregate';
	aggregate?: Maybe<NotebookEventAggregateFields>;
	nodes: Array<NotebookEvent>;
};

/** aggregate fields of "notebook_event" */
export type NotebookEventAggregateFields = {
	__typename?: 'notebook_event_aggregate_fields';
	count: Scalars['Int'];
	max?: Maybe<NotebookEventMaxFields>;
	min?: Maybe<NotebookEventMinFields>;
};

/** aggregate fields of "notebook_event" */
export type NotebookEventAggregateFieldsCountArgs = {
	columns?: InputMaybe<Array<NotebookEventSelectColumn>>;
	distinct?: InputMaybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "notebook_event" */
export type NotebookEventAggregateOrderBy = {
	count?: InputMaybe<OrderBy>;
	max?: InputMaybe<NotebookEventMaxOrderBy>;
	min?: InputMaybe<NotebookEventMinOrderBy>;
};

/** append existing jsonb value of filtered columns with new jsonb value */
export type NotebookEventAppendInput = {
	event?: InputMaybe<Scalars['jsonb']>;
};

/** input type for inserting array relation for remote table "notebook_event" */
export type NotebookEventArrRelInsertInput = {
	data: Array<NotebookEventInsertInput>;
	/** on conflict condition */
	on_conflict?: InputMaybe<NotebookEventOnConflict>;
};

/** Boolean expression to filter rows from the table "notebook_event". All fields are combined with a logical 'AND'. */
export type NotebookEventBoolExp = {
	_and?: InputMaybe<Array<NotebookEventBoolExp>>;
	_not?: InputMaybe<NotebookEventBoolExp>;
	_or?: InputMaybe<Array<NotebookEventBoolExp>>;
	creationDate?: InputMaybe<TimestamptzComparisonExp>;
	creator?: InputMaybe<AccountBoolExp>;
	creatorId?: InputMaybe<UuidComparisonExp>;
	event?: InputMaybe<JsonbComparisonExp>;
	eventDate?: InputMaybe<TimestamptzComparisonExp>;
	eventType?: InputMaybe<NotebookEventTypeEnumComparisonExp>;
	id?: InputMaybe<UuidComparisonExp>;
	notebook?: InputMaybe<NotebookBoolExp>;
	notebookId?: InputMaybe<UuidComparisonExp>;
};

/** unique or primary key constraints on table "notebook_event" */
export enum NotebookEventConstraint {
	/** unique or primary key constraint */
	NotebookEventPkey = 'notebook_event_pkey',
}

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export type NotebookEventDeleteAtPathInput = {
	event?: InputMaybe<Array<Scalars['String']>>;
};

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export type NotebookEventDeleteElemInput = {
	event?: InputMaybe<Scalars['Int']>;
};

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export type NotebookEventDeleteKeyInput = {
	event?: InputMaybe<Scalars['String']>;
};

/** input type for inserting data into table "notebook_event" */
export type NotebookEventInsertInput = {
	creationDate?: InputMaybe<Scalars['timestamptz']>;
	creator?: InputMaybe<AccountObjRelInsertInput>;
	creatorId?: InputMaybe<Scalars['uuid']>;
	event?: InputMaybe<Scalars['jsonb']>;
	eventDate?: InputMaybe<Scalars['timestamptz']>;
	eventType?: InputMaybe<NotebookEventTypeEnum>;
	id?: InputMaybe<Scalars['uuid']>;
	notebook?: InputMaybe<NotebookObjRelInsertInput>;
	notebookId?: InputMaybe<Scalars['uuid']>;
};

/** aggregate max on columns */
export type NotebookEventMaxFields = {
	__typename?: 'notebook_event_max_fields';
	creationDate?: Maybe<Scalars['timestamptz']>;
	creatorId?: Maybe<Scalars['uuid']>;
	eventDate?: Maybe<Scalars['timestamptz']>;
	id?: Maybe<Scalars['uuid']>;
	notebookId?: Maybe<Scalars['uuid']>;
};

/** order by max() on columns of table "notebook_event" */
export type NotebookEventMaxOrderBy = {
	creationDate?: InputMaybe<OrderBy>;
	creatorId?: InputMaybe<OrderBy>;
	eventDate?: InputMaybe<OrderBy>;
	id?: InputMaybe<OrderBy>;
	notebookId?: InputMaybe<OrderBy>;
};

/** aggregate min on columns */
export type NotebookEventMinFields = {
	__typename?: 'notebook_event_min_fields';
	creationDate?: Maybe<Scalars['timestamptz']>;
	creatorId?: Maybe<Scalars['uuid']>;
	eventDate?: Maybe<Scalars['timestamptz']>;
	id?: Maybe<Scalars['uuid']>;
	notebookId?: Maybe<Scalars['uuid']>;
};

/** order by min() on columns of table "notebook_event" */
export type NotebookEventMinOrderBy = {
	creationDate?: InputMaybe<OrderBy>;
	creatorId?: InputMaybe<OrderBy>;
	eventDate?: InputMaybe<OrderBy>;
	id?: InputMaybe<OrderBy>;
	notebookId?: InputMaybe<OrderBy>;
};

/** response of any mutation on the table "notebook_event" */
export type NotebookEventMutationResponse = {
	__typename?: 'notebook_event_mutation_response';
	/** number of rows affected by the mutation */
	affected_rows: Scalars['Int'];
	/** data from the rows affected by the mutation */
	returning: Array<NotebookEvent>;
};

/** on conflict condition type for table "notebook_event" */
export type NotebookEventOnConflict = {
	constraint: NotebookEventConstraint;
	update_columns?: Array<NotebookEventUpdateColumn>;
	where?: InputMaybe<NotebookEventBoolExp>;
};

/** Ordering options when selecting data from "notebook_event". */
export type NotebookEventOrderBy = {
	creationDate?: InputMaybe<OrderBy>;
	creator?: InputMaybe<AccountOrderBy>;
	creatorId?: InputMaybe<OrderBy>;
	event?: InputMaybe<OrderBy>;
	eventDate?: InputMaybe<OrderBy>;
	eventType?: InputMaybe<OrderBy>;
	id?: InputMaybe<OrderBy>;
	notebook?: InputMaybe<NotebookOrderBy>;
	notebookId?: InputMaybe<OrderBy>;
};

/** primary key columns input for table: notebook_event */
export type NotebookEventPkColumnsInput = {
	id: Scalars['uuid'];
};

/** prepend existing jsonb value of filtered columns with new jsonb value */
export type NotebookEventPrependInput = {
	event?: InputMaybe<Scalars['jsonb']>;
};

/** select columns of table "notebook_event" */
export enum NotebookEventSelectColumn {
	/** column name */
	CreationDate = 'creationDate',
	/** column name */
	CreatorId = 'creatorId',
	/** column name */
	Event = 'event',
	/** column name */
	EventDate = 'eventDate',
	/** column name */
	EventType = 'eventType',
	/** column name */
	Id = 'id',
	/** column name */
	NotebookId = 'notebookId',
}

/** input type for updating data in table "notebook_event" */
export type NotebookEventSetInput = {
	creationDate?: InputMaybe<Scalars['timestamptz']>;
	creatorId?: InputMaybe<Scalars['uuid']>;
	event?: InputMaybe<Scalars['jsonb']>;
	eventDate?: InputMaybe<Scalars['timestamptz']>;
	eventType?: InputMaybe<NotebookEventTypeEnum>;
	id?: InputMaybe<Scalars['uuid']>;
	notebookId?: InputMaybe<Scalars['uuid']>;
};

/** columns and relationships of "notebook_event_type" */
export type NotebookEventType = {
	__typename?: 'notebook_event_type';
	comment: Scalars['String'];
	value: Scalars['String'];
};

/** aggregated selection of "notebook_event_type" */
export type NotebookEventTypeAggregate = {
	__typename?: 'notebook_event_type_aggregate';
	aggregate?: Maybe<NotebookEventTypeAggregateFields>;
	nodes: Array<NotebookEventType>;
};

/** aggregate fields of "notebook_event_type" */
export type NotebookEventTypeAggregateFields = {
	__typename?: 'notebook_event_type_aggregate_fields';
	count: Scalars['Int'];
	max?: Maybe<NotebookEventTypeMaxFields>;
	min?: Maybe<NotebookEventTypeMinFields>;
};

/** aggregate fields of "notebook_event_type" */
export type NotebookEventTypeAggregateFieldsCountArgs = {
	columns?: InputMaybe<Array<NotebookEventTypeSelectColumn>>;
	distinct?: InputMaybe<Scalars['Boolean']>;
};

/** Boolean expression to filter rows from the table "notebook_event_type". All fields are combined with a logical 'AND'. */
export type NotebookEventTypeBoolExp = {
	_and?: InputMaybe<Array<NotebookEventTypeBoolExp>>;
	_not?: InputMaybe<NotebookEventTypeBoolExp>;
	_or?: InputMaybe<Array<NotebookEventTypeBoolExp>>;
	comment?: InputMaybe<StringComparisonExp>;
	value?: InputMaybe<StringComparisonExp>;
};

/** unique or primary key constraints on table "notebook_event_type" */
export enum NotebookEventTypeConstraint {
	/** unique or primary key constraint */
	NotebookEventTypePkey = 'notebook_event_type_pkey',
}

export enum NotebookEventTypeEnum {
	/** Action d'un objectif */
	Action = 'action',
	/** Objectif d'un parcours */
	Target = 'target',
}

/** Boolean expression to compare columns of type "notebook_event_type_enum". All fields are combined with logical 'AND'. */
export type NotebookEventTypeEnumComparisonExp = {
	_eq?: InputMaybe<NotebookEventTypeEnum>;
	_in?: InputMaybe<Array<NotebookEventTypeEnum>>;
	_is_null?: InputMaybe<Scalars['Boolean']>;
	_neq?: InputMaybe<NotebookEventTypeEnum>;
	_nin?: InputMaybe<Array<NotebookEventTypeEnum>>;
};

/** input type for inserting data into table "notebook_event_type" */
export type NotebookEventTypeInsertInput = {
	comment?: InputMaybe<Scalars['String']>;
	value?: InputMaybe<Scalars['String']>;
};

/** aggregate max on columns */
export type NotebookEventTypeMaxFields = {
	__typename?: 'notebook_event_type_max_fields';
	comment?: Maybe<Scalars['String']>;
	value?: Maybe<Scalars['String']>;
};

/** aggregate min on columns */
export type NotebookEventTypeMinFields = {
	__typename?: 'notebook_event_type_min_fields';
	comment?: Maybe<Scalars['String']>;
	value?: Maybe<Scalars['String']>;
};

/** response of any mutation on the table "notebook_event_type" */
export type NotebookEventTypeMutationResponse = {
	__typename?: 'notebook_event_type_mutation_response';
	/** number of rows affected by the mutation */
	affected_rows: Scalars['Int'];
	/** data from the rows affected by the mutation */
	returning: Array<NotebookEventType>;
};

/** on conflict condition type for table "notebook_event_type" */
export type NotebookEventTypeOnConflict = {
	constraint: NotebookEventTypeConstraint;
	update_columns?: Array<NotebookEventTypeUpdateColumn>;
	where?: InputMaybe<NotebookEventTypeBoolExp>;
};

/** Ordering options when selecting data from "notebook_event_type". */
export type NotebookEventTypeOrderBy = {
	comment?: InputMaybe<OrderBy>;
	value?: InputMaybe<OrderBy>;
};

/** primary key columns input for table: notebook_event_type */
export type NotebookEventTypePkColumnsInput = {
	value: Scalars['String'];
};

/** select columns of table "notebook_event_type" */
export enum NotebookEventTypeSelectColumn {
	/** column name */
	Comment = 'comment',
	/** column name */
	Value = 'value',
}

/** input type for updating data in table "notebook_event_type" */
export type NotebookEventTypeSetInput = {
	comment?: InputMaybe<Scalars['String']>;
	value?: InputMaybe<Scalars['String']>;
};

/** update columns of table "notebook_event_type" */
export enum NotebookEventTypeUpdateColumn {
	/** column name */
	Comment = 'comment',
	/** column name */
	Value = 'value',
}

/** update columns of table "notebook_event" */
export enum NotebookEventUpdateColumn {
	/** column name */
	CreationDate = 'creationDate',
	/** column name */
	CreatorId = 'creatorId',
	/** column name */
	Event = 'event',
	/** column name */
	EventDate = 'eventDate',
	/** column name */
	EventType = 'eventType',
	/** column name */
	Id = 'id',
	/** column name */
	NotebookId = 'notebookId',
}

/** columns and relationships of "notebook_focus" */
export type NotebookFocus = {
	__typename?: 'notebook_focus';
	createdAt: Scalars['timestamptz'];
	/** An object relationship */
	creator: Account;
	creatorId: Scalars['uuid'];
	id: Scalars['uuid'];
	linkedTo?: Maybe<Scalars['String']>;
	/** An object relationship */
	notebook: Notebook;
	notebookId: Scalars['uuid'];
	situations?: Maybe<Scalars['jsonb']>;
	/** An array relationship */
	targets: Array<NotebookTarget>;
	/** An aggregate relationship */
	targets_aggregate: NotebookTargetAggregate;
	theme: Scalars['String'];
	updatedAt: Scalars['timestamptz'];
};

/** columns and relationships of "notebook_focus" */
export type NotebookFocusSituationsArgs = {
	path?: InputMaybe<Scalars['String']>;
};

/** columns and relationships of "notebook_focus" */
export type NotebookFocusTargetsArgs = {
	distinct_on?: InputMaybe<Array<NotebookTargetSelectColumn>>;
	limit?: InputMaybe<Scalars['Int']>;
	offset?: InputMaybe<Scalars['Int']>;
	order_by?: InputMaybe<Array<NotebookTargetOrderBy>>;
	where?: InputMaybe<NotebookTargetBoolExp>;
};

/** columns and relationships of "notebook_focus" */
export type NotebookFocusTargetsAggregateArgs = {
	distinct_on?: InputMaybe<Array<NotebookTargetSelectColumn>>;
	limit?: InputMaybe<Scalars['Int']>;
	offset?: InputMaybe<Scalars['Int']>;
	order_by?: InputMaybe<Array<NotebookTargetOrderBy>>;
	where?: InputMaybe<NotebookTargetBoolExp>;
};

/** aggregated selection of "notebook_focus" */
export type NotebookFocusAggregate = {
	__typename?: 'notebook_focus_aggregate';
	aggregate?: Maybe<NotebookFocusAggregateFields>;
	nodes: Array<NotebookFocus>;
};

/** aggregate fields of "notebook_focus" */
export type NotebookFocusAggregateFields = {
	__typename?: 'notebook_focus_aggregate_fields';
	count: Scalars['Int'];
	max?: Maybe<NotebookFocusMaxFields>;
	min?: Maybe<NotebookFocusMinFields>;
};

/** aggregate fields of "notebook_focus" */
export type NotebookFocusAggregateFieldsCountArgs = {
	columns?: InputMaybe<Array<NotebookFocusSelectColumn>>;
	distinct?: InputMaybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "notebook_focus" */
export type NotebookFocusAggregateOrderBy = {
	count?: InputMaybe<OrderBy>;
	max?: InputMaybe<NotebookFocusMaxOrderBy>;
	min?: InputMaybe<NotebookFocusMinOrderBy>;
};

/** append existing jsonb value of filtered columns with new jsonb value */
export type NotebookFocusAppendInput = {
	situations?: InputMaybe<Scalars['jsonb']>;
};

/** input type for inserting array relation for remote table "notebook_focus" */
export type NotebookFocusArrRelInsertInput = {
	data: Array<NotebookFocusInsertInput>;
	/** on conflict condition */
	on_conflict?: InputMaybe<NotebookFocusOnConflict>;
};

/** Boolean expression to filter rows from the table "notebook_focus". All fields are combined with a logical 'AND'. */
export type NotebookFocusBoolExp = {
	_and?: InputMaybe<Array<NotebookFocusBoolExp>>;
	_not?: InputMaybe<NotebookFocusBoolExp>;
	_or?: InputMaybe<Array<NotebookFocusBoolExp>>;
	createdAt?: InputMaybe<TimestamptzComparisonExp>;
	creator?: InputMaybe<AccountBoolExp>;
	creatorId?: InputMaybe<UuidComparisonExp>;
	id?: InputMaybe<UuidComparisonExp>;
	linkedTo?: InputMaybe<StringComparisonExp>;
	notebook?: InputMaybe<NotebookBoolExp>;
	notebookId?: InputMaybe<UuidComparisonExp>;
	situations?: InputMaybe<JsonbComparisonExp>;
	targets?: InputMaybe<NotebookTargetBoolExp>;
	theme?: InputMaybe<StringComparisonExp>;
	updatedAt?: InputMaybe<TimestamptzComparisonExp>;
};

/** unique or primary key constraints on table "notebook_focus" */
export enum NotebookFocusConstraint {
	/** unique or primary key constraint */
	NotebookFocusPkey = 'notebook_focus_pkey',
}

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export type NotebookFocusDeleteAtPathInput = {
	situations?: InputMaybe<Array<Scalars['String']>>;
};

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export type NotebookFocusDeleteElemInput = {
	situations?: InputMaybe<Scalars['Int']>;
};

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export type NotebookFocusDeleteKeyInput = {
	situations?: InputMaybe<Scalars['String']>;
};

/** input type for inserting data into table "notebook_focus" */
export type NotebookFocusInsertInput = {
	createdAt?: InputMaybe<Scalars['timestamptz']>;
	creator?: InputMaybe<AccountObjRelInsertInput>;
	creatorId?: InputMaybe<Scalars['uuid']>;
	id?: InputMaybe<Scalars['uuid']>;
	linkedTo?: InputMaybe<Scalars['String']>;
	notebook?: InputMaybe<NotebookObjRelInsertInput>;
	notebookId?: InputMaybe<Scalars['uuid']>;
	situations?: InputMaybe<Scalars['jsonb']>;
	targets?: InputMaybe<NotebookTargetArrRelInsertInput>;
	theme?: InputMaybe<Scalars['String']>;
	updatedAt?: InputMaybe<Scalars['timestamptz']>;
};

/** aggregate max on columns */
export type NotebookFocusMaxFields = {
	__typename?: 'notebook_focus_max_fields';
	createdAt?: Maybe<Scalars['timestamptz']>;
	creatorId?: Maybe<Scalars['uuid']>;
	id?: Maybe<Scalars['uuid']>;
	linkedTo?: Maybe<Scalars['String']>;
	notebookId?: Maybe<Scalars['uuid']>;
	theme?: Maybe<Scalars['String']>;
	updatedAt?: Maybe<Scalars['timestamptz']>;
};

/** order by max() on columns of table "notebook_focus" */
export type NotebookFocusMaxOrderBy = {
	createdAt?: InputMaybe<OrderBy>;
	creatorId?: InputMaybe<OrderBy>;
	id?: InputMaybe<OrderBy>;
	linkedTo?: InputMaybe<OrderBy>;
	notebookId?: InputMaybe<OrderBy>;
	theme?: InputMaybe<OrderBy>;
	updatedAt?: InputMaybe<OrderBy>;
};

/** aggregate min on columns */
export type NotebookFocusMinFields = {
	__typename?: 'notebook_focus_min_fields';
	createdAt?: Maybe<Scalars['timestamptz']>;
	creatorId?: Maybe<Scalars['uuid']>;
	id?: Maybe<Scalars['uuid']>;
	linkedTo?: Maybe<Scalars['String']>;
	notebookId?: Maybe<Scalars['uuid']>;
	theme?: Maybe<Scalars['String']>;
	updatedAt?: Maybe<Scalars['timestamptz']>;
};

/** order by min() on columns of table "notebook_focus" */
export type NotebookFocusMinOrderBy = {
	createdAt?: InputMaybe<OrderBy>;
	creatorId?: InputMaybe<OrderBy>;
	id?: InputMaybe<OrderBy>;
	linkedTo?: InputMaybe<OrderBy>;
	notebookId?: InputMaybe<OrderBy>;
	theme?: InputMaybe<OrderBy>;
	updatedAt?: InputMaybe<OrderBy>;
};

/** response of any mutation on the table "notebook_focus" */
export type NotebookFocusMutationResponse = {
	__typename?: 'notebook_focus_mutation_response';
	/** number of rows affected by the mutation */
	affected_rows: Scalars['Int'];
	/** data from the rows affected by the mutation */
	returning: Array<NotebookFocus>;
};

/** input type for inserting object relation for remote table "notebook_focus" */
export type NotebookFocusObjRelInsertInput = {
	data: NotebookFocusInsertInput;
	/** on conflict condition */
	on_conflict?: InputMaybe<NotebookFocusOnConflict>;
};

/** on conflict condition type for table "notebook_focus" */
export type NotebookFocusOnConflict = {
	constraint: NotebookFocusConstraint;
	update_columns?: Array<NotebookFocusUpdateColumn>;
	where?: InputMaybe<NotebookFocusBoolExp>;
};

/** Ordering options when selecting data from "notebook_focus". */
export type NotebookFocusOrderBy = {
	createdAt?: InputMaybe<OrderBy>;
	creator?: InputMaybe<AccountOrderBy>;
	creatorId?: InputMaybe<OrderBy>;
	id?: InputMaybe<OrderBy>;
	linkedTo?: InputMaybe<OrderBy>;
	notebook?: InputMaybe<NotebookOrderBy>;
	notebookId?: InputMaybe<OrderBy>;
	situations?: InputMaybe<OrderBy>;
	targets_aggregate?: InputMaybe<NotebookTargetAggregateOrderBy>;
	theme?: InputMaybe<OrderBy>;
	updatedAt?: InputMaybe<OrderBy>;
};

/** primary key columns input for table: notebook_focus */
export type NotebookFocusPkColumnsInput = {
	id: Scalars['uuid'];
};

/** prepend existing jsonb value of filtered columns with new jsonb value */
export type NotebookFocusPrependInput = {
	situations?: InputMaybe<Scalars['jsonb']>;
};

/** select columns of table "notebook_focus" */
export enum NotebookFocusSelectColumn {
	/** column name */
	CreatedAt = 'createdAt',
	/** column name */
	CreatorId = 'creatorId',
	/** column name */
	Id = 'id',
	/** column name */
	LinkedTo = 'linkedTo',
	/** column name */
	NotebookId = 'notebookId',
	/** column name */
	Situations = 'situations',
	/** column name */
	Theme = 'theme',
	/** column name */
	UpdatedAt = 'updatedAt',
}

/** input type for updating data in table "notebook_focus" */
export type NotebookFocusSetInput = {
	createdAt?: InputMaybe<Scalars['timestamptz']>;
	creatorId?: InputMaybe<Scalars['uuid']>;
	id?: InputMaybe<Scalars['uuid']>;
	linkedTo?: InputMaybe<Scalars['String']>;
	notebookId?: InputMaybe<Scalars['uuid']>;
	situations?: InputMaybe<Scalars['jsonb']>;
	theme?: InputMaybe<Scalars['String']>;
	updatedAt?: InputMaybe<Scalars['timestamptz']>;
};

/** update columns of table "notebook_focus" */
export enum NotebookFocusUpdateColumn {
	/** column name */
	CreatedAt = 'createdAt',
	/** column name */
	CreatorId = 'creatorId',
	/** column name */
	Id = 'id',
	/** column name */
	LinkedTo = 'linkedTo',
	/** column name */
	NotebookId = 'notebookId',
	/** column name */
	Situations = 'situations',
	/** column name */
	Theme = 'theme',
	/** column name */
	UpdatedAt = 'updatedAt',
}

/** input type for inserting data into table "notebook" */
export type NotebookInsertInput = {
	appointments?: InputMaybe<NotebookAppointmentArrRelInsertInput>;
	beneficiary?: InputMaybe<BeneficiaryObjRelInsertInput>;
	beneficiaryId?: InputMaybe<Scalars['uuid']>;
	contractSignDate?: InputMaybe<Scalars['date']>;
	contractType?: InputMaybe<Scalars['String']>;
	createdAt?: InputMaybe<Scalars['timestamptz']>;
	educationLevel?: InputMaybe<Scalars['String']>;
	events?: InputMaybe<NotebookEventArrRelInsertInput>;
	focuses?: InputMaybe<NotebookFocusArrRelInsertInput>;
	geographicalArea?: InputMaybe<Scalars['String']>;
	id?: InputMaybe<Scalars['uuid']>;
	members?: InputMaybe<NotebookMemberArrRelInsertInput>;
	rightAre?: InputMaybe<Scalars['Boolean']>;
	rightAss?: InputMaybe<Scalars['Boolean']>;
	rightBonus?: InputMaybe<Scalars['Boolean']>;
	rightRqth?: InputMaybe<Scalars['Boolean']>;
	rightRsa?: InputMaybe<Scalars['String']>;
	updatedAt?: InputMaybe<Scalars['timestamptz']>;
	wantedJobs?: InputMaybe<WantedJobArrRelInsertInput>;
	workSituation?: InputMaybe<Scalars['String']>;
	workSituationDate?: InputMaybe<Scalars['date']>;
};

/** aggregate max on columns */
export type NotebookMaxFields = {
	__typename?: 'notebook_max_fields';
	beneficiaryId?: Maybe<Scalars['uuid']>;
	contractSignDate?: Maybe<Scalars['date']>;
	contractType?: Maybe<Scalars['String']>;
	createdAt?: Maybe<Scalars['timestamptz']>;
	educationLevel?: Maybe<Scalars['String']>;
	geographicalArea?: Maybe<Scalars['String']>;
	id?: Maybe<Scalars['uuid']>;
	rightRsa?: Maybe<Scalars['String']>;
	updatedAt?: Maybe<Scalars['timestamptz']>;
	workSituation?: Maybe<Scalars['String']>;
	workSituationDate?: Maybe<Scalars['date']>;
};

/** columns and relationships of "notebook_member" */
export type NotebookMember = {
	__typename?: 'notebook_member';
	/** An object relationship */
	account: Account;
	accountId: Scalars['uuid'];
	active?: Maybe<Scalars['Boolean']>;
	createdAt: Scalars['timestamptz'];
	/** An object relationship */
	creator?: Maybe<Account>;
	creatorId?: Maybe<Scalars['uuid']>;
	id: Scalars['uuid'];
	invitationSendAt?: Maybe<Scalars['timestamptz']>;
	lastModifiedAt?: Maybe<Scalars['timestamptz']>;
	lastVisitedAt?: Maybe<Scalars['timestamptz']>;
	memberType: Scalars['String'];
	/** An object relationship */
	notebook: Notebook;
	notebookId: Scalars['uuid'];
};

/** aggregated selection of "notebook_member" */
export type NotebookMemberAggregate = {
	__typename?: 'notebook_member_aggregate';
	aggregate?: Maybe<NotebookMemberAggregateFields>;
	nodes: Array<NotebookMember>;
};

/** aggregate fields of "notebook_member" */
export type NotebookMemberAggregateFields = {
	__typename?: 'notebook_member_aggregate_fields';
	count: Scalars['Int'];
	max?: Maybe<NotebookMemberMaxFields>;
	min?: Maybe<NotebookMemberMinFields>;
};

/** aggregate fields of "notebook_member" */
export type NotebookMemberAggregateFieldsCountArgs = {
	columns?: InputMaybe<Array<NotebookMemberSelectColumn>>;
	distinct?: InputMaybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "notebook_member" */
export type NotebookMemberAggregateOrderBy = {
	count?: InputMaybe<OrderBy>;
	max?: InputMaybe<NotebookMemberMaxOrderBy>;
	min?: InputMaybe<NotebookMemberMinOrderBy>;
};

/** input type for inserting array relation for remote table "notebook_member" */
export type NotebookMemberArrRelInsertInput = {
	data: Array<NotebookMemberInsertInput>;
	/** on conflict condition */
	on_conflict?: InputMaybe<NotebookMemberOnConflict>;
};

/** Boolean expression to filter rows from the table "notebook_member". All fields are combined with a logical 'AND'. */
export type NotebookMemberBoolExp = {
	_and?: InputMaybe<Array<NotebookMemberBoolExp>>;
	_not?: InputMaybe<NotebookMemberBoolExp>;
	_or?: InputMaybe<Array<NotebookMemberBoolExp>>;
	account?: InputMaybe<AccountBoolExp>;
	accountId?: InputMaybe<UuidComparisonExp>;
	active?: InputMaybe<BooleanComparisonExp>;
	createdAt?: InputMaybe<TimestamptzComparisonExp>;
	creator?: InputMaybe<AccountBoolExp>;
	creatorId?: InputMaybe<UuidComparisonExp>;
	id?: InputMaybe<UuidComparisonExp>;
	invitationSendAt?: InputMaybe<TimestamptzComparisonExp>;
	lastModifiedAt?: InputMaybe<TimestamptzComparisonExp>;
	lastVisitedAt?: InputMaybe<TimestamptzComparisonExp>;
	memberType?: InputMaybe<StringComparisonExp>;
	notebook?: InputMaybe<NotebookBoolExp>;
	notebookId?: InputMaybe<UuidComparisonExp>;
};

/** unique or primary key constraints on table "notebook_member" */
export enum NotebookMemberConstraint {
	/** unique or primary key constraint */
	NotebookMemberNotebookIdAccountIdKey = 'notebook_member_notebook_id_account_id_key',
	/** unique or primary key constraint */
	NotebookMemberPkey = 'notebook_member_pkey',
}

/** input type for inserting data into table "notebook_member" */
export type NotebookMemberInsertInput = {
	account?: InputMaybe<AccountObjRelInsertInput>;
	accountId?: InputMaybe<Scalars['uuid']>;
	active?: InputMaybe<Scalars['Boolean']>;
	createdAt?: InputMaybe<Scalars['timestamptz']>;
	creator?: InputMaybe<AccountObjRelInsertInput>;
	creatorId?: InputMaybe<Scalars['uuid']>;
	id?: InputMaybe<Scalars['uuid']>;
	invitationSendAt?: InputMaybe<Scalars['timestamptz']>;
	lastModifiedAt?: InputMaybe<Scalars['timestamptz']>;
	lastVisitedAt?: InputMaybe<Scalars['timestamptz']>;
	memberType?: InputMaybe<Scalars['String']>;
	notebook?: InputMaybe<NotebookObjRelInsertInput>;
	notebookId?: InputMaybe<Scalars['uuid']>;
};

/** aggregate max on columns */
export type NotebookMemberMaxFields = {
	__typename?: 'notebook_member_max_fields';
	accountId?: Maybe<Scalars['uuid']>;
	createdAt?: Maybe<Scalars['timestamptz']>;
	creatorId?: Maybe<Scalars['uuid']>;
	id?: Maybe<Scalars['uuid']>;
	invitationSendAt?: Maybe<Scalars['timestamptz']>;
	lastModifiedAt?: Maybe<Scalars['timestamptz']>;
	lastVisitedAt?: Maybe<Scalars['timestamptz']>;
	memberType?: Maybe<Scalars['String']>;
	notebookId?: Maybe<Scalars['uuid']>;
};

/** order by max() on columns of table "notebook_member" */
export type NotebookMemberMaxOrderBy = {
	accountId?: InputMaybe<OrderBy>;
	createdAt?: InputMaybe<OrderBy>;
	creatorId?: InputMaybe<OrderBy>;
	id?: InputMaybe<OrderBy>;
	invitationSendAt?: InputMaybe<OrderBy>;
	lastModifiedAt?: InputMaybe<OrderBy>;
	lastVisitedAt?: InputMaybe<OrderBy>;
	memberType?: InputMaybe<OrderBy>;
	notebookId?: InputMaybe<OrderBy>;
};

/** aggregate min on columns */
export type NotebookMemberMinFields = {
	__typename?: 'notebook_member_min_fields';
	accountId?: Maybe<Scalars['uuid']>;
	createdAt?: Maybe<Scalars['timestamptz']>;
	creatorId?: Maybe<Scalars['uuid']>;
	id?: Maybe<Scalars['uuid']>;
	invitationSendAt?: Maybe<Scalars['timestamptz']>;
	lastModifiedAt?: Maybe<Scalars['timestamptz']>;
	lastVisitedAt?: Maybe<Scalars['timestamptz']>;
	memberType?: Maybe<Scalars['String']>;
	notebookId?: Maybe<Scalars['uuid']>;
};

/** order by min() on columns of table "notebook_member" */
export type NotebookMemberMinOrderBy = {
	accountId?: InputMaybe<OrderBy>;
	createdAt?: InputMaybe<OrderBy>;
	creatorId?: InputMaybe<OrderBy>;
	id?: InputMaybe<OrderBy>;
	invitationSendAt?: InputMaybe<OrderBy>;
	lastModifiedAt?: InputMaybe<OrderBy>;
	lastVisitedAt?: InputMaybe<OrderBy>;
	memberType?: InputMaybe<OrderBy>;
	notebookId?: InputMaybe<OrderBy>;
};

/** response of any mutation on the table "notebook_member" */
export type NotebookMemberMutationResponse = {
	__typename?: 'notebook_member_mutation_response';
	/** number of rows affected by the mutation */
	affected_rows: Scalars['Int'];
	/** data from the rows affected by the mutation */
	returning: Array<NotebookMember>;
};

/** on conflict condition type for table "notebook_member" */
export type NotebookMemberOnConflict = {
	constraint: NotebookMemberConstraint;
	update_columns?: Array<NotebookMemberUpdateColumn>;
	where?: InputMaybe<NotebookMemberBoolExp>;
};

/** Ordering options when selecting data from "notebook_member". */
export type NotebookMemberOrderBy = {
	account?: InputMaybe<AccountOrderBy>;
	accountId?: InputMaybe<OrderBy>;
	active?: InputMaybe<OrderBy>;
	createdAt?: InputMaybe<OrderBy>;
	creator?: InputMaybe<AccountOrderBy>;
	creatorId?: InputMaybe<OrderBy>;
	id?: InputMaybe<OrderBy>;
	invitationSendAt?: InputMaybe<OrderBy>;
	lastModifiedAt?: InputMaybe<OrderBy>;
	lastVisitedAt?: InputMaybe<OrderBy>;
	memberType?: InputMaybe<OrderBy>;
	notebook?: InputMaybe<NotebookOrderBy>;
	notebookId?: InputMaybe<OrderBy>;
};

/** primary key columns input for table: notebook_member */
export type NotebookMemberPkColumnsInput = {
	id: Scalars['uuid'];
};

/** select columns of table "notebook_member" */
export enum NotebookMemberSelectColumn {
	/** column name */
	AccountId = 'accountId',
	/** column name */
	Active = 'active',
	/** column name */
	CreatedAt = 'createdAt',
	/** column name */
	CreatorId = 'creatorId',
	/** column name */
	Id = 'id',
	/** column name */
	InvitationSendAt = 'invitationSendAt',
	/** column name */
	LastModifiedAt = 'lastModifiedAt',
	/** column name */
	LastVisitedAt = 'lastVisitedAt',
	/** column name */
	MemberType = 'memberType',
	/** column name */
	NotebookId = 'notebookId',
}

/** input type for updating data in table "notebook_member" */
export type NotebookMemberSetInput = {
	accountId?: InputMaybe<Scalars['uuid']>;
	active?: InputMaybe<Scalars['Boolean']>;
	createdAt?: InputMaybe<Scalars['timestamptz']>;
	creatorId?: InputMaybe<Scalars['uuid']>;
	id?: InputMaybe<Scalars['uuid']>;
	invitationSendAt?: InputMaybe<Scalars['timestamptz']>;
	lastModifiedAt?: InputMaybe<Scalars['timestamptz']>;
	lastVisitedAt?: InputMaybe<Scalars['timestamptz']>;
	memberType?: InputMaybe<Scalars['String']>;
	notebookId?: InputMaybe<Scalars['uuid']>;
};

/** update columns of table "notebook_member" */
export enum NotebookMemberUpdateColumn {
	/** column name */
	AccountId = 'accountId',
	/** column name */
	Active = 'active',
	/** column name */
	CreatedAt = 'createdAt',
	/** column name */
	CreatorId = 'creatorId',
	/** column name */
	Id = 'id',
	/** column name */
	InvitationSendAt = 'invitationSendAt',
	/** column name */
	LastModifiedAt = 'lastModifiedAt',
	/** column name */
	LastVisitedAt = 'lastVisitedAt',
	/** column name */
	MemberType = 'memberType',
	/** column name */
	NotebookId = 'notebookId',
}

/** aggregate min on columns */
export type NotebookMinFields = {
	__typename?: 'notebook_min_fields';
	beneficiaryId?: Maybe<Scalars['uuid']>;
	contractSignDate?: Maybe<Scalars['date']>;
	contractType?: Maybe<Scalars['String']>;
	createdAt?: Maybe<Scalars['timestamptz']>;
	educationLevel?: Maybe<Scalars['String']>;
	geographicalArea?: Maybe<Scalars['String']>;
	id?: Maybe<Scalars['uuid']>;
	rightRsa?: Maybe<Scalars['String']>;
	updatedAt?: Maybe<Scalars['timestamptz']>;
	workSituation?: Maybe<Scalars['String']>;
	workSituationDate?: Maybe<Scalars['date']>;
};

/** response of any mutation on the table "notebook" */
export type NotebookMutationResponse = {
	__typename?: 'notebook_mutation_response';
	/** number of rows affected by the mutation */
	affected_rows: Scalars['Int'];
	/** data from the rows affected by the mutation */
	returning: Array<Notebook>;
};

/** input type for inserting object relation for remote table "notebook" */
export type NotebookObjRelInsertInput = {
	data: NotebookInsertInput;
	/** on conflict condition */
	on_conflict?: InputMaybe<NotebookOnConflict>;
};

/** on conflict condition type for table "notebook" */
export type NotebookOnConflict = {
	constraint: NotebookConstraint;
	update_columns?: Array<NotebookUpdateColumn>;
	where?: InputMaybe<NotebookBoolExp>;
};

/** Ordering options when selecting data from "notebook". */
export type NotebookOrderBy = {
	appointments_aggregate?: InputMaybe<NotebookAppointmentAggregateOrderBy>;
	beneficiary?: InputMaybe<BeneficiaryOrderBy>;
	beneficiaryId?: InputMaybe<OrderBy>;
	contractSignDate?: InputMaybe<OrderBy>;
	contractType?: InputMaybe<OrderBy>;
	createdAt?: InputMaybe<OrderBy>;
	educationLevel?: InputMaybe<OrderBy>;
	events_aggregate?: InputMaybe<NotebookEventAggregateOrderBy>;
	focuses_aggregate?: InputMaybe<NotebookFocusAggregateOrderBy>;
	geographicalArea?: InputMaybe<OrderBy>;
	id?: InputMaybe<OrderBy>;
	members_aggregate?: InputMaybe<NotebookMemberAggregateOrderBy>;
	nbMembers?: InputMaybe<OrderBy>;
	rightAre?: InputMaybe<OrderBy>;
	rightAss?: InputMaybe<OrderBy>;
	rightBonus?: InputMaybe<OrderBy>;
	rightRqth?: InputMaybe<OrderBy>;
	rightRsa?: InputMaybe<OrderBy>;
	updatedAt?: InputMaybe<OrderBy>;
	wantedJobs_aggregate?: InputMaybe<WantedJobAggregateOrderBy>;
	workSituation?: InputMaybe<OrderBy>;
	workSituationDate?: InputMaybe<OrderBy>;
};

/** primary key columns input for table: notebook */
export type NotebookPkColumnsInput = {
	id: Scalars['uuid'];
};

/** select columns of table "notebook" */
export enum NotebookSelectColumn {
	/** column name */
	BeneficiaryId = 'beneficiaryId',
	/** column name */
	ContractSignDate = 'contractSignDate',
	/** column name */
	ContractType = 'contractType',
	/** column name */
	CreatedAt = 'createdAt',
	/** column name */
	EducationLevel = 'educationLevel',
	/** column name */
	GeographicalArea = 'geographicalArea',
	/** column name */
	Id = 'id',
	/** column name */
	RightAre = 'rightAre',
	/** column name */
	RightAss = 'rightAss',
	/** column name */
	RightBonus = 'rightBonus',
	/** column name */
	RightRqth = 'rightRqth',
	/** column name */
	RightRsa = 'rightRsa',
	/** column name */
	UpdatedAt = 'updatedAt',
	/** column name */
	WorkSituation = 'workSituation',
	/** column name */
	WorkSituationDate = 'workSituationDate',
}

/** input type for updating data in table "notebook" */
export type NotebookSetInput = {
	beneficiaryId?: InputMaybe<Scalars['uuid']>;
	contractSignDate?: InputMaybe<Scalars['date']>;
	contractType?: InputMaybe<Scalars['String']>;
	createdAt?: InputMaybe<Scalars['timestamptz']>;
	educationLevel?: InputMaybe<Scalars['String']>;
	geographicalArea?: InputMaybe<Scalars['String']>;
	id?: InputMaybe<Scalars['uuid']>;
	rightAre?: InputMaybe<Scalars['Boolean']>;
	rightAss?: InputMaybe<Scalars['Boolean']>;
	rightBonus?: InputMaybe<Scalars['Boolean']>;
	rightRqth?: InputMaybe<Scalars['Boolean']>;
	rightRsa?: InputMaybe<Scalars['String']>;
	updatedAt?: InputMaybe<Scalars['timestamptz']>;
	workSituation?: InputMaybe<Scalars['String']>;
	workSituationDate?: InputMaybe<Scalars['date']>;
};

/** columns and relationships of "notebook_target" */
export type NotebookTarget = {
	__typename?: 'notebook_target';
	/** An array relationship */
	actions: Array<NotebookAction>;
	/** An aggregate relationship */
	actions_aggregate: NotebookActionAggregate;
	createdAt: Scalars['timestamptz'];
	/** An object relationship */
	creator: Account;
	creatorId: Scalars['uuid'];
	/** An object relationship */
	focus: NotebookFocus;
	focusId: Scalars['uuid'];
	id: Scalars['uuid'];
	status: Scalars['String'];
	target: Scalars['String'];
	updatedAt: Scalars['timestamptz'];
};

/** columns and relationships of "notebook_target" */
export type NotebookTargetActionsArgs = {
	distinct_on?: InputMaybe<Array<NotebookActionSelectColumn>>;
	limit?: InputMaybe<Scalars['Int']>;
	offset?: InputMaybe<Scalars['Int']>;
	order_by?: InputMaybe<Array<NotebookActionOrderBy>>;
	where?: InputMaybe<NotebookActionBoolExp>;
};

/** columns and relationships of "notebook_target" */
export type NotebookTargetActionsAggregateArgs = {
	distinct_on?: InputMaybe<Array<NotebookActionSelectColumn>>;
	limit?: InputMaybe<Scalars['Int']>;
	offset?: InputMaybe<Scalars['Int']>;
	order_by?: InputMaybe<Array<NotebookActionOrderBy>>;
	where?: InputMaybe<NotebookActionBoolExp>;
};

/** aggregated selection of "notebook_target" */
export type NotebookTargetAggregate = {
	__typename?: 'notebook_target_aggregate';
	aggregate?: Maybe<NotebookTargetAggregateFields>;
	nodes: Array<NotebookTarget>;
};

/** aggregate fields of "notebook_target" */
export type NotebookTargetAggregateFields = {
	__typename?: 'notebook_target_aggregate_fields';
	count: Scalars['Int'];
	max?: Maybe<NotebookTargetMaxFields>;
	min?: Maybe<NotebookTargetMinFields>;
};

/** aggregate fields of "notebook_target" */
export type NotebookTargetAggregateFieldsCountArgs = {
	columns?: InputMaybe<Array<NotebookTargetSelectColumn>>;
	distinct?: InputMaybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "notebook_target" */
export type NotebookTargetAggregateOrderBy = {
	count?: InputMaybe<OrderBy>;
	max?: InputMaybe<NotebookTargetMaxOrderBy>;
	min?: InputMaybe<NotebookTargetMinOrderBy>;
};

/** input type for inserting array relation for remote table "notebook_target" */
export type NotebookTargetArrRelInsertInput = {
	data: Array<NotebookTargetInsertInput>;
	/** on conflict condition */
	on_conflict?: InputMaybe<NotebookTargetOnConflict>;
};

/** Boolean expression to filter rows from the table "notebook_target". All fields are combined with a logical 'AND'. */
export type NotebookTargetBoolExp = {
	_and?: InputMaybe<Array<NotebookTargetBoolExp>>;
	_not?: InputMaybe<NotebookTargetBoolExp>;
	_or?: InputMaybe<Array<NotebookTargetBoolExp>>;
	actions?: InputMaybe<NotebookActionBoolExp>;
	createdAt?: InputMaybe<TimestamptzComparisonExp>;
	creator?: InputMaybe<AccountBoolExp>;
	creatorId?: InputMaybe<UuidComparisonExp>;
	focus?: InputMaybe<NotebookFocusBoolExp>;
	focusId?: InputMaybe<UuidComparisonExp>;
	id?: InputMaybe<UuidComparisonExp>;
	status?: InputMaybe<StringComparisonExp>;
	target?: InputMaybe<StringComparisonExp>;
	updatedAt?: InputMaybe<TimestamptzComparisonExp>;
};

/** unique or primary key constraints on table "notebook_target" */
export enum NotebookTargetConstraint {
	/** unique or primary key constraint */
	NotebookTargetFocusIdTargetKey = 'notebook_target_focus_id_target_key',
	/** unique or primary key constraint */
	NotebookTargetPkey = 'notebook_target_pkey',
}

/** input type for inserting data into table "notebook_target" */
export type NotebookTargetInsertInput = {
	actions?: InputMaybe<NotebookActionArrRelInsertInput>;
	createdAt?: InputMaybe<Scalars['timestamptz']>;
	creator?: InputMaybe<AccountObjRelInsertInput>;
	creatorId?: InputMaybe<Scalars['uuid']>;
	focus?: InputMaybe<NotebookFocusObjRelInsertInput>;
	focusId?: InputMaybe<Scalars['uuid']>;
	id?: InputMaybe<Scalars['uuid']>;
	status?: InputMaybe<Scalars['String']>;
	target?: InputMaybe<Scalars['String']>;
	updatedAt?: InputMaybe<Scalars['timestamptz']>;
};

/** aggregate max on columns */
export type NotebookTargetMaxFields = {
	__typename?: 'notebook_target_max_fields';
	createdAt?: Maybe<Scalars['timestamptz']>;
	creatorId?: Maybe<Scalars['uuid']>;
	focusId?: Maybe<Scalars['uuid']>;
	id?: Maybe<Scalars['uuid']>;
	status?: Maybe<Scalars['String']>;
	target?: Maybe<Scalars['String']>;
	updatedAt?: Maybe<Scalars['timestamptz']>;
};

/** order by max() on columns of table "notebook_target" */
export type NotebookTargetMaxOrderBy = {
	createdAt?: InputMaybe<OrderBy>;
	creatorId?: InputMaybe<OrderBy>;
	focusId?: InputMaybe<OrderBy>;
	id?: InputMaybe<OrderBy>;
	status?: InputMaybe<OrderBy>;
	target?: InputMaybe<OrderBy>;
	updatedAt?: InputMaybe<OrderBy>;
};

/** aggregate min on columns */
export type NotebookTargetMinFields = {
	__typename?: 'notebook_target_min_fields';
	createdAt?: Maybe<Scalars['timestamptz']>;
	creatorId?: Maybe<Scalars['uuid']>;
	focusId?: Maybe<Scalars['uuid']>;
	id?: Maybe<Scalars['uuid']>;
	status?: Maybe<Scalars['String']>;
	target?: Maybe<Scalars['String']>;
	updatedAt?: Maybe<Scalars['timestamptz']>;
};

/** order by min() on columns of table "notebook_target" */
export type NotebookTargetMinOrderBy = {
	createdAt?: InputMaybe<OrderBy>;
	creatorId?: InputMaybe<OrderBy>;
	focusId?: InputMaybe<OrderBy>;
	id?: InputMaybe<OrderBy>;
	status?: InputMaybe<OrderBy>;
	target?: InputMaybe<OrderBy>;
	updatedAt?: InputMaybe<OrderBy>;
};

/** response of any mutation on the table "notebook_target" */
export type NotebookTargetMutationResponse = {
	__typename?: 'notebook_target_mutation_response';
	/** number of rows affected by the mutation */
	affected_rows: Scalars['Int'];
	/** data from the rows affected by the mutation */
	returning: Array<NotebookTarget>;
};

/** input type for inserting object relation for remote table "notebook_target" */
export type NotebookTargetObjRelInsertInput = {
	data: NotebookTargetInsertInput;
	/** on conflict condition */
	on_conflict?: InputMaybe<NotebookTargetOnConflict>;
};

/** on conflict condition type for table "notebook_target" */
export type NotebookTargetOnConflict = {
	constraint: NotebookTargetConstraint;
	update_columns?: Array<NotebookTargetUpdateColumn>;
	where?: InputMaybe<NotebookTargetBoolExp>;
};

/** Ordering options when selecting data from "notebook_target". */
export type NotebookTargetOrderBy = {
	actions_aggregate?: InputMaybe<NotebookActionAggregateOrderBy>;
	createdAt?: InputMaybe<OrderBy>;
	creator?: InputMaybe<AccountOrderBy>;
	creatorId?: InputMaybe<OrderBy>;
	focus?: InputMaybe<NotebookFocusOrderBy>;
	focusId?: InputMaybe<OrderBy>;
	id?: InputMaybe<OrderBy>;
	status?: InputMaybe<OrderBy>;
	target?: InputMaybe<OrderBy>;
	updatedAt?: InputMaybe<OrderBy>;
};

/** primary key columns input for table: notebook_target */
export type NotebookTargetPkColumnsInput = {
	id: Scalars['uuid'];
};

/** select columns of table "notebook_target" */
export enum NotebookTargetSelectColumn {
	/** column name */
	CreatedAt = 'createdAt',
	/** column name */
	CreatorId = 'creatorId',
	/** column name */
	FocusId = 'focusId',
	/** column name */
	Id = 'id',
	/** column name */
	Status = 'status',
	/** column name */
	Target = 'target',
	/** column name */
	UpdatedAt = 'updatedAt',
}

/** input type for updating data in table "notebook_target" */
export type NotebookTargetSetInput = {
	createdAt?: InputMaybe<Scalars['timestamptz']>;
	creatorId?: InputMaybe<Scalars['uuid']>;
	focusId?: InputMaybe<Scalars['uuid']>;
	id?: InputMaybe<Scalars['uuid']>;
	status?: InputMaybe<Scalars['String']>;
	target?: InputMaybe<Scalars['String']>;
	updatedAt?: InputMaybe<Scalars['timestamptz']>;
};

/** update columns of table "notebook_target" */
export enum NotebookTargetUpdateColumn {
	/** column name */
	CreatedAt = 'createdAt',
	/** column name */
	CreatorId = 'creatorId',
	/** column name */
	FocusId = 'focusId',
	/** column name */
	Id = 'id',
	/** column name */
	Status = 'status',
	/** column name */
	Target = 'target',
	/** column name */
	UpdatedAt = 'updatedAt',
}

/** update columns of table "notebook" */
export enum NotebookUpdateColumn {
	/** column name */
	BeneficiaryId = 'beneficiaryId',
	/** column name */
	ContractSignDate = 'contractSignDate',
	/** column name */
	ContractType = 'contractType',
	/** column name */
	CreatedAt = 'createdAt',
	/** column name */
	EducationLevel = 'educationLevel',
	/** column name */
	GeographicalArea = 'geographicalArea',
	/** column name */
	Id = 'id',
	/** column name */
	RightAre = 'rightAre',
	/** column name */
	RightAss = 'rightAss',
	/** column name */
	RightBonus = 'rightBonus',
	/** column name */
	RightRqth = 'rightRqth',
	/** column name */
	RightRsa = 'rightRsa',
	/** column name */
	UpdatedAt = 'updatedAt',
	/** column name */
	WorkSituation = 'workSituation',
	/** column name */
	WorkSituationDate = 'workSituationDate',
}

/** column ordering options */
export enum OrderBy {
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
	DescNullsLast = 'desc_nulls_last',
}

/** columns and relationships of "professional" */
export type Professional = {
	__typename?: 'professional';
	/** An object relationship */
	account?: Maybe<Account>;
	createdAt: Scalars['timestamptz'];
	email: Scalars['citext'];
	firstname: Scalars['String'];
	id: Scalars['uuid'];
	lastname: Scalars['String'];
	mobileNumber?: Maybe<Scalars['String']>;
	position?: Maybe<Scalars['String']>;
	/** An object relationship */
	structure: Structure;
	structureId: Scalars['uuid'];
	updatedAt: Scalars['timestamptz'];
};

/** aggregated selection of "professional" */
export type ProfessionalAggregate = {
	__typename?: 'professional_aggregate';
	aggregate?: Maybe<ProfessionalAggregateFields>;
	nodes: Array<Professional>;
};

/** aggregate fields of "professional" */
export type ProfessionalAggregateFields = {
	__typename?: 'professional_aggregate_fields';
	count: Scalars['Int'];
	max?: Maybe<ProfessionalMaxFields>;
	min?: Maybe<ProfessionalMinFields>;
};

/** aggregate fields of "professional" */
export type ProfessionalAggregateFieldsCountArgs = {
	columns?: InputMaybe<Array<ProfessionalSelectColumn>>;
	distinct?: InputMaybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "professional" */
export type ProfessionalAggregateOrderBy = {
	count?: InputMaybe<OrderBy>;
	max?: InputMaybe<ProfessionalMaxOrderBy>;
	min?: InputMaybe<ProfessionalMinOrderBy>;
};

/** input type for inserting array relation for remote table "professional" */
export type ProfessionalArrRelInsertInput = {
	data: Array<ProfessionalInsertInput>;
	/** on conflict condition */
	on_conflict?: InputMaybe<ProfessionalOnConflict>;
};

/** Boolean expression to filter rows from the table "professional". All fields are combined with a logical 'AND'. */
export type ProfessionalBoolExp = {
	_and?: InputMaybe<Array<ProfessionalBoolExp>>;
	_not?: InputMaybe<ProfessionalBoolExp>;
	_or?: InputMaybe<Array<ProfessionalBoolExp>>;
	account?: InputMaybe<AccountBoolExp>;
	createdAt?: InputMaybe<TimestamptzComparisonExp>;
	email?: InputMaybe<CitextComparisonExp>;
	firstname?: InputMaybe<StringComparisonExp>;
	id?: InputMaybe<UuidComparisonExp>;
	lastname?: InputMaybe<StringComparisonExp>;
	mobileNumber?: InputMaybe<StringComparisonExp>;
	position?: InputMaybe<StringComparisonExp>;
	structure?: InputMaybe<StructureBoolExp>;
	structureId?: InputMaybe<UuidComparisonExp>;
	updatedAt?: InputMaybe<TimestamptzComparisonExp>;
};

/** unique or primary key constraints on table "professional" */
export enum ProfessionalConstraint {
	/** unique or primary key constraint */
	ProfessionalEmailUnique = 'professional_email_unique',
	/** unique or primary key constraint */
	ProfessionalPkey = 'professional_pkey',
}

/** input type for inserting data into table "professional" */
export type ProfessionalInsertInput = {
	account?: InputMaybe<AccountObjRelInsertInput>;
	createdAt?: InputMaybe<Scalars['timestamptz']>;
	email?: InputMaybe<Scalars['citext']>;
	firstname?: InputMaybe<Scalars['String']>;
	id?: InputMaybe<Scalars['uuid']>;
	lastname?: InputMaybe<Scalars['String']>;
	mobileNumber?: InputMaybe<Scalars['String']>;
	position?: InputMaybe<Scalars['String']>;
	structure?: InputMaybe<StructureObjRelInsertInput>;
	structureId?: InputMaybe<Scalars['uuid']>;
	updatedAt?: InputMaybe<Scalars['timestamptz']>;
};

/** aggregate max on columns */
export type ProfessionalMaxFields = {
	__typename?: 'professional_max_fields';
	createdAt?: Maybe<Scalars['timestamptz']>;
	email?: Maybe<Scalars['citext']>;
	firstname?: Maybe<Scalars['String']>;
	id?: Maybe<Scalars['uuid']>;
	lastname?: Maybe<Scalars['String']>;
	mobileNumber?: Maybe<Scalars['String']>;
	position?: Maybe<Scalars['String']>;
	structureId?: Maybe<Scalars['uuid']>;
	updatedAt?: Maybe<Scalars['timestamptz']>;
};

/** order by max() on columns of table "professional" */
export type ProfessionalMaxOrderBy = {
	createdAt?: InputMaybe<OrderBy>;
	email?: InputMaybe<OrderBy>;
	firstname?: InputMaybe<OrderBy>;
	id?: InputMaybe<OrderBy>;
	lastname?: InputMaybe<OrderBy>;
	mobileNumber?: InputMaybe<OrderBy>;
	position?: InputMaybe<OrderBy>;
	structureId?: InputMaybe<OrderBy>;
	updatedAt?: InputMaybe<OrderBy>;
};

/** aggregate min on columns */
export type ProfessionalMinFields = {
	__typename?: 'professional_min_fields';
	createdAt?: Maybe<Scalars['timestamptz']>;
	email?: Maybe<Scalars['citext']>;
	firstname?: Maybe<Scalars['String']>;
	id?: Maybe<Scalars['uuid']>;
	lastname?: Maybe<Scalars['String']>;
	mobileNumber?: Maybe<Scalars['String']>;
	position?: Maybe<Scalars['String']>;
	structureId?: Maybe<Scalars['uuid']>;
	updatedAt?: Maybe<Scalars['timestamptz']>;
};

/** order by min() on columns of table "professional" */
export type ProfessionalMinOrderBy = {
	createdAt?: InputMaybe<OrderBy>;
	email?: InputMaybe<OrderBy>;
	firstname?: InputMaybe<OrderBy>;
	id?: InputMaybe<OrderBy>;
	lastname?: InputMaybe<OrderBy>;
	mobileNumber?: InputMaybe<OrderBy>;
	position?: InputMaybe<OrderBy>;
	structureId?: InputMaybe<OrderBy>;
	updatedAt?: InputMaybe<OrderBy>;
};

/** response of any mutation on the table "professional" */
export type ProfessionalMutationResponse = {
	__typename?: 'professional_mutation_response';
	/** number of rows affected by the mutation */
	affected_rows: Scalars['Int'];
	/** data from the rows affected by the mutation */
	returning: Array<Professional>;
};

/** input type for inserting object relation for remote table "professional" */
export type ProfessionalObjRelInsertInput = {
	data: ProfessionalInsertInput;
	/** on conflict condition */
	on_conflict?: InputMaybe<ProfessionalOnConflict>;
};

/** on conflict condition type for table "professional" */
export type ProfessionalOnConflict = {
	constraint: ProfessionalConstraint;
	update_columns?: Array<ProfessionalUpdateColumn>;
	where?: InputMaybe<ProfessionalBoolExp>;
};

/** Ordering options when selecting data from "professional". */
export type ProfessionalOrderBy = {
	account?: InputMaybe<AccountOrderBy>;
	createdAt?: InputMaybe<OrderBy>;
	email?: InputMaybe<OrderBy>;
	firstname?: InputMaybe<OrderBy>;
	id?: InputMaybe<OrderBy>;
	lastname?: InputMaybe<OrderBy>;
	mobileNumber?: InputMaybe<OrderBy>;
	position?: InputMaybe<OrderBy>;
	structure?: InputMaybe<StructureOrderBy>;
	structureId?: InputMaybe<OrderBy>;
	updatedAt?: InputMaybe<OrderBy>;
};

/** primary key columns input for table: professional */
export type ProfessionalPkColumnsInput = {
	id: Scalars['uuid'];
};

/** select columns of table "professional" */
export enum ProfessionalSelectColumn {
	/** column name */
	CreatedAt = 'createdAt',
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
	StructureId = 'structureId',
	/** column name */
	UpdatedAt = 'updatedAt',
}

/** input type for updating data in table "professional" */
export type ProfessionalSetInput = {
	createdAt?: InputMaybe<Scalars['timestamptz']>;
	email?: InputMaybe<Scalars['citext']>;
	firstname?: InputMaybe<Scalars['String']>;
	id?: InputMaybe<Scalars['uuid']>;
	lastname?: InputMaybe<Scalars['String']>;
	mobileNumber?: InputMaybe<Scalars['String']>;
	position?: InputMaybe<Scalars['String']>;
	structureId?: InputMaybe<Scalars['uuid']>;
	updatedAt?: InputMaybe<Scalars['timestamptz']>;
};

/** update columns of table "professional" */
export enum ProfessionalUpdateColumn {
	/** column name */
	CreatedAt = 'createdAt',
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
	StructureId = 'structureId',
	/** column name */
	UpdatedAt = 'updatedAt',
}

export type QueryRoot = {
	__typename?: 'query_root';
	/** fetch data from the table: "account" */
	account: Array<Account>;
	/** fetch aggregated fields from the table: "account" */
	account_aggregate: AccountAggregate;
	/** fetch data from the table: "account" using primary key columns */
	account_by_pk?: Maybe<Account>;
	/** fetch data from the table: "admin_cdb" */
	admin_cdb: Array<AdminCdb>;
	/** fetch aggregated fields from the table: "admin_cdb" */
	admin_cdb_aggregate: AdminCdbAggregate;
	/** fetch data from the table: "admin_cdb" using primary key columns */
	admin_cdb_by_pk?: Maybe<AdminCdb>;
	/** fetch data from the table: "admin_structure" */
	admin_structure: Array<AdminStructure>;
	/** fetch aggregated fields from the table: "admin_structure" */
	admin_structure_aggregate: AdminStructureAggregate;
	/** fetch data from the table: "admin_structure" using primary key columns */
	admin_structure_by_pk?: Maybe<AdminStructure>;
	/** fetch data from the table: "admin_structure_structure" */
	admin_structure_structure: Array<AdminStructureStructure>;
	/** fetch aggregated fields from the table: "admin_structure_structure" */
	admin_structure_structure_aggregate: AdminStructureStructureAggregate;
	/** fetch data from the table: "admin_structure_structure" using primary key columns */
	admin_structure_structure_by_pk?: Maybe<AdminStructureStructure>;
	/** fetch data from the table: "beneficiary" */
	beneficiary: Array<Beneficiary>;
	/** fetch aggregated fields from the table: "beneficiary" */
	beneficiary_aggregate: BeneficiaryAggregate;
	/** fetch data from the table: "beneficiary" using primary key columns */
	beneficiary_by_pk?: Maybe<Beneficiary>;
	/** fetch data from the table: "beneficiary_structure" */
	beneficiary_structure: Array<BeneficiaryStructure>;
	/** fetch aggregated fields from the table: "beneficiary_structure" */
	beneficiary_structure_aggregate: BeneficiaryStructureAggregate;
	/** fetch data from the table: "beneficiary_structure" using primary key columns */
	beneficiary_structure_by_pk?: Maybe<BeneficiaryStructure>;
	/** fetch data from the table: "deployment" */
	deployment: Array<Deployment>;
	/** fetch aggregated fields from the table: "deployment" */
	deployment_aggregate: DeploymentAggregate;
	/** fetch data from the table: "deployment" using primary key columns */
	deployment_by_pk?: Maybe<Deployment>;
	/** fetch data from the table: "manager" */
	manager: Array<Manager>;
	/** fetch aggregated fields from the table: "manager" */
	manager_aggregate: ManagerAggregate;
	/** fetch data from the table: "manager" using primary key columns */
	manager_by_pk?: Maybe<Manager>;
	/** fetch data from the table: "notebook" */
	notebook: Array<Notebook>;
	/** fetch data from the table: "notebook_action" */
	notebook_action: Array<NotebookAction>;
	/** fetch aggregated fields from the table: "notebook_action" */
	notebook_action_aggregate: NotebookActionAggregate;
	/** fetch data from the table: "notebook_action" using primary key columns */
	notebook_action_by_pk?: Maybe<NotebookAction>;
	/** fetch aggregated fields from the table: "notebook" */
	notebook_aggregate: NotebookAggregate;
	/** fetch data from the table: "notebook_appointment" */
	notebook_appointment: Array<NotebookAppointment>;
	/** fetch aggregated fields from the table: "notebook_appointment" */
	notebook_appointment_aggregate: NotebookAppointmentAggregate;
	/** fetch data from the table: "notebook_appointment" using primary key columns */
	notebook_appointment_by_pk?: Maybe<NotebookAppointment>;
	/** fetch data from the table: "notebook" using primary key columns */
	notebook_by_pk?: Maybe<Notebook>;
	/** fetch data from the table: "notebook_event" */
	notebook_event: Array<NotebookEvent>;
	/** fetch aggregated fields from the table: "notebook_event" */
	notebook_event_aggregate: NotebookEventAggregate;
	/** fetch data from the table: "notebook_event" using primary key columns */
	notebook_event_by_pk?: Maybe<NotebookEvent>;
	/** fetch data from the table: "notebook_event_type" */
	notebook_event_type: Array<NotebookEventType>;
	/** fetch aggregated fields from the table: "notebook_event_type" */
	notebook_event_type_aggregate: NotebookEventTypeAggregate;
	/** fetch data from the table: "notebook_event_type" using primary key columns */
	notebook_event_type_by_pk?: Maybe<NotebookEventType>;
	/** fetch data from the table: "notebook_focus" */
	notebook_focus: Array<NotebookFocus>;
	/** fetch aggregated fields from the table: "notebook_focus" */
	notebook_focus_aggregate: NotebookFocusAggregate;
	/** fetch data from the table: "notebook_focus" using primary key columns */
	notebook_focus_by_pk?: Maybe<NotebookFocus>;
	/** fetch data from the table: "notebook_member" */
	notebook_member: Array<NotebookMember>;
	/** fetch aggregated fields from the table: "notebook_member" */
	notebook_member_aggregate: NotebookMemberAggregate;
	/** fetch data from the table: "notebook_member" using primary key columns */
	notebook_member_by_pk?: Maybe<NotebookMember>;
	/** fetch data from the table: "notebook_target" */
	notebook_target: Array<NotebookTarget>;
	/** fetch aggregated fields from the table: "notebook_target" */
	notebook_target_aggregate: NotebookTargetAggregate;
	/** fetch data from the table: "notebook_target" using primary key columns */
	notebook_target_by_pk?: Maybe<NotebookTarget>;
	/** fetch data from the table: "professional" */
	professional: Array<Professional>;
	/** fetch aggregated fields from the table: "professional" */
	professional_aggregate: ProfessionalAggregate;
	/** fetch data from the table: "professional" using primary key columns */
	professional_by_pk?: Maybe<Professional>;
	/** fetch data from the table: "ref_action" */
	ref_action: Array<RefAction>;
	/** fetch aggregated fields from the table: "ref_action" */
	ref_action_aggregate: RefActionAggregate;
	/** fetch data from the table: "ref_action" using primary key columns */
	ref_action_by_pk?: Maybe<RefAction>;
	/** fetch data from the table: "ref_situation" */
	ref_situation: Array<RefSituation>;
	/** fetch aggregated fields from the table: "ref_situation" */
	ref_situation_aggregate: RefSituationAggregate;
	/** fetch data from the table: "ref_situation" using primary key columns */
	ref_situation_by_pk?: Maybe<RefSituation>;
	/** fetch data from the table: "ref_target" */
	ref_target: Array<RefTarget>;
	/** fetch aggregated fields from the table: "ref_target" */
	ref_target_aggregate: RefTargetAggregate;
	/** fetch data from the table: "ref_target" using primary key columns */
	ref_target_by_pk?: Maybe<RefTarget>;
	/** fetch data from the table: "rome_code" */
	rome_code: Array<RomeCode>;
	/** fetch aggregated fields from the table: "rome_code" */
	rome_code_aggregate: RomeCodeAggregate;
	/** fetch data from the table: "rome_code" using primary key columns */
	rome_code_by_pk?: Maybe<RomeCode>;
	/** execute function "search_beneficiaries" which returns "beneficiary" */
	search_beneficiaries: Array<Beneficiary>;
	/** execute function "search_beneficiaries" and query aggregates on result of table type "beneficiary" */
	search_beneficiaries_aggregate: BeneficiaryAggregate;
	/** execute function "search_notebook_members" which returns "notebook_member" */
	search_notebook_members: Array<NotebookMember>;
	/** execute function "search_notebook_members" and query aggregates on result of table type "notebook_member" */
	search_notebook_members_aggregate: NotebookMemberAggregate;
	/** execute function "search_rome_codes" which returns "rome_code" */
	search_rome_codes: Array<RomeCode>;
	/** execute function "search_rome_codes" and query aggregates on result of table type "rome_code" */
	search_rome_codes_aggregate: RomeCodeAggregate;
	/** fetch data from the table: "structure" */
	structure: Array<Structure>;
	/** fetch aggregated fields from the table: "structure" */
	structure_aggregate: StructureAggregate;
	/** fetch data from the table: "structure" using primary key columns */
	structure_by_pk?: Maybe<Structure>;
	/** fetch data from the table: "wanted_job" */
	wanted_job: Array<WantedJob>;
	/** fetch aggregated fields from the table: "wanted_job" */
	wanted_job_aggregate: WantedJobAggregate;
	/** fetch data from the table: "wanted_job" using primary key columns */
	wanted_job_by_pk?: Maybe<WantedJob>;
};

export type QueryRootAccountArgs = {
	distinct_on?: InputMaybe<Array<AccountSelectColumn>>;
	limit?: InputMaybe<Scalars['Int']>;
	offset?: InputMaybe<Scalars['Int']>;
	order_by?: InputMaybe<Array<AccountOrderBy>>;
	where?: InputMaybe<AccountBoolExp>;
};

export type QueryRootAccountAggregateArgs = {
	distinct_on?: InputMaybe<Array<AccountSelectColumn>>;
	limit?: InputMaybe<Scalars['Int']>;
	offset?: InputMaybe<Scalars['Int']>;
	order_by?: InputMaybe<Array<AccountOrderBy>>;
	where?: InputMaybe<AccountBoolExp>;
};

export type QueryRootAccountByPkArgs = {
	id: Scalars['uuid'];
};

export type QueryRootAdminCdbArgs = {
	distinct_on?: InputMaybe<Array<AdminCdbSelectColumn>>;
	limit?: InputMaybe<Scalars['Int']>;
	offset?: InputMaybe<Scalars['Int']>;
	order_by?: InputMaybe<Array<AdminCdbOrderBy>>;
	where?: InputMaybe<AdminCdbBoolExp>;
};

export type QueryRootAdminCdbAggregateArgs = {
	distinct_on?: InputMaybe<Array<AdminCdbSelectColumn>>;
	limit?: InputMaybe<Scalars['Int']>;
	offset?: InputMaybe<Scalars['Int']>;
	order_by?: InputMaybe<Array<AdminCdbOrderBy>>;
	where?: InputMaybe<AdminCdbBoolExp>;
};

export type QueryRootAdminCdbByPkArgs = {
	id: Scalars['uuid'];
};

export type QueryRootAdminStructureArgs = {
	distinct_on?: InputMaybe<Array<AdminStructureSelectColumn>>;
	limit?: InputMaybe<Scalars['Int']>;
	offset?: InputMaybe<Scalars['Int']>;
	order_by?: InputMaybe<Array<AdminStructureOrderBy>>;
	where?: InputMaybe<AdminStructureBoolExp>;
};

export type QueryRootAdminStructureAggregateArgs = {
	distinct_on?: InputMaybe<Array<AdminStructureSelectColumn>>;
	limit?: InputMaybe<Scalars['Int']>;
	offset?: InputMaybe<Scalars['Int']>;
	order_by?: InputMaybe<Array<AdminStructureOrderBy>>;
	where?: InputMaybe<AdminStructureBoolExp>;
};

export type QueryRootAdminStructureByPkArgs = {
	id: Scalars['uuid'];
};

export type QueryRootAdminStructureStructureArgs = {
	distinct_on?: InputMaybe<Array<AdminStructureStructureSelectColumn>>;
	limit?: InputMaybe<Scalars['Int']>;
	offset?: InputMaybe<Scalars['Int']>;
	order_by?: InputMaybe<Array<AdminStructureStructureOrderBy>>;
	where?: InputMaybe<AdminStructureStructureBoolExp>;
};

export type QueryRootAdminStructureStructureAggregateArgs = {
	distinct_on?: InputMaybe<Array<AdminStructureStructureSelectColumn>>;
	limit?: InputMaybe<Scalars['Int']>;
	offset?: InputMaybe<Scalars['Int']>;
	order_by?: InputMaybe<Array<AdminStructureStructureOrderBy>>;
	where?: InputMaybe<AdminStructureStructureBoolExp>;
};

export type QueryRootAdminStructureStructureByPkArgs = {
	id: Scalars['uuid'];
};

export type QueryRootBeneficiaryArgs = {
	distinct_on?: InputMaybe<Array<BeneficiarySelectColumn>>;
	limit?: InputMaybe<Scalars['Int']>;
	offset?: InputMaybe<Scalars['Int']>;
	order_by?: InputMaybe<Array<BeneficiaryOrderBy>>;
	where?: InputMaybe<BeneficiaryBoolExp>;
};

export type QueryRootBeneficiaryAggregateArgs = {
	distinct_on?: InputMaybe<Array<BeneficiarySelectColumn>>;
	limit?: InputMaybe<Scalars['Int']>;
	offset?: InputMaybe<Scalars['Int']>;
	order_by?: InputMaybe<Array<BeneficiaryOrderBy>>;
	where?: InputMaybe<BeneficiaryBoolExp>;
};

export type QueryRootBeneficiaryByPkArgs = {
	id: Scalars['uuid'];
};

export type QueryRootBeneficiaryStructureArgs = {
	distinct_on?: InputMaybe<Array<BeneficiaryStructureSelectColumn>>;
	limit?: InputMaybe<Scalars['Int']>;
	offset?: InputMaybe<Scalars['Int']>;
	order_by?: InputMaybe<Array<BeneficiaryStructureOrderBy>>;
	where?: InputMaybe<BeneficiaryStructureBoolExp>;
};

export type QueryRootBeneficiaryStructureAggregateArgs = {
	distinct_on?: InputMaybe<Array<BeneficiaryStructureSelectColumn>>;
	limit?: InputMaybe<Scalars['Int']>;
	offset?: InputMaybe<Scalars['Int']>;
	order_by?: InputMaybe<Array<BeneficiaryStructureOrderBy>>;
	where?: InputMaybe<BeneficiaryStructureBoolExp>;
};

export type QueryRootBeneficiaryStructureByPkArgs = {
	id: Scalars['uuid'];
};

export type QueryRootDeploymentArgs = {
	distinct_on?: InputMaybe<Array<DeploymentSelectColumn>>;
	limit?: InputMaybe<Scalars['Int']>;
	offset?: InputMaybe<Scalars['Int']>;
	order_by?: InputMaybe<Array<DeploymentOrderBy>>;
	where?: InputMaybe<DeploymentBoolExp>;
};

export type QueryRootDeploymentAggregateArgs = {
	distinct_on?: InputMaybe<Array<DeploymentSelectColumn>>;
	limit?: InputMaybe<Scalars['Int']>;
	offset?: InputMaybe<Scalars['Int']>;
	order_by?: InputMaybe<Array<DeploymentOrderBy>>;
	where?: InputMaybe<DeploymentBoolExp>;
};

export type QueryRootDeploymentByPkArgs = {
	id: Scalars['uuid'];
};

export type QueryRootManagerArgs = {
	distinct_on?: InputMaybe<Array<ManagerSelectColumn>>;
	limit?: InputMaybe<Scalars['Int']>;
	offset?: InputMaybe<Scalars['Int']>;
	order_by?: InputMaybe<Array<ManagerOrderBy>>;
	where?: InputMaybe<ManagerBoolExp>;
};

export type QueryRootManagerAggregateArgs = {
	distinct_on?: InputMaybe<Array<ManagerSelectColumn>>;
	limit?: InputMaybe<Scalars['Int']>;
	offset?: InputMaybe<Scalars['Int']>;
	order_by?: InputMaybe<Array<ManagerOrderBy>>;
	where?: InputMaybe<ManagerBoolExp>;
};

export type QueryRootManagerByPkArgs = {
	id: Scalars['uuid'];
};

export type QueryRootNotebookArgs = {
	distinct_on?: InputMaybe<Array<NotebookSelectColumn>>;
	limit?: InputMaybe<Scalars['Int']>;
	offset?: InputMaybe<Scalars['Int']>;
	order_by?: InputMaybe<Array<NotebookOrderBy>>;
	where?: InputMaybe<NotebookBoolExp>;
};

export type QueryRootNotebookActionArgs = {
	distinct_on?: InputMaybe<Array<NotebookActionSelectColumn>>;
	limit?: InputMaybe<Scalars['Int']>;
	offset?: InputMaybe<Scalars['Int']>;
	order_by?: InputMaybe<Array<NotebookActionOrderBy>>;
	where?: InputMaybe<NotebookActionBoolExp>;
};

export type QueryRootNotebookActionAggregateArgs = {
	distinct_on?: InputMaybe<Array<NotebookActionSelectColumn>>;
	limit?: InputMaybe<Scalars['Int']>;
	offset?: InputMaybe<Scalars['Int']>;
	order_by?: InputMaybe<Array<NotebookActionOrderBy>>;
	where?: InputMaybe<NotebookActionBoolExp>;
};

export type QueryRootNotebookActionByPkArgs = {
	id: Scalars['uuid'];
};

export type QueryRootNotebookAggregateArgs = {
	distinct_on?: InputMaybe<Array<NotebookSelectColumn>>;
	limit?: InputMaybe<Scalars['Int']>;
	offset?: InputMaybe<Scalars['Int']>;
	order_by?: InputMaybe<Array<NotebookOrderBy>>;
	where?: InputMaybe<NotebookBoolExp>;
};

export type QueryRootNotebookAppointmentArgs = {
	distinct_on?: InputMaybe<Array<NotebookAppointmentSelectColumn>>;
	limit?: InputMaybe<Scalars['Int']>;
	offset?: InputMaybe<Scalars['Int']>;
	order_by?: InputMaybe<Array<NotebookAppointmentOrderBy>>;
	where?: InputMaybe<NotebookAppointmentBoolExp>;
};

export type QueryRootNotebookAppointmentAggregateArgs = {
	distinct_on?: InputMaybe<Array<NotebookAppointmentSelectColumn>>;
	limit?: InputMaybe<Scalars['Int']>;
	offset?: InputMaybe<Scalars['Int']>;
	order_by?: InputMaybe<Array<NotebookAppointmentOrderBy>>;
	where?: InputMaybe<NotebookAppointmentBoolExp>;
};

export type QueryRootNotebookAppointmentByPkArgs = {
	id: Scalars['uuid'];
};

export type QueryRootNotebookByPkArgs = {
	id: Scalars['uuid'];
};

export type QueryRootNotebookEventArgs = {
	distinct_on?: InputMaybe<Array<NotebookEventSelectColumn>>;
	limit?: InputMaybe<Scalars['Int']>;
	offset?: InputMaybe<Scalars['Int']>;
	order_by?: InputMaybe<Array<NotebookEventOrderBy>>;
	where?: InputMaybe<NotebookEventBoolExp>;
};

export type QueryRootNotebookEventAggregateArgs = {
	distinct_on?: InputMaybe<Array<NotebookEventSelectColumn>>;
	limit?: InputMaybe<Scalars['Int']>;
	offset?: InputMaybe<Scalars['Int']>;
	order_by?: InputMaybe<Array<NotebookEventOrderBy>>;
	where?: InputMaybe<NotebookEventBoolExp>;
};

export type QueryRootNotebookEventByPkArgs = {
	id: Scalars['uuid'];
};

export type QueryRootNotebookEventTypeArgs = {
	distinct_on?: InputMaybe<Array<NotebookEventTypeSelectColumn>>;
	limit?: InputMaybe<Scalars['Int']>;
	offset?: InputMaybe<Scalars['Int']>;
	order_by?: InputMaybe<Array<NotebookEventTypeOrderBy>>;
	where?: InputMaybe<NotebookEventTypeBoolExp>;
};

export type QueryRootNotebookEventTypeAggregateArgs = {
	distinct_on?: InputMaybe<Array<NotebookEventTypeSelectColumn>>;
	limit?: InputMaybe<Scalars['Int']>;
	offset?: InputMaybe<Scalars['Int']>;
	order_by?: InputMaybe<Array<NotebookEventTypeOrderBy>>;
	where?: InputMaybe<NotebookEventTypeBoolExp>;
};

export type QueryRootNotebookEventTypeByPkArgs = {
	value: Scalars['String'];
};

export type QueryRootNotebookFocusArgs = {
	distinct_on?: InputMaybe<Array<NotebookFocusSelectColumn>>;
	limit?: InputMaybe<Scalars['Int']>;
	offset?: InputMaybe<Scalars['Int']>;
	order_by?: InputMaybe<Array<NotebookFocusOrderBy>>;
	where?: InputMaybe<NotebookFocusBoolExp>;
};

export type QueryRootNotebookFocusAggregateArgs = {
	distinct_on?: InputMaybe<Array<NotebookFocusSelectColumn>>;
	limit?: InputMaybe<Scalars['Int']>;
	offset?: InputMaybe<Scalars['Int']>;
	order_by?: InputMaybe<Array<NotebookFocusOrderBy>>;
	where?: InputMaybe<NotebookFocusBoolExp>;
};

export type QueryRootNotebookFocusByPkArgs = {
	id: Scalars['uuid'];
};

export type QueryRootNotebookMemberArgs = {
	distinct_on?: InputMaybe<Array<NotebookMemberSelectColumn>>;
	limit?: InputMaybe<Scalars['Int']>;
	offset?: InputMaybe<Scalars['Int']>;
	order_by?: InputMaybe<Array<NotebookMemberOrderBy>>;
	where?: InputMaybe<NotebookMemberBoolExp>;
};

export type QueryRootNotebookMemberAggregateArgs = {
	distinct_on?: InputMaybe<Array<NotebookMemberSelectColumn>>;
	limit?: InputMaybe<Scalars['Int']>;
	offset?: InputMaybe<Scalars['Int']>;
	order_by?: InputMaybe<Array<NotebookMemberOrderBy>>;
	where?: InputMaybe<NotebookMemberBoolExp>;
};

export type QueryRootNotebookMemberByPkArgs = {
	id: Scalars['uuid'];
};

export type QueryRootNotebookTargetArgs = {
	distinct_on?: InputMaybe<Array<NotebookTargetSelectColumn>>;
	limit?: InputMaybe<Scalars['Int']>;
	offset?: InputMaybe<Scalars['Int']>;
	order_by?: InputMaybe<Array<NotebookTargetOrderBy>>;
	where?: InputMaybe<NotebookTargetBoolExp>;
};

export type QueryRootNotebookTargetAggregateArgs = {
	distinct_on?: InputMaybe<Array<NotebookTargetSelectColumn>>;
	limit?: InputMaybe<Scalars['Int']>;
	offset?: InputMaybe<Scalars['Int']>;
	order_by?: InputMaybe<Array<NotebookTargetOrderBy>>;
	where?: InputMaybe<NotebookTargetBoolExp>;
};

export type QueryRootNotebookTargetByPkArgs = {
	id: Scalars['uuid'];
};

export type QueryRootProfessionalArgs = {
	distinct_on?: InputMaybe<Array<ProfessionalSelectColumn>>;
	limit?: InputMaybe<Scalars['Int']>;
	offset?: InputMaybe<Scalars['Int']>;
	order_by?: InputMaybe<Array<ProfessionalOrderBy>>;
	where?: InputMaybe<ProfessionalBoolExp>;
};

export type QueryRootProfessionalAggregateArgs = {
	distinct_on?: InputMaybe<Array<ProfessionalSelectColumn>>;
	limit?: InputMaybe<Scalars['Int']>;
	offset?: InputMaybe<Scalars['Int']>;
	order_by?: InputMaybe<Array<ProfessionalOrderBy>>;
	where?: InputMaybe<ProfessionalBoolExp>;
};

export type QueryRootProfessionalByPkArgs = {
	id: Scalars['uuid'];
};

export type QueryRootRefActionArgs = {
	distinct_on?: InputMaybe<Array<RefActionSelectColumn>>;
	limit?: InputMaybe<Scalars['Int']>;
	offset?: InputMaybe<Scalars['Int']>;
	order_by?: InputMaybe<Array<RefActionOrderBy>>;
	where?: InputMaybe<RefActionBoolExp>;
};

export type QueryRootRefActionAggregateArgs = {
	distinct_on?: InputMaybe<Array<RefActionSelectColumn>>;
	limit?: InputMaybe<Scalars['Int']>;
	offset?: InputMaybe<Scalars['Int']>;
	order_by?: InputMaybe<Array<RefActionOrderBy>>;
	where?: InputMaybe<RefActionBoolExp>;
};

export type QueryRootRefActionByPkArgs = {
	id: Scalars['uuid'];
};

export type QueryRootRefSituationArgs = {
	distinct_on?: InputMaybe<Array<RefSituationSelectColumn>>;
	limit?: InputMaybe<Scalars['Int']>;
	offset?: InputMaybe<Scalars['Int']>;
	order_by?: InputMaybe<Array<RefSituationOrderBy>>;
	where?: InputMaybe<RefSituationBoolExp>;
};

export type QueryRootRefSituationAggregateArgs = {
	distinct_on?: InputMaybe<Array<RefSituationSelectColumn>>;
	limit?: InputMaybe<Scalars['Int']>;
	offset?: InputMaybe<Scalars['Int']>;
	order_by?: InputMaybe<Array<RefSituationOrderBy>>;
	where?: InputMaybe<RefSituationBoolExp>;
};

export type QueryRootRefSituationByPkArgs = {
	id: Scalars['uuid'];
};

export type QueryRootRefTargetArgs = {
	distinct_on?: InputMaybe<Array<RefTargetSelectColumn>>;
	limit?: InputMaybe<Scalars['Int']>;
	offset?: InputMaybe<Scalars['Int']>;
	order_by?: InputMaybe<Array<RefTargetOrderBy>>;
	where?: InputMaybe<RefTargetBoolExp>;
};

export type QueryRootRefTargetAggregateArgs = {
	distinct_on?: InputMaybe<Array<RefTargetSelectColumn>>;
	limit?: InputMaybe<Scalars['Int']>;
	offset?: InputMaybe<Scalars['Int']>;
	order_by?: InputMaybe<Array<RefTargetOrderBy>>;
	where?: InputMaybe<RefTargetBoolExp>;
};

export type QueryRootRefTargetByPkArgs = {
	id: Scalars['uuid'];
};

export type QueryRootRomeCodeArgs = {
	distinct_on?: InputMaybe<Array<RomeCodeSelectColumn>>;
	limit?: InputMaybe<Scalars['Int']>;
	offset?: InputMaybe<Scalars['Int']>;
	order_by?: InputMaybe<Array<RomeCodeOrderBy>>;
	where?: InputMaybe<RomeCodeBoolExp>;
};

export type QueryRootRomeCodeAggregateArgs = {
	distinct_on?: InputMaybe<Array<RomeCodeSelectColumn>>;
	limit?: InputMaybe<Scalars['Int']>;
	offset?: InputMaybe<Scalars['Int']>;
	order_by?: InputMaybe<Array<RomeCodeOrderBy>>;
	where?: InputMaybe<RomeCodeBoolExp>;
};

export type QueryRootRomeCodeByPkArgs = {
	id: Scalars['uuid'];
};

export type QueryRootSearchBeneficiariesArgs = {
	args: SearchBeneficiariesArgs;
	distinct_on?: InputMaybe<Array<BeneficiarySelectColumn>>;
	limit?: InputMaybe<Scalars['Int']>;
	offset?: InputMaybe<Scalars['Int']>;
	order_by?: InputMaybe<Array<BeneficiaryOrderBy>>;
	where?: InputMaybe<BeneficiaryBoolExp>;
};

export type QueryRootSearchBeneficiariesAggregateArgs = {
	args: SearchBeneficiariesArgs;
	distinct_on?: InputMaybe<Array<BeneficiarySelectColumn>>;
	limit?: InputMaybe<Scalars['Int']>;
	offset?: InputMaybe<Scalars['Int']>;
	order_by?: InputMaybe<Array<BeneficiaryOrderBy>>;
	where?: InputMaybe<BeneficiaryBoolExp>;
};

export type QueryRootSearchNotebookMembersArgs = {
	args: SearchNotebookMembersArgs;
	distinct_on?: InputMaybe<Array<NotebookMemberSelectColumn>>;
	limit?: InputMaybe<Scalars['Int']>;
	offset?: InputMaybe<Scalars['Int']>;
	order_by?: InputMaybe<Array<NotebookMemberOrderBy>>;
	where?: InputMaybe<NotebookMemberBoolExp>;
};

export type QueryRootSearchNotebookMembersAggregateArgs = {
	args: SearchNotebookMembersArgs;
	distinct_on?: InputMaybe<Array<NotebookMemberSelectColumn>>;
	limit?: InputMaybe<Scalars['Int']>;
	offset?: InputMaybe<Scalars['Int']>;
	order_by?: InputMaybe<Array<NotebookMemberOrderBy>>;
	where?: InputMaybe<NotebookMemberBoolExp>;
};

export type QueryRootSearchRomeCodesArgs = {
	args: SearchRomeCodesArgs;
	distinct_on?: InputMaybe<Array<RomeCodeSelectColumn>>;
	limit?: InputMaybe<Scalars['Int']>;
	offset?: InputMaybe<Scalars['Int']>;
	order_by?: InputMaybe<Array<RomeCodeOrderBy>>;
	where?: InputMaybe<RomeCodeBoolExp>;
};

export type QueryRootSearchRomeCodesAggregateArgs = {
	args: SearchRomeCodesArgs;
	distinct_on?: InputMaybe<Array<RomeCodeSelectColumn>>;
	limit?: InputMaybe<Scalars['Int']>;
	offset?: InputMaybe<Scalars['Int']>;
	order_by?: InputMaybe<Array<RomeCodeOrderBy>>;
	where?: InputMaybe<RomeCodeBoolExp>;
};

export type QueryRootStructureArgs = {
	distinct_on?: InputMaybe<Array<StructureSelectColumn>>;
	limit?: InputMaybe<Scalars['Int']>;
	offset?: InputMaybe<Scalars['Int']>;
	order_by?: InputMaybe<Array<StructureOrderBy>>;
	where?: InputMaybe<StructureBoolExp>;
};

export type QueryRootStructureAggregateArgs = {
	distinct_on?: InputMaybe<Array<StructureSelectColumn>>;
	limit?: InputMaybe<Scalars['Int']>;
	offset?: InputMaybe<Scalars['Int']>;
	order_by?: InputMaybe<Array<StructureOrderBy>>;
	where?: InputMaybe<StructureBoolExp>;
};

export type QueryRootStructureByPkArgs = {
	id: Scalars['uuid'];
};

export type QueryRootWantedJobArgs = {
	distinct_on?: InputMaybe<Array<WantedJobSelectColumn>>;
	limit?: InputMaybe<Scalars['Int']>;
	offset?: InputMaybe<Scalars['Int']>;
	order_by?: InputMaybe<Array<WantedJobOrderBy>>;
	where?: InputMaybe<WantedJobBoolExp>;
};

export type QueryRootWantedJobAggregateArgs = {
	distinct_on?: InputMaybe<Array<WantedJobSelectColumn>>;
	limit?: InputMaybe<Scalars['Int']>;
	offset?: InputMaybe<Scalars['Int']>;
	order_by?: InputMaybe<Array<WantedJobOrderBy>>;
	where?: InputMaybe<WantedJobBoolExp>;
};

export type QueryRootWantedJobByPkArgs = {
	id: Scalars['uuid'];
};

/** columns and relationships of "ref_action" */
export type RefAction = {
	__typename?: 'ref_action';
	description: Scalars['String'];
	id: Scalars['uuid'];
	theme: Scalars['String'];
};

/** aggregated selection of "ref_action" */
export type RefActionAggregate = {
	__typename?: 'ref_action_aggregate';
	aggregate?: Maybe<RefActionAggregateFields>;
	nodes: Array<RefAction>;
};

/** aggregate fields of "ref_action" */
export type RefActionAggregateFields = {
	__typename?: 'ref_action_aggregate_fields';
	count: Scalars['Int'];
	max?: Maybe<RefActionMaxFields>;
	min?: Maybe<RefActionMinFields>;
};

/** aggregate fields of "ref_action" */
export type RefActionAggregateFieldsCountArgs = {
	columns?: InputMaybe<Array<RefActionSelectColumn>>;
	distinct?: InputMaybe<Scalars['Boolean']>;
};

/** Boolean expression to filter rows from the table "ref_action". All fields are combined with a logical 'AND'. */
export type RefActionBoolExp = {
	_and?: InputMaybe<Array<RefActionBoolExp>>;
	_not?: InputMaybe<RefActionBoolExp>;
	_or?: InputMaybe<Array<RefActionBoolExp>>;
	description?: InputMaybe<StringComparisonExp>;
	id?: InputMaybe<UuidComparisonExp>;
	theme?: InputMaybe<StringComparisonExp>;
};

/** unique or primary key constraints on table "ref_action" */
export enum RefActionConstraint {
	/** unique or primary key constraint */
	RefActionPkey = 'ref_action_pkey',
}

/** input type for inserting data into table "ref_action" */
export type RefActionInsertInput = {
	description?: InputMaybe<Scalars['String']>;
	id?: InputMaybe<Scalars['uuid']>;
	theme?: InputMaybe<Scalars['String']>;
};

/** aggregate max on columns */
export type RefActionMaxFields = {
	__typename?: 'ref_action_max_fields';
	description?: Maybe<Scalars['String']>;
	id?: Maybe<Scalars['uuid']>;
	theme?: Maybe<Scalars['String']>;
};

/** aggregate min on columns */
export type RefActionMinFields = {
	__typename?: 'ref_action_min_fields';
	description?: Maybe<Scalars['String']>;
	id?: Maybe<Scalars['uuid']>;
	theme?: Maybe<Scalars['String']>;
};

/** response of any mutation on the table "ref_action" */
export type RefActionMutationResponse = {
	__typename?: 'ref_action_mutation_response';
	/** number of rows affected by the mutation */
	affected_rows: Scalars['Int'];
	/** data from the rows affected by the mutation */
	returning: Array<RefAction>;
};

/** on conflict condition type for table "ref_action" */
export type RefActionOnConflict = {
	constraint: RefActionConstraint;
	update_columns?: Array<RefActionUpdateColumn>;
	where?: InputMaybe<RefActionBoolExp>;
};

/** Ordering options when selecting data from "ref_action". */
export type RefActionOrderBy = {
	description?: InputMaybe<OrderBy>;
	id?: InputMaybe<OrderBy>;
	theme?: InputMaybe<OrderBy>;
};

/** primary key columns input for table: ref_action */
export type RefActionPkColumnsInput = {
	id: Scalars['uuid'];
};

/** select columns of table "ref_action" */
export enum RefActionSelectColumn {
	/** column name */
	Description = 'description',
	/** column name */
	Id = 'id',
	/** column name */
	Theme = 'theme',
}

/** input type for updating data in table "ref_action" */
export type RefActionSetInput = {
	description?: InputMaybe<Scalars['String']>;
	id?: InputMaybe<Scalars['uuid']>;
	theme?: InputMaybe<Scalars['String']>;
};

/** update columns of table "ref_action" */
export enum RefActionUpdateColumn {
	/** column name */
	Description = 'description',
	/** column name */
	Id = 'id',
	/** column name */
	Theme = 'theme',
}

/** columns and relationships of "ref_situation" */
export type RefSituation = {
	__typename?: 'ref_situation';
	description: Scalars['String'];
	id: Scalars['uuid'];
	theme: Scalars['String'];
};

/** aggregated selection of "ref_situation" */
export type RefSituationAggregate = {
	__typename?: 'ref_situation_aggregate';
	aggregate?: Maybe<RefSituationAggregateFields>;
	nodes: Array<RefSituation>;
};

/** aggregate fields of "ref_situation" */
export type RefSituationAggregateFields = {
	__typename?: 'ref_situation_aggregate_fields';
	count: Scalars['Int'];
	max?: Maybe<RefSituationMaxFields>;
	min?: Maybe<RefSituationMinFields>;
};

/** aggregate fields of "ref_situation" */
export type RefSituationAggregateFieldsCountArgs = {
	columns?: InputMaybe<Array<RefSituationSelectColumn>>;
	distinct?: InputMaybe<Scalars['Boolean']>;
};

/** Boolean expression to filter rows from the table "ref_situation". All fields are combined with a logical 'AND'. */
export type RefSituationBoolExp = {
	_and?: InputMaybe<Array<RefSituationBoolExp>>;
	_not?: InputMaybe<RefSituationBoolExp>;
	_or?: InputMaybe<Array<RefSituationBoolExp>>;
	description?: InputMaybe<StringComparisonExp>;
	id?: InputMaybe<UuidComparisonExp>;
	theme?: InputMaybe<StringComparisonExp>;
};

/** unique or primary key constraints on table "ref_situation" */
export enum RefSituationConstraint {
	/** unique or primary key constraint */
	RefSituationPkey = 'ref_situation_pkey',
}

/** input type for inserting data into table "ref_situation" */
export type RefSituationInsertInput = {
	description?: InputMaybe<Scalars['String']>;
	id?: InputMaybe<Scalars['uuid']>;
	theme?: InputMaybe<Scalars['String']>;
};

/** aggregate max on columns */
export type RefSituationMaxFields = {
	__typename?: 'ref_situation_max_fields';
	description?: Maybe<Scalars['String']>;
	id?: Maybe<Scalars['uuid']>;
	theme?: Maybe<Scalars['String']>;
};

/** aggregate min on columns */
export type RefSituationMinFields = {
	__typename?: 'ref_situation_min_fields';
	description?: Maybe<Scalars['String']>;
	id?: Maybe<Scalars['uuid']>;
	theme?: Maybe<Scalars['String']>;
};

/** response of any mutation on the table "ref_situation" */
export type RefSituationMutationResponse = {
	__typename?: 'ref_situation_mutation_response';
	/** number of rows affected by the mutation */
	affected_rows: Scalars['Int'];
	/** data from the rows affected by the mutation */
	returning: Array<RefSituation>;
};

/** on conflict condition type for table "ref_situation" */
export type RefSituationOnConflict = {
	constraint: RefSituationConstraint;
	update_columns?: Array<RefSituationUpdateColumn>;
	where?: InputMaybe<RefSituationBoolExp>;
};

/** Ordering options when selecting data from "ref_situation". */
export type RefSituationOrderBy = {
	description?: InputMaybe<OrderBy>;
	id?: InputMaybe<OrderBy>;
	theme?: InputMaybe<OrderBy>;
};

/** primary key columns input for table: ref_situation */
export type RefSituationPkColumnsInput = {
	id: Scalars['uuid'];
};

/** select columns of table "ref_situation" */
export enum RefSituationSelectColumn {
	/** column name */
	Description = 'description',
	/** column name */
	Id = 'id',
	/** column name */
	Theme = 'theme',
}

/** input type for updating data in table "ref_situation" */
export type RefSituationSetInput = {
	description?: InputMaybe<Scalars['String']>;
	id?: InputMaybe<Scalars['uuid']>;
	theme?: InputMaybe<Scalars['String']>;
};

/** update columns of table "ref_situation" */
export enum RefSituationUpdateColumn {
	/** column name */
	Description = 'description',
	/** column name */
	Id = 'id',
	/** column name */
	Theme = 'theme',
}

/** columns and relationships of "ref_target" */
export type RefTarget = {
	__typename?: 'ref_target';
	description: Scalars['String'];
	id: Scalars['uuid'];
	theme: Scalars['String'];
};

/** aggregated selection of "ref_target" */
export type RefTargetAggregate = {
	__typename?: 'ref_target_aggregate';
	aggregate?: Maybe<RefTargetAggregateFields>;
	nodes: Array<RefTarget>;
};

/** aggregate fields of "ref_target" */
export type RefTargetAggregateFields = {
	__typename?: 'ref_target_aggregate_fields';
	count: Scalars['Int'];
	max?: Maybe<RefTargetMaxFields>;
	min?: Maybe<RefTargetMinFields>;
};

/** aggregate fields of "ref_target" */
export type RefTargetAggregateFieldsCountArgs = {
	columns?: InputMaybe<Array<RefTargetSelectColumn>>;
	distinct?: InputMaybe<Scalars['Boolean']>;
};

/** Boolean expression to filter rows from the table "ref_target". All fields are combined with a logical 'AND'. */
export type RefTargetBoolExp = {
	_and?: InputMaybe<Array<RefTargetBoolExp>>;
	_not?: InputMaybe<RefTargetBoolExp>;
	_or?: InputMaybe<Array<RefTargetBoolExp>>;
	description?: InputMaybe<StringComparisonExp>;
	id?: InputMaybe<UuidComparisonExp>;
	theme?: InputMaybe<StringComparisonExp>;
};

/** unique or primary key constraints on table "ref_target" */
export enum RefTargetConstraint {
	/** unique or primary key constraint */
	RefTargetPkey = 'ref_target_pkey',
}

/** input type for inserting data into table "ref_target" */
export type RefTargetInsertInput = {
	description?: InputMaybe<Scalars['String']>;
	id?: InputMaybe<Scalars['uuid']>;
	theme?: InputMaybe<Scalars['String']>;
};

/** aggregate max on columns */
export type RefTargetMaxFields = {
	__typename?: 'ref_target_max_fields';
	description?: Maybe<Scalars['String']>;
	id?: Maybe<Scalars['uuid']>;
	theme?: Maybe<Scalars['String']>;
};

/** aggregate min on columns */
export type RefTargetMinFields = {
	__typename?: 'ref_target_min_fields';
	description?: Maybe<Scalars['String']>;
	id?: Maybe<Scalars['uuid']>;
	theme?: Maybe<Scalars['String']>;
};

/** response of any mutation on the table "ref_target" */
export type RefTargetMutationResponse = {
	__typename?: 'ref_target_mutation_response';
	/** number of rows affected by the mutation */
	affected_rows: Scalars['Int'];
	/** data from the rows affected by the mutation */
	returning: Array<RefTarget>;
};

/** on conflict condition type for table "ref_target" */
export type RefTargetOnConflict = {
	constraint: RefTargetConstraint;
	update_columns?: Array<RefTargetUpdateColumn>;
	where?: InputMaybe<RefTargetBoolExp>;
};

/** Ordering options when selecting data from "ref_target". */
export type RefTargetOrderBy = {
	description?: InputMaybe<OrderBy>;
	id?: InputMaybe<OrderBy>;
	theme?: InputMaybe<OrderBy>;
};

/** primary key columns input for table: ref_target */
export type RefTargetPkColumnsInput = {
	id: Scalars['uuid'];
};

/** select columns of table "ref_target" */
export enum RefTargetSelectColumn {
	/** column name */
	Description = 'description',
	/** column name */
	Id = 'id',
	/** column name */
	Theme = 'theme',
}

/** input type for updating data in table "ref_target" */
export type RefTargetSetInput = {
	description?: InputMaybe<Scalars['String']>;
	id?: InputMaybe<Scalars['uuid']>;
	theme?: InputMaybe<Scalars['String']>;
};

/** update columns of table "ref_target" */
export enum RefTargetUpdateColumn {
	/** column name */
	Description = 'description',
	/** column name */
	Id = 'id',
	/** column name */
	Theme = 'theme',
}

/** columns and relationships of "rome_code" */
export type RomeCode = {
	__typename?: 'rome_code';
	code: Scalars['String'];
	description: Scalars['String'];
	id: Scalars['uuid'];
	label: Scalars['String'];
	/** An array relationship */
	wanted_by: Array<WantedJob>;
	/** An aggregate relationship */
	wanted_by_aggregate: WantedJobAggregate;
};

/** columns and relationships of "rome_code" */
export type RomeCodeWantedByArgs = {
	distinct_on?: InputMaybe<Array<WantedJobSelectColumn>>;
	limit?: InputMaybe<Scalars['Int']>;
	offset?: InputMaybe<Scalars['Int']>;
	order_by?: InputMaybe<Array<WantedJobOrderBy>>;
	where?: InputMaybe<WantedJobBoolExp>;
};

/** columns and relationships of "rome_code" */
export type RomeCodeWantedByAggregateArgs = {
	distinct_on?: InputMaybe<Array<WantedJobSelectColumn>>;
	limit?: InputMaybe<Scalars['Int']>;
	offset?: InputMaybe<Scalars['Int']>;
	order_by?: InputMaybe<Array<WantedJobOrderBy>>;
	where?: InputMaybe<WantedJobBoolExp>;
};

/** aggregated selection of "rome_code" */
export type RomeCodeAggregate = {
	__typename?: 'rome_code_aggregate';
	aggregate?: Maybe<RomeCodeAggregateFields>;
	nodes: Array<RomeCode>;
};

/** aggregate fields of "rome_code" */
export type RomeCodeAggregateFields = {
	__typename?: 'rome_code_aggregate_fields';
	count: Scalars['Int'];
	max?: Maybe<RomeCodeMaxFields>;
	min?: Maybe<RomeCodeMinFields>;
};

/** aggregate fields of "rome_code" */
export type RomeCodeAggregateFieldsCountArgs = {
	columns?: InputMaybe<Array<RomeCodeSelectColumn>>;
	distinct?: InputMaybe<Scalars['Boolean']>;
};

/** Boolean expression to filter rows from the table "rome_code". All fields are combined with a logical 'AND'. */
export type RomeCodeBoolExp = {
	_and?: InputMaybe<Array<RomeCodeBoolExp>>;
	_not?: InputMaybe<RomeCodeBoolExp>;
	_or?: InputMaybe<Array<RomeCodeBoolExp>>;
	code?: InputMaybe<StringComparisonExp>;
	description?: InputMaybe<StringComparisonExp>;
	id?: InputMaybe<UuidComparisonExp>;
	label?: InputMaybe<StringComparisonExp>;
	wanted_by?: InputMaybe<WantedJobBoolExp>;
};

/** unique or primary key constraints on table "rome_code" */
export enum RomeCodeConstraint {
	/** unique or primary key constraint */
	RomeCodesLabelKey = 'rome_codes_label_key',
	/** unique or primary key constraint */
	RomeCodesPkey = 'rome_codes_pkey',
}

/** input type for inserting data into table "rome_code" */
export type RomeCodeInsertInput = {
	code?: InputMaybe<Scalars['String']>;
	description?: InputMaybe<Scalars['String']>;
	id?: InputMaybe<Scalars['uuid']>;
	label?: InputMaybe<Scalars['String']>;
	wanted_by?: InputMaybe<WantedJobArrRelInsertInput>;
};

/** aggregate max on columns */
export type RomeCodeMaxFields = {
	__typename?: 'rome_code_max_fields';
	code?: Maybe<Scalars['String']>;
	description?: Maybe<Scalars['String']>;
	id?: Maybe<Scalars['uuid']>;
	label?: Maybe<Scalars['String']>;
};

/** aggregate min on columns */
export type RomeCodeMinFields = {
	__typename?: 'rome_code_min_fields';
	code?: Maybe<Scalars['String']>;
	description?: Maybe<Scalars['String']>;
	id?: Maybe<Scalars['uuid']>;
	label?: Maybe<Scalars['String']>;
};

/** response of any mutation on the table "rome_code" */
export type RomeCodeMutationResponse = {
	__typename?: 'rome_code_mutation_response';
	/** number of rows affected by the mutation */
	affected_rows: Scalars['Int'];
	/** data from the rows affected by the mutation */
	returning: Array<RomeCode>;
};

/** input type for inserting object relation for remote table "rome_code" */
export type RomeCodeObjRelInsertInput = {
	data: RomeCodeInsertInput;
	/** on conflict condition */
	on_conflict?: InputMaybe<RomeCodeOnConflict>;
};

/** on conflict condition type for table "rome_code" */
export type RomeCodeOnConflict = {
	constraint: RomeCodeConstraint;
	update_columns?: Array<RomeCodeUpdateColumn>;
	where?: InputMaybe<RomeCodeBoolExp>;
};

/** Ordering options when selecting data from "rome_code". */
export type RomeCodeOrderBy = {
	code?: InputMaybe<OrderBy>;
	description?: InputMaybe<OrderBy>;
	id?: InputMaybe<OrderBy>;
	label?: InputMaybe<OrderBy>;
	wanted_by_aggregate?: InputMaybe<WantedJobAggregateOrderBy>;
};

/** primary key columns input for table: rome_code */
export type RomeCodePkColumnsInput = {
	id: Scalars['uuid'];
};

/** select columns of table "rome_code" */
export enum RomeCodeSelectColumn {
	/** column name */
	Code = 'code',
	/** column name */
	Description = 'description',
	/** column name */
	Id = 'id',
	/** column name */
	Label = 'label',
}

/** input type for updating data in table "rome_code" */
export type RomeCodeSetInput = {
	code?: InputMaybe<Scalars['String']>;
	description?: InputMaybe<Scalars['String']>;
	id?: InputMaybe<Scalars['uuid']>;
	label?: InputMaybe<Scalars['String']>;
};

/** update columns of table "rome_code" */
export enum RomeCodeUpdateColumn {
	/** column name */
	Code = 'code',
	/** column name */
	Description = 'description',
	/** column name */
	Id = 'id',
	/** column name */
	Label = 'label',
}

export type SearchBeneficiariesArgs = {
	search?: InputMaybe<Scalars['String']>;
};

export type SearchNotebookMembersArgs = {
	search?: InputMaybe<Scalars['String']>;
};

export type SearchRomeCodesArgs = {
	search?: InputMaybe<Scalars['String']>;
};

/** columns and relationships of "structure" */
export type Structure = {
	__typename?: 'structure';
	address1?: Maybe<Scalars['String']>;
	address2?: Maybe<Scalars['String']>;
	/** An array relationship */
	admins: Array<AdminStructureStructure>;
	/** An aggregate relationship */
	admins_aggregate: AdminStructureStructureAggregate;
	/** An array relationship */
	beneficiaries: Array<BeneficiaryStructure>;
	/** An aggregate relationship */
	beneficiaries_aggregate: BeneficiaryStructureAggregate;
	city?: Maybe<Scalars['String']>;
	createdAt?: Maybe<Scalars['timestamptz']>;
	/** An object relationship */
	deployment?: Maybe<Deployment>;
	deploymentId?: Maybe<Scalars['uuid']>;
	email?: Maybe<Scalars['String']>;
	id: Scalars['uuid'];
	name?: Maybe<Scalars['String']>;
	phone?: Maybe<Scalars['String']>;
	postalCode?: Maybe<Scalars['String']>;
	/** An array relationship */
	professionals: Array<Professional>;
	/** An aggregate relationship */
	professionals_aggregate: ProfessionalAggregate;
	shortDesc?: Maybe<Scalars['String']>;
	siret?: Maybe<Scalars['String']>;
	updatedAt?: Maybe<Scalars['timestamptz']>;
	website?: Maybe<Scalars['String']>;
};

/** columns and relationships of "structure" */
export type StructureAdminsArgs = {
	distinct_on?: InputMaybe<Array<AdminStructureStructureSelectColumn>>;
	limit?: InputMaybe<Scalars['Int']>;
	offset?: InputMaybe<Scalars['Int']>;
	order_by?: InputMaybe<Array<AdminStructureStructureOrderBy>>;
	where?: InputMaybe<AdminStructureStructureBoolExp>;
};

/** columns and relationships of "structure" */
export type StructureAdminsAggregateArgs = {
	distinct_on?: InputMaybe<Array<AdminStructureStructureSelectColumn>>;
	limit?: InputMaybe<Scalars['Int']>;
	offset?: InputMaybe<Scalars['Int']>;
	order_by?: InputMaybe<Array<AdminStructureStructureOrderBy>>;
	where?: InputMaybe<AdminStructureStructureBoolExp>;
};

/** columns and relationships of "structure" */
export type StructureBeneficiariesArgs = {
	distinct_on?: InputMaybe<Array<BeneficiaryStructureSelectColumn>>;
	limit?: InputMaybe<Scalars['Int']>;
	offset?: InputMaybe<Scalars['Int']>;
	order_by?: InputMaybe<Array<BeneficiaryStructureOrderBy>>;
	where?: InputMaybe<BeneficiaryStructureBoolExp>;
};

/** columns and relationships of "structure" */
export type StructureBeneficiariesAggregateArgs = {
	distinct_on?: InputMaybe<Array<BeneficiaryStructureSelectColumn>>;
	limit?: InputMaybe<Scalars['Int']>;
	offset?: InputMaybe<Scalars['Int']>;
	order_by?: InputMaybe<Array<BeneficiaryStructureOrderBy>>;
	where?: InputMaybe<BeneficiaryStructureBoolExp>;
};

/** columns and relationships of "structure" */
export type StructureProfessionalsArgs = {
	distinct_on?: InputMaybe<Array<ProfessionalSelectColumn>>;
	limit?: InputMaybe<Scalars['Int']>;
	offset?: InputMaybe<Scalars['Int']>;
	order_by?: InputMaybe<Array<ProfessionalOrderBy>>;
	where?: InputMaybe<ProfessionalBoolExp>;
};

/** columns and relationships of "structure" */
export type StructureProfessionalsAggregateArgs = {
	distinct_on?: InputMaybe<Array<ProfessionalSelectColumn>>;
	limit?: InputMaybe<Scalars['Int']>;
	offset?: InputMaybe<Scalars['Int']>;
	order_by?: InputMaybe<Array<ProfessionalOrderBy>>;
	where?: InputMaybe<ProfessionalBoolExp>;
};

/** aggregated selection of "structure" */
export type StructureAggregate = {
	__typename?: 'structure_aggregate';
	aggregate?: Maybe<StructureAggregateFields>;
	nodes: Array<Structure>;
};

/** aggregate fields of "structure" */
export type StructureAggregateFields = {
	__typename?: 'structure_aggregate_fields';
	count: Scalars['Int'];
	max?: Maybe<StructureMaxFields>;
	min?: Maybe<StructureMinFields>;
};

/** aggregate fields of "structure" */
export type StructureAggregateFieldsCountArgs = {
	columns?: InputMaybe<Array<StructureSelectColumn>>;
	distinct?: InputMaybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "structure" */
export type StructureAggregateOrderBy = {
	count?: InputMaybe<OrderBy>;
	max?: InputMaybe<StructureMaxOrderBy>;
	min?: InputMaybe<StructureMinOrderBy>;
};

/** input type for inserting array relation for remote table "structure" */
export type StructureArrRelInsertInput = {
	data: Array<StructureInsertInput>;
	/** on conflict condition */
	on_conflict?: InputMaybe<StructureOnConflict>;
};

/** Boolean expression to filter rows from the table "structure". All fields are combined with a logical 'AND'. */
export type StructureBoolExp = {
	_and?: InputMaybe<Array<StructureBoolExp>>;
	_not?: InputMaybe<StructureBoolExp>;
	_or?: InputMaybe<Array<StructureBoolExp>>;
	address1?: InputMaybe<StringComparisonExp>;
	address2?: InputMaybe<StringComparisonExp>;
	admins?: InputMaybe<AdminStructureStructureBoolExp>;
	beneficiaries?: InputMaybe<BeneficiaryStructureBoolExp>;
	city?: InputMaybe<StringComparisonExp>;
	createdAt?: InputMaybe<TimestamptzComparisonExp>;
	deployment?: InputMaybe<DeploymentBoolExp>;
	deploymentId?: InputMaybe<UuidComparisonExp>;
	email?: InputMaybe<StringComparisonExp>;
	id?: InputMaybe<UuidComparisonExp>;
	name?: InputMaybe<StringComparisonExp>;
	phone?: InputMaybe<StringComparisonExp>;
	postalCode?: InputMaybe<StringComparisonExp>;
	professionals?: InputMaybe<ProfessionalBoolExp>;
	shortDesc?: InputMaybe<StringComparisonExp>;
	siret?: InputMaybe<StringComparisonExp>;
	updatedAt?: InputMaybe<TimestamptzComparisonExp>;
	website?: InputMaybe<StringComparisonExp>;
};

/** unique or primary key constraints on table "structure" */
export enum StructureConstraint {
	/** unique or primary key constraint */
	StructureNameDeploymentIdKey = 'structure_name_deployment_id_key',
	/** unique or primary key constraint */
	StructurePkey = 'structure_pkey',
}

/** input type for inserting data into table "structure" */
export type StructureInsertInput = {
	address1?: InputMaybe<Scalars['String']>;
	address2?: InputMaybe<Scalars['String']>;
	admins?: InputMaybe<AdminStructureStructureArrRelInsertInput>;
	beneficiaries?: InputMaybe<BeneficiaryStructureArrRelInsertInput>;
	city?: InputMaybe<Scalars['String']>;
	createdAt?: InputMaybe<Scalars['timestamptz']>;
	deployment?: InputMaybe<DeploymentObjRelInsertInput>;
	deploymentId?: InputMaybe<Scalars['uuid']>;
	email?: InputMaybe<Scalars['String']>;
	id?: InputMaybe<Scalars['uuid']>;
	name?: InputMaybe<Scalars['String']>;
	phone?: InputMaybe<Scalars['String']>;
	postalCode?: InputMaybe<Scalars['String']>;
	professionals?: InputMaybe<ProfessionalArrRelInsertInput>;
	shortDesc?: InputMaybe<Scalars['String']>;
	siret?: InputMaybe<Scalars['String']>;
	updatedAt?: InputMaybe<Scalars['timestamptz']>;
	website?: InputMaybe<Scalars['String']>;
};

/** aggregate max on columns */
export type StructureMaxFields = {
	__typename?: 'structure_max_fields';
	address1?: Maybe<Scalars['String']>;
	address2?: Maybe<Scalars['String']>;
	city?: Maybe<Scalars['String']>;
	createdAt?: Maybe<Scalars['timestamptz']>;
	deploymentId?: Maybe<Scalars['uuid']>;
	email?: Maybe<Scalars['String']>;
	id?: Maybe<Scalars['uuid']>;
	name?: Maybe<Scalars['String']>;
	phone?: Maybe<Scalars['String']>;
	postalCode?: Maybe<Scalars['String']>;
	shortDesc?: Maybe<Scalars['String']>;
	siret?: Maybe<Scalars['String']>;
	updatedAt?: Maybe<Scalars['timestamptz']>;
	website?: Maybe<Scalars['String']>;
};

/** order by max() on columns of table "structure" */
export type StructureMaxOrderBy = {
	address1?: InputMaybe<OrderBy>;
	address2?: InputMaybe<OrderBy>;
	city?: InputMaybe<OrderBy>;
	createdAt?: InputMaybe<OrderBy>;
	deploymentId?: InputMaybe<OrderBy>;
	email?: InputMaybe<OrderBy>;
	id?: InputMaybe<OrderBy>;
	name?: InputMaybe<OrderBy>;
	phone?: InputMaybe<OrderBy>;
	postalCode?: InputMaybe<OrderBy>;
	shortDesc?: InputMaybe<OrderBy>;
	siret?: InputMaybe<OrderBy>;
	updatedAt?: InputMaybe<OrderBy>;
	website?: InputMaybe<OrderBy>;
};

/** aggregate min on columns */
export type StructureMinFields = {
	__typename?: 'structure_min_fields';
	address1?: Maybe<Scalars['String']>;
	address2?: Maybe<Scalars['String']>;
	city?: Maybe<Scalars['String']>;
	createdAt?: Maybe<Scalars['timestamptz']>;
	deploymentId?: Maybe<Scalars['uuid']>;
	email?: Maybe<Scalars['String']>;
	id?: Maybe<Scalars['uuid']>;
	name?: Maybe<Scalars['String']>;
	phone?: Maybe<Scalars['String']>;
	postalCode?: Maybe<Scalars['String']>;
	shortDesc?: Maybe<Scalars['String']>;
	siret?: Maybe<Scalars['String']>;
	updatedAt?: Maybe<Scalars['timestamptz']>;
	website?: Maybe<Scalars['String']>;
};

/** order by min() on columns of table "structure" */
export type StructureMinOrderBy = {
	address1?: InputMaybe<OrderBy>;
	address2?: InputMaybe<OrderBy>;
	city?: InputMaybe<OrderBy>;
	createdAt?: InputMaybe<OrderBy>;
	deploymentId?: InputMaybe<OrderBy>;
	email?: InputMaybe<OrderBy>;
	id?: InputMaybe<OrderBy>;
	name?: InputMaybe<OrderBy>;
	phone?: InputMaybe<OrderBy>;
	postalCode?: InputMaybe<OrderBy>;
	shortDesc?: InputMaybe<OrderBy>;
	siret?: InputMaybe<OrderBy>;
	updatedAt?: InputMaybe<OrderBy>;
	website?: InputMaybe<OrderBy>;
};

/** response of any mutation on the table "structure" */
export type StructureMutationResponse = {
	__typename?: 'structure_mutation_response';
	/** number of rows affected by the mutation */
	affected_rows: Scalars['Int'];
	/** data from the rows affected by the mutation */
	returning: Array<Structure>;
};

/** input type for inserting object relation for remote table "structure" */
export type StructureObjRelInsertInput = {
	data: StructureInsertInput;
	/** on conflict condition */
	on_conflict?: InputMaybe<StructureOnConflict>;
};

/** on conflict condition type for table "structure" */
export type StructureOnConflict = {
	constraint: StructureConstraint;
	update_columns?: Array<StructureUpdateColumn>;
	where?: InputMaybe<StructureBoolExp>;
};

/** Ordering options when selecting data from "structure". */
export type StructureOrderBy = {
	address1?: InputMaybe<OrderBy>;
	address2?: InputMaybe<OrderBy>;
	admins_aggregate?: InputMaybe<AdminStructureStructureAggregateOrderBy>;
	beneficiaries_aggregate?: InputMaybe<BeneficiaryStructureAggregateOrderBy>;
	city?: InputMaybe<OrderBy>;
	createdAt?: InputMaybe<OrderBy>;
	deployment?: InputMaybe<DeploymentOrderBy>;
	deploymentId?: InputMaybe<OrderBy>;
	email?: InputMaybe<OrderBy>;
	id?: InputMaybe<OrderBy>;
	name?: InputMaybe<OrderBy>;
	phone?: InputMaybe<OrderBy>;
	postalCode?: InputMaybe<OrderBy>;
	professionals_aggregate?: InputMaybe<ProfessionalAggregateOrderBy>;
	shortDesc?: InputMaybe<OrderBy>;
	siret?: InputMaybe<OrderBy>;
	updatedAt?: InputMaybe<OrderBy>;
	website?: InputMaybe<OrderBy>;
};

/** primary key columns input for table: structure */
export type StructurePkColumnsInput = {
	id: Scalars['uuid'];
};

/** select columns of table "structure" */
export enum StructureSelectColumn {
	/** column name */
	Address1 = 'address1',
	/** column name */
	Address2 = 'address2',
	/** column name */
	City = 'city',
	/** column name */
	CreatedAt = 'createdAt',
	/** column name */
	DeploymentId = 'deploymentId',
	/** column name */
	Email = 'email',
	/** column name */
	Id = 'id',
	/** column name */
	Name = 'name',
	/** column name */
	Phone = 'phone',
	/** column name */
	PostalCode = 'postalCode',
	/** column name */
	ShortDesc = 'shortDesc',
	/** column name */
	Siret = 'siret',
	/** column name */
	UpdatedAt = 'updatedAt',
	/** column name */
	Website = 'website',
}

/** input type for updating data in table "structure" */
export type StructureSetInput = {
	address1?: InputMaybe<Scalars['String']>;
	address2?: InputMaybe<Scalars['String']>;
	city?: InputMaybe<Scalars['String']>;
	createdAt?: InputMaybe<Scalars['timestamptz']>;
	deploymentId?: InputMaybe<Scalars['uuid']>;
	email?: InputMaybe<Scalars['String']>;
	id?: InputMaybe<Scalars['uuid']>;
	name?: InputMaybe<Scalars['String']>;
	phone?: InputMaybe<Scalars['String']>;
	postalCode?: InputMaybe<Scalars['String']>;
	shortDesc?: InputMaybe<Scalars['String']>;
	siret?: InputMaybe<Scalars['String']>;
	updatedAt?: InputMaybe<Scalars['timestamptz']>;
	website?: InputMaybe<Scalars['String']>;
};

/** update columns of table "structure" */
export enum StructureUpdateColumn {
	/** column name */
	Address1 = 'address1',
	/** column name */
	Address2 = 'address2',
	/** column name */
	City = 'city',
	/** column name */
	CreatedAt = 'createdAt',
	/** column name */
	DeploymentId = 'deploymentId',
	/** column name */
	Email = 'email',
	/** column name */
	Id = 'id',
	/** column name */
	Name = 'name',
	/** column name */
	Phone = 'phone',
	/** column name */
	PostalCode = 'postalCode',
	/** column name */
	ShortDesc = 'shortDesc',
	/** column name */
	Siret = 'siret',
	/** column name */
	UpdatedAt = 'updatedAt',
	/** column name */
	Website = 'website',
}

export type SubscriptionRoot = {
	__typename?: 'subscription_root';
	/** fetch data from the table: "account" */
	account: Array<Account>;
	/** fetch aggregated fields from the table: "account" */
	account_aggregate: AccountAggregate;
	/** fetch data from the table: "account" using primary key columns */
	account_by_pk?: Maybe<Account>;
	/** fetch data from the table: "admin_cdb" */
	admin_cdb: Array<AdminCdb>;
	/** fetch aggregated fields from the table: "admin_cdb" */
	admin_cdb_aggregate: AdminCdbAggregate;
	/** fetch data from the table: "admin_cdb" using primary key columns */
	admin_cdb_by_pk?: Maybe<AdminCdb>;
	/** fetch data from the table: "admin_structure" */
	admin_structure: Array<AdminStructure>;
	/** fetch aggregated fields from the table: "admin_structure" */
	admin_structure_aggregate: AdminStructureAggregate;
	/** fetch data from the table: "admin_structure" using primary key columns */
	admin_structure_by_pk?: Maybe<AdminStructure>;
	/** fetch data from the table: "admin_structure_structure" */
	admin_structure_structure: Array<AdminStructureStructure>;
	/** fetch aggregated fields from the table: "admin_structure_structure" */
	admin_structure_structure_aggregate: AdminStructureStructureAggregate;
	/** fetch data from the table: "admin_structure_structure" using primary key columns */
	admin_structure_structure_by_pk?: Maybe<AdminStructureStructure>;
	/** fetch data from the table: "beneficiary" */
	beneficiary: Array<Beneficiary>;
	/** fetch aggregated fields from the table: "beneficiary" */
	beneficiary_aggregate: BeneficiaryAggregate;
	/** fetch data from the table: "beneficiary" using primary key columns */
	beneficiary_by_pk?: Maybe<Beneficiary>;
	/** fetch data from the table: "beneficiary_structure" */
	beneficiary_structure: Array<BeneficiaryStructure>;
	/** fetch aggregated fields from the table: "beneficiary_structure" */
	beneficiary_structure_aggregate: BeneficiaryStructureAggregate;
	/** fetch data from the table: "beneficiary_structure" using primary key columns */
	beneficiary_structure_by_pk?: Maybe<BeneficiaryStructure>;
	/** fetch data from the table: "deployment" */
	deployment: Array<Deployment>;
	/** fetch aggregated fields from the table: "deployment" */
	deployment_aggregate: DeploymentAggregate;
	/** fetch data from the table: "deployment" using primary key columns */
	deployment_by_pk?: Maybe<Deployment>;
	/** fetch data from the table: "manager" */
	manager: Array<Manager>;
	/** fetch aggregated fields from the table: "manager" */
	manager_aggregate: ManagerAggregate;
	/** fetch data from the table: "manager" using primary key columns */
	manager_by_pk?: Maybe<Manager>;
	/** fetch data from the table: "notebook" */
	notebook: Array<Notebook>;
	/** fetch data from the table: "notebook_action" */
	notebook_action: Array<NotebookAction>;
	/** fetch aggregated fields from the table: "notebook_action" */
	notebook_action_aggregate: NotebookActionAggregate;
	/** fetch data from the table: "notebook_action" using primary key columns */
	notebook_action_by_pk?: Maybe<NotebookAction>;
	/** fetch aggregated fields from the table: "notebook" */
	notebook_aggregate: NotebookAggregate;
	/** fetch data from the table: "notebook_appointment" */
	notebook_appointment: Array<NotebookAppointment>;
	/** fetch aggregated fields from the table: "notebook_appointment" */
	notebook_appointment_aggregate: NotebookAppointmentAggregate;
	/** fetch data from the table: "notebook_appointment" using primary key columns */
	notebook_appointment_by_pk?: Maybe<NotebookAppointment>;
	/** fetch data from the table: "notebook" using primary key columns */
	notebook_by_pk?: Maybe<Notebook>;
	/** fetch data from the table: "notebook_event" */
	notebook_event: Array<NotebookEvent>;
	/** fetch aggregated fields from the table: "notebook_event" */
	notebook_event_aggregate: NotebookEventAggregate;
	/** fetch data from the table: "notebook_event" using primary key columns */
	notebook_event_by_pk?: Maybe<NotebookEvent>;
	/** fetch data from the table: "notebook_event_type" */
	notebook_event_type: Array<NotebookEventType>;
	/** fetch aggregated fields from the table: "notebook_event_type" */
	notebook_event_type_aggregate: NotebookEventTypeAggregate;
	/** fetch data from the table: "notebook_event_type" using primary key columns */
	notebook_event_type_by_pk?: Maybe<NotebookEventType>;
	/** fetch data from the table: "notebook_focus" */
	notebook_focus: Array<NotebookFocus>;
	/** fetch aggregated fields from the table: "notebook_focus" */
	notebook_focus_aggregate: NotebookFocusAggregate;
	/** fetch data from the table: "notebook_focus" using primary key columns */
	notebook_focus_by_pk?: Maybe<NotebookFocus>;
	/** fetch data from the table: "notebook_member" */
	notebook_member: Array<NotebookMember>;
	/** fetch aggregated fields from the table: "notebook_member" */
	notebook_member_aggregate: NotebookMemberAggregate;
	/** fetch data from the table: "notebook_member" using primary key columns */
	notebook_member_by_pk?: Maybe<NotebookMember>;
	/** fetch data from the table: "notebook_target" */
	notebook_target: Array<NotebookTarget>;
	/** fetch aggregated fields from the table: "notebook_target" */
	notebook_target_aggregate: NotebookTargetAggregate;
	/** fetch data from the table: "notebook_target" using primary key columns */
	notebook_target_by_pk?: Maybe<NotebookTarget>;
	/** fetch data from the table: "professional" */
	professional: Array<Professional>;
	/** fetch aggregated fields from the table: "professional" */
	professional_aggregate: ProfessionalAggregate;
	/** fetch data from the table: "professional" using primary key columns */
	professional_by_pk?: Maybe<Professional>;
	/** fetch data from the table: "ref_action" */
	ref_action: Array<RefAction>;
	/** fetch aggregated fields from the table: "ref_action" */
	ref_action_aggregate: RefActionAggregate;
	/** fetch data from the table: "ref_action" using primary key columns */
	ref_action_by_pk?: Maybe<RefAction>;
	/** fetch data from the table: "ref_situation" */
	ref_situation: Array<RefSituation>;
	/** fetch aggregated fields from the table: "ref_situation" */
	ref_situation_aggregate: RefSituationAggregate;
	/** fetch data from the table: "ref_situation" using primary key columns */
	ref_situation_by_pk?: Maybe<RefSituation>;
	/** fetch data from the table: "ref_target" */
	ref_target: Array<RefTarget>;
	/** fetch aggregated fields from the table: "ref_target" */
	ref_target_aggregate: RefTargetAggregate;
	/** fetch data from the table: "ref_target" using primary key columns */
	ref_target_by_pk?: Maybe<RefTarget>;
	/** fetch data from the table: "rome_code" */
	rome_code: Array<RomeCode>;
	/** fetch aggregated fields from the table: "rome_code" */
	rome_code_aggregate: RomeCodeAggregate;
	/** fetch data from the table: "rome_code" using primary key columns */
	rome_code_by_pk?: Maybe<RomeCode>;
	/** execute function "search_beneficiaries" which returns "beneficiary" */
	search_beneficiaries: Array<Beneficiary>;
	/** execute function "search_beneficiaries" and query aggregates on result of table type "beneficiary" */
	search_beneficiaries_aggregate: BeneficiaryAggregate;
	/** execute function "search_notebook_members" which returns "notebook_member" */
	search_notebook_members: Array<NotebookMember>;
	/** execute function "search_notebook_members" and query aggregates on result of table type "notebook_member" */
	search_notebook_members_aggregate: NotebookMemberAggregate;
	/** execute function "search_rome_codes" which returns "rome_code" */
	search_rome_codes: Array<RomeCode>;
	/** execute function "search_rome_codes" and query aggregates on result of table type "rome_code" */
	search_rome_codes_aggregate: RomeCodeAggregate;
	/** fetch data from the table: "structure" */
	structure: Array<Structure>;
	/** fetch aggregated fields from the table: "structure" */
	structure_aggregate: StructureAggregate;
	/** fetch data from the table: "structure" using primary key columns */
	structure_by_pk?: Maybe<Structure>;
	/** fetch data from the table: "wanted_job" */
	wanted_job: Array<WantedJob>;
	/** fetch aggregated fields from the table: "wanted_job" */
	wanted_job_aggregate: WantedJobAggregate;
	/** fetch data from the table: "wanted_job" using primary key columns */
	wanted_job_by_pk?: Maybe<WantedJob>;
};

export type SubscriptionRootAccountArgs = {
	distinct_on?: InputMaybe<Array<AccountSelectColumn>>;
	limit?: InputMaybe<Scalars['Int']>;
	offset?: InputMaybe<Scalars['Int']>;
	order_by?: InputMaybe<Array<AccountOrderBy>>;
	where?: InputMaybe<AccountBoolExp>;
};

export type SubscriptionRootAccountAggregateArgs = {
	distinct_on?: InputMaybe<Array<AccountSelectColumn>>;
	limit?: InputMaybe<Scalars['Int']>;
	offset?: InputMaybe<Scalars['Int']>;
	order_by?: InputMaybe<Array<AccountOrderBy>>;
	where?: InputMaybe<AccountBoolExp>;
};

export type SubscriptionRootAccountByPkArgs = {
	id: Scalars['uuid'];
};

export type SubscriptionRootAdminCdbArgs = {
	distinct_on?: InputMaybe<Array<AdminCdbSelectColumn>>;
	limit?: InputMaybe<Scalars['Int']>;
	offset?: InputMaybe<Scalars['Int']>;
	order_by?: InputMaybe<Array<AdminCdbOrderBy>>;
	where?: InputMaybe<AdminCdbBoolExp>;
};

export type SubscriptionRootAdminCdbAggregateArgs = {
	distinct_on?: InputMaybe<Array<AdminCdbSelectColumn>>;
	limit?: InputMaybe<Scalars['Int']>;
	offset?: InputMaybe<Scalars['Int']>;
	order_by?: InputMaybe<Array<AdminCdbOrderBy>>;
	where?: InputMaybe<AdminCdbBoolExp>;
};

export type SubscriptionRootAdminCdbByPkArgs = {
	id: Scalars['uuid'];
};

export type SubscriptionRootAdminStructureArgs = {
	distinct_on?: InputMaybe<Array<AdminStructureSelectColumn>>;
	limit?: InputMaybe<Scalars['Int']>;
	offset?: InputMaybe<Scalars['Int']>;
	order_by?: InputMaybe<Array<AdminStructureOrderBy>>;
	where?: InputMaybe<AdminStructureBoolExp>;
};

export type SubscriptionRootAdminStructureAggregateArgs = {
	distinct_on?: InputMaybe<Array<AdminStructureSelectColumn>>;
	limit?: InputMaybe<Scalars['Int']>;
	offset?: InputMaybe<Scalars['Int']>;
	order_by?: InputMaybe<Array<AdminStructureOrderBy>>;
	where?: InputMaybe<AdminStructureBoolExp>;
};

export type SubscriptionRootAdminStructureByPkArgs = {
	id: Scalars['uuid'];
};

export type SubscriptionRootAdminStructureStructureArgs = {
	distinct_on?: InputMaybe<Array<AdminStructureStructureSelectColumn>>;
	limit?: InputMaybe<Scalars['Int']>;
	offset?: InputMaybe<Scalars['Int']>;
	order_by?: InputMaybe<Array<AdminStructureStructureOrderBy>>;
	where?: InputMaybe<AdminStructureStructureBoolExp>;
};

export type SubscriptionRootAdminStructureStructureAggregateArgs = {
	distinct_on?: InputMaybe<Array<AdminStructureStructureSelectColumn>>;
	limit?: InputMaybe<Scalars['Int']>;
	offset?: InputMaybe<Scalars['Int']>;
	order_by?: InputMaybe<Array<AdminStructureStructureOrderBy>>;
	where?: InputMaybe<AdminStructureStructureBoolExp>;
};

export type SubscriptionRootAdminStructureStructureByPkArgs = {
	id: Scalars['uuid'];
};

export type SubscriptionRootBeneficiaryArgs = {
	distinct_on?: InputMaybe<Array<BeneficiarySelectColumn>>;
	limit?: InputMaybe<Scalars['Int']>;
	offset?: InputMaybe<Scalars['Int']>;
	order_by?: InputMaybe<Array<BeneficiaryOrderBy>>;
	where?: InputMaybe<BeneficiaryBoolExp>;
};

export type SubscriptionRootBeneficiaryAggregateArgs = {
	distinct_on?: InputMaybe<Array<BeneficiarySelectColumn>>;
	limit?: InputMaybe<Scalars['Int']>;
	offset?: InputMaybe<Scalars['Int']>;
	order_by?: InputMaybe<Array<BeneficiaryOrderBy>>;
	where?: InputMaybe<BeneficiaryBoolExp>;
};

export type SubscriptionRootBeneficiaryByPkArgs = {
	id: Scalars['uuid'];
};

export type SubscriptionRootBeneficiaryStructureArgs = {
	distinct_on?: InputMaybe<Array<BeneficiaryStructureSelectColumn>>;
	limit?: InputMaybe<Scalars['Int']>;
	offset?: InputMaybe<Scalars['Int']>;
	order_by?: InputMaybe<Array<BeneficiaryStructureOrderBy>>;
	where?: InputMaybe<BeneficiaryStructureBoolExp>;
};

export type SubscriptionRootBeneficiaryStructureAggregateArgs = {
	distinct_on?: InputMaybe<Array<BeneficiaryStructureSelectColumn>>;
	limit?: InputMaybe<Scalars['Int']>;
	offset?: InputMaybe<Scalars['Int']>;
	order_by?: InputMaybe<Array<BeneficiaryStructureOrderBy>>;
	where?: InputMaybe<BeneficiaryStructureBoolExp>;
};

export type SubscriptionRootBeneficiaryStructureByPkArgs = {
	id: Scalars['uuid'];
};

export type SubscriptionRootDeploymentArgs = {
	distinct_on?: InputMaybe<Array<DeploymentSelectColumn>>;
	limit?: InputMaybe<Scalars['Int']>;
	offset?: InputMaybe<Scalars['Int']>;
	order_by?: InputMaybe<Array<DeploymentOrderBy>>;
	where?: InputMaybe<DeploymentBoolExp>;
};

export type SubscriptionRootDeploymentAggregateArgs = {
	distinct_on?: InputMaybe<Array<DeploymentSelectColumn>>;
	limit?: InputMaybe<Scalars['Int']>;
	offset?: InputMaybe<Scalars['Int']>;
	order_by?: InputMaybe<Array<DeploymentOrderBy>>;
	where?: InputMaybe<DeploymentBoolExp>;
};

export type SubscriptionRootDeploymentByPkArgs = {
	id: Scalars['uuid'];
};

export type SubscriptionRootManagerArgs = {
	distinct_on?: InputMaybe<Array<ManagerSelectColumn>>;
	limit?: InputMaybe<Scalars['Int']>;
	offset?: InputMaybe<Scalars['Int']>;
	order_by?: InputMaybe<Array<ManagerOrderBy>>;
	where?: InputMaybe<ManagerBoolExp>;
};

export type SubscriptionRootManagerAggregateArgs = {
	distinct_on?: InputMaybe<Array<ManagerSelectColumn>>;
	limit?: InputMaybe<Scalars['Int']>;
	offset?: InputMaybe<Scalars['Int']>;
	order_by?: InputMaybe<Array<ManagerOrderBy>>;
	where?: InputMaybe<ManagerBoolExp>;
};

export type SubscriptionRootManagerByPkArgs = {
	id: Scalars['uuid'];
};

export type SubscriptionRootNotebookArgs = {
	distinct_on?: InputMaybe<Array<NotebookSelectColumn>>;
	limit?: InputMaybe<Scalars['Int']>;
	offset?: InputMaybe<Scalars['Int']>;
	order_by?: InputMaybe<Array<NotebookOrderBy>>;
	where?: InputMaybe<NotebookBoolExp>;
};

export type SubscriptionRootNotebookActionArgs = {
	distinct_on?: InputMaybe<Array<NotebookActionSelectColumn>>;
	limit?: InputMaybe<Scalars['Int']>;
	offset?: InputMaybe<Scalars['Int']>;
	order_by?: InputMaybe<Array<NotebookActionOrderBy>>;
	where?: InputMaybe<NotebookActionBoolExp>;
};

export type SubscriptionRootNotebookActionAggregateArgs = {
	distinct_on?: InputMaybe<Array<NotebookActionSelectColumn>>;
	limit?: InputMaybe<Scalars['Int']>;
	offset?: InputMaybe<Scalars['Int']>;
	order_by?: InputMaybe<Array<NotebookActionOrderBy>>;
	where?: InputMaybe<NotebookActionBoolExp>;
};

export type SubscriptionRootNotebookActionByPkArgs = {
	id: Scalars['uuid'];
};

export type SubscriptionRootNotebookAggregateArgs = {
	distinct_on?: InputMaybe<Array<NotebookSelectColumn>>;
	limit?: InputMaybe<Scalars['Int']>;
	offset?: InputMaybe<Scalars['Int']>;
	order_by?: InputMaybe<Array<NotebookOrderBy>>;
	where?: InputMaybe<NotebookBoolExp>;
};

export type SubscriptionRootNotebookAppointmentArgs = {
	distinct_on?: InputMaybe<Array<NotebookAppointmentSelectColumn>>;
	limit?: InputMaybe<Scalars['Int']>;
	offset?: InputMaybe<Scalars['Int']>;
	order_by?: InputMaybe<Array<NotebookAppointmentOrderBy>>;
	where?: InputMaybe<NotebookAppointmentBoolExp>;
};

export type SubscriptionRootNotebookAppointmentAggregateArgs = {
	distinct_on?: InputMaybe<Array<NotebookAppointmentSelectColumn>>;
	limit?: InputMaybe<Scalars['Int']>;
	offset?: InputMaybe<Scalars['Int']>;
	order_by?: InputMaybe<Array<NotebookAppointmentOrderBy>>;
	where?: InputMaybe<NotebookAppointmentBoolExp>;
};

export type SubscriptionRootNotebookAppointmentByPkArgs = {
	id: Scalars['uuid'];
};

export type SubscriptionRootNotebookByPkArgs = {
	id: Scalars['uuid'];
};

export type SubscriptionRootNotebookEventArgs = {
	distinct_on?: InputMaybe<Array<NotebookEventSelectColumn>>;
	limit?: InputMaybe<Scalars['Int']>;
	offset?: InputMaybe<Scalars['Int']>;
	order_by?: InputMaybe<Array<NotebookEventOrderBy>>;
	where?: InputMaybe<NotebookEventBoolExp>;
};

export type SubscriptionRootNotebookEventAggregateArgs = {
	distinct_on?: InputMaybe<Array<NotebookEventSelectColumn>>;
	limit?: InputMaybe<Scalars['Int']>;
	offset?: InputMaybe<Scalars['Int']>;
	order_by?: InputMaybe<Array<NotebookEventOrderBy>>;
	where?: InputMaybe<NotebookEventBoolExp>;
};

export type SubscriptionRootNotebookEventByPkArgs = {
	id: Scalars['uuid'];
};

export type SubscriptionRootNotebookEventTypeArgs = {
	distinct_on?: InputMaybe<Array<NotebookEventTypeSelectColumn>>;
	limit?: InputMaybe<Scalars['Int']>;
	offset?: InputMaybe<Scalars['Int']>;
	order_by?: InputMaybe<Array<NotebookEventTypeOrderBy>>;
	where?: InputMaybe<NotebookEventTypeBoolExp>;
};

export type SubscriptionRootNotebookEventTypeAggregateArgs = {
	distinct_on?: InputMaybe<Array<NotebookEventTypeSelectColumn>>;
	limit?: InputMaybe<Scalars['Int']>;
	offset?: InputMaybe<Scalars['Int']>;
	order_by?: InputMaybe<Array<NotebookEventTypeOrderBy>>;
	where?: InputMaybe<NotebookEventTypeBoolExp>;
};

export type SubscriptionRootNotebookEventTypeByPkArgs = {
	value: Scalars['String'];
};

export type SubscriptionRootNotebookFocusArgs = {
	distinct_on?: InputMaybe<Array<NotebookFocusSelectColumn>>;
	limit?: InputMaybe<Scalars['Int']>;
	offset?: InputMaybe<Scalars['Int']>;
	order_by?: InputMaybe<Array<NotebookFocusOrderBy>>;
	where?: InputMaybe<NotebookFocusBoolExp>;
};

export type SubscriptionRootNotebookFocusAggregateArgs = {
	distinct_on?: InputMaybe<Array<NotebookFocusSelectColumn>>;
	limit?: InputMaybe<Scalars['Int']>;
	offset?: InputMaybe<Scalars['Int']>;
	order_by?: InputMaybe<Array<NotebookFocusOrderBy>>;
	where?: InputMaybe<NotebookFocusBoolExp>;
};

export type SubscriptionRootNotebookFocusByPkArgs = {
	id: Scalars['uuid'];
};

export type SubscriptionRootNotebookMemberArgs = {
	distinct_on?: InputMaybe<Array<NotebookMemberSelectColumn>>;
	limit?: InputMaybe<Scalars['Int']>;
	offset?: InputMaybe<Scalars['Int']>;
	order_by?: InputMaybe<Array<NotebookMemberOrderBy>>;
	where?: InputMaybe<NotebookMemberBoolExp>;
};

export type SubscriptionRootNotebookMemberAggregateArgs = {
	distinct_on?: InputMaybe<Array<NotebookMemberSelectColumn>>;
	limit?: InputMaybe<Scalars['Int']>;
	offset?: InputMaybe<Scalars['Int']>;
	order_by?: InputMaybe<Array<NotebookMemberOrderBy>>;
	where?: InputMaybe<NotebookMemberBoolExp>;
};

export type SubscriptionRootNotebookMemberByPkArgs = {
	id: Scalars['uuid'];
};

export type SubscriptionRootNotebookTargetArgs = {
	distinct_on?: InputMaybe<Array<NotebookTargetSelectColumn>>;
	limit?: InputMaybe<Scalars['Int']>;
	offset?: InputMaybe<Scalars['Int']>;
	order_by?: InputMaybe<Array<NotebookTargetOrderBy>>;
	where?: InputMaybe<NotebookTargetBoolExp>;
};

export type SubscriptionRootNotebookTargetAggregateArgs = {
	distinct_on?: InputMaybe<Array<NotebookTargetSelectColumn>>;
	limit?: InputMaybe<Scalars['Int']>;
	offset?: InputMaybe<Scalars['Int']>;
	order_by?: InputMaybe<Array<NotebookTargetOrderBy>>;
	where?: InputMaybe<NotebookTargetBoolExp>;
};

export type SubscriptionRootNotebookTargetByPkArgs = {
	id: Scalars['uuid'];
};

export type SubscriptionRootProfessionalArgs = {
	distinct_on?: InputMaybe<Array<ProfessionalSelectColumn>>;
	limit?: InputMaybe<Scalars['Int']>;
	offset?: InputMaybe<Scalars['Int']>;
	order_by?: InputMaybe<Array<ProfessionalOrderBy>>;
	where?: InputMaybe<ProfessionalBoolExp>;
};

export type SubscriptionRootProfessionalAggregateArgs = {
	distinct_on?: InputMaybe<Array<ProfessionalSelectColumn>>;
	limit?: InputMaybe<Scalars['Int']>;
	offset?: InputMaybe<Scalars['Int']>;
	order_by?: InputMaybe<Array<ProfessionalOrderBy>>;
	where?: InputMaybe<ProfessionalBoolExp>;
};

export type SubscriptionRootProfessionalByPkArgs = {
	id: Scalars['uuid'];
};

export type SubscriptionRootRefActionArgs = {
	distinct_on?: InputMaybe<Array<RefActionSelectColumn>>;
	limit?: InputMaybe<Scalars['Int']>;
	offset?: InputMaybe<Scalars['Int']>;
	order_by?: InputMaybe<Array<RefActionOrderBy>>;
	where?: InputMaybe<RefActionBoolExp>;
};

export type SubscriptionRootRefActionAggregateArgs = {
	distinct_on?: InputMaybe<Array<RefActionSelectColumn>>;
	limit?: InputMaybe<Scalars['Int']>;
	offset?: InputMaybe<Scalars['Int']>;
	order_by?: InputMaybe<Array<RefActionOrderBy>>;
	where?: InputMaybe<RefActionBoolExp>;
};

export type SubscriptionRootRefActionByPkArgs = {
	id: Scalars['uuid'];
};

export type SubscriptionRootRefSituationArgs = {
	distinct_on?: InputMaybe<Array<RefSituationSelectColumn>>;
	limit?: InputMaybe<Scalars['Int']>;
	offset?: InputMaybe<Scalars['Int']>;
	order_by?: InputMaybe<Array<RefSituationOrderBy>>;
	where?: InputMaybe<RefSituationBoolExp>;
};

export type SubscriptionRootRefSituationAggregateArgs = {
	distinct_on?: InputMaybe<Array<RefSituationSelectColumn>>;
	limit?: InputMaybe<Scalars['Int']>;
	offset?: InputMaybe<Scalars['Int']>;
	order_by?: InputMaybe<Array<RefSituationOrderBy>>;
	where?: InputMaybe<RefSituationBoolExp>;
};

export type SubscriptionRootRefSituationByPkArgs = {
	id: Scalars['uuid'];
};

export type SubscriptionRootRefTargetArgs = {
	distinct_on?: InputMaybe<Array<RefTargetSelectColumn>>;
	limit?: InputMaybe<Scalars['Int']>;
	offset?: InputMaybe<Scalars['Int']>;
	order_by?: InputMaybe<Array<RefTargetOrderBy>>;
	where?: InputMaybe<RefTargetBoolExp>;
};

export type SubscriptionRootRefTargetAggregateArgs = {
	distinct_on?: InputMaybe<Array<RefTargetSelectColumn>>;
	limit?: InputMaybe<Scalars['Int']>;
	offset?: InputMaybe<Scalars['Int']>;
	order_by?: InputMaybe<Array<RefTargetOrderBy>>;
	where?: InputMaybe<RefTargetBoolExp>;
};

export type SubscriptionRootRefTargetByPkArgs = {
	id: Scalars['uuid'];
};

export type SubscriptionRootRomeCodeArgs = {
	distinct_on?: InputMaybe<Array<RomeCodeSelectColumn>>;
	limit?: InputMaybe<Scalars['Int']>;
	offset?: InputMaybe<Scalars['Int']>;
	order_by?: InputMaybe<Array<RomeCodeOrderBy>>;
	where?: InputMaybe<RomeCodeBoolExp>;
};

export type SubscriptionRootRomeCodeAggregateArgs = {
	distinct_on?: InputMaybe<Array<RomeCodeSelectColumn>>;
	limit?: InputMaybe<Scalars['Int']>;
	offset?: InputMaybe<Scalars['Int']>;
	order_by?: InputMaybe<Array<RomeCodeOrderBy>>;
	where?: InputMaybe<RomeCodeBoolExp>;
};

export type SubscriptionRootRomeCodeByPkArgs = {
	id: Scalars['uuid'];
};

export type SubscriptionRootSearchBeneficiariesArgs = {
	args: SearchBeneficiariesArgs;
	distinct_on?: InputMaybe<Array<BeneficiarySelectColumn>>;
	limit?: InputMaybe<Scalars['Int']>;
	offset?: InputMaybe<Scalars['Int']>;
	order_by?: InputMaybe<Array<BeneficiaryOrderBy>>;
	where?: InputMaybe<BeneficiaryBoolExp>;
};

export type SubscriptionRootSearchBeneficiariesAggregateArgs = {
	args: SearchBeneficiariesArgs;
	distinct_on?: InputMaybe<Array<BeneficiarySelectColumn>>;
	limit?: InputMaybe<Scalars['Int']>;
	offset?: InputMaybe<Scalars['Int']>;
	order_by?: InputMaybe<Array<BeneficiaryOrderBy>>;
	where?: InputMaybe<BeneficiaryBoolExp>;
};

export type SubscriptionRootSearchNotebookMembersArgs = {
	args: SearchNotebookMembersArgs;
	distinct_on?: InputMaybe<Array<NotebookMemberSelectColumn>>;
	limit?: InputMaybe<Scalars['Int']>;
	offset?: InputMaybe<Scalars['Int']>;
	order_by?: InputMaybe<Array<NotebookMemberOrderBy>>;
	where?: InputMaybe<NotebookMemberBoolExp>;
};

export type SubscriptionRootSearchNotebookMembersAggregateArgs = {
	args: SearchNotebookMembersArgs;
	distinct_on?: InputMaybe<Array<NotebookMemberSelectColumn>>;
	limit?: InputMaybe<Scalars['Int']>;
	offset?: InputMaybe<Scalars['Int']>;
	order_by?: InputMaybe<Array<NotebookMemberOrderBy>>;
	where?: InputMaybe<NotebookMemberBoolExp>;
};

export type SubscriptionRootSearchRomeCodesArgs = {
	args: SearchRomeCodesArgs;
	distinct_on?: InputMaybe<Array<RomeCodeSelectColumn>>;
	limit?: InputMaybe<Scalars['Int']>;
	offset?: InputMaybe<Scalars['Int']>;
	order_by?: InputMaybe<Array<RomeCodeOrderBy>>;
	where?: InputMaybe<RomeCodeBoolExp>;
};

export type SubscriptionRootSearchRomeCodesAggregateArgs = {
	args: SearchRomeCodesArgs;
	distinct_on?: InputMaybe<Array<RomeCodeSelectColumn>>;
	limit?: InputMaybe<Scalars['Int']>;
	offset?: InputMaybe<Scalars['Int']>;
	order_by?: InputMaybe<Array<RomeCodeOrderBy>>;
	where?: InputMaybe<RomeCodeBoolExp>;
};

export type SubscriptionRootStructureArgs = {
	distinct_on?: InputMaybe<Array<StructureSelectColumn>>;
	limit?: InputMaybe<Scalars['Int']>;
	offset?: InputMaybe<Scalars['Int']>;
	order_by?: InputMaybe<Array<StructureOrderBy>>;
	where?: InputMaybe<StructureBoolExp>;
};

export type SubscriptionRootStructureAggregateArgs = {
	distinct_on?: InputMaybe<Array<StructureSelectColumn>>;
	limit?: InputMaybe<Scalars['Int']>;
	offset?: InputMaybe<Scalars['Int']>;
	order_by?: InputMaybe<Array<StructureOrderBy>>;
	where?: InputMaybe<StructureBoolExp>;
};

export type SubscriptionRootStructureByPkArgs = {
	id: Scalars['uuid'];
};

export type SubscriptionRootWantedJobArgs = {
	distinct_on?: InputMaybe<Array<WantedJobSelectColumn>>;
	limit?: InputMaybe<Scalars['Int']>;
	offset?: InputMaybe<Scalars['Int']>;
	order_by?: InputMaybe<Array<WantedJobOrderBy>>;
	where?: InputMaybe<WantedJobBoolExp>;
};

export type SubscriptionRootWantedJobAggregateArgs = {
	distinct_on?: InputMaybe<Array<WantedJobSelectColumn>>;
	limit?: InputMaybe<Scalars['Int']>;
	offset?: InputMaybe<Scalars['Int']>;
	order_by?: InputMaybe<Array<WantedJobOrderBy>>;
	where?: InputMaybe<WantedJobBoolExp>;
};

export type SubscriptionRootWantedJobByPkArgs = {
	id: Scalars['uuid'];
};

/** Boolean expression to compare columns of type "timestamptz". All fields are combined with logical 'AND'. */
export type TimestamptzComparisonExp = {
	_eq?: InputMaybe<Scalars['timestamptz']>;
	_gt?: InputMaybe<Scalars['timestamptz']>;
	_gte?: InputMaybe<Scalars['timestamptz']>;
	_in?: InputMaybe<Array<Scalars['timestamptz']>>;
	_is_null?: InputMaybe<Scalars['Boolean']>;
	_lt?: InputMaybe<Scalars['timestamptz']>;
	_lte?: InputMaybe<Scalars['timestamptz']>;
	_neq?: InputMaybe<Scalars['timestamptz']>;
	_nin?: InputMaybe<Array<Scalars['timestamptz']>>;
};

/** Boolean expression to compare columns of type "uuid". All fields are combined with logical 'AND'. */
export type UuidComparisonExp = {
	_eq?: InputMaybe<Scalars['uuid']>;
	_gt?: InputMaybe<Scalars['uuid']>;
	_gte?: InputMaybe<Scalars['uuid']>;
	_in?: InputMaybe<Array<Scalars['uuid']>>;
	_is_null?: InputMaybe<Scalars['Boolean']>;
	_lt?: InputMaybe<Scalars['uuid']>;
	_lte?: InputMaybe<Scalars['uuid']>;
	_neq?: InputMaybe<Scalars['uuid']>;
	_nin?: InputMaybe<Array<Scalars['uuid']>>;
};

/**
 * Stores the jobs wanted for a notebook beneficiary
 *
 *
 * columns and relationships of "wanted_job"
 *
 */
export type WantedJob = {
	__typename?: 'wanted_job';
	id: Scalars['uuid'];
	/** An object relationship */
	notebook: Notebook;
	notebook_id: Scalars['uuid'];
	/** An object relationship */
	rome_code: RomeCode;
	rome_code_id: Scalars['uuid'];
};

/** aggregated selection of "wanted_job" */
export type WantedJobAggregate = {
	__typename?: 'wanted_job_aggregate';
	aggregate?: Maybe<WantedJobAggregateFields>;
	nodes: Array<WantedJob>;
};

/** aggregate fields of "wanted_job" */
export type WantedJobAggregateFields = {
	__typename?: 'wanted_job_aggregate_fields';
	count: Scalars['Int'];
	max?: Maybe<WantedJobMaxFields>;
	min?: Maybe<WantedJobMinFields>;
};

/** aggregate fields of "wanted_job" */
export type WantedJobAggregateFieldsCountArgs = {
	columns?: InputMaybe<Array<WantedJobSelectColumn>>;
	distinct?: InputMaybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "wanted_job" */
export type WantedJobAggregateOrderBy = {
	count?: InputMaybe<OrderBy>;
	max?: InputMaybe<WantedJobMaxOrderBy>;
	min?: InputMaybe<WantedJobMinOrderBy>;
};

/** input type for inserting array relation for remote table "wanted_job" */
export type WantedJobArrRelInsertInput = {
	data: Array<WantedJobInsertInput>;
	/** on conflict condition */
	on_conflict?: InputMaybe<WantedJobOnConflict>;
};

/** Boolean expression to filter rows from the table "wanted_job". All fields are combined with a logical 'AND'. */
export type WantedJobBoolExp = {
	_and?: InputMaybe<Array<WantedJobBoolExp>>;
	_not?: InputMaybe<WantedJobBoolExp>;
	_or?: InputMaybe<Array<WantedJobBoolExp>>;
	id?: InputMaybe<UuidComparisonExp>;
	notebook?: InputMaybe<NotebookBoolExp>;
	notebook_id?: InputMaybe<UuidComparisonExp>;
	rome_code?: InputMaybe<RomeCodeBoolExp>;
	rome_code_id?: InputMaybe<UuidComparisonExp>;
};

/** unique or primary key constraints on table "wanted_job" */
export enum WantedJobConstraint {
	/** unique or primary key constraint */
	WantedJobNotebookIdRomeCodeIdKey = 'wanted_job_notebook_id_rome_code_id_key',
	/** unique or primary key constraint */
	WantedJobPkey = 'wanted_job_pkey',
}

/** input type for inserting data into table "wanted_job" */
export type WantedJobInsertInput = {
	id?: InputMaybe<Scalars['uuid']>;
	notebook?: InputMaybe<NotebookObjRelInsertInput>;
	notebook_id?: InputMaybe<Scalars['uuid']>;
	rome_code?: InputMaybe<RomeCodeObjRelInsertInput>;
	rome_code_id?: InputMaybe<Scalars['uuid']>;
};

/** aggregate max on columns */
export type WantedJobMaxFields = {
	__typename?: 'wanted_job_max_fields';
	id?: Maybe<Scalars['uuid']>;
	notebook_id?: Maybe<Scalars['uuid']>;
	rome_code_id?: Maybe<Scalars['uuid']>;
};

/** order by max() on columns of table "wanted_job" */
export type WantedJobMaxOrderBy = {
	id?: InputMaybe<OrderBy>;
	notebook_id?: InputMaybe<OrderBy>;
	rome_code_id?: InputMaybe<OrderBy>;
};

/** aggregate min on columns */
export type WantedJobMinFields = {
	__typename?: 'wanted_job_min_fields';
	id?: Maybe<Scalars['uuid']>;
	notebook_id?: Maybe<Scalars['uuid']>;
	rome_code_id?: Maybe<Scalars['uuid']>;
};

/** order by min() on columns of table "wanted_job" */
export type WantedJobMinOrderBy = {
	id?: InputMaybe<OrderBy>;
	notebook_id?: InputMaybe<OrderBy>;
	rome_code_id?: InputMaybe<OrderBy>;
};

/** response of any mutation on the table "wanted_job" */
export type WantedJobMutationResponse = {
	__typename?: 'wanted_job_mutation_response';
	/** number of rows affected by the mutation */
	affected_rows: Scalars['Int'];
	/** data from the rows affected by the mutation */
	returning: Array<WantedJob>;
};

/** on conflict condition type for table "wanted_job" */
export type WantedJobOnConflict = {
	constraint: WantedJobConstraint;
	update_columns?: Array<WantedJobUpdateColumn>;
	where?: InputMaybe<WantedJobBoolExp>;
};

/** Ordering options when selecting data from "wanted_job". */
export type WantedJobOrderBy = {
	id?: InputMaybe<OrderBy>;
	notebook?: InputMaybe<NotebookOrderBy>;
	notebook_id?: InputMaybe<OrderBy>;
	rome_code?: InputMaybe<RomeCodeOrderBy>;
	rome_code_id?: InputMaybe<OrderBy>;
};

/** primary key columns input for table: wanted_job */
export type WantedJobPkColumnsInput = {
	id: Scalars['uuid'];
};

/** select columns of table "wanted_job" */
export enum WantedJobSelectColumn {
	/** column name */
	Id = 'id',
	/** column name */
	NotebookId = 'notebook_id',
	/** column name */
	RomeCodeId = 'rome_code_id',
}

/** input type for updating data in table "wanted_job" */
export type WantedJobSetInput = {
	id?: InputMaybe<Scalars['uuid']>;
	notebook_id?: InputMaybe<Scalars['uuid']>;
	rome_code_id?: InputMaybe<Scalars['uuid']>;
};

/** update columns of table "wanted_job" */
export enum WantedJobUpdateColumn {
	/** column name */
	Id = 'id',
	/** column name */
	NotebookId = 'notebook_id',
	/** column name */
	RomeCodeId = 'rome_code_id',
}

export type AddNotebookMembersMutationVariables = Exact<{
	objects: Array<NotebookMemberInsertInput> | NotebookMemberInsertInput;
	notebookId: Scalars['uuid'];
}>;

export type AddNotebookMembersMutation = {
	__typename?: 'mutation_root';
	insert_notebook_member?:
		| { __typename?: 'notebook_member_mutation_response'; affected_rows: number }
		| null
		| undefined;
	update_beneficiary_structure?:
		| { __typename?: 'beneficiary_structure_mutation_response'; affected_rows: number }
		| null
		| undefined;
};

export type AddNotebookMemberBatchMutationVariables = Exact<{
	member: NotebookMemberInsertInput;
	structure: BeneficiaryStructureBoolExp;
}>;

export type AddNotebookMemberBatchMutation = {
	__typename?: 'mutation_root';
	insert_notebook_member?:
		| { __typename?: 'notebook_member_mutation_response'; affected_rows: number }
		| null
		| undefined;
	update_beneficiary_structure?:
		| { __typename?: 'beneficiary_structure_mutation_response'; affected_rows: number }
		| null
		| undefined;
};

export type GetNotebookForBeneficiaryQueryVariables = Exact<{
	array?: InputMaybe<Array<NotebookBoolExp> | NotebookBoolExp>;
}>;

export type GetNotebookForBeneficiaryQuery = {
	__typename?: 'query_root';
	notebook: Array<{
		__typename?: 'notebook';
		id: string;
		beneficiaryId: string;
		beneficiary: {
			__typename?: 'beneficiary';
			firstname: string;
			lastname: string;
			dateOfBirth: string;
		};
	}>;
};

export type RemoveNotebookMembersMutationVariables = Exact<{
	remove: NotebookMemberBoolExp;
}>;

export type RemoveNotebookMembersMutation = {
	__typename?: 'mutation_root';
	delete_notebook_member?:
		| { __typename?: 'notebook_member_mutation_response'; affected_rows: number }
		| null
		| undefined;
};

export type GetProfessionalsFromStructuresQueryVariables = Exact<{
	id: Scalars['uuid'];
}>;

export type GetProfessionalsFromStructuresQuery = {
	__typename?: 'query_root';
	professional: Array<{
		__typename?: 'professional';
		id: string;
		firstname: string;
		lastname: string;
		mobileNumber?: string | null | undefined;
		position?: string | null | undefined;
		email: string;
		structureId: string;
		account?: { __typename?: 'account'; id: string } | null | undefined;
		structure: { __typename?: 'structure'; id: string; name?: string | null | undefined };
	}>;
};

export type GetStructuresWithProQueryVariables = Exact<{ [key: string]: never }>;

export type GetStructuresWithProQuery = {
	__typename?: 'query_root';
	structure: Array<{
		__typename?: 'structure';
		id: string;
		name?: string | null | undefined;
		professionals: Array<{
			__typename?: 'professional';
			id: string;
			firstname: string;
			lastname: string;
			mobileNumber?: string | null | undefined;
			position?: string | null | undefined;
			email: string;
			structureId: string;
			account?: { __typename?: 'account'; id: string } | null | undefined;
			structure: { __typename?: 'structure'; id: string; name?: string | null | undefined };
		}>;
	}>;
};

export type UpdateReferentMutationVariables = Exact<{
	objects: Array<NotebookMemberInsertInput> | NotebookMemberInsertInput;
	beneficiaries: Array<Scalars['uuid']> | Scalars['uuid'];
}>;

export type UpdateReferentMutation = {
	__typename?: 'mutation_root';
	update_beneficiary_structure?:
		| { __typename?: 'beneficiary_structure_mutation_response'; affected_rows: number }
		| null
		| undefined;
	update_notebook_member?:
		| { __typename?: 'notebook_member_mutation_response'; affected_rows: number }
		| null
		| undefined;
	insert_notebook_member?:
		| { __typename?: 'notebook_member_mutation_response'; affected_rows: number }
		| null
		| undefined;
};

export type UpdateReferentWithStructureMutationVariables = Exact<{
	objects: Array<NotebookMemberInsertInput> | NotebookMemberInsertInput;
	beneficiaryStructureObjects:
		| Array<BeneficiaryStructureInsertInput>
		| BeneficiaryStructureInsertInput;
	beneficiaries: Array<Scalars['uuid']> | Scalars['uuid'];
}>;

export type UpdateReferentWithStructureMutation = {
	__typename?: 'mutation_root';
	delete_beneficiary_structure?:
		| { __typename?: 'beneficiary_structure_mutation_response'; affected_rows: number }
		| null
		| undefined;
	insert_beneficiary_structure?:
		| { __typename?: 'beneficiary_structure_mutation_response'; affected_rows: number }
		| null
		| undefined;
	update_notebook_member?:
		| { __typename?: 'notebook_member_mutation_response'; affected_rows: number }
		| null
		| undefined;
	insert_notebook_member?:
		| { __typename?: 'notebook_member_mutation_response'; affected_rows: number }
		| null
		| undefined;
};

export type RemoveReferentMutationVariables = Exact<{
	notebooks: Array<Scalars['uuid']> | Scalars['uuid'];
}>;

export type RemoveReferentMutation = {
	__typename?: 'mutation_root';
	update_notebook_member?:
		| { __typename?: 'notebook_member_mutation_response'; affected_rows: number }
		| null
		| undefined;
};

export type CreateDeploymentMutationVariables = Exact<{
	email: Scalars['citext'];
	deployment: Scalars['String'];
}>;

export type CreateDeploymentMutation = {
	__typename?: 'mutation_root';
	createDeploymentWithEmail?:
		| { __typename?: 'CreateDeploymentOutput'; id: string; label: string }
		| null
		| undefined;
};

export type GetDeploymentByIdQueryVariables = Exact<{
	id: Scalars['uuid'];
}>;

export type GetDeploymentByIdQuery = {
	__typename?: 'query_root';
	deployment?:
		| {
				__typename?: 'deployment';
				id: string;
				label: string;
				config?: any | null | undefined;
				managers: Array<{
					__typename?: 'manager';
					id: string;
					firstname?: string | null | undefined;
					lastname?: string | null | undefined;
				}>;
				beneficiaries_aggregate: {
					__typename?: 'beneficiary_aggregate';
					aggregate?:
						| { __typename?: 'beneficiary_aggregate_fields'; count: number }
						| null
						| undefined;
				};
				structures_aggregate: {
					__typename?: 'structure_aggregate';
					aggregate?:
						| { __typename?: 'structure_aggregate_fields'; count: number }
						| null
						| undefined;
				};
		  }
		| null
		| undefined;
	professional_aggregate: {
		__typename?: 'professional_aggregate';
		aggregate?: { __typename?: 'professional_aggregate_fields'; count: number } | null | undefined;
	};
};

export type GetDeploymentsQueryVariables = Exact<{ [key: string]: never }>;

export type GetDeploymentsQuery = {
	__typename?: 'query_root';
	deployments: Array<{
		__typename?: 'deployment';
		id: string;
		label: string;
		managers: Array<{
			__typename?: 'manager';
			id: string;
			firstname?: string | null | undefined;
			lastname?: string | null | undefined;
			email: string;
		}>;
	}>;
};

export type GetDeploymentNotebooksQueryVariables = Exact<{
	deploymentId: Scalars['uuid'];
}>;

export type GetDeploymentNotebooksQuery = {
	__typename?: 'query_root';
	deployment?: { __typename?: 'deployment'; label: string; id: string } | null | undefined;
	notebooks: Array<{
		__typename?: 'notebook';
		id: string;
		beneficiary: { __typename?: 'beneficiary'; firstname: string; lastname: string };
	}>;
};

export type UpdateNotebookActionMutationVariables = Exact<{
	id: Scalars['uuid'];
}>;

export type UpdateNotebookActionMutation = {
	__typename?: 'mutation_root';
	updateNotebookAct?: { __typename?: 'UpdateNotebookOutput'; id: string } | null | undefined;
};

export type DeactivateNotebookMemberMutationVariables = Exact<{
	member: NotebookMemberBoolExp;
}>;

export type DeactivateNotebookMemberMutation = {
	__typename?: 'mutation_root';
	update_notebook_member?:
		| { __typename?: 'notebook_member_mutation_response'; affected_rows: number }
		| null
		| undefined;
};

export type AddNotebookMemberWithBeneficiaryStructureUpdateMutationVariables = Exact<{
	member: NotebookMemberInsertInput;
	structure: BeneficiaryStructureBoolExp;
}>;

export type AddNotebookMemberWithBeneficiaryStructureUpdateMutation = {
	__typename?: 'mutation_root';
	insert_notebook_member_one?:
		| {
				__typename?: 'notebook_member';
				notebook: { __typename?: 'notebook'; beneficiaryId: string };
		  }
		| null
		| undefined;
	update_beneficiary_structure?:
		| { __typename?: 'beneficiary_structure_mutation_response'; affected_rows: number }
		| null
		| undefined;
};

export type AttachBeneficiaryToStructureMutationVariables = Exact<{
	beneficiaryId: Scalars['uuid'];
	structureId: Scalars['uuid'];
}>;

export type AttachBeneficiaryToStructureMutation = {
	__typename?: 'mutation_root';
	insert_beneficiary_structure_one?:
		| { __typename?: 'beneficiary_structure'; id: string }
		| null
		| undefined;
};

export type ImportBeneficiaryMutationVariables = Exact<{
	firstname: Scalars['String'];
	lastname: Scalars['String'];
	dateOfBirth: Scalars['date'];
	placeOfBirth?: InputMaybe<Scalars['String']>;
	mobileNumber?: InputMaybe<Scalars['String']>;
	email?: InputMaybe<Scalars['citext']>;
	address1?: InputMaybe<Scalars['String']>;
	address2?: InputMaybe<Scalars['String']>;
	postalCode?: InputMaybe<Scalars['String']>;
	city?: InputMaybe<Scalars['String']>;
	workSituation?: InputMaybe<Scalars['String']>;
	cafNumber?: InputMaybe<Scalars['String']>;
	peNumber?: InputMaybe<Scalars['String']>;
	rightRsa?: InputMaybe<Scalars['String']>;
	rightAre?: InputMaybe<Scalars['Boolean']>;
	rightAss?: InputMaybe<Scalars['Boolean']>;
	rightBonus?: InputMaybe<Scalars['Boolean']>;
	rightRqth?: InputMaybe<Scalars['Boolean']>;
	geographicalArea?: InputMaybe<Scalars['String']>;
	educationLevel?: InputMaybe<Scalars['String']>;
	internalId?: InputMaybe<Scalars['String']>;
	members: Array<NotebookMemberInsertInput> | NotebookMemberInsertInput;
	structures: Array<BeneficiaryStructureInsertInput> | BeneficiaryStructureInsertInput;
	wantedJobs: Array<WantedJobInsertInput> | WantedJobInsertInput;
	needOrientation: Scalars['Boolean'];
}>;

export type ImportBeneficiaryMutation = {
	__typename?: 'mutation_root';
	newNotebook?: { __typename?: 'notebook'; id: string } | null | undefined;
};

export type ImportStructureMutationVariables = Exact<{
	name?: InputMaybe<Scalars['String']>;
	phone?: InputMaybe<Scalars['String']>;
	email?: InputMaybe<Scalars['String']>;
	address1?: InputMaybe<Scalars['String']>;
	address2?: InputMaybe<Scalars['String']>;
	postalCode?: InputMaybe<Scalars['String']>;
	city?: InputMaybe<Scalars['String']>;
	website?: InputMaybe<Scalars['String']>;
	siret?: InputMaybe<Scalars['String']>;
	shortDesc?: InputMaybe<Scalars['String']>;
	adminEmail?: InputMaybe<Scalars['citext']>;
	firstname?: InputMaybe<Scalars['String']>;
	lastname?: InputMaybe<Scalars['String']>;
	position?: InputMaybe<Scalars['String']>;
	phoneNumbers?: InputMaybe<Scalars['String']>;
	forceUpdate?: InputMaybe<Scalars['Boolean']>;
	sendAccountEmail?: InputMaybe<Scalars['Boolean']>;
}>;

export type ImportStructureMutation = {
	__typename?: 'mutation_root';
	structure?: { __typename?: 'InsertStructureWithAdminOutput'; id: string } | null | undefined;
};

export type UpdateManagerProfileMutationVariables = Exact<{
	firstname: Scalars['String'];
	lastname: Scalars['String'];
	email: Scalars['citext'];
	id: Scalars['uuid'];
	accountId: Scalars['uuid'];
}>;

export type UpdateManagerProfileMutation = {
	__typename?: 'mutation_root';
	updateManager?: { __typename?: 'manager'; id: string } | null | undefined;
	updateAccount?:
		| {
				__typename?: 'account';
				id: string;
				onboardingDone?: boolean | null | undefined;
				confirmed: boolean;
				username: string;
				manager?:
					| {
							__typename?: 'manager';
							id: string;
							firstname?: string | null | undefined;
							lastname?: string | null | undefined;
							email: string;
					  }
					| null
					| undefined;
		  }
		| null
		| undefined;
};

export type AddNotebookActionMutationVariables = Exact<{
	action: Scalars['String'];
	targetId: Scalars['uuid'];
	status: Scalars['String'];
}>;

export type AddNotebookActionMutation = {
	__typename?: 'mutation_root';
	insert_notebook_action_one?:
		| {
				__typename?: 'notebook_action';
				id: string;
				target: { __typename?: 'notebook_target'; id: string };
		  }
		| null
		| undefined;
};

export type GetRefActionsQueryVariables = Exact<{
	theme: Scalars['String'];
}>;

export type GetRefActionsQuery = {
	__typename?: 'query_root';
	refActions: Array<{ __typename?: 'ref_action'; id: string; description: string }>;
};

export type UpdateActionStatusMutationVariables = Exact<{
	status: Scalars['String'];
	id: Scalars['uuid'];
}>;

export type UpdateActionStatusMutation = {
	__typename?: 'mutation_root';
	updateStatus?: { __typename?: 'notebook_action'; id: string } | null | undefined;
};

export type UpdateNotebookContractMutationVariables = Exact<{
	id: Scalars['uuid'];
	contractType: Scalars['String'];
	contractSignDate?: InputMaybe<Scalars['date']>;
}>;

export type UpdateNotebookContractMutation = {
	__typename?: 'mutation_root';
	update_notebook_by_pk?: { __typename?: 'notebook'; id: string } | null | undefined;
};

export type AddNotebookFocusMutationVariables = Exact<{
	notebookId: Scalars['uuid'];
	situations?: InputMaybe<Scalars['jsonb']>;
	theme: Scalars['String'];
	linkedTo: Scalars['String'];
}>;

export type AddNotebookFocusMutation = {
	__typename?: 'mutation_root';
	insert_notebook_focus_one?: { __typename?: 'notebook_focus'; id: string } | null | undefined;
};

export type DeleteNotebookFocusByIdMutationVariables = Exact<{
	id: Scalars['uuid'];
}>;

export type DeleteNotebookFocusByIdMutation = {
	__typename?: 'mutation_root';
	delete_notebook_focus_by_pk?: { __typename?: 'notebook_focus'; id: string } | null | undefined;
};

export type GetNotebookFocusByIdQueryVariables = Exact<{
	id: Scalars['uuid'];
}>;

export type GetNotebookFocusByIdQuery = {
	__typename?: 'query_root';
	focus?:
		| {
				__typename?: 'notebook_focus';
				id: string;
				situations?: any | null | undefined;
				linkedTo?: string | null | undefined;
				theme: string;
				createdAt: string;
				targets: Array<{
					__typename?: 'notebook_target';
					target: string;
					status: string;
					id: string;
					actions: Array<{
						__typename?: 'notebook_action';
						id: string;
						createdAt: string;
						status: string;
						action: string;
						creator: {
							__typename?: 'account';
							professional?:
								| { __typename?: 'professional'; id: string; lastname: string; firstname: string }
								| null
								| undefined;
						};
					}>;
				}>;
				creator: {
					__typename?: 'account';
					professional?:
						| {
								__typename?: 'professional';
								id: string;
								position?: string | null | undefined;
								firstname: string;
								lastname: string;
								mobileNumber?: string | null | undefined;
								structureId: string;
								structure: {
									__typename?: 'structure';
									id: string;
									name?: string | null | undefined;
									phone?: string | null | undefined;
									address1?: string | null | undefined;
									address2?: string | null | undefined;
									city?: string | null | undefined;
									postalCode?: string | null | undefined;
									website?: string | null | undefined;
								};
						  }
						| null
						| undefined;
				};
		  }
		| null
		| undefined;
};

export type GetRefSituationsQueryVariables = Exact<{ [key: string]: never }>;

export type GetRefSituationsQuery = {
	__typename?: 'query_root';
	refSituations: Array<{
		__typename?: 'ref_situation';
		id: string;
		description: string;
		theme: string;
	}>;
};

export type GetRefSituationsByThemeQueryVariables = Exact<{
	theme: Scalars['String'];
}>;

export type GetRefSituationsByThemeQuery = {
	__typename?: 'query_root';
	refSituations: Array<{
		__typename?: 'ref_situation';
		id: string;
		description: string;
		theme: string;
	}>;
};

export type UpdateNotebookFocusMutationVariables = Exact<{
	id: Scalars['uuid'];
	situations?: InputMaybe<Scalars['jsonb']>;
	linkedTo: Scalars['String'];
}>;

export type UpdateNotebookFocusMutation = {
	__typename?: 'mutation_root';
	update_notebook_focus_by_pk?: { __typename?: 'notebook_focus'; id: string } | null | undefined;
};

export type UpdateTargetStatusMutationVariables = Exact<{
	status: Scalars['String'];
	id: Scalars['uuid'];
}>;

export type UpdateTargetStatusMutation = {
	__typename?: 'mutation_root';
	updateStatus?: { __typename?: 'notebook_target'; id: string } | null | undefined;
};

export type AddNotebookAppointmentMutationVariables = Exact<{
	date?: InputMaybe<Scalars['date']>;
	notebookId?: InputMaybe<Scalars['uuid']>;
	memberAccountId?: InputMaybe<Scalars['uuid']>;
	status?: InputMaybe<Scalars['String']>;
}>;

export type AddNotebookAppointmentMutation = {
	__typename?: 'mutation_root';
	addAppointment?:
		| {
				__typename?: 'notebook_appointment_mutation_response';
				returning: Array<{ __typename?: 'notebook_appointment'; id: string; notebookId: string }>;
		  }
		| null
		| undefined;
};

export type AddNotebookMemberMutationVariables = Exact<{
	creatorId: Scalars['uuid'];
	accountId: Scalars['uuid'];
	notebookId: Scalars['uuid'];
}>;

export type AddNotebookMemberMutation = {
	__typename?: 'mutation_root';
	newMember?: { __typename?: 'notebook_member'; id: string } | null | undefined;
};

export type GetNotebookAppointmentsQueryVariables = Exact<{
	memberAccountId?: InputMaybe<Scalars['uuid']>;
	notebookId?: InputMaybe<Scalars['uuid']>;
}>;

export type GetNotebookAppointmentsQuery = {
	__typename?: 'query_root';
	getNotebookAppointments: Array<{
		__typename?: 'notebook_appointment';
		date: string;
		id: string;
		status: string;
	}>;
};

export type SearchProfessionalQueryVariables = Exact<{
	search?: InputMaybe<Scalars['String']>;
	professionalIds?: InputMaybe<Array<Scalars['uuid']> | Scalars['uuid']>;
}>;

export type SearchProfessionalQuery = {
	__typename?: 'query_root';
	professionals: Array<{
		__typename?: 'professional';
		id: string;
		firstname: string;
		lastname: string;
		structure: {
			__typename?: 'structure';
			id: string;
			name?: string | null | undefined;
			postalCode?: string | null | undefined;
			phone?: string | null | undefined;
		};
		account?: { __typename?: 'account'; id: string } | null | undefined;
	}>;
	count: {
		__typename?: 'professional_aggregate';
		aggregate?: { __typename?: 'professional_aggregate_fields'; count: number } | null | undefined;
	};
};

export type UpdateNotebookAppointmentMutationVariables = Exact<{
	date?: InputMaybe<Scalars['date']>;
	status?: InputMaybe<Scalars['String']>;
	id: Scalars['uuid'];
}>;

export type UpdateNotebookAppointmentMutation = {
	__typename?: 'mutation_root';
	updateNotbookAppointment?:
		| { __typename?: 'notebook_appointment'; id: string; notebookId: string }
		| null
		| undefined;
};

export type UpdateBeneficiaryPersonalInfoMutationVariables = Exact<{
	id: Scalars['uuid'];
	firstname?: InputMaybe<Scalars['String']>;
	lastname?: InputMaybe<Scalars['String']>;
	dateOfBirth?: InputMaybe<Scalars['date']>;
	mobileNumber?: InputMaybe<Scalars['String']>;
	email?: InputMaybe<Scalars['citext']>;
	address1?: InputMaybe<Scalars['String']>;
	address2?: InputMaybe<Scalars['String']>;
	postalCode?: InputMaybe<Scalars['String']>;
	city?: InputMaybe<Scalars['String']>;
	peNumber?: InputMaybe<Scalars['String']>;
	cafNumber?: InputMaybe<Scalars['String']>;
}>;

export type UpdateBeneficiaryPersonalInfoMutation = {
	__typename?: 'mutation_root';
	updateMember?:
		| { __typename?: 'notebook_member_mutation_response'; affected_rows: number }
		| null
		| undefined;
	update?: { __typename?: 'beneficiary'; id: string } | null | undefined;
};

export type UpdateSocioProMutationVariables = Exact<{
	id: Scalars['uuid'];
	workSituation?: InputMaybe<Scalars['String']>;
	workSituationDate?: InputMaybe<Scalars['date']>;
	rightRsa?: InputMaybe<Scalars['String']>;
	rightAre?: InputMaybe<Scalars['Boolean']>;
	rightAss?: InputMaybe<Scalars['Boolean']>;
	rightRqth?: InputMaybe<Scalars['Boolean']>;
	rightBonus?: InputMaybe<Scalars['Boolean']>;
	geographicalArea?: InputMaybe<Scalars['String']>;
	educationLevel?: InputMaybe<Scalars['String']>;
	wantedJobs: Array<WantedJobInsertInput> | WantedJobInsertInput;
}>;

export type UpdateSocioProMutation = {
	__typename?: 'mutation_root';
	update?: { __typename?: 'notebook'; id: string } | null | undefined;
	delete_wanted_job?:
		| { __typename?: 'wanted_job_mutation_response'; affected_rows: number }
		| null
		| undefined;
	insert_wanted_job?:
		| { __typename?: 'wanted_job_mutation_response'; affected_rows: number }
		| null
		| undefined;
};

export type AddNotebookTargetMutationVariables = Exact<{
	focusId: Scalars['uuid'];
	target?: InputMaybe<Scalars['String']>;
}>;

export type AddNotebookTargetMutation = {
	__typename?: 'mutation_root';
	insert_notebook_target_one?: { __typename?: 'notebook_target'; id: string } | null | undefined;
};

export type GetRefTargetByFocusQueryVariables = Exact<{
	theme: Scalars['String'];
}>;

export type GetRefTargetByFocusQuery = {
	__typename?: 'query_root';
	refTargets: Array<{ __typename?: 'ref_target'; id: string; description: string }>;
};

export type GetAccountByPkQueryVariables = Exact<{
	accountId: Scalars['uuid'];
}>;

export type GetAccountByPkQuery = {
	__typename?: 'query_root';
	account_by_pk?:
		| {
				__typename?: 'account';
				id: string;
				onboardingDone?: boolean | null | undefined;
				confirmed: boolean;
				username: string;
				beneficiary?:
					| {
							__typename?: 'beneficiary';
							id: string;
							firstname: string;
							lastname: string;
							email?: string | null | undefined;
							mobileNumber?: string | null | undefined;
							dateOfBirth: string;
					  }
					| null
					| undefined;
				manager?:
					| {
							__typename?: 'manager';
							id: string;
							email: string;
							firstname?: string | null | undefined;
							lastname?: string | null | undefined;
					  }
					| null
					| undefined;
				professional?:
					| {
							__typename?: 'professional';
							id: string;
							firstname: string;
							lastname: string;
							mobileNumber?: string | null | undefined;
							email: string;
							position?: string | null | undefined;
							structure: {
								__typename?: 'structure';
								id: string;
								name?: string | null | undefined;
								address1?: string | null | undefined;
								address2?: string | null | undefined;
								postalCode?: string | null | undefined;
								city?: string | null | undefined;
								website?: string | null | undefined;
								deployment?: { __typename?: 'deployment'; label: string } | null | undefined;
							};
					  }
					| null
					| undefined;
				admin_structure?:
					| {
							__typename?: 'admin_structure';
							id: string;
							email: string;
							firstname?: string | null | undefined;
							lastname?: string | null | undefined;
							phoneNumbers?: string | null | undefined;
					  }
					| null
					| undefined;
		  }
		| null
		| undefined;
};

export type CreateDeploymentFromApiMutationVariables = Exact<{
	object: DeploymentInsertInput;
}>;

export type CreateDeploymentFromApiMutation = {
	__typename?: 'mutation_root';
	insert_deployment_one?:
		| {
				__typename?: 'deployment';
				id: string;
				label: string;
				managers: Array<{
					__typename?: 'manager';
					account?: { __typename?: 'account'; id: string } | null | undefined;
				}>;
		  }
		| null
		| undefined;
};

export type ListDeploymentIdQueryVariables = Exact<{ [key: string]: never }>;

export type ListDeploymentIdQuery = {
	__typename?: 'query_root';
	deployments: Array<{ __typename?: 'deployment'; id: string }>;
};

export type GetDeploymentStatForDayQueryVariables = Exact<{
	day: Scalars['timestamptz'];
	last30Days: Scalars['timestamptz'];
	deploymentId: Scalars['uuid'];
}>;

export type GetDeploymentStatForDayQuery = {
	__typename?: 'query_root';
	nbNotebooks: {
		__typename?: 'notebook_aggregate';
		aggregate?: { __typename?: 'notebook_aggregate_fields'; count: number } | null | undefined;
	};
	nbStructures: {
		__typename?: 'structure_aggregate';
		aggregate?: { __typename?: 'structure_aggregate_fields'; count: number } | null | undefined;
	};
	nbProfessionals: {
		__typename?: 'professional_aggregate';
		aggregate?: { __typename?: 'professional_aggregate_fields'; count: number } | null | undefined;
	};
	nbNotebookWithActions: {
		__typename?: 'notebook_aggregate';
		aggregate?: { __typename?: 'notebook_aggregate_fields'; count: number } | null | undefined;
	};
	nbNotebookModifiedSince30d: {
		__typename?: 'notebook_aggregate';
		aggregate?: { __typename?: 'notebook_aggregate_fields'; count: number } | null | undefined;
	};
	nbNotebookCreatedToday: {
		__typename?: 'notebook_aggregate';
		aggregate?: { __typename?: 'notebook_aggregate_fields'; count: number } | null | undefined;
	};
	nbNotebookVisitedToday: {
		__typename?: 'notebook_aggregate';
		aggregate?: { __typename?: 'notebook_aggregate_fields'; count: number } | null | undefined;
	};
	nbNotebookModifiedToday: {
		__typename?: 'notebook_aggregate';
		aggregate?: { __typename?: 'notebook_aggregate_fields'; count: number } | null | undefined;
	};
	nbNotbookWith2MembersOrMore: {
		__typename?: 'notebook_aggregate';
		aggregate?: { __typename?: 'notebook_aggregate_fields'; count: number } | null | undefined;
	};
	nbNotebookWithActionsCreated: {
		__typename?: 'notebook_aggregate';
		aggregate?: { __typename?: 'notebook_aggregate_fields'; count: number } | null | undefined;
	};
};

export type GetExistingAdminStructureQueryVariables = Exact<{
	email: Scalars['citext'];
	name: Scalars['String'];
}>;

export type GetExistingAdminStructureQuery = {
	__typename?: 'query_root';
	admin: Array<{
		__typename?: 'admin_structure';
		id: string;
		account?: { __typename?: 'account'; id: string } | null | undefined;
	}>;
	structure: Array<{ __typename?: 'structure'; id: string }>;
};

export type GetNotebookInfoQueryVariables = Exact<{
	id: Scalars['uuid'];
}>;

export type GetNotebookInfoQuery = {
	__typename?: 'query_root';
	notebook?:
		| {
				__typename?: 'notebook';
				beneficiary: {
					__typename?: 'beneficiary';
					id: string;
					firstname: string;
					lastname: string;
					dateOfBirth: string;
					deployment?:
						| { __typename?: 'deployment'; config?: any | null | undefined }
						| null
						| undefined;
				};
				focuses: Array<{
					__typename?: 'notebook_focus';
					id: string;
					theme: string;
					linkedTo?: string | null | undefined;
					targets: Array<{
						__typename?: 'notebook_target';
						id: string;
						target: string;
						actions: Array<{
							__typename?: 'notebook_action';
							initialId?: string | null | undefined;
						}>;
					}>;
				}>;
				members: Array<{ __typename?: 'notebook_member'; accountId: string }>;
		  }
		| null
		| undefined;
};

export type InsertAccountAdminStructureMutationVariables = Exact<{
	username: Scalars['String'];
	accessKey: Scalars['String'];
	accessKeyDate: Scalars['timestamptz'];
	adminEmail: Scalars['citext'];
	firstname?: InputMaybe<Scalars['String']>;
	lastname?: InputMaybe<Scalars['String']>;
	position?: InputMaybe<Scalars['String']>;
	phoneNumbers?: InputMaybe<Scalars['String']>;
	structureId: Scalars['uuid'];
}>;

export type InsertAccountAdminStructureMutation = {
	__typename?: 'mutation_root';
	account?:
		| {
				__typename?: 'account';
				accessKey?: string | null | undefined;
				admin_structure?:
					| {
							__typename?: 'admin_structure';
							id: string;
							email: string;
							firstname?: string | null | undefined;
							lastname?: string | null | undefined;
					  }
					| null
					| undefined;
		  }
		| null
		| undefined;
};

export type InsertStructureMutationVariables = Exact<{
	name?: InputMaybe<Scalars['String']>;
	phone?: InputMaybe<Scalars['String']>;
	email?: InputMaybe<Scalars['String']>;
	address1?: InputMaybe<Scalars['String']>;
	address2?: InputMaybe<Scalars['String']>;
	postalCode?: InputMaybe<Scalars['String']>;
	city?: InputMaybe<Scalars['String']>;
	website?: InputMaybe<Scalars['String']>;
	siret?: InputMaybe<Scalars['String']>;
	shortDesc?: InputMaybe<Scalars['String']>;
	onConflict?: InputMaybe<StructureOnConflict>;
}>;

export type InsertStructureMutation = {
	__typename?: 'mutation_root';
	structure?: { __typename?: 'structure'; id: string } | null | undefined;
};

export type InsertStructureAdminStructureMutationVariables = Exact<{
	structureId: Scalars['uuid'];
	adminStructureId: Scalars['uuid'];
}>;

export type InsertStructureAdminStructureMutation = {
	__typename?: 'mutation_root';
	insert_admin_structure_structure_one?:
		| { __typename?: 'admin_structure_structure'; id: string }
		| null
		| undefined;
};

export type UpdateNotebookFromApiMutationVariables = Exact<{
	notebookId: Scalars['uuid'];
	notebook?: InputMaybe<NotebookSetInput>;
	beneficiaryId: Scalars['uuid'];
	beneficiary: BeneficiarySetInput;
	focuses: Array<NotebookFocusInsertInput> | NotebookFocusInsertInput;
	targets: Array<NotebookTargetInsertInput> | NotebookTargetInsertInput;
	actions: Array<NotebookActionInsertInput> | NotebookActionInsertInput;
}>;

export type UpdateNotebookFromApiMutation = {
	__typename?: 'mutation_root';
	update_notebook_by_pk?: { __typename?: 'notebook'; id: string } | null | undefined;
	update_beneficiary_by_pk?: { __typename?: 'beneficiary'; id: string } | null | undefined;
	insert_notebook_focus?:
		| { __typename?: 'notebook_focus_mutation_response'; affected_rows: number }
		| null
		| undefined;
	insert_notebook_target?:
		| { __typename?: 'notebook_target_mutation_response'; affected_rows: number }
		| null
		| undefined;
	insert_notebook_action?:
		| { __typename?: 'notebook_action_mutation_response'; affected_rows: number }
		| null
		| undefined;
};

export type GetStructuresForDeploymentQueryVariables = Exact<{
	deploymentId?: InputMaybe<Scalars['uuid']>;
}>;

export type GetStructuresForDeploymentQuery = {
	__typename?: 'query_root';
	structure: Array<{
		__typename?: 'structure';
		id: string;
		siret?: string | null | undefined;
		name?: string | null | undefined;
		shortDesc?: string | null | undefined;
		phone?: string | null | undefined;
		email?: string | null | undefined;
		postalCode?: string | null | undefined;
		city?: string | null | undefined;
		address1?: string | null | undefined;
		address2?: string | null | undefined;
	}>;
};

export type GetAccountInfoQueryVariables = Exact<{
	accessKey: Scalars['String'];
}>;

export type GetAccountInfoQuery = {
	__typename?: 'query_root';
	account: Array<{
		__typename?: 'account';
		id: string;
		type: string;
		username: string;
		beneficiaryId?: string | null | undefined;
		professionalId?: string | null | undefined;
		managerId?: string | null | undefined;
		adminStructureId?: string | null | undefined;
		professional?:
			| {
					__typename?: 'professional';
					structure: { __typename?: 'structure'; deploymentId?: string | null | undefined };
			  }
			| null
			| undefined;
		manager?:
			| { __typename?: 'manager'; deploymentId?: string | null | undefined }
			| null
			| undefined;
		admin_structure?: { __typename?: 'admin_structure'; deploymentId: string } | null | undefined;
	}>;
};

export type ResetAccountAccessKeyMutationVariables = Exact<{
	id: Scalars['uuid'];
	now: Scalars['timestamptz'];
}>;

export type ResetAccountAccessKeyMutation = {
	__typename?: 'mutation_root';
	update_account_by_pk?:
		| { __typename?: 'account'; lastLogin?: string | null | undefined }
		| null
		| undefined;
};

export type CreateBeneficiaryAccountMutationVariables = Exact<{
	username: Scalars['String'];
	beneficiaryId: Scalars['uuid'];
}>;

export type CreateBeneficiaryAccountMutation = {
	__typename?: 'mutation_root';
	insert_account_one?: { __typename?: 'account'; id: string } | null | undefined;
};

export type GetAccountByUsernameQueryVariables = Exact<{
	comp: StringComparisonExp;
}>;

export type GetAccountByUsernameQuery = {
	__typename?: 'query_root';
	account: Array<{
		__typename?: 'account';
		id: string;
		username: string;
		confirmed: boolean;
		beneficiary?:
			| {
					__typename?: 'beneficiary';
					firstname: string;
					lastname: string;
					email?: string | null | undefined;
			  }
			| null
			| undefined;
		professional?:
			| { __typename?: 'professional'; firstname: string; lastname: string; email: string }
			| null
			| undefined;
		admin?:
			| { __typename?: 'admin_cdb'; firstname: string; lastname: string; email: string }
			| null
			| undefined;
		manager?:
			| {
					__typename?: 'manager';
					firstname?: string | null | undefined;
					lastname?: string | null | undefined;
					email: string;
			  }
			| null
			| undefined;
		admin_structure?:
			| {
					__typename?: 'admin_structure';
					firstname?: string | null | undefined;
					lastname?: string | null | undefined;
					email: string;
			  }
			| null
			| undefined;
	}>;
};

export type GetAccountByEmailQueryVariables = Exact<{
	criteria: AccountBoolExp;
}>;

export type GetAccountByEmailQuery = {
	__typename?: 'query_root';
	account: Array<{
		__typename?: 'account';
		id: string;
		username: string;
		confirmed: boolean;
		beneficiary?:
			| {
					__typename?: 'beneficiary';
					firstname: string;
					lastname: string;
					email?: string | null | undefined;
			  }
			| null
			| undefined;
		professional?:
			| { __typename?: 'professional'; firstname: string; lastname: string; email: string }
			| null
			| undefined;
		admin?:
			| { __typename?: 'admin_cdb'; firstname: string; lastname: string; email: string }
			| null
			| undefined;
		manager?:
			| {
					__typename?: 'manager';
					firstname?: string | null | undefined;
					lastname?: string | null | undefined;
					email: string;
			  }
			| null
			| undefined;
		admin_structure?:
			| {
					__typename?: 'admin_structure';
					firstname?: string | null | undefined;
					lastname?: string | null | undefined;
					email: string;
			  }
			| null
			| undefined;
	}>;
};

export type GetBeneficiaryByEmailQueryVariables = Exact<{
	email: Scalars['citext'];
}>;

export type GetBeneficiaryByEmailQuery = {
	__typename?: 'query_root';
	beneficiary: Array<{
		__typename?: 'beneficiary';
		firstname: string;
		lastname: string;
		id: string;
	}>;
};

export type UpdateAccountAccessKeyMutationVariables = Exact<{
	id: Scalars['uuid'];
	input?: InputMaybe<AccountSetInput>;
}>;

export type UpdateAccountAccessKeyMutation = {
	__typename?: 'mutation_root';
	account?: { __typename?: 'account'; accessKey?: string | null | undefined } | null | undefined;
};

export type GetNotebookByBeneficiaryIdQueryVariables = Exact<{
	id: Scalars['uuid'];
}>;

export type GetNotebookByBeneficiaryIdQuery = {
	__typename?: 'query_root';
	notebook: Array<{
		__typename?: 'notebook';
		id: string;
		workSituation?: string | null | undefined;
		workSituationDate?: string | null | undefined;
		rightAre: boolean;
		rightAss?: boolean | null | undefined;
		rightRsa?: string | null | undefined;
		rightRqth: boolean;
		rightBonus: boolean;
		contractType?: string | null | undefined;
		contractSignDate?: string | null | undefined;
		educationLevel?: string | null | undefined;
		geographicalArea?: string | null | undefined;
		wantedJobs: Array<{
			__typename?: 'wanted_job';
			rome_code: { __typename?: 'rome_code'; id: string; label: string };
		}>;
		beneficiary: {
			__typename?: 'beneficiary';
			address1?: string | null | undefined;
			address2?: string | null | undefined;
			cafNumber?: string | null | undefined;
			city?: string | null | undefined;
			dateOfBirth: string;
			email?: string | null | undefined;
			firstname: string;
			id: string;
			lastname: string;
			mobileNumber?: string | null | undefined;
			peNumber?: string | null | undefined;
			postalCode?: string | null | undefined;
		};
		members: Array<{
			__typename?: 'notebook_member';
			id: string;
			memberType: string;
			lastModifiedAt?: string | null | undefined;
			lastVisitedAt?: string | null | undefined;
			account: {
				__typename?: 'account';
				professional?:
					| {
							__typename?: 'professional';
							id: string;
							lastname: string;
							firstname: string;
							position?: string | null | undefined;
							email: string;
							mobileNumber?: string | null | undefined;
							structure: {
								__typename?: 'structure';
								id: string;
								name?: string | null | undefined;
								address1?: string | null | undefined;
								address2?: string | null | undefined;
								postalCode?: string | null | undefined;
								city?: string | null | undefined;
							};
					  }
					| null
					| undefined;
			};
		}>;
		focuses: Array<{
			__typename?: 'notebook_focus';
			theme: string;
			situations?: any | null | undefined;
			creator: {
				__typename?: 'account';
				professional?:
					| {
							__typename?: 'professional';
							firstname: string;
							lastname: string;
							structure: { __typename?: 'structure'; name?: string | null | undefined };
					  }
					| null
					| undefined;
			};
			targets: Array<{
				__typename?: 'notebook_target';
				target: string;
				createdAt: string;
				creator: {
					__typename?: 'account';
					professional?:
						| {
								__typename?: 'professional';
								firstname: string;
								lastname: string;
								structure: { __typename?: 'structure'; name?: string | null | undefined };
						  }
						| null
						| undefined;
				};
				actions: Array<{
					__typename?: 'notebook_action';
					action: string;
					createdAt: string;
					status: string;
					creator: {
						__typename?: 'account';
						professional?:
							| {
									__typename?: 'professional';
									firstname: string;
									lastname: string;
									structure: { __typename?: 'structure'; name?: string | null | undefined };
							  }
							| null
							| undefined;
					};
				}>;
			}>;
		}>;
	}>;
};

export type GetNotebookByIdQueryVariables = Exact<{
	id: Scalars['uuid'];
}>;

export type GetNotebookByIdQuery = {
	__typename?: 'query_root';
	notebook: Array<{
		__typename?: 'notebook';
		id: string;
		workSituation?: string | null | undefined;
		workSituationDate?: string | null | undefined;
		rightAre: boolean;
		rightAss?: boolean | null | undefined;
		rightRsa?: string | null | undefined;
		rightRqth: boolean;
		rightBonus: boolean;
		contractType?: string | null | undefined;
		contractSignDate?: string | null | undefined;
		educationLevel?: string | null | undefined;
		geographicalArea?: string | null | undefined;
		wantedJobs: Array<{
			__typename?: 'wanted_job';
			rome_code: { __typename?: 'rome_code'; id: string; label: string };
		}>;
		beneficiary: {
			__typename?: 'beneficiary';
			address1?: string | null | undefined;
			address2?: string | null | undefined;
			cafNumber?: string | null | undefined;
			city?: string | null | undefined;
			dateOfBirth: string;
			email?: string | null | undefined;
			firstname: string;
			id: string;
			lastname: string;
			mobileNumber?: string | null | undefined;
			peNumber?: string | null | undefined;
			postalCode?: string | null | undefined;
		};
		members: Array<{
			__typename?: 'notebook_member';
			id: string;
			memberType: string;
			lastModifiedAt?: string | null | undefined;
			lastVisitedAt?: string | null | undefined;
			account: {
				__typename?: 'account';
				professional?:
					| {
							__typename?: 'professional';
							id: string;
							lastname: string;
							firstname: string;
							position?: string | null | undefined;
							email: string;
							mobileNumber?: string | null | undefined;
							structure: {
								__typename?: 'structure';
								id: string;
								name?: string | null | undefined;
								address1?: string | null | undefined;
								address2?: string | null | undefined;
								postalCode?: string | null | undefined;
								city?: string | null | undefined;
							};
					  }
					| null
					| undefined;
			};
		}>;
		focuses: Array<{
			__typename?: 'notebook_focus';
			theme: string;
			situations?: any | null | undefined;
			creator: {
				__typename?: 'account';
				professional?:
					| {
							__typename?: 'professional';
							firstname: string;
							lastname: string;
							structure: { __typename?: 'structure'; name?: string | null | undefined };
					  }
					| null
					| undefined;
			};
			targets: Array<{
				__typename?: 'notebook_target';
				target: string;
				createdAt: string;
				creator: {
					__typename?: 'account';
					professional?:
						| {
								__typename?: 'professional';
								firstname: string;
								lastname: string;
								structure: { __typename?: 'structure'; name?: string | null | undefined };
						  }
						| null
						| undefined;
				};
				actions: Array<{
					__typename?: 'notebook_action';
					action: string;
					createdAt: string;
					status: string;
					creator: {
						__typename?: 'account';
						professional?:
							| {
									__typename?: 'professional';
									firstname: string;
									lastname: string;
									structure: { __typename?: 'structure'; name?: string | null | undefined };
							  }
							| null
							| undefined;
					};
				}>;
			}>;
		}>;
	}>;
};

export type NotebookFragmentFragment = {
	__typename?: 'notebook';
	id: string;
	workSituation?: string | null | undefined;
	workSituationDate?: string | null | undefined;
	rightAre: boolean;
	rightAss?: boolean | null | undefined;
	rightRsa?: string | null | undefined;
	rightRqth: boolean;
	rightBonus: boolean;
	contractType?: string | null | undefined;
	contractSignDate?: string | null | undefined;
	educationLevel?: string | null | undefined;
	geographicalArea?: string | null | undefined;
	wantedJobs: Array<{
		__typename?: 'wanted_job';
		rome_code: { __typename?: 'rome_code'; id: string; label: string };
	}>;
	beneficiary: {
		__typename?: 'beneficiary';
		address1?: string | null | undefined;
		address2?: string | null | undefined;
		cafNumber?: string | null | undefined;
		city?: string | null | undefined;
		dateOfBirth: string;
		email?: string | null | undefined;
		firstname: string;
		id: string;
		lastname: string;
		mobileNumber?: string | null | undefined;
		peNumber?: string | null | undefined;
		postalCode?: string | null | undefined;
	};
	members: Array<{
		__typename?: 'notebook_member';
		id: string;
		memberType: string;
		lastModifiedAt?: string | null | undefined;
		lastVisitedAt?: string | null | undefined;
		account: {
			__typename?: 'account';
			professional?:
				| {
						__typename?: 'professional';
						id: string;
						lastname: string;
						firstname: string;
						position?: string | null | undefined;
						email: string;
						mobileNumber?: string | null | undefined;
						structure: {
							__typename?: 'structure';
							id: string;
							name?: string | null | undefined;
							address1?: string | null | undefined;
							address2?: string | null | undefined;
							postalCode?: string | null | undefined;
							city?: string | null | undefined;
						};
				  }
				| null
				| undefined;
		};
	}>;
	focuses: Array<{
		__typename?: 'notebook_focus';
		theme: string;
		situations?: any | null | undefined;
		creator: {
			__typename?: 'account';
			professional?:
				| {
						__typename?: 'professional';
						firstname: string;
						lastname: string;
						structure: { __typename?: 'structure'; name?: string | null | undefined };
				  }
				| null
				| undefined;
		};
		targets: Array<{
			__typename?: 'notebook_target';
			target: string;
			createdAt: string;
			creator: {
				__typename?: 'account';
				professional?:
					| {
							__typename?: 'professional';
							firstname: string;
							lastname: string;
							structure: { __typename?: 'structure'; name?: string | null | undefined };
					  }
					| null
					| undefined;
			};
			actions: Array<{
				__typename?: 'notebook_action';
				action: string;
				createdAt: string;
				status: string;
				creator: {
					__typename?: 'account';
					professional?:
						| {
								__typename?: 'professional';
								firstname: string;
								lastname: string;
								structure: { __typename?: 'structure'; name?: string | null | undefined };
						  }
						| null
						| undefined;
				};
			}>;
		}>;
	}>;
};

export type GetDeploymentManagersForStructureQueryVariables = Exact<{
	structureId: Scalars['uuid'];
}>;

export type GetDeploymentManagersForStructureQuery = {
	__typename?: 'query_root';
	structure?:
		| {
				__typename?: 'structure';
				deployment?:
					| {
							__typename?: 'deployment';
							managers: Array<{ __typename?: 'manager'; email: string }>;
					  }
					| null
					| undefined;
		  }
		| null
		| undefined;
};

export type GetStructuresQueryVariables = Exact<{ [key: string]: never }>;

export type GetStructuresQuery = {
	__typename?: 'query_root';
	structure: Array<{
		__typename?: 'structure';
		id: string;
		siret?: string | null | undefined;
		name?: string | null | undefined;
		shortDesc?: string | null | undefined;
		phone?: string | null | undefined;
		email?: string | null | undefined;
		postalCode?: string | null | undefined;
		city?: string | null | undefined;
		address1?: string | null | undefined;
		address2?: string | null | undefined;
		website?: string | null | undefined;
	}>;
};

export type InsertProfessionalAccountMutationVariables = Exact<{
	account: AccountInsertInput;
}>;

export type InsertProfessionalAccountMutation = {
	__typename?: 'mutation_root';
	account?: { __typename?: 'account'; id: string } | null | undefined;
};

export type ConfirmAccountByIdMutationVariables = Exact<{
	id: Scalars['uuid'];
	accessKey: Scalars['String'];
	accessKeyDate: Scalars['timestamptz'];
}>;

export type ConfirmAccountByIdMutation = {
	__typename?: 'mutation_root';
	account?:
		| { __typename?: 'account'; id: string; accessKey?: string | null | undefined }
		| null
		| undefined;
};

export type GetAccountByIdQueryVariables = Exact<{
	id: Scalars['uuid'];
}>;

export type GetAccountByIdQuery = {
	__typename?: 'query_root';
	account?:
		| {
				__typename?: 'account';
				id: string;
				username: string;
				confirmed: boolean;
				professional?:
					| { __typename?: 'professional'; firstname: string; lastname: string; email: string }
					| null
					| undefined;
		  }
		| null
		| undefined;
};

export type GetDeploymentInfosQueryVariables = Exact<{
	id: Scalars['uuid'];
}>;

export type GetDeploymentInfosQuery = {
	__typename?: 'query_root';
	deployment?: { __typename?: 'deployment'; label: string } | null | undefined;
	beneficiaries: {
		__typename?: 'beneficiary_aggregate';
		aggregate?: { __typename?: 'beneficiary_aggregate_fields'; count: number } | null | undefined;
	};
	beneficiariesWithNoStructure: {
		__typename?: 'beneficiary_aggregate';
		aggregate?: { __typename?: 'beneficiary_aggregate_fields'; count: number } | null | undefined;
	};
	structures: {
		__typename?: 'structure_aggregate';
		aggregate?: { __typename?: 'structure_aggregate_fields'; count: number } | null | undefined;
	};
	structuresWithPros: Array<{
		__typename?: 'structure';
		id: string;
		name?: string | null | undefined;
		professionals: Array<{
			__typename?: 'professional';
			id: string;
			email: string;
			firstname: string;
			lastname: string;
			account?: { __typename?: 'account'; id: string } | null | undefined;
		}>;
	}>;
	structuresWithNoBeneficiary: {
		__typename?: 'structure_aggregate';
		aggregate?: { __typename?: 'structure_aggregate_fields'; count: number } | null | undefined;
	};
};

export type GetBeneficiariesQueryVariables = Exact<{
	offset: Scalars['Int'];
	limit: Scalars['Int'];
	withMembers: BeneficiaryBoolExp;
	search: Scalars['String'];
}>;

export type GetBeneficiariesQuery = {
	__typename?: 'query_root';
	search_beneficiaries_aggregate: {
		__typename?: 'beneficiary_aggregate';
		aggregate?: { __typename?: 'beneficiary_aggregate_fields'; count: number } | null | undefined;
	};
	beneficiaries: Array<{
		__typename?: 'beneficiary';
		id: string;
		firstname: string;
		lastname: string;
		needOrientation: boolean;
		structures: Array<{
			__typename?: 'beneficiary_structure';
			structure: { __typename?: 'structure'; id: string; name?: string | null | undefined };
		}>;
		notebook?:
			| {
					__typename?: 'notebook';
					id: string;
					members: Array<{
						__typename?: 'notebook_member';
						id: string;
						createdAt: string;
						account: {
							__typename?: 'account';
							id: string;
							professional?:
								| { __typename?: 'professional'; id: string; firstname: string; lastname: string }
								| null
								| undefined;
						};
					}>;
			  }
			| null
			| undefined;
	}>;
};

export type GetProfessionalsForManagerQueryVariables = Exact<{ [key: string]: never }>;

export type GetProfessionalsForManagerQuery = {
	__typename?: 'query_root';
	professional: Array<{
		__typename?: 'professional';
		id: string;
		firstname: string;
		lastname: string;
		mobileNumber?: string | null | undefined;
		position?: string | null | undefined;
		email: string;
		structureId: string;
		account?: { __typename?: 'account'; id: string } | null | undefined;
		structure: { __typename?: 'structure'; id: string; name?: string | null | undefined };
	}>;
};

export type GetStructuresForManagerQueryVariables = Exact<{ [key: string]: never }>;

export type GetStructuresForManagerQuery = {
	__typename?: 'query_root';
	structure: Array<{ __typename?: 'structure'; id: string; name?: string | null | undefined }>;
};

export type GetNotebooksStatsQueryVariables = Exact<{
	afterDate: TimestamptzComparisonExp;
}>;

export type GetNotebooksStatsQuery = {
	__typename?: 'query_root';
	created: {
		__typename?: 'notebook_aggregate';
		aggregate?: { __typename?: 'notebook_aggregate_fields'; count: number } | null | undefined;
	};
	shared: {
		__typename?: 'notebook_aggregate';
		nodes: Array<{
			__typename?: 'notebook';
			id: string;
			members_aggregate: {
				__typename?: 'notebook_member_aggregate';
				aggregate?:
					| { __typename?: 'notebook_member_aggregate_fields'; count: number }
					| null
					| undefined;
			};
		}>;
	};
	open: {
		__typename?: 'notebook_aggregate';
		aggregate?: { __typename?: 'notebook_aggregate_fields'; count: number } | null | undefined;
	};
	modified: {
		__typename?: 'notebook_aggregate';
		aggregate?: { __typename?: 'notebook_aggregate_fields'; count: number } | null | undefined;
	};
	infoAdded: {
		__typename?: 'notebook_aggregate';
		aggregate?: { __typename?: 'notebook_aggregate_fields'; count: number } | null | undefined;
	};
	structConnections: Array<{
		__typename?: 'structure';
		id: string;
		name?: string | null | undefined;
		city?: string | null | undefined;
		professionals_aggregate: {
			__typename?: 'professional_aggregate';
			aggregate?:
				| { __typename?: 'professional_aggregate_fields'; count: number }
				| null
				| undefined;
		};
	}>;
};

export type GetAccountsSummaryQueryVariables = Exact<{ [key: string]: never }>;

export type GetAccountsSummaryQuery = {
	__typename?: 'query_root';
	accounts: Array<{
		__typename?: 'account';
		id: string;
		username: string;
		lastLogin?: string | null | undefined;
		confirmed: boolean;
		onboardingDone?: boolean | null | undefined;
		professional?:
			| {
					__typename?: 'professional';
					id: string;
					firstname: string;
					lastname: string;
					position?: string | null | undefined;
					mobileNumber?: string | null | undefined;
					email: string;
					structure: { __typename?: 'structure'; id: string; name?: string | null | undefined };
			  }
			| null
			| undefined;
	}>;
};

export type GetLastVisitedOrUpdatedQueryVariables = Exact<{
	accountId: Scalars['uuid'];
}>;

export type GetLastVisitedOrUpdatedQuery = {
	__typename?: 'query_root';
	lastVisited: Array<{
		__typename?: 'notebook_member';
		notebook: {
			__typename?: 'notebook';
			id: string;
			beneficiary: {
				__typename?: 'beneficiary';
				id: string;
				firstname: string;
				lastname: string;
				mobileNumber?: string | null | undefined;
				dateOfBirth: string;
			};
		};
	}>;
	lastUpdated: Array<{
		__typename?: 'notebook_member';
		notebook: {
			__typename?: 'notebook';
			id: string;
			beneficiary: {
				__typename?: 'beneficiary';
				id: string;
				firstname: string;
				lastname: string;
				mobileNumber?: string | null | undefined;
				dateOfBirth: string;
			};
		};
	}>;
};

export type CreateBeneficiaryMutationVariables = Exact<{
	firstname: Scalars['String'];
	lastname: Scalars['String'];
	dateOfBirth: Scalars['date'];
	mobileNumber?: InputMaybe<Scalars['String']>;
	email?: InputMaybe<Scalars['citext']>;
	address1?: InputMaybe<Scalars['String']>;
	address2?: InputMaybe<Scalars['String']>;
	postalCode?: InputMaybe<Scalars['String']>;
	city?: InputMaybe<Scalars['String']>;
	workSituation?: InputMaybe<Scalars['String']>;
	cafNumber?: InputMaybe<Scalars['String']>;
	peNumber?: InputMaybe<Scalars['String']>;
	members: Array<NotebookMemberInsertInput> | NotebookMemberInsertInput;
}>;

export type CreateBeneficiaryMutation = {
	__typename?: 'mutation_root';
	newNotebook?: { __typename?: 'notebook'; id: string } | null | undefined;
};

export type SearchNotebookMemberQueryVariables = Exact<{
	accountId: Scalars['uuid'];
	filter?: InputMaybe<Scalars['String']>;
	visitDate: TimestamptzComparisonExp;
}>;

export type SearchNotebookMemberQuery = {
	__typename?: 'query_root';
	search_notebook_members: Array<{
		__typename?: 'notebook_member';
		id: string;
		notebook: {
			__typename?: 'notebook';
			id: string;
			beneficiary: {
				__typename?: 'beneficiary';
				dateOfBirth: string;
				firstname: string;
				id: string;
				lastname: string;
				mobileNumber?: string | null | undefined;
			};
		};
	}>;
};

export type GetNotebookQueryVariables = Exact<{
	id: Scalars['uuid'];
	eventsStart?: InputMaybe<Scalars['timestamptz']>;
	eventsEnd?: InputMaybe<Scalars['timestamptz']>;
}>;

export type GetNotebookQuery = {
	__typename?: 'query_root';
	notebook?:
		| {
				__typename?: 'notebook';
				id: string;
				workSituationDate?: string | null | undefined;
				workSituation?: string | null | undefined;
				rightRsa?: string | null | undefined;
				rightRqth: boolean;
				rightAre: boolean;
				rightAss?: boolean | null | undefined;
				rightBonus: boolean;
				geographicalArea?: string | null | undefined;
				educationLevel?: string | null | undefined;
				contractType?: string | null | undefined;
				contractSignDate?: string | null | undefined;
				wantedJobs: Array<{
					__typename?: 'wanted_job';
					rome_code: { __typename?: 'rome_code'; id: string; label: string };
				}>;
				beneficiary: {
					__typename?: 'beneficiary';
					address1?: string | null | undefined;
					address2?: string | null | undefined;
					cafNumber?: string | null | undefined;
					city?: string | null | undefined;
					dateOfBirth: string;
					email?: string | null | undefined;
					firstname: string;
					id: string;
					lastname: string;
					mobileNumber?: string | null | undefined;
					peNumber?: string | null | undefined;
					postalCode?: string | null | undefined;
				};
				focuses: Array<{
					__typename?: 'notebook_focus';
					id: string;
					theme: string;
					situations?: any | null | undefined;
					linkedTo?: string | null | undefined;
					targets: Array<{
						__typename?: 'notebook_target';
						id: string;
						target: string;
						actions_aggregate: {
							__typename?: 'notebook_action_aggregate';
							aggregate?:
								| { __typename?: 'notebook_action_aggregate_fields'; count: number }
								| null
								| undefined;
						};
					}>;
				}>;
				members: Array<{
					__typename?: 'notebook_member';
					id: string;
					memberType: string;
					lastModifiedAt?: string | null | undefined;
					lastVisitedAt?: string | null | undefined;
					createdAt: string;
					account: {
						__typename?: 'account';
						id: string;
						professional?:
							| {
									__typename?: 'professional';
									id: string;
									lastname: string;
									firstname: string;
									position?: string | null | undefined;
									email: string;
									mobileNumber?: string | null | undefined;
									structure: {
										__typename?: 'structure';
										id: string;
										name?: string | null | undefined;
										address1?: string | null | undefined;
										address2?: string | null | undefined;
										postalCode?: string | null | undefined;
										city?: string | null | undefined;
										website?: string | null | undefined;
									};
							  }
							| null
							| undefined;
					};
				}>;
				appointments: Array<{
					__typename?: 'notebook_appointment';
					date: string;
					memberAccountId: string;
				}>;
				events: Array<{
					__typename?: 'notebook_event';
					id: string;
					eventDate: string;
					event: any;
					eventType: NotebookEventTypeEnum;
					creatorId: string;
					creator: {
						__typename?: 'account';
						professional?:
							| {
									__typename?: 'professional';
									structureId: string;
									structure: { __typename?: 'structure'; name?: string | null | undefined };
							  }
							| null
							| undefined;
					};
				}>;
		  }
		| null
		| undefined;
};

export type GetNotebookEventsQueryVariables = Exact<{
	eventsStart?: InputMaybe<Scalars['timestamptz']>;
	eventsEnd?: InputMaybe<Scalars['timestamptz']>;
	notebookId: Scalars['uuid'];
}>;

export type GetNotebookEventsQuery = {
	__typename?: 'query_root';
	notebook_event: Array<{
		__typename?: 'notebook_event';
		id: string;
		eventDate: string;
		event: any;
		eventType: NotebookEventTypeEnum;
		creatorId: string;
		creator: {
			__typename?: 'account';
			professional?:
				| {
						__typename?: 'professional';
						structureId: string;
						structure: { __typename?: 'structure'; name?: string | null | undefined };
				  }
				| null
				| undefined;
		};
	}>;
};

export type EventFieldsFragment = {
	__typename?: 'notebook_event';
	id: string;
	eventDate: string;
	event: any;
	eventType: NotebookEventTypeEnum;
	creatorId: string;
	creator: {
		__typename?: 'account';
		professional?:
			| {
					__typename?: 'professional';
					structureId: string;
					structure: { __typename?: 'structure'; name?: string | null | undefined };
			  }
			| null
			| undefined;
	};
};

export type GetNotebookMemberByIdQueryVariables = Exact<{
	id: Scalars['uuid'];
}>;

export type GetNotebookMemberByIdQuery = {
	__typename?: 'query_root';
	member?:
		| {
				__typename?: 'notebook_member';
				notebookId: string;
				creator?:
					| {
							__typename?: 'account';
							professional?:
								| {
										__typename?: 'professional';
										firstname: string;
										lastname: string;
										email: string;
										id: string;
								  }
								| null
								| undefined;
					  }
					| null
					| undefined;
				account: {
					__typename?: 'account';
					id: string;
					confirmed: boolean;
					professional?:
						| {
								__typename?: 'professional';
								firstname: string;
								lastname: string;
								email: string;
								id: string;
						  }
						| null
						| undefined;
				};
		  }
		| null
		| undefined;
};

export type GetRomeCodesQueryVariables = Exact<{
	search: Scalars['String'];
	labels?: InputMaybe<Array<Scalars['String']> | Scalars['String']>;
}>;

export type GetRomeCodesQuery = {
	__typename?: 'query_root';
	search_rome_codes: Array<{
		__typename?: 'rome_code';
		id: string;
		code: string;
		description: string;
		label: string;
	}>;
	batch: Array<{
		__typename?: 'rome_code';
		id: string;
		code: string;
		description: string;
		label: string;
	}>;
};

export type UpdateNotebookVisitDateMutationVariables = Exact<{
	id: Scalars['uuid'];
	date: Scalars['timestamptz'];
}>;

export type UpdateNotebookVisitDateMutation = {
	__typename?: 'mutation_root';
	update_notebook_member?:
		| {
				__typename?: 'notebook_member_mutation_response';
				returning: Array<{ __typename?: 'notebook_member'; id: string }>;
		  }
		| null
		| undefined;
};

export type UpdateProfessionalProfileMutationVariables = Exact<{
	firstname: Scalars['String'];
	lastname: Scalars['String'];
	mobileNumber: Scalars['String'];
	email: Scalars['citext'];
	position: Scalars['String'];
	id: Scalars['uuid'];
	structureId?: InputMaybe<Scalars['uuid']>;
	accountId: Scalars['uuid'];
}>;

export type UpdateProfessionalProfileMutation = {
	__typename?: 'mutation_root';
	updateProfessional?: { __typename?: 'professional'; id: string } | null | undefined;
	updateAccount?:
		| {
				__typename?: 'account';
				id: string;
				onboardingDone?: boolean | null | undefined;
				confirmed: boolean;
				username: string;
				professional?:
					| {
							__typename?: 'professional';
							id: string;
							firstname: string;
							lastname: string;
							mobileNumber?: string | null | undefined;
							email: string;
							position?: string | null | undefined;
					  }
					| null
					| undefined;
		  }
		| null
		| undefined;
};

export type GetPendingBeneficiariesQueryVariables = Exact<{
	structureId: Scalars['uuid'];
}>;

export type GetPendingBeneficiariesQuery = {
	__typename?: 'query_root';
	structure_by_pk?:
		| {
				__typename?: 'structure';
				beneficiaries: Array<{
					__typename?: 'beneficiary_structure';
					beneficiary: {
						__typename?: 'beneficiary';
						firstname: string;
						lastname: string;
						dateOfBirth: string;
						notebook?: { __typename?: 'notebook'; id: string } | null | undefined;
					};
				}>;
		  }
		| null
		| undefined;
};

export type GetStructureQueryVariables = Exact<{
	structureId: Scalars['uuid'];
}>;

export type GetStructureQuery = {
	__typename?: 'query_root';
	beneficiaries: {
		__typename?: 'notebook_aggregate';
		aggregate?: { __typename?: 'notebook_aggregate_fields'; count: number } | null | undefined;
	};
	structure_by_pk?:
		| {
				__typename?: 'structure';
				id: string;
				name?: string | null | undefined;
				phone?: string | null | undefined;
				email?: string | null | undefined;
				address1?: string | null | undefined;
				address2?: string | null | undefined;
				postalCode?: string | null | undefined;
				city?: string | null | undefined;
				website?: string | null | undefined;
				pendingBeneficiaries: {
					__typename?: 'beneficiary_structure_aggregate';
					aggregate?:
						| { __typename?: 'beneficiary_structure_aggregate_fields'; count: number }
						| null
						| undefined;
				};
				professionals: Array<{
					__typename?: 'professional';
					id: string;
					email: string;
					firstname: string;
					lastname: string;
					account?: { __typename?: 'account'; id: string } | null | undefined;
				}>;
				professionals_aggregate: {
					__typename?: 'professional_aggregate';
					aggregate?:
						| { __typename?: 'professional_aggregate_fields'; count: number }
						| null
						| undefined;
				};
				admins_aggregate: {
					__typename?: 'admin_structure_structure_aggregate';
					nodes: Array<{
						__typename?: 'admin_structure_structure';
						admin_structure: {
							__typename?: 'admin_structure';
							id: string;
							email: string;
							firstname?: string | null | undefined;
							lastname?: string | null | undefined;
						};
					}>;
				};
		  }
		| null
		| undefined;
};

export type GetManagedStructuresQueryVariables = Exact<{
	adminId: Scalars['uuid'];
}>;

export type GetManagedStructuresQuery = {
	__typename?: 'query_root';
	structures: Array<{
		__typename?: 'structure';
		id: string;
		city?: string | null | undefined;
		name?: string | null | undefined;
		beneficiaries_aggregate: {
			__typename?: 'beneficiary_structure_aggregate';
			aggregate?:
				| { __typename?: 'beneficiary_structure_aggregate_fields'; count: number }
				| null
				| undefined;
		};
		professionals_aggregate: {
			__typename?: 'professional_aggregate';
			aggregate?:
				| { __typename?: 'professional_aggregate_fields'; count: number }
				| null
				| undefined;
		};
		admins_aggregate: {
			__typename?: 'admin_structure_structure_aggregate';
			aggregate?:
				| { __typename?: 'admin_structure_structure_aggregate_fields'; count: number }
				| null
				| undefined;
		};
	}>;
};

export type UpdateAdminStructureProfileMutationVariables = Exact<{
	firstname: Scalars['String'];
	lastname: Scalars['String'];
	email: Scalars['citext'];
	phoneNumbers?: InputMaybe<Scalars['String']>;
	id: Scalars['uuid'];
	accountId: Scalars['uuid'];
}>;

export type UpdateAdminStructureProfileMutation = {
	__typename?: 'mutation_root';
	updateAdminStructure?: { __typename?: 'admin_structure'; id: string } | null | undefined;
	updateAccount?:
		| {
				__typename?: 'account';
				id: string;
				onboardingDone?: boolean | null | undefined;
				confirmed: boolean;
				username: string;
				admin_structure?:
					| {
							__typename?: 'admin_structure';
							id: string;
							firstname?: string | null | undefined;
							lastname?: string | null | undefined;
							email: string;
							phoneNumbers?: string | null | undefined;
					  }
					| null
					| undefined;
		  }
		| null
		| undefined;
};

export const NotebookFragmentFragmentDoc = {
	kind: 'Document',
	definitions: [
		{
			kind: 'FragmentDefinition',
			name: { kind: 'Name', value: 'notebookFragment' },
			typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'notebook' } },
			selectionSet: {
				kind: 'SelectionSet',
				selections: [
					{ kind: 'Field', name: { kind: 'Name', value: 'id' } },
					{ kind: 'Field', name: { kind: 'Name', value: 'workSituation' } },
					{ kind: 'Field', name: { kind: 'Name', value: 'workSituationDate' } },
					{ kind: 'Field', name: { kind: 'Name', value: 'rightAre' } },
					{ kind: 'Field', name: { kind: 'Name', value: 'rightAss' } },
					{ kind: 'Field', name: { kind: 'Name', value: 'rightRsa' } },
					{ kind: 'Field', name: { kind: 'Name', value: 'rightRqth' } },
					{ kind: 'Field', name: { kind: 'Name', value: 'rightBonus' } },
					{ kind: 'Field', name: { kind: 'Name', value: 'contractType' } },
					{ kind: 'Field', name: { kind: 'Name', value: 'contractSignDate' } },
					{ kind: 'Field', name: { kind: 'Name', value: 'educationLevel' } },
					{
						kind: 'Field',
						name: { kind: 'Name', value: 'wantedJobs' },
						selectionSet: {
							kind: 'SelectionSet',
							selections: [
								{
									kind: 'Field',
									name: { kind: 'Name', value: 'rome_code' },
									selectionSet: {
										kind: 'SelectionSet',
										selections: [
											{ kind: 'Field', name: { kind: 'Name', value: 'id' } },
											{ kind: 'Field', name: { kind: 'Name', value: 'label' } },
										],
									},
								},
							],
						},
					},
					{ kind: 'Field', name: { kind: 'Name', value: 'geographicalArea' } },
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
								{ kind: 'Field', name: { kind: 'Name', value: 'postalCode' } },
							],
						},
					},
					{
						kind: 'Field',
						name: { kind: 'Name', value: 'members' },
						arguments: [
							{
								kind: 'Argument',
								name: { kind: 'Name', value: 'where' },
								value: {
									kind: 'ObjectValue',
									fields: [
										{
											kind: 'ObjectField',
											name: { kind: 'Name', value: 'active' },
											value: {
												kind: 'ObjectValue',
												fields: [
													{
														kind: 'ObjectField',
														name: { kind: 'Name', value: '_eq' },
														value: { kind: 'BooleanValue', value: true },
													},
												],
											},
										},
									],
								},
							},
							{
								kind: 'Argument',
								name: { kind: 'Name', value: 'order_by' },
								value: {
									kind: 'ObjectValue',
									fields: [
										{
											kind: 'ObjectField',
											name: { kind: 'Name', value: 'lastModifiedAt' },
											value: { kind: 'EnumValue', value: 'desc_nulls_last' },
										},
									],
								},
							},
						],
						selectionSet: {
							kind: 'SelectionSet',
							selections: [
								{ kind: 'Field', name: { kind: 'Name', value: 'id' } },
								{ kind: 'Field', name: { kind: 'Name', value: 'memberType' } },
								{ kind: 'Field', name: { kind: 'Name', value: 'lastModifiedAt' } },
								{ kind: 'Field', name: { kind: 'Name', value: 'lastVisitedAt' } },
								{
									kind: 'Field',
									name: { kind: 'Name', value: 'account' },
									selectionSet: {
										kind: 'SelectionSet',
										selections: [
											{
												kind: 'Field',
												name: { kind: 'Name', value: 'professional' },
												selectionSet: {
													kind: 'SelectionSet',
													selections: [
														{ kind: 'Field', name: { kind: 'Name', value: 'id' } },
														{ kind: 'Field', name: { kind: 'Name', value: 'lastname' } },
														{ kind: 'Field', name: { kind: 'Name', value: 'firstname' } },
														{ kind: 'Field', name: { kind: 'Name', value: 'position' } },
														{ kind: 'Field', name: { kind: 'Name', value: 'email' } },
														{ kind: 'Field', name: { kind: 'Name', value: 'mobileNumber' } },
														{
															kind: 'Field',
															name: { kind: 'Name', value: 'structure' },
															selectionSet: {
																kind: 'SelectionSet',
																selections: [
																	{ kind: 'Field', name: { kind: 'Name', value: 'id' } },
																	{ kind: 'Field', name: { kind: 'Name', value: 'name' } },
																	{ kind: 'Field', name: { kind: 'Name', value: 'address1' } },
																	{ kind: 'Field', name: { kind: 'Name', value: 'address2' } },
																	{ kind: 'Field', name: { kind: 'Name', value: 'postalCode' } },
																	{ kind: 'Field', name: { kind: 'Name', value: 'city' } },
																],
															},
														},
													],
												},
											},
										],
									},
								},
							],
						},
					},
					{
						kind: 'Field',
						name: { kind: 'Name', value: 'focuses' },
						arguments: [
							{
								kind: 'Argument',
								name: { kind: 'Name', value: 'order_by' },
								value: {
									kind: 'ObjectValue',
									fields: [
										{
											kind: 'ObjectField',
											name: { kind: 'Name', value: 'createdAt' },
											value: { kind: 'EnumValue', value: 'desc_nulls_first' },
										},
									],
								},
							},
						],
						selectionSet: {
							kind: 'SelectionSet',
							selections: [
								{ kind: 'Field', name: { kind: 'Name', value: 'theme' } },
								{ kind: 'Field', name: { kind: 'Name', value: 'situations' } },
								{
									kind: 'Field',
									name: { kind: 'Name', value: 'creator' },
									selectionSet: {
										kind: 'SelectionSet',
										selections: [
											{
												kind: 'Field',
												name: { kind: 'Name', value: 'professional' },
												selectionSet: {
													kind: 'SelectionSet',
													selections: [
														{ kind: 'Field', name: { kind: 'Name', value: 'firstname' } },
														{ kind: 'Field', name: { kind: 'Name', value: 'lastname' } },
														{
															kind: 'Field',
															name: { kind: 'Name', value: 'structure' },
															selectionSet: {
																kind: 'SelectionSet',
																selections: [
																	{ kind: 'Field', name: { kind: 'Name', value: 'name' } },
																],
															},
														},
													],
												},
											},
										],
									},
								},
								{
									kind: 'Field',
									name: { kind: 'Name', value: 'targets' },
									arguments: [
										{
											kind: 'Argument',
											name: { kind: 'Name', value: 'where' },
											value: {
												kind: 'ObjectValue',
												fields: [
													{
														kind: 'ObjectField',
														name: { kind: 'Name', value: 'status' },
														value: {
															kind: 'ObjectValue',
															fields: [
																{
																	kind: 'ObjectField',
																	name: { kind: 'Name', value: '_eq' },
																	value: {
																		kind: 'StringValue',
																		value: 'in_progress',
																		block: false,
																	},
																},
															],
														},
													},
												],
											},
										},
										{
											kind: 'Argument',
											name: { kind: 'Name', value: 'order_by' },
											value: {
												kind: 'ObjectValue',
												fields: [
													{
														kind: 'ObjectField',
														name: { kind: 'Name', value: 'createdAt' },
														value: { kind: 'EnumValue', value: 'desc_nulls_first' },
													},
												],
											},
										},
									],
									selectionSet: {
										kind: 'SelectionSet',
										selections: [
											{ kind: 'Field', name: { kind: 'Name', value: 'target' } },
											{ kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
											{
												kind: 'Field',
												name: { kind: 'Name', value: 'creator' },
												selectionSet: {
													kind: 'SelectionSet',
													selections: [
														{
															kind: 'Field',
															name: { kind: 'Name', value: 'professional' },
															selectionSet: {
																kind: 'SelectionSet',
																selections: [
																	{ kind: 'Field', name: { kind: 'Name', value: 'firstname' } },
																	{ kind: 'Field', name: { kind: 'Name', value: 'lastname' } },
																	{
																		kind: 'Field',
																		name: { kind: 'Name', value: 'structure' },
																		selectionSet: {
																			kind: 'SelectionSet',
																			selections: [
																				{ kind: 'Field', name: { kind: 'Name', value: 'name' } },
																			],
																		},
																	},
																],
															},
														},
													],
												},
											},
											{
												kind: 'Field',
												name: { kind: 'Name', value: 'actions' },
												arguments: [
													{
														kind: 'Argument',
														name: { kind: 'Name', value: 'where' },
														value: {
															kind: 'ObjectValue',
															fields: [
																{
																	kind: 'ObjectField',
																	name: { kind: 'Name', value: 'status' },
																	value: {
																		kind: 'ObjectValue',
																		fields: [
																			{
																				kind: 'ObjectField',
																				name: { kind: 'Name', value: '_eq' },
																				value: {
																					kind: 'StringValue',
																					value: 'in_progress',
																					block: false,
																				},
																			},
																		],
																	},
																},
															],
														},
													},
													{
														kind: 'Argument',
														name: { kind: 'Name', value: 'order_by' },
														value: {
															kind: 'ObjectValue',
															fields: [
																{
																	kind: 'ObjectField',
																	name: { kind: 'Name', value: 'createdAt' },
																	value: { kind: 'EnumValue', value: 'desc_nulls_first' },
																},
															],
														},
													},
												],
												selectionSet: {
													kind: 'SelectionSet',
													selections: [
														{ kind: 'Field', name: { kind: 'Name', value: 'action' } },
														{ kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
														{ kind: 'Field', name: { kind: 'Name', value: 'status' } },
														{
															kind: 'Field',
															name: { kind: 'Name', value: 'creator' },
															selectionSet: {
																kind: 'SelectionSet',
																selections: [
																	{
																		kind: 'Field',
																		name: { kind: 'Name', value: 'professional' },
																		selectionSet: {
																			kind: 'SelectionSet',
																			selections: [
																				{
																					kind: 'Field',
																					name: { kind: 'Name', value: 'firstname' },
																				},
																				{
																					kind: 'Field',
																					name: { kind: 'Name', value: 'lastname' },
																				},
																				{
																					kind: 'Field',
																					name: { kind: 'Name', value: 'structure' },
																					selectionSet: {
																						kind: 'SelectionSet',
																						selections: [
																							{
																								kind: 'Field',
																								name: { kind: 'Name', value: 'name' },
																							},
																						],
																					},
																				},
																			],
																		},
																	},
																],
															},
														},
													],
												},
											},
										],
									},
								},
							],
						},
					},
				],
			},
		},
	],
} as unknown as DocumentNode<NotebookFragmentFragment, unknown>;
export const EventFieldsFragmentDoc = {
	kind: 'Document',
	definitions: [
		{
			kind: 'FragmentDefinition',
			name: { kind: 'Name', value: 'eventFields' },
			typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'notebook_event' } },
			selectionSet: {
				kind: 'SelectionSet',
				selections: [
					{ kind: 'Field', name: { kind: 'Name', value: 'id' } },
					{ kind: 'Field', name: { kind: 'Name', value: 'eventDate' } },
					{ kind: 'Field', name: { kind: 'Name', value: 'event' } },
					{ kind: 'Field', name: { kind: 'Name', value: 'eventType' } },
					{ kind: 'Field', name: { kind: 'Name', value: 'creatorId' } },
					{
						kind: 'Field',
						name: { kind: 'Name', value: 'creator' },
						selectionSet: {
							kind: 'SelectionSet',
							selections: [
								{
									kind: 'Field',
									name: { kind: 'Name', value: 'professional' },
									selectionSet: {
										kind: 'SelectionSet',
										selections: [
											{ kind: 'Field', name: { kind: 'Name', value: 'structureId' } },
											{
												kind: 'Field',
												name: { kind: 'Name', value: 'structure' },
												selectionSet: {
													kind: 'SelectionSet',
													selections: [{ kind: 'Field', name: { kind: 'Name', value: 'name' } }],
												},
											},
										],
									},
								},
							],
						},
					},
				],
			},
		},
	],
} as unknown as DocumentNode<EventFieldsFragment, unknown>;
export const AddNotebookMembersDocument = {
	kind: 'Document',
	definitions: [
		{
			kind: 'OperationDefinition',
			operation: 'mutation',
			name: { kind: 'Name', value: 'AddNotebookMembers' },
			variableDefinitions: [
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'objects' } },
					type: {
						kind: 'NonNullType',
						type: {
							kind: 'ListType',
							type: {
								kind: 'NonNullType',
								type: {
									kind: 'NamedType',
									name: { kind: 'Name', value: 'notebook_member_insert_input' },
								},
							},
						},
					},
				},
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'notebookId' } },
					type: {
						kind: 'NonNullType',
						type: { kind: 'NamedType', name: { kind: 'Name', value: 'uuid' } },
					},
				},
			],
			selectionSet: {
				kind: 'SelectionSet',
				selections: [
					{
						kind: 'Field',
						name: { kind: 'Name', value: 'insert_notebook_member' },
						arguments: [
							{
								kind: 'Argument',
								name: { kind: 'Name', value: 'objects' },
								value: { kind: 'Variable', name: { kind: 'Name', value: 'objects' } },
							},
						],
						selectionSet: {
							kind: 'SelectionSet',
							selections: [{ kind: 'Field', name: { kind: 'Name', value: 'affected_rows' } }],
						},
					},
					{
						kind: 'Field',
						name: { kind: 'Name', value: 'update_beneficiary_structure' },
						arguments: [
							{
								kind: 'Argument',
								name: { kind: 'Name', value: 'where' },
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
														name: { kind: 'Name', value: 'notebook' },
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
																					name: { kind: 'Name', value: 'notebookId' },
																				},
																			},
																		],
																	},
																},
															],
														},
													},
												],
											},
										},
									],
								},
							},
							{
								kind: 'Argument',
								name: { kind: 'Name', value: '_set' },
								value: {
									kind: 'ObjectValue',
									fields: [
										{
											kind: 'ObjectField',
											name: { kind: 'Name', value: 'status' },
											value: { kind: 'StringValue', value: 'done', block: false },
										},
									],
								},
							},
						],
						selectionSet: {
							kind: 'SelectionSet',
							selections: [{ kind: 'Field', name: { kind: 'Name', value: 'affected_rows' } }],
						},
					},
				],
			},
		},
	],
} as unknown as DocumentNode<AddNotebookMembersMutation, AddNotebookMembersMutationVariables>;
export const AddNotebookMemberBatchDocument = {
	kind: 'Document',
	definitions: [
		{
			kind: 'OperationDefinition',
			operation: 'mutation',
			name: { kind: 'Name', value: 'AddNotebookMemberBatch' },
			variableDefinitions: [
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'member' } },
					type: {
						kind: 'NonNullType',
						type: {
							kind: 'NamedType',
							name: { kind: 'Name', value: 'notebook_member_insert_input' },
						},
					},
				},
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'structure' } },
					type: {
						kind: 'NonNullType',
						type: {
							kind: 'NamedType',
							name: { kind: 'Name', value: 'beneficiary_structure_bool_exp' },
						},
					},
				},
			],
			selectionSet: {
				kind: 'SelectionSet',
				selections: [
					{
						kind: 'Field',
						name: { kind: 'Name', value: 'insert_notebook_member' },
						arguments: [
							{
								kind: 'Argument',
								name: { kind: 'Name', value: 'objects' },
								value: {
									kind: 'ListValue',
									values: [{ kind: 'Variable', name: { kind: 'Name', value: 'member' } }],
								},
							},
						],
						selectionSet: {
							kind: 'SelectionSet',
							selections: [{ kind: 'Field', name: { kind: 'Name', value: 'affected_rows' } }],
						},
					},
					{
						kind: 'Field',
						name: { kind: 'Name', value: 'update_beneficiary_structure' },
						arguments: [
							{
								kind: 'Argument',
								name: { kind: 'Name', value: 'where' },
								value: { kind: 'Variable', name: { kind: 'Name', value: 'structure' } },
							},
							{
								kind: 'Argument',
								name: { kind: 'Name', value: '_set' },
								value: {
									kind: 'ObjectValue',
									fields: [
										{
											kind: 'ObjectField',
											name: { kind: 'Name', value: 'status' },
											value: { kind: 'StringValue', value: 'done', block: false },
										},
									],
								},
							},
						],
						selectionSet: {
							kind: 'SelectionSet',
							selections: [{ kind: 'Field', name: { kind: 'Name', value: 'affected_rows' } }],
						},
					},
				],
			},
		},
	],
} as unknown as DocumentNode<
	AddNotebookMemberBatchMutation,
	AddNotebookMemberBatchMutationVariables
>;
export const GetNotebookForBeneficiaryDocument = {
	kind: 'Document',
	definitions: [
		{
			kind: 'OperationDefinition',
			operation: 'query',
			name: { kind: 'Name', value: 'GetNotebookForBeneficiary' },
			variableDefinitions: [
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'array' } },
					type: {
						kind: 'ListType',
						type: {
							kind: 'NonNullType',
							type: { kind: 'NamedType', name: { kind: 'Name', value: 'notebook_bool_exp' } },
						},
					},
				},
			],
			selectionSet: {
				kind: 'SelectionSet',
				selections: [
					{
						kind: 'Field',
						name: { kind: 'Name', value: 'notebook' },
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
											value: { kind: 'Variable', name: { kind: 'Name', value: 'array' } },
										},
									],
								},
							},
						],
						selectionSet: {
							kind: 'SelectionSet',
							selections: [
								{ kind: 'Field', name: { kind: 'Name', value: 'id' } },
								{ kind: 'Field', name: { kind: 'Name', value: 'beneficiaryId' } },
								{
									kind: 'Field',
									name: { kind: 'Name', value: 'beneficiary' },
									selectionSet: {
										kind: 'SelectionSet',
										selections: [
											{ kind: 'Field', name: { kind: 'Name', value: 'firstname' } },
											{ kind: 'Field', name: { kind: 'Name', value: 'lastname' } },
											{ kind: 'Field', name: { kind: 'Name', value: 'dateOfBirth' } },
										],
									},
								},
							],
						},
					},
				],
			},
		},
	],
} as unknown as DocumentNode<
	GetNotebookForBeneficiaryQuery,
	GetNotebookForBeneficiaryQueryVariables
>;
export const RemoveNotebookMembersDocument = {
	kind: 'Document',
	definitions: [
		{
			kind: 'OperationDefinition',
			operation: 'mutation',
			name: { kind: 'Name', value: 'RemoveNotebookMembers' },
			variableDefinitions: [
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'remove' } },
					type: {
						kind: 'NonNullType',
						type: { kind: 'NamedType', name: { kind: 'Name', value: 'notebook_member_bool_exp' } },
					},
				},
			],
			selectionSet: {
				kind: 'SelectionSet',
				selections: [
					{
						kind: 'Field',
						name: { kind: 'Name', value: 'delete_notebook_member' },
						arguments: [
							{
								kind: 'Argument',
								name: { kind: 'Name', value: 'where' },
								value: { kind: 'Variable', name: { kind: 'Name', value: 'remove' } },
							},
						],
						selectionSet: {
							kind: 'SelectionSet',
							selections: [{ kind: 'Field', name: { kind: 'Name', value: 'affected_rows' } }],
						},
					},
				],
			},
		},
	],
} as unknown as DocumentNode<RemoveNotebookMembersMutation, RemoveNotebookMembersMutationVariables>;
export const GetProfessionalsFromStructuresDocument = {
	kind: 'Document',
	definitions: [
		{
			kind: 'OperationDefinition',
			operation: 'query',
			name: { kind: 'Name', value: 'GetProfessionalsFromStructures' },
			variableDefinitions: [
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
					type: {
						kind: 'NonNullType',
						type: { kind: 'NamedType', name: { kind: 'Name', value: 'uuid' } },
					},
				},
			],
			selectionSet: {
				kind: 'SelectionSet',
				selections: [
					{
						kind: 'Field',
						name: { kind: 'Name', value: 'professional' },
						arguments: [
							{
								kind: 'Argument',
								name: { kind: 'Name', value: 'where' },
								value: {
									kind: 'ObjectValue',
									fields: [
										{
											kind: 'ObjectField',
											name: { kind: 'Name', value: 'structureId' },
											value: {
												kind: 'ObjectValue',
												fields: [
													{
														kind: 'ObjectField',
														name: { kind: 'Name', value: '_eq' },
														value: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
													},
												],
											},
										},
									],
								},
							},
						],
						selectionSet: {
							kind: 'SelectionSet',
							selections: [
								{
									kind: 'Field',
									name: { kind: 'Name', value: 'account' },
									selectionSet: {
										kind: 'SelectionSet',
										selections: [{ kind: 'Field', name: { kind: 'Name', value: 'id' } }],
									},
								},
								{ kind: 'Field', name: { kind: 'Name', value: 'id' } },
								{ kind: 'Field', name: { kind: 'Name', value: 'firstname' } },
								{ kind: 'Field', name: { kind: 'Name', value: 'lastname' } },
								{ kind: 'Field', name: { kind: 'Name', value: 'mobileNumber' } },
								{ kind: 'Field', name: { kind: 'Name', value: 'position' } },
								{ kind: 'Field', name: { kind: 'Name', value: 'email' } },
								{ kind: 'Field', name: { kind: 'Name', value: 'structureId' } },
								{
									kind: 'Field',
									name: { kind: 'Name', value: 'structure' },
									selectionSet: {
										kind: 'SelectionSet',
										selections: [
											{ kind: 'Field', name: { kind: 'Name', value: 'id' } },
											{ kind: 'Field', name: { kind: 'Name', value: 'name' } },
										],
									},
								},
							],
						},
					},
				],
			},
		},
	],
} as unknown as DocumentNode<
	GetProfessionalsFromStructuresQuery,
	GetProfessionalsFromStructuresQueryVariables
>;
export const GetStructuresWithProDocument = {
	kind: 'Document',
	definitions: [
		{
			kind: 'OperationDefinition',
			operation: 'query',
			name: { kind: 'Name', value: 'GetStructuresWithPro' },
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
								{ kind: 'Field', name: { kind: 'Name', value: 'name' } },
								{
									kind: 'Field',
									name: { kind: 'Name', value: 'professionals' },
									selectionSet: {
										kind: 'SelectionSet',
										selections: [
											{
												kind: 'Field',
												name: { kind: 'Name', value: 'account' },
												selectionSet: {
													kind: 'SelectionSet',
													selections: [{ kind: 'Field', name: { kind: 'Name', value: 'id' } }],
												},
											},
											{ kind: 'Field', name: { kind: 'Name', value: 'id' } },
											{ kind: 'Field', name: { kind: 'Name', value: 'firstname' } },
											{ kind: 'Field', name: { kind: 'Name', value: 'lastname' } },
											{ kind: 'Field', name: { kind: 'Name', value: 'mobileNumber' } },
											{ kind: 'Field', name: { kind: 'Name', value: 'position' } },
											{ kind: 'Field', name: { kind: 'Name', value: 'email' } },
											{ kind: 'Field', name: { kind: 'Name', value: 'structureId' } },
											{
												kind: 'Field',
												name: { kind: 'Name', value: 'structure' },
												selectionSet: {
													kind: 'SelectionSet',
													selections: [
														{ kind: 'Field', name: { kind: 'Name', value: 'id' } },
														{ kind: 'Field', name: { kind: 'Name', value: 'name' } },
													],
												},
											},
										],
									},
								},
							],
						},
					},
				],
			},
		},
	],
} as unknown as DocumentNode<GetStructuresWithProQuery, GetStructuresWithProQueryVariables>;
export const UpdateReferentDocument = {
	kind: 'Document',
	definitions: [
		{
			kind: 'OperationDefinition',
			operation: 'mutation',
			name: { kind: 'Name', value: 'UpdateReferent' },
			variableDefinitions: [
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'objects' } },
					type: {
						kind: 'NonNullType',
						type: {
							kind: 'ListType',
							type: {
								kind: 'NonNullType',
								type: {
									kind: 'NamedType',
									name: { kind: 'Name', value: 'notebook_member_insert_input' },
								},
							},
						},
					},
				},
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'beneficiaries' } },
					type: {
						kind: 'NonNullType',
						type: {
							kind: 'ListType',
							type: {
								kind: 'NonNullType',
								type: { kind: 'NamedType', name: { kind: 'Name', value: 'uuid' } },
							},
						},
					},
				},
			],
			selectionSet: {
				kind: 'SelectionSet',
				selections: [
					{
						kind: 'Field',
						name: { kind: 'Name', value: 'update_beneficiary_structure' },
						arguments: [
							{
								kind: 'Argument',
								name: { kind: 'Name', value: 'where' },
								value: {
									kind: 'ObjectValue',
									fields: [
										{
											kind: 'ObjectField',
											name: { kind: 'Name', value: 'beneficiaryId' },
											value: {
												kind: 'ObjectValue',
												fields: [
													{
														kind: 'ObjectField',
														name: { kind: 'Name', value: '_in' },
														value: {
															kind: 'Variable',
															name: { kind: 'Name', value: 'beneficiaries' },
														},
													},
												],
											},
										},
									],
								},
							},
							{
								kind: 'Argument',
								name: { kind: 'Name', value: '_set' },
								value: {
									kind: 'ObjectValue',
									fields: [
										{
											kind: 'ObjectField',
											name: { kind: 'Name', value: 'status' },
											value: { kind: 'StringValue', value: 'done', block: false },
										},
									],
								},
							},
						],
						selectionSet: {
							kind: 'SelectionSet',
							selections: [{ kind: 'Field', name: { kind: 'Name', value: 'affected_rows' } }],
						},
					},
					{
						kind: 'Field',
						name: { kind: 'Name', value: 'update_notebook_member' },
						arguments: [
							{
								kind: 'Argument',
								name: { kind: 'Name', value: '_set' },
								value: {
									kind: 'ObjectValue',
									fields: [
										{
											kind: 'ObjectField',
											name: { kind: 'Name', value: 'memberType' },
											value: { kind: 'StringValue', value: 'no_referent', block: false },
										},
									],
								},
							},
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
														name: { kind: 'Name', value: 'beneficiaryId' },
														value: {
															kind: 'ObjectValue',
															fields: [
																{
																	kind: 'ObjectField',
																	name: { kind: 'Name', value: '_in' },
																	value: {
																		kind: 'Variable',
																		name: { kind: 'Name', value: 'beneficiaries' },
																	},
																},
															],
														},
													},
												],
											},
										},
									],
								},
							},
						],
						selectionSet: {
							kind: 'SelectionSet',
							selections: [{ kind: 'Field', name: { kind: 'Name', value: 'affected_rows' } }],
						},
					},
					{
						kind: 'Field',
						name: { kind: 'Name', value: 'insert_notebook_member' },
						arguments: [
							{
								kind: 'Argument',
								name: { kind: 'Name', value: 'objects' },
								value: { kind: 'Variable', name: { kind: 'Name', value: 'objects' } },
							},
							{
								kind: 'Argument',
								name: { kind: 'Name', value: 'on_conflict' },
								value: {
									kind: 'ObjectValue',
									fields: [
										{
											kind: 'ObjectField',
											name: { kind: 'Name', value: 'constraint' },
											value: {
												kind: 'EnumValue',
												value: 'notebook_member_notebook_id_account_id_key',
											},
										},
										{
											kind: 'ObjectField',
											name: { kind: 'Name', value: 'update_columns' },
											value: {
												kind: 'ListValue',
												values: [
													{ kind: 'EnumValue', value: 'memberType' },
													{ kind: 'EnumValue', value: 'active' },
												],
											},
										},
									],
								},
							},
						],
						selectionSet: {
							kind: 'SelectionSet',
							selections: [{ kind: 'Field', name: { kind: 'Name', value: 'affected_rows' } }],
						},
					},
				],
			},
		},
	],
} as unknown as DocumentNode<UpdateReferentMutation, UpdateReferentMutationVariables>;
export const UpdateReferentWithStructureDocument = {
	kind: 'Document',
	definitions: [
		{
			kind: 'OperationDefinition',
			operation: 'mutation',
			name: { kind: 'Name', value: 'UpdateReferentWithStructure' },
			variableDefinitions: [
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'objects' } },
					type: {
						kind: 'NonNullType',
						type: {
							kind: 'ListType',
							type: {
								kind: 'NonNullType',
								type: {
									kind: 'NamedType',
									name: { kind: 'Name', value: 'notebook_member_insert_input' },
								},
							},
						},
					},
				},
				{
					kind: 'VariableDefinition',
					variable: {
						kind: 'Variable',
						name: { kind: 'Name', value: 'beneficiaryStructureObjects' },
					},
					type: {
						kind: 'NonNullType',
						type: {
							kind: 'ListType',
							type: {
								kind: 'NonNullType',
								type: {
									kind: 'NamedType',
									name: { kind: 'Name', value: 'beneficiary_structure_insert_input' },
								},
							},
						},
					},
				},
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'beneficiaries' } },
					type: {
						kind: 'NonNullType',
						type: {
							kind: 'ListType',
							type: {
								kind: 'NonNullType',
								type: { kind: 'NamedType', name: { kind: 'Name', value: 'uuid' } },
							},
						},
					},
				},
			],
			selectionSet: {
				kind: 'SelectionSet',
				selections: [
					{
						kind: 'Field',
						name: { kind: 'Name', value: 'delete_beneficiary_structure' },
						arguments: [
							{
								kind: 'Argument',
								name: { kind: 'Name', value: 'where' },
								value: {
									kind: 'ObjectValue',
									fields: [
										{
											kind: 'ObjectField',
											name: { kind: 'Name', value: 'beneficiaryId' },
											value: {
												kind: 'ObjectValue',
												fields: [
													{
														kind: 'ObjectField',
														name: { kind: 'Name', value: '_in' },
														value: {
															kind: 'Variable',
															name: { kind: 'Name', value: 'beneficiaries' },
														},
													},
												],
											},
										},
									],
								},
							},
						],
						selectionSet: {
							kind: 'SelectionSet',
							selections: [{ kind: 'Field', name: { kind: 'Name', value: 'affected_rows' } }],
						},
					},
					{
						kind: 'Field',
						name: { kind: 'Name', value: 'insert_beneficiary_structure' },
						arguments: [
							{
								kind: 'Argument',
								name: { kind: 'Name', value: 'objects' },
								value: {
									kind: 'Variable',
									name: { kind: 'Name', value: 'beneficiaryStructureObjects' },
								},
							},
						],
						selectionSet: {
							kind: 'SelectionSet',
							selections: [{ kind: 'Field', name: { kind: 'Name', value: 'affected_rows' } }],
						},
					},
					{
						kind: 'Field',
						name: { kind: 'Name', value: 'update_notebook_member' },
						arguments: [
							{
								kind: 'Argument',
								name: { kind: 'Name', value: '_set' },
								value: {
									kind: 'ObjectValue',
									fields: [
										{
											kind: 'ObjectField',
											name: { kind: 'Name', value: 'memberType' },
											value: { kind: 'StringValue', value: 'no_referent', block: false },
										},
									],
								},
							},
							{
								kind: 'Argument',
								name: { kind: 'Name', value: 'where' },
								value: {
									kind: 'ObjectValue',
									fields: [
										{
											kind: 'ObjectField',
											name: { kind: 'Name', value: 'memberType' },
											value: {
												kind: 'ObjectValue',
												fields: [
													{
														kind: 'ObjectField',
														name: { kind: 'Name', value: '_eq' },
														value: { kind: 'StringValue', value: 'referent', block: false },
													},
												],
											},
										},
										{
											kind: 'ObjectField',
											name: { kind: 'Name', value: 'notebook' },
											value: {
												kind: 'ObjectValue',
												fields: [
													{
														kind: 'ObjectField',
														name: { kind: 'Name', value: 'beneficiaryId' },
														value: {
															kind: 'ObjectValue',
															fields: [
																{
																	kind: 'ObjectField',
																	name: { kind: 'Name', value: '_in' },
																	value: {
																		kind: 'Variable',
																		name: { kind: 'Name', value: 'beneficiaries' },
																	},
																},
															],
														},
													},
												],
											},
										},
									],
								},
							},
						],
						selectionSet: {
							kind: 'SelectionSet',
							selections: [{ kind: 'Field', name: { kind: 'Name', value: 'affected_rows' } }],
						},
					},
					{
						kind: 'Field',
						name: { kind: 'Name', value: 'insert_notebook_member' },
						arguments: [
							{
								kind: 'Argument',
								name: { kind: 'Name', value: 'objects' },
								value: { kind: 'Variable', name: { kind: 'Name', value: 'objects' } },
							},
							{
								kind: 'Argument',
								name: { kind: 'Name', value: 'on_conflict' },
								value: {
									kind: 'ObjectValue',
									fields: [
										{
											kind: 'ObjectField',
											name: { kind: 'Name', value: 'constraint' },
											value: {
												kind: 'EnumValue',
												value: 'notebook_member_notebook_id_account_id_key',
											},
										},
										{
											kind: 'ObjectField',
											name: { kind: 'Name', value: 'update_columns' },
											value: {
												kind: 'ListValue',
												values: [
													{ kind: 'EnumValue', value: 'memberType' },
													{ kind: 'EnumValue', value: 'active' },
												],
											},
										},
									],
								},
							},
						],
						selectionSet: {
							kind: 'SelectionSet',
							selections: [{ kind: 'Field', name: { kind: 'Name', value: 'affected_rows' } }],
						},
					},
				],
			},
		},
	],
} as unknown as DocumentNode<
	UpdateReferentWithStructureMutation,
	UpdateReferentWithStructureMutationVariables
>;
export const RemoveReferentDocument = {
	kind: 'Document',
	definitions: [
		{
			kind: 'OperationDefinition',
			operation: 'mutation',
			name: { kind: 'Name', value: 'RemoveReferent' },
			variableDefinitions: [
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'notebooks' } },
					type: {
						kind: 'NonNullType',
						type: {
							kind: 'ListType',
							type: {
								kind: 'NonNullType',
								type: { kind: 'NamedType', name: { kind: 'Name', value: 'uuid' } },
							},
						},
					},
				},
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
								name: { kind: 'Name', value: '_set' },
								value: {
									kind: 'ObjectValue',
									fields: [
										{
											kind: 'ObjectField',
											name: { kind: 'Name', value: 'memberType' },
											value: { kind: 'StringValue', value: 'no_referent', block: false },
										},
										{
											kind: 'ObjectField',
											name: { kind: 'Name', value: 'active' },
											value: { kind: 'BooleanValue', value: false },
										},
									],
								},
							},
							{
								kind: 'Argument',
								name: { kind: 'Name', value: 'where' },
								value: {
									kind: 'ObjectValue',
									fields: [
										{
											kind: 'ObjectField',
											name: { kind: 'Name', value: 'notebookId' },
											value: {
												kind: 'ObjectValue',
												fields: [
													{
														kind: 'ObjectField',
														name: { kind: 'Name', value: '_in' },
														value: { kind: 'Variable', name: { kind: 'Name', value: 'notebooks' } },
													},
												],
											},
										},
										{
											kind: 'ObjectField',
											name: { kind: 'Name', value: 'memberType' },
											value: {
												kind: 'ObjectValue',
												fields: [
													{
														kind: 'ObjectField',
														name: { kind: 'Name', value: '_eq' },
														value: { kind: 'StringValue', value: 'referent', block: false },
													},
												],
											},
										},
									],
								},
							},
						],
						selectionSet: {
							kind: 'SelectionSet',
							selections: [{ kind: 'Field', name: { kind: 'Name', value: 'affected_rows' } }],
						},
					},
				],
			},
		},
	],
} as unknown as DocumentNode<RemoveReferentMutation, RemoveReferentMutationVariables>;
export const CreateDeploymentDocument = {
	kind: 'Document',
	definitions: [
		{
			kind: 'OperationDefinition',
			operation: 'mutation',
			name: { kind: 'Name', value: 'CreateDeployment' },
			variableDefinitions: [
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'email' } },
					type: {
						kind: 'NonNullType',
						type: { kind: 'NamedType', name: { kind: 'Name', value: 'citext' } },
					},
				},
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'deployment' } },
					type: {
						kind: 'NonNullType',
						type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
					},
				},
			],
			selectionSet: {
				kind: 'SelectionSet',
				selections: [
					{
						kind: 'Field',
						name: { kind: 'Name', value: 'createDeploymentWithEmail' },
						arguments: [
							{
								kind: 'Argument',
								name: { kind: 'Name', value: 'email' },
								value: { kind: 'Variable', name: { kind: 'Name', value: 'email' } },
							},
							{
								kind: 'Argument',
								name: { kind: 'Name', value: 'deployment' },
								value: { kind: 'Variable', name: { kind: 'Name', value: 'deployment' } },
							},
						],
						selectionSet: {
							kind: 'SelectionSet',
							selections: [
								{ kind: 'Field', name: { kind: 'Name', value: 'id' } },
								{ kind: 'Field', name: { kind: 'Name', value: 'label' } },
							],
						},
					},
				],
			},
		},
	],
} as unknown as DocumentNode<CreateDeploymentMutation, CreateDeploymentMutationVariables>;
export const GetDeploymentByIdDocument = {
	kind: 'Document',
	definitions: [
		{
			kind: 'OperationDefinition',
			operation: 'query',
			name: { kind: 'Name', value: 'GetDeploymentById' },
			variableDefinitions: [
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
					type: {
						kind: 'NonNullType',
						type: { kind: 'NamedType', name: { kind: 'Name', value: 'uuid' } },
					},
				},
			],
			selectionSet: {
				kind: 'SelectionSet',
				selections: [
					{
						kind: 'Field',
						alias: { kind: 'Name', value: 'deployment' },
						name: { kind: 'Name', value: 'deployment_by_pk' },
						arguments: [
							{
								kind: 'Argument',
								name: { kind: 'Name', value: 'id' },
								value: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
							},
						],
						selectionSet: {
							kind: 'SelectionSet',
							selections: [
								{ kind: 'Field', name: { kind: 'Name', value: 'id' } },
								{ kind: 'Field', name: { kind: 'Name', value: 'label' } },
								{ kind: 'Field', name: { kind: 'Name', value: 'config' } },
								{
									kind: 'Field',
									name: { kind: 'Name', value: 'managers' },
									selectionSet: {
										kind: 'SelectionSet',
										selections: [
											{ kind: 'Field', name: { kind: 'Name', value: 'id' } },
											{ kind: 'Field', name: { kind: 'Name', value: 'firstname' } },
											{ kind: 'Field', name: { kind: 'Name', value: 'lastname' } },
										],
									},
								},
								{
									kind: 'Field',
									name: { kind: 'Name', value: 'beneficiaries_aggregate' },
									selectionSet: {
										kind: 'SelectionSet',
										selections: [
											{
												kind: 'Field',
												name: { kind: 'Name', value: 'aggregate' },
												selectionSet: {
													kind: 'SelectionSet',
													selections: [{ kind: 'Field', name: { kind: 'Name', value: 'count' } }],
												},
											},
										],
									},
								},
								{
									kind: 'Field',
									name: { kind: 'Name', value: 'structures_aggregate' },
									selectionSet: {
										kind: 'SelectionSet',
										selections: [
											{
												kind: 'Field',
												name: { kind: 'Name', value: 'aggregate' },
												selectionSet: {
													kind: 'SelectionSet',
													selections: [{ kind: 'Field', name: { kind: 'Name', value: 'count' } }],
												},
											},
										],
									},
								},
							],
						},
					},
					{
						kind: 'Field',
						name: { kind: 'Name', value: 'professional_aggregate' },
						arguments: [
							{
								kind: 'Argument',
								name: { kind: 'Name', value: 'where' },
								value: {
									kind: 'ObjectValue',
									fields: [
										{
											kind: 'ObjectField',
											name: { kind: 'Name', value: 'structure' },
											value: {
												kind: 'ObjectValue',
												fields: [
													{
														kind: 'ObjectField',
														name: { kind: 'Name', value: 'deploymentId' },
														value: {
															kind: 'ObjectValue',
															fields: [
																{
																	kind: 'ObjectField',
																	name: { kind: 'Name', value: '_eq' },
																	value: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
																},
															],
														},
													},
												],
											},
										},
									],
								},
							},
						],
						selectionSet: {
							kind: 'SelectionSet',
							selections: [
								{
									kind: 'Field',
									name: { kind: 'Name', value: 'aggregate' },
									selectionSet: {
										kind: 'SelectionSet',
										selections: [{ kind: 'Field', name: { kind: 'Name', value: 'count' } }],
									},
								},
							],
						},
					},
				],
			},
		},
	],
} as unknown as DocumentNode<GetDeploymentByIdQuery, GetDeploymentByIdQueryVariables>;
export const GetDeploymentsDocument = {
	kind: 'Document',
	definitions: [
		{
			kind: 'OperationDefinition',
			operation: 'query',
			name: { kind: 'Name', value: 'GetDeployments' },
			selectionSet: {
				kind: 'SelectionSet',
				selections: [
					{
						kind: 'Field',
						alias: { kind: 'Name', value: 'deployments' },
						name: { kind: 'Name', value: 'deployment' },
						arguments: [
							{
								kind: 'Argument',
								name: { kind: 'Name', value: 'order_by' },
								value: {
									kind: 'ObjectValue',
									fields: [
										{
											kind: 'ObjectField',
											name: { kind: 'Name', value: 'createdAt' },
											value: { kind: 'EnumValue', value: 'desc' },
										},
									],
								},
							},
						],
						selectionSet: {
							kind: 'SelectionSet',
							selections: [
								{ kind: 'Field', name: { kind: 'Name', value: 'id' } },
								{ kind: 'Field', name: { kind: 'Name', value: 'label' } },
								{
									kind: 'Field',
									name: { kind: 'Name', value: 'managers' },
									selectionSet: {
										kind: 'SelectionSet',
										selections: [
											{ kind: 'Field', name: { kind: 'Name', value: 'id' } },
											{ kind: 'Field', name: { kind: 'Name', value: 'firstname' } },
											{ kind: 'Field', name: { kind: 'Name', value: 'lastname' } },
											{ kind: 'Field', name: { kind: 'Name', value: 'email' } },
										],
									},
								},
							],
						},
					},
				],
			},
		},
	],
} as unknown as DocumentNode<GetDeploymentsQuery, GetDeploymentsQueryVariables>;
export const GetDeploymentNotebooksDocument = {
	kind: 'Document',
	definitions: [
		{
			kind: 'OperationDefinition',
			operation: 'query',
			name: { kind: 'Name', value: 'GetDeploymentNotebooks' },
			variableDefinitions: [
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'deploymentId' } },
					type: {
						kind: 'NonNullType',
						type: { kind: 'NamedType', name: { kind: 'Name', value: 'uuid' } },
					},
				},
			],
			selectionSet: {
				kind: 'SelectionSet',
				selections: [
					{
						kind: 'Field',
						alias: { kind: 'Name', value: 'deployment' },
						name: { kind: 'Name', value: 'deployment_by_pk' },
						arguments: [
							{
								kind: 'Argument',
								name: { kind: 'Name', value: 'id' },
								value: { kind: 'Variable', name: { kind: 'Name', value: 'deploymentId' } },
							},
						],
						selectionSet: {
							kind: 'SelectionSet',
							selections: [
								{ kind: 'Field', name: { kind: 'Name', value: 'label' } },
								{ kind: 'Field', name: { kind: 'Name', value: 'id' } },
							],
						},
					},
					{
						kind: 'Field',
						alias: { kind: 'Name', value: 'notebooks' },
						name: { kind: 'Name', value: 'notebook' },
						arguments: [
							{
								kind: 'Argument',
								name: { kind: 'Name', value: 'where' },
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
														name: { kind: 'Name', value: 'deploymentId' },
														value: {
															kind: 'ObjectValue',
															fields: [
																{
																	kind: 'ObjectField',
																	name: { kind: 'Name', value: '_eq' },
																	value: {
																		kind: 'Variable',
																		name: { kind: 'Name', value: 'deploymentId' },
																	},
																},
															],
														},
													},
												],
											},
										},
									],
								},
							},
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
											{ kind: 'Field', name: { kind: 'Name', value: 'firstname' } },
											{ kind: 'Field', name: { kind: 'Name', value: 'lastname' } },
										],
									},
								},
							],
						},
					},
				],
			},
		},
	],
} as unknown as DocumentNode<GetDeploymentNotebooksQuery, GetDeploymentNotebooksQueryVariables>;
export const UpdateNotebookActionDocument = {
	kind: 'Document',
	definitions: [
		{
			kind: 'OperationDefinition',
			operation: 'mutation',
			name: { kind: 'Name', value: 'UpdateNotebookAction' },
			variableDefinitions: [
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
					type: {
						kind: 'NonNullType',
						type: { kind: 'NamedType', name: { kind: 'Name', value: 'uuid' } },
					},
				},
			],
			selectionSet: {
				kind: 'SelectionSet',
				selections: [
					{
						kind: 'Field',
						name: { kind: 'Name', value: 'updateNotebookAct' },
						arguments: [
							{
								kind: 'Argument',
								name: { kind: 'Name', value: 'id' },
								value: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
							},
						],
						selectionSet: {
							kind: 'SelectionSet',
							selections: [{ kind: 'Field', name: { kind: 'Name', value: 'id' } }],
						},
					},
				],
			},
		},
	],
} as unknown as DocumentNode<UpdateNotebookActionMutation, UpdateNotebookActionMutationVariables>;
export const DeactivateNotebookMemberDocument = {
	kind: 'Document',
	definitions: [
		{
			kind: 'OperationDefinition',
			operation: 'mutation',
			name: { kind: 'Name', value: 'DeactivateNotebookMember' },
			variableDefinitions: [
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'member' } },
					type: {
						kind: 'NonNullType',
						type: { kind: 'NamedType', name: { kind: 'Name', value: 'notebook_member_bool_exp' } },
					},
				},
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
								value: { kind: 'Variable', name: { kind: 'Name', value: 'member' } },
							},
							{
								kind: 'Argument',
								name: { kind: 'Name', value: '_set' },
								value: {
									kind: 'ObjectValue',
									fields: [
										{
											kind: 'ObjectField',
											name: { kind: 'Name', value: 'active' },
											value: { kind: 'BooleanValue', value: false },
										},
									],
								},
							},
						],
						selectionSet: {
							kind: 'SelectionSet',
							selections: [{ kind: 'Field', name: { kind: 'Name', value: 'affected_rows' } }],
						},
					},
				],
			},
		},
	],
} as unknown as DocumentNode<
	DeactivateNotebookMemberMutation,
	DeactivateNotebookMemberMutationVariables
>;
export const AddNotebookMemberWithBeneficiaryStructureUpdateDocument = {
	kind: 'Document',
	definitions: [
		{
			kind: 'OperationDefinition',
			operation: 'mutation',
			name: { kind: 'Name', value: 'AddNotebookMemberWithBeneficiaryStructureUpdate' },
			variableDefinitions: [
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'member' } },
					type: {
						kind: 'NonNullType',
						type: {
							kind: 'NamedType',
							name: { kind: 'Name', value: 'notebook_member_insert_input' },
						},
					},
				},
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'structure' } },
					type: {
						kind: 'NonNullType',
						type: {
							kind: 'NamedType',
							name: { kind: 'Name', value: 'beneficiary_structure_bool_exp' },
						},
					},
				},
			],
			selectionSet: {
				kind: 'SelectionSet',
				selections: [
					{
						kind: 'Field',
						name: { kind: 'Name', value: 'insert_notebook_member_one' },
						arguments: [
							{
								kind: 'Argument',
								name: { kind: 'Name', value: 'object' },
								value: { kind: 'Variable', name: { kind: 'Name', value: 'member' } },
							},
							{
								kind: 'Argument',
								name: { kind: 'Name', value: 'on_conflict' },
								value: {
									kind: 'ObjectValue',
									fields: [
										{
											kind: 'ObjectField',
											name: { kind: 'Name', value: 'constraint' },
											value: {
												kind: 'EnumValue',
												value: 'notebook_member_notebook_id_account_id_key',
											},
										},
										{
											kind: 'ObjectField',
											name: { kind: 'Name', value: 'update_columns' },
											value: { kind: 'EnumValue', value: 'active' },
										},
									],
								},
							},
						],
						selectionSet: {
							kind: 'SelectionSet',
							selections: [
								{
									kind: 'Field',
									name: { kind: 'Name', value: 'notebook' },
									selectionSet: {
										kind: 'SelectionSet',
										selections: [{ kind: 'Field', name: { kind: 'Name', value: 'beneficiaryId' } }],
									},
								},
							],
						},
					},
					{
						kind: 'Field',
						name: { kind: 'Name', value: 'update_beneficiary_structure' },
						arguments: [
							{
								kind: 'Argument',
								name: { kind: 'Name', value: 'where' },
								value: { kind: 'Variable', name: { kind: 'Name', value: 'structure' } },
							},
							{
								kind: 'Argument',
								name: { kind: 'Name', value: '_set' },
								value: {
									kind: 'ObjectValue',
									fields: [
										{
											kind: 'ObjectField',
											name: { kind: 'Name', value: 'status' },
											value: { kind: 'StringValue', value: 'done', block: false },
										},
									],
								},
							},
						],
						selectionSet: {
							kind: 'SelectionSet',
							selections: [{ kind: 'Field', name: { kind: 'Name', value: 'affected_rows' } }],
						},
					},
				],
			},
		},
	],
} as unknown as DocumentNode<
	AddNotebookMemberWithBeneficiaryStructureUpdateMutation,
	AddNotebookMemberWithBeneficiaryStructureUpdateMutationVariables
>;
export const AttachBeneficiaryToStructureDocument = {
	kind: 'Document',
	definitions: [
		{
			kind: 'OperationDefinition',
			operation: 'mutation',
			name: { kind: 'Name', value: 'AttachBeneficiaryToStructure' },
			variableDefinitions: [
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'beneficiaryId' } },
					type: {
						kind: 'NonNullType',
						type: { kind: 'NamedType', name: { kind: 'Name', value: 'uuid' } },
					},
				},
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'structureId' } },
					type: {
						kind: 'NonNullType',
						type: { kind: 'NamedType', name: { kind: 'Name', value: 'uuid' } },
					},
				},
			],
			selectionSet: {
				kind: 'SelectionSet',
				selections: [
					{
						kind: 'Field',
						name: { kind: 'Name', value: 'insert_beneficiary_structure_one' },
						arguments: [
							{
								kind: 'Argument',
								name: { kind: 'Name', value: 'object' },
								value: {
									kind: 'ObjectValue',
									fields: [
										{
											kind: 'ObjectField',
											name: { kind: 'Name', value: 'beneficiaryId' },
											value: { kind: 'Variable', name: { kind: 'Name', value: 'beneficiaryId' } },
										},
										{
											kind: 'ObjectField',
											name: { kind: 'Name', value: 'structureId' },
											value: { kind: 'Variable', name: { kind: 'Name', value: 'structureId' } },
										},
									],
								},
							},
						],
						selectionSet: {
							kind: 'SelectionSet',
							selections: [{ kind: 'Field', name: { kind: 'Name', value: 'id' } }],
						},
					},
				],
			},
		},
	],
} as unknown as DocumentNode<
	AttachBeneficiaryToStructureMutation,
	AttachBeneficiaryToStructureMutationVariables
>;
export const ImportBeneficiaryDocument = {
	kind: 'Document',
	definitions: [
		{
			kind: 'OperationDefinition',
			operation: 'mutation',
			name: { kind: 'Name', value: 'ImportBeneficiary' },
			variableDefinitions: [
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'firstname' } },
					type: {
						kind: 'NonNullType',
						type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
					},
				},
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'lastname' } },
					type: {
						kind: 'NonNullType',
						type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
					},
				},
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'dateOfBirth' } },
					type: {
						kind: 'NonNullType',
						type: { kind: 'NamedType', name: { kind: 'Name', value: 'date' } },
					},
				},
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'placeOfBirth' } },
					type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
				},
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'mobileNumber' } },
					type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
				},
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'email' } },
					type: { kind: 'NamedType', name: { kind: 'Name', value: 'citext' } },
				},
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'address1' } },
					type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
				},
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'address2' } },
					type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
				},
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'postalCode' } },
					type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
				},
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'city' } },
					type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
				},
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'workSituation' } },
					type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
				},
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'cafNumber' } },
					type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
				},
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'peNumber' } },
					type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
				},
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'rightRsa' } },
					type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
				},
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'rightAre' } },
					type: { kind: 'NamedType', name: { kind: 'Name', value: 'Boolean' } },
				},
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'rightAss' } },
					type: { kind: 'NamedType', name: { kind: 'Name', value: 'Boolean' } },
				},
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'rightBonus' } },
					type: { kind: 'NamedType', name: { kind: 'Name', value: 'Boolean' } },
				},
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'rightRqth' } },
					type: { kind: 'NamedType', name: { kind: 'Name', value: 'Boolean' } },
				},
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'geographicalArea' } },
					type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
				},
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'educationLevel' } },
					type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
				},
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'internalId' } },
					type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
				},
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'members' } },
					type: {
						kind: 'NonNullType',
						type: {
							kind: 'ListType',
							type: {
								kind: 'NonNullType',
								type: {
									kind: 'NamedType',
									name: { kind: 'Name', value: 'notebook_member_insert_input' },
								},
							},
						},
					},
				},
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'structures' } },
					type: {
						kind: 'NonNullType',
						type: {
							kind: 'ListType',
							type: {
								kind: 'NonNullType',
								type: {
									kind: 'NamedType',
									name: { kind: 'Name', value: 'beneficiary_structure_insert_input' },
								},
							},
						},
					},
				},
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'wantedJobs' } },
					type: {
						kind: 'NonNullType',
						type: {
							kind: 'ListType',
							type: {
								kind: 'NonNullType',
								type: {
									kind: 'NamedType',
									name: { kind: 'Name', value: 'wanted_job_insert_input' },
								},
							},
						},
					},
				},
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'needOrientation' } },
					type: {
						kind: 'NonNullType',
						type: { kind: 'NamedType', name: { kind: 'Name', value: 'Boolean' } },
					},
				},
			],
			selectionSet: {
				kind: 'SelectionSet',
				selections: [
					{
						kind: 'Field',
						alias: { kind: 'Name', value: 'newNotebook' },
						name: { kind: 'Name', value: 'insert_notebook_one' },
						arguments: [
							{
								kind: 'Argument',
								name: { kind: 'Name', value: 'object' },
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
														name: { kind: 'Name', value: 'data' },
														value: {
															kind: 'ObjectValue',
															fields: [
																{
																	kind: 'ObjectField',
																	name: { kind: 'Name', value: 'firstname' },
																	value: {
																		kind: 'Variable',
																		name: { kind: 'Name', value: 'firstname' },
																	},
																},
																{
																	kind: 'ObjectField',
																	name: { kind: 'Name', value: 'lastname' },
																	value: {
																		kind: 'Variable',
																		name: { kind: 'Name', value: 'lastname' },
																	},
																},
																{
																	kind: 'ObjectField',
																	name: { kind: 'Name', value: 'dateOfBirth' },
																	value: {
																		kind: 'Variable',
																		name: { kind: 'Name', value: 'dateOfBirth' },
																	},
																},
																{
																	kind: 'ObjectField',
																	name: { kind: 'Name', value: 'placeOfBirth' },
																	value: {
																		kind: 'Variable',
																		name: { kind: 'Name', value: 'placeOfBirth' },
																	},
																},
																{
																	kind: 'ObjectField',
																	name: { kind: 'Name', value: 'mobileNumber' },
																	value: {
																		kind: 'Variable',
																		name: { kind: 'Name', value: 'mobileNumber' },
																	},
																},
																{
																	kind: 'ObjectField',
																	name: { kind: 'Name', value: 'email' },
																	value: {
																		kind: 'Variable',
																		name: { kind: 'Name', value: 'email' },
																	},
																},
																{
																	kind: 'ObjectField',
																	name: { kind: 'Name', value: 'address1' },
																	value: {
																		kind: 'Variable',
																		name: { kind: 'Name', value: 'address1' },
																	},
																},
																{
																	kind: 'ObjectField',
																	name: { kind: 'Name', value: 'address2' },
																	value: {
																		kind: 'Variable',
																		name: { kind: 'Name', value: 'address2' },
																	},
																},
																{
																	kind: 'ObjectField',
																	name: { kind: 'Name', value: 'postalCode' },
																	value: {
																		kind: 'Variable',
																		name: { kind: 'Name', value: 'postalCode' },
																	},
																},
																{
																	kind: 'ObjectField',
																	name: { kind: 'Name', value: 'city' },
																	value: {
																		kind: 'Variable',
																		name: { kind: 'Name', value: 'city' },
																	},
																},
																{
																	kind: 'ObjectField',
																	name: { kind: 'Name', value: 'cafNumber' },
																	value: {
																		kind: 'Variable',
																		name: { kind: 'Name', value: 'cafNumber' },
																	},
																},
																{
																	kind: 'ObjectField',
																	name: { kind: 'Name', value: 'peNumber' },
																	value: {
																		kind: 'Variable',
																		name: { kind: 'Name', value: 'peNumber' },
																	},
																},
																{
																	kind: 'ObjectField',
																	name: { kind: 'Name', value: 'internalId' },
																	value: {
																		kind: 'Variable',
																		name: { kind: 'Name', value: 'internalId' },
																	},
																},
																{
																	kind: 'ObjectField',
																	name: { kind: 'Name', value: 'structures' },
																	value: {
																		kind: 'ObjectValue',
																		fields: [
																			{
																				kind: 'ObjectField',
																				name: { kind: 'Name', value: 'data' },
																				value: {
																					kind: 'Variable',
																					name: { kind: 'Name', value: 'structures' },
																				},
																			},
																		],
																	},
																},
																{
																	kind: 'ObjectField',
																	name: { kind: 'Name', value: 'needOrientation' },
																	value: {
																		kind: 'Variable',
																		name: { kind: 'Name', value: 'needOrientation' },
																	},
																},
															],
														},
													},
												],
											},
										},
										{
											kind: 'ObjectField',
											name: { kind: 'Name', value: 'members' },
											value: {
												kind: 'ObjectValue',
												fields: [
													{
														kind: 'ObjectField',
														name: { kind: 'Name', value: 'data' },
														value: { kind: 'Variable', name: { kind: 'Name', value: 'members' } },
													},
												],
											},
										},
										{
											kind: 'ObjectField',
											name: { kind: 'Name', value: 'workSituation' },
											value: { kind: 'Variable', name: { kind: 'Name', value: 'workSituation' } },
										},
										{
											kind: 'ObjectField',
											name: { kind: 'Name', value: 'rightRsa' },
											value: { kind: 'Variable', name: { kind: 'Name', value: 'rightRsa' } },
										},
										{
											kind: 'ObjectField',
											name: { kind: 'Name', value: 'rightAre' },
											value: { kind: 'Variable', name: { kind: 'Name', value: 'rightAre' } },
										},
										{
											kind: 'ObjectField',
											name: { kind: 'Name', value: 'rightAss' },
											value: { kind: 'Variable', name: { kind: 'Name', value: 'rightAss' } },
										},
										{
											kind: 'ObjectField',
											name: { kind: 'Name', value: 'rightBonus' },
											value: { kind: 'Variable', name: { kind: 'Name', value: 'rightBonus' } },
										},
										{
											kind: 'ObjectField',
											name: { kind: 'Name', value: 'rightRqth' },
											value: { kind: 'Variable', name: { kind: 'Name', value: 'rightRqth' } },
										},
										{
											kind: 'ObjectField',
											name: { kind: 'Name', value: 'geographicalArea' },
											value: {
												kind: 'Variable',
												name: { kind: 'Name', value: 'geographicalArea' },
											},
										},
										{
											kind: 'ObjectField',
											name: { kind: 'Name', value: 'educationLevel' },
											value: { kind: 'Variable', name: { kind: 'Name', value: 'educationLevel' } },
										},
										{
											kind: 'ObjectField',
											name: { kind: 'Name', value: 'wantedJobs' },
											value: {
												kind: 'ObjectValue',
												fields: [
													{
														kind: 'ObjectField',
														name: { kind: 'Name', value: 'data' },
														value: {
															kind: 'Variable',
															name: { kind: 'Name', value: 'wantedJobs' },
														},
													},
												],
											},
										},
									],
								},
							},
						],
						selectionSet: {
							kind: 'SelectionSet',
							selections: [{ kind: 'Field', name: { kind: 'Name', value: 'id' } }],
						},
					},
				],
			},
		},
	],
} as unknown as DocumentNode<ImportBeneficiaryMutation, ImportBeneficiaryMutationVariables>;
export const ImportStructureDocument = {
	kind: 'Document',
	definitions: [
		{
			kind: 'OperationDefinition',
			operation: 'mutation',
			name: { kind: 'Name', value: 'ImportStructure' },
			variableDefinitions: [
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'name' } },
					type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
				},
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'phone' } },
					type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
				},
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'email' } },
					type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
				},
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'address1' } },
					type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
				},
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'address2' } },
					type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
				},
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'postalCode' } },
					type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
				},
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'city' } },
					type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
				},
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'website' } },
					type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
				},
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'siret' } },
					type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
				},
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'shortDesc' } },
					type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
				},
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'adminEmail' } },
					type: { kind: 'NamedType', name: { kind: 'Name', value: 'citext' } },
				},
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'firstname' } },
					type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
				},
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'lastname' } },
					type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
				},
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'position' } },
					type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
				},
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'phoneNumbers' } },
					type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
				},
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'forceUpdate' } },
					type: { kind: 'NamedType', name: { kind: 'Name', value: 'Boolean' } },
				},
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'sendAccountEmail' } },
					type: { kind: 'NamedType', name: { kind: 'Name', value: 'Boolean' } },
				},
			],
			selectionSet: {
				kind: 'SelectionSet',
				selections: [
					{
						kind: 'Field',
						alias: { kind: 'Name', value: 'structure' },
						name: { kind: 'Name', value: 'insertStructureWithAdmin' },
						arguments: [
							{
								kind: 'Argument',
								name: { kind: 'Name', value: 'data' },
								value: {
									kind: 'ObjectValue',
									fields: [
										{
											kind: 'ObjectField',
											name: { kind: 'Name', value: 'structure' },
											value: {
												kind: 'ObjectValue',
												fields: [
													{
														kind: 'ObjectField',
														name: { kind: 'Name', value: 'name' },
														value: { kind: 'Variable', name: { kind: 'Name', value: 'name' } },
													},
													{
														kind: 'ObjectField',
														name: { kind: 'Name', value: 'phone' },
														value: { kind: 'Variable', name: { kind: 'Name', value: 'phone' } },
													},
													{
														kind: 'ObjectField',
														name: { kind: 'Name', value: 'email' },
														value: { kind: 'Variable', name: { kind: 'Name', value: 'email' } },
													},
													{
														kind: 'ObjectField',
														name: { kind: 'Name', value: 'address1' },
														value: { kind: 'Variable', name: { kind: 'Name', value: 'address1' } },
													},
													{
														kind: 'ObjectField',
														name: { kind: 'Name', value: 'address2' },
														value: { kind: 'Variable', name: { kind: 'Name', value: 'address2' } },
													},
													{
														kind: 'ObjectField',
														name: { kind: 'Name', value: 'postalCode' },
														value: {
															kind: 'Variable',
															name: { kind: 'Name', value: 'postalCode' },
														},
													},
													{
														kind: 'ObjectField',
														name: { kind: 'Name', value: 'city' },
														value: { kind: 'Variable', name: { kind: 'Name', value: 'city' } },
													},
													{
														kind: 'ObjectField',
														name: { kind: 'Name', value: 'website' },
														value: { kind: 'Variable', name: { kind: 'Name', value: 'website' } },
													},
													{
														kind: 'ObjectField',
														name: { kind: 'Name', value: 'siret' },
														value: { kind: 'Variable', name: { kind: 'Name', value: 'siret' } },
													},
													{
														kind: 'ObjectField',
														name: { kind: 'Name', value: 'shortDesc' },
														value: { kind: 'Variable', name: { kind: 'Name', value: 'shortDesc' } },
													},
												],
											},
										},
										{
											kind: 'ObjectField',
											name: { kind: 'Name', value: 'adminStructure' },
											value: {
												kind: 'ObjectValue',
												fields: [
													{
														kind: 'ObjectField',
														name: { kind: 'Name', value: 'adminEmail' },
														value: {
															kind: 'Variable',
															name: { kind: 'Name', value: 'adminEmail' },
														},
													},
													{
														kind: 'ObjectField',
														name: { kind: 'Name', value: 'firstname' },
														value: { kind: 'Variable', name: { kind: 'Name', value: 'firstname' } },
													},
													{
														kind: 'ObjectField',
														name: { kind: 'Name', value: 'lastname' },
														value: { kind: 'Variable', name: { kind: 'Name', value: 'lastname' } },
													},
													{
														kind: 'ObjectField',
														name: { kind: 'Name', value: 'position' },
														value: { kind: 'Variable', name: { kind: 'Name', value: 'position' } },
													},
													{
														kind: 'ObjectField',
														name: { kind: 'Name', value: 'phoneNumbers' },
														value: {
															kind: 'Variable',
															name: { kind: 'Name', value: 'phoneNumbers' },
														},
													},
												],
											},
										},
										{
											kind: 'ObjectField',
											name: { kind: 'Name', value: 'forceUpdate' },
											value: { kind: 'Variable', name: { kind: 'Name', value: 'forceUpdate' } },
										},
										{
											kind: 'ObjectField',
											name: { kind: 'Name', value: 'sendAccountEmail' },
											value: {
												kind: 'Variable',
												name: { kind: 'Name', value: 'sendAccountEmail' },
											},
										},
									],
								},
							},
						],
						selectionSet: {
							kind: 'SelectionSet',
							selections: [{ kind: 'Field', name: { kind: 'Name', value: 'id' } }],
						},
					},
				],
			},
		},
	],
} as unknown as DocumentNode<ImportStructureMutation, ImportStructureMutationVariables>;
export const UpdateManagerProfileDocument = {
	kind: 'Document',
	definitions: [
		{
			kind: 'OperationDefinition',
			operation: 'mutation',
			name: { kind: 'Name', value: 'UpdateManagerProfile' },
			variableDefinitions: [
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'firstname' } },
					type: {
						kind: 'NonNullType',
						type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
					},
				},
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'lastname' } },
					type: {
						kind: 'NonNullType',
						type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
					},
				},
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'email' } },
					type: {
						kind: 'NonNullType',
						type: { kind: 'NamedType', name: { kind: 'Name', value: 'citext' } },
					},
				},
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
					type: {
						kind: 'NonNullType',
						type: { kind: 'NamedType', name: { kind: 'Name', value: 'uuid' } },
					},
				},
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'accountId' } },
					type: {
						kind: 'NonNullType',
						type: { kind: 'NamedType', name: { kind: 'Name', value: 'uuid' } },
					},
				},
			],
			selectionSet: {
				kind: 'SelectionSet',
				selections: [
					{
						kind: 'Field',
						alias: { kind: 'Name', value: 'updateManager' },
						name: { kind: 'Name', value: 'update_manager_by_pk' },
						arguments: [
							{
								kind: 'Argument',
								name: { kind: 'Name', value: '_set' },
								value: {
									kind: 'ObjectValue',
									fields: [
										{
											kind: 'ObjectField',
											name: { kind: 'Name', value: 'firstname' },
											value: { kind: 'Variable', name: { kind: 'Name', value: 'firstname' } },
										},
										{
											kind: 'ObjectField',
											name: { kind: 'Name', value: 'lastname' },
											value: { kind: 'Variable', name: { kind: 'Name', value: 'lastname' } },
										},
										{
											kind: 'ObjectField',
											name: { kind: 'Name', value: 'email' },
											value: { kind: 'Variable', name: { kind: 'Name', value: 'email' } },
										},
									],
								},
							},
							{
								kind: 'Argument',
								name: { kind: 'Name', value: 'pk_columns' },
								value: {
									kind: 'ObjectValue',
									fields: [
										{
											kind: 'ObjectField',
											name: { kind: 'Name', value: 'id' },
											value: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
										},
									],
								},
							},
						],
						selectionSet: {
							kind: 'SelectionSet',
							selections: [{ kind: 'Field', name: { kind: 'Name', value: 'id' } }],
						},
					},
					{
						kind: 'Field',
						alias: { kind: 'Name', value: 'updateAccount' },
						name: { kind: 'Name', value: 'update_account_by_pk' },
						arguments: [
							{
								kind: 'Argument',
								name: { kind: 'Name', value: 'pk_columns' },
								value: {
									kind: 'ObjectValue',
									fields: [
										{
											kind: 'ObjectField',
											name: { kind: 'Name', value: 'id' },
											value: { kind: 'Variable', name: { kind: 'Name', value: 'accountId' } },
										},
									],
								},
							},
							{
								kind: 'Argument',
								name: { kind: 'Name', value: '_set' },
								value: {
									kind: 'ObjectValue',
									fields: [
										{
											kind: 'ObjectField',
											name: { kind: 'Name', value: 'onboardingDone' },
											value: { kind: 'BooleanValue', value: true },
										},
									],
								},
							},
						],
						selectionSet: {
							kind: 'SelectionSet',
							selections: [
								{ kind: 'Field', name: { kind: 'Name', value: 'id' } },
								{ kind: 'Field', name: { kind: 'Name', value: 'onboardingDone' } },
								{ kind: 'Field', name: { kind: 'Name', value: 'confirmed' } },
								{ kind: 'Field', name: { kind: 'Name', value: 'username' } },
								{
									kind: 'Field',
									name: { kind: 'Name', value: 'manager' },
									selectionSet: {
										kind: 'SelectionSet',
										selections: [
											{ kind: 'Field', name: { kind: 'Name', value: 'id' } },
											{ kind: 'Field', name: { kind: 'Name', value: 'firstname' } },
											{ kind: 'Field', name: { kind: 'Name', value: 'lastname' } },
											{ kind: 'Field', name: { kind: 'Name', value: 'email' } },
										],
									},
								},
							],
						},
					},
				],
			},
		},
	],
} as unknown as DocumentNode<UpdateManagerProfileMutation, UpdateManagerProfileMutationVariables>;
export const AddNotebookActionDocument = {
	kind: 'Document',
	definitions: [
		{
			kind: 'OperationDefinition',
			operation: 'mutation',
			name: { kind: 'Name', value: 'AddNotebookAction' },
			variableDefinitions: [
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'action' } },
					type: {
						kind: 'NonNullType',
						type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
					},
				},
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'targetId' } },
					type: {
						kind: 'NonNullType',
						type: { kind: 'NamedType', name: { kind: 'Name', value: 'uuid' } },
					},
				},
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'status' } },
					type: {
						kind: 'NonNullType',
						type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
					},
				},
			],
			selectionSet: {
				kind: 'SelectionSet',
				selections: [
					{
						kind: 'Field',
						name: { kind: 'Name', value: 'insert_notebook_action_one' },
						arguments: [
							{
								kind: 'Argument',
								name: { kind: 'Name', value: 'object' },
								value: {
									kind: 'ObjectValue',
									fields: [
										{
											kind: 'ObjectField',
											name: { kind: 'Name', value: 'action' },
											value: { kind: 'Variable', name: { kind: 'Name', value: 'action' } },
										},
										{
											kind: 'ObjectField',
											name: { kind: 'Name', value: 'targetId' },
											value: { kind: 'Variable', name: { kind: 'Name', value: 'targetId' } },
										},
										{
											kind: 'ObjectField',
											name: { kind: 'Name', value: 'status' },
											value: { kind: 'Variable', name: { kind: 'Name', value: 'status' } },
										},
									],
								},
							},
						],
						selectionSet: {
							kind: 'SelectionSet',
							selections: [
								{ kind: 'Field', name: { kind: 'Name', value: 'id' } },
								{
									kind: 'Field',
									name: { kind: 'Name', value: 'target' },
									selectionSet: {
										kind: 'SelectionSet',
										selections: [{ kind: 'Field', name: { kind: 'Name', value: 'id' } }],
									},
								},
							],
						},
					},
				],
			},
		},
	],
} as unknown as DocumentNode<AddNotebookActionMutation, AddNotebookActionMutationVariables>;
export const GetRefActionsDocument = {
	kind: 'Document',
	definitions: [
		{
			kind: 'OperationDefinition',
			operation: 'query',
			name: { kind: 'Name', value: 'GetRefActions' },
			variableDefinitions: [
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'theme' } },
					type: {
						kind: 'NonNullType',
						type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
					},
				},
			],
			selectionSet: {
				kind: 'SelectionSet',
				selections: [
					{
						kind: 'Field',
						alias: { kind: 'Name', value: 'refActions' },
						name: { kind: 'Name', value: 'ref_action' },
						arguments: [
							{
								kind: 'Argument',
								name: { kind: 'Name', value: 'where' },
								value: {
									kind: 'ObjectValue',
									fields: [
										{
											kind: 'ObjectField',
											name: { kind: 'Name', value: 'theme' },
											value: {
												kind: 'ObjectValue',
												fields: [
													{
														kind: 'ObjectField',
														name: { kind: 'Name', value: '_eq' },
														value: { kind: 'Variable', name: { kind: 'Name', value: 'theme' } },
													},
												],
											},
										},
									],
								},
							},
							{
								kind: 'Argument',
								name: { kind: 'Name', value: 'order_by' },
								value: {
									kind: 'ObjectValue',
									fields: [
										{
											kind: 'ObjectField',
											name: { kind: 'Name', value: 'description' },
											value: { kind: 'EnumValue', value: 'asc_nulls_first' },
										},
									],
								},
							},
						],
						selectionSet: {
							kind: 'SelectionSet',
							selections: [
								{ kind: 'Field', name: { kind: 'Name', value: 'id' } },
								{ kind: 'Field', name: { kind: 'Name', value: 'description' } },
							],
						},
					},
				],
			},
		},
	],
} as unknown as DocumentNode<GetRefActionsQuery, GetRefActionsQueryVariables>;
export const UpdateActionStatusDocument = {
	kind: 'Document',
	definitions: [
		{
			kind: 'OperationDefinition',
			operation: 'mutation',
			name: { kind: 'Name', value: 'UpdateActionStatus' },
			variableDefinitions: [
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'status' } },
					type: {
						kind: 'NonNullType',
						type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
					},
				},
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
					type: {
						kind: 'NonNullType',
						type: { kind: 'NamedType', name: { kind: 'Name', value: 'uuid' } },
					},
				},
			],
			selectionSet: {
				kind: 'SelectionSet',
				selections: [
					{
						kind: 'Field',
						alias: { kind: 'Name', value: 'updateStatus' },
						name: { kind: 'Name', value: 'update_notebook_action_by_pk' },
						arguments: [
							{
								kind: 'Argument',
								name: { kind: 'Name', value: '_set' },
								value: {
									kind: 'ObjectValue',
									fields: [
										{
											kind: 'ObjectField',
											name: { kind: 'Name', value: 'status' },
											value: { kind: 'Variable', name: { kind: 'Name', value: 'status' } },
										},
									],
								},
							},
							{
								kind: 'Argument',
								name: { kind: 'Name', value: 'pk_columns' },
								value: {
									kind: 'ObjectValue',
									fields: [
										{
											kind: 'ObjectField',
											name: { kind: 'Name', value: 'id' },
											value: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
										},
									],
								},
							},
						],
						selectionSet: {
							kind: 'SelectionSet',
							selections: [{ kind: 'Field', name: { kind: 'Name', value: 'id' } }],
						},
					},
				],
			},
		},
	],
} as unknown as DocumentNode<UpdateActionStatusMutation, UpdateActionStatusMutationVariables>;
export const UpdateNotebookContractDocument = {
	kind: 'Document',
	definitions: [
		{
			kind: 'OperationDefinition',
			operation: 'mutation',
			name: { kind: 'Name', value: 'UpdateNotebookContract' },
			variableDefinitions: [
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
					type: {
						kind: 'NonNullType',
						type: { kind: 'NamedType', name: { kind: 'Name', value: 'uuid' } },
					},
				},
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'contractType' } },
					type: {
						kind: 'NonNullType',
						type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
					},
				},
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'contractSignDate' } },
					type: { kind: 'NamedType', name: { kind: 'Name', value: 'date' } },
				},
			],
			selectionSet: {
				kind: 'SelectionSet',
				selections: [
					{
						kind: 'Field',
						name: { kind: 'Name', value: 'update_notebook_by_pk' },
						arguments: [
							{
								kind: 'Argument',
								name: { kind: 'Name', value: '_set' },
								value: {
									kind: 'ObjectValue',
									fields: [
										{
											kind: 'ObjectField',
											name: { kind: 'Name', value: 'contractSignDate' },
											value: {
												kind: 'Variable',
												name: { kind: 'Name', value: 'contractSignDate' },
											},
										},
										{
											kind: 'ObjectField',
											name: { kind: 'Name', value: 'contractType' },
											value: { kind: 'Variable', name: { kind: 'Name', value: 'contractType' } },
										},
									],
								},
							},
							{
								kind: 'Argument',
								name: { kind: 'Name', value: 'pk_columns' },
								value: {
									kind: 'ObjectValue',
									fields: [
										{
											kind: 'ObjectField',
											name: { kind: 'Name', value: 'id' },
											value: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
										},
									],
								},
							},
						],
						selectionSet: {
							kind: 'SelectionSet',
							selections: [{ kind: 'Field', name: { kind: 'Name', value: 'id' } }],
						},
					},
				],
			},
		},
	],
} as unknown as DocumentNode<
	UpdateNotebookContractMutation,
	UpdateNotebookContractMutationVariables
>;
export const AddNotebookFocusDocument = {
	kind: 'Document',
	definitions: [
		{
			kind: 'OperationDefinition',
			operation: 'mutation',
			name: { kind: 'Name', value: 'AddNotebookFocus' },
			variableDefinitions: [
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'notebookId' } },
					type: {
						kind: 'NonNullType',
						type: { kind: 'NamedType', name: { kind: 'Name', value: 'uuid' } },
					},
				},
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'situations' } },
					type: { kind: 'NamedType', name: { kind: 'Name', value: 'jsonb' } },
				},
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'theme' } },
					type: {
						kind: 'NonNullType',
						type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
					},
				},
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'linkedTo' } },
					type: {
						kind: 'NonNullType',
						type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
					},
				},
			],
			selectionSet: {
				kind: 'SelectionSet',
				selections: [
					{
						kind: 'Field',
						name: { kind: 'Name', value: 'insert_notebook_focus_one' },
						arguments: [
							{
								kind: 'Argument',
								name: { kind: 'Name', value: 'object' },
								value: {
									kind: 'ObjectValue',
									fields: [
										{
											kind: 'ObjectField',
											name: { kind: 'Name', value: 'notebookId' },
											value: { kind: 'Variable', name: { kind: 'Name', value: 'notebookId' } },
										},
										{
											kind: 'ObjectField',
											name: { kind: 'Name', value: 'situations' },
											value: { kind: 'Variable', name: { kind: 'Name', value: 'situations' } },
										},
										{
											kind: 'ObjectField',
											name: { kind: 'Name', value: 'theme' },
											value: { kind: 'Variable', name: { kind: 'Name', value: 'theme' } },
										},
										{
											kind: 'ObjectField',
											name: { kind: 'Name', value: 'linkedTo' },
											value: { kind: 'Variable', name: { kind: 'Name', value: 'linkedTo' } },
										},
									],
								},
							},
						],
						selectionSet: {
							kind: 'SelectionSet',
							selections: [{ kind: 'Field', name: { kind: 'Name', value: 'id' } }],
						},
					},
				],
			},
		},
	],
} as unknown as DocumentNode<AddNotebookFocusMutation, AddNotebookFocusMutationVariables>;
export const DeleteNotebookFocusByIdDocument = {
	kind: 'Document',
	definitions: [
		{
			kind: 'OperationDefinition',
			operation: 'mutation',
			name: { kind: 'Name', value: 'DeleteNotebookFocusById' },
			variableDefinitions: [
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
					type: {
						kind: 'NonNullType',
						type: { kind: 'NamedType', name: { kind: 'Name', value: 'uuid' } },
					},
				},
			],
			selectionSet: {
				kind: 'SelectionSet',
				selections: [
					{
						kind: 'Field',
						name: { kind: 'Name', value: 'delete_notebook_focus_by_pk' },
						arguments: [
							{
								kind: 'Argument',
								name: { kind: 'Name', value: 'id' },
								value: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
							},
						],
						selectionSet: {
							kind: 'SelectionSet',
							selections: [{ kind: 'Field', name: { kind: 'Name', value: 'id' } }],
						},
					},
				],
			},
		},
	],
} as unknown as DocumentNode<
	DeleteNotebookFocusByIdMutation,
	DeleteNotebookFocusByIdMutationVariables
>;
export const GetNotebookFocusByIdDocument = {
	kind: 'Document',
	definitions: [
		{
			kind: 'OperationDefinition',
			operation: 'query',
			name: { kind: 'Name', value: 'GetNotebookFocusById' },
			variableDefinitions: [
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
					type: {
						kind: 'NonNullType',
						type: { kind: 'NamedType', name: { kind: 'Name', value: 'uuid' } },
					},
				},
			],
			selectionSet: {
				kind: 'SelectionSet',
				selections: [
					{
						kind: 'Field',
						alias: { kind: 'Name', value: 'focus' },
						name: { kind: 'Name', value: 'notebook_focus_by_pk' },
						arguments: [
							{
								kind: 'Argument',
								name: { kind: 'Name', value: 'id' },
								value: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
							},
						],
						selectionSet: {
							kind: 'SelectionSet',
							selections: [
								{ kind: 'Field', name: { kind: 'Name', value: 'id' } },
								{ kind: 'Field', name: { kind: 'Name', value: 'situations' } },
								{ kind: 'Field', name: { kind: 'Name', value: 'linkedTo' } },
								{
									kind: 'Field',
									name: { kind: 'Name', value: 'targets' },
									arguments: [
										{
											kind: 'Argument',
											name: { kind: 'Name', value: 'order_by' },
											value: {
												kind: 'ObjectValue',
												fields: [
													{
														kind: 'ObjectField',
														name: { kind: 'Name', value: 'createdAt' },
														value: { kind: 'EnumValue', value: 'desc' },
													},
												],
											},
										},
									],
									selectionSet: {
										kind: 'SelectionSet',
										selections: [
											{ kind: 'Field', name: { kind: 'Name', value: 'target' } },
											{ kind: 'Field', name: { kind: 'Name', value: 'status' } },
											{ kind: 'Field', name: { kind: 'Name', value: 'id' } },
											{
												kind: 'Field',
												name: { kind: 'Name', value: 'actions' },
												arguments: [
													{
														kind: 'Argument',
														name: { kind: 'Name', value: 'order_by' },
														value: {
															kind: 'ObjectValue',
															fields: [
																{
																	kind: 'ObjectField',
																	name: { kind: 'Name', value: 'createdAt' },
																	value: { kind: 'EnumValue', value: 'desc' },
																},
															],
														},
													},
												],
												selectionSet: {
													kind: 'SelectionSet',
													selections: [
														{ kind: 'Field', name: { kind: 'Name', value: 'id' } },
														{ kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
														{ kind: 'Field', name: { kind: 'Name', value: 'status' } },
														{ kind: 'Field', name: { kind: 'Name', value: 'action' } },
														{
															kind: 'Field',
															name: { kind: 'Name', value: 'creator' },
															selectionSet: {
																kind: 'SelectionSet',
																selections: [
																	{
																		kind: 'Field',
																		name: { kind: 'Name', value: 'professional' },
																		selectionSet: {
																			kind: 'SelectionSet',
																			selections: [
																				{ kind: 'Field', name: { kind: 'Name', value: 'id' } },
																				{
																					kind: 'Field',
																					name: { kind: 'Name', value: 'lastname' },
																				},
																				{
																					kind: 'Field',
																					name: { kind: 'Name', value: 'firstname' },
																				},
																			],
																		},
																	},
																],
															},
														},
													],
												},
											},
										],
									},
								},
								{ kind: 'Field', name: { kind: 'Name', value: 'theme' } },
								{
									kind: 'Field',
									name: { kind: 'Name', value: 'creator' },
									selectionSet: {
										kind: 'SelectionSet',
										selections: [
											{
												kind: 'Field',
												name: { kind: 'Name', value: 'professional' },
												selectionSet: {
													kind: 'SelectionSet',
													selections: [
														{ kind: 'Field', name: { kind: 'Name', value: 'id' } },
														{ kind: 'Field', name: { kind: 'Name', value: 'position' } },
														{ kind: 'Field', name: { kind: 'Name', value: 'firstname' } },
														{ kind: 'Field', name: { kind: 'Name', value: 'lastname' } },
														{ kind: 'Field', name: { kind: 'Name', value: 'mobileNumber' } },
														{ kind: 'Field', name: { kind: 'Name', value: 'structureId' } },
														{
															kind: 'Field',
															name: { kind: 'Name', value: 'structure' },
															selectionSet: {
																kind: 'SelectionSet',
																selections: [
																	{ kind: 'Field', name: { kind: 'Name', value: 'id' } },
																	{ kind: 'Field', name: { kind: 'Name', value: 'name' } },
																	{ kind: 'Field', name: { kind: 'Name', value: 'phone' } },
																	{ kind: 'Field', name: { kind: 'Name', value: 'address1' } },
																	{ kind: 'Field', name: { kind: 'Name', value: 'address2' } },
																	{ kind: 'Field', name: { kind: 'Name', value: 'city' } },
																	{ kind: 'Field', name: { kind: 'Name', value: 'postalCode' } },
																	{ kind: 'Field', name: { kind: 'Name', value: 'website' } },
																],
															},
														},
													],
												},
											},
										],
									},
								},
								{ kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
							],
						},
					},
				],
			},
		},
	],
} as unknown as DocumentNode<GetNotebookFocusByIdQuery, GetNotebookFocusByIdQueryVariables>;
export const GetRefSituationsDocument = {
	kind: 'Document',
	definitions: [
		{
			kind: 'OperationDefinition',
			operation: 'query',
			name: { kind: 'Name', value: 'GetRefSituations' },
			selectionSet: {
				kind: 'SelectionSet',
				selections: [
					{
						kind: 'Field',
						alias: { kind: 'Name', value: 'refSituations' },
						name: { kind: 'Name', value: 'ref_situation' },
						selectionSet: {
							kind: 'SelectionSet',
							selections: [
								{ kind: 'Field', name: { kind: 'Name', value: 'id' } },
								{ kind: 'Field', name: { kind: 'Name', value: 'description' } },
								{ kind: 'Field', name: { kind: 'Name', value: 'theme' } },
							],
						},
					},
				],
			},
		},
	],
} as unknown as DocumentNode<GetRefSituationsQuery, GetRefSituationsQueryVariables>;
export const GetRefSituationsByThemeDocument = {
	kind: 'Document',
	definitions: [
		{
			kind: 'OperationDefinition',
			operation: 'query',
			name: { kind: 'Name', value: 'GetRefSituationsByTheme' },
			variableDefinitions: [
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'theme' } },
					type: {
						kind: 'NonNullType',
						type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
					},
				},
			],
			selectionSet: {
				kind: 'SelectionSet',
				selections: [
					{
						kind: 'Field',
						alias: { kind: 'Name', value: 'refSituations' },
						name: { kind: 'Name', value: 'ref_situation' },
						arguments: [
							{
								kind: 'Argument',
								name: { kind: 'Name', value: 'where' },
								value: {
									kind: 'ObjectValue',
									fields: [
										{
											kind: 'ObjectField',
											name: { kind: 'Name', value: 'theme' },
											value: {
												kind: 'ObjectValue',
												fields: [
													{
														kind: 'ObjectField',
														name: { kind: 'Name', value: '_eq' },
														value: { kind: 'Variable', name: { kind: 'Name', value: 'theme' } },
													},
												],
											},
										},
									],
								},
							},
							{
								kind: 'Argument',
								name: { kind: 'Name', value: 'order_by' },
								value: {
									kind: 'ObjectValue',
									fields: [
										{
											kind: 'ObjectField',
											name: { kind: 'Name', value: 'description' },
											value: { kind: 'EnumValue', value: 'asc' },
										},
									],
								},
							},
						],
						selectionSet: {
							kind: 'SelectionSet',
							selections: [
								{ kind: 'Field', name: { kind: 'Name', value: 'id' } },
								{ kind: 'Field', name: { kind: 'Name', value: 'description' } },
								{ kind: 'Field', name: { kind: 'Name', value: 'theme' } },
							],
						},
					},
				],
			},
		},
	],
} as unknown as DocumentNode<GetRefSituationsByThemeQuery, GetRefSituationsByThemeQueryVariables>;
export const UpdateNotebookFocusDocument = {
	kind: 'Document',
	definitions: [
		{
			kind: 'OperationDefinition',
			operation: 'mutation',
			name: { kind: 'Name', value: 'UpdateNotebookFocus' },
			variableDefinitions: [
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
					type: {
						kind: 'NonNullType',
						type: { kind: 'NamedType', name: { kind: 'Name', value: 'uuid' } },
					},
				},
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'situations' } },
					type: { kind: 'NamedType', name: { kind: 'Name', value: 'jsonb' } },
				},
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'linkedTo' } },
					type: {
						kind: 'NonNullType',
						type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
					},
				},
			],
			selectionSet: {
				kind: 'SelectionSet',
				selections: [
					{
						kind: 'Field',
						name: { kind: 'Name', value: 'update_notebook_focus_by_pk' },
						arguments: [
							{
								kind: 'Argument',
								name: { kind: 'Name', value: 'pk_columns' },
								value: {
									kind: 'ObjectValue',
									fields: [
										{
											kind: 'ObjectField',
											name: { kind: 'Name', value: 'id' },
											value: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
										},
									],
								},
							},
							{
								kind: 'Argument',
								name: { kind: 'Name', value: '_set' },
								value: {
									kind: 'ObjectValue',
									fields: [
										{
											kind: 'ObjectField',
											name: { kind: 'Name', value: 'situations' },
											value: { kind: 'Variable', name: { kind: 'Name', value: 'situations' } },
										},
										{
											kind: 'ObjectField',
											name: { kind: 'Name', value: 'linkedTo' },
											value: { kind: 'Variable', name: { kind: 'Name', value: 'linkedTo' } },
										},
									],
								},
							},
						],
						selectionSet: {
							kind: 'SelectionSet',
							selections: [{ kind: 'Field', name: { kind: 'Name', value: 'id' } }],
						},
					},
				],
			},
		},
	],
} as unknown as DocumentNode<UpdateNotebookFocusMutation, UpdateNotebookFocusMutationVariables>;
export const UpdateTargetStatusDocument = {
	kind: 'Document',
	definitions: [
		{
			kind: 'OperationDefinition',
			operation: 'mutation',
			name: { kind: 'Name', value: 'UpdateTargetStatus' },
			variableDefinitions: [
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'status' } },
					type: {
						kind: 'NonNullType',
						type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
					},
				},
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
					type: {
						kind: 'NonNullType',
						type: { kind: 'NamedType', name: { kind: 'Name', value: 'uuid' } },
					},
				},
			],
			selectionSet: {
				kind: 'SelectionSet',
				selections: [
					{
						kind: 'Field',
						alias: { kind: 'Name', value: 'updateStatus' },
						name: { kind: 'Name', value: 'update_notebook_target_by_pk' },
						arguments: [
							{
								kind: 'Argument',
								name: { kind: 'Name', value: '_set' },
								value: {
									kind: 'ObjectValue',
									fields: [
										{
											kind: 'ObjectField',
											name: { kind: 'Name', value: 'status' },
											value: { kind: 'Variable', name: { kind: 'Name', value: 'status' } },
										},
									],
								},
							},
							{
								kind: 'Argument',
								name: { kind: 'Name', value: 'pk_columns' },
								value: {
									kind: 'ObjectValue',
									fields: [
										{
											kind: 'ObjectField',
											name: { kind: 'Name', value: 'id' },
											value: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
										},
									],
								},
							},
						],
						selectionSet: {
							kind: 'SelectionSet',
							selections: [{ kind: 'Field', name: { kind: 'Name', value: 'id' } }],
						},
					},
				],
			},
		},
	],
} as unknown as DocumentNode<UpdateTargetStatusMutation, UpdateTargetStatusMutationVariables>;
export const AddNotebookAppointmentDocument = {
	kind: 'Document',
	definitions: [
		{
			kind: 'OperationDefinition',
			operation: 'mutation',
			name: { kind: 'Name', value: 'AddNotebookAppointment' },
			variableDefinitions: [
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'date' } },
					type: { kind: 'NamedType', name: { kind: 'Name', value: 'date' } },
				},
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'notebookId' } },
					type: { kind: 'NamedType', name: { kind: 'Name', value: 'uuid' } },
				},
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'memberAccountId' } },
					type: { kind: 'NamedType', name: { kind: 'Name', value: 'uuid' } },
				},
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'status' } },
					type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
				},
			],
			selectionSet: {
				kind: 'SelectionSet',
				selections: [
					{
						kind: 'Field',
						alias: { kind: 'Name', value: 'addAppointment' },
						name: { kind: 'Name', value: 'insert_notebook_appointment' },
						arguments: [
							{
								kind: 'Argument',
								name: { kind: 'Name', value: 'objects' },
								value: {
									kind: 'ObjectValue',
									fields: [
										{
											kind: 'ObjectField',
											name: { kind: 'Name', value: 'date' },
											value: { kind: 'Variable', name: { kind: 'Name', value: 'date' } },
										},
										{
											kind: 'ObjectField',
											name: { kind: 'Name', value: 'notebookId' },
											value: { kind: 'Variable', name: { kind: 'Name', value: 'notebookId' } },
										},
										{
											kind: 'ObjectField',
											name: { kind: 'Name', value: 'memberAccountId' },
											value: { kind: 'Variable', name: { kind: 'Name', value: 'memberAccountId' } },
										},
										{
											kind: 'ObjectField',
											name: { kind: 'Name', value: 'status' },
											value: { kind: 'Variable', name: { kind: 'Name', value: 'status' } },
										},
									],
								},
							},
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
											{ kind: 'Field', name: { kind: 'Name', value: 'id' } },
											{ kind: 'Field', name: { kind: 'Name', value: 'notebookId' } },
										],
									},
								},
							],
						},
					},
				],
			},
		},
	],
} as unknown as DocumentNode<
	AddNotebookAppointmentMutation,
	AddNotebookAppointmentMutationVariables
>;
export const AddNotebookMemberDocument = {
	kind: 'Document',
	definitions: [
		{
			kind: 'OperationDefinition',
			operation: 'mutation',
			name: { kind: 'Name', value: 'AddNotebookMember' },
			variableDefinitions: [
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'creatorId' } },
					type: {
						kind: 'NonNullType',
						type: { kind: 'NamedType', name: { kind: 'Name', value: 'uuid' } },
					},
				},
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'accountId' } },
					type: {
						kind: 'NonNullType',
						type: { kind: 'NamedType', name: { kind: 'Name', value: 'uuid' } },
					},
				},
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'notebookId' } },
					type: {
						kind: 'NonNullType',
						type: { kind: 'NamedType', name: { kind: 'Name', value: 'uuid' } },
					},
				},
			],
			selectionSet: {
				kind: 'SelectionSet',
				selections: [
					{
						kind: 'Field',
						alias: { kind: 'Name', value: 'newMember' },
						name: { kind: 'Name', value: 'insert_notebook_member_one' },
						arguments: [
							{
								kind: 'Argument',
								name: { kind: 'Name', value: 'object' },
								value: {
									kind: 'ObjectValue',
									fields: [
										{
											kind: 'ObjectField',
											name: { kind: 'Name', value: 'creatorId' },
											value: { kind: 'Variable', name: { kind: 'Name', value: 'creatorId' } },
										},
										{
											kind: 'ObjectField',
											name: { kind: 'Name', value: 'accountId' },
											value: { kind: 'Variable', name: { kind: 'Name', value: 'accountId' } },
										},
										{
											kind: 'ObjectField',
											name: { kind: 'Name', value: 'notebookId' },
											value: { kind: 'Variable', name: { kind: 'Name', value: 'notebookId' } },
										},
										{
											kind: 'ObjectField',
											name: { kind: 'Name', value: 'memberType' },
											value: { kind: 'StringValue', value: 'no_referent', block: false },
										},
									],
								},
							},
						],
						selectionSet: {
							kind: 'SelectionSet',
							selections: [{ kind: 'Field', name: { kind: 'Name', value: 'id' } }],
						},
					},
				],
			},
		},
	],
} as unknown as DocumentNode<AddNotebookMemberMutation, AddNotebookMemberMutationVariables>;
export const GetNotebookAppointmentsDocument = {
	kind: 'Document',
	definitions: [
		{
			kind: 'OperationDefinition',
			operation: 'query',
			name: { kind: 'Name', value: 'GetNotebookAppointments' },
			variableDefinitions: [
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'memberAccountId' } },
					type: { kind: 'NamedType', name: { kind: 'Name', value: 'uuid' } },
				},
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'notebookId' } },
					type: { kind: 'NamedType', name: { kind: 'Name', value: 'uuid' } },
				},
			],
			selectionSet: {
				kind: 'SelectionSet',
				selections: [
					{
						kind: 'Field',
						alias: { kind: 'Name', value: 'getNotebookAppointments' },
						name: { kind: 'Name', value: 'notebook_appointment' },
						arguments: [
							{
								kind: 'Argument',
								name: { kind: 'Name', value: 'where' },
								value: {
									kind: 'ObjectValue',
									fields: [
										{
											kind: 'ObjectField',
											name: { kind: 'Name', value: 'memberAccountId' },
											value: {
												kind: 'ObjectValue',
												fields: [
													{
														kind: 'ObjectField',
														name: { kind: 'Name', value: '_eq' },
														value: {
															kind: 'Variable',
															name: { kind: 'Name', value: 'memberAccountId' },
														},
													},
												],
											},
										},
										{
											kind: 'ObjectField',
											name: { kind: 'Name', value: 'notebookId' },
											value: {
												kind: 'ObjectValue',
												fields: [
													{
														kind: 'ObjectField',
														name: { kind: 'Name', value: '_eq' },
														value: {
															kind: 'Variable',
															name: { kind: 'Name', value: 'notebookId' },
														},
													},
												],
											},
										},
									],
								},
							},
							{
								kind: 'Argument',
								name: { kind: 'Name', value: 'order_by' },
								value: {
									kind: 'ObjectValue',
									fields: [
										{
											kind: 'ObjectField',
											name: { kind: 'Name', value: 'date' },
											value: { kind: 'EnumValue', value: 'desc' },
										},
									],
								},
							},
						],
						selectionSet: {
							kind: 'SelectionSet',
							selections: [
								{ kind: 'Field', name: { kind: 'Name', value: 'date' } },
								{ kind: 'Field', name: { kind: 'Name', value: 'id' } },
								{ kind: 'Field', name: { kind: 'Name', value: 'status' } },
							],
						},
					},
				],
			},
		},
	],
} as unknown as DocumentNode<GetNotebookAppointmentsQuery, GetNotebookAppointmentsQueryVariables>;
export const SearchProfessionalDocument = {
	kind: 'Document',
	definitions: [
		{
			kind: 'OperationDefinition',
			operation: 'query',
			name: { kind: 'Name', value: 'SearchProfessional' },
			variableDefinitions: [
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'search' } },
					type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
				},
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'professionalIds' } },
					type: {
						kind: 'ListType',
						type: {
							kind: 'NonNullType',
							type: { kind: 'NamedType', name: { kind: 'Name', value: 'uuid' } },
						},
					},
					defaultValue: { kind: 'ListValue', values: [] },
				},
			],
			selectionSet: {
				kind: 'SelectionSet',
				selections: [
					{
						kind: 'Field',
						alias: { kind: 'Name', value: 'professionals' },
						name: { kind: 'Name', value: 'professional' },
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
																name: { kind: 'Name', value: 'firstname' },
																value: {
																	kind: 'ObjectValue',
																	fields: [
																		{
																			kind: 'ObjectField',
																			name: { kind: 'Name', value: '_ilike' },
																			value: {
																				kind: 'Variable',
																				name: { kind: 'Name', value: 'search' },
																			},
																		},
																	],
																},
															},
														],
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
																				name: { kind: 'Name', value: 'search' },
																			},
																		},
																	],
																},
															},
														],
													},
													{
														kind: 'ObjectValue',
														fields: [
															{
																kind: 'ObjectField',
																name: { kind: 'Name', value: 'structure' },
																value: {
																	kind: 'ObjectValue',
																	fields: [
																		{
																			kind: 'ObjectField',
																			name: { kind: 'Name', value: 'name' },
																			value: {
																				kind: 'ObjectValue',
																				fields: [
																					{
																						kind: 'ObjectField',
																						name: { kind: 'Name', value: '_ilike' },
																						value: {
																							kind: 'Variable',
																							name: { kind: 'Name', value: 'search' },
																						},
																					},
																				],
																			},
																		},
																	],
																},
															},
														],
													},
													{
														kind: 'ObjectValue',
														fields: [
															{
																kind: 'ObjectField',
																name: { kind: 'Name', value: 'structure' },
																value: {
																	kind: 'ObjectValue',
																	fields: [
																		{
																			kind: 'ObjectField',
																			name: { kind: 'Name', value: 'postalCode' },
																			value: {
																				kind: 'ObjectValue',
																				fields: [
																					{
																						kind: 'ObjectField',
																						name: { kind: 'Name', value: '_ilike' },
																						value: {
																							kind: 'Variable',
																							name: { kind: 'Name', value: 'search' },
																						},
																					},
																				],
																			},
																		},
																	],
																},
															},
														],
													},
												],
											},
										},
										{
											kind: 'ObjectField',
											name: { kind: 'Name', value: '_not' },
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
																	name: { kind: 'Name', value: '_in' },
																	value: {
																		kind: 'Variable',
																		name: { kind: 'Name', value: 'professionalIds' },
																	},
																},
															],
														},
													},
												],
											},
										},
									],
								},
							},
							{
								kind: 'Argument',
								name: { kind: 'Name', value: 'limit' },
								value: { kind: 'IntValue', value: '5' },
							},
						],
						selectionSet: {
							kind: 'SelectionSet',
							selections: [
								{ kind: 'Field', name: { kind: 'Name', value: 'id' } },
								{ kind: 'Field', name: { kind: 'Name', value: 'firstname' } },
								{ kind: 'Field', name: { kind: 'Name', value: 'lastname' } },
								{
									kind: 'Field',
									name: { kind: 'Name', value: 'structure' },
									selectionSet: {
										kind: 'SelectionSet',
										selections: [
											{ kind: 'Field', name: { kind: 'Name', value: 'id' } },
											{ kind: 'Field', name: { kind: 'Name', value: 'name' } },
											{ kind: 'Field', name: { kind: 'Name', value: 'postalCode' } },
											{ kind: 'Field', name: { kind: 'Name', value: 'phone' } },
										],
									},
								},
								{
									kind: 'Field',
									name: { kind: 'Name', value: 'account' },
									selectionSet: {
										kind: 'SelectionSet',
										selections: [{ kind: 'Field', name: { kind: 'Name', value: 'id' } }],
									},
								},
							],
						},
					},
					{
						kind: 'Field',
						alias: { kind: 'Name', value: 'count' },
						name: { kind: 'Name', value: 'professional_aggregate' },
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
																name: { kind: 'Name', value: 'firstname' },
																value: {
																	kind: 'ObjectValue',
																	fields: [
																		{
																			kind: 'ObjectField',
																			name: { kind: 'Name', value: '_ilike' },
																			value: {
																				kind: 'Variable',
																				name: { kind: 'Name', value: 'search' },
																			},
																		},
																	],
																},
															},
														],
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
																				name: { kind: 'Name', value: 'search' },
																			},
																		},
																	],
																},
															},
														],
													},
													{
														kind: 'ObjectValue',
														fields: [
															{
																kind: 'ObjectField',
																name: { kind: 'Name', value: 'structure' },
																value: {
																	kind: 'ObjectValue',
																	fields: [
																		{
																			kind: 'ObjectField',
																			name: { kind: 'Name', value: 'name' },
																			value: {
																				kind: 'ObjectValue',
																				fields: [
																					{
																						kind: 'ObjectField',
																						name: { kind: 'Name', value: '_ilike' },
																						value: {
																							kind: 'Variable',
																							name: { kind: 'Name', value: 'search' },
																						},
																					},
																				],
																			},
																		},
																	],
																},
															},
														],
													},
													{
														kind: 'ObjectValue',
														fields: [
															{
																kind: 'ObjectField',
																name: { kind: 'Name', value: 'structure' },
																value: {
																	kind: 'ObjectValue',
																	fields: [
																		{
																			kind: 'ObjectField',
																			name: { kind: 'Name', value: 'postalCode' },
																			value: {
																				kind: 'ObjectValue',
																				fields: [
																					{
																						kind: 'ObjectField',
																						name: { kind: 'Name', value: '_ilike' },
																						value: {
																							kind: 'Variable',
																							name: { kind: 'Name', value: 'search' },
																						},
																					},
																				],
																			},
																		},
																	],
																},
															},
														],
													},
												],
											},
										},
										{
											kind: 'ObjectField',
											name: { kind: 'Name', value: '_not' },
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
																	name: { kind: 'Name', value: '_in' },
																	value: {
																		kind: 'Variable',
																		name: { kind: 'Name', value: 'professionalIds' },
																	},
																},
															],
														},
													},
												],
											},
										},
									],
								},
							},
						],
						selectionSet: {
							kind: 'SelectionSet',
							selections: [
								{
									kind: 'Field',
									name: { kind: 'Name', value: 'aggregate' },
									selectionSet: {
										kind: 'SelectionSet',
										selections: [
											{
												kind: 'Field',
												name: { kind: 'Name', value: 'count' },
												arguments: [
													{
														kind: 'Argument',
														name: { kind: 'Name', value: 'distinct' },
														value: { kind: 'BooleanValue', value: false },
													},
												],
											},
										],
									},
								},
							],
						},
					},
				],
			},
		},
	],
} as unknown as DocumentNode<SearchProfessionalQuery, SearchProfessionalQueryVariables>;
export const UpdateNotebookAppointmentDocument = {
	kind: 'Document',
	definitions: [
		{
			kind: 'OperationDefinition',
			operation: 'mutation',
			name: { kind: 'Name', value: 'UpdateNotebookAppointment' },
			variableDefinitions: [
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'date' } },
					type: { kind: 'NamedType', name: { kind: 'Name', value: 'date' } },
				},
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'status' } },
					type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
				},
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
					type: {
						kind: 'NonNullType',
						type: { kind: 'NamedType', name: { kind: 'Name', value: 'uuid' } },
					},
				},
			],
			selectionSet: {
				kind: 'SelectionSet',
				selections: [
					{
						kind: 'Field',
						alias: { kind: 'Name', value: 'updateNotbookAppointment' },
						name: { kind: 'Name', value: 'update_notebook_appointment_by_pk' },
						arguments: [
							{
								kind: 'Argument',
								name: { kind: 'Name', value: 'pk_columns' },
								value: {
									kind: 'ObjectValue',
									fields: [
										{
											kind: 'ObjectField',
											name: { kind: 'Name', value: 'id' },
											value: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
										},
									],
								},
							},
							{
								kind: 'Argument',
								name: { kind: 'Name', value: '_set' },
								value: {
									kind: 'ObjectValue',
									fields: [
										{
											kind: 'ObjectField',
											name: { kind: 'Name', value: 'date' },
											value: { kind: 'Variable', name: { kind: 'Name', value: 'date' } },
										},
										{
											kind: 'ObjectField',
											name: { kind: 'Name', value: 'status' },
											value: { kind: 'Variable', name: { kind: 'Name', value: 'status' } },
										},
									],
								},
							},
						],
						selectionSet: {
							kind: 'SelectionSet',
							selections: [
								{ kind: 'Field', name: { kind: 'Name', value: 'id' } },
								{ kind: 'Field', name: { kind: 'Name', value: 'notebookId' } },
							],
						},
					},
				],
			},
		},
	],
} as unknown as DocumentNode<
	UpdateNotebookAppointmentMutation,
	UpdateNotebookAppointmentMutationVariables
>;
export const UpdateBeneficiaryPersonalInfoDocument = {
	kind: 'Document',
	definitions: [
		{
			kind: 'OperationDefinition',
			operation: 'mutation',
			name: { kind: 'Name', value: 'UpdateBeneficiaryPersonalInfo' },
			variableDefinitions: [
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
					type: {
						kind: 'NonNullType',
						type: { kind: 'NamedType', name: { kind: 'Name', value: 'uuid' } },
					},
				},
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'firstname' } },
					type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
				},
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'lastname' } },
					type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
				},
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'dateOfBirth' } },
					type: { kind: 'NamedType', name: { kind: 'Name', value: 'date' } },
				},
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'mobileNumber' } },
					type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
				},
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'email' } },
					type: { kind: 'NamedType', name: { kind: 'Name', value: 'citext' } },
				},
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'address1' } },
					type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
				},
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'address2' } },
					type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
				},
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'postalCode' } },
					type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
				},
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'city' } },
					type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
				},
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'peNumber' } },
					type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
				},
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'cafNumber' } },
					type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
				},
			],
			selectionSet: {
				kind: 'SelectionSet',
				selections: [
					{
						kind: 'Field',
						alias: { kind: 'Name', value: 'updateMember' },
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
														name: { kind: 'Name', value: 'beneficiaryId' },
														value: {
															kind: 'ObjectValue',
															fields: [
																{
																	kind: 'ObjectField',
																	name: { kind: 'Name', value: '_eq' },
																	value: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
																},
															],
														},
													},
												],
											},
										},
									],
								},
							},
							{
								kind: 'Argument',
								name: { kind: 'Name', value: '_set' },
								value: {
									kind: 'ObjectValue',
									fields: [
										{
											kind: 'ObjectField',
											name: { kind: 'Name', value: 'lastModifiedAt' },
											value: { kind: 'StringValue', value: 'now()', block: false },
										},
									],
								},
							},
						],
						selectionSet: {
							kind: 'SelectionSet',
							selections: [{ kind: 'Field', name: { kind: 'Name', value: 'affected_rows' } }],
						},
					},
					{
						kind: 'Field',
						alias: { kind: 'Name', value: 'update' },
						name: { kind: 'Name', value: 'update_beneficiary_by_pk' },
						arguments: [
							{
								kind: 'Argument',
								name: { kind: 'Name', value: 'pk_columns' },
								value: {
									kind: 'ObjectValue',
									fields: [
										{
											kind: 'ObjectField',
											name: { kind: 'Name', value: 'id' },
											value: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
										},
									],
								},
							},
							{
								kind: 'Argument',
								name: { kind: 'Name', value: '_set' },
								value: {
									kind: 'ObjectValue',
									fields: [
										{
											kind: 'ObjectField',
											name: { kind: 'Name', value: 'firstname' },
											value: { kind: 'Variable', name: { kind: 'Name', value: 'firstname' } },
										},
										{
											kind: 'ObjectField',
											name: { kind: 'Name', value: 'lastname' },
											value: { kind: 'Variable', name: { kind: 'Name', value: 'lastname' } },
										},
										{
											kind: 'ObjectField',
											name: { kind: 'Name', value: 'dateOfBirth' },
											value: { kind: 'Variable', name: { kind: 'Name', value: 'dateOfBirth' } },
										},
										{
											kind: 'ObjectField',
											name: { kind: 'Name', value: 'mobileNumber' },
											value: { kind: 'Variable', name: { kind: 'Name', value: 'mobileNumber' } },
										},
										{
											kind: 'ObjectField',
											name: { kind: 'Name', value: 'email' },
											value: { kind: 'Variable', name: { kind: 'Name', value: 'email' } },
										},
										{
											kind: 'ObjectField',
											name: { kind: 'Name', value: 'address1' },
											value: { kind: 'Variable', name: { kind: 'Name', value: 'address1' } },
										},
										{
											kind: 'ObjectField',
											name: { kind: 'Name', value: 'address2' },
											value: { kind: 'Variable', name: { kind: 'Name', value: 'address2' } },
										},
										{
											kind: 'ObjectField',
											name: { kind: 'Name', value: 'postalCode' },
											value: { kind: 'Variable', name: { kind: 'Name', value: 'postalCode' } },
										},
										{
											kind: 'ObjectField',
											name: { kind: 'Name', value: 'city' },
											value: { kind: 'Variable', name: { kind: 'Name', value: 'city' } },
										},
										{
											kind: 'ObjectField',
											name: { kind: 'Name', value: 'peNumber' },
											value: { kind: 'Variable', name: { kind: 'Name', value: 'peNumber' } },
										},
										{
											kind: 'ObjectField',
											name: { kind: 'Name', value: 'cafNumber' },
											value: { kind: 'Variable', name: { kind: 'Name', value: 'cafNumber' } },
										},
									],
								},
							},
						],
						selectionSet: {
							kind: 'SelectionSet',
							selections: [{ kind: 'Field', name: { kind: 'Name', value: 'id' } }],
						},
					},
				],
			},
		},
	],
} as unknown as DocumentNode<
	UpdateBeneficiaryPersonalInfoMutation,
	UpdateBeneficiaryPersonalInfoMutationVariables
>;
export const UpdateSocioProDocument = {
	kind: 'Document',
	definitions: [
		{
			kind: 'OperationDefinition',
			operation: 'mutation',
			name: { kind: 'Name', value: 'UpdateSocioPro' },
			variableDefinitions: [
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
					type: {
						kind: 'NonNullType',
						type: { kind: 'NamedType', name: { kind: 'Name', value: 'uuid' } },
					},
				},
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'workSituation' } },
					type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
				},
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'workSituationDate' } },
					type: { kind: 'NamedType', name: { kind: 'Name', value: 'date' } },
				},
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'rightRsa' } },
					type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
				},
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'rightAre' } },
					type: { kind: 'NamedType', name: { kind: 'Name', value: 'Boolean' } },
				},
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'rightAss' } },
					type: { kind: 'NamedType', name: { kind: 'Name', value: 'Boolean' } },
				},
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'rightRqth' } },
					type: { kind: 'NamedType', name: { kind: 'Name', value: 'Boolean' } },
				},
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'rightBonus' } },
					type: { kind: 'NamedType', name: { kind: 'Name', value: 'Boolean' } },
				},
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'geographicalArea' } },
					type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
				},
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'educationLevel' } },
					type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
				},
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'wantedJobs' } },
					type: {
						kind: 'NonNullType',
						type: {
							kind: 'ListType',
							type: {
								kind: 'NonNullType',
								type: {
									kind: 'NamedType',
									name: { kind: 'Name', value: 'wanted_job_insert_input' },
								},
							},
						},
					},
				},
			],
			selectionSet: {
				kind: 'SelectionSet',
				selections: [
					{
						kind: 'Field',
						alias: { kind: 'Name', value: 'update' },
						name: { kind: 'Name', value: 'update_notebook_by_pk' },
						arguments: [
							{
								kind: 'Argument',
								name: { kind: 'Name', value: 'pk_columns' },
								value: {
									kind: 'ObjectValue',
									fields: [
										{
											kind: 'ObjectField',
											name: { kind: 'Name', value: 'id' },
											value: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
										},
									],
								},
							},
							{
								kind: 'Argument',
								name: { kind: 'Name', value: '_set' },
								value: {
									kind: 'ObjectValue',
									fields: [
										{
											kind: 'ObjectField',
											name: { kind: 'Name', value: 'workSituation' },
											value: { kind: 'Variable', name: { kind: 'Name', value: 'workSituation' } },
										},
										{
											kind: 'ObjectField',
											name: { kind: 'Name', value: 'workSituationDate' },
											value: {
												kind: 'Variable',
												name: { kind: 'Name', value: 'workSituationDate' },
											},
										},
										{
											kind: 'ObjectField',
											name: { kind: 'Name', value: 'rightRsa' },
											value: { kind: 'Variable', name: { kind: 'Name', value: 'rightRsa' } },
										},
										{
											kind: 'ObjectField',
											name: { kind: 'Name', value: 'rightAre' },
											value: { kind: 'Variable', name: { kind: 'Name', value: 'rightAre' } },
										},
										{
											kind: 'ObjectField',
											name: { kind: 'Name', value: 'rightAss' },
											value: { kind: 'Variable', name: { kind: 'Name', value: 'rightAss' } },
										},
										{
											kind: 'ObjectField',
											name: { kind: 'Name', value: 'rightRqth' },
											value: { kind: 'Variable', name: { kind: 'Name', value: 'rightRqth' } },
										},
										{
											kind: 'ObjectField',
											name: { kind: 'Name', value: 'rightBonus' },
											value: { kind: 'Variable', name: { kind: 'Name', value: 'rightBonus' } },
										},
										{
											kind: 'ObjectField',
											name: { kind: 'Name', value: 'geographicalArea' },
											value: {
												kind: 'Variable',
												name: { kind: 'Name', value: 'geographicalArea' },
											},
										},
										{
											kind: 'ObjectField',
											name: { kind: 'Name', value: 'educationLevel' },
											value: { kind: 'Variable', name: { kind: 'Name', value: 'educationLevel' } },
										},
									],
								},
							},
						],
						selectionSet: {
							kind: 'SelectionSet',
							selections: [{ kind: 'Field', name: { kind: 'Name', value: 'id' } }],
						},
					},
					{
						kind: 'Field',
						name: { kind: 'Name', value: 'delete_wanted_job' },
						arguments: [
							{
								kind: 'Argument',
								name: { kind: 'Name', value: 'where' },
								value: {
									kind: 'ObjectValue',
									fields: [
										{
											kind: 'ObjectField',
											name: { kind: 'Name', value: 'notebook_id' },
											value: {
												kind: 'ObjectValue',
												fields: [
													{
														kind: 'ObjectField',
														name: { kind: 'Name', value: '_eq' },
														value: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
													},
												],
											},
										},
									],
								},
							},
						],
						selectionSet: {
							kind: 'SelectionSet',
							selections: [{ kind: 'Field', name: { kind: 'Name', value: 'affected_rows' } }],
						},
					},
					{
						kind: 'Field',
						name: { kind: 'Name', value: 'insert_wanted_job' },
						arguments: [
							{
								kind: 'Argument',
								name: { kind: 'Name', value: 'objects' },
								value: { kind: 'Variable', name: { kind: 'Name', value: 'wantedJobs' } },
							},
						],
						selectionSet: {
							kind: 'SelectionSet',
							selections: [{ kind: 'Field', name: { kind: 'Name', value: 'affected_rows' } }],
						},
					},
				],
			},
		},
	],
} as unknown as DocumentNode<UpdateSocioProMutation, UpdateSocioProMutationVariables>;
export const AddNotebookTargetDocument = {
	kind: 'Document',
	definitions: [
		{
			kind: 'OperationDefinition',
			operation: 'mutation',
			name: { kind: 'Name', value: 'AddNotebookTarget' },
			variableDefinitions: [
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'focusId' } },
					type: {
						kind: 'NonNullType',
						type: { kind: 'NamedType', name: { kind: 'Name', value: 'uuid' } },
					},
				},
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'target' } },
					type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
				},
			],
			selectionSet: {
				kind: 'SelectionSet',
				selections: [
					{
						kind: 'Field',
						name: { kind: 'Name', value: 'insert_notebook_target_one' },
						arguments: [
							{
								kind: 'Argument',
								name: { kind: 'Name', value: 'object' },
								value: {
									kind: 'ObjectValue',
									fields: [
										{
											kind: 'ObjectField',
											name: { kind: 'Name', value: 'focusId' },
											value: { kind: 'Variable', name: { kind: 'Name', value: 'focusId' } },
										},
										{
											kind: 'ObjectField',
											name: { kind: 'Name', value: 'target' },
											value: { kind: 'Variable', name: { kind: 'Name', value: 'target' } },
										},
									],
								},
							},
						],
						selectionSet: {
							kind: 'SelectionSet',
							selections: [{ kind: 'Field', name: { kind: 'Name', value: 'id' } }],
						},
					},
				],
			},
		},
	],
} as unknown as DocumentNode<AddNotebookTargetMutation, AddNotebookTargetMutationVariables>;
export const GetRefTargetByFocusDocument = {
	kind: 'Document',
	definitions: [
		{
			kind: 'OperationDefinition',
			operation: 'query',
			name: { kind: 'Name', value: 'GetRefTargetByFocus' },
			variableDefinitions: [
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'theme' } },
					type: {
						kind: 'NonNullType',
						type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
					},
				},
			],
			selectionSet: {
				kind: 'SelectionSet',
				selections: [
					{
						kind: 'Field',
						alias: { kind: 'Name', value: 'refTargets' },
						name: { kind: 'Name', value: 'ref_target' },
						arguments: [
							{
								kind: 'Argument',
								name: { kind: 'Name', value: 'where' },
								value: {
									kind: 'ObjectValue',
									fields: [
										{
											kind: 'ObjectField',
											name: { kind: 'Name', value: 'theme' },
											value: {
												kind: 'ObjectValue',
												fields: [
													{
														kind: 'ObjectField',
														name: { kind: 'Name', value: '_eq' },
														value: { kind: 'Variable', name: { kind: 'Name', value: 'theme' } },
													},
												],
											},
										},
									],
								},
							},
							{
								kind: 'Argument',
								name: { kind: 'Name', value: 'order_by' },
								value: {
									kind: 'ObjectValue',
									fields: [
										{
											kind: 'ObjectField',
											name: { kind: 'Name', value: 'description' },
											value: { kind: 'EnumValue', value: 'asc' },
										},
									],
								},
							},
						],
						selectionSet: {
							kind: 'SelectionSet',
							selections: [
								{ kind: 'Field', name: { kind: 'Name', value: 'id' } },
								{ kind: 'Field', name: { kind: 'Name', value: 'description' } },
							],
						},
					},
				],
			},
		},
	],
} as unknown as DocumentNode<GetRefTargetByFocusQuery, GetRefTargetByFocusQueryVariables>;
export const GetAccountByPkDocument = {
	kind: 'Document',
	definitions: [
		{
			kind: 'OperationDefinition',
			operation: 'query',
			name: { kind: 'Name', value: 'GetAccountByPk' },
			variableDefinitions: [
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'accountId' } },
					type: {
						kind: 'NonNullType',
						type: { kind: 'NamedType', name: { kind: 'Name', value: 'uuid' } },
					},
				},
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
								value: { kind: 'Variable', name: { kind: 'Name', value: 'accountId' } },
							},
						],
						selectionSet: {
							kind: 'SelectionSet',
							selections: [
								{ kind: 'Field', name: { kind: 'Name', value: 'id' } },
								{ kind: 'Field', name: { kind: 'Name', value: 'onboardingDone' } },
								{ kind: 'Field', name: { kind: 'Name', value: 'confirmed' } },
								{ kind: 'Field', name: { kind: 'Name', value: 'username' } },
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
											{ kind: 'Field', name: { kind: 'Name', value: 'mobileNumber' } },
											{ kind: 'Field', name: { kind: 'Name', value: 'dateOfBirth' } },
										],
									},
								},
								{
									kind: 'Field',
									name: { kind: 'Name', value: 'manager' },
									selectionSet: {
										kind: 'SelectionSet',
										selections: [
											{ kind: 'Field', name: { kind: 'Name', value: 'id' } },
											{ kind: 'Field', name: { kind: 'Name', value: 'email' } },
											{ kind: 'Field', name: { kind: 'Name', value: 'firstname' } },
											{ kind: 'Field', name: { kind: 'Name', value: 'lastname' } },
										],
									},
								},
								{
									kind: 'Field',
									name: { kind: 'Name', value: 'professional' },
									selectionSet: {
										kind: 'SelectionSet',
										selections: [
											{ kind: 'Field', name: { kind: 'Name', value: 'id' } },
											{ kind: 'Field', name: { kind: 'Name', value: 'firstname' } },
											{ kind: 'Field', name: { kind: 'Name', value: 'lastname' } },
											{ kind: 'Field', name: { kind: 'Name', value: 'mobileNumber' } },
											{ kind: 'Field', name: { kind: 'Name', value: 'email' } },
											{ kind: 'Field', name: { kind: 'Name', value: 'position' } },
											{
												kind: 'Field',
												name: { kind: 'Name', value: 'structure' },
												selectionSet: {
													kind: 'SelectionSet',
													selections: [
														{ kind: 'Field', name: { kind: 'Name', value: 'id' } },
														{ kind: 'Field', name: { kind: 'Name', value: 'name' } },
														{ kind: 'Field', name: { kind: 'Name', value: 'address1' } },
														{ kind: 'Field', name: { kind: 'Name', value: 'address2' } },
														{ kind: 'Field', name: { kind: 'Name', value: 'postalCode' } },
														{ kind: 'Field', name: { kind: 'Name', value: 'city' } },
														{ kind: 'Field', name: { kind: 'Name', value: 'website' } },
														{
															kind: 'Field',
															name: { kind: 'Name', value: 'deployment' },
															selectionSet: {
																kind: 'SelectionSet',
																selections: [
																	{ kind: 'Field', name: { kind: 'Name', value: 'label' } },
																],
															},
														},
													],
												},
											},
										],
									},
								},
								{
									kind: 'Field',
									name: { kind: 'Name', value: 'admin_structure' },
									selectionSet: {
										kind: 'SelectionSet',
										selections: [
											{ kind: 'Field', name: { kind: 'Name', value: 'id' } },
											{ kind: 'Field', name: { kind: 'Name', value: 'email' } },
											{ kind: 'Field', name: { kind: 'Name', value: 'firstname' } },
											{ kind: 'Field', name: { kind: 'Name', value: 'lastname' } },
											{ kind: 'Field', name: { kind: 'Name', value: 'phoneNumbers' } },
										],
									},
								},
							],
						},
					},
				],
			},
		},
	],
} as unknown as DocumentNode<GetAccountByPkQuery, GetAccountByPkQueryVariables>;
export const CreateDeploymentFromApiDocument = {
	kind: 'Document',
	definitions: [
		{
			kind: 'OperationDefinition',
			operation: 'mutation',
			name: { kind: 'Name', value: 'CreateDeploymentFromApi' },
			variableDefinitions: [
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'object' } },
					type: {
						kind: 'NonNullType',
						type: { kind: 'NamedType', name: { kind: 'Name', value: 'deployment_insert_input' } },
					},
				},
			],
			selectionSet: {
				kind: 'SelectionSet',
				selections: [
					{
						kind: 'Field',
						name: { kind: 'Name', value: 'insert_deployment_one' },
						arguments: [
							{
								kind: 'Argument',
								name: { kind: 'Name', value: 'object' },
								value: { kind: 'Variable', name: { kind: 'Name', value: 'object' } },
							},
						],
						selectionSet: {
							kind: 'SelectionSet',
							selections: [
								{ kind: 'Field', name: { kind: 'Name', value: 'id' } },
								{ kind: 'Field', name: { kind: 'Name', value: 'label' } },
								{
									kind: 'Field',
									name: { kind: 'Name', value: 'managers' },
									selectionSet: {
										kind: 'SelectionSet',
										selections: [
											{
												kind: 'Field',
												name: { kind: 'Name', value: 'account' },
												selectionSet: {
													kind: 'SelectionSet',
													selections: [{ kind: 'Field', name: { kind: 'Name', value: 'id' } }],
												},
											},
										],
									},
								},
							],
						},
					},
				],
			},
		},
	],
} as unknown as DocumentNode<
	CreateDeploymentFromApiMutation,
	CreateDeploymentFromApiMutationVariables
>;
export const ListDeploymentIdDocument = {
	kind: 'Document',
	definitions: [
		{
			kind: 'OperationDefinition',
			operation: 'query',
			name: { kind: 'Name', value: 'ListDeploymentId' },
			selectionSet: {
				kind: 'SelectionSet',
				selections: [
					{
						kind: 'Field',
						alias: { kind: 'Name', value: 'deployments' },
						name: { kind: 'Name', value: 'deployment' },
						arguments: [
							{
								kind: 'Argument',
								name: { kind: 'Name', value: 'order_by' },
								value: {
									kind: 'ObjectValue',
									fields: [
										{
											kind: 'ObjectField',
											name: { kind: 'Name', value: 'createdAt' },
											value: { kind: 'EnumValue', value: 'desc' },
										},
									],
								},
							},
						],
						selectionSet: {
							kind: 'SelectionSet',
							selections: [{ kind: 'Field', name: { kind: 'Name', value: 'id' } }],
						},
					},
				],
			},
		},
	],
} as unknown as DocumentNode<ListDeploymentIdQuery, ListDeploymentIdQueryVariables>;
export const GetDeploymentStatForDayDocument = {
	kind: 'Document',
	definitions: [
		{
			kind: 'OperationDefinition',
			operation: 'query',
			name: { kind: 'Name', value: 'GetDeploymentStatForDay' },
			variableDefinitions: [
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'day' } },
					type: {
						kind: 'NonNullType',
						type: { kind: 'NamedType', name: { kind: 'Name', value: 'timestamptz' } },
					},
				},
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'last30Days' } },
					type: {
						kind: 'NonNullType',
						type: { kind: 'NamedType', name: { kind: 'Name', value: 'timestamptz' } },
					},
				},
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'deploymentId' } },
					type: {
						kind: 'NonNullType',
						type: { kind: 'NamedType', name: { kind: 'Name', value: 'uuid' } },
					},
				},
			],
			selectionSet: {
				kind: 'SelectionSet',
				selections: [
					{
						kind: 'Field',
						alias: { kind: 'Name', value: 'nbNotebooks' },
						name: { kind: 'Name', value: 'notebook_aggregate' },
						arguments: [
							{
								kind: 'Argument',
								name: { kind: 'Name', value: 'where' },
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
														name: { kind: 'Name', value: 'deploymentId' },
														value: {
															kind: 'ObjectValue',
															fields: [
																{
																	kind: 'ObjectField',
																	name: { kind: 'Name', value: '_eq' },
																	value: {
																		kind: 'Variable',
																		name: { kind: 'Name', value: 'deploymentId' },
																	},
																},
															],
														},
													},
												],
											},
										},
									],
								},
							},
						],
						selectionSet: {
							kind: 'SelectionSet',
							selections: [
								{
									kind: 'Field',
									name: { kind: 'Name', value: 'aggregate' },
									selectionSet: {
										kind: 'SelectionSet',
										selections: [{ kind: 'Field', name: { kind: 'Name', value: 'count' } }],
									},
								},
							],
						},
					},
					{
						kind: 'Field',
						alias: { kind: 'Name', value: 'nbStructures' },
						name: { kind: 'Name', value: 'structure_aggregate' },
						arguments: [
							{
								kind: 'Argument',
								name: { kind: 'Name', value: 'where' },
								value: {
									kind: 'ObjectValue',
									fields: [
										{
											kind: 'ObjectField',
											name: { kind: 'Name', value: 'deploymentId' },
											value: {
												kind: 'ObjectValue',
												fields: [
													{
														kind: 'ObjectField',
														name: { kind: 'Name', value: '_eq' },
														value: {
															kind: 'Variable',
															name: { kind: 'Name', value: 'deploymentId' },
														},
													},
												],
											},
										},
									],
								},
							},
						],
						selectionSet: {
							kind: 'SelectionSet',
							selections: [
								{
									kind: 'Field',
									name: { kind: 'Name', value: 'aggregate' },
									selectionSet: {
										kind: 'SelectionSet',
										selections: [{ kind: 'Field', name: { kind: 'Name', value: 'count' } }],
									},
								},
							],
						},
					},
					{
						kind: 'Field',
						alias: { kind: 'Name', value: 'nbProfessionals' },
						name: { kind: 'Name', value: 'professional_aggregate' },
						arguments: [
							{
								kind: 'Argument',
								name: { kind: 'Name', value: 'where' },
								value: {
									kind: 'ObjectValue',
									fields: [
										{
											kind: 'ObjectField',
											name: { kind: 'Name', value: 'structure' },
											value: {
												kind: 'ObjectValue',
												fields: [
													{
														kind: 'ObjectField',
														name: { kind: 'Name', value: 'deploymentId' },
														value: {
															kind: 'ObjectValue',
															fields: [
																{
																	kind: 'ObjectField',
																	name: { kind: 'Name', value: '_eq' },
																	value: {
																		kind: 'Variable',
																		name: { kind: 'Name', value: 'deploymentId' },
																	},
																},
															],
														},
													},
												],
											},
										},
									],
								},
							},
						],
						selectionSet: {
							kind: 'SelectionSet',
							selections: [
								{
									kind: 'Field',
									name: { kind: 'Name', value: 'aggregate' },
									selectionSet: {
										kind: 'SelectionSet',
										selections: [{ kind: 'Field', name: { kind: 'Name', value: 'count' } }],
									},
								},
							],
						},
					},
					{
						kind: 'Field',
						alias: { kind: 'Name', value: 'nbNotebookWithActions' },
						name: { kind: 'Name', value: 'notebook_aggregate' },
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
																name: { kind: 'Name', value: 'focuses' },
																value: {
																	kind: 'ObjectValue',
																	fields: [
																		{
																			kind: 'ObjectField',
																			name: { kind: 'Name', value: 'targets' },
																			value: { kind: 'ObjectValue', fields: [] },
																		},
																	],
																},
															},
														],
													},
													{
														kind: 'ObjectValue',
														fields: [
															{
																kind: 'ObjectField',
																name: { kind: 'Name', value: 'focuses' },
																value: {
																	kind: 'ObjectValue',
																	fields: [
																		{
																			kind: 'ObjectField',
																			name: { kind: 'Name', value: 'targets' },
																			value: {
																				kind: 'ObjectValue',
																				fields: [
																					{
																						kind: 'ObjectField',
																						name: { kind: 'Name', value: 'actions' },
																						value: { kind: 'ObjectValue', fields: [] },
																					},
																				],
																			},
																		},
																	],
																},
															},
														],
													},
												],
											},
										},
									],
								},
							},
						],
						selectionSet: {
							kind: 'SelectionSet',
							selections: [
								{
									kind: 'Field',
									name: { kind: 'Name', value: 'aggregate' },
									selectionSet: {
										kind: 'SelectionSet',
										selections: [{ kind: 'Field', name: { kind: 'Name', value: 'count' } }],
									},
								},
							],
						},
					},
					{
						kind: 'Field',
						alias: { kind: 'Name', value: 'nbNotebookModifiedSince30d' },
						name: { kind: 'Name', value: 'notebook_aggregate' },
						arguments: [
							{
								kind: 'Argument',
								name: { kind: 'Name', value: 'where' },
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
														name: { kind: 'Name', value: 'deploymentId' },
														value: {
															kind: 'ObjectValue',
															fields: [
																{
																	kind: 'ObjectField',
																	name: { kind: 'Name', value: '_eq' },
																	value: {
																		kind: 'Variable',
																		name: { kind: 'Name', value: 'deploymentId' },
																	},
																},
															],
														},
													},
												],
											},
										},
										{
											kind: 'ObjectField',
											name: { kind: 'Name', value: 'members' },
											value: {
												kind: 'ObjectValue',
												fields: [
													{
														kind: 'ObjectField',
														name: { kind: 'Name', value: 'lastModifiedAt' },
														value: {
															kind: 'ObjectValue',
															fields: [
																{
																	kind: 'ObjectField',
																	name: { kind: 'Name', value: '_gte' },
																	value: {
																		kind: 'Variable',
																		name: { kind: 'Name', value: 'last30Days' },
																	},
																},
															],
														},
													},
												],
											},
										},
									],
								},
							},
						],
						selectionSet: {
							kind: 'SelectionSet',
							selections: [
								{
									kind: 'Field',
									name: { kind: 'Name', value: 'aggregate' },
									selectionSet: {
										kind: 'SelectionSet',
										selections: [{ kind: 'Field', name: { kind: 'Name', value: 'count' } }],
									},
								},
							],
						},
					},
					{
						kind: 'Field',
						alias: { kind: 'Name', value: 'nbNotebookCreatedToday' },
						name: { kind: 'Name', value: 'notebook_aggregate' },
						arguments: [
							{
								kind: 'Argument',
								name: { kind: 'Name', value: 'where' },
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
														name: { kind: 'Name', value: 'deploymentId' },
														value: {
															kind: 'ObjectValue',
															fields: [
																{
																	kind: 'ObjectField',
																	name: { kind: 'Name', value: '_eq' },
																	value: {
																		kind: 'Variable',
																		name: { kind: 'Name', value: 'deploymentId' },
																	},
																},
															],
														},
													},
												],
											},
										},
										{
											kind: 'ObjectField',
											name: { kind: 'Name', value: 'createdAt' },
											value: {
												kind: 'ObjectValue',
												fields: [
													{
														kind: 'ObjectField',
														name: { kind: 'Name', value: '_gte' },
														value: { kind: 'Variable', name: { kind: 'Name', value: 'day' } },
													},
												],
											},
										},
									],
								},
							},
						],
						selectionSet: {
							kind: 'SelectionSet',
							selections: [
								{
									kind: 'Field',
									name: { kind: 'Name', value: 'aggregate' },
									selectionSet: {
										kind: 'SelectionSet',
										selections: [{ kind: 'Field', name: { kind: 'Name', value: 'count' } }],
									},
								},
							],
						},
					},
					{
						kind: 'Field',
						alias: { kind: 'Name', value: 'nbNotebookVisitedToday' },
						name: { kind: 'Name', value: 'notebook_aggregate' },
						arguments: [
							{
								kind: 'Argument',
								name: { kind: 'Name', value: 'where' },
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
														name: { kind: 'Name', value: 'deploymentId' },
														value: {
															kind: 'ObjectValue',
															fields: [
																{
																	kind: 'ObjectField',
																	name: { kind: 'Name', value: '_eq' },
																	value: {
																		kind: 'Variable',
																		name: { kind: 'Name', value: 'deploymentId' },
																	},
																},
															],
														},
													},
												],
											},
										},
										{
											kind: 'ObjectField',
											name: { kind: 'Name', value: 'members' },
											value: {
												kind: 'ObjectValue',
												fields: [
													{
														kind: 'ObjectField',
														name: { kind: 'Name', value: 'lastVisitedAt' },
														value: {
															kind: 'ObjectValue',
															fields: [
																{
																	kind: 'ObjectField',
																	name: { kind: 'Name', value: '_gte' },
																	value: { kind: 'Variable', name: { kind: 'Name', value: 'day' } },
																},
															],
														},
													},
												],
											},
										},
									],
								},
							},
						],
						selectionSet: {
							kind: 'SelectionSet',
							selections: [
								{
									kind: 'Field',
									name: { kind: 'Name', value: 'aggregate' },
									selectionSet: {
										kind: 'SelectionSet',
										selections: [{ kind: 'Field', name: { kind: 'Name', value: 'count' } }],
									},
								},
							],
						},
					},
					{
						kind: 'Field',
						alias: { kind: 'Name', value: 'nbNotebookModifiedToday' },
						name: { kind: 'Name', value: 'notebook_aggregate' },
						arguments: [
							{
								kind: 'Argument',
								name: { kind: 'Name', value: 'where' },
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
														name: { kind: 'Name', value: 'deploymentId' },
														value: {
															kind: 'ObjectValue',
															fields: [
																{
																	kind: 'ObjectField',
																	name: { kind: 'Name', value: '_eq' },
																	value: {
																		kind: 'Variable',
																		name: { kind: 'Name', value: 'deploymentId' },
																	},
																},
															],
														},
													},
												],
											},
										},
										{
											kind: 'ObjectField',
											name: { kind: 'Name', value: 'members' },
											value: {
												kind: 'ObjectValue',
												fields: [
													{
														kind: 'ObjectField',
														name: { kind: 'Name', value: 'lastModifiedAt' },
														value: {
															kind: 'ObjectValue',
															fields: [
																{
																	kind: 'ObjectField',
																	name: { kind: 'Name', value: '_gte' },
																	value: { kind: 'Variable', name: { kind: 'Name', value: 'day' } },
																},
															],
														},
													},
												],
											},
										},
									],
								},
							},
						],
						selectionSet: {
							kind: 'SelectionSet',
							selections: [
								{
									kind: 'Field',
									name: { kind: 'Name', value: 'aggregate' },
									selectionSet: {
										kind: 'SelectionSet',
										selections: [{ kind: 'Field', name: { kind: 'Name', value: 'count' } }],
									},
								},
							],
						},
					},
					{
						kind: 'Field',
						alias: { kind: 'Name', value: 'nbNotbookWith2MembersOrMore' },
						name: { kind: 'Name', value: 'notebook_aggregate' },
						arguments: [
							{
								kind: 'Argument',
								name: { kind: 'Name', value: 'where' },
								value: {
									kind: 'ObjectValue',
									fields: [
										{
											kind: 'ObjectField',
											name: { kind: 'Name', value: 'nbMembers' },
											value: {
												kind: 'ObjectValue',
												fields: [
													{
														kind: 'ObjectField',
														name: { kind: 'Name', value: '_gte' },
														value: { kind: 'IntValue', value: '2' },
													},
												],
											},
										},
										{
											kind: 'ObjectField',
											name: { kind: 'Name', value: 'beneficiary' },
											value: {
												kind: 'ObjectValue',
												fields: [
													{
														kind: 'ObjectField',
														name: { kind: 'Name', value: 'deploymentId' },
														value: {
															kind: 'ObjectValue',
															fields: [
																{
																	kind: 'ObjectField',
																	name: { kind: 'Name', value: '_eq' },
																	value: {
																		kind: 'Variable',
																		name: { kind: 'Name', value: 'deploymentId' },
																	},
																},
															],
														},
													},
												],
											},
										},
									],
								},
							},
						],
						selectionSet: {
							kind: 'SelectionSet',
							selections: [
								{
									kind: 'Field',
									name: { kind: 'Name', value: 'aggregate' },
									selectionSet: {
										kind: 'SelectionSet',
										selections: [{ kind: 'Field', name: { kind: 'Name', value: 'count' } }],
									},
								},
							],
						},
					},
					{
						kind: 'Field',
						alias: { kind: 'Name', value: 'nbNotebookWithActionsCreated' },
						name: { kind: 'Name', value: 'notebook_aggregate' },
						arguments: [
							{
								kind: 'Argument',
								name: { kind: 'Name', value: 'where' },
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
														name: { kind: 'Name', value: 'deploymentId' },
														value: {
															kind: 'ObjectValue',
															fields: [
																{
																	kind: 'ObjectField',
																	name: { kind: 'Name', value: '_eq' },
																	value: {
																		kind: 'Variable',
																		name: { kind: 'Name', value: 'deploymentId' },
																	},
																},
															],
														},
													},
												],
											},
										},
										{
											kind: 'ObjectField',
											name: { kind: 'Name', value: 'focuses' },
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
																			name: { kind: 'Name', value: 'createdAt' },
																			value: {
																				kind: 'ObjectValue',
																				fields: [
																					{
																						kind: 'ObjectField',
																						name: { kind: 'Name', value: '_gte' },
																						value: {
																							kind: 'Variable',
																							name: { kind: 'Name', value: 'day' },
																						},
																					},
																				],
																			},
																		},
																	],
																},
																{
																	kind: 'ObjectValue',
																	fields: [
																		{
																			kind: 'ObjectField',
																			name: { kind: 'Name', value: 'targets' },
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
																											name: { kind: 'Name', value: 'createdAt' },
																											value: {
																												kind: 'ObjectValue',
																												fields: [
																													{
																														kind: 'ObjectField',
																														name: { kind: 'Name', value: '_gte' },
																														value: {
																															kind: 'Variable',
																															name: { kind: 'Name', value: 'day' },
																														},
																													},
																												],
																											},
																										},
																									],
																								},
																								{
																									kind: 'ObjectValue',
																									fields: [
																										{
																											kind: 'ObjectField',
																											name: { kind: 'Name', value: 'actions' },
																											value: {
																												kind: 'ObjectValue',
																												fields: [
																													{
																														kind: 'ObjectField',
																														name: {
																															kind: 'Name',
																															value: 'createdAt',
																														},
																														value: {
																															kind: 'ObjectValue',
																															fields: [
																																{
																																	kind: 'ObjectField',
																																	name: {
																																		kind: 'Name',
																																		value: '_gte',
																																	},
																																	value: {
																																		kind: 'Variable',
																																		name: {
																																			kind: 'Name',
																																			value: 'day',
																																		},
																																	},
																																},
																															],
																														},
																													},
																												],
																											},
																										},
																									],
																								},
																							],
																						},
																					},
																				],
																			},
																		},
																	],
																},
															],
														},
													},
												],
											},
										},
									],
								},
							},
						],
						selectionSet: {
							kind: 'SelectionSet',
							selections: [
								{
									kind: 'Field',
									name: { kind: 'Name', value: 'aggregate' },
									selectionSet: {
										kind: 'SelectionSet',
										selections: [{ kind: 'Field', name: { kind: 'Name', value: 'count' } }],
									},
								},
							],
						},
					},
				],
			},
		},
	],
} as unknown as DocumentNode<GetDeploymentStatForDayQuery, GetDeploymentStatForDayQueryVariables>;
export const GetExistingAdminStructureDocument = {
	kind: 'Document',
	definitions: [
		{
			kind: 'OperationDefinition',
			operation: 'query',
			name: { kind: 'Name', value: 'GetExistingAdminStructure' },
			variableDefinitions: [
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'email' } },
					type: {
						kind: 'NonNullType',
						type: { kind: 'NamedType', name: { kind: 'Name', value: 'citext' } },
					},
				},
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'name' } },
					type: {
						kind: 'NonNullType',
						type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
					},
				},
			],
			selectionSet: {
				kind: 'SelectionSet',
				selections: [
					{
						kind: 'Field',
						alias: { kind: 'Name', value: 'admin' },
						name: { kind: 'Name', value: 'admin_structure' },
						arguments: [
							{
								kind: 'Argument',
								name: { kind: 'Name', value: 'where' },
								value: {
									kind: 'ObjectValue',
									fields: [
										{
											kind: 'ObjectField',
											name: { kind: 'Name', value: 'email' },
											value: {
												kind: 'ObjectValue',
												fields: [
													{
														kind: 'ObjectField',
														name: { kind: 'Name', value: '_eq' },
														value: { kind: 'Variable', name: { kind: 'Name', value: 'email' } },
													},
												],
											},
										},
									],
								},
							},
						],
						selectionSet: {
							kind: 'SelectionSet',
							selections: [
								{ kind: 'Field', name: { kind: 'Name', value: 'id' } },
								{
									kind: 'Field',
									name: { kind: 'Name', value: 'account' },
									selectionSet: {
										kind: 'SelectionSet',
										selections: [{ kind: 'Field', name: { kind: 'Name', value: 'id' } }],
									},
								},
							],
						},
					},
					{
						kind: 'Field',
						alias: { kind: 'Name', value: 'structure' },
						name: { kind: 'Name', value: 'structure' },
						arguments: [
							{
								kind: 'Argument',
								name: { kind: 'Name', value: 'where' },
								value: {
									kind: 'ObjectValue',
									fields: [
										{
											kind: 'ObjectField',
											name: { kind: 'Name', value: 'name' },
											value: {
												kind: 'ObjectValue',
												fields: [
													{
														kind: 'ObjectField',
														name: { kind: 'Name', value: '_eq' },
														value: { kind: 'Variable', name: { kind: 'Name', value: 'name' } },
													},
												],
											},
										},
									],
								},
							},
						],
						selectionSet: {
							kind: 'SelectionSet',
							selections: [{ kind: 'Field', name: { kind: 'Name', value: 'id' } }],
						},
					},
				],
			},
		},
	],
} as unknown as DocumentNode<
	GetExistingAdminStructureQuery,
	GetExistingAdminStructureQueryVariables
>;
export const GetNotebookInfoDocument = {
	kind: 'Document',
	definitions: [
		{
			kind: 'OperationDefinition',
			operation: 'query',
			name: { kind: 'Name', value: 'GetNotebookInfo' },
			variableDefinitions: [
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
					type: {
						kind: 'NonNullType',
						type: { kind: 'NamedType', name: { kind: 'Name', value: 'uuid' } },
					},
				},
			],
			selectionSet: {
				kind: 'SelectionSet',
				selections: [
					{
						kind: 'Field',
						alias: { kind: 'Name', value: 'notebook' },
						name: { kind: 'Name', value: 'notebook_by_pk' },
						arguments: [
							{
								kind: 'Argument',
								name: { kind: 'Name', value: 'id' },
								value: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
							},
						],
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
											{ kind: 'Field', name: { kind: 'Name', value: 'dateOfBirth' } },
											{
												kind: 'Field',
												name: { kind: 'Name', value: 'deployment' },
												selectionSet: {
													kind: 'SelectionSet',
													selections: [{ kind: 'Field', name: { kind: 'Name', value: 'config' } }],
												},
											},
										],
									},
								},
								{
									kind: 'Field',
									name: { kind: 'Name', value: 'focuses' },
									selectionSet: {
										kind: 'SelectionSet',
										selections: [
											{ kind: 'Field', name: { kind: 'Name', value: 'id' } },
											{ kind: 'Field', name: { kind: 'Name', value: 'theme' } },
											{ kind: 'Field', name: { kind: 'Name', value: 'linkedTo' } },
											{
												kind: 'Field',
												name: { kind: 'Name', value: 'targets' },
												selectionSet: {
													kind: 'SelectionSet',
													selections: [
														{ kind: 'Field', name: { kind: 'Name', value: 'id' } },
														{ kind: 'Field', name: { kind: 'Name', value: 'target' } },
														{
															kind: 'Field',
															name: { kind: 'Name', value: 'actions' },
															selectionSet: {
																kind: 'SelectionSet',
																selections: [
																	{ kind: 'Field', name: { kind: 'Name', value: 'initialId' } },
																],
															},
														},
													],
												},
											},
										],
									},
								},
								{
									kind: 'Field',
									name: { kind: 'Name', value: 'members' },
									arguments: [
										{
											kind: 'Argument',
											name: { kind: 'Name', value: 'where' },
											value: {
												kind: 'ObjectValue',
												fields: [
													{
														kind: 'ObjectField',
														name: { kind: 'Name', value: 'memberType' },
														value: {
															kind: 'ObjectValue',
															fields: [
																{
																	kind: 'ObjectField',
																	name: { kind: 'Name', value: '_eq' },
																	value: { kind: 'StringValue', value: 'referent', block: false },
																},
															],
														},
													},
												],
											},
										},
									],
									selectionSet: {
										kind: 'SelectionSet',
										selections: [{ kind: 'Field', name: { kind: 'Name', value: 'accountId' } }],
									},
								},
							],
						},
					},
				],
			},
		},
	],
} as unknown as DocumentNode<GetNotebookInfoQuery, GetNotebookInfoQueryVariables>;
export const InsertAccountAdminStructureDocument = {
	kind: 'Document',
	definitions: [
		{
			kind: 'OperationDefinition',
			operation: 'mutation',
			name: { kind: 'Name', value: 'InsertAccountAdminStructure' },
			variableDefinitions: [
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'username' } },
					type: {
						kind: 'NonNullType',
						type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
					},
				},
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'accessKey' } },
					type: {
						kind: 'NonNullType',
						type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
					},
				},
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'accessKeyDate' } },
					type: {
						kind: 'NonNullType',
						type: { kind: 'NamedType', name: { kind: 'Name', value: 'timestamptz' } },
					},
				},
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'adminEmail' } },
					type: {
						kind: 'NonNullType',
						type: { kind: 'NamedType', name: { kind: 'Name', value: 'citext' } },
					},
				},
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'firstname' } },
					type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
				},
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'lastname' } },
					type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
				},
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'position' } },
					type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
				},
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'phoneNumbers' } },
					type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
				},
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'structureId' } },
					type: {
						kind: 'NonNullType',
						type: { kind: 'NamedType', name: { kind: 'Name', value: 'uuid' } },
					},
				},
			],
			selectionSet: {
				kind: 'SelectionSet',
				selections: [
					{
						kind: 'Field',
						alias: { kind: 'Name', value: 'account' },
						name: { kind: 'Name', value: 'insert_account_one' },
						arguments: [
							{
								kind: 'Argument',
								name: { kind: 'Name', value: 'object' },
								value: {
									kind: 'ObjectValue',
									fields: [
										{
											kind: 'ObjectField',
											name: { kind: 'Name', value: 'username' },
											value: { kind: 'Variable', name: { kind: 'Name', value: 'username' } },
										},
										{
											kind: 'ObjectField',
											name: { kind: 'Name', value: 'type' },
											value: { kind: 'StringValue', value: 'admin_structure', block: false },
										},
										{
											kind: 'ObjectField',
											name: { kind: 'Name', value: 'accessKey' },
											value: { kind: 'Variable', name: { kind: 'Name', value: 'accessKey' } },
										},
										{
											kind: 'ObjectField',
											name: { kind: 'Name', value: 'accessKeyDate' },
											value: { kind: 'Variable', name: { kind: 'Name', value: 'accessKeyDate' } },
										},
										{
											kind: 'ObjectField',
											name: { kind: 'Name', value: 'admin_structure' },
											value: {
												kind: 'ObjectValue',
												fields: [
													{
														kind: 'ObjectField',
														name: { kind: 'Name', value: 'data' },
														value: {
															kind: 'ObjectValue',
															fields: [
																{
																	kind: 'ObjectField',
																	name: { kind: 'Name', value: 'email' },
																	value: {
																		kind: 'Variable',
																		name: { kind: 'Name', value: 'adminEmail' },
																	},
																},
																{
																	kind: 'ObjectField',
																	name: { kind: 'Name', value: 'firstname' },
																	value: {
																		kind: 'Variable',
																		name: { kind: 'Name', value: 'firstname' },
																	},
																},
																{
																	kind: 'ObjectField',
																	name: { kind: 'Name', value: 'lastname' },
																	value: {
																		kind: 'Variable',
																		name: { kind: 'Name', value: 'lastname' },
																	},
																},
																{
																	kind: 'ObjectField',
																	name: { kind: 'Name', value: 'position' },
																	value: {
																		kind: 'Variable',
																		name: { kind: 'Name', value: 'position' },
																	},
																},
																{
																	kind: 'ObjectField',
																	name: { kind: 'Name', value: 'phoneNumbers' },
																	value: {
																		kind: 'Variable',
																		name: { kind: 'Name', value: 'phoneNumbers' },
																	},
																},
																{
																	kind: 'ObjectField',
																	name: { kind: 'Name', value: 'structures' },
																	value: {
																		kind: 'ObjectValue',
																		fields: [
																			{
																				kind: 'ObjectField',
																				name: { kind: 'Name', value: 'data' },
																				value: {
																					kind: 'ObjectValue',
																					fields: [
																						{
																							kind: 'ObjectField',
																							name: { kind: 'Name', value: 'structureId' },
																							value: {
																								kind: 'Variable',
																								name: { kind: 'Name', value: 'structureId' },
																							},
																						},
																					],
																				},
																			},
																		],
																	},
																},
															],
														},
													},
												],
											},
										},
									],
								},
							},
						],
						selectionSet: {
							kind: 'SelectionSet',
							selections: [
								{ kind: 'Field', name: { kind: 'Name', value: 'accessKey' } },
								{
									kind: 'Field',
									name: { kind: 'Name', value: 'admin_structure' },
									selectionSet: {
										kind: 'SelectionSet',
										selections: [
											{ kind: 'Field', name: { kind: 'Name', value: 'id' } },
											{ kind: 'Field', name: { kind: 'Name', value: 'email' } },
											{ kind: 'Field', name: { kind: 'Name', value: 'firstname' } },
											{ kind: 'Field', name: { kind: 'Name', value: 'lastname' } },
										],
									},
								},
							],
						},
					},
				],
			},
		},
	],
} as unknown as DocumentNode<
	InsertAccountAdminStructureMutation,
	InsertAccountAdminStructureMutationVariables
>;
export const InsertStructureDocument = {
	kind: 'Document',
	definitions: [
		{
			kind: 'OperationDefinition',
			operation: 'mutation',
			name: { kind: 'Name', value: 'InsertStructure' },
			variableDefinitions: [
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'name' } },
					type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
				},
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'phone' } },
					type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
				},
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'email' } },
					type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
				},
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'address1' } },
					type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
				},
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'address2' } },
					type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
				},
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'postalCode' } },
					type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
				},
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'city' } },
					type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
				},
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'website' } },
					type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
				},
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'siret' } },
					type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
				},
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'shortDesc' } },
					type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
				},
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'onConflict' } },
					type: { kind: 'NamedType', name: { kind: 'Name', value: 'structure_on_conflict' } },
				},
			],
			selectionSet: {
				kind: 'SelectionSet',
				selections: [
					{
						kind: 'Field',
						alias: { kind: 'Name', value: 'structure' },
						name: { kind: 'Name', value: 'insert_structure_one' },
						arguments: [
							{
								kind: 'Argument',
								name: { kind: 'Name', value: 'on_conflict' },
								value: { kind: 'Variable', name: { kind: 'Name', value: 'onConflict' } },
							},
							{
								kind: 'Argument',
								name: { kind: 'Name', value: 'object' },
								value: {
									kind: 'ObjectValue',
									fields: [
										{
											kind: 'ObjectField',
											name: { kind: 'Name', value: 'name' },
											value: { kind: 'Variable', name: { kind: 'Name', value: 'name' } },
										},
										{
											kind: 'ObjectField',
											name: { kind: 'Name', value: 'phone' },
											value: { kind: 'Variable', name: { kind: 'Name', value: 'phone' } },
										},
										{
											kind: 'ObjectField',
											name: { kind: 'Name', value: 'email' },
											value: { kind: 'Variable', name: { kind: 'Name', value: 'email' } },
										},
										{
											kind: 'ObjectField',
											name: { kind: 'Name', value: 'address1' },
											value: { kind: 'Variable', name: { kind: 'Name', value: 'address1' } },
										},
										{
											kind: 'ObjectField',
											name: { kind: 'Name', value: 'address2' },
											value: { kind: 'Variable', name: { kind: 'Name', value: 'address2' } },
										},
										{
											kind: 'ObjectField',
											name: { kind: 'Name', value: 'postalCode' },
											value: { kind: 'Variable', name: { kind: 'Name', value: 'postalCode' } },
										},
										{
											kind: 'ObjectField',
											name: { kind: 'Name', value: 'city' },
											value: { kind: 'Variable', name: { kind: 'Name', value: 'city' } },
										},
										{
											kind: 'ObjectField',
											name: { kind: 'Name', value: 'website' },
											value: { kind: 'Variable', name: { kind: 'Name', value: 'website' } },
										},
										{
											kind: 'ObjectField',
											name: { kind: 'Name', value: 'siret' },
											value: { kind: 'Variable', name: { kind: 'Name', value: 'siret' } },
										},
										{
											kind: 'ObjectField',
											name: { kind: 'Name', value: 'shortDesc' },
											value: { kind: 'Variable', name: { kind: 'Name', value: 'shortDesc' } },
										},
									],
								},
							},
						],
						selectionSet: {
							kind: 'SelectionSet',
							selections: [{ kind: 'Field', name: { kind: 'Name', value: 'id' } }],
						},
					},
				],
			},
		},
	],
} as unknown as DocumentNode<InsertStructureMutation, InsertStructureMutationVariables>;
export const InsertStructureAdminStructureDocument = {
	kind: 'Document',
	definitions: [
		{
			kind: 'OperationDefinition',
			operation: 'mutation',
			name: { kind: 'Name', value: 'InsertStructureAdminStructure' },
			variableDefinitions: [
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'structureId' } },
					type: {
						kind: 'NonNullType',
						type: { kind: 'NamedType', name: { kind: 'Name', value: 'uuid' } },
					},
				},
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'adminStructureId' } },
					type: {
						kind: 'NonNullType',
						type: { kind: 'NamedType', name: { kind: 'Name', value: 'uuid' } },
					},
				},
			],
			selectionSet: {
				kind: 'SelectionSet',
				selections: [
					{
						kind: 'Field',
						name: { kind: 'Name', value: 'insert_admin_structure_structure_one' },
						arguments: [
							{
								kind: 'Argument',
								name: { kind: 'Name', value: 'object' },
								value: {
									kind: 'ObjectValue',
									fields: [
										{
											kind: 'ObjectField',
											name: { kind: 'Name', value: 'adminStructureId' },
											value: {
												kind: 'Variable',
												name: { kind: 'Name', value: 'adminStructureId' },
											},
										},
										{
											kind: 'ObjectField',
											name: { kind: 'Name', value: 'structureId' },
											value: { kind: 'Variable', name: { kind: 'Name', value: 'structureId' } },
										},
									],
								},
							},
						],
						selectionSet: {
							kind: 'SelectionSet',
							selections: [{ kind: 'Field', name: { kind: 'Name', value: 'id' } }],
						},
					},
				],
			},
		},
	],
} as unknown as DocumentNode<
	InsertStructureAdminStructureMutation,
	InsertStructureAdminStructureMutationVariables
>;
export const UpdateNotebookFromApiDocument = {
	kind: 'Document',
	definitions: [
		{
			kind: 'OperationDefinition',
			operation: 'mutation',
			name: { kind: 'Name', value: 'UpdateNotebookFromApi' },
			variableDefinitions: [
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'notebookId' } },
					type: {
						kind: 'NonNullType',
						type: { kind: 'NamedType', name: { kind: 'Name', value: 'uuid' } },
					},
				},
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'notebook' } },
					type: { kind: 'NamedType', name: { kind: 'Name', value: 'notebook_set_input' } },
				},
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'beneficiaryId' } },
					type: {
						kind: 'NonNullType',
						type: { kind: 'NamedType', name: { kind: 'Name', value: 'uuid' } },
					},
				},
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'beneficiary' } },
					type: {
						kind: 'NonNullType',
						type: { kind: 'NamedType', name: { kind: 'Name', value: 'beneficiary_set_input' } },
					},
				},
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'focuses' } },
					type: {
						kind: 'NonNullType',
						type: {
							kind: 'ListType',
							type: {
								kind: 'NonNullType',
								type: {
									kind: 'NamedType',
									name: { kind: 'Name', value: 'notebook_focus_insert_input' },
								},
							},
						},
					},
				},
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'targets' } },
					type: {
						kind: 'NonNullType',
						type: {
							kind: 'ListType',
							type: {
								kind: 'NonNullType',
								type: {
									kind: 'NamedType',
									name: { kind: 'Name', value: 'notebook_target_insert_input' },
								},
							},
						},
					},
				},
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'actions' } },
					type: {
						kind: 'NonNullType',
						type: {
							kind: 'ListType',
							type: {
								kind: 'NonNullType',
								type: {
									kind: 'NamedType',
									name: { kind: 'Name', value: 'notebook_action_insert_input' },
								},
							},
						},
					},
				},
			],
			selectionSet: {
				kind: 'SelectionSet',
				selections: [
					{
						kind: 'Field',
						name: { kind: 'Name', value: 'update_notebook_by_pk' },
						arguments: [
							{
								kind: 'Argument',
								name: { kind: 'Name', value: 'pk_columns' },
								value: {
									kind: 'ObjectValue',
									fields: [
										{
											kind: 'ObjectField',
											name: { kind: 'Name', value: 'id' },
											value: { kind: 'Variable', name: { kind: 'Name', value: 'notebookId' } },
										},
									],
								},
							},
							{
								kind: 'Argument',
								name: { kind: 'Name', value: '_set' },
								value: { kind: 'Variable', name: { kind: 'Name', value: 'notebook' } },
							},
						],
						selectionSet: {
							kind: 'SelectionSet',
							selections: [{ kind: 'Field', name: { kind: 'Name', value: 'id' } }],
						},
					},
					{
						kind: 'Field',
						name: { kind: 'Name', value: 'update_beneficiary_by_pk' },
						arguments: [
							{
								kind: 'Argument',
								name: { kind: 'Name', value: 'pk_columns' },
								value: {
									kind: 'ObjectValue',
									fields: [
										{
											kind: 'ObjectField',
											name: { kind: 'Name', value: 'id' },
											value: { kind: 'Variable', name: { kind: 'Name', value: 'beneficiaryId' } },
										},
									],
								},
							},
							{
								kind: 'Argument',
								name: { kind: 'Name', value: '_set' },
								value: { kind: 'Variable', name: { kind: 'Name', value: 'beneficiary' } },
							},
						],
						selectionSet: {
							kind: 'SelectionSet',
							selections: [{ kind: 'Field', name: { kind: 'Name', value: 'id' } }],
						},
					},
					{
						kind: 'Field',
						name: { kind: 'Name', value: 'insert_notebook_focus' },
						arguments: [
							{
								kind: 'Argument',
								name: { kind: 'Name', value: 'objects' },
								value: { kind: 'Variable', name: { kind: 'Name', value: 'focuses' } },
							},
							{
								kind: 'Argument',
								name: { kind: 'Name', value: 'on_conflict' },
								value: {
									kind: 'ObjectValue',
									fields: [
										{
											kind: 'ObjectField',
											name: { kind: 'Name', value: 'constraint' },
											value: { kind: 'EnumValue', value: 'notebook_focus_pkey' },
										},
										{
											kind: 'ObjectField',
											name: { kind: 'Name', value: 'update_columns' },
											value: {
												kind: 'ListValue',
												values: [{ kind: 'EnumValue', value: 'situations' }],
											},
										},
									],
								},
							},
						],
						selectionSet: {
							kind: 'SelectionSet',
							selections: [{ kind: 'Field', name: { kind: 'Name', value: 'affected_rows' } }],
						},
					},
					{
						kind: 'Field',
						name: { kind: 'Name', value: 'insert_notebook_target' },
						arguments: [
							{
								kind: 'Argument',
								name: { kind: 'Name', value: 'objects' },
								value: { kind: 'Variable', name: { kind: 'Name', value: 'targets' } },
							},
						],
						selectionSet: {
							kind: 'SelectionSet',
							selections: [{ kind: 'Field', name: { kind: 'Name', value: 'affected_rows' } }],
						},
					},
					{
						kind: 'Field',
						name: { kind: 'Name', value: 'insert_notebook_action' },
						arguments: [
							{
								kind: 'Argument',
								name: { kind: 'Name', value: 'objects' },
								value: { kind: 'Variable', name: { kind: 'Name', value: 'actions' } },
							},
						],
						selectionSet: {
							kind: 'SelectionSet',
							selections: [{ kind: 'Field', name: { kind: 'Name', value: 'affected_rows' } }],
						},
					},
				],
			},
		},
	],
} as unknown as DocumentNode<UpdateNotebookFromApiMutation, UpdateNotebookFromApiMutationVariables>;
export const GetStructuresForDeploymentDocument = {
	kind: 'Document',
	definitions: [
		{
			kind: 'OperationDefinition',
			operation: 'query',
			name: { kind: 'Name', value: 'GetStructuresForDeployment' },
			variableDefinitions: [
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'deploymentId' } },
					type: { kind: 'NamedType', name: { kind: 'Name', value: 'uuid' } },
				},
			],
			selectionSet: {
				kind: 'SelectionSet',
				selections: [
					{
						kind: 'Field',
						name: { kind: 'Name', value: 'structure' },
						arguments: [
							{
								kind: 'Argument',
								name: { kind: 'Name', value: 'where' },
								value: {
									kind: 'ObjectValue',
									fields: [
										{
											kind: 'ObjectField',
											name: { kind: 'Name', value: 'deploymentId' },
											value: {
												kind: 'ObjectValue',
												fields: [
													{
														kind: 'ObjectField',
														name: { kind: 'Name', value: '_eq' },
														value: {
															kind: 'Variable',
															name: { kind: 'Name', value: 'deploymentId' },
														},
													},
												],
											},
										},
									],
								},
							},
						],
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
								{ kind: 'Field', name: { kind: 'Name', value: 'address2' } },
							],
						},
					},
				],
			},
		},
	],
} as unknown as DocumentNode<
	GetStructuresForDeploymentQuery,
	GetStructuresForDeploymentQueryVariables
>;
export const GetAccountInfoDocument = {
	kind: 'Document',
	definitions: [
		{
			kind: 'OperationDefinition',
			operation: 'query',
			name: { kind: 'Name', value: 'GetAccountInfo' },
			variableDefinitions: [
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'accessKey' } },
					type: {
						kind: 'NonNullType',
						type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
					},
				},
			],
			selectionSet: {
				kind: 'SelectionSet',
				selections: [
					{
						kind: 'Field',
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
											name: { kind: 'Name', value: 'accessKey' },
											value: {
												kind: 'ObjectValue',
												fields: [
													{
														kind: 'ObjectField',
														name: { kind: 'Name', value: '_eq' },
														value: { kind: 'Variable', name: { kind: 'Name', value: 'accessKey' } },
													},
												],
											},
										},
									],
								},
							},
						],
						selectionSet: {
							kind: 'SelectionSet',
							selections: [
								{ kind: 'Field', name: { kind: 'Name', value: 'id' } },
								{ kind: 'Field', name: { kind: 'Name', value: 'type' } },
								{ kind: 'Field', name: { kind: 'Name', value: 'username' } },
								{ kind: 'Field', name: { kind: 'Name', value: 'beneficiaryId' } },
								{ kind: 'Field', name: { kind: 'Name', value: 'professionalId' } },
								{ kind: 'Field', name: { kind: 'Name', value: 'managerId' } },
								{ kind: 'Field', name: { kind: 'Name', value: 'adminStructureId' } },
								{
									kind: 'Field',
									name: { kind: 'Name', value: 'professional' },
									selectionSet: {
										kind: 'SelectionSet',
										selections: [
											{
												kind: 'Field',
												name: { kind: 'Name', value: 'structure' },
												selectionSet: {
													kind: 'SelectionSet',
													selections: [
														{ kind: 'Field', name: { kind: 'Name', value: 'deploymentId' } },
													],
												},
											},
										],
									},
								},
								{
									kind: 'Field',
									name: { kind: 'Name', value: 'manager' },
									selectionSet: {
										kind: 'SelectionSet',
										selections: [{ kind: 'Field', name: { kind: 'Name', value: 'deploymentId' } }],
									},
								},
								{
									kind: 'Field',
									name: { kind: 'Name', value: 'admin_structure' },
									selectionSet: {
										kind: 'SelectionSet',
										selections: [{ kind: 'Field', name: { kind: 'Name', value: 'deploymentId' } }],
									},
								},
							],
						},
					},
				],
			},
		},
	],
} as unknown as DocumentNode<GetAccountInfoQuery, GetAccountInfoQueryVariables>;
export const ResetAccountAccessKeyDocument = {
	kind: 'Document',
	definitions: [
		{
			kind: 'OperationDefinition',
			operation: 'mutation',
			name: { kind: 'Name', value: 'ResetAccountAccessKey' },
			variableDefinitions: [
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
					type: {
						kind: 'NonNullType',
						type: { kind: 'NamedType', name: { kind: 'Name', value: 'uuid' } },
					},
				},
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'now' } },
					type: {
						kind: 'NonNullType',
						type: { kind: 'NamedType', name: { kind: 'Name', value: 'timestamptz' } },
					},
				},
			],
			selectionSet: {
				kind: 'SelectionSet',
				selections: [
					{
						kind: 'Field',
						name: { kind: 'Name', value: 'update_account_by_pk' },
						arguments: [
							{
								kind: 'Argument',
								name: { kind: 'Name', value: 'pk_columns' },
								value: {
									kind: 'ObjectValue',
									fields: [
										{
											kind: 'ObjectField',
											name: { kind: 'Name', value: 'id' },
											value: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
										},
									],
								},
							},
							{
								kind: 'Argument',
								name: { kind: 'Name', value: '_set' },
								value: {
									kind: 'ObjectValue',
									fields: [
										{
											kind: 'ObjectField',
											name: { kind: 'Name', value: 'accessKeyDate' },
											value: { kind: 'NullValue' },
										},
										{
											kind: 'ObjectField',
											name: { kind: 'Name', value: 'accessKey' },
											value: { kind: 'NullValue' },
										},
										{
											kind: 'ObjectField',
											name: { kind: 'Name', value: 'lastLogin' },
											value: { kind: 'Variable', name: { kind: 'Name', value: 'now' } },
										},
									],
								},
							},
						],
						selectionSet: {
							kind: 'SelectionSet',
							selections: [{ kind: 'Field', name: { kind: 'Name', value: 'lastLogin' } }],
						},
					},
				],
			},
		},
	],
} as unknown as DocumentNode<ResetAccountAccessKeyMutation, ResetAccountAccessKeyMutationVariables>;
export const CreateBeneficiaryAccountDocument = {
	kind: 'Document',
	definitions: [
		{
			kind: 'OperationDefinition',
			operation: 'mutation',
			name: { kind: 'Name', value: 'CreateBeneficiaryAccount' },
			variableDefinitions: [
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'username' } },
					type: {
						kind: 'NonNullType',
						type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
					},
				},
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'beneficiaryId' } },
					type: {
						kind: 'NonNullType',
						type: { kind: 'NamedType', name: { kind: 'Name', value: 'uuid' } },
					},
				},
			],
			selectionSet: {
				kind: 'SelectionSet',
				selections: [
					{
						kind: 'Field',
						name: { kind: 'Name', value: 'insert_account_one' },
						arguments: [
							{
								kind: 'Argument',
								name: { kind: 'Name', value: 'object' },
								value: {
									kind: 'ObjectValue',
									fields: [
										{
											kind: 'ObjectField',
											name: { kind: 'Name', value: 'username' },
											value: { kind: 'Variable', name: { kind: 'Name', value: 'username' } },
										},
										{
											kind: 'ObjectField',
											name: { kind: 'Name', value: 'beneficiaryId' },
											value: { kind: 'Variable', name: { kind: 'Name', value: 'beneficiaryId' } },
										},
										{
											kind: 'ObjectField',
											name: { kind: 'Name', value: 'type' },
											value: { kind: 'StringValue', value: 'beneficiary', block: false },
										},
										{
											kind: 'ObjectField',
											name: { kind: 'Name', value: 'confirmed' },
											value: { kind: 'BooleanValue', value: true },
										},
									],
								},
							},
						],
						selectionSet: {
							kind: 'SelectionSet',
							selections: [{ kind: 'Field', name: { kind: 'Name', value: 'id' } }],
						},
					},
				],
			},
		},
	],
} as unknown as DocumentNode<
	CreateBeneficiaryAccountMutation,
	CreateBeneficiaryAccountMutationVariables
>;
export const GetAccountByUsernameDocument = {
	kind: 'Document',
	definitions: [
		{
			kind: 'OperationDefinition',
			operation: 'query',
			name: { kind: 'Name', value: 'GetAccountByUsername' },
			variableDefinitions: [
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'comp' } },
					type: {
						kind: 'NonNullType',
						type: { kind: 'NamedType', name: { kind: 'Name', value: 'String_comparison_exp' } },
					},
				},
			],
			selectionSet: {
				kind: 'SelectionSet',
				selections: [
					{
						kind: 'Field',
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
											name: { kind: 'Name', value: 'username' },
											value: { kind: 'Variable', name: { kind: 'Name', value: 'comp' } },
										},
									],
								},
							},
						],
						selectionSet: {
							kind: 'SelectionSet',
							selections: [
								{ kind: 'Field', name: { kind: 'Name', value: 'id' } },
								{ kind: 'Field', name: { kind: 'Name', value: 'username' } },
								{
									kind: 'Field',
									name: { kind: 'Name', value: 'beneficiary' },
									selectionSet: {
										kind: 'SelectionSet',
										selections: [
											{ kind: 'Field', name: { kind: 'Name', value: 'firstname' } },
											{ kind: 'Field', name: { kind: 'Name', value: 'lastname' } },
											{ kind: 'Field', name: { kind: 'Name', value: 'email' } },
										],
									},
								},
								{
									kind: 'Field',
									name: { kind: 'Name', value: 'professional' },
									selectionSet: {
										kind: 'SelectionSet',
										selections: [
											{ kind: 'Field', name: { kind: 'Name', value: 'firstname' } },
											{ kind: 'Field', name: { kind: 'Name', value: 'lastname' } },
											{ kind: 'Field', name: { kind: 'Name', value: 'email' } },
										],
									},
								},
								{
									kind: 'Field',
									name: { kind: 'Name', value: 'admin' },
									selectionSet: {
										kind: 'SelectionSet',
										selections: [
											{ kind: 'Field', name: { kind: 'Name', value: 'firstname' } },
											{ kind: 'Field', name: { kind: 'Name', value: 'lastname' } },
											{ kind: 'Field', name: { kind: 'Name', value: 'email' } },
										],
									},
								},
								{
									kind: 'Field',
									name: { kind: 'Name', value: 'manager' },
									selectionSet: {
										kind: 'SelectionSet',
										selections: [
											{ kind: 'Field', name: { kind: 'Name', value: 'firstname' } },
											{ kind: 'Field', name: { kind: 'Name', value: 'lastname' } },
											{ kind: 'Field', name: { kind: 'Name', value: 'email' } },
										],
									},
								},
								{
									kind: 'Field',
									name: { kind: 'Name', value: 'admin_structure' },
									selectionSet: {
										kind: 'SelectionSet',
										selections: [
											{ kind: 'Field', name: { kind: 'Name', value: 'firstname' } },
											{ kind: 'Field', name: { kind: 'Name', value: 'lastname' } },
											{ kind: 'Field', name: { kind: 'Name', value: 'email' } },
										],
									},
								},
								{ kind: 'Field', name: { kind: 'Name', value: 'confirmed' } },
							],
						},
					},
				],
			},
		},
	],
} as unknown as DocumentNode<GetAccountByUsernameQuery, GetAccountByUsernameQueryVariables>;
export const GetAccountByEmailDocument = {
	kind: 'Document',
	definitions: [
		{
			kind: 'OperationDefinition',
			operation: 'query',
			name: { kind: 'Name', value: 'GetAccountByEmail' },
			variableDefinitions: [
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'criteria' } },
					type: {
						kind: 'NonNullType',
						type: { kind: 'NamedType', name: { kind: 'Name', value: 'account_bool_exp' } },
					},
				},
			],
			selectionSet: {
				kind: 'SelectionSet',
				selections: [
					{
						kind: 'Field',
						name: { kind: 'Name', value: 'account' },
						arguments: [
							{
								kind: 'Argument',
								name: { kind: 'Name', value: 'where' },
								value: { kind: 'Variable', name: { kind: 'Name', value: 'criteria' } },
							},
						],
						selectionSet: {
							kind: 'SelectionSet',
							selections: [
								{ kind: 'Field', name: { kind: 'Name', value: 'id' } },
								{ kind: 'Field', name: { kind: 'Name', value: 'username' } },
								{
									kind: 'Field',
									name: { kind: 'Name', value: 'beneficiary' },
									selectionSet: {
										kind: 'SelectionSet',
										selections: [
											{ kind: 'Field', name: { kind: 'Name', value: 'firstname' } },
											{ kind: 'Field', name: { kind: 'Name', value: 'lastname' } },
											{ kind: 'Field', name: { kind: 'Name', value: 'email' } },
										],
									},
								},
								{
									kind: 'Field',
									name: { kind: 'Name', value: 'professional' },
									selectionSet: {
										kind: 'SelectionSet',
										selections: [
											{ kind: 'Field', name: { kind: 'Name', value: 'firstname' } },
											{ kind: 'Field', name: { kind: 'Name', value: 'lastname' } },
											{ kind: 'Field', name: { kind: 'Name', value: 'email' } },
										],
									},
								},
								{
									kind: 'Field',
									name: { kind: 'Name', value: 'admin' },
									selectionSet: {
										kind: 'SelectionSet',
										selections: [
											{ kind: 'Field', name: { kind: 'Name', value: 'firstname' } },
											{ kind: 'Field', name: { kind: 'Name', value: 'lastname' } },
											{ kind: 'Field', name: { kind: 'Name', value: 'email' } },
										],
									},
								},
								{
									kind: 'Field',
									name: { kind: 'Name', value: 'manager' },
									selectionSet: {
										kind: 'SelectionSet',
										selections: [
											{ kind: 'Field', name: { kind: 'Name', value: 'firstname' } },
											{ kind: 'Field', name: { kind: 'Name', value: 'lastname' } },
											{ kind: 'Field', name: { kind: 'Name', value: 'email' } },
										],
									},
								},
								{
									kind: 'Field',
									name: { kind: 'Name', value: 'admin_structure' },
									selectionSet: {
										kind: 'SelectionSet',
										selections: [
											{ kind: 'Field', name: { kind: 'Name', value: 'firstname' } },
											{ kind: 'Field', name: { kind: 'Name', value: 'lastname' } },
											{ kind: 'Field', name: { kind: 'Name', value: 'email' } },
										],
									},
								},
								{ kind: 'Field', name: { kind: 'Name', value: 'confirmed' } },
							],
						},
					},
				],
			},
		},
	],
} as unknown as DocumentNode<GetAccountByEmailQuery, GetAccountByEmailQueryVariables>;
export const GetBeneficiaryByEmailDocument = {
	kind: 'Document',
	definitions: [
		{
			kind: 'OperationDefinition',
			operation: 'query',
			name: { kind: 'Name', value: 'GetBeneficiaryByEmail' },
			variableDefinitions: [
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'email' } },
					type: {
						kind: 'NonNullType',
						type: { kind: 'NamedType', name: { kind: 'Name', value: 'citext' } },
					},
				},
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
											name: { kind: 'Name', value: 'email' },
											value: {
												kind: 'ObjectValue',
												fields: [
													{
														kind: 'ObjectField',
														name: { kind: 'Name', value: '_eq' },
														value: { kind: 'Variable', name: { kind: 'Name', value: 'email' } },
													},
												],
											},
										},
										{
											kind: 'ObjectField',
											name: { kind: 'Name', value: '_not' },
											value: {
												kind: 'ObjectValue',
												fields: [
													{
														kind: 'ObjectField',
														name: { kind: 'Name', value: 'account' },
														value: { kind: 'ObjectValue', fields: [] },
													},
												],
											},
										},
									],
								},
							},
						],
						selectionSet: {
							kind: 'SelectionSet',
							selections: [
								{ kind: 'Field', name: { kind: 'Name', value: 'firstname' } },
								{ kind: 'Field', name: { kind: 'Name', value: 'lastname' } },
								{ kind: 'Field', name: { kind: 'Name', value: 'id' } },
							],
						},
					},
				],
			},
		},
	],
} as unknown as DocumentNode<GetBeneficiaryByEmailQuery, GetBeneficiaryByEmailQueryVariables>;
export const UpdateAccountAccessKeyDocument = {
	kind: 'Document',
	definitions: [
		{
			kind: 'OperationDefinition',
			operation: 'mutation',
			name: { kind: 'Name', value: 'UpdateAccountAccessKey' },
			variableDefinitions: [
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
					type: {
						kind: 'NonNullType',
						type: { kind: 'NamedType', name: { kind: 'Name', value: 'uuid' } },
					},
				},
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'input' } },
					type: { kind: 'NamedType', name: { kind: 'Name', value: 'account_set_input' } },
				},
			],
			selectionSet: {
				kind: 'SelectionSet',
				selections: [
					{
						kind: 'Field',
						alias: { kind: 'Name', value: 'account' },
						name: { kind: 'Name', value: 'update_account_by_pk' },
						arguments: [
							{
								kind: 'Argument',
								name: { kind: 'Name', value: 'pk_columns' },
								value: {
									kind: 'ObjectValue',
									fields: [
										{
											kind: 'ObjectField',
											name: { kind: 'Name', value: 'id' },
											value: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
										},
									],
								},
							},
							{
								kind: 'Argument',
								name: { kind: 'Name', value: '_set' },
								value: { kind: 'Variable', name: { kind: 'Name', value: 'input' } },
							},
						],
						selectionSet: {
							kind: 'SelectionSet',
							selections: [{ kind: 'Field', name: { kind: 'Name', value: 'accessKey' } }],
						},
					},
				],
			},
		},
	],
} as unknown as DocumentNode<
	UpdateAccountAccessKeyMutation,
	UpdateAccountAccessKeyMutationVariables
>;
export const GetNotebookByBeneficiaryIdDocument = {
	kind: 'Document',
	definitions: [
		{
			kind: 'OperationDefinition',
			operation: 'query',
			name: { kind: 'Name', value: 'GetNotebookByBeneficiaryId' },
			variableDefinitions: [
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
					type: {
						kind: 'NonNullType',
						type: { kind: 'NamedType', name: { kind: 'Name', value: 'uuid' } },
					},
				},
			],
			selectionSet: {
				kind: 'SelectionSet',
				selections: [
					{
						kind: 'Field',
						name: { kind: 'Name', value: 'notebook' },
						arguments: [
							{
								kind: 'Argument',
								name: { kind: 'Name', value: 'where' },
								value: {
									kind: 'ObjectValue',
									fields: [
										{
											kind: 'ObjectField',
											name: { kind: 'Name', value: 'beneficiaryId' },
											value: {
												kind: 'ObjectValue',
												fields: [
													{
														kind: 'ObjectField',
														name: { kind: 'Name', value: '_eq' },
														value: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
													},
												],
											},
										},
									],
								},
							},
						],
						selectionSet: {
							kind: 'SelectionSet',
							selections: [
								{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'notebookFragment' } },
							],
						},
					},
				],
			},
		},
		...NotebookFragmentFragmentDoc.definitions,
	],
} as unknown as DocumentNode<
	GetNotebookByBeneficiaryIdQuery,
	GetNotebookByBeneficiaryIdQueryVariables
>;
export const GetNotebookByIdDocument = {
	kind: 'Document',
	definitions: [
		{
			kind: 'OperationDefinition',
			operation: 'query',
			name: { kind: 'Name', value: 'GetNotebookById' },
			variableDefinitions: [
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
					type: {
						kind: 'NonNullType',
						type: { kind: 'NamedType', name: { kind: 'Name', value: 'uuid' } },
					},
				},
			],
			selectionSet: {
				kind: 'SelectionSet',
				selections: [
					{
						kind: 'Field',
						name: { kind: 'Name', value: 'notebook' },
						arguments: [
							{
								kind: 'Argument',
								name: { kind: 'Name', value: 'where' },
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
														value: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
													},
												],
											},
										},
									],
								},
							},
						],
						selectionSet: {
							kind: 'SelectionSet',
							selections: [
								{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'notebookFragment' } },
							],
						},
					},
				],
			},
		},
		...NotebookFragmentFragmentDoc.definitions,
	],
} as unknown as DocumentNode<GetNotebookByIdQuery, GetNotebookByIdQueryVariables>;
export const GetDeploymentManagersForStructureDocument = {
	kind: 'Document',
	definitions: [
		{
			kind: 'OperationDefinition',
			operation: 'query',
			name: { kind: 'Name', value: 'GetDeploymentManagersForStructure' },
			variableDefinitions: [
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'structureId' } },
					type: {
						kind: 'NonNullType',
						type: { kind: 'NamedType', name: { kind: 'Name', value: 'uuid' } },
					},
				},
			],
			selectionSet: {
				kind: 'SelectionSet',
				selections: [
					{
						kind: 'Field',
						alias: { kind: 'Name', value: 'structure' },
						name: { kind: 'Name', value: 'structure_by_pk' },
						arguments: [
							{
								kind: 'Argument',
								name: { kind: 'Name', value: 'id' },
								value: { kind: 'Variable', name: { kind: 'Name', value: 'structureId' } },
							},
						],
						selectionSet: {
							kind: 'SelectionSet',
							selections: [
								{
									kind: 'Field',
									name: { kind: 'Name', value: 'deployment' },
									selectionSet: {
										kind: 'SelectionSet',
										selections: [
											{
												kind: 'Field',
												name: { kind: 'Name', value: 'managers' },
												selectionSet: {
													kind: 'SelectionSet',
													selections: [{ kind: 'Field', name: { kind: 'Name', value: 'email' } }],
												},
											},
										],
									},
								},
							],
						},
					},
				],
			},
		},
	],
} as unknown as DocumentNode<
	GetDeploymentManagersForStructureQuery,
	GetDeploymentManagersForStructureQueryVariables
>;
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
								{ kind: 'Field', name: { kind: 'Name', value: 'address2' } },
								{ kind: 'Field', name: { kind: 'Name', value: 'website' } },
							],
						},
					},
				],
			},
		},
	],
} as unknown as DocumentNode<GetStructuresQuery, GetStructuresQueryVariables>;
export const InsertProfessionalAccountDocument = {
	kind: 'Document',
	definitions: [
		{
			kind: 'OperationDefinition',
			operation: 'mutation',
			name: { kind: 'Name', value: 'insertProfessionalAccount' },
			variableDefinitions: [
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'account' } },
					type: {
						kind: 'NonNullType',
						type: { kind: 'NamedType', name: { kind: 'Name', value: 'account_insert_input' } },
					},
				},
			],
			selectionSet: {
				kind: 'SelectionSet',
				selections: [
					{
						kind: 'Field',
						alias: { kind: 'Name', value: 'account' },
						name: { kind: 'Name', value: 'insert_account_one' },
						arguments: [
							{
								kind: 'Argument',
								name: { kind: 'Name', value: 'object' },
								value: { kind: 'Variable', name: { kind: 'Name', value: 'account' } },
							},
						],
						selectionSet: {
							kind: 'SelectionSet',
							selections: [{ kind: 'Field', name: { kind: 'Name', value: 'id' } }],
						},
					},
				],
			},
		},
	],
} as unknown as DocumentNode<
	InsertProfessionalAccountMutation,
	InsertProfessionalAccountMutationVariables
>;
export const ConfirmAccountByIdDocument = {
	kind: 'Document',
	definitions: [
		{
			kind: 'OperationDefinition',
			operation: 'mutation',
			name: { kind: 'Name', value: 'ConfirmAccountById' },
			variableDefinitions: [
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
					type: {
						kind: 'NonNullType',
						type: { kind: 'NamedType', name: { kind: 'Name', value: 'uuid' } },
					},
				},
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'accessKey' } },
					type: {
						kind: 'NonNullType',
						type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
					},
				},
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'accessKeyDate' } },
					type: {
						kind: 'NonNullType',
						type: { kind: 'NamedType', name: { kind: 'Name', value: 'timestamptz' } },
					},
				},
			],
			selectionSet: {
				kind: 'SelectionSet',
				selections: [
					{
						kind: 'Field',
						alias: { kind: 'Name', value: 'account' },
						name: { kind: 'Name', value: 'update_account_by_pk' },
						arguments: [
							{
								kind: 'Argument',
								name: { kind: 'Name', value: 'pk_columns' },
								value: {
									kind: 'ObjectValue',
									fields: [
										{
											kind: 'ObjectField',
											name: { kind: 'Name', value: 'id' },
											value: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
										},
									],
								},
							},
							{
								kind: 'Argument',
								name: { kind: 'Name', value: '_set' },
								value: {
									kind: 'ObjectValue',
									fields: [
										{
											kind: 'ObjectField',
											name: { kind: 'Name', value: 'confirmed' },
											value: { kind: 'BooleanValue', value: true },
										},
										{
											kind: 'ObjectField',
											name: { kind: 'Name', value: 'accessKey' },
											value: { kind: 'Variable', name: { kind: 'Name', value: 'accessKey' } },
										},
										{
											kind: 'ObjectField',
											name: { kind: 'Name', value: 'accessKeyDate' },
											value: { kind: 'Variable', name: { kind: 'Name', value: 'accessKeyDate' } },
										},
									],
								},
							},
						],
						selectionSet: {
							kind: 'SelectionSet',
							selections: [
								{ kind: 'Field', name: { kind: 'Name', value: 'id' } },
								{ kind: 'Field', name: { kind: 'Name', value: 'accessKey' } },
							],
						},
					},
				],
			},
		},
	],
} as unknown as DocumentNode<ConfirmAccountByIdMutation, ConfirmAccountByIdMutationVariables>;
export const GetAccountByIdDocument = {
	kind: 'Document',
	definitions: [
		{
			kind: 'OperationDefinition',
			operation: 'query',
			name: { kind: 'Name', value: 'GetAccountById' },
			variableDefinitions: [
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
					type: {
						kind: 'NonNullType',
						type: { kind: 'NamedType', name: { kind: 'Name', value: 'uuid' } },
					},
				},
			],
			selectionSet: {
				kind: 'SelectionSet',
				selections: [
					{
						kind: 'Field',
						alias: { kind: 'Name', value: 'account' },
						name: { kind: 'Name', value: 'account_by_pk' },
						arguments: [
							{
								kind: 'Argument',
								name: { kind: 'Name', value: 'id' },
								value: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
							},
						],
						selectionSet: {
							kind: 'SelectionSet',
							selections: [
								{ kind: 'Field', name: { kind: 'Name', value: 'id' } },
								{ kind: 'Field', name: { kind: 'Name', value: 'username' } },
								{ kind: 'Field', name: { kind: 'Name', value: 'confirmed' } },
								{
									kind: 'Field',
									name: { kind: 'Name', value: 'professional' },
									selectionSet: {
										kind: 'SelectionSet',
										selections: [
											{ kind: 'Field', name: { kind: 'Name', value: 'firstname' } },
											{ kind: 'Field', name: { kind: 'Name', value: 'lastname' } },
											{ kind: 'Field', name: { kind: 'Name', value: 'email' } },
										],
									},
								},
							],
						},
					},
				],
			},
		},
	],
} as unknown as DocumentNode<GetAccountByIdQuery, GetAccountByIdQueryVariables>;
export const GetDeploymentInfosDocument = {
	kind: 'Document',
	definitions: [
		{
			kind: 'OperationDefinition',
			operation: 'query',
			name: { kind: 'Name', value: 'GetDeploymentInfos' },
			variableDefinitions: [
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
					type: {
						kind: 'NonNullType',
						type: { kind: 'NamedType', name: { kind: 'Name', value: 'uuid' } },
					},
				},
			],
			selectionSet: {
				kind: 'SelectionSet',
				selections: [
					{
						kind: 'Field',
						alias: { kind: 'Name', value: 'deployment' },
						name: { kind: 'Name', value: 'deployment_by_pk' },
						arguments: [
							{
								kind: 'Argument',
								name: { kind: 'Name', value: 'id' },
								value: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
							},
						],
						selectionSet: {
							kind: 'SelectionSet',
							selections: [{ kind: 'Field', name: { kind: 'Name', value: 'label' } }],
						},
					},
					{
						kind: 'Field',
						alias: { kind: 'Name', value: 'beneficiaries' },
						name: { kind: 'Name', value: 'beneficiary_aggregate' },
						selectionSet: {
							kind: 'SelectionSet',
							selections: [
								{
									kind: 'Field',
									name: { kind: 'Name', value: 'aggregate' },
									selectionSet: {
										kind: 'SelectionSet',
										selections: [{ kind: 'Field', name: { kind: 'Name', value: 'count' } }],
									},
								},
							],
						},
					},
					{
						kind: 'Field',
						alias: { kind: 'Name', value: 'beneficiariesWithNoStructure' },
						name: { kind: 'Name', value: 'beneficiary_aggregate' },
						arguments: [
							{
								kind: 'Argument',
								name: { kind: 'Name', value: 'where' },
								value: {
									kind: 'ObjectValue',
									fields: [
										{
											kind: 'ObjectField',
											name: { kind: 'Name', value: '_and' },
											value: {
												kind: 'ListValue',
												values: [
													{
														kind: 'ObjectValue',
														fields: [
															{
																kind: 'ObjectField',
																name: { kind: 'Name', value: '_not' },
																value: {
																	kind: 'ObjectValue',
																	fields: [
																		{
																			kind: 'ObjectField',
																			name: { kind: 'Name', value: 'structures' },
																			value: { kind: 'ObjectValue', fields: [] },
																		},
																	],
																},
															},
														],
													},
													{
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
																			name: { kind: 'Name', value: 'members' },
																			value: {
																				kind: 'ObjectValue',
																				fields: [
																					{
																						kind: 'ObjectField',
																						name: { kind: 'Name', value: '_not' },
																						value: {
																							kind: 'ObjectValue',
																							fields: [
																								{
																									kind: 'ObjectField',
																									name: { kind: 'Name', value: 'active' },
																									value: {
																										kind: 'ObjectValue',
																										fields: [
																											{
																												kind: 'ObjectField',
																												name: { kind: 'Name', value: '_eq' },
																												value: {
																													kind: 'BooleanValue',
																													value: true,
																												},
																											},
																										],
																									},
																								},
																							],
																						},
																					},
																				],
																			},
																		},
																	],
																},
															},
														],
													},
												],
											},
										},
									],
								},
							},
						],
						selectionSet: {
							kind: 'SelectionSet',
							selections: [
								{
									kind: 'Field',
									name: { kind: 'Name', value: 'aggregate' },
									selectionSet: {
										kind: 'SelectionSet',
										selections: [{ kind: 'Field', name: { kind: 'Name', value: 'count' } }],
									},
								},
							],
						},
					},
					{
						kind: 'Field',
						alias: { kind: 'Name', value: 'structures' },
						name: { kind: 'Name', value: 'structure_aggregate' },
						selectionSet: {
							kind: 'SelectionSet',
							selections: [
								{
									kind: 'Field',
									name: { kind: 'Name', value: 'aggregate' },
									selectionSet: {
										kind: 'SelectionSet',
										selections: [{ kind: 'Field', name: { kind: 'Name', value: 'count' } }],
									},
								},
							],
						},
					},
					{
						kind: 'Field',
						alias: { kind: 'Name', value: 'structuresWithPros' },
						name: { kind: 'Name', value: 'structure' },
						selectionSet: {
							kind: 'SelectionSet',
							selections: [
								{ kind: 'Field', name: { kind: 'Name', value: 'id' } },
								{ kind: 'Field', name: { kind: 'Name', value: 'name' } },
								{
									kind: 'Field',
									name: { kind: 'Name', value: 'professionals' },
									selectionSet: {
										kind: 'SelectionSet',
										selections: [
											{ kind: 'Field', name: { kind: 'Name', value: 'id' } },
											{ kind: 'Field', name: { kind: 'Name', value: 'email' } },
											{ kind: 'Field', name: { kind: 'Name', value: 'firstname' } },
											{ kind: 'Field', name: { kind: 'Name', value: 'lastname' } },
											{
												kind: 'Field',
												name: { kind: 'Name', value: 'account' },
												selectionSet: {
													kind: 'SelectionSet',
													selections: [{ kind: 'Field', name: { kind: 'Name', value: 'id' } }],
												},
											},
										],
									},
								},
							],
						},
					},
					{
						kind: 'Field',
						alias: { kind: 'Name', value: 'structuresWithNoBeneficiary' },
						name: { kind: 'Name', value: 'structure_aggregate' },
						arguments: [
							{
								kind: 'Argument',
								name: { kind: 'Name', value: 'where' },
								value: {
									kind: 'ObjectValue',
									fields: [
										{
											kind: 'ObjectField',
											name: { kind: 'Name', value: '_not' },
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
																			name: { kind: 'Name', value: 'beneficiaries' },
																			value: {
																				kind: 'ObjectValue',
																				fields: [
																					{
																						kind: 'ObjectField',
																						name: { kind: 'Name', value: 'status' },
																						value: {
																							kind: 'ObjectValue',
																							fields: [
																								{
																									kind: 'ObjectField',
																									name: { kind: 'Name', value: '_eq' },
																									value: {
																										kind: 'StringValue',
																										value: 'pending',
																										block: false,
																									},
																								},
																							],
																						},
																					},
																				],
																			},
																		},
																	],
																},
																{
																	kind: 'ObjectValue',
																	fields: [
																		{
																			kind: 'ObjectField',
																			name: { kind: 'Name', value: 'professionals' },
																			value: {
																				kind: 'ObjectValue',
																				fields: [
																					{
																						kind: 'ObjectField',
																						name: { kind: 'Name', value: 'account' },
																						value: {
																							kind: 'ObjectValue',
																							fields: [
																								{
																									kind: 'ObjectField',
																									name: {
																										kind: 'Name',
																										value: 'notebooksWhereMember',
																									},
																									value: {
																										kind: 'ObjectValue',
																										fields: [
																											{
																												kind: 'ObjectField',
																												name: { kind: 'Name', value: 'active' },
																												value: {
																													kind: 'ObjectValue',
																													fields: [
																														{
																															kind: 'ObjectField',
																															name: { kind: 'Name', value: '_eq' },
																															value: {
																																kind: 'BooleanValue',
																																value: true,
																															},
																														},
																													],
																												},
																											},
																										],
																									},
																								},
																							],
																						},
																					},
																				],
																			},
																		},
																	],
																},
															],
														},
													},
												],
											},
										},
									],
								},
							},
						],
						selectionSet: {
							kind: 'SelectionSet',
							selections: [
								{
									kind: 'Field',
									name: { kind: 'Name', value: 'aggregate' },
									selectionSet: {
										kind: 'SelectionSet',
										selections: [{ kind: 'Field', name: { kind: 'Name', value: 'count' } }],
									},
								},
							],
						},
					},
				],
			},
		},
	],
} as unknown as DocumentNode<GetDeploymentInfosQuery, GetDeploymentInfosQueryVariables>;
export const GetBeneficiariesDocument = {
	kind: 'Document',
	definitions: [
		{
			kind: 'OperationDefinition',
			operation: 'query',
			name: { kind: 'Name', value: 'GetBeneficiaries' },
			variableDefinitions: [
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'offset' } },
					type: {
						kind: 'NonNullType',
						type: { kind: 'NamedType', name: { kind: 'Name', value: 'Int' } },
					},
				},
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'limit' } },
					type: {
						kind: 'NonNullType',
						type: { kind: 'NamedType', name: { kind: 'Name', value: 'Int' } },
					},
				},
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'withMembers' } },
					type: {
						kind: 'NonNullType',
						type: { kind: 'NamedType', name: { kind: 'Name', value: 'beneficiary_bool_exp' } },
					},
				},
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'search' } },
					type: {
						kind: 'NonNullType',
						type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
					},
				},
			],
			selectionSet: {
				kind: 'SelectionSet',
				selections: [
					{
						kind: 'Field',
						name: { kind: 'Name', value: 'search_beneficiaries_aggregate' },
						arguments: [
							{
								kind: 'Argument',
								name: { kind: 'Name', value: 'args' },
								value: {
									kind: 'ObjectValue',
									fields: [
										{
											kind: 'ObjectField',
											name: { kind: 'Name', value: 'search' },
											value: { kind: 'Variable', name: { kind: 'Name', value: 'search' } },
										},
									],
								},
							},
							{
								kind: 'Argument',
								name: { kind: 'Name', value: 'where' },
								value: { kind: 'Variable', name: { kind: 'Name', value: 'withMembers' } },
							},
						],
						selectionSet: {
							kind: 'SelectionSet',
							selections: [
								{
									kind: 'Field',
									name: { kind: 'Name', value: 'aggregate' },
									selectionSet: {
										kind: 'SelectionSet',
										selections: [{ kind: 'Field', name: { kind: 'Name', value: 'count' } }],
									},
								},
							],
						},
					},
					{
						kind: 'Field',
						alias: { kind: 'Name', value: 'beneficiaries' },
						name: { kind: 'Name', value: 'search_beneficiaries' },
						arguments: [
							{
								kind: 'Argument',
								name: { kind: 'Name', value: 'args' },
								value: {
									kind: 'ObjectValue',
									fields: [
										{
											kind: 'ObjectField',
											name: { kind: 'Name', value: 'search' },
											value: { kind: 'Variable', name: { kind: 'Name', value: 'search' } },
										},
									],
								},
							},
							{
								kind: 'Argument',
								name: { kind: 'Name', value: 'limit' },
								value: { kind: 'Variable', name: { kind: 'Name', value: 'limit' } },
							},
							{
								kind: 'Argument',
								name: { kind: 'Name', value: 'offset' },
								value: { kind: 'Variable', name: { kind: 'Name', value: 'offset' } },
							},
							{
								kind: 'Argument',
								name: { kind: 'Name', value: 'order_by' },
								value: {
									kind: 'ListValue',
									values: [
										{
											kind: 'ObjectValue',
											fields: [
												{
													kind: 'ObjectField',
													name: { kind: 'Name', value: 'lastname' },
													value: { kind: 'EnumValue', value: 'asc' },
												},
											],
										},
										{
											kind: 'ObjectValue',
											fields: [
												{
													kind: 'ObjectField',
													name: { kind: 'Name', value: 'firstname' },
													value: { kind: 'EnumValue', value: 'asc' },
												},
											],
										},
									],
								},
							},
							{
								kind: 'Argument',
								name: { kind: 'Name', value: 'where' },
								value: { kind: 'Variable', name: { kind: 'Name', value: 'withMembers' } },
							},
						],
						selectionSet: {
							kind: 'SelectionSet',
							selections: [
								{ kind: 'Field', name: { kind: 'Name', value: 'id' } },
								{ kind: 'Field', name: { kind: 'Name', value: 'firstname' } },
								{ kind: 'Field', name: { kind: 'Name', value: 'lastname' } },
								{ kind: 'Field', name: { kind: 'Name', value: 'needOrientation' } },
								{
									kind: 'Field',
									name: { kind: 'Name', value: 'structures' },
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
														{ kind: 'Field', name: { kind: 'Name', value: 'name' } },
													],
												},
											},
										],
									},
								},
								{
									kind: 'Field',
									name: { kind: 'Name', value: 'notebook' },
									selectionSet: {
										kind: 'SelectionSet',
										selections: [
											{ kind: 'Field', name: { kind: 'Name', value: 'id' } },
											{
												kind: 'Field',
												name: { kind: 'Name', value: 'members' },
												arguments: [
													{
														kind: 'Argument',
														name: { kind: 'Name', value: 'where' },
														value: {
															kind: 'ObjectValue',
															fields: [
																{
																	kind: 'ObjectField',
																	name: { kind: 'Name', value: 'memberType' },
																	value: {
																		kind: 'ObjectValue',
																		fields: [
																			{
																				kind: 'ObjectField',
																				name: { kind: 'Name', value: '_eq' },
																				value: {
																					kind: 'StringValue',
																					value: 'referent',
																					block: false,
																				},
																			},
																		],
																	},
																},
															],
														},
													},
													{
														kind: 'Argument',
														name: { kind: 'Name', value: 'order_by' },
														value: {
															kind: 'ObjectValue',
															fields: [
																{
																	kind: 'ObjectField',
																	name: { kind: 'Name', value: 'createdAt' },
																	value: { kind: 'EnumValue', value: 'desc' },
																},
															],
														},
													},
												],
												selectionSet: {
													kind: 'SelectionSet',
													selections: [
														{ kind: 'Field', name: { kind: 'Name', value: 'id' } },
														{ kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
														{
															kind: 'Field',
															name: { kind: 'Name', value: 'account' },
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
																				{
																					kind: 'Field',
																					name: { kind: 'Name', value: 'firstname' },
																				},
																				{
																					kind: 'Field',
																					name: { kind: 'Name', value: 'lastname' },
																				},
																			],
																		},
																	},
																],
															},
														},
													],
												},
											},
										],
									},
								},
							],
						},
					},
				],
			},
		},
	],
} as unknown as DocumentNode<GetBeneficiariesQuery, GetBeneficiariesQueryVariables>;
export const GetProfessionalsForManagerDocument = {
	kind: 'Document',
	definitions: [
		{
			kind: 'OperationDefinition',
			operation: 'query',
			name: { kind: 'Name', value: 'GetProfessionalsForManager' },
			selectionSet: {
				kind: 'SelectionSet',
				selections: [
					{
						kind: 'Field',
						name: { kind: 'Name', value: 'professional' },
						selectionSet: {
							kind: 'SelectionSet',
							selections: [
								{ kind: 'Field', name: { kind: 'Name', value: 'id' } },
								{ kind: 'Field', name: { kind: 'Name', value: 'firstname' } },
								{ kind: 'Field', name: { kind: 'Name', value: 'lastname' } },
								{ kind: 'Field', name: { kind: 'Name', value: 'mobileNumber' } },
								{ kind: 'Field', name: { kind: 'Name', value: 'position' } },
								{ kind: 'Field', name: { kind: 'Name', value: 'email' } },
								{ kind: 'Field', name: { kind: 'Name', value: 'structureId' } },
								{
									kind: 'Field',
									name: { kind: 'Name', value: 'account' },
									selectionSet: {
										kind: 'SelectionSet',
										selections: [{ kind: 'Field', name: { kind: 'Name', value: 'id' } }],
									},
								},
								{
									kind: 'Field',
									name: { kind: 'Name', value: 'structure' },
									selectionSet: {
										kind: 'SelectionSet',
										selections: [
											{ kind: 'Field', name: { kind: 'Name', value: 'id' } },
											{ kind: 'Field', name: { kind: 'Name', value: 'name' } },
										],
									},
								},
							],
						},
					},
				],
			},
		},
	],
} as unknown as DocumentNode<
	GetProfessionalsForManagerQuery,
	GetProfessionalsForManagerQueryVariables
>;
export const GetStructuresForManagerDocument = {
	kind: 'Document',
	definitions: [
		{
			kind: 'OperationDefinition',
			operation: 'query',
			name: { kind: 'Name', value: 'GetStructuresForManager' },
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
								{ kind: 'Field', name: { kind: 'Name', value: 'name' } },
							],
						},
					},
				],
			},
		},
	],
} as unknown as DocumentNode<GetStructuresForManagerQuery, GetStructuresForManagerQueryVariables>;
export const GetNotebooksStatsDocument = {
	kind: 'Document',
	definitions: [
		{
			kind: 'OperationDefinition',
			operation: 'query',
			name: { kind: 'Name', value: 'GetNotebooksStats' },
			variableDefinitions: [
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'afterDate' } },
					type: {
						kind: 'NonNullType',
						type: {
							kind: 'NamedType',
							name: { kind: 'Name', value: 'timestamptz_comparison_exp' },
						},
					},
				},
			],
			selectionSet: {
				kind: 'SelectionSet',
				selections: [
					{
						kind: 'Field',
						alias: { kind: 'Name', value: 'created' },
						name: { kind: 'Name', value: 'notebook_aggregate' },
						arguments: [
							{
								kind: 'Argument',
								name: { kind: 'Name', value: 'where' },
								value: {
									kind: 'ObjectValue',
									fields: [
										{
											kind: 'ObjectField',
											name: { kind: 'Name', value: '_and' },
											value: {
												kind: 'ListValue',
												values: [
													{
														kind: 'ObjectValue',
														fields: [
															{
																kind: 'ObjectField',
																name: { kind: 'Name', value: 'createdAt' },
																value: {
																	kind: 'Variable',
																	name: { kind: 'Name', value: 'afterDate' },
																},
															},
														],
													},
												],
											},
										},
									],
								},
							},
						],
						selectionSet: {
							kind: 'SelectionSet',
							selections: [
								{
									kind: 'Field',
									name: { kind: 'Name', value: 'aggregate' },
									selectionSet: {
										kind: 'SelectionSet',
										selections: [
											{
												kind: 'Field',
												name: { kind: 'Name', value: 'count' },
												arguments: [
													{
														kind: 'Argument',
														name: { kind: 'Name', value: 'distinct' },
														value: { kind: 'BooleanValue', value: false },
													},
												],
											},
										],
									},
								},
							],
						},
					},
					{
						kind: 'Field',
						alias: { kind: 'Name', value: 'shared' },
						name: { kind: 'Name', value: 'notebook_aggregate' },
						arguments: [
							{
								kind: 'Argument',
								name: { kind: 'Name', value: 'where' },
								value: {
									kind: 'ObjectValue',
									fields: [
										{
											kind: 'ObjectField',
											name: { kind: 'Name', value: '_and' },
											value: {
												kind: 'ListValue',
												values: [
													{
														kind: 'ObjectValue',
														fields: [
															{
																kind: 'ObjectField',
																name: { kind: 'Name', value: 'createdAt' },
																value: {
																	kind: 'Variable',
																	name: { kind: 'Name', value: 'afterDate' },
																},
															},
														],
													},
												],
											},
										},
									],
								},
							},
						],
						selectionSet: {
							kind: 'SelectionSet',
							selections: [
								{
									kind: 'Field',
									name: { kind: 'Name', value: 'nodes' },
									selectionSet: {
										kind: 'SelectionSet',
										selections: [
											{ kind: 'Field', name: { kind: 'Name', value: 'id' } },
											{
												kind: 'Field',
												name: { kind: 'Name', value: 'members_aggregate' },
												selectionSet: {
													kind: 'SelectionSet',
													selections: [
														{
															kind: 'Field',
															name: { kind: 'Name', value: 'aggregate' },
															selectionSet: {
																kind: 'SelectionSet',
																selections: [
																	{
																		kind: 'Field',
																		name: { kind: 'Name', value: 'count' },
																		arguments: [
																			{
																				kind: 'Argument',
																				name: { kind: 'Name', value: 'distinct' },
																				value: { kind: 'BooleanValue', value: false },
																			},
																		],
																	},
																],
															},
														},
													],
												},
											},
										],
									},
								},
							],
						},
					},
					{
						kind: 'Field',
						alias: { kind: 'Name', value: 'open' },
						name: { kind: 'Name', value: 'notebook_aggregate' },
						arguments: [
							{
								kind: 'Argument',
								name: { kind: 'Name', value: 'where' },
								value: {
									kind: 'ObjectValue',
									fields: [
										{
											kind: 'ObjectField',
											name: { kind: 'Name', value: 'members' },
											value: {
												kind: 'ObjectValue',
												fields: [
													{
														kind: 'ObjectField',
														name: { kind: 'Name', value: 'lastVisitedAt' },
														value: { kind: 'Variable', name: { kind: 'Name', value: 'afterDate' } },
													},
												],
											},
										},
									],
								},
							},
						],
						selectionSet: {
							kind: 'SelectionSet',
							selections: [
								{
									kind: 'Field',
									name: { kind: 'Name', value: 'aggregate' },
									selectionSet: {
										kind: 'SelectionSet',
										selections: [
											{
												kind: 'Field',
												name: { kind: 'Name', value: 'count' },
												arguments: [
													{
														kind: 'Argument',
														name: { kind: 'Name', value: 'distinct' },
														value: { kind: 'BooleanValue', value: false },
													},
												],
											},
										],
									},
								},
							],
						},
					},
					{
						kind: 'Field',
						alias: { kind: 'Name', value: 'modified' },
						name: { kind: 'Name', value: 'notebook_aggregate' },
						arguments: [
							{
								kind: 'Argument',
								name: { kind: 'Name', value: 'where' },
								value: {
									kind: 'ObjectValue',
									fields: [
										{
											kind: 'ObjectField',
											name: { kind: 'Name', value: 'members' },
											value: {
												kind: 'ObjectValue',
												fields: [
													{
														kind: 'ObjectField',
														name: { kind: 'Name', value: 'lastModifiedAt' },
														value: { kind: 'Variable', name: { kind: 'Name', value: 'afterDate' } },
													},
												],
											},
										},
									],
								},
							},
						],
						selectionSet: {
							kind: 'SelectionSet',
							selections: [
								{
									kind: 'Field',
									name: { kind: 'Name', value: 'aggregate' },
									selectionSet: {
										kind: 'SelectionSet',
										selections: [
											{
												kind: 'Field',
												name: { kind: 'Name', value: 'count' },
												arguments: [
													{
														kind: 'Argument',
														name: { kind: 'Name', value: 'distinct' },
														value: { kind: 'BooleanValue', value: false },
													},
												],
											},
										],
									},
								},
							],
						},
					},
					{
						kind: 'Field',
						alias: { kind: 'Name', value: 'infoAdded' },
						name: { kind: 'Name', value: 'notebook_aggregate' },
						arguments: [
							{
								kind: 'Argument',
								name: { kind: 'Name', value: 'where' },
								value: {
									kind: 'ObjectValue',
									fields: [
										{
											kind: 'ObjectField',
											name: { kind: 'Name', value: 'focuses' },
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
																			name: { kind: 'Name', value: 'createdAt' },
																			value: {
																				kind: 'Variable',
																				name: { kind: 'Name', value: 'afterDate' },
																			},
																		},
																	],
																},
																{
																	kind: 'ObjectValue',
																	fields: [
																		{
																			kind: 'ObjectField',
																			name: { kind: 'Name', value: 'updatedAt' },
																			value: {
																				kind: 'Variable',
																				name: { kind: 'Name', value: 'afterDate' },
																			},
																		},
																	],
																},
																{
																	kind: 'ObjectValue',
																	fields: [
																		{
																			kind: 'ObjectField',
																			name: { kind: 'Name', value: 'targets' },
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
																											name: { kind: 'Name', value: 'createdAt' },
																											value: {
																												kind: 'Variable',
																												name: { kind: 'Name', value: 'afterDate' },
																											},
																										},
																									],
																								},
																								{
																									kind: 'ObjectValue',
																									fields: [
																										{
																											kind: 'ObjectField',
																											name: { kind: 'Name', value: 'updatedAt' },
																											value: {
																												kind: 'Variable',
																												name: { kind: 'Name', value: 'afterDate' },
																											},
																										},
																									],
																								},
																								{
																									kind: 'ObjectValue',
																									fields: [
																										{
																											kind: 'ObjectField',
																											name: { kind: 'Name', value: 'actions' },
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
																																			name: {
																																				kind: 'Name',
																																				value: 'createdAt',
																																			},
																																			value: {
																																				kind: 'Variable',
																																				name: {
																																					kind: 'Name',
																																					value: 'afterDate',
																																				},
																																			},
																																		},
																																	],
																																},
																																{
																																	kind: 'ObjectValue',
																																	fields: [
																																		{
																																			kind: 'ObjectField',
																																			name: {
																																				kind: 'Name',
																																				value: 'updatedAt',
																																			},
																																			value: {
																																				kind: 'Variable',
																																				name: {
																																					kind: 'Name',
																																					value: 'afterDate',
																																				},
																																			},
																																		},
																																	],
																																},
																															],
																														},
																													},
																												],
																											},
																										},
																									],
																								},
																							],
																						},
																					},
																				],
																			},
																		},
																	],
																},
															],
														},
													},
												],
											},
										},
									],
								},
							},
						],
						selectionSet: {
							kind: 'SelectionSet',
							selections: [
								{
									kind: 'Field',
									name: { kind: 'Name', value: 'aggregate' },
									selectionSet: {
										kind: 'SelectionSet',
										selections: [
											{
												kind: 'Field',
												name: { kind: 'Name', value: 'count' },
												arguments: [
													{
														kind: 'Argument',
														name: { kind: 'Name', value: 'distinct' },
														value: { kind: 'BooleanValue', value: false },
													},
												],
											},
										],
									},
								},
							],
						},
					},
					{
						kind: 'Field',
						alias: { kind: 'Name', value: 'structConnections' },
						name: { kind: 'Name', value: 'structure' },
						selectionSet: {
							kind: 'SelectionSet',
							selections: [
								{ kind: 'Field', name: { kind: 'Name', value: 'id' } },
								{ kind: 'Field', name: { kind: 'Name', value: 'name' } },
								{ kind: 'Field', name: { kind: 'Name', value: 'city' } },
								{
									kind: 'Field',
									name: { kind: 'Name', value: 'professionals_aggregate' },
									arguments: [
										{
											kind: 'Argument',
											name: { kind: 'Name', value: 'where' },
											value: {
												kind: 'ObjectValue',
												fields: [
													{
														kind: 'ObjectField',
														name: { kind: 'Name', value: 'account' },
														value: {
															kind: 'ObjectValue',
															fields: [
																{
																	kind: 'ObjectField',
																	name: { kind: 'Name', value: 'lastLogin' },
																	value: {
																		kind: 'Variable',
																		name: { kind: 'Name', value: 'afterDate' },
																	},
																},
															],
														},
													},
												],
											},
										},
									],
									selectionSet: {
										kind: 'SelectionSet',
										selections: [
											{
												kind: 'Field',
												name: { kind: 'Name', value: 'aggregate' },
												selectionSet: {
													kind: 'SelectionSet',
													selections: [
														{
															kind: 'Field',
															name: { kind: 'Name', value: 'count' },
															arguments: [
																{
																	kind: 'Argument',
																	name: { kind: 'Name', value: 'distinct' },
																	value: { kind: 'BooleanValue', value: false },
																},
															],
														},
													],
												},
											},
										],
									},
								},
							],
						},
					},
				],
			},
		},
	],
} as unknown as DocumentNode<GetNotebooksStatsQuery, GetNotebooksStatsQueryVariables>;
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
						alias: { kind: 'Name', value: 'accounts' },
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
														value: { kind: 'StringValue', value: 'professional', block: false },
													},
												],
											},
										},
									],
								},
							},
							{
								kind: 'Argument',
								name: { kind: 'Name', value: 'order_by' },
								value: {
									kind: 'ObjectValue',
									fields: [
										{
											kind: 'ObjectField',
											name: { kind: 'Name', value: 'confirmed' },
											value: { kind: 'EnumValue', value: 'asc' },
										},
										{
											kind: 'ObjectField',
											name: { kind: 'Name', value: 'professional' },
											value: {
												kind: 'ObjectValue',
												fields: [
													{
														kind: 'ObjectField',
														name: { kind: 'Name', value: 'lastname' },
														value: { kind: 'EnumValue', value: 'asc' },
													},
												],
											},
										},
									],
								},
							},
						],
						selectionSet: {
							kind: 'SelectionSet',
							selections: [
								{ kind: 'Field', name: { kind: 'Name', value: 'id' } },
								{ kind: 'Field', name: { kind: 'Name', value: 'username' } },
								{ kind: 'Field', name: { kind: 'Name', value: 'lastLogin' } },
								{ kind: 'Field', name: { kind: 'Name', value: 'confirmed' } },
								{ kind: 'Field', name: { kind: 'Name', value: 'onboardingDone' } },
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
											{ kind: 'Field', name: { kind: 'Name', value: 'mobileNumber' } },
											{ kind: 'Field', name: { kind: 'Name', value: 'email' } },
											{
												kind: 'Field',
												name: { kind: 'Name', value: 'structure' },
												selectionSet: {
													kind: 'SelectionSet',
													selections: [
														{ kind: 'Field', name: { kind: 'Name', value: 'id' } },
														{ kind: 'Field', name: { kind: 'Name', value: 'name' } },
													],
												},
											},
										],
									},
								},
							],
						},
					},
				],
			},
		},
	],
} as unknown as DocumentNode<GetAccountsSummaryQuery, GetAccountsSummaryQueryVariables>;
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
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'accountId' } },
					type: {
						kind: 'NonNullType',
						type: { kind: 'NamedType', name: { kind: 'Name', value: 'uuid' } },
					},
				},
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
											name: { kind: 'Name', value: 'lastVisitedAt' },
											value: { kind: 'EnumValue', value: 'desc_nulls_last' },
										},
									],
								},
							},
							{
								kind: 'Argument',
								name: { kind: 'Name', value: 'limit' },
								value: { kind: 'IntValue', value: '3' },
							},
							{
								kind: 'Argument',
								name: { kind: 'Name', value: 'where' },
								value: {
									kind: 'ObjectValue',
									fields: [
										{
											kind: 'ObjectField',
											name: { kind: 'Name', value: 'accountId' },
											value: {
												kind: 'ObjectValue',
												fields: [
													{
														kind: 'ObjectField',
														name: { kind: 'Name', value: '_eq' },
														value: { kind: 'Variable', name: { kind: 'Name', value: 'accountId' } },
													},
												],
											},
										},
										{
											kind: 'ObjectField',
											name: { kind: 'Name', value: 'lastVisitedAt' },
											value: {
												kind: 'ObjectValue',
												fields: [
													{
														kind: 'ObjectField',
														name: { kind: 'Name', value: '_is_null' },
														value: { kind: 'BooleanValue', value: false },
													},
												],
											},
										},
									],
								},
							},
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
											{ kind: 'Field', name: { kind: 'Name', value: 'id' } },
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
														{ kind: 'Field', name: { kind: 'Name', value: 'dateOfBirth' } },
													],
												},
											},
										],
									},
								},
							],
						},
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
											name: { kind: 'Name', value: 'lastModifiedAt' },
											value: { kind: 'EnumValue', value: 'desc_nulls_last' },
										},
									],
								},
							},
							{
								kind: 'Argument',
								name: { kind: 'Name', value: 'limit' },
								value: { kind: 'IntValue', value: '3' },
							},
							{
								kind: 'Argument',
								name: { kind: 'Name', value: 'where' },
								value: {
									kind: 'ObjectValue',
									fields: [
										{
											kind: 'ObjectField',
											name: { kind: 'Name', value: 'accountId' },
											value: {
												kind: 'ObjectValue',
												fields: [
													{
														kind: 'ObjectField',
														name: { kind: 'Name', value: '_eq' },
														value: { kind: 'Variable', name: { kind: 'Name', value: 'accountId' } },
													},
												],
											},
										},
										{
											kind: 'ObjectField',
											name: { kind: 'Name', value: 'lastModifiedAt' },
											value: {
												kind: 'ObjectValue',
												fields: [
													{
														kind: 'ObjectField',
														name: { kind: 'Name', value: '_is_null' },
														value: { kind: 'BooleanValue', value: false },
													},
												],
											},
										},
									],
								},
							},
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
											{ kind: 'Field', name: { kind: 'Name', value: 'id' } },
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
														{ kind: 'Field', name: { kind: 'Name', value: 'dateOfBirth' } },
													],
												},
											},
										],
									},
								},
							],
						},
					},
				],
			},
		},
	],
} as unknown as DocumentNode<GetLastVisitedOrUpdatedQuery, GetLastVisitedOrUpdatedQueryVariables>;
export const CreateBeneficiaryDocument = {
	kind: 'Document',
	definitions: [
		{
			kind: 'OperationDefinition',
			operation: 'mutation',
			name: { kind: 'Name', value: 'CreateBeneficiary' },
			variableDefinitions: [
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'firstname' } },
					type: {
						kind: 'NonNullType',
						type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
					},
				},
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'lastname' } },
					type: {
						kind: 'NonNullType',
						type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
					},
				},
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'dateOfBirth' } },
					type: {
						kind: 'NonNullType',
						type: { kind: 'NamedType', name: { kind: 'Name', value: 'date' } },
					},
				},
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'mobileNumber' } },
					type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
				},
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'email' } },
					type: { kind: 'NamedType', name: { kind: 'Name', value: 'citext' } },
				},
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'address1' } },
					type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
				},
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'address2' } },
					type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
				},
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'postalCode' } },
					type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
				},
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'city' } },
					type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
				},
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'workSituation' } },
					type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
				},
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'cafNumber' } },
					type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
				},
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'peNumber' } },
					type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
				},
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'members' } },
					type: {
						kind: 'NonNullType',
						type: {
							kind: 'ListType',
							type: {
								kind: 'NonNullType',
								type: {
									kind: 'NamedType',
									name: { kind: 'Name', value: 'notebook_member_insert_input' },
								},
							},
						},
					},
				},
			],
			selectionSet: {
				kind: 'SelectionSet',
				selections: [
					{
						kind: 'Field',
						alias: { kind: 'Name', value: 'newNotebook' },
						name: { kind: 'Name', value: 'insert_notebook_one' },
						arguments: [
							{
								kind: 'Argument',
								name: { kind: 'Name', value: 'object' },
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
														name: { kind: 'Name', value: 'data' },
														value: {
															kind: 'ObjectValue',
															fields: [
																{
																	kind: 'ObjectField',
																	name: { kind: 'Name', value: 'firstname' },
																	value: {
																		kind: 'Variable',
																		name: { kind: 'Name', value: 'firstname' },
																	},
																},
																{
																	kind: 'ObjectField',
																	name: { kind: 'Name', value: 'lastname' },
																	value: {
																		kind: 'Variable',
																		name: { kind: 'Name', value: 'lastname' },
																	},
																},
																{
																	kind: 'ObjectField',
																	name: { kind: 'Name', value: 'dateOfBirth' },
																	value: {
																		kind: 'Variable',
																		name: { kind: 'Name', value: 'dateOfBirth' },
																	},
																},
																{
																	kind: 'ObjectField',
																	name: { kind: 'Name', value: 'mobileNumber' },
																	value: {
																		kind: 'Variable',
																		name: { kind: 'Name', value: 'mobileNumber' },
																	},
																},
																{
																	kind: 'ObjectField',
																	name: { kind: 'Name', value: 'email' },
																	value: {
																		kind: 'Variable',
																		name: { kind: 'Name', value: 'email' },
																	},
																},
																{
																	kind: 'ObjectField',
																	name: { kind: 'Name', value: 'address1' },
																	value: {
																		kind: 'Variable',
																		name: { kind: 'Name', value: 'address1' },
																	},
																},
																{
																	kind: 'ObjectField',
																	name: { kind: 'Name', value: 'address2' },
																	value: {
																		kind: 'Variable',
																		name: { kind: 'Name', value: 'address2' },
																	},
																},
																{
																	kind: 'ObjectField',
																	name: { kind: 'Name', value: 'postalCode' },
																	value: {
																		kind: 'Variable',
																		name: { kind: 'Name', value: 'postalCode' },
																	},
																},
																{
																	kind: 'ObjectField',
																	name: { kind: 'Name', value: 'city' },
																	value: {
																		kind: 'Variable',
																		name: { kind: 'Name', value: 'city' },
																	},
																},
																{
																	kind: 'ObjectField',
																	name: { kind: 'Name', value: 'cafNumber' },
																	value: {
																		kind: 'Variable',
																		name: { kind: 'Name', value: 'cafNumber' },
																	},
																},
																{
																	kind: 'ObjectField',
																	name: { kind: 'Name', value: 'peNumber' },
																	value: {
																		kind: 'Variable',
																		name: { kind: 'Name', value: 'peNumber' },
																	},
																},
															],
														},
													},
												],
											},
										},
										{
											kind: 'ObjectField',
											name: { kind: 'Name', value: 'events' },
											value: {
												kind: 'ObjectValue',
												fields: [
													{
														kind: 'ObjectField',
														name: { kind: 'Name', value: 'data' },
														value: { kind: 'ListValue', values: [] },
													},
												],
											},
										},
										{
											kind: 'ObjectField',
											name: { kind: 'Name', value: 'members' },
											value: {
												kind: 'ObjectValue',
												fields: [
													{
														kind: 'ObjectField',
														name: { kind: 'Name', value: 'data' },
														value: { kind: 'Variable', name: { kind: 'Name', value: 'members' } },
													},
												],
											},
										},
										{
											kind: 'ObjectField',
											name: { kind: 'Name', value: 'workSituation' },
											value: { kind: 'Variable', name: { kind: 'Name', value: 'workSituation' } },
										},
									],
								},
							},
						],
						selectionSet: {
							kind: 'SelectionSet',
							selections: [{ kind: 'Field', name: { kind: 'Name', value: 'id' } }],
						},
					},
				],
			},
		},
	],
} as unknown as DocumentNode<CreateBeneficiaryMutation, CreateBeneficiaryMutationVariables>;
export const SearchNotebookMemberDocument = {
	kind: 'Document',
	definitions: [
		{
			kind: 'OperationDefinition',
			operation: 'query',
			name: { kind: 'Name', value: 'SearchNotebookMember' },
			variableDefinitions: [
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'accountId' } },
					type: {
						kind: 'NonNullType',
						type: { kind: 'NamedType', name: { kind: 'Name', value: 'uuid' } },
					},
				},
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'filter' } },
					type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
				},
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'visitDate' } },
					type: {
						kind: 'NonNullType',
						type: {
							kind: 'NamedType',
							name: { kind: 'Name', value: 'timestamptz_comparison_exp' },
						},
					},
				},
			],
			selectionSet: {
				kind: 'SelectionSet',
				selections: [
					{
						kind: 'Field',
						name: { kind: 'Name', value: 'search_notebook_members' },
						arguments: [
							{
								kind: 'Argument',
								name: { kind: 'Name', value: 'args' },
								value: {
									kind: 'ObjectValue',
									fields: [
										{
											kind: 'ObjectField',
											name: { kind: 'Name', value: 'search' },
											value: { kind: 'Variable', name: { kind: 'Name', value: 'filter' } },
										},
									],
								},
							},
							{
								kind: 'Argument',
								name: { kind: 'Name', value: 'where' },
								value: {
									kind: 'ObjectValue',
									fields: [
										{
											kind: 'ObjectField',
											name: { kind: 'Name', value: 'accountId' },
											value: {
												kind: 'ObjectValue',
												fields: [
													{
														kind: 'ObjectField',
														name: { kind: 'Name', value: '_eq' },
														value: { kind: 'Variable', name: { kind: 'Name', value: 'accountId' } },
													},
												],
											},
										},
										{
											kind: 'ObjectField',
											name: { kind: 'Name', value: 'lastVisitedAt' },
											value: { kind: 'Variable', name: { kind: 'Name', value: 'visitDate' } },
										},
									],
								},
							},
							{
								kind: 'Argument',
								name: { kind: 'Name', value: 'order_by' },
								value: {
									kind: 'ObjectValue',
									fields: [
										{
											kind: 'ObjectField',
											name: { kind: 'Name', value: 'lastModifiedAt' },
											value: { kind: 'EnumValue', value: 'desc_nulls_first' },
										},
									],
								},
							},
						],
						selectionSet: {
							kind: 'SelectionSet',
							selections: [
								{ kind: 'Field', name: { kind: 'Name', value: 'id' } },
								{
									kind: 'Field',
									name: { kind: 'Name', value: 'notebook' },
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
														{ kind: 'Field', name: { kind: 'Name', value: 'dateOfBirth' } },
														{ kind: 'Field', name: { kind: 'Name', value: 'firstname' } },
														{ kind: 'Field', name: { kind: 'Name', value: 'id' } },
														{ kind: 'Field', name: { kind: 'Name', value: 'lastname' } },
														{ kind: 'Field', name: { kind: 'Name', value: 'mobileNumber' } },
													],
												},
											},
										],
									},
								},
							],
						},
					},
				],
			},
		},
	],
} as unknown as DocumentNode<SearchNotebookMemberQuery, SearchNotebookMemberQueryVariables>;
export const GetNotebookDocument = {
	kind: 'Document',
	definitions: [
		{
			kind: 'OperationDefinition',
			operation: 'query',
			name: { kind: 'Name', value: 'GetNotebook' },
			variableDefinitions: [
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
					type: {
						kind: 'NonNullType',
						type: { kind: 'NamedType', name: { kind: 'Name', value: 'uuid' } },
					},
				},
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'eventsStart' } },
					type: { kind: 'NamedType', name: { kind: 'Name', value: 'timestamptz' } },
				},
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'eventsEnd' } },
					type: { kind: 'NamedType', name: { kind: 'Name', value: 'timestamptz' } },
				},
			],
			selectionSet: {
				kind: 'SelectionSet',
				selections: [
					{
						kind: 'Field',
						alias: { kind: 'Name', value: 'notebook' },
						name: { kind: 'Name', value: 'notebook_by_pk' },
						arguments: [
							{
								kind: 'Argument',
								name: { kind: 'Name', value: 'id' },
								value: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
							},
						],
						selectionSet: {
							kind: 'SelectionSet',
							selections: [
								{ kind: 'Field', name: { kind: 'Name', value: 'id' } },
								{ kind: 'Field', name: { kind: 'Name', value: 'workSituationDate' } },
								{ kind: 'Field', name: { kind: 'Name', value: 'workSituation' } },
								{ kind: 'Field', name: { kind: 'Name', value: 'rightRsa' } },
								{ kind: 'Field', name: { kind: 'Name', value: 'rightRqth' } },
								{ kind: 'Field', name: { kind: 'Name', value: 'rightAre' } },
								{ kind: 'Field', name: { kind: 'Name', value: 'rightAss' } },
								{ kind: 'Field', name: { kind: 'Name', value: 'rightBonus' } },
								{ kind: 'Field', name: { kind: 'Name', value: 'geographicalArea' } },
								{ kind: 'Field', name: { kind: 'Name', value: 'educationLevel' } },
								{ kind: 'Field', name: { kind: 'Name', value: 'contractType' } },
								{ kind: 'Field', name: { kind: 'Name', value: 'contractSignDate' } },
								{
									kind: 'Field',
									name: { kind: 'Name', value: 'wantedJobs' },
									selectionSet: {
										kind: 'SelectionSet',
										selections: [
											{
												kind: 'Field',
												name: { kind: 'Name', value: 'rome_code' },
												selectionSet: {
													kind: 'SelectionSet',
													selections: [
														{ kind: 'Field', name: { kind: 'Name', value: 'id' } },
														{ kind: 'Field', name: { kind: 'Name', value: 'label' } },
													],
												},
											},
										],
									},
								},
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
											{ kind: 'Field', name: { kind: 'Name', value: 'postalCode' } },
										],
									},
								},
								{
									kind: 'Field',
									name: { kind: 'Name', value: 'focuses' },
									arguments: [
										{
											kind: 'Argument',
											name: { kind: 'Name', value: 'order_by' },
											value: {
												kind: 'ObjectValue',
												fields: [
													{
														kind: 'ObjectField',
														name: { kind: 'Name', value: 'theme' },
														value: { kind: 'EnumValue', value: 'asc_nulls_last' },
													},
												],
											},
										},
									],
									selectionSet: {
										kind: 'SelectionSet',
										selections: [
											{ kind: 'Field', name: { kind: 'Name', value: 'id' } },
											{ kind: 'Field', name: { kind: 'Name', value: 'theme' } },
											{ kind: 'Field', name: { kind: 'Name', value: 'situations' } },
											{ kind: 'Field', name: { kind: 'Name', value: 'linkedTo' } },
											{
												kind: 'Field',
												name: { kind: 'Name', value: 'targets' },
												selectionSet: {
													kind: 'SelectionSet',
													selections: [
														{ kind: 'Field', name: { kind: 'Name', value: 'id' } },
														{ kind: 'Field', name: { kind: 'Name', value: 'target' } },
														{
															kind: 'Field',
															name: { kind: 'Name', value: 'actions_aggregate' },
															arguments: [
																{
																	kind: 'Argument',
																	name: { kind: 'Name', value: 'where' },
																	value: {
																		kind: 'ObjectValue',
																		fields: [
																			{
																				kind: 'ObjectField',
																				name: { kind: 'Name', value: 'status' },
																				value: {
																					kind: 'ObjectValue',
																					fields: [
																						{
																							kind: 'ObjectField',
																							name: { kind: 'Name', value: '_eq' },
																							value: {
																								kind: 'StringValue',
																								value: 'in_progress',
																								block: false,
																							},
																						},
																					],
																				},
																			},
																		],
																	},
																},
															],
															selectionSet: {
																kind: 'SelectionSet',
																selections: [
																	{
																		kind: 'Field',
																		name: { kind: 'Name', value: 'aggregate' },
																		selectionSet: {
																			kind: 'SelectionSet',
																			selections: [
																				{ kind: 'Field', name: { kind: 'Name', value: 'count' } },
																			],
																		},
																	},
																],
															},
														},
													],
												},
											},
										],
									},
								},
								{
									kind: 'Field',
									name: { kind: 'Name', value: 'members' },
									arguments: [
										{
											kind: 'Argument',
											name: { kind: 'Name', value: 'order_by' },
											value: {
												kind: 'ObjectValue',
												fields: [
													{
														kind: 'ObjectField',
														name: { kind: 'Name', value: 'lastModifiedAt' },
														value: { kind: 'EnumValue', value: 'desc_nulls_last' },
													},
												],
											},
										},
									],
									selectionSet: {
										kind: 'SelectionSet',
										selections: [
											{ kind: 'Field', name: { kind: 'Name', value: 'id' } },
											{ kind: 'Field', name: { kind: 'Name', value: 'memberType' } },
											{ kind: 'Field', name: { kind: 'Name', value: 'lastModifiedAt' } },
											{ kind: 'Field', name: { kind: 'Name', value: 'lastVisitedAt' } },
											{ kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
											{
												kind: 'Field',
												name: { kind: 'Name', value: 'account' },
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
																	{ kind: 'Field', name: { kind: 'Name', value: 'lastname' } },
																	{ kind: 'Field', name: { kind: 'Name', value: 'firstname' } },
																	{ kind: 'Field', name: { kind: 'Name', value: 'position' } },
																	{ kind: 'Field', name: { kind: 'Name', value: 'email' } },
																	{ kind: 'Field', name: { kind: 'Name', value: 'mobileNumber' } },
																	{
																		kind: 'Field',
																		name: { kind: 'Name', value: 'structure' },
																		selectionSet: {
																			kind: 'SelectionSet',
																			selections: [
																				{ kind: 'Field', name: { kind: 'Name', value: 'id' } },
																				{ kind: 'Field', name: { kind: 'Name', value: 'name' } },
																				{
																					kind: 'Field',
																					name: { kind: 'Name', value: 'address1' },
																				},
																				{
																					kind: 'Field',
																					name: { kind: 'Name', value: 'address2' },
																				},
																				{
																					kind: 'Field',
																					name: { kind: 'Name', value: 'postalCode' },
																				},
																				{ kind: 'Field', name: { kind: 'Name', value: 'city' } },
																				{ kind: 'Field', name: { kind: 'Name', value: 'website' } },
																			],
																		},
																	},
																],
															},
														},
													],
												},
											},
										],
									},
								},
								{
									kind: 'Field',
									name: { kind: 'Name', value: 'appointments' },
									arguments: [
										{
											kind: 'Argument',
											name: { kind: 'Name', value: 'where' },
											value: {
												kind: 'ObjectValue',
												fields: [
													{
														kind: 'ObjectField',
														name: { kind: 'Name', value: 'notebookId' },
														value: {
															kind: 'ObjectValue',
															fields: [
																{
																	kind: 'ObjectField',
																	name: { kind: 'Name', value: '_eq' },
																	value: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
																},
															],
														},
													},
												],
											},
										},
										{
											kind: 'Argument',
											name: { kind: 'Name', value: 'distinct_on' },
											value: { kind: 'EnumValue', value: 'memberAccountId' },
										},
										{
											kind: 'Argument',
											name: { kind: 'Name', value: 'order_by' },
											value: {
												kind: 'ListValue',
												values: [
													{
														kind: 'ObjectValue',
														fields: [
															{
																kind: 'ObjectField',
																name: { kind: 'Name', value: 'memberAccountId' },
																value: { kind: 'EnumValue', value: 'asc' },
															},
														],
													},
													{
														kind: 'ObjectValue',
														fields: [
															{
																kind: 'ObjectField',
																name: { kind: 'Name', value: 'date' },
																value: { kind: 'EnumValue', value: 'desc' },
															},
														],
													},
												],
											},
										},
									],
									selectionSet: {
										kind: 'SelectionSet',
										selections: [
											{ kind: 'Field', name: { kind: 'Name', value: 'date' } },
											{ kind: 'Field', name: { kind: 'Name', value: 'memberAccountId' } },
										],
									},
								},
								{
									kind: 'Field',
									name: { kind: 'Name', value: 'events' },
									arguments: [
										{
											kind: 'Argument',
											name: { kind: 'Name', value: 'order_by' },
											value: {
												kind: 'ObjectValue',
												fields: [
													{
														kind: 'ObjectField',
														name: { kind: 'Name', value: 'eventDate' },
														value: { kind: 'EnumValue', value: 'desc_nulls_first' },
													},
												],
											},
										},
										{
											kind: 'Argument',
											name: { kind: 'Name', value: 'where' },
											value: {
												kind: 'ObjectValue',
												fields: [
													{
														kind: 'ObjectField',
														name: { kind: 'Name', value: 'eventDate' },
														value: {
															kind: 'ObjectValue',
															fields: [
																{
																	kind: 'ObjectField',
																	name: { kind: 'Name', value: '_gte' },
																	value: {
																		kind: 'Variable',
																		name: { kind: 'Name', value: 'eventsStart' },
																	},
																},
																{
																	kind: 'ObjectField',
																	name: { kind: 'Name', value: '_lte' },
																	value: {
																		kind: 'Variable',
																		name: { kind: 'Name', value: 'eventsEnd' },
																	},
																},
															],
														},
													},
												],
											},
										},
									],
									selectionSet: {
										kind: 'SelectionSet',
										selections: [
											{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'eventFields' } },
										],
									},
								},
							],
						},
					},
				],
			},
		},
		...EventFieldsFragmentDoc.definitions,
	],
} as unknown as DocumentNode<GetNotebookQuery, GetNotebookQueryVariables>;
export const GetNotebookEventsDocument = {
	kind: 'Document',
	definitions: [
		{
			kind: 'OperationDefinition',
			operation: 'query',
			name: { kind: 'Name', value: 'GetNotebookEvents' },
			variableDefinitions: [
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'eventsStart' } },
					type: { kind: 'NamedType', name: { kind: 'Name', value: 'timestamptz' } },
				},
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'eventsEnd' } },
					type: { kind: 'NamedType', name: { kind: 'Name', value: 'timestamptz' } },
				},
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'notebookId' } },
					type: {
						kind: 'NonNullType',
						type: { kind: 'NamedType', name: { kind: 'Name', value: 'uuid' } },
					},
				},
			],
			selectionSet: {
				kind: 'SelectionSet',
				selections: [
					{
						kind: 'Field',
						name: { kind: 'Name', value: 'notebook_event' },
						arguments: [
							{
								kind: 'Argument',
								name: { kind: 'Name', value: 'order_by' },
								value: {
									kind: 'ObjectValue',
									fields: [
										{
											kind: 'ObjectField',
											name: { kind: 'Name', value: 'eventDate' },
											value: { kind: 'EnumValue', value: 'desc_nulls_last' },
										},
									],
								},
							},
							{
								kind: 'Argument',
								name: { kind: 'Name', value: 'where' },
								value: {
									kind: 'ObjectValue',
									fields: [
										{
											kind: 'ObjectField',
											name: { kind: 'Name', value: 'eventDate' },
											value: {
												kind: 'ObjectValue',
												fields: [
													{
														kind: 'ObjectField',
														name: { kind: 'Name', value: '_gte' },
														value: {
															kind: 'Variable',
															name: { kind: 'Name', value: 'eventsStart' },
														},
													},
													{
														kind: 'ObjectField',
														name: { kind: 'Name', value: '_lte' },
														value: { kind: 'Variable', name: { kind: 'Name', value: 'eventsEnd' } },
													},
												],
											},
										},
										{
											kind: 'ObjectField',
											name: { kind: 'Name', value: 'notebookId' },
											value: {
												kind: 'ObjectValue',
												fields: [
													{
														kind: 'ObjectField',
														name: { kind: 'Name', value: '_eq' },
														value: {
															kind: 'Variable',
															name: { kind: 'Name', value: 'notebookId' },
														},
													},
												],
											},
										},
									],
								},
							},
						],
						selectionSet: {
							kind: 'SelectionSet',
							selections: [
								{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'eventFields' } },
							],
						},
					},
				],
			},
		},
		...EventFieldsFragmentDoc.definitions,
	],
} as unknown as DocumentNode<GetNotebookEventsQuery, GetNotebookEventsQueryVariables>;
export const GetNotebookMemberByIdDocument = {
	kind: 'Document',
	definitions: [
		{
			kind: 'OperationDefinition',
			operation: 'query',
			name: { kind: 'Name', value: 'GetNotebookMemberById' },
			variableDefinitions: [
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
					type: {
						kind: 'NonNullType',
						type: { kind: 'NamedType', name: { kind: 'Name', value: 'uuid' } },
					},
				},
			],
			selectionSet: {
				kind: 'SelectionSet',
				selections: [
					{
						kind: 'Field',
						alias: { kind: 'Name', value: 'member' },
						name: { kind: 'Name', value: 'notebook_member_by_pk' },
						arguments: [
							{
								kind: 'Argument',
								name: { kind: 'Name', value: 'id' },
								value: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
							},
						],
						selectionSet: {
							kind: 'SelectionSet',
							selections: [
								{ kind: 'Field', name: { kind: 'Name', value: 'notebookId' } },
								{
									kind: 'Field',
									name: { kind: 'Name', value: 'creator' },
									selectionSet: {
										kind: 'SelectionSet',
										selections: [
											{
												kind: 'Field',
												name: { kind: 'Name', value: 'professional' },
												selectionSet: {
													kind: 'SelectionSet',
													selections: [
														{ kind: 'Field', name: { kind: 'Name', value: 'firstname' } },
														{ kind: 'Field', name: { kind: 'Name', value: 'lastname' } },
														{ kind: 'Field', name: { kind: 'Name', value: 'email' } },
														{ kind: 'Field', name: { kind: 'Name', value: 'id' } },
													],
												},
											},
										],
									},
								},
								{
									kind: 'Field',
									name: { kind: 'Name', value: 'account' },
									selectionSet: {
										kind: 'SelectionSet',
										selections: [
											{ kind: 'Field', name: { kind: 'Name', value: 'id' } },
											{ kind: 'Field', name: { kind: 'Name', value: 'confirmed' } },
											{
												kind: 'Field',
												name: { kind: 'Name', value: 'professional' },
												selectionSet: {
													kind: 'SelectionSet',
													selections: [
														{ kind: 'Field', name: { kind: 'Name', value: 'firstname' } },
														{ kind: 'Field', name: { kind: 'Name', value: 'lastname' } },
														{ kind: 'Field', name: { kind: 'Name', value: 'email' } },
														{ kind: 'Field', name: { kind: 'Name', value: 'id' } },
													],
												},
											},
										],
									},
								},
							],
						},
					},
				],
			},
		},
	],
} as unknown as DocumentNode<GetNotebookMemberByIdQuery, GetNotebookMemberByIdQueryVariables>;
export const GetRomeCodesDocument = {
	kind: 'Document',
	definitions: [
		{
			kind: 'OperationDefinition',
			operation: 'query',
			name: { kind: 'Name', value: 'GetRomeCodes' },
			variableDefinitions: [
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'search' } },
					type: {
						kind: 'NonNullType',
						type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
					},
				},
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'labels' } },
					type: {
						kind: 'ListType',
						type: {
							kind: 'NonNullType',
							type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
						},
					},
				},
			],
			selectionSet: {
				kind: 'SelectionSet',
				selections: [
					{
						kind: 'Field',
						name: { kind: 'Name', value: 'search_rome_codes' },
						arguments: [
							{
								kind: 'Argument',
								name: { kind: 'Name', value: 'args' },
								value: {
									kind: 'ObjectValue',
									fields: [
										{
											kind: 'ObjectField',
											name: { kind: 'Name', value: 'search' },
											value: { kind: 'Variable', name: { kind: 'Name', value: 'search' } },
										},
									],
								},
							},
							{
								kind: 'Argument',
								name: { kind: 'Name', value: 'limit' },
								value: { kind: 'IntValue', value: '20' },
							},
						],
						selectionSet: {
							kind: 'SelectionSet',
							selections: [
								{ kind: 'Field', name: { kind: 'Name', value: 'id' } },
								{ kind: 'Field', name: { kind: 'Name', value: 'code' } },
								{ kind: 'Field', name: { kind: 'Name', value: 'description' } },
								{ kind: 'Field', name: { kind: 'Name', value: 'label' } },
							],
						},
					},
					{
						kind: 'Field',
						alias: { kind: 'Name', value: 'batch' },
						name: { kind: 'Name', value: 'rome_code' },
						arguments: [
							{
								kind: 'Argument',
								name: { kind: 'Name', value: 'where' },
								value: {
									kind: 'ObjectValue',
									fields: [
										{
											kind: 'ObjectField',
											name: { kind: 'Name', value: 'label' },
											value: {
												kind: 'ObjectValue',
												fields: [
													{
														kind: 'ObjectField',
														name: { kind: 'Name', value: '_in' },
														value: { kind: 'Variable', name: { kind: 'Name', value: 'labels' } },
													},
												],
											},
										},
									],
								},
							},
						],
						selectionSet: {
							kind: 'SelectionSet',
							selections: [
								{ kind: 'Field', name: { kind: 'Name', value: 'id' } },
								{ kind: 'Field', name: { kind: 'Name', value: 'code' } },
								{ kind: 'Field', name: { kind: 'Name', value: 'description' } },
								{ kind: 'Field', name: { kind: 'Name', value: 'label' } },
							],
						},
					},
				],
			},
		},
	],
} as unknown as DocumentNode<GetRomeCodesQuery, GetRomeCodesQueryVariables>;
export const UpdateNotebookVisitDateDocument = {
	kind: 'Document',
	definitions: [
		{
			kind: 'OperationDefinition',
			operation: 'mutation',
			name: { kind: 'Name', value: 'UpdateNotebookVisitDate' },
			variableDefinitions: [
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
					type: {
						kind: 'NonNullType',
						type: { kind: 'NamedType', name: { kind: 'Name', value: 'uuid' } },
					},
				},
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'date' } },
					type: {
						kind: 'NonNullType',
						type: { kind: 'NamedType', name: { kind: 'Name', value: 'timestamptz' } },
					},
				},
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
														name: { kind: 'Name', value: 'id' },
														value: {
															kind: 'ObjectValue',
															fields: [
																{
																	kind: 'ObjectField',
																	name: { kind: 'Name', value: '_eq' },
																	value: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
																},
															],
														},
													},
												],
											},
										},
									],
								},
							},
							{
								kind: 'Argument',
								name: { kind: 'Name', value: '_set' },
								value: {
									kind: 'ObjectValue',
									fields: [
										{
											kind: 'ObjectField',
											name: { kind: 'Name', value: 'lastVisitedAt' },
											value: { kind: 'Variable', name: { kind: 'Name', value: 'date' } },
										},
									],
								},
							},
						],
						selectionSet: {
							kind: 'SelectionSet',
							selections: [
								{
									kind: 'Field',
									name: { kind: 'Name', value: 'returning' },
									selectionSet: {
										kind: 'SelectionSet',
										selections: [{ kind: 'Field', name: { kind: 'Name', value: 'id' } }],
									},
								},
							],
						},
					},
				],
			},
		},
	],
} as unknown as DocumentNode<
	UpdateNotebookVisitDateMutation,
	UpdateNotebookVisitDateMutationVariables
>;
export const UpdateProfessionalProfileDocument = {
	kind: 'Document',
	definitions: [
		{
			kind: 'OperationDefinition',
			operation: 'mutation',
			name: { kind: 'Name', value: 'UpdateProfessionalProfile' },
			variableDefinitions: [
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'firstname' } },
					type: {
						kind: 'NonNullType',
						type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
					},
				},
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'lastname' } },
					type: {
						kind: 'NonNullType',
						type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
					},
				},
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'mobileNumber' } },
					type: {
						kind: 'NonNullType',
						type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
					},
				},
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'email' } },
					type: {
						kind: 'NonNullType',
						type: { kind: 'NamedType', name: { kind: 'Name', value: 'citext' } },
					},
				},
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'position' } },
					type: {
						kind: 'NonNullType',
						type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
					},
				},
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
					type: {
						kind: 'NonNullType',
						type: { kind: 'NamedType', name: { kind: 'Name', value: 'uuid' } },
					},
				},
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'structureId' } },
					type: { kind: 'NamedType', name: { kind: 'Name', value: 'uuid' } },
				},
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'accountId' } },
					type: {
						kind: 'NonNullType',
						type: { kind: 'NamedType', name: { kind: 'Name', value: 'uuid' } },
					},
				},
			],
			selectionSet: {
				kind: 'SelectionSet',
				selections: [
					{
						kind: 'Field',
						alias: { kind: 'Name', value: 'updateProfessional' },
						name: { kind: 'Name', value: 'update_professional_by_pk' },
						arguments: [
							{
								kind: 'Argument',
								name: { kind: 'Name', value: '_set' },
								value: {
									kind: 'ObjectValue',
									fields: [
										{
											kind: 'ObjectField',
											name: { kind: 'Name', value: 'firstname' },
											value: { kind: 'Variable', name: { kind: 'Name', value: 'firstname' } },
										},
										{
											kind: 'ObjectField',
											name: { kind: 'Name', value: 'lastname' },
											value: { kind: 'Variable', name: { kind: 'Name', value: 'lastname' } },
										},
										{
											kind: 'ObjectField',
											name: { kind: 'Name', value: 'position' },
											value: { kind: 'Variable', name: { kind: 'Name', value: 'position' } },
										},
										{
											kind: 'ObjectField',
											name: { kind: 'Name', value: 'email' },
											value: { kind: 'Variable', name: { kind: 'Name', value: 'email' } },
										},
										{
											kind: 'ObjectField',
											name: { kind: 'Name', value: 'mobileNumber' },
											value: { kind: 'Variable', name: { kind: 'Name', value: 'mobileNumber' } },
										},
										{
											kind: 'ObjectField',
											name: { kind: 'Name', value: 'structureId' },
											value: { kind: 'Variable', name: { kind: 'Name', value: 'structureId' } },
										},
									],
								},
							},
							{
								kind: 'Argument',
								name: { kind: 'Name', value: 'pk_columns' },
								value: {
									kind: 'ObjectValue',
									fields: [
										{
											kind: 'ObjectField',
											name: { kind: 'Name', value: 'id' },
											value: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
										},
									],
								},
							},
						],
						selectionSet: {
							kind: 'SelectionSet',
							selections: [{ kind: 'Field', name: { kind: 'Name', value: 'id' } }],
						},
					},
					{
						kind: 'Field',
						alias: { kind: 'Name', value: 'updateAccount' },
						name: { kind: 'Name', value: 'update_account_by_pk' },
						arguments: [
							{
								kind: 'Argument',
								name: { kind: 'Name', value: 'pk_columns' },
								value: {
									kind: 'ObjectValue',
									fields: [
										{
											kind: 'ObjectField',
											name: { kind: 'Name', value: 'id' },
											value: { kind: 'Variable', name: { kind: 'Name', value: 'accountId' } },
										},
									],
								},
							},
							{
								kind: 'Argument',
								name: { kind: 'Name', value: '_set' },
								value: {
									kind: 'ObjectValue',
									fields: [
										{
											kind: 'ObjectField',
											name: { kind: 'Name', value: 'onboardingDone' },
											value: { kind: 'BooleanValue', value: true },
										},
									],
								},
							},
						],
						selectionSet: {
							kind: 'SelectionSet',
							selections: [
								{ kind: 'Field', name: { kind: 'Name', value: 'id' } },
								{ kind: 'Field', name: { kind: 'Name', value: 'onboardingDone' } },
								{ kind: 'Field', name: { kind: 'Name', value: 'confirmed' } },
								{ kind: 'Field', name: { kind: 'Name', value: 'username' } },
								{
									kind: 'Field',
									name: { kind: 'Name', value: 'professional' },
									selectionSet: {
										kind: 'SelectionSet',
										selections: [
											{ kind: 'Field', name: { kind: 'Name', value: 'id' } },
											{ kind: 'Field', name: { kind: 'Name', value: 'firstname' } },
											{ kind: 'Field', name: { kind: 'Name', value: 'lastname' } },
											{ kind: 'Field', name: { kind: 'Name', value: 'mobileNumber' } },
											{ kind: 'Field', name: { kind: 'Name', value: 'email' } },
											{ kind: 'Field', name: { kind: 'Name', value: 'position' } },
										],
									},
								},
							],
						},
					},
				],
			},
		},
	],
} as unknown as DocumentNode<
	UpdateProfessionalProfileMutation,
	UpdateProfessionalProfileMutationVariables
>;
export const GetPendingBeneficiariesDocument = {
	kind: 'Document',
	definitions: [
		{
			kind: 'OperationDefinition',
			operation: 'query',
			name: { kind: 'Name', value: 'GetPendingBeneficiaries' },
			variableDefinitions: [
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'structureId' } },
					type: {
						kind: 'NonNullType',
						type: { kind: 'NamedType', name: { kind: 'Name', value: 'uuid' } },
					},
				},
			],
			selectionSet: {
				kind: 'SelectionSet',
				selections: [
					{
						kind: 'Field',
						name: { kind: 'Name', value: 'structure_by_pk' },
						arguments: [
							{
								kind: 'Argument',
								name: { kind: 'Name', value: 'id' },
								value: { kind: 'Variable', name: { kind: 'Name', value: 'structureId' } },
							},
						],
						selectionSet: {
							kind: 'SelectionSet',
							selections: [
								{
									kind: 'Field',
									name: { kind: 'Name', value: 'beneficiaries' },
									arguments: [
										{
											kind: 'Argument',
											name: { kind: 'Name', value: 'where' },
											value: {
												kind: 'ObjectValue',
												fields: [
													{
														kind: 'ObjectField',
														name: { kind: 'Name', value: 'status' },
														value: {
															kind: 'ObjectValue',
															fields: [
																{
																	kind: 'ObjectField',
																	name: { kind: 'Name', value: '_eq' },
																	value: { kind: 'StringValue', value: 'pending', block: false },
																},
															],
														},
													},
													{
														kind: 'ObjectField',
														name: { kind: 'Name', value: 'beneficiary' },
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
																				name: { kind: 'Name', value: '_or' },
																				value: {
																					kind: 'ListValue',
																					values: [
																						{
																							kind: 'ObjectValue',
																							fields: [
																								{
																									kind: 'ObjectField',
																									name: { kind: 'Name', value: '_not' },
																									value: {
																										kind: 'ObjectValue',
																										fields: [
																											{
																												kind: 'ObjectField',
																												name: { kind: 'Name', value: 'members' },
																												value: { kind: 'ObjectValue', fields: [] },
																											},
																										],
																									},
																								},
																							],
																						},
																						{
																							kind: 'ObjectValue',
																							fields: [
																								{
																									kind: 'ObjectField',
																									name: { kind: 'Name', value: 'members' },
																									value: {
																										kind: 'ObjectValue',
																										fields: [
																											{
																												kind: 'ObjectField',
																												name: { kind: 'Name', value: 'account' },
																												value: {
																													kind: 'ObjectValue',
																													fields: [
																														{
																															kind: 'ObjectField',
																															name: {
																																kind: 'Name',
																																value: 'professional',
																															},
																															value: {
																																kind: 'ObjectValue',
																																fields: [
																																	{
																																		kind: 'ObjectField',
																																		name: {
																																			kind: 'Name',
																																			value: 'structureId',
																																		},
																																		value: {
																																			kind: 'ObjectValue',
																																			fields: [
																																				{
																																					kind: 'ObjectField',
																																					name: {
																																						kind: 'Name',
																																						value: '_neq',
																																					},
																																					value: {
																																						kind: 'Variable',
																																						name: {
																																							kind: 'Name',
																																							value: 'structureId',
																																						},
																																					},
																																				},
																																			],
																																		},
																																	},
																																],
																															},
																														},
																													],
																												},
																											},
																										],
																									},
																								},
																							],
																						},
																					],
																				},
																			},
																		],
																	},
																},
															],
														},
													},
												],
											},
										},
										{
											kind: 'Argument',
											name: { kind: 'Name', value: 'order_by' },
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
																	name: { kind: 'Name', value: 'lastname' },
																	value: { kind: 'EnumValue', value: 'asc' },
																},
															],
														},
													},
												],
											},
										},
									],
									selectionSet: {
										kind: 'SelectionSet',
										selections: [
											{
												kind: 'Field',
												name: { kind: 'Name', value: 'beneficiary' },
												selectionSet: {
													kind: 'SelectionSet',
													selections: [
														{ kind: 'Field', name: { kind: 'Name', value: 'firstname' } },
														{ kind: 'Field', name: { kind: 'Name', value: 'lastname' } },
														{ kind: 'Field', name: { kind: 'Name', value: 'dateOfBirth' } },
														{
															kind: 'Field',
															name: { kind: 'Name', value: 'notebook' },
															selectionSet: {
																kind: 'SelectionSet',
																selections: [
																	{ kind: 'Field', name: { kind: 'Name', value: 'id' } },
																],
															},
														},
													],
												},
											},
										],
									},
								},
							],
						},
					},
				],
			},
		},
	],
} as unknown as DocumentNode<GetPendingBeneficiariesQuery, GetPendingBeneficiariesQueryVariables>;
export const GetStructureDocument = {
	kind: 'Document',
	definitions: [
		{
			kind: 'OperationDefinition',
			operation: 'query',
			name: { kind: 'Name', value: 'GetStructure' },
			variableDefinitions: [
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'structureId' } },
					type: {
						kind: 'NonNullType',
						type: { kind: 'NamedType', name: { kind: 'Name', value: 'uuid' } },
					},
				},
			],
			selectionSet: {
				kind: 'SelectionSet',
				selections: [
					{
						kind: 'Field',
						alias: { kind: 'Name', value: 'beneficiaries' },
						name: { kind: 'Name', value: 'notebook_aggregate' },
						arguments: [
							{
								kind: 'Argument',
								name: { kind: 'Name', value: 'where' },
								value: {
									kind: 'ObjectValue',
									fields: [
										{
											kind: 'ObjectField',
											name: { kind: 'Name', value: 'members' },
											value: {
												kind: 'ObjectValue',
												fields: [
													{
														kind: 'ObjectField',
														name: { kind: 'Name', value: 'account' },
														value: {
															kind: 'ObjectValue',
															fields: [
																{
																	kind: 'ObjectField',
																	name: { kind: 'Name', value: 'professional' },
																	value: {
																		kind: 'ObjectValue',
																		fields: [
																			{
																				kind: 'ObjectField',
																				name: { kind: 'Name', value: 'structureId' },
																				value: {
																					kind: 'ObjectValue',
																					fields: [
																						{
																							kind: 'ObjectField',
																							name: { kind: 'Name', value: '_eq' },
																							value: {
																								kind: 'Variable',
																								name: { kind: 'Name', value: 'structureId' },
																							},
																						},
																					],
																				},
																			},
																		],
																	},
																},
															],
														},
													},
												],
											},
										},
									],
								},
							},
						],
						selectionSet: {
							kind: 'SelectionSet',
							selections: [
								{
									kind: 'Field',
									name: { kind: 'Name', value: 'aggregate' },
									selectionSet: {
										kind: 'SelectionSet',
										selections: [{ kind: 'Field', name: { kind: 'Name', value: 'count' } }],
									},
								},
							],
						},
					},
					{
						kind: 'Field',
						name: { kind: 'Name', value: 'structure_by_pk' },
						arguments: [
							{
								kind: 'Argument',
								name: { kind: 'Name', value: 'id' },
								value: { kind: 'Variable', name: { kind: 'Name', value: 'structureId' } },
							},
						],
						selectionSet: {
							kind: 'SelectionSet',
							selections: [
								{ kind: 'Field', name: { kind: 'Name', value: 'id' } },
								{ kind: 'Field', name: { kind: 'Name', value: 'name' } },
								{ kind: 'Field', name: { kind: 'Name', value: 'phone' } },
								{ kind: 'Field', name: { kind: 'Name', value: 'email' } },
								{ kind: 'Field', name: { kind: 'Name', value: 'address1' } },
								{ kind: 'Field', name: { kind: 'Name', value: 'address2' } },
								{ kind: 'Field', name: { kind: 'Name', value: 'postalCode' } },
								{ kind: 'Field', name: { kind: 'Name', value: 'city' } },
								{ kind: 'Field', name: { kind: 'Name', value: 'website' } },
								{
									kind: 'Field',
									alias: { kind: 'Name', value: 'pendingBeneficiaries' },
									name: { kind: 'Name', value: 'beneficiaries_aggregate' },
									arguments: [
										{
											kind: 'Argument',
											name: { kind: 'Name', value: 'where' },
											value: {
												kind: 'ObjectValue',
												fields: [
													{
														kind: 'ObjectField',
														name: { kind: 'Name', value: 'status' },
														value: {
															kind: 'ObjectValue',
															fields: [
																{
																	kind: 'ObjectField',
																	name: { kind: 'Name', value: '_eq' },
																	value: { kind: 'StringValue', value: 'pending', block: false },
																},
															],
														},
													},
													{
														kind: 'ObjectField',
														name: { kind: 'Name', value: 'beneficiary' },
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
																				name: { kind: 'Name', value: '_or' },
																				value: {
																					kind: 'ListValue',
																					values: [
																						{
																							kind: 'ObjectValue',
																							fields: [
																								{
																									kind: 'ObjectField',
																									name: { kind: 'Name', value: '_not' },
																									value: {
																										kind: 'ObjectValue',
																										fields: [
																											{
																												kind: 'ObjectField',
																												name: { kind: 'Name', value: 'members' },
																												value: { kind: 'ObjectValue', fields: [] },
																											},
																										],
																									},
																								},
																							],
																						},
																						{
																							kind: 'ObjectValue',
																							fields: [
																								{
																									kind: 'ObjectField',
																									name: { kind: 'Name', value: 'members' },
																									value: {
																										kind: 'ObjectValue',
																										fields: [
																											{
																												kind: 'ObjectField',
																												name: { kind: 'Name', value: 'account' },
																												value: {
																													kind: 'ObjectValue',
																													fields: [
																														{
																															kind: 'ObjectField',
																															name: {
																																kind: 'Name',
																																value: 'professional',
																															},
																															value: {
																																kind: 'ObjectValue',
																																fields: [
																																	{
																																		kind: 'ObjectField',
																																		name: {
																																			kind: 'Name',
																																			value: 'structureId',
																																		},
																																		value: {
																																			kind: 'ObjectValue',
																																			fields: [
																																				{
																																					kind: 'ObjectField',
																																					name: {
																																						kind: 'Name',
																																						value: '_neq',
																																					},
																																					value: {
																																						kind: 'Variable',
																																						name: {
																																							kind: 'Name',
																																							value: 'structureId',
																																						},
																																					},
																																				},
																																			],
																																		},
																																	},
																																],
																															},
																														},
																													],
																												},
																											},
																										],
																									},
																								},
																							],
																						},
																					],
																				},
																			},
																		],
																	},
																},
															],
														},
													},
												],
											},
										},
									],
									selectionSet: {
										kind: 'SelectionSet',
										selections: [
											{
												kind: 'Field',
												name: { kind: 'Name', value: 'aggregate' },
												selectionSet: {
													kind: 'SelectionSet',
													selections: [{ kind: 'Field', name: { kind: 'Name', value: 'count' } }],
												},
											},
										],
									},
								},
								{
									kind: 'Field',
									name: { kind: 'Name', value: 'professionals' },
									selectionSet: {
										kind: 'SelectionSet',
										selections: [
											{ kind: 'Field', name: { kind: 'Name', value: 'id' } },
											{
												kind: 'Field',
												name: { kind: 'Name', value: 'account' },
												selectionSet: {
													kind: 'SelectionSet',
													selections: [{ kind: 'Field', name: { kind: 'Name', value: 'id' } }],
												},
											},
											{ kind: 'Field', name: { kind: 'Name', value: 'email' } },
											{ kind: 'Field', name: { kind: 'Name', value: 'firstname' } },
											{ kind: 'Field', name: { kind: 'Name', value: 'lastname' } },
										],
									},
								},
								{
									kind: 'Field',
									name: { kind: 'Name', value: 'professionals_aggregate' },
									selectionSet: {
										kind: 'SelectionSet',
										selections: [
											{
												kind: 'Field',
												name: { kind: 'Name', value: 'aggregate' },
												selectionSet: {
													kind: 'SelectionSet',
													selections: [{ kind: 'Field', name: { kind: 'Name', value: 'count' } }],
												},
											},
										],
									},
								},
								{
									kind: 'Field',
									name: { kind: 'Name', value: 'admins_aggregate' },
									selectionSet: {
										kind: 'SelectionSet',
										selections: [
											{
												kind: 'Field',
												name: { kind: 'Name', value: 'nodes' },
												selectionSet: {
													kind: 'SelectionSet',
													selections: [
														{
															kind: 'Field',
															name: { kind: 'Name', value: 'admin_structure' },
															selectionSet: {
																kind: 'SelectionSet',
																selections: [
																	{ kind: 'Field', name: { kind: 'Name', value: 'id' } },
																	{ kind: 'Field', name: { kind: 'Name', value: 'email' } },
																	{ kind: 'Field', name: { kind: 'Name', value: 'firstname' } },
																	{ kind: 'Field', name: { kind: 'Name', value: 'lastname' } },
																],
															},
														},
													],
												},
											},
										],
									},
								},
							],
						},
					},
				],
			},
		},
	],
} as unknown as DocumentNode<GetStructureQuery, GetStructureQueryVariables>;
export const GetManagedStructuresDocument = {
	kind: 'Document',
	definitions: [
		{
			kind: 'OperationDefinition',
			operation: 'query',
			name: { kind: 'Name', value: 'GetManagedStructures' },
			variableDefinitions: [
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'adminId' } },
					type: {
						kind: 'NonNullType',
						type: { kind: 'NamedType', name: { kind: 'Name', value: 'uuid' } },
					},
				},
			],
			selectionSet: {
				kind: 'SelectionSet',
				selections: [
					{
						kind: 'Field',
						alias: { kind: 'Name', value: 'structures' },
						name: { kind: 'Name', value: 'structure' },
						arguments: [
							{
								kind: 'Argument',
								name: { kind: 'Name', value: 'where' },
								value: {
									kind: 'ObjectValue',
									fields: [
										{
											kind: 'ObjectField',
											name: { kind: 'Name', value: 'admins' },
											value: {
												kind: 'ObjectValue',
												fields: [
													{
														kind: 'ObjectField',
														name: { kind: 'Name', value: 'adminStructureId' },
														value: {
															kind: 'ObjectValue',
															fields: [
																{
																	kind: 'ObjectField',
																	name: { kind: 'Name', value: '_eq' },
																	value: {
																		kind: 'Variable',
																		name: { kind: 'Name', value: 'adminId' },
																	},
																},
															],
														},
													},
												],
											},
										},
									],
								},
							},
						],
						selectionSet: {
							kind: 'SelectionSet',
							selections: [
								{ kind: 'Field', name: { kind: 'Name', value: 'id' } },
								{ kind: 'Field', name: { kind: 'Name', value: 'city' } },
								{ kind: 'Field', name: { kind: 'Name', value: 'name' } },
								{
									kind: 'Field',
									name: { kind: 'Name', value: 'beneficiaries_aggregate' },
									selectionSet: {
										kind: 'SelectionSet',
										selections: [
											{
												kind: 'Field',
												name: { kind: 'Name', value: 'aggregate' },
												selectionSet: {
													kind: 'SelectionSet',
													selections: [{ kind: 'Field', name: { kind: 'Name', value: 'count' } }],
												},
											},
										],
									},
								},
								{
									kind: 'Field',
									name: { kind: 'Name', value: 'professionals_aggregate' },
									selectionSet: {
										kind: 'SelectionSet',
										selections: [
											{
												kind: 'Field',
												name: { kind: 'Name', value: 'aggregate' },
												selectionSet: {
													kind: 'SelectionSet',
													selections: [{ kind: 'Field', name: { kind: 'Name', value: 'count' } }],
												},
											},
										],
									},
								},
								{
									kind: 'Field',
									name: { kind: 'Name', value: 'admins_aggregate' },
									selectionSet: {
										kind: 'SelectionSet',
										selections: [
											{
												kind: 'Field',
												name: { kind: 'Name', value: 'aggregate' },
												selectionSet: {
													kind: 'SelectionSet',
													selections: [{ kind: 'Field', name: { kind: 'Name', value: 'count' } }],
												},
											},
										],
									},
								},
							],
						},
					},
				],
			},
		},
	],
} as unknown as DocumentNode<GetManagedStructuresQuery, GetManagedStructuresQueryVariables>;
export const UpdateAdminStructureProfileDocument = {
	kind: 'Document',
	definitions: [
		{
			kind: 'OperationDefinition',
			operation: 'mutation',
			name: { kind: 'Name', value: 'UpdateAdminStructureProfile' },
			variableDefinitions: [
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'firstname' } },
					type: {
						kind: 'NonNullType',
						type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
					},
				},
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'lastname' } },
					type: {
						kind: 'NonNullType',
						type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
					},
				},
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'email' } },
					type: {
						kind: 'NonNullType',
						type: { kind: 'NamedType', name: { kind: 'Name', value: 'citext' } },
					},
				},
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'phoneNumbers' } },
					type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
				},
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
					type: {
						kind: 'NonNullType',
						type: { kind: 'NamedType', name: { kind: 'Name', value: 'uuid' } },
					},
				},
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'accountId' } },
					type: {
						kind: 'NonNullType',
						type: { kind: 'NamedType', name: { kind: 'Name', value: 'uuid' } },
					},
				},
			],
			selectionSet: {
				kind: 'SelectionSet',
				selections: [
					{
						kind: 'Field',
						alias: { kind: 'Name', value: 'updateAdminStructure' },
						name: { kind: 'Name', value: 'update_admin_structure_by_pk' },
						arguments: [
							{
								kind: 'Argument',
								name: { kind: 'Name', value: '_set' },
								value: {
									kind: 'ObjectValue',
									fields: [
										{
											kind: 'ObjectField',
											name: { kind: 'Name', value: 'firstname' },
											value: { kind: 'Variable', name: { kind: 'Name', value: 'firstname' } },
										},
										{
											kind: 'ObjectField',
											name: { kind: 'Name', value: 'lastname' },
											value: { kind: 'Variable', name: { kind: 'Name', value: 'lastname' } },
										},
										{
											kind: 'ObjectField',
											name: { kind: 'Name', value: 'email' },
											value: { kind: 'Variable', name: { kind: 'Name', value: 'email' } },
										},
										{
											kind: 'ObjectField',
											name: { kind: 'Name', value: 'phoneNumbers' },
											value: { kind: 'Variable', name: { kind: 'Name', value: 'phoneNumbers' } },
										},
									],
								},
							},
							{
								kind: 'Argument',
								name: { kind: 'Name', value: 'pk_columns' },
								value: {
									kind: 'ObjectValue',
									fields: [
										{
											kind: 'ObjectField',
											name: { kind: 'Name', value: 'id' },
											value: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
										},
									],
								},
							},
						],
						selectionSet: {
							kind: 'SelectionSet',
							selections: [{ kind: 'Field', name: { kind: 'Name', value: 'id' } }],
						},
					},
					{
						kind: 'Field',
						alias: { kind: 'Name', value: 'updateAccount' },
						name: { kind: 'Name', value: 'update_account_by_pk' },
						arguments: [
							{
								kind: 'Argument',
								name: { kind: 'Name', value: 'pk_columns' },
								value: {
									kind: 'ObjectValue',
									fields: [
										{
											kind: 'ObjectField',
											name: { kind: 'Name', value: 'id' },
											value: { kind: 'Variable', name: { kind: 'Name', value: 'accountId' } },
										},
									],
								},
							},
							{
								kind: 'Argument',
								name: { kind: 'Name', value: '_set' },
								value: {
									kind: 'ObjectValue',
									fields: [
										{
											kind: 'ObjectField',
											name: { kind: 'Name', value: 'onboardingDone' },
											value: { kind: 'BooleanValue', value: true },
										},
									],
								},
							},
						],
						selectionSet: {
							kind: 'SelectionSet',
							selections: [
								{ kind: 'Field', name: { kind: 'Name', value: 'id' } },
								{ kind: 'Field', name: { kind: 'Name', value: 'onboardingDone' } },
								{ kind: 'Field', name: { kind: 'Name', value: 'confirmed' } },
								{ kind: 'Field', name: { kind: 'Name', value: 'username' } },
								{
									kind: 'Field',
									name: { kind: 'Name', value: 'admin_structure' },
									selectionSet: {
										kind: 'SelectionSet',
										selections: [
											{ kind: 'Field', name: { kind: 'Name', value: 'id' } },
											{ kind: 'Field', name: { kind: 'Name', value: 'firstname' } },
											{ kind: 'Field', name: { kind: 'Name', value: 'lastname' } },
											{ kind: 'Field', name: { kind: 'Name', value: 'email' } },
											{ kind: 'Field', name: { kind: 'Name', value: 'phoneNumbers' } },
										],
									},
								},
							],
						},
					},
				],
			},
		},
	],
} as unknown as DocumentNode<
	UpdateAdminStructureProfileMutation,
	UpdateAdminStructureProfileMutationVariables
>;
export type AddNotebookMembersMutationStore = OperationStore<
	AddNotebookMembersMutation,
	AddNotebookMembersMutationVariables
>;
export type AddNotebookMemberBatchMutationStore = OperationStore<
	AddNotebookMemberBatchMutation,
	AddNotebookMemberBatchMutationVariables
>;
export type GetNotebookForBeneficiaryQueryStore = OperationStore<
	GetNotebookForBeneficiaryQuery,
	GetNotebookForBeneficiaryQueryVariables
>;
export type RemoveNotebookMembersMutationStore = OperationStore<
	RemoveNotebookMembersMutation,
	RemoveNotebookMembersMutationVariables
>;
export type GetProfessionalsFromStructuresQueryStore = OperationStore<
	GetProfessionalsFromStructuresQuery,
	GetProfessionalsFromStructuresQueryVariables
>;
export type GetStructuresWithProQueryStore = OperationStore<
	GetStructuresWithProQuery,
	GetStructuresWithProQueryVariables
>;
export type UpdateReferentMutationStore = OperationStore<
	UpdateReferentMutation,
	UpdateReferentMutationVariables
>;
export type UpdateReferentWithStructureMutationStore = OperationStore<
	UpdateReferentWithStructureMutation,
	UpdateReferentWithStructureMutationVariables
>;
export type RemoveReferentMutationStore = OperationStore<
	RemoveReferentMutation,
	RemoveReferentMutationVariables
>;
export type CreateDeploymentMutationStore = OperationStore<
	CreateDeploymentMutation,
	CreateDeploymentMutationVariables
>;
export type GetDeploymentByIdQueryStore = OperationStore<
	GetDeploymentByIdQuery,
	GetDeploymentByIdQueryVariables
>;
export type GetDeploymentsQueryStore = OperationStore<
	GetDeploymentsQuery,
	GetDeploymentsQueryVariables
>;
export type GetDeploymentNotebooksQueryStore = OperationStore<
	GetDeploymentNotebooksQuery,
	GetDeploymentNotebooksQueryVariables
>;
export type UpdateNotebookActionMutationStore = OperationStore<
	UpdateNotebookActionMutation,
	UpdateNotebookActionMutationVariables
>;
export type DeactivateNotebookMemberMutationStore = OperationStore<
	DeactivateNotebookMemberMutation,
	DeactivateNotebookMemberMutationVariables
>;
export type AddNotebookMemberWithBeneficiaryStructureUpdateMutationStore = OperationStore<
	AddNotebookMemberWithBeneficiaryStructureUpdateMutation,
	AddNotebookMemberWithBeneficiaryStructureUpdateMutationVariables
>;
export type AttachBeneficiaryToStructureMutationStore = OperationStore<
	AttachBeneficiaryToStructureMutation,
	AttachBeneficiaryToStructureMutationVariables
>;
export type ImportBeneficiaryMutationStore = OperationStore<
	ImportBeneficiaryMutation,
	ImportBeneficiaryMutationVariables
>;
export type ImportStructureMutationStore = OperationStore<
	ImportStructureMutation,
	ImportStructureMutationVariables
>;
export type UpdateManagerProfileMutationStore = OperationStore<
	UpdateManagerProfileMutation,
	UpdateManagerProfileMutationVariables
>;
export type AddNotebookActionMutationStore = OperationStore<
	AddNotebookActionMutation,
	AddNotebookActionMutationVariables
>;
export type GetRefActionsQueryStore = OperationStore<
	GetRefActionsQuery,
	GetRefActionsQueryVariables
>;
export type UpdateActionStatusMutationStore = OperationStore<
	UpdateActionStatusMutation,
	UpdateActionStatusMutationVariables
>;
export type UpdateNotebookContractMutationStore = OperationStore<
	UpdateNotebookContractMutation,
	UpdateNotebookContractMutationVariables
>;
export type AddNotebookFocusMutationStore = OperationStore<
	AddNotebookFocusMutation,
	AddNotebookFocusMutationVariables
>;
export type DeleteNotebookFocusByIdMutationStore = OperationStore<
	DeleteNotebookFocusByIdMutation,
	DeleteNotebookFocusByIdMutationVariables
>;
export type GetNotebookFocusByIdQueryStore = OperationStore<
	GetNotebookFocusByIdQuery,
	GetNotebookFocusByIdQueryVariables
>;
export type GetRefSituationsQueryStore = OperationStore<
	GetRefSituationsQuery,
	GetRefSituationsQueryVariables
>;
export type GetRefSituationsByThemeQueryStore = OperationStore<
	GetRefSituationsByThemeQuery,
	GetRefSituationsByThemeQueryVariables
>;
export type UpdateNotebookFocusMutationStore = OperationStore<
	UpdateNotebookFocusMutation,
	UpdateNotebookFocusMutationVariables
>;
export type UpdateTargetStatusMutationStore = OperationStore<
	UpdateTargetStatusMutation,
	UpdateTargetStatusMutationVariables
>;
export type AddNotebookAppointmentMutationStore = OperationStore<
	AddNotebookAppointmentMutation,
	AddNotebookAppointmentMutationVariables
>;
export type AddNotebookMemberMutationStore = OperationStore<
	AddNotebookMemberMutation,
	AddNotebookMemberMutationVariables
>;
export type GetNotebookAppointmentsQueryStore = OperationStore<
	GetNotebookAppointmentsQuery,
	GetNotebookAppointmentsQueryVariables
>;
export type SearchProfessionalQueryStore = OperationStore<
	SearchProfessionalQuery,
	SearchProfessionalQueryVariables
>;
export type UpdateNotebookAppointmentMutationStore = OperationStore<
	UpdateNotebookAppointmentMutation,
	UpdateNotebookAppointmentMutationVariables
>;
export type UpdateBeneficiaryPersonalInfoMutationStore = OperationStore<
	UpdateBeneficiaryPersonalInfoMutation,
	UpdateBeneficiaryPersonalInfoMutationVariables
>;
export type UpdateSocioProMutationStore = OperationStore<
	UpdateSocioProMutation,
	UpdateSocioProMutationVariables
>;
export type AddNotebookTargetMutationStore = OperationStore<
	AddNotebookTargetMutation,
	AddNotebookTargetMutationVariables
>;
export type GetRefTargetByFocusQueryStore = OperationStore<
	GetRefTargetByFocusQuery,
	GetRefTargetByFocusQueryVariables
>;
export type GetAccountByPkQueryStore = OperationStore<
	GetAccountByPkQuery,
	GetAccountByPkQueryVariables
>;
export type CreateDeploymentFromApiMutationStore = OperationStore<
	CreateDeploymentFromApiMutation,
	CreateDeploymentFromApiMutationVariables
>;
export type ListDeploymentIdQueryStore = OperationStore<
	ListDeploymentIdQuery,
	ListDeploymentIdQueryVariables
>;
export type GetDeploymentStatForDayQueryStore = OperationStore<
	GetDeploymentStatForDayQuery,
	GetDeploymentStatForDayQueryVariables
>;
export type GetExistingAdminStructureQueryStore = OperationStore<
	GetExistingAdminStructureQuery,
	GetExistingAdminStructureQueryVariables
>;
export type GetNotebookInfoQueryStore = OperationStore<
	GetNotebookInfoQuery,
	GetNotebookInfoQueryVariables
>;
export type InsertAccountAdminStructureMutationStore = OperationStore<
	InsertAccountAdminStructureMutation,
	InsertAccountAdminStructureMutationVariables
>;
export type InsertStructureMutationStore = OperationStore<
	InsertStructureMutation,
	InsertStructureMutationVariables
>;
export type InsertStructureAdminStructureMutationStore = OperationStore<
	InsertStructureAdminStructureMutation,
	InsertStructureAdminStructureMutationVariables
>;
export type UpdateNotebookFromApiMutationStore = OperationStore<
	UpdateNotebookFromApiMutation,
	UpdateNotebookFromApiMutationVariables
>;
export type GetStructuresForDeploymentQueryStore = OperationStore<
	GetStructuresForDeploymentQuery,
	GetStructuresForDeploymentQueryVariables
>;
export type GetAccountInfoQueryStore = OperationStore<
	GetAccountInfoQuery,
	GetAccountInfoQueryVariables
>;
export type ResetAccountAccessKeyMutationStore = OperationStore<
	ResetAccountAccessKeyMutation,
	ResetAccountAccessKeyMutationVariables
>;
export type CreateBeneficiaryAccountMutationStore = OperationStore<
	CreateBeneficiaryAccountMutation,
	CreateBeneficiaryAccountMutationVariables
>;
export type GetAccountByUsernameQueryStore = OperationStore<
	GetAccountByUsernameQuery,
	GetAccountByUsernameQueryVariables
>;
export type GetAccountByEmailQueryStore = OperationStore<
	GetAccountByEmailQuery,
	GetAccountByEmailQueryVariables
>;
export type GetBeneficiaryByEmailQueryStore = OperationStore<
	GetBeneficiaryByEmailQuery,
	GetBeneficiaryByEmailQueryVariables
>;
export type UpdateAccountAccessKeyMutationStore = OperationStore<
	UpdateAccountAccessKeyMutation,
	UpdateAccountAccessKeyMutationVariables
>;
export type GetNotebookByBeneficiaryIdQueryStore = OperationStore<
	GetNotebookByBeneficiaryIdQuery,
	GetNotebookByBeneficiaryIdQueryVariables
>;
export type GetNotebookByIdQueryStore = OperationStore<
	GetNotebookByIdQuery,
	GetNotebookByIdQueryVariables
>;
export type GetDeploymentManagersForStructureQueryStore = OperationStore<
	GetDeploymentManagersForStructureQuery,
	GetDeploymentManagersForStructureQueryVariables
>;
export type GetStructuresQueryStore = OperationStore<
	GetStructuresQuery,
	GetStructuresQueryVariables
>;
export type InsertProfessionalAccountMutationStore = OperationStore<
	InsertProfessionalAccountMutation,
	InsertProfessionalAccountMutationVariables
>;
export type ConfirmAccountByIdMutationStore = OperationStore<
	ConfirmAccountByIdMutation,
	ConfirmAccountByIdMutationVariables
>;
export type GetAccountByIdQueryStore = OperationStore<
	GetAccountByIdQuery,
	GetAccountByIdQueryVariables
>;
export type GetDeploymentInfosQueryStore = OperationStore<
	GetDeploymentInfosQuery,
	GetDeploymentInfosQueryVariables
>;
export type GetBeneficiariesQueryStore = OperationStore<
	GetBeneficiariesQuery,
	GetBeneficiariesQueryVariables
>;
export type GetProfessionalsForManagerQueryStore = OperationStore<
	GetProfessionalsForManagerQuery,
	GetProfessionalsForManagerQueryVariables
>;
export type GetStructuresForManagerQueryStore = OperationStore<
	GetStructuresForManagerQuery,
	GetStructuresForManagerQueryVariables
>;
export type GetNotebooksStatsQueryStore = OperationStore<
	GetNotebooksStatsQuery,
	GetNotebooksStatsQueryVariables
>;
export type GetAccountsSummaryQueryStore = OperationStore<
	GetAccountsSummaryQuery,
	GetAccountsSummaryQueryVariables
>;
export type GetLastVisitedOrUpdatedQueryStore = OperationStore<
	GetLastVisitedOrUpdatedQuery,
	GetLastVisitedOrUpdatedQueryVariables
>;
export type CreateBeneficiaryMutationStore = OperationStore<
	CreateBeneficiaryMutation,
	CreateBeneficiaryMutationVariables
>;
export type SearchNotebookMemberQueryStore = OperationStore<
	SearchNotebookMemberQuery,
	SearchNotebookMemberQueryVariables
>;
export type GetNotebookQueryStore = OperationStore<GetNotebookQuery, GetNotebookQueryVariables>;
export type GetNotebookEventsQueryStore = OperationStore<
	GetNotebookEventsQuery,
	GetNotebookEventsQueryVariables
>;
export type GetNotebookMemberByIdQueryStore = OperationStore<
	GetNotebookMemberByIdQuery,
	GetNotebookMemberByIdQueryVariables
>;
export type GetRomeCodesQueryStore = OperationStore<GetRomeCodesQuery, GetRomeCodesQueryVariables>;
export type UpdateNotebookVisitDateMutationStore = OperationStore<
	UpdateNotebookVisitDateMutation,
	UpdateNotebookVisitDateMutationVariables
>;
export type UpdateProfessionalProfileMutationStore = OperationStore<
	UpdateProfessionalProfileMutation,
	UpdateProfessionalProfileMutationVariables
>;
export type GetPendingBeneficiariesQueryStore = OperationStore<
	GetPendingBeneficiariesQuery,
	GetPendingBeneficiariesQueryVariables
>;
export type GetStructureQueryStore = OperationStore<GetStructureQuery, GetStructureQueryVariables>;
export type GetManagedStructuresQueryStore = OperationStore<
	GetManagedStructuresQuery,
	GetManagedStructuresQueryVariables
>;
export type UpdateAdminStructureProfileMutationStore = OperationStore<
	UpdateAdminStructureProfileMutation,
	UpdateAdminStructureProfileMutationVariables
>;
