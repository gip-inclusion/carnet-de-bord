DROP TABLE "public"."orientation_manager";

alter table "public"."account" drop column "orientation_manager_id" uuid null;

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
			OR type::text = 'admin_structure'::text
			AND admin_structure_id IS NOT NULL
		)
	);

alter table "public"."account" drop constraint "account_type_fkey";
