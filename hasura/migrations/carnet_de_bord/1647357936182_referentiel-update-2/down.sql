alter table "public"."notebook_action" alter column "status" drop default;
alter table "public"."notebook_action" drop constraint "notebook_action_target_id_action_key";
