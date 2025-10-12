import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Alert } from 'react-bootstrap';
import api from '../../services/api';

const PLRating = () => {
  const [ratings, setRatings] = useState([]);
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    fetchCourses();
    fetchRatings();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await api.get('/courses');
      setCourses(response.data.data);
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  const fetchRatings = async () => {
    try {
      // This would need specific endpoint for stream ratings
      // For now, simulate with empty data
      setRatings([]);
    } catch (error) {
      console.error('Error fetching ratings:', error);
    }
  };

  const getCourseRatings = (courseId) => {
    // This would filter ratings by course
    return [];
  };

  return (
    <Container>
      <Row className="mb-4">
        <Col>
          <h2>Stream Ratings</h2>
          <p className="text-muted">View ratings for courses in your stream</p>
        </Col>
      </Row>

      {courses.map(course => {
        const courseRatings = getCourseRatings(course.id);
        const averageRating = courseRatings.length > 0 
          ? courseRatings.reduce((sum, r) => sum + r.rating_value, 0) / courseRatings.length
          : 0;

        if (courseRatings.length === 0) return null;

        return (
          <Row key={course.id} className="mb-4">
            <Col>
              <Card>
                <Card.Header>
                  <div className="d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">
                      {course.course_name} ({course.course_code})
                    </h5>
                    <div>
                      <span className="text-warning fs-5">
                        {averageRating.toFixed(1)} ⭐
                      </span>
                      <small className="text-muted ms-2">
                        ({courseRatings.length} ratings)
                      </small>
                    </div>
                  </div>
                </Card.Header>
                <Card.Body>
                  {courseRatings.length > 0 ? (
                    <Table responsive>
                      <thead>
                        <tr>
                          <th>Rating</th>
                          <th>Review</th>
                          <th>Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {courseRatings.map(rating => (
                          <tr key={rating.id}>
                            <td>
                              {Array.from({length: rating.rating_value}, (_, i) => (
                                <span key={i}>⭐</span>
                              ))}
                            </td>
                            <td>{rating.review_text || 'No review text'}</td>
                            <td>{new Date(rating.created_at).toLocaleDateString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  ) : (
                    <Alert variant="info">
                      No ratings available for this course.
                    </Alert>
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>
        );
      })}

      {courses.filter(c => getCourseRatings(c.id).length > 0).length === 0 && (
        <Alert variant="info">
          No ratings available for courses in your stream.
        </Alert>
      )}
    </Container>
  );
};

export default PLRating;