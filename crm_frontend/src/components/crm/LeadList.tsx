'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Lead } from '@/lib/api';
import { crmApi } from '@/lib/api';
import { Card, Table, Button, Badge, Spinner, Alert } from 'react-bootstrap';
import { LeadForm } from './LeadForm';

const LeadList: React.FC = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [deleting, setDeleting] = useState<number | null>(null);

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const data = await crmApi.getLeads();
      setLeads(data);
    } catch (err: any) {
      setError('Failed to load leads');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  /** ✅ DELETE HANDLER **/
  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this lead?')) return;
    setDeleting(id);
    try {
      await crmApi.deleteLead(id);
      setLeads(prev => prev.filter(lead => lead.id !== id));
    } catch (err: any) {
      setError('Failed to delete lead');
    } finally {
      setDeleting(null);
    }
  };

  /** ✅ EDIT HANDLER **/
  const handleEdit = (lead: Lead) => {
    setEditingLead(lead);
  };

  /** ✅ UPDATE HANDLER **/
  const handleUpdate = async (data: any) => {
    if (!editingLead) return;
    try {
      await crmApi.updateLead(editingLead.id, data);
      setEditingLead(null);
      fetchLeads();
    } catch (err: any) {
      setError('Failed to update lead');
    }
  };

  const handleCancelEdit = () => setEditingLead(null);

  const getStatusVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case 'new': return 'primary';
      case 'contacted': return 'info';
      case 'qualified': return 'success';
      case 'lost': return 'danger';
      default: return 'secondary';
    }
  };

  if (loading)
    return (
      <Card>
        <Card.Body className="text-center">
          <Spinner animation="border" role="status" />
          <p className="mt-2 mb-0">Loading leads...</p>
        </Card.Body>
      </Card>
    );

  if (error)
    return (
      <Alert variant="danger">
        <i className="bi bi-exclamation-triangle me-2"></i>
        {error}
      </Alert>
    );

  /** ✅ EDIT MODE **/
  if (editingLead)
    return (
      <LeadForm
        lead={editingLead}
        onSubmit={handleUpdate}
        onCancel={handleCancelEdit}
      />
    );

  /** ✅ NORMAL TABLE VIEW **/
  return (
    <Card>
      <Card.Header className="d-flex justify-content-between align-items-center">
        <h5 className="mb-0">
          <i className="bi bi-graph-up-arrow me-2"></i> Leads
        </h5>
        <Link href="/leads/create">
          <Button variant="success" size="sm">
            <i className="bi bi-plus-circle me-1"></i> Add Lead
          </Button>
        </Link>
      </Card.Header>
      <Card.Body>
        {leads.length === 0 ? (
          <div className="text-center py-4">
            <i className="bi bi-graph-up fs-1 text-muted mb-3 d-block"></i>
            <p className="text-muted mb-3">No leads found.</p>
            <Link href="/leads/create">
              <Button variant="success">Create Your First Lead</Button>
            </Link>
          </div>
        ) : (
          <Table responsive hover>
            <thead>
              <tr>
                <th>Title</th>
                <th>Status</th>
                <th>Source</th>
                <th>Contact</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <tr key={lead.id}>
                  <td>{lead.title}</td>
                  <td>
                    <Badge bg={getStatusVariant(lead.status)}>{lead.status}</Badge>
                  </td>
                  <td>{lead.source || '-'}</td>
                  <td>{lead.contact_id || '-'}</td>
                  <td>{new Date(lead.created_at).toLocaleDateString()}</td>
                  <td>
                    <div className="d-flex gap-2">
                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={() => handleEdit(lead)}
                      >
                        <i className="bi bi-pencil"></i>
                      </Button>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleDelete(lead.id)}
                        disabled={deleting === lead.id}
                      >
                        {deleting === lead.id ? (
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

export default LeadList;
