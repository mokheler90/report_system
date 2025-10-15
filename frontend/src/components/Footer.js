import React from 'react';
import { Container } from 'react-bootstrap';

const Footer = () => {
  return (
    <footer className="bg-dark text-light py-4 mt-5">
      <Container>
        <div className="text-center">
          <p className="mb-0">
            &copy; 2025 LUCT Report System. All rights reserved.
          </p>
          <p className="mb-0">
            Faculty of Information Communication Technology
          </p>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;