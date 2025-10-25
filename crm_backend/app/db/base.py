from app.db.base_class import Base
from app.models import tenant, crm

# Import all models here to ensure they are registered with Base
__all__ = ["Base"]