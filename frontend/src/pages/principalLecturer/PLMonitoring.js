import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Alert, Badge } from 'react-bootstrap';
import api from '../../services/api';

const PLMonitoring = () => {
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [attendance, setAttendance] = useState([]);

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const response = await api.get('/classes/all-classes');
      setClasses(response.data.data);
    } catch (error) {
      console.error('Error fetching classes:', error);
    }
  };

  const fetchClassAttendance = async (classId) => {
    try {
      const response = await api.get(`/monitoring/class-attendance/${classId}`);
      setAttendance(response.data.data);
    } catch (error) {
      console.error('Error fetching attendance:', error);
    }
  };

  const handleClassChange = (classId) => {
    setSelectedClass(classId);
    if (classId) {
      fetchClassAttendance(classId);
    }
  };

  const getAttendanceStats = () => {
    const total = attendance.length;
    const present = attendance.filter(a => a.attendance_status === 'present').length;
    const attendanceRate = total > 0 ? (present / total * 100).toFixed(1) : 0;
    
    return { total, present, attendanceRate };
  };

  const stats = getAttendanceStats();

  return (
    <Container>
      <Row className="mb-4">
        <Col>
          <h2>Stream Monitoring</h2>
          <p className="text-muted">Monitor attendance across all classes in your stream</p>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col md={6}>
          <Card>
            <Card.Body>
              <Card.Title>Select Class</Card.Title>
              <select 
                className="form-select"
                value={selectedClass || ''}
                onChange={(e) => handleClassChange(e.target.value)}
              >
                <option value="">Choose a class...</option>
                {classes.map(classItem => (
                  <option key={classItem.id} value={classItem.id}>
                    {classItem.class_name} - {classItem.course_name} ({classItem.stream_name})
                  </option>
                ))}
              </select>
            </Card.Body>
          </Card>
        </Col>
        
        {selectedClass && (
          <Col md={6}>
            <Card className="text-center">
              <Card.Body>
                <Card.Title>Attendance Overview</Card.Title>
                <Row>
                  <Col>
                    <h4>{stats.total}</h4>
                    <small className="text-muted">Total Records</small>
                  </Col>
                  <Col>
                    <h4 className="text-success">{stats.present}</h4>
                    <small className="text-muted">Present</small>
                  </Col>
                  <Col>
                    <h4 className="text-info">{stats.attendanceRate}%</h4>
                    <small className="text-muted">Attendance Rate</small>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        )}
      </Row>

      {selectedClass && (
        <Row>
          <Col>
            <Card>
              <Card.Header>
                <h5 className="mb-0">Class Attendance Details</h5>
              </Card.Header>
              <Card.Body>
                {attendance.length > 0 ? (
                  <Table responsive>
                    <thead>
                      <tr>
                        <th>Student Name</th>
                        <th>Status</th>
                        <th>Notes</th>
                        <th>Date Recorded</th>
                      </tr>
                    </thead>
                    <tbody>
                      {attendance.map(record => (
                        <tr key={record.id}>
                          <td>{record.student_name}</td>
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
      )}
    </Container>
  );
};

export default PLMonitoring;