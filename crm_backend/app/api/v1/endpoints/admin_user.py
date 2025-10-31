from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from app.db.session import get_db
from app.schemas.tenant import UserCreate, User as UserSchema
from app.services.tenant import tenant_service
from app.core.security import get_current_admin_user
from app.models.tenant import User, Tenant

router = APIRouter()

@router.get("/users/", response_model=List[UserSchema])
def list_users(
    tenant_name: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_admin_user)
):
    """List all users, optionally filtered by tenant name."""
    if tenant_name:
        tenant = db.query(Tenant).filter(Tenant.name.ilike(tenant_name)).first()
        if not tenant:
            raise HTTPException(status_code=404, detail=f"Tenant '{tenant_name}' not found")
        users = db.query(User).filter(User.tenant_id == tenant.id).all()
    else:
        users = db.query(User).all()

    for u in users:
        if u.tenant_id:
            tenant = db.query(Tenant).filter(Tenant.id == u.tenant_id).first()
            u.tenant_name = tenant.name if tenant else None
        else:
            u.tenant_name = "—"
    return users


@router.post("/users/", response_model=UserSchema, status_code=status.HTTP_201_CREATED)
def create_user(user: UserCreate, db: Session = Depends(get_db), current_user=Depends(get_current_admin_user)):
    db_user = tenant_service.get_user_by_email(db, user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    return tenant_service.create_user(db, user)


@router.put("/users/{user_id}", response_model=UserSchema)
def update_user(user_id: int, updates: dict, db: Session = Depends(get_db), current_user=Depends(get_current_admin_user)):
    user = tenant_service.update_user(db, user_id, updates)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@router.delete("/users/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_user(user_id: int, db: Session = Depends(get_db), current_user=Depends(get_current_admin_user)):
    deleted = tenant_service.delete_user(db, user_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="User not found")
    return None
