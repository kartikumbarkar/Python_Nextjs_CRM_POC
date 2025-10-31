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
        """Create user either as admin (global) or under a tenant."""
        hashed_password = get_password_hash(user.password)
        db_user = User(
            email=user.email,
            hashed_password=hashed_password,
            full_name=user.full_name,
            tenant_id=user.tenant_id if hasattr(user, "tenant_id") else None,
            is_superuser=getattr(user, "is_superuser", False)
        )
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        return db_user

    
    @staticmethod
    def get_user_by_email(db: Session, email: str):
        return db.query(User).filter(User.email == email).first()
    @staticmethod
    def get_all_tenants(db: Session):
        """Return all tenants for admin view"""
        return db.query(Tenant).order_by(Tenant.id.desc()).all()

    @staticmethod
    def get_tenant_by_id(db: Session, tenant_id: int):
        """Return a single tenant by ID"""
        return db.query(Tenant).filter(Tenant.id == tenant_id).first()

    @staticmethod
    def delete_tenant(db: Session, tenant_id: int):
        """Delete a tenant record (and optionally drop schema)"""
        tenant = db.query(Tenant).filter(Tenant.id == tenant_id).first()
        if not tenant:
            return False
        # Optional: Drop schema if tenant_manager supports it
        try:
            tenant_manager.drop_tenant_schema(tenant.schema_name)
        except Exception as e:
            print(f"⚠️ Warning: Failed to drop schema {tenant.schema_name}: {e}")

        db.delete(tenant)
        db.commit()
        return True
    @staticmethod
    def get_all_users(db: Session):
        """Return all users across tenants (admin-only)."""
        return db.query(User).order_by(User.id.desc()).all()

    @staticmethod
    def get_user_by_id(db: Session, user_id: int):
        """Return a single user."""
        return db.query(User).filter(User.id == user_id).first()

    @staticmethod
    def update_user(db: Session, user_id: int, updates: dict):
        """Update user fields (e.g. name, tenant, superuser)."""
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            return None
        for key, value in updates.items():
            if hasattr(user, key):
                setattr(user, key, value)
        db.commit()
        db.refresh(user)
        return user

    @staticmethod
    def delete_user(db: Session, user_id: int):
        """Delete user by ID."""
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            return False
        db.delete(user)
        db.commit()
        return True


tenant_service = TenantService()