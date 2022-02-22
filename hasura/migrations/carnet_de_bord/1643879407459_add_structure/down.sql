DROP TABLE "public"."admin_structure_structure";
alter table "public"."account" drop constraint "Account must be linked to a profile of the right type";
alter table "public"."account"
add constraint "Account must be linked to a profile of the right type" check (
		CHECK (
			type::text = 'manager'::text
			AND manager_id IS NOT NULL
			OR type::text = 'beneficiary'::text
			AND beneficiary_id IS NOT NULL
			OR type::text = 'professional'::text
			AND professional_id IS NOT NULL
			OR type::text = 'admin_cdb'::text
			AND admin_id IS NOT NULL
		)
	);
alter table "public"."account" drop constraint "account_admin_structure_id_key";
alter table "public"."account" drop constraint "account_admin_structure_id_fkey";
alter table "public"."account" drop column "admin_structure_id";
DROP TABLE "public"."admin_structure";
DROP TABLE "public"."beneficiary_structure";