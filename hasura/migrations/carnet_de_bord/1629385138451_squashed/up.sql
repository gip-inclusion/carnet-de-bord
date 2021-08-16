
alter table "public"."account" add column "confirmed" boolean
 not null default 'false';

alter table "public"."professional" add column "position" text
 null;

alter table "public"."account" add column "onboarding_done" boolean
 null default 'false';

alter table "public"."professional" add column "mobile_number" varchar
 null;
