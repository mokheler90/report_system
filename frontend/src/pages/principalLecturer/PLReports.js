import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button, Badge, Form, Alert } from 'react-bootstrap';
import api from '../../services/api';

const PLReports = () => {
  const [reports, setReports] = useState([]);
  const [streams, setStreams] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStream, setFilterStream] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  useEffect(() => {
    fetchReports();
    fetchStreams();
  }, []);

  const fetchReports = async () => {
    try {
      const response = await api.get('/reports/stream-reports');
      setReports(response.data.data);
    } catch (error) {
      console.error('Error fetching reports:', error);
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

  const handleApproveReport = async (reportId) => {
    try {
      await api.put(`/reports/${reportId}/approve`);
      fetchReports();
    } catch (error) {
      console.error('Error approving report:', error);
    }
  };

  const handleExportExcel = async () => {
    try {
      const response = await api.get('/excel/export-reports', {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'reports.xlsx');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error exporting Excel:', error);
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

  const filteredReports = reports.filter(report => {
    const matchesSearch = 
      report.course_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.lecturer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.class_name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStream = !filterStream || report.stream_id == filterStream;
    const matchesStatus = !filterStatus || report.report_status === filterStatus;

    return matchesSearch && matchesStream && matchesStatus;
  });

  return (
    <Container>
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <h2>Stream Reports</h2>
            <Button variant="success" onClick={handleExportExcel}>
              Export to Excel
            </Button>
          </div>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col md={4}>
          <Form.Group>
            <Form.Label>Search</Form.Label>
            <Form.Control
              type="text"
              placeholder="Search by course, lecturer, or class..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Form.Group>
        </Col>
        <Col md={4}>
          <Form.Group>
            <Form.Label>Filter by Stream</Form.Label>
            <Form.Select
              value={filterStream}
              onChange={(e) => setFilterStream(e.target.value)}
            >
              <option value="">All Streams</option>
              {streams.map(stream => (
                <option key={stream.id} value={stream.id}>
                  {stream.stream_name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
        <Col md={4}>
          <Form.Group>
            <Form.Label>Filter by Status</Form.Label>
            <Form.Select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="">All Status</option>
              <option value="draft">Draft</option>
              <option value="submitted_to_prl">Submitted to PRL</option>
              <option value="approved">Approved</option>
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>

      <Row>
        <Col>
          <Card>
            <Card.Header>
              <h5 className="mb-0">
                Reports ({filteredReports.length})
              </h5>
            </Card.Header>
            <Card.Body>
              {filteredReports.length > 0 ? (
                <Table responsive>
                  <thead>
                    <tr>
                      <th>Course</th>
                      <th>Lecturer</th>
                      <th>Class</th>
                      <th>Week</th>
                      <th>Date</th>
                      <th>Students</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredReports.map(report => (
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
                          {report.actual_students_present} / {report.total_registered_students}
                        </td>
                        <td>{getStatusBadge(report.report_status)}</td>
                        <td>
                          {report.report_status === 'submitted_to_prl' && (
                            <Button
                              variant="success"
                              size="sm"
                              onClick={() => handleApproveReport(report.id)}
                            >
                              Approve
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : (
                <Alert variant="info">
                  No reports found matching your criteria.
                </Alert>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default PLReports;