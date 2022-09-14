alter table "public"."notebook_appointment"
  add constraint "notebook_appointment_deleted_by_fkey"
  foreign key ("deleted_by")
  references "public"."account"
  ("id") on update no action on delete no action;
