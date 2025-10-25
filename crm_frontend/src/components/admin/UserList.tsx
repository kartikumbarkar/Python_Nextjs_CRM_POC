'use client';

import { useState, useEffect } from 'react';
import { User, Tenant } from '@/lib/api';
import { adminApi } from '@/lib/api';
import { Card, Table, Button, Badge, Spinner, Alert, Modal, Form, Row, Col } from 'react-bootstrap';

export default function UserList() {
  const [users, setUsers] = useState<User[]>([]);
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    full_name: '',
    tenant_id: '',
    is_superuser: false
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [usersData, tenantsData] = await Promise.all([
        adminApi.getUsers(),
        adminApi.getTenants()
      ]);
      setUsers(usersData);
      setTenants(tenantsData);
    } catch (err: any) {
      setError('Failed to load data');
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const newUser = await adminApi.createUser({
        ...formData,
        tenant_id: parseInt(formData.tenant_id)
      });
      setUsers([...users, newUser]);
      setFormData({
        email: '',
        password: '',
        full_name: '',
        tenant_id: '',
        is_superuser: false
      });
      setShowModal(false);
    } catch (err: any) {
      setError('Failed to create user');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteUser = async (id: number) => {
    if (confirm('Are you sure you want to delete this user?')) {
      try {
        await adminApi.deleteUser(id);
        setUsers(users.filter(user => user.id !== id));
      } catch (err: any) {
        setError('Failed to delete user');
      }
    }
  };

  const toggleUserStatus = async (user: User) => {
    try {
      const updatedUser = await adminApi.updateUser(user.id, { 
        is_active: !user.is_active 
      });
      setUsers(users.map(u => u.id === user.id ? updatedUser : u));
    } catch (err: any) {
      setError('Failed to update user');
    }
  };

  const getTenantName = (tenantId: number | null | undefined) => {
    if (tenantId == null) return 'Unknown';
    const tenant = tenants.find(t => t.id === tenantId);
    return tenant ? tenant.name : 'Unknown';
  };

  if (loading) {
    return (
      <Card>
        <Card.Body className="text-center">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
          <p className="mt-2 mb-0">Loading users...</p>
        </Card.Body>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <Card.Header className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0">
            <i className="bi bi-people me-2"></i>
            Users
          </h5>
          <Button variant="success" size="sm" onClick={() => setShowModal(true)}>
            <i className="bi bi-person-plus me-1"></i>
            Add User
          </Button>
        </Card.Header>
        <Card.Body>
          {error && (
            <Alert variant="danger" dismissible onClose={() => setError('')}>
              <i className="bi bi-exclamation-triangle me-2"></i>
              {error}
            </Alert>
          )}

          {users.length === 0 ? (
            <div className="text-center py-4">
              <i className="bi bi-people fs-1 text-muted mb-3 d-block"></i>
              <p className="text-muted mb-3">No users found.</p>
              <Button variant="success" onClick={() => setShowModal(true)}>
                Create Your First User
              </Button>
            </div>
          ) : (
            <Table responsive hover>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Tenant</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td className="fw-semibold">{user.full_name}</td>
                    <td>{user.email}</td>
                    <td>
                      <Badge bg={user.is_superuser ? 'warning' : 'primary'}>
                        {user.is_superuser ? 'Admin' : 'User'}
                      </Badge>
                    </td>
                    <td>{getTenantName(user.tenant_id)}</td>
                    <td>
                      <Badge bg={user.is_active ? 'success' : 'secondary'}>
                        {user.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </td>
                    <td>
                      <div className="d-flex gap-2">
                        <Button 
                          variant={user.is_active ? 'warning' : 'success'} 
                          size="sm"
                          onClick={() => toggleUserStatus(user)}
                        >
                          <i className={`bi bi-${user.is_active ? 'pause' : 'play'}`}></i>
                        </Button>
                        <Button 
                          variant="outline-danger" 
                          size="sm"
                          onClick={() => handleDeleteUser(user.id)}
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

      {/* Create User Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Create New User</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleCreateUser}>
          <Modal.Body>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Full Name *</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    required
                    placeholder="Enter full name"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Email *</Form.Label>
                  <Form.Control
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    placeholder="Enter email address"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Password *</Form.Label>
                  <Form.Control
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                    placeholder="Enter password"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Tenant *</Form.Label>
                  <Form.Select
                    value={formData.tenant_id}
                    onChange={(e) => setFormData({ ...formData, tenant_id: e.target.value })}
                    required
                  >
                    <option value="">Select a tenant</option>
                    {tenants.map((tenant) => (
                      <option key={tenant.id} value={tenant.id}>
                        {tenant.name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                label="Admin User (Superuser)"
                checked={formData.is_superuser}
                onChange={(e) => setFormData({ ...formData, is_superuser: e.target.checked })}
              />
              <Form.Text className="text-muted">
                Admin users have access to the admin dashboard and can manage all tenants.
              </Form.Text>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={submitting}>
              {submitting ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                  Creating...
                </>
              ) : (
                'Create User'
              )}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
}