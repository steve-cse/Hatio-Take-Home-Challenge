import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';

import { Link as RouterLink, useNavigate } from "react-router-dom"; 
import { useAuth } from "../contexts/AuthContext";
import Button from 'react-bootstrap/Button';
function NavigationBar() {
  const { session, user, signOut } = useAuth();
  
  return (
    <Navbar expand="lg" className="bg-body-tertiary">
      <Container>
        <Navbar.Brand >Hatio Take Home Challenge</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
          <Nav.Link as={RouterLink} to="/home" >Home</Nav.Link>
          
          <Nav.Link as={RouterLink} to="/about" >About</Nav.Link>

          </Nav>
          <Nav.Item style={{margin:"5px"}}>
          Signed in as: { user.email}
         </Nav.Item>
       
         <Nav.Item>
                <Button onClick={() => { signOut(); }}>Log Out</Button>
              </Nav.Item>
            
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavigationBar;