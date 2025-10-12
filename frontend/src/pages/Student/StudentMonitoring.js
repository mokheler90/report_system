import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Table, Alert, Modal } from 'react-bootstrap';
import api from '../../services/api';

const StudentMonitoring = () => {
  const [attendance, setAttendance] = useState([]);
  const [classes, setClasses] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    class_id: '',
    report_id: '',
    attendance_status: 'present',
    student_notes: ''
  });

  useEffect(() => {
    fetchAttendance();
    fetchClasses();
  }, []);

  const fetchAttendance = async () => {
    try {
      const response = await api.get('/monitoring/my-attendance');
      setAttendance(response.data.data);
    } catch (error) {
      console.error('Error fetching attendance:', error);
    }
  };

  const fetchClasses = async () => {
    try {
      const response = await api.get('/classes/all-classes');
      setClasses(response.data.data);
    } catch (error) {
      console.error('Error fetching classes:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post('/monitoring/attendance', formData);
      setShowModal(false);
      setFormData({
        class_id: '',
        report_id: '',
        attendance_status: 'present',
        student_notes: ''
      });
      fetchAttendance();
    } catch (error) {
      console.error('Error submitting attendance:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <h2>Attendance Monitoring</h2>
            <Button variant="primary" onClick={() => setShowModal(true)}>
              Submit Attendance
            </Button>
          </div>
        </Col>
      </Row>

      <Row>
        <Col>
          <Card>
            <Card.Header>
              <h5 className="mb-0">My Attendance Records</h5>
            </Card.Header>
            <Card.Body>
              {attendance.length > 0 ? (
                <Table responsive>
                  <thead>
                    <tr>
                      <th>Course</th>
                      <th>Class</th>
                      <th>Date</th>
                      <th>Status</th>
                      <th>Notes</th>
                      <th>Submitted</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attendance.map(record => (
                      <tr key={record.id}>
                        <td>{record.course_name}</td>
                        <td>{record.class_name}</td>
                        <td>{new Date(record.date_of_lecture).toLocaleDateString()}</td>
                        <td>
                          <span 
                            className={`badge ${
                              record.attendance_status === 'present' ? 'bg-success' : 
                              record.attendance_status === 'absent' ? 'bg-danger' : 
                              'bg-warning'
                            }`}
                          >
                            {record.attendance_status}
                          </span>
                        </td>
                        <td>{record.student_notes || '-'}</td>
                        <td>{new Date(record.monitored_at).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : (
                <Alert variant="info">
                  No attendance records found.
                </Alert>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Submit Attendance Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Submit Attendance</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Class</Form.Label>
              <Form.Select
                name="class_id"
                value={formData.class_id}
                onChange={(e) => setFormData({...formData, class_id: e.target.value})}
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

            <Form.Group className="mb-3">
              <Form.Label>Attendance Status</Form.Label>
              <Form.Select
                name="attendance_status"
                value={formData.attendance_status}
                onChange={(e) => setFormData({...formData, attendance_status: e.target.value})}
                required
              >
                <option value="present">Present</option>
                <option value="absent">Absent</option>
                <option value="late">Late</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Notes (Optional)</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="student_notes"
                value={formData.student_notes}
                onChange={(e) => setFormData({...formData, student_notes: e.target.value})}
                placeholder="Any additional notes..."
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit Attendance'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
};

export default StudentMonitoring;