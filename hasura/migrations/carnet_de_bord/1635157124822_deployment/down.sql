
alter table "public"."structure" drop constraint "structure_deployment_id_fkey";

-- Could not auto-generate a down migration.
-- Please write an appropriate down migration for the SQL below:
-- alter table "public"."structure" add column "deployment_id" uuid
--  null;

alter table "public"."beneficiary" drop constraint "beneficiary_deployment_id_fkey";

-- Could not auto-generate a down migration.
-- Please write an appropriate down migration for the SQL below:
-- alter table "public"."beneficiary" add column "deployment_id" uuid
--  null;

alter table "public"."account" drop constraint "account_manager_id_fkey";

-- Could not auto-generate a down migration.
-- Please write an appropriate down migration for the SQL below:
-- alter table "public"."account" add column "manager_id" uuid
--  null;

DROP TABLE IF EXISTS "public"."manager";

DROP DOMAIN IF EXISTS email;

DROP TABLE "public"."deployment";
