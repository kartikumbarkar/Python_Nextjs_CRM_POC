'use client';

import { useAuth } from '../contexts/auth-context';

export default function DebugAuth() {
  const { user, isAdmin, isLoading, isAuthenticated } = useAuth();
  
  return (
    <div style={{ position: 'fixed', top: 10, right: 10, background: 'rgba(0,0,0,0.8)', color: 'white', padding: '10px', borderRadius: '5px', fontSize: '12px', zIndex: 1000 }}>
      <div><strong>Auth Debug</strong></div>
      <div>Loading: {isLoading ? 'Yes' : 'No'}</div>
      <div>Authenticated: {isAuthenticated ? 'Yes' : 'No'}</div>
      <div>Admin: {isAdmin ? 'Yes' : 'No'}</div>
      <div>User: {user ? user.email : 'None'}</div>
      <div>is_superuser: {user?.is_superuser?.toString() || 'undefined'}</div>
    </div>
  );
}