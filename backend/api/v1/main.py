from fastapi import APIRouter

from api.v1.routers import admin_structures, managers, uploads

api_router = APIRouter()
api_router.include_router(uploads.router, prefix="/uploads", tags=["uploads"])
api_router.include_router(managers.router, prefix="/managers", tags=["managers"])
api_router.include_router(
    admin_structures.router, prefix="/admin_structures", tags=["admin_structures"]
)
