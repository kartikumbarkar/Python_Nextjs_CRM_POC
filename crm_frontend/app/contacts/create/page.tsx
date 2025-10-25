'use client';

import { useRouter } from 'next/navigation';
import { Container, Row, Col, Breadcrumb } from 'react-bootstrap';
import { ContactForm } from '../../../src/components/crm/ContactForm';
import { crmApi } from '../../../src/lib/api';
import Link from 'next/link';

export default function CreateContactPage() {
  const router = useRouter();

  const handleSubmit = async (contactData: any) => {
    await crmApi.createContact(contactData);
    router.push('/contacts');
  };

  const handleCancel = () => {
    router.push('/contacts');
  };

  return (
    <Container fluid className="p-4">
      {/* Breadcrumb */}
      <Row className="mb-4">
        <Col>
          <Breadcrumb>
            <Breadcrumb.Item linkAs={Link} href="/dashboard">Dashboard</Breadcrumb.Item>
            <Breadcrumb.Item linkAs={Link} href="/contacts">Contacts</Breadcrumb.Item>
            <Breadcrumb.Item active>Create Contact</Breadcrumb.Item>
          </Breadcrumb>
          
          <h1 className="h2 mb-2">Create New Contact</h1>
          <p className="text-muted">Add a new contact to your CRM system</p>
        </Col>
      </Row>

      <Row>
        <Col lg={8} xl={6}>
          <ContactForm onSubmit={handleSubmit} onCancel={handleCancel} />
        </Col>
      </Row>
    </Container>
  );
}