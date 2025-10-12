import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Alert, Badge, Button, Modal, Form } from 'react-bootstrap';
import api from '../../services/api';

const PLLecturers = () => {
  const [lecturers, setLecturers] = useState([]);
  const [streams, setStreams] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedStream, setSelectedStream] = useState('');
  const [selectedLecturer, setSelectedLecturer] = useState('');

  useEffect(() => {
    fetchLecturers();
    fetchStreams();
  }, []);

  const fetchLecturers = async () => {
    try {
      // This would need a specific endpoint to get lecturers
      // For now, simulate with empty data
      setLecturers([]);
    } catch (error) {
      console.error('Error fetching lecturers:', error);
    }
  };

  const fetchStreams = async () => {
    try {
      const response = await api.get('/streams');
      setStreams(response.data.data);
    } catch (error) {
      console.error('Error fetching streams:', error);
    }
  };

  const handleAssignPRL = async () => {
    if (!selectedStream || !selectedLecturer) return;

    try {
      await api.put(`/streams/${selectedStream}/assign-prl`, {
        principalLecturerId: selectedLecturer
      });
      setShowModal(false);
      setSelectedStream('');
      setSelectedLecturer('');
      fetchStreams();
    } catch (error) {
      console.error('Error assigning PRL:', error);
    }
  };

  return (
    <Container>
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <h2>Lecturer Management</h2>
            <Button variant="primary" onClick={() => setShowModal(true)}>
              Assign Principal Lecturer
            </Button>
          </div>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col>
          <Card>
            <Card.Header>
              <h5 className="mb-0">Stream Principal Lecturers</h5>
            </Card.Header>
            <Card.Body>
              {streams.length > 0 ? (
                <Table responsive>
                  <thead>
                    <tr>
                      <th>Stream</th>
                      <th>Principal Lecturer</th>
                      <th>Assigned Courses</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {streams.map(stream => (
                      <tr key={stream.id}>
                        <td>
                          <strong>{stream.stream_name}</strong>
                        </td>
                        <td>
                          {stream.principal_lecturer_name ? (
                            <Badge bg="success">{stream.principal_lecturer_name}</Badge>
                          ) : (
                            <Badge bg="warning">Not Assigned</Badge>
                          )}
                        </td>
                        <td>
                          {/* This would show count of courses under this stream */}
                          <Badge bg="info">0 courses</Badge>
                        </td>
                        <td>
                          {stream.principal_lecturer_name ? (
                            <Badge bg="success">Active</Badge>
                          ) : (
                            <Badge bg="secondary">Inactive</Badge>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : (
                <Alert variant="info">
                  No streams found.
                </Alert>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col>
          <Card>
            <Card.Header>
              <h5 className="mb-0">All Lecturers</h5>
            </Card.Header>
            <Card.Body>
              {lecturers.length > 0 ? (
                <Table responsive>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Stream</th>
                      <th>Assigned Classes</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lecturers.map(lecturer => (
                      <tr key={lecturer.id}>
                        <td>{lecturer.full_name}</td>
                        <td>{lecturer.email}</td>
                        <td>
                          <Badge bg="info">
                            {streams.find(s => s.id === lecturer.stream_id)?.stream_name || 'N/A'}
                          </Badge>
                        </td>
                        <td>
                          <Badge bg="secondary">0 classes</Badge>
                        </td>
                        <td>
                          <Badge bg="success">Active</Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : (
                <Alert variant="info">
                  No lecturers found.
                </Alert>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Assign PRL Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Assign Principal Lecturer</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Select Stream</Form.Label>
            <Form.Select
              value={selectedStream}
              onChange={(e) => setSelectedStream(e.target.value)}
            >
              <option value="">Choose a stream...</option>
              {streams.map(stream => (
                <option key={stream.id} value={stream.id}>
                  {stream.stream_name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Select Principal Lecturer</Form.Label>
            <Form.Select
              value={selectedLecturer}
              onChange={(e) => setSelectedLecturer(e.target.value)}
            >
              <option value="">Choose a lecturer...</option>
              {/* This would be populated with actual lecturers */}
              <option value="1">Dr. Example Lecturer</option>
            </Form.Select>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={handleAssignPRL}
            disabled={!selectedStream || !selectedLecturer}
          >
            Assign Principal Lecturer
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default PLLecturers;