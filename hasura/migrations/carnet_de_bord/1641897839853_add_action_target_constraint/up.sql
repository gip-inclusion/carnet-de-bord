
alter table "public"."notebook_action" add column "initial_id" varchar  null;

alter table "public"."notebook_action" add constraint "notebook_action_initial_id_key" unique ("initial_id");

alter table "public"."notebook_target" add constraint "notebook_target_focus_id_target_key" unique ("focus_id", "target");
