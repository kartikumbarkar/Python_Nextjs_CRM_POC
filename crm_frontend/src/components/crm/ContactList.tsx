'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Contact } from '@/lib/api';
import { crmApi } from '@/lib/api';
import { Card, Table, Button, Spinner, Alert } from 'react-bootstrap';
import { ContactForm } from './ContactForm';

const ContactList: React.FC = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [deleting, setDeleting] = useState<number | null>(null);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const data = await crmApi.getContacts();
      setContacts(data);
    } catch (err: any) {
      setError('Failed to load contacts');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this contact?')) return;
    setDeleting(id);
    try {
      await crmApi.deleteContact(id);
      setContacts(prev => prev.filter(c => c.id !== id));
    } catch (err: any) {
      setError('Failed to delete contact');
    } finally {
      setDeleting(null);
    }
  };

  const handleEdit = (contact: Contact) => {
    setEditingContact(contact);
  };

  const handleUpdate = async (data: any) => {
    if (!editingContact) return;
    try {
      await crmApi.updateContact(editingContact.id, data);
      setEditingContact(null);
      fetchContacts();
    } catch (err: any) {
      setError('Failed to update contact');
    }
  };

  const handleCancelEdit = () => setEditingContact(null);

  if (loading)
    return (
      <Card>
        <Card.Body className="text-center">
          <Spinner animation="border" role="status" />
          <p className="mt-2 mb-0">Loading contacts...</p>
        </Card.Body>
      </Card>
    );

  if (error)
    return (
      <Alert variant="danger">
        {error}
      </Alert>
    );

  if (editingContact)
    return (
      <ContactForm
        contact={editingContact}
        onSubmit={handleUpdate}
        onCancel={handleCancelEdit}
      />
    );

  return (
    <Card>
      <Card.Header className="d-flex justify-content-between align-items-center">
        <h5 className="mb-0">Contacts</h5>
        <Link href="/contacts/create">
          <Button variant="primary" size="sm">
            <i className="bi bi-plus-circle me-1"></i> Add Contact
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
                  <td>{contact.first_name} {contact.last_name}</td>
                  <td>{contact.email || '-'}</td>
                  <td>{contact.phone || '-'}</td>
                  <td>{contact.company || '-'}</td>
                  <td>
                    <div className="d-flex gap-2">
                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={() => handleEdit(contact)}
                      >
                        <i className="bi bi-pencil"></i>
                      </Button>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleDelete(contact.id)}
                        disabled={deleting === contact.id}
                      >
                        {deleting === contact.id ? (
                          <Spinner size="sm" animation="border" />
                        ) : (
                          <i className="bi bi-trash"></i>
                        )}
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

export default ContactList;
