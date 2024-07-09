import { useNavigate } from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import imageSuppliers from '../../assets/img/icon-suppliers.png';
import imageProducts from '../../assets/img/icon-products.png';
import imageRequests from '../../assets/img/icon-requests.png';

const DashboardPage = () => {
  const navigate = useNavigate();

  return (
    <>
      <h1 className='mb-4'>Dashboard</h1>
      <div className="d-flex flex-row flex-wrap justify-content-center gap-4">
        <Card style={{ width: '18rem' }} className="border-0 shadow">
          <Card.Img variant="top" src={imageSuppliers} className="strc-module-icon mx-auto mt-3"/>
          <Card.Body className="d-flex flex-column justify-content-between">
            <div>
              <Card.Title>Proveedores</Card.Title>
              <Card.Text className="mb-3">
                Administra los datos de los proveedores, añade nuevos proveedores y actualiza información existente.
              </Card.Text>
            </div>
            <Button variant="primary" onClick={() => navigate('/suppliers')}>Ir a Proveedores</Button>
          </Card.Body>
        </Card>

        <Card style={{ width: '18rem' }} className="border-0 shadow">
          <Card.Img variant="top" src={imageProducts} className="strc-module-icon mx-auto mt-3"/>
          <Card.Body className="d-flex flex-column justify-content-between">
            <div>
              <Card.Title>Productos</Card.Title>
              <Card.Text className="mb-3">
                Gestiona tu inventario de productos, incluyendo precios, descripciones y más.
              </Card.Text>
            </div>
            <Button variant="primary" onClick={() => navigate('/products')}>Ir a Productos</Button>
          </Card.Body>
        </Card>

        <Card style={{ width: '18rem' }} className="border-0 shadow">
          <Card.Img variant="top" src={imageRequests} className="strc-module-icon mx-auto mt-3"/>
          <Card.Body className="d-flex flex-column justify-content-between">
            <div>
              <Card.Title>Solicitudes de Compra</Card.Title>
              <Card.Text className="mb-3">
                Revisa y maneja las solicitudes de compra, aprueba o rechaza propuestas.
              </Card.Text>
            </div>
            <Button variant="primary" onClick={() => navigate('/requests')}>Ir a Solicitudes</Button>
          </Card.Body>
        </Card>
      </div>
    </>
  );
};

export default DashboardPage;