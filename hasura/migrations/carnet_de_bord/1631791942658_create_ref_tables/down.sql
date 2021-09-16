
-- Could not auto-generate a down migration.
-- Please write an appropriate down migration for the SQL below:
-- alter table "public"."ref_target" add column "theme" varchar
--  null;

alter table "public"."ref_target"
  add constraint "ref_target_situation_id_fkey"
  foreign key (situation_id)
  references "public"."ref_situation"
  (id) on update restrict on delete cascade;
alter table "public"."ref_target" alter column "situation_id" drop not null;
alter table "public"."ref_target" add column "situation_id" uuid;

DROP TABLE "public"."ref_action";

DROP TABLE "public"."ref_target";

DROP TABLE "public"."ref_situation";
