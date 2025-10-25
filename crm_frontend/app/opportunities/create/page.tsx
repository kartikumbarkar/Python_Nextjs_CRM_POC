'use client';

import { useRouter } from 'next/navigation';
import { Container, Row, Col, Breadcrumb } from 'react-bootstrap';
import { OpportunityForm } from '../../../src/components/crm/OpportunityForm';
import { crmApi } from '../../../src/lib/api';
import Link from 'next/link';

export default function CreateOpportunityPage() {
  const router = useRouter();

  const handleSubmit = async (opportunityData: any) => {
    await crmApi.createOpportunity(opportunityData);
    router.push('/opportunities');
  };

  const handleCancel = () => {
    router.push('/opportunities');
  };

  return (
    <Container fluid className="p-4">
      <Row className="mb-4">
        <Col>
          <Breadcrumb>
            <Breadcrumb.Item linkAs={Link} href="/dashboard">Dashboard</Breadcrumb.Item>
            <Breadcrumb.Item linkAs={Link} href="/opportunities">Opportunities</Breadcrumb.Item>
            <Breadcrumb.Item active>Create Opportunity</Breadcrumb.Item>
          </Breadcrumb>
          
          <h1 className="h2 mb-2">Create New Opportunity</h1>
          <p className="text-muted">Add a new sales opportunity to track</p>
        </Col>
      </Row>

      <Row>
        <Col lg={8} xl={6}>
          <OpportunityForm onSubmit={handleSubmit} onCancel={handleCancel} />
        </Col>
      </Row>
    </Container>
  );
}