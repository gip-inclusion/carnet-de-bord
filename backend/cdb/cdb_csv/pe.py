import logging
import os
import re
import traceback
import uuid
from datetime import datetime
from uuid import UUID

import dask.dataframe as dd
from asyncpg.connection import Connection
from pandas.core.series import Series
from strenum import StrEnum

from cdb.api.core.db import get_connection_pool
from cdb.api.core.settings import settings
from cdb.api.db.crud.account import (
    get_account_by_professional_email,
    insert_professional_account,
)
from cdb.api.db.crud.beneficiary import (
    get_beneficiary_from_personal_information,
    update_beneficiary_field,
)
from cdb.api.db.crud.external_data import (
    get_last_external_data_by_beneficiary_id_and_source,
    insert_external_data_for_beneficiary_and_professional,
)
from cdb.api.db.crud.notebook import (
    get_notebook_by_pe_unique_import_id,
    get_notebook_member_by_notebook_id_and_account_id,
    insert_notebook_member,
)
from cdb.api.db.crud.notebook_event import (
    create_notebook_event_payload,
    get_notebook_event_pe,
    insert_notebook_event,
)
from cdb.api.db.crud.professional import get_professional_by_email, insert_professional
from cdb.api.db.crud.professional_project import (
    find_professional_project_for_notebook,
    insert_professional_project_for_notebook,
)
from cdb.api.db.crud.structure import (
    create_structure_from_agences_list,
    get_structure_with_query,
)
from cdb.api.db.models.account import AccountDB
from cdb.api.db.models.beneficiary import Beneficiary
from cdb.api.db.models.deployment import Deployment
from cdb.api.db.models.external_data import (
    ExternalData,
    ExternalSource,
    format_external_data,
)
from cdb.api.db.models.notebook import Notebook
from cdb.api.db.models.notebook_event import (
    EventFrom,
    EventStatus,
    EventType,
    NotebookEvent,
    NotebookEventInsert,
)
from cdb.api.db.models.notebook_member import (
    NotebookMember,
    NotebookMemberInsert,
    NotebookMemberTypeEnum,
)
from cdb.api.db.models.professional import Professional, ProfessionalInsert
from cdb.api.db.models.professional_project import ProfessionalProject
from cdb.api.db.models.structure import Structure
from cdb.cdb_csv.crud.actions import load_action_mapping_file
from cdb.cdb_csv.models.csv_row import ActionCsvRow, PrincipalCsvRow, get_sha256
from cdb.pe.models.agence import Agence
from cdb.pe.pole_emploi_client import PoleEmploiApiClient

logging.basicConfig(level=logging.INFO, format=settings.LOG_FORMAT)

FORMATION_DOMAINE_SUIVANT_LABEL = "UNE FORMATION DANS LE DOMAINE SUIVANT"


class ParseActionEnum(StrEnum):
    IMPORT_BENEFICIARIES = "import_beneficiaries"
    IMPORT_ACTIONS = "import_actions"


async def map_principal_row(row: Series) -> PrincipalCsvRow:
    return PrincipalCsvRow.parse_obj(row)


async def map_action_row(row: Series) -> ActionCsvRow:
    return ActionCsvRow.parse_obj(row)


async def import_beneficiaries(connection: Connection, principal_csv: str):
    # TODO consider NULL string comme NA_VALUES
    # and use df = df.replace({np.nan:None})
    df = dd.read_csv(  # type: ignore
        principal_csv, sep=";", dtype=str, keep_default_na=False, na_values=["_"]
    )

    row: Series
    for _, row in df.iterrows():
        try:
            logging.info(
                "%s => Trying to import main row", row["identifiant_unique_de"]
            )
            logging.warning("+++++ %s", row)
            csv_row: PrincipalCsvRow = await map_principal_row(row)
            logging.warning("-----%s", csv_row)
            hash_result: str = await get_sha256(csv_row)

            # TODO: utiliser une transaction
            # TODO: Que faire en cas d'erreur : Qu'est ce qu'on enregistre

            if csv_row.brsa:
                beneficiary: Beneficiary | None = await import_beneficiary(
                    connection, csv_row, hash_result
                )

                # Keep track of the data we want to insert
                if beneficiary and beneficiary.deployment:
                    professional = None

                    if beneficiary.notebook:
                        professional = await import_pe_referent(
                            connection,
                            csv_row,
                            beneficiary.deployment,
                            beneficiary.notebook.id,
                        )
                    else:
                        logging.error(
                            "%s - No notebook for beneficiary. "
                            "Skipping pe_referent import.",
                            csv_row.identifiant_unique_de,
                        )

                    await save_external_data(
                        connection,
                        beneficiary,
                        csv_row,
                        hash_result,
                        professional,
                    )
                else:
                    logging.info(
                        "{} - No new beneficiary to import. Skipping.".format(
                            row["identifiant_unique_de"]
                        )
                    )

            else:
                logging.info(
                    "{} - Skipping, BRSA field value is No".format(
                        row["identifiant_unique_de"]
                    )
                )

        except Exception as e:
            logging.error(
                "Exception while processing main CSV line: %s on line %s",
                e,
                row.to_dict(),
            )
            traceback.print_exc()


async def import_actions(connection: Connection, action_csv_path: str):
    logging.info("Running 'import_actions' on pe actions file")

    df = dd.read_csv(  # type: ignore
        action_csv_path, sep=";", dtype=str, keep_default_na=False, na_values=["_"]
    )

    current_dir = os.path.dirname(os.path.realpath(__file__))

    mapping: dict[str, str] = await load_action_mapping_file(
        os.path.join(current_dir, "categorisation_des_actions_du_fichier_PE.csv")
    )

    row: Series
    for _, row in df.iterrows():
        try:
            pe_unique_import_id: str = row["identifiant_unique_de"]
            logging.debug(
                "%(import_id)s => Trying to import action row %(import_id)",
                {"import_id": pe_unique_import_id},
            )

            csv_row: ActionCsvRow = await map_action_row(row)

            if (
                csv_row.lblaction == FORMATION_DOMAINE_SUIVANT_LABEL
                and csv_row.formation is None
            ):
                logging.error(
                    "%s => Line '{FORMATION_DOMAINE_SUIVANT_LABEL}' "
                    "with empty 'formation' column. Skipping row.",
                    pe_unique_import_id,
                )
                continue

            focus: str | None = mapping.get(csv_row.lblaction, None)

            if focus:
                logging.debug(f"{pe_unique_import_id} => Mapped focus: {focus}")
            else:
                logging.error(
                    "%s => Mapped focus not found for action '%s': %s. Skipping row.",
                    pe_unique_import_id,
                    csv_row.lblaction,
                    focus,
                )
                continue

            notebook: Notebook | None = await get_notebook_by_pe_unique_import_id(
                connection, csv_row.identifiant_unique_de
            )

            if not notebook:
                logging.error(
                    "%s => Corresponding notebook NOT FOUND for this action. "
                    "Skipping row.",
                    pe_unique_import_id,
                )
                continue
            else:
                logging.debug(
                    "%s => Notebook FOUND for action import", pe_unique_import_id
                )

            event_date = compute_action_date(
                csv_row.date_prescription,
                csv_row.date_realisation_action,
                csv_row.date_fin,
                csv_row.lblaction,
            )

            updated_label = csv_row.lblaction
            if (
                csv_row.formation is not None
                and csv_row.lblaction == FORMATION_DOMAINE_SUIVANT_LABEL
            ):
                updated_label = "UNE FORMATION DANS LE DOMAINE " + csv_row.formation

            notebook_event: NotebookEvent | None = await get_notebook_event_pe(
                connection,
                notebook_id=notebook.id,
                label=updated_label,
                date=event_date,
            )

            # Don't import event/actions twice
            if notebook_event:
                logging.debug(
                    "%s => Event already imported. Database id: %s, skipping.",
                    pe_unique_import_id,
                    notebook_event.id,
                )
                continue

            notebook_event_insert: NotebookEventInsert = NotebookEventInsert(
                notebook_id=notebook.id,
                event_date=event_date,
                creator_id=None,
                event=create_notebook_event_payload(
                    status=EventStatus.done,
                    category=focus,
                    label=updated_label,
                    event_from=EventFrom.pe,
                ),
                event_type=EventType.action,
            )

            logging.debug(
                f"{pe_unique_import_id} => Importing event {notebook_event_insert}"
            )

            notebook_event: NotebookEvent | None = await insert_notebook_event(
                connection, notebook_event_insert
            )

            if notebook_event:
                logging.debug(
                    f"{pe_unique_import_id} => Imported event {notebook_event}"
                )
            else:
                logging.error(f"{pe_unique_import_id} => Failed to import event")

        except Exception as e:
            logging.error("Exception while processing action CSV line: {}".format(e))
            traceback.print_exc()


def compute_action_date(
    date_prescription: datetime,
    date_realisation_action: datetime | None,
    date_fin: datetime | None,
    label: str,
) -> datetime:

    if (
        label != FORMATION_DOMAINE_SUIVANT_LABEL
        and date_fin is not None
        and date_realisation_action is not None
    ):
        return date_realisation_action
    elif date_fin:

        return date_fin

    return date_prescription


async def import_pe_referent(
    connection: Connection,
    csv_row: PrincipalCsvRow,
    deployment: Deployment,
    notebook_id: UUID,
) -> Professional | None:
    # HACK: @lionelb
    # on utilise cette requete pour trouver les structure PE déjà créer
    # depuis les données de l'api POLE EMPLOI n'ayant pas de données
    # dans le fichier qui permettent une identification de la structure
    # dans notre base. Le champ code_safir pourrait permettre cela
    # malheureusement pour l'instant, l'analyse des données dans le fichier
    # montre que celui ci n'est pas suffisament fiable.
    # - Plusieurs structure_principale ont le meme code structure et inversement
    # - Plusieurs code pour la meme structure
    structure: Structure | None = await get_structure_with_query(
        connection,
        "WHERE short_desc = $1 and name like '%' || $1",
        csv_row.struct_principale,
    )
    if not structure:
        client = PoleEmploiApiClient(
            auth_base_url=settings.PE_AUTH_BASE_URL,
            base_url=settings.PE_BASE_URL,
            client_id=settings.PE_CLIENT_ID,
            client_secret=settings.PE_CLIENT_SECRET,
            scope=settings.PE_SCOPE,
        )

        agences: list[Agence] = client.recherche_agences_pydantic(
            deployment.department_code or "", horaire=False, zonecompetence=False
        )
        structure: Structure | None = await create_structure_from_agences_list(
            connection, agences, csv_row.struct_principale, deployment.id
        )

    if not structure:
        logging.info(
            "%s - Structure '%s' not found/created. "
            "Import of professional impossible.",
            csv_row.identifiant_unique_de,
            csv_row.struct_principale,
        )
        return
    else:
        logging.info(
            "{} - Structure '{}' found".format(
                csv_row.identifiant_unique_de, csv_row.struct_principale
            )
        )
    pro_email: str | None = net_email_to_fr_email(csv_row.referent_mail)

    if pro_email is None:
        logging.error(
            "%s - Unable to convert email %s to .fr. Using original '%s' instead.",
            csv_row.identifiant_unique_de,
            csv_row.referent_mail,
            csv_row.referent_mail,
        )
        pro_email = csv_row.referent_mail

    professional: Professional | None = await get_professional_by_email(
        connection, pro_email
    )

    if not professional:
        professional_insert = ProfessionalInsert(
            structure_id=structure.id,
            email=pro_email,
            lastname=csv_row.referent_nom,
            firstname=csv_row.referent_prenom,
            mobile_number=None,
            position=None,
        )

        professional: Professional | None = await insert_professional(
            connection, professional_insert
        )

        if professional:
            logging.info(
                "{} - Professional {} inserted and attached to structure {}".format(
                    csv_row.identifiant_unique_de, csv_row.referent_mail, structure.name
                )
            )
            account: AccountDB | None = await insert_professional_account(
                connection,
                username=str(uuid.uuid4()),
                confirmed=True,
                professional_id=professional.id,
            )

            if not account:
                logging.error(
                    "{} - Impossible to create account for {}".format(
                        csv_row.identifiant_unique_de, csv_row.referent_mail
                    )
                )
            else:
                await add_account_to_notebook_members(
                    connection, notebook_id, account.id, csv_row.identifiant_unique_de
                )
        return professional
    else:
        logging.info(
            "{} - Professional already exists".format(csv_row.identifiant_unique_de)
        )

        account: AccountDB | None = await get_account_by_professional_email(
            connection, pro_email
        )

        if account:
            notebook_member: NotebookMember | None = (
                await get_notebook_member_by_notebook_id_and_account_id(
                    connection, notebook_id, account.id
                )
            )

            if not notebook_member:
                await add_account_to_notebook_members(
                    connection, notebook_id, account.id, csv_row.identifiant_unique_de
                )
            else:
                logging.info(
                    "{} - Professional is already a member of the notebook".format(
                        csv_row.identifiant_unique_de
                    )
                )
        else:
            logging.error(
                "{} - No account found for Professional".format(
                    csv_row.identifiant_unique_de
                )
            )


def net_email_to_fr_email(net_email: str) -> str | None:
    match: None | re.Match = re.search(r"^[0-9]*(.*)\.net$", net_email)

    if match:
        return match.group(1) + ".fr"


async def add_account_to_notebook_members(
    connection: Connection, notebook_id: UUID, account_id: UUID, pe_unique_id: str
) -> NotebookMember | None:
    notebook_member_insert = NotebookMemberInsert(
        notebook_id=notebook_id,
        account_id=account_id,
        member_type=NotebookMemberTypeEnum.NO_REFERENT,
        active=True,
    )
    notebook_member: NotebookMember | None = await insert_notebook_member(
        connection, notebook_member_insert
    )
    if notebook_member:
        logging.info(
            "%s - Professional added to notebook_member %s as %s. Notebook id: %s",
            pe_unique_id,
            notebook_member.id,
            notebook_member.member_type,
            notebook_id,
        )
    else:
        logging.error(
            "{} - Impossible to add professional as notebook_member".format(
                pe_unique_id
            )
        )


async def import_beneficiary(
    connection: Connection,
    csv_row: PrincipalCsvRow,
    hash_result: str,
) -> Beneficiary | None:
    beneficiary: Beneficiary | None = await get_beneficiary_from_personal_information(
        connection,
        firstname=csv_row.prenom,
        lastname=csv_row.nom,
        birth_date=csv_row.date_naissance,
    )

    if beneficiary and beneficiary.notebook is not None:
        if beneficiary.pe_unique_import_id != csv_row.identifiant_unique_de:
            beneficiary_uuid: UUID | None = await update_beneficiary_field(
                connection,
                "pe_unique_import_id",
                csv_row.identifiant_unique_de,
                beneficiary.id,
            )

            if beneficiary_uuid:
                logging.info(
                    "%(id)s - Updated beneficiary pe_unique_import_id to value %(id)s",
                    {"id": csv_row.identifiant_unique_de},
                )

        # Do we already have some external data for this beneficiary?
        external_data: ExternalData | None = (
            await get_last_external_data_by_beneficiary_id_and_source(
                connection, beneficiary.id, ExternalSource.PE
            )
        )
        if external_data is not None and hash_result == external_data.hash:
            logging.info(
                "{} - SHA value is the same. Skipping import for beneficiary {}".format(
                    csv_row.identifiant_unique_de, beneficiary.id
                )
            )
            return

        logging.info(
            "{} - Found matching beneficiary {}".format(
                csv_row.identifiant_unique_de, beneficiary.id
            )
        )

        # Insert the missing wanted jobs into the DB
        beneficiary.notebook = (
            await insert_professional_projects_for_csv_row_and_notebook(
                connection,
                csv_row,
                beneficiary.notebook,
            )
        )

        return beneficiary
    else:
        logging.info(
            "{} - No matching beneficiary with notebook found".format(
                csv_row.identifiant_unique_de
            )
        )


async def save_external_data(
    connection: Connection,
    beneficiary: Beneficiary,
    csv_row: PrincipalCsvRow,
    hash_result: str,
    professional: Professional | None = None,
) -> ExternalData | None:
    # Do we already have some external data for this beneficiary?
    external_data: ExternalData | None = (
        await get_last_external_data_by_beneficiary_id_and_source(
            connection, beneficiary.id, ExternalSource.PE
        )
    )

    external_data_dict = {"beneficiary": beneficiary.dict()}
    if professional:
        external_data_dict["professional"] = professional.dict()

    # If we have some external_data and the hash is the same
    # return
    if external_data and hash_result == external_data.hash:
        return external_data

    if external_data is None:
        logging.info("No external_data for {}".format(beneficiary.id))
    else:
        logging.info(
            "Data has changed, setting up new version of external data for {}".format(
                beneficiary.id
            )
        )
    external_data: ExternalData | None = (
        await insert_external_data_for_beneficiary_and_professional(
            connection,
            beneficiary,
            ExternalSource.PE,
            format_external_data(csv_row.dict(), external_data_dict),
            hash_result,
            professional=professional,
        )
    )

    return external_data


async def parse_pe_csv(
    principal_csv: str, action: ParseActionEnum = ParseActionEnum.IMPORT_BENEFICIARIES
):
    pool = await get_connection_pool(settings.database_url)

    # Take a connection from the pool.
    if pool:
        async with pool.acquire() as connection:
            # Open a transaction.

            match action:
                case ParseActionEnum.IMPORT_ACTIONS:
                    await import_actions(connection, principal_csv)
                case ParseActionEnum.IMPORT_BENEFICIARIES:
                    await import_beneficiaries(connection, principal_csv)

                case _:
                    logging.error(f"Action '{action}' not found")
        await pool.close()
    else:
        logging.error("Unable to acquire connection from DB pool")


async def insert_professional_projects_for_csv_row_and_notebook(
    connection: Connection,
    csv_row: PrincipalCsvRow,
    notebook: Notebook,
) -> Notebook:
    for rome_code, rome_label in [
        (csv_row.rome_1, csv_row.appelation_rome_1),
        (csv_row.rome_2, csv_row.appelation_rome_2),
    ]:
        professional_project: ProfessionalProject | None = (
            await check_and_insert_professional_project(
                connection,
                notebook,
                rome_code,
                rome_label,
            )
        )
        if professional_project:
            logging.info(
                "{} - Wanted job {} inserted".format(
                    csv_row.identifiant_unique_de, professional_project
                )
            )
            notebook.professional_projects.append(professional_project)
        else:
            logging.info(
                "{} - NO Wanted job inserted".format(csv_row.identifiant_unique_de)
            )

    return notebook


async def check_and_insert_professional_project(
    connection: Connection, notebook: Notebook, rome_code: str, rome_label: str
) -> ProfessionalProject | None:
    """
    Returns the inserted ProfessionalProject or None if the project was not inserted
    """

    professional_project: ProfessionalProject | None = (
        await find_professional_project_for_notebook(notebook, rome_code, rome_label)
    )

    if not professional_project:
        logging.info(
            "Wanted job {} - {} not found for notebook {}".format(
                rome_code, rome_label, notebook.id
            )
        )
        return await insert_professional_project_for_notebook(
            connection, notebook, rome_code, rome_label
        )
    else:
        logging.info("Wanted job {} found for notebook".format(professional_project))
