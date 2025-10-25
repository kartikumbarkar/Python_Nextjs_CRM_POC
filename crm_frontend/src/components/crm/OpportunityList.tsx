'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Opportunity } from '@/lib/api';
import { crmApi } from '@/lib/api';
import { Card, Table, Button, Badge, Spinner, Alert } from 'react-bootstrap';

const OpportunityList: React.FC = () => {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this opportunity?')) {
      try {
        await crmApi.deleteOpportunity(id);
        setOpportunities(opportunities.filter(opportunity => opportunity.id !== id));
      } catch (err: any) {
        setError('Failed to delete opportunity');
      }
    }
  };

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

  if (loading) {
    return (
      <Card>
        <Card.Body className="text-center">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
          <p className="mt-2 mb-0">Loading opportunities...</p>
        </Card.Body>
      </Card>
    );
  }

  if (error) {
    return (
      <Alert variant="danger">
        <i className="bi bi-exclamation-triangle me-2"></i>
        {error}
      </Alert>
    );
  }

  return (
    <Card>
      <Card.Header className="d-flex justify-content-between align-items-center">
        <h5 className="mb-0">
          <i className="bi bi-briefcase me-2"></i>
          Opportunities
        </h5>
        <Link href="/opportunities/create">
          <Button variant="warning" size="sm">
            <i className="bi bi-plus-circle me-1"></i>
            Add Opportunity
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
                <th>Contact</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {opportunities.map((opportunity) => (
                <tr key={opportunity.id}>
                  <td>
                    <div className="fw-semibold">{opportunity.name}</div>
                    {opportunity.description && (
                      <small className="text-muted">
                        {opportunity.description.length > 50 
                          ? `${opportunity.description.substring(0, 50)}...` 
                          : opportunity.description
                        }
                      </small>
                    )}
                  </td>
                  <td>
                    <Badge bg={getStageVariant(opportunity.stage)}>
                      {opportunity.stage.replace('_', ' ').toUpperCase()}
                    </Badge>
                  </td>
                  <td>
                    {opportunity.amount ? (
                      <span className="fw-semibold">
                        {formatCurrency(opportunity.amount)}
                      </span>
                    ) : (
                      '-'
                    )}
                  </td>
                  <td>
                    <div className="d-flex align-items-center">
                      <div className="progress flex-grow-1 me-2" style={{ height: '6px' }}>
                        <div 
                          className={`progress-bar ${
                            opportunity.probability >= 70 ? 'bg-success' : 
                            opportunity.probability >= 40 ? 'bg-warning' : 'bg-secondary'
                          }`}
                          style={{ width: `${opportunity.probability}%` }}
                        ></div>
                      </div>
                      <small>{opportunity.probability}%</small>
                    </div>
                  </td>
                  <td>
                    {opportunity.close_date ? (
                      new Date(opportunity.close_date).toLocaleDateString()
                    ) : (
                      '-'
                    )}
                  </td>
                  <td>
                    {opportunity.contact ? (
                      <div>
                        {opportunity.contact.first_name} {opportunity.contact.last_name}
                      </div>
                    ) : (
                      '-'
                    )}
                  </td>
                  <td>
                    <div className="d-flex gap-2">
                      <Link href={`/opportunities/${opportunity.id}`}>
                        <Button variant="outline-primary" size="sm">
                          <i className="bi bi-pencil"></i>
                        </Button>
                      </Link>
                      <Button 
                        variant="outline-danger" 
                        size="sm"
                        onClick={() => handleDelete(opportunity.id)}
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

export default OpportunityList;