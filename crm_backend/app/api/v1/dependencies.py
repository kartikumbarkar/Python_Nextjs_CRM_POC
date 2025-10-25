from fastapi import Header, HTTPException, Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.db.tenant import tenant_manager

def get_tenant_id(x_tenant_id: str = Header(...)):
    if not x_tenant_id:
        raise HTTPException(status_code=400, detail="X-Tenant-ID header required")
    return x_tenant_id

def get_tenant_db(tenant_id: str = Depends(get_tenant_id), db: Session = Depends(get_db)):
    """
    Get database session for tenant-specific CRM data
    Uses public schema session to lookup tenant, then switches to tenant schema
    """
    try:
        # Use public schema session to get tenant info
        schema_name = tenant_manager.get_schema_name_by_tenant_id(db, tenant_id)
        
        # Get database session for the specific tenant schema
        tenant_db = tenant_manager.get_tenant_session(schema_name)
        try:
            yield tenant_db
        finally:
            tenant_db.close()
            
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Tenant error: {str(e)}")