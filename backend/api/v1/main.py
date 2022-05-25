from fastapi import APIRouter

from api.v1.routers import uploads

api_router = APIRouter()
api_router.include_router(uploads.router, prefix="/uploads", tags=["uploads"])
