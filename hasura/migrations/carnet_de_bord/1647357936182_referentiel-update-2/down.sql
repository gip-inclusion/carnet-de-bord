alter table "public"."notebook_action" alter column "status" drop default;

alter table "public"."notebook_target" drop constraint "notebook_target_focus_id_target_key";
