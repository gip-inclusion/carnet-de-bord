
alter table "public"."notebook_action" add column "starting_at" timestamptz
 null;

update notebook_action a set starting_at=(select created_at from notebook_action b where a.id = b.id);

alter table notebook_action alter column "starting_at" set NOT NULL;
