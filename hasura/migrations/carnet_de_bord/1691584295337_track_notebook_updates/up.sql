CREATE TABLE "public"."notebook_updates_track"
(
	"notebook_id" uuid                     NOT NULL,
	"account_id"  uuid                     NOT NULL,
	"updated_at"  timestamp with time zone NOT NULL,
	"type"        text                     NOT NULL,
	"id"          uuid                     NOT NULL DEFAULT gen_random_uuid(),
	PRIMARY KEY ("id"),
	FOREIGN KEY ("notebook_id") REFERENCES "public"."notebook" ("id") ON UPDATE restrict ON DELETE restrict,
	FOREIGN KEY ("account_id") REFERENCES "public"."account" ("id") ON UPDATE restrict ON DELETE restrict
);

alter table public.notebook_updates_track
    owner to cdb;

-----------------------------------------
-- Add new triggers
-----------------------------------------

CREATE OR REPLACE FUNCTION public.notebook_beneficiary_modification_date()
	RETURNS TRIGGER
	LANGUAGE PLPGSQL
AS
$$
DECLARE
	session_variables json;
	account           uuid;
	notebook_id       uuid;
BEGIN
	session_variables := current_setting('hasura.user', 't');
	IF session_variables IS NOT NULL then
		account := session_variables ->> 'x-hasura-user-id';
		IF account IS NOT NULL then
			SELECT notebook.id into notebook_id FROM notebook where notebook.beneficiary_id = NEW.id;
			INSERT INTO notebook_updates_track (notebook_id, account_id, updated_at, type)
			VALUES (notebook_id, account, now(), 'beneficiary');
		END IF;
	END IF;
	RETURN NEW;
END ;
$$;

CREATE TRIGGER track_notebook_beneficiary_updates
	AFTER UPDATE OF updated_at
	ON public.beneficiary
	FOR EACH ROW
EXECUTE PROCEDURE public.notebook_beneficiary_modification_date();

-----------------------------------------

CREATE OR REPLACE FUNCTION public.notebook_appointment_modification_date()
	RETURNS TRIGGER
	LANGUAGE PLPGSQL
AS
$$
DECLARE
	session_variables json;
	account           uuid;
BEGIN
	session_variables := current_setting('hasura.user', 't');
	IF session_variables IS NOT NULL then
		account := session_variables ->> 'x-hasura-user-id';
		IF account IS NOT NULL then
			INSERT INTO notebook_updates_track (notebook_id, account_id, updated_at, type)
			VALUES (NEW.notebook_id, account, now(), 'beneficiary');
		END IF;
	END IF;
	RETURN NEW;
END ;
$$;

CREATE TRIGGER track_notebook_appointment_updates
	AFTER UPDATE OF updated_at
	ON public.notebook_appointment
	FOR EACH ROW
EXECUTE PROCEDURE public.notebook_appointment_modification_date();

-----------------------------------------

CREATE OR REPLACE FUNCTION public.notebook_situation_modification_date()
	RETURNS TRIGGER
	LANGUAGE PLPGSQL
AS
$$
DECLARE
	session_variables json;
	account           uuid;
BEGIN
	session_variables := current_setting('hasura.user', 't');
	IF session_variables IS NOT NULL then
		account := session_variables ->> 'x-hasura-user-id';
		IF account IS NOT NULL then
			INSERT INTO notebook_updates_track (notebook_id, account_id, updated_at, type)
			VALUES (NEW.notebook_id, account, now(), 'beneficiary');
		END IF;
	END IF;
	RETURN NEW;
END ;
$$;

CREATE TRIGGER track_notebook_situation_updates
	AFTER UPDATE
	ON public.notebook_situation
	FOR EACH ROW
EXECUTE PROCEDURE public.notebook_situation_modification_date();

-----------------------------------------
-- Change existing triggers
-----------------------------------------

CREATE OR REPLACE FUNCTION public.notebook_modification_date()
	RETURNS TRIGGER
	LANGUAGE PLPGSQL
AS
$$
DECLARE
	session_variables json;
	account           uuid;
BEGIN
	session_variables := current_setting('hasura.user', 't');
	IF session_variables IS NOT NULL then
		account := session_variables ->> 'x-hasura-user-id';
		IF account IS NOT NULL then
			UPDATE notebook_member SET last_modified_at=now() WHERE notebook_id = NEW.id AND account_id = account;
			INSERT INTO notebook_updates_track (notebook_id, account_id, updated_at, type)
			VALUES (NEW.id, account, now(), 'notebook');
		END IF;
	END IF;
	RETURN NEW;
END ;
$$;

CREATE OR REPLACE FUNCTION public.notebook_focus_modification_date()
	RETURNS TRIGGER
	LANGUAGE PLPGSQL
AS
$$
DECLARE
	session_variables json;
	account           uuid;
BEGIN
	session_variables := current_setting('hasura.user', 't');
	IF session_variables IS NOT NULL then
		account := session_variables ->> 'x-hasura-user-id';
		IF account IS NOT NULL then
			UPDATE notebook_member SET last_modified_at=now() WHERE notebook_id = NEW.notebook_id AND account_id = account;
			INSERT INTO notebook_updates_track (notebook_id, account_id, updated_at, type)
			VALUES (NEW.notebook_id, account, now(), 'focus');
		END IF;
	END IF;
	RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.notebook_target_modification_date()
	RETURNS TRIGGER
	LANGUAGE PLPGSQL
AS
$$
DECLARE
	session_variables json;
	account           uuid;
	notebook          uuid;
BEGIN
	session_variables := current_setting('hasura.user', 't');
	IF session_variables IS NOT NULL then
		account := session_variables ->> 'x-hasura-user-id';
		IF account IS NOT NULL then
			SELECT focus.notebook_id into notebook FROM public.notebook_focus as focus where focus.id = NEW.focus_id;
			UPDATE notebook_member SET last_modified_at=now() WHERE notebook_id = notebook AND account_id = account;
			INSERT INTO notebook_updates_track (notebook_id, account_id, updated_at, type)
			VALUES (notebook, account, now(), 'target');
		END IF;
	END IF;
	RETURN NEW;
END;
$$;


CREATE OR REPLACE FUNCTION public.notebook_action_modification_date()
	RETURNS TRIGGER
	LANGUAGE PLPGSQL
AS
$$
DECLARE
	session_variables json;
	account           uuid;
	notebook          uuid;
	focus             uuid;
BEGIN
	session_variables := current_setting('hasura.user', 't');
	IF session_variables IS NOT NULL then
		account := session_variables ->> 'x-hasura-user-id';
		IF account IS NOT NULL then
			SELECT focus_id into focus FROM public.notebook_target where id = NEW.target_id;
			SELECT notebook_id into notebook FROM public.notebook_focus where id = focus;
			UPDATE notebook_member SET last_modified_at=now() WHERE notebook_id = notebook AND account_id = account;
			INSERT INTO notebook_updates_track (notebook_id, account_id, updated_at, type)
			VALUES (notebook, account, now(), 'action');
		END IF;
	END IF;
	RETURN NEW;
END;
$$;
