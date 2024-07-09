import { Container, Nav, Navbar as BootstrapNavbar } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/');
  }

  return (
    <BootstrapNavbar bg="dark" variant="dark" expand="lg">
      <Container>
        <BootstrapNavbar.Brand onClick={() => navigate('/dashboard')}>Portal de Proveedores</BootstrapNavbar.Brand>
        <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" />
        <BootstrapNavbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
              <Nav.Link onClick={() => navigate('/suppliers')}>Proveedores</Nav.Link>
              <Nav.Link onClick={() => navigate('/products')}>Productos</Nav.Link>
              <Nav.Link onClick={() => navigate('/requests')}>Solicitudes de Compra</Nav.Link>
          </Nav>
          <Nav>
            <Nav.Link onClick={handleLogout}>Cerrar sesión <FontAwesomeIcon icon={faSignOutAlt} /></Nav.Link>
          </Nav>
        </BootstrapNavbar.Collapse>
      </Container>
    </BootstrapNavbar>
  );
};

export default Navbar;