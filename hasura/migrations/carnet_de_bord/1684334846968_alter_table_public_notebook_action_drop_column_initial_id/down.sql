alter table "public"."notebook_action" add column "initial_id" varchar null;
alter table "public"."notebook_action" add constraint "notebook_action_initial_id_key" unique (initial_id);
