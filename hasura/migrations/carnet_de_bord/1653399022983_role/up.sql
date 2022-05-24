CREATE TABLE "public"."role" ("label" text NOT NULL, PRIMARY KEY ("label"));
COMMENT ON TABLE "public"."role" IS E'liste des roles';

INSERT INTO public.role
VALUES ('admin_cdb'),
	('manager'),
	('admin_structure'),
	('orientation_manager'),
	('professional'),
	('beneficiary');

alter table "public"."account"
	add constraint "account_type_fkey" foreign key ("type") references "public"."role" ("label") on update restrict on delete restrict;
