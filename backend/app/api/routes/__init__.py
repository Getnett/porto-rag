from .upload import router as upload_router
from fastapi import APIRouter

api_router = APIRouter()
api_router.include_router(upload_router, prefix="", tags=["upload"])