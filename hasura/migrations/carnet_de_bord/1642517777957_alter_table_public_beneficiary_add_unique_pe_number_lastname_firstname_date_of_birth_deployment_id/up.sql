alter table "public"."beneficiary" drop constraint "beneficiary_firstname_lastname_date_of_birth_pe_number_key";
alter table "public"."beneficiary" add constraint "beneficiary_pe_number_lastname_firstname_date_of_birth_deployment_id_key" unique ("pe_number", "lastname", "firstname", "date_of_birth", "deployment_id");
