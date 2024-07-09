import { useNavigate } from "react-router-dom";
import {Button, Form, Col, Row, Image} from 'react-bootstrap';
import Container from 'react-bootstrap/Container';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignInAlt } from '@fortawesome/free-solid-svg-icons';
import { useForm } from 'react-hook-form';
import { fireErrorAlert, fireSuccessAlert } from '../../utils/alerts';
import imagePortal from '../../assets/img/portal-suppliers.png';

import { login } from "../../api/apiClient";

const LoginPage = () => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();
  const navigate = useNavigate();
  const defaultErrorMessage = 'Ha ocurrido un error al autenticarse';

  const onSubmit = async (data) => {
    try {
      const loginData = await login(data.username, data.password);
      localStorage.setItem('authToken', loginData.token);
      fireSuccessAlert('Credenciales correctos. Bienvenido 😊')
      navigate('/dashboard');
    } catch (error) {
      const errorMessage = error.response ? error.response.data : defaultErrorMessage;
      fireErrorAlert(errorMessage)
    }
  };

  return (
    <Container className="p-5">
      <Row className="justify-content-center align-items-center">
        <Col md="6">
          <h1>Portal de Proveedores</h1>
          <div className="strc-login-container shadow rounded">
            <h2>Iniciar sesión</h2>
            <Form onSubmit={handleSubmit(onSubmit)}>
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Usuario</Form.Label>
                <Form.Control type="text" placeholder="admin" {...register('username', { required: 'El nombre de usuario es requerido' })} />
                {errors.username && <div className="text-danger">{errors.username.message}</div>}
              </Form.Group>

              <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>Contraseña</Form.Label>
                <Form.Control type="password" placeholder="********" {...register('password', { required: 'La contraseña es requerida' })}  />
                {errors.password && <div className="text-danger">{errors.password.message}</div>}
              </Form.Group>

              <Button variant="primary" type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Enviando...' : <><FontAwesomeIcon icon={faSignInAlt} /> Ingresar</>}
              </Button>
            </Form>
          </div>
        </Col>
        <Col md="6" className="text-center">
          <Image src={imagePortal} rounded fluid />
        </Col>
      </Row>
      
    </Container>
  )
}

export default LoginPage