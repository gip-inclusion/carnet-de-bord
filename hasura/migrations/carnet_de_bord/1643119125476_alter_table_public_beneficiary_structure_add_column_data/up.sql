alter table "public"."beneficiary_structure" add column "data" jsonb
 not null default jsonb_build_object();
