import OpportunityList from '../../src/components/crm/OpportunityList';
import { Container, Row, Col } from 'react-bootstrap';

export default function OpportunitiesPage() {
  return (
    <Container fluid className="p-4">
      <Row>
        <Col>
          <div className="mb-4">
            <h1 className="h2 mb-2">Opportunities</h1>
            <p className="text-muted">Manage your sales opportunities and track their progress</p>
          </div>
          <OpportunityList />
        </Col>
      </Row>
    </Container>
  );
}