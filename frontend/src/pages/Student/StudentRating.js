import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Table, Alert } from 'react-bootstrap';
import api from '../../services/api';

const StudentRating = () => {
  const [ratings, setRatings] = useState([]);
  const [courses, setCourses] = useState([]);
  const [formData, setFormData] = useState({
    rated_entity_type: 'course',
    rated_entity_id: '',
    rating_value: 5,
    review_text: ''
  });

  useEffect(() => {
    fetchCourses();
    fetchMyRatings();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await api.get('/courses');
      setCourses(response.data.data);
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  const fetchMyRatings = async () => {
    try {
      // This would need a new endpoint to get user's ratings
      // For now, we'll simulate with empty array
      setRatings([]);
    } catch (error) {
      console.error('Error fetching ratings:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await api.post('/ratings', formData);
      setFormData({
        rated_entity_type: 'course',
        rated_entity_id: '',
        rating_value: 5,
        review_text: ''
      });
      fetchMyRatings();
    } catch (error) {
      console.error('Error submitting rating:', error);
    }
  };

  return (
    <Container>
      <Row className="mb-4">
        <Col>
          <h2>Course Rating</h2>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col md={6}>
          <Card>
            <Card.Header>
              <h5 className="mb-0">Submit Rating</h5>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Course</Form.Label>
                  <Form.Select
                    name="rated_entity_id"
                    value={formData.rated_entity_id}
                    onChange={(e) => setFormData({...formData, rated_entity_id: e.target.value})}
                    required
                  >
                    <option value="">Select Course</option>
                    {courses.map(course => (
                      <option key={course.id} value={course.id}>
                        {course.course_name} ({course.course_code})
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Rating</Form.Label>
                  <Form.Select
                    name="rating_value"
                    value={formData.rating_value}
                    onChange={(e) => setFormData({...formData, rating_value: parseInt(e.target.value)})}
                    required
                  >
                    <option value={5}>5 Stars - Excellent</option>
                    <option value={4}>4 Stars - Very Good</option>
                    <option value={3}>3 Stars - Good</option>
                    <option value={2}>2 Stars - Fair</option>
                    <option value={1}>1 Star - Poor</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Review (Optional)</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="review_text"
                    value={formData.review_text}
                    onChange={(e) => setFormData({...formData, review_text: e.target.value})}
                    placeholder="Share your experience with this course..."
                  />
                </Form.Group>

                <Button variant="primary" type="submit" className="w-100">
                  Submit Rating
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card>
            <Card.Header>
              <h5 className="mb-0">My Ratings</h5>
            </Card.Header>
            <Card.Body>
              {ratings.length > 0 ? (
                <Table responsive>
                  <thead>
                    <tr>
                      <th>Course</th>
                      <th>Rating</th>
                      <th>Review</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ratings.map(rating => (
                      <tr key={rating.id}>
                        <td>{rating.course_name}</td>
                        <td>
                          {Array.from({length: rating.rating_value}, (_, i) => (
                            <span key={i}>⭐</span>
                          ))}
                        </td>
                        <td>{rating.review_text || '-'}</td>
                        <td>{new Date(rating.created_at).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : (
                <Alert variant="info">
                  No ratings submitted yet.
                </Alert>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default StudentRating;