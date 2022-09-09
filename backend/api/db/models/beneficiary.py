from datetime import date, datetime
from uuid import UUID

from pydantic import BaseModel, Field

from api.db.models.notebook import Notebook


class Beneficiary(BaseModel):
    id: UUID
    email: str | None
    lastname: str
    firstname: str
    caf_number: str | None
    pe_number: str | None
    postal_code: str | None
    city: str | None
    address1: str | None
    address2: str | None
    mobile_number: str | None
    date_of_birth: date
    place_of_birth: str | None
    deployment_id: UUID
    created_at: datetime
    updated_at: datetime
    internal_id: str | None
    notebook: Notebook | None
    # BRSA users may not have an account
    # (account is created on the  first login attempt)
    account_id: UUID | None


class BeneficiaryImport(BaseModel):
    si_id: str = Field(..., title="Identifiant du SI interne")
    firstname: str = Field(..., title="Prénom")
    lastname: str = Field(..., title="Nom")
    date_of_birth: date = Field(..., title="Date de naissance")
    place_of_birth: str | None = Field(None, title="Lieu de naissance")
    phone_number: str | None = Field(None, title="Numéro de téléphone")
    email: str | None = Field(None, title="Email")
    address1: str | None = Field(None, title="Adresse")
    address2: str | None = Field(None, title="Complément d'adresse")
    postal_code: str | None = Field(None, title="Code postal")
    city: str | None = Field(None, title="Ville")
    work_situation: str | None = Field(None, title="Situation professionnelle")
    caf_number: str | None = Field(None, title="Numéro CAF/MSA")
    pe_number: str | None = Field(None, title="Identifiant Pole Emploi")
    right_rsa: str | None = Field(None, title="Droits RSA")
    right_are: bool | None = Field(None, title="Droits ARE")
    right_ass: bool | None = Field(None, title="Droits ASS")
    right_bonus: bool | None = Field(None, title="Droits Bonus")
    right_rqth: bool | None = Field(None, title="Droits RQTH")
    geographical_area: str | None = Field(None, title="Zone de mobilité")
    rome_code_description: str | None = Field(None, title="Emploi recherché")
    education_level: str | None = Field(None, title="Niveau de formation")
    structure_name: str | None = Field(None, title="Structure d'accompagnement")
    advisor_email: str | None = Field(None, title="Accompagnateur référent")
