
alter table "public"."notebook_action" drop constraint "notebook_action_structure_id_fkey";

alter table "public"."notebook_action" drop column "structure_id" cascade;
