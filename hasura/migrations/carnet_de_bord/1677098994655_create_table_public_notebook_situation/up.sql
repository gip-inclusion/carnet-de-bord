CREATE TABLE "public"."notebook_situation" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "notebook_id" uuid NOT NULL,
  "situation_id" uuid NOT NULL,
  "created_at" timestamptz NOT NULL DEFAULT now(),
  "created_by" uuid NOT NULL,
  PRIMARY KEY ("id"),
  FOREIGN KEY ("notebook_id") REFERENCES "public"."notebook"("id") ON UPDATE restrict ON DELETE restrict,
  FOREIGN KEY ("situation_id") REFERENCES "public"."ref_situation"("id") ON UPDATE restrict ON DELETE restrict,
  FOREIGN KEY ("created_by") REFERENCES "public"."account"("id") ON UPDATE restrict ON DELETE restrict,
  UNIQUE ("id")
);

-- TODO: Insérer les situations depuis les notebook_focus
-- TODO: Supprimer les situations dans les notebook_focus (DROP de la colonne)
