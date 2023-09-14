-- Could not auto-generate a down migration.
-- Please write an appropriate down migration for the SQL below:
-- alter table "public"."notebook_target" add column "user_consent" boolean
--  not null default 'false';
ALTER TABLE "public"."notebook_target" DROP COLUMN "user_consent";
