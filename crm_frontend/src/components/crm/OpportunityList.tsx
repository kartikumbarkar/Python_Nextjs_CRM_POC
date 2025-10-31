'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Opportunity } from '@/lib/api';
import { crmApi } from '@/lib/api';
import { Card, Table, Button, Badge, Spinner, Alert } from 'react-bootstrap';
import { OpportunityForm } from './OpportunityForm';

const OpportunityList: React.FC = () => {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingOpportunity, setEditingOpportunity] = useState<Opportunity | null>(null);
  const [deleting, setDeleting] = useState<number | null>(null);

  useEffect(() => {
    fetchOpportunities();
  }, []);

  const fetchOpportunities = async () => {
    try {
      const data = await crmApi.getOpportunities();
      setOpportunities(data);
    } catch (err: any) {
      setError('Failed to load opportunities');
      console.error('Error fetching opportunities:', err);
    } finally {
      setLoading(false);
    }
  };

  /** ✅ DELETE HANDLER **/
  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this opportunity?')) return;
    setDeleting(id);
    try {
      await crmApi.deleteOpportunity(id);
      setOpportunities(prev => prev.filter(o => o.id !== id));
    } catch (err: any) {
      console.error(err);
      setError('Failed to delete opportunity');
    } finally {
      setDeleting(null);
    }
  };

  /** ✅ EDIT HANDLER **/
  const handleEdit = (opportunity: Opportunity) => {
    setEditingOpportunity(opportunity);
  };

  /** ✅ UPDATE HANDLER **/
  const handleUpdate = async (data: any) => {
    if (!editingOpportunity) return;
    try {
      await crmApi.updateOpportunity(editingOpportunity.id, data);
      setEditingOpportunity(null);
      fetchOpportunities();
    } catch (err: any) {
      console.error(err);
      setError('Failed to update opportunity');
    }
  };

  /** ✅ CANCEL EDIT **/
  const handleCancelEdit = () => setEditingOpportunity(null);

  /** ✅ UI HELPERS **/
  const getStageVariant = (stage: string) => {
    switch (stage.toLowerCase()) {
      case 'prospecting': return 'secondary';
      case 'qualification': return 'info';
      case 'proposal': return 'primary';
      case 'negotiation': return 'warning';
      case 'closed_won': return 'success';
      case 'closed_lost': return 'danger';
      default: return 'secondary';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  /** ✅ LOADING STATE **/
  if (loading) {
    return (
      <Card>
        <Card.Body className="text-center">
          <Spinner animation="border" role="status" />
          <p className="mt-2 mb-0">Loading opportunities...</p>
        </Card.Body>
      </Card>
    );
  }

  /** ✅ ERROR STATE **/
  if (error) {
    return (
      <Alert variant="danger">
        <i className="bi bi-exclamation-triangle me-2"></i>
        {error}
      </Alert>
    );
  }

  /** ✅ EDIT MODE VIEW **/
  if (editingOpportunity) {
    return (
      <OpportunityForm
        opportunity={editingOpportunity}
        onSubmit={handleUpdate}
        onCancel={handleCancelEdit}
      />
    );
  }

  /** ✅ DEFAULT TABLE VIEW **/
  return (
    <Card>
      <Card.Header className="d-flex justify-content-between align-items-center">
        <h5 className="mb-0">
          <i className="bi bi-briefcase me-2"></i> Opportunities
        </h5>
        <Link href="/opportunities/create">
          <Button variant="warning" size="sm">
            <i className="bi bi-plus-circle me-1"></i> Add Opportunity
          </Button>
        </Link>
      </Card.Header>

      <Card.Body>
        {opportunities.length === 0 ? (
          <div className="text-center py-4">
            <i className="bi bi-briefcase fs-1 text-muted mb-3 d-block"></i>
            <p className="text-muted mb-3">No opportunities found.</p>
            <Link href="/opportunities/create">
              <Button variant="warning">Create Your First Opportunity</Button>
            </Link>
          </div>
        ) : (
          <Table responsive hover>
            <thead>
              <tr>
                <th>Name</th>
                <th>Stage</th>
                <th>Amount</th>
                <th>Probability</th>
                <th>Close Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {opportunities.map((o) => (
                <tr key={o.id}>
                  <td>{o.name}</td>
                  <td>
                    <Badge bg={getStageVariant(o.stage)}>
                      {o.stage.replace('_', ' ').toUpperCase()}
                    </Badge>
                  </td>
                  <td>
                    {o.amount ? formatCurrency(o.amount) : '-'}
                  </td>
                  <td>{o.probability}%</td>
                  <td>
                    {o.close_date ? new Date(o.close_date).toLocaleDateString() : '-'}
                  </td>
                  <td>
                    <div className="d-flex gap-2">
                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={() => handleEdit(o)}
                      >
                        <i className="bi bi-pencil"></i>
                      </Button>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleDelete(o.id)}
                        disabled={deleting === o.id}
                      >
                        {deleting === o.id ? (
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

export default OpportunityList;
