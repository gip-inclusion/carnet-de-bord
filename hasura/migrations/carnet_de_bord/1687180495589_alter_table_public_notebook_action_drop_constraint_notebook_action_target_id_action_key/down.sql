alter table "public"."notebook_action" add constraint "notebook_action_action_target_id_key" unique ("action", "target_id");
