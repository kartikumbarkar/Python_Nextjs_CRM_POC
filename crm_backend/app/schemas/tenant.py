from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

class TenantBase(BaseModel):
    name: str

class TenantCreate(TenantBase):
    pass

class Tenant(TenantBase):
    id: int
    schema_name: str
    is_active: bool
    created_at: datetime
    
    class Config:
        from_attributes = True

class UserBase(BaseModel):
    email: EmailStr
    full_name: str

class UserCreate(UserBase):
    password: str
    tenant_id: int

class User(UserBase):
    id: int
    is_active: bool
    is_superuser: bool
    tenant_id: int
    tenant_name: Optional[str] = None
    created_at: datetime
    
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str
    user_id: int
    email: str
    full_name: Optional[str] = None
    tenant_id: Optional[int] = None
    is_superuser: bool
    is_admin: bool

class TokenData(BaseModel):
    email: Optional[str] = None