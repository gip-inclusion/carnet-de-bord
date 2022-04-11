
alter table "public"."notebook_target" alter column "creator_id" drop not null;


alter table "public"."notebook_target" drop constraint "notebook_target_creator_id_fkey";


alter table "public"."notebook_target" drop column "creator_id";
