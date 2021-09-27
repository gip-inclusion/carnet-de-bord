
alter table "public"."structure" add column "zoho_id" varchar
 null unique;

alter table "public"."beneficiary" add column "zoho_id" varchar
 null unique;

alter table "public"."professional" add column "zoho_id" varchar
 null unique;
