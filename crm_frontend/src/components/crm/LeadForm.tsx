'use client';

import { useState, useEffect } from 'react';
import { Lead, Contact } from '@/lib/api';
import { crmApi } from '@/lib/api';
import { Card, Form, Button, Row, Col, Alert } from 'react-bootstrap';

interface LeadFormProps {
  lead?: Lead;
  onSubmit: (lead: Omit<Lead, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  onCancel?: () => void;
}

export const LeadForm: React.FC<LeadFormProps> = ({ lead, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: lead?.title || '',
    description: lead?.description || '',
    status: lead?.status || 'new',
    source: lead?.source || '',
    contact_id: lead?.contact_id || '',
  });
  
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const data = await crmApi.getContacts();
      setContacts(data);
    } catch (err) {
      console.error('Error fetching contacts:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const submitData = {
        ...formData,
        contact_id: formData.contact_id ? parseInt(formData.contact_id as string) : undefined,
      };
      
      await onSubmit(submitData);
    } catch (err: any) {
      setError(err.message || 'Failed to save lead');
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

  return (
    <Card>
      <Card.Header>
        <h5 className="mb-0">
          <i className="bi bi-graph-up-arrow me-2"></i>
          {lead ? 'Edit Lead' : 'Create New Lead'}
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
            <Form.Label>Title *</Form.Label>
            <Form.Control
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="Enter lead title"
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
              placeholder="Enter lead description"
            />
          </Form.Group>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Status</Form.Label>
                <Form.Select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value="new">New</option>
                  <option value="contacted">Contacted</option>
                  <option value="qualified">Qualified</option>
                  <option value="lost">Lost</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Source</Form.Label>
                <Form.Select
                  name="source"
                  value={formData.source}
                  onChange={handleChange}
                >
                  <option value="">Select source</option>
                  <option value="website">Website</option>
                  <option value="referral">Referral</option>
                  <option value="social_media">Social Media</option>
                  <option value="advertising">Advertising</option>
                  <option value="other">Other</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label>Contact (Optional)</Form.Label>
            <Form.Select
              name="contact_id"
              value={formData.contact_id}
              onChange={handleChange}
            >
              <option value="">Select a contact</option>
              {contacts.map((contact) => (
                <option key={contact.id} value={contact.id}>
                  {contact.first_name} {contact.last_name} {contact.email ? `(${contact.email})` : ''}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <div className="d-flex gap-2 pt-3">
            <Button 
              type="submit" 
              variant="success" 
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
                  {lead ? 'Update Lead' : 'Create Lead'}
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

export default LeadForm;