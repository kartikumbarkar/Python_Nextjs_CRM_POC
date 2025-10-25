from sqlalchemy.orm import Session
from app.models.tenant import Tenant, User
from app.schemas.tenant import TenantCreate, UserCreate
from app.core.security import get_password_hash, verify_password
from app.db.tenant import tenant_manager

class TenantService:
    @staticmethod
    def create_tenant(db: Session, tenant: TenantCreate):
        # Create schema name from tenant name (lowercase, replace spaces with underscores)
        schema_name = f"tenant_{tenant.name.lower().replace(' ', '_').replace('-', '_')}"
        
        # Create tenant in main schema
        db_tenant = Tenant(
            name=tenant.name,
            schema_name=schema_name
        )
        db.add(db_tenant)
        db.commit()
        db.refresh(db_tenant)
        
        # Create schema for the tenant with proper name
        tenant_manager.create_tenant_schema(schema_name)
        
        return db_tenant
    
    @staticmethod
    def create_user(db: Session, user: UserCreate):
        hashed_password = get_password_hash(user.password)
        db_user = User(
            email=user.email,
            hashed_password=hashed_password,
            full_name=user.full_name,
            tenant_id=user.tenant_id
        )
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        return db_user
    
    @staticmethod
    def get_user_by_email(db: Session, email: str):
        return db.query(User).filter(User.email == email).first()

tenant_service = TenantService()