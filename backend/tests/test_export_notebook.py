import json
import os
from uuid import UUID

from scripts.export_notebook import export_notebooks_from_structure


async def test_export_notebook(db_connection, test_directory):

    notebooks_json: dict = json.loads(
        await export_notebooks_from_structure(
            db_connection, UUID("1c52e5ad-e0b9-48b9-a490-105a4effaaea"), print_out=False
        )
    )

    with open(
        os.path.join(test_directory, "export_notebook.json"),
        "r",
    ) as file:
        json_example = json.loads(file.read())
        assert len(notebooks_json) == len(json_example)
        assert notebooks_json[0]["beneficiary"] == json_example[0]["beneficiary"]
        assert len(notebooks_json[0]["focuses"]) == len(json_example[0]["focuses"])
        assert len(notebooks_json[0]["members"]) == len(json_example[0]["members"])

        focus = next(
            (f for f in notebooks_json[0]["focuses"] if f["theme"] == "emploi"),
            None,
        )

        assert focus is not None

        assert len(focus["targets"]) == 2

        target = next(
            (
                t
                for t in focus["targets"]
                if t["target"] == "Acc\u00e9der \u00e0 l\u2019emploi"
            ),
            None,
        )

        assert target is not None

        assert len(notebooks_json[0]["appointments"]) == 3
