CREATE  INDEX "beneficiary_email_unique" on
  "public"."beneficiary" using btree ("email");

alter table "public"."beneficiary" add constraint "beneficiary_email_key" unique ("email");

alter table "public"."beneficiary" drop constraint "beneficiary_pe_number_lastname_firstname_date_of_birth_deployment_id_key";

alter table "public"."beneficiary" drop constraint "beneficiary_firstname_caf_number_date_of_birth_lastname_deployment_id_key";
