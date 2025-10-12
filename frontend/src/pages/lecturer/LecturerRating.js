import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Alert } from 'react-bootstrap';
import api from '../../services/api';

const LecturerRating = () => {
  const [ratings, setRatings] = useState([]);
  const [averageRating, setAverageRating] = useState(0);

  useEffect(() => {
    fetchRatings();
  }, []);

  const fetchRatings = async () => {
    try {
      // This would need a specific endpoint for lecturer ratings
      // For now, we'll simulate with empty data
      setRatings([]);
      setAverageRating(4.2); // Simulated average
    } catch (error) {
      console.error('Error fetching ratings:', error);
    }
  };

  return (
    <Container>
      <Row className="mb-4">
        <Col>
          <h2>My Ratings</h2>
          <p className="text-muted">View ratings and feedback from students</p>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col md={6}>
          <Card className="text-center">
            <Card.Body>
              <Card.Title>Average Rating</Card.Title>
              <h1 className="text-warning">{averageRating.toFixed(1)}</h1>
              <div>
                {Array.from({length: 5}, (_, i) => (
                  <span key={i} className="fs-4">
                    {i < Math.floor(averageRating) ? '⭐' : '☆'}
                  </span>
                ))}
              </div>
              <p className="text-muted mt-2">Based on {ratings.length} ratings</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card>
            <Card.Body>
              <Card.Title>Rating Distribution</Card.Title>
              <div className="text-center">
                <p className="text-muted">Rating distribution chart would appear here</p>
                <small>This would show breakdown of 1-5 star ratings</small>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col>
          <Card>
            <Card.Header>
              <h5 className="mb-0">Recent Reviews</h5>
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
                        <td>{rating.review_text || 'No review text'}</td>
                        <td>{new Date(rating.created_at).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : (
                <Alert variant="info">
                  No ratings received yet.
                </Alert>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default LecturerRating;