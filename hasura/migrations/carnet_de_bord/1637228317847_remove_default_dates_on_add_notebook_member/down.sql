
alter table "public"."notebook_member" alter column "notebook_modification_date" set default now();

alter table "public"."notebook_member" alter column "notebook_visit_date" set default now();
