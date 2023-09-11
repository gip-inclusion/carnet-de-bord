alter table "public"."notebook_target" add column "user_consent" boolean
 not null default 'false';
