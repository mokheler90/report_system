import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Table, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const PLDashboard = () => {
  const [stats, setStats] = useState({});
  const [pendingReports, setPendingReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [reportsRes] = await Promise.all([
        api.get('/reports/stream-reports')
      ]);

      const reports = reportsRes.data.data || [];
      const pending = reports.filter(r => r.report_status === 'submitted_to_prl');
      
      setStats({
        totalReports: reports.length,
        pendingApproval: pending.length,
        approvedReports: reports.filter(r => r.report_status === 'approved').length
      });

      setPendingReports(pending.slice(0, 5));
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

  const handleApproveReport = async (reportId) => {
    try {
      await api.put(`/reports/${reportId}/approve`);
      fetchDashboardData();
    } catch (error) {
      console.error('Error approving report:', error);
    }
  };

  if (loading) {
    return <Container className="text-center mt-5"><p>Loading...</p></Container>;
  }

  return (
    <Container>
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <h2>Principal Lecturer Dashboard</h2>
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
              <Card.Title>Pending Approval</Card.Title>
              <h3 className="text-warning">{stats.pendingApproval}</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="text-center">
            <Card.Body>
              <Card.Title>Approved</Card.Title>
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
                <h5 className="mb-0">Reports Pending Approval</h5>
                <Button 
                  variant="primary" 
                  size="sm"
                  onClick={() => navigate('/principal/reports')}
                >
                  View All
                </Button>
              </div>
            </Card.Header>
            <Card.Body>
              {pendingReports.length > 0 ? (
                <Table responsive>
                  <thead>
                    <tr>
                      <th>Course</th>
                      <th>Lecturer</th>
                      <th>Class</th>
                      <th>Week</th>
                      <th>Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingReports.map(report => (
                      <tr key={report.id}>
                        <td>
                          <strong>{report.course_name}</strong>
                          <br />
                          <small className="text-muted">{report.course_code}</small>
                        </td>
                        <td>{report.lecturer_name}</td>
                        <td>{report.class_name}</td>
                        <td>{report.week_of_reporting}</td>
                        <td>{new Date(report.date_of_lecture).toLocaleDateString()}</td>
                        <td>
                          <Button
                            variant="success"
                            size="sm"
                            onClick={() => handleApproveReport(report.id)}
                          >
                            Approve
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : (
                <Alert variant="success">
                  No reports pending approval.
                </Alert>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default PLDashboard;