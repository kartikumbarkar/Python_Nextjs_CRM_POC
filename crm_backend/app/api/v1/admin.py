from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.db.session import get_db
from app.schemas.tenant import Tenant
from app.services.tenant import tenant_service
from app.core.auth import get_current_admin_user  # We'll define this dependency below if not present

router = APIRouter()

@router.get("/tenants/", response_model=List[Tenant])
def list_tenants(db: Session = Depends(get_db), current_user=Depends(get_current_admin_user)):
    tenants = tenant_service.get_all_tenants(db)
    return tenants

@router.delete("/tenants/{tenant_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_tenant(tenant_id: int, db: Session = Depends(get_db), current_user=Depends(get_current_admin_user)):
    deleted = tenant_service.delete_tenant(db, tenant_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Tenant not found")
    return None
