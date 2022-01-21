alter table "public"."beneficiary" add constraint "beneficiary_firstname_caf_number_date_of_birth_lastname_deployment_id_key" unique ("firstname", "caf_number", "date_of_birth", "lastname", "deployment_id");

alter table "public"."beneficiary" add constraint "beneficiary_pe_number_lastname_firstname_date_of_birth_deployment_id_key" unique ("pe_number", "lastname", "firstname", "date_of_birth", "deployment_id");

alter table "public"."beneficiary" drop constraint "beneficiary_email_unique";

