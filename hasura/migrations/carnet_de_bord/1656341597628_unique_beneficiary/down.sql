
alter table "public"."beneficiary" add constraint "beneficiary_pe_number_lastname_firstname_date_of_birth_deployme" unique ("date_of_birth", "pe_number", "lastname", "firstname", "deployment_id");

alter table "public"."beneficiary" add constraint "beneficiary_firstname_caf_number_date_of_birth_lastname_deploym" unique ("firstname", "deployment_id", "lastname", "caf_number", "date_of_birth");

DROP INDEX IF EXISTS "firstname_lastname_date_of_birth_unique_idx";
