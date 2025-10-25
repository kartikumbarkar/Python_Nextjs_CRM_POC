from fastapi import APIRouter
from app.api.v1.endpoints import tenants, crm

api_router = APIRouter()
api_router.include_router(tenants.router, prefix="/auth", tags=["authentication"])
api_router.include_router(crm.router, prefix="/crm", tags=["crm"])