import React from 'react';
import { Navbar, Nav, NavDropdown, Container } from 'react-bootstrap';
import './nav.css'; // Custom CSS for handling multi-level dropdown

const MyNavbar: React.FC = () => {
  return (
    <Navbar bg="primary" expand="lg" variant="dark">
      <Container>
        <Navbar.Brand href="#">My Website</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="#">Home</Nav.Link>
            <Nav.Link href="#">About</Nav.Link>

            {/* First Level Dropdown */}
            <NavDropdown title="Services" id="services-dropdown">
              <NavDropdown.Item href="#">Web Design</NavDropdown.Item>
              <NavDropdown.Item href="#">Web Development</NavDropdown.Item>
              <NavDropdown.Item href="#">Web Hosting</NavDropdown.Item>

              {/* Second Level Dropdown (submenu inside Services) */}
              <NavDropdown title="Graphic Design" id="graphic-design-dropdown" drop="end">
                <NavDropdown.Item href="#">Photoshop</NavDropdown.Item>
                <NavDropdown.Item href="#">Pagemaker</NavDropdown.Item>
                <NavDropdown.Item href="#">Adobe Indesign</NavDropdown.Item>
                <NavDropdown.Item href="#">Illustrator</NavDropdown.Item>
              </NavDropdown>
            </NavDropdown>

            <Nav.Link href="#">Blog</Nav.Link>
            <Nav.Link href="#">Contact</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default MyNavbar;
