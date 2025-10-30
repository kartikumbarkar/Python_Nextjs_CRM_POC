'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../src/contexts/auth-context';
import { useRouter } from 'next/navigation';
import { Container, Row, Col, Card, Button, Spinner, Alert } from 'react-bootstrap';

export default function AdminDashboard() {
  const { user, isAdmin, token, isLoading } = useAuth();
  const router = useRouter();
  const [debugInfo, setDebugInfo] = useState('');

  // Debug: Check what's happening
  useEffect(() => {
    const userData = localStorage.getItem('userData');
    const debug = `
      Auth Context:
      - isLoading: ${isLoading}
      - isAdmin: ${isAdmin}
      - user: ${JSON.stringify(user)}
      - token: ${token ? 'Present' : 'Missing'}
      
      Local Storage:
      - userData: ${userData}
    `;
    setDebugInfo(debug);
    console.log('Admin Dashboard Debug:', debug);
  }, [isLoading, isAdmin, user, token]);

  // Redirect if not admin
  useEffect(() => {
    if (!isLoading && !isAdmin) {
      console.log('Redirecting to dashboard - user is not admin');
      router.replace('/login');
    }
  }, [isAdmin, isLoading, router]);

  if (isLoading) {
    return (
      <Container fluid className="p-4">
        <div className="text-center">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
          <p className="mt-2">Loading admin dashboard...</p>
        </div>
      </Container>
    );
  }

  if (!isAdmin) {
    return (
      <Container fluid className="p-4">
        <Alert variant="warning">
          <i className="bi bi-shield-exclamation me-2"></i>
          You don't have permission to access the admin dashboard.
          <div className="mt-2">
            <small className="text-muted">
              Debug: {debugInfo}
            </small>
          </div>
        </Alert>
      </Container>
    );
  }

  return (
    <Container fluid className="p-4">
      {/* Header */}
      <Row className="mb-4">
        <Col>
          <h1 className="h2 mb-2">
            <i className="bi bi-speedometer2 me-2"></i>
            Admin Dashboard
          </h1>
          <p className="text-muted">Welcome, System Administrator!</p>
          
          {/* Debug Info */}
          <Alert variant="info" className="mt-3">
            <h6>Debug Information:</h6>
            <pre className="mb-0" style={{ fontSize: '0.8rem' }}>
              {debugInfo}
            </pre>
          </Alert>
        </Col>
      </Row>

      {/* Admin Content */}
      <Row>
        <Col>
          <Card>
            <Card.Header>
              <h5 className="mb-0">Admin Functions</h5>
            </Card.Header>
            <Card.Body>
              <p>Admin dashboard content will go here.</p>
              <div className="d-grid gap-2 d-md-flex">
                <Button variant="primary">
                  <i className="bi bi-building me-2"></i>
                  Manage Tenants
                </Button>
                <Button variant="success">
                  <i className="bi bi-people me-2"></i>
                  Manage Users
                </Button>
                <Button variant="warning">
                  <i className="bi bi-gear me-2"></i>
                  System Settings
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}