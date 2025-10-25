'use client';

import { useAuth } from '../../contexts/auth-context';
import { Navbar, Nav, Container, Dropdown, Badge } from 'react-bootstrap';

export const Header: React.FC = () => {
  const { user, logout, isAdmin } = useAuth();

  return (
    <Navbar bg="white" expand="lg" className="border-bottom shadow-sm">
      <Container fluid>
        <Navbar.Brand href="#" className="d-md-none">
          CRM System
        </Navbar.Brand>
        
        <Nav className="ms-auto">
          <Dropdown align="end">
            <Dropdown.Toggle 
              variant="outline-secondary" 
              id="dropdown-basic"
              className="d-flex align-items-center"
            >
              <div 
                className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-2"
                style={{ width: '32px', height: '32px', fontSize: '14px' }}
              >
                {user?.full_name?.charAt(0) || 'U'}
              </div>
              <div className="text-start">
                <div className="fw-semibold">{user?.full_name || 'User'}</div>
                <div className="small text-muted">
                  {user?.email}
                  {isAdmin && (
                    <Badge bg="warning" className="ms-1" style={{ fontSize: '0.6rem' }}>
                      Admin
                    </Badge>
                  )}
                </div>
              </div>
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item href="#">
                <i className="bi bi-person me-2"></i>
                Profile
              </Dropdown.Item>
              <Dropdown.Item href="#">
                <i className="bi bi-gear me-2"></i>
                Settings
              </Dropdown.Item>
              {isAdmin && (
                <>
                  <Dropdown.Divider />
                  <Dropdown.Item href="/admin">
                    <i className="bi bi-shield-check me-2"></i>
                    Admin Dashboard
                  </Dropdown.Item>
                </>
              )}
              <Dropdown.Divider />
              <Dropdown.Item onClick={logout}>
                <i className="bi bi-box-arrow-right me-2"></i>
                Logout
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Nav>
      </Container>
    </Navbar>
  );
};