alter table "public"."beneficiary" drop constraint "beneficiary_firstname_caf_number_date_of_birth_lastname_deployment_id_key";
alter table "public"."beneficiary" add constraint "beneficiary_firstname_caf_number_date_of_birth_lastname_key" unique ("firstname", "caf_number", "date_of_birth", "lastname");
