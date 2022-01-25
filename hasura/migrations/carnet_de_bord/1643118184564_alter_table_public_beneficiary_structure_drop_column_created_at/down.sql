alter table "public"."beneficiary_structure" alter column "created_at" set default now();
alter table "public"."beneficiary_structure" alter column "created_at" drop not null;
alter table "public"."beneficiary_structure" add column "created_at" timestamptz;
