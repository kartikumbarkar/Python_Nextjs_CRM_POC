'use client';

import { useRouter } from 'next/navigation';
import { Container, Row, Col, Breadcrumb } from 'react-bootstrap';
import { LeadForm } from '../../../src/components/crm/LeadForm';
import { crmApi } from '../../../src/lib/api';
import Link from 'next/link';

export default function CreateLeadPage() {
  const router = useRouter();

  const handleSubmit = async (leadData: any) => {
    await crmApi.createLead(leadData);
    router.push('/leads');
  };

  const handleCancel = () => {
    router.push('/leads');
  };

  return (
    <Container fluid className="p-4">
      <Row className="mb-4">
        <Col>
          <Breadcrumb>
            <Breadcrumb.Item linkAs={Link} href="/dashboard">Dashboard</Breadcrumb.Item>
            <Breadcrumb.Item linkAs={Link} href="/leads">Leads</Breadcrumb.Item>
            <Breadcrumb.Item active>Create Lead</Breadcrumb.Item>
          </Breadcrumb>
          
          <h1 className="h2 mb-2">Create New Lead</h1>
          <p className="text-muted">Add a new sales lead to track</p>
        </Col>
      </Row>

      <Row>
        <Col lg={8} xl={6}>
          <LeadForm onSubmit={handleSubmit} onCancel={handleCancel} />
        </Col>
      </Row>
    </Container>
  );
}