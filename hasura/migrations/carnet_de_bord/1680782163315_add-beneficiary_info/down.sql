DROP FUNCTION IF EXISTS public.get_beneficiaries_from_nir;

alter table "public"."beneficiary" drop column "rsa_closure_date";

alter table "public"."beneficiary" drop column "rsa_closure_reason";

alter table "public"."beneficiary" drop column "rsa_suspension_reason";

alter table "public"."beneficiary" drop column "subject_to_right_and_duty";

alter table "public"."beneficiary" drop column "is_homeless";

DROP TABLE "public"."rsa_suspension_reason";

DROP TABLE "public"."rsa_closure_reason";

DELETE FROM "public"."external_source" WHERE value = 'cafmsa';
