import LeadList from '../../src/components/crm/LeadList';
import { Container, Row, Col } from 'react-bootstrap';

export default function LeadsPage() {
  return (
    <Container fluid className="p-4">
      <Row>
        <Col>
          <div className="mb-4">
            <h1 className="h2 mb-2">Leads</h1>
            <p className="text-muted">Manage your sales leads and track their progress</p>
          </div>
          <LeadList />
        </Col>
      </Row>
    </Container>
  );
}