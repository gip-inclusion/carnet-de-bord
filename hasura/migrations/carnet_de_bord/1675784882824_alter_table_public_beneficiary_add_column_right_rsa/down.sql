alter table "public"."notebook" add column "right_rsa" varchar null;
alter table "public"."notebook" add column "right_are" boolean not null default 'false';
alter table "public"."notebook" add column "right_ass" boolean null default 'false';
alter table "public"."notebook" add column "right_bonus" boolean not null default 'false';

UPDATE notebook n set right_rsa=b.right_rsa, right_are=b.right_are, right_ass=b.right_ass, right_bonus=b.right_bonus
	FROM beneficiary as b
	WHERE n.beneficiary_id = b.id;

alter table "public"."beneficiary" drop column "right_rsa";
alter table "public"."beneficiary" drop column "right_are";
alter table "public"."beneficiary" drop column "right_ass";
alter table "public"."beneficiary" drop column "right_bonus";
