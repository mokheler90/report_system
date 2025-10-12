import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Table, Alert, Modal } from 'react-bootstrap';
import api from '../../services/api';

const PLCourses = () => {
  const [courses, setCourses] = useState([]);
  const [streams, setStreams] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    course_code: '',
    course_name: '',
    description: '',
    stream_id: '',
    credits: 3,
    semester: 1
  });

  useEffect(() => {
    fetchCourses();
    fetchStreams();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await api.get('/courses');
      setCourses(response.data.data);
    } catch (error) {
      console.error('Error fetching courses:', error);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post('/courses', formData);
      setShowModal(false);
      setFormData({
        course_code: '',
        course_name: '',
        description: '',
        stream_id: '',
        credits: 3,
        semester: 1
      });
      fetchCourses();
    } catch (error) {
      console.error('Error creating course:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <h2>Course Management</h2>
            <Button variant="primary" onClick={() => setShowModal(true)}>
              Add New Course
            </Button>
          </div>
        </Col>
      </Row>

      <Row>
        <Col>
          <Card>
            <Card.Header>
              <h5 className="mb-0">All Courses</h5>
            </Card.Header>
            <Card.Body>
              {courses.length > 0 ? (
                <Table responsive>
                  <thead>
                    <tr>
                      <th>Course Code</th>
                      <th>Course Name</th>
                      <th>Stream</th>
                      <th>Credits</th>
                      <th>Semester</th>
                      <th>Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {courses.map(course => (
                      <tr key={course.id}>
                        <td>
                          <strong>{course.course_code}</strong>
                        </td>
                        <td>{course.course_name}</td>
                        <td>{course.stream_name}</td>
                        <td>{course.credits}</td>
                        <td>Semester {course.semester}</td>
                        <td>
                          <small className="text-muted">
                            {course.description || 'No description'}
                          </small>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : (
                <Alert variant="info">
                  No courses found. Create the first course to get started.
                </Alert>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Add Course Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Course</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Course Code</Form.Label>
              <Form.Control
                type="text"
                name="course_code"
                value={formData.course_code}
                onChange={(e) => setFormData({...formData, course_code: e.target.value})}
                placeholder="e.g., IT101"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Course Name</Form.Label>
              <Form.Control
                type="text"
                name="course_name"
                value={formData.course_name}
                onChange={(e) => setFormData({...formData, course_name: e.target.value})}
                placeholder="e.g., Introduction to IT"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Stream</Form.Label>
              <Form.Select
                name="stream_id"
                value={formData.stream_id}
                onChange={(e) => setFormData({...formData, stream_id: e.target.value})}
                required
              >
                <option value="">Select Stream</option>
                {streams.map(stream => (
                  <option key={stream.id} value={stream.id}>
                    {stream.stream_name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Credits</Form.Label>
                  <Form.Control
                    type="number"
                    name="credits"
                    value={formData.credits}
                    onChange={(e) => setFormData({...formData, credits: parseInt(e.target.value)})}
                    min="1"
                    max="10"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Semester</Form.Label>
                  <Form.Control
                    type="number"
                    name="semester"
                    value={formData.semester}
                    onChange={(e) => setFormData({...formData, semester: parseInt(e.target.value)})}
                    min="1"
                    max="8"
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Course description and objectives..."
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? 'Creating...' : 'Create Course'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
};

export default PLCourses;