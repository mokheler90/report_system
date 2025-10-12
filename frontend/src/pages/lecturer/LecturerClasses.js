import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Alert, Badge } from 'react-bootstrap';
import api from '../../services/api';

const LecturerClasses = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const response = await api.get('/classes/my-classes');
      setClasses(response.data.data);
    } catch (error) {
      console.error('Error fetching classes:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Container className="text-center mt-5"><p>Loading classes...</p></Container>;
  }

  return (
    <Container>
      <Row className="mb-4">
        <Col>
          <h2>My Classes</h2>
          <p className="text-muted">Manage your assigned classes and view schedules</p>
        </Col>
      </Row>

      <Row>
        <Col>
          <Card>
            <Card.Header>
              <h5 className="mb-0">Class Assignments</h5>
            </Card.Header>
            <Card.Body>
              {classes.length > 0 ? (
                <Table responsive>
                  <thead>
                    <tr>
                      <th>Class Name</th>
                      <th>Course</th>
                      <th>Stream</th>
                      <th>Schedule</th>
                      <th>Venue</th>
                      <th>Registered Students</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {classes.map(classItem => (
                      <tr key={classItem.id}>
                        <td>
                          <strong>{classItem.class_name}</strong>
                        </td>
                        <td>{classItem.course_name}</td>
                        <td>
                          <Badge bg="info">{classItem.stream_name}</Badge>
                        </td>
                        <td>
                          {classItem.schedule_days && (
                            <div>
                              <small>{classItem.schedule_days}</small>
                              <br />
                              <small>{classItem.schedule_time}</small>
                            </div>
                          )}
                        </td>
                        <td>{classItem.venue || 'TBA'}</td>
                        <td className="text-center">
                          <Badge bg="secondary">
                            {classItem.total_registered_students || 0}
                          </Badge>
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
                  No classes assigned to you yet.
                </Alert>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default LecturerClasses;