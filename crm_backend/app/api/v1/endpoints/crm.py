from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.schemas.crm import (
    Contact, ContactCreate, Lead, LeadCreate,
    Opportunity, OpportunityCreate
)
from app.services.crm import crm_service
from app.api.v1.dependencies import get_tenant_db

router = APIRouter()

# ---------------------- CONTACTS ----------------------
@router.get("/contacts/", response_model=List[Contact])
def read_contacts(skip: int = 0, limit: int = 100, db: Session = Depends(get_tenant_db)):
    return crm_service.get_contacts(db, skip=skip, limit=limit)

@router.post("/contacts/", response_model=Contact)
def create_contact(contact: ContactCreate, db: Session = Depends(get_tenant_db)):
    return crm_service.create_contact(db, contact)

@router.get("/contacts/{contact_id}", response_model=Contact)
def read_contact(contact_id: int, db: Session = Depends(get_tenant_db)):
    contact = crm_service.get_contact(db, contact_id)
    if not contact:
        raise HTTPException(status_code=404, detail="Contact not found")
    return contact

@router.put("/contacts/{contact_id}", response_model=Contact)
def update_contact(contact_id: int, contact_data: ContactCreate, db: Session = Depends(get_tenant_db)):
    contact = crm_service.update_contact(db, contact_id, contact_data)
    if not contact:
        raise HTTPException(status_code=404, detail="Contact not found")
    return contact

@router.delete("/contacts/{contact_id}", status_code=204)
def delete_contact(contact_id: int, db: Session = Depends(get_tenant_db)):
    deleted = crm_service.delete_contact(db, contact_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Contact not found")
    return None


# ---------------------- LEADS ----------------------
@router.get("/leads/", response_model=List[Lead])
def read_leads(skip: int = 0, limit: int = 100, db: Session = Depends(get_tenant_db)):
    return crm_service.get_leads(db, skip=skip, limit=limit)

@router.post("/leads/", response_model=Lead)
def create_lead(lead: LeadCreate, db: Session = Depends(get_tenant_db)):
    return crm_service.create_lead(db, lead)

@router.get("/leads/{lead_id}", response_model=Lead)
def read_lead(lead_id: int, db: Session = Depends(get_tenant_db)):
    lead = crm_service.get_lead(db, lead_id)
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")
    return lead

@router.put("/leads/{lead_id}", response_model=Lead)
def update_lead(lead_id: int, lead_data: LeadCreate, db: Session = Depends(get_tenant_db)):
    lead = crm_service.update_lead(db, lead_id, lead_data)
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")
    return lead

@router.delete("/leads/{lead_id}", status_code=204)
def delete_lead(lead_id: int, db: Session = Depends(get_tenant_db)):
    deleted = crm_service.delete_lead(db, lead_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Lead not found")
    return None


# ---------------------- OPPORTUNITIES ----------------------
@router.get("/opportunities/", response_model=List[Opportunity])
def read_opportunities(skip: int = 0, limit: int = 100, db: Session = Depends(get_tenant_db)):
    return crm_service.get_opportunities(db, skip=skip, limit=limit)

@router.post("/opportunities/", response_model=Opportunity)
def create_opportunity(opportunity: OpportunityCreate, db: Session = Depends(get_tenant_db)):
    return crm_service.create_opportunity(db, opportunity)

@router.get("/opportunities/{opportunity_id}", response_model=Opportunity)
def read_opportunity(opportunity_id: int, db: Session = Depends(get_tenant_db)):
    opp = crm_service.get_opportunity(db, opportunity_id)
    if not opp:
        raise HTTPException(status_code=404, detail="Opportunity not found")
    return opp

@router.put("/opportunities/{opportunity_id}", response_model=Opportunity)
def update_opportunity(opportunity_id: int, opportunity_data: OpportunityCreate, db: Session = Depends(get_tenant_db)):
    opp = crm_service.update_opportunity(db, opportunity_id, opportunity_data)
    if not opp:
        raise HTTPException(status_code=404, detail="Opportunity not found")
    return opp

@router.delete("/opportunities/{opportunity_id}", status_code=204)
def delete_opportunity(opportunity_id: int, db: Session = Depends(get_tenant_db)):
    deleted = crm_service.delete_opportunity(db, opportunity_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Opportunity not found")
    return None
