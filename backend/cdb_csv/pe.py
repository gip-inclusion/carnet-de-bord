import logging
import uuid
from uuid import UUID

import dask.dataframe as dd
from asyncpg.connection import Connection
from pandas.core.series import Series
from strenum import StrEnum

from api.core.db import get_connection_pool
from api.core.settings import settings
from api.db.crud.account import (
    get_account_by_professional_email,
    insert_professional_account,
)
from api.db.crud.beneficiary import get_beneficiary_from_personal_information
from api.db.crud.external_data import (
    get_last_external_data_by_beneficiary_id_and_source,
    insert_external_data_for_beneficiary_and_professional,
)
from api.db.crud.notebook import (
    get_notebook_member_by_notebook_id_and_account_id,
    insert_notebook_member,
)
from api.db.crud.professional import get_professional_by_email, insert_professional
from api.db.crud.structure import (
    create_structure_from_agences_list,
    get_structure_by_name,
)
from api.db.crud.wanted_job import (
    find_wanted_job_for_notebook,
    insert_wanted_job_for_notebook,
)
from api.db.models.account import AccountDB
from api.db.models.beneficiary import Beneficiary
from api.db.models.external_data import (
    ExternalData,
    ExternalSource,
    format_external_data,
)
from api.db.models.notebook import (
    Notebook,
    NotebookMember,
    NotebookMemberInsert,
    NotebookMemberTypeEnum,
)
from api.db.models.professional import Professional, ProfessionalInsert
from api.db.models.structure import Structure
from api.db.models.wanted_job import WantedJob
from cdb_csv.models.csv_row import PrincipalCsvRow, get_sha256
from pe.models.agence import Agence
from pe.pole_emploi_client import PoleEmploiApiClient

logging.basicConfig(level=logging.INFO, format=settings.LOG_FORMAT)


class ParseActionEnum(StrEnum):
    IMPORT_BENEFICIARIES = "import_beneficiaries"
    MATCH_BENEFICIARIES_AND_PROS = "match_beneficiaries_and_pros"


async def map_principal_row(row: Series) -> PrincipalCsvRow:
    return PrincipalCsvRow.parse_obj(row)


async def match_beneficiaries_and_pros(connection: Connection, principal_csv: str):
    df = dd.read_csv(
        principal_csv, sep=";", dtype=str, keep_default_na=False, na_values=["_"]
    )

    row: Series
    for _, row in df.iterrows():
        pe_unique_id: str = row["identifiant_unique_de"]

        logging.info(
            f"{pe_unique_id} => Trying to match beneficiary and pro of main row {pe_unique_id}"
        )

        csv_row: PrincipalCsvRow = await map_principal_row(row)

        if csv_row.brsa:
            beneficiary: Beneficiary | None = (
                await get_beneficiary_from_personal_information(
                    connection,
                    firstname=csv_row.prenom,
                    lastname=csv_row.nom,
                    birth_date=csv_row.date_naissance,
                )
            )

            if beneficiary and beneficiary.notebook is not None:

                logging.info(
                    f"{pe_unique_id} - Found matching beneficiary {beneficiary.id}"
                )

                account: AccountDB | None = await get_account_by_professional_email(
                    connection, csv_row.referent_mail
                )

                if account:
                    logging.info(
                        f"{pe_unique_id} - Found professional account for {csv_row.referent_mail}"
                    )

                    notebook_member: NotebookMember | None = (
                        await get_notebook_member_by_notebook_id_and_account_id(
                            connection, beneficiary.notebook.id, account.id
                        )
                    )
                    if notebook_member:
                        logging.info(
                            f"{pe_unique_id} - Pro is already a member of the notebook. Skipping."
                        )
                    else:
                        logging.info(
                            f"{pe_unique_id} - Pro is not a member of the notebook. Adding it."
                        )

                        await add_account_to_notebook(
                            connection,
                            beneficiary.notebook.id,
                            account.id,
                            pe_unique_id,
                        )
                else:
                    logging.info(
                        f"{pe_unique_id} - No professional account found for {csv_row.referent_mail}"
                    )


async def import_beneficiaries(connection: Connection, principal_csv: str):

    df = dd.read_csv(
        principal_csv, sep=";", dtype=str, keep_default_na=False, na_values=["_"]
    )

    row: Series
    for _, row in df.iterrows():

        logging.info(
            "{id} => Trying to import main row {id}".format(
                id=row["identifiant_unique_de"]
            )
        )

        csv_row: PrincipalCsvRow = await map_principal_row(row)

        if csv_row.brsa:
            beneficiary: Beneficiary | None = await import_beneficiary(
                connection, csv_row, row["identifiant_unique_de"]
            )

            # Keep track of the data we want to insert
            if beneficiary:
                await save_external_data(connection, beneficiary, csv_row)

                if beneficiary.notebook:
                    professional = await import_pe_referent(
                        connection,
                        csv_row,
                        row["identifiant_unique_de"],
                        beneficiary.deployment_id,
                        beneficiary.notebook.id,
                    )

                    if professional:
                        await save_external_data(
                            connection,
                            beneficiary,
                            csv_row,
                            professional=professional,
                        )
                else:
                    logging.error(
                        "{} - No notebook for beneficiary. Skipping pe_referent import.".format(
                            row["identifiant_unique_de"]
                        )
                    )
            else:
                logging.error(
                    "{} - Error while importing beneficiary.".format(
                        row["identifiant_unique_de"]
                    )
                )

        else:
            logging.info(
                "{} - Skipping, BRSA field value is No".format(
                    row["identifiant_unique_de"]
                )
            )


async def import_pe_referent(
    connection: Connection,
    csv_row: PrincipalCsvRow,
    pe_unique_id: str,
    deployment_id: UUID,
    notebook_id: UUID,
) -> Professional | None:

    structure: Structure | None = await get_structure_by_name(
        connection, csv_row.struct_principale
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
            csv_row.departement, horaire=False, zonecompetence=False
        )

        structure: Structure | None = await create_structure_from_agences_list(
            connection, agences, csv_row.struct_principale, deployment_id
        )

    if not structure:
        logging.info(
            "{} - Structure '{}' not found/created. Import of professional impossible.".format(
                pe_unique_id, csv_row.struct_principale
            )
        )
        return
    else:
        logging.info(
            "{} - Structure '{}' found".format(pe_unique_id, csv_row.struct_principale)
        )

    professional: Professional | None = await get_professional_by_email(
        connection, csv_row.referent_mail
    )

    if not professional:
        professional_insert = ProfessionalInsert(
            structure_id=structure.id,
            email=csv_row.referent_mail,
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
                    pe_unique_id, csv_row.referent_mail, structure.name
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
                        pe_unique_id, csv_row.referent_mail
                    )
                )
            else:
                await add_account_to_notebook(
                    connection, notebook_id, account.id, pe_unique_id
                )
        return professional
    else:
        logging.info("{} - Professional already exists".format(pe_unique_id))

        account: AccountDB | None = await get_account_by_professional_email(
            connection, csv_row.referent_mail
        )

        if account:
            await add_account_to_notebook(
                connection, notebook_id, account.id, pe_unique_id
            )
        else:
            logging.error("{} - No account found for Professional".format(pe_unique_id))


async def add_account_to_notebook(
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
            "{} - Professional added to notebook_member {} as {}. Notebook id: {}".format(
                pe_unique_id,
                notebook_member.id,
                notebook_member.member_type,
                notebook_id,
            )
        )
    else:
        logging.error(
            "{} - Impossible to add professional as notebook_member".format(
                pe_unique_id
            )
        )


async def import_beneficiary(
    connection: Connection, csv_row: PrincipalCsvRow, pe_unique_id: str
) -> Beneficiary | None:

    beneficiary: Beneficiary | None = await get_beneficiary_from_personal_information(
        connection,
        firstname=csv_row.prenom,
        lastname=csv_row.nom,
        birth_date=csv_row.date_naissance,
    )

    if beneficiary and beneficiary.notebook is not None:

        logging.info(
            "{} - Found matching beneficiary {}".format(pe_unique_id, beneficiary.id)
        )

        # Insert the missing wanted jobs into the DB
        beneficiary.notebook = await insert_wanted_jobs_for_csv_row_and_notebook(
            connection,
            csv_row,
            beneficiary.notebook,
            pe_unique_id,
        )

        return beneficiary
    else:
        logging.info(
            "{} - No matching beneficiary with notebook found".format(pe_unique_id)
        )


async def save_external_data(
    connection: Connection,
    beneficiary: Beneficiary,
    csv_row: PrincipalCsvRow,
    professional: Professional | None = None,
) -> ExternalData | None:

    # Do we already have some external data for this beneficiary?
    external_data: ExternalData | None = (
        await get_last_external_data_by_beneficiary_id_and_source(
            connection, beneficiary.id, ExternalSource.PE
        )
    )

    hash_result: str = await get_sha256(csv_row)

    external_data_dict = {"beneficiary": beneficiary.dict()}
    if professional:
        external_data_dict["professional"] = professional.dict()

    # If we have no external_data or we already have some,
    # but the hash is not the same
    if external_data is None or hash_result != external_data.hash:

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


async def parse_principal_csv(
    principal_csv: str, action: ParseActionEnum = ParseActionEnum.IMPORT_BENEFICIARIES
):
    pool = await get_connection_pool(settings.database_url)

    # Take a connection from the pool.
    if pool:
        async with pool.acquire() as connection:
            # Open a transaction.

            match action:
                case ParseActionEnum.IMPORT_BENEFICIARIES:
                    await import_beneficiaries(connection, principal_csv)
                case ParseActionEnum.MATCH_BENEFICIARIES_AND_PROS:
                    await match_beneficiaries_and_pros(connection, principal_csv)
                case _:
                    logging.error(f"Action '{action}' not found")
        await pool.close()
    else:
        logging.error("Unable to acquire connection from DB pool")


async def insert_wanted_jobs_for_csv_row_and_notebook(
    connection: Connection,
    csv_row: PrincipalCsvRow,
    notebook: Notebook,
    unique_identifier: str,
) -> Notebook:

    for (rome_code, rome_label) in [
        (csv_row.rome_1, csv_row.appelation_rome_1),
        (csv_row.rome_2, csv_row.appelation_rome_2),
    ]:
        wanted_job: WantedJob | None = await check_and_insert_wanted_job(
            connection,
            notebook,
            rome_code,
            rome_label,
        )
        if wanted_job:
            logging.info(
                "{} - Wanted job {} inserted".format(unique_identifier, wanted_job)
            )
            notebook.wanted_jobs.append(wanted_job)
        else:
            logging.info("{} - NO Wanted job inserted".format(unique_identifier))

    return notebook


async def check_and_insert_wanted_job(
    connection: Connection, notebook: Notebook, rome_code: str, rome_label: str
) -> WantedJob | None:
    """
    Returns the inserted WantedJob or None if the job was not inserted
    """

    wanted_job: WantedJob | None = await find_wanted_job_for_notebook(
        notebook, rome_code, rome_label
    )

    if not wanted_job:
        logging.info(
            "Wanted job {} - {} not found for notebook {}".format(
                rome_code, rome_label, notebook.id
            )
        )
        return await insert_wanted_job_for_notebook(
            connection, notebook, rome_code, rome_label
        )
    else:
        logging.info("Wanted job {} found for notebook".format(wanted_job))
