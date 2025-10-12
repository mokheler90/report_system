import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Alert, Badge } from 'react-bootstrap';
import api from '../../services/api';

const PLCourses = () => {
  const [courses, setCourses] = useState([]);
  const [streams, setStreams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourses();
    fetchStreams();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await api.get('/courses');
      setCourses(response.data.data);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
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

  const getStreamCourses = (streamId) => {
    return courses.filter(course => course.stream_id === streamId);
  };

  if (loading) {
    return <Container className="text-center mt-5"><p>Loading courses...</p></Container>;
  }

  return (
    <Container>
      <Row className="mb-4">
        <Col>
          <h2>Courses in My Stream</h2>
          <p className="text-muted">View all courses under your academic stream</p>
        </Col>
      </Row>

      {streams.map(stream => {
        const streamCourses = getStreamCourses(stream.id);
        if (streamCourses.length === 0) return null;

        return (
          <Row key={stream.id} className="mb-4">
            <Col>
              <Card>
                <Card.Header>
                  <h5 className="mb-0">
                    {stream.stream_name} 
                    <Badge bg="primary" className="ms-2">
                      {streamCourses.length} courses
                    </Badge>
                  </h5>
                </Card.Header>
                <Card.Body>
                  <Table responsive>
                    <thead>
                      <tr>
                        <th>Course Code</th>
                        <th>Course Name</th>
                        <th>Credits</th>
                        <th>Semester</th>
                        <th>Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      {streamCourses.map(course => (
                        <tr key={course.id}>
                          <td>
                            <strong>{course.course_code}</strong>
                          </td>
                          <td>{course.course_name}</td>
                          <td>{course.credits}</td>
                          <td>Semester {course.semester}</td>
                          <td>
                            <small className="text-muted">
                              {course.description || 'No description available'}
                            </small>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        );
      })}

      {courses.length === 0 && (
        <Alert variant="info">
          No courses found in the system.
        </Alert>
      )}
    </Container>
  );
};

export default PLCourses;