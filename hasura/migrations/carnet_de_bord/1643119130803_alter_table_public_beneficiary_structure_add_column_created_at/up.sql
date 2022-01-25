alter table "public"."beneficiary_structure" add column "created_at" timestamptz
 null default now();
