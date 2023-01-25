-- merge deployment_orientation_system with orientation_system

alter table "public"."orientation_system" add column "deployment_id" uuid null;

alter table "public"."orientation_system"
  add constraint "orientation_system_deployment_id_fkey"
  foreign key ("deployment_id")
  references "public"."deployment"
  ("id") on update restrict on delete restrict;

UPDATE orientation_system
SET deployment_id = deployment_orientation_system.deployment_id
FROM deployment_orientation_system
WHERE deployment_orientation_system.orientation_system_id = orientation_system.id;

alter table "public"."orientation_system" alter column "deployment_id" set not null;

drop table deployment_orientation_system;


-- notebook_info table

alter table "public"."notebook_info" drop constraint "notebook_info_orientation_fkey";

alter table "public"."notebook_info" add column "orientation_system_id" uuid null;

alter table "public"."notebook_info"
  add constraint "notebook_info_orientation_system_id_fkey"
  foreign key ("orientation_system_id")
  references "public"."orientation_system"
  ("id") on update restrict on delete restrict;


UPDATE notebook_info
SET orientation_system_id=orientation_system.id
FROM orientation_system
WHERE notebook_info.orientation=orientation_system.orientation_type
	AND orientation_system.name IN ('Pro','Social','Socio-pro');

alter table "public"."notebook_info" drop column "orientation" cascade;


-- orientation_request table

alter table "public"."orientation_request" add column "requested_orientation_system_id" uuid null;

alter table "public"."orientation_request" add column "decided_orientation_system_id" UUID null;

alter table "public"."orientation_request"
  add constraint "orientation_request_requested_orientation_system_id_fkey"
  foreign key ("requested_orientation_system_id")
  references "public"."orientation_system"
  ("id") on update restrict on delete restrict;

alter table "public"."orientation_request"
  add constraint "orientation_request_decided_orientation_system_id_fkey"
  foreign key ("decided_orientation_system_id")
  references "public"."orientation_system"
  ("id") on update restrict on delete restrict;

UPDATE orientation_request
SET requested_orientation_system_id=orientation_system.id
FROM orientation_system
WHERE orientation_request.requested_orientation_type_id=orientation_system.orientation_type
	AND name IN ('Pro','Social','Socio-pro');

UPDATE orientation_request
SET decided_orientation_system_id=orientation_system.id
FROM orientation_system
WHERE orientation_request.decided_orientation_type_id=orientation_system.orientation_type
	AND name IN ('Pro','Social','Socio-pro');

alter table "public"."orientation_request" alter column "requested_orientation_system_id" set not null;

alter table "public"."orientation_request" drop column "requested_orientation_type_id" cascade;
alter table "public"."orientation_request" drop column "decided_orientation_type_id" cascade;
