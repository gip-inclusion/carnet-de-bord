


alter table "public"."notebook_member" add column "creation_date" timestamptz
 not null default now();

alter table "public"."notebook_member" add column "creator_id" uuid
 null;

alter table "public"."notebook_member"
  add constraint "notebook_member_creator_id_fkey"
  foreign key ("creator_id")
  references "public"."professional"
  ("id") on update restrict on delete restrict;

alter table "public"."notebook_member" add column "invitation_send_date" timestamptz
 null;

alter table "public"."notebook_member" add constraint "notebook_member_notebook_id_professional_id_key" unique ("notebook_id", "professional_id");
