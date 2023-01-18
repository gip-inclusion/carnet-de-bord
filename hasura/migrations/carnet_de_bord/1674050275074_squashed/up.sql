
alter table "public"."notebook_info" drop constraint "notebook_info_orientation_fkey";

alter table "public"."notebook_info" add column "orientation_system_id" uuid
 null;

alter table "public"."notebook_info"
  add constraint "notebook_info_orientation_system_id_fkey"
  foreign key ("orientation_system_id")
  references "public"."orientation_system"
  ("id") on update cascade on delete cascade;

alter table "public"."notebook_info" drop constraint "notebook_info_orientation_system_id_fkey",
  add constraint "notebook_info_orientation_system_id_fkey"
  foreign key ("orientation_system_id")
  references "public"."orientation_system"
  ("id") on update set null on delete set null;

alter table "public"."notebook_info" drop constraint "notebook_info_orientation_system_id_fkey",
  add constraint "notebook_info_orientation_system_id_fkey"
  foreign key ("orientation_system_id")
  references "public"."orientation_system"
  ("id") on update cascade on delete cascade;

WITH subquery AS (
    SELECT id, orientation_type
    FROM orientation_system
    WHERE name IN ('Pro','Social','Socio-pro')
)
UPDATE notebook_info
SET orientation_system_id=subquery.id
FROM subquery
WHERE notebook_info.orientation=subquery.orientation_type;

alter table "public"."notebook_info" drop column "orientation" cascade;

alter table "public"."orientation_request" add column "requested_orientation_system_id" uuid
 null;

alter table "public"."orientation_request" add column "decided_orientation_system_id" UUID
 null;

alter table "public"."orientation_request"
  add constraint "orientation_request_requested_orientation_system_id_fkey"
  foreign key ("requested_orientation_system_id")
  references "public"."orientation_system"
  ("id") on update cascade on delete cascade;

alter table "public"."orientation_request"
  add constraint "orientation_request_decided_orientation_system_id_fkey"
  foreign key ("decided_orientation_system_id")
  references "public"."orientation_system"
  ("id") on update cascade on delete cascade;

WITH subquery AS (
    SELECT id, orientation_type
    FROM orientation_system
    WHERE name IN ('Pro','Social','Socio-pro')
)
UPDATE orientation_request
SET requested_orientation_system_id=subquery.id
FROM subquery
WHERE orientation_request.requested_orientation_type_id=subquery.orientation_type;

WITH subquery AS (
    SELECT id, orientation_type
    FROM orientation_system
    WHERE name IN ('Pro','Social','Socio-pro')
)
UPDATE orientation_request
SET decided_orientation_system_id=subquery.id
FROM subquery
WHERE orientation_request.decided_orientation_type_id=subquery.orientation_type;

alter table "public"."orientation_request" drop column "requested_orientation_type_id" cascade;

alter table "public"."orientation_request" drop column "decided_orientation_type_id" cascade;
