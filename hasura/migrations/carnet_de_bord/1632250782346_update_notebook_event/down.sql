
-- Could not auto-generate a down migration.
-- Please write an appropriate down migration for the SQL below:
-- alter table "public"."notebook_event" add column "structure" varchar
--  null;

-- Could not auto-generate a down migration.
-- Please write an appropriate down migration for the SQL below:
-- alter table "public"."notebook_event" add column "event" varchar
--  null;

alter table "public"."notebook_event" alter column "data" drop not null;
alter table "public"."notebook_event" add column "data" jsonb;
