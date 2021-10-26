alter table "public"."ref_action" drop column "theme";

alter table "public"."ref_action" add column "target_id" uuid not null;

alter table "public"."ref_action"
  add constraint "ref_action_target_id_fkey"
  foreign key ("target_id")
  references "public"."ref_target"
  ("id") on update restrict on delete cascade;

alter table "public"."ref_target" alter column "theme" drop not null;