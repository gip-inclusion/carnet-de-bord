
alter table "public"."account" add constraint "account_manager_id_key" unique ("manager_id");

alter table "public"."account" add constraint "account_admin_id_key" unique ("admin_id");

alter table "public"."account" add constraint "account_professional_id_key" unique ("professional_id");

alter table "public"."account" add constraint "account_beneficiary_id_key" unique ("beneficiary_id");
