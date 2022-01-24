
DROP TABLE "public"."notebook_member_history";

alter table "public"."waiting_supervision" drop constraint "waiting_supervision_created_by_fkey";

-- Could not auto-generate a down migration.
-- Please write an appropriate down migration for the SQL below:
-- alter table "public"."waiting_supervision" add column "created_by" uuid
--  not null;

-- Could not auto-generate a down migration.
-- Please write an appropriate down migration for the SQL below:
-- alter table "public"."waiting_supervision" add column "updated_at" timestamptz
--  not null default now();
--
-- CREATE OR REPLACE FUNCTION "public"."set_current_timestamp_updated_at"()
-- RETURNS TRIGGER AS $$
-- DECLARE
--   _new record;
-- BEGIN
--   _new := NEW;
--   _new."updated_at" = NOW();
--   RETURN _new;
-- END;
-- $$ LANGUAGE plpgsql;
-- CREATE TRIGGER "set_public_waiting_supervision_updated_at"
-- BEFORE UPDATE ON "public"."waiting_supervision"
-- FOR EACH ROW
-- EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
-- COMMENT ON TRIGGER "set_public_waiting_supervision_updated_at" ON "public"."waiting_supervision"
-- IS 'trigger to set value of column "updated_at" to current timestamp on row update';

-- Could not auto-generate a down migration.
-- Please write an appropriate down migration for the SQL below:
-- alter table "public"."waiting_supervision" add column "created_at" timestamptz
--  not null default now();

alter table "public"."notebook_member" alter column "status" set default ''ACTIVE'::text';
alter table "public"."notebook_member" alter column "status" drop not null;
alter table "public"."notebook_member" add column "status" text;

-- Could not auto-generate a down migration.
-- Please write an appropriate down migration for the SQL below:
-- alter table "public"."notebook_member" add column "status" text
--  not null default 'ACTIVE';

DROP TABLE "public"."waiting_supervision";
