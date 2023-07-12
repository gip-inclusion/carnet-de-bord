from fastapi import APIRouter

from cdb.api.v1.routers import (
    admin_structures,
    beneficiaries,
    csv2json,
    deployment,
    managers,
    notebook_focus,
    notebooks_add_members,
    notebooks_create,
    notify_admin_structures,
    nps_rating,
    orientation_requests,
    orientations,
    pe_dossier_individu,
    socio_pro,
    structures,
    uploads,
)
from cdb.api.v1.routers.pe_diagnostic import pe_diagnostic_api

api_router = APIRouter()
api_router.include_router(uploads.router, prefix="/uploads", tags=["Uploads"])
api_router.include_router(managers.router, prefix="/managers", tags=["Managers"])
api_router.include_router(
    admin_structures.router, prefix="/admin_structures", tags=["Admin structures"]
)
api_router.include_router(
    notify_admin_structures.router,
    prefix="/admin_structures",
    tags=["Admin structures"],
)

api_router.include_router(
    csv2json.router, prefix="/convert-file", tags=["Csv to Json parsing"]
)
api_router.include_router(structures.router, prefix="/structures", tags=["Structures"])
api_router.include_router(
    beneficiaries.router,
    prefix="/beneficiaries",
    tags=["Import or reimport beneficiaries"],
)

api_router.include_router(
    orientation_requests.router,
    prefix="/orientation_requests",
    tags=["Orientation request"],
)

api_router.include_router(
    socio_pro.router,
    prefix="/socio_pro",
    tags=["Socio pro information"],
)

api_router.include_router(
    orientations.router, prefix="/orientations", tags=["Orientation"]
)

api_router.include_router(
    notebooks_add_members.router, prefix="/notebooks", tags=["Notebooks"]
)
api_router.include_router(
    notebooks_create.router, prefix="/notebooks", tags=["Notebooks"]
)
api_router.include_router(
    pe_diagnostic_api.router, prefix="/notebooks", tags=["Notebooks"]
)
api_router.include_router(
    pe_dossier_individu.router, prefix="/notebooks", tags=["Notebooks"]
)


api_router.include_router(
    notebook_focus.router, prefix="/notebook_focus", tags=["Notebook focuses"]
)

api_router.include_router(nps_rating.router, prefix="/nps-rating", tags=["NPS ratings"])

api_router.include_router(deployment.router, prefix="/deployment", tags=["deployment"])
