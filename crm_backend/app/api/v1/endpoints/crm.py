from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.schemas.crm import Contact, ContactCreate, Lead, LeadCreate, Opportunity, OpportunityCreate
from app.services.crm import crm_service
from app.api.v1.dependencies import get_tenant_db

router = APIRouter()

# Contacts
@router.get("/contacts/", response_model=List[Contact])
def read_contacts(skip: int = 0, limit: int = 100, db: Session = Depends(get_tenant_db)):
    contacts = crm_service.get_contacts(db, skip=skip, limit=limit)
    return contacts

@router.post("/contacts/", response_model=Contact)
def create_contact(contact: ContactCreate, db: Session = Depends(get_tenant_db)):
    return crm_service.create_contact(db, contact)

@router.get("/contacts/{contact_id}", response_model=Contact)
def read_contact(contact_id: int, db: Session = Depends(get_tenant_db)):
    contact = crm_service.get_contact(db, contact_id)
    if contact is None:
        raise HTTPException(status_code=404, detail="Contact not found")
    return contact

# Leads
@router.get("/leads/", response_model=List[Lead])
def read_leads(skip: int = 0, limit: int = 100, db: Session = Depends(get_tenant_db)):
    leads = crm_service.get_leads(db, skip=skip, limit=limit)
    return leads

@router.post("/leads/", response_model=Lead)
def create_lead(lead: LeadCreate, db: Session = Depends(get_tenant_db)):
    return crm_service.create_lead(db, lead)

# Opportunities
@router.get("/opportunities/", response_model=List[Opportunity])
def read_opportunities(skip: int = 0, limit: int = 100, db: Session = Depends(get_tenant_db)):
    opportunities = crm_service.get_opportunities(db, skip=skip, limit=limit)
    return opportunities

@router.post("/opportunities/", response_model=Opportunity)
def create_opportunity(opportunity: OpportunityCreate, db: Session = Depends(get_tenant_db)):
    return crm_service.create_opportunity(db, opportunity)