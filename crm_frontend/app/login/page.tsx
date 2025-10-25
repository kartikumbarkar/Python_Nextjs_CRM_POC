'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../src/contexts/auth-context';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await login(email, password);
      
      // Wait for state to update properly
      setTimeout(() => {
        // Direct check of localStorage for immediate redirect
        const userData = localStorage.getItem('userData');
        console.log('Login redirect - userData from localStorage:', userData);
        
        if (userData) {
          try {
            const user = JSON.parse(userData);
            console.log('Login redirect - parsed user is_superuser:', user.is_superuser);
            
            if (user.is_superuser === true) {
              console.log('Redirecting to admin dashboard');
              router.push('/admin');
            } else {
              console.log('Redirecting to regular dashboard');
              router.push('/dashboard');
            }
          } catch (err) {
            console.error('Error parsing user data for redirect:', err);
            router.push('/dashboard');
          }
        } else {
          console.log('No user data found, redirecting to dashboard');
          router.push('/dashboard');
        }
      }, 200); // Increased delay to ensure state update
      
    } catch (err: any) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container fluid className="p-4">
      <Row className="justify-content-center">
        <Col md={6} lg={4}>
          <Card className="shadow">
            <Card.Header className="bg-primary text-white text-center">
              <h4 className="mb-0">CRM System Login</h4>
            </Card.Header>
            <Card.Body className="p-4">
              {error && (
                <Alert variant="danger">
                  <i className="bi bi-exclamation-triangle me-2"></i>
                  {error}
                </Alert>
              )}
              
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Email Address</Form.Label>
                  <Form.Control
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="Enter your email"
                  />
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="Enter your password"
                  />
                </Form.Group>

                <Button
                  type="submit"
                  variant="primary"
                  disabled={loading}
                  className="w-100 py-2"
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                      Signing in...
                    </>
                  ) : (
                    'Sign In'
                  )}
                </Button>
              </Form>

              <div className="text-center mt-3">
                <small className="text-muted">
                  Use admin@example.com for admin access
                </small>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}