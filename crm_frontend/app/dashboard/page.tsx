'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../src/contexts/auth-context';
import { crmApi, Contact, Lead, Opportunity } from '../../src/lib/api';
import { Container, Row, Col, Card, Table, Button, Badge, Spinner, Alert } from 'react-bootstrap';
import Link from 'next/link';

// ... (keep the existing StatCard component)

export default function DashboardPage() {
  const { user , isAuthenticated, isAdmin, isLoading} = useAuth();
  const [stats, setStats] = useState({
    contacts: 0,
    leads: 0,
    opportunities: 0,
    totalValue: 0,
  });
  const [recentContacts, setRecentContacts] = useState<Contact[]>([]);
  const [recentLeads, setRecentLeads] = useState<Lead[]>([]);
  const [recentOpportunities, setRecentOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [contacts, leads, opportunities] = await Promise.all([
        crmApi.getContacts(),
        crmApi.getLeads(),
        crmApi.getOpportunities(),
      ]);
      
      const totalValue = opportunities.reduce((sum, opp) => sum + (opp.amount || 0), 0);
      
      setStats({
        contacts: contacts.length,
        leads: leads.length,
        opportunities: opportunities.length,
        totalValue,
      });
      
      // Get recent items (last 5)
      setRecentContacts(contacts.slice(-5).reverse());
      setRecentLeads(leads.slice(-5).reverse());
      setRecentOpportunities(opportunities.slice(-5).reverse());
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
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

  if (loading) {
    return (
      <Container fluid className="p-4">
        <div className="text-center">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
          <p className="mt-2">Loading dashboard...</p>
        </div>
      </Container>
    );
  }

  return (
    <Container fluid className="p-4">
      {/* Welcome Section */}
      <Row className="mb-4">
        <Col>
          <h1 className="h2 mb-2">Dashboard</h1>
          <p className="text-muted">Welcome back, {user?.full_name}!</p>
        </Col>
      </Row>

      {/* Stats Grid */}
      <Row className="mb-4">
        <Col md={3} className="mb-3">
          <StatCard
            title="Total Contacts"
            value={stats.contacts}
            color="blue"
            href="/contacts"
            icon="bi-people"
          />
        </Col>
        
        <Col md={3} className="mb-3">
          <StatCard
            title="Total Leads"
            value={stats.leads}
            color="green"
            href="/leads"
            icon="bi-graph-up-arrow"
          />
        </Col>
        
        <Col md={3} className="mb-3">
          <StatCard
            title="Total Opportunities"
            value={stats.opportunities}
            color="purple"
            href="/opportunities"
            icon="bi-briefcase"
          />
        </Col>

        <Col md={3} className="mb-3">
          <Card className="h-100 shadow-sm border-warning">
            <Card.Body>
              <div className="d-flex align-items-center">
                <div className="bg-warning bg-opacity-10 p-3 rounded me-3">
                  <i className="bi bi-currency-dollar text-warning fs-4"></i>
                </div>
                <div>
                  <h3 className="mb-0">{formatCurrency(stats.totalValue)}</h3>
                  <p className="text-muted mb-0">Pipeline Value</p>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        {/* Recent Contacts */}
        <Col lg={4} className="mb-4">
          <Card className="shadow-sm h-100">
            <Card.Header className="bg-white">
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Recent Contacts</h5>
                <Link href="/contacts">
                  <Button variant="outline-primary" size="sm">
                    View All
                  </Button>
                </Link>
              </div>
            </Card.Header>
            <Card.Body>
              {recentContacts.length === 0 ? (
                <div className="text-center py-3 text-muted">
                  No contacts yet
                </div>
              ) : (
                <div className="list-group list-group-flush">
                  {recentContacts.map((contact) => (
                    <div key={contact.id} className="list-group-item px-0 py-2">
                      <div className="d-flex align-items-center">
                        <div className="flex-shrink-0">
                          <div 
                            className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center"
                            style={{ width: '36px', height: '36px', fontSize: '12px' }}
                          >
                            {contact.first_name[0]}{contact.last_name[0]}
                          </div>
                        </div>
                        <div className="flex-grow-1 ms-3">
                          <h6 className="mb-0">{contact.first_name} {contact.last_name}</h6>
                          <small className="text-muted">{contact.company || 'No company'}</small>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>

        {/* Recent Leads */}
        <Col lg={4} className="mb-4">
          <Card className="shadow-sm h-100">
            <Card.Header className="bg-white">
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Recent Leads</h5>
                <Link href="/leads">
                  <Button variant="outline-success" size="sm">
                    View All
                  </Button>
                </Link>
              </div>
            </Card.Header>
            <Card.Body>
              {recentLeads.length === 0 ? (
                <div className="text-center py-3 text-muted">
                  No leads yet
                </div>
              ) : (
                <div className="list-group list-group-flush">
                  {recentLeads.map((lead) => (
                    <div key={lead.id} className="list-group-item px-0 py-2">
                      <h6 className="mb-1">{lead.title}</h6>
                      <div className="d-flex justify-content-between align-items-center">
                        <Badge bg={
                          lead.status === 'new' ? 'primary' :
                          lead.status === 'contacted' ? 'info' :
                          lead.status === 'qualified' ? 'success' : 'secondary'
                        }>
                          {lead.status}
                        </Badge>
                        <small className="text-muted">
                          {new Date(lead.created_at).toLocaleDateString()}
                        </small>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>

        {/* Recent Opportunities */}
        <Col lg={4} className="mb-4">
          <Card className="shadow-sm h-100">
            <Card.Header className="bg-white">
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Recent Opportunities</h5>
                <Link href="/opportunities">
                  <Button variant="outline-warning" size="sm">
                    View All
                  </Button>
                </Link>
              </div>
            </Card.Header>
            <Card.Body>
              {recentOpportunities.length === 0 ? (
                <div className="text-center py-3 text-muted">
                  No opportunities yet
                </div>
              ) : (
                <div className="list-group list-group-flush">
                  {recentOpportunities.map((opportunity) => (
                    <div key={opportunity.id} className="list-group-item px-0 py-2">
                      <h6 className="mb-1">{opportunity.name}</h6>
                      <div className="d-flex justify-content-between align-items-center mb-1">
                        <Badge bg={getStageVariant(opportunity.stage)}>
                          {opportunity.stage.replace('_', ' ')}
                        </Badge>
                        {opportunity.amount && (
                          <span className="fw-semibold">
                            {formatCurrency(opportunity.amount)}
                          </span>
                        )}
                      </div>
                      <div className="progress" style={{ height: '4px' }}>
                        <div 
                          className={`progress-bar ${
                            opportunity.probability >= 70 ? 'bg-success' : 
                            opportunity.probability >= 40 ? 'bg-warning' : 'bg-secondary'
                          }`}
                          style={{ width: `${opportunity.probability}%` }}
                        ></div>
                      </div>
                      <small className="text-muted">{opportunity.probability}% probability</small>
                    </div>
                  ))}
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Quick Actions */}
      <Row>
        <Col>
          <Card className="shadow-sm">
            <Card.Header className="bg-white">
              <h5 className="mb-0">Quick Actions</h5>
            </Card.Header>
            <Card.Body>
              <div className="row g-3">
                <div className="col-md-4">
                  <Link href="/contacts/create">
                    <div className="p-3 border border-gray-200 rounded-lg hover-border-blue hover-bg-blue-50 cursor-pointer transition-colors text-center">
                      <i className="bi bi-person-plus fs-2 text-primary mb-2 d-block"></i>
                      <h6 className="fw-semibold">Add Contact</h6>
                      <p className="text-muted small mb-0">Create a new contact</p>
                    </div>
                  </Link>
                </div>
                <div className="col-md-4">
                  <Link href="/leads/create">
                    <div className="p-3 border border-gray-200 rounded-lg hover-border-green hover-bg-green-50 cursor-pointer transition-colors text-center">
                      <i className="bi bi-plus-circle fs-2 text-success mb-2 d-block"></i>
                      <h6 className="fw-semibold">Add Lead</h6>
                      <p className="text-muted small mb-0">Create a new lead</p>
                    </div>
                  </Link>
                </div>
                <div className="col-md-4">
                  <Link href="/opportunities/create">
                    <div className="p-3 border border-gray-200 rounded-lg hover-border-warning hover-bg-warning-50 cursor-pointer transition-colors text-center">
                      <i className="bi bi-briefcase fs-2 text-warning mb-2 d-block"></i>
                      <h6 className="fw-semibold">Add Opportunity</h6>
                      <p className="text-muted small mb-0">Create a new opportunity</p>
                    </div>
                  </Link>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

// Update StatCard to include icon
interface StatCardProps {
  title: string;
  value: number;
  color: 'blue' | 'green' | 'purple';
  href: string;
  icon: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, color, href, icon }) => {
  const colorClasses = {
    blue: { bg: 'bg-primary', text: 'text-primary', border: 'border-primary' },
    green: { bg: 'bg-success', text: 'text-success', border: 'border-success' },
    purple: { bg: 'bg-purple', text: 'text-warning', border: 'border-blue' },
  };

  const colors = colorClasses[color];

  return (
    <Link href={href} className="text-decoration-none">
      <Card className={`h-100 shadow-sm ${colors.border}`}>
        <Card.Body>
          <div className="d-flex align-items-center">
            <div className={`${colors.bg} bg-opacity-10 p-3 rounded me-3`}>
              <i className={`${icon} ${colors.text} fs-4`}></i>
            </div>
            <div>
              <h3 className="mb-0">{value}</h3>
              <p className="text-muted mb-0">{title}</p>
            </div>
          </div>
        </Card.Body>
      </Card>
    </Link>
  );
};