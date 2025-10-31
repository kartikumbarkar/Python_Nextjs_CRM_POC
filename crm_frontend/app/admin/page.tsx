'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../src/contexts/auth-context';
import { useRouter } from 'next/navigation';
import { Container, Row, Col, Card, Button, Spinner, Alert, Table, Form, Modal } from 'react-bootstrap';
import { adminApi, Tenant, User } from '@/lib/api';

export default function AdminDashboard() {
  const { user, isAdmin, token, isLoading, logout } = useAuth();
  const router = useRouter();

  const [debugInfo, setDebugInfo] = useState('');
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loadingTenants, setLoadingTenants] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(false);

  // Modal states
  const [showAddTenant, setShowAddTenant] = useState(false);
  const [newTenantName, setNewTenantName] = useState('');

  const [showAddUser, setShowAddUser] = useState(false);
  const [newUser, setNewUser] = useState({
    email: '',
    password: '',
    full_name: '',
    tenant_id: '',
    is_superuser: false,
  });

  const [editUser, setEditUser] = useState<User | null>(null);

  // Debug Info
  useEffect(() => {
    const storedUser = localStorage.getItem('userData');
    const storedToken = localStorage.getItem('accessToken');
    const debug = `
      isAdmin: ${isAdmin}
      user: ${JSON.stringify(user)}
      token: ${token ? 'Present' : 'Missing'}
      localStorage: user=${storedUser ? 'Present' : 'Missing'}, token=${storedToken ? 'Present' : 'Missing'}
    `;
    setDebugInfo(debug);
  }, [isAdmin, user, token]);

  // Redirect unauthorized
  useEffect(() => {
    if (!isLoading) {
      if (!token || !user) router.replace('/login');
      else if (!isAdmin) router.replace('/403');
    }
  }, [isLoading, isAdmin, token, user, router]);

  if (isLoading) {
    return (
      <Container fluid className="p-4 text-center">
        <Spinner animation="border" />
        <p>Loading admin dashboard...</p>
      </Container>
    );
  }

  if (!token || !isAdmin) return null;

  /* ---------------------- FETCH FUNCTIONS ---------------------- */

  const handleFetchTenants = async () => {
    try {
      setLoadingTenants(true);
      const data = await adminApi.getTenants();
      setTenants(data);
    } catch (error) {
      console.error('Error loading tenants:', error);
      alert('Failed to load tenants');
    } finally {
      setLoadingTenants(false);
    }
  };

  const handleFetchUsers = async () => {
    try {
      setLoadingUsers(true);
      const data = await adminApi.getUsers();
      setUsers(data);
    } catch (error) {
      console.error('Error loading users:', error);
      alert('Failed to load users');
    } finally {
      setLoadingUsers(false);
    }
  };

  /* ---------------------- TENANT CRUD ---------------------- */

  const handleAddTenant = async () => {
    if (!newTenantName.trim()) return alert('Tenant name required');
    try {
      const newTenant = await adminApi.createTenant({ name: newTenantName });
      setTenants([...tenants, newTenant]);
      setNewTenantName('');
      setShowAddTenant(false);
    } catch (error) {
      console.error('Error adding tenant:', error);
      alert('Failed to create tenant');
    }
  };

  const handleDeleteTenant = async (id: number) => {
    if (!confirm('Are you sure you want to delete this tenant?')) return;
    try {
      await adminApi.deleteTenant(id);
      setTenants(tenants.filter((t) => t.id !== id));
    } catch (error) {
      console.error('Error deleting tenant:', error);
      alert('Failed to delete tenant');
    }
  };

  /* ---------------------- USER CRUD ---------------------- */

  const handleAddUser = async () => {
    if (!newUser.email || !newUser.password || !newUser.full_name) {
      return alert('All fields are required');
    }

    try {
      const created = await adminApi.createUser({
        email: newUser.email,
        password: newUser.password,
        full_name: newUser.full_name,
        tenant_id: parseInt(newUser.tenant_id),
        is_superuser: newUser.is_superuser,
      });
      setUsers([...users, created]);
      setShowAddUser(false);
      setNewUser({ email: '', password: '', full_name: '', tenant_id: '', is_superuser: false });
    } catch (error) {
      console.error('Error creating user:', error);
      alert('Failed to create user');
    }
  };

  const handleDeleteUser = async (id: number) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    try {
      await adminApi.deleteUser(id);
      setUsers(users.filter((u) => u.id !== id));
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Failed to delete user');
    }
  };

  const handleUpdateUser = async () => {
    if (!editUser) return;
    try {
      const updated = await adminApi.updateUser(editUser.id, editUser);
      setUsers(users.map((u) => (u.id === updated.id ? updated : u)));
      setEditUser(null);
    } catch (error) {
      console.error('Error updating user:', error);
      alert('Failed to update user');
    }
  };

  /* ---------------------- RENDER ---------------------- */

  return (
    <Container fluid className="p-4">
      <Row className="mb-4">
        <Col className="d-flex justify-content-between align-items-center">
          <div>
            <h1 className="h2 mb-2">
              <i className="bi bi-speedometer2 me-2"></i> Admin Dashboard
            </h1>
            <p className="text-muted">Welcome, {user?.email || 'System Administrator'}!</p>
          </div>
          <Button variant="outline-danger" onClick={logout}>
            <i className="bi bi-box-arrow-right me-2"></i> Logout
          </Button>
        </Col>
      </Row>

      <Alert variant="info">
        <pre className="mb-0" style={{ fontSize: '0.8rem' }}>{debugInfo}</pre>
      </Alert>

      <Card className="mb-4">
        <Card.Header><h5>Admin Functions</h5></Card.Header>
        <Card.Body>
          <div className="d-grid gap-2 d-md-flex">
            <Button variant="primary" onClick={handleFetchTenants} disabled={loadingTenants}>
              {loadingTenants ? 'Loading...' : 'Manage Tenants'}
            </Button>
            <Button variant="success" onClick={handleFetchUsers} disabled={loadingUsers}>
              {loadingUsers ? 'Loading...' : 'Manage Users'}
            </Button>
            <Button variant="warning" disabled>System Settings (coming soon)</Button>
          </div>
        </Card.Body>
      </Card>

      {/* TENANTS TABLE */}
      {tenants.length > 0 && (
        <Card className="mb-4">
          <Card.Header className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0">Tenants</h5>
            <Button variant="outline-primary" size="sm" onClick={() => setShowAddTenant(true)}>
              <i className="bi bi-plus-circle me-1"></i> Add Tenant
            </Button>
          </Card.Header>
          <Card.Body>
            <Table bordered hover responsive>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Schema</th>
                  <th>Active</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {tenants.map((t) => (
                  <tr key={t.id}>
                    <td>{t.id}</td>
                    <td>{t.name}</td>
                    <td>{t.schema_name}</td>
                    <td>{t.is_active ? '✅' : '❌'}</td>
                    <td>{new Date(t.created_at).toLocaleString()}</td>
                    <td>
                      <Button variant="outline-danger" size="sm" onClick={() => handleDeleteTenant(t.id)}>
                        <i className="bi bi-trash"></i>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      )}

      {/* USERS TABLE */}
      {users.length > 0 && (
        <Card>
          <Card.Header className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0">Users</h5>
            <Button variant="outline-success" size="sm" onClick={() => setShowAddUser(true)}>
              <i className="bi bi-plus-circle me-1"></i> Add User
            </Button>
          </Card.Header>
          <Card.Body>
            <Table bordered hover responsive>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Email</th>
                  <th>Full Name</th>
                  <th>Tenant</th>
                  <th>Superuser</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id}>
                    <td>{u.id}</td>
                    <td>{u.email}</td>
                    <td>{u.full_name}</td>
                    <td>{u.tenant_id ?? '—'}</td>
                    <td>{u.is_superuser ? '✅' : '❌'}</td>
                    <td>{new Date(u.created_at).toLocaleString()}</td>
                    <td>
                      <Button
                        variant="outline-primary"
                        size="sm"
                        className="me-2"
                        onClick={() => setEditUser(u)}
                      >
                        <i className="bi bi-pencil"></i>
                      </Button>
                      <Button variant="outline-danger" size="sm" onClick={() => handleDeleteUser(u.id)}>
                        <i className="bi bi-trash"></i>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      )}

      {/* ADD TENANT MODAL */}
      <Modal show={showAddTenant} onHide={() => setShowAddTenant(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Add New Tenant</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Tenant Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter tenant name"
              value={newTenantName}
              onChange={(e) => setNewTenantName(e.target.value)}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddTenant(false)}>Cancel</Button>
          <Button variant="primary" onClick={handleAddTenant}>Add Tenant</Button>
        </Modal.Footer>
      </Modal>

      {/* ADD USER MODAL */}
      <Modal show={showAddUser} onHide={() => setShowAddUser(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Add New User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-2">
            <Form.Label>Email</Form.Label>
            <Form.Control type="email" value={newUser.email} onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" value={newUser.password} onChange={(e) => setNewUser({ ...newUser, password: e.target.value })} />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Full Name</Form.Label>
            <Form.Control value={newUser.full_name} onChange={(e) => setNewUser({ ...newUser, full_name: e.target.value })} />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Tenant ID</Form.Label>
            <Form.Control value={newUser.tenant_id} onChange={(e) => setNewUser({ ...newUser, tenant_id: e.target.value })} />
          </Form.Group>
          <Form.Check
            label="Superuser"
            checked={newUser.is_superuser}
            onChange={(e) => setNewUser({ ...newUser, is_superuser: e.target.checked })}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddUser(false)}>Cancel</Button>
          <Button variant="primary" onClick={handleAddUser}>Add User</Button>
        </Modal.Footer>
      </Modal>

      {/* EDIT USER MODAL */}
      <Modal show={!!editUser} onHide={() => setEditUser(null)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {editUser && (
            <>
              <Form.Group className="mb-2">
                <Form.Label>Full Name</Form.Label>
                <Form.Control
                  value={editUser.full_name}
                  onChange={(e) => setEditUser({ ...editUser, full_name: e.target.value })}
                />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Tenant ID</Form.Label>
                <Form.Control
                  value={editUser.tenant_id ?? ''}
                  onChange={(e) => setEditUser({ ...editUser, tenant_id: Number(e.target.value) })}
                />
              </Form.Group>
              <Form.Check
                label="Superuser"
                checked={editUser.is_superuser}
                onChange={(e) => setEditUser({ ...editUser, is_superuser: e.target.checked })}
              />
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setEditUser(null)}>Cancel</Button>
          <Button variant="primary" onClick={handleUpdateUser}>Save Changes</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}
