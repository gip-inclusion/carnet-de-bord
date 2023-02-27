from asyncpg.connection import Connection

from cdb.api.db.crud.beneficiary import get_beneficiary_by_id
from cdb.api.db.models.notebook import Notebook
from cdb.api.db.models.out import (
    AccountInfoOut,
    ActionOut,
    AppointmentOut,
    BeneficiaryOut,
    FocusOut,
    NotebookMemberOut,
    NotebookOut,
    ProfessionalProjectOut,
    RomeCodeOut,
    TargetOut,
)


async def notebook_to_out(
    connection: Connection, notebook: Notebook
) -> NotebookOut | None:
    # @TODO: Make the join before and populate it to the Notebook instance
    # @TODO: start with the Notebook
    beneficiary = await get_beneficiary_by_id(connection, notebook.beneficiary_id)
    if beneficiary:
        beneficiary_out = BeneficiaryOut(
            email=beneficiary.email,
            lastname=beneficiary.lastname,
            firstname=beneficiary.firstname,
            caf_number=beneficiary.caf_number,
            pe_number=beneficiary.pe_number,
            postal_code=beneficiary.postal_code,
            city=beneficiary.city,
            address1=beneficiary.address1,
            address2=beneficiary.address2,
            mobile_number=beneficiary.mobile_number,
            date_of_birth=beneficiary.date_of_birth,
            place_of_birth=beneficiary.place_of_birth,
            created_at=beneficiary.created_at,
            updated_at=beneficiary.updated_at,
            right_rsa=beneficiary.right_rsa,
            right_are=beneficiary.right_are,
            right_ass=beneficiary.right_ass,
            right_bonus=beneficiary.right_bonus,
        )

        if notebook.focuses:
            focuses_out = [
                FocusOut(
                    theme=f.theme,
                    created_at=f.created_at,
                    updated_at=f.updated_at,
                    linked_to=f.linked_to,
                    targets=[
                        TargetOut(
                            target=t.target,
                            created_at=t.created_at,
                            updated_at=t.updated_at,
                            status=t.status,
                            actions=[
                                ActionOut(
                                    action=a.action,
                                    status=a.status,
                                    created_at=a.created_at,
                                    updated_at=a.updated_at,
                                    creator_account_info=AccountInfoOut(
                                        firstname=a.account_info.firstname,
                                        lastname=a.account_info.lastname,
                                        email=a.account_info.email,
                                    ),
                                )
                                for a in t.actions
                            ]
                            if t.actions is not None
                            else [],
                        )
                        for t in f.targets
                    ]
                    if f.targets is not None
                    else [],
                )
                for f in notebook.focuses
            ]
        else:
            focuses_out = []

        if notebook.members:
            members_out = [
                NotebookMemberOut(
                    last_visited_at=nb.last_visited_at,
                    member_type=nb.member_type,
                    last_modified_at=nb.last_modified_at,
                    created_at=nb.created_at,
                    invitation_sent_at=nb.invitation_sent_at,
                    active=nb.active,
                )
                for nb in notebook.members
            ]
        else:
            members_out = []

        if notebook.appointments:
            appointments_out = [
                AppointmentOut(
                    account_info=AccountInfoOut(
                        firstname=na.account_info.firstname,
                        lastname=na.account_info.lastname,
                        email=na.account_info.email,
                    ),
                    date=na.date,
                    status=na.status,
                    created_at=na.created_at,
                    updated_at=na.updated_at,
                )
                for na in notebook.appointments
            ]
        else:
            appointments_out = []

        notebook_out = NotebookOut(
            beneficiary=beneficiary_out,
            created_at=notebook.created_at,
            updated_at=notebook.updated_at,
            right_rqth=notebook.right_rqth,
            geographical_area=notebook.geographical_area,
            education_level=notebook.education_level,
            work_situation_date=notebook.work_situation_date,
            contract_type=notebook.contract_type,
            contract_sign_date=notebook.contract_sign_date,
            work_situation=notebook.work_situation,
            work_situation_end_date=notebook.work_situation_end_date,
            contract_start_date=notebook.contract_start_date,
            contract_end_date=notebook.contract_end_date,
            professional_projects=[
                ProfessionalProjectOut(
                    rome_code=RomeCodeOut(
                        code=j.rome_code.code,
                        description=j.rome_code.description,
                        label=j.rome_code.label,
                    )
                )
                for j in notebook.professional_projects
            ],
            focuses=focuses_out,
            members=members_out,
            appointments=appointments_out,
        )

        return notebook_out
