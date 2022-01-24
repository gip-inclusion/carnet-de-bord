
-- Could not auto-generate a down migration.
-- Please write an appropriate down migration for the SQL below:
-- alter table "public"."notebook" add column "internal_id" text
--  null unique;

alter table "public"."beneficiary" add constraint "beneficiary_internal_id_key" unique (internal_id);
alter table "public"."beneficiary" alter column "internal_id" drop not null;
alter table "public"."beneficiary" add column "internal_id" text;

-- Could not auto-generate a down migration.
-- Please write an appropriate down migration for the SQL below:
-- alter table "public"."beneficiary" add column "internal_id" text
--  null unique;
