import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Table, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const ProgramLeaderDashboard = () => {
  const [stats, setStats] = useState({});
  const [recentCourses, setRecentCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [coursesRes, reportsRes] = await Promise.all([
        api.get('/courses'),
        api.get('/reports/all-reports')
      ]);

      const courses = coursesRes.data.data || [];
      const reports = reportsRes.data.data || [];
      
      setStats({
        totalCourses: courses.length,
        totalReports: reports.length,
        approvedReports: reports.filter(r => r.report_status === 'approved').length
      });

      setRecentCourses(courses.slice(0, 5));
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
            <h2>Program Leader Dashboard</h2>
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
              <Card.Title>Total Courses</Card.Title>
              <h3>{stats.totalCourses}</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="text-center">
            <Card.Body>
              <Card.Title>Total Reports</Card.Title>
              <h3>{stats.totalReports}</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="text-center">
            <Card.Body>
              <Card.Title>Approved Reports</Card.Title>
              <h3 className="text-success">{stats.approvedReports}</h3>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col>
          <Card>
            <Card.Header>
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Recent Courses</h5>
                <Button 
                  variant="primary" 
                  size="sm"
                  onClick={() => navigate('/program-leader/courses')}
                >
                  View All
                </Button>
              </div>
            </Card.Header>
            <Card.Body>
              {recentCourses.length > 0 ? (
                <Table responsive>
                  <thead>
                    <tr>
                      <th>Course Code</th>
                      <th>Course Name</th>
                      <th>Stream</th>
                      <th>Credits</th>
                      <th>Semester</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentCourses.map(course => (
                      <tr key={course.id}>
                        <td>
                          <strong>{course.course_code}</strong>
                        </td>
                        <td>{course.course_name}</td>
                        <td>{course.stream_name}</td>
                        <td>{course.credits}</td>
                        <td>Semester {course.semester}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : (
                <Alert variant="info">
                  No courses found. <Button variant="link" onClick={() => navigate('/program-leader/courses')}>Create the first course</Button>
                </Alert>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ProgramLeaderDashboard;