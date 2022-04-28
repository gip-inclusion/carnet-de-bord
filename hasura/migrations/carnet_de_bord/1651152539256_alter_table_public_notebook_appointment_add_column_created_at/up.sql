alter table "public"."notebook_appointment" add column "created_at" timestamptz
 null default now();
