alter table "public"."account" add column "refresh_token_date" timestamptz
 null default now();
