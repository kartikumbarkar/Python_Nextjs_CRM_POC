from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.db.session import get_db
from app.schemas.tenant import Tenant
from app.services.tenant import tenant_service
from app.core.security import get_current_user

router = APIRouter()

def get_current_admin_user(current_user=Depends(get_current_user)):
    if not current_user.is_superuser:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Admin access required")
    return current_user

@router.get("/tenants/", response_model=List[Tenant])
def list_tenants(db: Session = Depends(get_db), current_user=Depends(get_current_admin_user)):
    tenants = tenant_service.get_all_tenants(db)
    return tenants

@router.delete("/tenants/{tenant_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_tenant(tenant_id: int, db: Session = Depends(get_db), current_user=Depends(get_current_admin_user)):
    deleted = tenant_service.delete_tenant(db, tenant_id)
    if not deleted:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Tenant not found")
    return None
