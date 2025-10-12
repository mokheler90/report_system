import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Table, Alert, Modal, Badge } from 'react-bootstrap';
import api from '../../services/api';

const LecturerReports = () => {
  const [reports, setReports] = useState([]);
  const [courses, setCourses] = useState([]);
  const [classes, setClasses] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    faculty_name: 'Faculty of Information Communication Technology',
    class_name: '',
    week_of_reporting: '',
    date_of_lecture: '',
    course_name: '',
    course_code: '',
    actual_students_present: 0,
    total_registered_students: 0,
    venue: '',
    scheduled_time: '',
    topic_taught: '',
    learning_outcomes: '',
    lecturer_recommendations: '',
    course_id: '',
    class_id: '',
    stream_id: ''
  });

  useEffect(() => {
    fetchReports();
    fetchCourses();
    fetchClasses();
  }, []);

  const fetchReports = async () => {
    try {
      const response = await api.get('/reports/my-reports');
      setReports(response.data.data);
    } catch (error) {
      console.error('Error fetching reports:', error);
    }
  };

  const fetchCourses = async () => {
    try {
      const response = await api.get('/courses');
      setCourses(response.data.data);
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  const fetchClasses = async () => {
    try {
      const response = await api.get('/classes/my-classes');
      setClasses(response.data.data);
    } catch (error) {
      console.error('Error fetching classes:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const selectedCourse = courses.find(c => c.id == formData.course_id);
      const selectedClass = classes.find(c => c.id == formData.class_id);

      const reportData = {
        ...formData,
        course_name: selectedCourse?.course_name || '',
        course_code: selectedCourse?.course_code || '',
        stream_id: selectedClass?.stream_id || ''
      };

      await api.post('/reports', reportData);
      setShowModal(false);
      setFormData({
        faculty_name: 'Faculty of Information Communication Technology',
        class_name: '',
        week_of_reporting: '',
        date_of_lecture: '',
        course_name: '',
        course_code: '',
        actual_students_present: 0,
        total_registered_students: 0,
        venue: '',
        scheduled_time: '',
        topic_taught: '',
        learning_outcomes: '',
        lecturer_recommendations: '',
        course_id: '',
        class_id: '',
        stream_id: ''
      });
      fetchReports();
    } catch (error) {
      console.error('Error creating report:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitToPRL = async (reportId) => {
    try {
      await api.put(`/reports/${reportId}/submit-prl`);
      fetchReports();
    } catch (error) {
      console.error('Error submitting report:', error);
    }
  };

  const getStatusBadge = (status) => {
    const variants = {
      draft: 'warning',
      submitted_to_prl: 'info',
      approved: 'success'
    };
    return <Badge bg={variants[status]}>{status.replace(/_/g, ' ')}</Badge>;
  };

  return (
    <Container>
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <h2>Lecture Reports</h2>
            <Button variant="primary" onClick={() => setShowModal(true)}>
              Create New Report
            </Button>
          </div>
        </Col>
      </Row>

      <Row>
        <Col>
          <Card>
            <Card.Header>
              <h5 className="mb-0">My Reports</h5>
            </Card.Header>
            <Card.Body>
              {reports.length > 0 ? (
                <Table responsive>
                  <thead>
                    <tr>
                      <th>Course</th>
                      <th>Class</th>
                      <th>Week</th>
                      <th>Date</th>
                      <th>Students Present</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reports.map(report => (
                      <tr key={report.id}>
                        <td>
                          <strong>{report.course_name}</strong>
                          <br />
                          <small className="text-muted">{report.course_code}</small>
                        </td>
                        <td>{report.class_name}</td>
                        <td>{report.week_of_reporting}</td>
                        <td>{new Date(report.date_of_lecture).toLocaleDateString()}</td>
                        <td>
                          {report.actual_students_present} / {report.total_registered_students}
                        </td>
                        <td>{getStatusBadge(report.report_status)}</td>
                        <td>
                          {report.report_status === 'draft' && (
                            <Button
                              variant="outline-primary"
                              size="sm"
                              onClick={() => handleSubmitToPRL(report.id)}
                            >
                              Submit to PRL
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : (
                <Alert variant="info">
                  No reports found. <Button variant="link" onClick={() => setShowModal(true)}>Create your first report</Button>
                </Alert>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Create Report Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Create Lecture Report</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Class</Form.Label>
                  <Form.Select
                    name="class_id"
                    value={formData.class_id}
                    onChange={(e) => {
                      const selectedClass = classes.find(c => c.id == e.target.value);
                      setFormData({
                        ...formData,
                        class_id: e.target.value,
                        class_name: selectedClass?.class_name || '',
                        total_registered_students: selectedClass?.total_registered_students || 0
                      });
                    }}
                    required
                  >
                    <option value="">Select Class</option>
                    {classes.map(classItem => (
                      <option key={classItem.id} value={classItem.id}>
                        {classItem.class_name} - {classItem.course_name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Course</Form.Label>
                  <Form.Select
                    name="course_id"
                    value={formData.course_id}
                    onChange={(e) => {
                      const selectedCourse = courses.find(c => c.id == e.target.value);
                      setFormData({
                        ...formData,
                        course_id: e.target.value,
                        course_name: selectedCourse?.course_name || '',
                        course_code: selectedCourse?.course_code || ''
                      });
                    }}
                    required
                  >
                    <option value="">Select Course</option>
                    {courses.map(course => (
                      <option key={course.id} value={course.id}>
                        {course.course_name} ({course.course_code})
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Week of Reporting</Form.Label>
                  <Form.Control
                    type="text"
                    name="week_of_reporting"
                    value={formData.week_of_reporting}
                    onChange={(e) => setFormData({...formData, week_of_reporting: e.target.value})}
                    placeholder="e.g., Week 6"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Date of Lecture</Form.Label>
                  <Form.Control
                    type="date"
                    name="date_of_lecture"
                    value={formData.date_of_lecture}
                    onChange={(e) => setFormData({...formData, date_of_lecture: e.target.value})}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Students Present</Form.Label>
                  <Form.Control
                    type="number"
                    name="actual_students_present"
                    value={formData.actual_students_present}
                    onChange={(e) => setFormData({...formData, actual_students_present: parseInt(e.target.value)})}
                    min="0"
                    max={formData.total_registered_students}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Total Registered Students</Form.Label>
                  <Form.Control
                    type="number"
                    name="total_registered_students"
                    value={formData.total_registered_students}
                    onChange={(e) => setFormData({...formData, total_registered_students: parseInt(e.target.value)})}
                    min="0"
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Venue</Form.Label>
                  <Form.Control
                    type="text"
                    name="venue"
                    value={formData.venue}
                    onChange={(e) => setFormData({...formData, venue: e.target.value})}
                    placeholder="e.g., Room 101"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Scheduled Time</Form.Label>
                  <Form.Control
                    type="time"
                    name="scheduled_time"
                    value={formData.scheduled_time}
                    onChange={(e) => setFormData({...formData, scheduled_time: e.target.value})}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Topic Taught</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                name="topic_taught"
                value={formData.topic_taught}
                onChange={(e) => setFormData({...formData, topic_taught: e.target.value})}
                placeholder="Brief description of the topic covered..."
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Learning Outcomes</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                name="learning_outcomes"
                value={formData.learning_outcomes}
                onChange={(e) => setFormData({...formData, learning_outcomes: e.target.value})}
                placeholder="What students should have learned..."
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Recommendations</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                name="lecturer_recommendations"
                value={formData.lecturer_recommendations}
                onChange={(e) => setFormData({...formData, lecturer_recommendations: e.target.value})}
                placeholder="Any recommendations for improvement..."
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? 'Creating...' : 'Create Report'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
};

export default LecturerReports;