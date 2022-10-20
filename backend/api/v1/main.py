from fastapi import APIRouter

from api.v1.routers import (
    admin_structures,
    beneficiaries,
    csv2json,
    managers,
    structures,
    uploads,
)

api_router = APIRouter()
api_router.include_router(uploads.router, prefix="/uploads", tags=["uploads"])
api_router.include_router(managers.router, prefix="/managers", tags=["managers"])
api_router.include_router(
    admin_structures.router, prefix="/admin_structures", tags=["admin_structures"]
)
api_router.include_router(
    csv2json.router, prefix="/convert-file", tags=["Csv to Json parsing"]
)
api_router.include_router(structures.router, prefix="/structures", tags=["structures"])
api_router.include_router(
    beneficiaries.router,
    prefix="/beneficiaries",
    tags=["Import or reimport beneficiaries"],
)
