from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.schemas.tenant import Tenant, TenantCreate, User, UserCreate, Token
from app.services.tenant import tenant_service
from app.core.security import verify_password, create_access_token

router = APIRouter()
@staticmethod
def get_tenant_by_name(db: Session, name: str):
    """Fetch tenant object by name (case-insensitive)."""
    return db.query(Tenant).filter(Tenant.name.ilike(name)).first()

@router.post("/tenants/", response_model=Tenant)
def create_tenant(tenant: TenantCreate, db: Session = Depends(get_db)):
    return tenant_service.create_tenant(db, tenant)

@router.post("/users/", response_model=User)
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    db_user = tenant_service.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    return tenant_service.create_user(db, user)

@router.post("/login/", response_model=Token)
def login(email: str, password: str, db: Session = Depends(get_db)):
    user = tenant_service.get_user_by_email(db, email=email)
    if not user or not verify_password(password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    
    access_token = create_access_token(data={"sub": user.email})
    
    # For admin users, don't require tenant_id for general access
    response_data = {
        "access_token": access_token,
        "token_type": "bearer",
        "user_id": user.id,
        "email": user.email,
        "full_name": user.full_name,
        "is_superuser": user.is_superuser,
        "is_admin": user.is_superuser,  # Add explicit admin flag
    }
    
    # Only include tenant_id for non-admin users
    if not user.is_superuser:
        response_data["tenant_id"] = user.tenant_id
    return response_data