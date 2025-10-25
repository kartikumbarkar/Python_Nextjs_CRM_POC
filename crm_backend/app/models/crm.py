from sqlalchemy import Column, String, Integer, Text, DateTime, ForeignKey, Numeric, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.base_class import Base

class Contact(Base):
    __tablename__ = "contacts"
    
    id = Column(Integer, primary_key=True, index=True)
    first_name = Column(String(100), nullable=False)
    last_name = Column(String(100), nullable=False)
    email = Column(String(100), index=True)
    phone = Column(String(20))
    company = Column(String(100))
    title = Column(String(100))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    leads = relationship("Lead", back_populates="contact")
    opportunities = relationship("Opportunity", back_populates="contact")

class Lead(Base):
    __tablename__ = "leads"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False)
    description = Column(Text)
    status = Column(String(50), default="new")  # new, contacted, qualified, lost
    source = Column(String(100))  # website, referral, advertising, etc.
    contact_id = Column(Integer, ForeignKey("contacts.id"))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    contact = relationship("Contact", back_populates="leads")
    opportunities = relationship("Opportunity", back_populates="lead")

class Opportunity(Base):
    __tablename__ = "opportunities"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(200), nullable=False)
    description = Column(Text)
    amount = Column(Numeric(10, 2))
    stage = Column(String(50), default="prospecting")  # prospecting, qualification, proposal, negotiation, closed_won, closed_lost
    probability = Column(Integer, default=0)  # 0-100%
    close_date = Column(DateTime)
    contact_id = Column(Integer, ForeignKey("contacts.id"))
    lead_id = Column(Integer, ForeignKey("leads.id"))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    contact = relationship("Contact", back_populates="opportunities")
    lead = relationship("Lead", back_populates="opportunities")