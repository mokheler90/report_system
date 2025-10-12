import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Alert, Badge } from 'react-bootstrap';
import api from '../../services/api';

const PLMonitoring = () => {
  const [classes, setClasses] = useState([]);
  const [streams, setStreams] = useState([]);
  const [selectedStream, setSelectedStream] = useState('');
  const [streamStats, setStreamStats] = useState({});

  useEffect(() => {
    fetchClasses();
    fetchStreams();
  }, []);

  useEffect(() => {
    if (streams.length > 0) {
      calculateStreamStats();
    }
  }, [classes, streams]);

  const fetchClasses = async () => {
    try {
      const response = await api.get('/classes/all-classes');
      setClasses(response.data.data);
    } catch (error) {
      console.error('Error fetching classes:', error);
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

  const calculateStreamStats = () => {
    const stats = {};
    
    streams.forEach(stream => {
      const streamClasses = classes.filter(c => c.stream_id === stream.id);
      const totalStudents = streamClasses.reduce((sum, c) => sum + (c.total_registered_students || 0), 0);
      
      stats[stream.id] = {
        totalClasses: streamClasses.length,
        totalStudents: totalStudents,
        activeLecturers: [...new Set(streamClasses.map(c => c.lecturer_id))].length
      };
    });

    setStreamStats(stats);
  };

  const getStreamClasses = (streamId) => {
    return classes.filter(c => c.stream_id === streamId);
  };

  return (
    <Container>
      <Row className="mb-4">
        <Col>
          <h2>Program Monitoring</h2>
          <p className="text-muted">Monitor classes and enrollment across all streams</p>
        </Col>
      </Row>

      <Row className="mb-4">
        {streams.map(stream => {
          const stats = streamStats[stream.id] || { totalClasses: 0, totalStudents: 0, activeLecturers: 0 };
          
          return (
            <Col md={6} key={stream.id} className="mb-3">
              <Card>
                <Card.Body>
                  <Card.Title>{stream.stream_name}</Card.Title>
                  <Row className="text-center">
                    <Col>
                      <h5>{stats.totalClasses}</h5>
                      <small className="text-muted">Classes</small>
                    </Col>
                    <Col>
                      <h5>{stats.totalStudents}</h5>
                      <small className="text-muted">Students</small>
                    </Col>
                    <Col>
                      <h5>{stats.activeLecturers}</h5>
                      <small className="text-muted">Lecturers</small>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          );
        })}
      </Row>

      <Row>
        <Col>
          <Card>
            <Card.Header>
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">All Classes</h5>
                <div>
                  <select 
                    className="form-select form-select-sm"
                    value={selectedStream}
                    onChange={(e) => setSelectedStream(e.target.value)}
                  >
                    <option value="">All Streams</option>
                    {streams.map(stream => (
                      <option key={stream.id} value={stream.id}>
                        {stream.stream_name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </Card.Header>
            <Card.Body>
              {classes.length > 0 ? (
                <Table responsive>
                  <thead>
                    <tr>
                      <th>Class Name</th>
                      <th>Course</th>
                      <th>Stream</th>
                      <th>Lecturer</th>
                      <th>Students</th>
                      <th>Schedule</th>
                      <th>Venue</th>
                    </tr>
                  </thead>
                  <tbody>
                    {classes
                      .filter(c => !selectedStream || c.stream_id == selectedStream)
                      .map(classItem => (
                        <tr key={classItem.id}>
                          <td>
                            <strong>{classItem.class_name}</strong>
                          </td>
                          <td>{classItem.course_name}</td>
                          <td>
                            <Badge bg="info">{classItem.stream_name}</Badge>
                          </td>
                          <td>{classItem.lecturer_name}</td>
                          <td className="text-center">
                            <Badge bg="secondary">
                              {classItem.total_registered_students || 0}
                            </Badge>
                          </td>
                          <td>
                            {classItem.schedule_time && (
                              <small>
                                {classItem.schedule_days} {classItem.schedule_time}
                              </small>
                            )}
                          </td>
                          <td>{classItem.venue || 'TBA'}</td>
                        </tr>
                      ))
                    }
                  </tbody>
                </Table>
              ) : (
                <Alert variant="info">
                  No classes found in the system.
                </Alert>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default PLMonitoring;