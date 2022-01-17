alter table "public"."notebook_target" drop constraint "notebook_target_focus_id_target_key";
alter table "public"."notebook_action" drop constraint "notebook_action_initial_id_key";
alter table "public"."notebook_action" drop column "initial_id";
