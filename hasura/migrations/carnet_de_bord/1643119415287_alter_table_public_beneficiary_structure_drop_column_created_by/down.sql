alter table "public"."beneficiary_structure" alter column "created_by" drop not null;
alter table "public"."beneficiary_structure" add column "created_by" uuid;
