update notebook_member set active = true where active is null;

alter table "public"."notebook_member" alter column "active" set not null;
