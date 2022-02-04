

alter table "public"."account" add constraint "account_admin_structure_id_key" unique ("admin_structure_id");


alter table "public"."account" drop constraint "Account must be linked to a profile of the right type";
alter table "public"."account" add constraint "Account must be linked to a profile of the right type" check (type::text = 'manager'::text AND manager_id IS NOT NULL OR type::text = 'beneficiary'::text AND beneficiary_id IS NOT NULL OR type::text = 'professional'::text AND professional_id IS NOT NULL OR type::text = 'admin_cdb'::text AND admin_id IS NOT NULL OR type::text = 'admin_structure'::text AND admin_structure_id IS NOT NULL);
