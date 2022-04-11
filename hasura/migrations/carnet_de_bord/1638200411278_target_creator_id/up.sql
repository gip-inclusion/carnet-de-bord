
alter table "public"."notebook_target" add column "creator_id" uuid
 null;

alter table "public"."notebook_target"
  add constraint "notebook_target_creator_id_fkey"
  foreign key ("creator_id")
  references "public"."professional"
  ("id") on update restrict on delete restrict;

update notebook_target
set creator_id
= (
    SELECT creator_id "creator"
    FROM notebook_focus "focus"
    WHERE id = notebook_target.focus_id
);

alter table "public"."notebook_target" alter column "creator_id" set not null;
