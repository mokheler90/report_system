import React from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const AppNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
      <Container>
        <Navbar.Brand as={Link} to="/">
          LUCT Report System
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link 
              as={Link} 
              to="/" 
              className={isActive('/') ? 'active' : ''}
            >
              Home
            </Nav.Link>
            
            {user && user.role === 'student' && (
              <>
                <Nav.Link as={Link} to="/student/dashboard">Dashboard</Nav.Link>
                <Nav.Link as={Link} to="/student/monitoring">Monitoring</Nav.Link>
                <Nav.Link as={Link} to="/student/rating">Rating</Nav.Link>
              </>
            )}

            {user && user.role === 'lecturer' && (
              <>
                <Nav.Link as={Link} to="/lecturer/dashboard">Dashboard</Nav.Link>
                <Nav.Link as={Link} to="/lecturer/classes">Classes</Nav.Link>
                <Nav.Link as={Link} to="/lecturer/reports">Reports</Nav.Link>
                <Nav.Link as={Link} to="/lecturer/monitoring">Monitoring</Nav.Link>
                <Nav.Link as={Link} to="/lecturer/rating">Rating</Nav.Link>
              </>
            )}

            {user && user.role === 'principal_lecturer' && (
              <>
                <Nav.Link as={Link} to="/principal/dashboard">Dashboard</Nav.Link>
                <Nav.Link as={Link} to="/principal/courses">Courses</Nav.Link>
                <Nav.Link as={Link} to="/principal/reports">Reports</Nav.Link>
                <Nav.Link as={Link} to="/principal/monitoring">Monitoring</Nav.Link>
                <Nav.Link as={Link} to="/principal/rating">Rating</Nav.Link>
              </>
            )}

            {user && user.role === 'program_leader' && (
              <>
                <Nav.Link as={Link} to="/program-leader/dashboard">Dashboard</Nav.Link>
                <Nav.Link as={Link} to="/program-leader/courses">Courses</Nav.Link>
                <Nav.Link as={Link} to="/program-leader/reports">Reports</Nav.Link>
                <Nav.Link as={Link} to="/program-leader/monitoring">Monitoring</Nav.Link>
                <Nav.Link as={Link} to="/program-leader/lecturers">Lecturers</Nav.Link>
              </>
            )}
          </Nav>
          
          <Nav>
            {user ? (
              <>
                <Navbar.Text className="me-3">
                  Welcome, {user.full_name} ({user.role})
                </Navbar.Text>
                <Button variant="outline-light" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button 
                  variant="outline-light" 
                  className="me-2"
                  as={Link}
                  to="/login"
                >
                  Login
                </Button>
                <Button 
                  variant="light"
                  as={Link}
                  to="/register"
                >
                  Register
                </Button>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default AppNavbar;