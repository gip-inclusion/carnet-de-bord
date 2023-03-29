import json
import os
from uuid import UUID

from cdb.scripts.export_notebook import export_notebooks_from_structure


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

        assert len(focus["targets"]) == 3
        target = next(
            (
                t
                for t in focus["targets"]
                if t["target"] == "Répondre à des offres d'emploi"
            ),
            None,
        )

        assert target is not None
        assert len(target["actions"]) == 3

        action = next(
            (
                a
                for a in target["actions"]
                if a["action"] == "Orientation vers une SIAE"
            ),
            None,
        )

        assert action is not None

        assert action["creator_account_info"]["email"] == "giulia.diaby@cd93.fr"
        assert action["creator_account_info"]["firstname"] == "Giulia"
        assert action["creator_account_info"]["lastname"] == "Diaby"

        assert len(notebooks_json[0]["appointments"]) == 3
