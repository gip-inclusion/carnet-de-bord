
alter table "public"."beneficiary" drop constraint if exists "beneficiary_firstname_caf_number_date_of_birth_lastname_deploym";

alter table "public"."beneficiary" drop constraint if exists "beneficiary_pe_number_lastname_firstname_date_of_birth_deployme";


CREATE UNIQUE INDEX "firstname_lastname_date_of_birth_unique_idx" on "public"."beneficiary" (LOWER(trim(firstname)), LOWER(trim(lastname)), date_of_birth, deployment_id);
