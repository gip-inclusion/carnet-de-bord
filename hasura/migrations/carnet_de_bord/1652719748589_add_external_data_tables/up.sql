--
-- Name: external_source; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.external_source (
    value text NOT NULL,
    comment text NOT NULL,
    PRIMARY KEY (value)
);

INSERT INTO public.external_source("value", "comment") VALUES ('pe', 'Pôle Emploi');

--
-- Create table external_data
--

CREATE TABLE public.external_data (
    "id" uuid NOT NULL DEFAULT gen_random_uuid(),
    source text NOT NULL,
    data jsonb NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    PRIMARY KEY (id),
    FOREIGN KEY (source) REFERENCES public.external_source(value) ON UPDATE cascade ON DELETE cascade
);


-- Name: external_data set_public_external_data_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER set_public_external_data_updated_at BEFORE UPDATE ON public.external_data FOR EACH ROW EXECUTE PROCEDURE public.set_current_timestamp_updated_at();


--
-- Name: TRIGGER set_public_external_data_updated_at ON external_data; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TRIGGER set_public_external_data_updated_at ON public.external_data IS 'trigger to set value of column "updated_at" to current timestamp on row update';


--
-- Create table external_data_info
--

CREATE TABLE public.external_data_info (
  external_data_id uuid NOT NULL,
  beneficiary_id uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  FOREIGN KEY (beneficiary_id) REFERENCES public.beneficiary(id) ON UPDATE cascade ON DELETE cascade,
  FOREIGN KEY (external_data_id) REFERENCES public.external_data(id) ON UPDATE cascade ON DELETE cascade
);

CREATE TRIGGER "set_public_external_data_info_updated_at" BEFORE
UPDATE
  ON public.external_data_info FOR EACH ROW EXECUTE PROCEDURE public.set_current_timestamp_updated_at();
COMMENT ON TRIGGER "set_public_external_data_info_updated_at" ON public.external_data_info IS 'trigger to set value of column "updated_at" to current timestamp on row update';
