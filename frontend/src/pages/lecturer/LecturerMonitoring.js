import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Alert, Badge, Form } from 'react-bootstrap';
import api from '../../services/api';

const LecturerMonitoring = () => {
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const response = await api.get('/classes/my-classes');
      setClasses(response.data.data);
      if (response.data.data.length > 0) {
        setSelectedClass(response.data.data[0].id);
      }
    } catch (error) {
      console.error('Error fetching classes:', error);
    }
  };

  useEffect(() => {
    if (selectedClass) {
      fetchClassAttendance(selectedClass);
    }
  }, [selectedClass]);

  const fetchClassAttendance = async (classId) => {
    setLoading(true);
    try {
      const response = await api.get(`/monitoring/class-attendance/${classId}`);
      setAttendance(response.data.data);
    } catch (error) {
      console.error('Error fetching attendance:', error);
    } finally {
      setLoading(false);
    }
  };

  const getAttendanceStats = () => {
    const total = attendance.length;
    const present = attendance.filter(a => a.attendance_status === 'present').length;
    const absent = attendance.filter(a => a.attendance_status === 'absent').length;
    const late = attendance.filter(a => a.attendance_status === 'late').length;
    
    return { total, present, absent, late };
  };

  const stats = getAttendanceStats();

  return (
    <Container>
      <Row className="mb-4">
        <Col>
          <h2>Class Monitoring</h2>
          <p className="text-muted">View and monitor student attendance</p>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col md={8}>
          <Form.Group>
            <Form.Label>Select Class</Form.Label>
            <Form.Select
              value={selectedClass || ''}
              onChange={(e) => setSelectedClass(e.target.value)}
            >
              {classes.map(classItem => (
                <option key={classItem.id} value={classItem.id}>
                  {classItem.class_name} - {classItem.course_name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>

      {selectedClass && (
        <>
          <Row className="mb-4">
            <Col md={3}>
              <Card className="text-center">
                <Card.Body>
                  <Card.Title>Total</Card.Title>
                  <h3>{stats.total}</h3>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="text-center">
                <Card.Body>
                  <Card.Title>Present</Card.Title>
                  <h3 className="text-success">{stats.present}</h3>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="text-center">
                <Card.Body>
                  <Card.Title>Absent</Card.Title>
                  <h3 className="text-danger">{stats.absent}</h3>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="text-center">
                <Card.Body>
                  <Card.Title>Late</Card.Title>
                  <h3 className="text-warning">{stats.late}</h3>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Row>
            <Col>
              <Card>
                <Card.Header>
                  <h5 className="mb-0">Student Attendance</h5>
                </Card.Header>
                <Card.Body>
                  {loading ? (
                    <div className="text-center"><p>Loading attendance...</p></div>
                  ) : attendance.length > 0 ? (
                    <Table responsive>
                      <thead>
                        <tr>
                          <th>Student Name</th>
                          <th>Email</th>
                          <th>Status</th>
                          <th>Notes</th>
                          <th>Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {attendance.map(record => (
                          <tr key={record.id}>
                            <td>{record.student_name}</td>
                            <td>{record.student_email}</td>
                            <td>
                              <Badge 
                                bg={
                                  record.attendance_status === 'present' ? 'success' :
                                  record.attendance_status === 'absent' ? 'danger' : 'warning'
                                }
                              >
                                {record.attendance_status}
                              </Badge>
                            </td>
                            <td>{record.student_notes || '-'}</td>
                            <td>{new Date(record.monitored_at).toLocaleDateString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  ) : (
                    <Alert variant="info">
                      No attendance records found for this class.
                    </Alert>
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </>
      )}
    </Container>
  );
};

export default LecturerMonitoring;