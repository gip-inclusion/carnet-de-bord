from graphql import build_schema

schema = build_schema(
    '''
schema {
  query: query_root
  mutation: mutation_root
  subscription: subscription_root
}

"""whether this query should be cached (Hasura Cloud only)"""
directive @cached(
  """measured in seconds"""
  ttl: Int! = 60

  """refresh the cache entry"""
  refresh: Boolean! = false
) on QUERY

"""
Boolean expression to compare columns of type "Boolean". All fields are combined with logical 'AND'.
"""
input Boolean_comparison_exp {
  _eq: Boolean
  _gt: Boolean
  _gte: Boolean
  _in: [Boolean!]
  _is_null: Boolean
  _lt: Boolean
  _lte: Boolean
  _neq: Boolean
  _nin: [Boolean!]
}

type CreateDeploymentOutput {
  id: uuid!
  label: String!
}

"""
Boolean expression to compare columns of type "Int". All fields are combined with logical 'AND'.
"""
input Int_comparison_exp {
  _eq: Int
  _gt: Int
  _gte: Int
  _in: [Int!]
  _is_null: Boolean
  _lt: Int
  _lte: Int
  _neq: Int
  _nin: [Int!]
}

"""
Boolean expression to compare columns of type "String". All fields are combined with logical 'AND'.
"""
input String_comparison_exp {
  _eq: String
  _gt: String
  _gte: String

  """does the column match the given case-insensitive pattern"""
  _ilike: String
  _in: [String!]

  """
  does the column match the given POSIX regular expression, case insensitive
  """
  _iregex: String
  _is_null: Boolean

  """does the column match the given pattern"""
  _like: String
  _lt: String
  _lte: String
  _neq: String

  """does the column NOT match the given case-insensitive pattern"""
  _nilike: String
  _nin: [String!]

  """
  does the column NOT match the given POSIX regular expression, case insensitive
  """
  _niregex: String

  """does the column NOT match the given pattern"""
  _nlike: String

  """
  does the column NOT match the given POSIX regular expression, case sensitive
  """
  _nregex: String

  """does the column NOT match the given SQL regular expression"""
  _nsimilar: String

  """
  does the column match the given POSIX regular expression, case sensitive
  """
  _regex: String

  """does the column match the given SQL regular expression"""
  _similar: String
}

"""
columns and relationships of "account"
"""
type account {
  accessKey: String
  accessKeyDate: timestamptz

  """An object relationship"""
  admin: admin_cdb
  adminId: uuid
  adminStructureId: uuid

  """An object relationship"""
  admin_structure: admin_structure

  """An object relationship"""
  beneficiary: beneficiary
  beneficiaryId: uuid
  confirmed: Boolean!
  createdAt: timestamptz!
  deletedAt: timestamptz
  id: uuid!
  lastLogin: timestamptz

  """An object relationship"""
  manager: manager
  managerId: uuid

  """An array relationship"""
  notebookActionsCreated(
    """distinct select on columns"""
    distinct_on: [notebook_action_select_column!]

    """limit the number of rows returned"""
    limit: Int

    """skip the first n rows. Use only with order_by"""
    offset: Int

    """sort the rows by one or more columns"""
    order_by: [notebook_action_order_by!]

    """filter the rows returned"""
    where: notebook_action_bool_exp
  ): [notebook_action!]!

  """An aggregate relationship"""
  notebookActionsCreated_aggregate(
    """distinct select on columns"""
    distinct_on: [notebook_action_select_column!]

    """limit the number of rows returned"""
    limit: Int

    """skip the first n rows. Use only with order_by"""
    offset: Int

    """sort the rows by one or more columns"""
    order_by: [notebook_action_order_by!]

    """filter the rows returned"""
    where: notebook_action_bool_exp
  ): notebook_action_aggregate!

  """An array relationship"""
  notebookEventsCreated(
    """distinct select on columns"""
    distinct_on: [notebook_event_select_column!]

    """limit the number of rows returned"""
    limit: Int

    """skip the first n rows. Use only with order_by"""
    offset: Int

    """sort the rows by one or more columns"""
    order_by: [notebook_event_order_by!]

    """filter the rows returned"""
    where: notebook_event_bool_exp
  ): [notebook_event!]!

  """An aggregate relationship"""
  notebookEventsCreated_aggregate(
    """distinct select on columns"""
    distinct_on: [notebook_event_select_column!]

    """limit the number of rows returned"""
    limit: Int

    """skip the first n rows. Use only with order_by"""
    offset: Int

    """sort the rows by one or more columns"""
    order_by: [notebook_event_order_by!]

    """filter the rows returned"""
    where: notebook_event_bool_exp
  ): notebook_event_aggregate!

  """An array relationship"""
  notebookFocusesCreated(
    """distinct select on columns"""
    distinct_on: [notebook_focus_select_column!]

    """limit the number of rows returned"""
    limit: Int

    """skip the first n rows. Use only with order_by"""
    offset: Int

    """sort the rows by one or more columns"""
    order_by: [notebook_focus_order_by!]

    """filter the rows returned"""
    where: notebook_focus_bool_exp
  ): [notebook_focus!]!

  """An aggregate relationship"""
  notebookFocusesCreated_aggregate(
    """distinct select on columns"""
    distinct_on: [notebook_focus_select_column!]

    """limit the number of rows returned"""
    limit: Int

    """skip the first n rows. Use only with order_by"""
    offset: Int

    """sort the rows by one or more columns"""
    order_by: [notebook_focus_order_by!]

    """filter the rows returned"""
    where: notebook_focus_bool_exp
  ): notebook_focus_aggregate!

  """An array relationship"""
  notebookTargetsCreated(
    """distinct select on columns"""
    distinct_on: [notebook_target_select_column!]

    """limit the number of rows returned"""
    limit: Int

    """skip the first n rows. Use only with order_by"""
    offset: Int

    """sort the rows by one or more columns"""
    order_by: [notebook_target_order_by!]

    """filter the rows returned"""
    where: notebook_target_bool_exp
  ): [notebook_target!]!

  """An aggregate relationship"""
  notebookTargetsCreated_aggregate(
    """distinct select on columns"""
    distinct_on: [notebook_target_select_column!]

    """limit the number of rows returned"""
    limit: Int

    """skip the first n rows. Use only with order_by"""
    offset: Int

    """sort the rows by one or more columns"""
    order_by: [notebook_target_order_by!]

    """filter the rows returned"""
    where: notebook_target_bool_exp
  ): notebook_target_aggregate!

  """An array relationship"""
  notebooksCreated(
    """distinct select on columns"""
    distinct_on: [notebook_member_select_column!]

    """limit the number of rows returned"""
    limit: Int

    """skip the first n rows. Use only with order_by"""
    offset: Int

    """sort the rows by one or more columns"""
    order_by: [notebook_member_order_by!]

    """filter the rows returned"""
    where: notebook_member_bool_exp
  ): [notebook_member!]!

  """An aggregate relationship"""
  notebooksCreated_aggregate(
    """distinct select on columns"""
    distinct_on: [notebook_member_select_column!]

    """limit the number of rows returned"""
    limit: Int

    """skip the first n rows. Use only with order_by"""
    offset: Int

    """sort the rows by one or more columns"""
    order_by: [notebook_member_order_by!]

    """filter the rows returned"""
    where: notebook_member_bool_exp
  ): notebook_member_aggregate!

  """An array relationship"""
  notebooksWhereMember(
    """distinct select on columns"""
    distinct_on: [notebook_member_select_column!]

    """limit the number of rows returned"""
    limit: Int

    """skip the first n rows. Use only with order_by"""
    offset: Int

    """sort the rows by one or more columns"""
    order_by: [notebook_member_order_by!]

    """filter the rows returned"""
    where: notebook_member_bool_exp
  ): [notebook_member!]!

  """An aggregate relationship"""
  notebooksWhereMember_aggregate(
    """distinct select on columns"""
    distinct_on: [notebook_member_select_column!]

    """limit the number of rows returned"""
    limit: Int

    """skip the first n rows. Use only with order_by"""
    offset: Int

    """sort the rows by one or more columns"""
    order_by: [notebook_member_order_by!]

    """filter the rows returned"""
    where: notebook_member_bool_exp
  ): notebook_member_aggregate!
  onboardingDone: Boolean
  orientationManagerId: uuid

  """An object relationship"""
  orientation_manager: orientation_manager

  """An object relationship"""
  professional: professional
  professionalId: uuid

  """An object relationship"""
  role: role!
  type: role_enum!
  updatedAt: timestamptz!
  username: String!
}

"""
aggregated selection of "account"
"""
type account_aggregate {
  aggregate: account_aggregate_fields
  nodes: [account!]!
}

input account_aggregate_bool_exp {
  bool_and: account_aggregate_bool_exp_bool_and
  bool_or: account_aggregate_bool_exp_bool_or
  count: account_aggregate_bool_exp_count
}

input account_aggregate_bool_exp_bool_and {
  arguments: account_select_column_account_aggregate_bool_exp_bool_and_arguments_columns!
  distinct: Boolean
  filter: account_bool_exp
  predicate: Boolean_comparison_exp!
}

input account_aggregate_bool_exp_bool_or {
  arguments: account_select_column_account_aggregate_bool_exp_bool_or_arguments_columns!
  distinct: Boolean
  filter: account_bool_exp
  predicate: Boolean_comparison_exp!
}

input account_aggregate_bool_exp_count {
  arguments: [account_select_column!]
  distinct: Boolean
  filter: account_bool_exp
  predicate: Int_comparison_exp!
}

"""
aggregate fields of "account"
"""
type account_aggregate_fields {
  count(columns: [account_select_column!], distinct: Boolean): Int!
  max: account_max_fields
  min: account_min_fields
}

"""
order by aggregate values of table "account"
"""
input account_aggregate_order_by {
  count: order_by
  max: account_max_order_by
  min: account_min_order_by
}

"""
input type for inserting array relation for remote table "account"
"""
input account_arr_rel_insert_input {
  data: [account_insert_input!]!

  """upsert condition"""
  on_conflict: account_on_conflict
}

"""
Boolean expression to filter rows from the table "account". All fields are combined with a logical 'AND'.
"""
input account_bool_exp {
  _and: [account_bool_exp!]
  _not: account_bool_exp
  _or: [account_bool_exp!]
  accessKey: String_comparison_exp
  accessKeyDate: timestamptz_comparison_exp
  admin: admin_cdb_bool_exp
  adminId: uuid_comparison_exp
  adminStructureId: uuid_comparison_exp
  admin_structure: admin_structure_bool_exp
  beneficiary: beneficiary_bool_exp
  beneficiaryId: uuid_comparison_exp
  confirmed: Boolean_comparison_exp
  createdAt: timestamptz_comparison_exp
  deletedAt: timestamptz_comparison_exp
  id: uuid_comparison_exp
  lastLogin: timestamptz_comparison_exp
  manager: manager_bool_exp
  managerId: uuid_comparison_exp
  notebookActionsCreated: notebook_action_bool_exp
  notebookActionsCreated_aggregate: notebook_action_aggregate_bool_exp
  notebookEventsCreated: notebook_event_bool_exp
  notebookEventsCreated_aggregate: notebook_event_aggregate_bool_exp
  notebookFocusesCreated: notebook_focus_bool_exp
  notebookFocusesCreated_aggregate: notebook_focus_aggregate_bool_exp
  notebookTargetsCreated: notebook_target_bool_exp
  notebookTargetsCreated_aggregate: notebook_target_aggregate_bool_exp
  notebooksCreated: notebook_member_bool_exp
  notebooksCreated_aggregate: notebook_member_aggregate_bool_exp
  notebooksWhereMember: notebook_member_bool_exp
  notebooksWhereMember_aggregate: notebook_member_aggregate_bool_exp
  onboardingDone: Boolean_comparison_exp
  orientationManagerId: uuid_comparison_exp
  orientation_manager: orientation_manager_bool_exp
  professional: professional_bool_exp
  professionalId: uuid_comparison_exp
  role: role_bool_exp
  type: role_enum_comparison_exp
  updatedAt: timestamptz_comparison_exp
  username: String_comparison_exp
}

"""
unique or primary key constraints on table "account"
"""
enum account_constraint {
  """
  unique or primary key constraint on columns "admin_id"
  """
  account_admin_id_key

  """
  unique or primary key constraint on columns "admin_structure_id"
  """
  account_admin_structure_id_key

  """
  unique or primary key constraint on columns "beneficiary_id"
  """
  account_beneficiary_id_key

  """
  unique or primary key constraint on columns "manager_id"
  """
  account_manager_id_key

  """
  unique or primary key constraint on columns "id"
  """
  account_pkey

  """
  unique or primary key constraint on columns "professional_id"
  """
  account_professional_id_key

  """
  unique or primary key constraint on columns "username"
  """
  account_username_unique
}

"""
columns and relationships of "account_info"
"""
type account_info {
  account_id: uuid
  email: citext
  firstname: String
  lastname: String
}

"""
aggregated selection of "account_info"
"""
type account_info_aggregate {
  aggregate: account_info_aggregate_fields
  nodes: [account_info!]!
}

"""
aggregate fields of "account_info"
"""
type account_info_aggregate_fields {
  count(columns: [account_info_select_column!], distinct: Boolean): Int!
  max: account_info_max_fields
  min: account_info_min_fields
}

"""
Boolean expression to filter rows from the table "account_info". All fields are combined with a logical 'AND'.
"""
input account_info_bool_exp {
  _and: [account_info_bool_exp!]
  _not: account_info_bool_exp
  _or: [account_info_bool_exp!]
  account_id: uuid_comparison_exp
  email: citext_comparison_exp
  firstname: String_comparison_exp
  lastname: String_comparison_exp
}

"""aggregate max on columns"""
type account_info_max_fields {
  account_id: uuid
  email: citext
  firstname: String
  lastname: String
}

"""aggregate min on columns"""
type account_info_min_fields {
  account_id: uuid
  email: citext
  firstname: String
  lastname: String
}

"""Ordering options when selecting data from "account_info"."""
input account_info_order_by {
  account_id: order_by
  email: order_by
  firstname: order_by
  lastname: order_by
}

"""
select columns of table "account_info"
"""
enum account_info_select_column {
  """column name"""
  account_id

  """column name"""
  email

  """column name"""
  firstname

  """column name"""
  lastname
}

"""
Streaming cursor of the table "account_info"
"""
input account_info_stream_cursor_input {
  """Stream column input with initial value"""
  initial_value: account_info_stream_cursor_value_input!

  """cursor ordering"""
  ordering: cursor_ordering
}

"""Initial value of the column from where the streaming should start"""
input account_info_stream_cursor_value_input {
  account_id: uuid
  email: citext
  firstname: String
  lastname: String
}

"""
input type for inserting data into table "account"
"""
input account_insert_input {
  accessKey: String
  accessKeyDate: timestamptz
  admin: admin_cdb_obj_rel_insert_input
  adminId: uuid
  adminStructureId: uuid
  admin_structure: admin_structure_obj_rel_insert_input
  beneficiary: beneficiary_obj_rel_insert_input
  beneficiaryId: uuid
  confirmed: Boolean
  createdAt: timestamptz
  deletedAt: timestamptz
  id: uuid
  lastLogin: timestamptz
  manager: manager_obj_rel_insert_input
  managerId: uuid
  notebookActionsCreated: notebook_action_arr_rel_insert_input
  notebookEventsCreated: notebook_event_arr_rel_insert_input
  notebookFocusesCreated: notebook_focus_arr_rel_insert_input
  notebookTargetsCreated: notebook_target_arr_rel_insert_input
  notebooksCreated: notebook_member_arr_rel_insert_input
  notebooksWhereMember: notebook_member_arr_rel_insert_input
  onboardingDone: Boolean
  orientationManagerId: uuid
  orientation_manager: orientation_manager_obj_rel_insert_input
  professional: professional_obj_rel_insert_input
  professionalId: uuid
  role: role_obj_rel_insert_input
  type: role_enum
  updatedAt: timestamptz
  username: String
}

"""aggregate max on columns"""
type account_max_fields {
  accessKey: String
  accessKeyDate: timestamptz
  adminId: uuid
  adminStructureId: uuid
  beneficiaryId: uuid
  createdAt: timestamptz
  deletedAt: timestamptz
  id: uuid
  lastLogin: timestamptz
  managerId: uuid
  orientationManagerId: uuid
  professionalId: uuid
  updatedAt: timestamptz
  username: String
}

"""
order by max() on columns of table "account"
"""
input account_max_order_by {
  accessKey: order_by
  accessKeyDate: order_by
  adminId: order_by
  adminStructureId: order_by
  beneficiaryId: order_by
  createdAt: order_by
  deletedAt: order_by
  id: order_by
  lastLogin: order_by
  managerId: order_by
  orientationManagerId: order_by
  professionalId: order_by
  updatedAt: order_by
  username: order_by
}

"""aggregate min on columns"""
type account_min_fields {
  accessKey: String
  accessKeyDate: timestamptz
  adminId: uuid
  adminStructureId: uuid
  beneficiaryId: uuid
  createdAt: timestamptz
  deletedAt: timestamptz
  id: uuid
  lastLogin: timestamptz
  managerId: uuid
  orientationManagerId: uuid
  professionalId: uuid
  updatedAt: timestamptz
  username: String
}

"""
order by min() on columns of table "account"
"""
input account_min_order_by {
  accessKey: order_by
  accessKeyDate: order_by
  adminId: order_by
  adminStructureId: order_by
  beneficiaryId: order_by
  createdAt: order_by
  deletedAt: order_by
  id: order_by
  lastLogin: order_by
  managerId: order_by
  orientationManagerId: order_by
  professionalId: order_by
  updatedAt: order_by
  username: order_by
}

"""
response of any mutation on the table "account"
"""
type account_mutation_response {
  """number of rows affected by the mutation"""
  affected_rows: Int!

  """data from the rows affected by the mutation"""
  returning: [account!]!
}

"""
input type for inserting object relation for remote table "account"
"""
input account_obj_rel_insert_input {
  data: account_insert_input!

  """upsert condition"""
  on_conflict: account_on_conflict
}

"""
on_conflict condition type for table "account"
"""
input account_on_conflict {
  constraint: account_constraint!
  update_columns: [account_update_column!]! = []
  where: account_bool_exp
}

"""Ordering options when selecting data from "account"."""
input account_order_by {
  accessKey: order_by
  accessKeyDate: order_by
  admin: admin_cdb_order_by
  adminId: order_by
  adminStructureId: order_by
  admin_structure: admin_structure_order_by
  beneficiary: beneficiary_order_by
  beneficiaryId: order_by
  confirmed: order_by
  createdAt: order_by
  deletedAt: order_by
  id: order_by
  lastLogin: order_by
  manager: manager_order_by
  managerId: order_by
  notebookActionsCreated_aggregate: notebook_action_aggregate_order_by
  notebookEventsCreated_aggregate: notebook_event_aggregate_order_by
  notebookFocusesCreated_aggregate: notebook_focus_aggregate_order_by
  notebookTargetsCreated_aggregate: notebook_target_aggregate_order_by
  notebooksCreated_aggregate: notebook_member_aggregate_order_by
  notebooksWhereMember_aggregate: notebook_member_aggregate_order_by
  onboardingDone: order_by
  orientationManagerId: order_by
  orientation_manager: orientation_manager_order_by
  professional: professional_order_by
  professionalId: order_by
  role: role_order_by
  type: order_by
  updatedAt: order_by
  username: order_by
}

"""primary key columns input for table: account"""
input account_pk_columns_input {
  id: uuid!
}

"""
select columns of table "account"
"""
enum account_select_column {
  """column name"""
  accessKey

  """column name"""
  accessKeyDate

  """column name"""
  adminId

  """column name"""
  adminStructureId

  """column name"""
  beneficiaryId

  """column name"""
  confirmed

  """column name"""
  createdAt

  """column name"""
  deletedAt

  """column name"""
  id

  """column name"""
  lastLogin

  """column name"""
  managerId

  """column name"""
  onboardingDone

  """column name"""
  orientationManagerId

  """column name"""
  professionalId

  """column name"""
  type

  """column name"""
  updatedAt

  """column name"""
  username
}

"""
select "account_aggregate_bool_exp_bool_and_arguments_columns" columns of table "account"
"""
enum account_select_column_account_aggregate_bool_exp_bool_and_arguments_columns {
  """column name"""
  confirmed

  """column name"""
  onboardingDone
}

"""
select "account_aggregate_bool_exp_bool_or_arguments_columns" columns of table "account"
"""
enum account_select_column_account_aggregate_bool_exp_bool_or_arguments_columns {
  """column name"""
  confirmed

  """column name"""
  onboardingDone
}

"""
input type for updating data in table "account"
"""
input account_set_input {
  accessKey: String
  accessKeyDate: timestamptz
  adminId: uuid
  adminStructureId: uuid
  beneficiaryId: uuid
  confirmed: Boolean
  createdAt: timestamptz
  deletedAt: timestamptz
  id: uuid
  lastLogin: timestamptz
  managerId: uuid
  onboardingDone: Boolean
  orientationManagerId: uuid
  professionalId: uuid
  type: role_enum
  updatedAt: timestamptz
  username: String
}

"""
Streaming cursor of the table "account"
"""
input account_stream_cursor_input {
  """Stream column input with initial value"""
  initial_value: account_stream_cursor_value_input!

  """cursor ordering"""
  ordering: cursor_ordering
}

"""Initial value of the column from where the streaming should start"""
input account_stream_cursor_value_input {
  accessKey: String
  accessKeyDate: timestamptz
  adminId: uuid
  adminStructureId: uuid
  beneficiaryId: uuid
  confirmed: Boolean
  createdAt: timestamptz
  deletedAt: timestamptz
  id: uuid
  lastLogin: timestamptz
  managerId: uuid
  onboardingDone: Boolean
  orientationManagerId: uuid
  professionalId: uuid
  type: role_enum
  updatedAt: timestamptz
  username: String
}

"""
update columns of table "account"
"""
enum account_update_column {
  """column name"""
  accessKey

  """column name"""
  accessKeyDate

  """column name"""
  adminId

  """column name"""
  adminStructureId

  """column name"""
  beneficiaryId

  """column name"""
  confirmed

  """column name"""
  createdAt

  """column name"""
  deletedAt

  """column name"""
  id

  """column name"""
  lastLogin

  """column name"""
  managerId

  """column name"""
  onboardingDone

  """column name"""
  orientationManagerId

  """column name"""
  professionalId

  """column name"""
  type

  """column name"""
  updatedAt

  """column name"""
  username
}

input account_updates {
  """sets the columns of the filtered rows to the given values"""
  _set: account_set_input
  where: account_bool_exp!
}

"""
columns and relationships of "admin_cdb"
"""
type admin_cdb {
  """An object relationship"""
  account: account
  createdAt: timestamptz!
  email: citext!
  firstname: String!
  id: uuid!
  lastname: String!
  updatedAt: timestamptz!
}

"""
aggregated selection of "admin_cdb"
"""
type admin_cdb_aggregate {
  aggregate: admin_cdb_aggregate_fields
  nodes: [admin_cdb!]!
}

"""
aggregate fields of "admin_cdb"
"""
type admin_cdb_aggregate_fields {
  count(columns: [admin_cdb_select_column!], distinct: Boolean): Int!
  max: admin_cdb_max_fields
  min: admin_cdb_min_fields
}

"""
Boolean expression to filter rows from the table "admin_cdb". All fields are combined with a logical 'AND'.
"""
input admin_cdb_bool_exp {
  _and: [admin_cdb_bool_exp!]
  _not: admin_cdb_bool_exp
  _or: [admin_cdb_bool_exp!]
  account: account_bool_exp
  createdAt: timestamptz_comparison_exp
  email: citext_comparison_exp
  firstname: String_comparison_exp
  id: uuid_comparison_exp
  lastname: String_comparison_exp
  updatedAt: timestamptz_comparison_exp
}

"""
unique or primary key constraints on table "admin_cdb"
"""
enum admin_cdb_constraint {
  """
  unique or primary key constraint on columns "email"
  """
  admin_email_unique

  """
  unique or primary key constraint on columns "id"
  """
  admin_pkey
}

"""
input type for inserting data into table "admin_cdb"
"""
input admin_cdb_insert_input {
  account: account_obj_rel_insert_input
  createdAt: timestamptz
  email: citext
  firstname: String
  id: uuid
  lastname: String
  updatedAt: timestamptz
}

"""aggregate max on columns"""
type admin_cdb_max_fields {
  createdAt: timestamptz
  email: citext
  firstname: String
  id: uuid
  lastname: String
  updatedAt: timestamptz
}

"""aggregate min on columns"""
type admin_cdb_min_fields {
  createdAt: timestamptz
  email: citext
  firstname: String
  id: uuid
  lastname: String
  updatedAt: timestamptz
}

"""
response of any mutation on the table "admin_cdb"
"""
type admin_cdb_mutation_response {
  """number of rows affected by the mutation"""
  affected_rows: Int!

  """data from the rows affected by the mutation"""
  returning: [admin_cdb!]!
}

"""
input type for inserting object relation for remote table "admin_cdb"
"""
input admin_cdb_obj_rel_insert_input {
  data: admin_cdb_insert_input!

  """upsert condition"""
  on_conflict: admin_cdb_on_conflict
}

"""
on_conflict condition type for table "admin_cdb"
"""
input admin_cdb_on_conflict {
  constraint: admin_cdb_constraint!
  update_columns: [admin_cdb_update_column!]! = []
  where: admin_cdb_bool_exp
}

"""Ordering options when selecting data from "admin_cdb"."""
input admin_cdb_order_by {
  account: account_order_by
  createdAt: order_by
  email: order_by
  firstname: order_by
  id: order_by
  lastname: order_by
  updatedAt: order_by
}

"""primary key columns input for table: admin_cdb"""
input admin_cdb_pk_columns_input {
  id: uuid!
}

"""
select columns of table "admin_cdb"
"""
enum admin_cdb_select_column {
  """column name"""
  createdAt

  """column name"""
  email

  """column name"""
  firstname

  """column name"""
  id

  """column name"""
  lastname

  """column name"""
  updatedAt
}

"""
input type for updating data in table "admin_cdb"
"""
input admin_cdb_set_input {
  createdAt: timestamptz
  email: citext
  firstname: String
  id: uuid
  lastname: String
  updatedAt: timestamptz
}

"""
Streaming cursor of the table "admin_cdb"
"""
input admin_cdb_stream_cursor_input {
  """Stream column input with initial value"""
  initial_value: admin_cdb_stream_cursor_value_input!

  """cursor ordering"""
  ordering: cursor_ordering
}

"""Initial value of the column from where the streaming should start"""
input admin_cdb_stream_cursor_value_input {
  createdAt: timestamptz
  email: citext
  firstname: String
  id: uuid
  lastname: String
  updatedAt: timestamptz
}

"""
update columns of table "admin_cdb"
"""
enum admin_cdb_update_column {
  """column name"""
  createdAt

  """column name"""
  email

  """column name"""
  firstname

  """column name"""
  id

  """column name"""
  lastname

  """column name"""
  updatedAt
}

input admin_cdb_updates {
  """sets the columns of the filtered rows to the given values"""
  _set: admin_cdb_set_input
  where: admin_cdb_bool_exp!
}

"""Table of structure manager, handle pro and brsa attachment"""
type admin_structure {
  """An object relationship"""
  account: account
  createdAt: timestamptz!

  """An object relationship"""
  deployment: deployment!
  deploymentId: uuid!
  email: citext!
  firstname: String
  id: uuid!
  lastname: String
  phoneNumbers: String
  position: String

  """An array relationship"""
  structures(
    """distinct select on columns"""
    distinct_on: [admin_structure_structure_select_column!]

    """limit the number of rows returned"""
    limit: Int

    """skip the first n rows. Use only with order_by"""
    offset: Int

    """sort the rows by one or more columns"""
    order_by: [admin_structure_structure_order_by!]

    """filter the rows returned"""
    where: admin_structure_structure_bool_exp
  ): [admin_structure_structure!]!

  """An aggregate relationship"""
  structures_aggregate(
    """distinct select on columns"""
    distinct_on: [admin_structure_structure_select_column!]

    """limit the number of rows returned"""
    limit: Int

    """skip the first n rows. Use only with order_by"""
    offset: Int

    """sort the rows by one or more columns"""
    order_by: [admin_structure_structure_order_by!]

    """filter the rows returned"""
    where: admin_structure_structure_bool_exp
  ): admin_structure_structure_aggregate!
  updatedAt: timestamptz!
}

"""
aggregated selection of "admin_structure"
"""
type admin_structure_aggregate {
  aggregate: admin_structure_aggregate_fields
  nodes: [admin_structure!]!
}

input admin_structure_aggregate_bool_exp {
  count: admin_structure_aggregate_bool_exp_count
}

input admin_structure_aggregate_bool_exp_count {
  arguments: [admin_structure_select_column!]
  distinct: Boolean
  filter: admin_structure_bool_exp
  predicate: Int_comparison_exp!
}

"""
aggregate fields of "admin_structure"
"""
type admin_structure_aggregate_fields {
  count(columns: [admin_structure_select_column!], distinct: Boolean): Int!
  max: admin_structure_max_fields
  min: admin_structure_min_fields
}

"""
order by aggregate values of table "admin_structure"
"""
input admin_structure_aggregate_order_by {
  count: order_by
  max: admin_structure_max_order_by
  min: admin_structure_min_order_by
}

"""
input type for inserting array relation for remote table "admin_structure"
"""
input admin_structure_arr_rel_insert_input {
  data: [admin_structure_insert_input!]!

  """upsert condition"""
  on_conflict: admin_structure_on_conflict
}

"""
Boolean expression to filter rows from the table "admin_structure". All fields are combined with a logical 'AND'.
"""
input admin_structure_bool_exp {
  _and: [admin_structure_bool_exp!]
  _not: admin_structure_bool_exp
  _or: [admin_structure_bool_exp!]
  account: account_bool_exp
  createdAt: timestamptz_comparison_exp
  deployment: deployment_bool_exp
  deploymentId: uuid_comparison_exp
  email: citext_comparison_exp
  firstname: String_comparison_exp
  id: uuid_comparison_exp
  lastname: String_comparison_exp
  phoneNumbers: String_comparison_exp
  position: String_comparison_exp
  structures: admin_structure_structure_bool_exp
  structures_aggregate: admin_structure_structure_aggregate_bool_exp
  updatedAt: timestamptz_comparison_exp
}

"""
unique or primary key constraints on table "admin_structure"
"""
enum admin_structure_constraint {
  """
  unique or primary key constraint on columns "email"
  """
  admin_structure_email_key

  """
  unique or primary key constraint on columns "id"
  """
  admin_structure_pkey
}

"""
input type for inserting data into table "admin_structure"
"""
input admin_structure_insert_input {
  account: account_obj_rel_insert_input
  createdAt: timestamptz
  deployment: deployment_obj_rel_insert_input
  deploymentId: uuid
  email: citext
  firstname: String
  id: uuid
  lastname: String
  phoneNumbers: String
  position: String
  structures: admin_structure_structure_arr_rel_insert_input
  updatedAt: timestamptz
}

"""aggregate max on columns"""
type admin_structure_max_fields {
  createdAt: timestamptz
  deploymentId: uuid
  email: citext
  firstname: String
  id: uuid
  lastname: String
  phoneNumbers: String
  position: String
  updatedAt: timestamptz
}

"""
order by max() on columns of table "admin_structure"
"""
input admin_structure_max_order_by {
  createdAt: order_by
  deploymentId: order_by
  email: order_by
  firstname: order_by
  id: order_by
  lastname: order_by
  phoneNumbers: order_by
  position: order_by
  updatedAt: order_by
}

"""aggregate min on columns"""
type admin_structure_min_fields {
  createdAt: timestamptz
  deploymentId: uuid
  email: citext
  firstname: String
  id: uuid
  lastname: String
  phoneNumbers: String
  position: String
  updatedAt: timestamptz
}

"""
order by min() on columns of table "admin_structure"
"""
input admin_structure_min_order_by {
  createdAt: order_by
  deploymentId: order_by
  email: order_by
  firstname: order_by
  id: order_by
  lastname: order_by
  phoneNumbers: order_by
  position: order_by
  updatedAt: order_by
}

"""
response of any mutation on the table "admin_structure"
"""
type admin_structure_mutation_response {
  """number of rows affected by the mutation"""
  affected_rows: Int!

  """data from the rows affected by the mutation"""
  returning: [admin_structure!]!
}

"""
input type for inserting object relation for remote table "admin_structure"
"""
input admin_structure_obj_rel_insert_input {
  data: admin_structure_insert_input!

  """upsert condition"""
  on_conflict: admin_structure_on_conflict
}

"""
on_conflict condition type for table "admin_structure"
"""
input admin_structure_on_conflict {
  constraint: admin_structure_constraint!
  update_columns: [admin_structure_update_column!]! = []
  where: admin_structure_bool_exp
}

"""Ordering options when selecting data from "admin_structure"."""
input admin_structure_order_by {
  account: account_order_by
  createdAt: order_by
  deployment: deployment_order_by
  deploymentId: order_by
  email: order_by
  firstname: order_by
  id: order_by
  lastname: order_by
  phoneNumbers: order_by
  position: order_by
  structures_aggregate: admin_structure_structure_aggregate_order_by
  updatedAt: order_by
}

"""primary key columns input for table: admin_structure"""
input admin_structure_pk_columns_input {
  id: uuid!
}

"""
select columns of table "admin_structure"
"""
enum admin_structure_select_column {
  """column name"""
  createdAt

  """column name"""
  deploymentId

  """column name"""
  email

  """column name"""
  firstname

  """column name"""
  id

  """column name"""
  lastname

  """column name"""
  phoneNumbers

  """column name"""
  position

  """column name"""
  updatedAt
}

"""
input type for updating data in table "admin_structure"
"""
input admin_structure_set_input {
  createdAt: timestamptz
  deploymentId: uuid
  email: citext
  firstname: String
  id: uuid
  lastname: String
  phoneNumbers: String
  position: String
  updatedAt: timestamptz
}

"""
Streaming cursor of the table "admin_structure"
"""
input admin_structure_stream_cursor_input {
  """Stream column input with initial value"""
  initial_value: admin_structure_stream_cursor_value_input!

  """cursor ordering"""
  ordering: cursor_ordering
}

"""Initial value of the column from where the streaming should start"""
input admin_structure_stream_cursor_value_input {
  createdAt: timestamptz
  deploymentId: uuid
  email: citext
  firstname: String
  id: uuid
  lastname: String
  phoneNumbers: String
  position: String
  updatedAt: timestamptz
}

"""associative table between admin_structure and structure (many ot many)"""
type admin_structure_structure {
  adminStructureId: uuid!

  """An object relationship"""
  admin_structure: admin_structure!
  createdAt: timestamptz!
  deletedAt: timestamptz
  id: uuid!

  """An object relationship"""
  structure: structure!
  structureId: uuid!
}

"""
aggregated selection of "admin_structure_structure"
"""
type admin_structure_structure_aggregate {
  aggregate: admin_structure_structure_aggregate_fields
  nodes: [admin_structure_structure!]!
}

input admin_structure_structure_aggregate_bool_exp {
  count: admin_structure_structure_aggregate_bool_exp_count
}

input admin_structure_structure_aggregate_bool_exp_count {
  arguments: [admin_structure_structure_select_column!]
  distinct: Boolean
  filter: admin_structure_structure_bool_exp
  predicate: Int_comparison_exp!
}

"""
aggregate fields of "admin_structure_structure"
"""
type admin_structure_structure_aggregate_fields {
  count(columns: [admin_structure_structure_select_column!], distinct: Boolean): Int!
  max: admin_structure_structure_max_fields
  min: admin_structure_structure_min_fields
}

"""
order by aggregate values of table "admin_structure_structure"
"""
input admin_structure_structure_aggregate_order_by {
  count: order_by
  max: admin_structure_structure_max_order_by
  min: admin_structure_structure_min_order_by
}

"""
input type for inserting array relation for remote table "admin_structure_structure"
"""
input admin_structure_structure_arr_rel_insert_input {
  data: [admin_structure_structure_insert_input!]!

  """upsert condition"""
  on_conflict: admin_structure_structure_on_conflict
}

"""
Boolean expression to filter rows from the table "admin_structure_structure". All fields are combined with a logical 'AND'.
"""
input admin_structure_structure_bool_exp {
  _and: [admin_structure_structure_bool_exp!]
  _not: admin_structure_structure_bool_exp
  _or: [admin_structure_structure_bool_exp!]
  adminStructureId: uuid_comparison_exp
  admin_structure: admin_structure_bool_exp
  createdAt: timestamptz_comparison_exp
  deletedAt: timestamptz_comparison_exp
  id: uuid_comparison_exp
  structure: structure_bool_exp
  structureId: uuid_comparison_exp
}

"""
unique or primary key constraints on table "admin_structure_structure"
"""
enum admin_structure_structure_constraint {
  """
  unique or primary key constraint on columns "admin_structure_id", "structure_id"
  """
  admin_structure_structure_admin_structure_id_structure_id_key

  """
  unique or primary key constraint on columns "id"
  """
  admin_structure_structure_pkey
}

"""
input type for inserting data into table "admin_structure_structure"
"""
input admin_structure_structure_insert_input {
  adminStructureId: uuid
  admin_structure: admin_structure_obj_rel_insert_input
  createdAt: timestamptz
  deletedAt: timestamptz
  id: uuid
  structure: structure_obj_rel_insert_input
  structureId: uuid
}

"""aggregate max on columns"""
type admin_structure_structure_max_fields {
  adminStructureId: uuid
  createdAt: timestamptz
  deletedAt: timestamptz
  id: uuid
  structureId: uuid
}

"""
order by max() on columns of table "admin_structure_structure"
"""
input admin_structure_structure_max_order_by {
  adminStructureId: order_by
  createdAt: order_by
  deletedAt: order_by
  id: order_by
  structureId: order_by
}

"""aggregate min on columns"""
type admin_structure_structure_min_fields {
  adminStructureId: uuid
  createdAt: timestamptz
  deletedAt: timestamptz
  id: uuid
  structureId: uuid
}

"""
order by min() on columns of table "admin_structure_structure"
"""
input admin_structure_structure_min_order_by {
  adminStructureId: order_by
  createdAt: order_by
  deletedAt: order_by
  id: order_by
  structureId: order_by
}

"""
response of any mutation on the table "admin_structure_structure"
"""
type admin_structure_structure_mutation_response {
  """number of rows affected by the mutation"""
  affected_rows: Int!

  """data from the rows affected by the mutation"""
  returning: [admin_structure_structure!]!
}

"""
on_conflict condition type for table "admin_structure_structure"
"""
input admin_structure_structure_on_conflict {
  constraint: admin_structure_structure_constraint!
  update_columns: [admin_structure_structure_update_column!]! = []
  where: admin_structure_structure_bool_exp
}

"""Ordering options when selecting data from "admin_structure_structure"."""
input admin_structure_structure_order_by {
  adminStructureId: order_by
  admin_structure: admin_structure_order_by
  createdAt: order_by
  deletedAt: order_by
  id: order_by
  structure: structure_order_by
  structureId: order_by
}

"""primary key columns input for table: admin_structure_structure"""
input admin_structure_structure_pk_columns_input {
  id: uuid!
}

"""
select columns of table "admin_structure_structure"
"""
enum admin_structure_structure_select_column {
  """column name"""
  adminStructureId

  """column name"""
  createdAt

  """column name"""
  deletedAt

  """column name"""
  id

  """column name"""
  structureId
}

"""
input type for updating data in table "admin_structure_structure"
"""
input admin_structure_structure_set_input {
  adminStructureId: uuid
  createdAt: timestamptz
  deletedAt: timestamptz
  id: uuid
  structureId: uuid
}

"""
Streaming cursor of the table "admin_structure_structure"
"""
input admin_structure_structure_stream_cursor_input {
  """Stream column input with initial value"""
  initial_value: admin_structure_structure_stream_cursor_value_input!

  """cursor ordering"""
  ordering: cursor_ordering
}

"""Initial value of the column from where the streaming should start"""
input admin_structure_structure_stream_cursor_value_input {
  adminStructureId: uuid
  createdAt: timestamptz
  deletedAt: timestamptz
  id: uuid
  structureId: uuid
}

"""
update columns of table "admin_structure_structure"
"""
enum admin_structure_structure_update_column {
  """column name"""
  adminStructureId

  """column name"""
  createdAt

  """column name"""
  deletedAt

  """column name"""
  id

  """column name"""
  structureId
}

input admin_structure_structure_updates {
  """sets the columns of the filtered rows to the given values"""
  _set: admin_structure_structure_set_input
  where: admin_structure_structure_bool_exp!
}

"""
update columns of table "admin_structure"
"""
enum admin_structure_update_column {
  """column name"""
  createdAt

  """column name"""
  deploymentId

  """column name"""
  email

  """column name"""
  firstname

  """column name"""
  id

  """column name"""
  lastname

  """column name"""
  phoneNumbers

  """column name"""
  position

  """column name"""
  updatedAt
}

input admin_structure_updates {
  """sets the columns of the filtered rows to the given values"""
  _set: admin_structure_set_input
  where: admin_structure_bool_exp!
}

"""
columns and relationships of "beneficiary"
"""
type beneficiary {
  """An object relationship"""
  account: account
  address1: String
  address2: String
  cafNumber: String
  city: String
  createdAt: timestamptz!
  dateOfBirth: date!

  """An object relationship"""
  deployment: deployment!
  deploymentId: uuid!
  email: citext
  firstname: String!
  id: uuid!
  internalId: String
  lastname: String!
  mobileNumber: String
  nir: String

  """An object relationship"""
  notebook: notebook

  """An object relationship"""
  notebook_public_view: notebook_public_view

  """An array relationship"""
  orientationRequest(
    """distinct select on columns"""
    distinct_on: [orientation_request_select_column!]

    """limit the number of rows returned"""
    limit: Int

    """skip the first n rows. Use only with order_by"""
    offset: Int

    """sort the rows by one or more columns"""
    order_by: [orientation_request_order_by!]

    """filter the rows returned"""
    where: orientation_request_bool_exp
  ): [orientation_request!]!

  """An aggregate relationship"""
  orientationRequest_aggregate(
    """distinct select on columns"""
    distinct_on: [orientation_request_select_column!]

    """limit the number of rows returned"""
    limit: Int

    """skip the first n rows. Use only with order_by"""
    offset: Int

    """sort the rows by one or more columns"""
    order_by: [orientation_request_order_by!]

    """filter the rows returned"""
    where: orientation_request_bool_exp
  ): orientation_request_aggregate!
  peNumber: String
  peUniqueId: String
  placeOfBirth: String
  postalCode: String

  """An array relationship"""
  structures(
    """distinct select on columns"""
    distinct_on: [beneficiary_structure_select_column!]

    """limit the number of rows returned"""
    limit: Int

    """skip the first n rows. Use only with order_by"""
    offset: Int

    """sort the rows by one or more columns"""
    order_by: [beneficiary_structure_order_by!]

    """filter the rows returned"""
    where: beneficiary_structure_bool_exp
  ): [beneficiary_structure!]!

  """An aggregate relationship"""
  structures_aggregate(
    """distinct select on columns"""
    distinct_on: [beneficiary_structure_select_column!]

    """limit the number of rows returned"""
    limit: Int

    """skip the first n rows. Use only with order_by"""
    offset: Int

    """sort the rows by one or more columns"""
    order_by: [beneficiary_structure_order_by!]

    """filter the rows returned"""
    where: beneficiary_structure_bool_exp
  ): beneficiary_structure_aggregate!
  updatedAt: timestamptz!
}

"""
aggregated selection of "beneficiary"
"""
type beneficiary_aggregate {
  aggregate: beneficiary_aggregate_fields
  nodes: [beneficiary!]!
}

input beneficiary_aggregate_bool_exp {
  count: beneficiary_aggregate_bool_exp_count
}

input beneficiary_aggregate_bool_exp_count {
  arguments: [beneficiary_select_column!]
  distinct: Boolean
  filter: beneficiary_bool_exp
  predicate: Int_comparison_exp!
}

"""
aggregate fields of "beneficiary"
"""
type beneficiary_aggregate_fields {
  count(columns: [beneficiary_select_column!], distinct: Boolean): Int!
  max: beneficiary_max_fields
  min: beneficiary_min_fields
}

"""
order by aggregate values of table "beneficiary"
"""
input beneficiary_aggregate_order_by {
  count: order_by
  max: beneficiary_max_order_by
  min: beneficiary_min_order_by
}

"""
input type for inserting array relation for remote table "beneficiary"
"""
input beneficiary_arr_rel_insert_input {
  data: [beneficiary_insert_input!]!

  """upsert condition"""
  on_conflict: beneficiary_on_conflict
}

"""
Boolean expression to filter rows from the table "beneficiary". All fields are combined with a logical 'AND'.
"""
input beneficiary_bool_exp {
  _and: [beneficiary_bool_exp!]
  _not: beneficiary_bool_exp
  _or: [beneficiary_bool_exp!]
  account: account_bool_exp
  address1: String_comparison_exp
  address2: String_comparison_exp
  cafNumber: String_comparison_exp
  city: String_comparison_exp
  createdAt: timestamptz_comparison_exp
  dateOfBirth: date_comparison_exp
  deployment: deployment_bool_exp
  deploymentId: uuid_comparison_exp
  email: citext_comparison_exp
  firstname: String_comparison_exp
  id: uuid_comparison_exp
  internalId: String_comparison_exp
  lastname: String_comparison_exp
  mobileNumber: String_comparison_exp
  nir: String_comparison_exp
  notebook: notebook_bool_exp
  notebook_public_view: notebook_public_view_bool_exp
  orientationRequest: orientation_request_bool_exp
  orientationRequest_aggregate: orientation_request_aggregate_bool_exp
  peNumber: String_comparison_exp
  peUniqueId: String_comparison_exp
  placeOfBirth: String_comparison_exp
  postalCode: String_comparison_exp
  structures: beneficiary_structure_bool_exp
  structures_aggregate: beneficiary_structure_aggregate_bool_exp
  updatedAt: timestamptz_comparison_exp
}

"""
unique or primary key constraints on table "beneficiary"
"""
enum beneficiary_constraint {
  """
  unique or primary key constraint on columns "internal_id"
  """
  beneficiary_internal_id_key

  """
  unique or primary key constraint on columns "nir"
  """
  beneficiary_nir_key

  """
  unique or primary key constraint on columns "id"
  """
  beneficiary_pkey

  """
  unique or primary key constraint on columns "date_of_birth", "deployment_id"
  """
  firstname_lastname_date_of_birth_unique_idx
}

"""
input type for inserting data into table "beneficiary"
"""
input beneficiary_insert_input {
  account: account_obj_rel_insert_input
  address1: String
  address2: String
  cafNumber: String
  city: String
  createdAt: timestamptz
  dateOfBirth: date
  deployment: deployment_obj_rel_insert_input
  deploymentId: uuid
  email: citext
  firstname: String
  id: uuid
  internalId: String
  lastname: String
  mobileNumber: String
  nir: String
  notebook: notebook_obj_rel_insert_input
  notebook_public_view: notebook_public_view_obj_rel_insert_input
  orientationRequest: orientation_request_arr_rel_insert_input
  peNumber: String
  peUniqueId: String
  placeOfBirth: String
  postalCode: String
  structures: beneficiary_structure_arr_rel_insert_input
  updatedAt: timestamptz
}

"""aggregate max on columns"""
type beneficiary_max_fields {
  address1: String
  address2: String
  cafNumber: String
  city: String
  createdAt: timestamptz
  dateOfBirth: date
  deploymentId: uuid
  email: citext
  firstname: String
  id: uuid
  internalId: String
  lastname: String
  mobileNumber: String
  nir: String
  peNumber: String
  peUniqueId: String
  placeOfBirth: String
  postalCode: String
  updatedAt: timestamptz
}

"""
order by max() on columns of table "beneficiary"
"""
input beneficiary_max_order_by {
  address1: order_by
  address2: order_by
  cafNumber: order_by
  city: order_by
  createdAt: order_by
  dateOfBirth: order_by
  deploymentId: order_by
  email: order_by
  firstname: order_by
  id: order_by
  internalId: order_by
  lastname: order_by
  mobileNumber: order_by
  nir: order_by
  peNumber: order_by
  peUniqueId: order_by
  placeOfBirth: order_by
  postalCode: order_by
  updatedAt: order_by
}

"""aggregate min on columns"""
type beneficiary_min_fields {
  address1: String
  address2: String
  cafNumber: String
  city: String
  createdAt: timestamptz
  dateOfBirth: date
  deploymentId: uuid
  email: citext
  firstname: String
  id: uuid
  internalId: String
  lastname: String
  mobileNumber: String
  nir: String
  peNumber: String
  peUniqueId: String
  placeOfBirth: String
  postalCode: String
  updatedAt: timestamptz
}

"""
order by min() on columns of table "beneficiary"
"""
input beneficiary_min_order_by {
  address1: order_by
  address2: order_by
  cafNumber: order_by
  city: order_by
  createdAt: order_by
  dateOfBirth: order_by
  deploymentId: order_by
  email: order_by
  firstname: order_by
  id: order_by
  internalId: order_by
  lastname: order_by
  mobileNumber: order_by
  nir: order_by
  peNumber: order_by
  peUniqueId: order_by
  placeOfBirth: order_by
  postalCode: order_by
  updatedAt: order_by
}

"""
response of any mutation on the table "beneficiary"
"""
type beneficiary_mutation_response {
  """number of rows affected by the mutation"""
  affected_rows: Int!

  """data from the rows affected by the mutation"""
  returning: [beneficiary!]!
}

"""
input type for inserting object relation for remote table "beneficiary"
"""
input beneficiary_obj_rel_insert_input {
  data: beneficiary_insert_input!

  """upsert condition"""
  on_conflict: beneficiary_on_conflict
}

"""
on_conflict condition type for table "beneficiary"
"""
input beneficiary_on_conflict {
  constraint: beneficiary_constraint!
  update_columns: [beneficiary_update_column!]! = []
  where: beneficiary_bool_exp
}

"""Ordering options when selecting data from "beneficiary"."""
input beneficiary_order_by {
  account: account_order_by
  address1: order_by
  address2: order_by
  cafNumber: order_by
  city: order_by
  createdAt: order_by
  dateOfBirth: order_by
  deployment: deployment_order_by
  deploymentId: order_by
  email: order_by
  firstname: order_by
  id: order_by
  internalId: order_by
  lastname: order_by
  mobileNumber: order_by
  nir: order_by
  notebook: notebook_order_by
  notebook_public_view: notebook_public_view_order_by
  orientationRequest_aggregate: orientation_request_aggregate_order_by
  peNumber: order_by
  peUniqueId: order_by
  placeOfBirth: order_by
  postalCode: order_by
  structures_aggregate: beneficiary_structure_aggregate_order_by
  updatedAt: order_by
}

"""primary key columns input for table: beneficiary"""
input beneficiary_pk_columns_input {
  id: uuid!
}

"""
select columns of table "beneficiary"
"""
enum beneficiary_select_column {
  """column name"""
  address1

  """column name"""
  address2

  """column name"""
  cafNumber

  """column name"""
  city

  """column name"""
  createdAt

  """column name"""
  dateOfBirth

  """column name"""
  deploymentId

  """column name"""
  email

  """column name"""
  firstname

  """column name"""
  id

  """column name"""
  internalId

  """column name"""
  lastname

  """column name"""
  mobileNumber

  """column name"""
  nir

  """column name"""
  peNumber

  """column name"""
  peUniqueId

  """column name"""
  placeOfBirth

  """column name"""
  postalCode

  """column name"""
  updatedAt
}

"""
input type for updating data in table "beneficiary"
"""
input beneficiary_set_input {
  address1: String
  address2: String
  cafNumber: String
  city: String
  createdAt: timestamptz
  dateOfBirth: date
  deploymentId: uuid
  email: citext
  firstname: String
  id: uuid
  internalId: String
  lastname: String
  mobileNumber: String
  nir: String
  peNumber: String
  peUniqueId: String
  placeOfBirth: String
  postalCode: String
  updatedAt: timestamptz
}

"""
Streaming cursor of the table "beneficiary"
"""
input beneficiary_stream_cursor_input {
  """Stream column input with initial value"""
  initial_value: beneficiary_stream_cursor_value_input!

  """cursor ordering"""
  ordering: cursor_ordering
}

"""Initial value of the column from where the streaming should start"""
input beneficiary_stream_cursor_value_input {
  address1: String
  address2: String
  cafNumber: String
  city: String
  createdAt: timestamptz
  dateOfBirth: date
  deploymentId: uuid
  email: citext
  firstname: String
  id: uuid
  internalId: String
  lastname: String
  mobileNumber: String
  nir: String
  peNumber: String
  peUniqueId: String
  placeOfBirth: String
  postalCode: String
  updatedAt: timestamptz
}

"""associative table between beneficiary and structure (many ot many)"""
type beneficiary_structure {
  """An object relationship"""
  beneficiary: beneficiary!
  beneficiaryId: uuid!
  createdAt: timestamptz!
  data(
    """JSON select path"""
    path: String
  ): jsonb!
  id: uuid!
  status: String!

  """An object relationship"""
  structure: structure!
  structureId: uuid!
  updatedAt: timestamptz!
}

"""
aggregated selection of "beneficiary_structure"
"""
type beneficiary_structure_aggregate {
  aggregate: beneficiary_structure_aggregate_fields
  nodes: [beneficiary_structure!]!
}

input beneficiary_structure_aggregate_bool_exp {
  count: beneficiary_structure_aggregate_bool_exp_count
}

input beneficiary_structure_aggregate_bool_exp_count {
  arguments: [beneficiary_structure_select_column!]
  distinct: Boolean
  filter: beneficiary_structure_bool_exp
  predicate: Int_comparison_exp!
}

"""
aggregate fields of "beneficiary_structure"
"""
type beneficiary_structure_aggregate_fields {
  count(columns: [beneficiary_structure_select_column!], distinct: Boolean): Int!
  max: beneficiary_structure_max_fields
  min: beneficiary_structure_min_fields
}

"""
order by aggregate values of table "beneficiary_structure"
"""
input beneficiary_structure_aggregate_order_by {
  count: order_by
  max: beneficiary_structure_max_order_by
  min: beneficiary_structure_min_order_by
}

"""append existing jsonb value of filtered columns with new jsonb value"""
input beneficiary_structure_append_input {
  data: jsonb
}

"""
input type for inserting array relation for remote table "beneficiary_structure"
"""
input beneficiary_structure_arr_rel_insert_input {
  data: [beneficiary_structure_insert_input!]!

  """upsert condition"""
  on_conflict: beneficiary_structure_on_conflict
}

"""
Boolean expression to filter rows from the table "beneficiary_structure". All fields are combined with a logical 'AND'.
"""
input beneficiary_structure_bool_exp {
  _and: [beneficiary_structure_bool_exp!]
  _not: beneficiary_structure_bool_exp
  _or: [beneficiary_structure_bool_exp!]
  beneficiary: beneficiary_bool_exp
  beneficiaryId: uuid_comparison_exp
  createdAt: timestamptz_comparison_exp
  data: jsonb_comparison_exp
  id: uuid_comparison_exp
  status: String_comparison_exp
  structure: structure_bool_exp
  structureId: uuid_comparison_exp
  updatedAt: timestamptz_comparison_exp
}

"""
unique or primary key constraints on table "beneficiary_structure"
"""
enum beneficiary_structure_constraint {
  """
  unique or primary key constraint on columns "id"
  """
  beneficiary_structure_pkey
}

"""
delete the field or element with specified path (for JSON arrays, negative integers count from the end)
"""
input beneficiary_structure_delete_at_path_input {
  data: [String!]
}

"""
delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array
"""
input beneficiary_structure_delete_elem_input {
  data: Int
}

"""
delete key/value pair or string element. key/value pairs are matched based on their key value
"""
input beneficiary_structure_delete_key_input {
  data: String
}

"""
input type for inserting data into table "beneficiary_structure"
"""
input beneficiary_structure_insert_input {
  beneficiary: beneficiary_obj_rel_insert_input
  beneficiaryId: uuid
  createdAt: timestamptz
  data: jsonb
  id: uuid
  status: String
  structure: structure_obj_rel_insert_input
  structureId: uuid
  updatedAt: timestamptz
}

"""aggregate max on columns"""
type beneficiary_structure_max_fields {
  beneficiaryId: uuid
  createdAt: timestamptz
  id: uuid
  status: String
  structureId: uuid
  updatedAt: timestamptz
}

"""
order by max() on columns of table "beneficiary_structure"
"""
input beneficiary_structure_max_order_by {
  beneficiaryId: order_by
  createdAt: order_by
  id: order_by
  status: order_by
  structureId: order_by
  updatedAt: order_by
}

"""aggregate min on columns"""
type beneficiary_structure_min_fields {
  beneficiaryId: uuid
  createdAt: timestamptz
  id: uuid
  status: String
  structureId: uuid
  updatedAt: timestamptz
}

"""
order by min() on columns of table "beneficiary_structure"
"""
input beneficiary_structure_min_order_by {
  beneficiaryId: order_by
  createdAt: order_by
  id: order_by
  status: order_by
  structureId: order_by
  updatedAt: order_by
}

"""
response of any mutation on the table "beneficiary_structure"
"""
type beneficiary_structure_mutation_response {
  """number of rows affected by the mutation"""
  affected_rows: Int!

  """data from the rows affected by the mutation"""
  returning: [beneficiary_structure!]!
}

"""
on_conflict condition type for table "beneficiary_structure"
"""
input beneficiary_structure_on_conflict {
  constraint: beneficiary_structure_constraint!
  update_columns: [beneficiary_structure_update_column!]! = []
  where: beneficiary_structure_bool_exp
}

"""Ordering options when selecting data from "beneficiary_structure"."""
input beneficiary_structure_order_by {
  beneficiary: beneficiary_order_by
  beneficiaryId: order_by
  createdAt: order_by
  data: order_by
  id: order_by
  status: order_by
  structure: structure_order_by
  structureId: order_by
  updatedAt: order_by
}

"""primary key columns input for table: beneficiary_structure"""
input beneficiary_structure_pk_columns_input {
  id: uuid!
}

"""prepend existing jsonb value of filtered columns with new jsonb value"""
input beneficiary_structure_prepend_input {
  data: jsonb
}

"""
select columns of table "beneficiary_structure"
"""
enum beneficiary_structure_select_column {
  """column name"""
  beneficiaryId

  """column name"""
  createdAt

  """column name"""
  data

  """column name"""
  id

  """column name"""
  status

  """column name"""
  structureId

  """column name"""
  updatedAt
}

"""
input type for updating data in table "beneficiary_structure"
"""
input beneficiary_structure_set_input {
  beneficiaryId: uuid
  createdAt: timestamptz
  data: jsonb
  id: uuid
  status: String
  structureId: uuid
  updatedAt: timestamptz
}

"""
Streaming cursor of the table "beneficiary_structure"
"""
input beneficiary_structure_stream_cursor_input {
  """Stream column input with initial value"""
  initial_value: beneficiary_structure_stream_cursor_value_input!

  """cursor ordering"""
  ordering: cursor_ordering
}

"""Initial value of the column from where the streaming should start"""
input beneficiary_structure_stream_cursor_value_input {
  beneficiaryId: uuid
  createdAt: timestamptz
  data: jsonb
  id: uuid
  status: String
  structureId: uuid
  updatedAt: timestamptz
}

"""
update columns of table "beneficiary_structure"
"""
enum beneficiary_structure_update_column {
  """column name"""
  beneficiaryId

  """column name"""
  createdAt

  """column name"""
  data

  """column name"""
  id

  """column name"""
  status

  """column name"""
  structureId

  """column name"""
  updatedAt
}

input beneficiary_structure_updates {
  """append existing jsonb value of filtered columns with new jsonb value"""
  _append: beneficiary_structure_append_input

  """
  delete the field or element with specified path (for JSON arrays, negative integers count from the end)
  """
  _delete_at_path: beneficiary_structure_delete_at_path_input

  """
  delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array
  """
  _delete_elem: beneficiary_structure_delete_elem_input

  """
  delete key/value pair or string element. key/value pairs are matched based on their key value
  """
  _delete_key: beneficiary_structure_delete_key_input

  """prepend existing jsonb value of filtered columns with new jsonb value"""
  _prepend: beneficiary_structure_prepend_input

  """sets the columns of the filtered rows to the given values"""
  _set: beneficiary_structure_set_input
  where: beneficiary_structure_bool_exp!
}

"""
update columns of table "beneficiary"
"""
enum beneficiary_update_column {
  """column name"""
  address1

  """column name"""
  address2

  """column name"""
  cafNumber

  """column name"""
  city

  """column name"""
  createdAt

  """column name"""
  dateOfBirth

  """column name"""
  deploymentId

  """column name"""
  email

  """column name"""
  firstname

  """column name"""
  id

  """column name"""
  internalId

  """column name"""
  lastname

  """column name"""
  mobileNumber

  """column name"""
  nir

  """column name"""
  peNumber

  """column name"""
  peUniqueId

  """column name"""
  placeOfBirth

  """column name"""
  postalCode

  """column name"""
  updatedAt
}

input beneficiary_updates {
  """sets the columns of the filtered rows to the given values"""
  _set: beneficiary_set_input
  where: beneficiary_bool_exp!
}

scalar bigint

"""
Boolean expression to compare columns of type "bigint". All fields are combined with logical 'AND'.
"""
input bigint_comparison_exp {
  _eq: bigint
  _gt: bigint
  _gte: bigint
  _in: [bigint!]
  _is_null: Boolean
  _lt: bigint
  _lte: bigint
  _neq: bigint
  _nin: [bigint!]
}

scalar citext

"""
Boolean expression to compare columns of type "citext". All fields are combined with logical 'AND'.
"""
input citext_comparison_exp {
  _eq: citext
  _gt: citext
  _gte: citext

  """does the column match the given case-insensitive pattern"""
  _ilike: citext
  _in: [citext!]

  """
  does the column match the given POSIX regular expression, case insensitive
  """
  _iregex: citext
  _is_null: Boolean

  """does the column match the given pattern"""
  _like: citext
  _lt: citext
  _lte: citext
  _neq: citext

  """does the column NOT match the given case-insensitive pattern"""
  _nilike: citext
  _nin: [citext!]

  """
  does the column NOT match the given POSIX regular expression, case insensitive
  """
  _niregex: citext

  """does the column NOT match the given pattern"""
  _nlike: citext

  """
  does the column NOT match the given POSIX regular expression, case sensitive
  """
  _nregex: citext

  """does the column NOT match the given SQL regular expression"""
  _nsimilar: citext

  """
  does the column match the given POSIX regular expression, case sensitive
  """
  _regex: citext

  """does the column match the given SQL regular expression"""
  _similar: citext
}

"""ordering argument of a cursor"""
enum cursor_ordering {
  """ascending ordering of the cursor"""
  ASC

  """descending ordering of the cursor"""
  DESC
}

scalar date

"""
Boolean expression to compare columns of type "date". All fields are combined with logical 'AND'.
"""
input date_comparison_exp {
  _eq: date
  _gt: date
  _gte: date
  _in: [date!]
  _is_null: Boolean
  _lt: date
  _lte: date
  _neq: date
  _nin: [date!]
}

"""list of carnet-de-bord deployments"""
type deployment {
  """An array relationship"""
  admin_structures(
    """distinct select on columns"""
    distinct_on: [admin_structure_select_column!]

    """limit the number of rows returned"""
    limit: Int

    """skip the first n rows. Use only with order_by"""
    offset: Int

    """sort the rows by one or more columns"""
    order_by: [admin_structure_order_by!]

    """filter the rows returned"""
    where: admin_structure_bool_exp
  ): [admin_structure!]!

  """An aggregate relationship"""
  admin_structures_aggregate(
    """distinct select on columns"""
    distinct_on: [admin_structure_select_column!]

    """limit the number of rows returned"""
    limit: Int

    """skip the first n rows. Use only with order_by"""
    offset: Int

    """sort the rows by one or more columns"""
    order_by: [admin_structure_order_by!]

    """filter the rows returned"""
    where: admin_structure_bool_exp
  ): admin_structure_aggregate!

  """An array relationship"""
  beneficiaries(
    """distinct select on columns"""
    distinct_on: [beneficiary_select_column!]

    """limit the number of rows returned"""
    limit: Int

    """skip the first n rows. Use only with order_by"""
    offset: Int

    """sort the rows by one or more columns"""
    order_by: [beneficiary_order_by!]

    """filter the rows returned"""
    where: beneficiary_bool_exp
  ): [beneficiary!]!

  """An aggregate relationship"""
  beneficiaries_aggregate(
    """distinct select on columns"""
    distinct_on: [beneficiary_select_column!]

    """limit the number of rows returned"""
    limit: Int

    """skip the first n rows. Use only with order_by"""
    offset: Int

    """sort the rows by one or more columns"""
    order_by: [beneficiary_order_by!]

    """filter the rows returned"""
    where: beneficiary_bool_exp
  ): beneficiary_aggregate!
  config(
    """JSON select path"""
    path: String
  ): jsonb
  createdAt: timestamptz!
  id: uuid!
  label: String!

  """An array relationship"""
  managers(
    """distinct select on columns"""
    distinct_on: [manager_select_column!]

    """limit the number of rows returned"""
    limit: Int

    """skip the first n rows. Use only with order_by"""
    offset: Int

    """sort the rows by one or more columns"""
    order_by: [manager_order_by!]

    """filter the rows returned"""
    where: manager_bool_exp
  ): [manager!]!

  """An aggregate relationship"""
  managers_aggregate(
    """distinct select on columns"""
    distinct_on: [manager_select_column!]

    """limit the number of rows returned"""
    limit: Int

    """skip the first n rows. Use only with order_by"""
    offset: Int

    """sort the rows by one or more columns"""
    order_by: [manager_order_by!]

    """filter the rows returned"""
    where: manager_bool_exp
  ): manager_aggregate!

  """An array relationship"""
  orientation_managers(
    """distinct select on columns"""
    distinct_on: [orientation_manager_select_column!]

    """limit the number of rows returned"""
    limit: Int

    """skip the first n rows. Use only with order_by"""
    offset: Int

    """sort the rows by one or more columns"""
    order_by: [orientation_manager_order_by!]

    """filter the rows returned"""
    where: orientation_manager_bool_exp
  ): [orientation_manager!]!

  """An aggregate relationship"""
  orientation_managers_aggregate(
    """distinct select on columns"""
    distinct_on: [orientation_manager_select_column!]

    """limit the number of rows returned"""
    limit: Int

    """skip the first n rows. Use only with order_by"""
    offset: Int

    """sort the rows by one or more columns"""
    order_by: [orientation_manager_order_by!]

    """filter the rows returned"""
    where: orientation_manager_bool_exp
  ): orientation_manager_aggregate!

  """An array relationship"""
  structures(
    """distinct select on columns"""
    distinct_on: [structure_select_column!]

    """limit the number of rows returned"""
    limit: Int

    """skip the first n rows. Use only with order_by"""
    offset: Int

    """sort the rows by one or more columns"""
    order_by: [structure_order_by!]

    """filter the rows returned"""
    where: structure_bool_exp
  ): [structure!]!

  """An aggregate relationship"""
  structures_aggregate(
    """distinct select on columns"""
    distinct_on: [structure_select_column!]

    """limit the number of rows returned"""
    limit: Int

    """skip the first n rows. Use only with order_by"""
    offset: Int

    """sort the rows by one or more columns"""
    order_by: [structure_order_by!]

    """filter the rows returned"""
    where: structure_bool_exp
  ): structure_aggregate!
  updatedAt: timestamptz!
}

"""
aggregated selection of "deployment"
"""
type deployment_aggregate {
  aggregate: deployment_aggregate_fields
  nodes: [deployment!]!
}

"""
aggregate fields of "deployment"
"""
type deployment_aggregate_fields {
  count(columns: [deployment_select_column!], distinct: Boolean): Int!
  max: deployment_max_fields
  min: deployment_min_fields
}

"""append existing jsonb value of filtered columns with new jsonb value"""
input deployment_append_input {
  config: jsonb
}

"""
Boolean expression to filter rows from the table "deployment". All fields are combined with a logical 'AND'.
"""
input deployment_bool_exp {
  _and: [deployment_bool_exp!]
  _not: deployment_bool_exp
  _or: [deployment_bool_exp!]
  admin_structures: admin_structure_bool_exp
  admin_structures_aggregate: admin_structure_aggregate_bool_exp
  beneficiaries: beneficiary_bool_exp
  beneficiaries_aggregate: beneficiary_aggregate_bool_exp
  config: jsonb_comparison_exp
  createdAt: timestamptz_comparison_exp
  id: uuid_comparison_exp
  label: String_comparison_exp
  managers: manager_bool_exp
  managers_aggregate: manager_aggregate_bool_exp
  orientation_managers: orientation_manager_bool_exp
  orientation_managers_aggregate: orientation_manager_aggregate_bool_exp
  structures: structure_bool_exp
  structures_aggregate: structure_aggregate_bool_exp
  updatedAt: timestamptz_comparison_exp
}

"""
unique or primary key constraints on table "deployment"
"""
enum deployment_constraint {
  """
  unique or primary key constraint on columns "id"
  """
  deployment_pkey
}

"""
delete the field or element with specified path (for JSON arrays, negative integers count from the end)
"""
input deployment_delete_at_path_input {
  config: [String!]
}

"""
delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array
"""
input deployment_delete_elem_input {
  config: Int
}

"""
delete key/value pair or string element. key/value pairs are matched based on their key value
"""
input deployment_delete_key_input {
  config: String
}

"""
input type for inserting data into table "deployment"
"""
input deployment_insert_input {
  admin_structures: admin_structure_arr_rel_insert_input
  beneficiaries: beneficiary_arr_rel_insert_input
  config: jsonb
  createdAt: timestamptz
  id: uuid
  label: String
  managers: manager_arr_rel_insert_input
  orientation_managers: orientation_manager_arr_rel_insert_input
  structures: structure_arr_rel_insert_input
  updatedAt: timestamptz
}

"""aggregate max on columns"""
type deployment_max_fields {
  createdAt: timestamptz
  id: uuid
  label: String
  updatedAt: timestamptz
}

"""aggregate min on columns"""
type deployment_min_fields {
  createdAt: timestamptz
  id: uuid
  label: String
  updatedAt: timestamptz
}

"""
response of any mutation on the table "deployment"
"""
type deployment_mutation_response {
  """number of rows affected by the mutation"""
  affected_rows: Int!

  """data from the rows affected by the mutation"""
  returning: [deployment!]!
}

"""
input type for inserting object relation for remote table "deployment"
"""
input deployment_obj_rel_insert_input {
  data: deployment_insert_input!

  """upsert condition"""
  on_conflict: deployment_on_conflict
}

"""
on_conflict condition type for table "deployment"
"""
input deployment_on_conflict {
  constraint: deployment_constraint!
  update_columns: [deployment_update_column!]! = []
  where: deployment_bool_exp
}

"""Ordering options when selecting data from "deployment"."""
input deployment_order_by {
  admin_structures_aggregate: admin_structure_aggregate_order_by
  beneficiaries_aggregate: beneficiary_aggregate_order_by
  config: order_by
  createdAt: order_by
  id: order_by
  label: order_by
  managers_aggregate: manager_aggregate_order_by
  orientation_managers_aggregate: orientation_manager_aggregate_order_by
  structures_aggregate: structure_aggregate_order_by
  updatedAt: order_by
}

"""primary key columns input for table: deployment"""
input deployment_pk_columns_input {
  id: uuid!
}

"""prepend existing jsonb value of filtered columns with new jsonb value"""
input deployment_prepend_input {
  config: jsonb
}

"""
select columns of table "deployment"
"""
enum deployment_select_column {
  """column name"""
  config

  """column name"""
  createdAt

  """column name"""
  id

  """column name"""
  label

  """column name"""
  updatedAt
}

"""
input type for updating data in table "deployment"
"""
input deployment_set_input {
  config: jsonb
  createdAt: timestamptz
  id: uuid
  label: String
  updatedAt: timestamptz
}

"""
Streaming cursor of the table "deployment"
"""
input deployment_stream_cursor_input {
  """Stream column input with initial value"""
  initial_value: deployment_stream_cursor_value_input!

  """cursor ordering"""
  ordering: cursor_ordering
}

"""Initial value of the column from where the streaming should start"""
input deployment_stream_cursor_value_input {
  config: jsonb
  createdAt: timestamptz
  id: uuid
  label: String
  updatedAt: timestamptz
}

"""
update columns of table "deployment"
"""
enum deployment_update_column {
  """column name"""
  config

  """column name"""
  createdAt

  """column name"""
  id

  """column name"""
  label

  """column name"""
  updatedAt
}

input deployment_updates {
  """append existing jsonb value of filtered columns with new jsonb value"""
  _append: deployment_append_input

  """
  delete the field or element with specified path (for JSON arrays, negative integers count from the end)
  """
  _delete_at_path: deployment_delete_at_path_input

  """
  delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array
  """
  _delete_elem: deployment_delete_elem_input

  """
  delete key/value pair or string element. key/value pairs are matched based on their key value
  """
  _delete_key: deployment_delete_key_input

  """prepend existing jsonb value of filtered columns with new jsonb value"""
  _prepend: deployment_prepend_input

  """sets the columns of the filtered rows to the given values"""
  _set: deployment_set_input
  where: deployment_bool_exp!
}

"""
columns and relationships of "external_data"
"""
type external_data {
  created_at: timestamptz
  data(
    """JSON select path"""
    path: String
  ): jsonb!

  """An object relationship"""
  external_source: external_source!
  hash: String!
  id: uuid!
  source: external_source_enum!
  updated_at: timestamptz
}

"""
aggregated selection of "external_data"
"""
type external_data_aggregate {
  aggregate: external_data_aggregate_fields
  nodes: [external_data!]!
}

input external_data_aggregate_bool_exp {
  count: external_data_aggregate_bool_exp_count
}

input external_data_aggregate_bool_exp_count {
  arguments: [external_data_select_column!]
  distinct: Boolean
  filter: external_data_bool_exp
  predicate: Int_comparison_exp!
}

"""
aggregate fields of "external_data"
"""
type external_data_aggregate_fields {
  count(columns: [external_data_select_column!], distinct: Boolean): Int!
  max: external_data_max_fields
  min: external_data_min_fields
}

"""
order by aggregate values of table "external_data"
"""
input external_data_aggregate_order_by {
  count: order_by
  max: external_data_max_order_by
  min: external_data_min_order_by
}

"""append existing jsonb value of filtered columns with new jsonb value"""
input external_data_append_input {
  data: jsonb
}

"""
input type for inserting array relation for remote table "external_data"
"""
input external_data_arr_rel_insert_input {
  data: [external_data_insert_input!]!

  """upsert condition"""
  on_conflict: external_data_on_conflict
}

"""
Boolean expression to filter rows from the table "external_data". All fields are combined with a logical 'AND'.
"""
input external_data_bool_exp {
  _and: [external_data_bool_exp!]
  _not: external_data_bool_exp
  _or: [external_data_bool_exp!]
  created_at: timestamptz_comparison_exp
  data: jsonb_comparison_exp
  external_source: external_source_bool_exp
  hash: String_comparison_exp
  id: uuid_comparison_exp
  source: external_source_enum_comparison_exp
  updated_at: timestamptz_comparison_exp
}

"""
unique or primary key constraints on table "external_data"
"""
enum external_data_constraint {
  """
  unique or primary key constraint on columns "id"
  """
  external_data_pkey
}

"""
delete the field or element with specified path (for JSON arrays, negative integers count from the end)
"""
input external_data_delete_at_path_input {
  data: [String!]
}

"""
delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array
"""
input external_data_delete_elem_input {
  data: Int
}

"""
delete key/value pair or string element. key/value pairs are matched based on their key value
"""
input external_data_delete_key_input {
  data: String
}

"""
columns and relationships of "external_data_info"
"""
type external_data_info {
  """An object relationship"""
  beneficiary: beneficiary
  beneficiary_id: uuid
  created_at: timestamptz!
  external_data_id: uuid!
  professional_id: uuid
  updated_at: timestamptz!
}

"""
aggregated selection of "external_data_info"
"""
type external_data_info_aggregate {
  aggregate: external_data_info_aggregate_fields
  nodes: [external_data_info!]!
}

"""
aggregate fields of "external_data_info"
"""
type external_data_info_aggregate_fields {
  count(columns: [external_data_info_select_column!], distinct: Boolean): Int!
  max: external_data_info_max_fields
  min: external_data_info_min_fields
}

"""
Boolean expression to filter rows from the table "external_data_info". All fields are combined with a logical 'AND'.
"""
input external_data_info_bool_exp {
  _and: [external_data_info_bool_exp!]
  _not: external_data_info_bool_exp
  _or: [external_data_info_bool_exp!]
  beneficiary: beneficiary_bool_exp
  beneficiary_id: uuid_comparison_exp
  created_at: timestamptz_comparison_exp
  external_data_id: uuid_comparison_exp
  professional_id: uuid_comparison_exp
  updated_at: timestamptz_comparison_exp
}

"""
unique or primary key constraints on table "external_data_info"
"""
enum external_data_info_constraint {
  """
  unique or primary key constraint on columns "external_data_id"
  """
  external_data_info_pkey
}

"""
input type for inserting data into table "external_data_info"
"""
input external_data_info_insert_input {
  beneficiary: beneficiary_obj_rel_insert_input
  beneficiary_id: uuid
  created_at: timestamptz
  external_data_id: uuid
  professional_id: uuid
  updated_at: timestamptz
}

"""aggregate max on columns"""
type external_data_info_max_fields {
  beneficiary_id: uuid
  created_at: timestamptz
  external_data_id: uuid
  professional_id: uuid
  updated_at: timestamptz
}

"""aggregate min on columns"""
type external_data_info_min_fields {
  beneficiary_id: uuid
  created_at: timestamptz
  external_data_id: uuid
  professional_id: uuid
  updated_at: timestamptz
}

"""
response of any mutation on the table "external_data_info"
"""
type external_data_info_mutation_response {
  """number of rows affected by the mutation"""
  affected_rows: Int!

  """data from the rows affected by the mutation"""
  returning: [external_data_info!]!
}

"""
on_conflict condition type for table "external_data_info"
"""
input external_data_info_on_conflict {
  constraint: external_data_info_constraint!
  update_columns: [external_data_info_update_column!]! = []
  where: external_data_info_bool_exp
}

"""Ordering options when selecting data from "external_data_info"."""
input external_data_info_order_by {
  beneficiary: beneficiary_order_by
  beneficiary_id: order_by
  created_at: order_by
  external_data_id: order_by
  professional_id: order_by
  updated_at: order_by
}

"""primary key columns input for table: external_data_info"""
input external_data_info_pk_columns_input {
  external_data_id: uuid!
}

"""
select columns of table "external_data_info"
"""
enum external_data_info_select_column {
  """column name"""
  beneficiary_id

  """column name"""
  created_at

  """column name"""
  external_data_id

  """column name"""
  professional_id

  """column name"""
  updated_at
}

"""
input type for updating data in table "external_data_info"
"""
input external_data_info_set_input {
  beneficiary_id: uuid
  created_at: timestamptz
  external_data_id: uuid
  professional_id: uuid
  updated_at: timestamptz
}

"""
Streaming cursor of the table "external_data_info"
"""
input external_data_info_stream_cursor_input {
  """Stream column input with initial value"""
  initial_value: external_data_info_stream_cursor_value_input!

  """cursor ordering"""
  ordering: cursor_ordering
}

"""Initial value of the column from where the streaming should start"""
input external_data_info_stream_cursor_value_input {
  beneficiary_id: uuid
  created_at: timestamptz
  external_data_id: uuid
  professional_id: uuid
  updated_at: timestamptz
}

"""
update columns of table "external_data_info"
"""
enum external_data_info_update_column {
  """column name"""
  beneficiary_id

  """column name"""
  created_at

  """column name"""
  external_data_id

  """column name"""
  professional_id

  """column name"""
  updated_at
}

input external_data_info_updates {
  """sets the columns of the filtered rows to the given values"""
  _set: external_data_info_set_input
  where: external_data_info_bool_exp!
}

"""
input type for inserting data into table "external_data"
"""
input external_data_insert_input {
  created_at: timestamptz
  data: jsonb
  external_source: external_source_obj_rel_insert_input
  hash: String
  id: uuid
  source: external_source_enum
  updated_at: timestamptz
}

"""aggregate max on columns"""
type external_data_max_fields {
  created_at: timestamptz
  hash: String
  id: uuid
  updated_at: timestamptz
}

"""
order by max() on columns of table "external_data"
"""
input external_data_max_order_by {
  created_at: order_by
  hash: order_by
  id: order_by
  updated_at: order_by
}

"""aggregate min on columns"""
type external_data_min_fields {
  created_at: timestamptz
  hash: String
  id: uuid
  updated_at: timestamptz
}

"""
order by min() on columns of table "external_data"
"""
input external_data_min_order_by {
  created_at: order_by
  hash: order_by
  id: order_by
  updated_at: order_by
}

"""
response of any mutation on the table "external_data"
"""
type external_data_mutation_response {
  """number of rows affected by the mutation"""
  affected_rows: Int!

  """data from the rows affected by the mutation"""
  returning: [external_data!]!
}

"""
on_conflict condition type for table "external_data"
"""
input external_data_on_conflict {
  constraint: external_data_constraint!
  update_columns: [external_data_update_column!]! = []
  where: external_data_bool_exp
}

"""Ordering options when selecting data from "external_data"."""
input external_data_order_by {
  created_at: order_by
  data: order_by
  external_source: external_source_order_by
  hash: order_by
  id: order_by
  source: order_by
  updated_at: order_by
}

"""primary key columns input for table: external_data"""
input external_data_pk_columns_input {
  id: uuid!
}

"""prepend existing jsonb value of filtered columns with new jsonb value"""
input external_data_prepend_input {
  data: jsonb
}

"""
select columns of table "external_data"
"""
enum external_data_select_column {
  """column name"""
  created_at

  """column name"""
  data

  """column name"""
  hash

  """column name"""
  id

  """column name"""
  source

  """column name"""
  updated_at
}

"""
input type for updating data in table "external_data"
"""
input external_data_set_input {
  created_at: timestamptz
  data: jsonb
  hash: String
  id: uuid
  source: external_source_enum
  updated_at: timestamptz
}

"""
Streaming cursor of the table "external_data"
"""
input external_data_stream_cursor_input {
  """Stream column input with initial value"""
  initial_value: external_data_stream_cursor_value_input!

  """cursor ordering"""
  ordering: cursor_ordering
}

"""Initial value of the column from where the streaming should start"""
input external_data_stream_cursor_value_input {
  created_at: timestamptz
  data: jsonb
  hash: String
  id: uuid
  source: external_source_enum
  updated_at: timestamptz
}

"""
update columns of table "external_data"
"""
enum external_data_update_column {
  """column name"""
  created_at

  """column name"""
  data

  """column name"""
  hash

  """column name"""
  id

  """column name"""
  source

  """column name"""
  updated_at
}

input external_data_updates {
  """append existing jsonb value of filtered columns with new jsonb value"""
  _append: external_data_append_input

  """
  delete the field or element with specified path (for JSON arrays, negative integers count from the end)
  """
  _delete_at_path: external_data_delete_at_path_input

  """
  delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array
  """
  _delete_elem: external_data_delete_elem_input

  """
  delete key/value pair or string element. key/value pairs are matched based on their key value
  """
  _delete_key: external_data_delete_key_input

  """prepend existing jsonb value of filtered columns with new jsonb value"""
  _prepend: external_data_prepend_input

  """sets the columns of the filtered rows to the given values"""
  _set: external_data_set_input
  where: external_data_bool_exp!
}

"""
columns and relationships of "external_source"
"""
type external_source {
  comment: String!

  """An array relationship"""
  external_data(
    """distinct select on columns"""
    distinct_on: [external_data_select_column!]

    """limit the number of rows returned"""
    limit: Int

    """skip the first n rows. Use only with order_by"""
    offset: Int

    """sort the rows by one or more columns"""
    order_by: [external_data_order_by!]

    """filter the rows returned"""
    where: external_data_bool_exp
  ): [external_data!]!

  """An aggregate relationship"""
  external_data_aggregate(
    """distinct select on columns"""
    distinct_on: [external_data_select_column!]

    """limit the number of rows returned"""
    limit: Int

    """skip the first n rows. Use only with order_by"""
    offset: Int

    """sort the rows by one or more columns"""
    order_by: [external_data_order_by!]

    """filter the rows returned"""
    where: external_data_bool_exp
  ): external_data_aggregate!
  value: String!
}

"""
aggregated selection of "external_source"
"""
type external_source_aggregate {
  aggregate: external_source_aggregate_fields
  nodes: [external_source!]!
}

"""
aggregate fields of "external_source"
"""
type external_source_aggregate_fields {
  count(columns: [external_source_select_column!], distinct: Boolean): Int!
  max: external_source_max_fields
  min: external_source_min_fields
}

"""
Boolean expression to filter rows from the table "external_source". All fields are combined with a logical 'AND'.
"""
input external_source_bool_exp {
  _and: [external_source_bool_exp!]
  _not: external_source_bool_exp
  _or: [external_source_bool_exp!]
  comment: String_comparison_exp
  external_data: external_data_bool_exp
  external_data_aggregate: external_data_aggregate_bool_exp
  value: String_comparison_exp
}

"""
unique or primary key constraints on table "external_source"
"""
enum external_source_constraint {
  """
  unique or primary key constraint on columns "value"
  """
  external_source_pkey
}

enum external_source_enum {
  """Pôle Emploi"""
  pe
}

"""
Boolean expression to compare columns of type "external_source_enum". All fields are combined with logical 'AND'.
"""
input external_source_enum_comparison_exp {
  _eq: external_source_enum
  _in: [external_source_enum!]
  _is_null: Boolean
  _neq: external_source_enum
  _nin: [external_source_enum!]
}

"""
input type for inserting data into table "external_source"
"""
input external_source_insert_input {
  comment: String
  external_data: external_data_arr_rel_insert_input
  value: String
}

"""aggregate max on columns"""
type external_source_max_fields {
  comment: String
  value: String
}

"""aggregate min on columns"""
type external_source_min_fields {
  comment: String
  value: String
}

"""
response of any mutation on the table "external_source"
"""
type external_source_mutation_response {
  """number of rows affected by the mutation"""
  affected_rows: Int!

  """data from the rows affected by the mutation"""
  returning: [external_source!]!
}

"""
input type for inserting object relation for remote table "external_source"
"""
input external_source_obj_rel_insert_input {
  data: external_source_insert_input!

  """upsert condition"""
  on_conflict: external_source_on_conflict
}

"""
on_conflict condition type for table "external_source"
"""
input external_source_on_conflict {
  constraint: external_source_constraint!
  update_columns: [external_source_update_column!]! = []
  where: external_source_bool_exp
}

"""Ordering options when selecting data from "external_source"."""
input external_source_order_by {
  comment: order_by
  external_data_aggregate: external_data_aggregate_order_by
  value: order_by
}

"""primary key columns input for table: external_source"""
input external_source_pk_columns_input {
  value: String!
}

"""
select columns of table "external_source"
"""
enum external_source_select_column {
  """column name"""
  comment

  """column name"""
  value
}

"""
input type for updating data in table "external_source"
"""
input external_source_set_input {
  comment: String
  value: String
}

"""
Streaming cursor of the table "external_source"
"""
input external_source_stream_cursor_input {
  """Stream column input with initial value"""
  initial_value: external_source_stream_cursor_value_input!

  """cursor ordering"""
  ordering: cursor_ordering
}

"""Initial value of the column from where the streaming should start"""
input external_source_stream_cursor_value_input {
  comment: String
  value: String
}

"""
update columns of table "external_source"
"""
enum external_source_update_column {
  """column name"""
  comment

  """column name"""
  value
}

input external_source_updates {
  """sets the columns of the filtered rows to the given values"""
  _set: external_source_set_input
  where: external_source_bool_exp!
}

scalar jsonb

input jsonb_cast_exp {
  String: String_comparison_exp
}

"""
Boolean expression to compare columns of type "jsonb". All fields are combined with logical 'AND'.
"""
input jsonb_comparison_exp {
  _cast: jsonb_cast_exp

  """is the column contained in the given json value"""
  _contained_in: jsonb

  """does the column contain the given json value at the top level"""
  _contains: jsonb
  _eq: jsonb
  _gt: jsonb
  _gte: jsonb

  """does the string exist as a top-level key in the column"""
  _has_key: String

  """do all of these strings exist as top-level keys in the column"""
  _has_keys_all: [String!]

  """do any of these strings exist as top-level keys in the column"""
  _has_keys_any: [String!]
  _in: [jsonb!]
  _is_null: Boolean
  _lt: jsonb
  _lte: jsonb
  _neq: jsonb
  _nin: [jsonb!]
}

"""A manager handle structure and professional for a given deployment"""
type manager {
  """An object relationship"""
  account: account
  createdAt: timestamptz!

  """An object relationship"""
  deployment: deployment!
  deploymentId: uuid!
  email: citext!
  firstname: String
  id: uuid!
  lastname: String
  updatedAt: timestamptz!
}

"""
aggregated selection of "manager"
"""
type manager_aggregate {
  aggregate: manager_aggregate_fields
  nodes: [manager!]!
}

input manager_aggregate_bool_exp {
  count: manager_aggregate_bool_exp_count
}

input manager_aggregate_bool_exp_count {
  arguments: [manager_select_column!]
  distinct: Boolean
  filter: manager_bool_exp
  predicate: Int_comparison_exp!
}

"""
aggregate fields of "manager"
"""
type manager_aggregate_fields {
  count(columns: [manager_select_column!], distinct: Boolean): Int!
  max: manager_max_fields
  min: manager_min_fields
}

"""
order by aggregate values of table "manager"
"""
input manager_aggregate_order_by {
  count: order_by
  max: manager_max_order_by
  min: manager_min_order_by
}

"""
input type for inserting array relation for remote table "manager"
"""
input manager_arr_rel_insert_input {
  data: [manager_insert_input!]!

  """upsert condition"""
  on_conflict: manager_on_conflict
}

"""
Boolean expression to filter rows from the table "manager". All fields are combined with a logical 'AND'.
"""
input manager_bool_exp {
  _and: [manager_bool_exp!]
  _not: manager_bool_exp
  _or: [manager_bool_exp!]
  account: account_bool_exp
  createdAt: timestamptz_comparison_exp
  deployment: deployment_bool_exp
  deploymentId: uuid_comparison_exp
  email: citext_comparison_exp
  firstname: String_comparison_exp
  id: uuid_comparison_exp
  lastname: String_comparison_exp
  updatedAt: timestamptz_comparison_exp
}

"""
unique or primary key constraints on table "manager"
"""
enum manager_constraint {
  """
  unique or primary key constraint on columns "email"
  """
  manager_email_key

  """
  unique or primary key constraint on columns "id"
  """
  manager_pkey
}

"""
input type for inserting data into table "manager"
"""
input manager_insert_input {
  account: account_obj_rel_insert_input
  createdAt: timestamptz
  deployment: deployment_obj_rel_insert_input
  deploymentId: uuid
  email: citext
  firstname: String
  id: uuid
  lastname: String
  updatedAt: timestamptz
}

"""aggregate max on columns"""
type manager_max_fields {
  createdAt: timestamptz
  deploymentId: uuid
  email: citext
  firstname: String
  id: uuid
  lastname: String
  updatedAt: timestamptz
}

"""
order by max() on columns of table "manager"
"""
input manager_max_order_by {
  createdAt: order_by
  deploymentId: order_by
  email: order_by
  firstname: order_by
  id: order_by
  lastname: order_by
  updatedAt: order_by
}

"""aggregate min on columns"""
type manager_min_fields {
  createdAt: timestamptz
  deploymentId: uuid
  email: citext
  firstname: String
  id: uuid
  lastname: String
  updatedAt: timestamptz
}

"""
order by min() on columns of table "manager"
"""
input manager_min_order_by {
  createdAt: order_by
  deploymentId: order_by
  email: order_by
  firstname: order_by
  id: order_by
  lastname: order_by
  updatedAt: order_by
}

"""
response of any mutation on the table "manager"
"""
type manager_mutation_response {
  """number of rows affected by the mutation"""
  affected_rows: Int!

  """data from the rows affected by the mutation"""
  returning: [manager!]!
}

"""
input type for inserting object relation for remote table "manager"
"""
input manager_obj_rel_insert_input {
  data: manager_insert_input!

  """upsert condition"""
  on_conflict: manager_on_conflict
}

"""
on_conflict condition type for table "manager"
"""
input manager_on_conflict {
  constraint: manager_constraint!
  update_columns: [manager_update_column!]! = []
  where: manager_bool_exp
}

"""Ordering options when selecting data from "manager"."""
input manager_order_by {
  account: account_order_by
  createdAt: order_by
  deployment: deployment_order_by
  deploymentId: order_by
  email: order_by
  firstname: order_by
  id: order_by
  lastname: order_by
  updatedAt: order_by
}

"""primary key columns input for table: manager"""
input manager_pk_columns_input {
  id: uuid!
}

"""
select columns of table "manager"
"""
enum manager_select_column {
  """column name"""
  createdAt

  """column name"""
  deploymentId

  """column name"""
  email

  """column name"""
  firstname

  """column name"""
  id

  """column name"""
  lastname

  """column name"""
  updatedAt
}

"""
input type for updating data in table "manager"
"""
input manager_set_input {
  createdAt: timestamptz
  deploymentId: uuid
  email: citext
  firstname: String
  id: uuid
  lastname: String
  updatedAt: timestamptz
}

"""
Streaming cursor of the table "manager"
"""
input manager_stream_cursor_input {
  """Stream column input with initial value"""
  initial_value: manager_stream_cursor_value_input!

  """cursor ordering"""
  ordering: cursor_ordering
}

"""Initial value of the column from where the streaming should start"""
input manager_stream_cursor_value_input {
  createdAt: timestamptz
  deploymentId: uuid
  email: citext
  firstname: String
  id: uuid
  lastname: String
  updatedAt: timestamptz
}

"""
update columns of table "manager"
"""
enum manager_update_column {
  """column name"""
  createdAt

  """column name"""
  deploymentId

  """column name"""
  email

  """column name"""
  firstname

  """column name"""
  id

  """column name"""
  lastname

  """column name"""
  updatedAt
}

input manager_updates {
  """sets the columns of the filtered rows to the given values"""
  _set: manager_set_input
  where: manager_bool_exp!
}

"""mutation root"""
type mutation_root {
  createDeploymentWithEmail(deployment: String!, email: citext!): CreateDeploymentOutput

  """
  delete data from the table: "account"
  """
  delete_account(
    """filter the rows which have to be deleted"""
    where: account_bool_exp!
  ): account_mutation_response

  """
  delete single row from the table: "account"
  """
  delete_account_by_pk(id: uuid!): account

  """
  delete data from the table: "admin_cdb"
  """
  delete_admin_cdb(
    """filter the rows which have to be deleted"""
    where: admin_cdb_bool_exp!
  ): admin_cdb_mutation_response

  """
  delete single row from the table: "admin_cdb"
  """
  delete_admin_cdb_by_pk(id: uuid!): admin_cdb

  """
  delete data from the table: "admin_structure"
  """
  delete_admin_structure(
    """filter the rows which have to be deleted"""
    where: admin_structure_bool_exp!
  ): admin_structure_mutation_response

  """
  delete single row from the table: "admin_structure"
  """
  delete_admin_structure_by_pk(id: uuid!): admin_structure

  """
  delete data from the table: "admin_structure_structure"
  """
  delete_admin_structure_structure(
    """filter the rows which have to be deleted"""
    where: admin_structure_structure_bool_exp!
  ): admin_structure_structure_mutation_response

  """
  delete single row from the table: "admin_structure_structure"
  """
  delete_admin_structure_structure_by_pk(id: uuid!): admin_structure_structure

  """
  delete data from the table: "beneficiary"
  """
  delete_beneficiary(
    """filter the rows which have to be deleted"""
    where: beneficiary_bool_exp!
  ): beneficiary_mutation_response

  """
  delete single row from the table: "beneficiary"
  """
  delete_beneficiary_by_pk(id: uuid!): beneficiary

  """
  delete data from the table: "beneficiary_structure"
  """
  delete_beneficiary_structure(
    """filter the rows which have to be deleted"""
    where: beneficiary_structure_bool_exp!
  ): beneficiary_structure_mutation_response

  """
  delete single row from the table: "beneficiary_structure"
  """
  delete_beneficiary_structure_by_pk(id: uuid!): beneficiary_structure

  """
  delete data from the table: "deployment"
  """
  delete_deployment(
    """filter the rows which have to be deleted"""
    where: deployment_bool_exp!
  ): deployment_mutation_response

  """
  delete single row from the table: "deployment"
  """
  delete_deployment_by_pk(id: uuid!): deployment

  """
  delete data from the table: "external_data"
  """
  delete_external_data(
    """filter the rows which have to be deleted"""
    where: external_data_bool_exp!
  ): external_data_mutation_response

  """
  delete single row from the table: "external_data"
  """
  delete_external_data_by_pk(id: uuid!): external_data

  """
  delete data from the table: "external_data_info"
  """
  delete_external_data_info(
    """filter the rows which have to be deleted"""
    where: external_data_info_bool_exp!
  ): external_data_info_mutation_response

  """
  delete single row from the table: "external_data_info"
  """
  delete_external_data_info_by_pk(external_data_id: uuid!): external_data_info

  """
  delete data from the table: "external_source"
  """
  delete_external_source(
    """filter the rows which have to be deleted"""
    where: external_source_bool_exp!
  ): external_source_mutation_response

  """
  delete single row from the table: "external_source"
  """
  delete_external_source_by_pk(value: String!): external_source

  """
  delete data from the table: "manager"
  """
  delete_manager(
    """filter the rows which have to be deleted"""
    where: manager_bool_exp!
  ): manager_mutation_response

  """
  delete single row from the table: "manager"
  """
  delete_manager_by_pk(id: uuid!): manager

  """
  delete data from the table: "notebook"
  """
  delete_notebook(
    """filter the rows which have to be deleted"""
    where: notebook_bool_exp!
  ): notebook_mutation_response

  """
  delete data from the table: "notebook_action"
  """
  delete_notebook_action(
    """filter the rows which have to be deleted"""
    where: notebook_action_bool_exp!
  ): notebook_action_mutation_response

  """
  delete single row from the table: "notebook_action"
  """
  delete_notebook_action_by_pk(id: uuid!): notebook_action

  """
  delete data from the table: "notebook_appointment"
  """
  delete_notebook_appointment(
    """filter the rows which have to be deleted"""
    where: notebook_appointment_bool_exp!
  ): notebook_appointment_mutation_response

  """
  delete single row from the table: "notebook_appointment"
  """
  delete_notebook_appointment_by_pk(id: uuid!): notebook_appointment

  """
  delete single row from the table: "notebook"
  """
  delete_notebook_by_pk(id: uuid!): notebook

  """
  delete data from the table: "notebook_event"
  """
  delete_notebook_event(
    """filter the rows which have to be deleted"""
    where: notebook_event_bool_exp!
  ): notebook_event_mutation_response

  """
  delete single row from the table: "notebook_event"
  """
  delete_notebook_event_by_pk(id: uuid!): notebook_event

  """
  delete data from the table: "notebook_event_type"
  """
  delete_notebook_event_type(
    """filter the rows which have to be deleted"""
    where: notebook_event_type_bool_exp!
  ): notebook_event_type_mutation_response

  """
  delete single row from the table: "notebook_event_type"
  """
  delete_notebook_event_type_by_pk(value: String!): notebook_event_type

  """
  delete data from the table: "notebook_focus"
  """
  delete_notebook_focus(
    """filter the rows which have to be deleted"""
    where: notebook_focus_bool_exp!
  ): notebook_focus_mutation_response

  """
  delete single row from the table: "notebook_focus"
  """
  delete_notebook_focus_by_pk(id: uuid!): notebook_focus

  """
  delete data from the table: "notebook_info"
  """
  delete_notebook_info(
    """filter the rows which have to be deleted"""
    where: notebook_info_bool_exp!
  ): notebook_info_mutation_response

  """
  delete single row from the table: "notebook_info"
  """
  delete_notebook_info_by_pk(notebookId: uuid!): notebook_info

  """
  delete data from the table: "notebook_member"
  """
  delete_notebook_member(
    """filter the rows which have to be deleted"""
    where: notebook_member_bool_exp!
  ): notebook_member_mutation_response

  """
  delete single row from the table: "notebook_member"
  """
  delete_notebook_member_by_pk(id: uuid!): notebook_member

  """
  delete data from the table: "notebook_public_view"
  """
  delete_notebook_public_view(
    """filter the rows which have to be deleted"""
    where: notebook_public_view_bool_exp!
  ): notebook_public_view_mutation_response

  """
  delete data from the table: "notebook_target"
  """
  delete_notebook_target(
    """filter the rows which have to be deleted"""
    where: notebook_target_bool_exp!
  ): notebook_target_mutation_response

  """
  delete single row from the table: "notebook_target"
  """
  delete_notebook_target_by_pk(id: uuid!): notebook_target

  """
  delete data from the table: "orientation_manager"
  """
  delete_orientation_manager(
    """filter the rows which have to be deleted"""
    where: orientation_manager_bool_exp!
  ): orientation_manager_mutation_response

  """
  delete single row from the table: "orientation_manager"
  """
  delete_orientation_manager_by_pk(id: uuid!): orientation_manager

  """
  delete data from the table: "orientation_request"
  """
  delete_orientation_request(
    """filter the rows which have to be deleted"""
    where: orientation_request_bool_exp!
  ): orientation_request_mutation_response

  """
  delete single row from the table: "orientation_request"
  """
  delete_orientation_request_by_pk(id: uuid!): orientation_request

  """
  delete data from the table: "orientation_type"
  """
  delete_orientation_type(
    """filter the rows which have to be deleted"""
    where: orientation_type_bool_exp!
  ): orientation_type_mutation_response

  """
  delete single row from the table: "orientation_type"
  """
  delete_orientation_type_by_pk(id: String!): orientation_type

  """
  delete data from the table: "professional"
  """
  delete_professional(
    """filter the rows which have to be deleted"""
    where: professional_bool_exp!
  ): professional_mutation_response

  """
  delete single row from the table: "professional"
  """
  delete_professional_by_pk(id: uuid!): professional

  """
  delete data from the table: "ref_action"
  """
  delete_ref_action(
    """filter the rows which have to be deleted"""
    where: ref_action_bool_exp!
  ): ref_action_mutation_response

  """
  delete single row from the table: "ref_action"
  """
  delete_ref_action_by_pk(id: uuid!): ref_action

  """
  delete data from the table: "ref_situation"
  """
  delete_ref_situation(
    """filter the rows which have to be deleted"""
    where: ref_situation_bool_exp!
  ): ref_situation_mutation_response

  """
  delete single row from the table: "ref_situation"
  """
  delete_ref_situation_by_pk(id: uuid!): ref_situation

  """
  delete data from the table: "ref_target"
  """
  delete_ref_target(
    """filter the rows which have to be deleted"""
    where: ref_target_bool_exp!
  ): ref_target_mutation_response

  """
  delete single row from the table: "ref_target"
  """
  delete_ref_target_by_pk(id: uuid!): ref_target

  """
  delete data from the table: "role"
  """
  delete_role(
    """filter the rows which have to be deleted"""
    where: role_bool_exp!
  ): role_mutation_response

  """
  delete single row from the table: "role"
  """
  delete_role_by_pk(label: String!): role

  """
  delete data from the table: "rome_code"
  """
  delete_rome_code(
    """filter the rows which have to be deleted"""
    where: rome_code_bool_exp!
  ): rome_code_mutation_response

  """
  delete single row from the table: "rome_code"
  """
  delete_rome_code_by_pk(id: uuid!): rome_code

  """
  delete data from the table: "structure"
  """
  delete_structure(
    """filter the rows which have to be deleted"""
    where: structure_bool_exp!
  ): structure_mutation_response

  """
  delete single row from the table: "structure"
  """
  delete_structure_by_pk(id: uuid!): structure

  """
  delete data from the table: "wanted_job"
  """
  delete_wanted_job(
    """filter the rows which have to be deleted"""
    where: wanted_job_bool_exp!
  ): wanted_job_mutation_response

  """
  delete single row from the table: "wanted_job"
  """
  delete_wanted_job_by_pk(id: uuid!): wanted_job

  """
  insert data into the table: "account"
  """
  insert_account(
    """the rows to be inserted"""
    objects: [account_insert_input!]!

    """upsert condition"""
    on_conflict: account_on_conflict
  ): account_mutation_response

  """
  insert a single row into the table: "account"
  """
  insert_account_one(
    """the row to be inserted"""
    object: account_insert_input!

    """upsert condition"""
    on_conflict: account_on_conflict
  ): account

  """
  insert data into the table: "admin_cdb"
  """
  insert_admin_cdb(
    """the rows to be inserted"""
    objects: [admin_cdb_insert_input!]!

    """upsert condition"""
    on_conflict: admin_cdb_on_conflict
  ): admin_cdb_mutation_response

  """
  insert a single row into the table: "admin_cdb"
  """
  insert_admin_cdb_one(
    """the row to be inserted"""
    object: admin_cdb_insert_input!

    """upsert condition"""
    on_conflict: admin_cdb_on_conflict
  ): admin_cdb

  """
  insert data into the table: "admin_structure"
  """
  insert_admin_structure(
    """the rows to be inserted"""
    objects: [admin_structure_insert_input!]!

    """upsert condition"""
    on_conflict: admin_structure_on_conflict
  ): admin_structure_mutation_response

  """
  insert a single row into the table: "admin_structure"
  """
  insert_admin_structure_one(
    """the row to be inserted"""
    object: admin_structure_insert_input!

    """upsert condition"""
    on_conflict: admin_structure_on_conflict
  ): admin_structure

  """
  insert data into the table: "admin_structure_structure"
  """
  insert_admin_structure_structure(
    """the rows to be inserted"""
    objects: [admin_structure_structure_insert_input!]!

    """upsert condition"""
    on_conflict: admin_structure_structure_on_conflict
  ): admin_structure_structure_mutation_response

  """
  insert a single row into the table: "admin_structure_structure"
  """
  insert_admin_structure_structure_one(
    """the row to be inserted"""
    object: admin_structure_structure_insert_input!

    """upsert condition"""
    on_conflict: admin_structure_structure_on_conflict
  ): admin_structure_structure

  """
  insert data into the table: "beneficiary"
  """
  insert_beneficiary(
    """the rows to be inserted"""
    objects: [beneficiary_insert_input!]!

    """upsert condition"""
    on_conflict: beneficiary_on_conflict
  ): beneficiary_mutation_response

  """
  insert a single row into the table: "beneficiary"
  """
  insert_beneficiary_one(
    """the row to be inserted"""
    object: beneficiary_insert_input!

    """upsert condition"""
    on_conflict: beneficiary_on_conflict
  ): beneficiary

  """
  insert data into the table: "beneficiary_structure"
  """
  insert_beneficiary_structure(
    """the rows to be inserted"""
    objects: [beneficiary_structure_insert_input!]!

    """upsert condition"""
    on_conflict: beneficiary_structure_on_conflict
  ): beneficiary_structure_mutation_response

  """
  insert a single row into the table: "beneficiary_structure"
  """
  insert_beneficiary_structure_one(
    """the row to be inserted"""
    object: beneficiary_structure_insert_input!

    """upsert condition"""
    on_conflict: beneficiary_structure_on_conflict
  ): beneficiary_structure

  """
  insert data into the table: "deployment"
  """
  insert_deployment(
    """the rows to be inserted"""
    objects: [deployment_insert_input!]!

    """upsert condition"""
    on_conflict: deployment_on_conflict
  ): deployment_mutation_response

  """
  insert a single row into the table: "deployment"
  """
  insert_deployment_one(
    """the row to be inserted"""
    object: deployment_insert_input!

    """upsert condition"""
    on_conflict: deployment_on_conflict
  ): deployment

  """
  insert data into the table: "external_data"
  """
  insert_external_data(
    """the rows to be inserted"""
    objects: [external_data_insert_input!]!

    """upsert condition"""
    on_conflict: external_data_on_conflict
  ): external_data_mutation_response

  """
  insert data into the table: "external_data_info"
  """
  insert_external_data_info(
    """the rows to be inserted"""
    objects: [external_data_info_insert_input!]!

    """upsert condition"""
    on_conflict: external_data_info_on_conflict
  ): external_data_info_mutation_response

  """
  insert a single row into the table: "external_data_info"
  """
  insert_external_data_info_one(
    """the row to be inserted"""
    object: external_data_info_insert_input!

    """upsert condition"""
    on_conflict: external_data_info_on_conflict
  ): external_data_info

  """
  insert a single row into the table: "external_data"
  """
  insert_external_data_one(
    """the row to be inserted"""
    object: external_data_insert_input!

    """upsert condition"""
    on_conflict: external_data_on_conflict
  ): external_data

  """
  insert data into the table: "external_source"
  """
  insert_external_source(
    """the rows to be inserted"""
    objects: [external_source_insert_input!]!

    """upsert condition"""
    on_conflict: external_source_on_conflict
  ): external_source_mutation_response

  """
  insert a single row into the table: "external_source"
  """
  insert_external_source_one(
    """the row to be inserted"""
    object: external_source_insert_input!

    """upsert condition"""
    on_conflict: external_source_on_conflict
  ): external_source

  """
  insert data into the table: "manager"
  """
  insert_manager(
    """the rows to be inserted"""
    objects: [manager_insert_input!]!

    """upsert condition"""
    on_conflict: manager_on_conflict
  ): manager_mutation_response

  """
  insert a single row into the table: "manager"
  """
  insert_manager_one(
    """the row to be inserted"""
    object: manager_insert_input!

    """upsert condition"""
    on_conflict: manager_on_conflict
  ): manager

  """
  insert data into the table: "notebook"
  """
  insert_notebook(
    """the rows to be inserted"""
    objects: [notebook_insert_input!]!

    """upsert condition"""
    on_conflict: notebook_on_conflict
  ): notebook_mutation_response

  """
  insert data into the table: "notebook_action"
  """
  insert_notebook_action(
    """the rows to be inserted"""
    objects: [notebook_action_insert_input!]!

    """upsert condition"""
    on_conflict: notebook_action_on_conflict
  ): notebook_action_mutation_response

  """
  insert a single row into the table: "notebook_action"
  """
  insert_notebook_action_one(
    """the row to be inserted"""
    object: notebook_action_insert_input!

    """upsert condition"""
    on_conflict: notebook_action_on_conflict
  ): notebook_action

  """
  insert data into the table: "notebook_appointment"
  """
  insert_notebook_appointment(
    """the rows to be inserted"""
    objects: [notebook_appointment_insert_input!]!

    """upsert condition"""
    on_conflict: notebook_appointment_on_conflict
  ): notebook_appointment_mutation_response

  """
  insert a single row into the table: "notebook_appointment"
  """
  insert_notebook_appointment_one(
    """the row to be inserted"""
    object: notebook_appointment_insert_input!

    """upsert condition"""
    on_conflict: notebook_appointment_on_conflict
  ): notebook_appointment

  """
  insert data into the table: "notebook_event"
  """
  insert_notebook_event(
    """the rows to be inserted"""
    objects: [notebook_event_insert_input!]!

    """upsert condition"""
    on_conflict: notebook_event_on_conflict
  ): notebook_event_mutation_response

  """
  insert a single row into the table: "notebook_event"
  """
  insert_notebook_event_one(
    """the row to be inserted"""
    object: notebook_event_insert_input!

    """upsert condition"""
    on_conflict: notebook_event_on_conflict
  ): notebook_event

  """
  insert data into the table: "notebook_event_type"
  """
  insert_notebook_event_type(
    """the rows to be inserted"""
    objects: [notebook_event_type_insert_input!]!

    """upsert condition"""
    on_conflict: notebook_event_type_on_conflict
  ): notebook_event_type_mutation_response

  """
  insert a single row into the table: "notebook_event_type"
  """
  insert_notebook_event_type_one(
    """the row to be inserted"""
    object: notebook_event_type_insert_input!

    """upsert condition"""
    on_conflict: notebook_event_type_on_conflict
  ): notebook_event_type

  """
  insert data into the table: "notebook_focus"
  """
  insert_notebook_focus(
    """the rows to be inserted"""
    objects: [notebook_focus_insert_input!]!

    """upsert condition"""
    on_conflict: notebook_focus_on_conflict
  ): notebook_focus_mutation_response

  """
  insert a single row into the table: "notebook_focus"
  """
  insert_notebook_focus_one(
    """the row to be inserted"""
    object: notebook_focus_insert_input!

    """upsert condition"""
    on_conflict: notebook_focus_on_conflict
  ): notebook_focus

  """
  insert data into the table: "notebook_info"
  """
  insert_notebook_info(
    """the rows to be inserted"""
    objects: [notebook_info_insert_input!]!

    """upsert condition"""
    on_conflict: notebook_info_on_conflict
  ): notebook_info_mutation_response

  """
  insert a single row into the table: "notebook_info"
  """
  insert_notebook_info_one(
    """the row to be inserted"""
    object: notebook_info_insert_input!

    """upsert condition"""
    on_conflict: notebook_info_on_conflict
  ): notebook_info

  """
  insert data into the table: "notebook_member"
  """
  insert_notebook_member(
    """the rows to be inserted"""
    objects: [notebook_member_insert_input!]!

    """upsert condition"""
    on_conflict: notebook_member_on_conflict
  ): notebook_member_mutation_response

  """
  insert a single row into the table: "notebook_member"
  """
  insert_notebook_member_one(
    """the row to be inserted"""
    object: notebook_member_insert_input!

    """upsert condition"""
    on_conflict: notebook_member_on_conflict
  ): notebook_member

  """
  insert a single row into the table: "notebook"
  """
  insert_notebook_one(
    """the row to be inserted"""
    object: notebook_insert_input!

    """upsert condition"""
    on_conflict: notebook_on_conflict
  ): notebook

  """
  insert data into the table: "notebook_public_view"
  """
  insert_notebook_public_view(
    """the rows to be inserted"""
    objects: [notebook_public_view_insert_input!]!
  ): notebook_public_view_mutation_response

  """
  insert a single row into the table: "notebook_public_view"
  """
  insert_notebook_public_view_one(
    """the row to be inserted"""
    object: notebook_public_view_insert_input!
  ): notebook_public_view

  """
  insert data into the table: "notebook_target"
  """
  insert_notebook_target(
    """the rows to be inserted"""
    objects: [notebook_target_insert_input!]!

    """upsert condition"""
    on_conflict: notebook_target_on_conflict
  ): notebook_target_mutation_response

  """
  insert a single row into the table: "notebook_target"
  """
  insert_notebook_target_one(
    """the row to be inserted"""
    object: notebook_target_insert_input!

    """upsert condition"""
    on_conflict: notebook_target_on_conflict
  ): notebook_target

  """
  insert data into the table: "orientation_manager"
  """
  insert_orientation_manager(
    """the rows to be inserted"""
    objects: [orientation_manager_insert_input!]!

    """upsert condition"""
    on_conflict: orientation_manager_on_conflict
  ): orientation_manager_mutation_response

  """
  insert a single row into the table: "orientation_manager"
  """
  insert_orientation_manager_one(
    """the row to be inserted"""
    object: orientation_manager_insert_input!

    """upsert condition"""
    on_conflict: orientation_manager_on_conflict
  ): orientation_manager

  """
  insert data into the table: "orientation_request"
  """
  insert_orientation_request(
    """the rows to be inserted"""
    objects: [orientation_request_insert_input!]!

    """upsert condition"""
    on_conflict: orientation_request_on_conflict
  ): orientation_request_mutation_response

  """
  insert a single row into the table: "orientation_request"
  """
  insert_orientation_request_one(
    """the row to be inserted"""
    object: orientation_request_insert_input!

    """upsert condition"""
    on_conflict: orientation_request_on_conflict
  ): orientation_request

  """
  insert data into the table: "orientation_type"
  """
  insert_orientation_type(
    """the rows to be inserted"""
    objects: [orientation_type_insert_input!]!

    """upsert condition"""
    on_conflict: orientation_type_on_conflict
  ): orientation_type_mutation_response

  """
  insert a single row into the table: "orientation_type"
  """
  insert_orientation_type_one(
    """the row to be inserted"""
    object: orientation_type_insert_input!

    """upsert condition"""
    on_conflict: orientation_type_on_conflict
  ): orientation_type

  """
  insert data into the table: "professional"
  """
  insert_professional(
    """the rows to be inserted"""
    objects: [professional_insert_input!]!

    """upsert condition"""
    on_conflict: professional_on_conflict
  ): professional_mutation_response

  """
  insert a single row into the table: "professional"
  """
  insert_professional_one(
    """the row to be inserted"""
    object: professional_insert_input!

    """upsert condition"""
    on_conflict: professional_on_conflict
  ): professional

  """
  insert data into the table: "ref_action"
  """
  insert_ref_action(
    """the rows to be inserted"""
    objects: [ref_action_insert_input!]!

    """upsert condition"""
    on_conflict: ref_action_on_conflict
  ): ref_action_mutation_response

  """
  insert a single row into the table: "ref_action"
  """
  insert_ref_action_one(
    """the row to be inserted"""
    object: ref_action_insert_input!

    """upsert condition"""
    on_conflict: ref_action_on_conflict
  ): ref_action

  """
  insert data into the table: "ref_situation"
  """
  insert_ref_situation(
    """the rows to be inserted"""
    objects: [ref_situation_insert_input!]!

    """upsert condition"""
    on_conflict: ref_situation_on_conflict
  ): ref_situation_mutation_response

  """
  insert a single row into the table: "ref_situation"
  """
  insert_ref_situation_one(
    """the row to be inserted"""
    object: ref_situation_insert_input!

    """upsert condition"""
    on_conflict: ref_situation_on_conflict
  ): ref_situation

  """
  insert data into the table: "ref_target"
  """
  insert_ref_target(
    """the rows to be inserted"""
    objects: [ref_target_insert_input!]!

    """upsert condition"""
    on_conflict: ref_target_on_conflict
  ): ref_target_mutation_response

  """
  insert a single row into the table: "ref_target"
  """
  insert_ref_target_one(
    """the row to be inserted"""
    object: ref_target_insert_input!

    """upsert condition"""
    on_conflict: ref_target_on_conflict
  ): ref_target

  """
  insert data into the table: "role"
  """
  insert_role(
    """the rows to be inserted"""
    objects: [role_insert_input!]!

    """upsert condition"""
    on_conflict: role_on_conflict
  ): role_mutation_response

  """
  insert a single row into the table: "role"
  """
  insert_role_one(
    """the row to be inserted"""
    object: role_insert_input!

    """upsert condition"""
    on_conflict: role_on_conflict
  ): role

  """
  insert data into the table: "rome_code"
  """
  insert_rome_code(
    """the rows to be inserted"""
    objects: [rome_code_insert_input!]!

    """upsert condition"""
    on_conflict: rome_code_on_conflict
  ): rome_code_mutation_response

  """
  insert a single row into the table: "rome_code"
  """
  insert_rome_code_one(
    """the row to be inserted"""
    object: rome_code_insert_input!

    """upsert condition"""
    on_conflict: rome_code_on_conflict
  ): rome_code

  """
  insert data into the table: "structure"
  """
  insert_structure(
    """the rows to be inserted"""
    objects: [structure_insert_input!]!

    """upsert condition"""
    on_conflict: structure_on_conflict
  ): structure_mutation_response

  """
  insert a single row into the table: "structure"
  """
  insert_structure_one(
    """the row to be inserted"""
    object: structure_insert_input!

    """upsert condition"""
    on_conflict: structure_on_conflict
  ): structure

  """
  insert data into the table: "wanted_job"
  """
  insert_wanted_job(
    """the rows to be inserted"""
    objects: [wanted_job_insert_input!]!

    """upsert condition"""
    on_conflict: wanted_job_on_conflict
  ): wanted_job_mutation_response

  """
  insert a single row into the table: "wanted_job"
  """
  insert_wanted_job_one(
    """the row to be inserted"""
    object: wanted_job_insert_input!

    """upsert condition"""
    on_conflict: wanted_job_on_conflict
  ): wanted_job

  """
  update data of the table: "account"
  """
  update_account(
    """sets the columns of the filtered rows to the given values"""
    _set: account_set_input

    """filter the rows which have to be updated"""
    where: account_bool_exp!
  ): account_mutation_response

  """
  update single row of the table: "account"
  """
  update_account_by_pk(
    """sets the columns of the filtered rows to the given values"""
    _set: account_set_input
    pk_columns: account_pk_columns_input!
  ): account

  """
  update multiples rows of table: "account"
  """
  update_account_many(
    """updates to execute, in order"""
    updates: [account_updates!]!
  ): [account_mutation_response]

  """
  update data of the table: "admin_cdb"
  """
  update_admin_cdb(
    """sets the columns of the filtered rows to the given values"""
    _set: admin_cdb_set_input

    """filter the rows which have to be updated"""
    where: admin_cdb_bool_exp!
  ): admin_cdb_mutation_response

  """
  update single row of the table: "admin_cdb"
  """
  update_admin_cdb_by_pk(
    """sets the columns of the filtered rows to the given values"""
    _set: admin_cdb_set_input
    pk_columns: admin_cdb_pk_columns_input!
  ): admin_cdb

  """
  update multiples rows of table: "admin_cdb"
  """
  update_admin_cdb_many(
    """updates to execute, in order"""
    updates: [admin_cdb_updates!]!
  ): [admin_cdb_mutation_response]

  """
  update data of the table: "admin_structure"
  """
  update_admin_structure(
    """sets the columns of the filtered rows to the given values"""
    _set: admin_structure_set_input

    """filter the rows which have to be updated"""
    where: admin_structure_bool_exp!
  ): admin_structure_mutation_response

  """
  update single row of the table: "admin_structure"
  """
  update_admin_structure_by_pk(
    """sets the columns of the filtered rows to the given values"""
    _set: admin_structure_set_input
    pk_columns: admin_structure_pk_columns_input!
  ): admin_structure

  """
  update multiples rows of table: "admin_structure"
  """
  update_admin_structure_many(
    """updates to execute, in order"""
    updates: [admin_structure_updates!]!
  ): [admin_structure_mutation_response]

  """
  update data of the table: "admin_structure_structure"
  """
  update_admin_structure_structure(
    """sets the columns of the filtered rows to the given values"""
    _set: admin_structure_structure_set_input

    """filter the rows which have to be updated"""
    where: admin_structure_structure_bool_exp!
  ): admin_structure_structure_mutation_response

  """
  update single row of the table: "admin_structure_structure"
  """
  update_admin_structure_structure_by_pk(
    """sets the columns of the filtered rows to the given values"""
    _set: admin_structure_structure_set_input
    pk_columns: admin_structure_structure_pk_columns_input!
  ): admin_structure_structure

  """
  update multiples rows of table: "admin_structure_structure"
  """
  update_admin_structure_structure_many(
    """updates to execute, in order"""
    updates: [admin_structure_structure_updates!]!
  ): [admin_structure_structure_mutation_response]

  """
  update data of the table: "beneficiary"
  """
  update_beneficiary(
    """sets the columns of the filtered rows to the given values"""
    _set: beneficiary_set_input

    """filter the rows which have to be updated"""
    where: beneficiary_bool_exp!
  ): beneficiary_mutation_response

  """
  update single row of the table: "beneficiary"
  """
  update_beneficiary_by_pk(
    """sets the columns of the filtered rows to the given values"""
    _set: beneficiary_set_input
    pk_columns: beneficiary_pk_columns_input!
  ): beneficiary

  """
  update multiples rows of table: "beneficiary"
  """
  update_beneficiary_many(
    """updates to execute, in order"""
    updates: [beneficiary_updates!]!
  ): [beneficiary_mutation_response]

  """
  update data of the table: "beneficiary_structure"
  """
  update_beneficiary_structure(
    """append existing jsonb value of filtered columns with new jsonb value"""
    _append: beneficiary_structure_append_input

    """
    delete the field or element with specified path (for JSON arrays, negative integers count from the end)
    """
    _delete_at_path: beneficiary_structure_delete_at_path_input

    """
    delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array
    """
    _delete_elem: beneficiary_structure_delete_elem_input

    """
    delete key/value pair or string element. key/value pairs are matched based on their key value
    """
    _delete_key: beneficiary_structure_delete_key_input

    """prepend existing jsonb value of filtered columns with new jsonb value"""
    _prepend: beneficiary_structure_prepend_input

    """sets the columns of the filtered rows to the given values"""
    _set: beneficiary_structure_set_input

    """filter the rows which have to be updated"""
    where: beneficiary_structure_bool_exp!
  ): beneficiary_structure_mutation_response

  """
  update single row of the table: "beneficiary_structure"
  """
  update_beneficiary_structure_by_pk(
    """append existing jsonb value of filtered columns with new jsonb value"""
    _append: beneficiary_structure_append_input

    """
    delete the field or element with specified path (for JSON arrays, negative integers count from the end)
    """
    _delete_at_path: beneficiary_structure_delete_at_path_input

    """
    delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array
    """
    _delete_elem: beneficiary_structure_delete_elem_input

    """
    delete key/value pair or string element. key/value pairs are matched based on their key value
    """
    _delete_key: beneficiary_structure_delete_key_input

    """prepend existing jsonb value of filtered columns with new jsonb value"""
    _prepend: beneficiary_structure_prepend_input

    """sets the columns of the filtered rows to the given values"""
    _set: beneficiary_structure_set_input
    pk_columns: beneficiary_structure_pk_columns_input!
  ): beneficiary_structure

  """
  update multiples rows of table: "beneficiary_structure"
  """
  update_beneficiary_structure_many(
    """updates to execute, in order"""
    updates: [beneficiary_structure_updates!]!
  ): [beneficiary_structure_mutation_response]

  """
  update data of the table: "deployment"
  """
  update_deployment(
    """append existing jsonb value of filtered columns with new jsonb value"""
    _append: deployment_append_input

    """
    delete the field or element with specified path (for JSON arrays, negative integers count from the end)
    """
    _delete_at_path: deployment_delete_at_path_input

    """
    delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array
    """
    _delete_elem: deployment_delete_elem_input

    """
    delete key/value pair or string element. key/value pairs are matched based on their key value
    """
    _delete_key: deployment_delete_key_input

    """prepend existing jsonb value of filtered columns with new jsonb value"""
    _prepend: deployment_prepend_input

    """sets the columns of the filtered rows to the given values"""
    _set: deployment_set_input

    """filter the rows which have to be updated"""
    where: deployment_bool_exp!
  ): deployment_mutation_response

  """
  update single row of the table: "deployment"
  """
  update_deployment_by_pk(
    """append existing jsonb value of filtered columns with new jsonb value"""
    _append: deployment_append_input

    """
    delete the field or element with specified path (for JSON arrays, negative integers count from the end)
    """
    _delete_at_path: deployment_delete_at_path_input

    """
    delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array
    """
    _delete_elem: deployment_delete_elem_input

    """
    delete key/value pair or string element. key/value pairs are matched based on their key value
    """
    _delete_key: deployment_delete_key_input

    """prepend existing jsonb value of filtered columns with new jsonb value"""
    _prepend: deployment_prepend_input

    """sets the columns of the filtered rows to the given values"""
    _set: deployment_set_input
    pk_columns: deployment_pk_columns_input!
  ): deployment

  """
  update multiples rows of table: "deployment"
  """
  update_deployment_many(
    """updates to execute, in order"""
    updates: [deployment_updates!]!
  ): [deployment_mutation_response]

  """
  update data of the table: "external_data"
  """
  update_external_data(
    """append existing jsonb value of filtered columns with new jsonb value"""
    _append: external_data_append_input

    """
    delete the field or element with specified path (for JSON arrays, negative integers count from the end)
    """
    _delete_at_path: external_data_delete_at_path_input

    """
    delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array
    """
    _delete_elem: external_data_delete_elem_input

    """
    delete key/value pair or string element. key/value pairs are matched based on their key value
    """
    _delete_key: external_data_delete_key_input

    """prepend existing jsonb value of filtered columns with new jsonb value"""
    _prepend: external_data_prepend_input

    """sets the columns of the filtered rows to the given values"""
    _set: external_data_set_input

    """filter the rows which have to be updated"""
    where: external_data_bool_exp!
  ): external_data_mutation_response

  """
  update single row of the table: "external_data"
  """
  update_external_data_by_pk(
    """append existing jsonb value of filtered columns with new jsonb value"""
    _append: external_data_append_input

    """
    delete the field or element with specified path (for JSON arrays, negative integers count from the end)
    """
    _delete_at_path: external_data_delete_at_path_input

    """
    delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array
    """
    _delete_elem: external_data_delete_elem_input

    """
    delete key/value pair or string element. key/value pairs are matched based on their key value
    """
    _delete_key: external_data_delete_key_input

    """prepend existing jsonb value of filtered columns with new jsonb value"""
    _prepend: external_data_prepend_input

    """sets the columns of the filtered rows to the given values"""
    _set: external_data_set_input
    pk_columns: external_data_pk_columns_input!
  ): external_data

  """
  update data of the table: "external_data_info"
  """
  update_external_data_info(
    """sets the columns of the filtered rows to the given values"""
    _set: external_data_info_set_input

    """filter the rows which have to be updated"""
    where: external_data_info_bool_exp!
  ): external_data_info_mutation_response

  """
  update single row of the table: "external_data_info"
  """
  update_external_data_info_by_pk(
    """sets the columns of the filtered rows to the given values"""
    _set: external_data_info_set_input
    pk_columns: external_data_info_pk_columns_input!
  ): external_data_info

  """
  update multiples rows of table: "external_data_info"
  """
  update_external_data_info_many(
    """updates to execute, in order"""
    updates: [external_data_info_updates!]!
  ): [external_data_info_mutation_response]

  """
  update multiples rows of table: "external_data"
  """
  update_external_data_many(
    """updates to execute, in order"""
    updates: [external_data_updates!]!
  ): [external_data_mutation_response]

  """
  update data of the table: "external_source"
  """
  update_external_source(
    """sets the columns of the filtered rows to the given values"""
    _set: external_source_set_input

    """filter the rows which have to be updated"""
    where: external_source_bool_exp!
  ): external_source_mutation_response

  """
  update single row of the table: "external_source"
  """
  update_external_source_by_pk(
    """sets the columns of the filtered rows to the given values"""
    _set: external_source_set_input
    pk_columns: external_source_pk_columns_input!
  ): external_source

  """
  update multiples rows of table: "external_source"
  """
  update_external_source_many(
    """updates to execute, in order"""
    updates: [external_source_updates!]!
  ): [external_source_mutation_response]

  """
  update data of the table: "manager"
  """
  update_manager(
    """sets the columns of the filtered rows to the given values"""
    _set: manager_set_input

    """filter the rows which have to be updated"""
    where: manager_bool_exp!
  ): manager_mutation_response

  """
  update single row of the table: "manager"
  """
  update_manager_by_pk(
    """sets the columns of the filtered rows to the given values"""
    _set: manager_set_input
    pk_columns: manager_pk_columns_input!
  ): manager

  """
  update multiples rows of table: "manager"
  """
  update_manager_many(
    """updates to execute, in order"""
    updates: [manager_updates!]!
  ): [manager_mutation_response]

  """
  update data of the table: "notebook"
  """
  update_notebook(
    """sets the columns of the filtered rows to the given values"""
    _set: notebook_set_input

    """filter the rows which have to be updated"""
    where: notebook_bool_exp!
  ): notebook_mutation_response

  """
  update data of the table: "notebook_action"
  """
  update_notebook_action(
    """sets the columns of the filtered rows to the given values"""
    _set: notebook_action_set_input

    """filter the rows which have to be updated"""
    where: notebook_action_bool_exp!
  ): notebook_action_mutation_response

  """
  update single row of the table: "notebook_action"
  """
  update_notebook_action_by_pk(
    """sets the columns of the filtered rows to the given values"""
    _set: notebook_action_set_input
    pk_columns: notebook_action_pk_columns_input!
  ): notebook_action

  """
  update multiples rows of table: "notebook_action"
  """
  update_notebook_action_many(
    """updates to execute, in order"""
    updates: [notebook_action_updates!]!
  ): [notebook_action_mutation_response]

  """
  update data of the table: "notebook_appointment"
  """
  update_notebook_appointment(
    """sets the columns of the filtered rows to the given values"""
    _set: notebook_appointment_set_input

    """filter the rows which have to be updated"""
    where: notebook_appointment_bool_exp!
  ): notebook_appointment_mutation_response

  """
  update single row of the table: "notebook_appointment"
  """
  update_notebook_appointment_by_pk(
    """sets the columns of the filtered rows to the given values"""
    _set: notebook_appointment_set_input
    pk_columns: notebook_appointment_pk_columns_input!
  ): notebook_appointment

  """
  update multiples rows of table: "notebook_appointment"
  """
  update_notebook_appointment_many(
    """updates to execute, in order"""
    updates: [notebook_appointment_updates!]!
  ): [notebook_appointment_mutation_response]

  """
  update single row of the table: "notebook"
  """
  update_notebook_by_pk(
    """sets the columns of the filtered rows to the given values"""
    _set: notebook_set_input
    pk_columns: notebook_pk_columns_input!
  ): notebook

  """
  update data of the table: "notebook_event"
  """
  update_notebook_event(
    """append existing jsonb value of filtered columns with new jsonb value"""
    _append: notebook_event_append_input

    """
    delete the field or element with specified path (for JSON arrays, negative integers count from the end)
    """
    _delete_at_path: notebook_event_delete_at_path_input

    """
    delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array
    """
    _delete_elem: notebook_event_delete_elem_input

    """
    delete key/value pair or string element. key/value pairs are matched based on their key value
    """
    _delete_key: notebook_event_delete_key_input

    """prepend existing jsonb value of filtered columns with new jsonb value"""
    _prepend: notebook_event_prepend_input

    """sets the columns of the filtered rows to the given values"""
    _set: notebook_event_set_input

    """filter the rows which have to be updated"""
    where: notebook_event_bool_exp!
  ): notebook_event_mutation_response

  """
  update single row of the table: "notebook_event"
  """
  update_notebook_event_by_pk(
    """append existing jsonb value of filtered columns with new jsonb value"""
    _append: notebook_event_append_input

    """
    delete the field or element with specified path (for JSON arrays, negative integers count from the end)
    """
    _delete_at_path: notebook_event_delete_at_path_input

    """
    delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array
    """
    _delete_elem: notebook_event_delete_elem_input

    """
    delete key/value pair or string element. key/value pairs are matched based on their key value
    """
    _delete_key: notebook_event_delete_key_input

    """prepend existing jsonb value of filtered columns with new jsonb value"""
    _prepend: notebook_event_prepend_input

    """sets the columns of the filtered rows to the given values"""
    _set: notebook_event_set_input
    pk_columns: notebook_event_pk_columns_input!
  ): notebook_event

  """
  update multiples rows of table: "notebook_event"
  """
  update_notebook_event_many(
    """updates to execute, in order"""
    updates: [notebook_event_updates!]!
  ): [notebook_event_mutation_response]

  """
  update data of the table: "notebook_event_type"
  """
  update_notebook_event_type(
    """sets the columns of the filtered rows to the given values"""
    _set: notebook_event_type_set_input

    """filter the rows which have to be updated"""
    where: notebook_event_type_bool_exp!
  ): notebook_event_type_mutation_response

  """
  update single row of the table: "notebook_event_type"
  """
  update_notebook_event_type_by_pk(
    """sets the columns of the filtered rows to the given values"""
    _set: notebook_event_type_set_input
    pk_columns: notebook_event_type_pk_columns_input!
  ): notebook_event_type

  """
  update multiples rows of table: "notebook_event_type"
  """
  update_notebook_event_type_many(
    """updates to execute, in order"""
    updates: [notebook_event_type_updates!]!
  ): [notebook_event_type_mutation_response]

  """
  update data of the table: "notebook_focus"
  """
  update_notebook_focus(
    """append existing jsonb value of filtered columns with new jsonb value"""
    _append: notebook_focus_append_input

    """
    delete the field or element with specified path (for JSON arrays, negative integers count from the end)
    """
    _delete_at_path: notebook_focus_delete_at_path_input

    """
    delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array
    """
    _delete_elem: notebook_focus_delete_elem_input

    """
    delete key/value pair or string element. key/value pairs are matched based on their key value
    """
    _delete_key: notebook_focus_delete_key_input

    """prepend existing jsonb value of filtered columns with new jsonb value"""
    _prepend: notebook_focus_prepend_input

    """sets the columns of the filtered rows to the given values"""
    _set: notebook_focus_set_input

    """filter the rows which have to be updated"""
    where: notebook_focus_bool_exp!
  ): notebook_focus_mutation_response

  """
  update single row of the table: "notebook_focus"
  """
  update_notebook_focus_by_pk(
    """append existing jsonb value of filtered columns with new jsonb value"""
    _append: notebook_focus_append_input

    """
    delete the field or element with specified path (for JSON arrays, negative integers count from the end)
    """
    _delete_at_path: notebook_focus_delete_at_path_input

    """
    delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array
    """
    _delete_elem: notebook_focus_delete_elem_input

    """
    delete key/value pair or string element. key/value pairs are matched based on their key value
    """
    _delete_key: notebook_focus_delete_key_input

    """prepend existing jsonb value of filtered columns with new jsonb value"""
    _prepend: notebook_focus_prepend_input

    """sets the columns of the filtered rows to the given values"""
    _set: notebook_focus_set_input
    pk_columns: notebook_focus_pk_columns_input!
  ): notebook_focus

  """
  update multiples rows of table: "notebook_focus"
  """
  update_notebook_focus_many(
    """updates to execute, in order"""
    updates: [notebook_focus_updates!]!
  ): [notebook_focus_mutation_response]

  """
  update data of the table: "notebook_info"
  """
  update_notebook_info(
    """sets the columns of the filtered rows to the given values"""
    _set: notebook_info_set_input

    """filter the rows which have to be updated"""
    where: notebook_info_bool_exp!
  ): notebook_info_mutation_response

  """
  update single row of the table: "notebook_info"
  """
  update_notebook_info_by_pk(
    """sets the columns of the filtered rows to the given values"""
    _set: notebook_info_set_input
    pk_columns: notebook_info_pk_columns_input!
  ): notebook_info

  """
  update multiples rows of table: "notebook_info"
  """
  update_notebook_info_many(
    """updates to execute, in order"""
    updates: [notebook_info_updates!]!
  ): [notebook_info_mutation_response]

  """
  update multiples rows of table: "notebook"
  """
  update_notebook_many(
    """updates to execute, in order"""
    updates: [notebook_updates!]!
  ): [notebook_mutation_response]

  """
  update data of the table: "notebook_member"
  """
  update_notebook_member(
    """sets the columns of the filtered rows to the given values"""
    _set: notebook_member_set_input

    """filter the rows which have to be updated"""
    where: notebook_member_bool_exp!
  ): notebook_member_mutation_response

  """
  update single row of the table: "notebook_member"
  """
  update_notebook_member_by_pk(
    """sets the columns of the filtered rows to the given values"""
    _set: notebook_member_set_input
    pk_columns: notebook_member_pk_columns_input!
  ): notebook_member

  """
  update multiples rows of table: "notebook_member"
  """
  update_notebook_member_many(
    """updates to execute, in order"""
    updates: [notebook_member_updates!]!
  ): [notebook_member_mutation_response]

  """
  update data of the table: "notebook_public_view"
  """
  update_notebook_public_view(
    """sets the columns of the filtered rows to the given values"""
    _set: notebook_public_view_set_input

    """filter the rows which have to be updated"""
    where: notebook_public_view_bool_exp!
  ): notebook_public_view_mutation_response

  """
  update multiples rows of table: "notebook_public_view"
  """
  update_notebook_public_view_many(
    """updates to execute, in order"""
    updates: [notebook_public_view_updates!]!
  ): [notebook_public_view_mutation_response]

  """
  update data of the table: "notebook_target"
  """
  update_notebook_target(
    """sets the columns of the filtered rows to the given values"""
    _set: notebook_target_set_input

    """filter the rows which have to be updated"""
    where: notebook_target_bool_exp!
  ): notebook_target_mutation_response

  """
  update single row of the table: "notebook_target"
  """
  update_notebook_target_by_pk(
    """sets the columns of the filtered rows to the given values"""
    _set: notebook_target_set_input
    pk_columns: notebook_target_pk_columns_input!
  ): notebook_target

  """
  update multiples rows of table: "notebook_target"
  """
  update_notebook_target_many(
    """updates to execute, in order"""
    updates: [notebook_target_updates!]!
  ): [notebook_target_mutation_response]

  """
  update data of the table: "orientation_manager"
  """
  update_orientation_manager(
    """sets the columns of the filtered rows to the given values"""
    _set: orientation_manager_set_input

    """filter the rows which have to be updated"""
    where: orientation_manager_bool_exp!
  ): orientation_manager_mutation_response

  """
  update single row of the table: "orientation_manager"
  """
  update_orientation_manager_by_pk(
    """sets the columns of the filtered rows to the given values"""
    _set: orientation_manager_set_input
    pk_columns: orientation_manager_pk_columns_input!
  ): orientation_manager

  """
  update multiples rows of table: "orientation_manager"
  """
  update_orientation_manager_many(
    """updates to execute, in order"""
    updates: [orientation_manager_updates!]!
  ): [orientation_manager_mutation_response]

  """
  update data of the table: "orientation_request"
  """
  update_orientation_request(
    """sets the columns of the filtered rows to the given values"""
    _set: orientation_request_set_input

    """filter the rows which have to be updated"""
    where: orientation_request_bool_exp!
  ): orientation_request_mutation_response

  """
  update single row of the table: "orientation_request"
  """
  update_orientation_request_by_pk(
    """sets the columns of the filtered rows to the given values"""
    _set: orientation_request_set_input
    pk_columns: orientation_request_pk_columns_input!
  ): orientation_request

  """
  update multiples rows of table: "orientation_request"
  """
  update_orientation_request_many(
    """updates to execute, in order"""
    updates: [orientation_request_updates!]!
  ): [orientation_request_mutation_response]

  """
  update data of the table: "orientation_type"
  """
  update_orientation_type(
    """sets the columns of the filtered rows to the given values"""
    _set: orientation_type_set_input

    """filter the rows which have to be updated"""
    where: orientation_type_bool_exp!
  ): orientation_type_mutation_response

  """
  update single row of the table: "orientation_type"
  """
  update_orientation_type_by_pk(
    """sets the columns of the filtered rows to the given values"""
    _set: orientation_type_set_input
    pk_columns: orientation_type_pk_columns_input!
  ): orientation_type

  """
  update multiples rows of table: "orientation_type"
  """
  update_orientation_type_many(
    """updates to execute, in order"""
    updates: [orientation_type_updates!]!
  ): [orientation_type_mutation_response]

  """
  update data of the table: "professional"
  """
  update_professional(
    """sets the columns of the filtered rows to the given values"""
    _set: professional_set_input

    """filter the rows which have to be updated"""
    where: professional_bool_exp!
  ): professional_mutation_response

  """
  update single row of the table: "professional"
  """
  update_professional_by_pk(
    """sets the columns of the filtered rows to the given values"""
    _set: professional_set_input
    pk_columns: professional_pk_columns_input!
  ): professional

  """
  update multiples rows of table: "professional"
  """
  update_professional_many(
    """updates to execute, in order"""
    updates: [professional_updates!]!
  ): [professional_mutation_response]

  """
  update data of the table: "ref_action"
  """
  update_ref_action(
    """sets the columns of the filtered rows to the given values"""
    _set: ref_action_set_input

    """filter the rows which have to be updated"""
    where: ref_action_bool_exp!
  ): ref_action_mutation_response

  """
  update single row of the table: "ref_action"
  """
  update_ref_action_by_pk(
    """sets the columns of the filtered rows to the given values"""
    _set: ref_action_set_input
    pk_columns: ref_action_pk_columns_input!
  ): ref_action

  """
  update multiples rows of table: "ref_action"
  """
  update_ref_action_many(
    """updates to execute, in order"""
    updates: [ref_action_updates!]!
  ): [ref_action_mutation_response]

  """
  update data of the table: "ref_situation"
  """
  update_ref_situation(
    """sets the columns of the filtered rows to the given values"""
    _set: ref_situation_set_input

    """filter the rows which have to be updated"""
    where: ref_situation_bool_exp!
  ): ref_situation_mutation_response

  """
  update single row of the table: "ref_situation"
  """
  update_ref_situation_by_pk(
    """sets the columns of the filtered rows to the given values"""
    _set: ref_situation_set_input
    pk_columns: ref_situation_pk_columns_input!
  ): ref_situation

  """
  update multiples rows of table: "ref_situation"
  """
  update_ref_situation_many(
    """updates to execute, in order"""
    updates: [ref_situation_updates!]!
  ): [ref_situation_mutation_response]

  """
  update data of the table: "ref_target"
  """
  update_ref_target(
    """sets the columns of the filtered rows to the given values"""
    _set: ref_target_set_input

    """filter the rows which have to be updated"""
    where: ref_target_bool_exp!
  ): ref_target_mutation_response

  """
  update single row of the table: "ref_target"
  """
  update_ref_target_by_pk(
    """sets the columns of the filtered rows to the given values"""
    _set: ref_target_set_input
    pk_columns: ref_target_pk_columns_input!
  ): ref_target

  """
  update multiples rows of table: "ref_target"
  """
  update_ref_target_many(
    """updates to execute, in order"""
    updates: [ref_target_updates!]!
  ): [ref_target_mutation_response]

  """
  update data of the table: "role"
  """
  update_role(
    """sets the columns of the filtered rows to the given values"""
    _set: role_set_input

    """filter the rows which have to be updated"""
    where: role_bool_exp!
  ): role_mutation_response

  """
  update single row of the table: "role"
  """
  update_role_by_pk(
    """sets the columns of the filtered rows to the given values"""
    _set: role_set_input
    pk_columns: role_pk_columns_input!
  ): role

  """
  update multiples rows of table: "role"
  """
  update_role_many(
    """updates to execute, in order"""
    updates: [role_updates!]!
  ): [role_mutation_response]

  """
  update data of the table: "rome_code"
  """
  update_rome_code(
    """sets the columns of the filtered rows to the given values"""
    _set: rome_code_set_input

    """filter the rows which have to be updated"""
    where: rome_code_bool_exp!
  ): rome_code_mutation_response

  """
  update single row of the table: "rome_code"
  """
  update_rome_code_by_pk(
    """sets the columns of the filtered rows to the given values"""
    _set: rome_code_set_input
    pk_columns: rome_code_pk_columns_input!
  ): rome_code

  """
  update multiples rows of table: "rome_code"
  """
  update_rome_code_many(
    """updates to execute, in order"""
    updates: [rome_code_updates!]!
  ): [rome_code_mutation_response]

  """
  update data of the table: "structure"
  """
  update_structure(
    """sets the columns of the filtered rows to the given values"""
    _set: structure_set_input

    """filter the rows which have to be updated"""
    where: structure_bool_exp!
  ): structure_mutation_response

  """
  update single row of the table: "structure"
  """
  update_structure_by_pk(
    """sets the columns of the filtered rows to the given values"""
    _set: structure_set_input
    pk_columns: structure_pk_columns_input!
  ): structure

  """
  update multiples rows of table: "structure"
  """
  update_structure_many(
    """updates to execute, in order"""
    updates: [structure_updates!]!
  ): [structure_mutation_response]

  """
  update data of the table: "wanted_job"
  """
  update_wanted_job(
    """sets the columns of the filtered rows to the given values"""
    _set: wanted_job_set_input

    """filter the rows which have to be updated"""
    where: wanted_job_bool_exp!
  ): wanted_job_mutation_response

  """
  update single row of the table: "wanted_job"
  """
  update_wanted_job_by_pk(
    """sets the columns of the filtered rows to the given values"""
    _set: wanted_job_set_input
    pk_columns: wanted_job_pk_columns_input!
  ): wanted_job

  """
  update multiples rows of table: "wanted_job"
  """
  update_wanted_job_many(
    """updates to execute, in order"""
    updates: [wanted_job_updates!]!
  ): [wanted_job_mutation_response]
}

"""
columns and relationships of "notebook"
"""
type notebook {
  """An array relationship"""
  appointments(
    """distinct select on columns"""
    distinct_on: [notebook_appointment_select_column!]

    """limit the number of rows returned"""
    limit: Int

    """skip the first n rows. Use only with order_by"""
    offset: Int

    """sort the rows by one or more columns"""
    order_by: [notebook_appointment_order_by!]

    """filter the rows returned"""
    where: notebook_appointment_bool_exp
  ): [notebook_appointment!]!

  """An aggregate relationship"""
  appointments_aggregate(
    """distinct select on columns"""
    distinct_on: [notebook_appointment_select_column!]

    """limit the number of rows returned"""
    limit: Int

    """skip the first n rows. Use only with order_by"""
    offset: Int

    """sort the rows by one or more columns"""
    order_by: [notebook_appointment_order_by!]

    """filter the rows returned"""
    where: notebook_appointment_bool_exp
  ): notebook_appointment_aggregate!

  """An object relationship"""
  beneficiary: beneficiary!
  beneficiaryId: uuid!
  contractEndDate: date
  contractSignDate: date
  contractStartDate: date
  contractType: String
  createdAt: timestamptz!
  educationLevel: String

  """An array relationship"""
  events(
    """distinct select on columns"""
    distinct_on: [notebook_event_select_column!]

    """limit the number of rows returned"""
    limit: Int

    """skip the first n rows. Use only with order_by"""
    offset: Int

    """sort the rows by one or more columns"""
    order_by: [notebook_event_order_by!]

    """filter the rows returned"""
    where: notebook_event_bool_exp
  ): [notebook_event!]!

  """An aggregate relationship"""
  events_aggregate(
    """distinct select on columns"""
    distinct_on: [notebook_event_select_column!]

    """limit the number of rows returned"""
    limit: Int

    """skip the first n rows. Use only with order_by"""
    offset: Int

    """sort the rows by one or more columns"""
    order_by: [notebook_event_order_by!]

    """filter the rows returned"""
    where: notebook_event_bool_exp
  ): notebook_event_aggregate!

  """An array relationship"""
  focuses(
    """distinct select on columns"""
    distinct_on: [notebook_focus_select_column!]

    """limit the number of rows returned"""
    limit: Int

    """skip the first n rows. Use only with order_by"""
    offset: Int

    """sort the rows by one or more columns"""
    order_by: [notebook_focus_order_by!]

    """filter the rows returned"""
    where: notebook_focus_bool_exp
  ): [notebook_focus!]!

  """An aggregate relationship"""
  focuses_aggregate(
    """distinct select on columns"""
    distinct_on: [notebook_focus_select_column!]

    """limit the number of rows returned"""
    limit: Int

    """skip the first n rows. Use only with order_by"""
    offset: Int

    """sort the rows by one or more columns"""
    order_by: [notebook_focus_order_by!]

    """filter the rows returned"""
    where: notebook_focus_bool_exp
  ): notebook_focus_aggregate!
  geographicalArea: String
  id: uuid!

  """An array relationship"""
  members(
    """distinct select on columns"""
    distinct_on: [notebook_member_select_column!]

    """limit the number of rows returned"""
    limit: Int

    """skip the first n rows. Use only with order_by"""
    offset: Int

    """sort the rows by one or more columns"""
    order_by: [notebook_member_order_by!]

    """filter the rows returned"""
    where: notebook_member_bool_exp
  ): [notebook_member!]!

  """An aggregate relationship"""
  members_aggregate(
    """distinct select on columns"""
    distinct_on: [notebook_member_select_column!]

    """limit the number of rows returned"""
    limit: Int

    """skip the first n rows. Use only with order_by"""
    offset: Int

    """sort the rows by one or more columns"""
    order_by: [notebook_member_order_by!]

    """filter the rows returned"""
    where: notebook_member_bool_exp
  ): notebook_member_aggregate!

  """An object relationship"""
  notebookInfo: notebook_info

  """return the number of professionnal for a notebook"""
  notebookMemberCount: bigint
  rightAre: Boolean!
  rightAss: Boolean
  rightBonus: Boolean!
  rightRqth: Boolean!
  rightRsa: String
  updatedAt: timestamptz!

  """An array relationship"""
  wantedJobs(
    """distinct select on columns"""
    distinct_on: [wanted_job_select_column!]

    """limit the number of rows returned"""
    limit: Int

    """skip the first n rows. Use only with order_by"""
    offset: Int

    """sort the rows by one or more columns"""
    order_by: [wanted_job_order_by!]

    """filter the rows returned"""
    where: wanted_job_bool_exp
  ): [wanted_job!]!

  """An aggregate relationship"""
  wantedJobs_aggregate(
    """distinct select on columns"""
    distinct_on: [wanted_job_select_column!]

    """limit the number of rows returned"""
    limit: Int

    """skip the first n rows. Use only with order_by"""
    offset: Int

    """sort the rows by one or more columns"""
    order_by: [wanted_job_order_by!]

    """filter the rows returned"""
    where: wanted_job_bool_exp
  ): wanted_job_aggregate!
  workSituation: String
  workSituationDate: date
  workSituationEndDate: date
}

"""
columns and relationships of "notebook_action"
"""
type notebook_action {
  action: String!
  createdAt: timestamptz!

  """An object relationship"""
  creator: account!
  creatorId: uuid!
  id: uuid!
  initialId: String
  status: String!

  """An object relationship"""
  target: notebook_target!
  targetId: uuid!
  updatedAt: timestamptz!
}

"""
aggregated selection of "notebook_action"
"""
type notebook_action_aggregate {
  aggregate: notebook_action_aggregate_fields
  nodes: [notebook_action!]!
}

input notebook_action_aggregate_bool_exp {
  count: notebook_action_aggregate_bool_exp_count
}

input notebook_action_aggregate_bool_exp_count {
  arguments: [notebook_action_select_column!]
  distinct: Boolean
  filter: notebook_action_bool_exp
  predicate: Int_comparison_exp!
}

"""
aggregate fields of "notebook_action"
"""
type notebook_action_aggregate_fields {
  count(columns: [notebook_action_select_column!], distinct: Boolean): Int!
  max: notebook_action_max_fields
  min: notebook_action_min_fields
}

"""
order by aggregate values of table "notebook_action"
"""
input notebook_action_aggregate_order_by {
  count: order_by
  max: notebook_action_max_order_by
  min: notebook_action_min_order_by
}

"""
input type for inserting array relation for remote table "notebook_action"
"""
input notebook_action_arr_rel_insert_input {
  data: [notebook_action_insert_input!]!

  """upsert condition"""
  on_conflict: notebook_action_on_conflict
}

"""
Boolean expression to filter rows from the table "notebook_action". All fields are combined with a logical 'AND'.
"""
input notebook_action_bool_exp {
  _and: [notebook_action_bool_exp!]
  _not: notebook_action_bool_exp
  _or: [notebook_action_bool_exp!]
  action: String_comparison_exp
  createdAt: timestamptz_comparison_exp
  creator: account_bool_exp
  creatorId: uuid_comparison_exp
  id: uuid_comparison_exp
  initialId: String_comparison_exp
  status: String_comparison_exp
  target: notebook_target_bool_exp
  targetId: uuid_comparison_exp
  updatedAt: timestamptz_comparison_exp
}

"""
unique or primary key constraints on table "notebook_action"
"""
enum notebook_action_constraint {
  """
  unique or primary key constraint on columns "initial_id"
  """
  notebook_action_initial_id_key

  """
  unique or primary key constraint on columns "id"
  """
  notebook_action_pkey

  """
  unique or primary key constraint on columns "action", "target_id"
  """
  notebook_action_target_id_action_key
}

"""
input type for inserting data into table "notebook_action"
"""
input notebook_action_insert_input {
  action: String
  createdAt: timestamptz
  creator: account_obj_rel_insert_input
  creatorId: uuid
  id: uuid
  initialId: String
  status: String
  target: notebook_target_obj_rel_insert_input
  targetId: uuid
  updatedAt: timestamptz
}

"""aggregate max on columns"""
type notebook_action_max_fields {
  action: String
  createdAt: timestamptz
  creatorId: uuid
  id: uuid
  initialId: String
  status: String
  targetId: uuid
  updatedAt: timestamptz
}

"""
order by max() on columns of table "notebook_action"
"""
input notebook_action_max_order_by {
  action: order_by
  createdAt: order_by
  creatorId: order_by
  id: order_by
  initialId: order_by
  status: order_by
  targetId: order_by
  updatedAt: order_by
}

"""aggregate min on columns"""
type notebook_action_min_fields {
  action: String
  createdAt: timestamptz
  creatorId: uuid
  id: uuid
  initialId: String
  status: String
  targetId: uuid
  updatedAt: timestamptz
}

"""
order by min() on columns of table "notebook_action"
"""
input notebook_action_min_order_by {
  action: order_by
  createdAt: order_by
  creatorId: order_by
  id: order_by
  initialId: order_by
  status: order_by
  targetId: order_by
  updatedAt: order_by
}

"""
response of any mutation on the table "notebook_action"
"""
type notebook_action_mutation_response {
  """number of rows affected by the mutation"""
  affected_rows: Int!

  """data from the rows affected by the mutation"""
  returning: [notebook_action!]!
}

"""
on_conflict condition type for table "notebook_action"
"""
input notebook_action_on_conflict {
  constraint: notebook_action_constraint!
  update_columns: [notebook_action_update_column!]! = []
  where: notebook_action_bool_exp
}

"""Ordering options when selecting data from "notebook_action"."""
input notebook_action_order_by {
  action: order_by
  createdAt: order_by
  creator: account_order_by
  creatorId: order_by
  id: order_by
  initialId: order_by
  status: order_by
  target: notebook_target_order_by
  targetId: order_by
  updatedAt: order_by
}

"""primary key columns input for table: notebook_action"""
input notebook_action_pk_columns_input {
  id: uuid!
}

"""
select columns of table "notebook_action"
"""
enum notebook_action_select_column {
  """column name"""
  action

  """column name"""
  createdAt

  """column name"""
  creatorId

  """column name"""
  id

  """column name"""
  initialId

  """column name"""
  status

  """column name"""
  targetId

  """column name"""
  updatedAt
}

"""
input type for updating data in table "notebook_action"
"""
input notebook_action_set_input {
  action: String
  createdAt: timestamptz
  creatorId: uuid
  id: uuid
  initialId: String
  status: String
  targetId: uuid
  updatedAt: timestamptz
}

"""
Streaming cursor of the table "notebook_action"
"""
input notebook_action_stream_cursor_input {
  """Stream column input with initial value"""
  initial_value: notebook_action_stream_cursor_value_input!

  """cursor ordering"""
  ordering: cursor_ordering
}

"""Initial value of the column from where the streaming should start"""
input notebook_action_stream_cursor_value_input {
  action: String
  createdAt: timestamptz
  creatorId: uuid
  id: uuid
  initialId: String
  status: String
  targetId: uuid
  updatedAt: timestamptz
}

"""
update columns of table "notebook_action"
"""
enum notebook_action_update_column {
  """column name"""
  action

  """column name"""
  createdAt

  """column name"""
  creatorId

  """column name"""
  id

  """column name"""
  initialId

  """column name"""
  status

  """column name"""
  targetId

  """column name"""
  updatedAt
}

input notebook_action_updates {
  """sets the columns of the filtered rows to the given values"""
  _set: notebook_action_set_input
  where: notebook_action_bool_exp!
}

"""
aggregated selection of "notebook"
"""
type notebook_aggregate {
  aggregate: notebook_aggregate_fields
  nodes: [notebook!]!
}

"""
aggregate fields of "notebook"
"""
type notebook_aggregate_fields {
  count(columns: [notebook_select_column!], distinct: Boolean): Int!
  max: notebook_max_fields
  min: notebook_min_fields
}

"""
columns and relationships of "notebook_appointment"
"""
type notebook_appointment {
  """An object relationship"""
  account: account!

  """An object relationship"""
  accountByDeletedBy: account
  created_at: timestamptz
  date: timestamp!
  deleted_at: timestamptz
  deleted_by: uuid
  id: uuid!
  memberAccountId: uuid!

  """An object relationship"""
  notebook: notebook!
  notebookId: uuid!
  status: String!
  updated_at: timestamptz
}

"""
aggregated selection of "notebook_appointment"
"""
type notebook_appointment_aggregate {
  aggregate: notebook_appointment_aggregate_fields
  nodes: [notebook_appointment!]!
}

input notebook_appointment_aggregate_bool_exp {
  count: notebook_appointment_aggregate_bool_exp_count
}

input notebook_appointment_aggregate_bool_exp_count {
  arguments: [notebook_appointment_select_column!]
  distinct: Boolean
  filter: notebook_appointment_bool_exp
  predicate: Int_comparison_exp!
}

"""
aggregate fields of "notebook_appointment"
"""
type notebook_appointment_aggregate_fields {
  count(columns: [notebook_appointment_select_column!], distinct: Boolean): Int!
  max: notebook_appointment_max_fields
  min: notebook_appointment_min_fields
}

"""
order by aggregate values of table "notebook_appointment"
"""
input notebook_appointment_aggregate_order_by {
  count: order_by
  max: notebook_appointment_max_order_by
  min: notebook_appointment_min_order_by
}

"""
input type for inserting array relation for remote table "notebook_appointment"
"""
input notebook_appointment_arr_rel_insert_input {
  data: [notebook_appointment_insert_input!]!

  """upsert condition"""
  on_conflict: notebook_appointment_on_conflict
}

"""
Boolean expression to filter rows from the table "notebook_appointment". All fields are combined with a logical 'AND'.
"""
input notebook_appointment_bool_exp {
  _and: [notebook_appointment_bool_exp!]
  _not: notebook_appointment_bool_exp
  _or: [notebook_appointment_bool_exp!]
  account: account_bool_exp
  accountByDeletedBy: account_bool_exp
  created_at: timestamptz_comparison_exp
  date: timestamp_comparison_exp
  deleted_at: timestamptz_comparison_exp
  deleted_by: uuid_comparison_exp
  id: uuid_comparison_exp
  memberAccountId: uuid_comparison_exp
  notebook: notebook_bool_exp
  notebookId: uuid_comparison_exp
  status: String_comparison_exp
  updated_at: timestamptz_comparison_exp
}

"""
unique or primary key constraints on table "notebook_appointment"
"""
enum notebook_appointment_constraint {
  """
  unique or primary key constraint on columns "id"
  """
  notebook_appointment_pkey
}

"""
input type for inserting data into table "notebook_appointment"
"""
input notebook_appointment_insert_input {
  account: account_obj_rel_insert_input
  accountByDeletedBy: account_obj_rel_insert_input
  created_at: timestamptz
  date: timestamp
  deleted_at: timestamptz
  deleted_by: uuid
  id: uuid
  memberAccountId: uuid
  notebook: notebook_obj_rel_insert_input
  notebookId: uuid
  status: String
  updated_at: timestamptz
}

"""aggregate max on columns"""
type notebook_appointment_max_fields {
  created_at: timestamptz
  date: timestamp
  deleted_at: timestamptz
  deleted_by: uuid
  id: uuid
  memberAccountId: uuid
  notebookId: uuid
  status: String
  updated_at: timestamptz
}

"""
order by max() on columns of table "notebook_appointment"
"""
input notebook_appointment_max_order_by {
  created_at: order_by
  date: order_by
  deleted_at: order_by
  deleted_by: order_by
  id: order_by
  memberAccountId: order_by
  notebookId: order_by
  status: order_by
  updated_at: order_by
}

"""aggregate min on columns"""
type notebook_appointment_min_fields {
  created_at: timestamptz
  date: timestamp
  deleted_at: timestamptz
  deleted_by: uuid
  id: uuid
  memberAccountId: uuid
  notebookId: uuid
  status: String
  updated_at: timestamptz
}

"""
order by min() on columns of table "notebook_appointment"
"""
input notebook_appointment_min_order_by {
  created_at: order_by
  date: order_by
  deleted_at: order_by
  deleted_by: order_by
  id: order_by
  memberAccountId: order_by
  notebookId: order_by
  status: order_by
  updated_at: order_by
}

"""
response of any mutation on the table "notebook_appointment"
"""
type notebook_appointment_mutation_response {
  """number of rows affected by the mutation"""
  affected_rows: Int!

  """data from the rows affected by the mutation"""
  returning: [notebook_appointment!]!
}

"""
on_conflict condition type for table "notebook_appointment"
"""
input notebook_appointment_on_conflict {
  constraint: notebook_appointment_constraint!
  update_columns: [notebook_appointment_update_column!]! = []
  where: notebook_appointment_bool_exp
}

"""Ordering options when selecting data from "notebook_appointment"."""
input notebook_appointment_order_by {
  account: account_order_by
  accountByDeletedBy: account_order_by
  created_at: order_by
  date: order_by
  deleted_at: order_by
  deleted_by: order_by
  id: order_by
  memberAccountId: order_by
  notebook: notebook_order_by
  notebookId: order_by
  status: order_by
  updated_at: order_by
}

"""primary key columns input for table: notebook_appointment"""
input notebook_appointment_pk_columns_input {
  id: uuid!
}

"""
select columns of table "notebook_appointment"
"""
enum notebook_appointment_select_column {
  """column name"""
  created_at

  """column name"""
  date

  """column name"""
  deleted_at

  """column name"""
  deleted_by

  """column name"""
  id

  """column name"""
  memberAccountId

  """column name"""
  notebookId

  """column name"""
  status

  """column name"""
  updated_at
}

"""
input type for updating data in table "notebook_appointment"
"""
input notebook_appointment_set_input {
  created_at: timestamptz
  date: timestamp
  deleted_at: timestamptz
  deleted_by: uuid
  id: uuid
  memberAccountId: uuid
  notebookId: uuid
  status: String
  updated_at: timestamptz
}

"""
Streaming cursor of the table "notebook_appointment"
"""
input notebook_appointment_stream_cursor_input {
  """Stream column input with initial value"""
  initial_value: notebook_appointment_stream_cursor_value_input!

  """cursor ordering"""
  ordering: cursor_ordering
}

"""Initial value of the column from where the streaming should start"""
input notebook_appointment_stream_cursor_value_input {
  created_at: timestamptz
  date: timestamp
  deleted_at: timestamptz
  deleted_by: uuid
  id: uuid
  memberAccountId: uuid
  notebookId: uuid
  status: String
  updated_at: timestamptz
}

"""
update columns of table "notebook_appointment"
"""
enum notebook_appointment_update_column {
  """column name"""
  created_at

  """column name"""
  date

  """column name"""
  deleted_at

  """column name"""
  deleted_by

  """column name"""
  id

  """column name"""
  memberAccountId

  """column name"""
  notebookId

  """column name"""
  status

  """column name"""
  updated_at
}

input notebook_appointment_updates {
  """sets the columns of the filtered rows to the given values"""
  _set: notebook_appointment_set_input
  where: notebook_appointment_bool_exp!
}

"""
Boolean expression to filter rows from the table "notebook". All fields are combined with a logical 'AND'.
"""
input notebook_bool_exp {
  _and: [notebook_bool_exp!]
  _not: notebook_bool_exp
  _or: [notebook_bool_exp!]
  appointments: notebook_appointment_bool_exp
  appointments_aggregate: notebook_appointment_aggregate_bool_exp
  beneficiary: beneficiary_bool_exp
  beneficiaryId: uuid_comparison_exp
  contractEndDate: date_comparison_exp
  contractSignDate: date_comparison_exp
  contractStartDate: date_comparison_exp
  contractType: String_comparison_exp
  createdAt: timestamptz_comparison_exp
  educationLevel: String_comparison_exp
  events: notebook_event_bool_exp
  events_aggregate: notebook_event_aggregate_bool_exp
  focuses: notebook_focus_bool_exp
  focuses_aggregate: notebook_focus_aggregate_bool_exp
  geographicalArea: String_comparison_exp
  id: uuid_comparison_exp
  members: notebook_member_bool_exp
  members_aggregate: notebook_member_aggregate_bool_exp
  notebookInfo: notebook_info_bool_exp
  notebookMemberCount: bigint_comparison_exp
  rightAre: Boolean_comparison_exp
  rightAss: Boolean_comparison_exp
  rightBonus: Boolean_comparison_exp
  rightRqth: Boolean_comparison_exp
  rightRsa: String_comparison_exp
  updatedAt: timestamptz_comparison_exp
  wantedJobs: wanted_job_bool_exp
  wantedJobs_aggregate: wanted_job_aggregate_bool_exp
  workSituation: String_comparison_exp
  workSituationDate: date_comparison_exp
  workSituationEndDate: date_comparison_exp
}

"""
unique or primary key constraints on table "notebook"
"""
enum notebook_constraint {
  """
  unique or primary key constraint on columns "beneficiary_id"
  """
  notebook_beneficiary_id_key

  """
  unique or primary key constraint on columns "id"
  """
  notebook_pkey
}

"""
columns and relationships of "notebook_event"
"""
type notebook_event {
  creationDate: timestamptz!

  """An object relationship"""
  creator: account
  creatorId: uuid
  event(
    """JSON select path"""
    path: String
  ): jsonb!
  eventDate: timestamptz!
  eventType: notebook_event_type_enum!
  id: uuid!

  """An object relationship"""
  notebook: notebook!
  notebookId: uuid!

  """An object relationship"""
  notebook_event_type: notebook_event_type!
}

"""
aggregated selection of "notebook_event"
"""
type notebook_event_aggregate {
  aggregate: notebook_event_aggregate_fields
  nodes: [notebook_event!]!
}

input notebook_event_aggregate_bool_exp {
  count: notebook_event_aggregate_bool_exp_count
}

input notebook_event_aggregate_bool_exp_count {
  arguments: [notebook_event_select_column!]
  distinct: Boolean
  filter: notebook_event_bool_exp
  predicate: Int_comparison_exp!
}

"""
aggregate fields of "notebook_event"
"""
type notebook_event_aggregate_fields {
  count(columns: [notebook_event_select_column!], distinct: Boolean): Int!
  max: notebook_event_max_fields
  min: notebook_event_min_fields
}

"""
order by aggregate values of table "notebook_event"
"""
input notebook_event_aggregate_order_by {
  count: order_by
  max: notebook_event_max_order_by
  min: notebook_event_min_order_by
}

"""append existing jsonb value of filtered columns with new jsonb value"""
input notebook_event_append_input {
  event: jsonb
}

"""
input type for inserting array relation for remote table "notebook_event"
"""
input notebook_event_arr_rel_insert_input {
  data: [notebook_event_insert_input!]!

  """upsert condition"""
  on_conflict: notebook_event_on_conflict
}

"""
Boolean expression to filter rows from the table "notebook_event". All fields are combined with a logical 'AND'.
"""
input notebook_event_bool_exp {
  _and: [notebook_event_bool_exp!]
  _not: notebook_event_bool_exp
  _or: [notebook_event_bool_exp!]
  creationDate: timestamptz_comparison_exp
  creator: account_bool_exp
  creatorId: uuid_comparison_exp
  event: jsonb_comparison_exp
  eventDate: timestamptz_comparison_exp
  eventType: notebook_event_type_enum_comparison_exp
  id: uuid_comparison_exp
  notebook: notebook_bool_exp
  notebookId: uuid_comparison_exp
  notebook_event_type: notebook_event_type_bool_exp
}

"""
unique or primary key constraints on table "notebook_event"
"""
enum notebook_event_constraint {
  """
  unique or primary key constraint on columns "id"
  """
  notebook_event_pkey
}

"""
delete the field or element with specified path (for JSON arrays, negative integers count from the end)
"""
input notebook_event_delete_at_path_input {
  event: [String!]
}

"""
delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array
"""
input notebook_event_delete_elem_input {
  event: Int
}

"""
delete key/value pair or string element. key/value pairs are matched based on their key value
"""
input notebook_event_delete_key_input {
  event: String
}

"""
input type for inserting data into table "notebook_event"
"""
input notebook_event_insert_input {
  creationDate: timestamptz
  creator: account_obj_rel_insert_input
  creatorId: uuid
  event: jsonb
  eventDate: timestamptz
  eventType: notebook_event_type_enum
  id: uuid
  notebook: notebook_obj_rel_insert_input
  notebookId: uuid
  notebook_event_type: notebook_event_type_obj_rel_insert_input
}

"""aggregate max on columns"""
type notebook_event_max_fields {
  creationDate: timestamptz
  creatorId: uuid
  eventDate: timestamptz
  id: uuid
  notebookId: uuid
}

"""
order by max() on columns of table "notebook_event"
"""
input notebook_event_max_order_by {
  creationDate: order_by
  creatorId: order_by
  eventDate: order_by
  id: order_by
  notebookId: order_by
}

"""aggregate min on columns"""
type notebook_event_min_fields {
  creationDate: timestamptz
  creatorId: uuid
  eventDate: timestamptz
  id: uuid
  notebookId: uuid
}

"""
order by min() on columns of table "notebook_event"
"""
input notebook_event_min_order_by {
  creationDate: order_by
  creatorId: order_by
  eventDate: order_by
  id: order_by
  notebookId: order_by
}

"""
response of any mutation on the table "notebook_event"
"""
type notebook_event_mutation_response {
  """number of rows affected by the mutation"""
  affected_rows: Int!

  """data from the rows affected by the mutation"""
  returning: [notebook_event!]!
}

"""
on_conflict condition type for table "notebook_event"
"""
input notebook_event_on_conflict {
  constraint: notebook_event_constraint!
  update_columns: [notebook_event_update_column!]! = []
  where: notebook_event_bool_exp
}

"""Ordering options when selecting data from "notebook_event"."""
input notebook_event_order_by {
  creationDate: order_by
  creator: account_order_by
  creatorId: order_by
  event: order_by
  eventDate: order_by
  eventType: order_by
  id: order_by
  notebook: notebook_order_by
  notebookId: order_by
  notebook_event_type: notebook_event_type_order_by
}

"""primary key columns input for table: notebook_event"""
input notebook_event_pk_columns_input {
  id: uuid!
}

"""prepend existing jsonb value of filtered columns with new jsonb value"""
input notebook_event_prepend_input {
  event: jsonb
}

"""
select columns of table "notebook_event"
"""
enum notebook_event_select_column {
  """column name"""
  creationDate

  """column name"""
  creatorId

  """column name"""
  event

  """column name"""
  eventDate

  """column name"""
  eventType

  """column name"""
  id

  """column name"""
  notebookId
}

"""
input type for updating data in table "notebook_event"
"""
input notebook_event_set_input {
  creationDate: timestamptz
  creatorId: uuid
  event: jsonb
  eventDate: timestamptz
  eventType: notebook_event_type_enum
  id: uuid
  notebookId: uuid
}

"""
Streaming cursor of the table "notebook_event"
"""
input notebook_event_stream_cursor_input {
  """Stream column input with initial value"""
  initial_value: notebook_event_stream_cursor_value_input!

  """cursor ordering"""
  ordering: cursor_ordering
}

"""Initial value of the column from where the streaming should start"""
input notebook_event_stream_cursor_value_input {
  creationDate: timestamptz
  creatorId: uuid
  event: jsonb
  eventDate: timestamptz
  eventType: notebook_event_type_enum
  id: uuid
  notebookId: uuid
}

"""
columns and relationships of "notebook_event_type"
"""
type notebook_event_type {
  comment: String!

  """An array relationship"""
  notebook_events(
    """distinct select on columns"""
    distinct_on: [notebook_event_select_column!]

    """limit the number of rows returned"""
    limit: Int

    """skip the first n rows. Use only with order_by"""
    offset: Int

    """sort the rows by one or more columns"""
    order_by: [notebook_event_order_by!]

    """filter the rows returned"""
    where: notebook_event_bool_exp
  ): [notebook_event!]!

  """An aggregate relationship"""
  notebook_events_aggregate(
    """distinct select on columns"""
    distinct_on: [notebook_event_select_column!]

    """limit the number of rows returned"""
    limit: Int

    """skip the first n rows. Use only with order_by"""
    offset: Int

    """sort the rows by one or more columns"""
    order_by: [notebook_event_order_by!]

    """filter the rows returned"""
    where: notebook_event_bool_exp
  ): notebook_event_aggregate!
  value: String!
}

"""
aggregated selection of "notebook_event_type"
"""
type notebook_event_type_aggregate {
  aggregate: notebook_event_type_aggregate_fields
  nodes: [notebook_event_type!]!
}

"""
aggregate fields of "notebook_event_type"
"""
type notebook_event_type_aggregate_fields {
  count(columns: [notebook_event_type_select_column!], distinct: Boolean): Int!
  max: notebook_event_type_max_fields
  min: notebook_event_type_min_fields
}

"""
Boolean expression to filter rows from the table "notebook_event_type". All fields are combined with a logical 'AND'.
"""
input notebook_event_type_bool_exp {
  _and: [notebook_event_type_bool_exp!]
  _not: notebook_event_type_bool_exp
  _or: [notebook_event_type_bool_exp!]
  comment: String_comparison_exp
  notebook_events: notebook_event_bool_exp
  notebook_events_aggregate: notebook_event_aggregate_bool_exp
  value: String_comparison_exp
}

"""
unique or primary key constraints on table "notebook_event_type"
"""
enum notebook_event_type_constraint {
  """
  unique or primary key constraint on columns "value"
  """
  notebook_event_type_pkey
}

enum notebook_event_type_enum {
  """Action d'un objectif"""
  action

  """Objectif d'un parcours"""
  target
}

"""
Boolean expression to compare columns of type "notebook_event_type_enum". All fields are combined with logical 'AND'.
"""
input notebook_event_type_enum_comparison_exp {
  _eq: notebook_event_type_enum
  _in: [notebook_event_type_enum!]
  _is_null: Boolean
  _neq: notebook_event_type_enum
  _nin: [notebook_event_type_enum!]
}

"""
input type for inserting data into table "notebook_event_type"
"""
input notebook_event_type_insert_input {
  comment: String
  notebook_events: notebook_event_arr_rel_insert_input
  value: String
}

"""aggregate max on columns"""
type notebook_event_type_max_fields {
  comment: String
  value: String
}

"""aggregate min on columns"""
type notebook_event_type_min_fields {
  comment: String
  value: String
}

"""
response of any mutation on the table "notebook_event_type"
"""
type notebook_event_type_mutation_response {
  """number of rows affected by the mutation"""
  affected_rows: Int!

  """data from the rows affected by the mutation"""
  returning: [notebook_event_type!]!
}

"""
input type for inserting object relation for remote table "notebook_event_type"
"""
input notebook_event_type_obj_rel_insert_input {
  data: notebook_event_type_insert_input!

  """upsert condition"""
  on_conflict: notebook_event_type_on_conflict
}

"""
on_conflict condition type for table "notebook_event_type"
"""
input notebook_event_type_on_conflict {
  constraint: notebook_event_type_constraint!
  update_columns: [notebook_event_type_update_column!]! = []
  where: notebook_event_type_bool_exp
}

"""Ordering options when selecting data from "notebook_event_type"."""
input notebook_event_type_order_by {
  comment: order_by
  notebook_events_aggregate: notebook_event_aggregate_order_by
  value: order_by
}

"""primary key columns input for table: notebook_event_type"""
input notebook_event_type_pk_columns_input {
  value: String!
}

"""
select columns of table "notebook_event_type"
"""
enum notebook_event_type_select_column {
  """column name"""
  comment

  """column name"""
  value
}

"""
input type for updating data in table "notebook_event_type"
"""
input notebook_event_type_set_input {
  comment: String
  value: String
}

"""
Streaming cursor of the table "notebook_event_type"
"""
input notebook_event_type_stream_cursor_input {
  """Stream column input with initial value"""
  initial_value: notebook_event_type_stream_cursor_value_input!

  """cursor ordering"""
  ordering: cursor_ordering
}

"""Initial value of the column from where the streaming should start"""
input notebook_event_type_stream_cursor_value_input {
  comment: String
  value: String
}

"""
update columns of table "notebook_event_type"
"""
enum notebook_event_type_update_column {
  """column name"""
  comment

  """column name"""
  value
}

input notebook_event_type_updates {
  """sets the columns of the filtered rows to the given values"""
  _set: notebook_event_type_set_input
  where: notebook_event_type_bool_exp!
}

"""
update columns of table "notebook_event"
"""
enum notebook_event_update_column {
  """column name"""
  creationDate

  """column name"""
  creatorId

  """column name"""
  event

  """column name"""
  eventDate

  """column name"""
  eventType

  """column name"""
  id

  """column name"""
  notebookId
}

input notebook_event_updates {
  """append existing jsonb value of filtered columns with new jsonb value"""
  _append: notebook_event_append_input

  """
  delete the field or element with specified path (for JSON arrays, negative integers count from the end)
  """
  _delete_at_path: notebook_event_delete_at_path_input

  """
  delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array
  """
  _delete_elem: notebook_event_delete_elem_input

  """
  delete key/value pair or string element. key/value pairs are matched based on their key value
  """
  _delete_key: notebook_event_delete_key_input

  """prepend existing jsonb value of filtered columns with new jsonb value"""
  _prepend: notebook_event_prepend_input

  """sets the columns of the filtered rows to the given values"""
  _set: notebook_event_set_input
  where: notebook_event_bool_exp!
}

"""
columns and relationships of "notebook_focus"
"""
type notebook_focus {
  createdAt: timestamptz!

  """An object relationship"""
  creator: account!
  creatorId: uuid!
  id: uuid!
  linkedTo: String

  """An object relationship"""
  notebook: notebook!
  notebookId: uuid!
  situations(
    """JSON select path"""
    path: String
  ): jsonb

  """An array relationship"""
  targets(
    """distinct select on columns"""
    distinct_on: [notebook_target_select_column!]

    """limit the number of rows returned"""
    limit: Int

    """skip the first n rows. Use only with order_by"""
    offset: Int

    """sort the rows by one or more columns"""
    order_by: [notebook_target_order_by!]

    """filter the rows returned"""
    where: notebook_target_bool_exp
  ): [notebook_target!]!

  """An aggregate relationship"""
  targets_aggregate(
    """distinct select on columns"""
    distinct_on: [notebook_target_select_column!]

    """limit the number of rows returned"""
    limit: Int

    """skip the first n rows. Use only with order_by"""
    offset: Int

    """sort the rows by one or more columns"""
    order_by: [notebook_target_order_by!]

    """filter the rows returned"""
    where: notebook_target_bool_exp
  ): notebook_target_aggregate!
  theme: String!
  updatedAt: timestamptz!
}

"""
aggregated selection of "notebook_focus"
"""
type notebook_focus_aggregate {
  aggregate: notebook_focus_aggregate_fields
  nodes: [notebook_focus!]!
}

input notebook_focus_aggregate_bool_exp {
  count: notebook_focus_aggregate_bool_exp_count
}

input notebook_focus_aggregate_bool_exp_count {
  arguments: [notebook_focus_select_column!]
  distinct: Boolean
  filter: notebook_focus_bool_exp
  predicate: Int_comparison_exp!
}

"""
aggregate fields of "notebook_focus"
"""
type notebook_focus_aggregate_fields {
  count(columns: [notebook_focus_select_column!], distinct: Boolean): Int!
  max: notebook_focus_max_fields
  min: notebook_focus_min_fields
}

"""
order by aggregate values of table "notebook_focus"
"""
input notebook_focus_aggregate_order_by {
  count: order_by
  max: notebook_focus_max_order_by
  min: notebook_focus_min_order_by
}

"""append existing jsonb value of filtered columns with new jsonb value"""
input notebook_focus_append_input {
  situations: jsonb
}

"""
input type for inserting array relation for remote table "notebook_focus"
"""
input notebook_focus_arr_rel_insert_input {
  data: [notebook_focus_insert_input!]!

  """upsert condition"""
  on_conflict: notebook_focus_on_conflict
}

"""
Boolean expression to filter rows from the table "notebook_focus". All fields are combined with a logical 'AND'.
"""
input notebook_focus_bool_exp {
  _and: [notebook_focus_bool_exp!]
  _not: notebook_focus_bool_exp
  _or: [notebook_focus_bool_exp!]
  createdAt: timestamptz_comparison_exp
  creator: account_bool_exp
  creatorId: uuid_comparison_exp
  id: uuid_comparison_exp
  linkedTo: String_comparison_exp
  notebook: notebook_bool_exp
  notebookId: uuid_comparison_exp
  situations: jsonb_comparison_exp
  targets: notebook_target_bool_exp
  targets_aggregate: notebook_target_aggregate_bool_exp
  theme: String_comparison_exp
  updatedAt: timestamptz_comparison_exp
}

"""
unique or primary key constraints on table "notebook_focus"
"""
enum notebook_focus_constraint {
  """
  unique or primary key constraint on columns "id"
  """
  notebook_focus_pkey
}

"""
delete the field or element with specified path (for JSON arrays, negative integers count from the end)
"""
input notebook_focus_delete_at_path_input {
  situations: [String!]
}

"""
delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array
"""
input notebook_focus_delete_elem_input {
  situations: Int
}

"""
delete key/value pair or string element. key/value pairs are matched based on their key value
"""
input notebook_focus_delete_key_input {
  situations: String
}

"""
input type for inserting data into table "notebook_focus"
"""
input notebook_focus_insert_input {
  createdAt: timestamptz
  creator: account_obj_rel_insert_input
  creatorId: uuid
  id: uuid
  linkedTo: String
  notebook: notebook_obj_rel_insert_input
  notebookId: uuid
  situations: jsonb
  targets: notebook_target_arr_rel_insert_input
  theme: String
  updatedAt: timestamptz
}

"""aggregate max on columns"""
type notebook_focus_max_fields {
  createdAt: timestamptz
  creatorId: uuid
  id: uuid
  linkedTo: String
  notebookId: uuid
  theme: String
  updatedAt: timestamptz
}

"""
order by max() on columns of table "notebook_focus"
"""
input notebook_focus_max_order_by {
  createdAt: order_by
  creatorId: order_by
  id: order_by
  linkedTo: order_by
  notebookId: order_by
  theme: order_by
  updatedAt: order_by
}

"""aggregate min on columns"""
type notebook_focus_min_fields {
  createdAt: timestamptz
  creatorId: uuid
  id: uuid
  linkedTo: String
  notebookId: uuid
  theme: String
  updatedAt: timestamptz
}

"""
order by min() on columns of table "notebook_focus"
"""
input notebook_focus_min_order_by {
  createdAt: order_by
  creatorId: order_by
  id: order_by
  linkedTo: order_by
  notebookId: order_by
  theme: order_by
  updatedAt: order_by
}

"""
response of any mutation on the table "notebook_focus"
"""
type notebook_focus_mutation_response {
  """number of rows affected by the mutation"""
  affected_rows: Int!

  """data from the rows affected by the mutation"""
  returning: [notebook_focus!]!
}

"""
input type for inserting object relation for remote table "notebook_focus"
"""
input notebook_focus_obj_rel_insert_input {
  data: notebook_focus_insert_input!

  """upsert condition"""
  on_conflict: notebook_focus_on_conflict
}

"""
on_conflict condition type for table "notebook_focus"
"""
input notebook_focus_on_conflict {
  constraint: notebook_focus_constraint!
  update_columns: [notebook_focus_update_column!]! = []
  where: notebook_focus_bool_exp
}

"""Ordering options when selecting data from "notebook_focus"."""
input notebook_focus_order_by {
  createdAt: order_by
  creator: account_order_by
  creatorId: order_by
  id: order_by
  linkedTo: order_by
  notebook: notebook_order_by
  notebookId: order_by
  situations: order_by
  targets_aggregate: notebook_target_aggregate_order_by
  theme: order_by
  updatedAt: order_by
}

"""primary key columns input for table: notebook_focus"""
input notebook_focus_pk_columns_input {
  id: uuid!
}

"""prepend existing jsonb value of filtered columns with new jsonb value"""
input notebook_focus_prepend_input {
  situations: jsonb
}

"""
select columns of table "notebook_focus"
"""
enum notebook_focus_select_column {
  """column name"""
  createdAt

  """column name"""
  creatorId

  """column name"""
  id

  """column name"""
  linkedTo

  """column name"""
  notebookId

  """column name"""
  situations

  """column name"""
  theme

  """column name"""
  updatedAt
}

"""
input type for updating data in table "notebook_focus"
"""
input notebook_focus_set_input {
  createdAt: timestamptz
  creatorId: uuid
  id: uuid
  linkedTo: String
  notebookId: uuid
  situations: jsonb
  theme: String
  updatedAt: timestamptz
}

"""
Streaming cursor of the table "notebook_focus"
"""
input notebook_focus_stream_cursor_input {
  """Stream column input with initial value"""
  initial_value: notebook_focus_stream_cursor_value_input!

  """cursor ordering"""
  ordering: cursor_ordering
}

"""Initial value of the column from where the streaming should start"""
input notebook_focus_stream_cursor_value_input {
  createdAt: timestamptz
  creatorId: uuid
  id: uuid
  linkedTo: String
  notebookId: uuid
  situations: jsonb
  theme: String
  updatedAt: timestamptz
}

"""
update columns of table "notebook_focus"
"""
enum notebook_focus_update_column {
  """column name"""
  createdAt

  """column name"""
  creatorId

  """column name"""
  id

  """column name"""
  linkedTo

  """column name"""
  notebookId

  """column name"""
  situations

  """column name"""
  theme

  """column name"""
  updatedAt
}

input notebook_focus_updates {
  """append existing jsonb value of filtered columns with new jsonb value"""
  _append: notebook_focus_append_input

  """
  delete the field or element with specified path (for JSON arrays, negative integers count from the end)
  """
  _delete_at_path: notebook_focus_delete_at_path_input

  """
  delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array
  """
  _delete_elem: notebook_focus_delete_elem_input

  """
  delete key/value pair or string element. key/value pairs are matched based on their key value
  """
  _delete_key: notebook_focus_delete_key_input

  """prepend existing jsonb value of filtered columns with new jsonb value"""
  _prepend: notebook_focus_prepend_input

  """sets the columns of the filtered rows to the given values"""
  _set: notebook_focus_set_input
  where: notebook_focus_bool_exp!
}

"""notebook orientation infos"""
type notebook_info {
  createdAt: timestamptz!
  needOrientation: Boolean!

  """An object relationship"""
  notebook: notebook!
  notebookId: uuid!
  orientation: orientation_type_enum

  """An object relationship"""
  orientationType: orientation_type
  updatedAt: timestamptz!
}

"""
aggregated selection of "notebook_info"
"""
type notebook_info_aggregate {
  aggregate: notebook_info_aggregate_fields
  nodes: [notebook_info!]!
}

input notebook_info_aggregate_bool_exp {
  bool_and: notebook_info_aggregate_bool_exp_bool_and
  bool_or: notebook_info_aggregate_bool_exp_bool_or
  count: notebook_info_aggregate_bool_exp_count
}

input notebook_info_aggregate_bool_exp_bool_and {
  arguments: notebook_info_select_column_notebook_info_aggregate_bool_exp_bool_and_arguments_columns!
  distinct: Boolean
  filter: notebook_info_bool_exp
  predicate: Boolean_comparison_exp!
}

input notebook_info_aggregate_bool_exp_bool_or {
  arguments: notebook_info_select_column_notebook_info_aggregate_bool_exp_bool_or_arguments_columns!
  distinct: Boolean
  filter: notebook_info_bool_exp
  predicate: Boolean_comparison_exp!
}

input notebook_info_aggregate_bool_exp_count {
  arguments: [notebook_info_select_column!]
  distinct: Boolean
  filter: notebook_info_bool_exp
  predicate: Int_comparison_exp!
}

"""
aggregate fields of "notebook_info"
"""
type notebook_info_aggregate_fields {
  count(columns: [notebook_info_select_column!], distinct: Boolean): Int!
  max: notebook_info_max_fields
  min: notebook_info_min_fields
}

"""
order by aggregate values of table "notebook_info"
"""
input notebook_info_aggregate_order_by {
  count: order_by
  max: notebook_info_max_order_by
  min: notebook_info_min_order_by
}

"""
input type for inserting array relation for remote table "notebook_info"
"""
input notebook_info_arr_rel_insert_input {
  data: [notebook_info_insert_input!]!

  """upsert condition"""
  on_conflict: notebook_info_on_conflict
}

"""
Boolean expression to filter rows from the table "notebook_info". All fields are combined with a logical 'AND'.
"""
input notebook_info_bool_exp {
  _and: [notebook_info_bool_exp!]
  _not: notebook_info_bool_exp
  _or: [notebook_info_bool_exp!]
  createdAt: timestamptz_comparison_exp
  needOrientation: Boolean_comparison_exp
  notebook: notebook_bool_exp
  notebookId: uuid_comparison_exp
  orientation: orientation_type_enum_comparison_exp
  orientationType: orientation_type_bool_exp
  updatedAt: timestamptz_comparison_exp
}

"""
unique or primary key constraints on table "notebook_info"
"""
enum notebook_info_constraint {
  """
  unique or primary key constraint on columns "notebook_id"
  """
  notebook_info_pkey
}

"""
input type for inserting data into table "notebook_info"
"""
input notebook_info_insert_input {
  createdAt: timestamptz
  needOrientation: Boolean
  notebook: notebook_obj_rel_insert_input
  notebookId: uuid
  orientation: orientation_type_enum
  orientationType: orientation_type_obj_rel_insert_input
  updatedAt: timestamptz
}

"""aggregate max on columns"""
type notebook_info_max_fields {
  createdAt: timestamptz
  notebookId: uuid
  updatedAt: timestamptz
}

"""
order by max() on columns of table "notebook_info"
"""
input notebook_info_max_order_by {
  createdAt: order_by
  notebookId: order_by
  updatedAt: order_by
}

"""aggregate min on columns"""
type notebook_info_min_fields {
  createdAt: timestamptz
  notebookId: uuid
  updatedAt: timestamptz
}

"""
order by min() on columns of table "notebook_info"
"""
input notebook_info_min_order_by {
  createdAt: order_by
  notebookId: order_by
  updatedAt: order_by
}

"""
response of any mutation on the table "notebook_info"
"""
type notebook_info_mutation_response {
  """number of rows affected by the mutation"""
  affected_rows: Int!

  """data from the rows affected by the mutation"""
  returning: [notebook_info!]!
}

"""
input type for inserting object relation for remote table "notebook_info"
"""
input notebook_info_obj_rel_insert_input {
  data: notebook_info_insert_input!

  """upsert condition"""
  on_conflict: notebook_info_on_conflict
}

"""
on_conflict condition type for table "notebook_info"
"""
input notebook_info_on_conflict {
  constraint: notebook_info_constraint!
  update_columns: [notebook_info_update_column!]! = []
  where: notebook_info_bool_exp
}

"""Ordering options when selecting data from "notebook_info"."""
input notebook_info_order_by {
  createdAt: order_by
  needOrientation: order_by
  notebook: notebook_order_by
  notebookId: order_by
  orientation: order_by
  orientationType: orientation_type_order_by
  updatedAt: order_by
}

"""primary key columns input for table: notebook_info"""
input notebook_info_pk_columns_input {
  notebookId: uuid!
}

"""
select columns of table "notebook_info"
"""
enum notebook_info_select_column {
  """column name"""
  createdAt

  """column name"""
  needOrientation

  """column name"""
  notebookId

  """column name"""
  orientation

  """column name"""
  updatedAt
}

"""
select "notebook_info_aggregate_bool_exp_bool_and_arguments_columns" columns of table "notebook_info"
"""
enum notebook_info_select_column_notebook_info_aggregate_bool_exp_bool_and_arguments_columns {
  """column name"""
  needOrientation
}

"""
select "notebook_info_aggregate_bool_exp_bool_or_arguments_columns" columns of table "notebook_info"
"""
enum notebook_info_select_column_notebook_info_aggregate_bool_exp_bool_or_arguments_columns {
  """column name"""
  needOrientation
}

"""
input type for updating data in table "notebook_info"
"""
input notebook_info_set_input {
  createdAt: timestamptz
  needOrientation: Boolean
  notebookId: uuid
  orientation: orientation_type_enum
  updatedAt: timestamptz
}

"""
Streaming cursor of the table "notebook_info"
"""
input notebook_info_stream_cursor_input {
  """Stream column input with initial value"""
  initial_value: notebook_info_stream_cursor_value_input!

  """cursor ordering"""
  ordering: cursor_ordering
}

"""Initial value of the column from where the streaming should start"""
input notebook_info_stream_cursor_value_input {
  createdAt: timestamptz
  needOrientation: Boolean
  notebookId: uuid
  orientation: orientation_type_enum
  updatedAt: timestamptz
}

"""
update columns of table "notebook_info"
"""
enum notebook_info_update_column {
  """column name"""
  createdAt

  """column name"""
  needOrientation

  """column name"""
  notebookId

  """column name"""
  orientation

  """column name"""
  updatedAt
}

input notebook_info_updates {
  """sets the columns of the filtered rows to the given values"""
  _set: notebook_info_set_input
  where: notebook_info_bool_exp!
}

"""
input type for inserting data into table "notebook"
"""
input notebook_insert_input {
  appointments: notebook_appointment_arr_rel_insert_input
  beneficiary: beneficiary_obj_rel_insert_input
  beneficiaryId: uuid
  contractEndDate: date
  contractSignDate: date
  contractStartDate: date
  contractType: String
  createdAt: timestamptz
  educationLevel: String
  events: notebook_event_arr_rel_insert_input
  focuses: notebook_focus_arr_rel_insert_input
  geographicalArea: String
  id: uuid
  members: notebook_member_arr_rel_insert_input
  notebookInfo: notebook_info_obj_rel_insert_input
  rightAre: Boolean
  rightAss: Boolean
  rightBonus: Boolean
  rightRqth: Boolean
  rightRsa: String
  updatedAt: timestamptz
  wantedJobs: wanted_job_arr_rel_insert_input
  workSituation: String
  workSituationDate: date
  workSituationEndDate: date
}

"""aggregate max on columns"""
type notebook_max_fields {
  beneficiaryId: uuid
  contractEndDate: date
  contractSignDate: date
  contractStartDate: date
  contractType: String
  createdAt: timestamptz
  educationLevel: String
  geographicalArea: String
  id: uuid
  rightRsa: String
  updatedAt: timestamptz
  workSituation: String
  workSituationDate: date
  workSituationEndDate: date
}

"""
columns and relationships of "notebook_member"
"""
type notebook_member {
  """An object relationship"""
  account: account!
  accountId: uuid!
  active: Boolean!
  createdAt: timestamptz!

  """An object relationship"""
  creator: account
  creatorId: uuid
  id: uuid!
  invitationSendAt: timestamptz
  lastModifiedAt: timestamptz
  lastVisitedAt: timestamptz
  memberType: String!
  membershipEndedAt: date

  """An object relationship"""
  notebook: notebook!
  notebookId: uuid!
}

"""
aggregated selection of "notebook_member"
"""
type notebook_member_aggregate {
  aggregate: notebook_member_aggregate_fields
  nodes: [notebook_member!]!
}

input notebook_member_aggregate_bool_exp {
  bool_and: notebook_member_aggregate_bool_exp_bool_and
  bool_or: notebook_member_aggregate_bool_exp_bool_or
  count: notebook_member_aggregate_bool_exp_count
}

input notebook_member_aggregate_bool_exp_bool_and {
  arguments: notebook_member_select_column_notebook_member_aggregate_bool_exp_bool_and_arguments_columns!
  distinct: Boolean
  filter: notebook_member_bool_exp
  predicate: Boolean_comparison_exp!
}

input notebook_member_aggregate_bool_exp_bool_or {
  arguments: notebook_member_select_column_notebook_member_aggregate_bool_exp_bool_or_arguments_columns!
  distinct: Boolean
  filter: notebook_member_bool_exp
  predicate: Boolean_comparison_exp!
}

input notebook_member_aggregate_bool_exp_count {
  arguments: [notebook_member_select_column!]
  distinct: Boolean
  filter: notebook_member_bool_exp
  predicate: Int_comparison_exp!
}

"""
aggregate fields of "notebook_member"
"""
type notebook_member_aggregate_fields {
  count(columns: [notebook_member_select_column!], distinct: Boolean): Int!
  max: notebook_member_max_fields
  min: notebook_member_min_fields
}

"""
order by aggregate values of table "notebook_member"
"""
input notebook_member_aggregate_order_by {
  count: order_by
  max: notebook_member_max_order_by
  min: notebook_member_min_order_by
}

"""
input type for inserting array relation for remote table "notebook_member"
"""
input notebook_member_arr_rel_insert_input {
  data: [notebook_member_insert_input!]!

  """upsert condition"""
  on_conflict: notebook_member_on_conflict
}

"""
Boolean expression to filter rows from the table "notebook_member". All fields are combined with a logical 'AND'.
"""
input notebook_member_bool_exp {
  _and: [notebook_member_bool_exp!]
  _not: notebook_member_bool_exp
  _or: [notebook_member_bool_exp!]
  account: account_bool_exp
  accountId: uuid_comparison_exp
  active: Boolean_comparison_exp
  createdAt: timestamptz_comparison_exp
  creator: account_bool_exp
  creatorId: uuid_comparison_exp
  id: uuid_comparison_exp
  invitationSendAt: timestamptz_comparison_exp
  lastModifiedAt: timestamptz_comparison_exp
  lastVisitedAt: timestamptz_comparison_exp
  memberType: String_comparison_exp
  membershipEndedAt: date_comparison_exp
  notebook: notebook_bool_exp
  notebookId: uuid_comparison_exp
}

"""
unique or primary key constraints on table "notebook_member"
"""
enum notebook_member_constraint {
  """
  unique or primary key constraint on columns "account_id", "notebook_id"
  """
  notebook_member_notebook_id_account_id_if_active

  """
  unique or primary key constraint on columns "id"
  """
  notebook_member_pkey

  """
  unique or primary key constraint on columns "notebook_id"
  """
  notebook_member_unique_referent
}

"""
input type for inserting data into table "notebook_member"
"""
input notebook_member_insert_input {
  account: account_obj_rel_insert_input
  accountId: uuid
  active: Boolean
  createdAt: timestamptz
  creator: account_obj_rel_insert_input
  creatorId: uuid
  id: uuid
  invitationSendAt: timestamptz
  lastModifiedAt: timestamptz
  lastVisitedAt: timestamptz
  memberType: String
  membershipEndedAt: date
  notebook: notebook_obj_rel_insert_input
  notebookId: uuid
}

"""aggregate max on columns"""
type notebook_member_max_fields {
  accountId: uuid
  createdAt: timestamptz
  creatorId: uuid
  id: uuid
  invitationSendAt: timestamptz
  lastModifiedAt: timestamptz
  lastVisitedAt: timestamptz
  memberType: String
  membershipEndedAt: date
  notebookId: uuid
}

"""
order by max() on columns of table "notebook_member"
"""
input notebook_member_max_order_by {
  accountId: order_by
  createdAt: order_by
  creatorId: order_by
  id: order_by
  invitationSendAt: order_by
  lastModifiedAt: order_by
  lastVisitedAt: order_by
  memberType: order_by
  membershipEndedAt: order_by
  notebookId: order_by
}

"""aggregate min on columns"""
type notebook_member_min_fields {
  accountId: uuid
  createdAt: timestamptz
  creatorId: uuid
  id: uuid
  invitationSendAt: timestamptz
  lastModifiedAt: timestamptz
  lastVisitedAt: timestamptz
  memberType: String
  membershipEndedAt: date
  notebookId: uuid
}

"""
order by min() on columns of table "notebook_member"
"""
input notebook_member_min_order_by {
  accountId: order_by
  createdAt: order_by
  creatorId: order_by
  id: order_by
  invitationSendAt: order_by
  lastModifiedAt: order_by
  lastVisitedAt: order_by
  memberType: order_by
  membershipEndedAt: order_by
  notebookId: order_by
}

"""
response of any mutation on the table "notebook_member"
"""
type notebook_member_mutation_response {
  """number of rows affected by the mutation"""
  affected_rows: Int!

  """data from the rows affected by the mutation"""
  returning: [notebook_member!]!
}

"""
on_conflict condition type for table "notebook_member"
"""
input notebook_member_on_conflict {
  constraint: notebook_member_constraint!
  update_columns: [notebook_member_update_column!]! = []
  where: notebook_member_bool_exp
}

"""Ordering options when selecting data from "notebook_member"."""
input notebook_member_order_by {
  account: account_order_by
  accountId: order_by
  active: order_by
  createdAt: order_by
  creator: account_order_by
  creatorId: order_by
  id: order_by
  invitationSendAt: order_by
  lastModifiedAt: order_by
  lastVisitedAt: order_by
  memberType: order_by
  membershipEndedAt: order_by
  notebook: notebook_order_by
  notebookId: order_by
}

"""primary key columns input for table: notebook_member"""
input notebook_member_pk_columns_input {
  id: uuid!
}

"""
select columns of table "notebook_member"
"""
enum notebook_member_select_column {
  """column name"""
  accountId

  """column name"""
  active

  """column name"""
  createdAt

  """column name"""
  creatorId

  """column name"""
  id

  """column name"""
  invitationSendAt

  """column name"""
  lastModifiedAt

  """column name"""
  lastVisitedAt

  """column name"""
  memberType

  """column name"""
  membershipEndedAt

  """column name"""
  notebookId
}

"""
select "notebook_member_aggregate_bool_exp_bool_and_arguments_columns" columns of table "notebook_member"
"""
enum notebook_member_select_column_notebook_member_aggregate_bool_exp_bool_and_arguments_columns {
  """column name"""
  active
}

"""
select "notebook_member_aggregate_bool_exp_bool_or_arguments_columns" columns of table "notebook_member"
"""
enum notebook_member_select_column_notebook_member_aggregate_bool_exp_bool_or_arguments_columns {
  """column name"""
  active
}

"""
input type for updating data in table "notebook_member"
"""
input notebook_member_set_input {
  accountId: uuid
  active: Boolean
  createdAt: timestamptz
  creatorId: uuid
  id: uuid
  invitationSendAt: timestamptz
  lastModifiedAt: timestamptz
  lastVisitedAt: timestamptz
  memberType: String
  membershipEndedAt: date
  notebookId: uuid
}

"""
Streaming cursor of the table "notebook_member"
"""
input notebook_member_stream_cursor_input {
  """Stream column input with initial value"""
  initial_value: notebook_member_stream_cursor_value_input!

  """cursor ordering"""
  ordering: cursor_ordering
}

"""Initial value of the column from where the streaming should start"""
input notebook_member_stream_cursor_value_input {
  accountId: uuid
  active: Boolean
  createdAt: timestamptz
  creatorId: uuid
  id: uuid
  invitationSendAt: timestamptz
  lastModifiedAt: timestamptz
  lastVisitedAt: timestamptz
  memberType: String
  membershipEndedAt: date
  notebookId: uuid
}

"""
update columns of table "notebook_member"
"""
enum notebook_member_update_column {
  """column name"""
  accountId

  """column name"""
  active

  """column name"""
  createdAt

  """column name"""
  creatorId

  """column name"""
  id

  """column name"""
  invitationSendAt

  """column name"""
  lastModifiedAt

  """column name"""
  lastVisitedAt

  """column name"""
  memberType

  """column name"""
  membershipEndedAt

  """column name"""
  notebookId
}

input notebook_member_updates {
  """sets the columns of the filtered rows to the given values"""
  _set: notebook_member_set_input
  where: notebook_member_bool_exp!
}

"""aggregate min on columns"""
type notebook_min_fields {
  beneficiaryId: uuid
  contractEndDate: date
  contractSignDate: date
  contractStartDate: date
  contractType: String
  createdAt: timestamptz
  educationLevel: String
  geographicalArea: String
  id: uuid
  rightRsa: String
  updatedAt: timestamptz
  workSituation: String
  workSituationDate: date
  workSituationEndDate: date
}

"""
response of any mutation on the table "notebook"
"""
type notebook_mutation_response {
  """number of rows affected by the mutation"""
  affected_rows: Int!

  """data from the rows affected by the mutation"""
  returning: [notebook!]!
}

"""
input type for inserting object relation for remote table "notebook"
"""
input notebook_obj_rel_insert_input {
  data: notebook_insert_input!

  """upsert condition"""
  on_conflict: notebook_on_conflict
}

"""
on_conflict condition type for table "notebook"
"""
input notebook_on_conflict {
  constraint: notebook_constraint!
  update_columns: [notebook_update_column!]! = []
  where: notebook_bool_exp
}

"""Ordering options when selecting data from "notebook"."""
input notebook_order_by {
  appointments_aggregate: notebook_appointment_aggregate_order_by
  beneficiary: beneficiary_order_by
  beneficiaryId: order_by
  contractEndDate: order_by
  contractSignDate: order_by
  contractStartDate: order_by
  contractType: order_by
  createdAt: order_by
  educationLevel: order_by
  events_aggregate: notebook_event_aggregate_order_by
  focuses_aggregate: notebook_focus_aggregate_order_by
  geographicalArea: order_by
  id: order_by
  members_aggregate: notebook_member_aggregate_order_by
  notebookInfo: notebook_info_order_by
  notebookMemberCount: order_by
  rightAre: order_by
  rightAss: order_by
  rightBonus: order_by
  rightRqth: order_by
  rightRsa: order_by
  updatedAt: order_by
  wantedJobs_aggregate: wanted_job_aggregate_order_by
  workSituation: order_by
  workSituationDate: order_by
  workSituationEndDate: order_by
}

"""primary key columns input for table: notebook"""
input notebook_pk_columns_input {
  id: uuid!
}

"""
columns and relationships of "notebook_public_view"
"""
type notebook_public_view {
  """An object relationship"""
  beneficiary: beneficiary
  beneficiary_id: uuid
  created_at: timestamptz
  id: uuid

  """An array relationship"""
  members(
    """distinct select on columns"""
    distinct_on: [notebook_member_select_column!]

    """limit the number of rows returned"""
    limit: Int

    """skip the first n rows. Use only with order_by"""
    offset: Int

    """sort the rows by one or more columns"""
    order_by: [notebook_member_order_by!]

    """filter the rows returned"""
    where: notebook_member_bool_exp
  ): [notebook_member!]!

  """An aggregate relationship"""
  members_aggregate(
    """distinct select on columns"""
    distinct_on: [notebook_member_select_column!]

    """limit the number of rows returned"""
    limit: Int

    """skip the first n rows. Use only with order_by"""
    offset: Int

    """sort the rows by one or more columns"""
    order_by: [notebook_member_order_by!]

    """filter the rows returned"""
    where: notebook_member_bool_exp
  ): notebook_member_aggregate!

  """An object relationship"""
  notebook: notebook
  updated_at: timestamptz
}

"""
aggregated selection of "notebook_public_view"
"""
type notebook_public_view_aggregate {
  aggregate: notebook_public_view_aggregate_fields
  nodes: [notebook_public_view!]!
}

"""
aggregate fields of "notebook_public_view"
"""
type notebook_public_view_aggregate_fields {
  count(columns: [notebook_public_view_select_column!], distinct: Boolean): Int!
  max: notebook_public_view_max_fields
  min: notebook_public_view_min_fields
}

"""
Boolean expression to filter rows from the table "notebook_public_view". All fields are combined with a logical 'AND'.
"""
input notebook_public_view_bool_exp {
  _and: [notebook_public_view_bool_exp!]
  _not: notebook_public_view_bool_exp
  _or: [notebook_public_view_bool_exp!]
  beneficiary: beneficiary_bool_exp
  beneficiary_id: uuid_comparison_exp
  created_at: timestamptz_comparison_exp
  id: uuid_comparison_exp
  members: notebook_member_bool_exp
  members_aggregate: notebook_member_aggregate_bool_exp
  notebook: notebook_bool_exp
  updated_at: timestamptz_comparison_exp
}

"""
input type for inserting data into table "notebook_public_view"
"""
input notebook_public_view_insert_input {
  beneficiary: beneficiary_obj_rel_insert_input
  beneficiary_id: uuid
  created_at: timestamptz
  id: uuid
  members: notebook_member_arr_rel_insert_input
  notebook: notebook_obj_rel_insert_input
  updated_at: timestamptz
}

"""aggregate max on columns"""
type notebook_public_view_max_fields {
  beneficiary_id: uuid
  created_at: timestamptz
  id: uuid
  updated_at: timestamptz
}

"""aggregate min on columns"""
type notebook_public_view_min_fields {
  beneficiary_id: uuid
  created_at: timestamptz
  id: uuid
  updated_at: timestamptz
}

"""
response of any mutation on the table "notebook_public_view"
"""
type notebook_public_view_mutation_response {
  """number of rows affected by the mutation"""
  affected_rows: Int!

  """data from the rows affected by the mutation"""
  returning: [notebook_public_view!]!
}

"""
input type for inserting object relation for remote table "notebook_public_view"
"""
input notebook_public_view_obj_rel_insert_input {
  data: notebook_public_view_insert_input!
}

"""Ordering options when selecting data from "notebook_public_view"."""
input notebook_public_view_order_by {
  beneficiary: beneficiary_order_by
  beneficiary_id: order_by
  created_at: order_by
  id: order_by
  members_aggregate: notebook_member_aggregate_order_by
  notebook: notebook_order_by
  updated_at: order_by
}

"""
select columns of table "notebook_public_view"
"""
enum notebook_public_view_select_column {
  """column name"""
  beneficiary_id

  """column name"""
  created_at

  """column name"""
  id

  """column name"""
  updated_at
}

"""
input type for updating data in table "notebook_public_view"
"""
input notebook_public_view_set_input {
  beneficiary_id: uuid
  created_at: timestamptz
  id: uuid
  updated_at: timestamptz
}

"""
Streaming cursor of the table "notebook_public_view"
"""
input notebook_public_view_stream_cursor_input {
  """Stream column input with initial value"""
  initial_value: notebook_public_view_stream_cursor_value_input!

  """cursor ordering"""
  ordering: cursor_ordering
}

"""Initial value of the column from where the streaming should start"""
input notebook_public_view_stream_cursor_value_input {
  beneficiary_id: uuid
  created_at: timestamptz
  id: uuid
  updated_at: timestamptz
}

input notebook_public_view_updates {
  """sets the columns of the filtered rows to the given values"""
  _set: notebook_public_view_set_input
  where: notebook_public_view_bool_exp!
}

"""
select columns of table "notebook"
"""
enum notebook_select_column {
  """column name"""
  beneficiaryId

  """column name"""
  contractEndDate

  """column name"""
  contractSignDate

  """column name"""
  contractStartDate

  """column name"""
  contractType

  """column name"""
  createdAt

  """column name"""
  educationLevel

  """column name"""
  geographicalArea

  """column name"""
  id

  """column name"""
  rightAre

  """column name"""
  rightAss

  """column name"""
  rightBonus

  """column name"""
  rightRqth

  """column name"""
  rightRsa

  """column name"""
  updatedAt

  """column name"""
  workSituation

  """column name"""
  workSituationDate

  """column name"""
  workSituationEndDate
}

"""
input type for updating data in table "notebook"
"""
input notebook_set_input {
  beneficiaryId: uuid
  contractEndDate: date
  contractSignDate: date
  contractStartDate: date
  contractType: String
  createdAt: timestamptz
  educationLevel: String
  geographicalArea: String
  id: uuid
  rightAre: Boolean
  rightAss: Boolean
  rightBonus: Boolean
  rightRqth: Boolean
  rightRsa: String
  updatedAt: timestamptz
  workSituation: String
  workSituationDate: date
  workSituationEndDate: date
}

"""
Streaming cursor of the table "notebook"
"""
input notebook_stream_cursor_input {
  """Stream column input with initial value"""
  initial_value: notebook_stream_cursor_value_input!

  """cursor ordering"""
  ordering: cursor_ordering
}

"""Initial value of the column from where the streaming should start"""
input notebook_stream_cursor_value_input {
  beneficiaryId: uuid
  contractEndDate: date
  contractSignDate: date
  contractStartDate: date
  contractType: String
  createdAt: timestamptz
  educationLevel: String
  geographicalArea: String
  id: uuid
  rightAre: Boolean
  rightAss: Boolean
  rightBonus: Boolean
  rightRqth: Boolean
  rightRsa: String
  updatedAt: timestamptz
  workSituation: String
  workSituationDate: date
  workSituationEndDate: date
}

"""
columns and relationships of "notebook_target"
"""
type notebook_target {
  """An array relationship"""
  actions(
    """distinct select on columns"""
    distinct_on: [notebook_action_select_column!]

    """limit the number of rows returned"""
    limit: Int

    """skip the first n rows. Use only with order_by"""
    offset: Int

    """sort the rows by one or more columns"""
    order_by: [notebook_action_order_by!]

    """filter the rows returned"""
    where: notebook_action_bool_exp
  ): [notebook_action!]!

  """An aggregate relationship"""
  actions_aggregate(
    """distinct select on columns"""
    distinct_on: [notebook_action_select_column!]

    """limit the number of rows returned"""
    limit: Int

    """skip the first n rows. Use only with order_by"""
    offset: Int

    """sort the rows by one or more columns"""
    order_by: [notebook_action_order_by!]

    """filter the rows returned"""
    where: notebook_action_bool_exp
  ): notebook_action_aggregate!
  createdAt: timestamptz!

  """An object relationship"""
  creator: account!
  creatorId: uuid!

  """An object relationship"""
  focus: notebook_focus!
  focusId: uuid!
  id: uuid!
  status: String!
  target: String!
  updatedAt: timestamptz!
}

"""
aggregated selection of "notebook_target"
"""
type notebook_target_aggregate {
  aggregate: notebook_target_aggregate_fields
  nodes: [notebook_target!]!
}

input notebook_target_aggregate_bool_exp {
  count: notebook_target_aggregate_bool_exp_count
}

input notebook_target_aggregate_bool_exp_count {
  arguments: [notebook_target_select_column!]
  distinct: Boolean
  filter: notebook_target_bool_exp
  predicate: Int_comparison_exp!
}

"""
aggregate fields of "notebook_target"
"""
type notebook_target_aggregate_fields {
  count(columns: [notebook_target_select_column!], distinct: Boolean): Int!
  max: notebook_target_max_fields
  min: notebook_target_min_fields
}

"""
order by aggregate values of table "notebook_target"
"""
input notebook_target_aggregate_order_by {
  count: order_by
  max: notebook_target_max_order_by
  min: notebook_target_min_order_by
}

"""
input type for inserting array relation for remote table "notebook_target"
"""
input notebook_target_arr_rel_insert_input {
  data: [notebook_target_insert_input!]!

  """upsert condition"""
  on_conflict: notebook_target_on_conflict
}

"""
Boolean expression to filter rows from the table "notebook_target". All fields are combined with a logical 'AND'.
"""
input notebook_target_bool_exp {
  _and: [notebook_target_bool_exp!]
  _not: notebook_target_bool_exp
  _or: [notebook_target_bool_exp!]
  actions: notebook_action_bool_exp
  actions_aggregate: notebook_action_aggregate_bool_exp
  createdAt: timestamptz_comparison_exp
  creator: account_bool_exp
  creatorId: uuid_comparison_exp
  focus: notebook_focus_bool_exp
  focusId: uuid_comparison_exp
  id: uuid_comparison_exp
  status: String_comparison_exp
  target: String_comparison_exp
  updatedAt: timestamptz_comparison_exp
}

"""
unique or primary key constraints on table "notebook_target"
"""
enum notebook_target_constraint {
  """
  unique or primary key constraint on columns "target", "focus_id"
  """
  notebook_target_focus_id_target_key

  """
  unique or primary key constraint on columns "id"
  """
  notebook_target_pkey
}

"""
input type for inserting data into table "notebook_target"
"""
input notebook_target_insert_input {
  actions: notebook_action_arr_rel_insert_input
  createdAt: timestamptz
  creator: account_obj_rel_insert_input
  creatorId: uuid
  focus: notebook_focus_obj_rel_insert_input
  focusId: uuid
  id: uuid
  status: String
  target: String
  updatedAt: timestamptz
}

"""aggregate max on columns"""
type notebook_target_max_fields {
  createdAt: timestamptz
  creatorId: uuid
  focusId: uuid
  id: uuid
  status: String
  target: String
  updatedAt: timestamptz
}

"""
order by max() on columns of table "notebook_target"
"""
input notebook_target_max_order_by {
  createdAt: order_by
  creatorId: order_by
  focusId: order_by
  id: order_by
  status: order_by
  target: order_by
  updatedAt: order_by
}

"""aggregate min on columns"""
type notebook_target_min_fields {
  createdAt: timestamptz
  creatorId: uuid
  focusId: uuid
  id: uuid
  status: String
  target: String
  updatedAt: timestamptz
}

"""
order by min() on columns of table "notebook_target"
"""
input notebook_target_min_order_by {
  createdAt: order_by
  creatorId: order_by
  focusId: order_by
  id: order_by
  status: order_by
  target: order_by
  updatedAt: order_by
}

"""
response of any mutation on the table "notebook_target"
"""
type notebook_target_mutation_response {
  """number of rows affected by the mutation"""
  affected_rows: Int!

  """data from the rows affected by the mutation"""
  returning: [notebook_target!]!
}

"""
input type for inserting object relation for remote table "notebook_target"
"""
input notebook_target_obj_rel_insert_input {
  data: notebook_target_insert_input!

  """upsert condition"""
  on_conflict: notebook_target_on_conflict
}

"""
on_conflict condition type for table "notebook_target"
"""
input notebook_target_on_conflict {
  constraint: notebook_target_constraint!
  update_columns: [notebook_target_update_column!]! = []
  where: notebook_target_bool_exp
}

"""Ordering options when selecting data from "notebook_target"."""
input notebook_target_order_by {
  actions_aggregate: notebook_action_aggregate_order_by
  createdAt: order_by
  creator: account_order_by
  creatorId: order_by
  focus: notebook_focus_order_by
  focusId: order_by
  id: order_by
  status: order_by
  target: order_by
  updatedAt: order_by
}

"""primary key columns input for table: notebook_target"""
input notebook_target_pk_columns_input {
  id: uuid!
}

"""
select columns of table "notebook_target"
"""
enum notebook_target_select_column {
  """column name"""
  createdAt

  """column name"""
  creatorId

  """column name"""
  focusId

  """column name"""
  id

  """column name"""
  status

  """column name"""
  target

  """column name"""
  updatedAt
}

"""
input type for updating data in table "notebook_target"
"""
input notebook_target_set_input {
  createdAt: timestamptz
  creatorId: uuid
  focusId: uuid
  id: uuid
  status: String
  target: String
  updatedAt: timestamptz
}

"""
Streaming cursor of the table "notebook_target"
"""
input notebook_target_stream_cursor_input {
  """Stream column input with initial value"""
  initial_value: notebook_target_stream_cursor_value_input!

  """cursor ordering"""
  ordering: cursor_ordering
}

"""Initial value of the column from where the streaming should start"""
input notebook_target_stream_cursor_value_input {
  createdAt: timestamptz
  creatorId: uuid
  focusId: uuid
  id: uuid
  status: String
  target: String
  updatedAt: timestamptz
}

"""
update columns of table "notebook_target"
"""
enum notebook_target_update_column {
  """column name"""
  createdAt

  """column name"""
  creatorId

  """column name"""
  focusId

  """column name"""
  id

  """column name"""
  status

  """column name"""
  target

  """column name"""
  updatedAt
}

input notebook_target_updates {
  """sets the columns of the filtered rows to the given values"""
  _set: notebook_target_set_input
  where: notebook_target_bool_exp!
}

"""
update columns of table "notebook"
"""
enum notebook_update_column {
  """column name"""
  beneficiaryId

  """column name"""
  contractEndDate

  """column name"""
  contractSignDate

  """column name"""
  contractStartDate

  """column name"""
  contractType

  """column name"""
  createdAt

  """column name"""
  educationLevel

  """column name"""
  geographicalArea

  """column name"""
  id

  """column name"""
  rightAre

  """column name"""
  rightAss

  """column name"""
  rightBonus

  """column name"""
  rightRqth

  """column name"""
  rightRsa

  """column name"""
  updatedAt

  """column name"""
  workSituation

  """column name"""
  workSituationDate

  """column name"""
  workSituationEndDate
}

input notebook_updates {
  """sets the columns of the filtered rows to the given values"""
  _set: notebook_set_input
  where: notebook_bool_exp!
}

"""column ordering options"""
enum order_by {
  """in ascending order, nulls last"""
  asc

  """in ascending order, nulls first"""
  asc_nulls_first

  """in ascending order, nulls last"""
  asc_nulls_last

  """in descending order, nulls first"""
  desc

  """in descending order, nulls first"""
  desc_nulls_first

  """in descending order, nulls last"""
  desc_nulls_last
}

"""Table des chargés d’orientation"""
type orientation_manager {
  """An object relationship"""
  account: account

  """An array relationship"""
  accounts(
    """distinct select on columns"""
    distinct_on: [account_select_column!]

    """limit the number of rows returned"""
    limit: Int

    """skip the first n rows. Use only with order_by"""
    offset: Int

    """sort the rows by one or more columns"""
    order_by: [account_order_by!]

    """filter the rows returned"""
    where: account_bool_exp
  ): [account!]!

  """An aggregate relationship"""
  accounts_aggregate(
    """distinct select on columns"""
    distinct_on: [account_select_column!]

    """limit the number of rows returned"""
    limit: Int

    """skip the first n rows. Use only with order_by"""
    offset: Int

    """sort the rows by one or more columns"""
    order_by: [account_order_by!]

    """filter the rows returned"""
    where: account_bool_exp
  ): account_aggregate!
  createdAt: timestamptz!

  """An object relationship"""
  deployment: deployment!
  deploymentId: uuid!
  email: citext!
  firstname: String
  id: uuid!
  lastname: String

  """liste des numéros de téléphones séparés par des virgules"""
  phoneNumbers: String
  updatedAt: timestamptz!
}

"""
aggregated selection of "orientation_manager"
"""
type orientation_manager_aggregate {
  aggregate: orientation_manager_aggregate_fields
  nodes: [orientation_manager!]!
}

input orientation_manager_aggregate_bool_exp {
  count: orientation_manager_aggregate_bool_exp_count
}

input orientation_manager_aggregate_bool_exp_count {
  arguments: [orientation_manager_select_column!]
  distinct: Boolean
  filter: orientation_manager_bool_exp
  predicate: Int_comparison_exp!
}

"""
aggregate fields of "orientation_manager"
"""
type orientation_manager_aggregate_fields {
  count(columns: [orientation_manager_select_column!], distinct: Boolean): Int!
  max: orientation_manager_max_fields
  min: orientation_manager_min_fields
}

"""
order by aggregate values of table "orientation_manager"
"""
input orientation_manager_aggregate_order_by {
  count: order_by
  max: orientation_manager_max_order_by
  min: orientation_manager_min_order_by
}

"""
input type for inserting array relation for remote table "orientation_manager"
"""
input orientation_manager_arr_rel_insert_input {
  data: [orientation_manager_insert_input!]!

  """upsert condition"""
  on_conflict: orientation_manager_on_conflict
}

"""
Boolean expression to filter rows from the table "orientation_manager". All fields are combined with a logical 'AND'.
"""
input orientation_manager_bool_exp {
  _and: [orientation_manager_bool_exp!]
  _not: orientation_manager_bool_exp
  _or: [orientation_manager_bool_exp!]
  account: account_bool_exp
  accounts: account_bool_exp
  accounts_aggregate: account_aggregate_bool_exp
  createdAt: timestamptz_comparison_exp
  deployment: deployment_bool_exp
  deploymentId: uuid_comparison_exp
  email: citext_comparison_exp
  firstname: String_comparison_exp
  id: uuid_comparison_exp
  lastname: String_comparison_exp
  phoneNumbers: String_comparison_exp
  updatedAt: timestamptz_comparison_exp
}

"""
unique or primary key constraints on table "orientation_manager"
"""
enum orientation_manager_constraint {
  """
  unique or primary key constraint on columns "email"
  """
  orientation_manager_email_key

  """
  unique or primary key constraint on columns "id"
  """
  orientation_manager_pkey
}

"""
input type for inserting data into table "orientation_manager"
"""
input orientation_manager_insert_input {
  account: account_obj_rel_insert_input
  accounts: account_arr_rel_insert_input
  createdAt: timestamptz
  deployment: deployment_obj_rel_insert_input
  deploymentId: uuid
  email: citext
  firstname: String
  id: uuid
  lastname: String

  """liste des numéros de téléphones séparés par des virgules"""
  phoneNumbers: String
  updatedAt: timestamptz
}

"""aggregate max on columns"""
type orientation_manager_max_fields {
  createdAt: timestamptz
  deploymentId: uuid
  email: citext
  firstname: String
  id: uuid
  lastname: String

  """liste des numéros de téléphones séparés par des virgules"""
  phoneNumbers: String
  updatedAt: timestamptz
}

"""
order by max() on columns of table "orientation_manager"
"""
input orientation_manager_max_order_by {
  createdAt: order_by
  deploymentId: order_by
  email: order_by
  firstname: order_by
  id: order_by
  lastname: order_by

  """liste des numéros de téléphones séparés par des virgules"""
  phoneNumbers: order_by
  updatedAt: order_by
}

"""aggregate min on columns"""
type orientation_manager_min_fields {
  createdAt: timestamptz
  deploymentId: uuid
  email: citext
  firstname: String
  id: uuid
  lastname: String

  """liste des numéros de téléphones séparés par des virgules"""
  phoneNumbers: String
  updatedAt: timestamptz
}

"""
order by min() on columns of table "orientation_manager"
"""
input orientation_manager_min_order_by {
  createdAt: order_by
  deploymentId: order_by
  email: order_by
  firstname: order_by
  id: order_by
  lastname: order_by

  """liste des numéros de téléphones séparés par des virgules"""
  phoneNumbers: order_by
  updatedAt: order_by
}

"""
response of any mutation on the table "orientation_manager"
"""
type orientation_manager_mutation_response {
  """number of rows affected by the mutation"""
  affected_rows: Int!

  """data from the rows affected by the mutation"""
  returning: [orientation_manager!]!
}

"""
input type for inserting object relation for remote table "orientation_manager"
"""
input orientation_manager_obj_rel_insert_input {
  data: orientation_manager_insert_input!

  """upsert condition"""
  on_conflict: orientation_manager_on_conflict
}

"""
on_conflict condition type for table "orientation_manager"
"""
input orientation_manager_on_conflict {
  constraint: orientation_manager_constraint!
  update_columns: [orientation_manager_update_column!]! = []
  where: orientation_manager_bool_exp
}

"""Ordering options when selecting data from "orientation_manager"."""
input orientation_manager_order_by {
  account: account_order_by
  accounts_aggregate: account_aggregate_order_by
  createdAt: order_by
  deployment: deployment_order_by
  deploymentId: order_by
  email: order_by
  firstname: order_by
  id: order_by
  lastname: order_by
  phoneNumbers: order_by
  updatedAt: order_by
}

"""primary key columns input for table: orientation_manager"""
input orientation_manager_pk_columns_input {
  id: uuid!
}

"""
select columns of table "orientation_manager"
"""
enum orientation_manager_select_column {
  """column name"""
  createdAt

  """column name"""
  deploymentId

  """column name"""
  email

  """column name"""
  firstname

  """column name"""
  id

  """column name"""
  lastname

  """column name"""
  phoneNumbers

  """column name"""
  updatedAt
}

"""
input type for updating data in table "orientation_manager"
"""
input orientation_manager_set_input {
  createdAt: timestamptz
  deploymentId: uuid
  email: citext
  firstname: String
  id: uuid
  lastname: String

  """liste des numéros de téléphones séparés par des virgules"""
  phoneNumbers: String
  updatedAt: timestamptz
}

"""
Streaming cursor of the table "orientation_manager"
"""
input orientation_manager_stream_cursor_input {
  """Stream column input with initial value"""
  initial_value: orientation_manager_stream_cursor_value_input!

  """cursor ordering"""
  ordering: cursor_ordering
}

"""Initial value of the column from where the streaming should start"""
input orientation_manager_stream_cursor_value_input {
  createdAt: timestamptz
  deploymentId: uuid
  email: citext
  firstname: String
  id: uuid
  lastname: String

  """liste des numéros de téléphones séparés par des virgules"""
  phoneNumbers: String
  updatedAt: timestamptz
}

"""
update columns of table "orientation_manager"
"""
enum orientation_manager_update_column {
  """column name"""
  createdAt

  """column name"""
  deploymentId

  """column name"""
  email

  """column name"""
  firstname

  """column name"""
  id

  """column name"""
  lastname

  """column name"""
  phoneNumbers

  """column name"""
  updatedAt
}

input orientation_manager_updates {
  """sets the columns of the filtered rows to the given values"""
  _set: orientation_manager_set_input
  where: orientation_manager_bool_exp!
}

"""
columns and relationships of "orientation_request"
"""
type orientation_request {
  """An object relationship"""
  beneficiary: beneficiary
  beneficiaryId: uuid!
  createdAt: timestamptz!
  decidedAt: timestamptz

  """An object relationship"""
  decidedOrientationType: orientation_type
  decidedOrientationTypeId: orientation_type_enum

  """An object relationship"""
  decided_orientation_type: orientation_type
  id: uuid!
  reason: String

  """An object relationship"""
  requestedOrientationType: orientation_type
  requestedOrientationTypeId: orientation_type_enum!

  """An object relationship"""
  requested_orientation_type: orientation_type

  """An object relationship"""
  requestor: account
  requestor_account_id: uuid!
  status: String
  updatedAt: timestamptz!
}

"""
aggregated selection of "orientation_request"
"""
type orientation_request_aggregate {
  aggregate: orientation_request_aggregate_fields
  nodes: [orientation_request!]!
}

input orientation_request_aggregate_bool_exp {
  count: orientation_request_aggregate_bool_exp_count
}

input orientation_request_aggregate_bool_exp_count {
  arguments: [orientation_request_select_column!]
  distinct: Boolean
  filter: orientation_request_bool_exp
  predicate: Int_comparison_exp!
}

"""
aggregate fields of "orientation_request"
"""
type orientation_request_aggregate_fields {
  count(columns: [orientation_request_select_column!], distinct: Boolean): Int!
  max: orientation_request_max_fields
  min: orientation_request_min_fields
}

"""
order by aggregate values of table "orientation_request"
"""
input orientation_request_aggregate_order_by {
  count: order_by
  max: orientation_request_max_order_by
  min: orientation_request_min_order_by
}

"""
input type for inserting array relation for remote table "orientation_request"
"""
input orientation_request_arr_rel_insert_input {
  data: [orientation_request_insert_input!]!

  """upsert condition"""
  on_conflict: orientation_request_on_conflict
}

"""
Boolean expression to filter rows from the table "orientation_request". All fields are combined with a logical 'AND'.
"""
input orientation_request_bool_exp {
  _and: [orientation_request_bool_exp!]
  _not: orientation_request_bool_exp
  _or: [orientation_request_bool_exp!]
  beneficiary: beneficiary_bool_exp
  beneficiaryId: uuid_comparison_exp
  createdAt: timestamptz_comparison_exp
  decidedAt: timestamptz_comparison_exp
  decidedOrientationType: orientation_type_bool_exp
  decidedOrientationTypeId: orientation_type_enum_comparison_exp
  decided_orientation_type: orientation_type_bool_exp
  id: uuid_comparison_exp
  reason: String_comparison_exp
  requestedOrientationType: orientation_type_bool_exp
  requestedOrientationTypeId: orientation_type_enum_comparison_exp
  requested_orientation_type: orientation_type_bool_exp
  requestor: account_bool_exp
  requestor_account_id: uuid_comparison_exp
  status: String_comparison_exp
  updatedAt: timestamptz_comparison_exp
}

"""
unique or primary key constraints on table "orientation_request"
"""
enum orientation_request_constraint {
  """
  unique or primary key constraint on columns "id"
  """
  orientation_request_pkey
}

"""
input type for inserting data into table "orientation_request"
"""
input orientation_request_insert_input {
  beneficiary: beneficiary_obj_rel_insert_input
  beneficiaryId: uuid
  createdAt: timestamptz
  decidedAt: timestamptz
  decidedOrientationType: orientation_type_obj_rel_insert_input
  decidedOrientationTypeId: orientation_type_enum
  decided_orientation_type: orientation_type_obj_rel_insert_input
  id: uuid
  reason: String
  requestedOrientationType: orientation_type_obj_rel_insert_input
  requestedOrientationTypeId: orientation_type_enum
  requested_orientation_type: orientation_type_obj_rel_insert_input
  requestor: account_obj_rel_insert_input
  requestor_account_id: uuid
  status: String
  updatedAt: timestamptz
}

"""aggregate max on columns"""
type orientation_request_max_fields {
  beneficiaryId: uuid
  createdAt: timestamptz
  decidedAt: timestamptz
  id: uuid
  reason: String
  requestor_account_id: uuid
  status: String
  updatedAt: timestamptz
}

"""
order by max() on columns of table "orientation_request"
"""
input orientation_request_max_order_by {
  beneficiaryId: order_by
  createdAt: order_by
  decidedAt: order_by
  id: order_by
  reason: order_by
  requestor_account_id: order_by
  status: order_by
  updatedAt: order_by
}

"""aggregate min on columns"""
type orientation_request_min_fields {
  beneficiaryId: uuid
  createdAt: timestamptz
  decidedAt: timestamptz
  id: uuid
  reason: String
  requestor_account_id: uuid
  status: String
  updatedAt: timestamptz
}

"""
order by min() on columns of table "orientation_request"
"""
input orientation_request_min_order_by {
  beneficiaryId: order_by
  createdAt: order_by
  decidedAt: order_by
  id: order_by
  reason: order_by
  requestor_account_id: order_by
  status: order_by
  updatedAt: order_by
}

"""
response of any mutation on the table "orientation_request"
"""
type orientation_request_mutation_response {
  """number of rows affected by the mutation"""
  affected_rows: Int!

  """data from the rows affected by the mutation"""
  returning: [orientation_request!]!
}

"""
on_conflict condition type for table "orientation_request"
"""
input orientation_request_on_conflict {
  constraint: orientation_request_constraint!
  update_columns: [orientation_request_update_column!]! = []
  where: orientation_request_bool_exp
}

"""Ordering options when selecting data from "orientation_request"."""
input orientation_request_order_by {
  beneficiary: beneficiary_order_by
  beneficiaryId: order_by
  createdAt: order_by
  decidedAt: order_by
  decidedOrientationType: orientation_type_order_by
  decidedOrientationTypeId: order_by
  decided_orientation_type: orientation_type_order_by
  id: order_by
  reason: order_by
  requestedOrientationType: orientation_type_order_by
  requestedOrientationTypeId: order_by
  requested_orientation_type: orientation_type_order_by
  requestor: account_order_by
  requestor_account_id: order_by
  status: order_by
  updatedAt: order_by
}

"""primary key columns input for table: orientation_request"""
input orientation_request_pk_columns_input {
  id: uuid!
}

"""
select columns of table "orientation_request"
"""
enum orientation_request_select_column {
  """column name"""
  beneficiaryId

  """column name"""
  createdAt

  """column name"""
  decidedAt

  """column name"""
  decidedOrientationTypeId

  """column name"""
  id

  """column name"""
  reason

  """column name"""
  requestedOrientationTypeId

  """column name"""
  requestor_account_id

  """column name"""
  status

  """column name"""
  updatedAt
}

"""
input type for updating data in table "orientation_request"
"""
input orientation_request_set_input {
  beneficiaryId: uuid
  createdAt: timestamptz
  decidedAt: timestamptz
  decidedOrientationTypeId: orientation_type_enum
  id: uuid
  reason: String
  requestedOrientationTypeId: orientation_type_enum
  requestor_account_id: uuid
  status: String
  updatedAt: timestamptz
}

"""
Streaming cursor of the table "orientation_request"
"""
input orientation_request_stream_cursor_input {
  """Stream column input with initial value"""
  initial_value: orientation_request_stream_cursor_value_input!

  """cursor ordering"""
  ordering: cursor_ordering
}

"""Initial value of the column from where the streaming should start"""
input orientation_request_stream_cursor_value_input {
  beneficiaryId: uuid
  createdAt: timestamptz
  decidedAt: timestamptz
  decidedOrientationTypeId: orientation_type_enum
  id: uuid
  reason: String
  requestedOrientationTypeId: orientation_type_enum
  requestor_account_id: uuid
  status: String
  updatedAt: timestamptz
}

"""
update columns of table "orientation_request"
"""
enum orientation_request_update_column {
  """column name"""
  beneficiaryId

  """column name"""
  createdAt

  """column name"""
  decidedAt

  """column name"""
  decidedOrientationTypeId

  """column name"""
  id

  """column name"""
  reason

  """column name"""
  requestedOrientationTypeId

  """column name"""
  requestor_account_id

  """column name"""
  status

  """column name"""
  updatedAt
}

input orientation_request_updates {
  """sets the columns of the filtered rows to the given values"""
  _set: orientation_request_set_input
  where: orientation_request_bool_exp!
}

"""table contenant les différents types d’orientation"""
type orientation_type {
  id: String!
  label: String!

  """An array relationship"""
  notebook_infos(
    """distinct select on columns"""
    distinct_on: [notebook_info_select_column!]

    """limit the number of rows returned"""
    limit: Int

    """skip the first n rows. Use only with order_by"""
    offset: Int

    """sort the rows by one or more columns"""
    order_by: [notebook_info_order_by!]

    """filter the rows returned"""
    where: notebook_info_bool_exp
  ): [notebook_info!]!

  """An aggregate relationship"""
  notebook_infos_aggregate(
    """distinct select on columns"""
    distinct_on: [notebook_info_select_column!]

    """limit the number of rows returned"""
    limit: Int

    """skip the first n rows. Use only with order_by"""
    offset: Int

    """sort the rows by one or more columns"""
    order_by: [notebook_info_order_by!]

    """filter the rows returned"""
    where: notebook_info_bool_exp
  ): notebook_info_aggregate!
}

"""
aggregated selection of "orientation_type"
"""
type orientation_type_aggregate {
  aggregate: orientation_type_aggregate_fields
  nodes: [orientation_type!]!
}

"""
aggregate fields of "orientation_type"
"""
type orientation_type_aggregate_fields {
  count(columns: [orientation_type_select_column!], distinct: Boolean): Int!
  max: orientation_type_max_fields
  min: orientation_type_min_fields
}

"""
Boolean expression to filter rows from the table "orientation_type". All fields are combined with a logical 'AND'.
"""
input orientation_type_bool_exp {
  _and: [orientation_type_bool_exp!]
  _not: orientation_type_bool_exp
  _or: [orientation_type_bool_exp!]
  id: String_comparison_exp
  label: String_comparison_exp
  notebook_infos: notebook_info_bool_exp
  notebook_infos_aggregate: notebook_info_aggregate_bool_exp
}

"""
unique or primary key constraints on table "orientation_type"
"""
enum orientation_type_constraint {
  """
  unique or primary key constraint on columns "id"
  """
  orientation_type_pkey
}

enum orientation_type_enum {
  """Professionnel"""
  pro

  """Social"""
  social

  """Socio-professionnel"""
  sociopro
}

"""
Boolean expression to compare columns of type "orientation_type_enum". All fields are combined with logical 'AND'.
"""
input orientation_type_enum_comparison_exp {
  _eq: orientation_type_enum
  _in: [orientation_type_enum!]
  _is_null: Boolean
  _neq: orientation_type_enum
  _nin: [orientation_type_enum!]
}

"""
input type for inserting data into table "orientation_type"
"""
input orientation_type_insert_input {
  id: String
  label: String
  notebook_infos: notebook_info_arr_rel_insert_input
}

"""aggregate max on columns"""
type orientation_type_max_fields {
  id: String
  label: String
}

"""aggregate min on columns"""
type orientation_type_min_fields {
  id: String
  label: String
}

"""
response of any mutation on the table "orientation_type"
"""
type orientation_type_mutation_response {
  """number of rows affected by the mutation"""
  affected_rows: Int!

  """data from the rows affected by the mutation"""
  returning: [orientation_type!]!
}

"""
input type for inserting object relation for remote table "orientation_type"
"""
input orientation_type_obj_rel_insert_input {
  data: orientation_type_insert_input!

  """upsert condition"""
  on_conflict: orientation_type_on_conflict
}

"""
on_conflict condition type for table "orientation_type"
"""
input orientation_type_on_conflict {
  constraint: orientation_type_constraint!
  update_columns: [orientation_type_update_column!]! = []
  where: orientation_type_bool_exp
}

"""Ordering options when selecting data from "orientation_type"."""
input orientation_type_order_by {
  id: order_by
  label: order_by
  notebook_infos_aggregate: notebook_info_aggregate_order_by
}

"""primary key columns input for table: orientation_type"""
input orientation_type_pk_columns_input {
  id: String!
}

"""
select columns of table "orientation_type"
"""
enum orientation_type_select_column {
  """column name"""
  id

  """column name"""
  label
}

"""
input type for updating data in table "orientation_type"
"""
input orientation_type_set_input {
  id: String
  label: String
}

"""
Streaming cursor of the table "orientation_type"
"""
input orientation_type_stream_cursor_input {
  """Stream column input with initial value"""
  initial_value: orientation_type_stream_cursor_value_input!

  """cursor ordering"""
  ordering: cursor_ordering
}

"""Initial value of the column from where the streaming should start"""
input orientation_type_stream_cursor_value_input {
  id: String
  label: String
}

"""
update columns of table "orientation_type"
"""
enum orientation_type_update_column {
  """column name"""
  id

  """column name"""
  label
}

input orientation_type_updates {
  """sets the columns of the filtered rows to the given values"""
  _set: orientation_type_set_input
  where: orientation_type_bool_exp!
}

"""
columns and relationships of "professional"
"""
type professional {
  """An object relationship"""
  account: account
  createdAt: timestamptz!
  email: citext!
  firstname: String!
  id: uuid!
  lastname: String!
  mobileNumber: String
  position: String

  """An object relationship"""
  structure: structure!
  structureId: uuid!
  updatedAt: timestamptz!
}

"""
aggregated selection of "professional"
"""
type professional_aggregate {
  aggregate: professional_aggregate_fields
  nodes: [professional!]!
}

input professional_aggregate_bool_exp {
  count: professional_aggregate_bool_exp_count
}

input professional_aggregate_bool_exp_count {
  arguments: [professional_select_column!]
  distinct: Boolean
  filter: professional_bool_exp
  predicate: Int_comparison_exp!
}

"""
aggregate fields of "professional"
"""
type professional_aggregate_fields {
  count(columns: [professional_select_column!], distinct: Boolean): Int!
  max: professional_max_fields
  min: professional_min_fields
}

"""
order by aggregate values of table "professional"
"""
input professional_aggregate_order_by {
  count: order_by
  max: professional_max_order_by
  min: professional_min_order_by
}

"""
input type for inserting array relation for remote table "professional"
"""
input professional_arr_rel_insert_input {
  data: [professional_insert_input!]!

  """upsert condition"""
  on_conflict: professional_on_conflict
}

"""
Boolean expression to filter rows from the table "professional". All fields are combined with a logical 'AND'.
"""
input professional_bool_exp {
  _and: [professional_bool_exp!]
  _not: professional_bool_exp
  _or: [professional_bool_exp!]
  account: account_bool_exp
  createdAt: timestamptz_comparison_exp
  email: citext_comparison_exp
  firstname: String_comparison_exp
  id: uuid_comparison_exp
  lastname: String_comparison_exp
  mobileNumber: String_comparison_exp
  position: String_comparison_exp
  structure: structure_bool_exp
  structureId: uuid_comparison_exp
  updatedAt: timestamptz_comparison_exp
}

"""
unique or primary key constraints on table "professional"
"""
enum professional_constraint {
  """
  unique or primary key constraint on columns "email"
  """
  professional_email_unique

  """
  unique or primary key constraint on columns "id"
  """
  professional_pkey
}

"""
input type for inserting data into table "professional"
"""
input professional_insert_input {
  account: account_obj_rel_insert_input
  createdAt: timestamptz
  email: citext
  firstname: String
  id: uuid
  lastname: String
  mobileNumber: String
  position: String
  structure: structure_obj_rel_insert_input
  structureId: uuid
  updatedAt: timestamptz
}

"""aggregate max on columns"""
type professional_max_fields {
  createdAt: timestamptz
  email: citext
  firstname: String
  id: uuid
  lastname: String
  mobileNumber: String
  position: String
  structureId: uuid
  updatedAt: timestamptz
}

"""
order by max() on columns of table "professional"
"""
input professional_max_order_by {
  createdAt: order_by
  email: order_by
  firstname: order_by
  id: order_by
  lastname: order_by
  mobileNumber: order_by
  position: order_by
  structureId: order_by
  updatedAt: order_by
}

"""aggregate min on columns"""
type professional_min_fields {
  createdAt: timestamptz
  email: citext
  firstname: String
  id: uuid
  lastname: String
  mobileNumber: String
  position: String
  structureId: uuid
  updatedAt: timestamptz
}

"""
order by min() on columns of table "professional"
"""
input professional_min_order_by {
  createdAt: order_by
  email: order_by
  firstname: order_by
  id: order_by
  lastname: order_by
  mobileNumber: order_by
  position: order_by
  structureId: order_by
  updatedAt: order_by
}

"""
response of any mutation on the table "professional"
"""
type professional_mutation_response {
  """number of rows affected by the mutation"""
  affected_rows: Int!

  """data from the rows affected by the mutation"""
  returning: [professional!]!
}

"""
input type for inserting object relation for remote table "professional"
"""
input professional_obj_rel_insert_input {
  data: professional_insert_input!

  """upsert condition"""
  on_conflict: professional_on_conflict
}

"""
on_conflict condition type for table "professional"
"""
input professional_on_conflict {
  constraint: professional_constraint!
  update_columns: [professional_update_column!]! = []
  where: professional_bool_exp
}

"""Ordering options when selecting data from "professional"."""
input professional_order_by {
  account: account_order_by
  createdAt: order_by
  email: order_by
  firstname: order_by
  id: order_by
  lastname: order_by
  mobileNumber: order_by
  position: order_by
  structure: structure_order_by
  structureId: order_by
  updatedAt: order_by
}

"""primary key columns input for table: professional"""
input professional_pk_columns_input {
  id: uuid!
}

"""
select columns of table "professional"
"""
enum professional_select_column {
  """column name"""
  createdAt

  """column name"""
  email

  """column name"""
  firstname

  """column name"""
  id

  """column name"""
  lastname

  """column name"""
  mobileNumber

  """column name"""
  position

  """column name"""
  structureId

  """column name"""
  updatedAt
}

"""
input type for updating data in table "professional"
"""
input professional_set_input {
  createdAt: timestamptz
  email: citext
  firstname: String
  id: uuid
  lastname: String
  mobileNumber: String
  position: String
  structureId: uuid
  updatedAt: timestamptz
}

"""
Streaming cursor of the table "professional"
"""
input professional_stream_cursor_input {
  """Stream column input with initial value"""
  initial_value: professional_stream_cursor_value_input!

  """cursor ordering"""
  ordering: cursor_ordering
}

"""Initial value of the column from where the streaming should start"""
input professional_stream_cursor_value_input {
  createdAt: timestamptz
  email: citext
  firstname: String
  id: uuid
  lastname: String
  mobileNumber: String
  position: String
  structureId: uuid
  updatedAt: timestamptz
}

"""
update columns of table "professional"
"""
enum professional_update_column {
  """column name"""
  createdAt

  """column name"""
  email

  """column name"""
  firstname

  """column name"""
  id

  """column name"""
  lastname

  """column name"""
  mobileNumber

  """column name"""
  position

  """column name"""
  structureId

  """column name"""
  updatedAt
}

input professional_updates {
  """sets the columns of the filtered rows to the given values"""
  _set: professional_set_input
  where: professional_bool_exp!
}

type query_root {
  """
  fetch data from the table: "account"
  """
  account(
    """distinct select on columns"""
    distinct_on: [account_select_column!]

    """limit the number of rows returned"""
    limit: Int

    """skip the first n rows. Use only with order_by"""
    offset: Int

    """sort the rows by one or more columns"""
    order_by: [account_order_by!]

    """filter the rows returned"""
    where: account_bool_exp
  ): [account!]!

  """
  fetch aggregated fields from the table: "account"
  """
  account_aggregate(
    """distinct select on columns"""
    distinct_on: [account_select_column!]

    """limit the number of rows returned"""
    limit: Int

    """skip the first n rows. Use only with order_by"""
    offset: Int

    """sort the rows by one or more columns"""
    order_by: [account_order_by!]

    """filter the rows returned"""
    where: account_bool_exp
  ): account_aggregate!

  """fetch data from the table: "account" using primary key columns"""
  account_by_pk(id: uuid!): account

  """
  fetch data from the table: "account_info"
  """
  account_info(
    """distinct select on columns"""
    distinct_on: [account_info_select_column!]

    """limit the number of rows returned"""
    limit: Int

    """skip the first n rows. Use only with order_by"""
    offset: Int

    """sort the rows by one or more columns"""
    order_by: [account_info_order_by!]

    """filter the rows returned"""
    where: account_info_bool_exp
  ): [account_info!]!

  """
  fetch aggregated fields from the table: "account_info"
  """
  account_info_aggregate(
    """distinct select on columns"""
    distinct_on: [account_info_select_column!]

    """limit the number of rows returned"""
    limit: Int

    """skip the first n rows. Use only with order_by"""
    offset: Int

    """sort the rows by one or more columns"""
    order_by: [account_info_order_by!]

    """filter the rows returned"""
    where: account_info_bool_exp
  ): account_info_aggregate!

  """
  fetch data from the table: "admin_cdb"
  """
  admin_cdb(
    """distinct select on columns"""
    distinct_on: [admin_cdb_select_column!]

    """limit the number of rows returned"""
    limit: Int

    """skip the first n rows. Use only with order_by"""
    offset: Int

    """sort the rows by one or more columns"""
    order_by: [admin_cdb_order_by!]

    """filter the rows returned"""
    where: admin_cdb_bool_exp
  ): [admin_cdb!]!

  """
  fetch aggregated fields from the table: "admin_cdb"
  """
  admin_cdb_aggregate(
    """distinct select on columns"""
    distinct_on: [admin_cdb_select_column!]

    """limit the number of rows returned"""
    limit: Int

    """skip the first n rows. Use only with order_by"""
    offset: Int

    """sort the rows by one or more columns"""
    order_by: [admin_cdb_order_by!]

    """filter the rows returned"""
    where: admin_cdb_bool_exp
  ): admin_cdb_aggregate!

  """fetch data from the table: "admin_cdb" using primary key columns"""
  admin_cdb_by_pk(id: uuid!): admin_cdb

  """
  fetch data from the table: "admin_structure"
  """
  admin_structure(
    """distinct select on columns"""
    distinct_on: [admin_structure_select_column!]

    """limit the number of rows returned"""
    limit: Int

    """skip the first n rows. Use only with order_by"""
    offset: Int

    """sort the rows by one or more columns"""
    order_by: [admin_structure_order_by!]

    """filter the rows returned"""
    where: admin_structure_bool_exp
  ): [admin_structure!]!

  """
  fetch aggregated fields from the table: "admin_structure"
  """
  admin_structure_aggregate(
    """distinct select on columns"""
    distinct_on: [admin_structure_select_column!]

    """limit the number of rows returned"""
    limit: Int

    """skip the first n rows. Use only with order_by"""
    offset: Int

    """sort the rows by one or more columns"""
    order_by: [admin_structure_order_by!]

    """filter the rows returned"""
    where: admin_structure_bool_exp
  ): admin_structure_aggregate!

  """fetch data from the table: "admin_structure" using primary key columns"""
  admin_structure_by_pk(id: uuid!): admin_structure

  """
  fetch data from the table: "admin_structure_structure"
  """
  admin_structure_structure(
    """distinct select on columns"""
    distinct_on: [admin_structure_structure_select_column!]

    """limit the number of rows returned"""
    limit: Int

    """skip the first n rows. Use only with order_by"""
    offset: Int

    """sort the rows by one or more columns"""
    order_by: [admin_structure_structure_order_by!]

    """filter the rows returned"""
    where: admin_structure_structure_bool_exp
  ): [admin_structure_structure!]!

  """
  fetch aggregated fields from the table: "admin_structure_structure"
  """
  admin_structure_structure_aggregate(
    """distinct select on columns"""
    distinct_on: [admin_structure_structure_select_column!]

    """limit the number of rows returned"""
    limit: Int

    """skip the first n rows. Use only with order_by"""
    offset: Int

    """sort the rows by one or more columns"""
    order_by: [admin_structure_structure_order_by!]

    """filter the rows returned"""
    where: admin_structure_structure_bool_exp
  ): admin_structure_structure_aggregate!

  """
  fetch data from the table: "admin_structure_structure" using primary key columns
  """
  admin_structure_structure_by_pk(id: uuid!): admin_structure_structure

  """
  fetch data from the table: "beneficiary"
  """
  beneficiary(
    """distinct select on columns"""
    distinct_on: [beneficiary_select_column!]

    """limit the number of rows returned"""
    limit: Int

    """skip the first n rows. Use only with order_by"""
    offset: Int

    """sort the rows by one or more columns"""
    order_by: [beneficiary_order_by!]

    """filter the rows returned"""
    where: beneficiary_bool_exp
  ): [beneficiary!]!

  """
  fetch aggregated fields from the table: "beneficiary"
  """
  beneficiary_aggregate(
    """distinct select on columns"""
    distinct_on: [beneficiary_select_column!]

    """limit the number of rows returned"""
    limit: Int

    """skip the first n rows. Use only with order_by"""
    offset: Int

    """sort the rows by one or more columns"""
    order_by: [beneficiary_order_by!]

    """filter the rows returned"""
    where: beneficiary_bool_exp
  ): beneficiary_aggregate!

  """fetch data from the table: "beneficiary" using primary key columns"""
  beneficiary_by_pk(id: uuid!): beneficiary

  """
  fetch data from the table: "beneficiary_structure"
  """
  beneficiary_structure(
    """distinct select on columns"""
    distinct_on: [beneficiary_structure_select_column!]

    """limit the number of rows returned"""
    limit: Int

    """skip the first n rows. Use only with order_by"""
    offset: Int

    """sort the rows by one or more columns"""
    order_by: [beneficiary_structure_order_by!]

    """filter the rows returned"""
    where: beneficiary_structure_bool_exp
  ): [beneficiary_structure!]!

  """
  fetch aggregated fields from the table: "beneficiary_structure"
  """
  beneficiary_structure_aggregate(
    """distinct select on columns"""
    distinct_on: [beneficiary_structure_select_column!]

    """limit the number of rows returned"""
    limit: Int

    """skip the first n rows. Use only with order_by"""
    offset: Int

    """sort the rows by one or more columns"""
    order_by: [beneficiary_structure_order_by!]

    """filter the rows returned"""
    where: beneficiary_structure_bool_exp
  ): beneficiary_structure_aggregate!

  """
  fetch data from the table: "beneficiary_structure" using primary key columns
  """
  beneficiary_structure_by_pk(id: uuid!): beneficiary_structure

  """
  fetch data from the table: "deployment"
  """
  deployment(
    """distinct select on columns"""
    distinct_on: [deployment_select_column!]

    """limit the number of rows returned"""
    limit: Int

    """skip the first n rows. Use only with order_by"""
    offset: Int

    """sort the rows by one or more columns"""
    order_by: [deployment_order_by!]

    """filter the rows returned"""
    where: deployment_bool_exp
  ): [deployment!]!

  """
  fetch aggregated fields from the table: "deployment"
  """
  deployment_aggregate(
    """distinct select on columns"""
    distinct_on: [deployment_select_column!]

    """limit the number of rows returned"""
    limit: Int

    """skip the first n rows. Use only with order_by"""
    offset: Int

    """sort the rows by one or more columns"""
    order_by: [deployment_order_by!]

    """filter the rows returned"""
    where: deployment_bool_exp
  ): deployment_aggregate!

  """fetch data from the table: "deployment" using primary key columns"""
  deployment_by_pk(id: uuid!): deployment

  """An array relationship"""
  external_data(
    """distinct select on columns"""
    distinct_on: [external_data_select_column!]

    """limit the number of rows returned"""
    limit: Int

    """skip the first n rows. Use only with order_by"""
    offset: Int

    """sort the rows by one or more columns"""
    order_by: [external_data_order_by!]

    """filter the rows returned"""
    where: external_data_bool_exp
  ): [external_data!]!

  """An aggregate relationship"""
  external_data_aggregate(
    """distinct select on columns"""
    distinct_on: [external_data_select_column!]

    """limit the number of rows returned"""
    limit: Int

    """skip the first n rows. Use only with order_by"""
    offset: Int

    """sort the rows by one or more columns"""
    order_by: [external_data_order_by!]

    """filter the rows returned"""
    where: external_data_bool_exp
  ): external_data_aggregate!

  """fetch data from the table: "external_data" using primary key columns"""
  external_data_by_pk(id: uuid!): external_data

  """
  fetch data from the table: "external_data_info"
  """
  external_data_info(
    """distinct select on columns"""
    distinct_on: [external_data_info_select_column!]

    """limit the number of rows returned"""
    limit: Int

    """skip the first n rows. Use only with order_by"""
    offset: Int

    """sort the rows by one or more columns"""
    order_by: [external_data_info_order_by!]

    """filter the rows returned"""
    where: external_data_info_bool_exp
  ): [external_data_info!]!

  """
  fetch aggregated fields from the table: "external_data_info"
  """
  external_data_info_aggregate(
    """distinct select on columns"""
    distinct_on: [external_data_info_select_column!]

    """limit the number of rows returned"""
    limit: Int

    """skip the first n rows. Use only with order_by"""
    offset: Int

    """sort the rows by one or more columns"""
    order_by: [external_data_info_order_by!]

    """filter the rows returned"""
    where: external_data_info_bool_exp
  ): external_data_info_aggregate!

  """
  fetch data from the table: "external_data_info" using primary key columns
  """
  external_data_info_by_pk(external_data_id: uuid!): external_data_info

  """
  fetch data from the table: "external_source"
  """
  external_source(
    """distinct select on columns"""
    distinct_on: [external_source_select_column!]

    """limit the number of rows returned"""
    limit: Int

    """skip the first n rows. Use only with order_by"""
    offset: Int

    """sort the rows by one or more columns"""
    order_by: [external_source_order_by!]

    """filter the rows returned"""
    where: external_source_bool_exp
  ): [external_source!]!

  """
  fetch aggregated fields from the table: "external_source"
  """
  external_source_aggregate(
    """distinct select on columns"""
    distinct_on: [external_source_select_column!]

    """limit the number of rows returned"""
    limit: Int

    """skip the first n rows. Use only with order_by"""
    offset: Int

    """sort the rows by one or more columns"""
    order_by: [external_source_order_by!]

    """filter the rows returned"""
    where: external_source_bool_exp
  ): external_source_aggregate!

  """fetch data from the table: "external_source" using primary key columns"""
  external_source_by_pk(value: String!): external_source

  """
  fetch data from the table: "manager"
  """
  manager(
    """distinct select on columns"""
    distinct_on: [manager_select_column!]

    """limit the number of rows returned"""
    limit: Int

    """skip the first n rows. Use only with order_by"""
    offset: Int

    """sort the rows by one or more columns"""
    order_by: [manager_order_by!]

    """filter the rows returned"""
    where: manager_bool_exp
  ): [manager!]!

  """
  fetch aggregated fields from the table: "manager"
  """
  manager_aggregate(
    """distinct select on columns"""
    distinct_on: [manager_select_column!]

    """limit the number of rows returned"""
    limit: Int

    """skip the first n rows. Use only with order_by"""
    offset: Int

    """sort the rows by one or more columns"""
    order_by: [manager_order_by!]

    """filter the rows returned"""
    where: manager_bool_exp
  ): manager_aggregate!

  """fetch data from the table: "manager" using primary key columns"""
  manager_by_pk(id: uuid!): manager

  """
  fetch data from the table: "notebook"
  """
  notebook(
    """distinct select on columns"""
    distinct_on: [notebook_select_column!]

    """limit the number of rows returned"""
    limit: Int

    """skip the first n rows. Use only with order_by"""
    offset: Int

    """sort the rows by one or more columns"""
    order_by: [notebook_order_by!]

    """filter the rows returned"""
    where: notebook_bool_exp
  ): [notebook!]!

  """
  fetch data from the table: "notebook_action"
  """
  notebook_action(
    """distinct select on columns"""
    distinct_on: [notebook_action_select_column!]

    """limit the number of rows returned"""
    limit: Int

    """skip the first n rows. Use only with order_by"""
    offset: Int

    """sort the rows by one or more columns"""
    order_by: [notebook_action_order_by!]

    """filter the rows returned"""
    where: notebook_action_bool_exp
  ): [notebook_action!]!

  """
  fetch aggregated fields from the table: "notebook_action"
  """
  notebook_action_aggregate(
    """distinct select on columns"""
    distinct_on: [notebook_action_select_column!]

    """limit the number of rows returned"""
    limit: Int

    """skip the first n rows. Use only with order_by"""
    offset: Int

    """sort the rows by one or more columns"""
    order_by: [notebook_action_order_by!]

    """filter the rows returned"""
    where: notebook_action_bool_exp
  ): notebook_action_aggregate!

  """fetch data from the table: "notebook_action" using primary key columns"""
  notebook_action_by_pk(id: uuid!): notebook_action

  """
  fetch aggregated fields from the table: "notebook"
  """
  notebook_aggregate(
    """distinct select on columns"""
    distinct_on: [notebook_select_column!]

    """limit the number of rows returned"""
    limit: Int

    """skip the first n rows. Use only with order_by"""
    offset: Int

    """sort the rows by one or more columns"""
    order_by: [notebook_order_by!]

    """filter the rows returned"""
    where: notebook_bool_exp
  ): notebook_aggregate!

  """
  fetch data from the table: "notebook_appointment"
  """
  notebook_appointment(
    """distinct select on columns"""
    distinct_on: [notebook_appointment_select_column!]

    """limit the number of rows returned"""
    limit: Int

    """skip the first n rows. Use only with order_by"""
    offset: Int

    """sort the rows by one or more columns"""
    order_by: [notebook_appointment_order_by!]

    """filter the rows returned"""
    where: notebook_appointment_bool_exp
  ): [notebook_appointment!]!

  """
  fetch aggregated fields from the table: "notebook_appointment"
  """
  notebook_appointment_aggregate(
    """distinct select on columns"""
    distinct_on: [notebook_appointment_select_column!]

    """limit the number of rows returned"""
    limit: Int

    """skip the first n rows. Use only with order_by"""
    offset: Int

    """sort the rows by one or more columns"""
    order_by: [notebook_appointment_order_by!]

    """filter the rows returned"""
    where: notebook_appointment_bool_exp
  ): notebook_appointment_aggregate!

  """
  fetch data from the table: "notebook_appointment" using primary key columns
  """
  notebook_appointment_by_pk(id: uuid!): notebook_appointment

  """fetch data from the table: "notebook" using primary key columns"""
  notebook_by_pk(id: uuid!): notebook

  """
  fetch data from the table: "notebook_event"
  """
  notebook_event(
    """distinct select on columns"""
    distinct_on: [notebook_event_select_column!]

    """limit the number of rows returned"""
    limit: Int

    """skip the first n rows. Use only with order_by"""
    offset: Int

    """sort the rows by one or more columns"""
    order_by: [notebook_event_order_by!]

    """filter the rows returned"""
    where: notebook_event_bool_exp
  ): [notebook_event!]!

  """
  fetch aggregated fields from the table: "notebook_event"
  """
  notebook_event_aggregate(
    """distinct select on columns"""
    distinct_on: [notebook_event_select_column!]

    """limit the number of rows returned"""
    limit: Int

    """skip the first n rows. Use only with order_by"""
    offset: Int

    """sort the rows by one or more columns"""
    order_by: [notebook_event_order_by!]

    """filter the rows returned"""
    where: notebook_event_bool_exp
  ): notebook_event_aggregate!

  """fetch data from the table: "notebook_event" using primary key columns"""
  notebook_event_by_pk(id: uuid!): notebook_event

  """
  fetch data from the table: "notebook_event_type"
  """
  notebook_event_type(
    """distinct select on columns"""
    distinct_on: [notebook_event_type_select_column!]

    """limit the number of rows returned"""
    limit: Int

    """skip the first n rows. Use only with order_by"""
    offset: Int

    """sort the rows by one or more columns"""
    order_by: [notebook_event_type_order_by!]

    """filter the rows returned"""
    where: notebook_event_type_bool_exp
  ): [notebook_event_type!]!

  """
  fetch aggregated fields from the table: "notebook_event_type"
  """
  notebook_event_type_aggregate(
    """distinct select on columns"""
    distinct_on: [notebook_event_type_select_column!]

    """limit the number of rows returned"""
    limit: Int

    """skip the first n rows. Use only with order_by"""
    offset: Int

    """sort the rows by one or more columns"""
    order_by: [notebook_event_type_order_by!]

    """filter the rows returned"""
    where: notebook_event_type_bool_exp
  ): notebook_event_type_aggregate!

  """
  fetch data from the table: "notebook_event_type" using primary key columns
  """
  notebook_event_type_by_pk(value: String!): notebook_event_type

  """
  fetch data from the table: "notebook_focus"
  """
  notebook_focus(
    """distinct select on columns"""
    distinct_on: [notebook_focus_select_column!]

    """limit the number of rows returned"""
    limit: Int

    """skip the first n rows. Use only with order_by"""
    offset: Int

    """sort the rows by one or more columns"""
    order_by: [notebook_focus_order_by!]

    """filter the rows returned"""
    where: notebook_focus_bool_exp
  ): [notebook_focus!]!

  """
  fetch aggregated fields from the table: "notebook_focus"
  """
  notebook_focus_aggregate(
    """distinct select on columns"""
    distinct_on: [notebook_focus_select_column!]

    """limit the number of rows returned"""
    limit: Int

    """skip the first n rows. Use only with order_by"""
    offset: Int

    """sort the rows by one or more columns"""
    order_by: [notebook_focus_order_by!]

    """filter the rows returned"""
    where: notebook_focus_bool_exp
  ): notebook_focus_aggregate!

  """fetch data from the table: "notebook_focus" using primary key columns"""
  notebook_focus_by_pk(id: uuid!): notebook_focus

  """
  fetch data from the table: "notebook_info"
  """
  notebook_info(
    """distinct select on columns"""
    distinct_on: [notebook_info_select_column!]

    """limit the number of rows returned"""
    limit: Int

    """skip the first n rows. Use only with order_by"""
    offset: Int

    """sort the rows by one or more columns"""
    order_by: [notebook_info_order_by!]

    """filter the rows returned"""
    where: notebook_info_bool_exp
  ): [notebook_info!]!

  """
  fetch aggregated fields from the table: "notebook_info"
  """
  notebook_info_aggregate(
    """distinct select on columns"""
    distinct_on: [notebook_info_select_column!]

    """limit the number of rows returned"""
    limit: Int

    """skip the first n rows. Use only with order_by"""
    offset: Int

    """sort the rows by one or more columns"""
    order_by: [notebook_info_order_by!]

    """filter the rows returned"""
    where: notebook_info_bool_exp
  ): notebook_info_aggregate!

  """fetch data from the table: "notebook_info" using primary key columns"""
  notebook_info_by_pk(notebookId: uuid!): notebook_info

  """
  fetch data from the table: "notebook_member"
  """
  notebook_member(
    """distinct select on columns"""
    distinct_on: [notebook_member_select_column!]

    """limit the number of rows returned"""
    limit: Int

    """skip the first n rows. Use only with order_by"""
    offset: Int

    """sort the rows by one or more columns"""
    order_by: [notebook_member_order_by!]

    """filter the rows returned"""
    where: notebook_member_bool_exp
  ): [notebook_member!]!

  """
  fetch aggregated fields from the table: "notebook_member"
  """
  notebook_member_aggregate(
    """distinct select on columns"""
    distinct_on: [notebook_member_select_column!]

    """limit the number of rows returned"""
    limit: Int

    """skip the first n rows. Use only with order_by"""
    offset: Int

    """sort the rows by one or more columns"""
    order_by: [notebook_member_order_by!]

    """filter the rows returned"""
    where: notebook_member_bool_exp
  ): notebook_member_aggregate!

  """fetch data from the table: "notebook_member" using primary key columns"""
  notebook_member_by_pk(id: uuid!): notebook_member

  """
  fetch data from the table: "notebook_public_view"
  """
  notebook_public_view(
    """distinct select on columns"""
    distinct_on: [notebook_public_view_select_column!]

    """limit the number of rows returned"""
    limit: Int

    """skip the first n rows. Use only with order_by"""
    offset: Int

    """sort the rows by one or more columns"""
    order_by: [notebook_public_view_order_by!]

    """filter the rows returned"""
    where: notebook_public_view_bool_exp
  ): [notebook_public_view!]!

  """
  fetch aggregated fields from the table: "notebook_public_view"
  """
  notebook_public_view_aggregate(
    """distinct select on columns"""
    distinct_on: [notebook_public_view_select_column!]

    """limit the number of rows returned"""
    limit: Int

    """skip the first n rows. Use only with order_by"""
    offset: Int

    """sort the rows by one or more columns"""
    order_by: [notebook_public_view_order_by!]

    """filter the rows returned"""
    where: notebook_public_view_bool_exp
  ): notebook_public_view_aggregate!

  """
  fetch data from the table: "notebook_target"
  """
  notebook_target(
    """distinct select on columns"""
    distinct_on: [notebook_target_select_column!]

    """limit the number of rows returned"""
    limit: Int

    """skip the first n rows. Use only with order_by"""
    offset: Int

    """sort the rows by one or more columns"""
    order_by: [notebook_target_order_by!]

    """filter the rows returned"""
    where: notebook_target_bool_exp
  ): [notebook_target!]!

  """
  fetch aggregated fields from the table: "notebook_target"
  """
  notebook_target_aggregate(
    """distinct select on columns"""
    distinct_on: [notebook_target_select_column!]

    """limit the number of rows returned"""
    limit: Int

    """skip the first n rows. Use only with order_by"""
    offset: Int

    """sort the rows by one or more columns"""
    order_by: [notebook_target_order_by!]

    """filter the rows returned"""
    where: notebook_target_bool_exp
  ): notebook_target_aggregate!

  """fetch data from the table: "notebook_target" using primary key columns"""
  notebook_target_by_pk(id: uuid!): notebook_target

  """
  fetch data from the table: "orientation_manager"
  """
  orientation_manager(
    """distinct select on columns"""
    distinct_on: [orientation_manager_select_column!]

    """limit the number of rows returned"""
    limit: Int

    """skip the first n rows. Use only with order_by"""
    offset: Int

    """sort the rows by one or more columns"""
    order_by: [orientation_manager_order_by!]

    """filter the rows returned"""
    where: orientation_manager_bool_exp
  ): [orientation_manager!]!

  """
  fetch aggregated fields from the table: "orientation_manager"
  """
  orientation_manager_aggregate(
    """distinct select on columns"""
    distinct_on: [orientation_manager_select_column!]

    """limit the number of rows returned"""
    limit: Int

    """skip the first n rows. Use only with order_by"""
    offset: Int

    """sort the rows by one or more columns"""
    order_by: [orientation_manager_order_by!]

    """filter the rows returned"""
    where: orientation_manager_bool_exp
  ): orientation_manager_aggregate!

  """
  fetch data from the table: "orientation_manager" using primary key columns
  """
  orientation_manager_by_pk(id: uuid!): orientation_manager

  """
  fetch data from the table: "orientation_request"
  """
  orientation_request(
    """distinct select on columns"""
    distinct_on: [orientation_request_select_column!]

    """limit the number of rows returned"""
    limit: Int

    """skip the first n rows. Use only with order_by"""
    offset: Int

    """sort the rows by one or more columns"""
    order_by: [orientation_request_order_by!]

    """filter the rows returned"""
    where: orientation_request_bool_exp
  ): [orientation_request!]!

  """
  fetch aggregated fields from the table: "orientation_request"
  """
  orientation_request_aggregate(
    """distinct select on columns"""
    distinct_on: [orientation_request_select_column!]

    """limit the number of rows returned"""
    limit: Int

    """skip the first n rows. Use only with order_by"""
    offset: Int

    """sort the rows by one or more columns"""
    order_by: [orientation_request_order_by!]

    """filter the rows returned"""
    where: orientation_request_bool_exp
  ): orientation_request_aggregate!

  """
  fetch data from the table: "orientation_request" using primary key columns
  """
  orientation_request_by_pk(id: uuid!): orientation_request

  """
  fetch data from the table: "orientation_type"
  """
  orientation_type(
    """distinct select on columns"""
    distinct_on: [orientation_type_select_column!]

    """limit the number of rows returned"""
    limit: Int

    """skip the first n rows. Use only with order_by"""
    offset: Int

    """sort the rows by one or more columns"""
    order_by: [orientation_type_order_by!]

    """filter the rows returned"""
    where: orientation_type_bool_exp
  ): [orientation_type!]!

  """
  fetch aggregated fields from the table: "orientation_type"
  """
  orientation_type_aggregate(
    """distinct select on columns"""
    distinct_on: [orientation_type_select_column!]

    """limit the number of rows returned"""
    limit: Int

    """skip the first n rows. Use only with order_by"""
    offset: Int

    """sort the rows by one or more columns"""
    order_by: [orientation_type_order_by!]

    """filter the rows returned"""
    where: orientation_type_bool_exp
  ): orientation_type_aggregate!

  """
  fetch data from the table: "orientation_type" using primary key columns
  """
  orientation_type_by_pk(id: String!): orientation_type

  """
  fetch data from the table: "professional"
  """
  professional(
    """distinct select on columns"""
    distinct_on: [professional_select_column!]

    """limit the number of rows returned"""
    limit: Int

    """skip the first n rows. Use only with order_by"""
    offset: Int

    """sort the rows by one or more columns"""
    order_by: [professional_order_by!]

    """filter the rows returned"""
    where: professional_bool_exp
  ): [professional!]!

  """
  fetch aggregated fields from the table: "professional"
  """
  professional_aggregate(
    """distinct select on columns"""
    distinct_on: [professional_select_column!]

    """limit the number of rows returned"""
    limit: Int

    """skip the first n rows. Use only with order_by"""
    offset: Int

    """sort the rows by one or more columns"""
    order_by: [professional_order_by!]

    """filter the rows returned"""
    where: professional_bool_exp
  ): professional_aggregate!

  """fetch data from the table: "professional" using primary key columns"""
  professional_by_pk(id: uuid!): professional

  """
  fetch data from the table: "ref_action"
  """
  ref_action(
    """distinct select on columns"""
    distinct_on: [ref_action_select_column!]

    """limit the number of rows returned"""
    limit: Int

    """skip the first n rows. Use only with order_by"""
    offset: Int

    """sort the rows by one or more columns"""
    order_by: [ref_action_order_by!]

    """filter the rows returned"""
    where: ref_action_bool_exp
  ): [ref_action!]!

  """
  fetch aggregated fields from the table: "ref_action"
  """
  ref_action_aggregate(
    """distinct select on columns"""
    distinct_on: [ref_action_select_column!]

    """limit the number of rows returned"""
    limit: Int

    """skip the first n rows. Use only with order_by"""
    offset: Int

    """sort the rows by one or more columns"""
    order_by: [ref_action_order_by!]

    """filter the rows returned"""
    where: ref_action_bool_exp
  ): ref_action_aggregate!

  """fetch data from the table: "ref_action" using primary key columns"""
  ref_action_by_pk(id: uuid!): ref_action

  """
  fetch data from the table: "ref_situation"
  """
  ref_situation(
    """distinct select on columns"""
    distinct_on: [ref_situation_select_column!]

    """limit the number of rows returned"""
    limit: Int

    """skip the first n rows. Use only with order_by"""
    offset: Int

    """sort the rows by one or more columns"""
    order_by: [ref_situation_order_by!]

    """filter the rows returned"""
    where: ref_situation_bool_exp
  ): [ref_situation!]!

  """
  fetch aggregated fields from the table: "ref_situation"
  """
  ref_situation_aggregate(
    """distinct select on columns"""
    distinct_on: [ref_situation_select_column!]

    """limit the number of rows returned"""
    limit: Int

    """skip the first n rows. Use only with order_by"""
    offset: Int

    """sort the rows by one or more columns"""
    order_by: [ref_situation_order_by!]

    """filter the rows returned"""
    where: ref_situation_bool_exp
  ): ref_situation_aggregate!

  """fetch data from the table: "ref_situation" using primary key columns"""
  ref_situation_by_pk(id: uuid!): ref_situation

  """
  fetch data from the table: "ref_target"
  """
  ref_target(
    """distinct select on columns"""
    distinct_on: [ref_target_select_column!]

    """limit the number of rows returned"""
    limit: Int

    """skip the first n rows. Use only with order_by"""
    offset: Int

    """sort the rows by one or more columns"""
    order_by: [ref_target_order_by!]

    """filter the rows returned"""
    where: ref_target_bool_exp
  ): [ref_target!]!

  """
  fetch aggregated fields from the table: "ref_target"
  """
  ref_target_aggregate(
    """distinct select on columns"""
    distinct_on: [ref_target_select_column!]

    """limit the number of rows returned"""
    limit: Int

    """skip the first n rows. Use only with order_by"""
    offset: Int

    """sort the rows by one or more columns"""
    order_by: [ref_target_order_by!]

    """filter the rows returned"""
    where: ref_target_bool_exp
  ): ref_target_aggregate!

  """fetch data from the table: "ref_target" using primary key columns"""
  ref_target_by_pk(id: uuid!): ref_target

  """
  fetch data from the table: "role"
  """
  role(
    """distinct select on columns"""
    distinct_on: [role_select_column!]

    """limit the number of rows returned"""
    limit: Int

    """skip the first n rows. Use only with order_by"""
    offset: Int

    """sort the rows by one or more columns"""
    order_by: [role_order_by!]

    """filter the rows returned"""
    where: role_bool_exp
  ): [role!]!

  """
  fetch aggregated fields from the table: "role"
  """
  role_aggregate(
    """distinct select on columns"""
    distinct_on: [role_select_column!]

    """limit the number of rows returned"""
    limit: Int

    """skip the first n rows. Use only with order_by"""
    offset: Int

    """sort the rows by one or more columns"""
    order_by: [role_order_by!]

    """filter the rows returned"""
    where: role_bool_exp
  ): role_aggregate!

  """fetch data from the table: "role" using primary key columns"""
  role_by_pk(label: String!): role

  """
  fetch data from the table: "rome_code"
  """
  rome_code(
    """distinct select on columns"""
    distinct_on: [rome_code_select_column!]

    """limit the number of rows returned"""
    limit: Int

    """skip the first n rows. Use only with order_by"""
    offset: Int

    """sort the rows by one or more columns"""
    order_by: [rome_code_order_by!]

    """filter the rows returned"""
    where: rome_code_bool_exp
  ): [rome_code!]!

  """
  fetch aggregated fields from the table: "rome_code"
  """
  rome_code_aggregate(
    """distinct select on columns"""
    distinct_on: [rome_code_select_column!]

    """limit the number of rows returned"""
    limit: Int

    """skip the first n rows. Use only with order_by"""
    offset: Int

    """sort the rows by one or more columns"""
    order_by: [rome_code_order_by!]

    """filter the rows returned"""
    where: rome_code_bool_exp
  ): rome_code_aggregate!

  """fetch data from the table: "rome_code" using primary key columns"""
  rome_code_by_pk(id: uuid!): rome_code

  """
  execute function "search_beneficiaries" which returns "beneficiary"
  """
  search_beneficiaries(
    """
    input parameters for function "search_beneficiaries"
    """
    args: search_beneficiaries_args!

    """distinct select on columns"""
    distinct_on: [beneficiary_select_column!]

    """limit the number of rows returned"""
    limit: Int

    """skip the first n rows. Use only with order_by"""
    offset: Int

    """sort the rows by one or more columns"""
    order_by: [beneficiary_order_by!]

    """filter the rows returned"""
    where: beneficiary_bool_exp
  ): [beneficiary!]!

  """
  execute function "search_beneficiaries" and query aggregates on result of table type "beneficiary"
  """
  search_beneficiaries_aggregate(
    """
    input parameters for function "search_beneficiaries_aggregate"
    """
    args: search_beneficiaries_args!

    """distinct select on columns"""
    distinct_on: [beneficiary_select_column!]

    """limit the number of rows returned"""
    limit: Int

    """skip the first n rows. Use only with order_by"""
    offset: Int

    """sort the rows by one or more columns"""
    order_by: [beneficiary_order_by!]

    """filter the rows returned"""
    where: beneficiary_bool_exp
  ): beneficiary_aggregate!

  """
  execute function "search_notebook_members" which returns "notebook_member"
  """
  search_notebook_members(
    """
    input parameters for function "search_notebook_members"
    """
    args: search_notebook_members_args!

    """distinct select on columns"""
    distinct_on: [notebook_member_select_column!]

    """limit the number of rows returned"""
    limit: Int

    """skip the first n rows. Use only with order_by"""
    offset: Int

    """sort the rows by one or more columns"""
    order_by: [notebook_member_order_by!]

    """filter the rows returned"""
    where: notebook_member_bool_exp
  ): [notebook_member!]!

  """
  execute function "search_notebook_members" and query aggregates on result of table type "notebook_member"
  """
  search_notebook_members_aggregate(
    """
    input parameters for function "search_notebook_members_aggregate"
    """
    args: search_notebook_members_args!

    """distinct select on columns"""
    distinct_on: [notebook_member_select_column!]

    """limit the number of rows returned"""
    limit: Int

    """skip the first n rows. Use only with order_by"""
    offset: Int

    """sort the rows by one or more columns"""
    order_by: [notebook_member_order_by!]

    """filter the rows returned"""
    where: notebook_member_bool_exp
  ): notebook_member_aggregate!

  """
  execute function "search_public_notebooks" which returns "notebook_public_view"
  """
  search_public_notebooks(
    """
    input parameters for function "search_public_notebooks"
    """
    args: search_public_notebooks_args!

    """distinct select on columns"""
    distinct_on: [notebook_public_view_select_column!]

    """limit the number of rows returned"""
    limit: Int

    """skip the first n rows. Use only with order_by"""
    offset: Int

    """sort the rows by one or more columns"""
    order_by: [notebook_public_view_order_by!]

    """filter the rows returned"""
    where: notebook_public_view_bool_exp
  ): [notebook_public_view!]!

  """
  execute function "search_public_notebooks" and query aggregates on result of table type "notebook_public_view"
  """
  search_public_notebooks_aggregate(
    """
    input parameters for function "search_public_notebooks_aggregate"
    """
    args: search_public_notebooks_args!

    """distinct select on columns"""
    distinct_on: [notebook_public_view_select_column!]

    """limit the number of rows returned"""
    limit: Int

    """skip the first n rows. Use only with order_by"""
    offset: Int

    """sort the rows by one or more columns"""
    order_by: [notebook_public_view_order_by!]

    """filter the rows returned"""
    where: notebook_public_view_bool_exp
  ): notebook_public_view_aggregate!

  """
  execute function "search_rome_codes" which returns "rome_code"
  """
  search_rome_codes(
    """
    input parameters for function "search_rome_codes"
    """
    args: search_rome_codes_args!

    """distinct select on columns"""
    distinct_on: [rome_code_select_column!]

    """limit the number of rows returned"""
    limit: Int

    """skip the first n rows. Use only with order_by"""
    offset: Int

    """sort the rows by one or more columns"""
    order_by: [rome_code_order_by!]

    """filter the rows returned"""
    where: rome_code_bool_exp
  ): [rome_code!]!

  """
  execute function "search_rome_codes" and query aggregates on result of table type "rome_code"
  """
  search_rome_codes_aggregate(
    """
    input parameters for function "search_rome_codes_aggregate"
    """
    args: search_rome_codes_args!

    """distinct select on columns"""
    distinct_on: [rome_code_select_column!]

    """limit the number of rows returned"""
    limit: Int

    """skip the first n rows. Use only with order_by"""
    offset: Int

    """sort the rows by one or more columns"""
    order_by: [rome_code_order_by!]

    """filter the rows returned"""
    where: rome_code_bool_exp
  ): rome_code_aggregate!

  """
  fetch data from the table: "structure"
  """
  structure(
    """distinct select on columns"""
    distinct_on: [structure_select_column!]

    """limit the number of rows returned"""
    limit: Int

    """skip the first n rows. Use only with order_by"""
    offset: Int

    """sort the rows by one or more columns"""
    order_by: [structure_order_by!]

    """filter the rows returned"""
    where: structure_bool_exp
  ): [structure!]!

  """
  fetch aggregated fields from the table: "structure"
  """
  structure_aggregate(
    """distinct select on columns"""
    distinct_on: [structure_select_column!]

    """limit the number of rows returned"""
    limit: Int

    """skip the first n rows. Use only with order_by"""
    offset: Int

    """sort the rows by one or more columns"""
    order_by: [structure_order_by!]

    """filter the rows returned"""
    where: structure_bool_exp
  ): structure_aggregate!

  """fetch data from the table: "structure" using primary key columns"""
  structure_by_pk(id: uuid!): structure

  """
  fetch data from the table: "wanted_job"
  """
  wanted_job(
    """distinct select on columns"""
    distinct_on: [wanted_job_select_column!]

    """limit the number of rows returned"""
    limit: Int

    """skip the first n rows. Use only with order_by"""
    offset: Int

    """sort the rows by one or more columns"""
    order_by: [wanted_job_order_by!]

    """filter the rows returned"""
    where: wanted_job_bool_exp
  ): [wanted_job!]!

  """
  fetch aggregated fields from the table: "wanted_job"
  """
  wanted_job_aggregate(
    """distinct select on columns"""
    distinct_on: [wanted_job_select_column!]

    """limit the number of rows returned"""
    limit: Int

    """skip the first n rows. Use only with order_by"""
    offset: Int

    """sort the rows by one or more columns"""
    order_by: [wanted_job_order_by!]

    """filter the rows returned"""
    where: wanted_job_bool_exp
  ): wanted_job_aggregate!

  """fetch data from the table: "wanted_job" using primary key columns"""
  wanted_job_by_pk(id: uuid!): wanted_job
}

"""
columns and relationships of "ref_action"
"""
type ref_action {
  description: String!
  id: uuid!
  theme: String!
}

"""
aggregated selection of "ref_action"
"""
type ref_action_aggregate {
  aggregate: ref_action_aggregate_fields
  nodes: [ref_action!]!
}

"""
aggregate fields of "ref_action"
"""
type ref_action_aggregate_fields {
  count(columns: [ref_action_select_column!], distinct: Boolean): Int!
  max: ref_action_max_fields
  min: ref_action_min_fields
}

"""
Boolean expression to filter rows from the table "ref_action". All fields are combined with a logical 'AND'.
"""
input ref_action_bool_exp {
  _and: [ref_action_bool_exp!]
  _not: ref_action_bool_exp
  _or: [ref_action_bool_exp!]
  description: String_comparison_exp
  id: uuid_comparison_exp
  theme: String_comparison_exp
}

"""
unique or primary key constraints on table "ref_action"
"""
enum ref_action_constraint {
  """
  unique or primary key constraint on columns "id"
  """
  ref_action_pkey
}

"""
input type for inserting data into table "ref_action"
"""
input ref_action_insert_input {
  description: String
  id: uuid
  theme: String
}

"""aggregate max on columns"""
type ref_action_max_fields {
  description: String
  id: uuid
  theme: String
}

"""aggregate min on columns"""
type ref_action_min_fields {
  description: String
  id: uuid
  theme: String
}

"""
response of any mutation on the table "ref_action"
"""
type ref_action_mutation_response {
  """number of rows affected by the mutation"""
  affected_rows: Int!

  """data from the rows affected by the mutation"""
  returning: [ref_action!]!
}

"""
on_conflict condition type for table "ref_action"
"""
input ref_action_on_conflict {
  constraint: ref_action_constraint!
  update_columns: [ref_action_update_column!]! = []
  where: ref_action_bool_exp
}

"""Ordering options when selecting data from "ref_action"."""
input ref_action_order_by {
  description: order_by
  id: order_by
  theme: order_by
}

"""primary key columns input for table: ref_action"""
input ref_action_pk_columns_input {
  id: uuid!
}

"""
select columns of table "ref_action"
"""
enum ref_action_select_column {
  """column name"""
  description

  """column name"""
  id

  """column name"""
  theme
}

"""
input type for updating data in table "ref_action"
"""
input ref_action_set_input {
  description: String
  id: uuid
  theme: String
}

"""
Streaming cursor of the table "ref_action"
"""
input ref_action_stream_cursor_input {
  """Stream column input with initial value"""
  initial_value: ref_action_stream_cursor_value_input!

  """cursor ordering"""
  ordering: cursor_ordering
}

"""Initial value of the column from where the streaming should start"""
input ref_action_stream_cursor_value_input {
  description: String
  id: uuid
  theme: String
}

"""
update columns of table "ref_action"
"""
enum ref_action_update_column {
  """column name"""
  description

  """column name"""
  id

  """column name"""
  theme
}

input ref_action_updates {
  """sets the columns of the filtered rows to the given values"""
  _set: ref_action_set_input
  where: ref_action_bool_exp!
}

"""
columns and relationships of "ref_situation"
"""
type ref_situation {
  description: String!
  id: uuid!
  theme: String!
}

"""
aggregated selection of "ref_situation"
"""
type ref_situation_aggregate {
  aggregate: ref_situation_aggregate_fields
  nodes: [ref_situation!]!
}

"""
aggregate fields of "ref_situation"
"""
type ref_situation_aggregate_fields {
  count(columns: [ref_situation_select_column!], distinct: Boolean): Int!
  max: ref_situation_max_fields
  min: ref_situation_min_fields
}

"""
Boolean expression to filter rows from the table "ref_situation". All fields are combined with a logical 'AND'.
"""
input ref_situation_bool_exp {
  _and: [ref_situation_bool_exp!]
  _not: ref_situation_bool_exp
  _or: [ref_situation_bool_exp!]
  description: String_comparison_exp
  id: uuid_comparison_exp
  theme: String_comparison_exp
}

"""
unique or primary key constraints on table "ref_situation"
"""
enum ref_situation_constraint {
  """
  unique or primary key constraint on columns "id"
  """
  ref_situation_pkey
}

"""
input type for inserting data into table "ref_situation"
"""
input ref_situation_insert_input {
  description: String
  id: uuid
  theme: String
}

"""aggregate max on columns"""
type ref_situation_max_fields {
  description: String
  id: uuid
  theme: String
}

"""aggregate min on columns"""
type ref_situation_min_fields {
  description: String
  id: uuid
  theme: String
}

"""
response of any mutation on the table "ref_situation"
"""
type ref_situation_mutation_response {
  """number of rows affected by the mutation"""
  affected_rows: Int!

  """data from the rows affected by the mutation"""
  returning: [ref_situation!]!
}

"""
on_conflict condition type for table "ref_situation"
"""
input ref_situation_on_conflict {
  constraint: ref_situation_constraint!
  update_columns: [ref_situation_update_column!]! = []
  where: ref_situation_bool_exp
}

"""Ordering options when selecting data from "ref_situation"."""
input ref_situation_order_by {
  description: order_by
  id: order_by
  theme: order_by
}

"""primary key columns input for table: ref_situation"""
input ref_situation_pk_columns_input {
  id: uuid!
}

"""
select columns of table "ref_situation"
"""
enum ref_situation_select_column {
  """column name"""
  description

  """column name"""
  id

  """column name"""
  theme
}

"""
input type for updating data in table "ref_situation"
"""
input ref_situation_set_input {
  description: String
  id: uuid
  theme: String
}

"""
Streaming cursor of the table "ref_situation"
"""
input ref_situation_stream_cursor_input {
  """Stream column input with initial value"""
  initial_value: ref_situation_stream_cursor_value_input!

  """cursor ordering"""
  ordering: cursor_ordering
}

"""Initial value of the column from where the streaming should start"""
input ref_situation_stream_cursor_value_input {
  description: String
  id: uuid
  theme: String
}

"""
update columns of table "ref_situation"
"""
enum ref_situation_update_column {
  """column name"""
  description

  """column name"""
  id

  """column name"""
  theme
}

input ref_situation_updates {
  """sets the columns of the filtered rows to the given values"""
  _set: ref_situation_set_input
  where: ref_situation_bool_exp!
}

"""
columns and relationships of "ref_target"
"""
type ref_target {
  description: String!
  id: uuid!
  theme: String!
}

"""
aggregated selection of "ref_target"
"""
type ref_target_aggregate {
  aggregate: ref_target_aggregate_fields
  nodes: [ref_target!]!
}

"""
aggregate fields of "ref_target"
"""
type ref_target_aggregate_fields {
  count(columns: [ref_target_select_column!], distinct: Boolean): Int!
  max: ref_target_max_fields
  min: ref_target_min_fields
}

"""
Boolean expression to filter rows from the table "ref_target". All fields are combined with a logical 'AND'.
"""
input ref_target_bool_exp {
  _and: [ref_target_bool_exp!]
  _not: ref_target_bool_exp
  _or: [ref_target_bool_exp!]
  description: String_comparison_exp
  id: uuid_comparison_exp
  theme: String_comparison_exp
}

"""
unique or primary key constraints on table "ref_target"
"""
enum ref_target_constraint {
  """
  unique or primary key constraint on columns "id"
  """
  ref_target_pkey
}

"""
input type for inserting data into table "ref_target"
"""
input ref_target_insert_input {
  description: String
  id: uuid
  theme: String
}

"""aggregate max on columns"""
type ref_target_max_fields {
  description: String
  id: uuid
  theme: String
}

"""aggregate min on columns"""
type ref_target_min_fields {
  description: String
  id: uuid
  theme: String
}

"""
response of any mutation on the table "ref_target"
"""
type ref_target_mutation_response {
  """number of rows affected by the mutation"""
  affected_rows: Int!

  """data from the rows affected by the mutation"""
  returning: [ref_target!]!
}

"""
on_conflict condition type for table "ref_target"
"""
input ref_target_on_conflict {
  constraint: ref_target_constraint!
  update_columns: [ref_target_update_column!]! = []
  where: ref_target_bool_exp
}

"""Ordering options when selecting data from "ref_target"."""
input ref_target_order_by {
  description: order_by
  id: order_by
  theme: order_by
}

"""primary key columns input for table: ref_target"""
input ref_target_pk_columns_input {
  id: uuid!
}

"""
select columns of table "ref_target"
"""
enum ref_target_select_column {
  """column name"""
  description

  """column name"""
  id

  """column name"""
  theme
}

"""
input type for updating data in table "ref_target"
"""
input ref_target_set_input {
  description: String
  id: uuid
  theme: String
}

"""
Streaming cursor of the table "ref_target"
"""
input ref_target_stream_cursor_input {
  """Stream column input with initial value"""
  initial_value: ref_target_stream_cursor_value_input!

  """cursor ordering"""
  ordering: cursor_ordering
}

"""Initial value of the column from where the streaming should start"""
input ref_target_stream_cursor_value_input {
  description: String
  id: uuid
  theme: String
}

"""
update columns of table "ref_target"
"""
enum ref_target_update_column {
  """column name"""
  description

  """column name"""
  id

  """column name"""
  theme
}

input ref_target_updates {
  """sets the columns of the filtered rows to the given values"""
  _set: ref_target_set_input
  where: ref_target_bool_exp!
}

"""liste des roles"""
type role {
  """An array relationship"""
  accounts(
    """distinct select on columns"""
    distinct_on: [account_select_column!]

    """limit the number of rows returned"""
    limit: Int

    """skip the first n rows. Use only with order_by"""
    offset: Int

    """sort the rows by one or more columns"""
    order_by: [account_order_by!]

    """filter the rows returned"""
    where: account_bool_exp
  ): [account!]!

  """An aggregate relationship"""
  accounts_aggregate(
    """distinct select on columns"""
    distinct_on: [account_select_column!]

    """limit the number of rows returned"""
    limit: Int

    """skip the first n rows. Use only with order_by"""
    offset: Int

    """sort the rows by one or more columns"""
    order_by: [account_order_by!]

    """filter the rows returned"""
    where: account_bool_exp
  ): account_aggregate!
  label: String!
}

"""
aggregated selection of "role"
"""
type role_aggregate {
  aggregate: role_aggregate_fields
  nodes: [role!]!
}

"""
aggregate fields of "role"
"""
type role_aggregate_fields {
  count(columns: [role_select_column!], distinct: Boolean): Int!
  max: role_max_fields
  min: role_min_fields
}

"""
Boolean expression to filter rows from the table "role". All fields are combined with a logical 'AND'.
"""
input role_bool_exp {
  _and: [role_bool_exp!]
  _not: role_bool_exp
  _or: [role_bool_exp!]
  accounts: account_bool_exp
  accounts_aggregate: account_aggregate_bool_exp
  label: String_comparison_exp
}

"""
unique or primary key constraints on table "role"
"""
enum role_constraint {
  """
  unique or primary key constraint on columns "label"
  """
  role_pkey
}

enum role_enum {
  admin_cdb
  admin_structure
  beneficiary
  manager
  orientation_manager
  professional
}

"""
Boolean expression to compare columns of type "role_enum". All fields are combined with logical 'AND'.
"""
input role_enum_comparison_exp {
  _eq: role_enum
  _in: [role_enum!]
  _is_null: Boolean
  _neq: role_enum
  _nin: [role_enum!]
}

"""
input type for inserting data into table "role"
"""
input role_insert_input {
  accounts: account_arr_rel_insert_input
  label: String
}

"""aggregate max on columns"""
type role_max_fields {
  label: String
}

"""aggregate min on columns"""
type role_min_fields {
  label: String
}

"""
response of any mutation on the table "role"
"""
type role_mutation_response {
  """number of rows affected by the mutation"""
  affected_rows: Int!

  """data from the rows affected by the mutation"""
  returning: [role!]!
}

"""
input type for inserting object relation for remote table "role"
"""
input role_obj_rel_insert_input {
  data: role_insert_input!

  """upsert condition"""
  on_conflict: role_on_conflict
}

"""
on_conflict condition type for table "role"
"""
input role_on_conflict {
  constraint: role_constraint!
  update_columns: [role_update_column!]! = []
  where: role_bool_exp
}

"""Ordering options when selecting data from "role"."""
input role_order_by {
  accounts_aggregate: account_aggregate_order_by
  label: order_by
}

"""primary key columns input for table: role"""
input role_pk_columns_input {
  label: String!
}

"""
select columns of table "role"
"""
enum role_select_column {
  """column name"""
  label
}

"""
input type for updating data in table "role"
"""
input role_set_input {
  label: String
}

"""
Streaming cursor of the table "role"
"""
input role_stream_cursor_input {
  """Stream column input with initial value"""
  initial_value: role_stream_cursor_value_input!

  """cursor ordering"""
  ordering: cursor_ordering
}

"""Initial value of the column from where the streaming should start"""
input role_stream_cursor_value_input {
  label: String
}

"""
update columns of table "role"
"""
enum role_update_column {
  """column name"""
  label
}

input role_updates {
  """sets the columns of the filtered rows to the given values"""
  _set: role_set_input
  where: role_bool_exp!
}

"""
columns and relationships of "rome_code"
"""
type rome_code {
  code: String!
  description: String!
  id: uuid!
  label: String!

  """An array relationship"""
  wanted_by(
    """distinct select on columns"""
    distinct_on: [wanted_job_select_column!]

    """limit the number of rows returned"""
    limit: Int

    """skip the first n rows. Use only with order_by"""
    offset: Int

    """sort the rows by one or more columns"""
    order_by: [wanted_job_order_by!]

    """filter the rows returned"""
    where: wanted_job_bool_exp
  ): [wanted_job!]!

  """An aggregate relationship"""
  wanted_by_aggregate(
    """distinct select on columns"""
    distinct_on: [wanted_job_select_column!]

    """limit the number of rows returned"""
    limit: Int

    """skip the first n rows. Use only with order_by"""
    offset: Int

    """sort the rows by one or more columns"""
    order_by: [wanted_job_order_by!]

    """filter the rows returned"""
    where: wanted_job_bool_exp
  ): wanted_job_aggregate!
}

"""
aggregated selection of "rome_code"
"""
type rome_code_aggregate {
  aggregate: rome_code_aggregate_fields
  nodes: [rome_code!]!
}

"""
aggregate fields of "rome_code"
"""
type rome_code_aggregate_fields {
  count(columns: [rome_code_select_column!], distinct: Boolean): Int!
  max: rome_code_max_fields
  min: rome_code_min_fields
}

"""
Boolean expression to filter rows from the table "rome_code". All fields are combined with a logical 'AND'.
"""
input rome_code_bool_exp {
  _and: [rome_code_bool_exp!]
  _not: rome_code_bool_exp
  _or: [rome_code_bool_exp!]
  code: String_comparison_exp
  description: String_comparison_exp
  id: uuid_comparison_exp
  label: String_comparison_exp
  wanted_by: wanted_job_bool_exp
  wanted_by_aggregate: wanted_job_aggregate_bool_exp
}

"""
unique or primary key constraints on table "rome_code"
"""
enum rome_code_constraint {
  """
  unique or primary key constraint on columns "label"
  """
  rome_codes_label_key

  """
  unique or primary key constraint on columns "id"
  """
  rome_codes_pkey
}

"""
input type for inserting data into table "rome_code"
"""
input rome_code_insert_input {
  code: String
  description: String
  id: uuid
  label: String
  wanted_by: wanted_job_arr_rel_insert_input
}

"""aggregate max on columns"""
type rome_code_max_fields {
  code: String
  description: String
  id: uuid
  label: String
}

"""aggregate min on columns"""
type rome_code_min_fields {
  code: String
  description: String
  id: uuid
  label: String
}

"""
response of any mutation on the table "rome_code"
"""
type rome_code_mutation_response {
  """number of rows affected by the mutation"""
  affected_rows: Int!

  """data from the rows affected by the mutation"""
  returning: [rome_code!]!
}

"""
input type for inserting object relation for remote table "rome_code"
"""
input rome_code_obj_rel_insert_input {
  data: rome_code_insert_input!

  """upsert condition"""
  on_conflict: rome_code_on_conflict
}

"""
on_conflict condition type for table "rome_code"
"""
input rome_code_on_conflict {
  constraint: rome_code_constraint!
  update_columns: [rome_code_update_column!]! = []
  where: rome_code_bool_exp
}

"""Ordering options when selecting data from "rome_code"."""
input rome_code_order_by {
  code: order_by
  description: order_by
  id: order_by
  label: order_by
  wanted_by_aggregate: wanted_job_aggregate_order_by
}

"""primary key columns input for table: rome_code"""
input rome_code_pk_columns_input {
  id: uuid!
}

"""
select columns of table "rome_code"
"""
enum rome_code_select_column {
  """column name"""
  code

  """column name"""
  description

  """column name"""
  id

  """column name"""
  label
}

"""
input type for updating data in table "rome_code"
"""
input rome_code_set_input {
  code: String
  description: String
  id: uuid
  label: String
}

"""
Streaming cursor of the table "rome_code"
"""
input rome_code_stream_cursor_input {
  """Stream column input with initial value"""
  initial_value: rome_code_stream_cursor_value_input!

  """cursor ordering"""
  ordering: cursor_ordering
}

"""Initial value of the column from where the streaming should start"""
input rome_code_stream_cursor_value_input {
  code: String
  description: String
  id: uuid
  label: String
}

"""
update columns of table "rome_code"
"""
enum rome_code_update_column {
  """column name"""
  code

  """column name"""
  description

  """column name"""
  id

  """column name"""
  label
}

input rome_code_updates {
  """sets the columns of the filtered rows to the given values"""
  _set: rome_code_set_input
  where: rome_code_bool_exp!
}

input search_beneficiaries_args {
  search: String
}

input search_notebook_members_args {
  search: String
}

input search_public_notebooks_args {
  search: String
}

input search_rome_codes_args {
  search: String
}

"""
columns and relationships of "structure"
"""
type structure {
  address1: String
  address2: String

  """An array relationship"""
  admins(
    """distinct select on columns"""
    distinct_on: [admin_structure_structure_select_column!]

    """limit the number of rows returned"""
    limit: Int

    """skip the first n rows. Use only with order_by"""
    offset: Int

    """sort the rows by one or more columns"""
    order_by: [admin_structure_structure_order_by!]

    """filter the rows returned"""
    where: admin_structure_structure_bool_exp
  ): [admin_structure_structure!]!

  """An aggregate relationship"""
  admins_aggregate(
    """distinct select on columns"""
    distinct_on: [admin_structure_structure_select_column!]

    """limit the number of rows returned"""
    limit: Int

    """skip the first n rows. Use only with order_by"""
    offset: Int

    """sort the rows by one or more columns"""
    order_by: [admin_structure_structure_order_by!]

    """filter the rows returned"""
    where: admin_structure_structure_bool_exp
  ): admin_structure_structure_aggregate!

  """An array relationship"""
  beneficiaries(
    """distinct select on columns"""
    distinct_on: [beneficiary_structure_select_column!]

    """limit the number of rows returned"""
    limit: Int

    """skip the first n rows. Use only with order_by"""
    offset: Int

    """sort the rows by one or more columns"""
    order_by: [beneficiary_structure_order_by!]

    """filter the rows returned"""
    where: beneficiary_structure_bool_exp
  ): [beneficiary_structure!]!

  """An aggregate relationship"""
  beneficiaries_aggregate(
    """distinct select on columns"""
    distinct_on: [beneficiary_structure_select_column!]

    """limit the number of rows returned"""
    limit: Int

    """skip the first n rows. Use only with order_by"""
    offset: Int

    """sort the rows by one or more columns"""
    order_by: [beneficiary_structure_order_by!]

    """filter the rows returned"""
    where: beneficiary_structure_bool_exp
  ): beneficiary_structure_aggregate!

  """a computed field, executes function nb_beneficiary_for_structure """
  beneficiaryCount: bigint
  city: String
  createdAt: timestamptz

  """An object relationship"""
  deployment: deployment
  deploymentId: uuid
  email: String
  id: uuid!
  name: citext!
  phone: String
  postalCode: String

  """An array relationship"""
  professionals(
    """distinct select on columns"""
    distinct_on: [professional_select_column!]

    """limit the number of rows returned"""
    limit: Int

    """skip the first n rows. Use only with order_by"""
    offset: Int

    """sort the rows by one or more columns"""
    order_by: [professional_order_by!]

    """filter the rows returned"""
    where: professional_bool_exp
  ): [professional!]!

  """An aggregate relationship"""
  professionals_aggregate(
    """distinct select on columns"""
    distinct_on: [professional_select_column!]

    """limit the number of rows returned"""
    limit: Int

    """skip the first n rows. Use only with order_by"""
    offset: Int

    """sort the rows by one or more columns"""
    order_by: [professional_order_by!]

    """filter the rows returned"""
    where: professional_bool_exp
  ): professional_aggregate!
  shortDesc: String
  siret: String
  updatedAt: timestamptz
  website: String
}

"""
aggregated selection of "structure"
"""
type structure_aggregate {
  aggregate: structure_aggregate_fields
  nodes: [structure!]!
}

input structure_aggregate_bool_exp {
  count: structure_aggregate_bool_exp_count
}

input structure_aggregate_bool_exp_count {
  arguments: [structure_select_column!]
  distinct: Boolean
  filter: structure_bool_exp
  predicate: Int_comparison_exp!
}

"""
aggregate fields of "structure"
"""
type structure_aggregate_fields {
  count(columns: [structure_select_column!], distinct: Boolean): Int!
  max: structure_max_fields
  min: structure_min_fields
}

"""
order by aggregate values of table "structure"
"""
input structure_aggregate_order_by {
  count: order_by
  max: structure_max_order_by
  min: structure_min_order_by
}

"""
input type for inserting array relation for remote table "structure"
"""
input structure_arr_rel_insert_input {
  data: [structure_insert_input!]!

  """upsert condition"""
  on_conflict: structure_on_conflict
}

"""
Boolean expression to filter rows from the table "structure". All fields are combined with a logical 'AND'.
"""
input structure_bool_exp {
  _and: [structure_bool_exp!]
  _not: structure_bool_exp
  _or: [structure_bool_exp!]
  address1: String_comparison_exp
  address2: String_comparison_exp
  admins: admin_structure_structure_bool_exp
  admins_aggregate: admin_structure_structure_aggregate_bool_exp
  beneficiaries: beneficiary_structure_bool_exp
  beneficiaries_aggregate: beneficiary_structure_aggregate_bool_exp
  beneficiaryCount: bigint_comparison_exp
  city: String_comparison_exp
  createdAt: timestamptz_comparison_exp
  deployment: deployment_bool_exp
  deploymentId: uuid_comparison_exp
  email: String_comparison_exp
  id: uuid_comparison_exp
  name: citext_comparison_exp
  phone: String_comparison_exp
  postalCode: String_comparison_exp
  professionals: professional_bool_exp
  professionals_aggregate: professional_aggregate_bool_exp
  shortDesc: String_comparison_exp
  siret: String_comparison_exp
  updatedAt: timestamptz_comparison_exp
  website: String_comparison_exp
}

"""
unique or primary key constraints on table "structure"
"""
enum structure_constraint {
  """
  unique or primary key constraint on columns "name", "deployment_id"
  """
  structure_name_deployment_id_key

  """
  unique or primary key constraint on columns "id"
  """
  structure_pkey
}

"""
input type for inserting data into table "structure"
"""
input structure_insert_input {
  address1: String
  address2: String
  admins: admin_structure_structure_arr_rel_insert_input
  beneficiaries: beneficiary_structure_arr_rel_insert_input
  city: String
  createdAt: timestamptz
  deployment: deployment_obj_rel_insert_input
  deploymentId: uuid
  email: String
  id: uuid
  name: citext
  phone: String
  postalCode: String
  professionals: professional_arr_rel_insert_input
  shortDesc: String
  siret: String
  updatedAt: timestamptz
  website: String
}

"""aggregate max on columns"""
type structure_max_fields {
  address1: String
  address2: String
  city: String
  createdAt: timestamptz
  deploymentId: uuid
  email: String
  id: uuid
  name: citext
  phone: String
  postalCode: String
  shortDesc: String
  siret: String
  updatedAt: timestamptz
  website: String
}

"""
order by max() on columns of table "structure"
"""
input structure_max_order_by {
  address1: order_by
  address2: order_by
  city: order_by
  createdAt: order_by
  deploymentId: order_by
  email: order_by
  id: order_by
  name: order_by
  phone: order_by
  postalCode: order_by
  shortDesc: order_by
  siret: order_by
  updatedAt: order_by
  website: order_by
}

"""aggregate min on columns"""
type structure_min_fields {
  address1: String
  address2: String
  city: String
  createdAt: timestamptz
  deploymentId: uuid
  email: String
  id: uuid
  name: citext
  phone: String
  postalCode: String
  shortDesc: String
  siret: String
  updatedAt: timestamptz
  website: String
}

"""
order by min() on columns of table "structure"
"""
input structure_min_order_by {
  address1: order_by
  address2: order_by
  city: order_by
  createdAt: order_by
  deploymentId: order_by
  email: order_by
  id: order_by
  name: order_by
  phone: order_by
  postalCode: order_by
  shortDesc: order_by
  siret: order_by
  updatedAt: order_by
  website: order_by
}

"""
response of any mutation on the table "structure"
"""
type structure_mutation_response {
  """number of rows affected by the mutation"""
  affected_rows: Int!

  """data from the rows affected by the mutation"""
  returning: [structure!]!
}

"""
input type for inserting object relation for remote table "structure"
"""
input structure_obj_rel_insert_input {
  data: structure_insert_input!

  """upsert condition"""
  on_conflict: structure_on_conflict
}

"""
on_conflict condition type for table "structure"
"""
input structure_on_conflict {
  constraint: structure_constraint!
  update_columns: [structure_update_column!]! = []
  where: structure_bool_exp
}

"""Ordering options when selecting data from "structure"."""
input structure_order_by {
  address1: order_by
  address2: order_by
  admins_aggregate: admin_structure_structure_aggregate_order_by
  beneficiaries_aggregate: beneficiary_structure_aggregate_order_by
  beneficiaryCount: order_by
  city: order_by
  createdAt: order_by
  deployment: deployment_order_by
  deploymentId: order_by
  email: order_by
  id: order_by
  name: order_by
  phone: order_by
  postalCode: order_by
  professionals_aggregate: professional_aggregate_order_by
  shortDesc: order_by
  siret: order_by
  updatedAt: order_by
  website: order_by
}

"""primary key columns input for table: structure"""
input structure_pk_columns_input {
  id: uuid!
}

"""
select columns of table "structure"
"""
enum structure_select_column {
  """column name"""
  address1

  """column name"""
  address2

  """column name"""
  city

  """column name"""
  createdAt

  """column name"""
  deploymentId

  """column name"""
  email

  """column name"""
  id

  """column name"""
  name

  """column name"""
  phone

  """column name"""
  postalCode

  """column name"""
  shortDesc

  """column name"""
  siret

  """column name"""
  updatedAt

  """column name"""
  website
}

"""
input type for updating data in table "structure"
"""
input structure_set_input {
  address1: String
  address2: String
  city: String
  createdAt: timestamptz
  deploymentId: uuid
  email: String
  id: uuid
  name: citext
  phone: String
  postalCode: String
  shortDesc: String
  siret: String
  updatedAt: timestamptz
  website: String
}

"""
Streaming cursor of the table "structure"
"""
input structure_stream_cursor_input {
  """Stream column input with initial value"""
  initial_value: structure_stream_cursor_value_input!

  """cursor ordering"""
  ordering: cursor_ordering
}

"""Initial value of the column from where the streaming should start"""
input structure_stream_cursor_value_input {
  address1: String
  address2: String
  city: String
  createdAt: timestamptz
  deploymentId: uuid
  email: String
  id: uuid
  name: citext
  phone: String
  postalCode: String
  shortDesc: String
  siret: String
  updatedAt: timestamptz
  website: String
}

"""
update columns of table "structure"
"""
enum structure_update_column {
  """column name"""
  address1

  """column name"""
  address2

  """column name"""
  city

  """column name"""
  createdAt

  """column name"""
  deploymentId

  """column name"""
  email

  """column name"""
  id

  """column name"""
  name

  """column name"""
  phone

  """column name"""
  postalCode

  """column name"""
  shortDesc

  """column name"""
  siret

  """column name"""
  updatedAt

  """column name"""
  website
}

input structure_updates {
  """sets the columns of the filtered rows to the given values"""
  _set: structure_set_input
  where: structure_bool_exp!
}

type subscription_root {
  """
  fetch data from the table: "account"
  """
  account(
    """distinct select on columns"""
    distinct_on: [account_select_column!]

    """limit the number of rows returned"""
    limit: Int

    """skip the first n rows. Use only with order_by"""
    offset: Int

    """sort the rows by one or more columns"""
    order_by: [account_order_by!]

    """filter the rows returned"""
    where: account_bool_exp
  ): [account!]!

  """
  fetch aggregated fields from the table: "account"
  """
  account_aggregate(
    """distinct select on columns"""
    distinct_on: [account_select_column!]

    """limit the number of rows returned"""
    limit: Int

    """skip the first n rows. Use only with order_by"""
    offset: Int

    """sort the rows by one or more columns"""
    order_by: [account_order_by!]

    """filter the rows returned"""
    where: account_bool_exp
  ): account_aggregate!

  """fetch data from the table: "account" using primary key columns"""
  account_by_pk(id: uuid!): account

  """
  fetch data from the table: "account_info"
  """
  account_info(
    """distinct select on columns"""
    distinct_on: [account_info_select_column!]

    """limit the number of rows returned"""
    limit: Int

    """skip the first n rows. Use only with order_by"""
    offset: Int

    """sort the rows by one or more columns"""
    order_by: [account_info_order_by!]

    """filter the rows returned"""
    where: account_info_bool_exp
  ): [account_info!]!

  """
  fetch aggregated fields from the table: "account_info"
  """
  account_info_aggregate(
    """distinct select on columns"""
    distinct_on: [account_info_select_column!]

    """limit the number of rows returned"""
    limit: Int

    """skip the first n rows. Use only with order_by"""
    offset: Int

    """sort the rows by one or more columns"""
    order_by: [account_info_order_by!]

    """filter the rows returned"""
    where: account_info_bool_exp
  ): account_info_aggregate!

  """
  fetch data from the table in a streaming manner: "account_info"
  """
  account_info_stream(
    """maximum number of rows returned in a single batch"""
    batch_size: Int!

    """cursor to stream the results returned by the query"""
    cursor: [account_info_stream_cursor_input]!

    """filter the rows returned"""
    where: account_info_bool_exp
  ): [account_info!]!

  """
  fetch data from the table in a streaming manner: "account"
  """
  account_stream(
    """maximum number of rows returned in a single batch"""
    batch_size: Int!

    """cursor to stream the results returned by the query"""
    cursor: [account_stream_cursor_input]!

    """filter the rows returned"""
    where: account_bool_exp
  ): [account!]!

  """
  fetch data from the table: "admin_cdb"
  """
  admin_cdb(
    """distinct select on columns"""
    distinct_on: [admin_cdb_select_column!]

    """limit the number of rows returned"""
    limit: Int

    """skip the first n rows. Use only with order_by"""
    offset: Int

    """sort the rows by one or more columns"""
    order_by: [admin_cdb_order_by!]

    """filter the rows returned"""
    where: admin_cdb_bool_exp
  ): [admin_cdb!]!

  """
  fetch aggregated fields from the table: "admin_cdb"
  """
  admin_cdb_aggregate(
    """distinct select on columns"""
    distinct_on: [admin_cdb_select_column!]

    """limit the number of rows returned"""
    limit: Int

    """skip the first n rows. Use only with order_by"""
    offset: Int

    """sort the rows by one or more columns"""
    order_by: [admin_cdb_order_by!]

    """filter the rows returned"""
    where: admin_cdb_bool_exp
  ): admin_cdb_aggregate!

  """fetch data from the table: "admin_cdb" using primary key columns"""
  admin_cdb_by_pk(id: uuid!): admin_cdb

  """
  fetch data from the table in a streaming manner: "admin_cdb"
  """
  admin_cdb_stream(
    """maximum number of rows returned in a single batch"""
    batch_size: Int!

    """cursor to stream the results returned by the query"""
    cursor: [admin_cdb_stream_cursor_input]!

    """filter the rows returned"""
    where: admin_cdb_bool_exp
  ): [admin_cdb!]!

  """
  fetch data from the table: "admin_structure"
  """
  admin_structure(
    """distinct select on columns"""
    distinct_on: [admin_structure_select_column!]

    """limit the number of rows returned"""
    limit: Int

    """skip the first n rows. Use only with order_by"""
    offset: Int

    """sort the rows by one or more columns"""
    order_by: [admin_structure_order_by!]

    """filter the rows returned"""
    where: admin_structure_bool_exp
  ): [admin_structure!]!

  """
  fetch aggregated fields from the table: "admin_structure"
  """
  admin_structure_aggregate(
    """distinct select on columns"""
    distinct_on: [admin_structure_select_column!]

    """limit the number of rows returned"""
    limit: Int

    """skip the first n rows. Use only with order_by"""
    offset: Int

    """sort the rows by one or more columns"""
    order_by: [admin_structure_order_by!]

    """filter the rows returned"""
    where: admin_structure_bool_exp
  ): admin_structure_aggregate!

  """fetch data from the table: "admin_structure" using primary key columns"""
  admin_structure_by_pk(id: uuid!): admin_structure

  """
  fetch data from the table in a streaming manner: "admin_structure"
  """
  admin_structure_stream(
    """maximum number of rows returned in a single batch"""
    batch_size: Int!

    """cursor to stream the results returned by the query"""
    cursor: [admin_structure_stream_cursor_input]!

    """filter the rows returned"""
    where: admin_structure_bool_exp
  ): [admin_structure!]!

  """
  fetch data from the table: "admin_structure_structure"
  """
  admin_structure_structure(
    """distinct select on columns"""
    distinct_on: [admin_structure_structure_select_column!]

    """limit the number of rows returned"""
    limit: Int

    """skip the first n rows. Use only with order_by"""
    offset: Int

    """sort the rows by one or more columns"""
    order_by: [admin_structure_structure_order_by!]

    """filter the rows returned"""
    where: admin_structure_structure_bool_exp
  ): [admin_structure_structure!]!

  """
  fetch aggregated fields from the table: "admin_structure_structure"
  """
  admin_structure_structure_aggregate(
    """distinct select on columns"""
    distinct_on: [admin_structure_structure_select_column!]

    """limit the number of rows returned"""
    limit: Int

    """skip the first n rows. Use only with order_by"""
    offset: Int

    """sort the rows by one or more columns"""
    order_by: [admin_structure_structure_order_by!]

    """filter the rows returned"""
    where: admin_structure_structure_bool_exp
  ): admin_structure_structure_aggregate!

  """
  fetch data from the table: "admin_structure_structure" using primary key columns
  """
  admin_structure_structure_by_pk(id: uuid!): admin_structure_structure

  """
  fetch data from the table in a streaming manner: "admin_structure_structure"
  """
  admin_structure_structure_stream(
    """maximum number of rows returned in a single batch"""
    batch_size: Int!

    """cursor to stream the results returned by the query"""
    cursor: [admin_structure_structure_stream_cursor_input]!

    """filter the rows returned"""
    where: admin_structure_structure_bool_exp
  ): [admin_structure_structure!]!

  """
  fetch data from the table: "beneficiary"
  """
  beneficiary(
    """distinct select on columns"""
    distinct_on: [beneficiary_select_column!]

    """limit the number of rows returned"""
    limit: Int

    """skip the first n rows. Use only with order_by"""
    offset: Int

    """sort the rows by one or more columns"""
    order_by: [beneficiary_order_by!]

    """filter the rows returned"""
    where: beneficiary_bool_exp
  ): [beneficiary!]!

  """
  fetch aggregated fields from the table: "beneficiary"
  """
  beneficiary_aggregate(
    """distinct select on columns"""
    distinct_on: [beneficiary_select_column!]

    """limit the number of rows returned"""
    limit: Int

    """skip the first n rows. Use only with order_by"""
    offset: Int

    """sort the rows by one or more columns"""
    order_by: [beneficiary_order_by!]

    """filter the rows returned"""
    where: beneficiary_bool_exp
  ): beneficiary_aggregate!

  """fetch data from the table: "beneficiary" using primary key columns"""
  beneficiary_by_pk(id: uuid!): beneficiary

  """
  fetch data from the table in a streaming manner: "beneficiary"
  """
  beneficiary_stream(
    """maximum number of rows returned in a single batch"""
    batch_size: Int!

    """cursor to stream the results returned by the query"""
    cursor: [beneficiary_stream_cursor_input]!

    """filter the rows returned"""
    where: beneficiary_bool_exp
  ): [beneficiary!]!

  """
  fetch data from the table: "beneficiary_structure"
  """
  beneficiary_structure(
    """distinct select on columns"""
    distinct_on: [beneficiary_structure_select_column!]

    """limit the number of rows returned"""
    limit: Int

    """skip the first n rows. Use only with order_by"""
    offset: Int

    """sort the rows by one or more columns"""
    order_by: [beneficiary_structure_order_by!]

    """filter the rows returned"""
    where: beneficiary_structure_bool_exp
  ): [beneficiary_structure!]!

  """
  fetch aggregated fields from the table: "beneficiary_structure"
  """
  beneficiary_structure_aggregate(
    """distinct select on columns"""
    distinct_on: [beneficiary_structure_select_column!]

    """limit the number of rows returned"""
    limit: Int

    """skip the first n rows. Use only with order_by"""
    offset: Int

    """sort the rows by one or more columns"""
    order_by: [beneficiary_structure_order_by!]

    """filter the rows returned"""
    where: beneficiary_structure_bool_exp
  ): beneficiary_structure_aggregate!

  """
  fetch data from the table: "beneficiary_structure" using primary key columns
  """
  beneficiary_structure_by_pk(id: uuid!): beneficiary_structure

  """
  fetch data from the table in a streaming manner: "beneficiary_structure"
  """
  beneficiary_structure_stream(
    """maximum number of rows returned in a single batch"""
    batch_size: Int!

    """cursor to stream the results returned by the query"""
    cursor: [beneficiary_structure_stream_cursor_input]!

    """filter the rows returned"""
    where: beneficiary_structure_bool_exp
  ): [beneficiary_structure!]!

  """
  fetch data from the table: "deployment"
  """
  deployment(
    """distinct select on columns"""
    distinct_on: [deployment_select_column!]

    """limit the number of rows returned"""
    limit: Int

    """skip the first n rows. Use only with order_by"""
    offset: Int

    """sort the rows by one or more columns"""
    order_by: [deployment_order_by!]

    """filter the rows returned"""
    where: deployment_bool_exp
  ): [deployment!]!

  """
  fetch aggregated fields from the table: "deployment"
  """
  deployment_aggregate(
    """distinct select on columns"""
    distinct_on: [deployment_select_column!]

    """limit the number of rows returned"""
    limit: Int

    """skip the first n rows. Use only with order_by"""
    offset: Int

    """sort the rows by one or more columns"""
    order_by: [deployment_order_by!]

    """filter the rows returned"""
    where: deployment_bool_exp
  ): deployment_aggregate!

  """fetch data from the table: "deployment" using primary key columns"""
  deployment_by_pk(id: uuid!): deployment

  """
  fetch data from the table in a streaming manner: "deployment"
  """
  deployment_stream(
    """maximum number of rows returned in a single batch"""
    batch_size: Int!

    """cursor to stream the results returned by the query"""
    cursor: [deployment_stream_cursor_input]!

    """filter the rows returned"""
    where: deployment_bool_exp
  ): [deployment!]!

  """An array relationship"""
  external_data(
    """distinct select on columns"""
    distinct_on: [external_data_select_column!]

    """limit the number of rows returned"""
    limit: Int

    """skip the first n rows. Use only with order_by"""
    offset: Int

    """sort the rows by one or more columns"""
    order_by: [external_data_order_by!]

    """filter the rows returned"""
    where: external_data_bool_exp
  ): [external_data!]!

  """An aggregate relationship"""
  external_data_aggregate(
    """distinct select on columns"""
    distinct_on: [external_data_select_column!]

    """limit the number of rows returned"""
    limit: Int

    """skip the first n rows. Use only with order_by"""
    offset: Int

    """sort the rows by one or more columns"""
    order_by: [external_data_order_by!]

    """filter the rows returned"""
    where: external_data_bool_exp
  ): external_data_aggregate!

  """fetch data from the table: "external_data" using primary key columns"""
  external_data_by_pk(id: uuid!): external_data

  """
  fetch data from the table: "external_data_info"
  """
  external_data_info(
    """distinct select on columns"""
    distinct_on: [external_data_info_select_column!]

    """limit the number of rows returned"""
    limit: Int

    """skip the first n rows. Use only with order_by"""
    offset: Int

    """sort the rows by one or more columns"""
    order_by: [external_data_info_order_by!]

    """filter the rows returned"""
    where: external_data_info_bool_exp
  ): [external_data_info!]!

  """
  fetch aggregated fields from the table: "external_data_info"
  """
  external_data_info_aggregate(
    """distinct select on columns"""
    distinct_on: [external_data_info_select_column!]

    """limit the number of rows returned"""
    limit: Int

    """skip the first n rows. Use only with order_by"""
    offset: Int

    """sort the rows by one or more columns"""
    order_by: [external_data_info_order_by!]

    """filter the rows returned"""
    where: external_data_info_bool_exp
  ): external_data_info_aggregate!

  """
  fetch data from the table: "external_data_info" using primary key columns
  """
  external_data_info_by_pk(external_data_id: uuid!): external_data_info

  """
  fetch data from the table in a streaming manner: "external_data_info"
  """
  external_data_info_stream(
    """maximum number of rows returned in a single batch"""
    batch_size: Int!

    """cursor to stream the results returned by the query"""
    cursor: [external_data_info_stream_cursor_input]!

    """filter the rows returned"""
    where: external_data_info_bool_exp
  ): [external_data_info!]!

  """
  fetch data from the table in a streaming manner: "external_data"
  """
  external_data_stream(
    """maximum number of rows returned in a single batch"""
    batch_size: Int!

    """cursor to stream the results returned by the query"""
    cursor: [external_data_stream_cursor_input]!

    """filter the rows returned"""
    where: external_data_bool_exp
  ): [external_data!]!

  """
  fetch data from the table: "external_source"
  """
  external_source(
    """distinct select on columns"""
    distinct_on: [external_source_select_column!]

    """limit the number of rows returned"""
    limit: Int

    """skip the first n rows. Use only with order_by"""
    offset: Int

    """sort the rows by one or more columns"""
    order_by: [external_source_order_by!]

    """filter the rows returned"""
    where: external_source_bool_exp
  ): [external_source!]!

  """
  fetch aggregated fields from the table: "external_source"
  """
  external_source_aggregate(
    """distinct select on columns"""
    distinct_on: [external_source_select_column!]

    """limit the number of rows returned"""
    limit: Int

    """skip the first n rows. Use only with order_by"""
    offset: Int

    """sort the rows by one or more columns"""
    order_by: [external_source_order_by!]

    """filter the rows returned"""
    where: external_source_bool_exp
  ): external_source_aggregate!

  """fetch data from the table: "external_source" using primary key columns"""
  external_source_by_pk(value: String!): external_source

  """
  fetch data from the table in a streaming manner: "external_source"
  """
  external_source_stream(
    """maximum number of rows returned in a single batch"""
    batch_size: Int!

    """cursor to stream the results returned by the query"""
    cursor: [external_source_stream_cursor_input]!

    """filter the rows returned"""
    where: external_source_bool_exp
  ): [external_source!]!

  """
  fetch data from the table: "manager"
  """
  manager(
    """distinct select on columns"""
    distinct_on: [manager_select_column!]

    """limit the number of rows returned"""
    limit: Int

    """skip the first n rows. Use only with order_by"""
    offset: Int

    """sort the rows by one or more columns"""
    order_by: [manager_order_by!]

    """filter the rows returned"""
    where: manager_bool_exp
  ): [manager!]!

  """
  fetch aggregated fields from the table: "manager"
  """
  manager_aggregate(
    """distinct select on columns"""
    distinct_on: [manager_select_column!]

    """limit the number of rows returned"""
    limit: Int

    """skip the first n rows. Use only with order_by"""
    offset: Int

    """sort the rows by one or more columns"""
    order_by: [manager_order_by!]

    """filter the rows returned"""
    where: manager_bool_exp
  ): manager_aggregate!

  """fetch data from the table: "manager" using primary key columns"""
  manager_by_pk(id: uuid!): manager

  """
  fetch data from the table in a streaming manner: "manager"
  """
  manager_stream(
    """maximum number of rows returned in a single batch"""
    batch_size: Int!

    """cursor to stream the results returned by the query"""
    cursor: [manager_stream_cursor_input]!

    """filter the rows returned"""
    where: manager_bool_exp
  ): [manager!]!

  """
  fetch data from the table: "notebook"
  """
  notebook(
    """distinct select on columns"""
    distinct_on: [notebook_select_column!]

    """limit the number of rows returned"""
    limit: Int

    """skip the first n rows. Use only with order_by"""
    offset: Int

    """sort the rows by one or more columns"""
    order_by: [notebook_order_by!]

    """filter the rows returned"""
    where: notebook_bool_exp
  ): [notebook!]!

  """
  fetch data from the table: "notebook_action"
  """
  notebook_action(
    """distinct select on columns"""
    distinct_on: [notebook_action_select_column!]

    """limit the number of rows returned"""
    limit: Int

    """skip the first n rows. Use only with order_by"""
    offset: Int

    """sort the rows by one or more columns"""
    order_by: [notebook_action_order_by!]

    """filter the rows returned"""
    where: notebook_action_bool_exp
  ): [notebook_action!]!

  """
  fetch aggregated fields from the table: "notebook_action"
  """
  notebook_action_aggregate(
    """distinct select on columns"""
    distinct_on: [notebook_action_select_column!]

    """limit the number of rows returned"""
    limit: Int

    """skip the first n rows. Use only with order_by"""
    offset: Int

    """sort the rows by one or more columns"""
    order_by: [notebook_action_order_by!]

    """filter the rows returned"""
    where: notebook_action_bool_exp
  ): notebook_action_aggregate!

  """fetch data from the table: "notebook_action" using primary key columns"""
  notebook_action_by_pk(id: uuid!): notebook_action

  """
  fetch data from the table in a streaming manner: "notebook_action"
  """
  notebook_action_stream(
    """maximum number of rows returned in a single batch"""
    batch_size: Int!

    """cursor to stream the results returned by the query"""
    cursor: [notebook_action_stream_cursor_input]!

    """filter the rows returned"""
    where: notebook_action_bool_exp
  ): [notebook_action!]!

  """
  fetch aggregated fields from the table: "notebook"
  """
  notebook_aggregate(
    """distinct select on columns"""
    distinct_on: [notebook_select_column!]

    """limit the number of rows returned"""
    limit: Int

    """skip the first n rows. Use only with order_by"""
    offset: Int

    """sort the rows by one or more columns"""
    order_by: [notebook_order_by!]

    """filter the rows returned"""
    where: notebook_bool_exp
  ): notebook_aggregate!

  """
  fetch data from the table: "notebook_appointment"
  """
  notebook_appointment(
    """distinct select on columns"""
    distinct_on: [notebook_appointment_select_column!]

    """limit the number of rows returned"""
    limit: Int

    """skip the first n rows. Use only with order_by"""
    offset: Int

    """sort the rows by one or more columns"""
    order_by: [notebook_appointment_order_by!]

    """filter the rows returned"""
    where: notebook_appointment_bool_exp
  ): [notebook_appointment!]!

  """
  fetch aggregated fields from the table: "notebook_appointment"
  """
  notebook_appointment_aggregate(
    """distinct select on columns"""
    distinct_on: [notebook_appointment_select_column!]

    """limit the number of rows returned"""
    limit: Int

    """skip the first n rows. Use only with order_by"""
    offset: Int

    """sort the rows by one or more columns"""
    order_by: [notebook_appointment_order_by!]

    """filter the rows returned"""
    where: notebook_appointment_bool_exp
  ): notebook_appointment_aggregate!

  """
  fetch data from the table: "notebook_appointment" using primary key columns
  """
  notebook_appointment_by_pk(id: uuid!): notebook_appointment

  """
  fetch data from the table in a streaming manner: "notebook_appointment"
  """
  notebook_appointment_stream(
    """maximum number of rows returned in a single batch"""
    batch_size: Int!

    """cursor to stream the results returned by the query"""
    cursor: [notebook_appointment_stream_cursor_input]!

    """filter the rows returned"""
    where: notebook_appointment_bool_exp
  ): [notebook_appointment!]!

  """fetch data from the table: "notebook" using primary key columns"""
  notebook_by_pk(id: uuid!): notebook

  """
  fetch data from the table: "notebook_event"
  """
  notebook_event(
    """distinct select on columns"""
    distinct_on: [notebook_event_select_column!]

    """limit the number of rows returned"""
    limit: Int

    """skip the first n rows. Use only with order_by"""
    offset: Int

    """sort the rows by one or more columns"""
    order_by: [notebook_event_order_by!]

    """filter the rows returned"""
    where: notebook_event_bool_exp
  ): [notebook_event!]!

  """
  fetch aggregated fields from the table: "notebook_event"
  """
  notebook_event_aggregate(
    """distinct select on columns"""
    distinct_on: [notebook_event_select_column!]

    """limit the number of rows returned"""
    limit: Int

    """skip the first n rows. Use only with order_by"""
    offset: Int

    """sort the rows by one or more columns"""
    order_by: [notebook_event_order_by!]

    """filter the rows returned"""
    where: notebook_event_bool_exp
  ): notebook_event_aggregate!

  """fetch data from the table: "notebook_event" using primary key columns"""
  notebook_event_by_pk(id: uuid!): notebook_event

  """
  fetch data from the table in a streaming manner: "notebook_event"
  """
  notebook_event_stream(
    """maximum number of rows returned in a single batch"""
    batch_size: Int!

    """cursor to stream the results returned by the query"""
    cursor: [notebook_event_stream_cursor_input]!

    """filter the rows returned"""
    where: notebook_event_bool_exp
  ): [notebook_event!]!

  """
  fetch data from the table: "notebook_event_type"
  """
  notebook_event_type(
    """distinct select on columns"""
    distinct_on: [notebook_event_type_select_column!]

    """limit the number of rows returned"""
    limit: Int

    """skip the first n rows. Use only with order_by"""
    offset: Int

    """sort the rows by one or more columns"""
    order_by: [notebook_event_type_order_by!]

    """filter the rows returned"""
    where: notebook_event_type_bool_exp
  ): [notebook_event_type!]!

  """
  fetch aggregated fields from the table: "notebook_event_type"
  """
  notebook_event_type_aggregate(
    """distinct select on columns"""
    distinct_on: [notebook_event_type_select_column!]

    """limit the number of rows returned"""
    limit: Int

    """skip the first n rows. Use only with order_by"""
    offset: Int

    """sort the rows by one or more columns"""
    order_by: [notebook_event_type_order_by!]

    """filter the rows returned"""
    where: notebook_event_type_bool_exp
  ): notebook_event_type_aggregate!

  """
  fetch data from the table: "notebook_event_type" using primary key columns
  """
  notebook_event_type_by_pk(value: String!): notebook_event_type

  """
  fetch data from the table in a streaming manner: "notebook_event_type"
  """
  notebook_event_type_stream(
    """maximum number of rows returned in a single batch"""
    batch_size: Int!

    """cursor to stream the results returned by the query"""
    cursor: [notebook_event_type_stream_cursor_input]!

    """filter the rows returned"""
    where: notebook_event_type_bool_exp
  ): [notebook_event_type!]!

  """
  fetch data from the table: "notebook_focus"
  """
  notebook_focus(
    """distinct select on columns"""
    distinct_on: [notebook_focus_select_column!]

    """limit the number of rows returned"""
    limit: Int

    """skip the first n rows. Use only with order_by"""
    offset: Int

    """sort the rows by one or more columns"""
    order_by: [notebook_focus_order_by!]

    """filter the rows returned"""
    where: notebook_focus_bool_exp
  ): [notebook_focus!]!

  """
  fetch aggregated fields from the table: "notebook_focus"
  """
  notebook_focus_aggregate(
    """distinct select on columns"""
    distinct_on: [notebook_focus_select_column!]

    """limit the number of rows returned"""
    limit: Int

    """skip the first n rows. Use only with order_by"""
    offset: Int

    """sort the rows by one or more columns"""
    order_by: [notebook_focus_order_by!]

    """filter the rows returned"""
    where: notebook_focus_bool_exp
  ): notebook_focus_aggregate!

  """fetch data from the table: "notebook_focus" using primary key columns"""
  notebook_focus_by_pk(id: uuid!): notebook_focus

  """
  fetch data from the table in a streaming manner: "notebook_focus"
  """
  notebook_focus_stream(
    """maximum number of rows returned in a single batch"""
    batch_size: Int!

    """cursor to stream the results returned by the query"""
    cursor: [notebook_focus_stream_cursor_input]!

    """filter the rows returned"""
    where: notebook_focus_bool_exp
  ): [notebook_focus!]!

  """
  fetch data from the table: "notebook_info"
  """
  notebook_info(
    """distinct select on columns"""
    distinct_on: [notebook_info_select_column!]

    """limit the number of rows returned"""
    limit: Int

    """skip the first n rows. Use only with order_by"""
    offset: Int

    """sort the rows by one or more columns"""
    order_by: [notebook_info_order_by!]

    """filter the rows returned"""
    where: notebook_info_bool_exp
  ): [notebook_info!]!

  """
  fetch aggregated fields from the table: "notebook_info"
  """
  notebook_info_aggregate(
    """distinct select on columns"""
    distinct_on: [notebook_info_select_column!]

    """limit the number of rows returned"""
    limit: Int

    """skip the first n rows. Use only with order_by"""
    offset: Int

    """sort the rows by one or more columns"""
    order_by: [notebook_info_order_by!]

    """filter the rows returned"""
    where: notebook_info_bool_exp
  ): notebook_info_aggregate!

  """fetch data from the table: "notebook_info" using primary key columns"""
  notebook_info_by_pk(notebookId: uuid!): notebook_info

  """
  fetch data from the table in a streaming manner: "notebook_info"
  """
  notebook_info_stream(
    """maximum number of rows returned in a single batch"""
    batch_size: Int!

    """cursor to stream the results returned by the query"""
    cursor: [notebook_info_stream_cursor_input]!

    """filter the rows returned"""
    where: notebook_info_bool_exp
  ): [notebook_info!]!

  """
  fetch data from the table: "notebook_member"
  """
  notebook_member(
    """distinct select on columns"""
    distinct_on: [notebook_member_select_column!]

    """limit the number of rows returned"""
    limit: Int

    """skip the first n rows. Use only with order_by"""
    offset: Int

    """sort the rows by one or more columns"""
    order_by: [notebook_member_order_by!]

    """filter the rows returned"""
    where: notebook_member_bool_exp
  ): [notebook_member!]!

  """
  fetch aggregated fields from the table: "notebook_member"
  """
  notebook_member_aggregate(
    """distinct select on columns"""
    distinct_on: [notebook_member_select_column!]

    """limit the number of rows returned"""
    limit: Int

    """skip the first n rows. Use only with order_by"""
    offset: Int

    """sort the rows by one or more columns"""
    order_by: [notebook_member_order_by!]

    """filter the rows returned"""
    where: notebook_member_bool_exp
  ): notebook_member_aggregate!

  """fetch data from the table: "notebook_member" using primary key columns"""
  notebook_member_by_pk(id: uuid!): notebook_member

  """
  fetch data from the table in a streaming manner: "notebook_member"
  """
  notebook_member_stream(
    """maximum number of rows returned in a single batch"""
    batch_size: Int!

    """cursor to stream the results returned by the query"""
    cursor: [notebook_member_stream_cursor_input]!

    """filter the rows returned"""
    where: notebook_member_bool_exp
  ): [notebook_member!]!

  """
  fetch data from the table: "notebook_public_view"
  """
  notebook_public_view(
    """distinct select on columns"""
    distinct_on: [notebook_public_view_select_column!]

    """limit the number of rows returned"""
    limit: Int

    """skip the first n rows. Use only with order_by"""
    offset: Int

    """sort the rows by one or more columns"""
    order_by: [notebook_public_view_order_by!]

    """filter the rows returned"""
    where: notebook_public_view_bool_exp
  ): [notebook_public_view!]!

  """
  fetch aggregated fields from the table: "notebook_public_view"
  """
  notebook_public_view_aggregate(
    """distinct select on columns"""
    distinct_on: [notebook_public_view_select_column!]

    """limit the number of rows returned"""
    limit: Int

    """skip the first n rows. Use only with order_by"""
    offset: Int

    """sort the rows by one or more columns"""
    order_by: [notebook_public_view_order_by!]

    """filter the rows returned"""
    where: notebook_public_view_bool_exp
  ): notebook_public_view_aggregate!

  """
  fetch data from the table in a streaming manner: "notebook_public_view"
  """
  notebook_public_view_stream(
    """maximum number of rows returned in a single batch"""
    batch_size: Int!

    """cursor to stream the results returned by the query"""
    cursor: [notebook_public_view_stream_cursor_input]!

    """filter the rows returned"""
    where: notebook_public_view_bool_exp
  ): [notebook_public_view!]!

  """
  fetch data from the table in a streaming manner: "notebook"
  """
  notebook_stream(
    """maximum number of rows returned in a single batch"""
    batch_size: Int!

    """cursor to stream the results returned by the query"""
    cursor: [notebook_stream_cursor_input]!

    """filter the rows returned"""
    where: notebook_bool_exp
  ): [notebook!]!

  """
  fetch data from the table: "notebook_target"
  """
  notebook_target(
    """distinct select on columns"""
    distinct_on: [notebook_target_select_column!]

    """limit the number of rows returned"""
    limit: Int

    """skip the first n rows. Use only with order_by"""
    offset: Int

    """sort the rows by one or more columns"""
    order_by: [notebook_target_order_by!]

    """filter the rows returned"""
    where: notebook_target_bool_exp
  ): [notebook_target!]!

  """
  fetch aggregated fields from the table: "notebook_target"
  """
  notebook_target_aggregate(
    """distinct select on columns"""
    distinct_on: [notebook_target_select_column!]

    """limit the number of rows returned"""
    limit: Int

    """skip the first n rows. Use only with order_by"""
    offset: Int

    """sort the rows by one or more columns"""
    order_by: [notebook_target_order_by!]

    """filter the rows returned"""
    where: notebook_target_bool_exp
  ): notebook_target_aggregate!

  """fetch data from the table: "notebook_target" using primary key columns"""
  notebook_target_by_pk(id: uuid!): notebook_target

  """
  fetch data from the table in a streaming manner: "notebook_target"
  """
  notebook_target_stream(
    """maximum number of rows returned in a single batch"""
    batch_size: Int!

    """cursor to stream the results returned by the query"""
    cursor: [notebook_target_stream_cursor_input]!

    """filter the rows returned"""
    where: notebook_target_bool_exp
  ): [notebook_target!]!

  """
  fetch data from the table: "orientation_manager"
  """
  orientation_manager(
    """distinct select on columns"""
    distinct_on: [orientation_manager_select_column!]

    """limit the number of rows returned"""
    limit: Int

    """skip the first n rows. Use only with order_by"""
    offset: Int

    """sort the rows by one or more columns"""
    order_by: [orientation_manager_order_by!]

    """filter the rows returned"""
    where: orientation_manager_bool_exp
  ): [orientation_manager!]!

  """
  fetch aggregated fields from the table: "orientation_manager"
  """
  orientation_manager_aggregate(
    """distinct select on columns"""
    distinct_on: [orientation_manager_select_column!]

    """limit the number of rows returned"""
    limit: Int

    """skip the first n rows. Use only with order_by"""
    offset: Int

    """sort the rows by one or more columns"""
    order_by: [orientation_manager_order_by!]

    """filter the rows returned"""
    where: orientation_manager_bool_exp
  ): orientation_manager_aggregate!

  """
  fetch data from the table: "orientation_manager" using primary key columns
  """
  orientation_manager_by_pk(id: uuid!): orientation_manager

  """
  fetch data from the table in a streaming manner: "orientation_manager"
  """
  orientation_manager_stream(
    """maximum number of rows returned in a single batch"""
    batch_size: Int!

    """cursor to stream the results returned by the query"""
    cursor: [orientation_manager_stream_cursor_input]!

    """filter the rows returned"""
    where: orientation_manager_bool_exp
  ): [orientation_manager!]!

  """
  fetch data from the table: "orientation_request"
  """
  orientation_request(
    """distinct select on columns"""
    distinct_on: [orientation_request_select_column!]

    """limit the number of rows returned"""
    limit: Int

    """skip the first n rows. Use only with order_by"""
    offset: Int

    """sort the rows by one or more columns"""
    order_by: [orientation_request_order_by!]

    """filter the rows returned"""
    where: orientation_request_bool_exp
  ): [orientation_request!]!

  """
  fetch aggregated fields from the table: "orientation_request"
  """
  orientation_request_aggregate(
    """distinct select on columns"""
    distinct_on: [orientation_request_select_column!]

    """limit the number of rows returned"""
    limit: Int

    """skip the first n rows. Use only with order_by"""
    offset: Int

    """sort the rows by one or more columns"""
    order_by: [orientation_request_order_by!]

    """filter the rows returned"""
    where: orientation_request_bool_exp
  ): orientation_request_aggregate!

  """
  fetch data from the table: "orientation_request" using primary key columns
  """
  orientation_request_by_pk(id: uuid!): orientation_request

  """
  fetch data from the table in a streaming manner: "orientation_request"
  """
  orientation_request_stream(
    """maximum number of rows returned in a single batch"""
    batch_size: Int!

    """cursor to stream the results returned by the query"""
    cursor: [orientation_request_stream_cursor_input]!

    """filter the rows returned"""
    where: orientation_request_bool_exp
  ): [orientation_request!]!

  """
  fetch data from the table: "orientation_type"
  """
  orientation_type(
    """distinct select on columns"""
    distinct_on: [orientation_type_select_column!]

    """limit the number of rows returned"""
    limit: Int

    """skip the first n rows. Use only with order_by"""
    offset: Int

    """sort the rows by one or more columns"""
    order_by: [orientation_type_order_by!]

    """filter the rows returned"""
    where: orientation_type_bool_exp
  ): [orientation_type!]!

  """
  fetch aggregated fields from the table: "orientation_type"
  """
  orientation_type_aggregate(
    """distinct select on columns"""
    distinct_on: [orientation_type_select_column!]

    """limit the number of rows returned"""
    limit: Int

    """skip the first n rows. Use only with order_by"""
    offset: Int

    """sort the rows by one or more columns"""
    order_by: [orientation_type_order_by!]

    """filter the rows returned"""
    where: orientation_type_bool_exp
  ): orientation_type_aggregate!

  """
  fetch data from the table: "orientation_type" using primary key columns
  """
  orientation_type_by_pk(id: String!): orientation_type

  """
  fetch data from the table in a streaming manner: "orientation_type"
  """
  orientation_type_stream(
    """maximum number of rows returned in a single batch"""
    batch_size: Int!

    """cursor to stream the results returned by the query"""
    cursor: [orientation_type_stream_cursor_input]!

    """filter the rows returned"""
    where: orientation_type_bool_exp
  ): [orientation_type!]!

  """
  fetch data from the table: "professional"
  """
  professional(
    """distinct select on columns"""
    distinct_on: [professional_select_column!]

    """limit the number of rows returned"""
    limit: Int

    """skip the first n rows. Use only with order_by"""
    offset: Int

    """sort the rows by one or more columns"""
    order_by: [professional_order_by!]

    """filter the rows returned"""
    where: professional_bool_exp
  ): [professional!]!

  """
  fetch aggregated fields from the table: "professional"
  """
  professional_aggregate(
    """distinct select on columns"""
    distinct_on: [professional_select_column!]

    """limit the number of rows returned"""
    limit: Int

    """skip the first n rows. Use only with order_by"""
    offset: Int

    """sort the rows by one or more columns"""
    order_by: [professional_order_by!]

    """filter the rows returned"""
    where: professional_bool_exp
  ): professional_aggregate!

  """fetch data from the table: "professional" using primary key columns"""
  professional_by_pk(id: uuid!): professional

  """
  fetch data from the table in a streaming manner: "professional"
  """
  professional_stream(
    """maximum number of rows returned in a single batch"""
    batch_size: Int!

    """cursor to stream the results returned by the query"""
    cursor: [professional_stream_cursor_input]!

    """filter the rows returned"""
    where: professional_bool_exp
  ): [professional!]!

  """
  fetch data from the table: "ref_action"
  """
  ref_action(
    """distinct select on columns"""
    distinct_on: [ref_action_select_column!]

    """limit the number of rows returned"""
    limit: Int

    """skip the first n rows. Use only with order_by"""
    offset: Int

    """sort the rows by one or more columns"""
    order_by: [ref_action_order_by!]

    """filter the rows returned"""
    where: ref_action_bool_exp
  ): [ref_action!]!

  """
  fetch aggregated fields from the table: "ref_action"
  """
  ref_action_aggregate(
    """distinct select on columns"""
    distinct_on: [ref_action_select_column!]

    """limit the number of rows returned"""
    limit: Int

    """skip the first n rows. Use only with order_by"""
    offset: Int

    """sort the rows by one or more columns"""
    order_by: [ref_action_order_by!]

    """filter the rows returned"""
    where: ref_action_bool_exp
  ): ref_action_aggregate!

  """fetch data from the table: "ref_action" using primary key columns"""
  ref_action_by_pk(id: uuid!): ref_action

  """
  fetch data from the table in a streaming manner: "ref_action"
  """
  ref_action_stream(
    """maximum number of rows returned in a single batch"""
    batch_size: Int!

    """cursor to stream the results returned by the query"""
    cursor: [ref_action_stream_cursor_input]!

    """filter the rows returned"""
    where: ref_action_bool_exp
  ): [ref_action!]!

  """
  fetch data from the table: "ref_situation"
  """
  ref_situation(
    """distinct select on columns"""
    distinct_on: [ref_situation_select_column!]

    """limit the number of rows returned"""
    limit: Int

    """skip the first n rows. Use only with order_by"""
    offset: Int

    """sort the rows by one or more columns"""
    order_by: [ref_situation_order_by!]

    """filter the rows returned"""
    where: ref_situation_bool_exp
  ): [ref_situation!]!

  """
  fetch aggregated fields from the table: "ref_situation"
  """
  ref_situation_aggregate(
    """distinct select on columns"""
    distinct_on: [ref_situation_select_column!]

    """limit the number of rows returned"""
    limit: Int

    """skip the first n rows. Use only with order_by"""
    offset: Int

    """sort the rows by one or more columns"""
    order_by: [ref_situation_order_by!]

    """filter the rows returned"""
    where: ref_situation_bool_exp
  ): ref_situation_aggregate!

  """fetch data from the table: "ref_situation" using primary key columns"""
  ref_situation_by_pk(id: uuid!): ref_situation

  """
  fetch data from the table in a streaming manner: "ref_situation"
  """
  ref_situation_stream(
    """maximum number of rows returned in a single batch"""
    batch_size: Int!

    """cursor to stream the results returned by the query"""
    cursor: [ref_situation_stream_cursor_input]!

    """filter the rows returned"""
    where: ref_situation_bool_exp
  ): [ref_situation!]!

  """
  fetch data from the table: "ref_target"
  """
  ref_target(
    """distinct select on columns"""
    distinct_on: [ref_target_select_column!]

    """limit the number of rows returned"""
    limit: Int

    """skip the first n rows. Use only with order_by"""
    offset: Int

    """sort the rows by one or more columns"""
    order_by: [ref_target_order_by!]

    """filter the rows returned"""
    where: ref_target_bool_exp
  ): [ref_target!]!

  """
  fetch aggregated fields from the table: "ref_target"
  """
  ref_target_aggregate(
    """distinct select on columns"""
    distinct_on: [ref_target_select_column!]

    """limit the number of rows returned"""
    limit: Int

    """skip the first n rows. Use only with order_by"""
    offset: Int

    """sort the rows by one or more columns"""
    order_by: [ref_target_order_by!]

    """filter the rows returned"""
    where: ref_target_bool_exp
  ): ref_target_aggregate!

  """fetch data from the table: "ref_target" using primary key columns"""
  ref_target_by_pk(id: uuid!): ref_target

  """
  fetch data from the table in a streaming manner: "ref_target"
  """
  ref_target_stream(
    """maximum number of rows returned in a single batch"""
    batch_size: Int!

    """cursor to stream the results returned by the query"""
    cursor: [ref_target_stream_cursor_input]!

    """filter the rows returned"""
    where: ref_target_bool_exp
  ): [ref_target!]!

  """
  fetch data from the table: "role"
  """
  role(
    """distinct select on columns"""
    distinct_on: [role_select_column!]

    """limit the number of rows returned"""
    limit: Int

    """skip the first n rows. Use only with order_by"""
    offset: Int

    """sort the rows by one or more columns"""
    order_by: [role_order_by!]

    """filter the rows returned"""
    where: role_bool_exp
  ): [role!]!

  """
  fetch aggregated fields from the table: "role"
  """
  role_aggregate(
    """distinct select on columns"""
    distinct_on: [role_select_column!]

    """limit the number of rows returned"""
    limit: Int

    """skip the first n rows. Use only with order_by"""
    offset: Int

    """sort the rows by one or more columns"""
    order_by: [role_order_by!]

    """filter the rows returned"""
    where: role_bool_exp
  ): role_aggregate!

  """fetch data from the table: "role" using primary key columns"""
  role_by_pk(label: String!): role

  """
  fetch data from the table in a streaming manner: "role"
  """
  role_stream(
    """maximum number of rows returned in a single batch"""
    batch_size: Int!

    """cursor to stream the results returned by the query"""
    cursor: [role_stream_cursor_input]!

    """filter the rows returned"""
    where: role_bool_exp
  ): [role!]!

  """
  fetch data from the table: "rome_code"
  """
  rome_code(
    """distinct select on columns"""
    distinct_on: [rome_code_select_column!]

    """limit the number of rows returned"""
    limit: Int

    """skip the first n rows. Use only with order_by"""
    offset: Int

    """sort the rows by one or more columns"""
    order_by: [rome_code_order_by!]

    """filter the rows returned"""
    where: rome_code_bool_exp
  ): [rome_code!]!

  """
  fetch aggregated fields from the table: "rome_code"
  """
  rome_code_aggregate(
    """distinct select on columns"""
    distinct_on: [rome_code_select_column!]

    """limit the number of rows returned"""
    limit: Int

    """skip the first n rows. Use only with order_by"""
    offset: Int

    """sort the rows by one or more columns"""
    order_by: [rome_code_order_by!]

    """filter the rows returned"""
    where: rome_code_bool_exp
  ): rome_code_aggregate!

  """fetch data from the table: "rome_code" using primary key columns"""
  rome_code_by_pk(id: uuid!): rome_code

  """
  fetch data from the table in a streaming manner: "rome_code"
  """
  rome_code_stream(
    """maximum number of rows returned in a single batch"""
    batch_size: Int!

    """cursor to stream the results returned by the query"""
    cursor: [rome_code_stream_cursor_input]!

    """filter the rows returned"""
    where: rome_code_bool_exp
  ): [rome_code!]!

  """
  execute function "search_beneficiaries" which returns "beneficiary"
  """
  search_beneficiaries(
    """
    input parameters for function "search_beneficiaries"
    """
    args: search_beneficiaries_args!

    """distinct select on columns"""
    distinct_on: [beneficiary_select_column!]

    """limit the number of rows returned"""
    limit: Int

    """skip the first n rows. Use only with order_by"""
    offset: Int

    """sort the rows by one or more columns"""
    order_by: [beneficiary_order_by!]

    """filter the rows returned"""
    where: beneficiary_bool_exp
  ): [beneficiary!]!

  """
  execute function "search_beneficiaries" and query aggregates on result of table type "beneficiary"
  """
  search_beneficiaries_aggregate(
    """
    input parameters for function "search_beneficiaries_aggregate"
    """
    args: search_beneficiaries_args!

    """distinct select on columns"""
    distinct_on: [beneficiary_select_column!]

    """limit the number of rows returned"""
    limit: Int

    """skip the first n rows. Use only with order_by"""
    offset: Int

    """sort the rows by one or more columns"""
    order_by: [beneficiary_order_by!]

    """filter the rows returned"""
    where: beneficiary_bool_exp
  ): beneficiary_aggregate!

  """
  execute function "search_notebook_members" which returns "notebook_member"
  """
  search_notebook_members(
    """
    input parameters for function "search_notebook_members"
    """
    args: search_notebook_members_args!

    """distinct select on columns"""
    distinct_on: [notebook_member_select_column!]

    """limit the number of rows returned"""
    limit: Int

    """skip the first n rows. Use only with order_by"""
    offset: Int

    """sort the rows by one or more columns"""
    order_by: [notebook_member_order_by!]

    """filter the rows returned"""
    where: notebook_member_bool_exp
  ): [notebook_member!]!

  """
  execute function "search_notebook_members" and query aggregates on result of table type "notebook_member"
  """
  search_notebook_members_aggregate(
    """
    input parameters for function "search_notebook_members_aggregate"
    """
    args: search_notebook_members_args!

    """distinct select on columns"""
    distinct_on: [notebook_member_select_column!]

    """limit the number of rows returned"""
    limit: Int

    """skip the first n rows. Use only with order_by"""
    offset: Int

    """sort the rows by one or more columns"""
    order_by: [notebook_member_order_by!]

    """filter the rows returned"""
    where: notebook_member_bool_exp
  ): notebook_member_aggregate!

  """
  execute function "search_public_notebooks" which returns "notebook_public_view"
  """
  search_public_notebooks(
    """
    input parameters for function "search_public_notebooks"
    """
    args: search_public_notebooks_args!

    """distinct select on columns"""
    distinct_on: [notebook_public_view_select_column!]

    """limit the number of rows returned"""
    limit: Int

    """skip the first n rows. Use only with order_by"""
    offset: Int

    """sort the rows by one or more columns"""
    order_by: [notebook_public_view_order_by!]

    """filter the rows returned"""
    where: notebook_public_view_bool_exp
  ): [notebook_public_view!]!

  """
  execute function "search_public_notebooks" and query aggregates on result of table type "notebook_public_view"
  """
  search_public_notebooks_aggregate(
    """
    input parameters for function "search_public_notebooks_aggregate"
    """
    args: search_public_notebooks_args!

    """distinct select on columns"""
    distinct_on: [notebook_public_view_select_column!]

    """limit the number of rows returned"""
    limit: Int

    """skip the first n rows. Use only with order_by"""
    offset: Int

    """sort the rows by one or more columns"""
    order_by: [notebook_public_view_order_by!]

    """filter the rows returned"""
    where: notebook_public_view_bool_exp
  ): notebook_public_view_aggregate!

  """
  execute function "search_rome_codes" which returns "rome_code"
  """
  search_rome_codes(
    """
    input parameters for function "search_rome_codes"
    """
    args: search_rome_codes_args!

    """distinct select on columns"""
    distinct_on: [rome_code_select_column!]

    """limit the number of rows returned"""
    limit: Int

    """skip the first n rows. Use only with order_by"""
    offset: Int

    """sort the rows by one or more columns"""
    order_by: [rome_code_order_by!]

    """filter the rows returned"""
    where: rome_code_bool_exp
  ): [rome_code!]!

  """
  execute function "search_rome_codes" and query aggregates on result of table type "rome_code"
  """
  search_rome_codes_aggregate(
    """
    input parameters for function "search_rome_codes_aggregate"
    """
    args: search_rome_codes_args!

    """distinct select on columns"""
    distinct_on: [rome_code_select_column!]

    """limit the number of rows returned"""
    limit: Int

    """skip the first n rows. Use only with order_by"""
    offset: Int

    """sort the rows by one or more columns"""
    order_by: [rome_code_order_by!]

    """filter the rows returned"""
    where: rome_code_bool_exp
  ): rome_code_aggregate!

  """
  fetch data from the table: "structure"
  """
  structure(
    """distinct select on columns"""
    distinct_on: [structure_select_column!]

    """limit the number of rows returned"""
    limit: Int

    """skip the first n rows. Use only with order_by"""
    offset: Int

    """sort the rows by one or more columns"""
    order_by: [structure_order_by!]

    """filter the rows returned"""
    where: structure_bool_exp
  ): [structure!]!

  """
  fetch aggregated fields from the table: "structure"
  """
  structure_aggregate(
    """distinct select on columns"""
    distinct_on: [structure_select_column!]

    """limit the number of rows returned"""
    limit: Int

    """skip the first n rows. Use only with order_by"""
    offset: Int

    """sort the rows by one or more columns"""
    order_by: [structure_order_by!]

    """filter the rows returned"""
    where: structure_bool_exp
  ): structure_aggregate!

  """fetch data from the table: "structure" using primary key columns"""
  structure_by_pk(id: uuid!): structure

  """
  fetch data from the table in a streaming manner: "structure"
  """
  structure_stream(
    """maximum number of rows returned in a single batch"""
    batch_size: Int!

    """cursor to stream the results returned by the query"""
    cursor: [structure_stream_cursor_input]!

    """filter the rows returned"""
    where: structure_bool_exp
  ): [structure!]!

  """
  fetch data from the table: "wanted_job"
  """
  wanted_job(
    """distinct select on columns"""
    distinct_on: [wanted_job_select_column!]

    """limit the number of rows returned"""
    limit: Int

    """skip the first n rows. Use only with order_by"""
    offset: Int

    """sort the rows by one or more columns"""
    order_by: [wanted_job_order_by!]

    """filter the rows returned"""
    where: wanted_job_bool_exp
  ): [wanted_job!]!

  """
  fetch aggregated fields from the table: "wanted_job"
  """
  wanted_job_aggregate(
    """distinct select on columns"""
    distinct_on: [wanted_job_select_column!]

    """limit the number of rows returned"""
    limit: Int

    """skip the first n rows. Use only with order_by"""
    offset: Int

    """sort the rows by one or more columns"""
    order_by: [wanted_job_order_by!]

    """filter the rows returned"""
    where: wanted_job_bool_exp
  ): wanted_job_aggregate!

  """fetch data from the table: "wanted_job" using primary key columns"""
  wanted_job_by_pk(id: uuid!): wanted_job

  """
  fetch data from the table in a streaming manner: "wanted_job"
  """
  wanted_job_stream(
    """maximum number of rows returned in a single batch"""
    batch_size: Int!

    """cursor to stream the results returned by the query"""
    cursor: [wanted_job_stream_cursor_input]!

    """filter the rows returned"""
    where: wanted_job_bool_exp
  ): [wanted_job!]!
}

scalar timestamp

"""
Boolean expression to compare columns of type "timestamp". All fields are combined with logical 'AND'.
"""
input timestamp_comparison_exp {
  _eq: timestamp
  _gt: timestamp
  _gte: timestamp
  _in: [timestamp!]
  _is_null: Boolean
  _lt: timestamp
  _lte: timestamp
  _neq: timestamp
  _nin: [timestamp!]
}

scalar timestamptz

"""
Boolean expression to compare columns of type "timestamptz". All fields are combined with logical 'AND'.
"""
input timestamptz_comparison_exp {
  _eq: timestamptz
  _gt: timestamptz
  _gte: timestamptz
  _in: [timestamptz!]
  _is_null: Boolean
  _lt: timestamptz
  _lte: timestamptz
  _neq: timestamptz
  _nin: [timestamptz!]
}

scalar uuid

"""
Boolean expression to compare columns of type "uuid". All fields are combined with logical 'AND'.
"""
input uuid_comparison_exp {
  _eq: uuid
  _gt: uuid
  _gte: uuid
  _in: [uuid!]
  _is_null: Boolean
  _lt: uuid
  _lte: uuid
  _neq: uuid
  _nin: [uuid!]
}

"""Stores the jobs wanted for a notebook beneficiary"""
type wanted_job {
  created_at: timestamptz
  id: uuid!

  """An object relationship"""
  notebook: notebook!
  notebook_id: uuid!

  """An object relationship"""
  rome_code: rome_code!
  rome_code_id: uuid!
  updated_at: timestamptz
}

"""
aggregated selection of "wanted_job"
"""
type wanted_job_aggregate {
  aggregate: wanted_job_aggregate_fields
  nodes: [wanted_job!]!
}

input wanted_job_aggregate_bool_exp {
  count: wanted_job_aggregate_bool_exp_count
}

input wanted_job_aggregate_bool_exp_count {
  arguments: [wanted_job_select_column!]
  distinct: Boolean
  filter: wanted_job_bool_exp
  predicate: Int_comparison_exp!
}

"""
aggregate fields of "wanted_job"
"""
type wanted_job_aggregate_fields {
  count(columns: [wanted_job_select_column!], distinct: Boolean): Int!
  max: wanted_job_max_fields
  min: wanted_job_min_fields
}

"""
order by aggregate values of table "wanted_job"
"""
input wanted_job_aggregate_order_by {
  count: order_by
  max: wanted_job_max_order_by
  min: wanted_job_min_order_by
}

"""
input type for inserting array relation for remote table "wanted_job"
"""
input wanted_job_arr_rel_insert_input {
  data: [wanted_job_insert_input!]!

  """upsert condition"""
  on_conflict: wanted_job_on_conflict
}

"""
Boolean expression to filter rows from the table "wanted_job". All fields are combined with a logical 'AND'.
"""
input wanted_job_bool_exp {
  _and: [wanted_job_bool_exp!]
  _not: wanted_job_bool_exp
  _or: [wanted_job_bool_exp!]
  created_at: timestamptz_comparison_exp
  id: uuid_comparison_exp
  notebook: notebook_bool_exp
  notebook_id: uuid_comparison_exp
  rome_code: rome_code_bool_exp
  rome_code_id: uuid_comparison_exp
  updated_at: timestamptz_comparison_exp
}

"""
unique or primary key constraints on table "wanted_job"
"""
enum wanted_job_constraint {
  """
  unique or primary key constraint on columns "rome_code_id", "notebook_id"
  """
  wanted_job_notebook_id_rome_code_id_key

  """
  unique or primary key constraint on columns "id"
  """
  wanted_job_pkey
}

"""
input type for inserting data into table "wanted_job"
"""
input wanted_job_insert_input {
  created_at: timestamptz
  id: uuid
  notebook: notebook_obj_rel_insert_input
  notebook_id: uuid
  rome_code: rome_code_obj_rel_insert_input
  rome_code_id: uuid
  updated_at: timestamptz
}

"""aggregate max on columns"""
type wanted_job_max_fields {
  created_at: timestamptz
  id: uuid
  notebook_id: uuid
  rome_code_id: uuid
  updated_at: timestamptz
}

"""
order by max() on columns of table "wanted_job"
"""
input wanted_job_max_order_by {
  created_at: order_by
  id: order_by
  notebook_id: order_by
  rome_code_id: order_by
  updated_at: order_by
}

"""aggregate min on columns"""
type wanted_job_min_fields {
  created_at: timestamptz
  id: uuid
  notebook_id: uuid
  rome_code_id: uuid
  updated_at: timestamptz
}

"""
order by min() on columns of table "wanted_job"
"""
input wanted_job_min_order_by {
  created_at: order_by
  id: order_by
  notebook_id: order_by
  rome_code_id: order_by
  updated_at: order_by
}

"""
response of any mutation on the table "wanted_job"
"""
type wanted_job_mutation_response {
  """number of rows affected by the mutation"""
  affected_rows: Int!

  """data from the rows affected by the mutation"""
  returning: [wanted_job!]!
}

"""
on_conflict condition type for table "wanted_job"
"""
input wanted_job_on_conflict {
  constraint: wanted_job_constraint!
  update_columns: [wanted_job_update_column!]! = []
  where: wanted_job_bool_exp
}

"""Ordering options when selecting data from "wanted_job"."""
input wanted_job_order_by {
  created_at: order_by
  id: order_by
  notebook: notebook_order_by
  notebook_id: order_by
  rome_code: rome_code_order_by
  rome_code_id: order_by
  updated_at: order_by
}

"""primary key columns input for table: wanted_job"""
input wanted_job_pk_columns_input {
  id: uuid!
}

"""
select columns of table "wanted_job"
"""
enum wanted_job_select_column {
  """column name"""
  created_at

  """column name"""
  id

  """column name"""
  notebook_id

  """column name"""
  rome_code_id

  """column name"""
  updated_at
}

"""
input type for updating data in table "wanted_job"
"""
input wanted_job_set_input {
  created_at: timestamptz
  id: uuid
  notebook_id: uuid
  rome_code_id: uuid
  updated_at: timestamptz
}

"""
Streaming cursor of the table "wanted_job"
"""
input wanted_job_stream_cursor_input {
  """Stream column input with initial value"""
  initial_value: wanted_job_stream_cursor_value_input!

  """cursor ordering"""
  ordering: cursor_ordering
}

"""Initial value of the column from where the streaming should start"""
input wanted_job_stream_cursor_value_input {
  created_at: timestamptz
  id: uuid
  notebook_id: uuid
  rome_code_id: uuid
  updated_at: timestamptz
}

"""
update columns of table "wanted_job"
"""
enum wanted_job_update_column {
  """column name"""
  created_at

  """column name"""
  id

  """column name"""
  notebook_id

  """column name"""
  rome_code_id

  """column name"""
  updated_at
}

input wanted_job_updates {
  """sets the columns of the filtered rows to the given values"""
  _set: wanted_job_set_input
  where: wanted_job_bool_exp!
}
    '''
)
