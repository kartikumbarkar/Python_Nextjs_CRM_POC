from fastapi import APIRouter
from app.api.v1.endpoints import tenants, crm,admin_tenant,admin_user

api_router = APIRouter()
api_router.include_router(tenants.router, prefix="/auth", tags=["authentication"])
api_router.include_router(crm.router, prefix="/crm", tags=["crm"])
api_router.include_router(admin_tenant.router, prefix="/admin", tags=["AdminTenant"])
api_router.include_router(admin_user.router, prefix="/admin_users", tags=["Admin Users"])
