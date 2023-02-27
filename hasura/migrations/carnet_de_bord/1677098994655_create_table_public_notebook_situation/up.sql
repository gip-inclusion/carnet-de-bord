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
  UNIQUE ("notebook_id", "situation_id")
);

WITH focus_situation AS (
  SELECT
    jsonb_array_elements_text(situations) as situation_description,
    notebook_id,
    theme,
    creator_id,
    created_at
  FROM notebook_focus
)
INSERT INTO notebook_situation (notebook_id, situation_id, created_at, created_by)
(SELECT focus_situation.notebook_id, ref_situation.id, focus_situation.created_at, focus_situation.creator_id
  FROM focus_situation
  LEFT JOIN ref_situation ON description = focus_situation.situation_description AND focus_situation.theme = ref_situation.theme
  WHERE ref_situation.id IS NOT NULL
)
ON CONFLICT DO NOTHING;

ALTER TABLE notebook_focus DROP COLUMN situations;
