import ContactList from '../../src/components/crm/ContactList'; // Remove curly braces
import { Container, Row, Col } from 'react-bootstrap';

export default function ContactsPage() {
  return (
    <Container fluid className="p-4">
      <Row>
        <Col>
          <div className="mb-4">
            <h1 className="h2 mb-2">Contacts</h1>
            <p className="text-muted">Manage your contacts and customer information</p>
          </div>
          <ContactList />
        </Col>
      </Row>
    </Container>
  );
}