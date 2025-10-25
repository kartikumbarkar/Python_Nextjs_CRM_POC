from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class ContactBase(BaseModel):
    first_name: str
    last_name: str
    email: Optional[str] = None
    phone: Optional[str] = None
    company: Optional[str] = None
    title: Optional[str] = None

class ContactCreate(ContactBase):
    pass

class Contact(ContactBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime]
    
    class Config:
        from_attributes = True

class LeadBase(BaseModel):
    title: str
    description: Optional[str] = None
    status: Optional[str] = "new"
    source: Optional[str] = None
    contact_id: Optional[int] = None

class LeadCreate(LeadBase):
    pass

class Lead(LeadBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime]
    
    class Config:
        from_attributes = True

class OpportunityBase(BaseModel):
    name: str
    description: Optional[str] = None
    amount: Optional[float] = None
    stage: Optional[str] = "prospecting"
    probability: Optional[int] = 0
    close_date: Optional[datetime] = None
    contact_id: Optional[int] = None
    lead_id: Optional[int] = None

class OpportunityCreate(OpportunityBase):
    pass

class Opportunity(OpportunityBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime]
    
    class Config:
        from_attributes = True