alter table "public"."account"
  add constraint "account_admin_structure_id_fkey"
  foreign key ("admin_structure_id")
  references "public"."admin_structure"
  ("id") on update restrict on delete restrict;
