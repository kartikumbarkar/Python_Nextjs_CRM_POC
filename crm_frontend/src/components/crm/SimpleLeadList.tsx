'use client';

import { Card, Alert } from 'react-bootstrap';

export default function SimpleLeadList() {
  return (
    <Card>
      <Card.Header>
        <h5 className="mb-0">Simple Leads - Testing</h5>
      </Card.Header>
      <Card.Body>
        <Alert variant="success">
          ✅ Simple Leads component is working!
        </Alert>
        <p>This means the component structure is correct.</p>
      </Card.Body>
    </Card>
  );
}