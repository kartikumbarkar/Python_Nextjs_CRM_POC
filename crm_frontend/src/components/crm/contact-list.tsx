'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Contact } from '@/lib/api';
import { crmApi } from '@/lib/api';
import { Card, Table, Button, Badge, Spinner, Alert } from 'react-bootstrap';

export const ContactList: React.FC = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const data = await crmApi.getContacts();
      setContacts(data);
    } catch (err: any) {
      setError('Failed to load contacts');
      console.error('Error fetching contacts:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this contact?')) {
      try {
        await crmApi.deleteContact(id);
        setContacts(contacts.filter(contact => contact.id !== id));
      } catch (err: any) {
        setError('Failed to delete contact');
      }
    }
  };

  if (loading) {
    return (
      <Card>
        <Card.Body className="text-center">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
          <p className="mt-2 mb-0">Loading contacts...</p>
        </Card.Body>
      </Card>
    );
  }

  if (error) {
    return (
      <Alert variant="danger">
        {error}
      </Alert>
    );
  }

  return (
    <Card>
      <Card.Header className="d-flex justify-content-between align-items-center">
        <h5 className="mb-0">Contacts</h5>
        <Link href="/contacts/create">
          <Button variant="primary" size="sm">
            <i className="bi bi-plus-circle me-1"></i>
            Add Contact
          </Button>
        </Link>
      </Card.Header>
      <Card.Body>
        {contacts.length === 0 ? (
          <div className="text-center py-4">
            <i className="bi bi-people fs-1 text-muted mb-3 d-block"></i>
            <p className="text-muted mb-3">No contacts found.</p>
            <Link href="/contacts/create">
              <Button variant="primary">Create Your First Contact</Button>
            </Link>
          </div>
        ) : (
          <Table responsive hover>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Company</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {contacts.map((contact) => (
                <tr key={contact.id}>
                  <td>
                    <div className="d-flex align-items-center">
                      <div 
                        className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3"
                        style={{ width: '40px', height: '40px', fontSize: '14px' }}
                      >
                        {contact.first_name[0]}{contact.last_name[0]}
                      </div>
                      <div>
                        <div className="fw-semibold">
                          {contact.first_name} {contact.last_name}
                        </div>
                        <small className="text-muted">{contact.title}</small>
                      </div>
                    </div>
                  </td>
                  <td>{contact.email || '-'}</td>
                  <td>{contact.phone || '-'}</td>
                  <td>{contact.company || '-'}</td>
                  <td>
                    <div className="d-flex gap-2">
                      <Link href={`/contacts/${contact.id}`}>
                        <Button variant="outline-primary" size="sm">
                          <i className="bi bi-pencil"></i>
                        </Button>
                      </Link>
                      <Button 
                        variant="outline-danger" 
                        size="sm"
                        onClick={() => handleDelete(contact.id)}
                      >
                        <i className="bi bi-trash"></i>
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Card.Body>
    </Card>
  );
};