'use client';

import { useState } from 'react';
import OpportunityList from '../../src/components/crm/OpportunityList';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Sidebar } from '../../src/components/layout/sidebar';

export default function OpportunitiesPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <Container fluid className="p-0">
      <Row className="g-0">
        {/* Sidebar */}
        {sidebarOpen && (
          <Col
            md={2}
            lg={2}
            className="bg-light border-end vh-100 position-sticky d-none d-md-block"
            style={{ top: 0 }}
          >
            <Sidebar />
          </Col>
        )}

        {/* Main Content */}
        <Col className="p-4" md={sidebarOpen ? 10 : 12} lg={sidebarOpen ? 10 : 12}>
          {/* Header + Toggle Button */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h1 className="h2 mb-2">Opportunities</h1>
              <p className="text-muted mb-0">
                Manage your sales opportunities and track their progress
              </p>
            </div>

            <Button
              variant="outline-secondary"
              size="sm"
              className="d-md-none d-block"
              onClick={toggleSidebar}
            >
              <i className={`bi ${sidebarOpen ? 'bi-x-lg' : 'bi-list'}`}></i>
            </Button>
          </div>

          <OpportunityList />
        </Col>
      </Row>
    </Container>
  );
}
