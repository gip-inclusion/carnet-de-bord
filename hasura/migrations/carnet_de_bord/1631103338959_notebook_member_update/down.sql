
alter table "public"."notebook_member" drop constraint "notebook_member_notebook_id_professional_id_key";


-- Could not auto-generate a down migration.
-- Please write an appropriate down migration for the SQL below:
-- alter table "public"."notebook_member" add column "invitation_send_date" timestamptz
--  null;


alter table "public"."notebook_member" drop constraint "notebook_member_creator_id_fkey";

-- Could not auto-generate a down migration.
-- Please write an appropriate down migration for the SQL below:
-- alter table "public"."notebook_member" add column "creator_id" uuid
--  null;

-- Could not auto-generate a down migration.
-- Please write an appropriate down migration for the SQL below:
-- alter table "public"."notebook_member" add column "creation_date" timestamptz
--  not null default now();
