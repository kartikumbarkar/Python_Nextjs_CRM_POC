from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from app.core.config import settings
from app.db.base import Base
from app.models.crm import Contact, Lead, Opportunity

class TenantManager:
    def __init__(self):
        self.main_engine = create_engine(settings.DATABASE_URL)
    
    def create_tenant_schema(self, schema_name: str):
        """Create a new schema for a tenant and set up all tables"""
        print(f"Creating schema: {schema_name}")
        
        with self.main_engine.connect() as conn:
            # Create schema
            conn.execute(text(f"CREATE SCHEMA IF NOT EXISTS {schema_name}"))
            
            # Switch to tenant schema and create tables
            conn.execute(text(f"SET search_path TO {schema_name}"))
            
            # Create all CRM tables in the tenant schema (but NOT users/tenants)
            try:
                # Only create CRM tables in tenant schema
                Contact.metadata.create_all(bind=conn)
                Lead.metadata.create_all(bind=conn)
                Opportunity.metadata.create_all(bind=conn)
                print(f"✅ CRM tables created in schema: {schema_name}")
            except Exception as e:
                print(f"❌ Error creating tables in {schema_name}: {e}")
                raise
            
            conn.commit()
    
    def ensure_tables_exist(self, schema_name: str):
        """Ensure tables exist in tenant schema, create them if they don't"""
        with self.main_engine.connect() as conn:
            # Check if contacts table exists
            result = conn.execute(text(f"""
                SELECT EXISTS (
                    SELECT FROM information_schema.tables 
                    WHERE table_schema = '{schema_name}' 
                    AND table_name = 'contacts'
                )
            """))
            tables_exist = result.scalar()
            
            if not tables_exist:
                print(f"CRM tables don't exist in {schema_name}, creating them...")
                self.create_tenant_schema(schema_name)
    
    def get_tenant_engine(self, schema_name: str):
        """Get engine for specific tenant schema"""
        # First ensure tables exist
        self.ensure_tables_exist(schema_name)
        
        db_url = settings.DATABASE_URL
        if "?" in db_url:
            db_url = db_url.replace("?", f"?options=-csearch_path={schema_name}&")
        else:
            db_url = f"{db_url}?options=-csearch_path={schema_name}"
        return create_engine(db_url)
    
    def get_tenant_session(self, schema_name: str):
        """Get session for specific tenant schema"""
        engine = self.get_tenant_engine(schema_name)
        SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
        return SessionLocal()
    
    def get_schema_name_by_tenant_id(self, db, tenant_id: str):
        """Get schema name from tenant ID using public schema"""
        from app.models.tenant import Tenant
        
        # Use the public schema session to query tenants table
        tenant = db.query(Tenant).filter(Tenant.id == int(tenant_id)).first()
        if not tenant:
            raise Exception(f"Tenant with ID {tenant_id} not found")
        return tenant.schema_name

tenant_manager = TenantManager()