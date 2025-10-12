import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Table, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const StudentDashboard = () => {
  const [stats, setStats] = useState({});
  const [recentAttendance, setRecentAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [attendanceRes] = await Promise.all([
        api.get('/monitoring/my-attendance')
      ]);

      const attendance = attendanceRes.data.data || [];
      
      const presentCount = attendance.filter(a => a.attendance_status === 'present').length;
      const totalCount = attendance.length;
      const attendanceRate = totalCount > 0 ? (presentCount / totalCount * 100).toFixed(1) : 0;

      setStats({
        totalClasses: totalCount,
        presentClasses: presentCount,
        attendanceRate: attendanceRate
      });

      setRecentAttendance(attendance.slice(0, 5));
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  if (loading) {
    return <Container className="text-center mt-5"><p>Loading...</p></Container>;
  }

  return (
    <Container>
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <h2>Student Dashboard</h2>
            <Button variant="outline-danger" onClick={handleLogout}>
              Logout
            </Button>
          </div>
          <p className="text-muted">Welcome, {user?.full_name}</p>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col md={4}>
          <Card className="text-center">
            <Card.Body>
              <Card.Title>Total Classes</Card.Title>
              <h3>{stats.totalClasses}</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="text-center">
            <Card.Body>
              <Card.Title>Present</Card.Title>
              <h3 className="text-success">{stats.presentClasses}</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="text-center">
            <Card.Body>
              <Card.Title>Attendance Rate</Card.Title>
              <h3 className="text-info">{stats.attendanceRate}%</h3>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col>
          <Card>
            <Card.Header>
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Recent Attendance</h5>
                <Button 
                  variant="primary" 
                  size="sm"
                  onClick={() => navigate('/student/monitoring')}
                >
                  View All
                </Button>
              </div>
            </Card.Header>
            <Card.Body>
              {recentAttendance.length > 0 ? (
                <Table responsive>
                  <thead>
                    <tr>
                      <th>Course</th>
                      <th>Class</th>
                      <th>Date</th>
                      <th>Status</th>
                      <th>Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentAttendance.map(record => (
                      <tr key={record.id}>
                        <td>{record.course_name}</td>
                        <td>{record.class_name}</td>
                        <td>{new Date(record.monitored_at).toLocaleDateString()}</td>
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
    </Container>
  );
};

export default StudentDashboard;