import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Table, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const LecturerDashboard = () => {
  const [stats, setStats] = useState({});
  const [recentReports, setRecentReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [reportsRes] = await Promise.all([
        api.get('/reports/my-reports')
      ]);

      const reports = reportsRes.data.data || [];
      
      setStats({
        totalReports: reports.length,
        pendingReports: reports.filter(r => r.report_status === 'draft').length,
        submittedReports: reports.filter(r => r.report_status === 'submitted_to_prl').length
      });

      setRecentReports(reports.slice(0, 5));
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
            <h2>Lecturer Dashboard</h2>
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
              <Card.Title>Total Reports</Card.Title>
              <h3>{stats.totalReports}</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="text-center">
            <Card.Body>
              <Card.Title>Pending</Card.Title>
              <h3 className="text-warning">{stats.pendingReports}</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="text-center">
            <Card.Body>
              <Card.Title>Submitted</Card.Title>
              <h3 className="text-success">{stats.submittedReports}</h3>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col>
          <Card>
            <Card.Header>
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Recent Reports</h5>
                <Button 
                  variant="primary" 
                  size="sm"
                  onClick={() => navigate('/lecturer/reports')}
                >
                  View All
                </Button>
              </div>
            </Card.Header>
            <Card.Body>
              {recentReports.length > 0 ? (
                <Table responsive>
                  <thead>
                    <tr>
                      <th>Course</th>
                      <th>Class</th>
                      <th>Week</th>
                      <th>Status</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentReports.map(report => (
                      <tr key={report.id}>
                        <td>{report.course_name}</td>
                        <td>{report.class_name}</td>
                        <td>{report.week_of_reporting}</td>
                        <td>
                          <span 
                            className={`badge ${
                              report.report_status === 'draft' ? 'bg-warning' : 
                              report.report_status === 'submitted_to_prl' ? 'bg-info' : 
                              'bg-success'
                            }`}
                          >
                            {report.report_status}
                          </span>
                        </td>
                        <td>{new Date(report.date_of_lecture).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : (
                <Alert variant="info">
                  No reports found. <Button variant="link" onClick={() => navigate('/lecturer/reports')}>Create your first report</Button>
                </Alert>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default LecturerDashboard;