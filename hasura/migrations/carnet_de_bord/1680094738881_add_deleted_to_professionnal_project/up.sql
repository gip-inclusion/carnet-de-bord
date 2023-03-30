
alter table "public"."professional_project" add column "updated_by" UUID
 null;

alter table "public"."professional_project" add column "created_by" uuid
 null;

alter table "public"."professional_project" add column "deleted_at" timestamptz
 null;

alter table "public"."professional_project" add column "deleted_by" uuid
 null;

alter table "public"."professional_project"
  add constraint "professional_project_updated_by_fkey"
  foreign key ("updated_by")
  references "public"."account"
  ("id") on update set null on delete set null;

alter table "public"."professional_project"
  add constraint "professional_project_created_by_fkey"
  foreign key ("created_by")
  references "public"."account"
  ("id") on update set null on delete set null;


alter table "public"."professional_project"
  add constraint "professional_project_deleted_by_fkey"
  foreign key ("deleted_by")
  references "public"."account"
  ("id") on update set null on delete set null;
