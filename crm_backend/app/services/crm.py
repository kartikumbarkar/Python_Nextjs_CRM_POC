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
    
# same pattern for Lead and Opportunity...
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
    def update_lead(db: Session, lead_id: int, lead_update: LeadCreate) -> Optional[Lead]:
        db_lead = db.query(Lead).filter(Lead.id == lead_id).first()
        if db_lead:
            for key, value in lead_update.dict().items():
                setattr(db_lead, key, value)
            db.commit()
            db.refresh(db_lead)
        return db_lead
    @staticmethod
    def delete_lead(db: Session, lead_id: int) -> bool:
        db_lead = db.query(Lead).filter(Lead.id == lead_id).first()
        if db_lead:
            db.delete(db_lead)
            db.commit()
            return True
        return False
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

    @staticmethod
    def update_opportunity(db: Session, opportunity_id: int, opportunity_update: OpportunityCreate) -> Optional[Opportunity]:
        db_opportunity = db.query(Opportunity).filter(Opportunity.id == opportunity_id).first()
        if db_opportunity:
            for key, value in opportunity_update.dict().items():
                setattr(db_opportunity, key, value)
            db.commit()
            db.refresh(db_opportunity)
        return db_opportunity
    @staticmethod
    def delete_opportunity(db: Session, opportunity_id: int) -> bool:
        db_opportunity = db.query(Opportunity).filter(Opportunity.id == opportunity_id).first()
        if db_opportunity:
            db.delete(db_opportunity)
            db.commit()
            return True
        return False

crm_service = CRMService()