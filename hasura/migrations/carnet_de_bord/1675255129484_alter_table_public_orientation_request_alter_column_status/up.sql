alter table "public"."orientation_request" alter column "status" set default 'pending';

UPDATE orientation_request
SET status = 'pending'
WHERE status = 'current';
