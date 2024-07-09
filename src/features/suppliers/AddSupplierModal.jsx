import { useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import PropTypes from 'prop-types';

const AddSupplierModal = ({ show, handleClose, saveSupplier, supplier}) => {
  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm();

  useEffect(() => {
    if (supplier) {
      Object.keys(supplier).forEach(key => {
        setValue(key, supplier[key]);
      });
    }
  }, [supplier, setValue]);

  const onSubmit = async (data) => {
    await saveSupplier(data);
    handleClose();
    reset();
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{supplier ? "Editar Proveedor" : "Añadir Proveedor"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Form.Group className="mb-3">
            <Form.Label>Nombre</Form.Label>
            <Form.Control
              type="text"
              placeholder="Nombre del proveedor"
              {...register('name', { required: 'Este campo es requerido' })}
            />
            {errors.name && <div className="text-danger">{errors.name.message}</div>}
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Dirección</Form.Label>
            <Form.Control
              type="text"
              placeholder="Dirección"
              {...register('address', { required: 'Este campo es requerido' })}
            />
             {errors.address && <div className="text-danger">{errors.address.message}</div>}
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Email"
              {
                ...register('email', { 
                  pattern: { value: /^[^@]+@[^@]+\.[^@]+$/, message: "Email inválido" },
                  required: 'Este campo es requerido' 
                })
              }
            />
            {errors.email && <div className="text-danger">{errors.email.message}</div>}
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Teléfono</Form.Label>
            <Form.Control
              type="text"
              placeholder="Teléfono"
              {...register('phone', { required: 'Este campo es requerido' })}
            />
            {errors.phone && <div className="text-danger">{errors.phone.message}</div>}
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Check
              type="switch"
              id="is_partnership"
              label="Proveedor asociado"
              {...register('is_partnership')}
            />
            {errors.is_partnership && <div className="text-danger">{errors.is_partnership.message}</div>}
          </Form.Group>
          <Button variant="primary" type="submit">
            Guardar
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

AddSupplierModal.propTypes = {
  show: PropTypes.bool.isRequired,
  saveSupplier: PropTypes.func.isRequired,
  handleClose: PropTypes.func.isRequired,
  supplier: PropTypes.object
};

export default AddSupplierModal;
