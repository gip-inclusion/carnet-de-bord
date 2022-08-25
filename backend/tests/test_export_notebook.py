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
        # assert len(notebooks_json[0]["members"]) == len(json_example[0]["members"])

        # print(notebooks_json[0])
        print(notebooks_json[0]["members"])
        assert False

        assert len(notebooks_json[0]["focuses"][0]["targets"]) == len(
            json_example[0]["focuses"][0]["targets"]
        )

        assert len(notebooks_json[0]["focuses"][0]["targets"][1]["actions"]) == len(
            json_example[0]["focuses"][0]["targets"][1]["actions"]
        )

        assert (
            notebooks_json[0]["focuses"][0]["targets"][1]["actions"][1]["action"]
            == json_example[0]["focuses"][0]["targets"][1]["actions"][1]["action"]
        )
