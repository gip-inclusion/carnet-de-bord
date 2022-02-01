
alter table "public"."account" add constraint "Account must be linked to a profile of the right type" check (type::text = 'manager'::text AND manager_id IS NOT NULL OR type::text = 'beneficiary'::text AND beneficiary_id IS NOT NULL OR type::text = 'professional'::text AND professional_id IS NOT NULL OR type::text = 'admin_cdb'::text AND admin_id IS NOT NULL);
