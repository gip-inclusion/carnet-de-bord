alter table "public"."beneficiary" add constraint "beneficiary_firstname_lastname_date_of_birth_caf_number_key" unique ("firstname", "lastname", "date_of_birth", "caf_number");
