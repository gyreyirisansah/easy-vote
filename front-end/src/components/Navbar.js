import { Link, useLocation } from "react-router-dom";
import { Navbar, Container, Nav } from "react-bootstrap";

function MyNavbar() {
  
    const location = useLocation();

  if (location.pathname === "/login") {
    return null;

  }else{
    return (
        <Navbar bg="dark" variant="dark">
          <Navbar.Brand as={Link} to="/">
            Easy Vote
          </Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">
              Home
            </Nav.Link>
            <Nav.Link as={Link} to="/vote">
              Vote
            </Nav.Link>
            <Nav.Link as={Link} to="/vote/count">
              Check Results
            </Nav.Link>
          </Nav>
        </Navbar>
      );
  }

 
}

export default MyNavbar;
