
alter table "public"."notebook_action" alter column "structure_id" drop not null;
alter table "public"."notebook_action" add column "structure_id" uuid;

alter table "public"."notebook_action"
  add constraint "notebook_action_structure_id_fkey"
  foreign key ("structure_id")
  references "public"."structure"
  ("id") on update restrict on delete restrict;
