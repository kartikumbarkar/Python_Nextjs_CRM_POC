from sqlalchemy.orm import Session
from typing import List, Optional
from app.models.crm import Contact, Lead, Opportunity
from app.schemas.crm import ContactCreate, LeadCreate, OpportunityCreate

class CRMService:
    # Contact methods
    @staticmethod
    def get_contacts(db: Session, skip: int = 0, limit: int = 100) -> List[Contact]:
        return db.query(Contact).offset(skip).limit(limit).all()
    
    @staticmethod
    def get_contact(db: Session, contact_id: int) -> Optional[Contact]:
        return db.query(Contact).filter(Contact.id == contact_id).first()
    
    @staticmethod
    def create_contact(db: Session, contact: ContactCreate) -> Contact:
        db_contact = Contact(**contact.dict())
        db.add(db_contact)
        db.commit()
        db.refresh(db_contact)
        return db_contact
    
    @staticmethod
    def update_contact(db: Session, contact_id: int, contact_update: ContactCreate) -> Optional[Contact]:
        db_contact = db.query(Contact).filter(Contact.id == contact_id).first()
        if db_contact:
            for key, value in contact_update.dict().items():
                setattr(db_contact, key, value)
            db.commit()
            db.refresh(db_contact)
        return db_contact
    
    @staticmethod
    def delete_contact(db: Session, contact_id: int) -> bool:
        db_contact = db.query(Contact).filter(Contact.id == contact_id).first()
        if db_contact:
            db.delete(db_contact)
            db.commit()
            return True
        return False
    
    # Similar methods for Lead and Opportunity
    @staticmethod
    def create_lead(db: Session, lead: LeadCreate) -> Lead:
        db_lead = Lead(**lead.dict())
        db.add(db_lead)
        db.commit()
        db.refresh(db_lead)
        return db_lead
    
    @staticmethod
    def get_leads(db: Session, skip: int = 0, limit: int = 100) -> List[Lead]:
        return db.query(Lead).offset(skip).limit(limit).all()
    
    @staticmethod
    def create_opportunity(db: Session, opportunity: OpportunityCreate) -> Opportunity:
        db_opportunity = Opportunity(**opportunity.dict())
        db.add(db_opportunity)
        db.commit()
        db.refresh(db_opportunity)
        return db_opportunity
    
    @staticmethod
    def get_opportunities(db: Session, skip: int = 0, limit: int = 100) -> List[Opportunity]:
        return db.query(Opportunity).offset(skip).limit(limit).all()

crm_service = CRMService()