'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Nav } from 'react-bootstrap';
import { useAuth } from '../../contexts/auth-context';

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const { isAdmin } = useAuth();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: 'bi-speedometer2' },
    { name: 'Contacts', href: '/contacts', icon: 'bi-people' },
    { name: 'Leads', href: '/leads', icon: 'bi-graph-up-arrow' },
    { name: 'Opportunities', href: '/opportunities', icon: 'bi-briefcase' },
  ];

  // Add admin link if user is admin
  if (isAdmin) {
    navigation.push({ name: 'Admin', href: '/admin', icon: 'bi-shield-check' });
  }

  return (
    <div className="sidebar bg-dark text-white position-fixed" style={{ width: '250px', zIndex: 1000 }}>
      <div className="p-3 border-bottom border-dark">
        <h4 className="text-white mb-0">
          <i className="bi bi-gear me-2"></i>
          CRM System
        </h4>
      </div>
      
      <Nav className="flex-column p-3">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Nav.Item key={item.name}>
              <Link href={item.href} passHref legacyBehavior>
                <Nav.Link 
                  className={`text-white mb-2 rounded ${isActive ? 'bg-primary' : 'hover-bg-gray-700'}`}
                  style={{ 
                    backgroundColor: isActive ? '#0d6efd' : 'transparent',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) e.currentTarget.style.backgroundColor = '#374151';
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <i className={`${item.icon} me-2`}></i>
                  {item.name}
                  {item.name === 'Admin' && (
                    <span className="badge bg-warning ms-2">Admin</span>
                  )}
                </Nav.Link>
              </Link>
            </Nav.Item>
          );
        })}
      </Nav>
    </div>
  );
};