import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Home = () => {
  const user = JSON.parse(localStorage.getItem('user'));

  return (
    <Container>
      <Row className="text-center mb-5">
        <Col>
          <h1 className="display-4 mb-4">LUCT Report System</h1>
          <p className="lead">
            A comprehensive academic reporting and monitoring system for Limkokwing University of Creative Technology
          </p>
        </Col>
      </Row>

      <Row className="mb-5">
        <Col md={6} className="mb-4">
          <Card className="h-100">
            <Card.Body>
              <Card.Title>System Overview</Card.Title>
              <Card.Text>
                This system facilitates seamless communication and reporting between students, 
                lecturers, principal lecturers, and program leaders across four academic streams:
              </Card.Text>
              <ul>
                <li>Information Technology</li>
                <li>Software Engineering</li>
                <li>Information Systems</li>
                <li>Computer Science</li>
              </ul>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={6} className="mb-4">
          <Card className="h-100">
            <Card.Body>
              <Card.Title>Key Features</Card.Title>
              <ul>
                <li>Student Attendance Monitoring</li>
                <li>Academic Report Submission</li>
                <li>Course and Stream Management</li>
                <li>Rating and Feedback System</li>
                <li>Excel Report Generation</li>
                <li>Real-time Notifications</li>
              </ul>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="text-center">
        <Col>
          {!user ? (
            <div>
              <h3 className="mb-4">Get Started</h3>
              <Button as={Link} to="/login" variant="primary" size="lg" className="me-3">
                Login
              </Button>
              <Button as={Link} to="/register" variant="outline-primary" size="lg">
                Register
              </Button>
            </div>
          ) : (
            <div>
              <h3 className="mb-4">Welcome back, {user.full_name}!</h3>
              <Button 
                as={Link} 
                to={`/${user.role}/dashboard`} 
                variant="primary" 
                size="lg"
              >
                Go to Dashboard
              </Button>
            </div>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default Home;