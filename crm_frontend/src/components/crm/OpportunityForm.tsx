'use client';

import { useState, useEffect } from 'react';
import { Opportunity, Contact, Lead } from '@/lib/api';
import { crmApi } from '@/lib/api';
import { Card, Form, Button, Row, Col, Alert } from 'react-bootstrap';

interface OpportunityFormProps {
  opportunity?: Opportunity;
  onSubmit: (opportunity: Omit<Opportunity, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  onCancel?: () => void;
}

export const OpportunityForm: React.FC<OpportunityFormProps> = ({ opportunity, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: opportunity?.name || '',
    description: opportunity?.description || '',
    amount: opportunity?.amount || '',
    stage: opportunity?.stage || 'prospecting',
    probability: opportunity?.probability || 0,
    close_date: opportunity?.close_date ? opportunity.close_date.split('T')[0] : '',
    contact_id: opportunity?.contact_id || '',
    lead_id: opportunity?.lead_id || '',
  });
  
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchRelatedData();
  }, []);

  const fetchRelatedData = async () => {
    try {
      const [contactsData, leadsData] = await Promise.all([
        crmApi.getContacts(),
        crmApi.getLeads(),
      ]);
      setContacts(contactsData);
      setLeads(leadsData);
    } catch (err) {
      console.error('Error fetching related data:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const submitData = {
        ...formData,
        amount: formData.amount ? parseFloat(String(formData.amount)) : undefined,
        probability: parseInt(String(formData.probability), 10),
        contact_id: formData.contact_id ? parseInt(String(formData.contact_id), 10) : undefined,
        lead_id: formData.lead_id ? parseInt(String(formData.lead_id), 10) : undefined,
        close_date: formData.close_date ? new Date(formData.close_date).toISOString() : undefined,
      };
      
      await onSubmit(submitData);
    } catch (err: any) {
      setError(err.message || 'Failed to save opportunity');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<any>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const stageOptions = [
    { value: 'prospecting', label: 'Prospecting' },
    { value: 'qualification', label: 'Qualification' },
    { value: 'proposal', label: 'Proposal' },
    { value: 'negotiation', label: 'Negotiation' },
    { value: 'closed_won', label: 'Closed Won' },
    { value: 'closed_lost', label: 'Closed Lost' },
  ];

  return (
    <Card>
      <Card.Header>
        <h5 className="mb-0">
          <i className="bi bi-briefcase me-2"></i>
          {opportunity ? 'Edit Opportunity' : 'Create New Opportunity'}
        </h5>
      </Card.Header>
      <Card.Body>
        {error && (
          <Alert variant="danger">
            <i className="bi bi-exclamation-triangle me-2"></i>
            {error}
          </Alert>
        )}
        
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Opportunity Name *</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Enter opportunity name"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter opportunity description"
            />
          </Form.Group>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Amount</Form.Label>
                <Form.Control
                  type="number"
                  step="0.01"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  placeholder="Enter amount"
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Stage</Form.Label>
                <Form.Select
                  name="stage"
                  value={formData.stage}
                  onChange={handleChange}
                >
                  {stageOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Probability (%)</Form.Label>
                <Form.Range
                  name="probability"
                  value={formData.probability}
                  onChange={handleChange}
                  min="0"
                  max="100"
                />
                <div className="text-center">
                  <span className="fw-semibold">{formData.probability}%</span>
                </div>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Close Date</Form.Label>
                <Form.Control
                  type="date"
                  name="close_date"
                  value={formData.close_date}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Contact</Form.Label>
                <Form.Select
                  name="contact_id"
                  value={formData.contact_id}
                  onChange={handleChange}
                >
                  <option value="">Select a contact</option>
                  {contacts.map((contact) => (
                    <option key={contact.id} value={contact.id}>
                      {contact.first_name} {contact.last_name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Lead</Form.Label>
                <Form.Select
                  name="lead_id"
                  value={formData.lead_id}
                  onChange={handleChange}
                >
                  <option value="">Select a lead</option>
                  {leads.map((lead) => (
                    <option key={lead.id} value={lead.id}>
                      {lead.title}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <div className="d-flex gap-2 pt-3">
            <Button 
              type="submit" 
              variant="warning" 
              disabled={loading}
              className="d-flex align-items-center"
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                  Saving...
                </>
              ) : (
                <>
                  <i className="bi bi-check-circle me-2"></i>
                  {opportunity ? 'Update Opportunity' : 'Create Opportunity'}
                </>
              )}
            </Button>
            
            {onCancel && (
              <Button 
                type="button" 
                variant="outline-secondary"
                onClick={onCancel}
                className="d-flex align-items-center"
              >
                <i className="bi bi-x-circle me-2"></i>
                Cancel
              </Button>
            )}
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default OpportunityForm;