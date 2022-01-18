alter table "public"."beneficiary" add constraint "beneficiary_firstname_lastname_date_of_birth_pe_number_key" unique ("firstname", "lastname", "date_of_birth", "pe_number");
